// DOM-RUNDTUREN — testluckan som lät bugg #1 slinka igenom.
// Tidigare tester körde räknemotorn direkt. Den här bygger den FAKTISKA
// radmarkeringen ur admin/index.astro, parsar den med jsdom och kör
// prodGetItems() logik mot den — precis som webbläsaren gör vid Spara.
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(ROOT,'src/pages/admin/index.astro'),'utf8');

let pass=0,fail=0;
const t=(n,f,v)=>{const ok=JSON.stringify(f)===JSON.stringify(v);ok?pass++:fail++;
  console.log((ok?'  ✓ ':'  ✗ ')+n.padEnd(52)+String(JSON.stringify(f)).padStart(8)+(ok?'':' ← väntade '+JSON.stringify(v)));};

// ── 1. STRUKTURKONTROLL mot källkoden ──────────────────────────
console.log('KÄLLKOD — prisfältets kontrakt');
const harUnitEdit = src.includes("'unit_price_edit' : 'price'");
const harDoldPris = /data-field="price"[^>]*value="\$\{price\}"/.test(src)
                 || src.includes('data-field="price" data-idx="${idx}" value="${price}"');
t('flerdygnsraden byter till unit_price_edit', harUnitEdit, true);
t('…och har ett DOLT data-field="price"', harDoldPris, true);
t('prodGetItems läser unit_price_edit', src.includes("get('unit_price_edit')"), true);

// ── 2. RIKTIG DOM-RUNDTUR ──────────────────────────────────────
// Återskapa radens fältuppsättning för båda lägena och kör läsningen.
function byggRad(item){
  const dayOK = !['Tjänster','Tillägg','Leverans'].includes(item.category) && item.type!=='service';
  const days = item.days||1, unit = item.unit_price ?? item.price, price = item.price;
  return `<tr class="prod-row">
    <td>
      <input data-field="name" value="${item.name}">
      <input type="hidden" data-field="category" value="${item.category||''}">
      <input type="hidden" data-field="id" value="${item.id}">
      <input type="hidden" data-field="type" value="${item.type||'product'}">
      <input type="hidden" data-field="artno" value="${item.artno||''}">
      <input type="hidden" data-field="days" value="${days}">
      <input type="hidden" data-field="unit_price" value="${unit}">
      ${dayOK && days>1 ? `<input type="hidden" data-field="price" value="${price}">` : ''}
      <input type="hidden" data-field="day_factor" value="${item.day_factor??1}">
      <input type="hidden" data-field="day_ladder" value="">
    </td>
    <td><input data-field="qty" value="${item.qty}"></td>
    <td><input data-field="${dayOK&&days>1?'unit_price_edit':'price'}" value="${dayOK&&days>1?unit:price}"></td>
  </tr>`;
}
// prodGetItems läsning, kopierad ur admin/index.astro
function lasRad(row){
  const get=f=>row.querySelector(`[data-field="${f}"]`)?.value?.trim()||'';
  const qty=parseInt(get('qty'))||1;
  const days=parseInt(get('days'))||1;
  const priceRaw=get('price'), unitEditRaw=get('unit_price_edit'), unitRaw=get('unit_price');
  const unit_price = unitEditRaw!=='' ? (parseFloat(unitEditRaw)||0)
                   : unitRaw!=='' ? (parseFloat(unitRaw)||0)
                   : (parseFloat(priceRaw)||0);
  const factorRaw=get('day_factor');
  const day_factor = factorRaw===''?1:(parseFloat(factorRaw)||1);
  const price = priceRaw!=='' && unitEditRaw===''
    ? (parseFloat(priceRaw)||0)
    : Math.round(unit_price*(day_factor||1));
  return {id:get('id'),name:get('name'),qty,price,days,unit_price,day_factor};
}
const fall=[
  {namn:'endagsrad',            item:{id:'A',name:'Scen',category:'Scen',qty:1,price:1499},                                    pris:1499, unit:1499},
  {namn:'3 dygn (faktor 2,0)',  item:{id:'B',name:'Scen',category:'Scen',qty:1,price:2998,days:3,unit_price:1499,day_factor:2},pris:2998, unit:1499},
  {namn:'4 dygn (faktor 2,25)', item:{id:'C',name:'Vagn',category:'Bild',qty:1,price:13489,days:4,unit_price:5995,day_factor:2.25},pris:13489,unit:5995},
  {namn:'tjänst (låst 1 dygn)', item:{id:'montering',name:'Montering',category:'Tjänster',type:'service',qty:1,price:1800},    pris:1800, unit:1800},
];
console.log('\nDOM-RUNDTUR — bygg rad → läs tillbaka (som vid Spara)');
for(const f of fall){
  const dom=new JSDOM(`<table><tbody>${byggRad(f.item)}</tbody></table>`);
  const r=lasRad(dom.window.document.querySelector('.prod-row'));
  t(f.namn+': price',      r.price, f.pris);
  t(f.namn+': unit_price', r.unit_price, f.unit);
}

console.log('\nREGRESSIONEN SOM MISSADES — price får ALDRIG bli 0');
for(const f of fall){
  const dom=new JSDOM(`<table><tbody>${byggRad(f.item)}</tbody></table>`);
  const r=lasRad(dom.window.document.querySelector('.prod-row'));
  t('  '+f.namn, r.price>0, true);
}

console.log('\nTOTALSUMMA ÖVER HELA TABELLEN');
const dom=new JSDOM(`<table><tbody>${fall.map(f=>byggRad(f.item)).join('')}</tbody></table>`);
const rader=[...dom.window.document.querySelectorAll('.prod-row')].map(lasRad);
const total=rader.reduce((s,i)=>s+i.price*i.qty,0);
t('summa exkl. moms', total, 1499+2998+13489+1800);
t('ingen rad har price 0', rader.every(r=>r.price>0), true);

console.log('\n'+(fail===0?`✅ ALLA ${pass} TESTER GRÖNA`:`❌ ${fail} FALLERADE`));
process.exit(fail?1:0);
