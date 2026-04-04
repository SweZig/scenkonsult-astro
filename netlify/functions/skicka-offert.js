// netlify/functions/skicka-offert.js
// Tar emot offertförfrågan från kunden.
// Sparar till Supabase (status: new) och skickar kvittensmail till kunden.
// Intern notis till info@ och Trello.

'use strict';
const {
  supabase: createSupabase, generateCartToken, logAudit,
  htmlWrapper, sendEmail, MAIL_FROM,
} = require('./_lib');

const RATE_LIMIT    = {};
const RATE_WINDOW   = 60 * 1000;
const RATE_MAX      = 3;
const TO_INTERNAL   = 'info@scenkonsult.se';
const TRELLO_EMAIL  = 'sunxpertadm+kvz53qihlyplkt6r9xnb@app.trello.com';
const sleep         = ms => new Promise(r => setTimeout(r, ms));

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method not allowed' };

  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  let data;
  try { data = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig data' }) }; }

  // Spam-skydd
  if (data.website || data.phone2 || data.honeypot) {
    console.log('SPAM_HONEYPOT');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW);
  if (RATE_LIMIT[ip].length >= RATE_MAX)
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'För många förfrågningar.' }) };
  RATE_LIMIT[ip].push(now);

  const { customer, cart, cart_id, selfPickup } = data;

  if (!customer?.name || !customer?.email || !customer?.phone)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, e-post och telefon krävs.' }) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  if (!cart || cart.length === 0)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Varukorgen är tom.' }) };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'E-postkonfiguration saknas.' }) };

  // ── Supabase: spara förfrågan med status "new" ─────────────────
  const rawCartId = cart_id || null;
  const cartId = rawCartId && /^SK-[0-9A-F]{8}-[0-9A-F]{4}$/i.test(rawCartId) ? rawCartId : null;
  if (rawCartId && !cartId) console.warn('OFFERT: ogiltigt cart_id ignorerat:', rawCartId);

  if (cartId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const db = createSupabase();
      const totalExcl = (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.qty || i.quantity || 1)), 0);
      const cartToken = generateCartToken();

      // Skydda befintliga hanterade ordrar
      const { data: existing } = await db.from('carts')
        .select('status').eq('id', cartId).single().catch(() => ({ data: null }));

      const PROTECTED = ['waiting', 'confirmed', 'fakturerad', 'betald'];
      if (existing && PROTECTED.includes(existing.status)) {
        console.error('OFFERT_BLOCKED: Försök att skriva över skyddad cart', cartId, existing.status);
      } else {
        await db.upsert('carts', {
          id:               cartId,
          status:           'new',
          order_intent:     'quote',
          items:            cart || [],
          customer_name:    customer.name,
          customer_email:   customer.email,
          customer_phone:   customer.phone,
          customer_message: customer.notes || '',
          customer_company: customer.company || null,
          customer_orgnr:   customer.orgnr   || null,
          customer_type:    customer.company ? 'b2b' : 'b2c',
          event_date:       customer.from     || null,
          return_date:      customer.to       || null,
          delivery_time:    customer.delivery_time || '13:00',
          return_time:      customer.return_time   || '11:00',
          event_location:   selfPickup ? 'Självhämtning — Grimstagatan 164, Vällingby' : (customer.address || ''),
          total_excl:       totalExcl * 100,
          cart_token:       cartToken,
          expires_at:       new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        });
        await logAudit(db, cartId, 'customer', 'inquiry_received', {});
        console.log('SUPABASE_SYNC_OK:', cartId);
      }
    } catch (e) {
      console.error('SUPABASE_SYNC_ERROR:', e.message);
    }
  }

  // ── Bygg textsammanfattning för internt mail ───────────────────
  const datumStr = customer.from && customer.to
    ? `${customer.from} – ${customer.to}`
    : (customer.from || customer.to || '–');

  const cartRows = (cart || [])
    .filter(i => !i._note && i.name)
    .map(i => `  ${i.name} × ${i.qty || 1}`)
    .join('\n');

  const deliveryInfo = selfPickup
    ? '🏠 Självhämtning — Grimstagatan 164, Vällingby (tidsbokning)'
    : `📍 ${customer.address || '–'}`;

  // ── Internt mail (fullständig info för admin) ─────────────────
  const htmlInternal = htmlWrapper(`
    <h2 style="margin:0 0 6px;color:#1e1850;font-size:20px;">Ny offertförfrågan</h2>
    <p style="margin:0 0 20px;color:#888;font-size:13px;">Inkommen via scenkonsult.se</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:7px 0;color:#666;font-size:13px;width:130px;border-bottom:1px solid #f0f0f5;">Namn</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${customer.name}</td></tr>
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">E-post</td><td style="padding:7px 0;font-size:14px;border-bottom:1px solid #f0f0f5;"><a href="mailto:${customer.email}" style="color:#1e1850;">${customer.email}</a></td></tr>
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Telefon</td><td style="padding:7px 0;font-size:14px;border-bottom:1px solid #f0f0f5;"><a href="tel:${customer.phone}" style="color:#1e1850;">${customer.phone}</a></td></tr>
      ${customer.company ? `<tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Företag</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${customer.company}</td></tr>` : ''}
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Datum</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${datumStr}</td></tr>
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Leverans</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${deliveryInfo}</td></tr>
      ${customer.notes ? `<tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Övrigt</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${customer.notes}</td></tr>` : ''}
    </table>
    <p style="margin:0 0 10px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Önskad utrustning</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#444;font-size:14px;line-height:1.8;">
      ${(cart||[]).filter(i=>!i._note&&i.name).map(i=>`<li>${i.name}${(i.qty||1)>1?' × '+(i.qty||1):''}</li>`).join('')}
    </ul>
    <p style="margin:12px 0 0;"><a href="https://scenkonsult.se/admin/" style="background:#332885;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Hantera i adminpanelen →</a></p>
  `);

  const plainInternal = `Ny offertförfrågan\n\nNamn: ${customer.name}\nE-post: ${customer.email}\nTelefon: ${customer.phone}\n${customer.company?'Företag: '+customer.company+'\n':''}Datum: ${datumStr}\nLeverans: ${deliveryInfo}\n${customer.notes?'Övrigt: '+customer.notes+'\n':''}\nÖnskad utrustning:\n${cartRows}\n\n---\nAdminpanel: https://scenkonsult.se/admin/`;

  // ── Kvittensmail till kunden (enkel bekräftelse, ingen produktlista) ──
  const htmlCustomer = htmlWrapper(`
    <h2 style="margin:0 0 16px;color:#1e1850;font-size:22px;">Tack, ${customer.name}!</h2>
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">Vi har tagit emot din offertförfrågan och återkommer till dig inom kort — vanligtvis inom en arbetsdag.</p>
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">Har du frågor i mellantiden? Ring oss på <a href="tel:0724481000" style="color:#1e1850;font-weight:600;">072-448 10 00</a> eller svara på detta mail.</p>
    <div style="background:#f7f7fb;border-radius:8px;padding:16px 20px;margin-top:8px;">
      <p style="margin:0 0 6px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Din förfrågan gäller</p>
      <p style="margin:0;color:#444;font-size:14px;">📅 ${datumStr !== '–' ? datumStr : 'Datum ej angivet'}</p>
      ${deliveryInfo ? `<p style="margin:4px 0 0;color:#444;font-size:14px;">${deliveryInfo}</p>` : ''}
    </div>
  `);

  const plainCustomer = `Tack, ${customer.name}!\n\nVi har tagit emot din offertförfrågan och återkommer inom kort.\n\nFrågor? Ring 072-448 10 00 eller svara på detta mail.\n\nDin förfrågan gäller: ${datumStr}\n\n---\nScenkonsult Norden | scenkonsult.se`;

  try {
    await sendEmail(apiKey, {
      from:     MAIL_FROM,
      to:       [TO_INTERNAL],
      reply_to: customer.email,
      subject:  `Offertförfrågan från ${customer.name}`,
      html:     htmlInternal,
      text:     plainInternal,
    });
    await sleep(600);

    try {
      await sendEmail(apiKey, {
        from:    MAIL_FROM,
        to:      [TRELLO_EMAIL],
        subject: `Offertförfrågan: ${customer.name} — ${datumStr}`,
        html:    htmlInternal,
        text:    plainInternal,
      });
    } catch (e) { console.error('TRELLO_ERROR:', e.message); }

    await sleep(600);
    await sendEmail(apiKey, {
      from:     MAIL_FROM,
      to:       [customer.email],
      reply_to: TO_INTERNAL,
      subject:  'Din offertförfrågan till Scenkonsult Norden',
      html:     htmlCustomer,
      text:     plainCustomer,
    });

    console.log('OFFERT_OK:', customer.name, cart.length, 'produkter');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error('OFFERT_ERROR:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka förfrågan, försök igen.' }) };
  }
};
