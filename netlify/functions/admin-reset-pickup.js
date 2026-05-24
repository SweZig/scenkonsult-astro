// netlify/functions/admin-reset-pickup.js
// Nollställer förberedelsedata på ett cart — för testning/admin-användning.
// POST { cart_id } + Bearer ADMIN_TOKEN
//
// Tar bort alla förberedelse- och motkvitterings-fält så att kund (eller admin)
// kan börja om processen. Bevarar dock:
//   - cart_token        (kund behöver inte ny länk)
//   - pickup_short_token (SAMMA /u/<token>-URL fungerar fortfarande)
//   - pickup_reminder_sent_at (inga nya SMS skickas)
//
// Detta är admin-only och kräver ADMIN_TOKEN — en mer permanent ersättning
// för den borttagna sign-reopen.js som var cart_token-skyddad.

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit } = require('./_lib');

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

  const db = supabase();
  try {
    // Verifiera cart finns + läs nuvarande state för audit-loggning
    const { data: cart, error } = await db.from('carts')
      .select('id, pickup_signed_at, pickup_confirmed_at')
      .eq('id', cart_id)
      .single();
    if (error || !cart) return err('Cart hittades inte', 404);

    // Nollställ ALLA förberedelse- och motkvitterings-fält
    const updates = {
      // Kundens förberedelse
      pickup_signature:                  null,
      pickup_signed_at:                  null,
      pickup_sign_ip:                    null,
      pickup_id_photo:                   null,
      pickup_method:                     null,
      pickup_proxy_name:                 null,
      pickup_proxy_phone:                null,
      pickup_proxy_id_verified_at:       null,
      delivery_recipient_method:         null,
      delivery_recipient_name:           null,
      delivery_recipient_phone:          null,
      delivery_recipient_id_verified_at: null,
      // Admins motkvittering
      pickup_confirmed_at:               null,
      pickup_admin_note:                 null,
    };

    await db.update('carts', updates, 'id', cart_id);

    await logAudit(db, cart_id, 'admin', 'pickup_reset', {
      had_signed:    !!cart.pickup_signed_at,
      had_confirmed: !!cart.pickup_confirmed_at,
      reason:        'admin_reset',
    });

    return ok({
      reset:           true,
      cart_id,
      had_signed:      !!cart.pickup_signed_at,
      had_confirmed:   !!cart.pickup_confirmed_at,
    });
  } catch (e) {
    console.error('PICKUP_RESET_ERROR:', e.message);
    return err(e.message || 'Serverfel', 500);
  }
};
