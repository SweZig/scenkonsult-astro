// netlify/functions/sign-submit.js
// Tar emot signatur + legitimationsfoto vid utlämning
// POST { cart_id, token, signature_data, id_photo_data }

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

  const { cart_id, token, signature_data, id_photo_data } = body;

  if (!cart_id || !token)         return err('cart_id och token krävs', 400);
  if (!signature_data)             return err('Signatur saknas', 400);
  if (!signature_data.startsWith('data:image/'))
                                   return err('Ogiltig signatur-data', 400);

  // Storlekskontroll (max 500KB per fält)
  const MAX = 512 * 1024;
  if (signature_data.length > MAX) return err('Signaturen är för stor', 400);
  if (id_photo_data && id_photo_data.length > MAX * 4)
                                   return err('Fotot är för stort', 400);

  const db = supabase();
  try {
    const { data: cart, error } = await db
      .from('carts')
      .select('id, status, cart_token, customer_name, pickup_signed_at')
      .eq('id', cart_id)
      .eq('cart_token', token)
      .single();

    if (error || !cart) return err('Varukorg hittades ej eller ogiltig token', 404);
    if (cart.pickup_signed_at) return err('Utlämningen är redan kvitterad', 409);

    const updates = {
      pickup_signature:  signature_data,
      pickup_signed_at:  new Date().toISOString(),
      pickup_sign_ip:    ip,
    };
    if (id_photo_data) updates.pickup_id_photo = id_photo_data;

    const { error: upErr } = await db
      .from('carts').update(updates).eq('id', cart_id);
    if (upErr) throw new Error(upErr.message);

    await logAudit(db, cart_id, 'customer', 'pickup_signed', {
      ip,
      has_id_photo: !!id_photo_data,
    });

    return ok({ signed: true, cart_id, signed_at: updates.pickup_signed_at });
  } catch (e) {
    console.error('SIGN_SUBMIT_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
