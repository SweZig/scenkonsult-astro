// netlify/generate-event-cases.mjs
// Build-time-synk: bygger src/data/event-cases.json ur Supabase-tabellerna
// event_cases, event_case_images och event_case_hub.
//
// Robust: vid fel (saknade env-vars, API-fel, tom data) behålls den befintliga
// committade filen — build faller ALDRIG på detta. Samma kontrakt som
// generate-clients.mjs.
//
// Utdataform:
//   {
//     cases: [{ id, label, descr, tag, categories[], images: [{src, alt}] }],
//     hub:   { "<kategori>": [{ caseId, label, descr, src, alt, pos }] }
//   }
//
// `cases` driver eventgalleriet på /referenser/ (alla bilder per kort, crossfade).
// `hub` driver EventBilder på kategorihubbarna — där har varje kategori en egen
// bild och egen text för samma uppdrag: ljudhubben lyfter ljudet, ljushubben
// ljuset. Caset äger fakta, hubben äger vinkeln.
//
// Kräver SUPABASE_URL + SUPABASE_SERVICE_KEY. Körs i prebuild.

import fs from 'fs';
import path from 'path';

const OUT_PATH = path.resolve('src/data/event-cases.json');
const HUB_LIMIT = 3;

function log(msg) { console.log(`[event-cases-sync] ${msg}`); }

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
  if (!url || !key) { log('SUPABASE-env saknas — behåller befintlig event-cases.json'); return; }

  let cats, cases, images, hubRows;
  try {
    [cats, cases, images, hubRows] = await Promise.all([
      get(url, key, 'content_categories?active=eq.true&order=sort_order.asc&select=slug,source_categories'),
      get(url, key, 'event_cases?active=eq.true&order=sort_order.asc&select=id,label,descr,tag,categories,sort_order'),
      get(url, key, 'event_case_images?order=sort_order.asc&select=case_id,src,alt,in_gallery,sort_order'),
      get(url, key, 'event_case_hub?order=sort_order.asc&select=case_id,category,image_src,label,descr,alt,pos,sort_order'),
    ]);
  } catch (e) { log(`${e.message} — behåller befintlig fil`); return; }

  if (!Array.isArray(cases) || cases.length === 0) {
    log('Inga aktiva case i DB — behåller befintlig fil (skriver ej tom lista)');
    return;
  }

  const imgsByCase = new Map();
  for (const im of images) {
    if (!imgsByCase.has(im.case_id)) imgsByCase.set(im.case_id, []);
    imgsByCase.get(im.case_id).push({ src: im.src, alt: im.alt, inGallery: im.in_gallery !== false });
  }

  const outCases = cases.map((c) => ({
    id: c.id,
    label: c.label,
    descr: c.descr,
    tag: c.tag,
    categories: Array.isArray(c.categories) ? c.categories : [],
    // Galleriet visar bara bilder med in_gallery — hubb-bilder som inte hör
    // hemma i rotationen filtreras bort här men finns kvar för hubbraderna.
    images: (imgsByCase.get(c.id) ?? []).filter((i) => i.inGallery).map(({ src, alt }) => ({ src, alt })),
    allImages: imgsByCase.get(c.id) ?? [],
  }));
  const byId = new Map(outCases.map((c) => [c.id, c]));

  const utanBild = outCases.filter((c) => c.images.length === 0).map((c) => c.id);
  if (utanBild.length) log(`VARNING: case utan bilder hoppas över: ${utanBild.join(', ')}`);
  const renderable = outCases.filter((c) => c.images.length > 0);

  // Hubbrader — bilden måste finnas bland casets bilder, annars hoppas raden över.
  const hub = {};
  for (const c of cats) hub[c.slug] = [];
  for (const h of hubRows) {
    const c = byId.get(h.case_id);
    if (!c) continue;
    const img = c.allImages.find((i) => i.src === h.image_src);
    if (!img) { log(`VARNING: ${h.case_id}/${h.category} pekar på bild som inte hör till caset — hoppas över`); continue; }
    (hub[h.category] ??= []).push({
      caseId: c.id,
      label: h.label || c.label,     // hubben får ha egen rubrik
      descr: h.descr || c.descr,     // ...egen text
      src: img.src,
      alt: h.alt || img.alt,         // ...och egen alt-text
      pos: h.pos ?? null,
    });
  }
  // Kategorier som hämtar från andra (ljud-och-ljus) ärver deras hubbrader.
  for (const c of cats) {
    const src = Array.isArray(c.source_categories) ? c.source_categories : [];
    if (src.length) hub[c.slug] = src.flatMap((s) => hub[s] ?? []).slice(0, HUB_LIMIT);
  }

  for (const c of renderable) delete c.allImages;
  fs.writeFileSync(OUT_PATH, JSON.stringify({ cases: renderable, hub }, null, 2) + '\n', 'utf8');
  const n = Object.entries(hub).filter(([, v]) => v.length).map(([k, v]) => `${k}:${v.length}`).join(' ');
  log(`Skrev ${renderable.length} case och hubbrader (${n || 'inga'}) till event-cases.json`);
}

main().catch((e) => { log(`Oväntat fel: ${e.message} — behåller befintlig fil`); });
