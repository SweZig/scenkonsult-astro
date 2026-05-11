#!/usr/bin/env node
/**
 * generate-excel.mjs — Bygger Scenkonsult_Produktkatalog.xlsx från live-JSON.
 *
 * Körs som del av prebuild (Netlify build hook).
 * Output: public/Scenkonsult_Produktkatalog.xlsx
 *
 * Flikar:
 *   1. Produktkatalog      — alla hyresprodukter
 *   2. Leverans            — alla fraktalternativ
 *   3. Tjänster & avgifter — montering, teknikertjänst, bokningsavgifter
 *   4. Fraktlogik          — selection_rules + scen-specifika regler
 *   5. Tjänstelogik        — montering-regler, bokningsavgift, tillägg
 *   6. Sammanfattning      — översikt + tidsstämpel
 *
 * Ersätter den manuella build_excel_v3.py.
 */

import * as XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf-8'));

// ── Källdata ───────────────────────────────────────────────────────────────
const quoteCatalog = readJson('src/data/quote-catalog.json');
const flatCatalog  = readJson('src/data/order-catalog-flat.json');
const scenes  = readJson('src/data/scenes.json');
const tjanster = readJson('src/data/tjanster.json');

// ── Hjälpare ───────────────────────────────────────────────────────────────
const VAT = 1.25;
const inkl = (price) => price ? Math.round(price * VAT) : 0;

/** Slå upp full produktdata från flat-katalogen via artno */
const getFullData = (artno) => flatCatalog[artno] || {};

/** Bygger en rad i Produktkatalog-format från quote-catalog-produkt */
const row = (kat, sub, p, defaultUnit = 'per dygn') => {
  const full = getFullData(p.artno);
  return {
    'Kategori': kat,
    'Underkategori': sub,
    'Artikelnummer': p.artno || '',
    'Produktnamn': p.name || full.name || '',
    'Pris exkl. moms': p.price || 0,
    'Pris inkl. moms': inkl(p.price || 0),
    'Enhet': p.priceNote || defaultUnit,
    'Beskrivning': full.desc || full.description || '',
    'Specifikationer': Array.isArray(full.includes) ? full.includes.join(' · ') : (full.specifikationer || '')
  };
};

// ── FLIK 1: Produktkatalog ─────────────────────────────────────────────────
// Iterera quote-catalog som auktoritativ källa (alla 243 produkter fångas)
const produktkatalog = [];
const SKIP_CATEGORIES = new Set(['Tjänster', 'Tillägg', 'Egen rad']); // Tjänster har egen flik

for (const [catName, catData] of Object.entries(quoteCatalog)) {
  if (SKIP_CATEGORIES.has(catName)) continue;
  // Två format: { products: [...] } eller { sub: { subName: [...] } }
  if (Array.isArray(catData.products)) {
    catData.products.forEach(p => {
      if (p.artno) produktkatalog.push(row(catName, catName, p));
    });
  }
  if (catData.sub) {
    for (const [subName, items] of Object.entries(catData.sub)) {
      if (!Array.isArray(items)) continue;
      items.forEach(p => {
        if (p.artno) produktkatalog.push(row(catName, subName, p));
      });
    }
  }
}

// ── FLIK 2: Leverans ───────────────────────────────────────────────────────
const leverans = [];
const lvKeys = ['standard', 'storbil', 'skrymmande', 'storbil_slap', 'lastbil', 'extern_lev'];
lvKeys.forEach(k => {
  const lv = tjanster.leverans[k];
  if (!lv || !lv.pris) return;
  // Tur & retur
  leverans.push({
    'Typ': 'Tur & retur',
    'Artikelnummer': lv.artno || '',
    'Beskrivning': lv.label || '',
    'Pris exkl. moms': lv.pris,
    'Pris inkl. moms': inkl(lv.pris),
    'Enhet': '/tillfälle',
    'Anteckning': lv.note || ''
  });
  // Enkelresa
  if (lv.enkel?.pris) {
    leverans.push({
      'Typ': 'Enkelresa',
      'Artikelnummer': lv.enkel.artno || '',
      'Beskrivning': lv.enkel.label || '',
      'Pris exkl. moms': lv.enkel.pris,
      'Pris inkl. moms': inkl(lv.enkel.pris),
      'Enhet': '/tillfälle',
      'Anteckning': lv.enkel.note || '50% av tur & retur'
    });
  }
});

// ── FLIK 3: Tjänster & avgifter ────────────────────────────────────────────
const tjansterAvgifter = [];
// Montering
const m = tjanster.montering;
tjansterAvgifter.push({
  'Typ': 'Personal',
  'Artikelnummer': m.artno || 'SK-TJN-0001',
  'Beskrivning': m.label,
  'Pris exkl. moms': m.prisPerTimme,
  'Pris inkl. moms': inkl(m.prisPerTimme),
  'Enhet': '/tim',
  'Anteckning': m.description || ''
});
// Tillägg (teknikertjänst etc.)
(tjanster.tillagg || []).forEach(t => {
  tjansterAvgifter.push({
    'Typ': t.type === 'service' ? 'Personal' : 'Tillägg',
    'Artikelnummer': t.artno || '',
    'Beskrivning': t.label || '',
    'Pris exkl. moms': t.pris || 0,
    'Pris inkl. moms': inkl(t.pris || 0),
    'Enhet': t.enhet || '/st',
    'Anteckning': t.description || ''
  });
});
// Bokningsavgifter
(tjanster.fakturaavgift?.options || []).forEach(o => {
  tjansterAvgifter.push({
    'Typ': 'Avgift',
    'Artikelnummer': o.artno || '',
    'Beskrivning': o.label || '',
    'Pris exkl. moms': o.pris || 0,
    'Pris inkl. moms': inkl(o.pris || 0),
    'Enhet': '/order',
    'Anteckning': o.default ? 'Standard-val' : ''
  });
});

// ── FLIK 4: Fraktlogik ─────────────────────────────────────────────────────
const fraktlogik = [
  { 'Sektion': 'GENERELL FRAKT', 'Regel': '', 'Använder': '', 'Förklaring': '' },
  { 'Sektion': 'selection_rules', 'Regel': 'Reglerna utvärderas uppifrån och ned — första matchen vinner', 'Använder': '', 'Förklaring': '' },
];
(tjanster.leverans.selection_rules || []).forEach((r, i) => {
  let regel;
  if (r.if === 'anyItemForces') regel = 'Någon produkt har forceLeverans-flagga';
  else if (r.if === 'bulkyCount') regel = `bulkyCount ≥ ${r.min}`;
  else if (r.if === 'default') regel = 'Inget av ovanstående matchar';
  else regel = JSON.stringify(r);
  let anvander;
  if (r.use === 'FROM_PRODUCT') anvander = 'Värdet från produktens forceLeverans-flagga';
  else anvander = (tjanster.leverans[r.use]?.label || r.use) +
    (tjanster.leverans[r.use]?.pris ? ` (${tjanster.leverans[r.use].pris} kr)` : '');
  fraktlogik.push({
    'Sektion': `Steg ${i + 1}`,
    'Regel': regel,
    'Använder': anvander,
    'Förklaring': r.comment || ''
  });
});

// Scen-specifik frakt
fraktlogik.push({ 'Sektion': '', 'Regel': '', 'Använder': '', 'Förklaring': '' });
fraktlogik.push({ 'Sektion': 'SCEN-SPECIFIK FRAKT', 'Regel': 'fraktByModuleCount i scenes.json (åsidosätter generell frakt för scen-konfigurator)', 'Använder': '', 'Förklaring': '' });
(scenes.fraktByModuleCount || []).forEach((rule, i) => {
  const lv = tjanster.leverans[rule.fordon];
  fraktlogik.push({
    'Sektion': `Steg ${i + 1}`,
    'Regel': `Antal moduler ≤ ${rule.maxModules === 999 ? '∞' : rule.maxModules}`,
    'Använder': (lv?.label || rule.fordon) + (lv?.pris ? ` (${lv.pris} kr)` : ''),
    'Förklaring': ''
  });
});

// Produktflaggor
fraktlogik.push({ 'Sektion': '', 'Regel': '', 'Använder': '', 'Förklaring': '' });
fraktlogik.push({ 'Sektion': 'PRODUKTFLAGGOR', 'Regel': '', 'Använder': '', 'Förklaring': '' });
fraktlogik.push({
  'Sektion': 'bulky: true',
  'Regel': 'Räknas i bulkyCount-regeln (≥2 → storbil_slap, =1 → skrymmande)',
  'Använder': '',
  'Förklaring': 'Sätts på produkter som tar mer plats än normalt (subbaser, line array m.m.)'
});
fraktlogik.push({
  'Sektion': 'forceLeverans: "<key>"',
  'Regel': 'Tvingar specifik leveransnyckel — anyItemForces matchar och använder denna',
  'Använder': 'Värdet (t.ex. "storbil", "lastbil", "extern_lev")',
  'Förklaring': 'Sätts på produkter som kräver specifik bil (Karaoke Large+, LED-trailers m.fl.)'
});

// ── FLIK 5: Tjänstelogik ───────────────────────────────────────────────────
const tjanstelogik = [
  { 'Sektion': 'MONTERING & DEMONTERING', 'Regel': '', 'Värde': '', 'Förklaring': '' },
  { 'Sektion': 'Pris per timme', 'Regel': '', 'Värde': `${m.prisPerTimme} kr (${inkl(m.prisPerTimme)} kr inkl. moms)`, 'Förklaring': '' },
  { 'Sektion': 'Min debitering', 'Regel': '', 'Värde': `${m.minDebiteringMin} min`, 'Förklaring': 'Avrundas uppåt' },
  { 'Sektion': 'Obligatorisk över', 'Regel': '', 'Värde': `${m.obligatoriskOverM2} m²`, 'Förklaring': 'Vid leverans när scen är över 16 m²' },
  { 'Sektion': 'Demonteringstid', 'Regel': '', 'Värde': '2× monteringstid', 'Förklaring': m.note || '' },
  { 'Sektion': '', 'Regel': '', 'Värde': '', 'Förklaring': '' },
  { 'Sektion': 'BOKNINGSAVGIFT', 'Regel': '', 'Värde': '', 'Förklaring': tjanster.fakturaavgift?.description || '' },
  { 'Sektion': 'Default', 'Regel': '', 'Värde': `${tjanster.fakturaavgift?.default} kr`, 'Förklaring': 'Sätts automatiskt — kan ändras av admin per order' },
];
(tjanster.fakturaavgift?.options || []).forEach(o => {
  tjanstelogik.push({
    'Sektion': 'Alternativ',
    'Regel': o.id,
    'Värde': `${o.pris} kr (${inkl(o.pris)} kr inkl.)`,
    'Förklaring': o.label + (o.default ? ' [DEFAULT]' : '')
  });
});

tjanstelogik.push({ 'Sektion': '', 'Regel': '', 'Värde': '', 'Förklaring': '' });
tjanstelogik.push({ 'Sektion': 'TILLÄGGSTJÄNSTER', 'Regel': '', 'Värde': '', 'Förklaring': '' });
(tjanster.tillagg || []).forEach(t => {
  tjanstelogik.push({
    'Sektion': t.label || '',
    'Regel': t.artno || '',
    'Värde': `${t.pris} kr ${t.enhet || ''}`,
    'Förklaring': t.description || ''
  });
});

// ── FLIK 6: Sammanfattning ─────────────────────────────────────────────────
const buildTime = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });
const sammanfattning = [
  { 'Scenkonsult — Produktkatalog': 'Genererad automatiskt från live-JSON' },
  { 'Scenkonsult — Produktkatalog': `Build-tidsstämpel: ${buildTime}` },
  { 'Scenkonsult — Produktkatalog': '' },
  { 'Scenkonsult — Produktkatalog': '── INNEHÅLL ──' },
  { 'Scenkonsult — Produktkatalog': `Produktkatalog:       ${produktkatalog.length} hyresprodukter` },
  { 'Scenkonsult — Produktkatalog': `Leverans:             ${leverans.length} fraktalternativ` },
  { 'Scenkonsult — Produktkatalog': `Tjänster & avgifter:  ${tjansterAvgifter.length} poster` },
  { 'Scenkonsult — Produktkatalog': `Fraktlogik:           dokumentation av selection_rules + scen-regler` },
  { 'Scenkonsult — Produktkatalog': `Tjänstelogik:         montering, bokningsavgift, tillägg` },
  { 'Scenkonsult — Produktkatalog': '' },
  { 'Scenkonsult — Produktkatalog': '── KÄLLA ──' },
  { 'Scenkonsult — Produktkatalog': 'src/data/scenes.json, ljud.json, ljus.json, dj.json, bild.json, karaoke.json, tjanster.json' },
  { 'Scenkonsult — Produktkatalog': '' },
  { 'Scenkonsult — Produktkatalog': '── KONTAKT ──' },
  { 'Scenkonsult — Produktkatalog': 'Scenkonsult Norden / Sigvardsson Consulting Group' },
  { 'Scenkonsult — Produktkatalog': 'Grundat 1986 · Grimstagatan 164, 162 58 Vällingby' },
  { 'Scenkonsult — Produktkatalog': 'Tel: 072-448 10 00 · info@scenkonsult.se · scenkonsult.se' },
];

// ── BYGG WORKBOOK ──────────────────────────────────────────────────────────
const wb = XLSX.utils.book_new();

const setColWidths = (ws, widths) => {
  ws['!cols'] = widths.map(w => ({ wch: w }));
};

const wsProd = XLSX.utils.json_to_sheet(produktkatalog);
setColWidths(wsProd, [14, 22, 22, 42, 14, 14, 14, 60, 60]);
XLSX.utils.book_append_sheet(wb, wsProd, 'Produktkatalog');

const wsLev = XLSX.utils.json_to_sheet(leverans);
setColWidths(wsLev, [12, 22, 50, 14, 14, 12, 36]);
XLSX.utils.book_append_sheet(wb, wsLev, 'Leverans');

const wsTj = XLSX.utils.json_to_sheet(tjansterAvgifter);
setColWidths(wsTj, [12, 22, 40, 14, 14, 12, 50]);
XLSX.utils.book_append_sheet(wb, wsTj, 'Tjänster & avgifter');

const wsFr = XLSX.utils.json_to_sheet(fraktlogik);
setColWidths(wsFr, [22, 56, 40, 60]);
XLSX.utils.book_append_sheet(wb, wsFr, 'Fraktlogik');

const wsTjL = XLSX.utils.json_to_sheet(tjanstelogik);
setColWidths(wsTjL, [28, 24, 28, 60]);
XLSX.utils.book_append_sheet(wb, wsTjL, 'Tjänstelogik');

const wsSum = XLSX.utils.json_to_sheet(sammanfattning);
setColWidths(wsSum, [80]);
XLSX.utils.book_append_sheet(wb, wsSum, 'Sammanfattning');

// ── SPARA ──────────────────────────────────────────────────────────────────
const outPath = path.join(ROOT, 'public', 'Scenkonsult_Produktkatalog.xlsx');
XLSX.writeFile(wb, outPath);

console.log(`✅ ${path.basename(outPath)} (${produktkatalog.length} prod · ${leverans.length} lev · ${tjansterAvgifter.length} tj)`);
