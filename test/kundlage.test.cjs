// Kundläge i varukorgen: "Jag är klar" → order_intent 'klar_korg', annars 'quote'.
// Båda är offertförfrågningar — inget blir bindande förrän kunden godkänt offerten.
// Testar skicka-offert mot mockad Supabase/Resend, och varukorgens källa.
'use strict';
const path = require('path');
const fs = require('fs');
const F = path.join(__dirname, '..', 'netlify', 'functions', 'skicka-offert.js');

process.env.SUPABASE_URL = 'https://stub.supabase.local';
process.env.SUPABASE_SERVICE_KEY = 'stub';
process.env.RESEND_API_KEY = 're_test';

let mails = [], upserts = [], avvisaKlarKorg = false;
global.fetch = async (url, opts = {}) => {
  url = String(url); const method = opts.method || 'GET';
  const svar = (d, status = 200) => ({ ok: status < 400, status, json: async () => d, text: async () => JSON.stringify(d) });
  if (url.includes('api.resend.com')) { mails.push(JSON.parse(opts.body)); return svar({ id: 'm' + mails.length }); }
  if (url.includes('/rest/v1/carts') && method === 'GET') return svar([]);
  if (url.includes('/rest/v1/carts') && method === 'POST') {
    const rad = JSON.parse(opts.body);
    upserts.push(rad);
    if (avvisaKlarKorg && rad.order_intent === 'klar_korg')
      return svar({ message: 'new row for relation "carts" violates check constraint "carts_order_intent_check"' }, 400);
    return svar([rad]);
  }
  return svar([]);
};

let n = 0, fel = 0;
const t = (namn, ok, info = '') => { n++; if (!ok) fel++; console.log(`  ${ok ? '✓' : '✗'} ${namn}${ok ? '' : '  ← ' + info}`); };
let ip = 0;
const skicka = async (extra) => {
  mails = []; upserts = [];
  const body = { customer: { name: 'Kund', email: 'k@example.com', phone: '0701234567', from: '2026-11-01', to: '2026-11-02' },
    cart: [{ id: 'SK-LJD-EVE-0001', name: 'Event, Small', price: 799, qty: 1 }], cart_id: 'SK-1A2B3C4D-5E6F', ...extra };
  return require(F).handler({ httpMethod: 'POST', headers: { 'x-forwarded-for': '10.0.0.' + (++ip) }, body: JSON.stringify(body) });
};

(async () => {
  console.log('SKICKA-OFFERT — kundläge');
  let r = await skicka({ kundlage: 'klar' });
  t('klar → 200', r.statusCode === 200, r.body);
  t('klar → order_intent klar_korg', upserts[0]?.order_intent === 'klar_korg', upserts[0]?.order_intent);
  t('klar → internt ämne börjar med Klar korg', /^✅ Klar korg — /.test(mails[0]?.subject || ''), mails[0]?.subject);
  t('kvitto: inte bindande', /inte bindande/.test(mails[2]?.html || '') && /inte bindande/.test(mails[2]?.text || ''));
  t('kvitto: ingen utlovad svarstid', !/inom en arbetsdag|inom \d/.test((mails[2]?.html || '') + (mails[2]?.text || '')));

  r = await skicka({ kundlage: 'forslag' });
  t('förslag → order_intent quote', upserts[0]?.order_intent === 'quote', upserts[0]?.order_intent);
  t('förslag → vanligt ämne', /^Offertförfrågan från /.test(mails[0]?.subject || ''), mails[0]?.subject);

  r = await skicka({});
  t('utan kundläge (gammal varukorg) → quote', upserts[0]?.order_intent === 'quote', upserts[0]?.order_intent);

  avvisaKlarKorg = true;
  r = await skicka({ kundlage: 'klar' });
  t('databasen avvisar klar_korg → sparas ändå som quote', upserts.length === 2 && upserts[1].order_intent === 'quote', JSON.stringify(upserts.map(u => u.order_intent)));
  t('…och mailen går ut', r.statusCode === 200 && mails.length === 3);
  avvisaKlarKorg = false;

  console.log('VARUKORGEN — källa');
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'varukorg', 'index.astro'), 'utf8');
  t('två val: klar och förslag', /name="kundlage" value="klar"/.test(src) && /name="kundlage" value="forslag"/.test(src));
  t('knappen heter Begär offert', /Begär offert\s*<\/button>/.test(src));
  t('kundläget skickas med', /kundlage: document\.querySelector\('input\[name="kundlage"\]:checked'\)/.test(src));
  t('trygghetsraden finns', /inte bindande — du godkänner först/.test(src));

  console.log('ADMIN — källa');
  const adm = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'admin', 'index.astro'), 'utf8');
  const lista = fs.readFileSync(path.join(__dirname, '..', 'netlify', 'functions', 'admin-carts.js'), 'utf8');
  t('admin-carts hämtar order_intent', /,order_intent,/.test(lista));
  t('kanban visar KLAR KORG', /KLAR KORG/.test(adm));
  t('knappen Skicka offert som den är', /Skicka offert som den är/.test(adm));

  console.log(fel ? `❌ ${fel} AV ${n} KONTROLLER RÖDA` : `✅ ALLA ${n} KONTROLLER GRÖNA`);
  process.exit(fel ? 1 : 0);
})();
