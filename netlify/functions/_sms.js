// netlify/functions/_sms.js
// Central helper för 46elks SMS-utskick. ALLA SMS-funktioner ska använda
// denna istället för att duplicera koden — så att FROM, formatting och
// loggning är garanterat konsekvent.
//
// Användning:
//   const { sendSms } = require('./_sms');
//   const result = await sendSms(phone, message);
//   if (!result.ok) { ... fallback ... }
//
// Returnerar { ok, smsId?, error?, from?, to? } — kastar inte exceptions
// utan låter anroparen falla tillbaka på alternativ kanal vid fel.

'use strict';

const ELKS_URL = 'https://api.46elks.com/a1/SMS';

/**
 * Skickar SMS via 46elks.
 *
 * @param {string} to - Telefonnummer (svenska format som 0701234567 eller +46701234567)
 * @param {string} message - SMS-text (helst < 160 tecken)
 * @returns {Promise<{ok: boolean, smsId?: string, error?: string, from?: string, to?: string}>}
 */
async function sendSms(to, message) {
  const user = process.env.ELKS_API_USER;
  const pass = process.env.ELKS_API_PASSWORD;
  if (!user || !pass) {
    return { ok: false, error: '46elks-nycklar saknas (ELKS_API_USER / ELKS_API_PASSWORD)' };
  }

  // Avsändare — alfanumerisk (t.ex. "Scenkonsult") kräver förregistrering hos 46elks.
  // Förvarning: 'Scenkonsult' är max 11 tecken, vilket är GSM-7-gränsen för alfanumeriska
  // sender ID. Längre namn faller tillbaka på telefonnummer hos operatörerna.
  const FROM_NAME = process.env.ELKS_FROM || 'Scenkonsult';

  // Normalisera telefonnummer till +46-format
  let phone = String(to || '').replace(/\s/g, '').replace(/^0/, '+46');
  if (!phone.startsWith('+')) phone = '+46' + phone;

  const body = new URLSearchParams({
    from:    FROM_NAME,
    to:      phone,
    message: message,
  });

  console.log(`46ELKS_REQUEST: from="${FROM_NAME}" to=${phone} msgLen=${message.length}`);

  try {
    const res = await fetch(ELKS_URL, {
      method:  'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const rawText = await res.text();
    let data = {};
    try { data = JSON.parse(rawText); } catch (_) {
      console.error('46ELKS_NON_JSON:', res.status, rawText.slice(0, 200));
      return { ok: false, error: `46elks fel ${res.status}: ${rawText.slice(0, 100)}`, from: FROM_NAME, to: phone };
    }

    if (res.status === 403) {
      console.error('46ELKS_403_BODY:', rawText);
      return { ok: false, error: `46elks 403 Forbidden. FROM="${FROM_NAME}". Svar: ${rawText.slice(0, 200)}`, from: FROM_NAME, to: phone };
    }

    if (!res.ok || data.status === 'error') {
      return { ok: false, error: data.message || `46elks fel ${res.status}`, from: FROM_NAME, to: phone };
    }

    // Lyckades. Returnera ID + faktisk from (kan vara annorlunda om 46elks justerade)
    console.log(`46ELKS_SUCCESS: id=${data.id} from=${data.from || FROM_NAME}`);
    return {
      ok:    true,
      smsId: data.id,
      from:  data.from || FROM_NAME,
      to:    data.to || phone,
    };
  } catch (e) {
    console.error('46ELKS_FETCH_ERROR:', e.message);
    return { ok: false, error: e.message, from: FROM_NAME, to: phone };
  }
}

module.exports = { sendSms };
