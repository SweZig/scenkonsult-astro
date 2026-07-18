// netlify/functions/admin-reviews.js
// CRUD-endpoint för Google-recensioner (kurerad, komplett lista).
// Kringgår Places API:ts 5-tak — recensionerna lagras och underhålls här istället.
//
// GET  /.netlify/functions/admin-reviews
//      → returnerar ALLA recensioner (inkl. inaktiva) sorterade på sort_order
//
// POST /.netlify/functions/admin-reviews
//      Body: { action: 'upsert', review: { id?, author, rating, review_text, published_at?, sort_order?, active? } }
//      Body: { action: 'delete', id }                    (mjuk: active=false)
//      Body: { action: 'reorder', ids: [id1, id2, ...] } (uppdaterar sort_order)
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

function newId() {
  return 'rev-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function validate(r) {
  if (!r || typeof r !== 'object') return 'Recension saknas';
  if (!r.author || typeof r.author !== 'string') return 'Namn krävs';
  if (r.author.length > 120) return 'Namn får vara max 120 tecken';
  if (!r.review_text || typeof r.review_text !== 'string') return 'Recensionstext krävs';
  if (r.review_text.length > 1500) return 'Text får vara max 1500 tecken';
  const rating = Number(r.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Betyg måste vara 1–5';
  if (r.published_at && isNaN(Date.parse(r.published_at))) return 'Ogiltigt datum';
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const db = supabase();

  try {
    // ── GET: lista alla (även inaktiva) ──────────────────────
    if (event.httpMethod === 'GET') {
      const { data } = await db.from('reviews')
        .select('*')
        .order('sort_order', { ascending: true });
      return ok({ reviews: data || [] });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

    const body = JSON.parse(event.body || '{}');
    const action = body.action;

    // ── POST upsert: skapa eller uppdatera ──────────────────
    if (action === 'upsert') {
      const r = body.review || {};
      const validationErr = validate(r);
      if (validationErr) return err(validationErr, 400);

      const id = r.id || newId();
      const row = {
        id,
        author: r.author.trim(),
        rating: Number(r.rating),
        review_text: r.review_text.trim(),
        published_at: r.published_at || new Date().toISOString(),
        sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
        active: typeof r.active === 'boolean' ? r.active : true,
        updated_at: new Date().toISOString(),
      };

      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/reviews?on_conflict=id`, {
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
        console.error('REVIEWS_UPSERT_ERROR:', res.status, errText.slice(0, 200));
        return err('Kunde inte spara recension', 500);
      }

      const saved = (await res.json())[0];
      console.log('REVIEWS_UPSERT:', saved.id, '-', saved.author);
      return ok({ review: saved });
    }

    // ── POST delete: mjuk borttagning ────────────────────────
    if (action === 'delete') {
      if (!body.id) return err('id krävs', 400);
      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      const res = await fetch(`${supaUrl}/rest/v1/reviews?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supaKey,
          'Authorization': `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
      });
      if (!res.ok) return err('Kunde inte ta bort recension', 500);
      console.log('REVIEWS_DELETE:', body.id);
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
        await fetch(`${supaUrl}/rest/v1/reviews?id=eq.${encodeURIComponent(body.ids[i])}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ sort_order: i, updated_at: new Date().toISOString() }),
        });
      }
      console.log('REVIEWS_REORDER: count=' + body.ids.length);
      return ok({ reordered: body.ids.length });
    }

    return err('Okänd action', 400);
  } catch (e) {
    console.error('ADMIN_REVIEWS_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
