// netlify/functions/health.js
// Diagnostik-endpoint: GET /.netlify/functions/health
// Öppen (ingen auth) så den fungerar ÄVEN om ADMIN_TOKEN saknas/är fel.
// Läcker ALDRIG några nyckelvärden — rapporterar bara om env-vars finns (bool)
// samt om Supabase svarar (status + svarstid). Använd för att snabbt avgöra
// om admin-panelens "snurrar tyst" beror på Supabase eller på en env-var.

'use strict';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

// fetch med hård timeout — en hängande Supabase-förbindelse ska bli ett
// snabbt, tydligt fel i stället för att blockera tills plattformen dödar oss.
async function fetchWithTimeout(url, opts = {}, ms = 6000) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(tid);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };

  // Vilka env-vars är satta? (endast true/false — aldrig värdet)
  const env = {
    SUPABASE_URL:         !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    ADMIN_TOKEN:          !!process.env.ADMIN_TOKEN,
    RESEND_API_KEY:       !!process.env.RESEND_API_KEY,
    ANTHROPIC_API_KEY:    !!process.env.ANTHROPIC_API_KEY,
  };

  // Supabase-reachability: minimalt anrop (en rad) med kort timeout.
  const supabase = { reachable: false, status: null, ms: null, error: null };
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    supabase.error = 'SUPABASE_URL eller SUPABASE_SERVICE_KEY saknas';
  } else {
    const t0 = Date.now();
    try {
      const res = await fetchWithTimeout(
        `${url}/rest/v1/carts?select=id&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } },
        6000
      );
      supabase.ms = Date.now() - t0;
      supabase.status = res.status;
      supabase.reachable = res.ok;
      if (!res.ok) {
        // Läs en kort bit av felkroppen för kontext (t.ex. RLS/nyckel-fel)
        supabase.error = (await res.text()).slice(0, 300) || `HTTP ${res.status}`;
      }
    } catch (e) {
      supabase.ms = Date.now() - t0;
      supabase.error = e.name === 'AbortError'
        ? 'Timeout (6s) — Supabase svarade inte (pausat projekt eller nätverksfel?)'
        : (e.message || 'Okänt fel');
    }
    console.log('HEALTH:', JSON.stringify({ env, supabase }));
  }

  // ── admin-carts-sond ──────────────────────────────────────────
  // Kör EXAKT samma stora SELECT som admin-carts, men med limit=0 så inga
  // kundrader (PII) returneras. Syftet: om en kolumn saknas i tabellen svarar
  // PostgREST 400 och namnger kolumnen i felkroppen — då ser vi direkt vad
  // som blockerar admins varukorgsladdning.
  const ADMIN_CARTS_SELECT = 'id,status,items,customer_name,customer_company,customer_type,customer_orgnr,customer_ref,customer_invoice_address,invoice_email,use_invoice_email,wants_peppol,peppol_id,customer_email,customer_phone,event_date,return_date,delivery_time,return_time,event_location,total_excl,expires_at,confirmed_at,last_read_customer,last_read_admin,invoice_number,invoice_sent_at,invoice_paid_at,invoice_due_date,bounce_status,bounce_at,bounce_reason,last_quote_message_id,pickup_signed_at,pickup_confirmed_at,admin_reminder_sent_at,admin_reminder_dismissed_until,source,sven_session_id,sven_forward_type,created_at,updated_at';
  const carts_query = { ok: false, status: null, error: null };
  if (url && key) {
    try {
      const res = await fetchWithTimeout(
        `${url}/rest/v1/carts?select=${ADMIN_CARTS_SELECT}&limit=0`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } },
        6000
      );
      carts_query.status = res.status;
      carts_query.ok = res.ok;
      if (!res.ok) carts_query.error = (await res.text()).slice(0, 400) || `HTTP ${res.status}`;
    } catch (e) {
      carts_query.error = e.name === 'AbortError' ? 'Timeout (6s)' : (e.message || 'Okänt fel');
    }
    console.log('HEALTH_CARTS_QUERY:', JSON.stringify(carts_query));
  }

  const healthy = env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY && supabase.reachable && carts_query.ok;

  return {
    statusCode: healthy ? 200 : 503,
    headers: corsHeaders,
    body: JSON.stringify({ ok: healthy, time: new Date().toISOString(), env, supabase, carts_query }, null, 2),
  };
};
