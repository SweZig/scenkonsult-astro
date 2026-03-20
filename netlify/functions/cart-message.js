// netlify/functions/cart-message.js
// Skickar ett meddelande i varukorgens chatt
// POST /.netlify/functions/cart-message
// Body (kund):  { token, body }
// Body (admin): { cart_id, body }  + Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, rateLimit } = require('./_lib');

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const ADMIN_MAIL = 'info@scenkonsult.se';
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

async function sendMail(to, subject, html, text, replyTo) {
  const body = { from: FROM, to, subject, html, text };
  if (replyTo) body.reply_to = replyTo;
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) console.error('Resend error:', await res.text());
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rateLimit(ip, 5)) return err('För många förfrågningar', 429);

  let body;
  try {
    let raw = event.body || '';
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, 'base64').toString('utf-8');
    console.log('CART_MESSAGE_RAW:', JSON.stringify(raw?.slice(0,200)), 'b64:', event.isBase64Encoded);
    body = JSON.parse(raw || '{}');
  } catch (e) {
    console.error('CART_MESSAGE_PARSE_ERROR:', e.message);
    return err('Ogiltig JSON', 400);
  }

  const msgText = (body.body || '').trim();
  if (!msgText) return err('Meddelande kan inte vara tomt', 400);
  if (msgText.length > 4000) return err('Meddelandet är för långt (max 4000 tecken)', 400);

  const admin = isAdmin(event);
  const db = supabase();

  try {
    let cart;

    if (admin) {
      // ── Admin skickar meddelande ──────────────────────────
      if (!body.cart_id) return err('cart_id krävs', 400);
      const { data, error } = await db.from('carts').select('*').eq('id', body.cart_id).single();
      if (error || !data) return err('Varukorg hittades ej', 404);
      cart = data;

    } else {
      // ── Kund skickar meddelande ───────────────────────────
      if (!body.token) return err('Token krävs', 400);
      // Kund kan skicka antingen token direkt eller cart_id + token
      const { data, error } = body.cart_id
        ? await db.from('carts').select('*').eq('id', body.cart_id).eq('cart_token', body.token).single()
        : await db.from('carts').select('*').eq('cart_token', body.token).single();
      if (error || !data) return err('Varukorg hittades ej', 404);
      if (data.expires_at && new Date(data.expires_at) < new Date()) return err('Varukorgen har gått ut', 410);
      cart = data;
    }

    // Spara meddelandet
    const sender = admin ? 'admin' : 'customer';
    const [newMsg] = await db.insert('messages', {
      cart_id:    cart.id,
      sender,
      body:       msgText,
      read_at:    null,
      created_at: new Date().toISOString()
    });

    // Förläng TTL
    await db.rpc('extend_cart_ttl', { cart_id: cart.id });

    // Audit
    await logAudit(db, cart.id, sender, 'message_sent', { length: msgText.length });

    // ── Notiser ───────────────────────────────────────────────
    const cartUrl = cart.cart_token
      ? `https://scenkonsult.se/order/?cart=${cart.id}&token=${cart.cart_token}`
      : null;

    if (!admin && cart.customer_email !== null) {
      // Kund → notis till admin
      const html = mailWrapper(`
        <h2 style="color:#1e1850;margin:0 0 16px;">💬 Nytt meddelande från kund</h2>
        <p style="color:#555;margin:0 0 8px;"><strong>${cart.customer_name || 'Kund'}</strong> har skickat ett meddelande på varukorg <strong>${cart.id}</strong>:</p>
        <div style="background:#f7f7fb;border-left:4px solid #c4b5f4;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;color:#333;font-size:15px;line-height:1.6;">${msgText.replace(/\n/g, '<br>')}</div>
        ${cartUrl ? `<p style="margin:24px 0 0;"><a href="${cartUrl}" style="background:#332885;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Öppna varukorg →</a></p>` : ''}
      `);
      await sendMail(
        ADMIN_MAIL,
        `💬 Nytt meddelande — ${cart.customer_name || cart.id}`,
        html,
        `Nytt meddelande från ${cart.customer_name || 'kund'}: ${msgText}`,
        cart.customer_email
      );
    }

    if (admin && cart.customer_email) {
      // Admin → notis till kund
      const html = mailWrapper(`
        <h2 style="color:#1e1850;margin:0 0 16px;">Svar från Scenkonsult Norden</h2>
        <p style="color:#555;margin:0 0 8px;">Vi har skickat ett meddelande angående din offert/bokning:</p>
        <div style="background:#f7f7fb;border-left:4px solid #c4b5f4;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;color:#333;font-size:15px;line-height:1.6;">${msgText.replace(/\n/g, '<br>')}</div>
        ${cartUrl ? `<p style="margin:24px 0 0;"><a href="${cartUrl}" style="background:#332885;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Svara på meddelandet →</a></p>` : ''}
        <p style="color:#888;font-size:13px;margin:16px 0 0;">Via länken kan du se ditt orderförslag, svara och följa status.</p>
      `);
      await sendMail(
        cart.customer_email,
        `Svar från Scenkonsult — ${cart.id}`,
        html,
        `Svar från Scenkonsult: ${msgText}\n\nÖppna varukorgen: ${cartUrl || 'kontakta oss'}`,
        ADMIN_MAIL
      );
    }

    return ok({ message: newMsg || { id: 'ok', created_at: new Date().toISOString() } });

  } catch (e) {
    console.error('CART_MESSAGE_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
