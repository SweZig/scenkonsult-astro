// netlify/functions/clients-list.js
// Publik, oautentiserad GET — hämtas client-side av referens- och om-oss-sidan
// för att spegla admin-ändringar direkt. Server-renderad snapshot i
// src/data/clients.json (SEO/fallback).
//
// GET /.netlify/functions/clients-list → { ok, clients: [{ name, category }] }

'use strict';
const { supabase, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);

  try {
    const db = supabase();
    const { data } = await db.from('clients')
      .select('name,category,ort,sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    const clients = (data || []).map(c => ({ name: c.name, category: c.category || null, ort: c.ort || null }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://scenkonsult.se',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
      body: JSON.stringify({ ok: true, clients }),
    };
  } catch (e) {
    console.error('CLIENTS_LIST_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
