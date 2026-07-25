// netlify/functions/admin-clients.js
// CRUD-endpoint för kundlistan (referenskunder). Varje kund har ETT kategori-fält;
// kategorivyn och "Samtliga referenskunder" på referenssidan byggs automatiskt.
//
// GET  /.netlify/functions/admin-clients   → alla kunder (inkl inaktiva), sort_order
// POST { action: 'upsert', client: { id?, name, category?, sort_order?, active? } }
// POST { action: 'delete', id }            (mjuk: active=false)
// POST { action: 'reorder', ids: [...] }
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

const CATEGORIES = ['kommun', 'naringsliv', 'ambassad', 'event'];

function slug(n) {
  return 'cli-' + String(n || '').toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'cli-' + Date.now().toString(36);
}

function validate(c) {
  if (!c || typeof c !== 'object') return 'Kund saknas';
  if (!c.name || typeof c.name !== 'string') return 'Namn krävs';
  if (c.name.length > 120) return 'Namn får vara max 120 tecken';
  if (c.category != null && c.category !== '' && !CATEGORIES.includes(c.category)) return 'Ogiltig kategori';
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const db = supabase();

  try {
    if (event.httpMethod === 'GET') {
      const { data } = await db.from('clients')
        .select('*')
        .order('sort_order', { ascending: true });
      return ok({ clients: data || [] });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

    const body = JSON.parse(event.body || '{}');
    const action = body.action;

    if (action === 'upsert') {
      const c = body.client || {};
      const validationErr = validate(c);
      if (validationErr) return err(validationErr, 400);

      const id = c.id || slug(c.name);
      const row = {
        id,
        name: c.name.trim(),
        category: (c.category && CATEGORIES.includes(c.category)) ? c.category : null,
        sort_order: typeof c.sort_order === 'number' ? c.sort_order : 0,
        active: typeof c.active === 'boolean' ? c.active : true,
        updated_at: new Date().toISOString(),
      };
      // 'ort' inkluderas bara när det faktiskt är satt — så vanliga sparningar
      // fungerar även innan Supabase-kolumnen 'ort' lagts till.
      if (c.ort && typeof c.ort === 'string' && c.ort.trim()) row.ort = c.ort.trim();

      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/clients?on_conflict=id`, {
        method: 'POST',
        headers: {
          'apikey': supaKey, 'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('CLIENTS_UPSERT_ERROR:', res.status, errText.slice(0, 200));
        return err('Kunde inte spara kund', 500);
      }
      const saved = (await res.json())[0];
      console.log('CLIENTS_UPSERT:', saved.id, '-', saved.name, '/', saved.category);
      return ok({ client: saved });
    }

    if (action === 'delete') {
      if (!body.id) return err('id krävs', 400);
      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/clients?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supaKey, 'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json', 'Prefer': 'return=representation',
        },
        body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
      });
      if (!res.ok) return err('Kunde inte ta bort kund', 500);
      console.log('CLIENTS_DELETE:', body.id);
      return ok({ deleted: body.id });
    }

    if (action === 'reorder') {
      if (!Array.isArray(body.ids)) return err('ids måste vara array', 400);
      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const headers = { 'apikey': supaKey, 'Authorization': `Bearer ${supaKey}`, 'Content-Type': 'application/json' };
      for (let i = 0; i < body.ids.length; i++) {
        await fetch(`${supaUrl}/rest/v1/clients?id=eq.${encodeURIComponent(body.ids[i])}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ sort_order: i, updated_at: new Date().toISOString() }),
        });
      }
      console.log('CLIENTS_REORDER: count=' + body.ids.length);
      return ok({ reordered: body.ids.length });
    }

    return err('Okänd action', 400);
  } catch (e) {
    console.error('ADMIN_CLIENTS_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
