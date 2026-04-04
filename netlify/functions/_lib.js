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
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return;
    const res = await fetch(`${url}/rest/v1/audit_log`, {
      method: 'POST',
      headers: {
        'apikey':        key,
        'Authorization': `Bearer ${key}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify({
        cart_id:    cartId,
        actor:      actor,
        event_type: eventType,
        payload:    typeof payload === 'object' ? payload : {}
      })
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('AUDIT_LOG_FAIL:', res.status, txt);
    }
  } catch (e) {
    console.error('AUDIT_LOG_ERROR:', e.message);
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

// ── Mail-helpers (delade av alla mail-funktioner) ─────────────
const MAIL_FROM     = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const MAIL_LOGO_URL = 'https://scenkonsult.se/logo-white.png';
const RESEND_API    = 'https://api.resend.com/emails';

function htmlWrapper(bodyHtml) {
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${MAIL_LOGO_URL}" alt="Scenkonsult Norden" width="130" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px;">Ljud &middot; Ljus &middot; Scen &middot; DJ &mdash; Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">${bodyHtml}</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
  <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:12px;">Scenkonsult Norden &middot; Grimstagatan 164, 162 58 V&auml;llingby</p>
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">072-448 10 00 &middot; <a href="https://scenkonsult.se" style="color:#c4b5f4;text-decoration:none;">scenkonsult.se</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function sendEmail(apiKey, payload) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`Resend ${res.status}: ${e}`); }
  return res.json();
}

function buildPriceTable(cart, { showFakturaavgift = false } = {}) {
  const SVC_CATS  = ['Tjänster', 'Tillägg'];
  const allReal   = (cart || []).filter(i => !i._note && i.name);
  const prodItems = allReal.filter(i => !SVC_CATS.includes(i.category) && !(i.id && i.id.startsWith('fakturaavgift')));
  const svcItems  = allReal.filter(i => SVC_CATS.includes(i.category) && !(i.id && i.id.startsWith('fakturaavgift')));
  const feeItem   = showFakturaavgift ? allReal.find(i => i.id && i.id.startsWith('fakturaavgift')) : null;
  const noteItem  = (cart || []).find(i => i._note);
  const qty  = i => i.quantity || i.qty || 1;
  const sum  = i => (i.price || 0) * qty(i);
  const fmtN = n => n.toLocaleString('sv-SE');
  const mkRow = i => `<tr>
    <td style="padding:8px 10px;color:#222;font-size:13px;border-bottom:1px solid #f0f0f5;">${i.name}</td>
    <td style="padding:8px 10px;color:#666;font-size:13px;text-align:center;border-bottom:1px solid #f0f0f5;width:50px;">${qty(i)} st</td>
    <td style="padding:8px 10px;color:#333;font-size:13px;text-align:right;border-bottom:1px solid #f0f0f5;font-weight:600;width:90px;">${fmtN(sum(i))} kr</td>
  </tr>`;
  const subHdr = label => `<tr><td colspan="3" style="padding:6px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;background:#f7f7fb;">${label}</td></tr>`;
  const noteRow = noteItem ? `<tr><td colspan="3" style="padding:6px 10px;color:#666;font-size:12px;font-style:italic;">📝 ${noteItem.name}</td></tr>` : '';
  const grandExcl = [...prodItems, ...svcItems, ...(feeItem ? [feeItem] : [])].reduce((s, i) => s + sum(i), 0);
  const moms      = Math.round(grandExcl * 0.25);
  const grandIncl = grandExcl + moms;
  let html = `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e8;border-radius:8px;overflow:hidden;margin-top:8px;font-family:Arial,sans-serif;">
  <tr style="background:#f7f7fb;">
    <th style="padding:8px 10px;color:#888;font-size:11px;text-align:left;font-weight:600;text-transform:uppercase;">Produkt / Tjänst</th>
    <th style="padding:8px 10px;color:#888;font-size:11px;text-align:center;font-weight:600;text-transform:uppercase;width:50px;">Antal</th>
    <th style="padding:8px 10px;color:#888;font-size:11px;text-align:right;font-weight:600;text-transform:uppercase;width:90px;">Pris exkl.</th>
  </tr>`;
  if (prodItems.length) { html += subHdr('Utrustning') + prodItems.map(mkRow).join('') + noteRow; }
  if (svcItems.length)  { html += subHdr('Tilläggstjänster') + svcItems.map(mkRow).join(''); }
  if (feeItem)           { html += subHdr('Fakturaavgift') + mkRow(feeItem); }
  html += `<tr style="background:#f7f7fb;">
    <td colspan="2" style="padding:8px 10px;color:#555;font-size:12px;border-top:1px solid #e0e0e8;">Summa exkl. moms</td>
    <td style="padding:8px 10px;text-align:right;color:#444;font-size:12px;border-top:1px solid #e0e0e8;">${fmtN(grandExcl)} kr</td>
  </tr>
  <tr style="background:#f7f7fb;">
    <td colspan="2" style="padding:6px 10px;color:#888;font-size:12px;">Moms 25%</td>
    <td style="padding:6px 10px;text-align:right;color:#888;font-size:12px;">${fmtN(moms)} kr</td>
  </tr>
  <tr style="background:#1e1850;">
    <td colspan="2" style="padding:12px 10px;color:#fff;font-weight:700;font-size:15px;">TOTALT inkl. moms</td>
    <td style="padding:12px 10px;text-align:right;color:#c4b5f4;font-weight:700;font-size:15px;">${fmtN(grandIncl)} kr</td>
  </tr></table>`;
  return html;
}

module.exports = Object.assign(module.exports, {
  htmlWrapper, sendEmail, buildPriceTable,
  MAIL_FROM, MAIL_LOGO_URL,
});
