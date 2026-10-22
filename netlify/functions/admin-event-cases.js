// netlify/functions/admin-event-cases.js
// CRUD-endpoint för referenscase — uppdragen i eventgalleriet på /referenser/
// och raderna "Från våra event" på kategorihubbarna. Driver
// /admin/innehall/referenscase/.
//
// Modellen: caset äger fakta (rubrik, text, tagg, bilder). Hubbraden äger
// vinkeln — varje kategori kan välja en egen av casets bilder och sätta egen
// rubrik, text och alt-text. Ljudhubben lyfter ljudet, ljushubben ljuset.
// En bild med in_gallery=false hör till caset men visas bara på hubben.
//
// netlify/generate-event-cases.mjs läser samma tabeller vid prebuild och
// skriver src/data/event-cases.json. Ändringar syns efter nästa deploy.
//
// GET  /.netlify/functions/admin-event-cases
//        → { categories, cases, images, hub }
// POST { action: 'upsert-case', case: { id?, label, descr, tag, categories[], sort_order?, active? } }
// POST { action: 'delete-case', id }                        (mjuk: active=false)
// POST { action: 'reorder-cases', ids: [...] }
// POST { action: 'set-images', case_id, images: [{ src, alt, in_gallery? }] }
//        Ersätter casets hela bildlista i angiven ordning.
// POST { action: 'set-hub', hub: { case_id, category, image_src, label?, descr?, alt?, pos?, sort_order? } }
// POST { action: 'remove-hub', case_id, category }
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { isAdmin, ok, err, preflight, medOmbygge } = require('./_lib');

const SUPA_URL = () => process.env.SUPABASE_URL;
const SUPA_KEY = () => process.env.SUPABASE_SERVICE_KEY;
const headers = () => ({
  apikey: SUPA_KEY(),
  Authorization: `Bearer ${SUPA_KEY()}`,
  'Content-Type': 'application/json',
});

function slug(n) {
  const base = String(n || '').toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 45);
  return base || Date.now().toString(36);
}

async function rest(path, init) {
  const res = await fetch(`${SUPA_URL()}/rest/v1/${path}`, { headers: headers(), ...init });
  if (!res.ok) {
    const text = (await res.text()).slice(0, 200);
    throw Object.assign(new Error(text), { status: res.status, path });
  }
  const body = await res.text();
  return body ? JSON.parse(body) : null;
}

async function uniqueCaseId(base) {
  try {
    const taken = new Set(
      (await rest(`event_cases?select=id&id=like.${encodeURIComponent(base + '*')}`) || []).map((r) => r.id)
    );
    if (!taken.has(base)) return base;
    for (let i = 2; i < 200; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  } catch (_) { /* faller igenom */ }
  return `${base}-${Date.now().toString(36)}`;
}

const IMG_RE = /^\/images\/[A-Za-z0-9._/-]+\.(webp|png|jpg|jpeg|avif)$/;

exports.handler = medOmbygge(async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);
  if (!SUPA_URL() || !SUPA_KEY()) return err('Supabase-konfiguration saknas', 500);

  try {
    if (event.httpMethod === 'GET') {
      const [categories, cases, images, hub] = await Promise.all([
        rest('content_categories?order=sort_order.asc&select=slug,label,sort_order,active'),
        rest('event_cases?order=sort_order.asc&select=*'),
        rest('event_case_images?order=sort_order.asc&select=*'),
        rest('event_case_hub?order=sort_order.asc&select=*'),
      ]);
      return ok({ categories: categories || [], cases: cases || [], images: images || [], hub: hub || [] });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
    const body = JSON.parse(event.body || '{}');

    if (body.action === 'upsert-case') {
      const c = body.case || {};
      if (!c.label || typeof c.label !== 'string') return err('label krävs', 400);
      if (c.label.length > 120) return err('Rubriken får vara max 120 tecken', 400);
      if (!c.descr || typeof c.descr !== 'string') return err('descr krävs', 400);
      if (!c.tag || typeof c.tag !== 'string') return err('tag krävs', 400);
      const id = c.id ? String(c.id) : await uniqueCaseId(`case-${slug(c.label)}`);
      const row = {
        id,
        label: c.label.trim(),
        descr: c.descr.trim(),
        tag: c.tag.trim(),
        categories: Array.isArray(c.categories) ? c.categories.map(String) : [],
        sort_order: Number.isInteger(c.sort_order) ? c.sort_order : 0,
        active: typeof c.active === 'boolean' ? c.active : true,
        updated_at: new Date().toISOString(),
      };
      const saved = await rest('event_cases?on_conflict=id', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      console.log('EVENT_CASE_UPSERT:', id, '-', row.label);
      return ok({ case: saved[0] });
    }

    if (body.action === 'delete-case') {
      if (!body.id) return err('id krävs', 400);
      await rest(`event_cases?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
      });
      console.log('EVENT_CASE_DELETE:', body.id);
      return ok({ deleted: body.id });
    }

    if (body.action === 'reorder-cases') {
      if (!Array.isArray(body.ids)) return err('ids måste vara array', 400);
      for (let i = 0; i < body.ids.length; i++) {
        await rest(`event_cases?id=eq.${encodeURIComponent(body.ids[i])}`, {
          method: 'PATCH',
          body: JSON.stringify({ sort_order: i, updated_at: new Date().toISOString() }),
        });
      }
      console.log('EVENT_CASES_REORDER: count=' + body.ids.length);
      return ok({ reordered: body.ids.length });
    }

    if (body.action === 'set-images') {
      const cid = body.case_id;
      if (!cid) return err('case_id krävs', 400);
      if (!Array.isArray(body.images)) return err('images måste vara array', 400);
      if (body.images.length > 12) return err('Max 12 bilder per case', 400);

      const seen = new Set();
      const rows = [];
      for (const [i, im] of body.images.entries()) {
        const src = String(im?.src || '').trim();
        const alt = String(im?.alt || '').trim();
        if (!IMG_RE.test(src)) return err(`Ogiltig bildsökväg: ${src.slice(0, 80)}`, 400);
        if (!alt) return err(`Alt-text krävs för ${src}`, 400);
        if (seen.has(src)) return err(`Samma bild två gånger: ${src}`, 400);
        seen.add(src);
        rows.push({ case_id: cid, src, alt, in_gallery: im.in_gallery !== false, sort_order: i });
      }

      // Hubbrader som pekar på en bild som tas bort skulle bli föräldralösa —
      // generatorn hoppar över dem, men bättre att säga ifrån här.
      const hub = await rest(`event_case_hub?case_id=eq.${encodeURIComponent(cid)}&select=category,image_src`);
      const orphan = (hub || []).filter((h) => !seen.has(h.image_src));
      if (orphan.length) {
        return err(`Bilden används av hubben för ${orphan.map((o) => o.category).join(', ')} — ändra hubbraden först`, 409);
      }

      await rest(`event_case_images?case_id=eq.${encodeURIComponent(cid)}`, { method: 'DELETE' });
      if (rows.length) {
        await rest('event_case_images', {
          method: 'POST',
          headers: { ...headers(), Prefer: 'return=minimal' },
          body: JSON.stringify(rows),
        });
      }
      console.log('EVENT_CASE_IMAGES_SET:', cid, '=', rows.length);
      return ok({ case_id: cid, count: rows.length });
    }

    if (body.action === 'set-hub') {
      const h = body.hub || {};
      if (!h.case_id || !h.category || !h.image_src) return err('case_id, category och image_src krävs', 400);
      const imgs = await rest(`event_case_images?case_id=eq.${encodeURIComponent(h.case_id)}&select=src`);
      if (!(imgs || []).some((i) => i.src === h.image_src)) {
        return err('Bilden hör inte till caset', 400);
      }
      const row = {
        case_id: String(h.case_id),
        category: String(h.category),
        image_src: String(h.image_src),
        label: typeof h.label === 'string' ? (h.label.trim() || null) : null,
        descr: typeof h.descr === 'string' ? (h.descr.trim() || null) : null,
        alt: typeof h.alt === 'string' ? (h.alt.trim() || null) : null,
        pos: typeof h.pos === 'string' ? (h.pos.trim() || null) : null,
        sort_order: Number.isInteger(h.sort_order) ? h.sort_order : 0,
      };
      const saved = await rest('event_case_hub?on_conflict=case_id,category', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      console.log('EVENT_CASE_HUB_SET:', row.case_id, '/', row.category);
      return ok({ hub: saved[0] });
    }

    if (body.action === 'remove-hub') {
      if (!body.case_id || !body.category) return err('case_id och category krävs', 400);
      await rest(
        `event_case_hub?case_id=eq.${encodeURIComponent(body.case_id)}&category=eq.${encodeURIComponent(body.category)}`,
        { method: 'DELETE' }
      );
      console.log('EVENT_CASE_HUB_REMOVE:', body.case_id, '/', body.category);
      return ok({ removed: `${body.case_id}/${body.category}` });
    }

    return err('Okänd action', 400);
  } catch (e) {
    console.error('ADMIN_EVENT_CASES_ERROR:', e.status || '', e.path || '', e.message);
    return err('Internt fel', 500);
  }
}, 'referenscase');
