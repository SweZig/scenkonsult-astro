// netlify/functions/invoice-next-number.js
// GET /.netlify/functions/invoice-next-number + Bearer TOKEN
// Returnerar serverns faktiska beräknade nästa K-nummer (inkl reservationer).
// Används av admin-UI:t för preview — ska alltid matcha det nummer
// getOrCreateInvoiceNumber kommer tilldela vid faktisk fakturagenerering.

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

const START_NUM = 2010; // Måste matcha _lib.js getOrCreateInvoiceNumber + invoice-reserve.js

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET')     return err('Metod ej tillåten', 405);
  if (!isAdmin(event))                return err('Ej behörig', 401);

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;

  try {
    const res = await fetch(
      `${supaUrl}/rest/v1/carts?select=invoice_number&invoice_number=not.is.null`,
      { headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` } }
    );
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    const rows = await res.json();

    const taken = new Set();
    let highest = START_NUM - 1;
    (rows || []).forEach(r => {
      if (r.invoice_number && typeof r.invoice_number === 'string' && r.invoice_number.startsWith('K')) {
        const n = parseInt(r.invoice_number.slice(1));
        if (!isNaN(n) && n >= START_NUM) {
          taken.add(n);
          if (n > highest) highest = n;
        }
      }
    });

    // Gap-filling: lägsta lediga nummer ≥ START_NUM
    let next = START_NUM;
    while (taken.has(next)) next++;

    return ok({
      next_number: 'K' + next,
      next_num:    next,
      highest:     'K' + highest,
      taken_count: taken.size,
    });
  } catch (e) {
    console.error('INVOICE_NEXT_NUMBER_ERROR:', e.message);
    return err('Serverfel: ' + e.message, 500);
  }
};
