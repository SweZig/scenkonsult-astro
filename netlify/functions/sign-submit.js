// netlify/functions/sign-submit.js
// Tar emot Beställarens kvittens vid utlämning — signatur, leg-foto,
// och uppgifter om bud (vid självhämtning) eller kontaktperson (vid leverans).
// POST { cart_id, token, signature_data, id_photo_data,
//        pickup_method?, pickup_proxy_name?, pickup_proxy_phone?,
//        delivery_recipient_method?, delivery_recipient_name?, delivery_recipient_phone? }

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

  const {
    cart_id, token, signature_data, id_photo_data,
    // Nya fält i v3 (Batch 3):
    pickup_method,                    // 'self' | 'proxy' (vid självhämtning)
    pickup_proxy_name, pickup_proxy_phone,
    delivery_recipient_method,        // 'self' | 'other' (vid leverans)
    delivery_recipient_name, delivery_recipient_phone,
  } = body;

  if (!cart_id || !token)         return err('cart_id och token krävs', 400);
  if (!signature_data)             return err('Signatur saknas', 400);
  if (!signature_data.startsWith('data:image/'))
                                   return err('Ogiltig signatur-data', 400);

  // Storlekskontroll (max 500KB per fält)
  const MAX = 512 * 1024;
  if (signature_data.length > MAX) return err('Signaturen är för stor', 400);
  if (id_photo_data && id_photo_data.length > MAX * 4)
                                   return err('Fotot är för stort', 400);

  // Validera proxy/recipient-fält
  if (pickup_method && !['self', 'proxy'].includes(pickup_method)) {
    return err('pickup_method måste vara self eller proxy', 400);
  }
  if (delivery_recipient_method && !['self', 'other'].includes(delivery_recipient_method)) {
    return err('delivery_recipient_method måste vara self eller other', 400);
  }
  if (pickup_method === 'proxy') {
    if (!pickup_proxy_name || !pickup_proxy_name.trim()) {
      return err('Bud kräver namn (pickup_proxy_name)', 400);
    }
    if (!pickup_proxy_phone || !pickup_proxy_phone.trim()) {
      return err('Bud kräver mobilnummer (pickup_proxy_phone)', 400);
    }
  }
  if (delivery_recipient_method === 'other') {
    if (!delivery_recipient_name || !delivery_recipient_name.trim()) {
      return err('Kontaktperson kräver namn (delivery_recipient_name)', 400);
    }
    if (!delivery_recipient_phone || !delivery_recipient_phone.trim()) {
      return err('Kontaktperson kräver mobilnummer (delivery_recipient_phone)', 400);
    }
  }

  const db = supabase();
  try {
    const { data: cart, error } = await db
      .from('carts')
      .select('id, status, cart_token, customer_name, pickup_signed_at, delivery_mode')
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

    // Proxy/recipient-data — endast en av setarna används baserat på delivery_mode.
    // Vi accepterar dock båda för säkerhet — om frontend skickar fel kan adminpanelen
    // se vilket fält som faktiskt är ifyllt.
    if (pickup_method) {
      updates.pickup_method = pickup_method;
      if (pickup_method === 'proxy') {
        updates.pickup_proxy_name  = pickup_proxy_name.trim();
        updates.pickup_proxy_phone = pickup_proxy_phone.trim();
      } else {
        // pickup_method='self' — nollställ ev. tidigare proxy-data
        updates.pickup_proxy_name  = null;
        updates.pickup_proxy_phone = null;
      }
    }
    if (delivery_recipient_method) {
      updates.delivery_recipient_method = delivery_recipient_method;
      if (delivery_recipient_method === 'other') {
        updates.delivery_recipient_name  = delivery_recipient_name.trim();
        updates.delivery_recipient_phone = delivery_recipient_phone.trim();
      } else {
        updates.delivery_recipient_name  = null;
        updates.delivery_recipient_phone = null;
      }
    }

    await db.update('carts', updates, 'id', cart_id);

    await logAudit(db, cart_id, 'customer', 'pickup_signed', {
      ip,
      has_id_photo:               !!id_photo_data,
      pickup_method:              pickup_method || null,
      delivery_recipient_method:  delivery_recipient_method || null,
      has_proxy:                  pickup_method === 'proxy',
      has_recipient:              delivery_recipient_method === 'other',
    });

    return ok({ signed: true, cart_id, signed_at: updates.pickup_signed_at });
  } catch (e) {
    console.error('SIGN_SUBMIT_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
