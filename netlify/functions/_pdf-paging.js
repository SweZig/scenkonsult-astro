// netlify/functions/_pdf-paging.js
// Sidbrytning för fakturor/order-PDF:er som ritas med absoluta koordinater i PDFKit.
//
// Bakgrund (K2179, 2026-09-30): PDFKit lägger automatiskt till en ny sida för
// VARJE text()-anrop vars y hamnar under bottenmarginalen. Eftersom fakturorna
// ritas med absoluta koordinater (x, y) fortsätter koden sedan att skriva på den
// nya sidan med samma höga y-värde — så varje efterföljande element hamnar på en
// egen, nästan tom sida. En faktura med ~25 rader blev 14 sidor.
//
// Lösningen är att bryta sida själva INNAN vi ritar något som inte får plats.

'use strict';

// A4 = 842 pt hög, marginal 50 → PDFKit sidbryter vid 792. 12 pt luft under.
const PAGE_BOTTOM = 780;
// Där innehållet börjar på en fortsättningssida
const CONT_TOP = 60;

// Har vi plats för `needed` pt från y? Annars ny sida. Returnerar y att rita på.
function ensureSpace(doc, y, needed, onNewPage) {
  if (y + needed <= PAGE_BOTTOM) return y;
  doc.addPage();
  if (onNewPage) onNewPage();
  return CONT_TOP;
}

// Liten rad överst på fortsättningssidor: "Faktura K2179 (forts.)"
function drawContinuationLabel(doc, label, color = '#666666') {
  if (!label) return;
  doc.fontSize(8).font('Helvetica').fillColor(color).text(`${label} (forts.)`, 50, 38, { lineBreak: false });
}

module.exports = { PAGE_BOTTOM, CONT_TOP, ensureSpace, drawContinuationLabel };
