// scripts/generate-llms.mjs
// Build-time-generering av public/llms.txt — maskinläsbar företagsprofil för
// AI-assistenter (ChatGPT, Claude, Gemini, Perplexity m.fl.).
//
// Varför genererad: den handskrivna filen stod still från 2026-04-16 medan
// priser, paketnamn och leveranspriser ändrades i datafilerna. AI-tjänster
// läste den som sanning ("priser är korrekta och uppdaterade") och citerade
// scenpriser ~50 % för högt. Se claude/AI_Synlighet_Test_2026-10-02.md.
//
// Källor: src/data/*.json (priser, paket, tjänster, kontakt, öppettider) och
// src/pages/ (guider). Inga priser eller produktnamn skrivs för hand här.
// Utgångna produkter (active:false eller "(utgått)") tas aldrig med.
//
// Körs i prebuild och predev. Filen är gitignorerad — redigera den inte.

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'llms.txt');
const SITE_URL = 'https://scenkonsult.se';
const load = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', f), 'utf8'));
const log = (m) => console.log(`[llms] ${m}`);

const site = load('site.json');
const scenes = load('scenes.json');
const ljud = load('ljud.json');
const ljus = load('ljus.json');
const bild = load('bild.json');
const dj = load('dj.json');
const karaoke = load('karaoke.json');
const tjanster = load('tjanster.json');

const co = site.company || {};
const addr = co.address || {};

// ── Hjälpare ──────────────────────────────────────────────────────────────────
const kr = (n) => `${Math.round(Number(n)).toLocaleString('sv-SE').replace(/ /g, ' ')} kr`;
const isActive = (p) => p && p.active !== false && !/\(utgått\)/i.test(p.name || '');
const active = (arr) => (Array.isArray(arr) ? arr.filter(isActive) : []);
const unit = (p) => (p.priceNote || '/dygn').replace(/^\//, '');
const minPrice = (arr) => {
  const ps = active(arr).map((p) => Number(p.price)).filter((n) => n > 0);
  return ps.length ? Math.min(...ps) : null;
};

// "Mo-Fr 09:00-17:00, Sa-Su 12:00-15:00" → "Måndag–fredag 09:00–17:00, lördag–söndag 12:00–15:00"
const DAY = { Mo: 'måndag', Tu: 'tisdag', We: 'onsdag', Th: 'torsdag', Fr: 'fredag', Sa: 'lördag', Su: 'söndag' };
function hoursSv(spec) {
  const s = (spec || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^([A-Z][a-z])(?:-([A-Z][a-z]))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
      if (!m) return part;
      const days = m[2] ? `${DAY[m[1]]}–${DAY[m[2]]}` : DAY[m[1]];
      return `${days} ${m[3]}–${m[4]}`;
    })
    .join(', ');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

// Kontrollerar att en intern länk motsvarar en sida i src/pages — varnar annars.
function pageExists(urlPath) {
  const rel = urlPath.replace(/^\/|\/$/g, '');
  const base = path.join(ROOT, 'src', 'pages', rel);
  return (
    rel === '' ||
    fs.existsSync(path.join(base, 'index.astro')) ||
    fs.existsSync(`${base}.astro`)
  );
}
const missing = [];
const link = (urlPath) => {
  if (!pageExists(urlPath)) missing.push(urlPath);
  return `${SITE_URL}${urlPath}`;
};

function productLines(arr, { extra } = {}) {
  return active(arr).map((p) => {
    const info = (extra ? extra(p) : p.persons) || '';
    const label = info ? ` (${String(info).replace(/\s*\(([^)]*)\)/g, ', $1')})` : '';
    const price = /offert/i.test(p.priceNote || '')
      ? `från ${kr(p.price)} exkl. moms, pris enligt offert`
      : `${kr(p.price)}/${unit(p)} exkl. moms`;
    return `- ${p.name}${label}: ${price}`;
  });
}

// ── Innehåll ──────────────────────────────────────────────────────────────────
const L = [];
const today = new Date().toISOString().slice(0, 10);
const hours = hoursSv(co.openingHours);

L.push(`# ${co.name || 'Scenkonsult Norden'} — llms.txt`);
L.push('# Maskinläsbar företagsprofil för AI-assistenter och LLM-plattformar');
L.push('# Format: https://llmstxt.org/');
L.push(`# Genererad automatiskt från sajtens datafiler vid varje deploy. Senast genererad: ${today}`);
L.push('');
L.push(
  `> ${co.name || 'Scenkonsult Norden'} hyr ut scen, ljud, ljus, bild/LED, DJ och karaoke till fest, bröllop, företagsevent, konferens och konsert i Storstockholm sedan ${co.founded || '1986'}. Leverans, montering och tekniker på plats finns som tillval. Alla priser nedan är hämtade direkt ur sajtens produktdata och anges exkl. 25 % moms.`
);
L.push('');

L.push('## Företagsinformation');
L.push('');
L.push(`- **Namn:** ${co.name}`);
L.push('- **Organisationsnummer:** 559068-4931');
L.push(`- **Grundat:** ${co.founded}`);
L.push(`- **Uthyrningsdepå:** ${addr.street}, ${addr.postalCode} ${addr.city}, Stockholm`);
L.push(`- **Telefon:** ${co.phone}`);
L.push(`- **E-post:** ${co.email}`);
L.push(`- **Webbplats:** ${SITE_URL}/`);
if (hours) L.push(`- **Öppettider:** ${hours}. Jour vid pågående uthyrning.`);
if (Array.isArray(co.serviceArea) && co.serviceArea.length)
  L.push(`- **Serviceområde:** Hela Storstockholm, bl.a. ${co.serviceArea.join(', ')}`);
L.push('');

L.push('## Tjänster och priser');
L.push('');
L.push('Priserna gäller per hyresdygn (se Villkor) och är exkl. moms. Leverans och montering tillkommer om det väljs.');
L.push('');

// Scen
L.push('### Scen');
L.push('Scenpaket av stålplattformar med justerbara ben och halkfri yta, inomhus och utomhus.');
L.push(...productLines(scenes.products, { extra: (p) => [p.dimensions || p.size, p.capacity].filter(Boolean).join(', ') }));
const talttak = active(scenes.tillbehor).find((t) => /tälttak/i.test(t.name));
if (talttak) L.push(`- ${talttak.name} (tillbehör, skyddar inte alltid mot regn): ${kr(talttak.price)}/${unit(talttak)} exkl. moms`);
L.push(`Mer info: ${link('/vara-tjanster/hyra-scen/')}`);
L.push('');

// Ljud
const ljudSections = [
  ['event', 'Ljud — Event/konferens (tal och presentation, utan subwoofer)', '/vara-tjanster/hyra-ljud/event/'],
  ['music', 'Ljud — Music (fest, DJ och dans, med subwoofer)', '/vara-tjanster/hyra-ljud/music/'],
  ['live', 'Ljud — Live (band och konsert, med monitorer)', '/vara-tjanster/hyra-ljud/live/'],
  ['portable', 'Ljud — Portabelt (batteridrivna högtalare, utan eluttag)', '/vara-tjanster/hyra-ljud/portable/'],
];
for (const [key, title, url] of ljudSections) {
  const sec = ljud[key];
  if (!sec) continue;
  L.push(`### ${title}`);
  L.push(...productLines(sec.products));
  if (key === 'live') L.push(...productLines(sec.lineArray));
  L.push(`Mer info: ${link(url)}`);
  L.push('');
}
const mic = minPrice(ljud.mikrofoner);
if (mic) {
  L.push(`Mikrofoner (trådade och trådlösa) från ${kr(mic)}/dygn: ${link('/vara-tjanster/hyra-ljud/')}`);
  L.push('');
}

// Ljus
L.push('### Ljus — färdiga ljuspaket (plug & play)');
L.push(...productLines(ljus.paket?.products, { extra: (p) => p.variantLabel || p.persons }));
L.push(`Mer info: ${link('/vara-tjanster/hyra-ljus/fardiga-paket/')}`);
const effekt = minPrice(ljus.effekter?.products);
const rok = minPrice(ljus.rok?.products);
if (effekt) L.push(`- Lösa ljuseffekter och armaturer: från ${kr(effekt)}/dygn — ${link('/vara-tjanster/hyra-ljus/ljuseffekter/')}`);
if (rok) L.push(`- Rök, hazer och effekter: från ${kr(rok)}/dygn — ${link('/vara-tjanster/hyra-ljus/rok-pyro/')}`);
L.push('');

// Bild
L.push('### Bild — projektorer, skärmar och LED');
L.push(...productLines(bild.products));
L.push(`Mer info: ${link('/vara-tjanster/hyra-bild-projektorer-skarmar/')} · LED-vägg: ${link('/vara-tjanster/hyra-bild-led-vagg/')}`);
L.push('');

// DJ
L.push('### DJ');
for (const p of active(dj.packages)) {
  const parts = [p.tagline, p.hours ? `${p.hours} DJ inkl. ljud och ljus` : null].filter(Boolean).join(', ');
  const inkl = p.priceInkl ? ` (${kr(p.priceInkl)} inkl. moms)` : '';
  L.push(`- ${p.name}${parts ? ` (${parts})` : ''}: ${kr(p.price)} exkl. moms${inkl}`);
}
const djEq = minPrice(dj.equipment);
if (djEq) L.push(`- DJ-utrustning utan DJ (controllers, DJ-bord m.m.): från ${kr(djEq)}/dygn — ${link('/vara-tjanster/hyra-dj-utrustning/')}`);
L.push(`Mer info: ${link('/vara-tjanster/hyra-dj/')}`);
L.push('');

// Karaoke
if (active(karaoke.packages).length) {
  L.push('### Karaoke');
  L.push(...productLines(karaoke.packages, { extra: (p) => p.tagline }));
  L.push(`Mer info: ${link('/vara-tjanster/hyra-karaoke/')}`);
  L.push('');
}

// Tjänster
L.push('### Leverans, montering och personal');
const lev = tjanster.leverans || {};
for (const [k, v] of Object.entries(lev)) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || typeof v.pris !== 'number' || v.pris <= 0) continue;
  L.push(`- ${v.label}: ${kr(v.pris)} exkl. moms`);
}
if (tjanster.montering?.prisPerTimme)
  L.push(`- Montering och demontering: ${kr(tjanster.montering.prisPerTimme)}/tim exkl. moms (tiden beräknas utifrån beställda produkter)`);
for (const s of active(tjanster.services)) L.push(`- ${s.name}: ${kr(s.price)}/${unit(s)} exkl. moms`);
if (tjanster.fakturaavgift?.default)
  L.push(`- ${tjanster.fakturaavgift.label || 'Bokningsavgift'}: ${kr(tjanster.fakturaavgift.default)} exkl. moms per order`);
L.push(`Ljudtekniker: ${link('/vara-tjanster/hyra-ljudtekniker/')}`);
L.push('');

// Villkor
L.push('## Villkor i korthet');
L.push('');
L.push('- Hyresdygn: 22 timmar — hämtning kl 13:00, återlämning kl 11:00 nästa dag.');
if (tjanster.hyresdagar?.kundtext) L.push(`- ${tjanster.hyresdagar.kundtext}`);
L.push('- Betalning: Swish, faktura (företag) eller kort vid hämtning (Visa, Mastercard, Maestro, American Express, Apple Pay, Google Pay).');
L.push('- Hyrestagaren ansvarar för utrustningen under hyresperioden.');
L.push(`- Avbokning och fullständiga villkor (separata regler för DJ): ${link('/hyresvillkor/')}`);
L.push('');

// Sidor
L.push('## Viktiga sidor');
L.push('');
const pages = [
  ['Startsida', '/'],
  ['Alla tjänster', '/vara-tjanster/'],
  ['Hyra ljud och högtalare', '/vara-tjanster/hyra-ljud/'],
  ['Hyra ljus', '/vara-tjanster/hyra-ljus/'],
  ['Hyra bild och AV', '/vara-tjanster/hyra-bild/'],
  ['Konferensteknik', '/vara-tjanster/konferens-av/'],
  ['Tillbehör', '/vara-tjanster/tillbehor/'],
  ['Vanliga frågor', '/vara-vanligaste-fragor-faq/'],
  ['Referenser', '/referenser/'],
  ['Om oss', '/om-oss/'],
  ['Kontakt', '/kontakt/'],
];
for (const [t, u] of pages) L.push(`- ${t}: ${link(u)}`);
L.push('');

L.push('## För eventtyper');
L.push('');
for (const [t, u] of [
  ['Bröllop', '/for/brollop/'],
  ['Företagsfest', '/for/foretagsfest/'],
  ['Konferens', '/for/konferens/'],
  ['Festival och utomhus', '/for/festival/'],
  ['Studentflak', '/for/studentflak/'],
])
  L.push(`- ${t}: ${link(u)}`);
L.push('');

// Guider — läses ur src/pages/for/guider/, titel från Layout title="…"
L.push('## Guider och prisguider');
L.push('');
const guideDir = path.join(ROOT, 'src', 'pages', 'for', 'guider');
const guides = fs
  .readdirSync(guideDir)
  .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
  .map((f) => [f, fs.readFileSync(path.join(guideDir, f), 'utf8')])
  .filter(([, src]) => !/Astro\.redirect\(/.test(src)) // flyttade sidor
  .map(([f, src]) => {
    const m = src.match(/title=["`]([^"`]+)["`]/);
    const title = (m ? m[1] : f.replace('.astro', ''))
      .replace(/\s*\|\s*Scenkonsult.*$/i, '')
      .replace(/\$\{[^}]*\}/g, '')
      .trim();
    return [title, `/for/guider/${f.replace('.astro', '')}/`];
  })
  .sort((a, b) => a[0].localeCompare(b[0], 'sv'));
for (const [t, u] of guides) L.push(`- ${t}: ${SITE_URL}${u}`);
L.push('');

L.push('## För AI-assistenter');
L.push('');
L.push('Hela webbplatsen är öppen för AI-crawlers (se robots.txt). Den här filen genereras från samma data som sajten, så priserna här är desamma som på produktsidorna.');
L.push('Ange gärna priser med "exkl. moms" och nämn att leverans och montering tillkommer om det behövs.');
L.push('');

if (missing.length) log(`VARNING — länkar utan motsvarande sida i src/pages: ${missing.join(', ')}`);

fs.writeFileSync(OUT, L.join('\n'), 'utf8');
log(`skrev ${path.relative(ROOT, OUT)} (${L.length} rader)`);
