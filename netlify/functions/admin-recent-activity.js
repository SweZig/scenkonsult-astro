// netlify/functions/admin-recent-activity.js
// Returnerar senaste aktivitet (meddelanden + audit-händelser) över alla kort
// för "🕒 Aktivitet"-drawern i admin. Gör det enkelt att hitta tillbaka till
// en konversation eller se vad som hänt nyligen.
//
// GET /.netlify/functions/admin-recent-activity?limit=80&type=all|messages|events|unread
// Returnerar: { items: [{ kind, id, cart_id, sender|actor, body|event_type,
//                          created_at, read_at?, payload?, customer_name, ... }, ...] }
// Sortering: created_at DESC. Max 200 rader.
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const { limit, type } = event.queryStringParameters || {};
  const lim    = Math.max(1, Math.min(200, parseInt(limit, 10) || 80));
  const filter = (type || 'all').toLowerCase();

  const db = supabase();
  try {
    const wantMessages = ['all','messages','unread'].includes(filter);
    const wantEvents   = ['all','events'].includes(filter);

    const tasks = [];

    if (wantMessages) {
      // För 'unread': bara customer-meddelanden där admin ej läst
      let q = db.from('messages')
        .select('id, cart_id, sender, body, created_at, read_at')
        .order('created_at', { ascending: false })
        .limit(lim);
      if (filter === 'unread') {
        q = q.eq('sender', 'customer').is('read_at', null);
      }
      tasks.push(q.then(r => ({ kind: 'messages', data: r.data || [], error: r.error })));
    }

    if (wantEvents) {
      tasks.push(
        db.from('audit_log')
          .select('id, cart_id, actor, event_type, payload, created_at')
          .order('created_at', { ascending: false })
          .limit(lim)
          .then(r => ({ kind: 'audit', data: r.data || [], error: r.error }))
      );
    }

    const results = await Promise.all(tasks);
    for (const r of results) {
      if (r.error) {
        console.error('RECENT_ACTIVITY', r.kind, 'error:', r.error.message);
      }
    }

    // Slå ihop till ett enhetligt item-format
    const items = [];
    for (const r of results) {
      if (r.kind === 'messages') {
        for (const m of r.data) {
          items.push({
            kind: 'message',
            id: m.id,
            cart_id: m.cart_id,
            sender: m.sender,
            body: m.body,
            created_at: m.created_at,
            read_at: m.read_at,
          });
        }
      } else if (r.kind === 'audit') {
        for (const a of r.data) {
          items.push({
            kind: 'event',
            id: a.id,
            cart_id: a.cart_id,
            actor: a.actor,
            event_type: a.event_type,
            payload: a.payload,
            created_at: a.created_at,
          });
        }
      }
    }

    // Sortera ihop på created_at DESC och toppa till lim
    items.sort((x, y) => (new Date(y.created_at)).getTime() - (new Date(x.created_at)).getTime());
    const top = items.slice(0, lim);

    // Berika med kunddata (en query för alla cart_ids)
    const cartIds = [...new Set(top.map(i => i.cart_id))].filter(Boolean);
    let cartsById = {};
    if (cartIds.length) {
      const { data: carts } = await db.from('carts')
        .select('id, customer_name, customer_company, status')
        .in('id', cartIds);
      for (const c of (carts || [])) cartsById[c.id] = c;
    }

    const enriched = top.map(i => {
      const c = cartsById[i.cart_id] || {};
      return {
        ...i,
        customer_name:    c.customer_name    || null,
        customer_company: c.customer_company || null,
        cart_status:      c.status           || null,
      };
    });

    return ok({ items: enriched });
  } catch (e) {
    console.error('RECENT_ACTIVITY error:', e.message);
    return err('Serverfel', 500);
  }
};
