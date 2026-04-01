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

// ── Skriv ut-fil ──────────────────────────────────────────────────────────────

const output = `// AUTOGENERERAD — redigera inte manuellt
// Källa: src/data/*.json | Generator: netlify/generate-products.mjs
// ${new Date().toISOString()}

export const CART_ID_LISTA = ${JSON.stringify(CART_ID_LISTA)};
export const PRODUKTER_OCH_PRISER = ${JSON.stringify(PRODUKTER_OCH_PRISER)};
`;

fs.writeFileSync(OUT, output, 'utf8');

const cartCount = cartLines.length;
const prodCount = sects.filter(l => l.startsWith('-')).length;
console.log(`✅ _products-generated.js: ${cartCount} cart-IDs, ${prodCount} produktrader`);
