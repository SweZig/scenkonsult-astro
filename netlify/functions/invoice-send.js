// netlify/functions/invoice-send.js
// POST { cart_id } + Bearer TOKEN
// 1. Hämtar order från Supabase
// 2. Sätter K-nummer om det saknas
// 3. Genererar PDF med pdfmake
// 4. Skickar via Resend med PDF som bilaga
// 5. Uppdaterar invoice_sent_at + status → fakturerad

const { supabase: createSupabase, logAudit } = require('./_lib');
const PdfPrinter = require('pdfmake');
const path = require('path');

const RESEND_API = 'https://api.resend.com/emails';
const FROM       = 'Scenkonsult Norden <noreply@scenkonsult.se>';
const SITE_URL   = 'https://scenkonsult.se';

// ── Fonts för pdfmake ────────────────────────────────────────────────────────
// Använder inbyggda standard PDF-fonter (helvetica) — kräver ingen fontfil
const fonts = {
  Helvetica: {
    normal:      'Helvetica',
    bold:        'Helvetica-Bold',
    italics:     'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

const printer = new PdfPrinter(fonts);

function fmtKr(ore) {
  // ore = integer, pris i kronor (vi lagrar som kr, inte ören)
  const n = parseInt(ore) || 0;
  return n.toLocaleString('sv-SE') + ' kr';
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('sv-SE');
}

// ── K-nummer — hämta nästa lediga ────────────────────────────────────────────
async function getOrCreateInvoiceNumber(db, cart) {
  if (cart.invoice_number) return cart.invoice_number;

  // Hitta högsta befintliga K-nummer
  const { data: allCarts } = await db.from('carts')
    .select('invoice_number')
    .neq('invoice_number', null)
    .catch(() => ({ data: [] }));

  let maxNum = 2009;
  (allCarts || []).forEach(c => {
    if (c.invoice_number && c.invoice_number.startsWith('K')) {
      const n = parseInt(c.invoice_number.slice(1));
      if (n > maxNum) maxNum = n;
    }
  });

  const newNum = 'K' + (maxNum + 1);
  await db.update('carts', { invoice_number: newNum }, 'id', cart.id);
  return newNum;
}

// ── Bygg PDF-dokument ────────────────────────────────────────────────────────
function buildInvoicePdf(cart, invoiceNumber, items) {
  const today      = new Date().toISOString().slice(0, 10);
  const invDate    = cart.invoice_date || today;
  const terms      = cart.payment_terms_days || 5;
  const dueDate    = cart.invoice_due_date || (() => {
    const d = new Date(invDate);
    d.setDate(d.getDate() + terms);
    return d.toISOString().slice(0, 10);
  })();

  const realItems  = items.filter(i => !i._note);
  const totalExcl  = realItems.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const vat        = Math.round(totalExcl * 0.25);
  const totalIncl  = totalExcl + vat;

  const NAVY  = '#1e1850';
  const LAV   = '#c4b5f4';
  const GRAY  = '#666666';
  const BLACK = '#1a1a2e';

  const tableBody = [
    // Header
    [
      { text: 'Produkt / Tjänst', style: 'tableHeader' },
      { text: 'Antal', style: 'tableHeader', alignment: 'center' },
      { text: 'À-pris', style: 'tableHeader', alignment: 'right' },
      { text: 'Delsumma', style: 'tableHeader', alignment: 'right' },
    ],
    // Rows
    ...realItems.map(i => [
      { text: i.name || '—', fontSize: 9, color: BLACK },
      { text: String(i.qty || 1), fontSize: 9, color: BLACK, alignment: 'center' },
      { text: fmtKr(i.price), fontSize: 9, color: BLACK, alignment: 'right' },
      { text: fmtKr((i.price || 0) * (i.qty || 1)), fontSize: 9, color: BLACK, alignment: 'right' },
    ]),
    // Totals
    [
      { text: 'Summa exkl. moms', colSpan: 3, fontSize: 9, color: GRAY, alignment: 'right', border: [false, true, false, false] },
      {}, {},
      { text: fmtKr(totalExcl), fontSize: 9, color: GRAY, alignment: 'right', border: [false, true, false, false] },
    ],
    [
      { text: 'Moms 25%', colSpan: 3, fontSize: 9, color: GRAY, alignment: 'right', border: [false, false, false, false] },
      {}, {},
      { text: fmtKr(vat), fontSize: 9, color: GRAY, alignment: 'right', border: [false, false, false, false] },
    ],
    [
      { text: 'Att betala (inkl. moms)', colSpan: 3, bold: true, fontSize: 11, color: NAVY, alignment: 'right', border: [false, true, false, false] },
      {}, {},
      { text: fmtKr(totalIncl), bold: true, fontSize: 11, color: NAVY, alignment: 'right', border: [false, true, false, false] },
    ],
  ];

  const docDef = {
    defaultStyle: { font: 'Helvetica', fontSize: 10, color: BLACK },
    pageMargins: [50, 60, 50, 60],
    content: [
      // Header bar
      {
        canvas: [{ type: 'rect', x: -50, y: -60, w: 600, h: 80, color: NAVY }],
        margin: [0, 0, 0, 0],
      },
      // Company name in header
      {
        text: 'SCENKONSULT NORDEN',
        absolutePosition: { x: 50, y: 22 },
        color: '#ffffff',
        bold: true,
        fontSize: 14,
        font: 'Helvetica',
      },
      {
        text: 'Grimstagatan 164 · 162 58 Vällingby · 072-448 10 00 · scenkonsult.se',
        absolutePosition: { x: 50, y: 42 },
        color: 'rgba(255,255,255,0.6)',
        fontSize: 8,
        font: 'Helvetica',
      },

      // FAKTURA heading
      { text: 'FAKTURA', fontSize: 22, bold: true, color: NAVY, margin: [0, 30, 0, 4] },

      // Two-column info block
      {
        columns: [
          {
            stack: [
              { text: 'Fakturanummer', color: GRAY, fontSize: 8 },
              { text: invoiceNumber, bold: true, fontSize: 11, color: NAVY },
              { text: ' ', fontSize: 4 },
              { text: 'Fakturadatum', color: GRAY, fontSize: 8 },
              { text: fmtDate(invDate), fontSize: 10 },
              { text: ' ', fontSize: 4 },
              { text: 'Förfallodag', color: GRAY, fontSize: 8 },
              { text: fmtDate(dueDate), fontSize: 10, bold: true },
            ],
          },
          {
            stack: [
              { text: 'Kund', color: GRAY, fontSize: 8 },
              { text: cart.customer_name || '—', bold: true, fontSize: 11 },
              cart.customer_orgnr ? { text: 'Org.nr: ' + cart.customer_orgnr, fontSize: 9, color: GRAY } : {},
              cart.customer_address || cart.event_location
                ? { text: cart.customer_address || cart.event_location, fontSize: 9, color: GRAY }
                : {},
              cart.customer_ref ? { text: 'Er ref: ' + cart.customer_ref, fontSize: 9, color: GRAY } : {},
              { text: ' ', fontSize: 4 },
              { text: 'Vår referens', color: GRAY, fontSize: 8 },
              { text: cart.invoice_ref || 'Per S', fontSize: 9 },
            ],
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20],
      },

      // Event info
      cart.event_date ? {
        text: `Hyresperiod: utlämning ${fmtDate(cart.event_date)} kl 15:00  •  återlämning ${fmtDate(cart.return_date || cart.event_date)} kl 11:00`,
        color: GRAY, fontSize: 9, margin: [0, 0, 0, 12],
      } : {},

      // Product table
      {
        table: {
          headerRows: 1,
          widths: ['*', 40, 70, 70],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i) => i === 0 || i === 1 ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: () => '#e0e0e8',
          fillColor: (i) => i === 0 ? '#f4f4f7' : (i % 2 === 0 ? '#fafafa' : null),
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
        margin: [0, 0, 0, 20],
      },

      // Payment info
      {
        columns: [
          {
            stack: [
              { text: 'Betalningsinformation', color: GRAY, fontSize: 8, bold: true },
              { text: 'Bankgiro: 5132-0646', fontSize: 9 },
              { text: 'Swish: 123 136 59 07', fontSize: 9 },
              { text: `Betalningsvillkor: ${terms} dagar netto`, fontSize: 9, color: GRAY },
            ],
          },
          {
            stack: [
              { text: 'Avsändare', color: GRAY, fontSize: 8, bold: true },
              { text: 'Scenkonsult Norden (Sigvardsson Consulting AB)', fontSize: 9 },
              { text: 'Org.nr: 559068-4931', fontSize: 9, color: GRAY },
              { text: 'Postadress: Vinsta Skolgränd 4, 162 70 Vällingby', fontSize: 9, color: GRAY },
            ],
          },
        ],
        columnGap: 20,
      },

      // Footer line
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1, lineColor: LAV }], margin: [0, 20, 0, 8] },
      {
        text: 'Tack för ditt förtroende! Frågor? Ring 072-448 10 00 eller maila info@scenkonsult.se',
        color: GRAY, fontSize: 8, alignment: 'center',
      },
    ],
    styles: {
      tableHeader: { bold: true, fontSize: 9, color: GRAY, fillColor: '#f4f4f7' },
    },
  };

  return docDef;
}

// ── Generera PDF-buffer ───────────────────────────────────────────────────────
function generatePdfBuffer(docDef) {
  return new Promise((resolve, reject) => {
    const doc = printer.createPdfKitDocument(docDef);
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

// ── Skicka via Resend ─────────────────────────────────────────────────────────
async function sendInvoiceEmail(apiKey, cart, invoiceNumber, pdfBuffer) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
  <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">Scenkonsult Norden</p>
  <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;">Ljud · Ljus · Scen · DJ — Stockholm sedan 1986</p>
</td></tr>
<tr><td style="background:#fff;padding:32px;border-left:1px solid #e0e0e8;border-right:1px solid #e0e0e8;">
  <h2 style="color:#1e1850;margin:0 0 12px;">Faktura ${invoiceNumber}</h2>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Hej ${cart.customer_name || ''}!</p>
  <p style="color:#444;line-height:1.7;margin:0 0 16px;">Tack för att du valde Scenkonsult Norden. Bifogat finner du faktura <strong>${invoiceNumber}</strong> för din beställning.</p>
  <p style="color:#444;font-size:14px;margin:0 0 8px;"><strong>Att betala:</strong> ${(() => {
    const items = (cart.items||[]).filter(i=>!i._note);
    const t = items.reduce((s,i)=>s+((i.price||0)*(i.qty||1)),0);
    return Math.round(t*1.25).toLocaleString('sv-SE') + ' kr';
  })()}</p>
  <p style="color:#666;font-size:13px;margin:0 0 20px;">Betalas till Swish 123 136 59 07 eller Bankgiro 5132-0646.</p>
  <p style="color:#888;font-size:12px;margin:0;">Frågor? Ring <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.</p>
</td></tr>
<tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">Scenkonsult Norden · Grimstagatan 164, 162 58 Vällingby</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  const plain = `Faktura ${invoiceNumber} från Scenkonsult Norden\n\nHej ${cart.customer_name||''}!\n\nBifogat finner du faktura ${invoiceNumber}.\n\nFrågor? Ring 072-448 10 00.\n\n---\nScenkonsult Norden`;

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      from:        FROM,
      to:          [cart.customer_email],
      reply_to:    'info@scenkonsult.se',
      bcc:         ['info@scenkonsult.se'],
      subject:     `Faktura ${invoiceNumber} — Scenkonsult Norden`,
      html,
      text:        plain,
      attachments: [{
        filename:    `Faktura_${invoiceNumber}_Scenkonsult.pdf`,
        content:     pdfBuffer.toString('base64'),
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const adminToken = process.env.ADMIN_TOKEN;
  const auth = (event.headers['authorization'] || '').replace('Bearer ', '');
  if (!adminToken || auth !== adminToken) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Ej behörig' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltigt JSON' }) }; }

  const { cart_id } = body;
  if (!cart_id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cart_id krävs' }) };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'RESEND_API_KEY saknas' }) };

  try {
    const db = createSupabase();

    // 1. Hämta order
    const { data: cart, error } = await db.from('carts').select('*').eq('id', cart_id).single();
    if (error || !cart) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order hittades inte' }) };
    if (!cart.customer_email) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Kunden saknar e-postadress' }) };

    // 2. K-nummer
    const invoiceNumber = await getOrCreateInvoiceNumber(db, cart);

    // 3. Generera PDF
    const items = cart.items || [];
    const docDef = buildInvoicePdf({ ...cart, invoice_number: invoiceNumber }, invoiceNumber, items);
    const pdfBuffer = await generatePdfBuffer(docDef);

    // 4. Skicka mail
    await sendInvoiceEmail(apiKey, cart, invoiceNumber, pdfBuffer);

    // 5. Uppdatera DB
    const now = new Date().toISOString();
    await db.update('carts', {
      invoice_number:  invoiceNumber,
      invoice_sent_at: now,
      status:          'fakturerad',
    }, 'id', cart_id);

    await logAudit(db, cart_id, 'admin', 'invoice_sent', { invoice_number: invoiceNumber, to: cart.customer_email });

    console.log('INVOICE_SENT:', JSON.stringify({ cart_id, invoice_number: invoiceNumber, to: cart.customer_email }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, invoice_number: invoiceNumber }),
    };

  } catch (err) {
    console.error('INVOICE_ERROR:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
