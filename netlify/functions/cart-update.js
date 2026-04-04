// netlify/functions/cart-update.js
// Uppdaterar varukorg — kund kan uppdatera items/notes, admin kan allt
// POST /.netlify/functions/cart-update
// Body (kund):  { token, items?, notes_customer? }
// Body (admin): { cart_id, items?, notes_admin?, event_date?, event_location?, status?, total_excl? }

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, rateLimit } = require('./_lib');

// ── Gemensam prisvisningsfunktion (samma layout i alla mail) ──────────────────
function buildPriceTable(cart, { showFakturaavgift = false } = {}) {
  const SVC_CATS = ['Tjänster', 'Tillägg'];
  const allReal  = (cart || []).filter(i => !i._note && i.name);
  const prodItems = allReal.filter(i => !SVC_CATS.includes(i.category) && !(i.id && i.id.startsWith('fakturaavgift')));
  const svcItems  = allReal.filter(i => SVC_CATS.includes(i.category) && !(i.id && i.id.startsWith('fakturaavgift')));
  const feeItem   = showFakturaavgift ? allReal.find(i => i.id && i.id.startsWith('fakturaavgift')) : null;
  const noteItem  = (cart || []).find(i => i._note);
  const qty  = i => i.quantity || i.qty || 1;
  const sum  = i => (i.price || 0) * qty(i);
  const fmtN = n => n.toLocaleString('sv-SE');
  const mkRow = i => `<tr><td style="padding:8px 10px;color:#222;font-size:13px;border-bottom:1px solid #f0f0f5;">${i.name}</td><td style="padding:8px 10px;color:#666;font-size:13px;text-align:center;border-bottom:1px solid #f0f0f5;width:50px;">${qty(i)} st</td><td style="padding:8px 10px;color:#333;font-size:13px;text-align:right;border-bottom:1px solid #f0f0f5;font-weight:600;width:90px;">${fmtN(sum(i))} kr</td></tr>`;
  const prodTotal = prodItems.reduce((s, i) => s + sum(i), 0);
  const svcTotal  = svcItems.reduce((s, i) => s + sum(i), 0);
  const feeTotal  = feeItem ? sum(feeItem) : 0;
  const grandExcl = prodTotal + svcTotal + feeTotal;
  const moms      = Math.round(grandExcl * 0.25);
  const grandIncl = grandExcl + moms;
  const noteRow = noteItem ? `<tr><td colspan="3" style="padding:6px 10px;color:#666;font-size:12px;font-style:italic;">📝 ${noteItem.name}</td></tr>` : '';
  const subHdr = label => `<tr><td colspan="3" style="padding:6px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;background:#f7f7fb;">${label}</td></tr>`;
  const subTotal = (label, amount, bg, color) => `<tr style="background:${bg};"><td colspan="2" style="padding:9px 10px;font-weight:700;font-size:13px;color:${color};">${label}</td><td style="padding:9px 10px;font-weight:700;font-size:13px;text-align:right;color:${color};">${fmtN(amount)} kr</td></tr>`;
  let html = `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e8;border-radius:8px;overflow:hidden;margin-top:8px;font-family:Arial,sans-serif;"><tr style="background:#f7f7fb;"><th style="padding:8px 10px;color:#888;font-size:11px;text-align:left;font-weight:600;text-transform:uppercase;">Produkt / Tjänst</th><th style="padding:8px 10px;color:#888;font-size:11px;text-align:center;font-weight:600;text-transform:uppercase;width:50px;">Antal</th><th style="padding:8px 10px;color:#888;font-size:11px;text-align:right;font-weight:600;text-transform:uppercase;width:90px;">Pris exkl.</th></tr>`;
  if (prodItems.length > 0) { html += subHdr('Utrustning') + prodItems.map(mkRow).join('') + noteRow + subTotal('Utrustning exkl. moms', prodTotal, '#ddd6f5', '#1e1850'); }
  if (svcItems.length > 0)  { html += subHdr('Tilläggstjänster') + svcItems.map(mkRow).join('') + subTotal('Tjänster exkl. moms' + (showFakturaavgift ? '' : ' (estimat)'), svcTotal, '#fff8ec', '#92400e'); }
  if (feeItem)               { html += subHdr('Fakturaavgift') + mkRow(feeItem); }
  html += `<tr style="background:#f0f0f0;"><td colspan="2" style="padding:7px 10px;color:#555;font-size:12px;">Moms 25%</td><td style="padding:7px 10px;text-align:right;color:#555;font-size:12px;">${fmtN(moms)} kr</td></tr><tr style="background:#1e1850;"><td colspan="2" style="padding:12px 10px;color:#fff;font-weight:700;font-size:15px;">TOTALT inkl. moms</td><td style="padding:12px 10px;text-align:right;color:#c4b5f4;font-weight:700;font-size:15px;">${fmtN(grandIncl)} kr</td></tr>`;
  if (svcItems.length > 0 && !showFakturaavgift) { html += `<tr><td colspan="3" style="padding:6px 10px;color:#b45309;font-size:11px;">⚠ Tilläggstjänsters priser är estimat och bekräftas vid orderbekräftelse.</td></tr>`; }
  html += '</table>';
  return html;
}


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

  const cartUrl = cart.cart_token
    ? `https://scenkonsult.se/order/?cart=${cart.id}&token=${cart.cart_token}`
    : null;

  // Orderbekräftelse visar fakturaavgift
  const tableHtml = buildPriceTable(cart.items, { showFakturaavgift: true });

  // Textversion: alla items inkl fakturaavgift
  const allItems = (cart.items || []).filter(i => !i._note && i.name);
  const grandExcl = allItems.reduce((s,i) => s + (i.price||0)*(i.qty||i.quantity||1), 0);
  const grandIncl = Math.round(grandExcl * 1.25);

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

  const plain = `Din order är bekräftad!\n\nTack, ${cart.customer_name||''}!\n\nOrderreferens: ${cart.id}\n${cart.event_date?'Datum: '+cart.event_date+'\n':''}${cart.event_location?'Plats: '+cart.event_location+'\n':''}\nDin beställning:\n${allItems.map(i=>`${i.name} x${i.qty||1} — ${((i.price||0)*(i.qty||1)).toLocaleString('sv-SE')} kr`).join('\n')}\nTotalt inkl. moms: ${grandIncl.toLocaleString('sv-SE')} kr\n${cartUrl?'\nOrderbekräftelse: '+cartUrl:''}\n\nFrågor? Ring 072-448 10 00\n---\nScenkonsult Norden`;

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
      if (body.notes_admin      !== undefined) updates.notes_admin      = body.notes_admin;
      if (body.event_date       !== undefined) updates.event_date       = body.event_date || null;
      if (body.event_location   !== undefined) updates.event_location   = body.event_location;
      if (body.total_excl       !== undefined) updates.total_excl       = body.total_excl;
      if (body.customer_name    !== undefined) updates.customer_name    = body.customer_name;
      if (body.customer_email   !== undefined) updates.customer_email   = body.customer_email;
      if (body.customer_phone   !== undefined) updates.customer_phone   = body.customer_phone;
      // Nya fält — kundtyp, adress, faktura
      if (body.customer_type    !== undefined) updates.customer_type    = body.customer_type;
      if (body.customer_address !== undefined) updates.customer_address = body.customer_address;
      if (body.customer_orgnr   !== undefined) updates.customer_orgnr   = body.customer_orgnr;
      if (body.customer_ref     !== undefined) updates.customer_ref     = body.customer_ref;
      if (body.invoice_date     !== undefined) updates.invoice_date     = body.invoice_date || null;
      if (body.invoice_due_date !== undefined) updates.invoice_due_date = body.invoice_due_date || null;
      if (body.invoice_number   !== undefined) updates.invoice_number   = body.invoice_number;
      if (body.invoice_sent_at  !== undefined) updates.invoice_sent_at  = body.invoice_sent_at;
      if (body.invoice_paid_at  !== undefined) updates.invoice_paid_at  = body.invoice_paid_at;
      if (body.payment_terms_days  !== undefined) updates.payment_terms_days  = parseInt(body.payment_terms_days) || 5;
      if (body.delivery_time        !== undefined) updates.delivery_time        = body.delivery_time     || '13:00';
      if (body.return_time          !== undefined) updates.return_time          = body.return_time       || '11:00';
      if (body.invoice_email        !== undefined) updates.invoice_email        = body.invoice_email     || null;
      if (body.use_invoice_email    !== undefined) updates.use_invoice_email    = !!body.use_invoice_email;
      if (body.customer_company     !== undefined) updates.customer_company     = body.customer_company  || null;

      // Statusändring
      if (body.status !== undefined) {
        const ALLOWED = ['open', 'waiting', 'confirmed', 'cancelled', 'fakturerad', 'betald'];
        if (!ALLOWED.includes(body.status)) return err('Ogiltig status', 400);

        const oldStatus = cart.status;
        updates.status = body.status;

        if (body.status === 'confirmed') {
          updates.expires_at = null; // Bekräftad — ingen TTL
          // confirmed_at sätts av kunden vid digital klick-bekräftelse, INTE här
        }

        await logAudit(db, cart.id, 'admin', 'status_change', {
          from: oldStatus,
          to:   body.status
        });
      }
    } else {
      // Kund kan uppdatera sin anteckning eller bekräfta order
      if (body.notes_customer !== undefined) updates.customer_message = body.notes_customer;

      // Klick-orderbekräftelse — kund signerar digitalt
      if (body.action === 'customer_confirm') {
        if (!['confirmed', 'waiting'].includes(cart.status)) {
          return err('Order måste vara bekräftad av admin innan kunden kan signera', 400);
        }
        if (cart.confirmed_at) {
          return err('Ordern är redan bekräftad', 409);
        }
        const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim()
                || event.headers['x-real-ip']
                || 'unknown';
        const ua = event.headers['user-agent'] || 'unknown';
        updates.confirmed_at           = new Date().toISOString();
        updates.confirmed_ip           = ip;
        updates.confirmed_user_agent   = ua;
        updates.confirmation_text      = body.confirmation_text || `Order ${cart.id} bekräftad digitalt`;
        updates.status                 = 'confirmed';

        // Skicka intern notis till info@scenkonsult.se
      const apiKey4confirm = process.env.RESEND_API_KEY;
      if (apiKey4confirm) {
        const confirmNotifHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:20px 32px;text-align:center;">
  <p style="margin:0;color:#fff;font-size:16px;font-weight:700;">Scenkonsult Norden</p>
</td></tr>
<tr><td style="background:#fff;padding:28px 32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
    <span style="font-size:1.5rem;">✅</span>
    <div style="color:#166534;font-weight:700;font-size:15px;">Kund har bekräftat order!</div>
  </div>
  <p style="color:#444;font-size:14px;margin:0 0 12px;"><strong>Kund:</strong> ${cart.customer_name||'–'}</p>
  <p style="color:#444;font-size:14px;margin:0 0 12px;"><strong>E-post:</strong> ${cart.customer_email||'–'}</p>
  <p style="color:#444;font-size:14px;margin:0 0 12px;"><strong>Order:</strong> ${cart.id}</p>
  ${cart.event_date ? `<p style="color:#444;font-size:14px;margin:0 0 12px;"><strong>Eventdatum:</strong> ${cart.event_date}</p>` : ''}
  ${cart.event_location ? `<p style="color:#444;font-size:14px;margin:0 0 12px;"><strong>Plats:</strong> ${cart.event_location}</p>` : ''}
  <p style="margin:20px 0 0;"><a href="https://scenkonsult.se/admin/" style="background:#332885;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;display:inline-block;">Gå till adminpanelen →</a></p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:14px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
        fetch(RESEND_API, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey4confirm}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: FROM, to: ['info@scenkonsult.se'],
            reply_to: cart.customer_email || 'info@scenkonsult.se',
            subject: `✅ Order bekräftad av kund — ${cart.customer_name||''} (${cart.id})`,
            html: confirmNotifHtml,
            text: `Order bekräftad av kund!\n\nKund: ${cart.customer_name||'–'}\nE-post: ${cart.customer_email||'–'}\nOrder: ${cart.id}\n${cart.event_date?'Datum: '+cart.event_date+'\n':''}\nAdminpanel: https://scenkonsult.se/admin/`,
          })
        }).catch(e => console.error('CONFIRM_NOTIF_ERROR:', e.message));
      }

      await logAudit(db, cart.id, 'customer', 'order_confirmed_by_customer', {
          ip, ua, text: updates.confirmation_text
        });
      }
    }

    if (Object.keys(updates).length === 0) return err('Inga giltiga fält att uppdatera', 400);

    // Uppdatera
    const matchCol = admin ? 'id' : 'cart_token';
    const matchVal = admin ? body.cart_id : body.token;
    await db.update('carts', updates, matchCol, matchVal);

    // Hantera expires_at baserat på ny status
    const newStatus = updates.status || cart.status;
    if (newStatus === 'cancelled') {
      // Avbruten order sparas i 90 dagar
      await db.update('carts', {
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      }, 'id', cart.id);
    } else if (newStatus !== 'confirmed' && newStatus !== 'betald') {
      // Förläng TTL med 21 dagar för aktiva ordrar
      try { await db.rpc('extend_cart_ttl', { cart_id: cart.id }); } catch (e) {
        // extend_cart_ttl RPC saknas — sätt expires_at direkt
        await db.update('carts', {
          expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
        }, 'id', cart.id).catch(() => {});
      }
    }

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

    return ok({ ok: true, success: true, cart_id: cart.id });

  } catch (e) {
    console.error('CART_UPDATE_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
