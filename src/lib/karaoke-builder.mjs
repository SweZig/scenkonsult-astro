// src/lib/karaoke-builder.mjs
//
// Karaokebyggaren: kunden väljer högtalare, mikrofoner, mixer, bild, dator,
// ljus och rök. Varje val är en vanlig artikel ur ljud/bild/ljus/dj.json —
// karaoke.json.builder pekar bara ut artikelnummer, aldrig namn eller pris.
//
// Används av:
//   • KaraokeBuilder.astro (server: slår upp produkterna; klient: itemsFor)
//   • hyra-karaoke/index.astro, for/foretagsfest (från-pris)
//   • scripts/generate-llms.mjs och netlify/generate-products.mjs (Sven)
//
// Cart-ID och kategori härleds med samma regler som korten och Svens
// register (src/lib/sven-products.mjs), så att varukorgen, Sven och
// offertkatalogen känner igen artiklarna.

import { SVEN_SOURCES, cartIdFor } from './sven-products.mjs';

function at(root, path) {
  let node = root;
  for (const seg of path) {
    if (node == null) return [];
    node = node[seg];
  }
  if (Array.isArray(node)) return node;
  if (node && typeof node === 'object') {
    if (Array.isArray(node.products)) return node.products;
    return Object.values(node);
  }
  return [];
}

/** Slå upp en artikel i alla datafiler. Returnerar null om den saknas. */
export function findProduct(data, artno) {
  for (const src of SVEN_SOURCES) {
    for (const p of at(data[src.file], src.path)) {
      if (p && typeof p === 'object' && p.artno === artno) {
        return { p, cartId: cartIdFor(p, src.key) || artno, category: src.category };
      }
    }
  }
  return null;
}

/**
 * Löser upp karaoke.builder mot produktdatan.
 * @param {object} karaoke  karaoke.json
 * @param {object} data     { scenes, ljud, ljus, dj, bild, tjanster, karaoke, el }
 * @returns {{ tabs, slots, presets, guide, missing: string[] }}
 */
export function resolveBuilder(karaoke, data) {
  const b = karaoke.builder;
  const missing = [];
  const slots = {};
  for (const [key, slot] of Object.entries(b.slots)) {
    const options = slot.options.map((o) => {
      if (!o.artno) return { ...o, qty: 0, price: 0, name: o.label };
      const hit = findProduct(data, o.artno);
      if (!hit) { missing.push(o.artno); return null; }
      const { p, cartId, category } = hit;
      return {
        ...o,
        qty: o.qty || 1,
        name: p.name,
        price: Number(p.price) || 0,
        image: p.image || '',
        cartId,
        category,
        bulky: !!p.bulky,
        forceLeverans: p.forceLeverans || '',
        monteringMin: p.monteringMin ?? null,
      };
    }).filter(Boolean);
    slots[key] = { key, ...slot, options };
  }
  return { tabs: b.tabs, slots, presets: b.presets, guide: b.guide, missing };
}

/** Är sloten synlig för det här urvalet? (t.ex. duk bara med projektor) */
export function slotVisible(slots, sel, key) {
  const cond = slots[key]?.showIf;
  if (!cond) return true;
  const chosen = slots[cond.slot]?.options.find((o) => o.id === sel[cond.slot]);
  return !!chosen && chosen.group === cond.group;
}

/** Valt alternativ för en slot, eller null. Toggle-slotar: true = första alternativet. */
export function chosenOption(slots, sel, key) {
  const slot = slots[key];
  if (!slot || !slotVisible(slots, sel, key)) return null;
  if (slot.toggle) return sel[key] ? slot.options[0] : null;
  return slot.options.find((o) => o.id === sel[key]) || null;
}

/** Artiklarna som hamnar i varukorgen för ett urval. Egna saker (utan artno) räknas inte. */
export function itemsFor(resolved, sel) {
  const out = [];
  for (const key of Object.keys(resolved.slots)) {
    const o = chosenOption(resolved.slots, sel, key);
    if (o && o.artno) out.push({ slot: key, ...o, total: o.price * o.qty });
  }
  return out;
}

export function totalFor(resolved, sel) {
  return itemsFor(resolved, sel).reduce((s, i) => s + i.total, 0);
}

/** Billigaste möjliga uppsättning: billigaste alternativet i varje obligatorisk slot. */
export function minTotal(resolved) {
  let sum = 0;
  for (const slot of Object.values(resolved.slots)) {
    if (!slot.required || slot.showIf) continue;
    sum += Math.min(...slot.options.map((o) => o.price * (o.qty || 0)));
  }
  return sum;
}
