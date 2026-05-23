// scripts/get-ga4-refresh-token.mjs
// Engångs-skript för att skapa en GA4 OAuth refresh_token.
//
// Hur det körs:
//   1. Skapa OAuth Client ID i Google Cloud Console (Desktop app)
//   2. Kör:  node scripts/get-ga4-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>
//   3. Webbläsaren öppnas → välj rätt Google-konto → klicka "Continue"/"Allow"
//   4. Skriptet skriver ut refresh_token i terminalen
//   5. Lägg in i Netlify env som GA4_OAUTH_REFRESH_TOKEN
//      (CLIENT_ID och CLIENT_SECRET sätts som egna env-vars)
//
// Lokal server på http://localhost:8765 hanterar OAuth callback automatiskt.
// När du sett refresh_token i terminalen — stäng skriptet med Ctrl+C.

import http from 'node:http';
import { spawn } from 'node:child_process';
import { OAuth2Client } from 'google-auth-library';

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error('\n❌ Användning: node scripts/get-ga4-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>\n');
  process.exit(1);
}

const REDIRECT_URI = 'http://localhost:8765/oauth-callback';
const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly', // GSC (för fas 2)
];

const oauth2Client = new OAuth2Client(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',   // krävs för att få refresh_token
  prompt: 'consent',        // krävs för att FÅ refresh_token även om man godkänt tidigare
  scope: SCOPES,
});

// Liten HTTP-server som tar emot Googles redirect med ?code=...
const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth-callback')) {
    res.writeHead(404).end();
    return;
  }
  const url = new URL(req.url, 'http://localhost:8765');
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>Fel</h1><p>${error}</p>`);
    console.error('\n❌ OAuth-fel:', error);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400).end('Missing code');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="sv"><head><meta charset="UTF-8"><title>Klart!</title>
      <style>body{font-family:system-ui;background:#0c0a24;color:#f0eeff;padding:3rem;text-align:center}
      h1{color:#c4b5f4}p{color:rgba(255,255,255,0.7)}</style></head>
      <body><h1>✓ Klart!</h1><p>Du kan stänga den här fliken och gå tillbaka till terminalen.</p></body></html>
    `);

    console.log('\n✅ Refresh token mottaget!\n');
    console.log('────────────────────────────────────────────────────────────────');
    console.log('GA4_OAUTH_REFRESH_TOKEN:');
    console.log(tokens.refresh_token);
    console.log('────────────────────────────────────────────────────────────────\n');
    console.log('Lägg in följande tre env-vars i Netlify:');
    console.log(`  GA4_OAUTH_CLIENT_ID     = ${clientId}`);
    console.log(`  GA4_OAUTH_CLIENT_SECRET = ${clientSecret}`);
    console.log(`  GA4_OAUTH_REFRESH_TOKEN = ${tokens.refresh_token}\n`);

    if (!tokens.refresh_token) {
      console.warn('⚠️  Inget refresh_token returnerades! Det betyder oftast att du');
      console.warn('   redan godkänt appen tidigare. Gå till:');
      console.warn('   https://myaccount.google.com/permissions');
      console.warn('   ta bort din OAuth-app och kör skriptet igen.\n');
    }

    server.close();
    setTimeout(() => process.exit(0), 100);
  } catch (e) {
    res.writeHead(500).end('Token exchange failed: ' + e.message);
    console.error('\n❌ Kunde inte byta code mot token:', e.message);
    server.close();
    process.exit(1);
  }
});

server.listen(8765, () => {
  console.log('\n🌐 Öppnar webbläsaren för OAuth-godkännande...');
  console.log('   Om den inte öppnas automatiskt, gå till:');
  console.log('   ' + authUrl + '\n');
  // Försök öppna i default-browser (Mac/Linux/Windows)
  const opener = process.platform === 'darwin' ? 'open'
              : process.platform === 'win32'  ? 'start'
              : 'xdg-open';
  spawn(opener, [authUrl], { stdio: 'ignore', detached: true }).unref();
});
