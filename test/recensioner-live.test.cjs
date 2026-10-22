// test/recensioner-live.test.cjs — recensioner som följer admin utan att vänta på bygget
//
// Tillkom 2026-10-22: en ny recension syntes på referenssidan (som hämtar
// reviews-list i webbläsaren) men inte på startsidan (som bara läste den
// inbakade reviews.json), och inget i innehållsadmin startade ett nytt bygge.
//
// 1. Innehållsadmin startar ett bygge via NETLIFY_BUILD_HOOK efter lyckad POST
//    — och bara då.
// 2. src/scripts/recensioner-live.ts skriver antal och snitt i markerade
//    element, hämtar en gång per sidvisning och lämnar sidan orörd vid fel.
// 3. Sidorna som visar antal eller snitt bär markeringarna och laddar skriptet.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'service';
process.env.ADMIN_TOKEN = 'tok';

let pass = 0;
const fel = [];
function check(namn, ok, detalj = '') {
  if (ok) { pass++; console.log('  ✓ ' + namn); } else { fel.push(namn); console.log('  ✗ ' + namn + (detalj ? ' — ' + detalj : '')); }
}

// ── Mockad fetch: PostgREST + build hook ─────────────────────────────────────
const HOOK = 'https://api.netlify.com/build_hooks/test123';
let hookAnrop = [];
let hookKastar = false;
global.fetch = async (url, init = {}) => {
  if (String(url).startsWith(HOOK)) {
    hookAnrop.push({ url: String(url), metod: init.method });
    if (hookKastar) throw new Error('nätverksfel');
    return { ok: true, status: 200, text: async () => '', json: async () => ({}) };
  }
  const body = (init.headers && String(init.headers.Prefer || '').includes('return=representation'))
    ? '[{"id":"rev-1","author":"A"}]' : '[]';
  return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
};

const fn = (f) => require(path.join(ROOT, 'netlify', 'functions', f));
const post = (mod, body, tok = 'tok') => mod.handler({
  httpMethod: 'POST', headers: { authorization: `Bearer ${tok}` }, body: JSON.stringify(body),
});
const recension = { author: 'Test Testsson', rating: 5, review_text: 'Bra!', published_at: '2026-10-22' };

(async () => {
  // ── 1. Build hook ──────────────────────────────────────────────────────────
  console.log('BUILD HOOK FRÅN INNEHÅLLSADMIN');
  const rev = fn('admin-reviews.js');

  delete process.env.NETLIFY_BUILD_HOOK;
  hookAnrop = [];
  check('utan NETLIFY_BUILD_HOOK: sparning lyckas', (await post(rev, { action: 'upsert', review: recension })).statusCode === 200);
  check('utan NETLIFY_BUILD_HOOK: inget anrop', hookAnrop.length === 0);

  process.env.NETLIFY_BUILD_HOOK = HOOK;
  hookAnrop = [];
  check('upsert → 200', (await post(rev, { action: 'upsert', review: recension })).statusCode === 200);
  check('upsert startar ett bygge', hookAnrop.length === 1 && hookAnrop[0].metod === 'POST', JSON.stringify(hookAnrop));
  check('bygget märks med vad som ändrades', hookAnrop[0] && hookAnrop[0].url.includes('trigger_title=Admin%3A%20recensioner'));

  hookAnrop = [];
  await post(rev, { action: 'upsert', review: recension }, 'fel');
  check('obehörig POST startar inget bygge', hookAnrop.length === 0);

  hookAnrop = [];
  await post(rev, { action: 'upsert', review: { ...recension, rating: 9 } });
  check('ogiltig recension (400) startar inget bygge', hookAnrop.length === 0);

  hookAnrop = [];
  await rev.handler({ httpMethod: 'GET', headers: { authorization: 'Bearer tok' } });
  check('GET startar inget bygge', hookAnrop.length === 0);

  hookAnrop = [];
  hookKastar = true;
  check('hook som fallerar fäller inte sparningen', (await post(rev, { action: 'delete', id: 'rev-1' })).statusCode === 200);
  hookKastar = false;

  for (const [fil, orsak, body] of [
    ['admin-clients.js', 'referenskunder', null],
    ['admin-popular.js', 'topplistor', null],
    ['admin-event-cases.js', 'referenscase', null],
  ]) {
    const kalla = fs.readFileSync(path.join(ROOT, 'netlify', 'functions', fil), 'utf8');
    check(`${fil} är omsluten av medOmbygge('${orsak}')`,
      /exports\.handler = medOmbygge\(async \(event\) =>/.test(kalla) && kalla.trimEnd().endsWith(`}, '${orsak}');`));
  }
  delete process.env.NETLIFY_BUILD_HOOK;

  // ── 2. Klientskriptet ──────────────────────────────────────────────────────
  console.log('KLIENTSKRIPTET recensioner-live.ts');
  const esbuild = require('esbuild');
  const { outputFiles } = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/scripts/recensioner-live.ts')],
    bundle: true, format: 'cjs', platform: 'neutral', write: false,
  });
  const ladda = () => {
    const m = { exports: {} };
    new Function('module', 'exports', outputFiles[0].text)(m, m.exports);
    return m.exports;
  };

  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(`<body>
    <span id="a" data-rec-antal>8</span><span id="s" data-rec-snitt>4,8</span>
    <span id="e" data-rec-snitt="en">4.8</span></body>`);
  global.document = dom.window.document;

  let listAnrop = 0;
  const live = { ok: true, count: 9, rating: 4.9, ratingStr: '4,9', reviews: [
    { author: 'Ny Kund', initials: 'NK', rating: 5, time: 'idag', publishTime: '2026-10-22', text: 'Toppen' },
  ] };
  global.fetch = async (url) => {
    listAnrop++;
    if (String(url) !== '/.netlify/functions/reviews-list') throw new Error('fel url ' + url);
    return { ok: true, json: async () => live };
  };

  let m = ladda();
  const [d1, d2] = await Promise.all([m.hydreraSammanfattning(), m.hamtaRecensioner()]);
  check('en hämtning per sidvisning', listAnrop === 1, `anrop=${listAnrop}`);
  check('samma svar till alla som frågar', d1 === d2 && d1.count === 9);
  check('antal skrivs om', document.getElementById('a').textContent === '9');
  check('snitt skrivs med decimalkomma', document.getElementById('s').textContent === '4,9');
  check('engelskt snitt skrivs med decimalpunkt', document.getElementById('e').textContent === '4.9');

  // Fel från funktionen → inget skrivs, den inbakade siffran står kvar.
  document.getElementById('a').textContent = '8';
  global.fetch = async () => ({ ok: false, json: async () => ({}) });
  m = ladda();
  check('500 från reviews-list → null', (await m.hydreraSammanfattning()) === null);
  check('…och inbakad siffra står kvar', document.getElementById('a').textContent === '8');

  global.fetch = async () => { throw new Error('offline'); };
  m = ladda();
  check('nätverksfel → null', (await m.hydreraSammanfattning()) === null);

  global.fetch = async () => ({ ok: true, json: async () => ({ ok: true, count: 0, reviews: [] }) });
  m = ladda();
  check('tom lista → null (sidan töms inte)', (await m.hydreraSammanfattning()) === null);

  check('esc escapar HTML', m.esc('<b a="1">&\'') === '&lt;b a=&quot;1&quot;&gt;&amp;&#39;');
  check('nyckel tål datum med och utan klockslag',
    m.nyckel({ author: 'A', publishTime: '2026-10-22', text: 'x' }) === m.nyckel({ author: 'A', publishTime: '2026-10-22T00:00:00+00:00', text: 'x' }));

  // ── 3. Sidorna ─────────────────────────────────────────────────────────────
  console.log('SIDORNA');
  const sidor = {
    'src/pages/index.astro': ['data-rec-antal', 'data-rec-snitt', 'data-rec-nycklar'],
    'src/pages/en/index.astro': ['data-rec-snitt="en"'],
    'src/pages/referenser/index.astro': ['data-rec-antal', 'data-rec-snitt'],
    'src/pages/kontakt/index.astro': ['data-rec-antal', 'data-rec-snitt'],
  };
  for (const [fil, markeringar] of Object.entries(sidor)) {
    const kalla = fs.readFileSync(path.join(ROOT, fil), 'utf8');
    check(`${fil} laddar recensioner-live`, /from '(\.\.\/)+scripts\/recensioner-live'/.test(kalla));
    for (const mk of markeringar) check(`${fil} har ${mk}`, kalla.includes(mk));
    check(`${fil} anropar inte reviews-list själv`, !kalla.includes("fetch('/.netlify/functions/reviews-list')"));
  }
  // Varje sida som skriver ut antalet ur bygget måste också kunna skriva om det.
  for (const fil of Object.keys(sidor)) {
    const kalla = fs.readFileSync(path.join(ROOT, fil), 'utf8');
    const utanMarkering = (kalla.match(/\{(betyg|googleSummary)\.count\}/g) || []).length
      - (kalla.match(/data-rec-antal>\{(betyg|googleSummary)\.count\}/g) || []).length;
    check(`${fil}: inget antal utan data-rec-antal`, utanMarkering === 0, `${utanMarkering} omarkerade`);
  }

  console.log(fel.length ? `❌ ${fel.length} fel, ${pass} ok` : `✅ ALLA ${pass} KONTROLLER GRÖNA`);
  if (fel.length) process.exit(1);
})().catch((e) => { console.error('❌', e); process.exit(1); });
