// netlify/functions/skicka-offert.js
// Spam-skydd: honeypot, rate limit per IP, innehållsvalidering
// Extra: Trello-kopia + kundkopia om begärd

const RATE_LIMIT = {};
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 3;
const NETLIFY_URL = 'https://scenkonsult-astro.netlify.app/';
const TRELLO_EMAIL = 'sunxpertadm+kvz53qihlyplkt6r9xnb@app.trello.com';

async function postForm(formName, fields) {
  const formData = new URLSearchParams({ 'form-name': formName, ...fields });
  const resp = await fetch(NETLIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
  if (!resp.ok && resp.status !== 303) throw new Error(`Netlify Forms (${formName}) svarade ${resp.status}`);
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

  const sharedFields = {
    name: customer.name, email: customer.email, phone: customer.phone,
    company: customer.company || '', datum_from: customer.from || '',
    datum_to: customer.to || '', adress: customer.address || '',
    meddelande: customer.notes || '', varukorg: msgBody || '', reply_to: customer.email,
  };

  try {
    await postForm('offertforfragan', sharedFields);

    try { await postForm('trello-kopia', { ...sharedFields, trello_to: TRELLO_EMAIL, formular: 'Offertförfrågan' }); }
    catch (e) { console.error('TRELLO_COPY_ERROR:', e.message); }

    if (sendCopy && customer.email) {
      try { await postForm('kundkopia', { email: customer.email, namn: customer.name, formular: 'Offertförfrågan', sammanfattning: msgBody || '' }); }
      catch (e) { console.error('KUNDKOPIA_ERROR:', e.message); }
    }

    console.log('OFFERT_OK:', JSON.stringify({ ip, name: customer.name, email: customer.email, items: cart.length, sendCopy: !!sendCopy }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('OFFERT_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka förfrågan, försök igen.' }) };
  }
};
