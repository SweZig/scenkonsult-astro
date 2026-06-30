// netlify/functions/admin-category-override.js
// Spara/ta bort manuell kategori-klassning av okända artikel-ID:n i
// försäljningsstatistiken.
//
// GET  /.netlify/functions/admin-category-override
//      → { overrides: [{ item_key, category, sample_name, updated_at }] }
//
// POST /.netlify/functions/admin-category-override
//      Body: { action: 'set',    item_key, category, sample_name? }
//      Body: { action: 'delete', item_key }
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

// Tillåtna toppkategorier (måste matcha PREFIX_TO_CAT-värden i admin-stats-sales.js)
const VALID_CATS = ['Scen', 'Ljud', 'Bild', 'Ljus', 'DJ', 'Karaoke', 'El & ström', 'Tjänster'];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const db = supabase();
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  const headers = { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json' };

  try {
    // ── Lista ────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const res = await fetch(
        `${supaUrl}/rest/v1/category_overrides?select=item_key,category,sample_name,updated_at&order=updated_at.desc`,
        { headers }
      );
      if (!res.ok) {
        // Tabellen kanske inte finns ännu (migration ej körd) — returnera tomt + flagga
        if (res.status === 404 || res.status === 400) return ok({ overrides: [], table_missing: true });
        throw new Error(`Supabase: ${res.status}`);
      }
      return ok({ overrides: await res.json() });
    }

    if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

    let body;
    try { body = JSON.parse(event.body || '{}'); }
    catch { return err('Ogiltigt JSON', 400); }

    const { action, item_key } = body;
    if (!item_key || typeof item_key !== 'string') return err('item_key krävs', 400);

    // ── Ta bort ──────────────────────────────────────────────────────────
    if (action === 'delete') {
      const res = await fetch(
        `${supaUrl}/rest/v1/category_overrides?item_key=eq.${encodeURIComponent(item_key)}`,
        { method: 'DELETE', headers: { ...headers, Prefer: 'return=minimal' } }
      );
      if (!res.ok) throw new Error(`Supabase DELETE: ${res.status}`);
      return ok({ ok: true, deleted: item_key });
    }

    // ── Sätt/uppdatera (upsert) ──────────────────────────────────────────
    if (action === 'set') {
      const { category, sample_name } = body;
      if (!VALID_CATS.includes(category)) {
        return err(`Ogiltig kategori. Tillåtna: ${VALID_CATS.join(', ')}`, 400);
      }
      const row = {
        item_key,
        category,
        sample_name: sample_name ? String(sample_name).slice(0, 300) : null,
        updated_at: new Date().toISOString(),
      };
      const res = await fetch(`${supaUrl}/rest/v1/category_overrides?on_conflict=item_key`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error(`Supabase UPSERT: ${res.status} ${await res.text()}`);
      const saved = await res.json();
      return ok({ ok: true, override: Array.isArray(saved) ? saved[0] : saved });
    }

    return err("Okänd action. Använd 'set' eller 'delete'.", 400);
  } catch (e) {
    console.error('CATEGORY_OVERRIDE_ERROR:', e.message);
    return err('Serverfel: ' + e.message, 500);
  }
};
