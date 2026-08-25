// src/lib/day-pricing.js
// ─────────────────────────────────────────────────────────────────────────────
// Hyresdygn & flerdygnsrabatt — ren räknemodul, inga DOM-beroenden.
//
// MODELL
// Raden bär både sanningen och resultatet:
//
//   unit_price   listpris per dygn — SANNINGEN, ändras aldrig av rabatt
//   days         antal hyresdygn för raden (default 1)
//   day_factor   Σ (1 − rabatt_dag / 100)
//   price        EFFEKTIVT à-pris = round(unit_price × day_factor)
//   qty          antal ENHETER — aldrig antal × dagar
//
// Invarianten `price × qty = radsumma` hålls därmed intakt, vilket är hela
// poängen: formeln price × qty ligger duplicerad på ~35 ställen i kodbasen
// (varukorg, admin, _lib.js, fakturafunktioner, statistik). Ingen av dem
// behöver ändras, och inget fakturabelopp kan bli fel av den här funktionen.
//
// KRITISK REGEL
// price räknas ALLTID fram ur unit_price, aldrig ur sig självt. Det gör
// applyDayPricing() idempotent — kör den två gånger och resultatet är
// identiskt. Utan den regeln ger en dubbelkörning unit_price × faktor².
//
// KRITISK REGEL 2 (kundvänt)
// Kundvända vyer renderas ur unit_price och days — ALDRIG ur price. price är
// en intern lagringskonstruktion. Kunden ska se dygnspriset hen känner igen.
// ─────────────────────────────────────────────────────────────────────────────

/** Tillåtna rabattsatser i UI:t. Fast skala — inget fritextfält. */
export const DAY_RATES = [0, 25, 50, 75, 100];

/** Fallback när tjanster.json saknar hyresdagar-blocket. */
export const DEFAULT_DAY_CONFIG = {
  satser: DAY_RATES,
  standard: [0, 50, 50, 75],
  fortsattning: 75,
  maxDygn: 30,
  kundtext: 'Flerdygnsrabatt: 50 % på dag 2–3, 75 % från dag 4.',
};

/** Artikel-ID:n som aldrig dygnsprissätts — engångstjänster och personal. */
export const NON_DAY_PRICED_IDS = new Set([
  'lev-standard', 'lev-skrymmande', 'lev-storbil', 'lev-storbil-slap',
  'lev-lastbil', 'montering', 'rigg-teknik', 'fakturaavgift-49',
]);

/** Kategorier som aldrig dygnsprissätts. */
export const NON_DAY_PRICED_CATEGORIES = new Set(['Tjänster', 'Tillägg', 'Leverans']);

/** Artno-prefix som aldrig dygnsprissätts: leverans, engångstjänster, personal. */
const NON_DAY_PRICED_PREFIXES = ['SK-LEV-', 'SK-TJN-', 'SK-DJ-', 'SK-LJT-'];

/** Normaliserar dygn till ett heltal i [1, maxDygn]. */
export function clampDays(days, cfg = DEFAULT_DAY_CONFIG) {
  const max = Number(cfg?.maxDygn) || DEFAULT_DAY_CONFIG.maxDygn;
  const n = Math.floor(Number(days));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, max);
}

/**
 * Rabatt i procent per dag, en post per dygn.
 * ladder = arrayen med rabatt för dag 1..n; dagar därefter får `fortsattning`.
 * dayRungs(3) → [0, 50, 50] med standardstegen.
 */
export function dayRungs(days, cfg = DEFAULT_DAY_CONFIG, ladder = null) {
  const d = clampDays(days, cfg);
  const base = Array.isArray(ladder) && ladder.length
    ? ladder
    : (Array.isArray(cfg?.standard) && cfg.standard.length ? cfg.standard : DEFAULT_DAY_CONFIG.standard);
  const cont = Number.isFinite(Number(cfg?.fortsattning))
    ? Number(cfg.fortsattning)
    : DEFAULT_DAY_CONFIG.fortsattning;

  const out = [];
  for (let i = 0; i < d; i++) {
    const raw = i < base.length ? base[i] : cont;
    const pct = Number(raw);
    // Rabatt utanför 0–100 är alltid ett datafel — klamra hellre än att
    // producera ett negativt pris eller ett pris över listpris.
    out.push(Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0);
  }
  return out;
}

/**
 * Summerad dagfaktor. 1 dygn ger alltid exakt 1 — endagshyror beter sig
 * precis som före den här funktionen fanns.
 */
export function dayFactor(days, cfg = DEFAULT_DAY_CONFIG, ladder = null) {
  return dayRungs(days, cfg, ladder).reduce((sum, rabatt) => sum + (100 - rabatt) / 100, 0);
}

/**
 * Ska raden dygnsprissättas alls?
 * Leverans, montering, rigg, bokningsavgift, DJ och ljudtekniker är
 * engångsposter — annars debiteras montering tre gånger på en tredagarshyra.
 */
export function isDayPriced(item) {
  if (!item || item._note) return false;
  if (item.type === 'service') return false;
  if (NON_DAY_PRICED_IDS.has(item.id)) return false;
  if (NON_DAY_PRICED_CATEGORIES.has(item.category)) return false;
  const ref = String(item.artno || item.id || '').toUpperCase();
  if (NON_DAY_PRICED_PREFIXES.some((p) => ref.startsWith(p))) return false;
  return true;
}

/**
 * Räknar om raden för `days` hyresdygn och returnerar ett NYTT objekt.
 *
 * unit_price sätts en gång, från radens nuvarande pris, och rörs sedan aldrig
 * av den här funktionen. price härleds alltid därifrån — aldrig från price
 * självt — vilket gör anropet idempotent.
 */
export function applyDayPricing(item, days, cfg = DEFAULT_DAY_CONFIG, ladder = null) {
  if (!item) return item;

  // Rader som inte dygnsprissätts nollställs till 1 dygn och lämnas i fred.
  if (!isDayPriced(item)) {
    const unit = Number(item.unit_price ?? item.price) || 0;
    return { ...item, days: 1, unit_price: unit, day_factor: 1, price: unit };
  }

  const d = clampDays(days ?? item.days ?? 1, cfg);
  const useLadder = ladder ?? (Array.isArray(item.day_ladder) ? item.day_ladder : null);
  const unit = Number(item.unit_price ?? item.price) || 0;
  const factor = dayFactor(d, cfg, useLadder);

  return {
    ...item,
    days: d,
    unit_price: unit,
    day_factor: Number(factor.toFixed(4)),
    // Avrunda À-PRISET, inte radsumman: då stämmer alltid antal × à-pris =
    // delsumma i faktura-PDF:en, och kunden som räknar efter får rätt.
    price: Math.round(unit * factor),
    day_ladder: useLadder,
  };
}

/** Radsumma. Samma formel som resten av kodbasen — här bara för läsbarhet. */
export function lineTotal(item) {
  return (Number(item?.price) || 0) * (Number(item?.qty ?? item?.quantity) || 1);
}

/** Vad raden hade kostat utan flerdygnsrabatt: unit_price × days × qty. */
export function lineTotalUndiscounted(item) {
  if (!item) return 0;
  const unit = Number(item.unit_price ?? item.price) || 0;
  const d = isDayPriced(item) ? clampDays(item.days ?? 1) : 1;
  return unit * d * (Number(item.qty ?? item.quantity) || 1);
}

/**
 * Sammanställning för totalblocken: ordinarie pris, rabatt, faktiskt pris.
 * `hasMultiDay` styr om dokumenten ska rita flerdygnsläget eller se ut som förr.
 */
export function cartDaySummary(items = []) {
  const real = items.filter((i) => i && !i._note);
  const ordinarie = real.reduce((s, i) => s + lineTotalUndiscounted(i), 0);
  const faktiskt = real.reduce((s, i) => s + lineTotal(i), 0);
  const maxDays = real.reduce((m, i) => Math.max(m, isDayPriced(i) ? (Number(i.days) || 1) : 1), 1);
  return {
    ordinarie,
    faktiskt,
    rabatt: Math.max(0, ordinarie - faktiskt),
    maxDays,
    hasMultiDay: real.some((i) => isDayPriced(i) && (Number(i.days) || 1) > 1),
  };
}

/**
 * Föreslår antal hyresdygn ur orderns datum. Hela dygn, aldrig under 1 —
 * klockslagen påverkar inte priset, bara logistiken.
 * Returnerar null när datumen inte räcker till ett förslag.
 */
export function autoDays(fromDate, toDate, cfg = DEFAULT_DAY_CONFIG) {
  if (!fromDate || !toDate) return null;
  const a = new Date(`${String(fromDate).slice(0, 10)}T00:00:00`);
  const b = new Date(`${String(toDate).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  const diff = Math.round((b - a) / 86400000);
  if (diff < 0) return null;
  return clampDays(Math.max(1, diff), cfg);
}

/** Läser hyresdagar-blocket ur tjanster.json med fallback. */
export function dayConfigFrom(tjanster) {
  const h = tjanster?.hyresdagar;
  if (!h) return { ...DEFAULT_DAY_CONFIG };
  return {
    satser: Array.isArray(h.satser) && h.satser.length ? h.satser : DEFAULT_DAY_CONFIG.satser,
    standard: Array.isArray(h.standard) && h.standard.length ? h.standard : DEFAULT_DAY_CONFIG.standard,
    fortsattning: Number.isFinite(Number(h.fortsattning)) ? Number(h.fortsattning) : DEFAULT_DAY_CONFIG.fortsattning,
    maxDygn: Number(h.maxDygn) || DEFAULT_DAY_CONFIG.maxDygn,
    kundtext: h.kundtext || DEFAULT_DAY_CONFIG.kundtext,
  };
}

/** "3 hyresdygn · 1 499 kr/dygn" — radtexten kunden ser. */
export function dayMetaLabel(item, { includeUnit = true } = {}) {
  if (!item || !isDayPriced(item)) return '';
  const d = clampDays(item.days ?? 1);
  if (d <= 1 && !includeUnit) return '';
  const unit = Number(item.unit_price ?? item.price) || 0;
  const parts = [`${d} hyresdygn`];
  if (includeUnit) parts.push(`${unit.toLocaleString('sv-SE')} kr/dygn`);
  return parts.join(' · ');
}

/** Rabatt i procent för hela raden, avrundat — för märken som "−33 %". */
export function dayDiscountPct(item) {
  const full = lineTotalUndiscounted(item);
  if (!full) return 0;
  return Math.round((1 - lineTotal(item) / full) * 100);
}
