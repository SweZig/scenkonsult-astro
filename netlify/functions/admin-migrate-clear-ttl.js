// netlify/functions/admin-migrate-clear-ttl.js
// ENGÅNGS-MIGRERING (admin only)
// Nollar `expires_at` på ordrar som är bekräftade/avslutade/fakturerade men som
// råkar ha ett gammalt expires_at kvar i databasen (pga den tidigare buggen där
// kundens digitala bekräftelse aldrig nollade TTL:n).
//
// SÄKERHET:
//  - Rör ENBART fältet expires_at. Inget annat fält, ingen rad-radering,
//    inga items, ingen kundinfo, ingen historik/audit utöver en loggrad.
//  - Träffar ENBART status IN (confirmed, completed, fakturerad) OCH
//    expires_at IS NOT NULL. Allt annat lämnas orört.
//  - DRY-RUN som standard: utan ?apply=1 skrivs INGENTING — den returnerar bara
//    en rapport över vad som SKULLE ändras.
//
// Användning:
//   GET /.netlify/functions/admin-migrate-clear-ttl            → dry-run (visar träffar)
//   GET /.netlify/functions/admin-migrate-clear-ttl?apply=1    → utför nollningen
//   Kräver: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit } = require('./_lib');

const TARGET_STATUSES = ['confirmed', 'completed', 'fakturerad'];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const apply = (event.queryStringParameters || {}).apply === '1';
  const db = supabase();

  try {
    return await runExplicit(db, apply, event);
  } catch (e) {
    console.error('MIGRATE_CLEAR_TTL_ERROR:', e.message);
    return err('Migreringsfel: ' + e.message, 500);
  }
};

async function runExplicit(db, apply, event) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  // ── 1. LÄS: hitta exakt de rader som matchar villkoren ──────────────
  const statusList = TARGET_STATUSES.map(s => `"${s}"`).join(',');
  const selectUrl =
    `${url}/rest/v1/carts` +
    `?select=id,status,customer_name,event_date,confirmed_at,expires_at` +
    `&status=in.(${statusList})` +
    `&expires_at=not.is.null` +
    `&order=event_date.asc`;

  const selRes = await fetch(selectUrl, { headers });
  if (!selRes.ok) {
    const t = await selRes.text();
    return err(`Läsning misslyckades: ${selRes.status} ${t}`, 500);
  }
  const candidates = await selRes.json();

  const report = (candidates || []).map(c => ({
    id: c.id,
    status: c.status,
    customer: c.customer_name || '–',
    event_date: c.event_date || null,
    confirmed_at: c.confirmed_at || null,
    old_expires_at: c.expires_at,
  }));

  // ── 2. DRY-RUN: returnera bara rapporten, skriv ingenting ───────────
  if (!apply) {
    return ok({
      mode: 'dry-run',
      message: 'INGET ändrat. Detta är en förhandsvisning. Lägg till ?apply=1 för att utföra.',
      match_count: report.length,
      would_clear: report,
    });
  }

  // ── 3. APPLY: nolla expires_at, men ENBART för exakt dessa id:n ──────
  // Vi PATCHar per id (inte ett brett filter) så att en eventuell statusändring
  // mellan läs och skriv inte kan råka träffa fel rad. Rör bara expires_at.
  const results = [];
  for (const c of candidates) {
    const patchUrl = `${url}/rest/v1/carts?id=eq.${encodeURIComponent(c.id)}&status=in.(${statusList})`;
    const res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ expires_at: null }),
    });
    const okRow = res.ok;
    results.push({ id: c.id, cleared: okRow, http: res.status });
    if (okRow) {
      // Loggrad i audit-trail så ändringen är spårbar (ingen befintlig historik rörs).
      await logAudit(db, c.id, 'admin', 'ttl_cleared_migration', {
        old_expires_at: c.expires_at,
        reason: 'engångsmigrering: bekräftad order utan TTL',
      }).catch(() => {});
    }
  }

  const cleared = results.filter(r => r.cleared).length;
  return ok({
    mode: 'apply',
    message: `Klart. ${cleared} av ${results.length} ordrar fick expires_at nollat.`,
    cleared_count: cleared,
    results,
  });
}
