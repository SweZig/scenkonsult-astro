// netlify/functions/admin-chat-templates.js
// CRUD-endpoint för chat-snabbmallar (Chatt-fliken i admin)
//
// GET  /.netlify/functions/admin-chat-templates
//      → returnerar alla aktiva mallar sorterade på sort_order
//
// POST /.netlify/functions/admin-chat-templates
//      Body: { action: 'upsert', template: { id?, label, title?, body, sort_order? } }
//      Body: { action: 'delete', id }                    (mjuk: enabled=false)
//      Body: { action: 'reorder', ids: [id1, id2, ...] } (uppdaterar sort_order)
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

// Skapa stabil slug-id från label om id saknas
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `mall-${Date.now()}`;
}

function validate(t) {
  if (!t || typeof t !== 'object') return 'Mall saknas';
  if (!t.label || typeof t.label !== 'string') return 'Label krävs';
  if (t.label.length > 80) return 'Label får vara max 80 tecken';
  if (!t.body || typeof t.body !== 'string') return 'Body krävs';
  if (t.body.length > 5000) return 'Body får vara max 5000 tecken';
  if (t.title && t.title.length > 200) return 'Title (tooltip) får vara max 200 tecken';
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const db = supabase();

  try {
    // ── GET: lista alla aktiva mallar ────────────────────────
    if (event.httpMethod === 'GET') {
      const { data } = await db.from('chat_templates')
        .select('*')
        .eq('enabled', true)
        .order('sort_order', { ascending: true });
      return ok({ templates: data || [] });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

    const body = JSON.parse(event.body || '{}');
    const action = body.action;

    // ── POST upsert: skapa eller uppdatera ──────────────────
    if (action === 'upsert') {
      const t = body.template || {};
      const validationErr = validate(t);
      if (validationErr) return err(validationErr, 400);

      const id = t.id || slugify(t.label);
      const row = {
        id,
        label: t.label.trim(),
        title: t.title?.trim() || null,
        body: t.body.trim(),
        sort_order: typeof t.sort_order === 'number' ? t.sort_order : 0,
        enabled: true,
        updated_at: new Date().toISOString(),
      };

      // Använd Supabase upsert via PostgREST: POST med Prefer: resolution=merge-duplicates
      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/chat_templates?on_conflict=id`, {
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
        console.error('UPSERT_ERROR:', res.status, errText.slice(0, 200));
        return err('Kunde inte spara mall', 500);
      }

      const saved = (await res.json())[0];
      console.log('CHAT_TEMPLATE_UPSERT:', saved.id, '-', saved.label);
      return ok({ template: saved });
    }

    // ── POST delete: mjuk borttagning ────────────────────────
    if (action === 'delete') {
      if (!body.id) return err('id krävs', 400);

      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/chat_templates?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supaKey,
          'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ enabled: false, updated_at: new Date().toISOString() }),
      });

      if (!res.ok) return err('Kunde inte ta bort mall', 500);

      console.log('CHAT_TEMPLATE_DELETE:', body.id);
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

      // Uppdatera en i taget — enkelt och tydligt, körs sällan
      for (let i = 0; i < body.ids.length; i++) {
        await fetch(`${supaUrl}/rest/v1/chat_templates?id=eq.${encodeURIComponent(body.ids[i])}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ sort_order: i, updated_at: new Date().toISOString() }),
        });
      }

      console.log('CHAT_TEMPLATE_REORDER: count=' + body.ids.length);
      return ok({ reordered: body.ids.length });
    }

    return err('Okänd action', 400);
  } catch (e) {
    console.error('ADMIN_CHAT_TEMPLATES_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
