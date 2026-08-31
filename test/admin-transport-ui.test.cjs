// test/admin-transport-ui.test.cjs
// Kör produktunderhållets FAKTISKA klientskript (ur admin/produkter/index.astro)
// i jsdom med stubbade API-anrop, och kontrollerar transportfliken:
// att fordonen listas, att en prisändring blir rätt payload och att ett nytt
// fordon skickas som transport-addition.
'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const src  = fs.readFileSync(path.join(ROOT, 'src/pages/admin/produkter/index.astro'), 'utf8');
const tjanster = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tjanster.json'), 'utf8'));

// Astro-frontmatter bort; skriptet plockas ut och körs som klassiskt script
const htmlSrc = src.replace(/^---[\s\S]*?---\s*/, '');
const scriptMatch = htmlSrc.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('Hittade inget klientskript i admin/produkter/index.astro'); process.exit(1); }
const clientJs = scriptMatch[1];
const html = htmlSrc.replace(scriptMatch[0], '');

let pass = 0, fail = 0;
function check(label, actual, expected) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; console.log(`  ✓ ${label.padEnd(52)} ${a}`); }
  else { fail++; console.log(`  ✗ ${label.padEnd(52)} fick ${a}, väntade ${e}`); }
}

const dom = new JSDOM(html, {
  url: 'https://scenkonsult.se/admin/produkter/',
  pretendToBeVisual: true,
  runScripts: 'outside-only'
});
const { window } = dom;

let savedPayload = null;
window.fetch = async (url, opts = {}) => {
  const body = opts.body ? JSON.parse(opts.body) : null;
  const json =
    url.includes('admin-products-list')  ? { ok: true, fil: 'tjanster', sha: 'sha-1', data: JSON.parse(JSON.stringify(tjanster)) } :
    url.includes('admin-deploy-status')  ? { ok: true, production: null } :
    url.includes('admin-products-update')? (savedPayload = body, { ok: true, newSha: 'sha-2', commitSha: 'c1', changedCount: 1, addedCount: 0, changes: [], additions: [] }) :
    { ok: true };
  return { ok: true, status: 200, json: async () => json };
};
window.confirm = () => true;
window.alert   = () => {};
window.sessionStorage.setItem('sk_admin_token', 'test-token');

vm.runInContext(clientJs, dom.getInternalVMContext());

const $ = (id) => window.document.getElementById(id);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('\nTRANSPORTFLIKEN I PRODUKTUNDERHÅLLET (jsdom)\n');
  await wait(60);

  // ── Filfliken Tjänster ───────────────────────────────────
  const tjansterTab = Array.from($('file-tabs').querySelectorAll('.file-tab'))
    .find(b => b.textContent.trim() === 'Tjänster');
  check('filfliken Tjänster finns', !!tjansterTab, true);
  tjansterTab.dispatchEvent(new window.Event('click'));
  await wait(60);

  const sectionTabs = Array.from($('section-tabs').querySelectorAll('.section-tab'));
  const trpTab = sectionTabs.find(b => b.textContent.includes('Transport'));
  check('sektionsfliken Transport finns', !!trpTab, true);

  const antalFordon = Object.keys(tjanster.leverans)
    .filter(k => !['label', 'description', 'zon', 'selection_rules'].includes(k)).length;
  check('fliken räknar alla fordon', trpTab.textContent.includes(`(${antalFordon})`), true);

  trpTab.dispatchEvent(new window.Event('click'));
  await wait(20);

  const rows = Array.from($('table-wrap').querySelectorAll('.prod-row.trp:not(.header)'));
  check('en rad per fordon', rows.length, antalFordon);

  const storbil = rows.find(r => r.dataset.path === 'leverans.storbil');
  check('storbil har en rad', !!storbil, true);
  check('tur-och-retur visas', storbil.querySelector('[data-field="pris"]').value, String(tjanster.leverans.storbil.pris));
  check('enkelresa visas', storbil.querySelector('[data-field="enkelresa"]').value, String(tjanster.leverans.storbil.enkelresa));
  check('artikelnummer visas', storbil.querySelector('.artno-cell').textContent.includes(tjanster.leverans.storbil.artno), true);

  // ── Redigering ───────────────────────────────────────────
  const enkelInput = storbil.querySelector('[data-field="enkelresa"]');
  enkelInput.value = '850';
  enkelInput.dispatchEvent(new window.Event('input'));
  await wait(10);
  check('raden markeras som ändrad', storbil.classList.contains('changed'), true);
  check('spara-knappen aktiveras', $('save-btn').disabled, false);

  const prisInput = storbil.querySelector('[data-field="pris"]');
  prisInput.value = '-10';
  prisInput.dispatchEvent(new window.Event('input'));
  await wait(10);
  check('negativt pris ger fel', storbil.classList.contains('error'), true);
  check('spara låses vid fel', $('save-btn').disabled, true);

  prisInput.value = '1700';
  prisInput.dispatchEvent(new window.Event('input'));
  await wait(10);
  check('spara öppnas igen', $('save-btn').disabled, false);

  $('save-btn').dispatchEvent(new window.Event('click'));
  await wait(80);

  check('payload skickades', !!savedPayload, true);
  const trpChanges = savedPayload.changes.filter(c => c.kind === 'transport');
  check('två transportändringar (rad + enkelpost)', trpChanges.length, 2);
  const rad = trpChanges.find(c => c.path === 'leverans.storbil');
  check('radens fält', rad.fields, { pris: 1700, enkelresa: 850 });
  const nested = trpChanges.find(c => c.path === 'leverans.storbil.enkel');
  check('nästlade enkelposten följer med', nested.fields, { pris: 850 });

  // ── Nytt fordon ──────────────────────────────────────────
  savedPayload = null;
  check('knappen byter etikett', $('new-product-btn').textContent, '+ Ny transport');
  $('new-product-btn').dispatchEvent(new window.Event('click'));
  await wait(70);
  check('transportmodalen öppnas', $('trp-modal').classList.contains('open'), true);

  $('trp-key').value       = 'lastbil_xl';
  $('trp-artno').value     = 'sk-lev-0009';
  $('trp-label').value     = 'Lätt lastbil med släp (tur & retur)';
  $('trp-pris').value      = '3598';
  $('trp-enkelresa').value = '1799';
  $('trp-note').value      = '1799 kr × 2 resor';
  $('trp-modal-save').dispatchEvent(new window.Event('click'));
  await wait(20);

  check('modalen stängs', $('trp-modal').classList.contains('open'), false);
  const nyaRader = Array.from($('table-wrap').querySelectorAll('.prod-row.trp:not(.header)'));
  check('raden syns direkt i tabellen', nyaRader.length, antalFordon + 1);

  $('save-btn').dispatchEvent(new window.Event('click'));
  await wait(80);
  const add = savedPayload.additions[0];
  check('skickas som transport-addition', add.kind, 'transport');
  check('rätt sektion och nyckel', [add.sectionPath, add.key], ['leverans', 'lastbil_xl']);
  check('artno versaliseras', add.product.artno, 'SK-LEV-0009');
  check('enkelresan får -E', add.product.enkel.artno, 'SK-LEV-0009-E');
  check('enkelresans pris', add.product.enkel.pris, 1799);
  check('type är service', add.product.type, 'service');

  console.log(`\n${fail === 0 ? '✅' : '❌'} ${pass} KONTROLLER GRÖNA${fail ? `, ${fail} RÖDA` : ''}\n`);
  process.exit(fail === 0 ? 0 : 1);
})();
