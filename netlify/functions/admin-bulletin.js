// netlify/functions/admin-bulletin.js
// CRUD-endpoint för bulletin board (löpande meddelanden i nav-tickern).
//
// GET  /.netlify/functions/admin-bulletin
//      → returnerar ALLA meddelanden (inkl. inaktiva/utgångna) sorterade på sort_order
//
// POST /.netlify/functions/admin-bulletin
//      Body: { action: 'upsert', bulletin: { id?, text, link_url?, sort_order?, active?, expires_at? } }
//      Body: { action: 'delete', id }                    (mjuk: active=false)
//      Body: { action: 'reorder', ids: [id1, id2, ...] } (uppdaterar sort_order)
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `bulletin-${Date.now()}`;
}

function validate(b) {
  if (!b || typeof b !== 'object') return 'Meddelande saknas';
  if (!b.text || typeof b.text !== 'string') return 'Text krävs';
  if (b.text.length > 200) return 'Text får vara max 200 tecken';
  if (b.link_url && typeof b.link_url !== 'string') return 'link_url måste vara text';
  if (b.link_url && b.link_url.length > 300) return 'Länk får vara max 300 tecken';
  if (b.type && !['campaign', 'default'].includes(b.type)) return 'Ogiltig typ';
  if (b.starts_at && isNaN(Date.parse(b.starts_at))) return 'Ogiltigt startdatum';
  if (b.expires_at && isNaN(Date.parse(b.expires_at))) return 'Ogiltigt utgångsdatum';
  if (b.starts_at && b.expires_at && new Date(b.starts_at) >= new Date(b.expires_at)) {
    return 'Från-datum måste vara före till-datum';
  }
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const db = supabase();

  try {
    // ── GET: lista alla (även inaktiva) ──────────────────────
    if (event.httpMethod === 'GET') {
      const { data } = await db.from('bulletins')
        .select('*')
        .order('sort_order', { ascending: true });
      return ok({ bulletins: data || [] });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

    const body = JSON.parse(event.body || '{}');
    const action = body.action;

    // ── POST upsert: skapa eller uppdatera ──────────────────
    if (action === 'upsert') {
      const b = body.bulletin || {};
      const validationErr = validate(b);
      if (validationErr) return err(validationErr, 400);

      const id = b.id || slugify(b.text);
      const type = b.type === 'default' ? 'default' : 'campaign';
      const row = {
        id,
        text: b.text.trim(),
        link_url: b.link_url?.trim() || null,
        type,
        sort_order: typeof b.sort_order === 'number' ? b.sort_order : 0,
        active: typeof b.active === 'boolean' ? b.active : true,
        // Default-rader (standardtexten) har inget tidsfönster — bara kampanjer schemaläggs.
        starts_at: type === 'default' ? null : (b.starts_at || null),
        expires_at: type === 'default' ? null : (b.expires_at || null),
        updated_at: new Date().toISOString(),
      };

      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/bulletins?on_conflict=id`, {
        method: 'POST',
        headers: {
          'apikey': supaKey,
          'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(row),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('BULLETIN_UPSERT_ERROR:', res.status, errText.slice(0, 200));
        return err('Kunde inte spara meddelande', 500);
      }

      const saved = (await res.json())[0];
      console.log('BULLETIN_UPSERT:', saved.id, '-', saved.text.slice(0, 40));
      return ok({ bulletin: saved });
    }

    // ── POST delete: mjuk borttagning ────────────────────────
    if (action === 'delete') {
      if (!body.id) return err('id krävs', 400);

      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/bulletins?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supaKey,
          'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
      });

      if (!res.ok) return err('Kunde inte ta bort meddelande', 500);

      console.log('BULLETIN_DELETE:', body.id);
      return ok({ deleted: body.id });
    }

    // ── POST reorder: uppdatera sort_order för flera ─────────
    if (action === 'reorder') {
      if (!Array.isArray(body.ids)) return err('ids måste vara array', 400);

      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const headers = {
        'apikey': supaKey,
        'Authorization': `Bearer ${supaKey}`,
        'Content-Type': 'application/json',
      };

      for (let i = 0; i < body.ids.length; i++) {
        await fetch(`${supaUrl}/rest/v1/bulletins?id=eq.${encodeURIComponent(body.ids[i])}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ sort_order: i, updated_at: new Date().toISOString() }),
        });
      }

      console.log('BULLETIN_REORDER: count=' + body.ids.length);
      return ok({ reordered: body.ids.length });
    }

    return err('Okänd action', 400);
  } catch (e) {
    console.error('ADMIN_BULLETIN_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
