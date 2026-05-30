// netlify/functions/sign-submit.js
// Tar emot Beställarens kvittens vid utlämning — signatur, leg-foto,
// och uppgifter om bud (vid självhämtning) eller kontaktperson (vid leverans).
// POST { cart_id, token, signature_data, id_photo_data,
//        pickup_method?, pickup_proxy_name?, pickup_proxy_phone?,
//        delivery_recipient_method?, delivery_recipient_name?, delivery_recipient_phone? }

'use strict';
const { supabase, ok, err, preflight, logAudit, rateLimit,
        htmlWrapper, sendEmail, MAIL_FROM } = require('./_lib');
const { sendSms } = require('./_sms');

const ADMIN_NOTIFY_EMAIL = 'info@scenkonsult.se';

// ─── Adminavi-mail när kund signerat förberedelsen ─────────────────────
// Skickas EN gång per cart, låst via prepared_email_sent_at.
// Admin kan resetta via admin-reset-pickup.js om de vill testa igen.
function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildPreparedNotifyEmail(cart, opts = {}) {
  const isDelivery = cart.delivery_mode === 'delivery';
  const modeWord   = isDelivery ? 'leverans' : 'utlämning';
  const modeIcon   = isDelivery ? '🚚' : '📦';
  const adminUrl   = `https://scenkonsult.se/admin/?cart=${cart.id}`;
  const name       = escapeHtml(cart.customer_name || 'Okänd kund');
  const company    = cart.customer_company ? ` (${escapeHtml(cart.customer_company)})` : '';
  const eventDate  = cart.event_date
    ? new Date(cart.event_date + 'T00:00:00').toLocaleDateString('sv-SE',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '–';
  const time       = escapeHtml(cart.delivery_time || (isDelivery ? '09:00' : '13:00'));
  const place      = isDelivery
    ? escapeHtml(cart.event_location || 'Adress saknas')
    : 'Grimstagatan 164, Vällingby';

  // Produktlista (kompakt)
  const items = Array.isArray(cart.items) ? cart.items.filter(i => !i._note && i.name) : [];
  const itemsHtml = items.length
    ? `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:12px 0 4px;font-size:14px;">
         ${items.map(i => `
           <tr>
             <td style="padding:4px 0;color:#1e1850;">${escapeHtml(i.name)}</td>
             <td style="padding:4px 0;color:#666;text-align:right;white-space:nowrap;">×${i.qty || 1}</td>
           </tr>`).join('')}
       </table>`
    : '<p style="color:#888;font-style:italic;margin:8px 0;">Inga produkter i ordern</p>';

  // Proxy/recipient-info
  let extraInfo = '';
  if (opts.pickup_method === 'proxy' && opts.pickup_proxy_name) {
    extraInfo = `<tr>
      <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;">Bud:</td>
      <td style="padding:6px 0;color:#1e1850;font-size:14px;"><strong>${escapeHtml(opts.pickup_proxy_name)}</strong> · ${escapeHtml(opts.pickup_proxy_phone || '–')}</td>
    </tr>`;
  } else if (opts.delivery_recipient_method === 'other' && opts.delivery_recipient_name) {
    extraInfo = `<tr>
      <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;">Mottagare:</td>
      <td style="padding:6px 0;color:#1e1850;font-size:14px;"><strong>${escapeHtml(opts.delivery_recipient_name)}</strong> · ${escapeHtml(opts.delivery_recipient_phone || '–')}</td>
    </tr>`;
  }

  const body = `
    <h2 style="margin:0 0 8px;color:#1e1850;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:22px;">✍ Kunden har förberett ${modeWord}</h2>
    <p style="margin:0 0 18px;color:#555;font-size:14px;">
      <strong>${name}</strong>${company} har signerat sin del — utrustningen behöver motkvitteras vid ${modeWord}.
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f8f8fc;border-radius:8px;padding:0;margin:0 0 18px;">
      <tr><td style="padding:14px 16px;">
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;">Order:</td>
            <td style="padding:6px 0;color:#1e1850;font-size:14px;font-family:monospace;">${escapeHtml(cart.id)}</td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;">${modeIcon} ${isDelivery ? 'Leverans' : 'Hämtning'}:</td>
            <td style="padding:6px 0;color:#1e1850;font-size:14px;">${eventDate} kl ${time}</td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">Plats:</td>
            <td style="padding:6px 0;color:#1e1850;font-size:14px;">${place}</td>
          </tr>
          ${extraInfo}
        </table>
      </td></tr>
    </table>

    <h3 style="margin:18px 0 4px;color:#1e1850;font-size:15px;">Utrustning att lämna ut</h3>
    ${itemsHtml}

    <div style="margin:24px 0 8px;text-align:center;">
      <a href="${adminUrl}" style="display:inline-block;background:#1e1850;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Öppna i adminpanelen →</a>
    </div>

    <p style="margin:18px 0 0;color:#888;font-size:12px;text-align:center;">
      Detta mail skickas en gång per order när kunden förbereder ${modeWord}.<br>
      Status &quot;✍ Förberedd&quot; syns på kortet i kanban tills du motkvitterar.
    </p>
  `;

  return {
    subject: `✍ Kund har förberett ${modeWord} — ${cart.customer_name || 'Okänd'} (${cart.id})`,
    html:    htmlWrapper(body),
    text:    `${cart.customer_name || 'Okänd kund'} har förberett ${modeWord} för order ${cart.id}.\n\n` +
             `${isDelivery ? 'Leverans' : 'Hämtning'}: ${eventDate} kl ${time}\nPlats: ${place}\n\n` +
             `Öppna i admin: ${adminUrl}`,
  };
}

// ─── Hjälpare för SMS-text ─────────────────────────────────────────────
function getFirstName(fullName) {
  const first = String(fullName || '').trim().split(/\s+/)[0];
  return first || 'där';
}
function formatWeekday(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(String(dateStr) + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('sv-SE', { weekday: 'long', timeZone: 'Europe/Stockholm' });
  } catch (_) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (rateLimit(ip, 5)) return err('För många förfrågningar', 429);

  let body;
  try {
    let raw = event.body || '';
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, 'base64').toString('utf-8');
    body = JSON.parse(raw || '{}');
  } catch (e) {
    return err('Ogiltig JSON', 400);
  }

  const {
    cart_id, token, signature_data, id_photo_data,
    // Nya fält i v3 (Batch 3):
    pickup_method,                    // 'self' | 'proxy' (vid självhämtning)
    pickup_proxy_name, pickup_proxy_phone,
    delivery_recipient_method,        // 'self' | 'other' (vid leverans)
    delivery_recipient_name, delivery_recipient_phone,
  } = body;

  if (!cart_id || !token)         return err('cart_id och token krävs', 400);
  if (!signature_data)             return err('Signatur saknas', 400);
  if (!signature_data.startsWith('data:image/'))
                                   return err('Ogiltig signatur-data', 400);

  // Storlekskontroll (max 500KB per fält)
  const MAX = 512 * 1024;
  if (signature_data.length > MAX) return err('Signaturen är för stor', 400);
  if (id_photo_data && id_photo_data.length > MAX * 4)
                                   return err('Fotot är för stort', 400);

  // Validera proxy/recipient-fält
  if (pickup_method && !['self', 'proxy'].includes(pickup_method)) {
    return err('pickup_method måste vara self eller proxy', 400);
  }
  if (delivery_recipient_method && !['self', 'other'].includes(delivery_recipient_method)) {
    return err('delivery_recipient_method måste vara self eller other', 400);
  }
  if (pickup_method === 'proxy') {
    if (!pickup_proxy_name || !pickup_proxy_name.trim()) {
      return err('Bud kräver namn (pickup_proxy_name)', 400);
    }
    if (!pickup_proxy_phone || !pickup_proxy_phone.trim()) {
      return err('Bud kräver mobilnummer (pickup_proxy_phone)', 400);
    }
  }
  if (delivery_recipient_method === 'other') {
    if (!delivery_recipient_name || !delivery_recipient_name.trim()) {
      return err('Kontaktperson kräver namn (delivery_recipient_name)', 400);
    }
    if (!delivery_recipient_phone || !delivery_recipient_phone.trim()) {
      return err('Kontaktperson kräver mobilnummer (delivery_recipient_phone)', 400);
    }
  }

  const db = supabase();
  try {
    const { data: cart, error } = await db
      .from('carts')
      .select('id, status, cart_token, customer_name, customer_email, customer_company, pickup_signed_at, prepared_email_sent_at, delivery_mode, event_date, delivery_time, event_location, items')
      .eq('id', cart_id)
      .eq('cart_token', token)
      .single();

    if (error || !cart) return err('Varukorg hittades ej eller ogiltig token', 404);
    if (cart.pickup_signed_at) return err('Utlämningen är redan kvitterad', 409);

    const updates = {
      pickup_signature:  signature_data,
      pickup_signed_at:  new Date().toISOString(),
      pickup_sign_ip:    ip,
    };
    if (id_photo_data) updates.pickup_id_photo = id_photo_data;

    // Proxy/recipient-data — endast en av setarna används baserat på delivery_mode.
    // Vi accepterar dock båda för säkerhet — om frontend skickar fel kan adminpanelen
    // se vilket fält som faktiskt är ifyllt.
    if (pickup_method) {
      updates.pickup_method = pickup_method;
      if (pickup_method === 'proxy') {
        updates.pickup_proxy_name  = pickup_proxy_name.trim();
        updates.pickup_proxy_phone = pickup_proxy_phone.trim();
      } else {
        // pickup_method='self' — nollställ ev. tidigare proxy-data
        updates.pickup_proxy_name  = null;
        updates.pickup_proxy_phone = null;
      }
    }
    if (delivery_recipient_method) {
      updates.delivery_recipient_method = delivery_recipient_method;
      if (delivery_recipient_method === 'other') {
        updates.delivery_recipient_name  = delivery_recipient_name.trim();
        updates.delivery_recipient_phone = delivery_recipient_phone.trim();
      } else {
        updates.delivery_recipient_name  = null;
        updates.delivery_recipient_phone = null;
      }
    }

    await db.update('carts', updates, 'id', cart_id);

    // ─── SMS till bud/mottagare (om angivet) ──────────────────────────────
    // Skickas direkt efter att beställaren signerat förberedelsen så att
    // budet/mottagaren får förvarning om att de förväntas på plats.
    // Fel i SMS-utskicket får INTE misslyckas hela kvittensen — bara loggas.
    let proxySmsResult = null;
    try {
      const customerFirst = getFirstName(cart.customer_name);
      const weekday = formatWeekday(cart.event_date);

      if (pickup_method === 'proxy' && pickup_proxy_phone) {
        const proxyFirst = getFirstName(pickup_proxy_name);
        const time = cart.delivery_time || '13:00';
        const when = weekday ? `${weekday} ${time}` : `enligt avtal kl ${time}`;
        const msg = `Hej ${proxyFirst}! ${customerFirst} har angett dig som hämtare av utrustning hos Scenkonsult. Hämtning ${when}, Grimstagatan 164, Vällingby. Glöm inte att ta med giltig legitimation`;
        proxySmsResult = await sendSms(pickup_proxy_phone, msg);
      } else if (delivery_recipient_method === 'other' && delivery_recipient_phone) {
        const recipFirst = getFirstName(delivery_recipient_name);
        const time = cart.delivery_time || '09:00';
        const when = weekday ? `${weekday} ca ${time}` : `enligt avtal, ca kl ${time}`;
        const address = cart.event_location || '(adress enligt avtal)';
        const msg = `Hej ${recipFirst}! ${customerFirst} har angett dig som mottagare av utrustning hos Scenkonsult. Leverans sker ${when}, ${address}. Glöm inte att du behöver kunna visa giltig legitimation`;
        proxySmsResult = await sendSms(delivery_recipient_phone, msg);
      }
    } catch (smsErr) {
      console.error('PROXY_SMS_ERROR:', smsErr.message);
      proxySmsResult = { ok: false, error: smsErr.message };
    }

    // ─── Adminavi-mail till info@scenkonsult.se ───────────────────────────
    // Skickas EN gång per cart, låst via prepared_email_sent_at-fältet.
    // Fel i mailet ska INTE misslyckas hela kvittensen — bara loggas.
    let preparedMailResult = null;
    if (!cart.prepared_email_sent_at) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn('PREPARED_NOTIFY: RESEND_API_KEY saknas — hoppar över mail');
        preparedMailResult = { ok: false, error: 'no_api_key' };
      } else {
        try {
          const mail = buildPreparedNotifyEmail(cart, {
            pickup_method, pickup_proxy_name, pickup_proxy_phone,
            delivery_recipient_method, delivery_recipient_name, delivery_recipient_phone,
          });
          await sendEmail(apiKey, {
            from:    MAIL_FROM,
            to:      [ADMIN_NOTIFY_EMAIL],
            subject: mail.subject,
            html:    mail.html,
            text:    mail.text,
            reply_to: cart.customer_email || undefined,
          });
          // Lås så vi inte spammar — admin kan resetta via admin-reset-pickup.js
          const sentAt = new Date().toISOString();
          await db.update('carts', { prepared_email_sent_at: sentAt }, 'id', cart_id);
          preparedMailResult = { ok: true, sent_at: sentAt };
        } catch (mailErr) {
          console.error('PREPARED_NOTIFY_ERROR:', mailErr.message);
          preparedMailResult = { ok: false, error: mailErr.message };
        }
      }
    } else {
      preparedMailResult = { ok: false, error: 'already_sent' };
    }

    await logAudit(db, cart_id, 'customer', 'pickup_signed', {
      ip,
      has_id_photo:               !!id_photo_data,
      pickup_method:              pickup_method || null,
      delivery_recipient_method:  delivery_recipient_method || null,
      has_proxy:                  pickup_method === 'proxy',
      has_recipient:              delivery_recipient_method === 'other',
      proxy_sms_sent:             proxySmsResult ? proxySmsResult.ok : false,
      proxy_sms_error:            proxySmsResult && !proxySmsResult.ok ? proxySmsResult.error : null,
      admin_mail_sent:            preparedMailResult ? preparedMailResult.ok : false,
      admin_mail_error:           preparedMailResult && !preparedMailResult.ok ? preparedMailResult.error : null,
    });

    return ok({
      signed:           true,
      cart_id,
      signed_at:        updates.pickup_signed_at,
      proxy_sms_sent:   proxySmsResult ? proxySmsResult.ok : null,
      proxy_sms_error:  proxySmsResult && !proxySmsResult.ok ? proxySmsResult.error : null,
    });
  } catch (e) {
    console.error('SIGN_SUBMIT_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
