// Simulerar Produkter-flikens dygnsflöde mot den riktiga räknemotorn.
import {applyDayPricing,isDayPriced,clampDays,dayRungs,cartDaySummary,dayConfigFrom,autoDays} from '../src/lib/day-pricing.js';
import fs from 'fs';
const cfg = dayConfigFrom(JSON.parse(fs.readFileSync('src/data/tjanster.json')));
let pass=0,fail=0;
const t=(n,f,v)=>{const ok=JSON.stringify(f)===JSON.stringify(v);ok?pass++:fail++;
  console.log((ok?'  ✓ ':'  ✗ ')+n.padEnd(50)+String(JSON.stringify(f)).padStart(9)+(ok?'':' ← väntade '+JSON.stringify(v)));};

// Varukorg som kunden skickat in (allt 1 dygn, som idag)
let items=[
  {id:'SK-SCN-0002',name:'Scenpaket Medium',category:'Scen',type:'product',price:1499,qty:1},
  {id:'SK-LJS-PAR-0011',name:'LED PAR 64',category:'Ljus',type:'product',price:68,qty:8},
  {id:'SK-LJD-MIK-0014',name:'Trådlös mik',category:'Ljud',type:'product',price:450,qty:2},
  {id:'lev-storbil',name:'Leverans',category:'Tjänster',type:'service',price:1200,qty:1},
  {id:'montering',name:'Montering',category:'Tjänster',type:'service',price:1800,qty:1},
  {_note:true,id:'_note',name:'Ring innan leverans',price:0,qty:1},
];
const excl=a=>a.filter(i=>!i._note);
const tot=a=>excl(a).reduce((s,i)=>s+i.price*i.qty,0);

console.log('UTGÅNGSLÄGE (allt 1 dygn — som före ändringen)');
t('totalt exkl. moms', tot(items), 5943);

// prodApplyDaysToAll(3) — hyresperiodsraden
console.log('\n"Sätt alla produktrader till 3 dygn"');
const note=items.find(i=>i._note);
items=[...excl(items).map(i=>isDayPriced(i)?applyDayPricing(i,3,cfg,i.day_ladder):applyDayPricing(i,1,cfg)),note];
t('scen 1499×2,00',        excl(items)[0].price, 2998);
t('LED PAR 68×2,00',       excl(items)[1].price, 136);
t('mik 450×2,00',          excl(items)[2].price, 900);
t('leverans låst 1 dygn',  excl(items)[3].days, 1);
t('leverans pris orört',   excl(items)[3].price, 1200);
t('montering låst 1 dygn', excl(items)[4].days, 1);
t('_note överlever',       !!items.find(i=>i._note), true);
t('totalt exkl. moms',     tot(items), 8886);

// Radpanel: dag 3 på mikrofonen till −75 %
console.log('\nEgen rabatt: mikrofonens dag 3 → −75 %');
{const r=excl(items); const it={...r[2]};
 const rungs=dayRungs(3,cfg,it.day_ladder); rungs[2]=75; it.day_ladder=rungs;
 r[2]=applyDayPricing(it,it.days,cfg,it.day_ladder);
 items=[...r,note];
 t('stege blir radspecifik', excl(items)[2].day_ladder, [0,50,75]);
 t('450×1,75=787,5 → 788',   excl(items)[2].price, 788);
 t('2 × 788 = 1576',          excl(items)[2].price*2, 1576);
 t('totalt',                  tot(items), 8662);}

// Sammanställningen som styr totalblocken
console.log('\nSAMMANSTÄLLNING');
const s=cartDaySummary(excl(items));
t('ordinarie',   s.ordinarie, 11829);
t('rabatt',      s.rabatt, 3167);
t('hasMultiDay', s.hasMultiDay, true);
t('maxDays',     s.maxDays, 3);

// prodSave → cart-update → refresh → renderTab: fälten måste överleva
console.log('\nRUNDTUR GENOM SPARNING (JSON till DB och tillbaka)');
const efter=JSON.parse(JSON.stringify(items));
t('days överlever',       excl(efter)[0].days, 3);
t('unit_price överlever', excl(efter)[0].unit_price, 1499);
t('day_factor överlever', excl(efter)[0].day_factor, 2);
t('ladder överlever',     excl(efter)[2].day_ladder, [0,50,75]);
const igen=excl(efter).map(i=>applyDayPricing(i,i.days,cfg,i.day_ladder));
t('omräkning ger samma pris', igen.map(i=>i.price), excl(items).map(i=>i.price));

// Tillbaka till 1 dygn
console.log('\nÅNGRA — tillbaka till 1 dygn');
const ett=excl(items).map(i=>applyDayPricing(i,1,cfg,i.day_ladder));
t('scen tillbaka till listpris', ett[0].price, 1499);
t('mik tillbaka till listpris',  ett[2].price, 450);
t('totalt som från början',      ett.reduce((s,i)=>s+i.price*i.qty,0), 5943);

console.log('\nAUTODYGN ur orderns datum');
t('2026-08-27 → 2026-08-29', autoDays('2026-08-27','2026-08-29',cfg), 2);

console.log('\n'+(fail===0?`✅ ALLA ${pass} TESTER GRÖNA`:`❌ ${fail} FALLERADE`));
process.exit(fail?1:0);
