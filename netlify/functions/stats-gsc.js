// netlify/functions/stats-gsc.js
// Hämtar trafikstatistik från Google Search Console för admin-dashboarden.
//
// GET /.netlify/functions/stats-gsc?period=28
//   period: 7 | 28 | 90 (dagar bakåt) — default 28
//
// Returnerar:
//   {
//     period: { days, start, end },
//     summary: { totalClicks, totalImpressions, avgCtr, avgPosition },
//     pages:   [{ path, clicks, impressions, ctr, position }, ...],  // topp 50
//     queries: [{ query, clicks, impressions, ctr, position }, ...], // topp 25
//     fetchedAt: <ISO>
//   }
//
// Auth:  Authorization: Bearer <ADMIN_TOKEN>
// Env:   GA4_OAUTH_* (delas med stats-ga4 via _google-oauth.js)
//        GSC_SITE_URL (default 'sc-domain:scenkonsult.se')
//
// OBS: GSC-data är ~2 dagar gammal i sin senaste rad. Senaste 1-2 dagarna
// av perioden returnerar tomma värden, vilket är förväntat.

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');
const { getGoogleAccessToken } = require('./_google-oauth');

// ── searchAnalytics.query mot Search Console API ────────────────────────
async function gscQuery(siteUrl, body, accessToken) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC ${res.status}: ${text.slice(0, 400)}`);
  }
  return res.json();
}

// ── Datum-helpers ────────────────────────────────────────────────────────
function ymd(d) {
  return d.toISOString().slice(0, 10);
}
function daysAgo(n) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ── Path-normalisering — GSC returnerar full URL, vi vill matcha
//    GA4:s pagePath som bara har pathnamn. Ex: "https://x.se/foo/" → "/foo/" ──
function normalizePath(url) {
  try { return new URL(url).pathname; }
  catch { return url; }
}

// ── Handler ─────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const qs = event.queryStringParameters || {};
  const periodDaysRaw = parseInt(qs.period, 10);
  const periodDays = [7, 28, 90].includes(periodDaysRaw) ? periodDaysRaw : 28;

  const endDate   = ymd(daysAgo(0));
  const startDate = ymd(daysAgo(periodDays - 1));

  const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:scenkonsult.se';

  try {
    const token = await getGoogleAccessToken();

    // Parallella anrop — sidor + sökord
    const [pagesReport, queriesReport] = await Promise.all([
      gscQuery(siteUrl, {
        startDate, endDate,
        dimensions: ['page'],
        rowLimit: 50,
      }, token),
      gscQuery(siteUrl, {
        startDate, endDate,
        dimensions: ['query'],
        rowLimit: 25,
      }, token),
    ]);

    // ── Parse pages ──
    const pages = (pagesReport.rows || []).map(r => ({
      path: normalizePath(r.keys?.[0] || ''),
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: Math.round((r.ctr || 0) * 1000) / 10,           // procent, 1 decimal
      position: Math.round((r.position || 0) * 10) / 10,   // 1 decimal
    }));

    // ── Parse queries ──
    const queries = (queriesReport.rows || []).map(r => ({
      query: r.keys?.[0] || '',
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: Math.round((r.ctr || 0) * 1000) / 10,
      position: Math.round((r.position || 0) * 10) / 10,
    }));

    // ── Summary — aggregera från pages (mer komplett än separat call) ──
    const totalClicks      = pages.reduce((s, p) => s + p.clicks, 0);
    const totalImpressions = pages.reduce((s, p) => s + p.impressions, 0);
    const avgCtr = totalImpressions
      ? Math.round((totalClicks / totalImpressions) * 1000) / 10
      : 0;
    // Vägd snittposition (impressions som vikt)
    const weightedPosSum = pages.reduce((s, p) => s + (p.position * p.impressions), 0);
    const avgPosition = totalImpressions
      ? Math.round((weightedPosSum / totalImpressions) * 10) / 10
      : 0;

    return ok({
      period: {
        days: periodDays,
        start: startDate,
        end: endDate,
      },
      summary: { totalClicks, totalImpressions, avgCtr, avgPosition },
      pages,
      queries,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('STATS_GSC error:', e?.message || e);
    if (e?.stack) console.error('STATS_GSC stack:', e.stack.split('\n').slice(0, 5).join(' | '));
    return err(`GSC-hämtning misslyckades: ${e?.message || 'okänt fel'}`, 500);
  }
};
