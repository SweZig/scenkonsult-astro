// netlify/functions/admin-popular.js
// CRUD-endpoint för "Populäraste paketen" — kategorikonfiguration, grupper och
// deras artiklar. Driver /admin/innehall/topplistor/.
//
// Grupperna renderas inte direkt härifrån: netlify/generate-popular.mjs läser
// samma tabeller vid prebuild och skriver src/data/popular.json, som sidorna
// använder. Ändringar syns alltså efter nästa deploy.
//
// GET  /.netlify/functions/admin-popular
//        → { categories, groups, items }
// POST { action: 'upsert-category', category: { slug, label?, popular_heading?,
//        popular_lead?, cases_lead?, alla_href?, alla_label?, source_categories?, active? } }
// POST { action: 'upsert-group', group: { id?, category, rubrik, gaster?, lead?,
//        sort_order?, active? } }       id saknas → nytt id ur rubriken
// POST { action: 'delete-group', id }                     (mjuk: active=false)
// POST { action: 'reorder-groups', ids: [...] }
// POST { action: 'set-items', group_id, artnos: [...], source? }
//        Ersätter gruppens hela lista. Varje post är ett artikelnummer eller
//        { artno, source }; source='data' märker rader som kom från
//        bokningsstatistiken ("Fyll från bokningsdata" i admin). `source` på
//        toppnivå är förval för poster som inte anger eget.
//
// Rankningsunderlaget hämtas av admin-sidan direkt från admin-stats-sales —
// den aggregerar redan per artno, så ingen statistik räknas om här.
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
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
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

async function uniqueGroupId(base) {
  try {
    const taken = new Set(
      (await rest(`popular_groups?select=id&id=like.${encodeURIComponent(base + '*')}`) || []).map((r) => r.id)
    );
    if (!taken.has(base)) return base;
    for (let i = 2; i < 200; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  } catch (_) { /* faller igenom */ }
  return `${base}-${Date.now().toString(36)}`;
}

exports.handler = medOmbygge(async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);
  if (!SUPA_URL() || !SUPA_KEY()) return err('Supabase-konfiguration saknas', 500);

  try {
    if (event.httpMethod === 'GET') {
      const [categories, groups, items] = await Promise.all([
        rest('content_categories?order=sort_order.asc&select=*'),
        rest('popular_groups?order=sort_order.asc&select=*'),
        rest('popular_group_items?order=sort_order.asc&select=*'),
      ]);
      return ok({ categories: categories || [], groups: groups || [], items: items || [] });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
    const body = JSON.parse(event.body || '{}');

    if (body.action === 'upsert-category') {
      const c = body.category || {};
      if (!c.slug) return err('slug krävs', 400);
      const row = { slug: String(c.slug), updated_at: new Date().toISOString() };
      for (const f of ['label', 'hub_path', 'alla_href', 'alla_label', 'popular_heading', 'popular_lead', 'cases_lead']) {
        if (typeof c[f] === 'string') row[f] = c[f].trim() || null;
      }
      if (Array.isArray(c.source_categories)) row.source_categories = c.source_categories;
      if (typeof c.active === 'boolean') row.active = c.active;
      if (!row.label && !(await rest(`content_categories?select=slug&slug=eq.${encodeURIComponent(row.slug)}`))?.length) {
        return err('label krävs för en ny kategori', 400);
      }
      const saved = await rest('content_categories?on_conflict=slug', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      console.log('POPULAR_CATEGORY_UPSERT:', row.slug);
      return ok({ category: saved[0] });
    }

    if (body.action === 'upsert-group') {
      const g = body.group || {};
      if (!g.category) return err('category krävs', 400);
      if (!g.rubrik || typeof g.rubrik !== 'string') return err('rubrik krävs', 400);
      if (g.rubrik.length > 120) return err('Rubriken får vara max 120 tecken', 400);
      const id = g.id ? String(g.id) : await uniqueGroupId(`pg-${slug(g.category)}-${slug(g.rubrik)}`);
      const row = {
        id,
        category: String(g.category),
        rubrik: g.rubrik.trim(),
        gaster: typeof g.gaster === 'string' ? (g.gaster.trim() || null) : null,
        lead: typeof g.lead === 'string' ? (g.lead.trim() || null) : null,
        sort_order: Number.isInteger(g.sort_order) ? g.sort_order : 0,
        active: typeof g.active === 'boolean' ? g.active : true,
        updated_at: new Date().toISOString(),
      };
      const saved = await rest('popular_groups?on_conflict=id', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      console.log('POPULAR_GROUP_UPSERT:', id, '-', row.rubrik);
      return ok({ group: saved[0] });
    }

    if (body.action === 'delete-group') {
      if (!body.id) return err('id krävs', 400);
      await rest(`popular_groups?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
      });
      console.log('POPULAR_GROUP_DELETE:', body.id);
      return ok({ deleted: body.id });
    }

    if (body.action === 'reorder-groups') {
      if (!Array.isArray(body.ids)) return err('ids måste vara array', 400);
      for (let i = 0; i < body.ids.length; i++) {
        await rest(`popular_groups?id=eq.${encodeURIComponent(body.ids[i])}`, {
          method: 'PATCH',
          body: JSON.stringify({ sort_order: i, updated_at: new Date().toISOString() }),
        });
      }
      console.log('POPULAR_GROUPS_REORDER: count=' + body.ids.length);
      return ok({ reordered: body.ids.length });
    }

    if (body.action === 'set-items') {
      const gid = body.group_id;
      if (!gid) return err('group_id krävs', 400);
      if (!Array.isArray(body.artnos)) return err('artnos måste vara array', 400);
      const fallback = body.source === 'data' ? 'data' : 'manual';
      // Varje rad får behålla sitt eget ursprung: en post kan vara en sträng
      // eller { artno, source }. Dubbletter tas bort — (group_id, artno) är
      // primärnyckel, och första förekomsten vinner.
      const sedda = new Set();
      const artnos = [];
      for (const a of body.artnos) {
        const artno = String(typeof a === 'string' ? a : (a && a.artno) || '').trim();
        if (!artno || sedda.has(artno)) continue;
        sedda.add(artno);
        const s = typeof a === 'object' && a && a.source === 'data' ? 'data'
          : typeof a === 'object' && a && a.source === 'manual' ? 'manual' : fallback;
        artnos.push({ artno, source: s });
      }
      if (artnos.length > 24) return err('Max 24 artiklar per grupp', 400);

      await rest(`popular_group_items?group_id=eq.${encodeURIComponent(gid)}`, { method: 'DELETE' });
      if (artnos.length) {
        await rest('popular_group_items', {
          method: 'POST',
          headers: { ...headers(), Prefer: 'return=minimal' },
          body: JSON.stringify(artnos.map((a, i) => ({ group_id: gid, artno: a.artno, sort_order: i, source: a.source }))),
        });
      }
      const franData = artnos.filter((a) => a.source === 'data').length;
      console.log('POPULAR_ITEMS_SET:', gid, '=', artnos.length, `(varav ${franData} från data)`);
      return ok({ group_id: gid, count: artnos.length });
    }

    return err('Okänd action', 400);
  } catch (e) {
    console.error('ADMIN_POPULAR_ERROR:', e.status || '', e.path || '', e.message);
    return err('Internt fel', 500);
  }
}, 'topplistor');
