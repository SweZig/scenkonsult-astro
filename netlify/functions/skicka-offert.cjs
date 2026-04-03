// netlify/functions/skicka-offert.js
// Resend API — ljust mailtheme, rate limit-hantering
// Supabase-synk: skapar/uppdaterar varukorg vid offert/bokning

const { supabase: createSupabase, generateCartToken, logAudit } = require('./_lib.js');

const RATE_LIMIT = {};
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 3;
const FROM = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const TO_INTERNAL = 'info@scenkonsult.se';
const TRELLO_EMAIL = 'sunxpertadm+kvz53qihlyplkt6r9xnb@app.trello.com';
const LOGO_URL = 'https://scenkonsult.se/logo-white.png';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function htmlWrapper(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="130" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px;">Ljud &middot; Ljus &middot; Scen &middot; DJ &mdash; Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">${bodyHtml}</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
  <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:12px;">Scenkonsult Norden &middot; Grimstagatan 164, 162 58 Vallingby</p>
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">072-448 10 00 &middot; <a href="https://scenkonsult.se" style="color:#c4b5f4;text-decoration:none;">scenkonsult.se</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}


function buildPriceTable(cart, { showFakturaavgift = false } = {}) {
  const SVC_CATS = ['Tjänster', 'Tillägg'];
  const allReal  = (cart || []).filter(i => !i._note && i.name);

  const prodItems = allReal.filter(i =>
    !SVC_CATS.includes(i.category) &&
    !(i.id && i.id.startsWith('fakturaavgift'))
  );
  const svcItems  = allReal.filter(i =>
    SVC_CATS.includes(i.category) &&
    !(i.id && i.id.startsWith('fakturaavgift'))
  );
  const feeItem   = showFakturaavgift
    ? allReal.find(i => i.id && i.id.startsWith('fakturaavgift'))
    : null;
  const noteItem  = (cart || []).find(i => i._note);

  const qty  = i => i.quantity || i.qty || 1;
  const sum  = i => (i.price || 0) * qty(i);
  const fmtN = n => n.toLocaleString('sv-SE');

  const mkRow = i => `<tr>
    <td style="padding:8px 10px;color:#222;font-size:13px;border-bottom:1px solid #f0f0f5;">${i.name}</td>
    <td style="padding:8px 10px;color:#666;font-size:13px;text-align:center;border-bottom:1px solid #f0f0f5;">${qty(i)} st</td>
    <td style="padding:8px 10px;color:#333;font-size:13px;text-align:right;border-bottom:1px solid #f0f0f5;font-weight:600;">${fmtN(sum(i))} kr</td>
  </tr>`;

  const prodTotal = prodItems.reduce((s, i) => s + sum(i), 0);
  const svcTotal  = svcItems.reduce((s, i) => s + sum(i), 0);
  const feeTotal  = feeItem ? sum(feeItem) : 0;
  const grandExcl = prodTotal + svcTotal + feeTotal;
  const moms      = Math.round(grandExcl * 0.25);
  const grandIncl = grandExcl + moms;

  const noteRow = noteItem
    ? `<tr><td colspan="3" style="padding:6px 10px;color:#666;font-size:12px;font-style:italic;">📝 ${noteItem.name}</td></tr>`
    : '';

  const subHeader = (label, bg = '#f7f7fb') =>
    `<tr><td colspan="3" style="padding:6px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888;background:${bg};">${label}</td></tr>`;

  const subtotalRow = (label, amount, bg, color) =>
    `<tr style="background:${bg};">
      <td colspan="2" style="padding:9px 10px;font-weight:700;font-size:13px;color:${color};">${label}</td>
      <td style="padding:9px 10px;font-weight:700;font-size:13px;text-align:right;color:${color};">${fmtN(amount)} kr</td>
    </tr>`;

  let html = `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e8;border-radius:8px;overflow:hidden;margin-top:8px;font-family:Arial,sans-serif;">
    <tr style="background:#f7f7fb;">
      <th style="padding:8px 10px;color:#888;font-size:11px;text-align:left;font-weight:600;text-transform:uppercase;">Produkt / Tjänst</th>
      <th style="padding:8px 10px;color:#888;font-size:11px;text-align:center;font-weight:600;text-transform:uppercase;width:50px;">Antal</th>
      <th style="padding:8px 10px;color:#888;font-size:11px;text-align:right;font-weight:600;text-transform:uppercase;width:90px;">Pris exkl.</th>
    </tr>`;

  if (prodItems.length > 0) {
    html += subHeader('Utrustning');
    html += prodItems.map(mkRow).join('');
    html += noteRow;
    html += subtotalRow('Utrustning exkl. moms', prodTotal, '#ddd6f5', '#1e1850');
  }

  if (svcItems.length > 0) {
    html += subHeader('Tilläggstjänster');
    html += svcItems.map(mkRow).join('');
    html += subtotalRow('Tjänster exkl. moms (estimat)', svcTotal, '#fff8ec', '#92400e');
  }

  if (feeItem) {
    html += subHeader('Fakturaavgift');
    html += mkRow(feeItem);
  }

  html += `<tr style="background:#f0f0f0;">
    <td colspan="2" style="padding:8px 10px;color:#555;font-size:12px;">Moms 25%</td>
    <td style="padding:8px 10px;text-align:right;color:#555;font-size:12px;">${fmtN(moms)} kr</td>
  </tr>
  <tr style="background:#1e1850;">
    <td colspan="2" style="padding:12px 10px;color:#fff;font-weight:700;font-size:15px;">TOTALT inkl. moms</td>
    <td style="padding:12px 10px;text-align:right;color:#c4b5f4;font-weight:700;font-size:15px;">${fmtN(grandIncl)} kr</td>
  </tr>`;

  if (svcItems.length > 0) {
    html += `<tr><td colspan="3" style="padding:6px 10px;color:#b45309;font-size:11px;">⚠ Tilläggstjänsters priser är estimat och bekräftas vid orderbekräftelse.</td></tr>`;
  }

  html += '</table>';
  return html;
}

function cartText(cart) {
  if (!cart || cart.length === 0) return 'Ingen utrustning angiven.';
  const rows = cart.map(i => `  ${i.name||''} x${i.quantity||1} — ${i.price?(i.price*(i.quantity||1)).toLocaleString('sv-SE')+' kr':'–'}`).join('\n');
  const total = cart.reduce((s,i)=>s+((i.price||0)*(i.quantity||1)),0);
  return `${rows}\n  Totalt: ${total.toLocaleString('sv-SE')} kr (exkl. moms)`;
}

function field(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:7px 0;color:#666;font-size:13px;width:130px;vertical-align:top;border-bottom:1px solid #f0f0f5;">${label}</td><td style="padding:7px 0;color:#111;font-size:14px;border-bottom:1px solid #f0f0f5;">${value}</td></tr>`;
}

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Resend ${res.status}: ${err}`); }
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  let data;
  try { data = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig data' }) }; }

  if (data.website || data.phone2 || data.honeypot) {
    console.log('SPAM_HONEYPOT');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (!RATE_LIMIT[ip]) RATE_LIMIT[ip] = [];
  RATE_LIMIT[ip] = RATE_LIMIT[ip].filter(t => now - t < RATE_WINDOW_MS);
  if (RATE_LIMIT[ip].length >= RATE_MAX) return { statusCode: 429, headers, body: JSON.stringify({ error: 'For manga forfrågningar.' }) };
  RATE_LIMIT[ip].push(now);

  const { customer, cart, sendCopy, intent } = data;
  const isBokning = intent === 'boka';

  console.log('OFFERT_INCOMING:', JSON.stringify({ name: customer?.name, email: customer?.email, sendCopy: !!sendCopy, cartLen: cart?.length, intent: intent||'offert' }));

  if (!customer?.name || !customer?.email || !customer?.phone)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Namn, e-post och telefon kravs.' }) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig e-postadress.' }) };
  if (!cart || cart.length === 0)
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Varukorgen ar tom.' }) };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'E-postkonfiguration saknas.' }) };

  // ── Supabase-synk ─────────────────────────────────────────
  // Hämta cart_id från body (skickas med från frontend sedan 2026-03-11)
  // Validera cart_id-format (SK-[8HEX]-[4HEX]) — avvisa test-ID:n och skräp
  const rawCartId = data.cart_id || null;
  const cartId = rawCartId && /^SK-[0-9A-F]{8}-[0-9A-F]{4}$/i.test(rawCartId) ? rawCartId : null;
  if (rawCartId && !cartId) console.warn('OFFERT: ogiltigt cart_id ignorerat:', rawCartId);
  let cartToken = null;
  let cartUrl   = null;

  if (cartId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const db = createSupabase();
      const totalExcl = (cart || []).reduce((s, i) => s + ((i.price || 0) * (i.quantity || i.qty || 1)), 0);

      // Återanvänd befintlig token om den finns — ny token gör gamla mail-länkar ogiltiga
      const { data: existing } = await db.from('carts').select('cart_token').eq('id', cartId).single().catch(() => ({ data: null }));
      cartToken = existing?.cart_token || generateCartToken();

      await db.upsert('carts', {
        id:               cartId,
        status:           'open',
        items:            cart || [],
        customer_name:    customer.name,
        customer_email:   customer.email,
        customer_phone:   customer.phone,
        customer_message: customer.notes || '',
        event_date:       customer.from || null,
        event_location:   customer.address || '',
        total_excl:       totalExcl * 100,
        cart_token:       cartToken,
        expires_at:       new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
      });

      cartUrl = `https://scenkonsult.se/order/?cart=${cartId}&token=${cartToken}`;
      await logAudit(db, cartId, 'customer', 'proposal_sent', { intent: intent || 'offert' });
      console.log('SUPABASE_SYNC_OK:', cartId);
    } catch (supaErr) {
      // Mjuk felhantering — mail skickas ändå
      console.error('SUPABASE_SYNC_ERROR:', supaErr.message);
    }
  }
  // ─────────────────────────────────────────────────────────

  const datumStr = customer.from && customer.to ? `${customer.from} – ${customer.to}` : (customer.from || customer.to || '');
  const subjectTag = isBokning ? '⭐ BOKNING' : 'Offertförfrågan';
  const headingText = isBokning ? '⭐ Bokningsönskan' : 'Ny offertförfrågan';
  const headingNote = isBokning
    ? 'Kunden önskar boka — bekräfta tillgänglighet och skicka bokningsbekräftelse.'
    : 'Mottaget via scenkonsult.se';

  const plainInternal = `${headingText}\n\nNamn: ${customer.name}\nE-post: ${customer.email}\nTelefon: ${customer.phone}\nForetag: ${customer.company||'-'}\nDatum: ${datumStr||'-'}\nAdress: ${customer.address||'-'}\nOvrigt: ${customer.notes||'-'}\n\nVarukorg:\n${cartText(cart)}\n\n---\nScenkonsult Norden | 072-448 10 00`;

  const htmlInternal = htmlWrapper(headingText, `
    <h2 style="margin:0 0 6px;color:#1e1850;font-size:20px;">${headingText}</h2>
    <p style="margin:0 0 20px;color:${isBokning?'#b45309':'#888'};font-size:13px;${isBokning?'font-weight:700;':''}"">${headingNote}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${field('Namn', customer.name)}
      ${field('E-post', `<a href="mailto:${customer.email}" style="color:#1e1850;">${customer.email}</a>`)}
      ${field('Telefon', `<a href="tel:${customer.phone}" style="color:#1e1850;">${customer.phone}</a>`)}
      ${field('Foretag', customer.company)}
      ${field('Datum', datumStr)}
      ${field('Adress', customer.address)}
      ${field('Ovrigt', customer.notes)}
    </table>
    <p style="margin:0 0 10px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Varukorg</p>
    ${buildPriceTable(cart, { showFakturaavgift: false })}
    <p style="margin:16px 0 0;font-size:13px;color:#555;">Svara direkt till: <a href="mailto:${customer.email}" style="color:#1e1850;">${customer.email}</a></p>
    <p style="margin:12px 0 0;"><a href="https://scenkonsult.se/admin/" style="background:#332885;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Adminpanel →</a></p>`);

  try {
    console.log('ADMIN_MAIL_SENDING to:', TO_INTERNAL);
    await sendEmail(apiKey, { from: FROM, to: [TO_INTERNAL], reply_to: customer.email, subject: `${subjectTag} från ${customer.name}`, html: htmlInternal, text: plainInternal });
    console.log('ADMIN_MAIL_SENT ok');
    await sleep(600);

    try {
      await sendEmail(apiKey, { from: FROM, to: [TRELLO_EMAIL], subject: `${subjectTag}: ${customer.name} — ${datumStr}`, html: htmlInternal, text: plainInternal });
    } catch (e) { console.error('TRELLO_COPY_ERROR:', e.message); }

    if (sendCopy && customer.email) {
      await sleep(600);
      console.log('KUNDKOPIA_SENDING to:', customer.email);
      try {
        const customerTitle = isBokning ? 'Din bokningsönskan är mottagen' : 'Din offertförfrågan är mottagen';
        const customerIntro = isBokning
          ? `Vi har tagit emot din bokningsönskan och återkommer vardagar 09:00-17:00 med en bekräftelse. Frågor? Ring oss på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a>.`
          : `Vi har tagit emot din förfrågan och återkommer vardagar 09:00-17:00 med en offert. <strong>Observera att alla priser i sammanställningen nedan är preliminära</strong> — vi bekräftar det slutliga priset i offerten. Frågor? Ring oss på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a>.`;
        const plainCustomer = `Tack, ${customer.name}!\n\n${isBokning?'Vi har tagit emot din bokningsönskan':'Vi har tagit emot din förfrågan'} och aterkommer vardagar 09:00-17:00.\nFragor? Ring oss pa 072-448 10 00.\n\nDin bestallning:\n${cartText(cart)}\n${datumStr?'\nDatum: '+datumStr:''}\n${cartUrl ? 'Följ din order: ' + cartUrl + '\n' : ''}\n---\nScenkonsult Norden | scenkonsult.se`;
        const htmlCustomer = htmlWrapper(customerTitle, `
          <h2 style="margin:0 0 16px;color:#1e1850;font-size:22px;">Tack, ${customer.name}!</h2>
          <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 24px;">${customerIntro}</p>
          <p style="margin:0 0 10px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Din bestallning</p>
          ${buildPriceTable(cart, { showFakturaavgift: false })}
          ${datumStr ? `<p style="margin:14px 0 0;color:#666;font-size:13px;">Datum: ${datumStr}</p>` : ''}
          ${cartUrl ? `<p style="margin:24px 0 0;"><a href="${cartUrl}" style="background:#332885;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">Följ din order →</a></p><p style="margin:10px 0 0;color:#888;font-size:12px;">Via länken kan du följa status och skicka meddelanden till oss.</p>` : ''}`);
        await sendEmail(apiKey, { from: FROM, to: [customer.email], subject: isBokning ? 'Din bokningsönskan hos Scenkonsult Norden' : 'Din offertförfrågan till Scenkonsult Norden', html: htmlCustomer, text: plainCustomer });
        console.log('KUNDKOPIA_SENT to:', customer.email);
      } catch (e) { console.error('KUNDKOPIA_ERROR:', e.message); }
    }

    console.log('OFFERT_OK:', JSON.stringify({ ip, name: customer.name, items: cart.length, sendCopy: !!sendCopy }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('OFFERT_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kunde inte skicka forfragan, forsok igen.' }) };
  }
};
