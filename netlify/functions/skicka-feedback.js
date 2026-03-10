// netlify/functions/skicka-feedback.js
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

  if (data.website || data.honeypot) {
    console.log('SPAM_HONEYPOT_FEEDBACK:', JSON.stringify({ ip: event.headers['x-forwarded-for'] }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW_MS);
  if (RATE_LIMIT[ip].length >= RATE_MAX) return { statusCode: 429, headers, body: JSON.stringify({ error: 'För många förfrågningar, försök igen om en minut.' }) };
  RATE_LIMIT[ip].push(now);

  const { typ, meddelande, namn, epost, sendCopy } = data;
  if (!meddelande) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Meddelande krävs.' }) };
  if (epost && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  const spamPatterns = [/\b(viagra|casino|crypto|bitcoin|loan|click here|free money)\b/i, /https?:\/\//i];
  if (spamPatterns.some(p => p.test(meddelande))) {
    console.log('SPAM_CONTENT_FEEDBACK:', JSON.stringify({ ip }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'E-postkonfiguration saknas.' }) };

  const displayNamn = namn || 'Anonym';
  const typEmoji = { 'Beröm': '⭐', 'Klagomål': '⚠️', 'Förslag': '💡', 'Övrigt': '📝' }[typ] || '📝';

  const internalHtml = htmlWrapper('Ny feedback', `
    <h2 style="margin:0 0 20px;color:#fff;font-size:22px;font-family:'Georgia',serif;">${typEmoji} Ny feedback — ${typ || 'Okänd typ'}</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px;width:120px;">Från</td><td style="padding:6px 0;color:#fff;font-size:14px;">${displayNamn}</td></tr>
      ${epost ? `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.5);font-size:13px;">E-post</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${epost}" style="color:#c4b5f4;">${epost}</a></td></tr>` : ''}
    </table>
    <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:20px;border-left:3px solid #c4b5f4;">
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Meddelande</p>
      <p style="margin:0;color:#fff;font-size:15px;line-height:1.7;">${meddelande.replace(/\n/g,'<br>')}</p>
    </div>`);

  try {
    await sendEmail(apiKey, {
      from: FROM,
      to: [TO_INTERNAL],
      ...(epost ? { reply_to: epost } : {}),
      subject: `Feedback (${typ || 'Okänd'}) från ${displayNamn}`,
      html: internalHtml,
    });

    try {
      await sendEmail(apiKey, { from: FROM, to: [TRELLO_EMAIL], subject: `Feedback: ${typ || 'Okänd'} — ${displayNamn}`, html: internalHtml });
    } catch (e) { console.error('TRELLO_COPY_ERROR:', e.message); }

    if (sendCopy && epost) {
      try {
        const customerHtml = htmlWrapper('Tack för din feedback!', `
          <h2 style="margin:0 0 16px;color:#fff;font-size:22px;font-family:'Georgia',serif;">Tack för din feedback! ${typEmoji}</h2>
          <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 20px;">Vi uppskattar att du tog dig tid att skriva till oss. Din feedback hjälper oss att bli bättre!</p>
          <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:20px;border-left:3px solid #c4b5f4;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Ditt meddelande</p>
            <p style="margin:0;color:rgba(255,255,255,0.8);font-size:14px;line-height:1.7;">${meddelande.replace(/\n/g,'<br>')}</p>
          </div>`);
        await sendEmail(apiKey, { from: FROM, to: [epost], subject: 'Tack för din feedback — Scenkonsult', html: customerHtml });
      } catch (e) { console.error('KUNDKOPIA_ERROR:', e.message); }
    }

    console.log('FEEDBACK_OK:', JSON.stringify({ ip, typ, namn: displayNamn, sendCopy: !!sendCopy }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('FEEDBACK_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka feedback, försök igen.' }) };
  }
};
