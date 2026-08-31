// test/admin-transport.test.cjs
// Kontrollerar transportstödet i admin-products-update.js:
// redigering av leverans-poster och tillägg av nya fordon.
// GitHub-anropen stubbas — inget nätverk, inga commits.
'use strict';

const fs   = require('fs');
const path = require('path');

process.env.ADMIN_TOKEN  = 'test-token';
process.env.GITHUB_TOKEN = 'gh-test';

const TJANSTER = path.join(__dirname, '..', 'src', 'data', 'tjanster.json');
const original = fs.readFileSync(TJANSTER, 'utf8');

let lastPut = null;
const FAKE_SHA = 'sha-abc123';

global.fetch = async (url, opts = {}) => {
  if ((opts.method || 'GET') === 'GET') {
    return {
      ok: true, status: 200,
      json: async () => ({
        sha: FAKE_SHA,
        content: Buffer.from(original, 'utf8').toString('base64')
      })
    };
  }
  lastPut = JSON.parse(opts.body);
  return {
    ok: true, status: 200,
    json: async () => ({ content: { sha: 'sha-new' }, commit: { sha: 'commit-1', html_url: 'x' } })
  };
};

const { handler } = require('../netlify/functions/admin-products-update.js');

let pass = 0, fail = 0;
function check(label, actual, expected) {
  const a = typeof actual === 'object' ? JSON.stringify(actual) : actual;
  const e = typeof expected === 'object' ? JSON.stringify(expected) : expected;
  if (a === e) { pass++; console.log(`  ✓ ${label.padEnd(52)} ${a}`); }
  else { fail++; console.log(`  ✗ ${label.padEnd(52)} fick ${a}, väntade ${e}`); }
}

async function call(body) {
  lastPut = null;
  const res = await handler({
    httpMethod: 'POST',
    headers: { authorization: 'Bearer test-token' },
    body: JSON.stringify(body)
  });
  return { status: res.statusCode, body: JSON.parse(res.body), put: lastPut };
}

function committed() {
  return JSON.parse(Buffer.from(lastPut.content, 'base64').toString('utf8'));
}

(async () => {
  console.log('\nTRANSPORT I PRODUKTUNDERHÅLLET\n');

  // ── 1. Prisändring på befintligt fordon ──────────────────
  let r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    changes: [
      { kind: 'transport', path: 'leverans.storbil', fields: { pris: 1500, enkelresa: 750, label: 'Stor bil (tur & retur)' } },
      { kind: 'transport', path: 'leverans.storbil.enkel', fields: { pris: 750 } }
    ]
  });
  check('prisändring accepteras', r.status, 200);
  let data = committed();
  check('tur-och-retur uppdaterat', data.leverans.storbil.pris, 1500);
  check('enkelresa uppdaterad på raden', data.leverans.storbil.enkelresa, 750);
  check('enkelresa uppdaterad i nästlad post', data.leverans.storbil.enkel.pris, 750);
  check('övriga fordon orörda', data.leverans.lastbil.pris, 2399);
  check('selection_rules orörda', Array.isArray(data.leverans.selection_rules), true);

  // ── 2. Ogiltiga värden avvisas ───────────────────────────
  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    changes: [{ kind: 'transport', path: 'leverans.storbil', fields: { pris: -5 } }]
  });
  check('negativt pris avvisas', r.status, 422);

  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    changes: [{ kind: 'transport', path: 'leverans.storbil', fields: { price: 100 } }]
  });
  check('fel fältnamn avvisas', r.status, 422);

  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    changes: [{ kind: 'transport', path: 'services.0', fields: { pris: 100 } }]
  });
  check('transport utanför leverans avvisas', r.status, 422);

  // ── 3. Nytt fordon ───────────────────────────────────────
  const nyttFordon = {
    id: 'lev-lastbil-xl', label: 'Lätt lastbil med släp (tur & retur)',
    enkelresa: 1799, pris: 3598, note: '1799 kr × 2 resor',
    type: 'service', artno: 'SK-LEV-0009',
    enkel: { id: 'lev-lastbil-xl-e', label: 'Lätt lastbil med släp (enkelresa)', pris: 1799, note: 'Enkel resa', type: 'service', artno: 'SK-LEV-0009-E' }
  };
  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    additions: [{ kind: 'transport', sectionPath: 'leverans', key: 'lastbil_xl', product: nyttFordon }]
  });
  check('nytt fordon accepteras', r.status, 200);
  data = committed();
  check('fordonet ligger under rätt nyckel', data.leverans.lastbil_xl.artno, 'SK-LEV-0009');
  check('enkelresan följer med', data.leverans.lastbil_xl.enkel.artno, 'SK-LEV-0009-E');
  check('befintliga fordon kvar', Object.keys(data.leverans).length, Object.keys(JSON.parse(original).leverans).length + 1);

  // ── 4. Skyddsregler för nya fordon ───────────────────────
  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    additions: [{ kind: 'transport', sectionPath: 'leverans', key: 'storbil', product: nyttFordon }]
  });
  check('dubblettnyckel avvisas', r.status, 422);

  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    additions: [{ kind: 'transport', sectionPath: 'leverans', key: 'selection_rules', product: nyttFordon }]
  });
  check('reserverad nyckel avvisas', r.status, 422);

  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    additions: [{ kind: 'transport', sectionPath: 'leverans', key: 'Lastbil XL', product: nyttFordon }]
  });
  check('ogiltig nyckel avvisas', r.status, 422);

  const krock = JSON.parse(JSON.stringify(nyttFordon));
  krock.artno = 'SK-LEV-0005';
  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    additions: [{ kind: 'transport', sectionPath: 'leverans', key: 'lastbil_xl', product: krock }]
  });
  check('dubblett-artno avvisas', r.status, 422);

  // ── 5. Vanliga produkter påverkas inte ───────────────────
  r = await call({
    fil: 'tjanster', sha: FAKE_SHA,
    changes: [{ path: 'services.0', fields: { price: 4321 } }]
  });
  check('vanlig produktändring fungerar fortfarande', r.status, 200);
  check('priset skrevs', committed().services[0].price, 4321);

  console.log(`\n${fail === 0 ? '✅' : '❌'} ${pass} KONTROLLER GRÖNA${fail ? `, ${fail} RÖDA` : ''}\n`);
  process.exit(fail === 0 ? 0 : 1);
})();
