// netlify/functions/skicka-kontakt.js
// Spam-skydd: honeypot, rate limit per IP, innehållsvalidering

const RATE_LIMIT = {};
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 3;

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
    console.log('SPAM_HONEYPOT_KONTAKT:', JSON.stringify({ ip: event.headers['x-forwarded-for'] }));
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
  const { namn, telefon, epost, typ, gaster, datum, meddelande, hittade } = data;

  if (!namn || !telefon || !epost || !meddelande) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, telefon, e-post och meddelande krävs.' }) };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  }

  // Blockera spam-innehåll
  const spamPatterns = [/\b(viagra|casino|crypto|bitcoin|loan|click here|free money)\b/i, /https?:\/\//i];
  if (spamPatterns.some(p => p.test(meddelande))) {
    console.log('SPAM_CONTENT_KONTAKT:', JSON.stringify({ ip, epost }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // ── 4. SKICKA VIA NETLIFY FORMS ──────────────────────────
  const formData = new URLSearchParams({
    'form-name':  'kontaktformular',
    'namn':       namn,
    'epost':      epost,
    'telefon':    telefon,
    'typ':        typ || '',
    'gaster':     gaster || '',
    'datum':      datum || '',
    'meddelande': meddelande,
    'hittade':    hittade || '',
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

    console.log('KONTAKT_OK:', JSON.stringify({ ip, namn, epost }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('KONTAKT_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka meddelandet, försök igen.' }) };
  }
};
