// netlify/generate-products.mjs
// Körs vid byggtid: läser src/data/*.json → genererar netlify/functions/_products-generated.js
// Lägg till i netlify.toml build-kommando FÖRE npm run build

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const DATA      = path.join(ROOT, 'src/data');
const OUT       = path.join(__dirname, 'functions/_products-generated.js');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
}

const scenes = readJson('scenes.json');
const ljud   = readJson('ljud.json');
const ljus   = readJson('ljus.json');
const dj     = readJson('dj.json');
const bild   = readJson('bild.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(p) {
  return p.toLocaleString('sv-SE') + ' kr';
}

function cartLine(name, cartId, price) {
  return `${name} → ${cartId} → ${fmtPrice(price)}`;
}

function prodLine(name, price, priceNote, extra) {
  const unit = priceNote || '/dygn';
  const tail = extra ? ` — ${extra}` : '';
  return `- ${name}: ${fmtPrice(price)}${unit}${tail}`;
}

// ── CART-ID-LISTA ─────────────────────────────────────────────────────────────

const cartLines = [];

// Scen
scenes.products.forEach(p => {
  if (p.id && p.price) cartLines.push(cartLine(p.name, `scen-${p.id}`, p.price));
});

// Ljud: event, live, music, portable, mixers
['event','live','music','portable'].forEach(sec => {
  (ljud[sec]?.products || []).forEach(p => {
    if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
  });
});
(ljud.mixers || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});

// Ljud mikrofon tillbehör (bara om slug finns)
const miks = Array.isArray(ljud.tillbehor_mikrofon)
  ? ljud.tillbehor_mikrofon
  : (ljud.tillbehor_mikrofon?.products || []);
miks.forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});

// Ljus: paket, effekter, rok products + rok tillbehor
(ljus.paket?.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});
(ljus.effekter?.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});
(ljus.rok?.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});
(ljus.rok?.tillbehor || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});

// DJ utrustning
Object.values(dj.equipment || {}).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});

// Bild
(bild.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});
(bild.tillbehor || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.slug, p.price));
});

const CART_ID_LISTA = cartLines.join('\n');

// ── PRODUKTER & PRISER ────────────────────────────────────────────────────────

const sects = [];

// SCEN
sects.push('SCEN → /vara-tjanster/hyra-scen/');
scenes.products.forEach(p => {
  const dim  = p.dimensions ? ` (${p.dimensions}${p.size ? ', ' + p.size : ''})` : '';
  const pers = p.persons ? ` — ${p.persons}` : '';
  sects.push(prodLine(`${p.name}${dim}`, p.price, '/dygn', pers.trim() || undefined));
});
if (scenes.accessories?.length) {
  const accStr = scenes.accessories.map(a => `${a.name} ${fmtPrice(a.price)}`).join(', ');
  sects.push(`Tillbehör: ${accStr}`);
}
sects.push('Tumregel: 2–3 m² per person på scen.\n');

// LJUD EVENT
sects.push('LJUD EVENT → /vara-tjanster/hyra-ljud/event/');
(ljud.event?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn', p.persons));
});
sects.push('');

// LJUD LIVE
sects.push('LJUD LIVE → /vara-tjanster/hyra-ljud/live/');
(ljud.live?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn', p.persons));
});
sects.push('');

// LJUD PORTABELT
sects.push('LJUD PORTABELT → /vara-tjanster/hyra-ljud/portable/');
(ljud.portable?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn', p.persons));
});
sects.push('');

// LJUD MUSIK/DANS
sects.push('LJUD MUSIK/DANS → /vara-tjanster/hyra-ljud/music/');
(ljud.music?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn', p.persons));
});
sects.push('');

// MIXERBORD
if (ljud.mixers?.length) {
  sects.push('MIXERBORD (tillbehör till ovan)');
  ljud.mixers.forEach(p => {
    if (p.price) sects.push(prodLine(p.name, p.price, '/dygn'));
  });
  sects.push('');
}

// LJUS PAKET
sects.push('LJUS PAKET → /vara-tjanster/hyra-ljus/fardiga-paket/');
(ljus.paket?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn', p.persons));
});
sects.push('');

// LJUS EFFEKTER
sects.push('LJUS EFFEKTER → /vara-tjanster/hyra-ljus/ljuseffekter/');
(ljus.effekter?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, p.priceNote || '/dygn'));
});
sects.push('');

// LJUS RÖK & PYRO
sects.push('LJUS RÖK & PYRO → /vara-tjanster/hyra-ljus/rok-pyro/');
(ljus.rok?.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, p.priceNote || '/dygn'));
});
if (ljus.rok?.tillbehor?.length) {
  sects.push('Förbrukningsvaror:');
  ljus.rok.tillbehor.forEach(p => {
    if (p.price) sects.push(`  - ${p.name}: ${fmtPrice(p.price)}`);
  });
}
sects.push('');

// DJ
sects.push('DJ-UTRUSTNING → /vara-tjanster/hyra-dj/');
Object.values(dj.equipment || {}).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn'));
});
sects.push('');

// PROJEKTOR & SKÄRM
sects.push('PROJEKTOR & SKÄRM → /vara-tjanster/hyra-bild-projektorer-skarmar/');
(bild.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn'));
});
sects.push('');

const PRODUKTER_OCH_PRISER = sects.join('\n');

// ── QUOTE_CATALOG (för admin-panelens produktväljare) ─────────────────────────
function qp(p) {
  return { id: p.slug || ('scen-' + p.id) || '', name: p.name, price: p.price || 0 };
}
const QUOTE_CAT = {};
const frakt = readJson('frakt.json');

QUOTE_CAT['Scen'] = { products: scenes.products.filter(p=>p.price).map(p=>({id:'scen-'+p.id,name:p.name,price:p.price})) };
QUOTE_CAT['Scen tillbehör'] = { products: (scenes.accessories||[]).filter(p=>p.price).map(p=>({id:p.artno||'scen-acc',name:p.name,price:p.price})) };

QUOTE_CAT['Ljud'] = { sub: {} };
['event','live','music','portable'].forEach(sec => {
  const lbl = {event:'Event',live:'Live',music:'Music',portable:'Portable'}[sec];
  QUOTE_CAT['Ljud'].sub[lbl] = (ljud[sec]?.products||[]).filter(p=>p.slug&&p.price).map(qp);
});
QUOTE_CAT['Ljud'].sub['Mixers'] = (ljud.mixers||[]).filter(p=>p.slug&&p.price).map(qp);
const miksQ = miks.filter(p=>p.slug&&p.price).map(qp);
if (miksQ.length) QUOTE_CAT['Ljud'].sub['Mikrofoner'] = miksQ;

QUOTE_CAT['Ljus'] = { sub: {} };
QUOTE_CAT['Ljus'].sub['Färdiga paket'] = (ljus.paket?.products||[]).filter(p=>p.slug&&p.price).map(qp);
QUOTE_CAT['Ljus'].sub['Effekter']      = (ljus.effekter?.products||[]).filter(p=>p.slug&&p.price).map(qp);
QUOTE_CAT['Ljus'].sub['Rök & pyro']   = (ljus.rok?.products||[]).filter(p=>p.slug&&p.price).map(qp);
QUOTE_CAT['Ljus'].sub['Rök tillbehör']= (ljus.rok?.tillbehor||[]).filter(p=>p.slug&&p.price).map(qp);
QUOTE_CAT['Ljus'].sub['Stativ & tross']= (ljus.stativ?.products||[]).filter(p=>p.slug&&p.price).map(qp);

QUOTE_CAT['DJ'] = { products: Object.values(dj.equipment||{}).filter(p=>p.slug&&p.price).map(qp) };
QUOTE_CAT['Bild'] = { products: [...(bild.products||[]),...(bild.tillbehor||[])].filter(p=>p.slug&&p.price).map(qp) };

QUOTE_CAT['Tjänster'] = { products: [
  {id:frakt.leverans.standard.id,   name:'Leverans — Vanlig bil (t&r)',      price:frakt.leverans.standard.pris},
  {id:frakt.leverans.standard.id+'-e', name:'Leverans — Vanlig bil (enkel)', price:frakt.leverans.standard.enkelresa},
  {id:frakt.leverans.skrymmande.id, name:'Leverans — Bil med släp (t&r)',    price:frakt.leverans.skrymmande.pris},
  {id:frakt.leverans.skrymmande.id+'-e',name:'Leverans — Bil med släp (enkel)',price:frakt.leverans.skrymmande.enkelresa},
  {id:frakt.leverans.lastbil.id,    name:'Leverans — Lastbil (t&r)',         price:frakt.leverans.lastbil.pris},
  {id:frakt.leverans.lastbil.id+'-e',  name:'Leverans — Lastbil (enkel)',    price:frakt.leverans.lastbil.enkelresa},
  {id:'montering-tim', name:'Montering & demontering (600 kr/tim)', price:frakt.montering.prisPerTimme},
  {id:'fakturaavgift-49', name:'Fakturaavgift', price:49},
  {id:'fakturaavgift-29', name:'Fakturaavgift (reducerad)', price:29},
]};

const QUOTE_CATALOG_JS = JSON.stringify(QUOTE_CAT);
const qcCount = Object.values(QUOTE_CAT).reduce((n,v)=>n+(v.products?.length||0)+Object.values(v.sub||{}).reduce((m,a)=>m+a.length,0),0);

// ── Skriv ut-fil ──────────────────────────────────────────────────────────────

const output = `// AUTOGENERERAD — redigera inte manuellt
// Källa: src/data/*.json | Generator: netlify/generate-products.mjs
// ${new Date().toISOString()}

export const CART_ID_LISTA = ${JSON.stringify(CART_ID_LISTA)};
export const PRODUKTER_OCH_PRISER = ${JSON.stringify(PRODUKTER_OCH_PRISER)};
export const QUOTE_CATALOG = ${QUOTE_CATALOG_JS};
`;

fs.writeFileSync(OUT, output, 'utf8');

const cartCount = cartLines.length;
const prodCount = sects.filter(l => l.startsWith('-')).length;
console.log(`✅ _products-generated.js: ${cartCount} cart-IDs, ${prodCount} produktrader, ${qcCount} poster i QUOTE_CATALOG`);
