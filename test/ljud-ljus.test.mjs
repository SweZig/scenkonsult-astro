// test/ljud-ljus.test.mjs — konfiguratorn på /vara-tjanster/hyra-ljud-och-ljus/
//
// Kontrollerar att ljud-ljus.json går att lösa upp mot produktdatan, att varje
// förslag pekar på alternativ som finns, att mixerregeln håller och att det
// valda alternativet alltid syns i den filtrerade listan.
import fs from 'node:fs';
import path from 'node:path';
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

console.log(fel ? `❌ ${fel} fel, ${ok} ok` : `✅ ALLA ${ok} KONTROLLER GRÖNA`);
if (fel) process.exit(1);
