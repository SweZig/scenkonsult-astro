// netlify/functions/invoice-send.js
// POST { cart_id } + Bearer TOKEN
// 1. Hämtar order från Supabase
// 2. Sätter K-nummer om det saknas
// 3. Genererar PDF med PDFKit
// 4. Skickar via Resend med PDF som bilaga
// 5. Uppdaterar invoice_sent_at + status → fakturerad

const { supabase: createSupabase, logAudit, getOrCreateInvoiceNumber, isBookingFee } = require('./_lib');
const { getVillkor } = require('./_invoice-villkor');
const PDFDocument = require('pdfkit');
let QRCode; try { QRCode = require('qrcode'); } catch(e) { QRCode = null; }

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <hej@scenkonsult.se>';
const LOGO_URL   = 'https://scenkonsult.se/logo-white.png';

function fmtKr(n) {
  return (parseInt(n) || 0).toLocaleString('sv-SE').replace(/\u00A0/g, ' ') + ' kr';
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('sv-SE');
}

// Härled momsregistreringsnummer ur org.nr: "SE" + endast siffror + "01".
// Ex: "556053-5873" → "SE556053587301". Returnerar null om för få siffror.
function orgnrToVat(orgnr) {
  if (!orgnr) return null;
  const digits = String(orgnr).replace(/\D/g, '');
  if (digits.length < 10) return null;
  return 'SE' + digits.slice(0, 10) + '01';
}

// ── Generera PDF ─────────────────────────────────────────────────────────────
function generatePdfBuffer(cart, invoiceNumber, logoBuffer, swishQrBuffer) {
  return new Promise((resolve, reject) => {
    const today   = new Date().toISOString().slice(0,10);
    const invDate = cart.invoice_date || today;
    // payment_terms_days === 0 betyder FÖRSKOTT — får ej falla tillbaka på default.
    // Default när värde saknas styrs av kundtyp: B2B → 5 dagar netto, annars Förskott (0).
    const termsDefault = (getVillkor(cart).type === 'b2b') ? 5 : 0;
    const terms   = (cart.payment_terms_days === 0 || cart.payment_terms_days)
      ? parseInt(cart.payment_terms_days)
      : termsDefault;
    const isForskott = terms === 0;
    const dueDate = cart.invoice_due_date || (() => {
      // Förskott: förfaller samma dag (betalas före utlämning).
      const d = new Date(invDate); d.setDate(d.getDate() + terms);
      return d.toISOString().slice(0,10);
    })();

    const items     = (cart.items || []).filter(i => !i._note && i.name);
    const totalExcl = items.reduce((s,i) => s + ((i.price||0)*(i.qty||1)), 0);
    const vat       = Math.round(totalExcl * 0.25);
    const totalIncl = totalExcl + vat;

    // Kundtyp (b2b/b2c) — samma källa som hyresvillkoren på sida 2.
    const custType = getVillkor(cart).type;

    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const NAVY  = '#1e1850';
    const LAV   = '#c4b5f4';
    const GRAY  = '#666666';
    const W     = 495; // usable width

    // ── Header ──
    doc.rect(0, 0, 595, 70).fill(NAVY);
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 50, 12, { height: 46, fit: [120, 46] });
      } catch(e) {
        doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('SCENKONSULT NORDEN', 50, 20);
      }
    } else {
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('SCENKONSULT NORDEN', 50, 20);
    }
    doc.fillColor('rgba(255,255,255,0.6)').fontSize(8).font('Helvetica')
       .text('Grimstagatan 164 · 162 58 Vällingby · 072-448 10 00 · scenkonsult.se', 50, 54);

    doc.moveDown(3);

    // ── FAKTURA rubrik ──
    doc.fillColor(NAVY).fontSize(22).font('Helvetica-Bold').text('FAKTURA', 50, 90);
    doc.moveDown(0.5);

    // ── Info-kolumner ──
    const infoY = 130;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturanummer', 50, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(invoiceNumber, 50, infoY + 10);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturadatum', 50, infoY + 30);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(fmtDate(invDate), 50, infoY + 40);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Förfallodag', 50, infoY + 58);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e').text(isForskott ? 'Omgående (före utlämning)' : fmtDate(dueDate), 50, infoY + 68);

    // Kund (höger kolumn)
    const cx = 300;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Kund', cx, infoY);
    const displayName = cart.customer_company
      ? cart.customer_name + '\n' + cart.customer_company
      : cart.customer_name || '—';
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text(cart.customer_name || '—', cx, infoY + 10);
    let ky = infoY + 26;
    if (cart.customer_company) {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(cart.customer_company, cx, ky);
      ky += 14;
    }
    if (cart.customer_orgnr) {
      doc.fontSize(9).font('Helvetica').fillColor(GRAY).text('Org.nr: ' + cart.customer_orgnr, cx, ky);
      ky += 14;
      // Momsregistreringsnummer härleds från org.nr: "SE" + endast siffror + "01".
      // Ex: 556053-5873 → SE556053587301. Visas endast för företag/organisation (B2B).
      const vatNum = orgnrToVat(cart.customer_orgnr);
      if (custType === 'b2b' && vatNum) {
        doc.fontSize(9).font('Helvetica').fillColor(GRAY).text('Momsreg.nr: ' + vatNum, cx, ky);
        ky += 14;
      }
    }
    if (cart.customer_address || cart.event_location) {
      doc.fontSize(9).fillColor(GRAY).text(cart.customer_address || cart.event_location, cx, ky);
      ky += 14;
    }
    if (cart.customer_ref) {
      doc.fontSize(9).fillColor(GRAY).text('Er ref: ' + cart.customer_ref, cx, ky);
      ky += 14;
    }
    // Vår referens moved above (before tableY calculation)

    // Vår referens (alltid sist i höger kolumn)
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Vår referens', cx, ky + 4);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e').text(cart.invoice_ref || 'Per S', cx, ky + 16);

    // Eventdatum + hyresperiod — placeras under BÅDA kolumnerna
    const leftBottom  = infoY + 80;        // vänster kolumn slutar ~rad 3 (förfallodag)
    const rightBottom = ky + 32;           // höger kolumn + vår referens + värde
    const minTableY   = Math.max(leftBottom, rightBottom) + 20;
    let tableY = Math.max(minTableY, 260); // absolut minimum 260
    if (cart.event_date) {
      const dlTime = cart.delivery_time || '13:00';
      const rtTime = cart.return_time || '11:00';
      const periodText = `Hyresperiod: utlämning ${fmtDate(cart.event_date)} kl ${dlTime}  ·  återlämning ${fmtDate(cart.return_date || cart.event_date)} kl ${rtTime}`;
      doc.fontSize(9).font('Helvetica').fillColor(GRAY)
         .text(periodText, 50, tableY - 22, { width: W });
    }

    // ── Produkttabell ──
    // Kolumner: Artikelnr | Produkt / Tjänst | Antal | À-pris | Delsumma
    const ARTNO_W = 95;
    const colW = [ARTNO_W, W - ARTNO_W - 40 - 70 - 70, 40, 70, 70];
    const cols = [
      50,
      50 + colW[0],
      50 + colW[0] + colW[1],
      50 + colW[0] + colW[1] + colW[2],
      50 + colW[0] + colW[1] + colW[2] + colW[3],
    ];

    // Header
    doc.rect(50, tableY, W, 20).fill('#f4f4f7');
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY);
    ['Artikelnr', 'Produkt / Tjänst', 'Antal', 'À-pris', 'Delsumma'].forEach((h, i) => {
      const align = i <= 1 ? 'left' : 'right';
      doc.text(h, cols[i] + 4, tableY + 6, { width: colW[i] - 8, align });
    });

    // Rows
    let ry = tableY + 20;
    items.forEach((item, idx) => {
      const qty  = item.qty || 1;
      const sum  = (item.price || 0) * qty;
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

    // Border
    doc.rect(50, tableY, W, ry - tableY).stroke('#e0e0e8');
    doc.moveTo(50, tableY + 20).lineTo(50 + W, tableY + 20).stroke('#e0e0e8');

    // Totals
    ry += 8;
    const totals = [
      ['Summa exkl. moms', fmtKr(totalExcl), GRAY, 'Helvetica'],
      ['Moms 25%',          fmtKr(vat),       GRAY, 'Helvetica'],
      ['Att betala inkl. moms', fmtKr(totalIncl), NAVY, 'Helvetica-Bold'],
    ];
    totals.forEach(([label, amount, color, font]) => {
      doc.fontSize(font === 'Helvetica-Bold' ? 11 : 9).font(font).fillColor(color);
      doc.text(label,  50,   ry, { width: W - 80, align: 'right' });
      doc.text(amount, 50,   ry, { width: W,      align: 'right' });
      ry += font === 'Helvetica-Bold' ? 18 : 14;
    });

    // ── Betalningsinformation + Avsändare (samma höjd) ──
    ry += 16;
    doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(1).stroke(LAV);
    ry += 10;
    const payY = ry; // fast startpunkt för båda kolumnerna

    // Vänster: Betalningsinformation
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Betalningsinformation', 50, payY);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
    doc.text('Bankgiro: 5132-0646', 50, payY + 12);
    doc.text('Swish: 123 136 59 07', 50, payY + 24);
    doc.text(isForskott ? 'Betalningsvillkor: Förskott (betalas före utlämning)' : `Betalningsvillkor: ${terms} dagar netto`, 50, payY + 36);

    // Förskottsnotis för privatpersoner och organisationer (B2C) — visas bara
    // när fakturan faktiskt är förskott, så texten inte motsäger ett ev. nettovillkor.
    let payExtra = 0;
    if (custType === 'b2c' && isForskott) {
      doc.fontSize(8).font('Helvetica-Oblique').fillColor(GRAY).text(
        'För privatpersoner och organisationer tillämpar vi förskottsbetalning via Bankgiro, Swish eller kortbetalning.',
        50, payY + 50, { width: 230 }
      );
      payExtra = 22;
    }

    // Swish QR-kod
    if (swishQrBuffer) {
      doc.fontSize(7).font('Helvetica').fillColor(GRAY).text('Betala med Swish', 50, payY + 54 + payExtra);
      doc.image(swishQrBuffer, 50, payY + 64 + payExtra, { width: 72, height: 72 });
    }

    // Höger: Avsändare (exakt samma y-värde)
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Avsändare', 300, payY);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e')
       .text('Scenkonsult Norden (Sigvardsson Consulting AB)', 300, payY + 12)
       .text('Org.nr: 559068-4931', 300, payY + 24)
       .text('Vinsta Skolgränd 4, 162 70 Vällingby', 300, payY + 36);

    // Footer — direkt under betalningsinfo + QR-kod
    ry = payY + (swishQrBuffer ? 148 + payExtra : Math.max(60, 50 + payExtra));
    doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(0.5).stroke('#e0e0e8');
    doc.fontSize(8).font('Helvetica').fillColor(GRAY)
       .text('Tack för ditt förtroende! Frågor? Ring 072-448 10 00 eller maila info@scenkonsult.se',
             50, ry + 8, { width: W, align: 'center' });

    // ── Sida 2: Hyresvillkor — anpassade efter kundtyp (B2C/B2B) ─────────────
    doc.addPage();

    const { villkor, heading, subhead } = getVillkor(cart);

    // Header sida 2
    doc.rect(0, 0, 595, 50).fill(NAVY);
    doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold')
       .text(heading, 50, 16);
    doc.fillColor('rgba(255,255,255,0.55)').fontSize(8).font('Helvetica')
       .text(subhead, 50, 34);

    let vy = 68;

    villkor.forEach(([title, text]) => {
      if (vy > 748) return; // Hoppa om vi riskerar att krocka med footer
      // Rubrik
      doc.rect(50, vy, W, 16).fill('#f0eeff');
      doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY)
         .text(title, 54, vy + 4, { width: W - 8 });
      vy += 18;
      // Brödtext
      doc.fontSize(8).font('Helvetica').fillColor('#333333')
         .text(text, 54, vy, { width: W - 8, lineGap: 1.5 });
      const textHeight = doc.heightOfString(text, { width: W - 8, lineGap: 1.5 });
      vy += textHeight + 8;
    });

    // Footer sida 2 — inom A4 usable area (margin:50 → max y ≈ 791)
    doc.moveTo(50, 762).lineTo(545, 762).lineWidth(0.5).stroke('#c4b5f4');
    doc.fontSize(7.5).font('Helvetica').fillColor(GRAY)
       .text(
         'Scenkonsult Norden (Sigvardsson Consulting Group AB)  ·  Org.nr 559068-4931  ·  Vinsta Skolgränd 4, 162 70 Vällingby  ·  info@scenkonsult.se',
         50, 770, { width: W, align: 'center' }
       );

    doc.end();
  });
}

// ── Skicka via Resend ─────────────────────────────────────────────────────────
async function sendInvoiceEmail(apiKey, cart, invoiceNumber, pdfBuffer, invoiceToEmail, ccList) {
  const items     = (cart.items||[]).filter(i=>!i._note && i.name);
  const totalExcl = items.reduce((s,i)=>s+((i.price||0)*(i.qty||1)),0);
  const totalIncl = Math.round(totalExcl * 1.25);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="90" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">Scen · Ljud · Bild · Ljus · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#1e1850;margin:0 0 12px;">Faktura ${invoiceNumber}</h2>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Hej ${cart.customer_name || ''}!</p>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Tack för att du valde Scenkonsult Norden. Bifogat finner du faktura <strong>${invoiceNumber}</strong>.</p>
  <p style="color:#444;font-size:14px;margin:0 0 4px;"><strong>Att betala:</strong> ${totalIncl.toLocaleString('sv-SE')} kr (inkl. moms)</p>
  <p style="color:#666;font-size:13px;margin:0 0 20px;">Bankgiro 5132-0646 · Swish 123 136 59 07</p>
  <p style="color:#888;font-size:12px;margin:0;">Frågor? Ring <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.</p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  const plain = `Faktura ${invoiceNumber} från Scenkonsult Norden\n\nHej ${cart.customer_name||''}!\n\nBifogat finner du faktura ${invoiceNumber}.\nAtt betala: ${totalIncl.toLocaleString('sv-SE')} kr\n\nFrågor? Ring 072-448 10 00.\n\n---\nScenkonsult Norden`;

  // Skicka till kund
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM, to: [invoiceToEmail],
      ...(ccList.length ? { cc: ccList } : {}),
      reply_to: 'info@scenkonsult.se',
      subject:  `Faktura ${invoiceNumber} — Scenkonsult Norden`,
      html, text: plain,
      attachments: [{
        filename: `Faktura_${invoiceNumber}_Scenkonsult.pdf`,
        content:  pdfBuffer.toString('base64'),
      }],
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);

  // Intern kopia med tydlig ämnesrad (fire-and-forget)
  const internalHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="90" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">Scen · Ljud · Bild · Ljus · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#1e1850;margin:0 0 12px;">Faktura ${invoiceNumber} — skickad</h2>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Faktura <strong>${invoiceNumber}</strong> har skickats till:</p>
  <p style="background:#f4f4f7;border-radius:6px;padding:10px 14px;font-size:15px;font-weight:700;color:#1e1850;margin:0 0 20px;">${invoiceToEmail}${invoiceToEmail!==cart.customer_email?" <span style=\"font-size:11px;color:#888\">(alternativ adress)</span>":""}</p>
  <p style="color:#444;font-size:14px;margin:0 0 4px;"><strong>Kund:</strong> ${cart.customer_name || '—'}${cart.customer_company ? ' / ' + cart.customer_company : ''}</p>
  <p style="color:#444;font-size:14px;margin:0 0 4px;"><strong>Belopp:</strong> ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms</p>
  <p style="color:#444;font-size:14px;margin:0;"><strong>Cart-ID:</strong> ${cart.id}</p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  // Intern kopia — fire and forget (blockerar ej svaret)
  fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM, to: ['info@scenkonsult.se'],
      reply_to: cart.customer_email,
      subject: `Faktura ${invoiceNumber} skickad → ${invoiceToEmail}`,
      html: internalHtml,
      text: `Faktura ${invoiceNumber} skickad till: ${cart.customer_email}\nKund: ${cart.customer_name||'—'}\nCart-ID: ${cart.id}`,
      attachments: [{
        filename: `Faktura_${invoiceNumber}_Scenkonsult.pdf`,
        content:  pdfBuffer.toString('base64'),
      }],
    }),
  }).catch(e => console.error('INVOICE_INTERNAL_COPY_ERROR:', e.message));

  return res.json();
}

// ── Handler ───────────────────────────────────────────────────────────────────
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

  const { cart_id, resend, override_invoice_number } = body;
  if (!cart_id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cart_id krävs' }) };

  // Validera ev. override-nummer
  let overrideNum = null;
  if (override_invoice_number) {
    if (typeof override_invoice_number !== 'string' || !/^K\d+$/.test(override_invoice_number)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltigt override_invoice_number (förväntat K + siffror)' }) };
    }
    overrideNum = override_invoice_number;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'RESEND_API_KEY saknas' }) };

  try {
    const db = createSupabase();
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order hittades inte' }) };
    if (!cart.customer_email) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kunden saknar e-postadress' }) };

  // Bygg CC-lista:
  // - Om alternativ fakturamail är aktiv → lägg customer_email som CC (får kopia)
  // - Om cc_email är satt → lägg alltid till
  const ccList = [
    ...(cart.use_invoice_email && cart.invoice_email && cart.customer_email ? [cart.customer_email] : []),
    ...(cart.cc_email ? [cart.cc_email] : []),
  ];
    const invoiceToEmail = (cart.use_invoice_email && cart.invoice_email)
      ? cart.invoice_email
      : cart.customer_email;

    let invoiceNumber;
    if (overrideNum) {
      // Admin har valt ett specifikt fakturanummer i dialogen — applicera atomiskt
      await db.update('carts', { invoice_number: overrideNum }, 'id', cart.id);
      await logAudit(db, cart.id, 'admin', 'invoice_number_override', { number: overrideNum, was: cart.invoice_number || null });
      invoiceNumber = overrideNum;
    } else {
      invoiceNumber = await getOrCreateInvoiceNumber(db, cart);
    }
    cart.invoice_number = invoiceNumber;

    // ── Auto-lägg bokningsavgift 49 kr om ingen bokningsavgift finns ─────
    // Regel: har korgen redan någon bokningsavgift-rad (id fakturaavgift-*,
    // SK-TJN-0003*, eller namn "Bokningsavgift"/"Fakturaavgift"), hoppa över.
    // Annars lägg till SK-TJN-0003-49 (49 kr bokningsavgift) och uppdatera DB.
    const existingItems = Array.isArray(cart.items) ? cart.items : [];
    const hasFakturaavgift = existingItems.some(isBookingFee);
    if (!hasFakturaavgift) {
      const feeItem = {
        id:       'fakturaavgift-49',
        name:     'Bokningsavgift',
        price:    49,
        qty:      1,
        type:     'service',
        category: 'Tjänster',
        artno:    'SK-TJN-0003-49',
      };
      cart.items = [...existingItems, feeItem];
      try {
        await db.update('carts', { items: cart.items }, 'id', cart.id);
        await logAudit(db, cart.id, 'system', 'invoice_fee_autoadded', { price: 49 });
        console.log('INVOICE_FEE_AUTOADDED:', cart.id);
      } catch (e) {
        console.error('INVOICE_FEE_AUTOADD_ERROR:', e.message);
        // Fortsätt ändå — fakturan blir korrekt även om DB-uppdateringen misslyckas
      }
    }

    let logoBuffer = null;
    try {
      const logoRes = await fetch('https://scenkonsult.se/logo-white.png');
      if (logoRes.ok) logoBuffer = Buffer.from(await logoRes.arrayBuffer());
    } catch(e) { /* fortsätt utan logo */ }

    // Generera Swish QR — format per Swish C2B spec (avsnitt 6.1):
    // C<nummer>;<belopp med komma>;<meddelande>;<lock_mask>
    let swishQrBuffer = null;
    if (QRCode) {
      try {
        const items     = (cart.items||[]).filter(i=>!i._note&&i.name);
        const totalExcl = items.reduce((s,i)=>s+((i.price||0)*(i.qty||1)),0);
        const totalIncl = Math.ceil(totalExcl * 1.25);
        // Belopp med 2 decimaler, komma som decimalseparator
        const amountStr = totalIncl.toFixed(2).replace('.', ',');
        // Meddelande URL-encodat (fakturanummer), lock_mask=0 = inget är redigerbart
        const msg = encodeURIComponent(invoiceNumber);
        const swishContent = `C1231365907;${amountStr};${msg};0`;
        const qrPng = await QRCode.toBuffer(swishContent, { type: 'png', width: 200, margin: 2, errorCorrectionLevel: 'M' });
        swishQrBuffer = qrPng;
      } catch(e) { console.error('SWISH_QR_ERROR:', e.message); }
    }

    const pdfBuffer = await generatePdfBuffer({ ...cart, invoice_number: invoiceNumber }, invoiceNumber, logoBuffer, swishQrBuffer);
    await sendInvoiceEmail(apiKey, cart, invoiceNumber, pdfBuffer, invoiceToEmail, ccList);

    const now = new Date().toISOString();
    await db.update('carts', { invoice_number: invoiceNumber, invoice_sent_at: now }, 'id', cart_id);
    // Status → fakturerad bara vid första utskick (inte vid omsändning)
    if (!resend) {
      const supaUrl = process.env.SUPABASE_URL;
      const supaKey = process.env.SUPABASE_SERVICE_KEY;
      await fetch(`${supaUrl}/rest/v1/carts?id=eq.${encodeURIComponent(cart_id)}`, {
        method: 'PATCH',
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'fakturerad' })
      });
    }
    await logAudit(db, cart_id, 'admin', resend ? 'invoice_resent' : 'invoice_sent', { invoice_number: invoiceNumber, to: cart.customer_email });

    console.log('INVOICE_SENT:', JSON.stringify({ cart_id, invoice_number: invoiceNumber }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, invoice_number: invoiceNumber }) };

  } catch (err) {
    console.error('INVOICE_ERROR:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
