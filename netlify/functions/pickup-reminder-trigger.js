// netlify/functions/pickup-reminder-trigger.js
// Manuellt utskick av förberedelse-länken från admin-panelen.
// POST { cart_id, channel? } + Bearer ADMIN_TOKEN
//
// Samma logik som scheduled-pickup-reminder: SMS-först, mail-fallback.
//
// channel-parameter (valfri):
//   'auto'  (default) — SMS om telefon finns, annars/vid fel mail
//   'sms'             — bara SMS (fel om telefon saknas)
//   'email'           — bara mail (fel om email saknas)
//
// Används av admin-panelen för same-day-bookings, missade auto-utskick,
// eller om kunden bett om en ny länk.

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, sendEmail, MAIL_FROM } = require('./_lib');
const { buildPickupReminderEmail } = require('./_pickup-reminder-mail');
const { ensureShortToken } = require('./_short-token');
const { getPickupSms } = require('./_pickup-sms');
const { sendSms } = require('./_sms');

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

  const { cart_id, channel = 'auto' } = body;
  if (!cart_id) return err('cart_id krävs', 400);
  if (!['auto', 'sms', 'email'].includes(channel)) {
    return err('channel måste vara auto, sms eller email', 400);
  }

  const apiKey = process.env.RESEND_API_KEY;

  const db = supabase();
  try {
    const { data: cart, error } = await db.from('carts')
      .select('id, customer_name, customer_email, customer_phone, cart_token, event_date, event_location, items, status, delivery_time, customer_company, delivery_mode, pickup_short_token, prepared_via, skip_pickup_flow')
      .eq('id', cart_id)
      .single();

    if (error || !cart) return err('Varukorg hittades ej', 404);
    if (!cart.cart_token) return err('Cart saknar token', 400);

    // Säkerställ kort URL-token
    const shortToken = await ensureShortToken(db, cart);
    cart.pickup_short_token = shortToken;

    // Bestäm utskickskanal
    const tryS  = (channel === 'auto' || channel === 'sms')   && !!cart.customer_phone;
    const tryE  = (channel === 'auto' || channel === 'email') && !!cart.customer_email;

    if (channel === 'sms'   && !cart.customer_phone) return err('Kunden saknar telefon', 400);
    if (channel === 'email' && !cart.customer_email) return err('Kunden saknar e-postadress', 400);
    if (!tryS && !tryE)                              return err('Inga utskickskanaler tillgängliga', 400);
    if (tryE && !apiKey)                             return err('Mailkonfiguration saknas (RESEND_API_KEY)', 500);

    let smsSent = false;
    let emailSent = false;
    let preparedVia = null;
    let smsError = null;
    let smsFrom = null;
    let smsId = null;

    // ── SMS-försök ────────────────────────────────────────────────────────
    if (tryS) {
      const message = getPickupSms(cart, shortToken);
      const smsRes = await sendSms(cart.customer_phone, message);
      if (smsRes.ok) {
        smsSent = true;
        preparedVia = 'sms';
        smsFrom = smsRes.from;
        smsId = smsRes.smsId;
        await logAudit(db, cart_id, 'admin', 'pickup_reminder_sms', {
          to: cart.customer_phone, sms_id: smsRes.smsId, from: smsRes.from,
        });
      } else {
        smsError = smsRes.error;
      }
    }

    // ── Mail-försök (fallback om SMS misslyckades, eller om channel=email) ─
    const shouldMail = (channel === 'email') || (channel === 'auto' && !smsSent && tryE);
    if (shouldMail) {
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
      preparedVia = smsSent ? 'sms' : 'email';
      await logAudit(db, cart_id, 'admin', 'pickup_reminder_email', {
        to: cart.customer_email, fallback_after_sms: !smsSent && !!cart.customer_phone,
      });
    }

    if (!smsSent && !emailSent) {
      return err(`Utskick misslyckades. SMS-fel: ${smsError || 'inte försökt'}`, 500);
    }

    await db.update('carts', {
      pickup_reminder_sent_at: new Date().toISOString(),
      prepared_via:            preparedVia,
    }, 'id', cart_id);

    return ok({
      sent:        true,
      sms_sent:    smsSent,
      email_sent:  emailSent,
      to_phone:    smsSent ? cart.customer_phone : null,
      to_email:    emailSent ? cart.customer_email : null,
      sms_from:    smsFrom,
      sms_id:      smsId,
      sms_error:   smsError,
      short_token: shortToken,
    });
  } catch (e) {
    console.error('PICKUP_REMINDER_TRIGGER_ERROR:', e.message);
    return err(e.message || 'Serverfel', 500);
  }
};
