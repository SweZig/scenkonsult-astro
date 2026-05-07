// netlify/functions/pickup-reminder-trigger.js
// Manuellt utskick av förberedelsemail från admin-panelen.
// POST { cart_id } + Bearer ADMIN_TOKEN
//
// Detta är samma mailmall som scheduled-pickup-reminder. Skillnaden är att
// admin trycker på en knapp i admin-panelen (för same-day-bookings, missade
// auto-utskick, eller om kunden bett om en ny länk).

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, sendEmail, MAIL_FROM } = require('./_lib');
const { buildPickupReminderEmail } = require('./_pickup-reminder-mail');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body;
  try {
    let raw = event.body || '{}';
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, 'base64').toString('utf-8');
    body = JSON.parse(raw);
  } catch (e) {
    return err('Ogiltig JSON', 400);
  }

  const { cart_id } = body;
  if (!cart_id) return err('cart_id krävs', 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return err('Mailkonfiguration saknas', 500);

  const db = supabase();
  try {
    const { data: cart, error } = await db.from('carts')
      .select('id, customer_name, customer_email, cart_token, event_date, event_location, items, status, delivery_time, customer_company, delivery_mode')
      .eq('id', cart_id)
      .single();

    if (error || !cart) return err('Varukorg hittades ej', 404);
    if (!cart.customer_email) return err('Kunden har ingen e-postadress', 400);
    if (!cart.cart_token) return err('Cart saknar token', 400);

    const { html, text, subject } = buildPickupReminderEmail(cart);
    await sendEmail(apiKey, {
      from:     MAIL_FROM,
      to:       cart.customer_email,
      subject,
      html,
      text,
      reply_to: 'info@scenkonsult.se',
    });

    await db.update('carts', { pickup_reminder_sent_at: new Date().toISOString() }, 'id', cart_id);
    await logAudit(db, cart_id, 'admin', 'pickup_reminder_sent', { to: cart.customer_email, scheduled: false });

    return ok({ sent: true, to: cart.customer_email });
  } catch (e) {
    console.error('PICKUP_REMINDER_TRIGGER_ERROR:', e.message);
    return err(e.message || 'Serverfel', 500);
  }
};
