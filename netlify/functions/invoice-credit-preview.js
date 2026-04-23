// netlify/functions/invoice-credit-preview.js
// GET ?cart_id=SK-XXX + Bearer TOKEN
// Returnerar förhandsberäkning för kreditfaktura:
//   - totalt ursprungsbelopp (excl + incl moms)
//   - avbokningsregler-beräkning (dagar kvar, %, DJ-flagga)
//   - om kreditfaktura redan finns

'use strict';
const { isAdmin, ok, err, preflight, supabase: createSupabase } = require('./_lib');

function calcCancelRefundPercent(cart) {
  const items = Array.isArray(cart.items) ? cart.items : [];
  const isDjBooking = items.some(i => {
    const a = (i.artno || i.id || '').toString();
    return /^SK-DJ-(0009|0010|0011|0012|0013|0014|PAK)/.test(a);
  });
  const eventDate = cart.event_date ? new Date(cart.event_date) : null;
  if (!eventDate || isNaN(eventDate.getTime())) {
    return { percent: 100, days: null, isDj: isDjBooking };
  }
  const today = new Date(); today.setHours(0,0,0,0);
  eventDate.setHours(0,0,0,0);
  const days = Math.round((eventDate - today) / 86400000);
  let percent;
  if (isDjBooking) {
    if (days > 60)       percent = 100;
    else if (days >= 30) percent = 50;
    else                 percent = 0;
  } else {
    if (days > 7)        percent = 100;
    else if (days >= 3)  percent = 50;
    else                 percent = 0;
  }
  return { percent, days, isDj: isDjBooking };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET')     return err('Metod ej tillåten', 405);
  if (!isAdmin(event))                return err('Ej behörig', 401);

  const cart_id = (event.queryStringParameters || {}).cart_id;
  if (!cart_id) return err('cart_id krävs', 400);

  try {
    const db = createSupabase();
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return err('Order hittades inte', 404);

    const items = (Array.isArray(cart.items) ? cart.items : []).filter(i => !i._note && i.name);
    const totalExcl = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
    const totalIncl = Math.round(totalExcl * 1.25);
    const rules     = calcCancelRefundPercent(cart);

    return ok({
      cart_id,
      invoice_number:     cart.invoice_number || null,
      invoice_sent_at:    cart.invoice_sent_at || null,
      total_excl:         totalExcl,
      total_incl:         totalIncl,
      event_date:         cart.event_date || null,
      cancel_rules:       rules,
      existing_credit: {
        credit_invoice_number: cart.credit_invoice_number || null,
        credit_sent_at:        cart.credit_sent_at || null,
        credit_amount_excl:    cart.credit_amount_excl || null,
        credit_mode:           cart.credit_mode || null,
      },
    });
  } catch (e) {
    console.error('CREDIT_PREVIEW_ERROR:', e.message);
    return err('Serverfel: ' + e.message, 500);
  }
};
