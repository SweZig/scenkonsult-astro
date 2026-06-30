// netlify/functions/admin-stats-sales.js
// Försäljningsstatistik — fakturerad omsättning (exkl. moms) med avdrag för krediteringar.
// GET /.netlify/functions/admin-stats-sales?from=YYYY-MM-DD&to=YYYY-MM-DD
// Kräver: Authorization: Bearer <ADMIN_TOKEN>
//
// ── MODELL & BESLUT (se chatt 2026-06-29) ──────────────────────────────────
//  • Datakälla: carts-tabellen. Ingen separat faktura/kredit-tabell finns.
//  • Fakturagate: en rad räknas som intäkt när invoice_sent_at IS NOT NULL
//    OCH invoice_number IS NOT NULL. (Utkast som inte skickats räknas ej.)
//  • Full kreditering nollställer invoice_number/invoice_sent_at i invoice-credit.js
//    → en helt krediterad faktura försvinner automatiskt ur intäktssetet
//    (omsättning 0, antal 0). Ingen specialhantering behövs. En order kan
//    återfaktureras med nytt K-nummer efteråt; bara den LEVANDE fakturan räknas.
//  • Partiell kreditering (custom / custom_amount / cancel_rules<100%) lämnar
//    fakturan intakt och lagrar ett NEGATIVT credit_amount_excl (i KRONOR) +
//    en summary-rad i credit_items (ej per produkt). Därför fördelas partiell
//    kreditering PROPORTIONELLT över fakturans produktrader efter radvärde.
//  • ENHETER (kritiskt): total_excl & invoice_fee_ore = ÖRE. items[].price &
//    credit_amount_excl = KRONOR. Allt normaliseras till ÖRE internt via toOre().
//  • Period: bucketas på invoice_date. Kreditering dras i ursprungsfakturans
//    period (samma rad → samma invoice_date), aldrig på credit_sent_at.
//  • Antal uthyrningar: produktnivå = +1 per faktura produkten finns på
//    (oavsett qty). Kategori/total = +1 per faktura. Tjänster/avgift räknas
//    som omsättning men ingår inte i "antal uthyrningar" (egen occurrence-räknare).
//  • Kategori-rollup: artno-prefix → toppkategori (approach B). items[] saknar
//    ofta artno, så vi slår upp id/slug i order-catalog-flat.json för att hitta
//    artno, och faller tillbaka på prefix. Okänt → "Okänt" (synligt, ej dolt).

'use strict';

const { supabase, isAdmin, ok, err, preflight, isBookingFee } = require('./_lib');
const CATALOG = require('../../src/data/order-catalog-flat.json');

// ── Enhetshjälp ─────────────────────────────────────────────────────────────
const toOre = (kr) => Math.round((Number(kr) || 0) * 100);

// ── Artno-prefix → toppkategori ─────────────────────────────────────────────
// Ändra här för att om-bucketa. SCN/LJD/BLD/LJS/DJ enligt prioritetsordning;
// LEV (leverans) + TJN (tjänster/avgift) → Tjänster; EL → El & ström; KAR → Karaoke.
const PREFIX_TO_CAT = {
  SCN: 'Scen',
  LJD: 'Ljud',
  BLD: 'Bild',
  LJS: 'Ljus',
  DJ:  'DJ',
  LEV: 'Tjänster',
  TJN: 'Tjänster',
  EL:  'El & ström',
  KAR: 'Karaoke',
};

// Visningsordning (prioritet först, sedan sido-buckets, Tjänster sist, Okänt allra sist)
const CAT_ORDER = ['Scen', 'Ljud', 'Bild', 'Ljus', 'DJ', 'Karaoke', 'El & ström', 'Tjänster', 'Okänt'];

// Kategorier som INTE räknas som "uthyrning" (omsättning räknas, antal-uthyrningar ej)
const NON_RENTAL_CATS = new Set(['Tjänster']);

// ── Slå upp artno för en orderrad ───────────────────────────────────────────
// items[] bär ibland artno, ibland bara id/slug. Katalogen är nycklad på BÅDE
// artno och slug, så vi provar i tur och ordning.
function resolveArtno(item) {
  if (item && typeof item.artno === 'string' && item.artno) return item.artno;
  const id = item && item.id;
  if (typeof id === 'string' && id) {
    const hit = CATALOG[id];
    if (hit && hit.artno) return hit.artno;
    return id; // sista utväg — id självt (kan vara en slug utan katalogträff)
  }
  return '';
}

// ── (id|artno|name) → toppkategori ──────────────────────────────────────────
// Prioritet: 1) manuell override (admin-klassad), 2) artno-prefix, 3) Okänt.
// overrides = { item_key: category }. Vi slår upp på id, artno OCH namn — samma
// ordning som unknown-nyckeln byggs (artno || id || name) — så att en override
// fångar raden oavsett vilket fält som blev nyckeln vid klassningen.
function topCategory(artno, id, name, overrides) {
  if (overrides) {
    if (id && overrides[id]) return overrides[id];
    if (artno && overrides[artno]) return overrides[artno];
    if (name && overrides[name]) return overrides[name];
  }
  const m = String(artno || '').match(/^SK-([A-Z]+)/);
  if (m && PREFIX_TO_CAT[m[1]]) return PREFIX_TO_CAT[m[1]];
  return 'Okänt';
}

// ── Är raden en äkta intäktsrad? (ej note, har namn) ────────────────────────
const isRealLine = (i) => i && !i._note && i.id !== '_note' && i.name;

// ── Periodnyckel-byggare ────────────────────────────────────────────────────
function periodKeys(isoDate) {
  // isoDate = 'YYYY-MM-DD'
  const y = isoDate.slice(0, 4);
  const mo = isoDate.slice(5, 7);
  const m = parseInt(mo, 10);
  const q = Math.ceil(m / 3);
  return {
    year:    y,
    quarter: `${y}-Q${q}`,
    month:   `${y}-${mo}`,
  };
}

// ── Bygg tom aggregeringsnod ────────────────────────────────────────────────
const newAgg = () => ({ omsattning_ore: 0, antal_uthyrningar: 0, _invoiceSet: new Set() });

// ── Huvud-aggregering ───────────────────────────────────────────────────────
// Returnerar { periods: { month: {...}, quarter: {...}, year: {...} }, meta }
function aggregate(rows, overrides) {
  // Struktur: dimension → periodKey → { categories: {cat: agg}, products: {key: {...}}, total: agg }
  const out = {
    month:   {},
    quarter: {},
    year:    {},
  };
  const dims = ['month', 'quarter', 'year'];

  // Okända rader samlas med namn + ackumulerad omsättning + exempelfaktura,
  // så admin kan känna igen vad de är och klassa dem.
  const unknown = {}; // key → { key, id, artno, name, omsattning_ore, invoices:Set }

  for (const cart of rows) {
    // Periodankare: invoice_date är förstahandsval, annars invoice_sent_at.
    // created_at används INTE som fallback — det är när varukorgen skapades, inte
    // när den fakturerades, och skulle placera intäkten i fel månad. Manuellt/
    // Peppol-fakturerade ordrar får numera invoice_date satt i cart-update.js när
    // de flyttas till 'fakturerad'; en rad helt utan fakturadatum hoppas över
    // hellre än att hamna i fel period.
    const invoiceDate = cart.invoice_date
      || (cart.invoice_sent_at ? String(cart.invoice_sent_at).slice(0, 10) : null);
    if (!invoiceDate) continue;

    // ── Kreditering: avgör om den gäller den NUVARANDE fakturan eller en
    //    tidigare (som sedan omfakturerats). ──────────────────────────────
    //    invoice-credit.js nollar invoice_number vid full kredit OCH skriver
    //    credit_mode='full'. Om ordern sen OMFAKTURERAS får den ett nytt
    //    invoice_number men credit_*-fälten ligger kvar och pekar på den
    //    GAMLA fakturan. Då ska den nya fakturan räknas fullt ut.
    //
    //    En kreditering gäller den nuvarande fakturan endast om:
    //      • den inte är omfakturerad efter krediteringen
    //        (invoice_sent_at <= credit_sent_at), OCH
    //      • credit_of_invoice saknas ELLER pekar på nuvarande invoice_number.
    //    Annars är krediteringen "förbrukad" på en tidigare faktura och
    //    ignoreras helt (varken nollning eller proportionellt avdrag).
    const hasCredit = cart.credit_mode != null || (typeof cart.credit_amount_excl === 'number' && cart.credit_amount_excl < 0);
    let creditAppliesToCurrent = false;
    if (hasCredit) {
      const invSent = cart.invoice_sent_at ? Date.parse(cart.invoice_sent_at) : 0;
      const credSent = cart.credit_sent_at ? Date.parse(cart.credit_sent_at) : 0;
      const reinvoicedAfterCredit = invSent && credSent && invSent > credSent;
      const creditTargetsOther = cart.credit_of_invoice && cart.credit_of_invoice !== cart.invoice_number;
      creditAppliesToCurrent = !reinvoicedAfterCredit && !creditTargetsOther;
    }

    // Full kreditering som gäller NUVARANDE faktura → ordern är helt återförd
    // (omsättning 0, antal 0) → hoppa över. Gäller den en tidigare, omfakturerad
    // faktura räknas den nuvarande som vanligt.
    if (cart.credit_mode === 'full' && creditAppliesToCurrent) continue;

    const invoiceNo = cart.invoice_number;
    const pk = periodKeys(invoiceDate);

    const items = Array.isArray(cart.items) ? cart.items.filter(isRealLine) : [];
    if (!items.length) continue;

    // ── Dela upp i produktrader vs avgift, beräkna radbelopp i öre ──────────
    // Produktrad = allt utom bokningsavgift. Avgiften hanteras separat (en gång)
    // och routas till Tjänster.
    const lines = items.map((i) => {
      const qty = i.qty || i.quantity || 1;
      const priceOre = toOre(i.price);
      const lineOre = priceOre * qty;
      const isFee = isBookingFee(i);
      const artno = resolveArtno(i);
      const cat = isFee ? 'Tjänster' : topCategory(artno, i.id, i.name, overrides);
      return { i, qty, lineOre, isFee, artno, cat, name: i.name };
    });

    // ── Avgift: räkna EN gång. Föredra items[]-raden; fall tillbaka på
    //    invoice_fee_ore om ingen avgiftsrad finns i items[]. ───────────────
    const hasFeeLine = lines.some((l) => l.isFee);
    let feeOre = 0;
    if (hasFeeLine) {
      feeOre = lines.filter((l) => l.isFee).reduce((s, l) => s + l.lineOre, 0);
    } else if (cart.invoice_fee_ore) {
      feeOre = Number(cart.invoice_fee_ore) || 0;
    }

    // Produktrader (exkl. avgift)
    const prodLines = lines.filter((l) => !l.isFee);
    const prodTotalOre = prodLines.reduce((s, l) => s + l.lineOre, 0);

    // ── Kreditavdrag ────────────────────────────────────────────────────────
    // Partiell kreditering: credit_amount_excl NEGATIVT i KRONOR, fördelas
    // proportionellt över produktrader. Dras ENDAST om krediteringen gäller
    // den nuvarande fakturan (creditAppliesToCurrent) — en kreditering som
    // hörde till en tidigare, omfakturerad faktura ignoreras.
    let creditOre = 0;
    if (creditAppliesToCurrent && typeof cart.credit_amount_excl === 'number' && cart.credit_amount_excl < 0 && invoiceNo) {
      creditOre = toOre(cart.credit_amount_excl); // negativt öre
    }

    // Per-rad proportionellt kreditavdrag (negativt öre per produktrad)
    const lineCredit = new Map(); // index → creditOre (negativt)
    if (creditOre < 0 && prodTotalOre > 0) {
      let allocated = 0;
      prodLines.forEach((l, idx) => {
        const share = Math.round(creditOre * (l.lineOre / prodTotalOre));
        lineCredit.set(idx, share);
        allocated += share;
      });
      // Avrundningsrest läggs på största raden så summan stämmer exakt
      const rest = creditOre - allocated;
      if (rest !== 0 && prodLines.length) {
        let maxIdx = 0;
        prodLines.forEach((l, idx) => { if (l.lineOre > prodLines[maxIdx].lineOre) maxIdx = idx; });
        lineCredit.set(maxIdx, (lineCredit.get(maxIdx) || 0) + rest);
      }
    }

    // ── Samla okända rader EN gång per faktura (utanför dims-loopen för att
    //    inte trippelräkna). Använd nettobelopp efter kreditavdrag. ──────────
    prodLines.forEach((l, idx) => {
      if (l.cat !== 'Okänt') return;
      const netOre = l.lineOre + (lineCredit.get(idx) || 0);
      const key = l.artno || l.i.id || l.name;
      if (!unknown[key]) unknown[key] = { key, id: l.i.id || '', artno: l.artno || '', name: l.name, omsattning_ore: 0, invoices: new Set() };
      unknown[key].omsattning_ore += netOre;
      if (invoiceNo) unknown[key].invoices.add(invoiceNo);
    });

    // ── Skriv in i alla tre dimensioner ─────────────────────────────────────
    for (const dim of dims) {
      const key = pk[dim];
      if (!out[dim][key]) {
        out[dim][key] = { categories: {}, products: {}, total: newAgg() };
      }
      const bucket = out[dim][key];

      // Hjälp att hämta/skapa kategorinod
      const catNode = (c) => (bucket.categories[c] || (bucket.categories[c] = newAgg()));
      // Produktnod nyckel = artno (eller id) — namn behålls för visning
      const prodNode = (l) => {
        const k = l.artno || l.i.id || l.name;
        if (!bucket.products[k]) {
          bucket.products[k] = {
            artno: l.artno || '', name: l.name, category: l.cat,
            omsattning_ore: 0, antal_uthyrningar: 0, _invoiceSet: new Set(),
          };
        }
        return bucket.products[k];
      };

      // Produktrader
      prodLines.forEach((l, idx) => {
        const credit = lineCredit.get(idx) || 0; // negativt öre
        const netOre = l.lineOre + credit;

        const p = prodNode(l);
        p.omsattning_ore += netOre;
        if (!p._invoiceSet.has(invoiceNo)) { p._invoiceSet.add(invoiceNo); p.antal_uthyrningar += 1; }

        const cn = catNode(l.cat);
        cn.omsattning_ore += netOre;
        if (!NON_RENTAL_CATS.has(l.cat) && !cn._invoiceSet.has(invoiceNo)) {
          cn._invoiceSet.add(invoiceNo); cn.antal_uthyrningar += 1;
        }
      });

      // Avgift → Tjänster (omsättning, ej uthyrning). Räknas en gång per faktura.
      if (feeOre > 0) {
        const cn = catNode('Tjänster');
        cn.omsattning_ore += feeOre;
        // occurrence-räknare för tjänster (hur ofta avgift fakturerats)
        if (!cn._invoiceSet.has(invoiceNo)) { cn._invoiceSet.add(invoiceNo); cn.antal_uthyrningar += 1; }
      }

      // Total: omsättning = produkter (netto) + avgift. Antal = +1 per faktura
      // om fakturan har minst en äkta produktrad (uthyrning).
      const netProdOre = prodLines.reduce((s, l, idx) => s + l.lineOre + (lineCredit.get(idx) || 0), 0);
      bucket.total.omsattning_ore += netProdOre + feeOre;
      const hasRental = prodLines.some((l) => !NON_RENTAL_CATS.has(l.cat));
      if (hasRental && !bucket.total._invoiceSet.has(invoiceNo)) {
        bucket.total._invoiceSet.add(invoiceNo);
        bucket.total.antal_uthyrningar += 1;
      }
    }
  }

  // Okända rader → sorterad lista (störst omsättning först)
  const unknownList = Object.values(unknown)
    .map((u) => ({
      key: u.key, id: u.id, artno: u.artno, name: u.name,
      omsattning: Math.round(u.omsattning_ore / 100),
      invoice_count: u.invoices.size,
      sample_invoices: [...u.invoices].slice(0, 5),
    }))
    .sort((a, b) => Math.abs(b.omsattning) - Math.abs(a.omsattning));
  const unknownRevenueOre = Object.values(unknown).reduce((s, u) => s + u.omsattning_ore, 0);

  return { out, meta: { unknownRevenueOre, unknownList } };
}

// ── Serialisera (ta bort _invoiceSet, öre→kr, sortera) ──────────────────────
function serialize(out) {
  const cleanAgg = (a) => ({
    omsattning: Math.round(a.omsattning_ore / 100),
    antal: a.antal_uthyrningar,
  });

  const result = {};
  for (const dim of ['month', 'quarter', 'year']) {
    result[dim] = {};
    const keys = Object.keys(out[dim]).sort(); // kronologisk via ISO-nycklar
    for (const key of keys) {
      const b = out[dim][key];
      // Kategorier i visningsordning
      const cats = Object.keys(b.categories)
        .sort((x, y) => {
          const ix = CAT_ORDER.indexOf(x); const iy = CAT_ORDER.indexOf(y);
          return (ix === -1 ? 99 : ix) - (iy === -1 ? 99 : iy);
        })
        .map((c) => ({ category: c, ...cleanAgg(b.categories[c]) }));
      // Produkter sorterade på omsättning desc
      const prods = Object.values(b.products)
        .map((p) => ({
          artno: p.artno, name: p.name, category: p.category,
          omsattning: Math.round(p.omsattning_ore / 100),
          antal: p.antal_uthyrningar,
        }))
        .sort((x, y) => y.omsattning - x.omsattning);
      result[dim][key] = {
        total: cleanAgg(b.total),
        categories: cats,
        products: prods,
      };
    }
  }
  return result;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const { from, to } = event.queryStringParameters || {};

  try {
    const supaUrl = process.env.SUPABASE_URL;
    const supaKey = process.env.SUPABASE_SERVICE_KEY;
    const headers = { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json' };

    // Hämta fakturerade rader. Gate: en rad räknas som intäkt om den har ett
    // invoice_number OCH antingen invoice_sent_at är satt (normalt flöde) ELLER
    // status='fakturerad' (manuellt/Peppol-fakturerad där invoice_sent_at saknas).
    // Periodfiltrering på invoice_date görs INTE i SQL eftersom manuella rader kan
    // ha null invoice_date — vi hämtar superset och bucketar i JS via fallback-datum
    // (invoice_date → invoice_sent_at). Manuellt fakturerade ordrar får numera
    // invoice_date satt i cart-update.js, så detta är bara en säkerhetsnät-kedja.
    // Selektera bara fält vi behöver (mönster: aldrig select('*') i nya funktioner).
    let q = `${supaUrl}/rest/v1/carts?select=id,invoice_number,invoice_date,invoice_sent_at,status,created_at,total_excl,invoice_fee_ore,items,credit_amount_excl,credit_mode,credit_of_invoice,credit_invoice_number,credit_sent_at`
      + `&invoice_number=not.is.null&id=not.like.SK-RESERVE-*`
      + `&or=(invoice_sent_at.not.is.null,status.eq.fakturerad)`
      + `&order=created_at.asc`;

    const res = await fetch(q, { headers });
    if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text()}`);
    const rows = await res.json();

    // Hämta manuella kategori-overrides (kan saknas om migrationen ej körts ännu).
    let overrides = {};
    try {
      const ovRes = await fetch(`${supaUrl}/rest/v1/category_overrides?select=item_key,category`, { headers });
      if (ovRes.ok) {
        const ovRows = await ovRes.json();
        for (const r of ovRows) if (r.item_key && r.category) overrides[r.item_key] = r.category;
      }
    } catch (ovErr) {
      console.warn('CATEGORY_OVERRIDES_WARN:', ovErr.message); // icke-fatal
    }

    const { out, meta } = aggregate(rows, overrides);
    const data = serialize(out);

    return ok({
      generated_at: new Date().toISOString(),
      invoice_count: rows.length,
      range: { from: from || null, to: to || null },
      data,
      meta: {
        unknown_revenue_kr: Math.round(meta.unknownRevenueOre / 100),
        unknown: meta.unknownList,
        override_count: Object.keys(overrides).length,
        note: 'Omsättning exkl. moms. Full kreditering nollställer fakturan (faller ur setet). Partiell kreditering fördelas proportionellt över produktrader.',
      },
    });
  } catch (e) {
    console.error('ADMIN_STATS_SALES_ERROR:', e.message);
    return err('Serverfel: ' + e.message, 500);
  }
};

// Exportera interna delar för lokal testning
module.exports._test = { aggregate, serialize, resolveArtno, topCategory, periodKeys, toOre };
