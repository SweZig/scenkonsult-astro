// netlify/functions/invoice-credit.js
// POST { cart_id, mode, custom_percent?, reason?, resend? } + Bearer TOKEN
//
// mode = 'full'          → 100 % kreditering
// mode = 'cancel_rules'  → beräkna % från avbokningsregler (event_date vs idag + DJ-flagga)
// mode = 'custom'        → använd custom_percent (0-100)
//
// Kreditfakturor delar K-serie med vanliga fakturor men sparas på samma cart-rad
// i nya credit_* kolumner. Varje cart kan bara ha EN kreditfaktura.
// Vid resend=true regenereras PDF och skickas med befintligt credit_invoice_number.

'use strict';

const { supabase: createSupabase, logAudit, getTakenInvoiceNumbers, isBookingFee } = require('./_lib');
const PDFDocument = require('pdfkit');

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <hej@scenkonsult.se>';

function fmtKr(n) { return (parseInt(n) || 0).toLocaleString('sv-SE') + ' kr'; }
function fmtDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('sv-SE'); }

// ── Avbokningsregler ────────────────────────────────────────────────────────
// Returnerar % av ursprungsbeloppet som ska KREDITERAS (= återbetalas till kund)
//   Regulär: >7 dagar: 100 %, 3-7 dagar: 50 %, <3 dagar: 0 %
//   DJ:      >60 dagar: 100 %, 30-60 dagar: 50 %, <30 dagar: 0 %
function calcCancelRefundPercent(cart) {
  const items = Array.isArray(cart.items) ? cart.items : [];
  const isDjBooking = items.some(i => {
    const a = (i.artno || i.id || '').toString();
    // DJ-bokningar = Junior DJ / Senior DJ / DJ-Paket → artno börjar med SK-DJ-0009..0014 eller SK-DJ-PAK-*
    return /^SK-DJ-(0009|0010|0011|0012|0013|0014|PAK)/.test(a);
  });

  const eventDate = cart.event_date ? new Date(cart.event_date) : null;
  if (!eventDate || isNaN(eventDate.getTime())) {
    // Utan eventdatum: anta "i god tid" = 100 % kreditering
    return { percent: 100, days: null, isDj: isDjBooking, reason: 'Inget eventdatum' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const days = Math.round((eventDate - today) / (24 * 60 * 60 * 1000));

  let percent;
  if (isDjBooking) {
    if (days > 60)      percent = 100;
    else if (days >= 30) percent = 50;
    else                 percent = 0;
  } else {
    if (days > 7)       percent = 100;
    else if (days >= 3)  percent = 50;
    else                 percent = 0;
  }
  return { percent, days, isDj: isDjBooking };
}

// ── Reservera nästa lediga K-nummer för krediten ────────────────────────────
async function reserveCreditNumber(db, cartId) {
  const { taken, START_NUM } = await getTakenInvoiceNumbers();
  let next = START_NUM;
  while (taken.has(next)) next++;
  const newNum = 'K' + next;
  await db.update('carts', { credit_invoice_number: newNum }, 'id', cartId);
  return newNum;
}

// ── PDF-generator för kreditfaktura ─────────────────────────────────────────
function generateCreditPdfBuffer(cart, creditNumber, creditLines, totalExcl, refundPercent, logoBuffer) {
  return new Promise((resolve, reject) => {
    const today   = new Date().toISOString().slice(0,10);
    const vat     = Math.round(totalExcl * 0.25);
    const totalIncl = totalExcl + vat;

    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const NAVY  = '#1e1850';
    const LAV   = '#c4b5f4';
    const RED   = '#b91c1c';
    const GRAY  = '#666666';
    const W     = 495;

    // ── Header ──
    doc.rect(0, 0, 595, 70).fill(NAVY);
    if (logoBuffer) {
      try { doc.image(logoBuffer, 50, 12, { height: 46, fit: [120, 46] }); }
      catch(e) { doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('SCENKONSULT NORDEN', 50, 20); }
    } else {
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('SCENKONSULT NORDEN', 50, 20);
    }
    doc.fillColor('rgba(255,255,255,0.6)').fontSize(8).font('Helvetica')
       .text('Grimstagatan 164 · 162 58 Vällingby · 072-448 10 00 · scenkonsult.se', 50, 54);

    // ── KREDITFAKTURA rubrik ──
    doc.fillColor(RED).fontSize(22).font('Helvetica-Bold').text('KREDITFAKTURA', 50, 90);
    doc.fontSize(9).font('Helvetica').fillColor(GRAY)
       .text(`Krediterar faktura ${cart.invoice_number || '—'}`, 50, 118);

    // ── Info-kolumner ──
    const infoY = 140;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Kreditfakturanummer', 50, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(RED).text(creditNumber, 50, infoY + 10);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Datum', 50, infoY + 30);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(fmtDate(today), 50, infoY + 40);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Ursprungsfaktura', 50, infoY + 58);
    doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text(cart.invoice_number || '—', 50, infoY + 68);

    // Kund (höger)
    const cx = 300;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Kund', cx, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text(cart.customer_name || '—', cx, infoY + 10);
    let ky = infoY + 26;
    if (cart.customer_company) { doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(cart.customer_company, cx, ky); ky += 14; }
    if (cart.customer_orgnr)   { doc.fontSize(9).font('Helvetica').fillColor(GRAY).text('Org.nr: ' + cart.customer_orgnr, cx, ky); ky += 14; }
    if (cart.customer_address || cart.event_location) { doc.fontSize(9).fillColor(GRAY).text(cart.customer_address || cart.event_location, cx, ky); ky += 14; }
    if (cart.customer_ref)     { doc.fontSize(9).fillColor(GRAY).text('Er ref: ' + cart.customer_ref, cx, ky); ky += 14; }
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Vår referens', cx, ky + 4);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e').text(cart.invoice_ref || 'Per S', cx, ky + 16);

    const tableY = Math.max(infoY + 90, ky + 40);

    // ── Produkttabell (negativa belopp) ──
    const ARTNO_W = 95;
    const colW = [ARTNO_W, W - ARTNO_W - 40 - 70 - 70, 40, 70, 70];
    const cols = [50, 50 + colW[0], 50 + colW[0] + colW[1], 50 + colW[0] + colW[1] + colW[2], 50 + colW[0] + colW[1] + colW[2] + colW[3]];

    doc.rect(50, tableY, W, 20).fill('#f4f4f7');
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY);
    ['Artikelnr', 'Beskrivning', 'Antal', 'À-pris', 'Delsumma'].forEach((h, i) => {
      const align = i <= 1 ? 'left' : 'right';
      doc.text(h, cols[i] + 4, tableY + 6, { width: colW[i] - 8, align });
    });

    let ry = tableY + 20;
    creditLines.forEach((item, idx) => {
      const qty = item.qty || 1;
      const sum = (item.price || 0) * qty; // redan negativ
      const artno = item.artno || item.id || '';
      if (idx % 2 === 1) doc.rect(50, ry, W, 18).fill('#fafafa');
      doc.fontSize(8).font('Helvetica').fillColor(GRAY);
      doc.text(artno, cols[0] + 4, ry + 5, { width: colW[0] - 8, align: 'left' });
      doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
      doc.text(item.name || '—', cols[1] + 4, ry + 4, { width: colW[1] - 8, align: 'left' });
      doc.text(String(qty),       cols[2] + 4, ry + 4, { width: colW[2] - 8, align: 'right' });
      doc.text(fmtKr(item.price), cols[3] + 4, ry + 4, { width: colW[3] - 8, align: 'right' });
      doc.text(fmtKr(sum),        cols[4] + 4, ry + 4, { width: colW[4] - 8, align: 'right' });
      ry += 18;
    });

    doc.rect(50, tableY, W, ry - tableY).stroke('#e0e0e8');
    doc.moveTo(50, tableY + 20).lineTo(50 + W, tableY + 20).stroke('#e0e0e8');

    // Totals (negativa)
    ry += 8;
    const totals = [
      ['Summa exkl. moms',      fmtKr(totalExcl), GRAY, 'Helvetica'],
      ['Moms 25%',              fmtKr(vat),      GRAY, 'Helvetica'],
      ['Att återbetala inkl. moms', fmtKr(totalIncl), RED, 'Helvetica-Bold'],
    ];
    totals.forEach(([label, amount, color, font]) => {
      doc.fontSize(font === 'Helvetica-Bold' ? 11 : 9).font(font).fillColor(color);
      doc.text(label,  50, ry, { width: W - 80, align: 'right' });
      doc.text(amount, 50, ry, { width: W,      align: 'right' });
      ry += font === 'Helvetica-Bold' ? 18 : 14;
    });

    // ── Återbetalningsinformation + Avsändare ──
    ry += 16;
    doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(1).stroke(LAV);
    ry += 10;
    const payY = ry;

    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Återbetalning', 50, payY);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
    doc.text('Beloppet återbetalas till samma betalmedel', 50, payY + 12);
    doc.text('som ursprungsfakturan inom 10 arbetsdagar.', 50, payY + 24);
    if (refundPercent != null && refundPercent < 100) {
      doc.fillColor(RED).text(`Partiell kreditering: ${refundPercent} %`, 50, payY + 40);
    }

    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Avsändare', 300, payY);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e')
       .text('Scenkonsult Norden (Sigvardsson Consulting AB)', 300, payY + 12)
       .text('Org.nr: 559068-4931', 300, payY + 24)
       .text('Vinsta Skolgränd 4, 162 70 Vällingby', 300, payY + 36);

    ry = payY + 62;
    doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(0.5).stroke('#e0e0e8');
    doc.fontSize(8).font('Helvetica').fillColor(GRAY)
       .text('Frågor? Ring 072-448 10 00 eller maila info@scenkonsult.se', 50, ry + 8, { width: W, align: 'center' });

    doc.end();
  });
}

// ── E-postutskick ───────────────────────────────────────────────────────────
async function sendCreditEmail(apiKey, cart, creditNumber, pdfBuffer, refundPercent, totalIncl) {
  const toEmail = (cart.use_invoice_email && cart.invoice_email) ? cart.invoice_email : cart.customer_email;
  const ccList = [
    ...(cart.use_invoice_email && cart.invoice_email && cart.customer_email ? [cart.customer_email] : []),
    ...(cart.cc_email ? [cart.cc_email] : []),
  ];

  const subj = `Kreditfaktura ${creditNumber} från Scenkonsult Norden`;
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f7f7fb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fb;padding:40px 0;">
<tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="https://scenkonsult.se/logo-white.png" alt="Scenkonsult Norden" style="height:auto;max-height:40px;display:inline-block;">
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#b91c1c;margin:0 0 8px;">Kreditfaktura ${creditNumber}</h2>
  <p style="color:#666;font-size:13px;margin:0 0 18px;">Krediterar faktura ${cart.invoice_number || '—'}</p>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Hej ${cart.customer_name?.split(' ')[0] || ''},</p>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Bifogat finner du kreditfaktura <strong>${creditNumber}</strong>${refundPercent != null && refundPercent < 100 ? ` (partiell kreditering ${refundPercent} %)` : ''}. Beloppet på <strong>${totalIncl.toLocaleString('sv-SE')} kr</strong> inkl. moms återbetalas till samma betalmedel som ursprungsfakturan inom 10 arbetsdagar.</p>
  <p style="color:#444;line-height:1.7;margin:0 0 6px;">Hör av dig om du har frågor.</p>
  <p style="color:#444;line-height:1.7;margin:0;">Vänliga hälsningar,<br><strong>Scenkonsult Norden</strong></p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby · 072-448 10 00</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  const payload = {
    from: FROM,
    to:   [toEmail],
    reply_to: 'info@scenkonsult.se',
    subject: subj,
    html,
    text: `Kreditfaktura ${creditNumber} från Scenkonsult Norden.\nKrediterar faktura ${cart.invoice_number || '—'}.\nBelopp: ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms.\nÅterbetalas inom 10 arbetsdagar.`,
    attachments: [{
      filename: `Kreditfaktura_${creditNumber}_Scenkonsult.pdf`,
      content:  pdfBuffer.toString('base64'),
    }],
  };
  if (ccList.length) payload.cc = ccList;

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);

  // Intern kopia (fire-and-forget)
  fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM, to: ['info@scenkonsult.se'],
      reply_to: cart.customer_email || 'info@scenkonsult.se',
      subject: `Kreditfaktura ${creditNumber} skickad → ${toEmail}`,
      html: `<p>Kreditfaktura <strong>${creditNumber}</strong> skickad till ${toEmail}.<br>Ursprungsfaktura: ${cart.invoice_number || '—'}<br>Belopp: ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms${refundPercent != null && refundPercent < 100 ? ` (${refundPercent} %)` : ''}</p>`,
      text: `Kreditfaktura ${creditNumber} skickad till ${toEmail}.\nUrsprungsfaktura: ${cart.invoice_number || '—'}\nBelopp: ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms`,
      attachments: [{ filename: `Kreditfaktura_${creditNumber}_Scenkonsult.pdf`, content: pdfBuffer.toString('base64') }],
    }),
  }).catch(e => console.error('CREDIT_INTERNAL_COPY_ERROR:', e.message));

  return res.json();
}

// ── Bygg kredit-rader ───────────────────────────────────────────────────────
// Vid 100 %: spegla items med negativ qty (-1)
// Vid partiell: en enda summary-rad
function buildCreditLines(cart, percent) {
  const origItems = (Array.isArray(cart.items) ? cart.items : [])
    .filter(i => !i._note && i.name);
  const origTotal = origItems.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);

  if (percent === 100) {
    // Full kreditering — spegla alla rader negativt (qty blir negativt, price positivt)
    return origItems.map(i => ({
      id:    i.id,
      artno: i.artno || i.id || '',
      name:  i.name,
      price: i.price,
      qty:   -(i.qty || 1),
      type:  i.type,
    }));
  }

  // Partiell — summary-rad
  const creditAmount = -Math.round(origTotal * percent / 100);
  return [{
    id:    'credit-line',
    artno: '',
    name:  `Kreditering ${percent} % av faktura ${cart.invoice_number || ''}`,
    price: creditAmount,
    qty:   1,
  }];
}

// ── Handler ─────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const adminToken = process.env.ADMIN_TOKEN;
  const auth = (event.headers['authorization'] || '').replace('Bearer ', '');
  if (!adminToken || auth !== adminToken)
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Ej behörig' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltigt JSON' }) }; }

  const { cart_id, mode, custom_percent, reason, resend } = body;
  if (!cart_id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cart_id krävs' }) };
  if (!['full', 'cancel_rules', 'custom'].includes(mode))
    return { statusCode: 400, headers, body: JSON.stringify({ error: "mode måste vara 'full', 'cancel_rules' eller 'custom'" }) };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'RESEND_API_KEY saknas' }) };

  try {
    const db = createSupabase();
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order hittades inte' }) };
    if (!cart.invoice_number || !cart.invoice_sent_at)
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kan bara kreditera skickade fakturor' }) };
    if (!cart.customer_email) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kunden saknar e-postadress' }) };

    // Bestäm procent
    let percent;
    let modeUsed = mode;
    if (mode === 'full') {
      percent = 100;
    } else if (mode === 'cancel_rules') {
      const calc = calcCancelRefundPercent(cart);
      percent = calc.percent;
      if (percent === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({
          error: `Enligt avbokningsreglerna är ingen kreditering möjlig (${calc.days} dag${calc.days === 1 ? '' : 'ar'} till event${calc.isDj ? ', DJ' : ''}).`
        }) };
      }
    } else { // custom
      const p = parseInt(custom_percent);
      if (isNaN(p) || p < 1 || p > 100)
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'custom_percent måste vara 1-100' }) };
      percent = p;
    }

    // Bygg kreditrader + totalsummor
    const creditLines = buildCreditLines(cart, percent);
    const totalExcl   = creditLines.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);

    if (totalExcl >= 0)
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kan inte kreditera 0 kr eller positivt belopp' }) };

    // Reservera / återanvänd K-nummer
    let creditNumber;
    if (resend && cart.credit_invoice_number) {
      creditNumber = cart.credit_invoice_number;
    } else {
      if (cart.credit_invoice_number) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kreditfaktura finns redan. Använd resend=true för att skicka om.' }) };
      }
      creditNumber = await reserveCreditNumber(db, cart.id);
    }

    // Hämta logo
    let logoBuffer = null;
    try {
      const logoRes = await fetch('https://scenkonsult.se/logo-white.png');
      if (logoRes.ok) logoBuffer = Buffer.from(await logoRes.arrayBuffer());
    } catch(e) { /* ok */ }

    const pdfBuffer = await generateCreditPdfBuffer(cart, creditNumber, creditLines, totalExcl, percent, logoBuffer);
    const totalIncl = totalExcl + Math.round(totalExcl * 0.25);

    await sendCreditEmail(apiKey, cart, creditNumber, pdfBuffer, percent, totalIncl);

    const now = new Date().toISOString();
    const updates = {
      credit_invoice_number: creditNumber,
      credit_sent_at:        now,
      credit_amount_excl:    totalExcl,
      credit_mode:           modeUsed,
      credit_reason:         reason || null,
      credit_items:          creditLines,
    };
    await db.update('carts', updates, 'id', cart_id);
    await logAudit(db, cart_id, 'admin', resend ? 'credit_resent' : 'credit_sent', {
      credit_invoice_number: creditNumber, mode: modeUsed, percent, total_excl: totalExcl
    });

    console.log('CREDIT_SENT:', JSON.stringify({ cart_id, credit_number: creditNumber, mode: modeUsed, percent }));
    return { statusCode: 200, headers, body: JSON.stringify({
      ok: true,
      credit_invoice_number: creditNumber,
      total_excl: totalExcl,
      total_incl: totalIncl,
      percent,
    }) };

  } catch (err) {
    console.error('CREDIT_ERROR:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
