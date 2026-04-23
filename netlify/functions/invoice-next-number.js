// netlify/functions/invoice-next-number.js
// GET /.netlify/functions/invoice-next-number + Bearer TOKEN
// Returnerar serverns faktiska beräknade nästa K-nummer (inkl reservationer OCH krediter).

'use strict';
const { isAdmin, ok, err, preflight, getTakenInvoiceNumbers } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET')     return err('Metod ej tillåten', 405);
  if (!isAdmin(event))                return err('Ej behörig', 401);

  try {
    const { taken, highest, START_NUM } = await getTakenInvoiceNumbers();
    let next = START_NUM;
    while (taken.has(next)) next++;
    return ok({
      next_number: 'K' + next,
      next_num:    next,
      highest:     'K' + highest,
      taken_count: taken.size,
    });
  } catch (e) {
    console.error('INVOICE_NEXT_NUMBER_ERROR:', e.message);
    return err('Serverfel: ' + e.message, 500);
  }
};
