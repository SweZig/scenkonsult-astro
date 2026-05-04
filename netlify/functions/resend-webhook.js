// netlify/functions/resend-webhook.js
// Tar emot webhook-events från Resend (email.bounced / email.complained / email.delivery_delayed)
// och uppdaterar bounce_status på den cart som har matchande last_quote_message_id.
//
// Konfigureras i Resend dashboard:
//   Endpoint:  https://scenkonsult.se/.netlify/functions/resend-webhook
//   Events:    email.bounced, email.complained, email.delivery_delayed
//   Secret:    sätts som RESEND_WEBHOOK_SECRET i Netlify env (format whsec_...)
//
// Signaturverifiering följer Svix-formatet (Resend använder Svix internt):
//   svix-id + "." + svix-timestamp + "." + body  →  HMAC-SHA256 med decoded secret  →  base64
//
// POST /.netlify/functions/resend-webhook — ingen ADMIN_TOKEN, signaturen är auth.

'use strict';
const crypto = require('crypto');
const { supabase, logAudit } = require('./_lib');

// Svix-style signaturverifiering. Returnerar true om någon av signaturerna i
// svix-signature-headern matchar. Format på header: "v1,sig1 v1,sig2 ..."
function verifySvixSignature({ secret, svixId, svixTimestamp, body, signatureHeader }) {
  if (!secret || !svixId || !svixTimestamp || !body || !signatureHeader) return false;

  // Skydd mot replay — kräv att timestamp är inom 5 minuter
  const ts = parseInt(svixTimestamp, 10);
  if (!Number.isFinite(ts)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > 300) {
    console.warn('RESEND_WEBHOOK: timestamp utanför fönstret', { ts, nowSec, diff: nowSec - ts });
    return false;
  }

  // Svix-secret har formatet whsec_<base64>
  const secretBase64 = secret.startsWith('whsec_') ? secret.slice(6) : secret;
  let secretBytes;
  try { secretBytes = Buffer.from(secretBase64, 'base64'); }
  catch { return false; }

  const signedPayload = `${svixId}.${svixTimestamp}.${body}`;
  const expectedSig = crypto.createHmac('sha256', secretBytes).update(signedPayload).digest('base64');

  // Headern kan innehålla flera versioner (space-separerade): "v1,xxxx v1,yyyy"
  const sigs = signatureHeader.split(' ').map(s => {
    const [version, value] = s.split(',');
    return { version, value };
  });

  for (const { version, value } of sigs) {
    if (version !== 'v1' || !value) continue;
    if (value.length !== expectedSig.length) continue;
    try {
      if (crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expectedSig))) return true;
    } catch { /* mismatch i längd → skip */ }
  }
  return false;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error('RESEND_WEBHOOK: RESEND_WEBHOOK_SECRET saknas i Netlify env');
    return { statusCode: 500, body: JSON.stringify({ error: 'Webhook ej konfigurerad' }) };
  }

  // Lower-case alla headers för säker uppslag (Netlify ger redan så men säkra)
  const h = {};
  for (const k of Object.keys(event.headers || {})) h[k.toLowerCase()] = event.headers[k];

  const svixId        = h['svix-id'];
  const svixTimestamp = h['svix-timestamp'];
  const svixSignature = h['svix-signature'];
  const rawBody       = event.body || '';

  const ok = verifySvixSignature({
    secret,
    svixId,
    svixTimestamp,
    body: rawBody,
    signatureHeader: svixSignature,
  });

  if (!ok) {
    console.warn('RESEND_WEBHOOK: ogiltig signatur', {
      hasId: !!svixId, hasTs: !!svixTimestamp, hasSig: !!svixSignature,
    });
    return { statusCode: 401, body: JSON.stringify({ error: 'Ogiltig signatur' }) };
  }

  let payload;
  try { payload = JSON.parse(rawBody); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Ogiltig JSON' }) }; }

  const evtType = payload.type || '';
  const data    = payload.data || {};
  const emailId = data.email_id || data.id || null;

  // Bara intresserade av leveransproblem
  const RELEVANT = {
    'email.bounced':          'bounced',
    'email.complained':       'complained',
    'email.delivery_delayed': 'delayed',
  };
  const bounceStatus = RELEVANT[evtType];

  if (!bounceStatus) {
    // Vi ger 200 OK på allt så Resend inte gör retry på events vi inte bryr oss om
    console.log('RESEND_WEBHOOK: ignorerar event-typ:', evtType);
    return { statusCode: 200, body: JSON.stringify({ ok: true, ignored: evtType }) };
  }

  if (!emailId) {
    console.warn('RESEND_WEBHOOK: email_id saknas i payload', evtType);
    return { statusCode: 200, body: JSON.stringify({ ok: true, missing_email_id: true }) };
  }

  // Bygg en kort bounce_reason för UI:n
  let reason = null;
  if (data.bounce) {
    const bt = data.bounce.type || data.bounce.bounceType || '';
    const bs = data.bounce.subType || data.bounce.bounceSubType || '';
    const msg = (data.bounce.message || '').toString().slice(0, 400);
    reason = [bt, bs].filter(Boolean).join(' / ') + (msg ? ' — ' + msg : '');
  } else if (data.complaint) {
    const ct = data.complaint.type || '';
    const fb = data.complaint.feedbackType || '';
    reason = ['Markerat som spam', ct, fb].filter(Boolean).join(' / ');
  }
  if (!reason) reason = bounceStatus === 'complained' ? 'Markerat som spam' : 'Mailet kunde inte levereras';

  // Hitta cart med matchande message-id
  const db = supabase();
  let cart;
  try {
    const { data: rows } = await db.from('carts')
      .select('id, status, customer_name, customer_email')
      .eq('last_quote_message_id', emailId)
      .limit(1)
      .single()
      .catch(() => ({ data: null }));
    cart = rows;
  } catch (e) {
    console.error('RESEND_WEBHOOK: DB-fel vid cart-lookup:', e.message);
    return { statusCode: 200, body: JSON.stringify({ ok: true, db_error: true }) };
  }

  if (!cart) {
    console.warn('RESEND_WEBHOOK: ingen cart hittades för email_id', emailId, 'event', evtType);
    return { statusCode: 200, body: JSON.stringify({ ok: true, no_match: true }) };
  }

  try {
    await db.update('carts', {
      bounce_status: bounceStatus,
      bounce_at:     new Date().toISOString(),
      bounce_reason: reason,
    }, 'id', cart.id);

    await logAudit(db, cart.id, 'system', 'email_bounce', {
      event:    evtType,
      status:   bounceStatus,
      email:    cart.customer_email,
      reason,
      email_id: emailId,
    });

    console.log('RESEND_WEBHOOK: bounce noterad', cart.id, bounceStatus);
    return { statusCode: 200, body: JSON.stringify({ ok: true, cart_id: cart.id, status: bounceStatus }) };
  } catch (e) {
    console.error('RESEND_WEBHOOK: fel vid update:', e.message);
    return { statusCode: 200, body: JSON.stringify({ ok: true, update_error: true }) };
  }
};
