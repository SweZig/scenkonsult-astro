// netlify/generate-clients.mjs
// Build-time-synk: hämtar kundlistan från Supabase-tabellen `clients` och skriver
// src/data/clients.json (server-renderad snapshot för SEO + fallback).
//
// Robust: vid fel (saknade env-vars, API-fel, tom data) behålls den befintliga
// committade filen — build faller ALDRIG på detta.
//
// Kräver SUPABASE_URL + SUPABASE_SERVICE_KEY. Körs i prebuild.

import fs from 'fs';
import path from 'path';

const OUT_PATH = path.resolve('src/data/clients.json');
const CATEGORIES = ['kommun', 'naringsliv', 'ambassad', 'event'];

function log(msg) { console.log(`[clients-sync] ${msg}`); }

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) { log('SUPABASE-env saknas — behåller befintlig clients.json'); return; }

  let rows;
  try {
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    const base = `${url}/rest/v1/clients?active=eq.true&order=sort_order.asc`;
    let res = await fetch(`${base}&select=name,category,ort,featured,sort_order`, { headers });
    // Fallback utan valfria kolumner (ort/featured) om de inte finns än
    if (!res.ok) res = await fetch(`${base}&select=name,category,sort_order`, { headers });
    if (!res.ok) { log(`Supabase svarade ${res.status} — behåller befintlig fil. ${(await res.text()).slice(0, 160)}`); return; }
    rows = await res.json();
  } catch (e) { log(`Fetch-fel: ${e.message} — behåller befintlig fil`); return; }

  if (!Array.isArray(rows) || rows.length === 0) {
    log('Inga aktiva kunder i DB — behåller befintlig fil (skriver ej tom lista)');
    return;
  }

  const clients = rows.map(r => ({
    name: r.name,
    category: CATEGORIES.includes(r.category) ? r.category : null,
    ort: r.ort || null,
    featured: !!r.featured,
  }));

  const out = {
    _comment: 'Server-renderad snapshot av kundlistan (referenskunder). Underhålls i admin (/admin/referenser/) → Supabase-tabellen clients. Regenereras vid varje build av netlify/generate-clients.mjs. Redigera INTE för hand. category: kommun|naringsliv|ambassad|event|null. Sidorna hydrerar live från /.netlify/functions/clients-list.',
    _updated: new Date().toISOString().slice(0, 10),
    clients,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n');
  log(`✅ Skrev ${clients.length} kunder till clients.json`);
}

main();
