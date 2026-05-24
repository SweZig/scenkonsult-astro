// netlify/functions/_pickup-sms.js
// SMS-text-mall för förberedelse-länken. Differentierad per delivery_mode.
//
// Mål: en SMS-segment (≤ 160 tecken med GSM-7, ≤ 70 med Unicode/å/ä/ö).
// 46elks räknar svenska tecken som GSM-7 om de finns i tabellen — å, ä, ö
// FINNS i GSM-7-extension så vi får 160 tecken. Men: emoji/övriga unicode
// triggar Unicode-mode (70 tecken/segment). Vi håller texten utan emoji.

'use strict';

const PHONE_DISPLAY = '072-448 10 00';

/**
 * Bygger SMS-text för förberedelse-länken.
 *
 * @param {object} cart - {customer_name, delivery_mode, delivery_time, ...}
 * @param {string} shortToken - 8-hex token från ensureShortToken()
 * @returns {string} SMS-meddelande (≤ 160 tecken vid normalt namn)
 */
function getPickupSms(cart, shortToken) {
  const customerName = (cart.customer_name || '').trim();
  const firstName = customerName.split(' ')[0] || null;
  const greeting = firstName ? `Hej ${firstName}!` : 'Hej!';
  const isDelivery = cart.delivery_mode === 'delivery';
  const timeStr = cart.delivery_time || (isDelivery ? '09:00' : '13:00');
  const url = `scenkonsult.se/u/${shortToken}`;

  if (isDelivery) {
    return `${greeting} Vi levererar utrustningen imorgon ca kl ${timeStr}. Förbered leveransen så går det snabbt på plats: ${url} Frågor: ${PHONE_DISPLAY}`;
  } else {
    return `${greeting} Hyresperioden börjar imorgon kl ${timeStr}. Förbered utlämningen så går det snabbt på plats: ${url} Frågor: ${PHONE_DISPLAY}`;
  }
}

/**
 * Räknar segment för debug/logging. GSM-7 = 160/segment, Unicode = 70/segment.
 * Approximation: om texten innehåller tecken utanför basic latin + svenska
 * extension så är det Unicode-mode.
 */
function estimateSmsSegments(message) {
  // GSM-7 basic + extension (inkl. å, ä, ö, é, etc.) — förenkling
  const isUnicode = /[^\u0000-\u007FåäöÅÄÖéèüÜ§£€]/.test(message);
  const segmentSize = isUnicode ? 70 : 160;
  return {
    length:    message.length,
    segments:  Math.ceil(message.length / segmentSize),
    isUnicode,
  };
}

module.exports = { getPickupSms, estimateSmsSegments, PHONE_DISPLAY };
