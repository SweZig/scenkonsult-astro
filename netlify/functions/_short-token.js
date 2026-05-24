// netlify/functions/_short-token.js
// Genererar en kort (8 hex) URL-token för förberedelse-länken i SMS.
// Garanterar unicitet via DB-collision-retry (extremt osannolikt med 4.3B kombinationer).
//
// Användning:
//   const { ensureShortToken } = require('./_short-token');
//   const shortToken = await ensureShortToken(db, cart);
//   const url = `https://scenkonsult.se/u/${shortToken}`;

'use strict';
const crypto = require('crypto');

/**
 * Generera en kandidat-token: 8 hex-tecken (4 bytes random).
 */
function generateCandidate() {
  return crypto.randomBytes(4).toString('hex'); // 8 tecken
}

/**
 * Säkerställ att en cart har en pickup_short_token. Om den redan har en,
 * returnera den befintliga. Annars: generera, försök spara, retry vid collision.
 *
 * @param {object} db - Supabase-klient från _lib.js (skapad via supabase())
 * @param {object} cart - cart-objekt med åtminstone {id, pickup_short_token?}
 * @returns {Promise<string>} 8-tecken hex-token
 * @throws {Error} om alla retry-försök misslyckas (extremt osannolikt)
 */
async function ensureShortToken(db, cart) {
  if (cart.pickup_short_token && /^[0-9a-f]{8}$/.test(cart.pickup_short_token)) {
    return cart.pickup_short_token;
  }

  const MAX_ATTEMPTS = 5;
  let lastError;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = generateCandidate();

    try {
      // db.update från _lib.js är PATCH-baserad och skickar tillbaka resultatet.
      // Om unique-constraint kränks från Postgres får vi ett 409/23505-fel.
      await db.update('carts', { pickup_short_token: candidate }, 'id', cart.id);
      return candidate;
    } catch (e) {
      lastError = e;
      // Postgres unique-violation = SQLSTATE 23505. Vi forsätter och försöker igen.
      // Om felet är något annat (DB-fel, schema-fel) → kasta direkt.
      const msg = String(e && e.message || e);
      const isCollision = /23505|duplicate|unique/i.test(msg);
      if (!isCollision) throw e;
      // Annars: retry med ny token
    }
  }

  throw new Error(`SHORT_TOKEN_GEN_FAILED efter ${MAX_ATTEMPTS} försök: ${lastError && lastError.message || lastError}`);
}

module.exports = { ensureShortToken, generateCandidate };
