// netlify/functions/pickup-confirm.js
// Admin motkvitterar utlämning — detta gör kundens signatur juridiskt bindande.
// POST { cart_id, admin_note? } + Bearer ADMIN_TOKEN
//
// Förutsättning: cart.pickup_signed_at måste finnas (kunden har förberett).
// Sätter pickup_confirmed_at + skickar PDF-kvitto till kund.

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit, sendEmail, MAIL_FROM } = require('./_lib');

const LOGO_URL = 'https://scenkonsult.se/logo-white.png';

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

  const { cart_id, admin_note } = body;
  if (!cart_id) return err('cart_id krävs', 400);

  const db = supabase();
  try {
    const { data: cart, error } = await db.from('carts')
      .select('id, customer_name, customer_email, event_date, event_location, items, delivery_time, pickup_signed_at, pickup_confirmed_at, customer_company, delivery_mode')
      .eq('id', cart_id)
      .single();

    if (error || !cart) return err('Varukorg hittades ej', 404);
    if (!cart.pickup_signed_at) return err('Kunden har inte förberett kvittensen ännu', 400);
    if (cart.pickup_confirmed_at) return err('Utlämningen är redan motkvitterad', 409);

    const confirmedAt = new Date().toISOString();
    const updates = {
      pickup_confirmed_at: confirmedAt,
    };
    if (admin_note && admin_note.trim()) {
      updates.pickup_admin_note = admin_note.trim().slice(0, 1000);
    }

    await db.update('carts', updates, 'id', cart_id);
    await logAudit(db, cart_id, 'admin', 'pickup_confirmed', {
      had_admin_note: !!(admin_note && admin_note.trim()),
    });

    // Skicka PDF-kvitto-mail (enkel HTML-bekräftelse, inte PDF än)
    if (cart.customer_email && process.env.RESEND_API_KEY) {
      try {
        const firstName = (cart.customer_name || '').split(' ')[0] || 'Hej';
        const dateStr = cart.event_date
          ? new Date(cart.event_date + 'T00:00:00').toLocaleDateString('sv-SE',
              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          : '';
        const items = (cart.items || []).filter(i => !i._note && i.name);
        const itemRows = items.slice(0, 20).map(i =>
          `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:14px">${escapeHtml(i.name)}</td>
           <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right;color:#666">×${i.qty || 1}</td></tr>`
        ).join('');

        const noteBlock = admin_note && admin_note.trim()
          ? `<div style="background:#fff8e1;border-left:3px solid #fbbf24;border-radius:6px;padding:12px 16px;margin:16px 0">
               <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700">Anteckning vid utlämning</p>
               <p style="margin:0;color:#333;font-size:14px;line-height:1.6">${escapeHtml(admin_note.trim())}</p>
             </div>`
          : '';

        const html = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="120" style="display:block;margin:0 auto 10px;height:auto">
</td></tr>
<tr><td style="background:#fff;padding:36px 32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8">
  <div style="text-align:center;margin:0 0 24px">
    <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:#dcfce7;line-height:64px;font-size:32px">✅</div>
  </div>
  <h2 style="margin:0 0 8px;color:#1e1850;font-size:23px;text-align:center">Kvittens bekräftad!</h2>
  <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.6;text-align:center">
    Hej ${escapeHtml(firstName)}! Vi har bekräftat att utrustningen lämnades över korrekt. Din digitala signatur är nu juridiskt bindande.
  </p>
  ${dateStr ? `<p style="margin:0 0 16px;color:#555;font-size:14px;text-align:center">📅 ${dateStr}${cart.event_location ? ' · ' + escapeHtml(cart.event_location) : ''}</p>` : ''}
  ${noteBlock}
  ${itemRows ? `
  <p style="margin:18px 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700">Utlämnad utrustning</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #eee;border-radius:8px;overflow:hidden">
    <tbody>${itemRows}</tbody>
  </table>` : ''}
  <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.6;text-align:center">
    Frågor? Ring 072-448 10 00 — vi har jour vid pågående uthyrningar.
  </p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center">
  <p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px">
    Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby · 072-448 10 00
  </p>
</td></tr>
</table></td></tr></table></body></html>`;

        const text = `Kvittens bekräftad!\n\nHej ${firstName}!\n\nVi har bekräftat att utrustningen lämnades över korrekt. Din digitala signatur är nu juridiskt bindande.\n\n${dateStr ? `Datum: ${dateStr}\n` : ''}${cart.event_location ? `Plats: ${cart.event_location}\n` : ''}${admin_note && admin_note.trim() ? `\nAnteckning: ${admin_note.trim()}\n` : ''}\nFrågor? Ring 072-448 10 00\n---\nScenkonsult Norden`;

        await sendEmail(process.env.RESEND_API_KEY, {
          from:     MAIL_FROM,
          to:       cart.customer_email,
          subject:  `Kvittens bekräftad — ${cart.id}`,
          html,
          text,
          reply_to: 'info@scenkonsult.se',
        });
      } catch (mailErr) {
        console.error('PICKUP_CONFIRM_MAIL_ERR:', mailErr.message);
        // Mailfel ska inte krascha själva motkvittensen
      }
    }

    return ok({ confirmed: true, cart_id, confirmed_at: confirmedAt });
  } catch (e) {
    console.error('PICKUP_CONFIRM_ERROR:', e.message);
    return err(e.message || 'Serverfel', 500);
  }
};

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
