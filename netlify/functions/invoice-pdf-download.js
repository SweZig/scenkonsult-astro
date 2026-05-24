// netlify/functions/invoice-pdf-download.js
// POST { cart_id, mode } + Bearer TOKEN
// mode = "order"   → genererar ORDER-dokument (ingen K-nr, ingen Swish QR, ingen sida 2)
// mode = "faktura" → genererar fullständig faktura (samma som invoice-send men returnerar PDF)
// Returnerar { ok, pdf_b64, filename }

const { supabase: createSupabase, logAudit, getOrCreateInvoiceNumber, isBookingFee } = require('./_lib');
const { getVillkor } = require('./_invoice-villkor');
const PDFDocument = require('pdfkit');
let QRCode; try { QRCode = require('qrcode'); } catch(e) { QRCode = null; }

function fmtKr(n) {
  return (parseInt(n) || 0).toLocaleString('sv-SE') + ' kr';
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('sv-SE');
}

// ── Generera PDF ─────────────────────────────────────────────────────────────
function generatePdf(cart, mode, invoiceNumber, logoBuffer, swishQrBuffer) {
  return new Promise((resolve, reject) => {
    const isOrder = mode === 'order';

    const today   = new Date().toISOString().slice(0,10);
    const invDate = cart.invoice_date || today;
    const terms   = cart.payment_terms_days || 5;
    const dueDate = cart.invoice_due_date || (() => {
      const d = new Date(invDate); d.setDate(d.getDate() + terms);
      return d.toISOString().slice(0,10);
    })();

    const items     = (cart.items || []).filter(i => !i._note && i.name);
    const totalExcl = items.reduce((s,i) => s + ((i.price||0)*(i.qty||1)), 0);
    const vat       = Math.round(totalExcl * 0.25);
    const totalIncl = totalExcl + vat;

    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const NAVY  = '#1e1850';
    const LAV   = '#c4b5f4';
    const GRAY  = '#666666';
    const W     = 495;

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

    // ── Rubrik ──
    const rubrik = isOrder ? 'ORDER' : 'FAKTURA';
    doc.fillColor(NAVY).fontSize(22).font('Helvetica-Bold').text(rubrik, 50, 90);

    // ── Info-kolumner ──
    const infoY = 130;

    if (isOrder) {
      // ORDER: visa order-ID + datum
      doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Order-ID', 50, infoY);
      doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(cart.id || '—', 50, infoY + 10);

      doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Datum', 50, infoY + 30);
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(fmtDate(today), 50, infoY + 40);
    } else {
      // FAKTURA: visa K-nummer + datum + förfallodag
      doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturanummer', 50, infoY);
      doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(invoiceNumber, 50, infoY + 10);

      doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturadatum', 50, infoY + 30);
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(fmtDate(invDate), 50, infoY + 40);

      doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Förfallodag', 50, infoY + 58);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e').text(fmtDate(dueDate), 50, infoY + 68);
    }

    // Kund (höger kolumn)
    const cx = 300;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Kund', cx, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text(cart.customer_name || '—', cx, infoY + 10);
    let ky = infoY + 26;
    if (cart.customer_company) {
      doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(cart.customer_company, cx, ky);
      ky += 14;
    }
    if (!isOrder && cart.customer_orgnr) {
      doc.fontSize(9).font('Helvetica').fillColor(GRAY).text('Org.nr: ' + cart.customer_orgnr, cx, ky);
      ky += 14;
    }
    if (cart.customer_address || cart.event_location) {
      doc.fontSize(9).fillColor(GRAY).text(cart.customer_address || cart.event_location, cx, ky);
      ky += 14;
    }
    if (cart.customer_ref) {
      doc.fontSize(9).fillColor(GRAY).text('Er ref: ' + cart.customer_ref, cx, ky);
      ky += 14;
    }
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Vår referens', cx, ky + 4);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e').text(cart.invoice_ref || 'Per S', cx, ky + 16);

    const leftBottom  = isOrder ? infoY + 50 : infoY + 80;
    const rightBottom = ky + 32;
    const minTableY   = Math.max(leftBottom, rightBottom) + 20;
    let tableY = Math.max(minTableY, 260);

    if (cart.event_date) {
      const dlTime = cart.delivery_time || '13:00';
      const rtTime = cart.return_time || '11:00';
      const periodText = `Hyresperiod: utlämning ${fmtDate(cart.event_date)} kl ${dlTime}  ·  återlämning ${fmtDate(cart.return_date || cart.event_date)} kl ${rtTime}`;
      doc.fontSize(9).font('Helvetica').fillColor(GRAY)
         .text(periodText, 50, tableY - 22, { width: W });
    }

    // ── Produkttabell ──
    const ARTNO_W = 95;
    const colW = [ARTNO_W, W - ARTNO_W - 40 - 70 - 70, 40, 70, 70];
    const cols = [
      50,
      50 + colW[0],
      50 + colW[0] + colW[1],
      50 + colW[0] + colW[1] + colW[2],
      50 + colW[0] + colW[1] + colW[2] + colW[3],
    ];

    doc.rect(50, tableY, W, 20).fill('#f4f4f7');
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY);
    ['Artikelnr', 'Produkt / Tjänst', 'Antal', 'À-pris', 'Delsumma'].forEach((h, i) => {
      const align = i <= 1 ? 'left' : 'right';
      doc.text(h, cols[i] + 4, tableY + 6, { width: colW[i] - 8, align });
    });

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

    // ── Betalningsinformation (bara i faktura-läge) ──
    if (!isOrder) {
      ry += 16;
      doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(1).stroke(LAV);
      ry += 10;
      const payY = ry;

      doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Betalningsinformation', 50, payY);
      doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
      doc.text('Bankgiro: 5132-0646', 50, payY + 12);
      doc.text('Swish: 123 136 59 07', 50, payY + 24);
      doc.text(`Betalningsvillkor: ${terms} dagar netto`, 50, payY + 36);

      if (swishQrBuffer) {
        doc.fontSize(7).font('Helvetica').fillColor(GRAY).text('Betala med Swish', 50, payY + 54);
        doc.image(swishQrBuffer, 50, payY + 64, { width: 72, height: 72 });
      }

      doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Avsändare', 300, payY);
      doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e')
         .text('Scenkonsult Norden (Sigvardsson Consulting AB)', 300, payY + 12)
         .text('Org.nr: 559068-4931', 300, payY + 24)
         .text('Vinsta Skolgränd 4, 162 70 Vällingby', 300, payY + 36);

      ry = payY + (swishQrBuffer ? 148 : 60);
      doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(0.5).stroke('#e0e0e8');
      doc.fontSize(8).font('Helvetica').fillColor(GRAY)
         .text('Tack för ditt förtroende! Frågor? Ring 072-448 10 00 eller maila info@scenkonsult.se',
               50, ry + 8, { width: W, align: 'center' });
    } else {
      // ORDER: enkel info-rad längst ned
      ry += 20;
      doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(0.5).stroke('#e0e0e8');
      doc.fontSize(8).font('Helvetica').fillColor(GRAY)
         .text('Scenkonsult Norden · 072-448 10 00 · info@scenkonsult.se · scenkonsult.se',
               50, ry + 8, { width: W, align: 'center' });
    }

    // ── Sida 2: Hyresvillkor — BARA för faktura ───────────────────────────────
    // Villkoren anpassas efter kundtyp (B2C/B2B) via _invoice-villkor.js.
    if (!isOrder) {
      doc.addPage();

      const { villkor, heading, subhead } = getVillkor(cart);

      doc.rect(0, 0, 595, 50).fill(NAVY);
      doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold')
         .text(heading, 50, 16);
      doc.fillColor('rgba(255,255,255,0.55)').fontSize(8).font('Helvetica')
         .text(subhead, 50, 34);

      let vy = 68;

      villkor.forEach(([title, text]) => {
        if (vy > 748) return;
        doc.rect(50, vy, W, 16).fill('#f0eeff');
        doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY)
           .text(title, 54, vy + 4, { width: W - 8 });
        vy += 18;
        doc.fontSize(8).font('Helvetica').fillColor('#333333')
           .text(text, 54, vy, { width: W - 8, lineGap: 1.5 });
        const textHeight = doc.heightOfString(text, { width: W - 8, lineGap: 1.5 });
        vy += textHeight + 8;
      });

      doc.moveTo(50, 762).lineTo(545, 762).lineWidth(0.5).stroke('#c4b5f4');
      doc.fontSize(7.5).font('Helvetica').fillColor(GRAY)
         .text(
           'Scenkonsult Norden (Sigvardsson Consulting Group AB)  ·  Org.nr 559068-4931  ·  Vinsta Skolgränd 4, 162 70 Vällingby  ·  info@scenkonsult.se',
           50, 770, { width: W, align: 'center' }
         );
    }

    doc.end();
  });
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

  const { cart_id, mode } = body;
  if (!cart_id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cart_id krävs' }) };
  if (!['order', 'faktura'].includes(mode))
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'mode måste vara "order" eller "faktura"' }) };

  try {
    const db = createSupabase();
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order hittades inte' }) };

    // Hämta logo
    let logoBuffer = null;
    try {
      const logoRes = await fetch('https://scenkonsult.se/logo-white.png');
      if (logoRes.ok) logoBuffer = Buffer.from(await logoRes.arrayBuffer());
    } catch(e) { /* fortsätt utan logo */ }

    let invoiceNumber = null;
    let swishQrBuffer = null;

    if (mode === 'faktura') {
      invoiceNumber = await getOrCreateInvoiceNumber(db, cart);

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
          await logAudit(db, cart.id, 'system', 'invoice_fee_autoadded', { price: 49, source: 'pdf-download' });
          console.log('INVOICE_FEE_AUTOADDED (pdf-download):', cart.id);
        } catch (e) {
          console.error('INVOICE_FEE_AUTOADD_ERROR (pdf-download):', e.message);
        }
      }

      // Swish QR
      if (QRCode) {
        try {
          const items     = (cart.items||[]).filter(i=>!i._note&&i.name);
          const totalExcl = items.reduce((s,i)=>s+((i.price||0)*(i.qty||1)),0);
          const totalIncl = Math.ceil(totalExcl * 1.25);
          const amountStr = totalIncl.toFixed(2).replace('.', ',');
          const msg = encodeURIComponent(invoiceNumber);
          const swishContent = `C1231365907;${amountStr};${msg};0`;
          swishQrBuffer = await QRCode.toBuffer(swishContent, { type: 'png', width: 200, margin: 2, errorCorrectionLevel: 'M' });
        } catch(e) { console.error('SWISH_QR_ERROR:', e.message); }
      }
    }

    const pdfBuffer = await generatePdf(
      { ...cart, invoice_number: invoiceNumber },
      mode,
      invoiceNumber,
      logoBuffer,
      swishQrBuffer
    );

    // Filnamn
    const safeId = cart.id.replace(/[^A-Z0-9-]/gi, '');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = mode === 'faktura'
      ? `Faktura_${invoiceNumber}_${safeId}_${dateStr}.pdf`
      : `Order_${safeId}_${dateStr}.pdf`;

    console.log('PDF_DOWNLOAD:', JSON.stringify({ cart_id, mode, filename }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        pdf_b64: pdfBuffer.toString('base64'),
        filename,
        invoice_number: invoiceNumber,
      }),
    };

  } catch (err) {
    console.error('PDF_DOWNLOAD_ERROR:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
