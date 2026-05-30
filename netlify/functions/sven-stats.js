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
      .select('created_at, is_chip, customer_type, rating, forward_tag, promise_detected')
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

    // Betygssnitt + fördelning (30 dagar)
    const ratings30 = all30.filter(r => r.rating !== null && r.rating !== undefined);
    const ratingCount = ratings30.length;
    const rating = ratingCount > 0
      ? ratings30.reduce((sum, r) => sum + r.rating, 0) / ratingCount
      : null;
    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings30.forEach(r => { if (ratingDist[r.rating] !== undefined) ratingDist[r.rating]++; });

    // Antal FORWARD-taggade ärenden + antal upptäckta-utan-tagg-löften (30 dagar)
    const forwardCount = all30.filter(r => r.forward_tag).length;
    const promiseCount = all30.filter(r => r.promise_detected).length;

    if (body.getLogs) {
      // ── Senaste 200 loggar för frågtabellen ───────────────────────────────
      let q = db.from('sven_logs')
        .select('id, created_at, message, reply_preview, is_chip, customer_type, page_url, session_id, message_idx, rating, forward_tag, promise_detected')
        .order('created_at', { ascending: false })
        .limit(200);

      if (body.customerType) {
        q = q.eq('customer_type', body.customerType);
      }

      const { data: logs } = await q;
      return ok({ today, week, month, avg, rating, ratingCount, ratingDist, forwardCount, promiseCount, daily, logs: logs || [] });
    }

    if (body.getThread && body.session_id) {
      // ── Hela konversationen för en session ────────────────────────────────
      const { data: thread, error: tErr } = await db.from('sven_logs')
        .select('id, created_at, message, reply_preview, is_chip, customer_type, page_url, session_id, message_idx, rating, forward_tag, promise_detected')
        .eq('session_id', body.session_id)
        .order('message_idx', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(500);
      if (tErr) {
        console.error('SVEN_THREAD_ERR:', tErr.message);
        return err('Kunde inte hämta tråd', 500);
      }
      return ok({ thread: thread || [] });
    }

    return ok({ today, week, month, avg, rating, ratingCount, ratingDist, forwardCount, promiseCount, daily });

  } catch (e) {
    console.error('SVEN_STATS_ERR:', e.message);
    return err('Serverfel', 500);
  }
};
