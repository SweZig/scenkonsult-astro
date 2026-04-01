// netlify/functions/cart-update.js
// Uppdaterar varukorg — kund kan uppdatera items/notes, admin kan allt
// POST /.netlify/functions/cart-update
// Body (kund):  { token, items?, notes_customer? }
// Body (admin): { cart_id, items?, notes_admin?, event_date?, event_location?, status?, total_excl? }

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, rateLimit } = require('./_lib');

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const LOGO_URL   = 'https://scenkonsult.se/logo-white.png';

function mailWrapper(bodyHtml) {
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="130" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px;">Ljud &middot; Ljus &middot; Scen &middot; DJ &mdash; Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">${bodyHtml}</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">Scenkonsult Norden &middot; Grimstagatan 164, 162 58 V&auml;llingby &middot; 072-448 10 00</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function sendConfirmationEmail(cart) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !cart.customer_email) return;

  const items    = (cart.items || []).filter(i => !i._note);
  const noteItem = (cart.items || []).find(i => i._note);
  const total    = items.reduce((s, i) => s + (i.price||0)*(i.qty||i.quantity||1), 0);
  const cartUrl  = cart.cart_token
    ? `https://scenkonsult.se/order/?cart=${cart.id}&token=${cart.cart_token}`
    : null;

  const rowsHtml = items.map(i => {
    const qty = i.qty || i.quantity || 1;
    return `<tr>
      <td style="padding:9px 10px;color:#222;font-size:14px;border-bottom:1px solid #f0f0f5;">${i.name||''}</td>
      <td style="padding:9px 10px;color:#666;font-size:14px;text-align:center;border-bottom:1px solid #f0f0f5;">${qty} st</td>
      <td style="padding:9px 10px;color:#4a3faa;font-size:14px;text-align:right;border-bottom:1px solid #f0f0f5;font-weight:600;">${((i.price||0)*qty).toLocaleString('sv-SE')} kr</td>
    </tr>`;
  }).join('');

  const noteRow = noteItem
    ? `<tr><td colspan="3" style="padding:8px 10px;color:#666;font-size:12px;font-style:italic;">📝 ${noteItem.name}</td></tr>`
    : '';

  const tableHtml = `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e8;border-radius:8px;overflow:hidden;margin:16px 0;">
    <tr style="background:#f7f7fb;">
      <th style="padding:9px 10px;color:#888;font-size:12px;text-align:left;font-weight:600;text-transform:uppercase;">Produkt</th>
      <th style="padding:9px 10px;color:#888;font-size:12px;text-align:center;font-weight:600;text-transform:uppercase;">Antal</th>
      <th style="padding:9px 10px;color:#888;font-size:12px;text-align:right;font-weight:600;text-transform:uppercase;">Pris exkl. moms</th>
    </tr>${rowsHtml}${noteRow}
    <tr style="background:#f0eeff;">
      <td colspan="2" style="padding:11px 10px;color:#1e1850;font-weight:700;font-size:15px;">Totalt (exkl. moms)</td>
      <td style="padding:11px 10px;color:#4a3faa;font-weight:700;font-size:15px;text-align:right;">${total.toLocaleString('sv-SE')} kr</td>
    </tr>
  </table>`;

  const dateStr     = cart.event_date ? `<p style="color:#555;font-size:14px;margin:8px 0;">📅 Eventdatum: <strong>${cart.event_date}</strong></p>` : '';
  const locationStr = cart.event_location ? `<p style="color:#555;font-size:14px;margin:8px 0;">📍 Plats: <strong>${cart.event_location}</strong></p>` : '';

  const html = mailWrapper(`
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:2rem;">✅</span>
      <div>
        <div style="color:#166534;font-weight:700;font-size:16px;">Din order är bekräftad!</div>
        <div style="color:#166534;font-size:13px;">Orderreferens: ${cart.id}</div>
      </div>
    </div>
    <h2 style="color:#1e1850;margin:0 0 8px;font-size:20px;">Tack, ${cart.customer_name || 'kunden'}!</h2>
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">Vi bekräftar härmed din order. Vi ses på eventet! Frågor? Ring oss på <a href="tel:0724481000" style="color:#4a3faa;">072-448 10 00</a> eller svara på detta mail.</p>
    ${dateStr}${locationStr}
    <p style="margin:20px 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Din beställning</p>
    ${tableHtml}
    ${cartUrl ? `<p style="margin:24px 0 0;"><a href="${cartUrl}" style="background:#332885;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">Se din orderbekräftelse →</a></p>
    <p style="margin:10px 0 0;color:#888;font-size:12px;">Via länken kan du se alla detaljer och chatta med oss.</p>` : ''}
  `);

  const plain = `Din order är bekräftad!\n\nTack, ${cart.customer_name||''}!\n\nOrderreferens: ${cart.id}\n${cart.event_date?'Datum: '+cart.event_date+'\n':''}${cart.event_location?'Plats: '+cart.event_location+'\n':''}\nDin beställning:\n${items.map(i=>`${i.name} x${i.qty||1} — ${((i.price||0)*(i.qty||1)).toLocaleString('sv-SE')} kr`).join('\n')}\nTotalt: ${total.toLocaleString('sv-SE')} kr (exkl. moms)\n${cartUrl?'\nOrderbekräftelse: '+cartUrl:''}\n\nFrågor? Ring 072-448 10 00\n---\nScenkonsult Norden`;

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:     FROM,
      to:       [cart.customer_email],
      reply_to: 'info@scenkonsult.se',
      subject:  `Orderbekräftelse — ${cart.id}`,
      html,
      text: plain,
    })
  });
  if (!res.ok) console.error('CONFIRMATION_MAIL_ERROR:', await res.text());
  else console.log('CONFIRMATION_MAIL_SENT to:', cart.customer_email);
}

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
        const ALLOWED = ['open', 'proposal', 'waiting', 'confirmed', 'cancelled', 'fakturerad', 'betald'];
        if (!ALLOWED.includes(body.status)) return err('Ogiltig status', 400);

        const oldStatus = cart.status;
        updates.status = body.status;

        if (body.status === 'confirmed') {
          updates.confirmed_at = new Date().toISOString();
          updates.expires_at   = null; // Bekräftad — ingen TTL
          // Skicka bekräftelsemail till kund efter DB-uppdatering (görs nedan)
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

    // Skicka orderbekräftelsemail om status just satte till confirmed
    if (admin && body.status === 'confirmed') {
      const updatedCart = { ...cart, ...updates };
      await sendConfirmationEmail(updatedCart).catch(e =>
        console.error('CONFIRMATION_MAIL_FAILED:', e.message)
      );
    }

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
