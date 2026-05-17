// netlify/functions/admin-products-update.js
// Batch-uppdaterar produktfält (name, price, description) i en datafil
// och committar till GitHub. Netlify auto-rebuildar.
//
// POST /.netlify/functions/admin-products-update
// Headers: Authorization: Bearer <ADMIN_TOKEN>
// Body: {
//   fil: 'ljud',
//   sha: 'abc123...',           // Optimistic lock — måste matcha GitHub
//   changes: [
//     { path: 'event.products.0',  fields: { name, price, description } },
//     { path: 'mixers.2',          fields: { price: 199 } }
//   ]
// }
//
// Returnerar:
//   { ok: true, newSha, commitSha, commitUrl, changedCount }
//   eller { ok: false, error, conflict?: true }  vid 409

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

const REPO_OWNER = 'SweZig';
const REPO_NAME  = 'scenkonsult-astro';
const BRANCH     = 'main';

const ALLOWED_FILES = {
  ljud:    'src/data/ljud.json',
  ljus:    'src/data/ljus.json',
  dj:      'src/data/dj.json',
  scenes:  'src/data/scenes.json',
  bild:    'src/data/bild.json',
  el:      'src/data/el.json',
  tjanster:'src/data/tjanster.json',
  site:    'src/data/site.json'
};

// ── Validering av enskilt fält ───────────────────────────────
// V1: bara name, price, description (per beslut)
function validateField(key, value) {
  if (key === 'name') {
    if (typeof value !== 'string') return `name måste vara text`;
    const trimmed = value.trim();
    if (trimmed.length === 0) return `name får inte vara tomt`;
    if (trimmed.length > 200) return `name max 200 tecken`;
    return null;
  }
  if (key === 'price') {
    if (typeof value !== 'number') return `price måste vara ett tal`;
    if (!Number.isFinite(value)) return `price måste vara ett ändligt tal`;
    if (value < 0) return `price får inte vara negativt`;
    if (value > 1_000_000) return `price ologiskt högt (>1M)`;
    if (!Number.isInteger(value)) return `price ska vara heltal (kr)`;
    return null;
  }
  if (key === 'description') {
    if (typeof value !== 'string') return `description måste vara text`;
    if (value.length > 2000) return `description max 2000 tecken`;
    return null;
  }
  return `okänt fält: ${key} (v1 stödjer name, price, description)`;
}

// ── Navigera dot-path i objekt ───────────────────────────────
// path: 'event.products.0' → returnerar objektet på den platsen
// (eller null om path inte finns)
function getByPath(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return null;
    // Numeriskt index för arrayer
    const key = /^\d+$/.test(p) ? Number(p) : p;
    cur = cur[key];
  }
  return cur;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return err('Ogiltig JSON i body', 400);
  }

  const { fil, sha, changes } = body;
  const path = ALLOWED_FILES[fil];
  if (!path) return err(`Ogiltig fil: ${fil}`, 400);
  if (!sha || typeof sha !== 'string') return err('sha krävs (optimistic lock)', 400);
  if (!Array.isArray(changes) || changes.length === 0) return err('Inga ändringar att spara', 400);
  if (changes.length > 100) return err('För många ändringar i ett anrop (max 100)', 400);

  const token = process.env.GITHUB_TOKEN;
  if (!token) return err('GITHUB_TOKEN saknas i Netlify env', 500);

  // ── 1. Hämta nuvarande fil från GitHub ────────────────────
  const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
  let current;
  try {
    const res = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'scenkonsult-admin'
      }
    });
    if (!res.ok) {
      const text = await res.text();
      return err(`GitHub GET ${res.status}: ${text.slice(0, 200)}`, res.status);
    }
    current = await res.json();
  } catch (e) {
    return err(`GitHub GET error: ${e.message}`, 500);
  }

  // ── 2. SHA-lock check ─────────────────────────────────────
  if (current.sha !== sha) {
    return {
      statusCode: 409,
      headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': 'https://scenkonsult.se',
                 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
      body: JSON.stringify({
        ok: false,
        conflict: true,
        error: 'Filen har ändrats av någon annan sedan du läste in den. Ladda om sidan och försök igen.',
        currentSha: current.sha
      })
    };
  }

  // ── 3. Parse + validera + applicera ──────────────────────
  let data;
  try {
    data = JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
  } catch (e) {
    return err(`Filen i GitHub är inte giltig JSON: ${e.message}`, 500);
  }

  const errors = [];
  const applied = [];

  for (const ch of changes) {
    if (!ch || typeof ch.path !== 'string' || !ch.fields || typeof ch.fields !== 'object') {
      errors.push({ path: ch?.path || '(saknas)', error: 'Felaktigt change-format' });
      continue;
    }
    const target = getByPath(data, ch.path);
    if (!target || typeof target !== 'object') {
      errors.push({ path: ch.path, error: `Produkten finns inte på sökvägen` });
      continue;
    }

    // Validera alla fält först
    const fieldErrors = [];
    for (const [k, v] of Object.entries(ch.fields)) {
      const e = validateField(k, v);
      if (e) fieldErrors.push(`${k}: ${e}`);
    }
    if (fieldErrors.length) {
      errors.push({ path: ch.path, error: fieldErrors.join('; ') });
      continue;
    }

    // Applicera (in-place)
    const before = {};
    for (const [k, v] of Object.entries(ch.fields)) {
      before[k] = target[k];
      target[k] = v;
    }
    applied.push({ path: ch.path, before, after: { ...ch.fields } });
  }

  if (errors.length) {
    return {
      statusCode: 422,
      headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': 'https://scenkonsult.se' },
      body: JSON.stringify({ ok: false, error: 'Valideringsfel', validationErrors: errors })
    };
  }

  if (applied.length === 0) {
    return err('Inga giltiga ändringar att spara', 400);
  }

  // ── 4. Kontrollera att något faktiskt ändrades ────────────
  // (Om alla fält redan hade nya värdet, skippa commit)
  const realChanges = applied.filter(a =>
    Object.entries(a.after).some(([k, v]) => a.before[k] !== v)
  );
  if (realChanges.length === 0) {
    return ok({ ok: true, noChanges: true, message: 'Inga faktiska ändringar — inget att committa.' });
  }

  // ── 5. Serialisera + committa ────────────────────────────
  const newContent = JSON.stringify(data, null, 2) + '\n';
  const newContentB64 = Buffer.from(newContent, 'utf8').toString('base64');

  // Bygg commit-meddelande
  const summary = realChanges.length === 1
    ? `admin: uppdaterar 1 produkt i ${fil}.json`
    : `admin: uppdaterar ${realChanges.length} produkter i ${fil}.json`;

  const bodyLines = realChanges.slice(0, 20).map(c => {
    const fields = Object.keys(c.after).join(', ');
    return `- ${c.path}: ${fields}`;
  });
  if (realChanges.length > 20) bodyLines.push(`- ... och ${realChanges.length - 20} till`);

  const commitMessage = `${summary}\n\n${bodyLines.join('\n')}`;

  const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  try {
    const res = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'scenkonsult-admin',
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: newContentB64,
        sha:     current.sha,
        branch:  BRANCH
      })
    });

    if (!res.ok) {
      const text = await res.text();
      // 409 från GitHub = sha-mismatch (race condition)
      if (res.status === 409) {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': 'https://scenkonsult.se' },
          body: JSON.stringify({
            ok: false,
            conflict: true,
            error: 'Race condition — någon annan committade samtidigt. Ladda om och försök igen.'
          })
        };
      }
      return err(`GitHub PUT ${res.status}: ${text.slice(0, 300)}`, res.status);
    }

    const result = await res.json();
    return ok({
      ok:           true,
      newSha:       result.content?.sha,
      commitSha:    result.commit?.sha,
      commitUrl:    result.commit?.html_url,
      changedCount: realChanges.length,
      changes:      realChanges
    });
  } catch (e) {
    return err(`GitHub PUT error: ${e.message}`, 500);
  }
};
