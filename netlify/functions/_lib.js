// netlify/functions/_lib.js
// Delad hjälpmodul — importeras av alla cart-functions
// Använder fetch (inbyggt i Node 18+) istället för supabase-js
// för att undvika extra dependencies i Netlify Functions

'use strict';

// ── Supabase REST-klient (fetch-baserad) ──────────────────────
function supabase() {
  const url  = process.env.SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Supabase env-vars saknas');

  const headers = {
    'apikey':        key,
    'Authorization': `Bearer ${key}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation'
  };

  return {
    // Hämta rader: from('carts').select('*').eq('id', x)
    from(table) {
      let _url    = `${url}/rest/v1/${table}`;
      let _filter = [];
      let _select = '*';
      let _order  = null;
      let _limit  = null;

      const builder = {
        select(cols = '*') { _select = cols; return builder; },
        eq(col, val)  { _filter.push(`${col}=eq.${encodeURIComponent(val)}`); return builder; },
        neq(col, val) { _filter.push(`${col}=neq.${encodeURIComponent(val)}`); return builder; },
        is(col, val)  { _filter.push(`${col}=is.${val}`); return builder; },
        not(col, op, val) { _filter.push(`${col}=not.${op}.${encodeURIComponent(val)}`); return builder; },
        order(col, opts = {}) { _order = `${col}.${opts.ascending === false ? 'desc' : 'asc'}`; return builder; },
        limit(n) { _limit = n; return builder; },

        async single() {
          const rows = await builder._fetch('GET');
          if (!rows || rows.length === 0) return { data: null, error: { message: 'Not found', code: 'PGRST116' } };
          return { data: rows[0], error: null };
        },

        async _fetch(method, body) {
          let q = `${_url}?select=${_select}`;
          if (_filter.length) q += '&' + _filter.join('&');
          if (_order) q += `&order=${_order}`;
          if (_limit) q += `&limit=${_limit}`;
          const res = await fetch(q, { method, headers, body: body ? JSON.stringify(body) : undefined });
          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Supabase ${method} ${table}: ${res.status} ${err}`);
          }
          return res.json();
        },

        then(resolve, reject) {
          return builder._fetch('GET').then(data => resolve({ data, error: null }), reject);
        }
      };
      return builder;
    },

    // INSERT
    async insert(table, row) {
      const url2 = `${url}/rest/v1/${table}`;
      const res  = await fetch(url2, { method: 'POST', headers, body: JSON.stringify(row) });
      if (!res.ok) throw new Error(`Supabase INSERT ${table}: ${res.status} ${await res.text()}`);
      const txt = await res.text();
      return txt ? JSON.parse(txt) : null;
    },

    // UPDATE — matchar på kolumn=värde
    async update(table, data, matchCol, matchVal) {
      const url2 = `${url}/rest/v1/${table}?${matchCol}=eq.${encodeURIComponent(matchVal)}`;
      const res  = await fetch(url2, { method: 'PATCH', headers, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(`Supabase UPDATE ${table}: ${res.status} ${await res.text()}`);
      const txt2 = await res.text();
      return txt2 ? JSON.parse(txt2) : null;
    },

    // UPSERT
    async upsert(table, row) {
      const url2 = `${url}/rest/v1/${table}`;
      const h    = { ...headers, 'Prefer': 'return=representation,resolution=merge-duplicates' };
      const res  = await fetch(url2, { method: 'POST', headers: h, body: JSON.stringify(row) });
      if (!res.ok) throw new Error(`Supabase UPSERT ${table}: ${res.status} ${await res.text()}`);
      const txt3 = await res.text();
      return txt3 ? JSON.parse(txt3) : null;
    },

    // RPC (anropa Postgres-funktion)
    async rpc(fnName, params = {}) {
      const url2 = `${url}/rest/v1/rpc/${fnName}`;
      const res  = await fetch(url2, { method: 'POST', headers, body: JSON.stringify(params) });
      if (!res.ok) throw new Error(`Supabase RPC ${fnName}: ${res.status} ${await res.text()}`);
      const txt4 = await res.text();
      return txt4 ? JSON.parse(txt4) : null;
    }
  };
}

// ── Generera cart_token (32-char hex) ────────────────────────
function generateCartToken() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Verifiera admin-token ────────────────────────────────────
function isAdmin(event) {
  const auth = event.headers['authorization'] || event.headers['Authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token && token === process.env.ADMIN_TOKEN;
}

// ── CORS-headers ─────────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin':  'https://scenkonsult.se',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type':                 'application/json'
};

function ok(body, status = 200) {
  return { statusCode: status, headers: corsHeaders, body: JSON.stringify(body) };
}

function err(message, status = 400) {
  return { statusCode: status, headers: corsHeaders, body: JSON.stringify({ error: message }) };
}

function preflight() {
  return { statusCode: 204, headers: corsHeaders, body: '' };
}

// ── Audit log helper ─────────────────────────────────────────
async function logAudit(db, cartId, actor, eventType, payload = {}) {
  try {
    await db.insert('audit_log', { cart_id: cartId, actor, event_type: eventType, payload });
  } catch (e) {
    console.error('audit_log failed:', e.message);
  }
}

// ── Rate limiting (in-memory, per function instance) ─────────
const RATE_STORE = {};
function rateLimit(ip, maxPerMin = 10) {
  const now    = Date.now();
  const window = 60_000;
  if (!RATE_STORE[ip] || now - RATE_STORE[ip].ts > window) {
    RATE_STORE[ip] = { count: 1, ts: now };
    return false; // not limited
  }
  RATE_STORE[ip].count++;
  return RATE_STORE[ip].count > maxPerMin;
}

module.exports = { supabase, generateCartToken, isAdmin, corsHeaders, ok, err, preflight, logAudit, rateLimit };
