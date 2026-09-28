/* src/lib/montering.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Montering & demontering — EN gemensam beräkning för hela sajten.
 *
 * Används av varukorgen, scenkonfiguratorn, scenpaketkorten, admins manuella
 * offert, kundordersidan och serverfunktionerna (skicka-offert,
 * admin-send-quote). Ingen DOM, inga beroenden.
 *
 * Filen är UMD så att samma källa fungerar på båda sidor:
 *   - Node/Netlify (CommonJS): require('../../src/lib/montering.cjs')
 *   - Webbläsaren: Layout.astro läser in källan som text och kör den inline,
 *     då hamnar biblioteket på window.SkMonteringLib.
 *
 * DATA
 * Katalogen genereras av generate-quote-catalog.py → src/data/montering-catalog.json:
 *   params: tjanster.json → montering (prisPerTimme, minDebiteringMin,
 *           avrundaTillMin, bemanning, modell.{demonteringFaktor, k, pott})
 *   items:  { artno: { t, b?, s?, m?, x? } }
 *           t = monteringMin (min per st, total tid — inte per person)
 *           b = bemanning (antal tekniker; saknas = params.bemanning)
 *           s = skalning: 'styck' (default) | 'tung' | 'yta' | 'fast'
 *           m = 1 → manuell (offereras separat, t.ex. LED-trailer)
 *           x = [[artno, antal], …] → paketet räknas som sina delar (scenpaket)
 *   alias:  { slug: artno } för varukorgsrader vars id är en slug
 *
 * REGLER (fastställda 2026-09-28)
 *   1. Rader grupperas per artikelnummer (samma produkt från två kort = en rad).
 *   2. Radtid = t × antal^k, där k väljs efter skalning (styck/tung/yta).
 *      'fast' = t × antal, ingen demontering (t.ex. DJ-paketens rigg på 60 min).
 *   3. Tillbehörspott: rader med t ≤ pott.maxMin, bemanning 1 och skalning
 *      styck räknas ihop. De pott.fulla tyngsta raderna räknas fullt, resten
 *      × pott.andel.
 *   4. Rader och pott × demonteringFaktor (montering + demontering).
 *   5. Teknikerminuter = tid × bemanning. Summan för HELA ORDERN avrundas uppåt
 *      till avrundaTillMin, minst minDebiteringMin.
 *   6. Kronor = minuter / 60 × prisPerTimme, plus eventuella fasta belopp.
 *
 * VARUKORGSRADER UTAN KATALOGTID
 *   monteringFast (kr)        → fast belopp, t.ex. LED-vägg på tross (bundle)
 *   assemblyMinutesTotal (min)→ egen beräkning på sidan (LED-vägg), debiteras
 *                               som den är
 *   monteringMin (min)        → äldre rader: räknas som styck, bemanning 1
 *   Katalogens tid vinner alltid över radens egna fält.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SkMonteringLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DEFAULT_PARAMS = {
    prisPerTimme: 600,
    minDebiteringMin: 15,
    avrundaTillMin: 15,
    bemanning: 1,
    modell: {
      demonteringFaktor: 2,
      k: { styck: 0.65, tung: 0.85, yta: 0.37 },
      pott: { maxMin: 10, fulla: 5, andel: 0.5 },
    },
  };

  function num(v, d) { return (typeof v === 'number' && isFinite(v)) ? v : d; }

  function normParams(p) {
    p = p || {};
    var m = p.modell || {};
    var k = m.k || {};
    var pott = m.pott || {};
    var D = DEFAULT_PARAMS, DM = D.modell;
    return {
      prisPerTimme: num(p.prisPerTimme, D.prisPerTimme),
      minDebiteringMin: num(p.minDebiteringMin, D.minDebiteringMin),
      avrundaTillMin: num(p.avrundaTillMin, D.avrundaTillMin) || 1,
      bemanning: num(p.bemanning, D.bemanning),
      demonteringFaktor: num(m.demonteringFaktor, DM.demonteringFaktor),
      k: { styck: num(k.styck, DM.k.styck), tung: num(k.tung, DM.k.tung), yta: num(k.yta, DM.k.yta) },
      pott: { maxMin: num(pott.maxMin, DM.pott.maxMin), fulla: num(pott.fulla, DM.pott.fulla), andel: num(pott.andel, DM.pott.andel) },
    };
  }

  /** Avrunda uppåt till steg, tålig mot flyttalsbrus (45.0000001 → 45). */
  function ceilTo(v, step) {
    return Math.ceil(v / step - 1e-9) * step;
  }

  /** Artikelnummer för en rad: artno, annars id via alias, annars id utan __-suffix. */
  function resolveArtno(line, catalog) {
    var items = (catalog && catalog.items) || {};
    var alias = (catalog && catalog.alias) || {};
    var cands = [];
    if (line.artno) cands.push(String(line.artno).trim());
    if (line.id) {
      var id = String(line.id).trim();
      cands.push(id, id.split('__')[0]);
    }
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (!c) continue;
      if (items[c]) return c;
      if (alias[c] && items[alias[c]]) return alias[c];
    }
    return cands[0] || '';
  }

  /**
   * Beräkna montering för en uppsättning rader.
   * @param {Array<{artno?, id?, qty, name?, monteringFast?, assemblyMinutesTotal?, monteringMin?}>} lines
   * @param {{params, items, alias}} catalog
   * @returns {{ minuter, kronor, fastKr, rawMin, rader, pott, manuella, saknas, kand }}
   *   minuter  debiterade teknikerminuter (avrundade, hela ordern)
   *   kronor   minuter/60 × pris + fasta belopp
   *   kand     true om minst en rad hade känd tid (eller fast belopp)
   */
  function calc(lines, catalog) {
    var P = normParams(catalog && catalog.params);
    var items = (catalog && catalog.items) || {};
    var groups = {};       // artno → { t, b, s, q, name }
    var order = [];
    var fastKr = 0;
    var extraMin = 0;      // assemblyMinutesTotal-rader utan katalogtid
    var manuella = [];
    var saknas = [];
    var kand = false;

    function addGroup(artno, entry, qty, name) {
      if (!(qty > 0)) return;
      if (entry.m) { if (manuella.indexOf(artno) < 0) manuella.push(artno); kand = true; return; }
      var t = num(entry.t, null);
      if (t === null) { if (saknas.indexOf(artno) < 0) saknas.push(artno); return; }
      kand = true;
      if (!groups[artno]) {
        groups[artno] = { artno: artno, t: t, b: num(entry.b, P.bemanning), s: entry.s || 'styck', q: 0, name: name || '' };
        order.push(artno);
      }
      groups[artno].q += qty;
    }

    (lines || []).forEach(function (line) {
      if (!line) return;
      var qty = Number(line.qty);
      if (!(qty > 0)) qty = 1;
      var artno = resolveArtno(line, catalog);
      var entry = items[artno];

      if (Number(line.monteringFast) > 0) {
        fastKr += Number(line.monteringFast);
        kand = true;
        return;
      }
      if (entry) {
        if (entry.x && entry.x.length) {
          entry.x.forEach(function (part) {
            var pe = items[part[0]];
            if (pe) addGroup(part[0], pe, part[1] * qty, '');
            else if (saknas.indexOf(part[0]) < 0) saknas.push(part[0]);
          });
          return;
        }
        addGroup(artno, entry, qty, line.name);
        return;
      }
      if (Number(line.assemblyMinutesTotal) > 0) {
        extraMin += Number(line.assemblyMinutesTotal);
        kand = true;
        return;
      }
      if (Number(line.monteringMin) > 0) {
        addGroup(artno || String(line.id || ''), { t: Number(line.monteringMin), b: 1, s: 'styck' }, qty, line.name);
        return;
      }
      var key = artno || String(line.id || line.name || '');
      if (key && saknas.indexOf(key) < 0) saknas.push(key);
    });

    var rader = [];
    var pottRader = [];
    var sumMin = 0;
    order.forEach(function (a) {
      var g = groups[a];
      if (g.t <= 0) { rader.push({ artno: a, qty: g.q, t: g.t, b: g.b, s: g.s, tid: 0, min: 0 }); return; }
      if (g.s === 'fast') {
        var mf = g.t * g.q * g.b;
        sumMin += mf;
        rader.push({ artno: a, qty: g.q, t: g.t, b: g.b, s: g.s, tid: g.t * g.q, min: mf });
        return;
      }
      var k = P.k[g.s] != null ? P.k[g.s] : P.k.styck;
      var tid = g.t * Math.pow(g.q, k);
      if (g.b === 1 && g.s === 'styck' && g.t <= P.pott.maxMin) {
        pottRader.push({ artno: a, qty: g.q, t: g.t, b: 1, s: g.s, tid: tid });
        return;
      }
      var m = tid * P.demonteringFaktor * g.b;
      sumMin += m;
      rader.push({ artno: a, qty: g.q, t: g.t, b: g.b, s: g.s, tid: tid, min: m });
    });

    pottRader.sort(function (x, y) { return y.tid - x.tid; });
    var pottTid = 0;
    pottRader.forEach(function (r, i) {
      r.andel = i < P.pott.fulla ? 1 : P.pott.andel;
      r.min = r.tid * r.andel * P.demonteringFaktor;
      pottTid += r.tid * r.andel;
    });
    var pottMin = pottTid * P.demonteringFaktor;
    sumMin += pottMin + extraMin;

    var minuter = sumMin > 0
      ? Math.max(P.minDebiteringMin, ceilTo(sumMin, P.avrundaTillMin))
      : 0;
    var kronor = Math.round(minuter / 60 * P.prisPerTimme) + Math.round(fastKr);

    return {
      minuter: minuter,
      kronor: kronor,
      fastKr: Math.round(fastKr),
      rawMin: sumMin,
      extraMin: extraMin,
      rader: rader,
      pott: { min: pottMin, rader: pottRader },
      manuella: manuella,
      saknas: saknas,
      kand: kand,
      prisPerTimme: P.prisPerTimme,
    };
  }

  /** "1 h 45 min", "30 min", "2 h". */
  function formatTid(min) {
    min = Math.round(min);
    var h = Math.floor(min / 60), m = min % 60;
    if (h && m) return h + ' h ' + m + ' min';
    if (h) return h + ' h';
    return m + ' min';
  }

  /** Bind en katalog: returnerar { calc(lines), formatTid, catalog, params }. */
  function create(catalog) {
    return {
      catalog: catalog,
      params: normParams(catalog && catalog.params),
      calc: function (lines) { return calc(lines, catalog); },
      resolveArtno: function (line) { return resolveArtno(line, catalog); },
      formatTid: formatTid,
    };
  }

  return { calc: calc, create: create, resolveArtno: resolveArtno, formatTid: formatTid, normParams: normParams, DEFAULT_PARAMS: DEFAULT_PARAMS };
});
