// netlify/functions/cart-get.js
// Hämtar en varukorg via cart_token (kund-URL) eller cart ID + admin-token
// GET /.netlify/functions/cart-get?token=<cart_token>
// GET /.netlify/functions/cart-get?id=<cart_id>  (admin only)

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, rateLimit } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);

  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rateLimit(ip, 30)) return err('För många förfrågningar', 429);

  const { token, id } = event.queryStringParameters || {};

  const db = supabase();

  try {
    // ── Admin: hämta med ID (kräver admin-token, INTE cart_token) ─────
    if (id && !token) {
      if (!isAdmin(event)) return err('Ej behörig', 401);
      const { data: cart, error } = await db.from('carts').select('*').eq('id', id).single();
      if (error || !cart) return err('Varukorg hittades ej', 404);

      // Hämta meddelanden
      const { data: messages } = await db.from('messages')
        .select('*').eq('cart_id', id).order('created_at', { ascending: true });

      return ok({ cart, messages: messages || [] });
    }

    // ── Kund: hämta med token ───────────────────────────────
    if (!token) return err('Token krävs', 400);

    const { data: cart, error } = await db.from('carts')
      .select('id, status, items, customer_name, customer_company, customer_email, customer_phone, customer_type, event_date, return_date, event_location, delivery_time, return_time, total_excl, expires_at, confirmed_at, last_read_customer, created_at, updated_at')
      .eq('cart_token', token)
      .single();

    if (error || !cart) return err('Varukorg hittades ej eller har gått ut', 404);

    // Kolla TTL för icke-bekräftade varukorgar
    if (cart.expires_at && new Date(cart.expires_at) < new Date()) {
      return err('Varukorgen har gått ut', 410);
    }

    // Uppdatera last_read_customer
    await db.update('carts', { last_read_admin: null }, 'cart_token', token);
    await db.update('carts', { last_read_customer: new Date().toISOString() }, 'cart_token', token);

    // Hämta meddelanden (kund ser bara sin sida)
    const { data: messages } = await db.from('messages')
      .select('id, sender, body, read_at, created_at')
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true });

    // Markera admin-meddelanden som lästa
    const unreadAdminMsgs = (messages || []).filter(m => m.sender === 'admin' && !m.read_at);
    if (unreadAdminMsgs.length > 0) {
      const now = new Date().toISOString();
      for (const msg of unreadAdminMsgs) {
        await db.update('messages', { read_at: now }, 'id', msg.id);
      }
      await logAudit(db, cart.id, 'customer', 'messages_read', { count: unreadAdminMsgs.length });
    }

    return ok({ cart, messages: messages || [] });

  } catch (e) {
    console.error('CART_GET_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
