// test/momsfri-kund.test.cjs
// Utländsk företagskund — faktureras utan svensk moms (2026-11-02).
// Regeln ligger i src/lib/moms.cjs. Supabase och Resend stubbas: inget nätverk.
//   1. Regeln: vem är momsfri, belopp, kontroller av land och VAT-nummer.
//   2. Admin sparar (cart-update): fel avvisas, låst efter skickad faktura.
//   3. Fakturans PDF-delar: rubrik, kundens VAT-nr, summa, lagtext, vårt momsreg.nr.
//   4. Mejlens pristabell: ingen moms och rätt text.
//   5. Ingen egen momsräkning (* 1.25 / * 0.25) utanför regeln.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
process.env.SUPABASE_URL = 'https://stub.supabase.local';
process.env.SUPABASE_SERVICE_KEY = 'stub';
process.env.ADMIN_TOKEN = 'admin-test';
delete process.env.RESEND_API_KEY;

const Moms = require(path.join(ROOT, 'src', 'lib', 'moms.cjs'));

let pass = 0; const fails = [];
function check(namn, fick, vantat) {
  const ok = JSON.stringify(fick) === JSON.stringify(vantat);
  console.log(`${ok ? '  ✓' : '  ✗'} ${namn}${ok ? '' : ` — fick ${JSON.stringify(fick)}, väntade ${JSON.stringify(vantat)}`}`);
  ok ? pass++ : fails.push(namn);
}

const EU_KUND = {
  customer_type: 'b2b', customer_company: 'Musik GmbH', vat_exempt: true,
  vat_region: 'eu', customer_country: 'DE', customer_vat_id: 'de 123.456.789',
};
const NON_EU_KUND = {
  customer_type: 'b2b', customer_company: 'Lyd AS', vat_exempt: true,
  vat_region: 'non_eu', customer_country: 'NO', customer_vat_id: null,
};
const SVENSK = { customer_type: 'b2b', customer_company: 'Svensk AB' };

// ── Stubbad databas för cart-update ───────────────────────────
let CART;
const calls = [];
global.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  calls.push({ method, url: String(url), body: opts.body ? JSON.parse(opts.body) : null });
  const json = (data) => ({ ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) });
  if (method === 'GET' && /\/carts\?/.test(url)) return json([JSON.parse(JSON.stringify(CART))]);
  if (method === 'PATCH' && /\/carts\?/.test(url)) { Object.assign(CART, JSON.parse(opts.body)); return json([CART]); }
  return json([]);
};
const adminEv = (body) => ({
  httpMethod: 'POST',
  headers: { authorization: 'Bearer admin-test', 'x-forwarded-for': '10.1.0.' + Math.floor(Math.random() * 250) },
  body: JSON.stringify(body),
});

// Pdfkit-stubbe som bara samlar texten.
function fakeDoc() {
  const texts = [];
  const d = {
    texts,
    fontSize() { return d; }, font() { return d; }, fillColor() { return d; },
    text(t) { texts.push(String(t)); return d; },
  };
  return d;
}

(async () => {
  console.log('\n1. REGELN');
  check('EU-företag: momsfri', Moms.info(EU_KUND).exempt, true);
  check('EU-företag: VAT-nr normaliseras', Moms.info(EU_KUND).buyerVatId, 'DE123456789');
  check('EU-företag: omvänd betalningsskyldighet', /Omvänd betalningsskyldighet/.test(Moms.info(EU_KUND).notice.sv), true);
  check('EU-företag: reverse charge på engelska', /Reverse charge/.test(Moms.info(EU_KUND).notice.en), true);
  check('utanför EU: momsfri med egen text', /utomlands/.test(Moms.info(NON_EU_KUND).notice.sv), true);
  check('svensk kund: 25 %', Moms.info(SVENSK).rate, 0.25);
  check('privatperson med flaggan: ändå svensk moms', Moms.info({ ...EU_KUND, customer_type: 'b2c' }).exempt, false);
  check('saknad order: svensk moms', Moms.inclOf(1000, null), 1250);
  check('momsfri: att betala = exkl', Moms.inclOf(1000, EU_KUND), 1000);
  check('momsfri: moms 0', Moms.vatOf(1000, EU_KUND), 0);
  check('svensk: moms 250', Moms.vatOf(1000, SVENSK), 250);
  check('kredit (negativt) svensk', Moms.inclOf(-1000, SVENSK), -1250);
  check('faktor momsfri', Moms.factor(EU_KUND), 1);
  check('validering: komplett EU-kund', Moms.validate(EU_KUND), null);
  check('validering: komplett kund utanför EU', Moms.validate(NON_EU_KUND), null);
  check('validering: EU utan VAT-nr', !!Moms.validate({ ...EU_KUND, customer_vat_id: '' }), true);
  check('validering: svenskt VAT-nr', !!Moms.validate({ ...EU_KUND, customer_country: 'SE', customer_vat_id: 'SE556053587301' }), true);
  check('validering: landskod och VAT-prefix skiljer', !!Moms.validate({ ...EU_KUND, customer_vat_id: 'FR12345678901' }), true);
  check('validering: Grekland använder EL', Moms.validate({ ...EU_KUND, customer_country: 'GR', customer_vat_id: 'EL123456789' }), null);
  check('validering: Norge som EU-land avvisas', !!Moms.validate({ ...NON_EU_KUND, vat_region: 'eu', customer_vat_id: 'NO123456789' }), true);
  check('validering: Tyskland som utanför EU avvisas', !!Moms.validate({ ...EU_KUND, vat_region: 'non_eu' }), true);
  check('validering: privatperson avvisas', !!Moms.validate({ ...EU_KUND, customer_type: 'b2c' }), true);
  check('validering: utan flagga alltid ok', Moms.validate({ customer_type: 'b2c' }), null);

  console.log('\n2. ADMIN SPARAR (cart-update)');
  const update = require(path.join(ROOT, 'netlify', 'functions', 'cart-update.js')).handler;
  CART = { id: 'SK-MOMS0001-0001', status: 'waiting', customer_type: 'b2b', customer_company: 'Musik GmbH', items: [] };
  let r = await update(adminEv({ cart_id: CART.id, vat_exempt: true, vat_region: 'eu', customer_country: 'DE', customer_vat_id: '' }));
  check('EU utan VAT-nr: 400', r.statusCode, 400);
  check('EU utan VAT-nr: inget sparat', !!CART.vat_exempt, false);
  r = await update(adminEv({ cart_id: CART.id, vat_exempt: true, vat_region: 'eu', customer_country: 'de', customer_vat_id: 'de123456789' }));
  check('komplett EU-kund: 200', r.statusCode, 200);
  check('sparat: flagga, region, land, VAT-nr', [CART.vat_exempt, CART.vat_region, CART.customer_country, CART.customer_vat_id], [true, 'eu', 'DE', 'DE123456789']);
  r = await update(adminEv({ cart_id: CART.id, customer_type: 'b2c' }));
  check('byte till privatperson med flaggan satt: 400', r.statusCode, 400);
  r = await update(adminEv({ cart_id: CART.id, vat_exempt: false }));
  check('kryss ur: 200', r.statusCode, 200);
  check('kryss ur: fälten nollställs', [CART.vat_exempt, CART.vat_region, CART.customer_country, CART.customer_vat_id], [false, null, null, null]);
  Object.assign(CART, { vat_exempt: true, vat_region: 'non_eu', customer_country: 'NO', invoice_sent_at: '2026-11-01T10:00:00Z' });
  r = await update(adminEv({ cart_id: CART.id, vat_exempt: false }));
  check('efter skickad faktura: 409', r.statusCode, 409);
  check('efter skickad faktura: oförändrat', CART.vat_exempt, true);
  r = await update(adminEv({ cart_id: CART.id, vat_exempt: true, vat_region: 'non_eu', customer_country: 'NO', customer_vat_id: null }));
  check('efter skickad faktura: samma värden igen är ok', r.statusCode, 200);

  console.log('\n3. FAKTURANS PDF-DELAR');
  const MomsPdf = require(path.join(ROOT, 'netlify', 'functions', '_moms-pdf.js'));
  let doc = fakeDoc();
  MomsPdf.drawVatSubtitle(doc, EU_KUND, 50, 114);
  check('EU: rubriken NON-VAT INVOICE', doc.texts, ['NON-VAT INVOICE']);
  doc = fakeDoc();
  MomsPdf.drawVatSubtitle(doc, SVENSK, 50, 114);
  check('svensk: ingen extra rubrik', doc.texts, []);
  doc = fakeDoc();
  MomsPdf.drawCustomerVat(doc, { ...EU_KUND, customer_orgnr: 'HRB 12345' }, 300, 0, { b2b: true });
  check('EU: kundens VAT-nr och land, inget påhittat SE-nummer', doc.texts, ['VAT-nr: DE123456789', 'Land / Country: DE']);
  doc = fakeDoc();
  MomsPdf.drawCustomerVat(doc, { ...SVENSK, customer_orgnr: '556053-5873' }, 300, 0, { b2b: true });
  check('svensk B2B: härlett momsreg.nr', doc.texts, ['Momsreg.nr: SE556053587301']);
  const t = MomsPdf.totalsRows(10000, EU_KUND);
  check('EU: summarader', t.rows.map((x) => [x[0], x[1]]), [['Moms 0%', 0], ['Att betala (ingen svensk moms)', 10000]]);
  const ts = MomsPdf.totalsRows(10000, SVENSK);
  check('svensk: summarader', ts.rows.map((x) => [x[0], x[1]]), [['Moms 25%', 2500], ['Att betala inkl. moms', 12500]]);
  doc = fakeDoc();
  MomsPdf.drawVatNotice(doc, EU_KUND, 0, 495);
  check('EU: lagtext på svenska och engelska', doc.texts.length === 2 && /Omvänd/.test(doc.texts[0]) && /Reverse charge/.test(doc.texts[1]), true);
  check('avsändarens momsreg.nr', MomsPdf.SELLER_LINE.includes('SE559068493101'), true);

  console.log('\n4. MEJLENS PRISTABELL');
  const lib = require(path.join(ROOT, 'netlify', 'functions', '_lib.js'));
  const rader = [{ id: 'x', name: 'Högtalare', price: 1000, qty: 2 }];
  const html = lib.buildPriceTable(rader, { order: EU_KUND });
  check('momsfri: "ingen svensk moms"', /ingen svensk moms/.test(html), true);
  check('momsfri: ingen 25 %', /Moms 25%/.test(html), false);
  check('momsfri: totalen är exkl-beloppet', />2[\s ]000 kr<\/td>\s*<\/tr><\/table>/.test(html), true);
  const html2 = lib.buildPriceTable(rader);
  check('utan order: som förut (25 %)', /Moms 25%/.test(html2) && /2[\s ]500 kr/.test(html2), true);

  console.log('\n5. INGEN EGEN MOMSRÄKNING');
  const filer = [
    ...fs.readdirSync(path.join(ROOT, 'netlify', 'functions')).filter((f) => f.endsWith('.js')).map((f) => path.join('netlify', 'functions', f)),
    path.join('src', 'pages', 'order', 'index.astro'),
    path.join('src', 'pages', 'admin', 'index.astro'),
  ];
  const traffar = [];
  for (const f of filer) {
    fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((rad, i) => {
      if (/[*\/]\s*-?[01]\.25\b/.test(rad) && !/brightness|scale\(|rem|px/.test(rad)) traffar.push(`${f}:${i + 1}`);
    });
  }
  check('inga * 1.25 / * 0.25 utanför src/lib/moms.cjs', traffar, []);

  console.log(`\n${pass} ok, ${fails.length} fel`);
  if (fails.length) { console.error('FEL:', fails.join(' | ')); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
