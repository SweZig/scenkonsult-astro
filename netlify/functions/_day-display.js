// netlify/functions/_day-display.js
// ─────────────────────────────────────────────────────────────────────────────
// Hyresdygn — VISNINGSHJÄLPARE för backend (CommonJS).
//
// Backend räknar aldrig om priser. Radens `price` är redan det effektiva
// à-priset (unit_price × dagfaktor, avrundat), och `price × qty` är radsumman
// precis som förut. Den här modulen läser bara `days` och `unit_price` för att
// kunna FÖRKLARA priset för kunden.
//
// KRITISK REGEL: kundvända vyer renderas ur unit_price och days — ALDRIG ur
// price. Står 2 998 kr i en à-pris-kolumn där det förut stod 1 499 läser
// kunden det som en prishöjning. Visar vi i stället 1 499 kr/dygn × 3 dygn
// finns ingen höjning att förklara, bara en rabatt att skylta med.
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

const NON_DAY_PRICED_IDS = new Set([
  'lev-standard', 'lev-skrymmande', 'lev-storbil', 'lev-storbil-slap',
  'lev-lastbil', 'montering', 'rigg-teknik', 'fakturaavgift-49',
]);
const NON_DAY_PRICED_CATEGORIES = new Set(['Tjänster', 'Tillägg', 'Leverans']);
const NON_DAY_PRICED_PREFIXES = ['SK-LEV-', 'SK-TJN-', 'SK-DJ-', 'SK-LJT-'];

/** Engångsposter (leverans, montering, personal) dygnsprissätts aldrig. */
function isDayPriced(item) {
  if (!item || item._note) return false;
  if (item.type === 'service') return false;
  if (NON_DAY_PRICED_IDS.has(item.id)) return false;
  if (NON_DAY_PRICED_CATEGORIES.has(item.category)) return false;
  const ref = String(item.artno || item.id || '').toUpperCase();
  if (NON_DAY_PRICED_PREFIXES.some((p) => ref.startsWith(p))) return false;
  return true;
}

/** Antal hyresdygn för raden. Gamla rader saknar fältet → 1. */
function itemDays(item) {
  if (!isDayPriced(item)) return 1;
  const d = Math.floor(Number(item && item.days));
  return Number.isFinite(d) && d > 0 ? d : 1;
}

/** Listpris per dygn. Gamla rader saknar fältet → price (som då ÄR dygnspriset). */
function itemUnitPrice(item) {
  if (!item) return 0;
  const u = Number(item.unit_price);
  return Number.isFinite(u) && u > 0 ? u : (Number(item.price) || 0);
}

function itemQty(item) {
  return Number((item && (item.qty != null ? item.qty : item.quantity))) || 1;
}

/** Radsumma — samma formel som överallt annars. */
function lineTotal(item) {
  return (Number(item && item.price) || 0) * itemQty(item);
}

/** Ordinarie pris utan flerdygnsrabatt: unit_price × dygn × antal. */
function lineTotalUndiscounted(item) {
  return itemUnitPrice(item) * itemDays(item) * itemQty(item);
}

/**
 * Sammanställning för totalblocken.
 * hasMultiDay styr om dokumentet ska rita flerdygnsläget eller se ut exakt som
 * förut — är varje rad 1 dygn ändras ingenting alls för kunden.
 */
function daySummary(items) {
  const real = (items || []).filter((i) => i && !i._note);
  const ordinarie = real.reduce((s, i) => s + lineTotalUndiscounted(i), 0);
  const faktiskt = real.reduce((s, i) => s + lineTotal(i), 0);
  const maxDays = real.reduce((m, i) => Math.max(m, itemDays(i)), 1);
  return {
    ordinarie,
    faktiskt,
    rabatt: Math.max(0, ordinarie - faktiskt),
    maxDays,
    hasMultiDay: real.some((i) => itemDays(i) > 1),
  };
}

function fmtN(n) {
  return Math.round(Number(n) || 0).toLocaleString('sv-SE').replace(/ /g, ' ');
}

/**
 * Förklaringsraden under produktnamnet.
 * "3 hyresdygn · 1 499 kr/dygn · flerdygnsrabatt −33 %"
 * Tom sträng för engångsposter och endagsrader.
 */
function dayNote(item) {
  if (!isDayPriced(item)) return '';
  const d = itemDays(item);
  if (d <= 1) return '';
  const unit = itemUnitPrice(item);
  const full = lineTotalUndiscounted(item);
  const nu = lineTotal(item);
  const parts = [`${d} hyresdygn`, `${fmtN(unit)} kr/dygn`];
  // Vanligt bindestreck, INTE U+2212 MINUS SIGN: pdfkit ritar Helvetica med
  // WinAnsi-encoding, där U+2212 saknas och renderas som ett citattecken.
  if (full > nu) parts.push(`flerdygnsrabatt -${Math.round((1 - nu / full) * 100)} %`);
  return parts.join(' · ');
}

/** "3 hyresdygn" / "—" för dygnskolumnen. Engångsposter får streck, aldrig 1. */
function dayCell(item) {
  return isDayPriced(item) ? String(itemDays(item)) : '—';
}

module.exports = {
  isDayPriced, itemDays, itemUnitPrice, itemQty,
  lineTotal, lineTotalUndiscounted, daySummary,
  dayNote, dayCell, fmtN,
};
