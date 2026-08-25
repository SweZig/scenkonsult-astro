import {dayFactor,dayRungs,applyDayPricing,autoDays,isDayPriced,clampDays,
        lineTotal,lineTotalUndiscounted,cartDaySummary,dayConfigFrom,dayDiscountPct} from '../src/lib/day-pricing.js';
import fs from 'fs';
const cfg = dayConfigFrom(JSON.parse(fs.readFileSync('src/data/tjanster.json')));

let pass=0,fail=0;
const t=(namn,fick,vantat)=>{
  const ok=JSON.stringify(fick)===JSON.stringify(vantat);
  ok?pass++:fail++;
  console.log((ok?'  ✓ ':'  ✗ ')+namn.padEnd(52)+String(JSON.stringify(fick)).padStart(10)+(ok?'':'  ← väntade '+JSON.stringify(vantat)));
};

console.log('KONFIG:', JSON.stringify({standard:cfg.standard,fort:cfg.fortsattning}));
console.log('\nDAGFAKTOR');
t('1 dygn = exakt 1,0 (endagshyror oförändrade)', dayFactor(1,cfg), 1);
t('2 dygn (0 + 50 % rabatt)',   dayFactor(2,cfg), 1.5);
t('3 dygn (0 + 50 + 50)',       dayFactor(3,cfg), 2);
t('4 dygn (+ 75 %)',            dayFactor(4,cfg), 2.25);
t('7 dygn (helvecka)',          dayFactor(7,cfg), 3);
t('rungs 4 dygn = rabatt/dag',  dayRungs(4,cfg), [0,50,50,75]);
t('egen stege 0/50/75',         dayFactor(3,cfg,[0,50,75]), 1.75);
t('dag 2 gratis (−100 %)',      dayFactor(2,cfg,[0,100]), 1);

console.log('\nCLAMP & ROBUSTHET');
t('0 dygn → 1',      clampDays(0,cfg), 1);
t('-5 dygn → 1',     clampDays(-5,cfg), 1);
t('2.7 dygn → 2',    clampDays(2.7,cfg), 2);
t('999 → maxDygn',   clampDays(999,cfg), 30);
t('"abc" → 1',       clampDays('abc',cfg), 1);
t('rabatt 150 klamras till 100', dayFactor(2,cfg,[0,150]), 1);
t('rabatt -50 klamras till 0',   dayFactor(2,cfg,[0,-50]), 2);

console.log('\nisDayPriced');
t('vanlig produkt',            isDayPriced({id:'SK-LJD-HOG-0004',category:'Ljud'}), true);
t('montering',                 isDayPriced({id:'montering'}), false);
t('type=service',              isDayPriced({id:'x',type:'service'}), false);
t('kategori Tjänster',         isDayPriced({id:'x',category:'Tjänster'}), false);
t('leverans via artno',        isDayPriced({artno:'SK-LEV-0006'}), false);
t('DJ (personal)',             isDayPriced({artno:'SK-DJ-0010'}), false);
t('ljudtekniker',              isDayPriced({artno:'SK-LJT-0001'}), false);
t('_note',                     isDayPriced({_note:true,id:'_note'}), false);

console.log('\napplyDayPricing');
const hog={id:'SK-LJD-HOG-0004',category:'Ljud',price:900,qty:2};
const r2=applyDayPricing(hog,2,cfg);
t('900 kr, 2 dygn → price',    r2.price, 1350);
t('unit_price bevarat',        r2.unit_price, 900);
t('day_factor',                r2.day_factor, 1.5);
t('radsumma price × qty',      lineTotal(r2), 2700);
t('ordinarie 900×2×2',         lineTotalUndiscounted(r2), 3600);
t('rabatt i procent',          dayDiscountPct(r2), 25);

console.log('\nIDEMPOTENS — den kritiska regeln');
const en=applyDayPricing(hog,3,cfg), tva=applyDayPricing(en,3,cfg), tre=applyDayPricing(tva,3,cfg);
t('kör 1 gång',  en.price, 1800);
t('kör 2 gånger', tva.price, 1800);
t('kör 3 gånger', tre.price, 1800);
t('unit_price orört efter 3 varv', tre.unit_price, 900);
const ner=applyDayPricing(tre,1,cfg);
t('tillbaka till 1 dygn → listpris', ner.price, 900);

console.log('\nTJÄNSTER LÅSES');
const mon=applyDayPricing({id:'montering',category:'Tjänster',price:1800,qty:1},3,cfg);
t('montering: days tvingas till 1', mon.days, 1);
t('montering: pris oförändrat',     mon.price, 1800);

console.log('\nAVRUNDNING — antal × à-pris måste bli delsumman');
const mik=applyDayPricing({id:'SK-LJD-MIK-0014',category:'Ljud',price:450,qty:2},3,cfg,[0,50,75]);
t('450 × 1,75 = 787,5 → 788',  mik.price, 788);
t('2 × 788 = 1576 exakt',       lineTotal(mik), 1576);
t('à-pris × antal stämmer',     mik.price*2 === lineTotal(mik), true);

console.log('\nautoDays');
t('27→29 aug = 2 dygn',   autoDays('2026-08-27','2026-08-29',cfg), 2);
t('samma dag = 1 dygn',   autoDays('2026-09-12','2026-09-12',cfg), 1);
t('12→15 sep = 3 dygn',   autoDays('2026-09-12','2026-09-15',cfg), 3);
t('retur före start',     autoDays('2026-09-15','2026-09-12',cfg), null);
t('saknat datum',         autoDays('2026-09-12',null,cfg), null);
t('med tidsstämpel',      autoDays('2026-09-12T13:00:00Z','2026-09-15T11:00:00Z',cfg), 3);

console.log('\nBAKÅTKOMPATIBILITET — gammal rad utan days');
const gammal={id:'SK-SCN-0002',category:'Scen',price:1499,qty:1};
t('lineTotal som förr',          lineTotal(gammal), 1499);
t('ordinarie = samma',           lineTotalUndiscounted(gammal), 1499);
const s0=cartDaySummary([gammal]);
t('summary: ingen rabatt',       s0.rabatt, 0);
t('summary: inte flerdygn',      s0.hasMultiDay, false);

console.log('\nHELA KORGEN (exemplet ur designskissen)');
const korg=[
  applyDayPricing({id:'SK-SCN-0002',category:'Scen',price:1499,qty:1},3,cfg),
  applyDayPricing({id:'SK-LJS-PAR-0011',category:'Ljus',price:68,qty:8},3,cfg),
  applyDayPricing({id:'SK-LJD-MIK-0014',category:'Ljud',price:450,qty:2},3,cfg,[0,50,75]),
  applyDayPricing({id:'lev-storbil',category:'Tjänster',price:1200,qty:1},3,cfg),
  applyDayPricing({id:'montering',category:'Tjänster',price:1800,qty:1},3,cfg),
];
const s=cartDaySummary(korg);
t('ordinarie',   s.ordinarie, 11829);
t('faktiskt',    s.faktiskt, 8662);
t('rabatt',      s.rabatt, 3167);
t('maxDays',     s.maxDays, 3);
t('hasMultiDay', s.hasMultiDay, true);

console.log('\n'+(fail===0?`✅ ALLA ${pass} TESTER GRÖNA`:`❌ ${fail} AV ${pass+fail} FALLERADE`));
process.exit(fail?1:0);
