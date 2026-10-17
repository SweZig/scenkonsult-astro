// netlify/generate-popular.mjs
// Build-time-synk: bygger src/data/popular.json ur Supabase-tabellerna
// content_categories, popular_groups och popular_group_items.
//
// Robust: vid fel (saknade env-vars, API-fel, tom data) behålls den befintliga
// committade filen — build faller ALDRIG på detta. Samma kontrakt som
// generate-clients.mjs.
//
// Utdataform (konsumeras av PopularaPaket.astro):
//   { "<kategori>": { label, heading, lead, allaHref, allaLabel, casesLead,
//                     grupper: [{ rubrik, gaster, lead, artnos: [...] }] } }
//
// En kategori med source_categories hämtar grupperna från de kategorierna i
// angiven ordning (ljud-och-ljus = ljud + ljus) i stället för sina egna.
//
// Kräver SUPABASE_URL + SUPABASE_SERVICE_KEY. Körs i prebuild.

import fs from 'fs';
import path from 'path';

const OUT_PATH = path.resolve('src/data/popular.json');

function log(msg) { console.log(`[popular-sync] ${msg}`); }

async function get(url, key, q) {
  const res = await fetch(`${url}/rest/v1/${q}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${q.split('?')[0]} svarade ${res.status}: ${(await res.text()).slice(0, 160)}`);
  return res.json();
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) { log('SUPABASE-env saknas — behåller befintlig popular.json'); return; }

  let cats, groups, items;
  try {
    [cats, groups, items] = await Promise.all([
      get(url, key, 'content_categories?active=eq.true&order=sort_order.asc&select=slug,label,popular_heading,popular_lead,cases_lead,alla_href,alla_label,source_categories'),
      get(url, key, 'popular_groups?active=eq.true&order=sort_order.asc&select=id,category,rubrik,gaster,lead,sort_order'),
      get(url, key, 'popular_group_items?order=sort_order.asc&select=group_id,artno,sort_order'),
    ]);
  } catch (e) { log(`${e.message} — behåller befintlig fil`); return; }

  if (!Array.isArray(cats) || cats.length === 0) {
    log('Inga aktiva kategorier i DB — behåller befintlig fil (skriver ej tom lista)');
    return;
  }

  const artnosByGroup = new Map();
  for (const it of items) {
    if (!artnosByGroup.has(it.group_id)) artnosByGroup.set(it.group_id, []);
    artnosByGroup.get(it.group_id).push(it.artno);
  }

  const groupsByCat = new Map();
  for (const g of groups) {
    if (!groupsByCat.has(g.category)) groupsByCat.set(g.category, []);
    groupsByCat.get(g.category).push({
      rubrik: g.rubrik,
      gaster: g.gaster ?? null,
      lead: g.lead ?? null,
      artnos: artnosByGroup.get(g.id) ?? [],
    });
  }

  const out = {};
  for (const c of cats) {
    const src = Array.isArray(c.source_categories) ? c.source_categories : [];
    const grupper = src.length
      ? src.flatMap((s) => groupsByCat.get(s) ?? [])
      : (groupsByCat.get(c.slug) ?? []);
    out[c.slug] = {
      label: c.label,
      heading: c.popular_heading ?? 'Populäraste paketen',
      lead: c.popular_lead ?? null,
      allaHref: c.alla_href ?? null,
      allaLabel: c.alla_label ?? null,
      casesLead: c.cases_lead ?? null,
      grupper,
    };
  }

  const withGroups = Object.values(out).filter((c) => c.grupper.length).length;
  if (withGroups === 0) {
    log('Ingen kategori har grupper — behåller befintlig fil');
    return;
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  log(`Skrev ${Object.keys(out).length} kategorier (${withGroups} med grupper) till popular.json`);
}

main().catch((e) => { log(`Oväntat fel: ${e.message} — behåller befintlig fil`); });
