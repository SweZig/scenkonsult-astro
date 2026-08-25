// Simulerar offertmodalens dygnsflöde — "ny offert"-vägen som saknades i release B.
import {applyDayPricing,isDayPriced,clampDays,dayRungs,cartDaySummary,dayConfigFrom,autoDays} from '../src/lib/day-pricing.js';
import fs from 'fs';
const cfg=dayConfigFrom(JSON.parse(fs.readFileSync('src/data/tjanster.json')));
let pass=0,fail=0;
const t=(n,f,v)=>{const ok=JSON.stringify(f)===JSON.stringify(v);ok?pass++:fail++;
  console.log((ok?'  ✓ ':'  ✗ ')+n.padEnd(50)+String(JSON.stringify(f)).padStart(9)+(ok?'':' ← väntade '+JSON.stringify(v)));};

// Precis scenariot i skärmbilden: ny offert, 12–16 okt, en produkt
let quoteItems=[{id:'SK-BLD-PD-0001',name:'Pipe & Drape Komplett vagn',category:'Bild',type:'product',qty:1,price:5995}];

console.log('SCENARIO: ny offert, 2026-10-12 → 2026-10-16');
const d=autoDays('2026-10-12','2026-10-16',cfg);
t('autoDays ur modalens datumfält', d, 4);
t('utgångsläge: totalt', quoteItems.reduce((s,i)=>s+i.price*i.qty,0), 5995);

console.log('\n"Sätt alla produktrader till 4 dygn"');
quoteItems=quoteItems.map(i=>isDayPriced(i)?applyDayPricing(i,d,cfg,i.day_ladder):applyDayPricing(i,1,cfg));
t('days', quoteItems[0].days, 4);
t('unit_price bevarat', quoteItems[0].unit_price, 5995);
t('faktor 4 dygn', quoteItems[0].day_factor, 2.25);
t('price = 5995 × 2,25', quoteItems[0].price, 13489);
const s1=cartDaySummary(quoteItems);
t('ordinarie 5995×4', s1.ordinarie, 23980);
t('rabatt', s1.rabatt, 10491);

console.log('\nÄNDRA À-PRIS (redigerar unit_price när days > 1)');
{const it={...quoteItems[0]}; it.unit_price=6500;
 quoteItems[0]=applyDayPricing(it,it.days,cfg,it.day_ladder);
 t('nytt dygnspris', quoteItems[0].unit_price, 6500);
 t('price räknas om', quoteItems[0].price, Math.round(6500*2.25));}

console.log('\nEGEN RABATT: dag 4 → −100 % (gratis)');
{const it={...quoteItems[0]};
 const r=dayRungs(4,cfg,it.day_ladder); r[3]=100; it.day_ladder=r;
 quoteItems[0]=applyDayPricing(it,it.days,cfg,it.day_ladder);
 t('stege', quoteItems[0].day_ladder, [0,50,50,100]);
 t('faktor', quoteItems[0].day_factor, 2);
 t('price', quoteItems[0].price, 13000);}

console.log('\nTJÄNSTER LÅSES ÄVEN HÄR');
quoteItems.push({id:'lev-storbil',name:'Leverans',category:'Tjänster',type:'service',qty:1,price:1438});
quoteItems=quoteItems.map(i=>isDayPriced(i)?applyDayPricing(i,4,cfg,i.day_ladder):applyDayPricing(i,1,cfg));
t('leverans days', quoteItems[1].days, 1);
t('leverans pris orört', quoteItems[1].price, 1438);

console.log('\nsendQuote skickar hela objekten');
const post=JSON.parse(JSON.stringify({items:quoteItems}));
t('days följer med', post.items[0].days, 4);
t('unit_price följer med', post.items[0].unit_price, 6500);
t('day_ladder följer med', post.items[0].day_ladder, [0,50,50,100]);

console.log('\nENDAGSOFFERT — inget ska ändras');
const en=[{id:'X',name:'Y',category:'Ljud',type:'product',qty:2,price:800}];
const se=cartDaySummary(en);
t('hasMultiDay', se.hasMultiDay, false);
t('rabatt', se.rabatt, 0);
t('totalt', en.reduce((s,i)=>s+i.price*i.qty,0), 1600);

console.log('\n'+(fail===0?`✅ ALLA ${pass} TESTER GRÖNA`:`❌ ${fail} FALLERADE`));
process.exit(fail?1:0);
