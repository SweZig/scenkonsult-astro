// netlify/functions/_google-oauth.js
// Delad OAuth-helper för Google-tjänster (GA4 Data API + Search Console API
// + framtida Ads API).
//
// Använder samma OAuth Client + refresh_token för alla Google-tjänster —
// scopes deklareras vid token-generering (se scripts/get-ga4-refresh-token.mjs).
//
// Env-vars:
//   GA4_OAUTH_CLIENT_ID
//   GA4_OAUTH_CLIENT_SECRET
//   GA4_OAUTH_REFRESH_TOKEN
//
// OBS: env-namnen behåller GA4_-prefixet av historiska skäl. Tokenet är dock
// gemensamt och har scope för både analytics.readonly + webmasters.readonly.

'use strict';
const { OAuth2Client } = require('google-auth-library');

// Module-scoped cache. Lever tills functionen kall-restartas (typ 5-15 min).
let _cachedToken = null;
let _cachedTokenExpiry = 0;

/**
 * Hämta giltig Google access token via OAuth refresh_token-flödet.
 * Cachar i 55 min för att undvika onödiga refresh-anrop.
 * @returns {Promise<string>} Bearer-token
 */
async function getGoogleAccessToken() {
  const now = Date.now();
  if (_cachedToken && now < _cachedTokenExpiry - 60_000) return _cachedToken;

  const clientId     = process.env.GA4_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GA4_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GA4_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth env-vars saknas (GA4_OAUTH_CLIENT_ID / GA4_OAUTH_CLIENT_SECRET / GA4_OAUTH_REFRESH_TOKEN)');
  }

  // Skapa ny client per anrop — env-vars kan ha uppdaterats sedan kallstart
  const oauthClient = new OAuth2Client(clientId, clientSecret);
  oauthClient.setCredentials({ refresh_token: refreshToken });

  const { token } = await oauthClient.getAccessToken();
  if (!token) throw new Error('OAuth getAccessToken returnerade null — refresh_token kan vara förbrukad eller återkallad');

  _cachedToken = token;
  // Access tokens lever 1h. Sätt expiry 55 min för säker marginal.
  _cachedTokenExpiry = now + 55 * 60 * 1000;
  return _cachedToken;
}

module.exports = { getGoogleAccessToken };
