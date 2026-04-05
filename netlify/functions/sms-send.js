// netlify/functions/sms-send.js
// Skickar SMS via 46elks
// POST { cart_id, message, to? }  + Bearer ADMIN_TOKEN
// Om "to" saknas används cart.customer_phone

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit } = require('./_lib');

const ELKS_URL  = 'https://api.46elks.com/a1/SMS';
const FROM_NAME = 'Scenkonsult'; // Max 11 tecken, alfanumeriskt

async function sendSms(to, message) {
  const user = process.env.ELKS_API_USER;
  const pass = process.env.ELKS_API_PASSWORD;
  if (!user || !pass) throw new Error('46elks-nycklar saknas (ELKS_API_USER / ELKS_API_PASSWORD)');

  // Normalisera telefonnummer till +46-format
  let phone = to.replace(/\s/g, '').replace(/^0/, '+46');
  if (!phone.startsWith('+')) phone = '+46' + phone;

  const body = new URLSearchParams({
    from:    FROM_NAME,
    to:      phone,
    message: message,
  });

  const res = await fetch(ELKS_URL, {
    method:  'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await res.json();
  if (!res.ok || data.status === 'error') {
    throw new Error(data.message || `46elks fel: ${res.status}`);
  }
  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return err('Ogiltig JSON', 400);
  }

  const { cart_id, message, to: overrideTo } = body;
  if (!cart_id) return err('cart_id krävs', 400);
  if (!message)  return err('message krävs', 400);

  const db = supabase();
  try {
    const { data: cart, error } = await db
      .from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return err('Varukorg hittades ej', 404);

    const phone = overrideTo || cart.customer_phone;
    if (!phone) return err('Inget telefonnummer på kunden — ange "to" manuellt', 400);

    await sendSms(phone, message);

    // Logga och uppdatera sms_sent_at
    await db.update('carts', { sms_sent_at: new Date().toISOString() }, 'id', cart_id);
    await logAudit(db, cart_id, 'admin', 'sms_sent', { to: phone, length: message.length });

    return ok({ sent: true, to: phone });
  } catch (e) {
    console.error('SMS_SEND_ERROR:', e.message);
    return err(e.message || 'Serverfel', 500);
  }
};
