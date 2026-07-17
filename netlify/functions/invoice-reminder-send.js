// netlify/functions/invoice-reminder-send.js
// POST { cart_id, level } + Bearer ADMIN_TOKEN
// Skickar en BETALNINGSPÅMINNELSE i fyra eskalerande nivåer som PDF-bilaga
// till fakturaadressen. Förutsätter att en faktura redan skickats
// (invoice_number + invoice_due_date) och att den inte är betald.
//
//   Nivå 1  Påminnelse       — vänlig, ingen avgift
//   Nivå 2  Påminnelse 2     — vänlig men tydligare, ingen avgift
//   Nivå 3  Krav             — skärpt ton, +60 kr påminnelseavgift (momsfri), +8 dgr betalfrist
//   Nivå 4  Inkassokrav      — formell, +180 kr inkassoavgift (momsfri), varning om Kronofogden
//
// Avgifterna är lagstadgade och MOMSFRIA — de läggs ovanpå fakturabeloppet och
// ackumuleras (nivå 4 = faktura + 60 + 180). Standardavgiften saknar moms.

'use strict';

const { supabase: createSupabase, logAudit } = require('./_lib');
const PDFDocument = require('pdfkit');
let QRCode; try { QRCode = require('qrcode'); } catch (e) { QRCode = null; }

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <hej@scenkonsult.se>';
const LOGO_URL   = 'https://scenkonsult.se/logo-white.png';

// ── Nivåkonfiguration ─────────────────────────────────────────────────────────
// feeOre = avgift för DENNA nivå (momsfri). Ackumulerad avgift = summa av feeOre t.o.m. nivån.
const LEVELS = {
  1: { key: 'paminnelse',  pdfTitle: 'BETALNINGSPÅMINNELSE',   feeOre: 0,     extendDays: 0 },
  2: { key: 'paminnelse2', pdfTitle: 'BETALNINGSPÅMINNELSE 2', feeOre: 0,     extendDays: 0 },
  3: { key: 'krav',        pdfTitle: 'BETALNINGSKRAV',         feeOre: 6000,  extendDays: 8 },
  4: { key: 'inkasso',     pdfTitle: 'INKASSOKRAV',            feeOre: 18000, extendDays: 8 },
};
// Ackumulerad avgift i öre t.o.m. angiven nivå
function accFeeOre(level) {
  let sum = 0;
  for (let n = 1; n <= level; n++) sum += (LEVELS[n] ? LEVELS[n].feeOre : 0);
  return sum;
}

function fmtKr(n) { return (parseInt(n) || 0).toLocaleString('sv-SE').replace(/ /g, ' ') + ' kr'; }
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
function addDaysIso(days) {
  const d = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Text-byggstenar per nivå (delas mellan PDF, mail och plaintext) ───────────────
function feeBreakdown(level) {
  if (level >= 4) return 'Varav 60 kr påminnelseavgift + 180 kr inkassoavgift (momsfria)';
  if (level >= 3) return 'Varav 60 kr påminnelseavgift (momsfri)';
  return '';
}
function subjectFor(level, inv) {
  switch (level) {
    case 4:  return `INKASSOKRAV: faktura ${inv} — ärendet överlämnas till Kronofogden`;
    case 3:  return `Betalningskrav: faktura ${inv} — påminnelseavgift tillkommer`;
    case 2:  return `Påminnelse 2: faktura ${inv} är fortfarande obetald`;
    default: return `Vänlig påminnelse: faktura ${inv} — Scenkonsult Norden`;
  }
}
// Färgtema för amber/orange/röd banner
function bannerTheme(level) {
  if (level >= 4) return { bg: '#fef2f2', border: '#fca5a5', title: '#b91c1c', text: '#7f1d1d' };
  if (level >= 3) return { bg: '#fff1e6', border: '#fb923c', title: '#c2410c', text: '#7c2d12' };
  return               { bg: '#fff7ed', border: '#fdba74', title: '#b45309', text: '#7c2d12' };
}
function bannerHeading(level, inv) {
  switch (level) {
    case 4:  return `Inkassokrav — faktura ${inv}`;
    case 3:  return `Betalningskrav — faktura ${inv} är obetald trots tidigare påminnelser`;
    case 2:  return `Påminnelse 2 — faktura ${inv} är fortfarande obetald`;
    default: return `Vänlig påminnelse — faktura ${inv} har förfallit till betalning`;
  }
}
function bannerSub(level, dueDate, overdue, kravDate) {
  const sinceTxt = overdue > 0
    ? `Förfallodagen var ${fmtDate(dueDate)} — det är ${overdue} ${overdue === 1 ? 'dag' : 'dagar'} sedan.`
    : `Förfallodagen var ${fmtDate(dueDate)}.`;
  switch (level) {
    case 4:  return `${sinceTxt} En inkassoavgift om 180 kr har tillkommit. Har full betalning inte registrerats senast ${fmtDate(kravDate)} överlämnas ärendet till Kronofogdemyndigheten.`;
    case 3:  return `${sinceTxt} En påminnelseavgift om 60 kr har tillkommit. Vi ber dig betala senast ${fmtDate(kravDate)}. Dröjsmålsränta debiteras enligt räntelagen.`;
    case 2:  return `${sinceTxt} Vi har tidigare påminnt men ser den ännu inte som betald. Vi ber dig betala snarast.`;
    default: return `${sinceTxt} Vi ber dig betala snarast.`;
  }
}

// ── Generera påminnelse-PDF ──────────────────────────────────────────────────
function generateReminderPdf(cart, invoiceNumber, level, overdue, totalIncl, accFeeKr, kravDate, logoBuffer, swishQrBuffer) {
  return new Promise((resolve, reject) => {
    const invDate = cart.invoice_date || new Date().toISOString().slice(0, 10);
    const dueDate = cart.invoice_due_date;
    const conf    = LEVELS[level];

    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const NAVY = '#1e1850';
    const LAV  = '#c4b5f4';
    const GRAY = '#666666';
    const W    = 495;
    const th   = bannerTheme(level);

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
    doc.fillColor(NAVY).fontSize(22).font('Helvetica-Bold').text(conf.pdfTitle, 50, 90);

    // ── Banner: eskalerande ton ──
    const bannerY = 124;
    doc.roundedRect(50, bannerY, W, 56, 6).fill(th.bg);
    doc.roundedRect(50, bannerY, W, 56, 6).lineWidth(1).stroke(th.border);
    doc.fillColor(th.title).fontSize(10).font('Helvetica-Bold')
       .text(bannerHeading(level, invoiceNumber), 64, bannerY + 10, { width: W - 28 });
    doc.fillColor(th.text).fontSize(9).font('Helvetica')
       .text(bannerSub(level, dueDate, overdue, kravDate), 64, bannerY + 26, { width: W - 28 });

    // ── Info-kolumner ──
    const infoY = bannerY + 76;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturanummer', 50, infoY);
    doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(invoiceNumber, 50, infoY + 10);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Fakturadatum', 50, infoY + 30);
    doc.fontSize(10).font('Helvetica').fillColor('#1a1a2e').text(fmtDate(invDate), 50, infoY + 40);

    doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Förfallodag', 50, infoY + 58);
    doc.fontSize(10).font('Helvetica-Bold').fillColor(th.title).text(fmtDate(dueDate), 50, infoY + 68);

    // Ny sista betaldag (nivå 3–4)
    if (kravDate) {
      doc.fontSize(8).font('Helvetica').fillColor(GRAY).text('Sista betaldag', 160, infoY + 58);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(th.title).text(fmtDate(kravDate), 160, infoY + 68);
    }

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
    const hasBreak = accFeeKr > 0;
    const boxH = hasBreak ? 52 : 40;
    const boxY = Math.max(infoY + 92, ky + 16);
    doc.roundedRect(50, boxY, W, boxH, 6).fill('#f4f4f7');
    doc.fillColor(GRAY).fontSize(9).font('Helvetica').text('Att betala (inkl. moms)', 64, boxY + 9);
    doc.fillColor(NAVY).fontSize(18).font('Helvetica-Bold').text(fmtKr(totalIncl), 64, boxY + 19);
    if (hasBreak) {
      doc.fillColor(GRAY).fontSize(8).font('Helvetica').text(feeBreakdown(level), 64, boxY + 40);
    }

    // ── Betalningsinformation ──
    let py = boxY + boxH + 20;
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

    // ── Avslutning (ton per nivå) ──
    const noteY = py + 150;
    let closing;
    if (level >= 4) {
      closing = 'Om full betalning inte har registrerats senast ' + fmtDate(kravDate) + ' kommer ärendet att ' +
        'överlämnas till Kronofogdemyndigheten med ansökan om betalningsföreläggande. Det medför ytterligare ' +
        'kostnader och kan leda till en betalningsanmärkning. Vill du lösa detta innan dess är du välkommen att ' +
        'kontakta oss omgående på 072-448 10 00 eller info@scenkonsult.se.';
    } else if (level >= 3) {
      closing = 'Betala senast ' + fmtDate(kravDate) + ' för att undvika att ärendet går vidare till inkasso. ' +
        'Har du redan betalat kan du bortse från detta — det kan ta någon dag innan betalningen registreras. ' +
        'Har du frågor om fakturan, kontakta oss omgående på 072-448 10 00.';
    } else {
      closing = 'Har du redan betalat? Tack — då kan du bortse från denna påminnelse, betalningar kan ta ' +
        'någon dag att registreras. Har du frågor om fakturan är du varmt välkommen att höra av dig ' +
        'på 072-448 10 00 eller info@scenkonsult.se, så löser vi det tillsammans.';
    }
    doc.fontSize(9).font('Helvetica').fillColor(GRAY).text(closing, 50, noteY, { width: W, lineGap: 2 });

    if (level >= 3) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#1a1a2e').text('Scenkonsult Norden', 50, noteY + 60);
    } else {
      doc.fontSize(9).font('Helvetica').fillColor('#1a1a2e').text('Med vänliga hälsningar,', 50, noteY + 48)
         .font('Helvetica-Bold').text('Scenkonsult Norden', 50, noteY + 60);
    }

    doc.end();
  });
}

// ── Mail-brödtext per nivå ────────────────────────────────────────────────────
function emailBodyParas(level, cart, invoiceNumber, dueDate, overdue, kravDate) {
  const namn = cart.customer_name || '';
  const sinceMail = fmtDate(dueDate) + (overdue > 0 ? ` — för ${overdue} ${overdue === 1 ? 'dag' : 'dagar'} sedan` : '');
  switch (level) {
    case 4: return [
      `Hej ${namn}.`,
      `Detta är ett inkassokrav avseende faktura <strong>${invoiceNumber}</strong>, som förföll ${sinceMail} och trots tidigare påminnelser och betalningskrav fortfarande är obetald.`,
      `En inkassoavgift om 180 kr har lagts till beloppet. Dröjsmålsränta debiteras enligt räntelagen (referensränta + 8 %).`,
      `<strong>Om full betalning inte har registrerats senast ${fmtDate(kravDate)} kommer ärendet att överlämnas till Kronofogdemyndigheten</strong> med ansökan om betalningsföreläggande. Det medför ytterligare kostnader och kan leda till en betalningsanmärkning.`,
      `Vill du lösa detta innan dess? Kontakta oss omgående på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.`,
    ];
    case 3: return [
      `Hej ${namn}.`,
      `Faktura <strong>${invoiceNumber}</strong> förföll ${sinceMail} och är trots tidigare påminnelser fortfarande obetald. Vi ber dig betala omgående.`,
      `I enlighet med våra villkor har en påminnelseavgift om 60 kr lagts till, och dröjsmålsränta debiteras enligt räntelagen (referensränta + 8 %). Sista betaldag är <strong>${fmtDate(kravDate)}</strong>.`,
      `Betala senast ${fmtDate(kravDate)} för att undvika att ärendet går vidare till inkasso. Har du frågor om fakturan, kontakta oss på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a>.`,
    ];
    case 2: return [
      `Hej ${namn}.`,
      `Vi påminde nyligen om faktura <strong>${invoiceNumber}</strong> som förföll ${sinceMail}, men ser den fortfarande inte som betald. Vi vill därför påminna en gång till.`,
      `Är något oklart med fakturan, eller behöver du dela upp betalningen? Hör av dig på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller info@scenkonsult.se så löser vi det tillsammans.`,
    ];
    default: return [
      `Hej ${namn}!`,
      `Vår faktura <strong>${invoiceNumber}</strong> förföll till betalning ${sinceMail}. Vi ser den ännu inte som betald — kanske har den bara råkat hamna mellan stolarna.`,
      `Har du redan betalat kan du bortse från detta mail; det kan ta någon dag innan betalningen registreras. En kopia finns bifogad som PDF.`,
    ];
  }
}

// ── Skicka mail med påminnelse-PDF ────────────────────────────────────────────
async function sendReminderEmail(apiKey, cart, invoiceNumber, level, overdue, totalIncl, accFeeKr, kravDate, pdfBuffer, toEmail, ccList) {
  const th   = bannerTheme(level);
  const dueDate = cart.invoice_due_date;
  const paras = emailBodyParas(level, cart, invoiceNumber, dueDate, overdue, kravDate);
  const heading = level >= 4 ? `Inkassokrav — faktura ${invoiceNumber}`
                : level >= 3 ? `Betalningskrav — faktura ${invoiceNumber}`
                : level >= 2 ? `Påminnelse 2 — faktura ${invoiceNumber}`
                :              `Vänlig påminnelse om faktura ${invoiceNumber}`;
  const breakdown = feeBreakdown(level);

  const bodyHtml = paras.map(p => `<p style="color:#444;line-height:1.7;margin:0 0 16px;">${p}</p>`).join('\n');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <img src="${LOGO_URL}" alt="Scenkonsult Norden" width="90" style="display:block;margin:0 auto 10px;height:auto;" />
  <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">Scen · Ljud · Bild · Ljus · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#1e1850;margin:0 0 16px;">${heading}</h2>
  ${bodyHtml}
  <div style="background:${th.bg};border:1px solid ${th.border};border-radius:10px;padding:14px 18px;margin:4px 0 20px;">
    <div style="color:${th.title};font-weight:700;font-size:15px;">Att betala: ${totalIncl.toLocaleString('sv-SE')} kr (inkl. moms)</div>
    ${breakdown ? `<div style="color:${th.text};font-size:12px;margin-top:3px;">${breakdown}</div>` : ''}
    <div style="color:${th.text};font-size:13px;margin-top:6px;">Bankgiro 5132-0646 · Swish 123 136 59 07 · ange ${invoiceNumber} som meddelande</div>
    ${kravDate ? `<div style="color:${th.title};font-size:13px;font-weight:700;margin-top:6px;">Sista betaldag: ${fmtDate(kravDate)}</div>` : ''}
  </div>
  <p style="color:#888;font-size:12px;margin:0;">En kopia av ${level >= 4 ? 'inkassokravet' : level >= 3 ? 'betalningskravet' : 'påminnelsen'} finns bifogad som PDF. Frågor? Ring <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.</p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  // plaintext (Gmail penaljar HTML-only)
  const stripTags = s => s.replace(/<[^>]+>/g, '');
  const plain = `${heading}\n\n${paras.map(stripTags).join('\n\n')}\n\n` +
    `Att betala: ${totalIncl.toLocaleString('sv-SE')} kr inkl. moms${breakdown ? ` (${breakdown})` : ''}\n` +
    `Bankgiro 5132-0646 · Swish 123 136 59 07 · ange ${invoiceNumber} som meddelande` +
    `${kravDate ? `\nSista betaldag: ${fmtDate(kravDate)}` : ''}\n\nFrågor? Ring 072-448 10 00.\n---\nScenkonsult Norden`;

  const filePrefix = level >= 4 ? 'Inkassokrav' : level >= 3 ? 'Betalningskrav' : 'Paminnelse';

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM, to: [toEmail],
      ...(ccList.length ? { cc: ccList } : {}),
      reply_to: 'info@scenkonsult.se',
      subject: subjectFor(level, invoiceNumber),
      html, text: plain,
      attachments: [{
        filename: `${filePrefix}_${invoiceNumber}_Scenkonsult.pdf`,
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

  // Nivå 1–4 (default 1 för bakåtkompatibilitet med äldre klient)
  let level = parseInt(body.level, 10);
  if (!Number.isInteger(level) || level < 1 || level > 4) level = 1;

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

    // Bas: samma summering som fakturan (fakturaavgiften ligger redan som item-rad)
    const items     = (cart.items || []).filter(i => !i._note && i.name);
    const baseExcl  = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
    const baseIncl  = Math.round(baseExcl * 1.25);

    // Ackumulerad, momsfri påminnelse-/inkassoavgift + totalt att betala
    const feeOre    = accFeeOre(level);
    const feeKr     = Math.round(feeOre / 100);
    const totalIncl = baseIncl + feeKr;

    // Ny sista betaldag för krav/inkassokrav (nivå 3–4)
    const conf     = LEVELS[level];
    const kravDate = conf.extendDays > 0 ? addDaysIso(conf.extendDays) : null;

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

    const pdfBuffer = await generateReminderPdf(cart, invoiceNumber, level, overdue, totalIncl, feeKr, kravDate, logoBuffer, swishQrBuffer);
    await sendReminderEmail(apiKey, cart, invoiceNumber, level, overdue, totalIncl, feeKr, kravDate, pdfBuffer, toEmail, ccList);

    // ── Uppdatera cart: nivå, ackumulerad avgift, historik, sista betaldag ──
    const nowIso = new Date().toISOString();
    const logEntry = { level, at: nowIso, fee_ore: feeOre, due: kravDate, overdue_days: overdue };
    const prevLog  = Array.isArray(cart.invoice_reminder_log) ? cart.invoice_reminder_log : [];
    const fullUpdate = {
      invoice_reminder_level:    level,
      invoice_reminder_fee_ore:  feeOre,
      invoice_reminder_log:      [...prevLog, logEntry],
      invoice_reminder_due_date: kravDate,
      invoice_reminder_sent_at:  nowIso,
    };
    try {
      await db.update('carts', fullUpdate, 'id', cart_id);
    } catch (e) {
      // Graceful degradation om migrationen inte körts än — skriv åtminstone tidsstämpeln
      console.warn('Reminder-kolumner saknas troligen (kör migration 2026-07-17_reminder_levels.sql):', e.message);
      await db.update('carts', { invoice_reminder_sent_at: nowIso }, 'id', cart_id)
        .catch(e2 => console.warn('invoice_reminder_sent_at uppdatering misslyckades:', e2.message));
    }

    await logAudit(db, cart_id, 'admin', 'invoice_reminder_sent', {
      invoice_number: invoiceNumber, to: toEmail, level, fee_ore: feeOre, overdue_days: overdue, due: kravDate,
    });

    console.log('INVOICE_REMINDER_SENT:', JSON.stringify({ cart_id, invoice_number: invoiceNumber, to: toEmail, level, overdue, fee_ore: feeOre }));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, to: toEmail, level, overdue_days: overdue, fee_ore: feeOre, total_incl: totalIncl, due: kravDate }) };

  } catch (err) {
    console.error('INVOICE_REMINDER_ERROR:', err.message, err.stack);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
