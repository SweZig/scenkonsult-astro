// netlify/generate-reviews.mjs
// Build-time-synk: hämtar recensioner från Supabase-tabellen `reviews` och
// skriver src/data/reviews.json (server-renderad snapshot för SEO + fallback).
//
// Robust: vid fel (saknade env-vars, API-fel, tom/ofullständig data) behålls
// den befintliga committade filen — build faller ALDRIG på detta.
//
// Kräver SUPABASE_URL + SUPABASE_SERVICE_KEY i environment (samma som funktionerna).
// Körs i prebuild. Lokalt utan env-vars → snapshotten från senaste deploy används.

import fs from 'fs';
import path from 'path';

const OUT_PATH = path.resolve('src/data/reviews.json');

function log(msg) { console.log(`[reviews-sync] ${msg}`); }

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    log('SUPABASE-env saknas — behåller befintlig reviews.json');
    return;
  }

  let rows;
  try {
    const q = `${url}/rest/v1/reviews?select=author,rating,review_text,published_at,sort_order&active=eq.true&order=sort_order.asc`;
    const res = await fetch(q, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      log(`Supabase svarade ${res.status} — behåller befintlig fil. ${(await res.text()).slice(0, 160)}`);
      return;
    }
    rows = await res.json();
  } catch (e) {
    log(`Fetch-fel: ${e.message} — behåller befintlig fil`);
    return;
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    log('Inga aktiva recensioner i DB — behåller befintlig fil (skriver ej tom lista)');
    return;
  }

  const reviews = rows.map(r => ({
    author: r.author,
    rating: r.rating || 5,
    publishTime: r.published_at,
    text: r.review_text,
  }));

  // Bevara metadata från befintlig fil om den finns
  let meta = {};
  try {
    meta = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  } catch { /* saknas — använd defaults nedan */ }

  const out = {
    _comment: 'Server-renderad snapshot av Google-recensioner. Underhålls i admin (/admin/recensioner/) → Supabase-tabellen `reviews`. Denna fil regenereras automatiskt vid varje build av netlify/generate-reviews.mjs. Redigera INTE för hand — ändringar skrivs över vid nästa deploy.',
    _source: 'Supabase `reviews` (synkad vid build)',
    _placeUrl: meta._placeUrl || 'https://maps.google.com/?cid=5076721930755148492',
    _placeId: meta._placeId || 'ChIJuWsoFN2fX0YRzIoYyrIjdEY',
    _updated: new Date().toISOString().slice(0, 10),
    reviews,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n');
  log(`✅ Skrev ${reviews.length} recensioner till reviews.json`);
}

main();
