// netlify/functions/invoice-list.js
// GET /.netlify/functions/invoice-list?limit=5 + Bearer TOKEN
// Returnerar de N senaste skapade fakturorna (alla med invoice_number satt),
// inkl SK-RESERVE-* så admin kan rensa även reservationer.

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET')     return err('Metod ej tillåten', 405);
  if (!isAdmin(event))                return err('Ej behörig', 401);

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  const limit = Math.max(1, Math.min(50, parseInt((event.queryStringParameters || {}).limit) || 5));

  try {
    // Sortera på invoice_number desc (K-nummer) — fångar både skickade och reservationer
    const url = `${supaUrl}/rest/v1/carts?select=id,invoice_number,customer_name,customer_company,total_excl,invoice_sent_at,invoice_paid_at,status,created_at&invoice_number=not.is.null&order=invoice_number.desc&limit=${limit}`;
    const res = await fetch(url, {
      headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Supabase ${res.status}: ${txt}`);
    }
    const rows = await res.json();
    return ok({ invoices: rows || [] });
  } catch (e) {
    console.error('INVOICE_LIST_ERROR:', e.message);
    return err('Serverfel: ' + e.message, 500);
  }
};
