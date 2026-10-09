// test/montering-rader.test.cjs
// Montering på rader som bär sin egen tid (LED-vägg, LED-vägg på tross) —
// varukorg, admin och server ska räkna samma belopp (rättat 2026-10-09).
//   1. Admin byggde om raderna med bara id/artno/qty → LED-väggen blev 0 kr.
//   2. Samma LED-paket två gånger slogs ihop men tiden räknades för en vägg.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const Lib = require(path.join(ROOT, 'src', 'lib', 'montering.cjs'));
const CATALOG = require(path.join(ROOT, 'src', 'data', 'montering-catalog.json'));
const led = require(path.join(ROOT, 'src', 'data', 'led-paneler.json'));
const bild = require(path.join(ROOT, 'src', 'data', 'bild.json'));
const eng = Lib.create(CATALOG);

let pass = 0; const fails = [];
function check(namn, fick, vantat) {
  const ok = JSON.stringify(fick) === JSON.stringify(vantat);
  console.log(`${ok ? '  ✓' : '  ✗'} ${namn}${ok ? '' : ` — fick ${JSON.stringify(fick)}, väntade ${JSON.stringify(vantat)}`}`);
  ok ? pass++ : fails.push(namn);
}
// Som admin bygger raden: id/artno/qty/name + radFalt
const somAdmin = (rader) => rader.map((i) => ({ id: i.id, artno: i.artno || i.id, qty: i.qty, name: i.name, ...Lib.radFalt(i) }));

console.log('\n1. LED-VÄGG: VARUKORG = ADMIN');
const M = led.tillbehor.montering;
const bem = M.bemanning || 1;
const ledRad = (paneler, area, extra = {}) => ({
  id: 'SK-BLD-LED-P26__paket', artno: 'SK-BLD-LED-P26', name: 'LED', qty: paneler,
  assemblyMinutesTotal: Lib.ledMinuter(paneler, area, M), assemblyBemanning: bem, assemblyUnitQty: paneler, ...extra,
});
for (const [paneler, area] of [[15, 3.75], [28, 7], [60, 15], [120, 30]]) {
  const korg = [ledRad(paneler, area), { id: 'SK-BLD-LED-RIGG', artno: 'SK-BLD-LED-RIGG', qty: 1 }];
  const k = eng.calc(korg), a = eng.calc(somAdmin(korg));
  check(`${area} m² — admin = varukorg (${k.kronor} kr)`, a.kronor, k.kronor);
  check(`${area} m² — inte 0 kr`, k.kronor > 0, true);
}

const tillbehor = [{ id: 'SK-BLD-LED-VX400', artno: 'SK-BLD-LED-VX400', qty: 1, monteringIngar: true },
                   { id: 'SK-BLD-LED-RIGG__7kol', artno: 'SK-BLD-LED-RIGG', qty: 1, monteringIngar: true }];
const medTb = eng.calc(somAdmin([ledRad(28, 7), ...tillbehor]));
check('processor och upphängning flaggas inte som saknade', medTb.saknas, []);
check('processor och upphängning ändrar inte beloppet', medTb.kronor, eng.calc([ledRad(28, 7)]).kronor);

console.log('\n2. SAMMA LED-PAKET TVÅ GÅNGER');
const en = eng.calc([ledRad(28, 7)]);
const två = ledRad(28, 7); två.qty = 56;            // skCart.add slår ihop raderna
check('två väggar = dubbla minuter', eng.calc([två]).minuter, en.minuter * 2);
const gammal = { ...ledRad(28, 7) }; delete gammal.assemblyUnitQty; gammal.qty = 56;
check('äldre rad utan assemblyUnitQty räknas som förut', eng.calc([gammal]).minuter, en.minuter);
const extraPanel = ledRad(28, 7); extraPanel.qty = 29;
check('en extra panel ger inte en vägg till', eng.calc([extraPanel]).minuter, en.minuter);

console.log('\n3. LED-VÄGG PÅ TROSS (FAST BELOPP)');
const tross = bild.products.find((p) => p.artno === 'SK-BLD-0013');
const pnl = tross.cartSplit.find((c) => c.monteringFast);
const trossRader = tross.cartSplit.map((c) => ({ ...c, id: c.artno, ...(c.monteringFast ? { assemblyUnitQty: c.qty } : {}) }));
check('varukorg = paketets monteringsbelopp', eng.calc(trossRader).kronor, pnl.monteringFast);
check('admin = varukorg', eng.calc(somAdmin(trossRader)).kronor, pnl.monteringFast);
const trossTvå = trossRader.map((r) => ({ ...r, qty: r.qty * 2 }));
check('två bundlar = dubbelt belopp', eng.calc(trossTvå).kronor, pnl.monteringFast * 2);

console.log('\n4. KODEN FÖR VIDARE FÄLTEN');
const admin = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'admin', 'index.astro'), 'utf8');
check('admin: beräkningen får hela raden', /eng\.calc\(items\.map\([^)]*\.\.\._monFalt\(i\)/.test(admin), true);
check('admin: offertmodalen behåller fälten', /quoteItems\.push\(\{[^}]*category: cat,[\s\S]{0,120}_monFalt\(i\)/.test(admin), true);
check('admin: Produkter-fliken läser tillbaka fälten', admin.includes("get('mon_falt')"), true);
check('admin: LED-konfiguratorn sätter tiden', /ledMinuter\(totalPanels/.test(admin), true);
const layout = fs.readFileSync(path.join(ROOT, 'src', 'layouts', 'Layout.astro'), 'utf8');
check('varukorgen slår ihop assemblyUnitQty', layout.includes("'assemblyUnitQty'"), true);

console.log('');
if (fails.length) {
  console.log(`❌ ${fails.length} KONTROLL(ER) MISSLYCKADES\n`);
  fails.forEach((f) => console.log('   - ' + f));
  process.exit(1);
}
console.log(`✅ ALLA ${pass} KONTROLLER GRÖNA`);
