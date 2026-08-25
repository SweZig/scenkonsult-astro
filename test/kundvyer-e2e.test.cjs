const R=require('path').resolve(__dirname,'..')+'/';
const D=require(R+'netlify/functions/_day-display.js');
const {buildPriceTable}=require(R+'netlify/functions/_lib.js');
const f=n=>Math.round(n).toLocaleString('sv-SE').replace(/ /g,' ');
let pass=0,fail=0;
const t=(n,a,b)=>{const ok=JSON.stringify(a)===JSON.stringify(b);ok?pass++:fail++;
  console.log((ok?'  ✓ ':'  ✗ ')+n.padEnd(48)+String(JSON.stringify(a)).padStart(12)+(ok?'':' ← väntade '+JSON.stringify(b)));};

// Vad admin sparat efter "Sätt alla produktrader till 3 dygn"
const items=[
 {id:'SK-SCN-0002',artno:'SK-SCN-0002',name:'Scenpaket Medium 4×3 m',category:'Scen',type:'product',qty:1,price:2998,days:3,unit_price:1499,day_factor:2},
 {id:'SK-LJS-PAR-0011',artno:'SK-LJS-PAR-0011',name:'LED PAR 64 RGBW',category:'Ljus',type:'product',qty:8,price:136,days:3,unit_price:68,day_factor:2},
 {id:'SK-LJD-MIK-0014',artno:'SK-LJD-MIK-0014',name:'Trådlös handmikrofon',category:'Ljud',type:'product',qty:2,price:788,days:3,unit_price:450,day_factor:1.75,day_ladder:[0,50,75]},
 {id:'lev-storbil',name:'Leverans & upphämtning (t&r)',category:'Tjänster',type:'service',qty:1,price:1200},
 {id:'montering',name:'Montering & demontering',category:'Tjänster',type:'service',qty:1,price:1800},
 {_note:true,id:'_note',name:'Ring 30 min innan leverans',price:0,qty:1},
];
const real=items.filter(i=>!i._note);

console.log('1. INVARIANTEN — price × qty måste vara radsumman överallt');
real.forEach(i=>t('  '+i.name.slice(0,30), i.price*i.qty, D.lineTotal(i)));
t('summa exkl. moms', real.reduce((s,i)=>s+i.price*i.qty,0), 8662);

console.log('\n2. DYGNSSAMMANSTÄLLNING');
const ds=D.daySummary(items);
t('ordinarie',ds.ordinarie,11829); t('rabatt',ds.rabatt,3167);
t('faktiskt',ds.faktiskt,8662); t('maxDays',ds.maxDays,3); t('hasMultiDay',ds.hasMultiDay,true);

console.log('\n3. TJÄNSTER FÅR STRECK, ALDRIG "1"');
t('scen',D.dayCell(real[0]),'3'); t('leverans',D.dayCell(real[3]),'—'); t('montering',D.dayCell(real[4]),'—');

console.log('\n4. À-PRIS SOM KUNDEN SER = dygnspriset från sajten');
t('scen',D.itemUnitPrice(real[0]),1499);
t('LED PAR',D.itemUnitPrice(real[1]),68);
t('mik',D.itemUnitPrice(real[2]),450);
t('inget kundvänt fält visar 2998',D.itemUnitPrice(real[0])!==2998,true);

console.log('\n5. KOLUMNERNA MULTIPLICERAS IHOP RÄTT');
real.filter(i=>D.isDayPriced(i)).forEach(i=>
  t('  '+i.name.slice(0,26)+' antal×dygn×pris', D.itemQty(i)*D.itemDays(i)*D.itemUnitPrice(i), D.lineTotalUndiscounted(i)));

console.log('\n6. FÖRKLARINGSRADER');
console.log('   "'+D.dayNote(real[0])+'"');
console.log('   "'+D.dayNote(real[2])+'"');
t('tjänst får ingen not',D.dayNote(real[3]),'');
t('inget U+2212 i noten',/−/.test(D.dayNote(real[0])),false);

console.log('\n7. MAILTABELLEN (_lib.buildPriceTable)');
const html=buildPriceTable(items);
t('flerdygnsrad finns',html.includes('Flerdygnsrabatt'),true);
const _plain=html.replace(/\u00a0/g,' ');
t('rabattbelopp i mailet',/>-3 167 kr</.test(_plain),true);
t('ordinarie överstruket',html.includes('line-through'),true);
t('visar 1 499 kr/dygn',html.includes('1 499 kr/dygn'),true);
t('anmärkningen med',html.includes('Ring 30 min innan'),true);
const tot=(_plain.match(/TOTALT inkl\. moms[\s\S]*?>([\d ]+) kr/)||[])[1];
t('totalt inkl. moms',tot,'10 828');

console.log('\n8. ENDAGSKORG — allt ska se ut som förut');
const endag=[{id:'SK-SCN-0002',name:'Scenpaket',category:'Scen',qty:1,price:1499},
             {id:'lev-storbil',name:'Leverans',category:'Tjänster',type:'service',qty:1,price:1200}];
const h2=buildPriceTable(endag), d2=D.daySummary(endag);
t('hasMultiDay',d2.hasMultiDay,false);
t('ingen rabattrad',h2.includes('Flerdygnsrabatt'),false);
t('ingen förklaringsrad',h2.includes('hyresdygn'),false);
t('rabatt = 0',d2.rabatt,0);

console.log('\n9. GAMLA RADER UTAN days (bakåtkompatibilitet)');
const gammal=[{id:'SK-SCN-0002',name:'Scen',category:'Scen',qty:2,price:1499}];
t('days → 1',D.itemDays(gammal[0]),1);
t('unit_price → price',D.itemUnitPrice(gammal[0]),1499);
t('ordinarie = faktiskt',D.lineTotalUndiscounted(gammal[0]),D.lineTotal(gammal[0]));
t('ingen rabatt',D.daySummary(gammal).rabatt,0);

console.log('\n'+(fail===0?`✅ ALLA ${pass} KONTROLLER GRÖNA`:`❌ ${fail} AV ${pass+fail} FALLERADE`));
process.exit(fail?1:0);
