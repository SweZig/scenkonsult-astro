// netlify/functions/invoice-delete.js
// POST { cart_id } + Bearer TOKEN
// Raderar fakturanumret från en cart så numret blir ledigt i serien.
// - SK-RESERVE-*  → hela raden raderas
// - Vanlig cart   → invoice_number/date/due/sent/paid nollas och status → confirmed
// Audit-loggar med gammalt K-nummer för spårning.

'use strict';
const { supabase: createSupabase, logAudit } = require('./_lib');

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const adminToken = process.env.ADMIN_TOKEN;
  const auth = (event.headers['authorization'] || '').replace('Bearer ', '');
  if (!adminToken || auth !== adminToken)
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Ej behörig' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltigt JSON' }) }; }

  const { cart_id } = body;
  if (!cart_id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cart_id krävs' }) };

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;

  try {
    const db = createSupabase();
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Cart hittades inte' }) };
    if (!cart.invoice_number) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ingen faktura att radera' }) };

    const oldInvoice = cart.invoice_number;
    const isReserve  = typeof cart_id === 'string' && cart_id.startsWith('SK-RESERVE-');

    if (isReserve) {
      // Reservations-cart: radera hela raden
      const res = await fetch(`${supaUrl}/rest/v1/carts?id=eq.${encodeURIComponent(cart_id)}`, {
        method: 'DELETE',
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`,
          Prefer: 'return=minimal',
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Supabase DELETE: ${res.status} ${txt}`);
      }
      console.log('INVOICE_DELETE (reserve):', cart_id, oldInvoice);
      // audit-loggning mot raderad rad fungerar inte — skippar
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, freed_number: oldInvoice, deleted_cart: true }),
      };
    }

    // Vanlig cart: rensa fakturafält, återställ status till confirmed om fakturerad/betald
    const statusReset = ['fakturerad', 'betald'].includes(cart.status) ? 'confirmed' : cart.status;
    const updates = {
      invoice_number:   null,
      invoice_sent_at:  null,
      invoice_paid_at:  null,
      invoice_due_date: null,
      status:           statusReset,
    };
    await db.update('carts', updates, 'id', cart_id);
    await logAudit(db, cart_id, 'admin', 'invoice_deleted', {
      freed_number: oldInvoice,
      status_was:   cart.status,
      status_now:   statusReset,
    });

    console.log('INVOICE_DELETE:', cart_id, 'freed', oldInvoice);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        freed_number: oldInvoice,
        status:       statusReset,
        deleted_cart: false,
      }),
    };

  } catch (err) {
    console.error('INVOICE_DELETE_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
