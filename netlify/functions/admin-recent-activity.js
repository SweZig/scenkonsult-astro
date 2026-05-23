// netlify/functions/admin-recent-activity.js
// Returnerar senaste meddelanden över alla kort — för "🕒 Aktivitet"-vyn i admin.
// Gör det enkelt att hitta tillbaka till en konversation man läst på mobilen.
//
// GET /.netlify/functions/admin-recent-activity?limit=50
// Returnerar: { messages: [{ id, cart_id, sender, body, created_at, read_at,
//                            customer_name, customer_company, cart_status }, ...] }
// Sorterat på created_at DESC. Max 100 rader.
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const { limit } = event.queryStringParameters || {};
  const lim = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));

  const db = supabase();
  try {
    // Hämta senaste meddelanden
    const { data: messages, error: msgErr } = await db.from('messages')
      .select('id, cart_id, sender, body, created_at, read_at')
      .order('created_at', { ascending: false })
      .limit(lim);
    if (msgErr) {
      console.error('RECENT_ACTIVITY messages:', msgErr.message);
      return err('Kunde inte hämta meddelanden', 500);
    }

    // Berika med kunddata (en query för alla cart_ids)
    const cartIds = [...new Set((messages || []).map(m => m.cart_id))].filter(Boolean);
    let cartsById = {};
    if (cartIds.length) {
      const { data: carts } = await db.from('carts')
        .select('id, customer_name, customer_company, status')
        .in('id', cartIds);
      for (const c of (carts || [])) cartsById[c.id] = c;
    }

    const enriched = (messages || []).map(m => {
      const c = cartsById[m.cart_id] || {};
      return {
        id: m.id,
        cart_id: m.cart_id,
        sender: m.sender,
        body: m.body,
        created_at: m.created_at,
        read_at: m.read_at,
        customer_name: c.customer_name || null,
        customer_company: c.customer_company || null,
        cart_status: c.status || null,
      };
    });

    return ok({ messages: enriched });
  } catch (e) {
    console.error('RECENT_ACTIVITY error:', e.message);
    return err('Serverfel', 500);
  }
};
