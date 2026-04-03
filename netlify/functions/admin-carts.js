// netlify/functions/admin-carts.js
// Hämtar alla varukorgar för adminpanelen
// GET /.netlify/functions/admin-carts
// GET /.netlify/functions/admin-carts?status=proposal
// GET /.netlify/functions/admin-carts?id=SK-XXXXXX  (en specifik)
// Kräver: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

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

    // Hämta varukorgar
    // Hämta alla varukorgar — service key bypasser RLS, inga radfilter behövs
    let q = `${supaUrl}/rest/v1/carts?select=id,status,customer_name,customer_email,event_date,event_location,total_excl,expires_at,confirmed_at,last_read_customer,last_read_admin,created_at,updated_at&order=updated_at.desc`;
    if (status) q += `&status=eq.${status}`;
    if (from_date) q += `&event_date=gte.${from_date}`;
    if (to_date)   q += `&event_date=lte.${to_date}`;

    const cartsRes = await fetch(q, { headers });
    if (!cartsRes.ok) throw new Error(`Supabase: ${cartsRes.status}`);
    const carts = await cartsRes.json();

    // Hämta oläst-antal per varukorg (admin perspektiv = olästa kundmeddelanden)
    const unreadRes = await fetch(
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
      open:      enriched.filter(c => c.status === 'open').length,
      waiting:   enriched.filter(c => c.status === 'waiting').length,
      confirmed: enriched.filter(c => c.status === 'confirmed').length,
      cancelled: enriched.filter(c => c.status === 'cancelled').length,
      total_unread: Object.values(unreadCount).reduce((a, b) => a + b, 0)
    };

    return ok({ carts: enriched, summary });

  } catch (e) {
    console.error('ADMIN_CARTS_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
