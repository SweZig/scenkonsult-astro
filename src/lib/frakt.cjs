/* src/lib/frakt.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Fraktval — EN gemensam regelmotor för hela sajten.
 *
 * Används av varukorgen, scenpaketkorten, scenkonfiguratorn och admins
 * fraktförslag. Ingen DOM, inga beroenden.
 *
 * Filen är UMD så att samma källa fungerar på båda sidor:
 *   - Node (tester): require('../src/lib/frakt.cjs')
 *   - Webbläsaren: FraktEngine.astro kör källan inline → window.SkFraktLib,
 *     och skapar window.skFrakt med data från tjanster.json + scenes.json.
 *
 * DATA (byggs av FraktEngine.astro)
 *   leverans:    tjanster.json → leverans (fordon + selection_rules); principen står i tjanster.json → _frakt
 *   plattformar: { artno: '1x1' | '1x2' }  — scenplattformarna i scenes.json
 *   paket:       { artno: [['1x2', 10]] }   — scenpaket som rad (admin, gamla
 *                                             ordrar) räknas som sina plattformar
 *
 * REGLER (beslut 2026-10-09)
 *   Alla selection_rules prövas. Varje matchande regel föreslår ett fordon och
 *   STÖRSTA fordonet vinner (fordonets "rang" i tjanster.json). Ordningen i
 *   listan spelar alltså ingen roll, och en liten forceLeverans kan aldrig
 *   trycka ned fordonet som resten av varukorgen kräver.
 *
 *   if: anyItemForces  → varje rads forceLeverans
 *   if: plattformCount → antal plattformar av rule.typ ≥ rule.min
 *   if: bulkyCount     → antal övriga bulky-rader (ej plattformar) ≥ rule.min
 *   if: default        → alltid
 *
 *   Fordon med ersattAv (släpvagnarna) räknas om till ersättaren. Det gäller
 *   äldre varukorgsrader som fortfarande bär forceLeverans='storbil_slap'.
 *   Fordon med undantag=true väljs aldrig av motorn och listas inte i kundval();
 *   admin kan fortfarande välja dem manuellt.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SkFraktLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function create(data) {
    data = data || {};
    var lev = data.leverans || {};
    var rules = Array.isArray(lev.selection_rules) ? lev.selection_rules : [];
    var plattformar = data.plattformar || {};
    var paket = data.paket || {};

    function fordon(key) {
      var v = key && lev[key];
      return v && typeof v === 'object' && !Array.isArray(v) && v.artno ? v : null;
    }
    // Följ ersattAv (högst några steg) till ett fordon motorn får välja.
    function giltig(key) {
      var k = key, steg = 0;
      while (fordon(k) && fordon(k).ersattAv && steg < 5) { k = fordon(k).ersattAv; steg++; }
      var v = fordon(k);
      return v && !v.undantag ? k : null;
    }
    function rang(key) {
      var v = fordon(key);
      return v && typeof v.rang === 'number' ? v.rang : 0;
    }
    function artnoAv(rad) {
      // Varukorgsrader kan ha id som 'SK-BLD-LED-P26__paket-7__7x4' — artno först.
      return String(rad.artno || rad.id || '').split('__')[0];
    }

    function underlag(rader) {
      var u = { plattform: {}, bulky: 0, forced: [] };
      (rader || []).forEach(function (rad) {
        if (!rad || typeof rad !== 'object') return;
        var antal = Number(rad.qty) > 0 ? Number(rad.qty) : 1;
        if (typeof rad.forceLeverans === 'string' && rad.forceLeverans.trim()) {
          u.forced.push(rad.forceLeverans.trim());
        }
        var a = artnoAv(rad);
        if (plattformar[a]) {
          u.plattform[plattformar[a]] = (u.plattform[plattformar[a]] || 0) + antal;
          return;
        }
        if (Array.isArray(paket[a])) {
          paket[a].forEach(function (p) {
            u.plattform[p[0]] = (u.plattform[p[0]] || 0) + p[1] * antal;
          });
          return;
        }
        if (rad.bulky === true) u.bulky += antal;
      });
      return u;
    }

    function resolve(rader) {
      var u = underlag(rader);
      var bast = null, regel = null;
      function prova(key, r) {
        var k = giltig(key);
        if (k && (bast === null || rang(k) > rang(bast))) { bast = k; regel = r; }
      }
      rules.forEach(function (r) {
        if (!r || !r.use) return;
        var min = typeof r.min === 'number' ? r.min : 1;
        if (r.if === 'anyItemForces') u.forced.forEach(function (k) { prova(k, r); });
        else if (r.if === 'plattformCount') { if ((u.plattform[r.typ] || 0) >= min) prova(r.use, r); }
        else if (r.if === 'bulkyCount') { if (u.bulky >= min) prova(r.use, r); }
        else if (r.if === 'default' || !r.if) prova(r.use, r);
      });
      if (bast === null && giltig('standard')) bast = 'standard';
      return { key: bast, fordon: fordon(bast), regel: regel, underlag: u };
    }

    // Fordon kunden kan få — standardvalen, minst först. Undantag (släp) ingår inte.
    function kundval() {
      return Object.keys(lev)
        .filter(function (k) { var v = fordon(k); return v && !v.undantag && !v.ersattAv; })
        .sort(function (a, b) { return rang(a) - rang(b); });
    }

    return {
      resolve: resolve,
      keyFor: function (rader) { return resolve(rader).key; },
      fordon: fordon,
      rang: rang,
      kundval: kundval,
      plattformTyp: function (artno) { return plattformar[artno] || null; },
    };
  }

  // Bygger motorns data ur datafilerna (tjanster.json + scenes.json).
  // Plattformstyp läses ur modulens size ('1×2 m' → '1x2'); scenpaketen räknas
  // med sin förvalda yta (defaultSurface) — kortet skickar ändå modulrader.
  function dataFran(tjanster, scenes) {
    var plattformar = {}, paket = {};
    var typ = function (size) { return String(size || '').replace(/\s*m\b/i, '').replace(/\s/g, '').replace(/×/g, 'x'); };
    ((scenes && scenes.modules) || []).forEach(function (m) { if (m && m.artno) plattformar[m.artno] = typ(m.size); });
    ((scenes && scenes.products) || []).forEach(function (p) {
      var c = p && p.config;
      if (!p || !p.artno || !c || !c.width || !c.depth) return;
      var t = String(c.defaultSurface || '').split('-')[0];
      if (t !== '1x1' && t !== '1x2') return;
      var yta = c.width * c.depth;
      paket[p.artno] = [[t, t === '1x1' ? yta : Math.ceil(yta / 2)]];
    });
    return { leverans: (tjanster && tjanster.leverans) || {}, plattformar: plattformar, paket: paket };
  }

  return { create: create, dataFran: dataFran };
});
