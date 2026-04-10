// netlify/functions/pickup-email.js
// Skickar utlämningslänk via e-post
// POST { cart_id } + Bearer ADMIN_TOKEN

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit } = require('./_lib');

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <hej@scenkonsult.se>';
const LOGO_URL   = 'https://scenkonsult.se/logo-white.png';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body;
  try {
    let raw = event.body || '{}';
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, 'base64').toString('utf-8');
    body = JSON.parse(raw);
  } catch (e) {
    return err('Ogiltig JSON', 400);
  }

  const { cart_id } = body;
  if (!cart_id) return err('cart_id krävs', 400);

  const db = supabase();
  try {
    const { data: cart, error } = await db
      .from('carts')
      .select('id, customer_name, customer_email, cart_token, event_date, event_location, items')
      .eq('id', cart_id)
      .single();

    if (error || !cart) return err('Varukorg hittades ej', 404);
    if (!cart.customer_email) return err('Kunden har ingen e-postadress', 400);
    if (!cart.cart_token) return err('Cart saknar token', 400);

    const signUrl = `https://scenkonsult.se/sign/?cart=${cart.id}&token=${cart.cart_token}`;
    const firstName = (cart.customer_name || '').split(' ')[0] || 'Hej';

    // Bygg produktlista
    const items = (cart.items || []).filter(i => !i._note && i.name);
    const itemRows = items.slice(0, 8).map(i =>
      `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:14px">${i.name}</td>
       <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right;color:#666">×${i.qty||1}</td></tr>`
    ).join('');
    const moreRows = items.length > 8
      ? `<tr><td colspan="2" style="padding:6px 12px;font-size:13px;color:#999">+${items.length - 8} till…</td></tr>`
      : '';

    const dateStr = cart.event_date
      ? new Date(cart.event_date).toLocaleDateString('sv-SE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : null;

    const html = `<!DOCTYPE html>
<html lang="sv"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="120" style="display:block;margin:0 auto 10px;height:auto">
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px">Ljud · Ljus · Scen · DJ — Stockholm sedan 1986</p>
</td></tr>

<tr><td style="background:#fff;padding:36px 32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8">
  <h2 style="margin:0 0 8px;color:#1e1850;font-size:22px">Dags att kvittera din utrustning!</h2>
  <p style="margin:0 0 24px;color:#555;font-size:15px">Hej ${firstName}! Tryck på knappen nedan för att bekräfta att du tagit emot utrustningen från Scenkonsult.</p>

  ${dateStr ? `<p style="margin:0 0 20px;color:#555;font-size:14px">📅 <strong>${dateStr}</strong>${cart.event_location ? ` · ${cart.event_location}` : ''}</p>` : ''}

  ${itemRows ? `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #eee;border-radius:8px;overflow:hidden">
    <thead><tr style="background:#f8f8fb"><th style="padding:8px 12px;text-align:left;font-size:13px;color:#888;font-weight:600">Utrustning</th><th style="padding:8px 12px;text-align:right;font-size:13px;color:#888;font-weight:600">Antal</th></tr></thead>
    <tbody>${itemRows}${moreRows}</tbody>
  </table>` : ''}

  <div style="text-align:center;margin:28px 0">
    <a href="${signUrl}" style="display:inline-block;background:#c4b5f4;color:#0c0a24;text-decoration:none;padding:16px 36px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.01em">
      ✍️ Signera kvittens →
    </a>
  </div>

  <p style="margin:20px 0 0;color:#999;font-size:13px;text-align:center">
    Fungerar inte knappen? Kopiera länken:<br>
    <span style="font-size:11px;color:#bbb;word-break:break-all">${signUrl}</span>
  </p>
</td></tr>

<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center">
  <p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px">
    Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby · 072-448 10 00
  </p>
</td></tr>

</table></td></tr></table>
</body></html>`;

    const text = `Hej ${firstName}!\n\nDags att kvittera din utrustning från Scenkonsult.\n\nSignera här: ${signUrl}\n\nScenkonsult Norden · 072-448 10 00`;

    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: cart.customer_email,
        subject: `Kvittera din utrustning — ${cart.id}`,
        html,
        text,
        reply_to: 'info@scenkonsult.se',
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error('PICKUP_EMAIL_ERR:', JSON.stringify(resData));
      return err(resData.message || 'E-postfel', 500);
    }

    await logAudit(db, cart_id, 'admin', 'pickup_email_sent', { to: cart.customer_email });
    return ok({ sent: true, to: cart.customer_email });

  } catch (e) {
    console.error('PICKUP_EMAIL_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
