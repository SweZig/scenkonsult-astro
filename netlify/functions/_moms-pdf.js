// netlify/functions/_moms-pdf.js
// Momsdelarna av faktura-PDF:erna — gemensamma för invoice-send,
// invoice-pdf-download, invoice-credit och invoice-reminder-send.
// Regeln (vem som är momsfri, texter, belopp) ligger i src/lib/moms.cjs.
'use strict';

const Moms = require('../../src/lib/moms.cjs');

const GRAY = '#666666';
const NAVY = '#1e1850';

/** Avsändarens org.nr och momsreg.nr på en rad. */
const SELLER_LINE = 'Org.nr: 559068-4931 · Momsreg.nr: ' + Moms.SELLER_VAT_ID;

/**
 * Härled svenskt momsreg.nr ur org.nr: "SE" + tio siffror + "01".
 * Bara för svenska kunder — en utländsk kund har eget VAT-nummer.
 */
function orgnrToVat(orgnr) {
  if (!orgnr) return null;
  const digits = String(orgnr).replace(/\D/g, '');
  if (digits.length < 10) return null;
  return 'SE' + digits.slice(0, 10) + '01';
}

/** Underrubrik under FAKTURA/KREDITFAKTURA när ordern är momsfri. */
function drawVatSubtitle(doc, cart, x, y) {
  const v = Moms.info(cart);
  if (!v.exempt) return;
  doc.fillColor(NAVY).fontSize(10).font('Helvetica-Bold').text('NON-VAT INVOICE', x, y);
}

/**
 * Kundens momsrader i högerkolumnen. Returnerar nytt ky.
 * Momsfri kund: VAT-nummer (EU) och land. Svensk B2B: härlett momsreg.nr.
 */
function drawCustomerVat(doc, cart, cx, ky, { b2b }) {
  const v = Moms.info(cart);
  doc.fontSize(9).font('Helvetica').fillColor(GRAY);
  if (v.exempt) {
    if (v.buyerVatId) { doc.text('VAT-nr: ' + v.buyerVatId, cx, ky); ky += 14; }
    if (v.country)    { doc.text('Land / Country: ' + v.country, cx, ky); ky += 14; }
    return ky;
  }
  const vatNum = b2b ? orgnrToVat(cart.customer_orgnr) : null;
  if (vatNum) { doc.text('Momsreg.nr: ' + vatNum, cx, ky); ky += 14; }
  return ky;
}

/**
 * Summaraderna efter "Summa exkl. moms": [etikett, belopp, färg, typsnitt].
 * Beloppen formateras av anroparen.
 */
function totalsRows(totalExcl, cart, { payLabel = 'Att betala', payColor = NAVY } = {}) {
  const v = Moms.info(cart);
  const vat = Moms.vatOf(totalExcl, cart);
  const total = Moms.inclOf(totalExcl, cart);
  if (v.exempt) {
    return {
      vat, total,
      rows: [
        ['Moms 0%', vat, GRAY, 'Helvetica'],
        [payLabel + ' (ingen svensk moms)', total, payColor, 'Helvetica-Bold'],
      ],
    };
  }
  return {
    vat, total,
    rows: [
      ['Moms 25%', vat, GRAY, 'Helvetica'],
      [payLabel + ' inkl. moms', total, payColor, 'Helvetica-Bold'],
    ],
  };
}

/** Höjd som momsnotisen tar (för ensureSpace). 0 när ordern har moms. */
function noticeHeight(cart) {
  return Moms.info(cart).exempt ? 40 : 0;
}

/** Lagtexten under summan: svenska + engelska. Returnerar nytt ry. */
function drawVatNotice(doc, cart, ry, W) {
  const v = Moms.info(cart);
  if (!v.exempt) return ry;
  ry += 6;
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(NAVY)
     .text(v.notice.sv, 50, ry, { width: W, align: 'right' });
  ry += 12;
  doc.fontSize(8).font('Helvetica-Oblique').fillColor(GRAY)
     .text(v.notice.en, 50, ry, { width: W, align: 'right' });
  ry += 20;
  return ry;
}

module.exports = {
  Moms, SELLER_LINE, orgnrToVat,
  drawVatSubtitle, drawCustomerVat, totalsRows, noticeHeight, drawVatNotice,
};
