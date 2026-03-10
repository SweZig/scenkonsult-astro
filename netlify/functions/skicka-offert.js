// netlify/functions/skicka-offert.js
// Tar emot offertdata från varukorgen och skickar via Netlify Forms / SMTP-proxy
// Spam-skydd: honeypot, rate limit per IP, innehållsvalidering

const RATE_LIMIT = {}; // In-memory per function instance (återställs vid cold start)
const RATE_WINDOW_MS = 60 * 1000; // 1 minut
const RATE_MAX = 3; // Max 3 förfrågningar per minut per IP

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

  // ── 1. HONEYPOT ─────────────────────────────────────────
  // Bot fyller i dolda fält, riktiga användare gör det inte
  if (data.website || data.phone2 || data.honeypot) {
    console.log('SPAM_HONEYPOT:', JSON.stringify({ ip: event.headers['x-forwarded-for'] }));
    // Returnera 200 så boten tror det gick igenom
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // ── 2. RATE LIMIT per IP ────────────────────────────────
  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW_MS);
  if (RATE_LIMIT[ip].length >= RATE_MAX) {
    console.log('SPAM_RATELIMIT:', JSON.stringify({ ip }));
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'För många förfrågningar, försök igen om en minut.' }) };
  }
  RATE_LIMIT[ip].push(now);

  // ── 3. VALIDERING ───────────────────────────────────────
  const { customer, cart, body: msgBody } = data;

  if (!customer?.name || !customer?.email || !customer?.phone) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, e-post och telefon krävs.' }) };
  }

  // Enkel e-postvalidering
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  }

  // Blockera uppenbara spam-mönster i meddelandet
  const spamPatterns = [/\b(viagra|casino|crypto|bitcoin|loan|click here|free money)\b/i, /https?:\/\//i];
  if (spamPatterns.some(p => p.test(customer.notes || ''))) {
    console.log('SPAM_CONTENT:', JSON.stringify({ ip, email: customer.email }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (!cart || cart.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Varukorgen är tom.' }) };
  }

  // ── 4. SKICKA VIA NETLIFY FORMS API ─────────────────────
  // Netlify Forms tar emot POST med application/x-www-form-urlencoded
  const formData = new URLSearchParams({
    'form-name': 'offertforfragan',
    'name':      customer.name,
    'email':     customer.email,
    'phone':     customer.phone,
    'company':   customer.company || '',
    'datum_from': customer.from || '',
    'datum_to':   customer.to || '',
    'adress':    customer.address || '',
    'meddelande': customer.notes || '',
    'varukorg':  msgBody || '',
    'reply_to':  customer.email,
  });

  try {
    const resp = await fetch('https://scenkonsult.se/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!resp.ok && resp.status !== 303) {
      throw new Error(`Netlify Forms svarade ${resp.status}`);
    }

    console.log('OFFERT_OK:', JSON.stringify({
      ip,
      name: customer.name,
      email: customer.email,
      items: cart.length,
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('OFFERT_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka förfrågan, försök igen.' }) };
  }
};
