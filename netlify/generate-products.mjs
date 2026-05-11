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
const OUT_JSON  = path.join(ROOT, 'src/data/quote-catalog.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
}

const scenes = readJson('scenes.json');
const ljud   = readJson('ljud.json');
const ljus   = readJson('ljus.json');
const dj     = readJson('dj.json');
const bild   = readJson('bild.json');
const karaoke = readJson('karaoke.json');

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
  if (p.id && p.price) cartLines.push(cartLine(p.name, p.artno || `scen-${p.id}`, p.price));
});
(scenes.modules || []).forEach(p => {
  if (p.artno && p.price) cartLines.push(cartLine(p.name, p.artno, p.price));
});

// Ljud: event, live, music, portable, mixers
['event','live','music','portable'].forEach(sec => {
  (ljud[sec]?.products || []).forEach(p => {
    if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
  });
});
(ljud.mixers || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});

// Ljud mikrofon tillbehör (bara om slug finns)
const miks = Array.isArray(ljud.tillbehor_mikrofon)
  ? ljud.tillbehor_mikrofon
  : (ljud.tillbehor_mikrofon?.products || []);
miks.forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});

// Ljus: paket, effekter, rok products + rok tillbehor
(ljus.paket?.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});
(ljus.effekter?.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});
(ljus.rok?.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});
(ljus.rok?.tillbehor || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});

// DJ utrustning
Object.values(dj.equipment || {}).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});
// DJ paket
(dj.packages || []).forEach(p => {
  if (p.artno && p.price) cartLines.push(cartLine(p.name, p.artno, p.price));
});

// Karaoke paket
(karaoke.packages || []).forEach(p => {
  if (p.artno && p.price) cartLines.push(cartLine(p.name, p.artno, p.price));
});

// Ljud — tekniker/tjänster
(ljud.services || []).forEach(p => {
  if (p.artno && p.price) cartLines.push(cartLine(p.name, p.artno, p.price));
});

// Bild
(bild.products || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});
(bild.dukar || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
});
(bild.tillbehor || []).forEach(p => {
  if (p.slug && p.price) cartLines.push(cartLine(p.name, p.artno || p.slug || p.id, p.price));
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
if (scenes.modules?.length) {
  sects.push('Plattformsmoduler för egen scen-konfiguration:');
  scenes.modules.forEach(m => {
    sects.push(prodLine(m.name, m.price, '/dygn'));
  });
}
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
sects.push('DJ-PAKET (inkl. ljud & ljus) → /vara-tjanster/hyra-dj/');
(dj.packages || []).forEach(p => {
  sects.push(prodLine(p.name + ' (' + p.tagline + ')', p.price, ' exkl. moms'));
});
sects.push('');

// Karaoke
sects.push('KARAOKE-PAKET → /vara-tjanster/hyra-karaoke/');
(karaoke.packages || []).forEach(p => {
  sects.push(prodLine(p.name + ' (' + p.tagline + ')', p.price, ' exkl. moms'));
});
sects.push('');

// TEKNIKER & TJÄNSTER
if (ljud.services?.length) {
  sects.push('TEKNIKER/TJÄNSTER LJUD → /vara-tjanster/hyra-ljud/live/');
  ljud.services.forEach(p => { sects.push(prodLine(p.name, p.price, p.priceNote || '/tim')); });
  sects.push('');
}
if (bild.services?.length) {
  sects.push('TEKNIKER/TJÄNSTER BILD → /vara-tjanster/hyra-bild-projektorer-skarmar/');
  bild.services.forEach(p => { sects.push(prodLine(p.name, p.price, p.priceNote || '/tim')); });
  sects.push('');
}

// PROJEKTOR & SKÄRM
sects.push('PROJEKTOR & SKÄRM → /vara-tjanster/hyra-bild-projektorer-skarmar/');
(bild.products || []).forEach(p => {
  if (p.price) sects.push(prodLine(p.name, p.price, '/dygn'));
});
sects.push('');

// PROJEKTORDUKAR
if (bild.dukar?.length) {
  sects.push('PROJEKTORDUKAR → /vara-tjanster/hyra-bild-projektorer-skarmar/');
  bild.dukar.forEach(p => {
    if (p.price) sects.push(prodLine(p.name, p.price, '/dygn'));
  });
  sects.push('');
}

const PRODUKTER_OCH_PRISER = sects.join('\n');

// ── QUOTE_CATALOG (för admin-panelens produktväljare) ─────────────────────────
// Struktur: Scen | Scentillbehör | Ljud | Ljudtillbehör | Ljus | Ljustillbehör | DJ | Bild | Tjänster
function qp(p) {
  return { id: p.artno || p.slug || p.id || '', artno: p.artno||'', name: p.name, price: p.price || 0 };
}
const QUOTE_CAT = {};
const frakt = readJson('tjanster.json');

// Scen
QUOTE_CAT['Scen'] = { sub: {
  'Färdiga paket':     scenes.products.filter(p=>p.price).map(p=>({id:p.artno||('scen-'+p.id),artno:p.artno||'',name:p.name,price:p.price})),
  'Plattformsmoduler': (scenes.modules||[]).filter(p=>p.price).map(p=>({id:p.artno||p.slug,artno:p.artno||'',name:p.name,price:p.price})),
}};
QUOTE_CAT['Scentillbehör'] = { products: (scenes.tillbehor||scenes.accessories||[]).filter(p=>p.price).map(p=>({id:p.artno||p.slug||'scen-acc',artno:p.artno||'',name:p.name,price:p.price})) };

// Ljud (paket + mixers)
QUOTE_CAT['Ljud'] = { sub: {
  'Portable': (ljud.portable?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Event':    (ljud.event?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Music':    (ljud.music?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Live':     (ljud.live?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Mixers':   (ljud.mixers||[]).filter(p=>p.slug&&p.price).map(qp),
}};

// Ljudtillbehör (mikrofoner + kabel/tillbehör + el)
QUOTE_CAT['Ljudtillbehör'] = { sub: {
  'Mikrofoner':        (ljud.mikrofoner||[]).filter(p=>p.artno||p.slug).map(qp),
  'Kabel & tillbehör': (ljud.tillbehor_mikrofon||[]).filter(p=>p.artno||p.slug).map(qp),
  'Övriga tillbehör':  (ljud.tillbehor_ljud||[]).filter(p=>p.artno||p.slug).map(qp),
  'El-tillbehör':      (ljud.tillbehor_el||[]).filter(p=>p.artno||p.slug).map(qp),
}};

// Ljus (paket + effekter)
QUOTE_CAT['Ljus'] = { sub: {
  'Färdiga paket':  (ljus.paket?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Lösa effekter':  (ljus.effekter?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Rök & pyro':     (ljus.rok?.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Stativ & tross': (ljus.stativ?.products||[]).filter(p=>p.slug&&p.price).map(qp),
}};

// Ljustillbehör (dmx + stativ-tillbehör + rök-förbrukning + el)
QUOTE_CAT['Ljustillbehör'] = { sub: {
  'DMX-styrning':    (ljus.dmx?.tillbehor||[]).filter(p=>p.artno||p.slug).map(qp),
  'Stativ & fästen': (ljus.stativ?.tillbehor||[]).filter(p=>p.artno||p.slug).map(qp),
  'Rök förbrukning': (ljus.rok?.tillbehor||[]).filter(p=>p.artno||p.slug).map(qp),
  'El-tillbehör':    (ljus.el||[]).filter(p=>p.artno||p.slug).map(qp),
}};

// DJ
QUOTE_CAT['DJ'] = { products: [
  ...Object.values(dj.equipment||{}).filter(p=>p.slug&&p.price).map(qp),
  ...(dj.packages||[]).filter(p=>p.artno&&p.price).map(p=>({artno:p.artno,name:p.name,price:p.price}))
]};

// Karaoke
QUOTE_CAT['Karaoke'] = { products:
  (karaoke.packages||[]).filter(p=>p.artno&&p.price).map(p=>({artno:p.artno,name:p.name,price:p.price}))
};

// Bild
QUOTE_CAT['Bild'] = { sub: {
  'Projektorer & skärmar': (bild.products||[]).filter(p=>p.slug&&p.price).map(qp),
  'Projektordukar':        (bild.dukar||[]).filter(p=>p.slug&&p.price).map(qp),
  'Tillbehör':             (bild.tillbehor||[]).filter(p=>p.slug&&p.price).map(qp),
}};

// Tjänster
// Leverans-poster genereras dynamiskt från frakt.leverans — plockar alla leverans-keys
// utom meta-nycklar (label/description/zon/selection_rules). Garanterar att nya transporttyper
// (storbil, storbil_slap, extern_lev …) automatiskt syns i quote-catalog utan att denna fil ändras.
const _LEV_META = new Set(['label', 'description', 'zon', 'selection_rules']);
const _levProducts = Object.entries(frakt.leverans||{})
  .filter(([k,v]) => !_LEV_META.has(k) && v && typeof v === 'object' && v.pris)
  .flatMap(([k,v]) => {
    const rows = [{ id: v.artno || v.id, name: 'Leverans — ' + v.label, price: v.pris }];
    if (v.enkel && v.enkel.pris) {
      rows.push({ id: v.enkel.artno || v.enkel.id, name: 'Leverans — ' + v.enkel.label, price: v.enkel.pris });
    }
    return rows;
  });

QUOTE_CAT['Tjänster'] = { products: [
  ..._levProducts,
  {id:frakt.montering.artno||'SK-TJN-0001', name:'Montering & demontering (600 kr/tim)', price:frakt.montering.prisPerTimme},
  ...(frakt.fakturaavgift?.options||[]).map(f=>({id:f.artno||f.id,name:f.label,price:f.pris})),
]};
// Alias för bakåtkompatibilitet med äldre ordrar
QUOTE_CAT['Tillägg'] = QUOTE_CAT['Tjänster'];
QUOTE_CAT['Eigen rad'] = { products: [{id:'custom',artno:'',name:'Ange benämning och pris →',price:0,type:'product',custom:true}] };

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
// OBS: quote-catalog.json skrivs av generate-quote-catalog.py — inte här

const cartCount = cartLines.length;
const prodCount = sects.filter(l => l.startsWith('-')).length;
console.log(`✅ _products-generated.js: ${cartCount} cart-IDs, ${prodCount} produktrader, ${qcCount} poster i QUOTE_CATALOG`);
