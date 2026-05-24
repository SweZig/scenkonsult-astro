// netlify/functions/u-resolve.js
// Netlify v2 function — hanterar /u/:token URL (kort URL för SMS-länkar).
//
// Slår upp cart via pickup_short_token och redirectar till /sign/?cart=X&token=Y
// med den fulla cart_token. Detta håller SMS-URL:en kort (8 hex)
// men bevarar säkerhets-tokenen (32 hex) som krävs av sign-submit.js.
//
// Säkerhetsnoteringar:
// - Genuint random 8-hex tokens (4.3 miljarder kombinationer) är säkra för
//   denna engångsanvändning.
// - Vid not-found returnerar vi en mjuk HTML-sida, inte 404, eftersom det
//   blir bättre UX om kund klickar på utgången länk.
// - cart_token (32 hex) skickas ALDRIG vidare till klienten — bara via
//   Location-header i redirect-responsen.

export default async (req, context) => {
  const token = context.params && context.params.token;

  // Validera token-format
  if (!token || !/^[0-9a-f]{8}$/.test(token)) {
    return new Response(buildErrorPage('Ogiltig länk', 'Länken verkar vara felaktig eller inte komplett.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supaUrl || !supaKey) {
    console.error('U_RESOLVE: Konfiguration saknas — SUPABASE_URL eller SUPABASE_SERVICE_KEY');
    return new Response('Server-fel', { status: 500 });
  }

  let cart;
  try {
    const res = await fetch(
      `${supaUrl}/rest/v1/carts?pickup_short_token=eq.${encodeURIComponent(token)}&select=id,cart_token,pickup_confirmed_at`,
      {
        headers: {
          apikey:        supaKey,
          Authorization: `Bearer ${supaKey}`,
        },
      }
    );
    if (!res.ok) {
      console.error('U_RESOLVE: Supabase-fel', res.status);
      return new Response('Server-fel', { status: 500 });
    }
    const rows = await res.json();
    cart = rows && rows[0];
  } catch (e) {
    console.error('U_RESOLVE: Fetch-fel:', e.message);
    return new Response('Server-fel', { status: 500 });
  }

  if (!cart) {
    return new Response(buildErrorPage(
      'Länken hittades inte',
      'Antingen har länken gått ut eller så har den blivit ogiltig. Hör av dig till oss på 072-448 10 00 så hjälper vi dig.'
    ), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Redirect till sign-flödet med fulla cart_token
  // (sign-page läser sedan ?cart=X&token=Y från URL)
  const target = `/sign/?cart=${encodeURIComponent(cart.id)}&token=${encodeURIComponent(cart.cart_token)}`;
  return Response.redirect(new URL(target, req.url), 302);
};

export const config = { path: '/u/:token' };

// ── Helper för felmeddelande-HTML ────────────────────────────────────────────
function buildErrorPage(title, body) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeHtml(title)} — Scenkonsult Norden</title>
<style>
  body { margin:0; padding:0; background:#0c0a24; color:#fff; font-family:Helvetica,Arial,sans-serif; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem }
  .card { max-width:420px; width:100%; background:#1e1850; border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:2rem 1.5rem; text-align:center }
  .icon { font-size:3rem; margin-bottom:1rem }
  h1 { font-size:1.4rem; margin:0 0 0.5rem; color:#fff }
  p { color:rgba(255,255,255,0.72); line-height:1.5; margin:0.5rem 0 1.5rem; font-size:0.95rem }
  a { display:inline-block; background:#c4b5f4; color:#0c0a24; padding:0.7rem 1.4rem; border-radius:8px; text-decoration:none; font-weight:600; font-size:0.9rem }
  a:hover { background:#e2dcfb }
</style>
</head>
<body>
  <div class="card">
    <div class="icon">⚠️</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(body)}</p>
    <a href="tel:0724481000">📞 Ring 072-448 10 00</a>
  </div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s || '').replace(/[<>&"']/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'
  })[c]);
}
