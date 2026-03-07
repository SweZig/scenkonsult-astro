/**
 * Scenkonsult – Bildnedladdning
 * Kör från roten av scenkonsult-astro-mappen:
 *   node download_images.js
 *
 * Kräver Node.js 18+ (ingår redan i Astro-projektet).
 * Inga extra paket behövs.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://scenkonsult.se';
const OUT_DIR  = path.join(__dirname, 'public', 'images');

const IMAGES = {
  // Logo
  'logo.png': '/wp-content/uploads/2023/06/scenkonsult-low-resolution-logo-white-on-transparent-background-180x180.png',

  // Scener – produktbilder
  'scen/scen_small.png':               '/wp-content/uploads/2025/12/Scen_small-1024x853.png',
  'scen/scen_small_plus.png':          '/wp-content/uploads/2025/12/Scen_small_plus-1024x853.png',
  'scen/scen_small_plus_plus.png':     '/wp-content/uploads/2025/12/Scen_small_plus_plus-1024x853.png',
  'scen/scen_medium.png':              '/wp-content/uploads/2025/12/Scen_medium-1024x853.png',
  'scen/scen_medium_plus.png':         '/wp-content/uploads/2025/12/Scen_medium_plus-1024x853.png',
  'scen/scen_medium_plus_med_tak.png': '/wp-content/uploads/2025/12/Scen_medium_plus_med_tak-1024x853.png',
  'scen/scen_medium_plus_plus.png':    '/wp-content/uploads/2025/12/Scen_medium_plus_plus-1024x853.png',
  'scen/scen_large.png':               '/wp-content/uploads/2025/12/Scen_large-1024x853.png',
  'scen/scen_large_plus.png':          '/wp-content/uploads/2025/12/Scen_large_plus-1024x853.png',
  'scen/scen_large_plus_med_tak.png':  '/wp-content/uploads/2025/12/Scen_large_plus_med_tak-1024x853.png',
  'scen/scen_xl.png':                  '/wp-content/uploads/2025/12/Scen_xl-1024x853.png',
  'scen/scen_xl_plus.png':             '/wp-content/uploads/2025/12/Scen_xl_plus-1024x853.png',
  'scen/scentrapp.png':                '/wp-content/uploads/2025/12/Scentrapp-1024x853.png',
  'scen/scenkjol.png':                 '/wp-content/uploads/2025/12/Scenkjol-1024x853.png',
  'scen/backdrop.png':                 '/wp-content/uploads/2025/12/Backdrop-1024x853.png',

  // Ljud – kategoribilder
  'ljud/plugg_event.png':     '/wp-content/uploads/2026/01/plugg_event-scaled.png',
  'ljud/plugg_live.png':      '/wp-content/uploads/2026/01/plugg_live-scaled.png',
  'ljud/plugg_music.png':     '/wp-content/uploads/2026/01/plugg_music-scaled.png',
  'ljud/plugg_portabelt.png': '/wp-content/uploads/2026/01/plugg_portabelt-scaled.png',
  'ljud/line_array.png':      '/wp-content/uploads/2025/08/Line_ArrayPNG.png',

  // Ljus – kategoribilder
  'ljus/plugg_paket.png':    '/wp-content/uploads/2026/01/plugg_paket-scaled.png',
  'ljus/plugg_effekter.png': '/wp-content/uploads/2026/01/plugg_effekter-scaled.png',
  'ljus/plugg_rok.png':      '/wp-content/uploads/2026/01/plugg_rok-scaled.png',
  'ljus/plugg_stativ.png':   '/wp-content/uploads/2026/01/plugg_t-stativ-tross-scaled.png',
  'ljus/ljus_storre.png':    '/wp-content/uploads/2026/01/pp_ljus_storre_event.png',

  // Hero – karusellbilder (används som OG-bild och hero-bakgrund)
  'hero/karusell_01.png': '/wp-content/uploads/2025/12/Karusell_bild01_2512-scaled.png',
  'hero/karusell_02.png': '/wp-content/uploads/2025/10/Karusell_bild02-scaled-e1759332176564.png',
  'hero/karusell_03.png': '/wp-content/uploads/2025/10/Karusell_bild03-scaled-e1759332276863.png',
  'hero/karusell_04.png': '/wp-content/uploads/2025/10/Karusell_bild04-scaled.png',
  'hero/karusell_05.png': '/wp-content/uploads/2025/12/Karusell_bild05_2512-scaled-e1765920410283.png',
  'hero/karusell_06.png': '/wp-content/uploads/2025/12/Karusell_bild06_2512-scaled.png',

  // Tjänst-pluggar (startsidan)
  'tjanster/plugg_scener.png':     '/wp-content/uploads/2025/08/plugg_scener.png',
  'tjanster/plugg_ljus.png':       '/wp-content/uploads/2025/08/plugg_ljus.png',
  'tjanster/plugg_event_ljud.png': '/wp-content/uploads/2025/08/plugg_event-ljud2.png',
  'tjanster/plugg_live_ljud.png':  '/wp-content/uploads/2025/08/plugg_live-ljud2.png',
  'tjanster/plugg_dance_ljud.png': '/wp-content/uploads/2025/08/plugg_dance-ljud2.png',
  'tjanster/plugg_portabelt.png':  '/wp-content/uploads/2025/08/plugg_portabelt-ljud2.png',
  'tjanster/plugg_bild.png':       '/wp-content/uploads/2025/08/plugg_bild.png',
  'tjanster/plugg_dj.png':         '/wp-content/uploads/2025/08/plugg_dj.png',
};

// ─── Hjälpfunktioner ──────────────────────────────────────────────────────────

function fmtBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function pad(str, len) {
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ScenkonsultBot/1.0)' },
      timeout: 30000,
    }, res => {
      // Follow redirects (301/302)
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : BASE_URL + res.headers.location;
        return download(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ─── Huvud ───────────────────────────────────────────────────────────────────

async function main() {
  // Kontrollera att vi är i rätt mapp
  if (!fs.existsSync(path.join(__dirname, 'astro.config.mjs'))) {
    console.error('\n❌  Kör scriptet från roten av scenkonsult-astro-mappen!');
    console.error(`   cd scenkonsult-astro`);
    console.error(`   node download_images.js\n`);
    process.exit(1);
  }

  const entries = Object.entries(IMAGES);
  console.log(`\n🖼  Laddar ned ${entries.length} bilder från ${BASE_URL}\n`);
  console.log('─'.repeat(72));

  let ok = 0, skip = 0, fail = 0;
  const failed = [];

  for (const [localPath, remotePath] of entries) {
    const dest = path.join(OUT_DIR, localPath);
    const label = pad(localPath, 45);

    // Hoppa över redan nedladdade
    if (fs.existsSync(dest)) {
      const size = fs.statSync(dest).size;
      console.log(`  –  ${label}  redan nedladdad (${fmtBytes(size)})`);
      skip++;
      continue;
    }

    // Skapa mapp om den inte finns
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    try {
      const data = await download(BASE_URL + remotePath);
      fs.writeFileSync(dest, data);
      console.log(`  ✓  ${label}  ${fmtBytes(data.length)}`);
      ok++;
    } catch (err) {
      console.log(`  ✗  ${label}  MISSLYCKADES: ${err.message}`);
      failed.push({ localPath, remotePath, error: err.message });
      fail++;
    }

    // Liten paus så vi inte hammarbankar servern
    await new Promise(r => setTimeout(r, 150));
  }

  console.log('─'.repeat(72));
  console.log(`\n✅  Klart!  ${ok} nedladdade · ${skip} redan fanns · ${fail} misslyckades\n`);

  if (failed.length > 0) {
    console.log('⚠  Misslyckade bilder (troligtvis ändrad URL i WordPress):');
    for (const { localPath, error } of failed) {
      console.log(`   ${localPath}: ${error}`);
    }
    console.log('\n   Gör så här för misslyckade bilder:');
    console.log('   1. Logga in på WordPress Admin → Media → Bibliotek');
    console.log('   2. Hitta bilden → klicka → kopiera URL');
    console.log('   3. Öppna download_images.js och uppdatera URL:en');
    console.log('   4. Kör node download_images.js igen\n');
  }
}

main().catch(err => {
  console.error('\n💥  Oväntat fel:', err.message);
  process.exit(1);
});
