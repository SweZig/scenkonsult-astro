// test/admin-innehall.test.cjs — admin-endpoints för topplistor och referenscase
//
// Kör varje action i admin-popular.js och admin-event-cases.js mot en mockad
// PostgREST (ingen databas behövs). Tillkom 2026-10-17 efter att set-items hade
// svarat 500 på varje sparning: en odefinierad variabel i loggraden, som
// `node --check` inte fångar. Ett test som kör funktionen hade gjort det.
'use strict';
const path = require('path');

process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'service';
process.env.ADMIN_TOKEN = 'tok';

// ── Mockad PostgREST ─────────────────────────────────────────────────────────
// `svar` styr vad GET-anropen returnerar per tabell; `anrop` loggar allt.
let anrop = [];
let svar = {};
global.fetch = async (url, init = {}) => {
  const metod = init.method || 'GET';
  const rest = String(url).split('/rest/v1/')[1] || '';
  const tabell = rest.split('?')[0];
  anrop.push({ metod, rest, body: init.body ? JSON.parse(init.body) : null });
  let body = '[]';
  if (metod === 'GET' && svar[tabell]) body = JSON.stringify(svar[tabell](rest));
  const prefer = String((init.headers && init.headers.Prefer) || '');
  if (metod === 'POST' && prefer.includes('return=representation')) body = JSON.stringify([{ ok: 1 }]);
  return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
};

const fn = (f) => require(path.join(__dirname, '..', 'netlify', 'functions', f));
const pop = fn('admin-popular.js');
const eca = fn('admin-event-cases.js');
const post = (mod, body, tok = 'tok') => mod.handler({
  httpMethod: 'POST', headers: { authorization: `Bearer ${tok}` }, body: JSON.stringify(body),
});
const get = (mod, tok = 'tok') => mod.handler({ httpMethod: 'GET', headers: tok ? { authorization: `Bearer ${tok}` } : {} });

let pass = 0;
const fel = [];
function check(namn, ok, detalj = '') {
  if (ok) { pass++; console.log('  ✓ ' + namn.padEnd(60) + detalj); }
  else { fel.push(namn); console.log('  ✗ ' + namn.padEnd(60) + detalj); }
}
const nollstall = () => { anrop = []; svar = {}; };

(async () => {
  console.log('Admin-endpoints: topplistor och referenscase');

  // ── Behörighet ──
  check('admin-popular: 401 utan token', (await get(pop, null)).statusCode === 401);
  check('admin-event-cases: 401 utan token', (await get(eca, null)).statusCode === 401);
  check('admin-popular: 401 med fel token', (await post(pop, { action: 'delete-group', id: 'x' }, 'fel')).statusCode === 401);

  // ── admin-popular ──
  nollstall();
  check('GET admin-popular', (await get(pop)).statusCode === 200);

  nollstall();
  svar.content_categories = () => [{ slug: 'bild' }];
  check('upsert-category (befintlig kategori)', (await post(pop, { action: 'upsert-category', category: { slug: 'bild', popular_heading: 'Topplista Bild' } })).statusCode === 200);

  nollstall();
  check('upsert-category: ny kategori utan label → 400',
    (await post(pop, { action: 'upsert-category', category: { slug: 'ny' } })).statusCode === 400);

  nollstall();
  check('upsert-group', (await post(pop, { action: 'upsert-group', group: { category: 'bild', rubrik: 'Test' } })).statusCode === 200);
  check('upsert-group utan rubrik → 400', (await post(pop, { action: 'upsert-group', group: { category: 'bild' } })).statusCode === 400);
  check('delete-group', (await post(pop, { action: 'delete-group', id: 'g' })).statusCode === 200);
  check('reorder-groups', (await post(pop, { action: 'reorder-groups', ids: ['a', 'b'] })).statusCode === 200);

  // set-items — felet som gav 500. Ursprunget ska följa varje rad, dubbletter bort.
  nollstall();
  const si = await post(pop, { action: 'set-items', group_id: 'g', artnos: [
    'SK-BLD-0002', { artno: 'SK-BLD-0007', source: 'data' }, 'SK-BLD-0002', { artno: 'SK-BLD-0004', source: 'manual' },
  ] });
  check('set-items svarar 200', si.statusCode === 200, si.statusCode !== 200 ? si.body : '');
  const rader = (anrop.find((a) => a.metod === 'POST' && a.rest.startsWith('popular_group_items')) || {}).body || [];
  check('set-items: dubbletten borttagen', rader.length === 3, `${rader.length} rader`);
  check('set-items: ursprung per rad', JSON.stringify(rader.map((r) => r.source)) === '["manual","data","manual"]',
    JSON.stringify(rader.map((r) => r.source)));
  check('set-items: ordningen följer listan', JSON.stringify(rader.map((r) => r.sort_order)) === '[0,1,2]');
  check('set-items: max 24 artiklar', (await post(pop, { action: 'set-items', group_id: 'g',
    artnos: Array.from({ length: 25 }, (_, i) => `SK-X-${i}`) })).statusCode === 400);

  check('okänd action → 400', (await post(pop, { action: 'finns-inte' })).statusCode === 400);

  // ── admin-event-cases ──
  nollstall();
  check('GET admin-event-cases', (await get(eca)).statusCode === 200);
  check('upsert-case', (await post(eca, { action: 'upsert-case', case: { label: 'L', descr: 'D', tag: 'T' } })).statusCode === 200);
  check('upsert-case utan tagg → 400', (await post(eca, { action: 'upsert-case', case: { label: 'L', descr: 'D' } })).statusCode === 400);
  check('delete-case', (await post(eca, { action: 'delete-case', id: 'c' })).statusCode === 200);
  check('reorder-cases', (await post(eca, { action: 'reorder-cases', ids: ['a'] })).statusCode === 200);

  nollstall();
  svar.event_case_hub = () => [];
  check('set-images', (await post(eca, { action: 'set-images', case_id: 'c',
    images: [{ src: '/images/event/a.webp', alt: 'A' }] })).statusCode === 200);
  check('set-images: ogiltig sökväg → 400', (await post(eca, { action: 'set-images', case_id: 'c',
    images: [{ src: 'https://annan.se/x.webp', alt: 'A' }] })).statusCode === 400);
  check('set-images: alt-text saknas → 400', (await post(eca, { action: 'set-images', case_id: 'c',
    images: [{ src: '/images/event/a.webp', alt: '' }] })).statusCode === 400);

  // En bild som en hubbrad pekar på får inte tas bort — hellre fel än föräldralös rad.
  nollstall();
  svar.event_case_hub = () => [{ category: 'ljus', image_src: '/images/event/gammal.webp' }];
  const s409 = await post(eca, { action: 'set-images', case_id: 'c', images: [{ src: '/images/event/ny.webp', alt: 'N' }] });
  check('set-images: bild som hubben använder → 409', s409.statusCode === 409);
  check('set-images: 409 raderar inget', !anrop.some((a) => a.metod === 'DELETE'));

  nollstall();
  svar.event_case_images = () => [{ src: '/images/event/a.webp' }];
  check('set-hub', (await post(eca, { action: 'set-hub', hub: { case_id: 'c', category: 'bild', image_src: '/images/event/a.webp' } })).statusCode === 200);
  check('set-hub: bild som inte hör till caset → 400', (await post(eca, { action: 'set-hub',
    hub: { case_id: 'c', category: 'bild', image_src: '/images/event/annan.webp' } })).statusCode === 400);
  check('remove-hub', (await post(eca, { action: 'remove-hub', case_id: 'c', category: 'bild' })).statusCode === 200);

  console.log(fel.length ? `❌ ${fel.length} fel, ${pass} ok` : `✅ ALLA ${pass} KONTROLLER GRÖNA`);
  if (fel.length) process.exit(1);
})().catch((e) => { console.error('❌', e); process.exit(1); });
