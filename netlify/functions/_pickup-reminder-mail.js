// netlify/functions/_pickup-reminder-mail.js
// Delad mailmall för förberedelse av kvittens (flight check-in-stil).
// Används både av scheduled-pickup-reminder och pickup-reminder-trigger (manuell).
'use strict';

const LOGO_URL = 'https://scenkonsult.se/logo-white.png';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildPickupReminderEmail(cart) {
  const firstName = (cart.customer_name || '').split(' ')[0] || 'Hej';
  const signUrl   = `https://scenkonsult.se/sign/?cart=${cart.id}&token=${cart.cart_token}`;

  const dateStr = cart.event_date
    ? new Date(cart.event_date + 'T00:00:00').toLocaleDateString('sv-SE',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const timeStr = cart.delivery_time || '13:00';
  const placeStr = cart.event_location ? escapeHtml(cart.event_location) : null;

  // Utrustningslista (visa upp till 8, övriga under "+ X till")
  const items = (cart.items || []).filter(i => !i._note && i.name);
  const itemRows = items.slice(0, 8).map(i =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333">${escapeHtml(i.name)}</td>
     <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right;color:#888">×${i.qty || 1}</td></tr>`
  ).join('');
  const moreRows = items.length > 8
    ? `<tr><td colspan="2" style="padding:8px 12px;font-size:13px;color:#999;font-style:italic">+ ${items.length - 8} till på orderbekräftelsen…</td></tr>`
    : '';

  const subject = `Förbered din utlämning${dateStr ? ' — ' + dateStr : ''}`;

  const html = `<!DOCTYPE html>
<html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

<!-- Header -->
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="120" style="display:block;margin:0 auto 10px;height:auto">
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px">Ljud · Ljus · Scen · DJ — Stockholm sedan 1986</p>
</td></tr>

<!-- Hero -->
<tr><td style="background:#fff;padding:36px 32px 28px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8">
  <h2 style="margin:0 0 6px;color:#1e1850;font-size:23px;line-height:1.3">Det är dags att förbereda din utlämning, ${escapeHtml(firstName)}!</h2>
  <p style="margin:0 0 22px;color:#666;font-size:15px;line-height:1.6">
    Vi ses snart! Innan dess vill vi att du gör en sak hemifrån — det tar 2 minuter och sparar tid vid disken.
  </p>

  ${dateStr ? `
  <div style="background:#f7f7fb;border-left:3px solid #c4b5f4;border-radius:8px;padding:14px 18px;margin:0 0 24px">
    <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700">Utlämning</p>
    <p style="margin:0;color:#222;font-size:15px;font-weight:600">📅 ${dateStr} kl ${timeStr}</p>
    ${placeStr ? `<p style="margin:4px 0 0;color:#666;font-size:14px">📍 ${placeStr}</p>` : `<p style="margin:4px 0 0;color:#666;font-size:14px">📍 Grimstagatan 164, 162 58 Vällingby</p>`}
  </div>` : ''}

  <!-- CTA -->
  <div style="text-align:center;margin:18px 0 26px">
    <a href="${signUrl}" style="display:inline-block;background:#c4b5f4;color:#0c0a24;text-decoration:none;padding:16px 36px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.01em">
      Förbered din kvittens →
    </a>
  </div>

  <!-- Förklaring -->
  <div style="background:#fafaff;border:1px solid #ececf5;border-radius:8px;padding:18px 20px;margin:0 0 26px">
    <p style="margin:0 0 10px;color:#333;font-size:14px;line-height:1.65">
      Det första steget gör du själv hemma — du förbereder din digitala signatur och laddar upp en bild på körkort eller annan legitimation.
    </p>
    <p style="margin:0;color:#333;font-size:14px;line-height:1.65">
      <strong style="color:#1e1850">Viktigt:</strong> Själva kvittensen blir inte giltig förrän vi bekräftar att du fått all utrustning. Du behöver alltså inte oroa dig — vi kontrollerar tillsammans att allt stämmer innan kvittensen aktiveras.
    </p>
  </div>

  <!-- 3-stegs grafik -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px">
    <tr>
      <td width="33%" valign="top" style="padding:0 8px;text-align:center">
        <div style="font-size:30px;line-height:1;margin-bottom:8px">📱</div>
        <p style="margin:0 0 4px;color:#1e1850;font-size:13px;font-weight:700">1. Nu</p>
        <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Förbered signatur och legitimation</p>
      </td>
      <td width="33%" valign="top" style="padding:0 8px;text-align:center">
        <div style="font-size:30px;line-height:1;margin-bottom:8px">📦</div>
        <p style="margin:0 0 4px;color:#1e1850;font-size:13px;font-weight:700">2. Vid utlämning</p>
        <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Vi går igenom utrustningen tillsammans</p>
      </td>
      <td width="33%" valign="top" style="padding:0 8px;text-align:center">
        <div style="font-size:30px;line-height:1;margin-bottom:8px">✍️</div>
        <p style="margin:0 0 4px;color:#1e1850;font-size:13px;font-weight:700">3. Klart</p>
        <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Vi aktiverar din kvittens och du får en kopia</p>
      </td>
    </tr>
  </table>

  ${itemRows ? `
  <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700">Det här ska du hämta</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border:1px solid #eee;border-radius:8px;overflow:hidden">
    <tbody>${itemRows}${moreRows}</tbody>
  </table>` : ''}

  <!-- Support-block -->
  <div style="background:#1e1850;border-radius:10px;padding:20px 22px;margin:0 0 18px">
    <p style="margin:0 0 12px;color:#c4b5f4;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">Hjälp & guider</p>
    <p style="margin:0 0 8px;color:rgba(255,255,255,0.85);font-size:13px;line-height:1.65">
      📞 <strong>Ring oss</strong> om något är oklart: <a href="tel:0724481000" style="color:#c4b5f4;text-decoration:none">072-448 10 00</a> <span style="color:rgba(255,255,255,0.5)">(mån–fre 09–17, jour vid pågående uthyrning)</span>
    </p>
    <p style="margin:0 0 8px;color:rgba(255,255,255,0.85);font-size:13px;line-height:1.65">
      🎭 <strong>Fråga Sven</strong> — vår AI-intendent på <a href="https://scenkonsult.se" style="color:#c4b5f4;text-decoration:none">scenkonsult.se</a> kan allt om utrustningen och hjälper dygnet runt
    </p>
    <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;line-height:1.65">
      📖 <strong>Guider:</strong>
      <a href="https://scenkonsult.se/for/guider/hur-stor-pa/" style="color:#c4b5f4;text-decoration:none">Hur stor PA?</a> ·
      <a href="https://scenkonsult.se/for/guider/ljussattning-tips/" style="color:#c4b5f4;text-decoration:none">Ljussättning</a> ·
      <a href="https://scenkonsult.se/for/guider/checklista-event/" style="color:#c4b5f4;text-decoration:none">Checklista</a> ·
      <a href="https://scenkonsult.se/for/guider/" style="color:#c4b5f4;text-decoration:none">Alla guider</a>
    </p>
  </div>

  <p style="margin:14px 0 0;color:#999;font-size:12px;text-align:center">
    Genom att förbereda kvittensen godkänner du våra <a href="https://scenkonsult.se/hyresvillkor/" style="color:#888;text-decoration:underline">hyresvillkor</a>.
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center">
  <p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px">
    Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby · 072-448 10 00
  </p>
</td></tr>

</table></td></tr></table>
</body></html>`;

  const text = `Förbered din utlämning${dateStr ? ', ' + dateStr : ''}

Hej ${firstName}!

Det första steget i utlämningen gör du själv hemma — du förbereder din digitala signatur och laddar upp en bild på körkort eller annan legitimation. Det tar 2 minuter.

VIKTIGT: Själva kvittensen blir inte giltig förrän vi bekräftar att du fått all utrustning. Du behöver alltså inte oroa dig — vi kontrollerar tillsammans att allt stämmer innan kvittensen aktiveras.

${dateStr ? `Utlämning: ${dateStr} kl ${timeStr}\n${cart.event_location || 'Grimstagatan 164, 162 58 Vällingby'}\n\n` : ''}Förbered här: ${signUrl}

SÅ FUNKAR DET
1. Nu — Förbered signatur och legitimation
2. Vid utlämning — Vi går igenom utrustningen tillsammans
3. Klart — Vi aktiverar din kvittens och du får en kopia

HJÄLP & GUIDER
Ring oss om något är oklart: 072-448 10 00
Fråga Sven — AI-intendent på scenkonsult.se (dygnet runt)
Guider: scenkonsult.se/for/guider/

Hyresvillkor: scenkonsult.se/hyresvillkor/

---
Scenkonsult Norden · 072-448 10 00`;

  return { html, text, subject };
}

module.exports = { buildPickupReminderEmail };
