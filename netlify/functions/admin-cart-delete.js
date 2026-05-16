// netlify/functions/admin-cart-delete.js
// Permanent radering av en avbruten order (cancelled) inkl. tillhörande
// meddelanden och audit-loggar. Quick-fix tills automatisk TTL-rensning
// implementeras.
//
// Säkerhetslager:
//   1. Admin-token krävs (Bearer ADMIN_TOKEN)
//   2. status MÅSTE vara 'cancelled' — andra statusar nekas
//   3. Radering loggas till konsolen (Netlify Functions log) innan den
//      genomförs så det finns en spårbarhetstråd även efter att raden är borta
//
// POST /.netlify/functions/admin-cart-delete
// Body: { cart_id }

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return err('Ogiltig JSON', 400);
  }

  const cartId = body.cart_id;
  if (!cartId || typeof cartId !== 'string') return err('cart_id krävs', 400);
  // Skydd mot att råka radera reservation-rader för fakturanummer
  if (cartId.startsWith('SK-RESERVE-')) return err('Kan inte radera reservation-rader', 403);

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supaUrl || !supaKey) {
    console.error('CART_DELETE: Supabase env-vars saknas');
    return err('Serverkonfiguration saknas', 500);
  }
  const h = {
    'apikey': supaKey,
    'Authorization': `Bearer ${supaKey}`,
    'Content-Type': 'application/json',
  };

  // Steg 1: Verifiera att carten finns OCH att den är cancelled
  let cart;
  try {
    const res = await fetch(
      `${supaUrl}/rest/v1/carts?id=eq.${encodeURIComponent(cartId)}&select=id,status,customer_name,customer_email`,
      { headers: h }
    );
    if (!res.ok) throw new Error(`SELECT ${res.status}`);
    const rows = await res.json();
    if (!rows.length) return err('Varukorg hittades ej', 404);
    cart = rows[0];
  } catch (e) {
    console.error('CART_DELETE_LOOKUP_ERR:', e.message);
    return err('Kunde inte slå upp varukorg', 500);
  }

  if (cart.status !== 'cancelled') {
    return err(`Endast avbrutna ordrar kan raderas (denna är "${cart.status}")`, 403);
  }

  // Logga FÖRE radering så det finns spår i Netlify-loggen även efteråt
  console.log('CART_DELETE_REQUEST:', JSON.stringify({
    cart_id: cartId,
    customer_name: cart.customer_name || '–',
    customer_email: cart.customer_email || '–',
    at: new Date().toISOString(),
  }));

  // Steg 2: Radera relaterade rader FÖRST (om FK CASCADE inte är konfigurerat
  // raderar PostgREST inte automatiskt). Ordning: messages → audit_log → carts.
  const delRel = async (table) => {
    const res = await fetch(
      `${supaUrl}/rest/v1/${table}?cart_id=eq.${encodeURIComponent(cartId)}`,
      { method: 'DELETE', headers: { ...h, 'Prefer': 'return=minimal' } }
    );
    if (!res.ok) {
      const txt = await res.text();
      // 404 / "no rows" är OK — finns inget att radera
      if (res.status === 404 || /no rows/i.test(txt)) return 0;
      throw new Error(`DELETE ${table}: ${res.status} ${txt}`);
    }
    return 1;
  };

  try {
    await delRel('messages');
    await delRel('audit_log');

    // Steg 3: Radera själva carten
    const res = await fetch(
      `${supaUrl}/rest/v1/carts?id=eq.${encodeURIComponent(cartId)}`,
      { method: 'DELETE', headers: { ...h, 'Prefer': 'return=minimal' } }
    );
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`DELETE carts: ${res.status} ${txt}`);
    }

    console.log('CART_DELETE_OK:', cartId);
    return ok({ ok: true, deleted: cartId });
  } catch (e) {
    console.error('CART_DELETE_ERR:', cartId, e.message);
    return err('Kunde inte radera: ' + e.message, 500);
  }
};
