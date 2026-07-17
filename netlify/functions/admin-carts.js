// netlify/functions/admin-carts.js
// Hämtar alla varukorgar för adminpanelen
// GET /.netlify/functions/admin-carts
// GET /.netlify/functions/admin-carts?status=proposal
// GET /.netlify/functions/admin-carts?id=SK-XXXXXX  (en specifik)
// Kräver: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

// fetch med hård timeout — utan detta hänger en trög/pausad Supabase tills
// plattformen dödar funktionen, vilket i frontenden syns som en tyst
// evighetssnurr. Med timeout kastas i stället ett fel som loggas nedan.
async function fetchWithTimeout(url, opts = {}, ms = 8000) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error(`Supabase timeout efter ${ms}ms`);
    throw e;
  } finally {
    clearTimeout(tid);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const db = supabase();
  const { status, id, from_date, to_date } = event.queryStringParameters || {};

  try {
    // ── En specifik varukorg med meddelanden ─────────────────
    if (id) {
      const { data: cart, error } = await db.from('carts').select('*').eq('id', id).single();
      if (error || !cart) return err('Varukorg hittades ej', 404);

      const { data: messages } = await db.from('messages')
        .select('*').eq('cart_id', id).order('created_at', { ascending: true });

      const { data: auditLog } = await db.from('audit_log')
        .select('*').eq('cart_id', id).order('created_at', { ascending: false }).limit(50);

      return ok({ cart, messages: messages || [], audit_log: auditLog || [] });
    }

    // ── Lista med varukorgar ──────────────────────────────────
    // Bygg URL manuellt eftersom vi behöver komplexa filter
    const supaUrl  = process.env.SUPABASE_URL;
    const supaKey  = process.env.SUPABASE_SERVICE_KEY;
    const headers  = {
      'apikey': supaKey,
      'Authorization': `Bearer ${supaKey}`,
      'Content-Type': 'application/json'
    };

    // ── LAZY AUTO-PROMOTION: fakturerad + betald + event passerat → completed ─
    // Körs vid varje admin-laddning. Atomisk PATCH som filtrerar i query — uppdaterar
    // bara rader som matchar (oftast 0 vid varje laddning, så billig operation).
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const cutoff = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD
      await fetchWithTimeout(
        `${supaUrl}/rest/v1/carts?status=eq.fakturerad&event_date=lt.${cutoff}&invoice_paid_at=not.is.null`,
        {
          method: 'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ status: 'completed' })
        }
      );
    } catch (autoPromoteErr) {
      console.warn('AUTO_PROMOTE_WARN:', autoPromoteErr.message);
      // Icke-fatal — fortsätt ladda carts
    }

    // Hämta varukorgar
    // Hämta alla varukorgar — service key bypasser RLS, inga radfilter behövs
    let q = `${supaUrl}/rest/v1/carts?select=id,status,items,customer_name,customer_company,customer_type,customer_orgnr,customer_ref,customer_invoice_address,invoice_email,use_invoice_email,wants_peppol,peppol_id,customer_email,customer_phone,event_date,return_date,delivery_time,return_time,event_location,total_excl,expires_at,confirmed_at,last_read_customer,last_read_admin,invoice_number,invoice_sent_at,invoice_paid_at,invoice_due_date,bounce_status,bounce_at,bounce_reason,last_quote_message_id,pickup_signed_at,pickup_confirmed_at,admin_reminder_sent_at,admin_reminder_dismissed_until,source,sven_session_id,sven_forward_type,created_at,updated_at&id=not.like.SK-RESERVE-*&order=updated_at.desc`;
    if (status) q += `&status=eq.${status}`;
    if (from_date) q += `&event_date=gte.${from_date}`;
    if (to_date)   q += `&event_date=lte.${to_date}`;

    const cartsRes = await fetchWithTimeout(q, { headers });
    if (!cartsRes.ok) throw new Error(`Supabase carts: HTTP ${cartsRes.status} ${(await cartsRes.text()).slice(0, 200)}`);
    const carts = await cartsRes.json();

    // Hämta oläst-antal per varukorg (admin perspektiv = olästa kundmeddelanden)
    const unreadRes = await fetchWithTimeout(
      `${supaUrl}/rest/v1/messages?select=cart_id&sender=eq.customer&read_at=is.null`,
      { headers }
    );
    const unreadMsgs = unreadRes.ok ? await unreadRes.json() : [];

    // Räkna olästa per cart_id
    const unreadCount = {};
    for (const m of unreadMsgs) {
      unreadCount[m.cart_id] = (unreadCount[m.cart_id] || 0) + 1;
    }

    // Berika varukorgar med unread_count
    const enriched = carts.map(c => ({
      ...c,
      unread_count: unreadCount[c.id] || 0
    }));

    // Sammanfattning per status
    const summary = {
      new:       enriched.filter(c => c.status === 'new').length,
      waiting:   enriched.filter(c => c.status === 'waiting').length,
      confirmed: enriched.filter(c => c.status === 'confirmed').length,
      fakturerad:enriched.filter(c => c.status === 'fakturerad').length,
      completed: enriched.filter(c => c.status === 'completed').length,
      cancelled: enriched.filter(c => c.status === 'cancelled').length,
      total_unread: Object.values(unreadCount).reduce((a, b) => a + b, 0)
    };

    return ok({ carts: enriched, summary });

  } catch (e) {
    const envMissing = !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY;
    console.error('ADMIN_CARTS_ERROR:', e.name, e.message, envMissing ? '(SUPABASE env-var saknas!)' : '');
    return err(envMissing ? 'Serverkonfiguration saknas (Supabase env-var)' : 'Serverfel — Supabase svarar inte', 500);
  }
};
