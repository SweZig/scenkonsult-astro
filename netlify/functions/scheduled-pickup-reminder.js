// netlify/functions/scheduled-pickup-reminder.js
// Skickar förberedelsemail kl 19:00 svensk tid till kunder vars utlämning är
// IMORGON. DST-säkrad genom att cron körs två gånger (UTC 17 + 18) — funktionen
// avbryter snabbt om Stockholm-timmen inte är 19, så bara en av körningarna
// triggar skarpt utskick. Funktionen är idempotent via pickup_reminder_sent_at.
'use strict';

const { schedule } = require('@netlify/functions');
const { supabase, sendEmail, logAudit, MAIL_FROM } = require('./_lib');
const { buildPickupReminderEmail } = require('./_pickup-reminder-mail');

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
      .select('id, customer_name, customer_email, customer_phone, cart_token, event_date, event_location, items, status, delivery_time, pickup_reminder_sent_at, customer_company, delivery_mode')
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

  const results = { sent: 0, skipped_already_sent: 0, skipped_no_email: 0, errors: [] };

  for (const cart of tomorrows) {
    if (cart.pickup_reminder_sent_at) {
      results.skipped_already_sent++;
      continue;
    }
    if (!cart.customer_email) {
      results.skipped_no_email++;
      console.warn('SCHEDULED_PICKUP: Saknar email för', cart.id);
      continue;
    }

    try {
      const { html, text, subject } = buildPickupReminderEmail(cart);
      await sendEmail(apiKey, {
        from:     MAIL_FROM,
        to:       cart.customer_email,
        subject,
        html,
        text,
        reply_to: 'info@scenkonsult.se',
      });
      await db.update('carts', { pickup_reminder_sent_at: new Date().toISOString() }, 'id', cart.id);
      await logAudit(db, cart.id, 'system', 'pickup_reminder_sent', { to: cart.customer_email, scheduled: true, for_date: tomorrow });
      results.sent++;
      console.log('SCHEDULED_PICKUP: ✅ Skickat till', cart.customer_email, 'för', cart.id);
      // Liten paus mellan utskick (Resend rate limit)
      await new Promise(r => setTimeout(r, 600));
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
