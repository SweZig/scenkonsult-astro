// netlify/functions/skicka-feedback.js
// Spam-skydd: honeypot, rate limit per IP, innehållsvalidering

const RATE_LIMIT = {};
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5; // Feedback kan skickas lite oftare

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': 'https://scenkonsult.se',
    'Content-Type': 'application/json',
  };

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig data' }) };
  }

  // ── 1. HONEYPOT ──────────────────────────────────────────
  if (data.website || data.honeypot) {
    console.log('SPAM_HONEYPOT_FEEDBACK:', JSON.stringify({ ip: event.headers['x-forwarded-for'] }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // ── 2. RATE LIMIT ────────────────────────────────────────
  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW_MS);
  if (RATE_LIMIT[ip].length >= RATE_MAX) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'För många förfrågningar, försök igen om en minut.' }) };
  }
  RATE_LIMIT[ip].push(now);

  // ── 3. VALIDERING ────────────────────────────────────────
  const { typ, meddelande, namn, epost } = data;

  if (!meddelande || meddelande.length < 5) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Beskriv din feedback innan du skickar.' }) };
  }

  if (epost && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  }

  // Blockera spam-innehåll
  const spamPatterns = [/\b(viagra|casino|crypto|bitcoin|loan|click here|free money)\b/i, /https?:\/\//i];
  if (spamPatterns.some(p => p.test(meddelande))) {
    console.log('SPAM_CONTENT_FEEDBACK:', JSON.stringify({ ip }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // ── 4. SKICKA VIA NETLIFY FORMS ──────────────────────────
  const formData = new URLSearchParams({
    'form-name':  'feedbackformular',
    'typ':        typ || 'Ej angiven',
    'meddelande': meddelande,
    'namn':       namn || 'Anonym',
    'epost':      epost || '',
    'website':    '',
  });

  try {
    const resp = await fetch('https://scenkonsult-astro.netlify.app/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!resp.ok && resp.status !== 303) {
      throw new Error(`Netlify Forms svarade ${resp.status}`);
    }

    console.log('FEEDBACK_OK:', JSON.stringify({ ip, typ, namn: namn || 'anonym' }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('FEEDBACK_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka feedback, försök igen.' }) };
  }
};
