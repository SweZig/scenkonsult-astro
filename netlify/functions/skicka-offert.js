// netlify/functions/skicka-offert.js
// Tar emot offertförfrågan från kunden.
// Sparar till Supabase (status: new) och skickar kvittensmail till kunden.
// Intern notis till info@ och Trello.

'use strict';
const {
  supabase: createSupabase, generateCartToken, logAudit,
  htmlWrapper, sendEmail, MAIL_FROM, escapeHtml, safeEqual,
} = require('./_lib');
const { checkMontering } = require('./_montering');

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
  // Kundläge från varukorgen: 'klar' = offert på exakt korgen, annars förslag.
  // Inget är bindande i någotdera fallet — kunden godkänner offerten senare.
  const klar = data.kundlage === 'klar';
  const ORDER_INTENT = klar ? 'klar_korg' : 'quote';

  if (!customer?.name || !customer?.email || !customer?.phone)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, e-post och telefon krävs.' }) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  if (!cart || cart.length === 0)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Varukorgen är tom.' }) };

  // Montering räknas om på servern med samma motor som varukorgen. Klientens
  // belopp ersätts vid avvikelse (loggas som MONTERING_AVVIKELSE).
  try { checkMontering(cart, { enforce: true, tag: 'OFFERT' }); }
  catch (e) { console.error('MONTERING_CHECK_ERROR:', e.message); }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'E-postkonfiguration saknas.' }) };

  // ── Supabase: spara förfrågan med status "new" ─────────────────
  const rawCartId = cart_id || null;
  let cartId = rawCartId && /^SK-[0-9A-F]{8}-[0-9A-F]{4}$/i.test(rawCartId) ? rawCartId : null;
  if (rawCartId && !cartId) console.warn('OFFERT: ogiltigt cart_id ignorerat:', rawCartId);

  if (cartId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const db = createSupabase();
      const totalExcl = (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.qty || i.quantity || 1)), 0);
      let cartToken = generateCartToken();

      // Ett befintligt cart-id återanvänds bara av samma avsändare och bara så länge
      // ordern är obehandlad ('new'). Annars får förfrågan ett nytt id — ingen kan
      // skriva över någon annans varukorg genom att känna till id:t.
      let existing = null, lookupFailed = false;
      try {
        ({ data: existing } = await db.from('carts').select('status,cart_token,customer_email').eq('id', cartId).single());
      } catch (e) { lookupFailed = true; console.warn('OFFERT_LOOKUP_ERROR:', e.message); }

      if (existing || lookupFailed) {
        // Samma ägare = har länkens cart_token, eller (eftersom varukorgen inte sparar
        // token) skickar igen med samma e-postadress. Ett id räcker aldrig ensamt.
        const sammaEpost = existing && existing.customer_email && customer.email
          && String(existing.customer_email).trim().toLowerCase() === String(customer.email).trim().toLowerCase();
        const sammaToken = existing && typeof data.cart_token === 'string' && safeEqual(data.cart_token, existing.cart_token || '');
        const sammaAgare = existing && existing.status === 'new' && (sammaToken || sammaEpost);
        if (sammaAgare) {
          cartToken = existing.cart_token;
        } else {
          const hx = require('crypto').randomBytes(6).toString('hex').toUpperCase();
          const nyttId = `SK-${hx.slice(0,8)}-${hx.slice(8,12)}`;
          console.warn('OFFERT_NYTT_ID: befintligt cart-id återanvänds inte', cartId, existing?.status || 'lookup-fel', '→', nyttId);
          cartId = nyttId;
        }
      }
      {
        const rad = {
          id:               cartId,
          status:           'new',
          order_intent:     ORDER_INTENT,
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
          delivery_mode:    selfPickup ? 'self_pickup' : 'delivery',
          total_excl:       totalExcl * 100,
          cart_token:       cartToken,
          expires_at:       new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        };
        try {
          await db.upsert('carts', rad);
        } catch (e) {
          // Tål en databas som (ännu) inte accepterar 'klar_korg' i order_intent:
          // spara som vanlig förfrågan hellre än att tappa den.
          if (ORDER_INTENT !== 'quote' && /order_intent|check constraint|invalid input value/i.test(e.message)) {
            console.warn('OFFERT: order_intent klar_korg avvisades — sparar som quote:', e.message.slice(0, 160));
            await db.upsert('carts', { ...rad, order_intent: 'quote' });
          } else throw e;
        }
        await logAudit(db, cartId, 'customer', 'inquiry_received', { kundlage: klar ? 'klar' : 'forslag' });
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

  // Kunddata escapas innan den hamnar i mail-HTML.
  const h = {
    name: escapeHtml(customer.name), email: escapeHtml(customer.email), phone: escapeHtml(customer.phone),
    company: escapeHtml(customer.company), notes: escapeHtml(customer.notes),
    datum: escapeHtml(datumStr), delivery: escapeHtml(deliveryInfo),
  };

  // ── Internt mail (fullständig info för admin) ─────────────────
  const htmlInternal = htmlWrapper(`
    <h2 style="margin:0 0 6px;color:#1e1850;font-size:20px;">${klar ? '✅ Ny offertförfrågan — klar korg' : 'Ny offertförfrågan'}</h2>
    <p style="margin:0 0 20px;color:#888;font-size:13px;">${klar ? 'Kunden är klar och vill ha offert på exakt det som ligger i korgen.' : 'Kunden vill ha förslag eller har frågor.'} Inkommen via scenkonsult.se</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:7px 0;color:#666;font-size:13px;width:130px;border-bottom:1px solid #f0f0f5;">Namn</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${h.name}</td></tr>
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">E-post</td><td style="padding:7px 0;font-size:14px;border-bottom:1px solid #f0f0f5;"><a href="mailto:${h.email}" style="color:#1e1850;">${h.email}</a></td></tr>
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Telefon</td><td style="padding:7px 0;font-size:14px;border-bottom:1px solid #f0f0f5;"><a href="tel:${h.phone}" style="color:#1e1850;">${h.phone}</a></td></tr>
      ${customer.company ? `<tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Företag</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${h.company}</td></tr>` : ''}
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Datum</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${h.datum}</td></tr>
      <tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Leverans</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${h.delivery}</td></tr>
      ${customer.notes ? `<tr><td style="padding:7px 0;color:#666;font-size:13px;border-bottom:1px solid #f0f0f5;">Övrigt</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${h.notes}</td></tr>` : ''}
    </table>
    <p style="margin:0 0 10px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Önskad utrustning</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#444;font-size:14px;line-height:1.8;">
      ${(cart||[]).filter(i=>!i._note&&i.name).map(i=>`<li>${escapeHtml(i.name)}${(i.qty||1)>1?' × '+escapeHtml(i.qty||1):''}</li>`).join('')}
    </ul>
    <p style="margin:12px 0 0;"><a href="https://scenkonsult.se/admin/" style="background:#332885;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Hantera i adminpanelen →</a></p>
  `);

  const plainInternal = `${klar ? 'Ny offertförfrågan — KLAR KORG (offert på exakt korgen)' : 'Ny offertförfrågan — vill ha förslag'}\n\nNamn: ${customer.name}\nE-post: ${customer.email}\nTelefon: ${customer.phone}\n${customer.company?'Företag: '+customer.company+'\n':''}Datum: ${datumStr}\nLeverans: ${deliveryInfo}\n${customer.notes?'Övrigt: '+customer.notes+'\n':''}\nÖnskad utrustning:\n${cartRows}\n\n---\nAdminpanel: https://scenkonsult.se/admin/`;

  // ── Kvittensmail till kunden (enkel bekräftelse, ingen produktlista) ──
  const htmlCustomer = htmlWrapper(`
    <h2 style="margin:0 0 16px;color:#1e1850;font-size:22px;">Tack, ${h.name}!</h2>
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">Vi har tagit emot din offertförfrågan och återkommer så snart vi kan. Offerten är kostnadsfri och inte bindande — du godkänner först när du fått den.</p>
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 20px;">Är det bråttom? Ring oss på <a href="tel:0724481000" style="color:#1e1850;font-weight:600;">072-448 10 00</a> eller svara på detta mail.</p>
    <div style="background:#f7f7fb;border-radius:8px;padding:16px 20px;margin-top:8px;">
      <p style="margin:0 0 6px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Din förfrågan gäller</p>
      <p style="margin:0;color:#444;font-size:14px;">📅 ${datumStr !== '–' ? h.datum : 'Datum ej angivet'}</p>
      ${deliveryInfo ? `<p style="margin:4px 0 0;color:#444;font-size:14px;">${h.delivery}</p>` : ''}
    </div>
  `);

  const plainCustomer = `Tack, ${customer.name}!\n\nVi har tagit emot din offertförfrågan och återkommer så snart vi kan. Offerten är kostnadsfri och inte bindande — du godkänner först när du fått den.\n\nÄr det bråttom? Ring 072-448 10 00 eller svara på detta mail.\n\nDin förfrågan gäller: ${datumStr}\n\n---\nScenkonsult Norden | scenkonsult.se`;

  try {
    await sendEmail(apiKey, {
      from:     MAIL_FROM,
      to:       [TO_INTERNAL],
      reply_to: customer.email,
      subject:  `${klar ? '✅ Klar korg — ' : ''}Offertförfrågan från ${customer.name}`,
      html:     htmlInternal,
      text:     plainInternal,
    });
    await sleep(600);

    try {
      await sendEmail(apiKey, {
        from:    MAIL_FROM,
        to:      [TRELLO_EMAIL],
        subject: `${klar ? 'Klar korg — ' : ''}Offertförfrågan: ${customer.name} — ${datumStr}`,
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

    console.log('OFFERT_OK:', customer.name, cart.length, 'produkter', ORDER_INTENT);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error('OFFERT_ERROR:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka förfrågan, försök igen.' }) };
  }
};
