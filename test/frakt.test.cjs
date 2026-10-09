// test/frakt.test.cjs
// Kontrollerar fraktmotorn (src/lib/frakt.cjs) mot fordonsmatrisen som
// beslutades 2026-10-09, och att datafilerna pekar på rätt fordon.
//   Plattform 1×1 m: 1–4 st vanlig bil, 5+ stor bil
//   Plattform 1×2 m: 1–8 st stor bil,   9+ lätt lastbil
//   LED-vägg, Live XL, line array: alltid lätt lastbil
//   Släpvagn: undantag — väljs aldrig automatiskt
'use strict';

const path = require('path');
const ROOT = path.join(__dirname, '..');
const lib = require(path.join(ROOT, 'src', 'lib', 'frakt.cjs'));
const tjanster = require(path.join(ROOT, 'src', 'data', 'tjanster.json'));
const scenes = require(path.join(ROOT, 'src', 'data', 'scenes.json'));
const led = require(path.join(ROOT, 'src', 'data', 'led-paneler.json'));
const bild = require(path.join(ROOT, 'src', 'data', 'bild.json'));
const ljud = require(path.join(ROOT, 'src', 'data', 'ljud.json'));

const frakt = lib.create(lib.dataFran(tjanster, scenes));
let pass = 0; const fails = [];
function check(namn, fick, vantat) {
  const ok = fick === vantat;
  console.log(`${ok ? '  ✓' : '  ✗'} ${namn}${ok ? '' : ` — fick ${fick}, väntade ${vantat}`}`);
  ok ? pass++ : fails.push(namn);
}

const mod = Object.fromEntries((scenes.modules || []).map((m) => [m.size.replace(/\s*m$/, '').replace('×', 'x') + '-' + m.surface, m.artno]));
const P1 = mod['1x1-halkfri'], P2 = mod['1x2-slät'];
const nyckel = (rader) => frakt.keyFor(rader);

console.log('\n1. MATRIS FÖR SCENPLATTFORMAR');
for (const [n, v] of [[1, 'standard'], [4, 'standard'], [5, 'storbil'], [20, 'storbil']])
  check(`1×1 × ${n} → ${v}`, nyckel([{ artno: P1, qty: n, bulky: true }]), v);
for (const [n, v] of [[1, 'storbil'], [8, 'storbil'], [9, 'lastbil'], [24, 'lastbil']])
  check(`1×2 × ${n} → ${v}`, nyckel([{ artno: P2, qty: n, bulky: true }]), v);
check('1×2 halkfri räknas som 1×2', nyckel([{ artno: mod['1x2-halkfri'], qty: 9 }]), 'lastbil');

console.log('\n2. STÖRSTA FORDONET VINNER');
check('liten forceLeverans sänker inte', nyckel([{ artno: P2, qty: 9, forceLeverans: 'standard' }]), 'lastbil');
check('1×1 × 4 + skrymmande TV → stor bil', nyckel([{ artno: P1, qty: 4 }, { artno: 'SK-BLD-0003', bulky: true }]), 'storbil');
check('tom korg → vanlig bil', nyckel([]), 'standard');

console.log('\n3. SLÄPVAGN ÄR UNDANTAG');
for (const k of Object.keys(tjanster.leverans)) {
  const v = tjanster.leverans[k];
  if (v && v.undantag) {
    check(`${k} väljs aldrig automatiskt`, nyckel([{ artno: 'x', forceLeverans: k }]) === k, false);
    check(`${k} saknas i kundval`, frakt.kundval().includes(k), false);
  }
}
const slapRegler = (tjanster.leverans.selection_rules || []).filter((r) => tjanster.leverans[r.use]?.undantag);
check('inga regler pekar på släpvagn', slapRegler.length, 0);

console.log('\n4. PRODUKTER SOM KRÄVER LÄTT LASTBIL');
check('LED-vägg: leverans_regel.fordon', led.tillbehor.leverans_regel.fordon, 'lastbil');
function hitta(node, artno, ut = []) {
  if (Array.isArray(node)) node.forEach((n) => hitta(n, artno, ut));
  else if (node && typeof node === 'object') {
    if (node.artno === artno) ut.push(node);
    Object.values(node).forEach((n) => hitta(n, artno, ut));
  }
  return ut;
}
check('Live XL (SK-LJD-MUS-0008)', hitta(ljud, 'SK-LJD-MUS-0008')[0]?.forceLeverans, 'lastbil');
check('LED-vägg på tross, paneler', hitta(bild, 'SK-BLD-LED-TR-PNL')[0]?.forceLeverans, 'lastbil');
const tross = hitta(bild, 'SK-BLD-0013')[0];
check('LED-vägg på tross, leveransrad', tross?.linkedServices?.find((s) => s.kind === 'leverans')?.artno, tjanster.leverans.lastbil.artno);

console.log('\n5. INGA DATAFILER PEKAR PÅ SLÄPVAGN');
const slapNycklar = Object.keys(tjanster.leverans).filter((k) => tjanster.leverans[k]?.undantag);
const slapArtno = slapNycklar.map((k) => tjanster.leverans[k].artno);
const traffar = [];
(function gå(node, var_) {
  if (Array.isArray(node)) node.forEach((n, i) => gå(n, `${var_}[${i}]`));
  else if (node && typeof node === 'object') {
    if (slapNycklar.includes(node.forceLeverans)) traffar.push(`${var_} forceLeverans=${node.forceLeverans}`);
    if (node.kind === 'leverans' && slapArtno.includes(node.artno)) traffar.push(`${var_} ${node.artno}`);
    for (const [k, v] of Object.entries(node)) gå(v, `${var_}.${k}`);
  }
})({ scenes, led, bild, ljud }, '');
check('forceLeverans/linkedServices utan släp', traffar.length, 0);
if (traffar.length) traffar.forEach((t) => console.log('     ' + t));

console.log('');
if (fails.length) {
  console.log(`❌ ${fails.length} KONTROLL(ER) MISSLYCKADES\n`);
  fails.forEach((f) => console.log('   - ' + f));
  process.exit(1);
}
console.log(`✅ ALLA ${pass} KONTROLLER GRÖNA`);
