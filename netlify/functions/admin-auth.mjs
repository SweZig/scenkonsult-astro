// netlify/functions/admin-auth.js
// Sitewide adminläge — autentisering
// POST { password } → { ok, error?, lockoutSeconds? }

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const MAX_FAILURES = 3;
const LOCKOUT_MS   = 60_000;

// In-memory rate limit per IP (återställs vid cold start)
const failures = new Map(); // ip → { count, lockedUntil }

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }

  const ip = context.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Kontrollera lockout
  const rec = failures.get(ip) || { count: 0, lockedUntil: 0 };
  if (rec.lockedUntil > now) {
    const seconds = Math.ceil((rec.lockedUntil - now) / 1000);
    return new Response(JSON.stringify({ ok: false, error: 'locked', lockoutSeconds: seconds }), {
      status: 429, headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const { password } = body || {};

  if (!password || !ADMIN_TOKEN) {
    return new Response(JSON.stringify({ ok: false, error: 'Fel lösenord' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  if (password === ADMIN_TOKEN) {
    // Rensa misslyckanden vid lyckad inloggning
    failures.delete(ip);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fel lösenord — räkna upp
  const newCount = rec.count + 1;
  const lockedUntil = newCount >= MAX_FAILURES ? now + LOCKOUT_MS : 0;
  failures.set(ip, { count: newCount, lockedUntil });

  const remaining = MAX_FAILURES - newCount;
  return new Response(JSON.stringify({
    ok: false,
    error: remaining > 0
      ? `Fel lösenord. ${remaining} försök kvar.`
      : 'För många misslyckade försök. Vänta 60 sekunder.',
    lockoutSeconds: lockedUntil > 0 ? 60 : 0,
    attemptsLeft: Math.max(0, remaining)
  }), {
    status: 401, headers: { 'Content-Type': 'application/json' }
  });
};

export const config = { path: '/api/admin-auth' };
