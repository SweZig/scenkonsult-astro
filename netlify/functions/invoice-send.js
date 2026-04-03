// netlify/functions/invoice-send.js
// POST { cart_id } + Bearer TOKEN
// 1. Hämtar order från Supabase
// 2. Sätter K-nummer om det saknas
// 3. Genererar PDF med PDFKit
// 4. Skickar via Resend med PDF som bilaga
// 5. Uppdaterar invoice_sent_at + status → fakturerad

const { supabase: createSupabase, logAudit } = require('./_lib');
const PDFDocument = require('pdfkit');

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const LOGO_URL   = 'https://scenkonsult.se/logo-white.png';

function fmtKr(n) {
  return (parseInt(n) || 0).toLocaleString('sv-SE') + ' kr';
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('sv-SE');
}

// ── K-nummer ─────────────────────────────────────────────────────────────────
async function getOrCreateInvoiceNumber(db, cart) {
  if (cart.invoice_number) return cart.invoice_number;
  // Hämta alla befintliga fakturanummer via REST direkt
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  let maxNum = 2009;
  try {
    const res = await fetch(
      `${supaUrl}/rest/v1/carts?select=invoice_number&invoice_number=not.is.null`,
      { headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` } }
    );
    if (res.ok) {
      const rows = await res.json();
      (rows || []).forEach(c => {
        if (c.invoice_number && c.invoice_number.startsWith('K')) {
          const n = parseInt(c.invoice_number.slice(1));
          if (n > maxNum) maxNum = n;
        }
      });
    }
  } catch (e) { /* fortsätt med default */ }
  const newNum = 'K' + (maxNum + 1);
  await db.update('carts', { invoice_number: newNum }, 'id', cart.id);
  return newNum;
}

// ── Generera PDF ─────────────────────────────────────────────────────────────
function generatePdfBuffer(cart, invoiceNumber, logoBuffer) {
  return new Promise((resolve, reject) => {
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
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e').text(fmtDate(dueDate), 50, infoY + 68);

    // Kund (höger kolumn)
    const cx = 300;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Kund', cx, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text(cart.customer_name || '—', cx, infoY + 10);
    let ky = infoY + 26;
    if (cart.customer_orgnr) {
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
    doc.fontSize(8).fillColor(GRAY).text('Vår referens', cx, ky + 4);
    doc.fontSize(9).fillColor('#1a1a2e').text(cart.invoice_ref || 'Per S', cx, ky + 14);

    // Eventdatum
    const tableY = 230;
    if (cart.event_date) {
      const dlTime = cart.delivery_time || '13:00';
      const rtTime = cart.return_time || '11:00';
      doc.fontSize(9).font('Helvetica').fillColor(GRAY)
         .text(`Hyresperiod: utlämning ${fmtDate(cart.event_date)} kl ${dlTime}  ·  återlämning ${fmtDate(cart.return_date || cart.event_date)} kl ${rtTime}`, 50, tableY - 18);
    }

    // ── Produkttabell ──
    const colW = [W - 40 - 70 - 70, 40, 70, 70];
    const cols = [50, 50 + colW[0], 50 + colW[0] + colW[1], 50 + colW[0] + colW[1] + colW[2]];

    // Header
    doc.rect(50, tableY, W, 20).fill('#f4f4f7');
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY);
    ['Produkt / Tjänst', 'Antal', 'À-pris', 'Delsumma'].forEach((h, i) => {
      const align = i === 0 ? 'left' : 'right';
      doc.text(h, cols[i] + 4, tableY + 6, { width: colW[i] - 8, align });
    });

    // Rows
    let ry = tableY + 20;
    items.forEach((item, idx) => {
      const qty = item.qty || 1;
      const sum = (item.price || 0) * qty;
      if (idx % 2 === 1) doc.rect(50, ry, W, 18).fill('#fafafa');
      doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
      doc.text(item.name || '—', cols[0] + 4, ry + 4, { width: colW[0] - 8, align: 'left' });
      doc.text(String(qty), cols[1] + 4, ry + 4, { width: colW[1] - 8, align: 'right' });
      doc.text(fmtKr(item.price), cols[2] + 4, ry + 4, { width: colW[2] - 8, align: 'right' });
      doc.text(fmtKr(sum), cols[3] + 4, ry + 4, { width: colW[3] - 8, align: 'right' });
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

    // ── Betalningsinformation ──
    ry += 20;
    doc.moveTo(50, ry).lineTo(50 + W, ry).lineWidth(1).stroke(LAV);
    ry += 12;
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Betalningsinformation', 50, ry);
    ry += 12;
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
    doc.text('Bankgiro: 5132-0646', 50, ry);
    doc.text('Swish: 123 136 59 07', 50, ry + 12);
    doc.text(`Betalningsvillkor: ${terms} dagar netto`, 50, ry + 24, { color: GRAY });

    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Avsändare', 300, ry);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e')
       .text('Scenkonsult Norden (Sigvardsson Consulting AB)', 300, ry + 12)
       .text('Org.nr: 559068-4931', 300, ry + 24, { fillColor: GRAY })
       .text('Vinsta Skolgränd 4, 162 70 Vällingby', 300, ry + 36, { fillColor: GRAY });

    // Footer
    const footerY = doc.page.height - 50;
    doc.moveTo(50, footerY - 10).lineTo(545, footerY - 10).lineWidth(0.5).stroke('#e0e0e8');
    doc.fontSize(8).font('Helvetica').fillColor(GRAY)
       .text('Tack för ditt förtroende! Frågor? Ring 072-448 10 00 eller maila info@scenkonsult.se',
             50, footerY, { width: W, align: 'center' });

    doc.end();
  });
}

// ── Skicka via Resend ─────────────────────────────────────────────────────────
async function sendInvoiceEmail(apiKey, cart, invoiceNumber, pdfBuffer, invoiceToEmail) {
  const items     = (cart.items||[]).filter(i=>!i._note && i.name);
  const totalExcl = items.reduce((s,i)=>s+((i.price||0)*(i.qty||1)),0);
  const totalIncl = Math.round(totalExcl * 1.25);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="90" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">Ljud · Ljus · Scen · DJ — Stockholm sedan 1986</p>
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

  // Intern kopia med tydlig ämnesrad
  await new Promise(r => setTimeout(r, 600));
  const internalHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="90" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">Ljud · Ljus · Scen · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#1e1850;margin:0 0 12px;">Faktura ${invoiceNumber} — skickad</h2>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Faktura <strong>${invoiceNumber}</strong> har skickats till:</p>
  <p style="background:#f4f4f7;border-radius:6px;padding:10px 14px;font-size:15px;font-weight:700;color:#1e1850;margin:0 0 20px;">${invoiceToEmail}${invoiceToEmail!==cart.customer_email?" <span style=\"font-size:11px;color:#888\">(alternativ adress)</span>":""}</p>
  <p style="color:#444;font-size:14px;margin:0 0 4px;"><strong>Kund:</strong> ${cart.customer_name || '—'}</p>
  <p style="color:#444;font-size:14px;margin:0 0 4px;"><strong>Belopp:</strong> ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms</p>
  <p style="color:#444;font-size:14px;margin:0;"><strong>Cart-ID:</strong> ${cart.id}</p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  await fetch(RESEND_API, {
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
  });

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

  const { cart_id } = body;
  if (!cart_id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cart_id krävs' }) };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'RESEND_API_KEY saknas' }) };

  try {
    const db = createSupabase();
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order hittades inte' }) };
    if (!cart.customer_email) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kunden saknar e-postadress' }) };

    // Bestäm fakturaadress: alternativ mail om toggle är aktiv och adressen är ifylld
    const invoiceToEmail = (cart.use_invoice_email && cart.invoice_email)
      ? cart.invoice_email
      : cart.customer_email;

    const invoiceNumber = await getOrCreateInvoiceNumber(db, cart);
    let logoBuffer = null;
    try {
      const logoRes = await fetch('https://scenkonsult.se/logo-white.png');
      if (logoRes.ok) logoBuffer = Buffer.from(await logoRes.arrayBuffer());
    } catch(e) { /* fortsätt utan logo */ }
    const pdfBuffer     = await generatePdfBuffer({ ...cart, invoice_number: invoiceNumber }, invoiceNumber, logoBuffer);
    await sendInvoiceEmail(apiKey, cart, invoiceNumber, pdfBuffer, invoiceToEmail);

    const now = new Date().toISOString();
    // Uppdatera invoice-fält (undviker ENUM-cast problem genom att separera status)
    await db.update('carts', { invoice_number: invoiceNumber, invoice_sent_at: now }, 'id', cart_id);
    // Status separat via raw PATCH
    const supaUrl = process.env.SUPABASE_URL;
    const supaKey = process.env.SUPABASE_SERVICE_KEY;
    await fetch(`${supaUrl}/rest/v1/carts?id=eq.${encodeURIComponent(cart_id)}`, {
      method: 'PATCH',
      headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'fakturerad' })
    });
    await logAudit(db, cart_id, 'admin', 'invoice_sent', { invoice_number: invoiceNumber, to: cart.customer_email });

    console.log('INVOICE_SENT:', JSON.stringify({ cart_id, invoice_number: invoiceNumber }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, invoice_number: invoiceNumber }) };

  } catch (err) {
    console.error('INVOICE_ERROR:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
