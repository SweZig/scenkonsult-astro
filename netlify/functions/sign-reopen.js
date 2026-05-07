// netlify/functions/sign-reopen.js
// Kund vill ångra sin förberedelse och göra om — bara tillåtet om
// pickup_confirmed_at INTE är satt (dvs admin har inte motkvitterat ännu).
// POST { cart_id, token }

'use strict';
const { supabase, ok, err, preflight, logAudit, rateLimit } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (rateLimit(ip, 5)) return err('För många förfrågningar', 429);

  let body;
  try {
    let raw = event.body || '';
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, 'base64').toString('utf-8');
    body = JSON.parse(raw || '{}');
  } catch (e) {
    return err('Ogiltig JSON', 400);
  }

  const { cart_id, token } = body;
  if (!cart_id || !token) return err('cart_id och token krävs', 400);

  const db = supabase();
  try {
    const { data: cart, error } = await db.from('carts')
      .select('id, status, cart_token, pickup_signed_at, pickup_confirmed_at')
      .eq('id', cart_id)
      .eq('cart_token', token)
      .single();

    if (error || !cart) return err('Varukorg hittades ej eller ogiltig token', 404);
    if (cart.pickup_confirmed_at) return err('Kvittensen är redan bekräftad — kontakta oss om du behöver ändra något', 409);
    if (!cart.pickup_signed_at) return err('Det finns ingen förberedelse att återställa', 400);

    await db.update('carts', {
      pickup_signature: null,
      pickup_signed_at: null,
      pickup_id_photo:  null,
      pickup_sign_ip:   null,
    }, 'id', cart_id);

    await logAudit(db, cart_id, 'customer', 'pickup_reopen', { ip });
    return ok({ reopened: true });
  } catch (e) {
    console.error('SIGN_REOPEN_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
