// netlify/functions/sven-stats.js
// Hämtar Sven-statistik från sven_logs i Supabase
'use strict';
const { supabase: createSupabase, isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}

  const db = createSupabase();
  const now = new Date();
  const d30  = new Date(now - 30 * 86400000).toISOString();
  const d7   = new Date(now - 7  * 86400000).toISOString();
  const d1   = new Date(now - 86400000).toISOString();

  try {
    // ── Statistik ──────────────────────────────────────────────────────────
    // Alla loggar senaste 30 dagar
    const { data: rows30 } = await db.from('sven_logs')
      .select('created_at, is_chip, customer_type')
      .not('message', 'is', null);

    const all30  = (rows30 || []).filter(r => r.created_at >= d30);
    const all7   = all30.filter(r => r.created_at >= d7);
    const all1   = all30.filter(r => r.created_at >= d1);

    const month = all30.length;
    const week  = all7.length;
    const today = all1.length;
    const avg   = month > 0 ? Math.round(month / 30) : 0;

    // Daglig fördelning sista 30 dagar
    const dayCounts = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      dayCounts[key] = 0;
    }
    all30.forEach(r => {
      const key = r.created_at.slice(0, 10);
      if (key in dayCounts) dayCounts[key]++;
    });
    const daily = Object.entries(dayCounts).map(([date, count]) => ({ date, count }));

    // Betygssnitt från ratings (loggas separat som type=rating — hämta från console ej DB ännu)
    const rating = null;

    if (body.getLogs) {
      // ── Senaste 200 loggar för frågtabellen ───────────────────────────────
      let q = db.from('sven_logs')
        .select('id, created_at, message, reply_preview, is_chip, customer_type, page_url')
        .order('created_at', { ascending: false })
        .limit(200);

      if (body.customerType) {
        q = q.eq('customer_type', body.customerType);
      }

      const { data: logs } = await q;
      return ok({ today, week, month, avg, rating, daily, logs: logs || [] });
    }

    return ok({ today, week, month, avg, rating, daily });

  } catch (e) {
    console.error('SVEN_STATS_ERR:', e.message);
    return err('Serverfel', 500);
  }
};
