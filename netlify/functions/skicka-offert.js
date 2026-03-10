// netlify/functions/skicka-offert.js
// Resend API — branded HTML-mail till info@ + ev. kundkopia

const RATE_LIMIT = {};
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 3;
const FROM = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const TO_INTERNAL = 'info@scenkonsult.se';
const TRELLO_EMAIL = 'sunxpertadm+kvz53qihlyplkt6r9xnb@app.trello.com';
const LOGO_URL = 'https://scenkonsult.se/images/logo-white.png';

function htmlWrapper(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0c0a24;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0a24;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;border-bottom:2px solid rgba(196,181,244,0.25);">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="140" style="display:block;margin:0 auto 12px;" />
  <p style="margin:0;color:rgba(255,255,255,0.55);font-size:13px;letter-spacing:0.05em;">Ljud · Ljus · Scen · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#1e1850;padding:32px;">${bodyHtml}</td></tr>
<tr><td style="background:#111030;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;border-top:2px solid rgba(196,181,244,0.25);">
  <p style="margin:0 0 4px;color:rgba(255,255,255,0.4);font-size:12px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
  <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">072-448 10 00 · <a href="https://scenkonsult.se" style="color:#c4b5f4;text-decoration:none;">scenkonsult.se</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function cartTable(cart) {
  if (!cart || cart.length === 0) return '<p style="color:rgba(255,255,255,0.55);">Ingen utrustning angiven.</p>';
  const rows = cart.map(item => `<tr>
    <td style="padding:10px 12px;color:#fff;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.08);">${item.name||''}</td>
    <td style="padding:10px 12px;color:rgba(255,255,255,0.55);font-size:14px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">${item.quantity||1} st</td>
    <td style="padding:10px 12px;color:#c4b5f4;font-size:14px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.08);">${item.price?((item.price*(item.quantity||1)).toLocaleString('sv-SE')+' kr'):'–'}</td>
  </tr>`).join('');
  const total = cart.reduce((s,i)=>s+((i.price||0)*(i.quantity||1)),0);
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.1);border-radius:8px;overflow:hidden;margin-top:8px;">
    <tr style="background:rgba(255,255,255,0.05);">
      <th style="padding:10px 12px;color:rgba(255,255,255,0.55);font-size:12px;text-align:left;font-weight:600;text-transform:uppercase;">Produkt</th>
      <th style="padding:10px 12px;color:rgba(255,255,255,0.55);font-size:12px;text-align:center;font-weight:600;text-transform:uppercase;">Antal</th>
      <th style="padding:10px 12px;color:rgba(255,255,255,0.55);font-size:12px;text-align:right;font-weight:600;text-transform:uppercase;">Pris exkl. moms</th>
    </tr>${rows}
    <tr style="background:rgba(196,181,244,0.08);">
      <td colspan="2" style="padding:12px;color:#c4b5f4;font-weight:700;font-size:15px;">Totalt (exkl. moms)</td>
      <td style="padding:12px;color:#c4b5f4;font-weight:700;font-size:15px;text-align:right;">${total.toLocaleString('sv-SE')} kr</td>
    </tr>
  </table>`;
}

function field(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px;width:130px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:#fff;font-size:14px;">${value}</td></tr>`;
}

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Resend ${res.status}: ${err}`); }
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const headers = { 'Access-Control-Allow-Origin': 'https://scenkonsult.se', 'Content-Type': 'application/json' };

  let data;
  try { data = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig data' }) }; }

  if (data.website || data.phone2 || data.honeypot) {
    console.log('SPAM_HONEYPOT:', JSON.stringify({ ip: event.headers['x-forwarded-for'] }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW_MS);
  if (RATE_LIMIT[ip].length >= RATE_MAX) return { statusCode: 429, headers, body: JSON.stringify({ error: 'För många förfrågningar, försök igen om en minut.' }) };
  RATE_LIMIT[ip].push(now);

  const { customer, cart, body: msgBody, sendCopy } = data;
  if (!customer?.name || !customer?.email || !customer?.phone)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, e-post och telefon krävs.' }) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  const spamPatterns = [/\b(viagra|casino|crypto|bitcoin|loan|click here|free money)\b/i, /https?:\/\//i];
  if (spamPatterns.some(p => p.test(customer.notes || ''))) {
    console.log('SPAM_CONTENT:', JSON.stringify({ ip, email: customer.email }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }
  if (!cart || cart.length === 0) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Varukorgen är tom.' }) };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'E-postkonfiguration saknas.' }) };

  const datumStr = customer.from && customer.to ? `${customer.from} – ${customer.to}` : (customer.from || customer.to || '');

  const internalHtml = htmlWrapper('Ny offertförfrågan', `
    <h2 style="margin:0 0 20px;color:#fff;font-size:22px;font-family:'Georgia',serif;">Ny offertförfrågan 📋</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${field('Namn', customer.name)}
      ${field('E-post', `<a href="mailto:${customer.email}" style="color:#c4b5f4;">${customer.email}</a>`)}
      ${field('Telefon', `<a href="tel:${customer.phone}" style="color:#c4b5f4;">${customer.phone}</a>`)}
      ${field('Företag', customer.company)}
      ${field('Datum', datumStr)}
      ${field('Adress', customer.address)}
      ${field('Övrigt', customer.notes)}
    </table>
    <h3 style="margin:0 0 12px;color:#c4b5f4;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;">Varukorg</h3>
    ${cartTable(cart)}
    <div style="margin-top:24px;padding:16px;background:rgba(196,181,244,0.08);border-radius:8px;border-left:3px solid #c4b5f4;">
      <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">Svara kunden: <a href="mailto:${customer.email}" style="color:#c4b5f4;">${customer.email}</a></p>
    </div>`);

  try {
    await sendEmail(apiKey, { from: FROM, to: [TO_INTERNAL], reply_to: customer.email, subject: `Offertförfrågan från ${customer.name}`, html: internalHtml });

    try {
      await sendEmail(apiKey, { from: FROM, to: [TRELLO_EMAIL], subject: `Offertförfrågan: ${customer.name} — ${datumStr}`, html: internalHtml });
    } catch (e) { console.error('TRELLO_COPY_ERROR:', e.message); }

    if (sendCopy && customer.email) {
      try {
        const customerHtml = htmlWrapper('Din offertförfrågan är mottagen', `
          <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-family:'Georgia',serif;">Tack, ${customer.name}! 🎉</h2>
          <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 24px;">Vi har tagit emot din förfrågan och återkommer vardagar 09:00–17:00 med en offert. Frågor? Ring oss på <a href="tel:0724481000" style="color:#c4b5f4;">072-448 10 00</a>.</p>
          <h3 style="margin:0 0 12px;color:#c4b5f4;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;">Din beställning</h3>
          ${cartTable(cart)}
          ${datumStr ? `<p style="margin:16px 0 0;color:rgba(255,255,255,0.55);font-size:13px;">📅 Datum: ${datumStr}</p>` : ''}`);
        await sendEmail(apiKey, { from: FROM, to: [customer.email], subject: 'Din offertförfrågan till Scenkonsult Norden', html: customerHtml });
      } catch (e) { console.error('KUNDKOPIA_ERROR:', e.message); }
    }

    console.log('OFFERT_OK:', JSON.stringify({ ip, name: customer.name, email: customer.email, items: cart.length, sendCopy: !!sendCopy }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('OFFERT_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka förfrågan, försök igen.' }) };
  }
};
