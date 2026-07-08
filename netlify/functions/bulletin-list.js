// netlify/functions/bulletin-list.js
// Publik, oautentiserad GET — hämtas av nav-tickern (Layout.astro) client-side.
//
// Logik:
//  1. Hämta alla aktiva rader med type='campaign'. Filtrera i JS på
//     starts_at/expires_at-fönster (null = obegränsat åt det hållet).
//  2. Finns minst en aktiv kampanj inom sitt fönster → returnera dessa.
//  3. Annars → returnera aktiva rader med type='default' (redigerbar
//     standardtext, se /admin/bulletin/).
//
// GET /.netlify/functions/bulletin-list

'use strict';
const { supabase, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);

  try {
    const db = supabase();
    const { data } = await db.from('bulletins')
      .select('text,link_url,type,sort_order,starts_at,expires_at')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    const rows = data || [];
    const now = Date.now();

    const withinWindow = (b) => {
      if (b.starts_at && new Date(b.starts_at).getTime() > now) return false;
      if (b.expires_at && new Date(b.expires_at).getTime() <= now) return false;
      return true;
    };

    const campaigns = rows.filter(b => b.type === 'campaign' && withinWindow(b));
    const source = campaigns.length ? campaigns : rows.filter(b => b.type === 'default');

    const items = source.map(b => ({ text: b.text, link: b.link_url || null }));

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
