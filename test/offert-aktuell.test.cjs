// test/offert-aktuell.test.cjs
// Kundens ordersida ska alltid visa — och bara kunna godkänna — den sparade
// offerten (rättat 2026-10-09). Supabase och Resend stubbas: inget nätverk.
//   1. API-svar får aldrig cachas (Cache-Control: no-store).
//   2. cart-get returnerar items_rev; rev=1 är en tyst koll utan läslogg.
//   3. Godkännande av en inaktuell version avvisas (409 stale).
//   4. Avtalstexten räknas av servern ur den sparade offerten.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
process.env.SUPABASE_URL = 'https://stub.supabase.local';
process.env.SUPABASE_SERVICE_KEY = 'stub';
process.env.ADMIN_TOKEN = 'admin-test';
delete process.env.RESEND_API_KEY;

const lib = require(path.join(ROOT, 'netlify', 'functions', '_lib.js'));

let pass = 0; const fails = [];
function check(namn, fick, vantat) {
  const ok = JSON.stringify(fick) === JSON.stringify(vantat);
  console.log(`${ok ? '  ✓' : '  ✗'} ${namn}${ok ? '' : ` — fick ${JSON.stringify(fick)}, väntade ${JSON.stringify(vantat)}`}`);
  ok ? pass++ : fails.push(namn);
}

// ── Stubbad databas ───────────────────────────────────────────
const CART = {
  id: 'SK-ABCDEF12-3456', cart_token: 'tok123', status: 'waiting', confirmed_at: null, declined_at: null,
  customer_name: 'Test Testsson', customer_email: 'test@example.com',
  items: [
    { id: 'SK-SCN-MOD-0001', name: 'Plattform 1×1', price: 125, qty: 10 },
    { id: 'lev-standard', name: 'Leverans', price: 1500, qty: 1, type: 'service' },
    { _note: true, id: '_note', name: 'Anm', price: 0, qty: 1 },
  ],
};
const calls = [];
global.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  calls.push({ method, url: String(url), body: opts.body ? JSON.parse(opts.body) : null });
  const json = (data) => ({ ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) });
  if (method === 'GET' && /\/carts\?/.test(url)) return json([JSON.parse(JSON.stringify(CART))]);
  if (method === 'GET' && /\/messages\?/.test(url)) return json([]);
  if (method === 'PATCH' && /\/carts\?/.test(url)) return json([{ ...CART, ...JSON.parse(opts.body) }]);
  return json([]);
};
const ev = (q, extra = {}) => ({ httpMethod: 'GET', headers: { 'x-forwarded-for': '10.0.0.' + Math.floor(Math.random() * 250) }, queryStringParameters: q, ...extra });

(async () => {
  console.log('\n1. INGEN CACHE PÅ API-SVAR');
  check('Cache-Control: no-store', /no-store/.test(lib.corsHeaders['Cache-Control'] || ''), true);

  console.log('\n2. CART-GET');
  const get = require(path.join(ROOT, 'netlify', 'functions', 'cart-get.js')).handler;
  const rev = lib.itemsRev(CART.items);
  calls.length = 0;
  const full = await get(ev({ token: 'tok123' }));
  const fb = JSON.parse(full.body);
  check('full hämtning: 200', full.statusCode, 200);
  check('full hämtning: items_rev', fb.cart.items_rev, rev);
  check('svaret har no-store', /no-store/.test(full.headers['Cache-Control']), true);
  calls.length = 0;
  const kol = await get(ev({ token: 'tok123', rev: '1' }));
  const kb = JSON.parse(kol.body);
  check('rev=1: revision', kb.rev, rev);
  check('rev=1: inga rader eller meddelanden i svaret', [kb.cart, kb.messages, kb.items], [undefined, undefined, undefined]);
  check('rev=1: ingen läslogg (inga skrivningar)', calls.filter((c) => c.method !== 'GET').length, 0);
  const annan = lib.itemsRev([...CART.items.slice(0, 1)]);
  check('borttagen produkt ger ny revision', annan !== rev, true);

  console.log('\n3. GODKÄNNANDE');
  const upd = require(path.join(ROOT, 'netlify', 'functions', 'cart-update.js')).handler;
  const post = (body) => upd({ httpMethod: 'POST', headers: { 'x-forwarded-for': '10.1.0.' + Math.floor(Math.random() * 250), 'user-agent': 'test' }, body: JSON.stringify(body) });

  calls.length = 0;
  const stale = await post({ token: 'tok123', cart_id: CART.id, action: 'customer_confirm', items_rev: 'gammal00000', confirmation_text: 'x' });
  check('inaktuell version → 409', stale.statusCode, 409);
  check('inaktuell version → code stale', JSON.parse(stale.body).code, 'stale');
  check('inaktuell version → inget sparas', calls.filter((c) => c.method === 'PATCH').length, 0);

  calls.length = 0;
  const okRes = await post({ token: 'tok123', cart_id: CART.id, action: 'customer_confirm', items_rev: rev,
                             confirmation_text: 'Order bekräftad. Totalt 1 kr exkl. moms.' });
  check('aktuell version → 200', okRes.statusCode, 200);
  const patch = calls.find((c) => c.method === 'PATCH' && /\/carts\?/.test(c.url));
  check('status → confirmed', patch && patch.body.status, 'confirmed');
  const txt = (patch && patch.body.confirmation_text) || '';
  check('avtalstexten har serverns summa (2 750 kr), inte klientens', /Totalt 2750 kr exkl\. moms/.test(txt), true);
  check('avtalstexten anger versionen', txt.includes(rev), true);

  console.log('\n4. ADMIN OCH ORDERSIDA');
  const admin = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'admin', 'index.astro'), 'utf8');
  check('"Lämna utan att spara" laddar om ordern', /choice === 'discard'\) await discardPanelChanges\(\)/.test(admin), true);
  check('discard hämtar från servern', /async function discardPanelChanges\(\)[\s\S]{0,120}refreshCurrentCart\(\)/.test(admin), true);
  check('stäng-rutan: inte längre confirm() med OK = släng', admin.includes('OK = stäng utan att spara'), false);
  check('chatten frågar vid osparade ändringar', /async function sendMessage\(\)[\s\S]{0,400}resolveDirtyPanel/.test(admin), true);
  check('offertfönstret behåller hela raden', /quoteItems\.push\(\{ \.\.\.i, id:/.test(admin), true);
  const order = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'order', 'index.astro'), 'utf8');
  check('ordersidan: hämtar utan cache', /cart-get\?id=\$\{cartId\}&token=\$\{cartToken\}`, \{ cache: 'no-store' \}/.test(order), true);
  check('ordersidan: kollar vid återbesök', /visibilitychange[\s\S]{0,80}checkOfferUpdated/.test(order) && /pageshow/.test(order), true);
  check('ordersidan: skickar items_rev vid godkännande', /items_rev:\s+c\.items_rev/.test(order), true);

  console.log('');
  if (fails.length) {
    console.log(`❌ ${fails.length} KONTROLL(ER) MISSLYCKADES\n`);
    fails.forEach((f) => console.log('   - ' + f));
    process.exit(1);
  }
  console.log(`✅ ALLA ${pass} KONTROLLER GRÖNA`);
})().catch((e) => { console.error('TESTFEL:', e); process.exit(1); });
