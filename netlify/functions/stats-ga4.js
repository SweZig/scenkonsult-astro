// netlify/functions/stats-ga4.js
// Hämtar trafikstatistik från Google Analytics 4 Data API för admin-dashboarden.
//
// GET /.netlify/functions/stats-ga4?period=28&compare=1
//   period:  7 | 28 | 90 (dagar bakåt) — default 28
//   compare: 1 = hämta även föregående lika långa period
//
// Returnerar enhetligt JSON:
//   {
//     period: { days, start, end, compareStart, compareEnd },
//     summary: { sessions, pageviews, users, conversions, engagementRate,
//                deltaSessions, deltaPageviews, deltaUsers, deltaConversions },
//     daily:   [{ date: 'YYYY-MM-DD', sessions, pageviews, compareSessions }, ...],
//     pages:   [{ path, sessions, pageviews, users, engagementRate, conversions }, ...],
//     channels:[{ channel, sessions }],
//     fetchedAt: <ISO>
//   }
//
// Auth:  Authorization: Bearer <ADMIN_TOKEN>
// Env:   GA4_OAUTH_CLIENT_ID, GA4_OAUTH_CLIENT_SECRET, GA4_OAUTH_REFRESH_TOKEN
//        (skapas via scripts/get-ga4-refresh-token.mjs)
//        GA4_PROPERTY_ID (default '417375423')

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');
const { OAuth2Client } = require('google-auth-library');

// ── Access token cache (varar tills funktionen kallrestartas) ───────────
let _cachedToken = null;
let _cachedTokenExpiry = 0;
let _oauthClient = null;

async function getAccessToken() {
  const now = Date.now();
  if (_cachedToken && now < _cachedTokenExpiry - 60_000) return _cachedToken;

  const clientId     = process.env.GA4_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GA4_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GA4_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('GA4 OAuth env-vars saknas (GA4_OAUTH_CLIENT_ID / GA4_OAUTH_CLIENT_SECRET / GA4_OAUTH_REFRESH_TOKEN)');
  }

  if (!_oauthClient) {
    _oauthClient = new OAuth2Client(clientId, clientSecret);
    _oauthClient.setCredentials({ refresh_token: refreshToken });
  }

  // getAccessToken auto-refreshar via refresh_token
  const { token } = await _oauthClient.getAccessToken();
  if (!token) throw new Error('OAuth getAccessToken returnerade null — refresh_token kan vara förbrukad eller återkallad');

  _cachedToken = token;
  // Access tokens lever 1h. Sätt expiry 55 min för säker marginal.
  _cachedTokenExpiry = now + 55 * 60 * 1000;
  return _cachedToken;
}

// ── runReport mot GA4 Data API ──────────────────────────────────────────
async function runReport(propertyId, body, accessToken) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
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
    throw new Error(`GA4 ${res.status}: ${text.slice(0, 400)}`);
  }
  return res.json();
}

// ── Datum-helpers (UTC; GA4 jobbar i propertyns tidszon men för
//    period-jämförelse räcker UTC-datum) ───────────────────────────────
function ymd(d) {
  return d.toISOString().slice(0, 10);
}
function daysAgo(n) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ── Pluck-helpers för report-rows ───────────────────────────────────────
function pickNum(row, idx) {
  const v = row?.metricValues?.[idx]?.value;
  if (v === undefined || v === null || v === '') return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pickDim(row, idx) {
  return row?.dimensionValues?.[idx]?.value || '';
}
function sumMetric(rows, idx) {
  let s = 0;
  for (const r of (rows || [])) s += pickNum(r, idx);
  return s;
}
function pct(curr, prev) {
  if (!prev) return curr ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

// ── Handler ────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const qs = event.queryStringParameters || {};
  const periodDaysRaw = parseInt(qs.period, 10);
  const periodDays = [7, 28, 90].includes(periodDaysRaw) ? periodDaysRaw : 28;
  const wantCompare = qs.compare === '1' || qs.compare === 'true';

  // GA4-data lagrar "yesterday" som senaste fullständiga dag. Vi inkluderar
  // dock idag (kan vara partial) eftersom UI:t visar "senaste N dagar".
  const endDate = ymd(daysAgo(0));
  const startDate = ymd(daysAgo(periodDays - 1));
  const compareEnd = ymd(daysAgo(periodDays));
  const compareStart = ymd(daysAgo(periodDays * 2 - 1));

  const propertyId = process.env.GA4_PROPERTY_ID || '417375423';

  try {
    const token = await getAccessToken();

    // Parallella anrop — separata reports för att hålla varje query enkel
    const ranges = wantCompare
      ? [{ startDate, endDate }, { startDate: compareStart, endDate: compareEnd }]
      : [{ startDate, endDate }];

    const [summaryReport, dailyReport, pagesReport, channelsReport] = await Promise.all([
      // 1. Summary — totaler för perioden (+ jämförelse)
      runReport(propertyId, {
        dateRanges: ranges,
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'conversions' },
          { name: 'engagementRate' },
        ],
      }, token),

      // 2. Daily — sessions/pageviews per dag (+ jämförelse)
      runReport(propertyId, {
        dateRanges: ranges,
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
        limit: 200,
      }, token),

      // 3. Pages — top 30 sidor sorterat på sessions
      runReport(propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'engagementRate' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 30,
      }, token),

      // 4. Channels — donut-data
      runReport(propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }, token),
    ]);

    // ── Parse Summary ──
    // Summary-rapport utan dimensioner returnerar 1 rad per dateRange.
    const sumRows = summaryReport.rows || [];
    const currRow  = sumRows.find(r => (r.dimensionValues?.[0]?.value || '0') === 'date_range_0') || sumRows[0];
    const prevRow  = wantCompare ? (sumRows.find(r => (r.dimensionValues?.[0]?.value || '') === 'date_range_1') || sumRows[1]) : null;

    const sessions   = pickNum(currRow, 0);
    const pageviews  = pickNum(currRow, 1);
    const users      = pickNum(currRow, 2);
    const conversions = pickNum(currRow, 3);
    const engagement = pickNum(currRow, 4);

    const summary = {
      sessions, pageviews, users, conversions,
      engagementRate: Math.round(engagement * 1000) / 10, // procent med 1 decimal
      deltaSessions: 0, deltaPageviews: 0, deltaUsers: 0, deltaConversions: 0,
    };
    if (prevRow) {
      summary.deltaSessions    = pct(sessions,    pickNum(prevRow, 0));
      summary.deltaPageviews   = pct(pageviews,   pickNum(prevRow, 1));
      summary.deltaUsers       = pct(users,       pickNum(prevRow, 2));
      summary.deltaConversions = pct(conversions, pickNum(prevRow, 3));
    }

    // ── Parse Daily ──
    // Dimension: date (YYYYMMDD), plus dateRange-dim när jämförelse är på.
    // Vi normaliserar till YYYY-MM-DD och bygger en map per range.
    const currDaily = new Map();
    const prevDaily = new Map();
    for (const r of (dailyReport.rows || [])) {
      const dateRaw = pickDim(r, 0); // 'YYYYMMDD'
      const dateStr = dateRaw.length === 8
        ? `${dateRaw.slice(0,4)}-${dateRaw.slice(4,6)}-${dateRaw.slice(6,8)}`
        : dateRaw;
      const rangeName = wantCompare ? (r.dimensionValues?.[1]?.value || 'date_range_0') : 'date_range_0';
      const target = rangeName === 'date_range_1' ? prevDaily : currDaily;
      target.set(dateStr, {
        sessions: pickNum(r, 0),
        pageviews: pickNum(r, 1),
      });
    }
    // Bygg array i kronologisk ordning. Jämförelseperiodens dagar
    // alignas position-mässigt (dag 1 av denna period ⇔ dag 1 av föregående).
    const daily = [];
    const currKeys = Array.from(currDaily.keys()).sort();
    const prevKeys = Array.from(prevDaily.keys()).sort();
    for (let i = 0; i < currKeys.length; i++) {
      const k = currKeys[i];
      const c = currDaily.get(k);
      const pk = prevKeys[i];
      const p = pk ? prevDaily.get(pk) : null;
      daily.push({
        date: k,
        sessions: c.sessions,
        pageviews: c.pageviews,
        compareSessions: p ? p.sessions : null,
      });
    }

    // ── Parse Pages ──
    const pages = (pagesReport.rows || []).map(r => ({
      path: pickDim(r, 0),
      sessions: pickNum(r, 0),
      pageviews: pickNum(r, 1),
      users: pickNum(r, 2),
      engagementRate: Math.round(pickNum(r, 3) * 1000) / 10,
      conversions: pickNum(r, 4),
    }));

    // ── Parse Channels ──
    const channels = (channelsReport.rows || []).map(r => ({
      channel: pickDim(r, 0) || '(unknown)',
      sessions: pickNum(r, 0),
    }));

    return ok({
      period: {
        days: periodDays,
        start: startDate,
        end: endDate,
        compareStart: wantCompare ? compareStart : null,
        compareEnd: wantCompare ? compareEnd : null,
      },
      summary,
      daily,
      pages,
      channels,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    // Logga så mycket detaljer som möjligt — Google-fel innehåller ofta
    // mer info i e.response.data än i e.message
    console.error('STATS_GA4 error message:', e?.message || e);
    if (e?.response?.data) {
      console.error('STATS_GA4 Google response:', JSON.stringify(e.response.data));
    }
    if (e?.code) console.error('STATS_GA4 code:', e.code);
    if (e?.stack) console.error('STATS_GA4 stack:', e.stack.split('\n').slice(0, 5).join(' | '));
    return err(`GA4-hämtning misslyckades: ${e?.message || 'okänt fel'}`, 500);
  }
};
