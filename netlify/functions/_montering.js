// netlify/functions/_montering.js
// Serverns kontroll av montering — samma motor som varukorgen och admin
// (src/lib/montering.cjs) och samma genererade katalog
// (src/data/montering-catalog.json, byggs av generate-quote-catalog.py).
'use strict';

const Lib = require('../../src/lib/montering.cjs');
let CATALOG = null;
try { CATALOG = require('../../src/data/montering-catalog.json'); }
catch (e) { console.warn('MONTERING: katalog saknas —', e.message); }

const SVC_IDS  = new Set(['lev-standard','lev-skrymmande','lev-lastbil','lev-bakgavel','montering','rigg-teknik','fakturaavgift-49']);
const SVC_CATS = new Set(['Tjänster','Tjänst','Tillägg','Leverans']);

function isMonteringRow(i) {
  return !!i && (i.id === 'montering' || i.id === 'SK-TJN-0001' || i.artno === 'SK-TJN-0001');
}

/** Hårdvarurader — det montering räknas på. */
function productLines(items) {
  return (items || []).filter(i =>
    i && !i._note && !isMonteringRow(i) && !SVC_IDS.has(i.id) &&
    i.type !== 'service' && !SVC_CATS.has(i.category));
}

/** Montering för raderna, med varukorgens schablon (60 min) när ingen tid alls är känd. */
function calcMontering(items) {
  if (!CATALOG) return null;
  const r = Lib.calc(productLines(items), CATALOG);
  if (!r.kand && r.saknas.length) {
    const pris = (CATALOG.params && CATALOG.params.prisPerTimme) || 600;
    return Object.assign({}, r, { minuter: 60, kronor: pris, schablon: true });
  }
  return r;
}

/**
 * Jämför monteringsraden med serverns beräkning.
 * @param {Array} items  rader (muteras bara om enforce = true)
 * @param {{ enforce?: boolean, tag?: string }} opts
 *   enforce: skriv serverns belopp på raden (kundens förfrågan — klienten är
 *            inte betrodd). Admin-offerter loggas bara: admin får justera.
 * @returns {null | { client, server, minuter, avvikelse }}
 */
function checkMontering(items, opts) {
  opts = opts || {};
  const row = (items || []).find(isMonteringRow);
  if (!row) return null;
  const r = calcMontering(items);
  if (!r) return null;
  const qty = Number(row.qty) || 1;
  const client = Math.round((Number(row.price) || 0) * qty);
  const avvikelse = Math.abs(client - r.kronor) >= 1;
  if (avvikelse) {
    console.warn(`${opts.tag || 'MONTERING'} MONTERING_AVVIKELSE klient=${client} server=${r.kronor} min=${r.minuter}` +
      (r.saknas.length ? ` saknas=${r.saknas.join(',')}` : ''));
    if (opts.enforce) {
      row.price = r.kronor;
      row.qty = 1;
      if (row.unit_price !== undefined) row.unit_price = r.kronor;
    }
  }
  return { client, server: r.kronor, minuter: r.minuter, avvikelse };
}

module.exports = { calcMontering, checkMontering, productLines, isMonteringRow };
