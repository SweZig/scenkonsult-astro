// netlify/functions/invoice-reserve.js
// POST { next_number: 2017 } + Bearer TOKEN
// Reserverar ALLA lediga K-nummer i intervallet [START_NUM, next_number - 1]
// genom att skapa en placeholder-rad per ledigt nummer. Efteråt kommer
// gap-filling i getOrCreateInvoiceNumber att hoppa rakt till K(next_number).

const START_NUM = 2010; // Måste matcha _lib.js getOrCreateInvoiceNumber

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
  if (num <= START_NUM)
    return { statusCode: 400, headers, body: JSON.stringify({ error: `Nästa nummer måste vara minst K${START_NUM + 1}` }) };

  try {
    const supaUrl = process.env.SUPABASE_URL;
    const supaKey = process.env.SUPABASE_SERVICE_KEY;
    const supaHeaders = { apikey: supaKey, Authorization: `Bearer ${supaKey}` };

    // 1) Hämta ALLA befintliga K-nummer (inkl reservationer) för att veta vad som är tagit
    const listRes = await fetch(
      `${supaUrl}/rest/v1/carts?select=invoice_number&invoice_number=not.is.null`,
      { headers: supaHeaders }
    );
    if (!listRes.ok) throw new Error(`List failed: ${listRes.status} ${await listRes.text()}`);
    const rows = await listRes.json();
    const taken = new Set();
    (rows || []).forEach(r => {
      if (r.invoice_number && typeof r.invoice_number === 'string' && r.invoice_number.startsWith('K')) {
        const n = parseInt(r.invoice_number.slice(1));
        if (!isNaN(n)) taken.add(n);
      }
    });

    // 2) Identifiera lediga nummer i [START_NUM, num - 1] som behöver blockas
    const toReserve = [];
    for (let n = START_NUM; n <= num - 1; n++) {
      if (!taken.has(n)) toReserve.push(n);
    }

    if (toReserve.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ok: true,
          next: 'K' + num,
          reserved: [],
          note: `Alla nummer upp till K${num - 1} är redan tagna`
        })
      };
    }

    // 3) Bygg en reservation-rad per ledigt nummer och insert:a alla i ett svep
    const nowIso     = new Date().toISOString();
    const expiresIso = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(); // 10 år
    const rowsToInsert = toReserve.map(n => ({
      id:             `SK-RESERVE-K${n}`,
      status:         'cancelled',
      invoice_number: 'K' + n,
      items:          [],
      customer_name:  '[Reserverat fakturanummer]',
      customer_email: 'hej@scenkonsult.se',
      notes_admin:    `Reserverat ${nowIso.slice(0,10)} — del av hopp till K${num}`,
      expires_at:     expiresIso,
    }));

    const insertRes = await fetch(`${supaUrl}/rest/v1/carts`, {
      method: 'POST',
      headers: {
        ...supaHeaders,
        'Content-Type': 'application/json',
        // ignore-duplicates = om någon rad råkar krocka (race condition) hoppa över den istället för 409
        Prefer: 'return=minimal,resolution=ignore-duplicates',
      },
      body: JSON.stringify(rowsToInsert),
    });

    if (!insertRes.ok) {
      const errTxt = await insertRes.text();
      throw new Error(`Insert failed (${insertRes.status}): ${errTxt}`);
    }

    console.log('INVOICE_RESERVE:', toReserve.length, 'numbers reserved up to K' + (num - 1), '→ next will be K' + num);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        next: 'K' + num,
        reserved: toReserve.map(n => 'K' + n),
        count: toReserve.length,
      })
    };

  } catch (err) {
    console.error('INVOICE_RESERVE_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
