// test/montering.test.mjs — src/lib/montering.cjs mot montering-catalog.json
// Körs efter generate-catalogs (pretest). Scenarierna är trycktestet från
// Scenkonsult_Monteringstider_v2.xlsx, räknat med avrundning per order.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const Lib = require('../src/lib/montering.cjs');
const catalog = require('../src/data/montering-catalog.json');
const mon = Lib.create(catalog);
const L = (rows) => rows.map(([artno, qty]) => ({ artno, qty }));

const SCEN = {
  'A Fest 50 pers': [['SK-LJD-POR-0003',1],['SK-LJS-PAK-0001',1],['SK-LJD-MIK-0016',1],['SK-LJS-ROK-0007',1]],
  'B Bröllop 100 pers': [['SK-LJD-EVE-0004',1],['SK-LJD-MIK-0026',1],['SK-LJS-PAK-0007',1],['SK-LJS-EFF-0001',8],['SK-DJ-0001',1],['SK-DJ-0005',1]],
  'C Scen 6×4 + liveband': [['SK-SCN-MOD-0003',12],['SK-SCN-ACC-0002',1],['SK-SCN-ACC-0008',1],['SK-SCN-ACC-0007',5],['SK-SCN-ACC-0003',3],['SK-LJD-LIV-0005',1],['SK-LJS-PAK-0009',1],['SK-LJD-MIX-0007',1],['SK-LJD-MIK-0004',6],['SK-LJD-MIK-0006',6],['SK-LJD-MIK-0002',10]],
  'D Konferens': [['SK-BLD-0007',1],['SK-BLD-0010',1],['SK-BLD-0004',2],['SK-BLD-ACC-0003',2],['SK-BLD-ACC-0027',2],['SK-LJD-POR-0001',1],['SK-LJD-MIK-0017',2],['SK-BLD-ACC-0011',1]],
  'E Stort utomhusevent': [['SK-LJD-MUS-0010',1],['SK-LJD-STV-0001',2],['SK-LJS-STV-0011',1],['SK-LJS-PAK-0011',1],['SK-SCN-MOD-0003',24],['SK-SCN-ACC-0002',2],['SK-SCN-ACC-0014',1],['SK-BLD-0011',1],['SK-LJS-ROK-0005',2],['SK-EL-0013',1]],
  'F Litet tal/mingel': [['SK-LJD-POR-0001',1],['SK-LJD-MIX-0005',1],['SK-LJD-MIK-0004',4],['SK-LJD-MIK-0006',4],['SK-LJD-MIK-0033',2]],
  'G DJ-paket Large': [['SK-DJ-PAK-0003',1]],
  'H Ljusrigg på stativ': [['SK-LJS-STV-0002',4],['SK-LJS-EFF-0001',8],['SK-LJS-EFF-0012',4],['SK-LJS-DMX-0003',1],['SK-LJS-DMX-0006',12],['SK-LJS-ROK-0005',1]],
  'I Scengolv 20 m² + filtmatta': [['SK-SCN-MOD-0002',10],['SK-SCN-ACC-0015',20]],
  'J 10 LED PAR': [['SK-LJS-EFF-0001',10]],
};

const out = {};
for (const [name, rows] of Object.entries(SCEN)) {
  const r = mon.calc(L(rows));
  out[name] = r;
  console.log(`${name.padEnd(30)} ${String(r.minuter).padStart(4)} min  ${String(r.kronor).padStart(6)} kr` +
    (r.manuella.length ? `  (manuell: ${r.manuella.join(', ')})` : '') +
    (r.saknas.length ? `  SAKNAS: ${r.saknas.join(', ')}` : ''));
  assert.equal(r.saknas.length, 0, `${name}: artiklar saknar tid`);
  assert.equal(r.minuter % 15, 0, `${name}: ej avrundat till kvart`);
}

// Regler
assert.equal(out['G DJ-paket Large'].kronor, 600, 'DJ-paket = 60 min fast, 600 kr');
assert.deepEqual(out['E Stort utomhusevent'].manuella, ['SK-BLD-0011'], 'LED-trailer manuell');
// 10 LED PAR ≈ 45 min på plats (10 × 10^0.65 = 44.7) → ×2 demontering = 90 min
assert.equal(out['J 10 LED PAR'].minuter, 90);
// Yta: 1 m² ≈ 10 min, 20 m² ≈ 30 min
assert.ok(Math.abs(mon.calc(L([['SK-SCN-ACC-0015', 20]])).rader[0].tid - 30.3) < 0.2);
// Tomt och bara kablar
assert.equal(mon.calc([]).kronor, 0);
assert.equal(mon.calc(L([['SK-LJD-MIK-0002', 10]])).kronor, 0);
// Minsta debitering 15 min per order
assert.equal(mon.calc(L([['SK-LJD-MIK-0006', 1]])).minuter, 15);
// Samma artikel på två rader = en grupp
assert.equal(mon.calc(L([['SK-LJS-EFF-0001', 5], ['SK-LJS-EFF-0001', 5]])).minuter, 90);
// Scenpaket expanderas till moduler
assert.deepEqual(mon.calc(L([['SK-SCN-0001', 1]])).minuter, mon.calc(L([['SK-SCN-MOD-0001', 4]])).minuter);
// Slug-id utan artno
const slugEntry = Object.entries(catalog.alias).find(([, a]) => a === 'SK-LJS-EFF-0001');
if (slugEntry) assert.equal(mon.calc([{ id: slugEntry[0], qty: 10 }]).minuter, 90);
// Varukorgsflaggor: monteringFast (bundle) och assemblyMinutesTotal (LED-vägg)
assert.equal(mon.calc([{ artno: 'SK-BLD-LED-P26', id: 'SK-BLD-LED-P26__5x3', qty: 15, assemblyMinutesTotal: 300 }]).kronor, 3000);
assert.equal(mon.calc([{ artno: 'SK-BLD-LED-P26', qty: 12, monteringFast: 4524, assemblyMinutesTotal: 282.6 }]).kronor, 4524);
// LED-vägg monteras av 2 tekniker: 6 h på plats → 12 h teknikertid
assert.equal(mon.calc([{ artno: 'SK-BLD-LED-P26', qty: 15, assemblyMinutesTotal: 360, assemblyBemanning: 2 }]).kronor, 7200);
// Katalogtiden vinner över gammal stämpel på modulraden
assert.equal(mon.calc([{ artno: 'SK-SCN-MOD-0002', qty: 10, assemblyMinutesTotal: 999 }]).minuter,
             mon.calc(L([['SK-SCN-MOD-0002', 10]])).minuter);
console.log('✅ montering.test OK');
