// src/lib/produkt-sidor.mjs — vilken sida varje produkt säljs på.
//
// Ren funktion utan JSON-importer, så att både sidorna (via
// src/utils/produktLank.ts) och testerna kan använda den. Sidan följer av var
// produkten ligger i datafilen. En serie utan rad här får ingen länk (null),
// aldrig fel länk.

/** [fil, sökväg i filen, sida, ev. filter]. Ordningen spelar roll: första träffen vinner. */
export const SIDOR = [
  ['ljud', ['event', 'products'], '/vara-tjanster/hyra-ljud/event/'],
  ['ljud', ['live', 'products'], '/vara-tjanster/hyra-ljud/live/'],
  ['ljud', ['live', 'lineArray'], '/vara-tjanster/hyra-ljud/live/'],
  ['ljud', ['music', 'products'], '/vara-tjanster/hyra-ljud/music/'],
  ['ljud', ['portable', 'products'], '/vara-tjanster/hyra-ljud/portable/'],
  ['ljud', ['kolumnNoMic'], '/vara-tjanster/hyra-ljud/kolumnhogtalare/'],
  ['ljus', ['paket', 'products'], '/vara-tjanster/hyra-ljus/fardiga-paket/'],
  ['ljus', ['effekter', 'products'], '/vara-tjanster/hyra-ljus/ljuseffekter/'],
  ['ljus', ['rok', 'products'], '/vara-tjanster/hyra-ljus/rok-pyro/'],
  ['ljus', ['rok', 'tillbehor'], '/vara-tjanster/hyra-ljus/rok-pyro/'],
  ['ljus', ['stativ', 'products'], '/vara-tjanster/hyra-ljus/stativ-tross/'],
  ['bild', ['products'], '/vara-tjanster/hyra-bild-projektorer-skarmar/'],
  ['bild', ['dukar'], '/vara-tjanster/hyra-bild-projektorer-skarmar/'],
  ['bild', ['tillbehor'], '/vara-tjanster/hyra-bild-projektorer-skarmar/'],
  // DJ-tjänsterna (DJ per timme) ligger i samma lista men bokas på /hyra-dj/ utan kort.
  ['dj', ['equipment'], '/vara-tjanster/hyra-dj-utrustning/', (p) => p.category !== 'DJ-tjänst'],
  ['scenes', ['products'], '/vara-tjanster/hyra-scen/'],
];

function lista(data, fil, vag) {
  let n = data[fil];
  for (const s of vag) n = n?.[s];
  if (Array.isArray(n)) return n;
  if (n && typeof n === 'object') return Object.values(n);
  return [];
}

/**
 * @param {Record<string, any>} data  { ljud, ljus, bild, dj, scenes }
 * @returns {Map<string, string>}     artno → sida
 */
export function byggSidor(data) {
  const sida = new Map();
  for (const [fil, vag, s, filter] of SIDOR) {
    for (const p of lista(data, fil, vag)) {
      if (!p || typeof p !== 'object' || !p.artno || p.active === false || sida.has(p.artno)) continue;
      if (filter && !filter(p)) continue;
      sida.set(p.artno, s);
    }
  }
  return sida;
}

/** Ankarnamnet för en produkt: artikelnumret med gemener. */
export const ankare = (artno) => String(artno || '').toLowerCase();
