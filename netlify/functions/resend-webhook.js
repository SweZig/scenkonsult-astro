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

  // Mottagaradress ur payloaden — används som fallback-matchning om message-id
  // inte kopplar (t.ex. äldre offerter, faktura/påminnelse, eller race där
  // last_quote_message_id ännu inte hunnit sparas).
  let recipientEmail = null;
  const rawTo = data.to;
  if (Array.isArray(rawTo) && rawTo.length) recipientEmail = String(rawTo[0]).trim().toLowerCase();
  else if (typeof rawTo === 'string' && rawTo) recipientEmail = rawTo.trim().toLowerCase();

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

  // Hitta cart — primärt på message-id, sekundärt på mottagaradress.
  const db = supabase();
  let cart = null;
  let matchMethod = null;

  // 1) Primär matchning: last_quote_message_id === emailId
  try {
    const { data: row } = await db.from('carts')
      .select('id, status, customer_name, customer_email')
      .eq('last_quote_message_id', emailId)
      .single();
    if (row) { cart = row; matchMethod = 'message_id'; }
  } catch (e) {
    console.error('RESEND_WEBHOOK: DB-fel vid message_id-lookup:', e.message);
    return { statusCode: 500, body: JSON.stringify({ ok: false, db_error: true }) };
  }

  // 2) Fallback: senaste icke-avslutade cart med matchande mottagaradress.
  //    Täcker offerter skickade innan message-id sparades, samt faktura/
  //    påminnelse-bounces (de lagrar inte last_quote_message_id).
  if (!cart && recipientEmail) {
    try {
      const { data: rows } = await db.from('carts')
        .select('id, status, customer_name, customer_email, updated_at')
        .eq('customer_email', recipientEmail)
        .neq('status', 'cancelled')
        .order('updated_at', { ascending: false })
        .limit(1);
      if (Array.isArray(rows) && rows.length) { cart = rows[0]; matchMethod = 'email_fallback'; }
    } catch (e) {
      console.error('RESEND_WEBHOOK: DB-fel vid email-fallback:', e.message);
      // fortsätt — vi loggar no_match nedan
    }
  }

  if (!cart) {
    // Ingen cart matchade. Logga tydligt så det går att felsöka i Netlify-loggen.
    console.warn('RESEND_WEBHOOK: INGEN cart matchade', JSON.stringify({
      event: evtType, email_id: emailId, recipient: recipientEmail || '(saknas)',
    }));
    return { statusCode: 200, body: JSON.stringify({ ok: true, no_match: true, email_id: emailId, recipient: recipientEmail }) };
  }

  try {
    await db.update('carts', {
      bounce_status: bounceStatus,
      bounce_at:     new Date().toISOString(),
      bounce_reason: reason,
    }, 'id', cart.id);

    await logAudit(db, cart.id, 'system', 'email_bounce', {
      event:        evtType,
      status:       bounceStatus,
      email:        cart.customer_email,
      reason,
      email_id:     emailId,
      match_method: matchMethod,
    });

    console.log('RESEND_WEBHOOK: bounce noterad', cart.id, bounceStatus, 'via', matchMethod);
    return { statusCode: 200, body: JSON.stringify({ ok: true, cart_id: cart.id, status: bounceStatus, match_method: matchMethod }) };
  } catch (e) {
    console.error('RESEND_WEBHOOK: fel vid update:', e.message);
    return { statusCode: 200, body: JSON.stringify({ ok: true, update_error: true }) };
  }
};
