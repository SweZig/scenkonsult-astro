// netlify/functions/admin-send-quote.js
// Admin skapar och skickar en offert till en kund
// POST /.netlify/functions/admin-send-quote
// Kräver ADMIN_TOKEN

'use strict';
const { supabase: createSupabase, generateCartToken, isAdmin, logAudit, ok, err, preflight } = require('./_lib');

const FROM      = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const LOGO_URL  = 'https://scenkonsult.se/logo-white.png';
const SITE_URL  = 'https://scenkonsult.se';
const sleep     = ms => new Promise(r => setTimeout(r, ms));

function htmlWrapper(bodyHtml) {
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="130" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px;">Ljud &middot; Ljus &middot; Scen &middot; DJ &mdash; Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">${bodyHtml}</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
  <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:12px;">Scenkonsult Norden &middot; Grimstagatan 164, 162 58 Vällingby</p>
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">072-448 10 00 &middot; <a href="${SITE_URL}" style="color:#c4b5f4;text-decoration:none;">scenkonsult.se</a></p>
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

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`Resend ${res.status}: ${e}`); }
  return res.json();
}

function genCartId() {
  const hex = () => Math.random().toString(16).slice(2).toUpperCase().padStart(8, '0');
  return `SK-${hex().slice(0,8)}-${hex().slice(0,4)}`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let data;
  try { data = JSON.parse(event.body); }
  catch { return err('Ogiltig data', 400); }

  const { customer, items, note } = data;

  if (!customer?.name || !customer?.email)
    return err('Namn och e-post krävs', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return err('Ogiltig e-postadress', 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return err('E-postkonfiguration saknas', 500);

  const db         = createSupabase();
  const cartId     = genCartId();
  const cartToken  = generateCartToken();
  const realItems  = (items || []).filter(i => !i._note && i.name);
  
  // Lägg till notraden om det finns anteckningar
  const allItems = [...realItems];
  if (note?.trim()) {
    allItems.push({ _note: true, id: '_note', name: note.trim(), price: 0, qty: 1 });
  }

  const totalExcl = realItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const cartUrl   = `${SITE_URL}/order/?cart=${cartId}&token=${cartToken}`;

  try {
    await db.upsert('carts', {
      id:               cartId,
      status:           'waiting',
      items:            allItems,
      customer_name:    customer.name,
      customer_email:   customer.email,
      customer_phone:   customer.phone || null,
      customer_message: '',
      event_date:       customer.date || null,
      event_location:   customer.location || null,
      total_excl:       totalExcl * 100,
      cart_token:       cartToken,
      expires_at:       new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    });
    await logAudit(db, cartId, 'admin', 'quote_sent', { to: customer.email });
  } catch (e) {
    console.error('ADMIN_QUOTE_DB_ERROR:', e.message);
    return err('Databasfel: ' + e.message, 500);
  }

  const datumStr   = customer.date ? `Eventdatum: ${customer.date}` : '';
  const platsStr   = customer.location ? `Plats: ${customer.location}` : '';
  const noteHtml   = note?.trim()
    ? `<p style="margin:16px 0 0;padding:12px 14px;background:#f7f7fb;border-left:3px solid #8b7dd4;border-radius:0 6px 6px 0;color:#555;font-size:13px;line-height:1.6;">${note.trim().replace(/\n/g,'<br>')}</p>`
    : '';

  const htmlBody = `
    <h2 style="margin:0 0 8px;color:#1e1850;font-size:22px;">Offert från Scenkonsult Norden</h2>
    <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">Hej ${customer.name}! Vi har satt ihop en offert åt dig baserat på dina önskemål. Klicka på knappen nedan för att se, granska och eventuellt justera produkterna — sedan kan du enkelt skicka tillbaka din bekräftelse till oss.</p>
    <p style="margin:0 0 10px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Din offert</p>
    ${cartTable(realItems)}
    ${noteHtml}
    ${datumStr || platsStr ? `<p style="margin:14px 0 0;color:#666;font-size:13px;">${[datumStr,platsStr].filter(Boolean).join(' &middot; ')}</p>` : ''}
    <p style="margin:28px 0 8px;"><a href="${cartUrl}" style="background:#332885;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">Se och bekräfta din offert →</a></p>
    <p style="margin:10px 0 0;color:#888;font-size:12px;">Via länken kan du justera produkter och skicka tillbaka din beställning. Länken är giltig i 21 dagar.</p>
    <p style="margin:20px 0 0;color:#555;font-size:13px;">Frågor? Kontakta oss gärna på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.</p>`;

  const plainText = `Offert från Scenkonsult Norden\n\nHej ${customer.name}!\n\nVi har satt ihop en offert åt dig. Klicka på länken nedan för att se och bekräfta:\n${cartUrl}\n\n${realItems.map(i=>`${i.name} x${i.qty||1} — ${((i.price||0)*(i.qty||1)).toLocaleString('sv-SE')} kr`).join('\n')}\nTotalt: ${totalExcl.toLocaleString('sv-SE')} kr (exkl. moms)\n${note?.trim()?'\nAnmärkning:\n'+note.trim():''}${datumStr?'\n'+datumStr:''}\n\nFrågor? Ring 072-448 10 00\n---\nScenkonsult Norden | scenkonsult.se`;

  try {
    // 1. Intern kopia
    await sendEmail(apiKey, {
      from: FROM,
      to: ['info@scenkonsult.se'],
      reply_to: customer.email,
      subject: `Offert skickad till ${customer.name}`,
      html: htmlWrapper(`<p style="color:#888;font-size:13px;margin:0 0 20px;">Skickad till: <strong>${customer.email}</strong></p>${htmlBody}`),
      text: `Offert skickad till ${customer.email}\n\n${plainText}`
    });
    await sleep(600);

    // 2. Till kunden
    await sendEmail(apiKey, {
      from: FROM,
      to: [customer.email],
      reply_to: 'info@scenkonsult.se',
      subject: `Din offert från Scenkonsult Norden`,
      html: htmlWrapper(htmlBody),
      text: plainText
    });

    console.log('ADMIN_QUOTE_SENT:', cartId, 'to', customer.email);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true, cart_id: cartId, cart_token: cartToken, cart_url: cartUrl }) };
  } catch (e) {
    console.error('ADMIN_QUOTE_MAIL_ERROR:', e.message);
    return err('Kunde inte skicka mail: ' + e.message, 500);
  }
};
