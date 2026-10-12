// src/lib/ljud-ljus-builder.mjs
//
// Ljud- och ljuskonfiguratorn på /vara-tjanster/hyra-ljud-och-ljus/.
// Kunden svarar på tre frågor (kundtyp, gästantal, fokus) och får ett förslag
// som kan justeras per område. Varje alternativ är en eller flera vanliga
// artiklar — ljud-ljus.json pekar bara ut artikelnummer (`art`) och antal,
// aldrig namn eller pris.
//
// Används av:
//   • LjudLjusBuilder.astro (server: slår upp artiklarna; klient: förslag,
//     filter, summor)
//   • hyra-ljud-och-ljus/index.astro (från-pris)
//   • scripts/generate-llms.mjs

import { findProduct } from './karaoke-builder.mjs';

export const AREAS = ['ljud', 'mixer', 'mik', 'ljus', 'rok', 'bild'];
const OPTION_LISTS = ['ljud', 'mixer', 'mik', 'ljusPrivat', 'ljusForetag', 'rok', 'bild'];

/** Enhetspris med volymtrappa (samma regel som varukorgen: högsta steg som nås). */
export function unitPrice(item, qty) {
  let price = item.price;
  for (const step of [...(item.volumePricing || [])].sort((a, b) => a.minQty - b.minQty)) {
    if (qty >= step.minQty) price = step.unitPrice;
  }
  return price;
}

/**
 * Löser upp ljud-ljus.json mot produktdatan.
 * @param {object} config  ljud-ljus.json
 * @param {object} data    { ljud, ljus, bild, ... } — samma nycklar som karaoke-builder
 * @returns {{ options, missing: string[], ...builder }}
 */
export function resolveLjudLjus(config, data) {
  const b = config.builder;
  const missing = [];
  const options = {};
  for (const list of OPTION_LISTS) {
    options[list] = (b.options[list] || []).map((o) => {
      const items = (o.items || []).map(({ art, qty }) => {
        const hit = findProduct(data, art);
        if (!hit) { missing.push(art); return null; }
        const { p, cartId, category } = hit;
        const item = {
          artno: art,
          qty: qty || 1,
          name: p.name,
          price: Number(p.price) || 0,
          volumePricing: p.volumePricing || [],
          image: p.image || '',
          cartId,
          category,
          bulky: !!p.bulky,
          forceLeverans: p.forceLeverans || '',
          monteringMin: p.monteringMin ?? null,
          priceNote: p.priceNote || '/dygn',
          active: p.active !== false,
        };
        if (!item.active) missing.push(art + ' (utgått)');
        item.unit = unitPrice(item, item.qty);
        item.total = item.unit * item.qty;
        return item;
      }).filter(Boolean);
      const { items: _drop, ...rest } = o;
      return { ...rest, items, total: items.reduce((s, i) => s + i.total, 0) };
    });
  }
  const { options: _o, ...builder } = b;
  return { ...builder, options, missing };
}

/** Alternativlistan för ett område och en kundtyp. */
export function listFor(R, area, seg) {
  if (area === 'ljus') return seg === 'foretag' ? R.options.ljusForetag : R.options.ljusPrivat;
  return R.options[area] || [];
}

export function findOption(R, area, seg, id) {
  if (id == null) return null;
  return listFor(R, area, seg).find((o) => o.id === id) || null;
}

/** Kan kolumnens inbyggda mixer räcka? Enkel kolumn och högst en mikrofon. */
export function builtInMixerOk(R, sel, seg) {
  const ljud = findOption(R, 'ljud', seg, sel.ljud);
  const mik = findOption(R, 'mik', seg, sel.mik);
  return !!ljud?.builtInMixer && (mik?.mics || 0) <= 1;
}

/** Lägger till mixer när den inbyggda inte räcker. Returnerar en ny sel. */
export function fixMixer(R, sel, seg) {
  const out = { ...sel };
  if (!out.mixer && !builtInMixerOk(R, out, seg)) {
    const mics = findOption(R, 'mik', seg, out.mik)?.mics || 0;
    out.mixer = mics >= 2 ? 'mix-42' : 'mix-22';
  }
  return out;
}

/** Förslaget för kundtyp × gästband × fokus. */
export function recommend(R, seg, guests, focus) {
  const i = R.guests.findIndex((g) => g.id === guests);
  const row = R.recommend?.[seg]?.[focus];
  const sel = {};
  for (const a of AREAS) sel[a] = row?.[a]?.[i] ?? null;
  return fixMixer(R, sel, seg);
}

/**
 * Alternativen som visas för svaren: passar gästantal och fokus.
 * Valt alternativ visas alltid. showAll = hela listan.
 */
export function shownFor(R, area, ans, sel, showAll = false) {
  const all = listFor(R, area, ans.seg);
  if (showAll || (area !== 'ljud' && area !== 'ljus')) return all;
  const gi = R.guests.findIndex((g) => g.id === ans.guests);
  const hi = R.guests[gi]?.hi || 100;
  const fits = area === 'ljud'
    ? (o) => {
      if (o.max < hi * 0.8 || o.max > hi * 2) return false;
      if (o.single && (ans.seg === 'foretag' || gi >= 2)) return false;
      // Tal: kolumn + Event & konferens. Musik och båda: kolumn + Music.
      return ans.focus === 'tal' ? o.type !== 'music' : o.type !== 'event';
    }
    : (o) => !o.max || (o.max >= hi * 0.4 && o.max <= hi * 3);
  return all.filter((o) => o.id === sel[area] || fits(o));
}

/** Artiklarna i ett urval, i områdesordning. */
export function itemsFor(R, sel, seg) {
  const out = [];
  for (const a of AREAS) {
    const o = findOption(R, a, seg, sel[a]);
    if (o) for (const it of o.items) out.push({ area: a, ...it });
  }
  return out;
}

export function totalFor(R, sel, seg) {
  return itemsFor(R, sel, seg).reduce((s, i) => s + i.total, 0);
}

/**
 * Billigaste förslaget över alla svar — sidans från-pris. Bara förslag som
 * innehåller både ljud och ljus räknas (sidan heter "ljud och ljus").
 */
export function minRecommended(R) {
  let min = Infinity;
  for (const seg of Object.keys(R.recommend || {})) {
    for (const focus of Object.keys(R.recommend[seg])) {
      for (const g of R.guests) {
        const sel = recommend(R, seg, g.id, focus);
        if (sel.ljud && sel.ljus) min = Math.min(min, totalFor(R, sel, seg));
      }
    }
  }
  return Number.isFinite(min) ? min : 0;
}
