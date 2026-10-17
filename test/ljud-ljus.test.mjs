// test/ljud-ljus.test.mjs — konfiguratorn på /vara-tjanster/hyra-ljud-och-ljus/
//
// Kontrollerar att ljud-ljus.json går att lösa upp mot produktdatan, att varje
// förslag pekar på alternativ som finns, att mixerregeln håller och att det
// valda alternativet alltid syns i den filtrerade listan.
import fs from 'node:fs';
import path from 'node:path';
import { byggSidor } from '../src/lib/produkt-sidor.mjs';
import { resolveLjudLjus, recommend, shownFor, builtInMixerOk, fixMixer, findOption, itemsFor, totalFor, minRecommended, AREAS } from '../src/lib/ljud-ljus-builder.mjs';

const load = (f) => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', f), 'utf8'));
const data = { scenes: load('scenes.json'), ljud: load('ljud.json'), ljus: load('ljus.json'), bild: load('bild.json'), dj: load('dj.json'), tjanster: load('tjanster.json'), karaoke: load('karaoke.json'), el: load('el.json') };
const R = resolveLjudLjus(load('ljud-ljus.json'), data);

let fel = 0, ok = 0;
const check = (cond, msg) => { if (cond) { ok++; } else { fel++; console.log('  ✗ ' + msg); } };

console.log('Ljud & ljus-konfiguratorn');
check(R.missing.length === 0, 'artikelnummer saknas eller är utgångna: ' + R.missing.join(', '));

for (const seg of ['privat', 'foretag']) {
  for (const focus of ['tal', 'musik', 'bada']) {
    for (const g of R.guests) {
      const tag = `${seg}/${focus}/${g.id}`;
      const row = R.recommend[seg][focus];
      for (const a of AREAS) {
        const id = row[a]?.[R.guests.indexOf(g)] ?? null;
        check(id === null || !!findOption(R, a, seg, id), `${tag}: ${a}=${id} finns inte`);
      }
      const sel = recommend(R, seg, g.id, focus);
      check(!!sel.ljud, `${tag}: förslaget saknar ljud`);
      // Mixerregeln: utan mixer måste kolumnens inbyggda räcka
      check(!!sel.mixer || builtInMixerOk(R, sel, seg), `${tag}: mixer saknas men inbyggd räcker inte`);
      // Det föreslagna ska synas i den filtrerade listan
      for (const a of ['ljud', 'ljus']) {
        const shown = shownFor(R, a, { seg, guests: g.id, focus }, sel);
        check(sel[a] == null || shown.some((o) => o.id === sel[a]), `${tag}: valt ${a} döljs av filtret`);
      }
      check(shownFor(R, 'ljud', { seg, guests: g.id, focus }, sel).length <= 9, `${tag}: för många ljudval i filtret`);
      check(totalFor(R, sel, seg) > 0, `${tag}: totalsumma 0`);
      check(itemsFor(R, sel, seg).every((i) => i.cartId && i.price > 0), `${tag}: rad utan cart-ID eller pris`);
    }
  }
}

// Två mikrofoner med enkel kolumn → mixer läggs till
const s2 = fixMixer(R, { ljud: 'kol-s', mixer: null, mik: 'slxd-2', ljus: null, rok: null, bild: null }, 'privat');
check(s2.mixer === 'mix-42', 'två mikrofoner + kolumn ger inte mixer 4+2');
const s1 = fixMixer(R, { ljud: 'kol-s', mixer: null, mik: 'kabel', ljus: null, rok: null, bild: null }, 'privat');
check(s1.mixer === null, 'en mikrofon + kolumn ska klara sig utan mixer');
const s3 = fixMixer(R, { ljud: 'mus-m', mixer: null, mik: null, ljus: null, rok: null, bild: null }, 'privat');
check(!!s3.mixer, 'Music-paket utan mixer ska få mixer');
check(minRecommended(R) > 0, 'från-pris saknas');
const s4 = fixMixer(R, { ljud: 'mus-m', mixer: 'mix-42', mik: null, ljus: null, rok: null, bild: 'tv-65', projbord: 'projbord', teknikbord: null }, 'privat');
check(s4.projbord === null, 'projektorbord ska försvinna utan projektor');
const s5 = fixMixer(R, { ljud: 'mus-m', mixer: 'mix-42', mik: null, ljus: null, rok: null, bild: 'proj-s', projbord: 'projbord', teknikbord: 'teknikbord' }, 'privat');
check(s5.projbord === 'projbord' && itemsFor(R, s5, 'privat').some((i) => i.artno === 'SK-DJ-0005'), 'bord med projektor ska ligga kvar och räknas');

// ── Kurateringslagret: topplistor och referensrader (sedan 2026-10-17) ──────
// Innehållet bor i Supabase och skrivs vid prebuild till popular.json och
// event-cases.json (committade fallbacks). Testerna läser fallback-filerna.
// Lagda här och inte i en egen fil för att inte röra package.json.

// Produktuppslaget måste klara båda katalogformerna, precis som PopularaPaket:
// nästlade serier (ljud.json: event/live/music…) och toppnivå-arrayer
// (bild.json: products/tillbehor/dukar).
const allaProdukter = Object.values(data).flatMap((d) => Object.values(d).flatMap((v) => {
  if (Array.isArray(v)) return v.filter((p) => p && typeof p === 'object' && p.artno);
  if (v && typeof v === 'object' && Array.isArray(v.products)) return v.products;
  return [];
}));
const aktiv = (a) => allaProdukter.some((p) => p.artno === a && p.active !== false);

const popular = load('popular.json');
// Varje topplisterad länkar till produktens kort (src/utils/produktLank.ts).
// Sidan måste finnas — annars blir länken död, inte bara utan ankare.
const sidor = byggSidor({ ljud: load('ljud.json'), ljus: load('ljus.json'), bild: load('bild.json'), dj: load('dj.json'), scenes: load('scenes.json') });
const sidfil = (s) => fs.existsSync(path.join(process.cwd(), 'src', 'pages', s, 'index.astro'));
for (const kat of ['ljud', 'ljus', 'bild', 'ljud-och-ljus']) {
  check((popular[kat]?.grupper ?? []).length > 0, `popular.json: ${kat} har inga grupper`);
}
for (const [kat, cfg] of Object.entries(popular)) {
  for (const g of cfg.grupper ?? []) {
    check(!!g.rubrik, `popular.json: ${kat}-grupp utan rubrik`);
    check((g.artnos ?? []).length > 0, `popular.json: ${kat} ${g.rubrik} har inga artiklar`);
    // En utgången eller okänd artikel försvinner tyst ur topplistan.
    for (const a of g.artnos ?? []) check(aktiv(a), `popular.json: ${kat} ${g.rubrik} → ${a} saknas eller är utgången`);
    for (const a of g.artnos ?? []) {
      const s = sidor.get(a);
      check(!!s && sidfil(s), `popular.json: ${kat} ${g.rubrik} → ${a} har ingen produktsida (${s ?? 'saknas i produkt-sidor.mjs'})`);
    }
  }
}

const ec = load('event-cases.json');
const finns = (src) => fs.existsSync(path.join(process.cwd(), 'public', src));
check((ec.cases ?? []).length > 0, 'event-cases.json: inga case');
for (const c of ec.cases ?? []) {
  check((c.images ?? []).length > 0, `event-cases.json: ${c.id} saknar galleribild`);
  for (const im of c.images ?? []) {
    check(finns(im.src), `event-cases.json: ${c.id} → bildfil saknas: ${im.src}`);
    check(!!im.alt, `event-cases.json: ${c.id} → alt-text saknas: ${im.src}`);
  }
}
for (const [kat, rader] of Object.entries(ec.hub ?? {})) {
  check(kat in popular, `event-cases.json: okänd hubbkategori ${kat}`);
  for (const h of rader) {
    check(finns(h.src), `event-cases.json: hubb ${kat}/${h.caseId} → bildfil saknas: ${h.src}`);
    check(!!(h.label && h.alt), `event-cases.json: hubb ${kat}/${h.caseId} saknar rubrik eller alt-text`);
  }
}

console.log(fel ? `❌ ${fel} fel, ${ok} ok` : `✅ ALLA ${ok} KONTROLLER GRÖNA`);
if (fel) process.exit(1);
