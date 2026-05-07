// netlify/functions/scheduled-pickup-reminder.js
// Schemalagd: körs varje dag kl 07:00 UTC (= 08:00 SE-vintertid, 09:00 SE-sommartid).
// Letar carts med event_date = idag, status confirmed/fakturerad/betald, och
// pickup_reminder_sent_at IS NULL. Skickar förberedelsemail.
//
// För same-day-bookings (utlämning < 6h fram) skippas auto-utskick — admin
// måste manuellt trigga via knappen i admin-panelen istället.

'use strict';
const { supabase, sendEmail, logAudit, MAIL_FROM } = require('./_lib');
const { buildPickupReminderEmail } = require('./_pickup-reminder-mail');

// Schedule i ny modern Netlify-syntax (ingen netlify.toml-ändring krävs)
exports.config = { schedule: '0 7 * * *' };

exports.handler = async () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('SCHEDULED_PICKUP: RESEND_API_KEY saknas');
    return { statusCode: 500, body: 'Ej konfigurerad' };
  }

  const db = supabase();

  // Hämta dagens datum i Sverige (Europe/Stockholm)
  // Använd Intl-API för korrekt DST-hantering
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
  const nowMs = Date.now();
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  console.log('SCHEDULED_PICKUP: Letar utlämningar för', today);

  let candidates;
  try {
    // _lib.js har ingen .in() — vi filtrerar status i kod
    const { data, error } = await db.from('carts')
      .select('id, customer_name, customer_email, customer_phone, cart_token, event_date, event_location, items, status, delivery_time, pickup_reminder_sent_at, customer_company')
      .eq('event_date', today);
    if (error) throw error;
    candidates = data || [];
  } catch (e) {
    console.error('SCHEDULED_PICKUP: DB-fel:', e.message);
    return { statusCode: 500, body: 'DB-fel' };
  }

  const ALLOWED = new Set(['confirmed', 'fakturerad', 'betald']);
  const todays = candidates.filter(c => ALLOWED.has(c.status));

  console.log(`SCHEDULED_PICKUP: ${todays.length} utlämningar idag`);

  const results = { sent: 0, skipped_already_sent: 0, skipped_no_email: 0, skipped_too_late: 0, errors: [] };

  for (const cart of todays) {
    if (cart.pickup_reminder_sent_at) {
      results.skipped_already_sent++;
      continue;
    }
    if (!cart.customer_email) {
      results.skipped_no_email++;
      console.warn('SCHEDULED_PICKUP: Saknar email för', cart.id);
      continue;
    }

    // Same-day skydd: är utlämningen mindre än 6h fram?
    // Bygg utlämningstid: event_date + delivery_time (default 13:00) i SE-tid
    const pickupTime = cart.delivery_time || '13:00';
    const pickupSE = `${cart.event_date}T${pickupTime}:00`;
    // Tolka som svensk lokal tid → konvertera till UTC ms
    const pickupMs = parsePickupAsSE(cart.event_date, pickupTime);
    if (pickupMs && (pickupMs - nowMs) < SIX_HOURS_MS) {
      results.skipped_too_late++;
      console.log(`SCHEDULED_PICKUP: Skippar ${cart.id} — utlämning ${pickupSE} är < 6h fram`);
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
      await logAudit(db, cart.id, 'system', 'pickup_reminder_sent', { to: cart.customer_email, scheduled: true });
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

// Tolka YYYY-MM-DD + HH:MM som svensk lokal tid → returnera UTC ms
// Hanterar DST genom att jämföra UTC-offset för datumet
function parsePickupAsSE(dateStr, timeStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  if (!timeStr || !/^\d{2}:\d{2}/.test(timeStr)) return null;
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  // Skapa Date som om det vore UTC
  const asUtc = Date.UTC(y, mo - 1, d, h, mi);
  // Räkna ut SE-offset för det datumet (sommar 2h, vinter 1h)
  // Använd Intl för att hitta offsetstrenge
  const probe = new Date(asUtc);
  const seString = probe.toLocaleString('en-US', { timeZone: 'Europe/Stockholm', timeZoneName: 'shortOffset' });
  const m = seString.match(/GMT([+-]\d+)/);
  const offsetH = m ? parseInt(m[1], 10) : 1;
  return asUtc - offsetH * 3600 * 1000;
}
