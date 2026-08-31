// Vaktar att flerdygnsrabattens SATSER aldrig publiceras kundvänt.
// Regeln: kunden ska se VAD hen sparar (kronor, överstruket ordinariepris),
// aldrig HUR satsen är uppbyggd. Satserna är intern prispolicy.
// Adminpanelen är undantagen — där ska full detalj finnas.
const fs = require('fs');
const D  = require('../netlify/functions/_day-display.js');
const T  = JSON.parse(fs.readFileSync('src/data/tjanster.json', 'utf8'));

let pass = 0, fail = 0;
const t = (n, f, v) => { const ok = JSON.stringify(f) === JSON.stringify(v); ok ? pass++ : fail++;
  console.log((ok ? '  ✓ ' : '  ✗ ') + n.padEnd(56) + String(JSON.stringify(f)).slice(0, 40) + (ok ? '' : ' ← väntade ' + JSON.stringify(v))); };

// Mönster som avslöjar trappan
const SATSER = /(dag\s*[2-9][^.]{0,30}?\d{1,3}\s*%)|(\d{1,3}\s*%\s*(rabatt\s*)?(på|från)\s*dag)|(halva priset dygn)|(dagfaktor)/i;

console.log('KUNDVÄNDA YTOR — inga satser');

// 1) Radnoten i PDF och kundvyer
const rad = { id:'SK-SCN-0002', category:'Scen', qty:1, days:3, unit_price:1499, price:2998 };
const not = D.dayNote(rad);
t('radnot innehåller dygn och dygnspris', /3 hyresdygn/.test(not) && /1 499 kr\/dygn/.test(not), true);
t('radnot nämner rabatten utan procent', not, '3 hyresdygn · 1 499 kr/dygn · flerdygnsrabatt');
t('radnot saknar procenttecken', /%/.test(not), false);

// 2) kundtext i datafilen
const kt = T.hyresdagar.kundtext;
t('kundtext saknar satser', SATSER.test(kt), false);
t('kundtext saknar procenttecken', /%/.test(kt), false);
t('kundtext hänvisar till offert', /offert/i.test(kt), true);

// 3) Hyresvillkoren
const v = fs.readFileSync('netlify/functions/_invoice-villkor.js', 'utf8');
t('villkoren saknar satser', SATSER.test(v), false);
t('villkoren nämner flerdygnsrabatt', /flerdygnsrabatt/i.test(v), true);
t('villkoren hänvisar till offerten', /framgår av offerten/i.test(v), true);

// 4) Varukorgen
const cart = fs.readFileSync('src/pages/varukorg/index.astro', 'utf8');
const ruta = cart.slice(cart.indexOf('flerdygn-hint'), cart.indexOf('flerdygn-hint') + 1200);
t('varukorgsrutan saknar satser', SATSER.test(ruta), false);
t('varukorgsrutan hänvisar till offert', /offertförfrågan/i.test(ruta), true);

// 5) Sven får räkna men inte avslöja
const sven = fs.readFileSync('netlify/functions/sven-chat.mjs', 'utf8');
const block = sven.slice(sven.indexOf('HYRESDYGN OCH FLERDYGNSRABATT'), sven.indexOf('HYRESDYGN OCH FLERDYGNSRABATT') + 1400);
t('Sven har faktorerna kvar (för att räkna rätt)', /2 dygn = 1,5/.test(block), true);
t('Sven saknar procentsatser per dag', /Dag 2: 50 % rabatt/.test(block), false);
t('Sven instrueras att inte avslöja', /ALDRIG säga hur de är uppbyggda/.test(block), true);

// 6) Det kunden SKA se finns kvar
console.log('\nDET KUNDEN SKA SE — kvar orört');
const order = fs.readFileSync('src/pages/order/index.astro', 'utf8');
t('ordersidan: sparbeloppet i kronor', /ni sparar \$\{fmt\(_bannerDs\.rabatt\)\} kr/.test(order), true);
t('ordersidan: rabattrad i totalen', /Flerdygnsrabatt<\/span><span>-\$\{fmt\(_ds\.rabatt\)\} kr/.test(order), true);
t('ordinariepris räknas fortfarande', D.lineTotalUndiscounted(rad), 4497);

// 7) Admin behåller full detalj
console.log('\nADMIN — full detalj kvar (internt)');
const admin = fs.readFileSync('src/pages/admin/index.astro', 'utf8');
t('radpanelen visar rabatt per dag', /Rabatt per dag/.test(admin), true);
t('admin visar procent på raden', /dayDiscountPct/.test(admin), true);

console.log('\n' + (fail === 0 ? `✅ ALLA ${pass} KONTROLLER GRÖNA` : `❌ ${fail} FALLERADE`));
process.exit(fail ? 1 : 0);
