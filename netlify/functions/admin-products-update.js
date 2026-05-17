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
  karaoke: 'src/data/karaoke.json',
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
  if (key === 'volumePricing') {
    // null/undefined/[] = ta bort volymrabatt
    if (value === null || value === undefined) return null;
    if (!Array.isArray(value)) return `volumePricing måste vara en array`;
    if (value.length === 0) return null; // tom array = ta bort
    if (value.length > 10) return `max 10 tiers i volymtrappan`;
    let lastMinQty = 0;
    for (let i = 0; i < value.length; i++) {
      const t = value[i];
      if (!t || typeof t !== 'object') return `tier ${i+1}: måste vara objekt`;
      if (typeof t.minQty !== 'number' || !Number.isInteger(t.minQty) || t.minQty < 1) {
        return `tier ${i+1}: minQty måste vara heltal ≥ 1`;
      }
      if (typeof t.unitPrice !== 'number' || !Number.isFinite(t.unitPrice) || t.unitPrice < 0 || t.unitPrice > 1_000_000) {
        return `tier ${i+1}: unitPrice måste vara tal 0–1 000 000`;
      }
      if (!Number.isInteger(t.unitPrice)) {
        return `tier ${i+1}: unitPrice ska vara heltal (kr)`;
      }
      if (t.minQty <= lastMinQty) {
        return `tier ${i+1}: minQty (${t.minQty}) måste vara större än föregående (${lastMinQty})`;
      }
      lastMinQty = t.minQty;
    }
    if (value[0].minQty !== 1) {
      return `första tier måste ha minQty:1 (basspriset)`;
    }
    return null;
  }
  if (key === 'priceNote') {
    if (typeof value !== 'string') return `priceNote måste vara text`;
    if (value.length > 30) return `priceNote max 30 tecken`;
    return null;
  }
  if (key === 'slug') {
    if (typeof value !== 'string') return `slug måste vara text`;
    if (!/^[a-z0-9-]+$/.test(value)) return `slug får bara innehålla a-z, 0-9, bindestreck`;
    if (value.length > 100) return `slug max 100 tecken`;
    return null;
  }
  if (key === 'artno') {
    if (typeof value !== 'string') return `artno måste vara text`;
    if (!/^[A-Z0-9-]+$/.test(value)) return `artno får bara innehålla A-Z, 0-9, bindestreck`;
    if (value.length > 50) return `artno max 50 tecken`;
    return null;
  }
  if (key === 'image') {
    if (typeof value !== 'string') return `image måste vara text`;
    if (value.length > 300) return `image-path max 300 tecken`;
    return null;
  }
  if (key === 'includes') {
    if (!Array.isArray(value)) return `includes måste vara array`;
    if (value.length > 20) return `max 20 punkter i includes`;
    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] !== 'string') return `includes[${i}]: måste vara text`;
      if (value[i].length > 200) return `includes[${i}]: max 200 tecken`;
    }
    return null;
  }
  return `okänt fält: ${key} (stödjer name, price, description, volumePricing, priceNote, slug, artno, image, includes)`;
}

// ── Validera komplett ny produkt ─────────────────────────────
function validateNewProduct(obj, isVolumePricingSection) {
  if (!obj || typeof obj !== 'object') return 'produkt måste vara objekt';

  const required = ['artno', 'name', 'slug', 'price'];
  for (const r of required) {
    if (!(r in obj)) return `fältet "${r}" är obligatoriskt`;
  }

  for (const [k, v] of Object.entries(obj)) {
    if (k === 'alt' || k === 'category' || k === 'persons' || k === 'monteringMin') {
      // Tillåtna fält utan strikt validering
      continue;
    }
    const e = validateField(k, v);
    if (e) return `${k}: ${e}`;
  }
  return null;
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

  const { fil, sha, changes, additions } = body;
  const path = ALLOWED_FILES[fil];
  if (!path) return err(`Ogiltig fil: ${fil}`, 400);
  if (!sha || typeof sha !== 'string') return err('sha krävs (optimistic lock)', 400);
  const _changes   = Array.isArray(changes)   ? changes   : [];
  const _additions = Array.isArray(additions) ? additions : [];
  if (_changes.length === 0 && _additions.length === 0) return err('Inga ändringar eller tillägg att spara', 400);
  if (_changes.length > 100) return err('För många ändringar i ett anrop (max 100)', 400);
  if (_additions.length > 20) return err('För många nya produkter i ett anrop (max 20)', 400);

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
  const addedProducts = [];

  // ── 3a. Applicera changes ──────────────────────────────────
  for (const ch of _changes) {
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
      // Special: tom array eller null på volumePricing = ta bort fältet
      if (k === 'volumePricing' && (v === null || (Array.isArray(v) && v.length === 0))) {
        delete target[k];
      } else {
        target[k] = v;
      }
    }
    applied.push({ path: ch.path, before, after: { ...ch.fields } });
  }

  // ── 3b. Applicera additions (CREATE) ────────────────────
  for (let i = 0; i < _additions.length; i++) {
    const add = _additions[i];
    if (!add || typeof add.sectionPath !== 'string' || !add.product || typeof add.product !== 'object') {
      errors.push({ path: `additions[${i}]`, error: 'Felaktigt addition-format (kräver sectionPath + product)' });
      continue;
    }

    // Validera ny produkt
    const validErr = validateNewProduct(add.product);
    if (validErr) {
      errors.push({ path: `additions[${i}]`, error: validErr });
      continue;
    }

    // Hitta målarrayen
    const target = getByPath(data, add.sectionPath);
    if (!Array.isArray(target)) {
      errors.push({ path: `additions[${i}]`, error: `Sektionen ${add.sectionPath} är inte en array` });
      continue;
    }

    // Kolla artno-unikhet (i hela filen, inte bara sektionen)
    const newArtno = add.product.artno;
    let duplicateFound = false;
    function checkArtno(obj) {
      if (Array.isArray(obj)) {
        for (const x of obj) checkArtno(x);
      } else if (obj && typeof obj === 'object') {
        if (obj.artno === newArtno) duplicateFound = true;
        for (const k of Object.keys(obj)) checkArtno(obj[k]);
      }
    }
    checkArtno(data);
    if (duplicateFound) {
      errors.push({ path: `additions[${i}]`, error: `Artno "${newArtno}" finns redan i filen` });
      continue;
    }

    // Lägg till
    target.push(add.product);
    addedProducts.push({
      sectionPath: add.sectionPath,
      artno:       newArtno,
      name:        add.product.name,
      newPath:     `${add.sectionPath}.${target.length - 1}`
    });
  }

  if (errors.length) {
    return {
      statusCode: 422,
      headers: { 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': 'https://scenkonsult.se' },
      body: JSON.stringify({ ok: false, error: 'Valideringsfel', validationErrors: errors })
    };
  }

  if (applied.length === 0 && addedProducts.length === 0) {
    return err('Inga giltiga ändringar att spara', 400);
  }

  // ── 4. Kontrollera att något faktiskt ändrades ────────────
  // (Om alla fält redan hade nya värdet, skippa commit — men bara om inga adds)
  const realChanges = applied.filter(a =>
    Object.entries(a.after).some(([k, v]) => {
      const before = a.before[k];
      // Jämför JSON-stringify för objekt/arrayer
      if (typeof v === 'object' || typeof before === 'object') {
        return JSON.stringify(before) !== JSON.stringify(v);
      }
      return before !== v;
    })
  );
  if (realChanges.length === 0 && addedProducts.length === 0) {
    return ok({ ok: true, noChanges: true, message: 'Inga faktiska ändringar — inget att committa.' });
  }

  // ── 5. Serialisera + committa ────────────────────────────
  const newContent = JSON.stringify(data, null, 2) + '\n';
  const newContentB64 = Buffer.from(newContent, 'utf8').toString('base64');

  // Bygg commit-meddelande
  const totalOps = realChanges.length + addedProducts.length;
  const parts = [];
  if (addedProducts.length > 0) {
    parts.push(addedProducts.length === 1 ? '1 ny produkt' : `${addedProducts.length} nya produkter`);
  }
  if (realChanges.length > 0) {
    parts.push(realChanges.length === 1 ? '1 ändring' : `${realChanges.length} ändringar`);
  }
  const summary = `admin: ${parts.join(' + ')} i ${fil}.json`;

  const bodyLines = [];
  for (const a of addedProducts.slice(0, 10)) {
    bodyLines.push(`+ ${a.sectionPath}: ${a.artno} ${a.name}`);
  }
  for (const c of realChanges.slice(0, 20)) {
    const fields = Object.keys(c.after).join(', ');
    bodyLines.push(`~ ${c.path}: ${fields}`);
  }
  if (totalOps > bodyLines.length) bodyLines.push(`... och ${totalOps - bodyLines.length} till`);

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
      addedCount:   addedProducts.length,
      changes:      realChanges,
      additions:    addedProducts
    });
  } catch (e) {
    return err(`GitHub PUT error: ${e.message}`, 500);
  }
};
