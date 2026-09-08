// test/produktregister.test.mjs
//
// Vakter mot två fel som redan hänt en gång (2026-09-08):
//
//  1. Svens tre register byggdes var för sig och drev isär. Hela
//     ljus.stativ.tillbehor och hela el.json nådde aldrig chatten — Sven
//     kunde prata om en Half Coupler men inte lägga den i varukorgen, och
//     taggade han den ändå filtrerades den bort tyst i formatMsg().
//
//  2. Fraktpriser skrevs som literaler i sidmallarna. När priserna höjdes i
//     adminpanelen låg 719/799/1099/1299 kvar i varukorgens modal, på
//     kontaktsidan och på alla ortsidor — kunden fick se fel pris.
//
// Kör via `npm test`.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvenProducts, SVEN_SOURCES, cartIdFor } from '../src/lib/sven-products.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f + '.json'), 'utf8'));

const FILES = ['scenes', 'ljud', 'ljus', 'dj', 'bild', 'tjanster', 'karaoke', 'el'];
const data = Object.fromEntries(FILES.map((f) => [f, rd(f)]));
const reg = buildSvenProducts(data);

let pass = 0;
const fails = [];
function check(namn, ok, detalj = '') {
  if (ok) { pass++; console.log('  ✓ ' + namn.padEnd(62) + detalj); }
  else { fails.push(namn + (detalj ? ' — ' + detalj : '')); console.log('  ✗ ' + namn.padEnd(62) + detalj); }
}

console.log('\n1. SVENS PRODUKTREGISTER — täcker alla källor');

for (const src of SVEN_SOURCES) {
  let node = data[src.file];
  for (const seg of src.path) node = node?.[seg];
  const items = Array.isArray(node) ? node : node && typeof node === 'object' ? Object.values(node) : [];
  const priced = items.filter((p) => p && typeof p === 'object' && p.price && p.name);
  const missing = priced.filter((p) => !reg[cartIdFor(p, src.key)]);
  check(`${src.file}.${src.path.join('.')}`, missing.length === 0,
    missing.length ? `${missing.length} utan cart-ID: ${missing.map((m) => m.name).slice(0, 3).join(', ')}`
                   : `${priced.length} st`);
}

console.log('\n2. REGRESSIONSVAKT — samlingarna som saknades 2026-09-08');

for (const [namn, items, key] of [
  ['ljus.stativ.tillbehor', data.ljus.stativ?.tillbehor || [], undefined],
  ['el.products',           data.el.products || [],            undefined],
]) {
  const priced = items.filter((p) => p.price);
  const inReg = priced.filter((p) => reg[cartIdFor(p, key)]);
  check(namn + ' finns i Svens register', inReg.length === priced.length,
    `${inReg.length}/${priced.length}`);
}

console.log('\n3. CART-ID FÖLJER KORTENS HÄRLEDNING (slug || artno)');

// ElTillbehorCard/ProductCard: cartId = slug || artno. Avviker registret
// pekar Svens [CART:]-tagg på en nyckel som frontend inte har.
for (const [namn, items] of [
  ['ljus.stativ.tillbehor', data.ljus.stativ?.tillbehor || []],
  ['bild.tillbehor',        data.bild.tillbehor || []],
  ['el.products',           data.el.products || []],
]) {
  const fel = items.filter((p) => p.price && cartIdFor(p) !== (p.slug || p.artno));
  check(namn, fel.length === 0, fel.length ? `${fel.length} avviker` : '');
}

console.log('\n4. BACKEND OCH FRONTEND ANVÄNDER SAMMA REGISTER');

const genPath = path.join(ROOT, 'netlify/functions/_products-generated.mjs');
if (fs.existsSync(genPath)) {
  const gen = fs.readFileSync(genPath, 'utf8');
  const saknas = Object.keys(reg).filter((id) => !gen.includes(`→ ${id} →`));
  check('varje cart-ID finns i CART_ID_LISTA', saknas.length === 0,
    saknas.length ? `${saknas.length} saknas: ${saknas.slice(0, 5).join(', ')}` : `${Object.keys(reg).length} st`);
} else {
  check('_products-generated.mjs genererad', false, 'kör `npm run generate-catalogs` först');
}

const layout = fs.readFileSync(path.join(ROOT, 'src/layouts/Layout.astro'), 'utf8');
check('Layout.astro bygger via sven-products.mjs', layout.includes('buildSvenProducts'),
  layout.includes('buildSvenProducts') ? '' : 'egen kopia av registret — får inte förekomma');

console.log('\n5. INGA HÅRDKODADE FRAKTPRISER I MALLARNA');

function walk(dir, ut = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ut);
    else if (/\.(astro|ts|js|mjs)$/.test(e.name)) ut.push(p);
  }
  return ut;
}
const kod = ['pages', 'components', 'layouts'].flatMap((d) => walk(path.join(ROOT, 'src', d)));
const traffar = [];
for (const f of kod) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/enkelresa/gi)) {
    const fonster = s.slice(Math.max(0, m.index - 130), m.index + 130)
      .replace(/SK-[A-Z]+-[0-9A-Za-z-]+/g, '');       // artikelnummer är inte priser
    if (/\d[\d\s ]{2,}\s*kr/.test(fonster)) traffar.push(path.relative(ROOT, f));
  }
}
check('fraktpriser läses ur tjanster.json', traffar.length === 0,
  traffar.length ? [...new Set(traffar)].join(', ') : `${kod.length} filer skannade`);

console.log('');
if (fails.length) {
  console.log(`❌ ${fails.length} KONTROLL(ER) MISSLYCKADES\n`);
  fails.forEach((f) => console.log('   - ' + f));
  process.exit(1);
}
console.log(`✅ ALLA ${pass} KONTROLLER GRÖNA`);
