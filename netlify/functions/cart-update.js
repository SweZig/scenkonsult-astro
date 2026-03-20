// netlify/functions/cart-update.js
// Uppdaterar varukorg — kund kan uppdatera items/notes, admin kan allt
// POST /.netlify/functions/cart-update
// Body (kund):  { token, items?, notes_customer? }
// Body (admin): { cart_id, items?, notes_admin?, event_date?, event_location?, status?, total_excl? }

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, rateLimit } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rateLimit(ip, 15)) return err('För många förfrågningar', 429);

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return err('Ogiltig JSON', 400); }

  const admin = isAdmin(event);
  const db = supabase();

  try {
    let cart;

    if (admin) {
      if (!body.cart_id) return err('cart_id krävs', 400);
      const { data, error } = await db.from('carts').select('*').eq('id', body.cart_id).single();
      if (error || !data) return err('Varukorg hittades ej', 404);
      cart = data;
    } else {
      if (!body.token) return err('Token krävs', 400);
      const { data, error } = await db.from('carts').select('*').eq('cart_token', body.token).single();
      if (error || !data) return err('Varukorg hittades ej', 404);
      if (data.expires_at && new Date(data.expires_at) < new Date()) return err('Varukorgen har gått ut', 410);
      cart = data;
    }

    // ── Bygg uppdateringsobjekt ───────────────────────────────
    const updates = {};

    if (body.items !== undefined) {
      if (!Array.isArray(body.items)) return err('items måste vara en array', 400);
      updates.items = body.items;
      // Beräkna totalt om kund uppdaterar (admin anger explicit)
      if (!admin) {
        updates.total_excl = body.items.reduce((sum, i) => sum + ((i.price || 0) * (i.qty || 1)), 0) * 100;
      }
    }

    if (admin) {
      if (body.notes_admin    !== undefined) updates.notes_admin    = body.notes_admin;
      if (body.event_date     !== undefined) updates.event_date     = body.event_date || null;
      if (body.event_location !== undefined) updates.event_location = body.event_location;
      if (body.total_excl     !== undefined) updates.total_excl     = body.total_excl;
      if (body.customer_name  !== undefined) updates.customer_name  = body.customer_name;
      if (body.customer_email !== undefined) updates.customer_email = body.customer_email;
      if (body.customer_phone !== undefined) updates.customer_phone = body.customer_phone;

      // Statusändring
      if (body.status !== undefined) {
        const ALLOWED = ['open', 'proposal', 'waiting', 'confirmed', 'cancelled'];
        if (!ALLOWED.includes(body.status)) return err('Ogiltig status', 400);

        const oldStatus = cart.status;
        updates.status = body.status;

        if (body.status === 'confirmed') {
          updates.confirmed_at = new Date().toISOString();
          updates.expires_at   = null; // Bekräftad — ingen TTL
        }

        await logAudit(db, cart.id, 'admin', 'status_change', {
          from: oldStatus,
          to:   body.status
        });
      }
    } else {
      // Kund kan bara uppdatera sin anteckning
      if (body.notes_customer !== undefined) updates.customer_message = body.notes_customer;
    }

    if (Object.keys(updates).length === 0) return err('Inga giltiga fält att uppdatera', 400);

    // Uppdatera
    const matchCol = admin ? 'id' : 'cart_token';
    const matchVal = admin ? body.cart_id : body.token;
    await db.update('carts', updates, matchCol, matchVal);

    // Förläng TTL (om ej bekräftad/avbruten)
    await db.rpc('extend_cart_ttl', { cart_id: cart.id });

    // Audit
    await logAudit(db, cart.id, admin ? 'admin' : 'customer', 'cart_updated', {
      fields: Object.keys(updates)
    });

    return ok({ success: true, cart_id: cart.id });

  } catch (e) {
    console.error('CART_UPDATE_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
