// netlify/functions/skicka-kontakt.js
// Resend API — ljust mailtheme (spam-säkert), rate limit-hantering

const RATE_LIMIT = {};
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 3;
const FROM = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const TO_INTERNAL = 'info@scenkonsult.se';
const TRELLO_EMAIL = 'sunxpertadm+kvz53qihlyplkt6r9xnb@app.trello.com';
const LOGO_URL = 'https://scenkonsult-astro.netlify.app/logo-white.png';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function htmlWrapper(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="130" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px;">Ljud &middot; Ljus &middot; Scen &middot; DJ &mdash; Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">${bodyHtml}</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
  <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:12px;">Scenkonsult Norden &middot; Grimstagatan 164, 162 58 Vallingby</p>
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">072-448 10 00 &middot; <a href="https://scenkonsult.se" style="color:#c4b5f4;text-decoration:none;">scenkonsult.se</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function field(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:7px 0;color:#666;font-size:13px;width:140px;vertical-align:top;border-bottom:1px solid #f0f0f5;">${label}</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${value}</td></tr>`;
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
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  let data;
  try { data = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig data' }) }; }

  if (data.website || data.honeypot) {
    console.log('SPAM_HONEYPOT_KONTAKT');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW_MS);
  if (RATE_LIMIT[ip].length >= RATE_MAX) return { statusCode: 429, headers, body: JSON.stringify({ error: 'For manga forfrågningar, forsok igen om en minut.' }) };
  RATE_LIMIT[ip].push(now);

  const { namn, telefon, epost, typ, gaster, datum, meddelande, hittade, sendCopy } = data;

  console.log('KONTAKT_INCOMING:', JSON.stringify({ namn, epost, sendCopy: !!sendCopy }));

  if (!namn || !telefon || !epost || !meddelande)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, telefon, e-post och meddelande kravs.' }) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  const spamPatterns = [/\b(viagra|casino|crypto|bitcoin|loan|click here|free money)\b/i];
  if (spamPatterns.some(p => p.test(meddelande))) {
    console.log('SPAM_CONTENT_KONTAKT');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'E-postkonfiguration saknas.' }) };

  const plainInternal = `Nytt kontaktmeddelande\n\nNamn: ${namn}\nE-post: ${epost}\nTelefon: ${telefon}\nEventtyp: ${typ||'-'}\nAntal gaster: ${gaster||'-'}\nDatum: ${datum||'-'}\nHittade oss via: ${hittade||'-'}\n\nMeddelande:\n${meddelande}\n\n---\nScenkonsult Norden | 072-448 10 00`;

  const htmlInternal = htmlWrapper('Nytt kontaktmeddelande', `
    <h2 style="margin:0 0 6px;color:#1e1850;font-size:20px;">Nytt kontaktmeddelande</h2>
    <p style="margin:0 0 20px;color:#888;font-size:13px;">Mottaget via scenkonsult.se</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${field('Namn', namn)}
      ${field('E-post', `<a href="mailto:${epost}" style="color:#4a3faa;">${epost}</a>`)}
      ${field('Telefon', `<a href="tel:${telefon}" style="color:#4a3faa;">${telefon}</a>`)}
      ${field('Eventtyp', typ)}
      ${field('Antal gaster', gaster)}
      ${field('Datum', datum)}
      ${field('Hittade oss via', hittade)}
    </table>
    <div style="background:#f7f7fb;border-radius:8px;padding:18px;border-left:3px solid #c4b5f4;margin-bottom:20px;">
      <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Meddelande</p>
      <p style="margin:0;color:#222;font-size:15px;line-height:1.7;">${meddelande.replace(/\n/g,'<br>')}</p>
    </div>
    <p style="margin:0;font-size:13px;color:#555;">Svara direkt till: <a href="mailto:${epost}" style="color:#4a3faa;">${epost}</a></p>`);

  try {
    await sendEmail(apiKey, { from: FROM, to: [TO_INTERNAL], reply_to: epost, subject: `Kontaktmeddelande fran ${namn}`, html: htmlInternal, text: plainInternal });

    // Vanta 600ms innan nasta for att undvika Resend rate limit
    await sleep(600);

    try {
      await sendEmail(apiKey, { from: FROM, to: [TRELLO_EMAIL], subject: `Kontakt: ${namn} — ${typ||'okant event'}`, html: htmlInternal, text: plainInternal });
    } catch (e) { console.error('TRELLO_COPY_ERROR:', e.message); }

    if (sendCopy && epost) {
      await sleep(600);
      console.log('KUNDKOPIA_SENDING to:', epost);
      try {
        const plainCustomer = `Tack, ${namn}!\n\nVi har tagit emot ditt meddelande och aterkommer inom kort.\nHar du brattom, ring oss pa 072-448 10 00.\n\nDitt meddelande:\n${meddelande}\n\n---\nScenkonsult Norden | scenkonsult.se`;
        const htmlCustomer = htmlWrapper('Vi har tagit emot ditt meddelande', `
          <h2 style="margin:0 0 16px;color:#1e1850;font-size:22px;">Tack, ${namn}!</h2>
          <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">Vi har tagit emot ditt meddelande och aterkommer inom kort. Har du brattom, ring oss pa <a href="tel:0724481000" style="color:#4a3faa;">072-448 10 00</a>.</p>
          <div style="background:#f7f7fb;border-radius:8px;padding:18px;border-left:3px solid #c4b5f4;">
            <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Ditt meddelande</p>
            <p style="margin:0;color:#333;font-size:14px;line-height:1.7;">${meddelande.replace(/\n/g,'<br>')}</p>
          </div>`);
        await sendEmail(apiKey, { from: FROM, to: [epost], subject: 'Vi har tagit emot ditt meddelande — Scenkonsult', html: htmlCustomer, text: plainCustomer });
        console.log('KUNDKOPIA_SENT to:', epost);
      } catch (e) { console.error('KUNDKOPIA_ERROR:', e.message); }
    }

    console.log('KONTAKT_OK:', JSON.stringify({ ip, namn, epost, sendCopy: !!sendCopy }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('KONTAKT_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka meddelandet, forsok igen.' }) };
  }
};
