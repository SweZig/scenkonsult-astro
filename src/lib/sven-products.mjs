// src/lib/sven-products.mjs
//
// EN källa till sanning för vilka produkter Sven känner till.
//
// Tre register byggdes tidigare var för sig och drev isär:
//   • window.__SK_PRODUCTS__  (Layout.astro)      — cart-knappen i chattbubblan
//   • CART_ID_LISTA           (generate-products) — vad Sven får [CART:]-tagga
//   • QUOTE_CATALOG           (generate-quote-catalog.py) — offert/order
//
// Resultatet blev att hela ljus.stativ.tillbehor och hela el.json aldrig nådde
// Sven: han kunde prata om en Half Coupler men inte lägga den i varukorgen,
// och taggade han den ändå filtrerades den bort tyst i formatMsg(). Upptäckt
// 2026-09-08, då 30 artiklar saknades.
//
// Lägg till en ny produktsamling HÄR — inte på två ställen.

/** Var produkterna bor. path = nycklar ned i respektive JSON-fil. */
export const SVEN_SOURCES = [
  // Scen
  { file: 'scenes',   path: ['products'],              category: 'Scen',            key: 'scen' },
  { file: 'scenes',   path: ['modules'],               category: 'Scen',            key: 'artno' },
  { file: 'scenes',   path: ['tillbehor'],             category: 'Scen tillbehör' },
  { file: 'scenes',   path: ['pipeDrape'],             category: 'Pipe & Drape' },

  // Ljud
  { file: 'ljud',     path: ['event', 'products'],     category: 'Ljud' },
  { file: 'ljud',     path: ['live', 'products'],      category: 'Ljud' },
  { file: 'ljud',     path: ['music', 'products'],     category: 'Ljud' },
  { file: 'ljud',     path: ['portable', 'products'],  category: 'Ljud' },
  { file: 'ljud',     path: ['mixers'],                category: 'Ljud' },
  { file: 'ljud',     path: ['kolumnNoMic'],           category: 'Ljud' },
  { file: 'ljud',     path: ['mikrofoner'],            category: 'Ljud tillbehör' },
  { file: 'ljud',     path: ['tillbehor_mikrofon'],    category: 'Ljud tillbehör' },
  { file: 'ljud',     path: ['tillbehor_ljud'],        category: 'Ljud tillbehör' },

  // Ljus
  { file: 'ljus',     path: ['paket', 'products'],     category: 'Ljus' },
  { file: 'ljus',     path: ['effekter', 'products'],  category: 'Ljus' },
  { file: 'ljus',     path: ['rok', 'products'],       category: 'Ljus' },
  { file: 'ljus',     path: ['rok', 'tillbehor'],      category: 'Ljus tillbehör' },
  { file: 'ljus',     path: ['stativ', 'products'],    category: 'Stativ & tross' },
  { file: 'ljus',     path: ['stativ', 'tillbehor'],   category: 'Stativ tillbehör' },
  { file: 'ljus',     path: ['dmx', 'tillbehor'],      category: 'DMX-tillbehör' },

  // El — delas av alla ljud- och ljussidor
  { file: 'el',       path: ['products'],              category: 'El-tillbehör' },

  // Bild
  { file: 'bild',     path: ['products'],              category: 'Bild' },
  { file: 'bild',     path: ['dukar'],                 category: 'Bild' },
  { file: 'bild',     path: ['tillbehor'],             category: 'Bild' },

  // DJ
  { file: 'dj',       path: ['equipment'],             category: 'DJ' },
  { file: 'dj',       path: ['packages'],              category: 'DJ-paket',        key: 'artno' },

  // Tjänster & karaoke
  { file: 'tjanster', path: ['services'],              category: 'Tjänster',        key: 'artno' },
  { file: 'karaoke',  path: ['packages'],              category: 'Karaoke',         key: 'artno' },
];

/**
 * Cart-ID för en produkt. MÅSTE följa samma härledning som korten gör
 * (ElTillbehorCard/ProductCard: `slug || artno`), annars pekar Svens
 * [CART:]-tagg på en nyckel som frontend-registret inte har.
 */
export function cartIdFor(p, key) {
  if (key === 'scen')  return p.id ? `scen-${p.id}` : null;
  if (key === 'artno') return p.artno || null;
  return p.slug || p.artno || p.id || null;
}

function at(root, path) {
  let node = root;
  for (const seg of path) {
    if (node == null) return [];
    node = node[seg];
  }
  if (Array.isArray(node)) return node;
  if (node && typeof node === 'object') {
    // ljud.tillbehor_mikrofon har historiskt varit både array och { products: [] }
    if (Array.isArray(node.products)) return node.products;
    return Object.values(node); // dj.equipment
  }
  return [];
}

/**
 * @param {Record<string, any>} data  { scenes, ljud, ljus, dj, bild, tjanster, karaoke, el }
 * @returns {Record<string, {name: string, price: number, category: string}>}
 */
export function buildSvenProducts(data) {
  const out = {};
  for (const src of SVEN_SOURCES) {
    for (const p of at(data[src.file], src.path)) {
      if (!p || typeof p !== 'object' || !p.price || !p.name) continue;
      const id = cartIdFor(p, src.key);
      if (!id) continue;
      out[id] = { name: p.name, price: p.price, category: src.category };
    }
  }
  return out;
}
