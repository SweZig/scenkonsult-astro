// netlify/functions/scheduled-pickup-reminder.js
// Skickar förberedelse-länken kl 19:00 svensk tid till kunder vars utlämning är
// IMORGON. SMS-FÖRST: 46elks om customer_phone finns, mail som fallback.
// Sätter pickup_short_token (kort URL-token för SMS) och prepared_via.
// DST-säkrad genom att cron körs två gånger (UTC 17 + 18) — funktionen
// avbryter snabbt om Stockholm-timmen inte är 19, så bara en av körningarna
// triggar skarpt utskick. Funktionen är idempotent via pickup_reminder_sent_at.
'use strict';

const { schedule } = require('@netlify/functions');
const { supabase, sendEmail, logAudit, MAIL_FROM } = require('./_lib');
const { buildPickupReminderEmail } = require('./_pickup-reminder-mail');
const { ensureShortToken } = require('./_short-token');
const { getPickupSms } = require('./_pickup-sms');
const { sendSms } = require('./_sms');

// Cron i UTC. Båda triggas, men bara en kör skarpt — den andra exitar snabbt.
//   sommartid (CEST = UTC+2): 17:00 UTC = 19:00 SE  → kör skarpt
//                              18:00 UTC = 20:00 SE  → exit
//   vintertid (CET  = UTC+1): 17:00 UTC = 18:00 SE  → exit
//                              18:00 UTC = 19:00 SE  → kör skarpt
const SCHEDULE = '0 17,18 * * *';

// Hämta nuvarande timme i Stockholm (0–23)
function stockholmHour() {
  const s = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Stockholm',
    hour: 'numeric',
    hour12: false,
  });
  const m = String(s).match(/\d+/);
  return m ? parseInt(m[0], 10) : -1;
}

// Hämta morgondagens datum i Stockholm-tid som YYYY-MM-DD
function tomorrowSE() {
  const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
  const [y, mo, d] = todayStr.split('-').map(Number);
  // Använd 12:00 UTC som "ankarpunkt" — säkert förbi DST-skiften
  const utcAnchor = Date.UTC(y, mo - 1, d, 12, 0, 0);
  const tomorrowDate = new Date(utcAnchor + 24 * 60 * 60 * 1000);
  return tomorrowDate.toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
}

const pickupReminderHandler = async () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('SCHEDULED_PICKUP: RESEND_API_KEY saknas');
    return { statusCode: 500, body: 'Ej konfigurerad' };
  }

  // DST-skydd: körning sker bara om Stockholm-timmen är 19
  const hour = stockholmHour();
  if (hour !== 19) {
    console.log(`SCHEDULED_PICKUP: Skippas — Stockholm-timme ${hour}, väntar 19`);
    return { statusCode: 200, body: `Skipped (hour=${hour})` };
  }

  const db = supabase();
  const tomorrow = tomorrowSE();
  console.log('SCHEDULED_PICKUP: Letar utlämningar för imorgon', tomorrow);

  let candidates;
  try {
    const { data, error } = await db.from('carts')
      .select('id, customer_name, customer_email, customer_phone, cart_token, event_date, event_location, items, status, delivery_time, pickup_reminder_sent_at, customer_company, delivery_mode, pickup_short_token, prepared_via')
      .eq('event_date', tomorrow);
    if (error) throw error;
    candidates = data || [];
  } catch (e) {
    console.error('SCHEDULED_PICKUP: DB-fel:', e.message);
    return { statusCode: 500, body: 'DB-fel' };
  }

  const ALLOWED = new Set(['confirmed', 'fakturerad', 'completed']);
  const tomorrows = candidates.filter(c => ALLOWED.has(c.status));

  console.log(`SCHEDULED_PICKUP: ${tomorrows.length} utlämningar imorgon`);

  const results = {
    sent_sms:              0,
    sent_email:            0,
    sent_email_after_sms:  0,
    skipped_already_sent:  0,
    skipped_no_channel:    0,
    errors:                [],
  };

  for (const cart of tomorrows) {
    if (cart.pickup_reminder_sent_at) {
      results.skipped_already_sent++;
      continue;
    }
    if (!cart.customer_email && !cart.customer_phone) {
      results.skipped_no_channel++;
      console.warn('SCHEDULED_PICKUP: Saknar både email och telefon för', cart.id);
      continue;
    }

    try {
      // Säkerställ att carten har en kort URL-token (skapar ny om saknas)
      const shortToken = await ensureShortToken(db, cart);
      cart.pickup_short_token = shortToken; // för mailmallens URL-byggande

      let smsSent = false;
      let emailSent = false;
      let preparedVia = null;

      // ── 1. Försök SMS först om mobilnummer finns ─────────────────────────
      if (cart.customer_phone) {
        const message = getPickupSms(cart, shortToken);
        const smsRes = await sendSms(cart.customer_phone, message);
        if (smsRes.ok) {
          smsSent = true;
          preparedVia = 'sms';
          results.sent_sms++;
          console.log(`SCHEDULED_PICKUP: ✅ SMS till ${cart.customer_phone} för ${cart.id} (id=${smsRes.smsId})`);
          await logAudit(db, cart.id, 'system', 'pickup_reminder_sms', {
            to: cart.customer_phone, sms_id: smsRes.smsId, scheduled: true, for_date: tomorrow,
          });
        } else {
          console.warn(`SCHEDULED_PICKUP: ⚠️ SMS misslyckades för ${cart.id}: ${smsRes.error} — försöker mail`);
        }
      }

      // ── 2. Skicka mail om SMS misslyckades ELLER om SMS inte ens försöktes
      //       (ingen telefon). Mail är vår fallback.
      if (!smsSent && cart.customer_email) {
        const { html, text, subject } = buildPickupReminderEmail(cart);
        await sendEmail(apiKey, {
          from:     MAIL_FROM,
          to:       cart.customer_email,
          subject,
          html,
          text,
          reply_to: 'info@scenkonsult.se',
        });
        emailSent = true;
        preparedVia = 'email';
        if (cart.customer_phone) {
          results.sent_email_after_sms++; // SMS försöktes men misslyckades
        } else {
          results.sent_email++;
        }
        console.log('SCHEDULED_PICKUP: ✅ Mail till', cart.customer_email, 'för', cart.id);
        await logAudit(db, cart.id, 'system', 'pickup_reminder_email', {
          to: cart.customer_email, scheduled: true, for_date: tomorrow, fallback_after_sms: !!cart.customer_phone,
        });
        await new Promise(r => setTimeout(r, 600)); // Resend rate limit
      }

      if (smsSent || emailSent) {
        await db.update('carts', {
          pickup_reminder_sent_at: new Date().toISOString(),
          prepared_via:            preparedVia,
        }, 'id', cart.id);
      } else {
        // Varken SMS eller mail lyckades skickas
        results.errors.push({ cart_id: cart.id, error: 'Inget av SMS/mail lyckades' });
      }
    } catch (e) {
      console.error('SCHEDULED_PICKUP: Fel för', cart.id, e.message);
      results.errors.push({ cart_id: cart.id, error: e.message });
    }
  }

  console.log('SCHEDULED_PICKUP_RESULT:', JSON.stringify(results));
  return { statusCode: 200, body: JSON.stringify(results) };
};

// schedule()-wrapper från @netlify/functions registrerar cron-schemat
// pålitligt vid build. Tidigare 'exports.config = { schedule: ... }' fångades
// inte av Netlify-bundlern i ett "type":"module"-paket, så funktionen
// deployades som vanlig HTTP-function utan cron-trigger.
exports.handler = schedule(SCHEDULE, pickupReminderHandler);
