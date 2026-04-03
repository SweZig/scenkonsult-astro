// invoice-reserve.js
// POST { next_number: 2015 } + Bearer TOKEN
// Reserverar alla K-nummer upp till (next_number - 1) genom att skapa
// en placeholder-cart med det högsta reserverade numret.
// Resulterar i att nästa auto-genererade K-nummer blir K(next_number).

const { supabase: createSupabase } = require('./_lib');

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

  const { next_number } = body;
  const num = parseInt(next_number);
  if (!num || num < 1)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltigt nummer' }) };

  const reservedInvoiceNumber = 'K' + (num - 1);

  try {
    const supaUrl = process.env.SUPABASE_URL;
    const supaKey = process.env.SUPABASE_SERVICE_KEY;

    // Kolla om K(num-1) redan finns
    const checkRes = await fetch(
      `${supaUrl}/rest/v1/carts?invoice_number=eq.${encodeURIComponent(reservedInvoiceNumber)}&select=id`,
      { headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` } }
    );
    const existing = checkRes.ok ? await checkRes.json() : [];

    if (existing.length > 0) {
      // Numret finns redan — serien är redan rätt
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, reserved: reservedInvoiceNumber, note: 'Numret finns redan i serien' }) };
    }

    // Skapa en reservation-post
    const reserveRes = await fetch(`${supaUrl}/rest/v1/carts`, {
      method: 'POST',
      headers: {
        apikey: supaKey,
        Authorization: `Bearer ${supaKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        id: 'SK-RESERVE-' + num,
        status: 'cancelled',
        invoice_number: reservedInvoiceNumber,
        items: [],
        customer_name: '[Reserverat fakturanummer]',
        customer_email: 'noreply@scenkonsult.se',
        notes_admin: `Manuellt reserverat ${new Date().toISOString().slice(0,10)} — hoppar till K${num}`,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
    });

    if (!reserveRes.ok && reserveRes.status !== 409) {
      const err = await reserveRes.text();
      throw new Error(err);
    }

    console.log('INVOICE_RESERVE:', reservedInvoiceNumber, '→ nästa blir K' + num);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, reserved: reservedInvoiceNumber, next: 'K' + num }) };

  } catch (err) {
    console.error('INVOICE_RESERVE_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
