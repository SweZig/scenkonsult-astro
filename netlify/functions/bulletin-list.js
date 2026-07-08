// netlify/functions/bulletin-list.js
// Publik, oautentiserad GET — hämtas av nav-tickern (Layout.astro) client-side.
// Returnerar bara aktiva, ej utgångna meddelanden (text + valfri länk),
// sorterade på sort_order. Ingen admin-data läcker (id/skapad-datum etc. filtreras bort).
//
// GET /.netlify/functions/bulletin-list

'use strict';
const { supabase, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);

  try {
    const db = supabase();
    const { data } = await db.from('bulletins')
      .select('text,link_url,expires_at')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    const now = Date.now();
    const items = (data || [])
      .filter(b => !b.expires_at || new Date(b.expires_at).getTime() > now)
      .map(b => ({ text: b.text, link: b.link_url || null }));

    // Cacha kort hos klienten (60s) — tickern hämtar en gång per sidladdning ändå.
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://scenkonsult.se',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify({ items }),
    };
  } catch (e) {
    console.error('BULLETIN_LIST_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
