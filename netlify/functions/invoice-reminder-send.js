// netlify/functions/invoice-reminder-send.js
// POST { cart_id } + Bearer ADMIN_TOKEN
// Skickar en BETALNINGSPÅMINNELSE som PDF-bilaga till fakturaadressen.
// Förutsätter att en faktura redan skickats (invoice_number + invoice_due_date).
// Påminner vänligt om att fakturan förfallit för X dagar sedan.

'use strict';

const { supabase: createSupabase, logAudit, isBookingFee } = require('./_lib');
const PDFDocument = require('pdfkit');
let QRCode; try { QRCode = require('qrcode'); } catch (e) { QRCode = null; }

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <hej@scenkonsult.se>';
const LOGO_URL   = 'https://scenkonsult.se/logo-white.png';

function fmtKr(n) { return (parseInt(n) || 0).toLocaleString('sv-SE') + ' kr'; }
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('sv-SE');
}
// Antal hela dagar mellan förfallodag och idag (positivt = försenat)
function daysOverdue(dueIso) {
  if (!dueIso) return 0;
  const due = new Date(dueIso + (dueIso.length === 10 ? 'T00:00:00' : ''));
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  return Math.round((today - due) / 86400000);
}

// ── Generera påminnelse-PDF ──────────────────────────────────────────────────
function generateReminderPdf(cart, invoiceNumber, overdue, totalIncl, logoBuffer, swishQrBuffer) {
  return new Promise((resolve, reject) => {
    const invDate = cart.invoice_date || new Date().toISOString().slice(0, 10);
    const dueDate = cart.invoice_due_date;

    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const NAVY = '#1e1850';
    const LAV  = '#c4b5f4';
    const GRAY = '#666666';
    const AMBER = '#b45309';
    const W    = 495;

    // ── Header ──
    doc.rect(0, 0, 595, 70).fill(NAVY);
    if (logoBuffer) {
      try { doc.image(logoBuffer, 50, 12, { height: 46, fit: [120, 46] }); }
      catch (e) { doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('SCENKONSULT NORDEN', 50, 20); }
    } else {
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('SCENKONSULT NORDEN', 50, 20);
    }
    doc.fillColor('rgba(255,255,255,0.6)').fontSize(8).font('Helvetica')
       .text('Grimstagatan 164 · 162 58 Vällingby · 072-448 10 00 · scenkonsult.se', 50, 54);

    // ── Rubrik ──
    doc.fillColor(NAVY).fontSize(22).font('Helvetica-Bold').text('BETALNINGSPÅMINNELSE', 50, 90);

    // ── Amber-banner: vänlig påminnelse ──
    const bannerY = 124;
    doc.roundedRect(50, bannerY, W, 52, 6).fill('#fff7ed');
    doc.roundedRect(50, bannerY, W, 52, 6).lineWidth(1).stroke('#fdba74');
    doc.fillColor(AMBER).fontSize(10).font('Helvetica-Bold')
       .text(`Vänlig påminnelse — faktura ${invoiceNumber} har förfallit till betalning`, 64, bannerY + 10, { width: W - 28 });
    doc.fillColor('#7c2d12').fontSize(9).font('Helvetica')
       .text(
         overdue > 0
           ? `Förfallodagen var ${fmtDate(dueDate)} — det är ${overdue} ${overdue === 1 ? 'dag' : 'dagar'} sedan. Vi ber dig betala snarast.`
           : `Förfallodagen var ${fmtDate(dueDate)}. Vi ber dig betala snarast.`,
         64, bannerY + 28, { width: W - 28 });

    // ── Info-kolumner ──
    const infoY = bannerY + 72;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturanummer', 50, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(invoiceNumber, 50, infoY + 10);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturadatum', 50, infoY + 30);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(fmtDate(invDate), 50, infoY + 40);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Förfallodag', 50, infoY + 58);
    doc.fontSize(10).font('Helvetica-Bold').fillColor(AMBER).text(fmtDate(dueDate), 50, infoY + 68);

    // Kund (höger)
    const cx = 300;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Kund', cx, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text(cart.customer_name || '—', cx, infoY + 10);
    let ky = infoY + 26;
    if (cart.customer_company) { doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(cart.customer_company, cx, ky); ky += 14; }
    if (cart.customer_orgnr)   { doc.fontSize(9).font('Helvetica').fillColor(GRAY).text('Org.nr: ' + cart.customer_orgnr, cx, ky); ky += 14; }
    const addr = cart.use_invoice_email && cart.invoice_email ? null : (cart.customer_address || cart.event_location);
    if (addr) { doc.fontSize(9).fillColor(GRAY).text(addr, cx, ky); ky += 14; }
    if (cart.customer_ref) { doc.fontSize(9).fillColor(GRAY).text('Er ref: ' + cart.customer_ref, cx, ky); ky += 14; }

    // ── Belopp att betala (framträdande box) ──
    const boxY = Math.max(infoY + 88, ky + 16);
    doc.roundedRect(50, boxY, W, 40, 6).fill('#f4f4f7');
    doc.fillColor(GRAY).fontSize(9).font('Helvetica').text('Att betala (inkl. moms)', 64, boxY + 9);
    doc.fillColor(NAVY).fontSize(18).font('Helvetica-Bold').text(fmtKr(totalIncl), 64, boxY + 19);

    // ── Betalningsinformation ──
    let py = boxY + 60;
    doc.moveTo(50, py).lineTo(50 + W, py).lineWidth(1).stroke(LAV);
    py += 12;
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Betalningsinformation', 50, py);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e');
    doc.text('Bankgiro: 5132-0646', 50, py + 12);
    doc.text('Swish: 123 136 59 07', 50, py + 24);
    doc.text(`Ange fakturanummer ${invoiceNumber} som meddelande`, 50, py + 36);

    if (swishQrBuffer) {
      doc.fontSize(7).font('Helvetica').fillColor(GRAY).text('Betala med Swish', 50, py + 54);
      doc.image(swishQrBuffer, 50, py + 64, { width: 72, height: 72 });
    }

    // Avsändare (höger)
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('Avsändare', 300, py);
    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e')
       .text('Scenkonsult Norden (Sigvardsson Consulting AB)', 300, py + 12, { width: 245 })
       .text('Org.nr: 559068-4931', 300, py + 36);

    // ── Vänlig avslutning ──
    const noteY = py + 150;
    doc.fontSize(9).font('Helvetica').fillColor(GRAY).text(
      'Har du redan betalat? Tack — då kan du bortse från denna påminnelse, betalningar kan ta ' +
      'någon dag att registreras. Har du frågor om fakturan är du varmt välkommen att höra av dig ' +
      'på 072-448 10 00 eller info@scenkonsult.se, så löser vi det tillsammans.',
      50, noteY, { width: W, lineGap: 2 });

    doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e')
       .text('Med vänliga hälsningar,', 50, noteY + 44)
       .font('Helvetica-Bold').text('Scenkonsult Norden', 50, noteY + 56);

    doc.end();
  });
}

// ── Skicka mail med påminnelse-PDF ────────────────────────────────────────────
async function sendReminderEmail(apiKey, cart, invoiceNumber, overdue, totalIncl, pdfBuffer, toEmail, ccList) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="90" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">Scen · Ljud · Bild · Ljus · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#1e1850;margin:0 0 12px;">Vänlig påminnelse om faktura ${invoiceNumber}</h2>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Hej ${cart.customer_name || ''}!</p>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Vår faktura <strong>${invoiceNumber}</strong> förföll till betalning ${fmtDate(cart.invoice_due_date)}${overdue > 0 ? ` — för ${overdue} ${overdue === 1 ? 'dag' : 'dagar'} sedan` : ''}. Vi ser den ännu inte som betald och vill därför vänligt påminna dig.</p>
  <div style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:14px 18px;margin:0 0 20px;">
    <div style="color:#b45309;font-weight:700;font-size:15px;">Att betala: ${totalIncl.toLocaleString('sv-SE')} kr (inkl. moms)</div>
    <div style="color:#7c2d12;font-size:13px;margin-top:4px;">Bankgiro 5132-0646 · Swish 123 136 59 07 · ange ${invoiceNumber} som meddelande</div>
  </div>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Har du redan betalat kan du bortse från detta mail — det kan ta någon dag innan betalningen registreras. En kopia av påminnelsen finns bifogad som PDF.</p>
  <p style="color:#888;font-size:12px;margin:0;">Frågor? Ring <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.</p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  const plain = `Vänlig påminnelse om faktura ${invoiceNumber}\n\nHej ${cart.customer_name || ''}!\n\nVår faktura ${invoiceNumber} förföll till betalning ${fmtDate(cart.invoice_due_date)}${overdue > 0 ? ` (för ${overdue} ${overdue === 1 ? 'dag' : 'dagar'} sedan)` : ''}. Vi vill vänligt påminna dig.\n\nAtt betala: ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms\nBankgiro 5132-0646 · Swish 123 136 59 07 · ange ${invoiceNumber} som meddelande\n\nHar du redan betalat kan du bortse från detta mail.\n\nFrågor? Ring 072-448 10 00.\n---\nScenkonsult Norden`;

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM, to: [toEmail],
      ...(ccList.length ? { cc: ccList } : {}),
      reply_to: 'info@scenkonsult.se',
      subject: `Påminnelse: faktura ${invoiceNumber} har förfallit — Scenkonsult Norden`,
      html, text: plain,
      attachments: [{
        filename: `Paminnelse_${invoiceNumber}_Scenkonsult.pdf`,
        content: pdfBuffer.toString('base64'),
      }],
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
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
    if (!cart.invoice_number) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ingen faktura skickad ännu — skapa och skicka fakturan först' }) };
    if (cart.invoice_paid_at) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Fakturan är redan markerad som betald' }) };

    // Mottagare: fakturaadress om aktiv, annars kundens mail
    const toEmail = (cart.use_invoice_email && cart.invoice_email) ? cart.invoice_email : cart.customer_email;
    if (!toEmail) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Saknar mottagaradress (varken fakturaadress eller kundmail)' }) };
    const ccList = [
      ...(cart.use_invoice_email && cart.invoice_email && cart.customer_email ? [cart.customer_email] : []),
      ...(cart.cc_email ? [cart.cc_email] : []),
    ];

    const invoiceNumber = cart.invoice_number;
    const overdue = daysOverdue(cart.invoice_due_date);

    const items     = (cart.items || []).filter(i => !i._note && i.name);
    const totalExcl = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
    const totalIncl = Math.round(totalExcl * 1.25);

    let logoBuffer = null;
    try {
      const r = await fetch('https://scenkonsult.se/logo-white.png');
      if (r.ok) logoBuffer = Buffer.from(await r.arrayBuffer());
    } catch (e) { /* fortsätt utan logo */ }

    let swishQrBuffer = null;
    if (QRCode) {
      try {
        const amountStr = totalIncl.toFixed(2).replace('.', ',');
        const msg = encodeURIComponent(invoiceNumber);
        const qrPng = await QRCode.toBuffer(`C1231365907;${amountStr};${msg};0`, { type: 'png', width: 200, margin: 2, errorCorrectionLevel: 'M' });
        swishQrBuffer = qrPng;
      } catch (e) { console.error('SWISH_QR_ERROR:', e.message); }
    }

    const pdfBuffer = await generateReminderPdf(cart, invoiceNumber, overdue, totalIncl, logoBuffer, swishQrBuffer);
    await sendReminderEmail(apiKey, cart, invoiceNumber, overdue, totalIncl, pdfBuffer, toEmail, ccList);

    await db.update('carts', { invoice_reminder_sent_at: new Date().toISOString() }, 'id', cart_id)
      .catch(e => console.warn('invoice_reminder_sent_at uppdatering misslyckades (kolumn kanske saknas):', e.message));
    await logAudit(db, cart_id, 'admin', 'invoice_reminder_sent', { invoice_number: invoiceNumber, to: toEmail, overdue_days: overdue });

    console.log('INVOICE_REMINDER_SENT:', JSON.stringify({ cart_id, invoice_number: invoiceNumber, to: toEmail, overdue }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, to: toEmail, overdue_days: overdue }) };

  } catch (err) {
    console.error('INVOICE_REMINDER_ERROR:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
