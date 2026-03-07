/**
 * Scenkonsult – Bildnedladdning
 * Kör: node download_images.mjs
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL  = 'https://scenkonsult.se';
const OUT_DIR   = path.join(__dirname, 'public', 'images');

const IMAGES = {
  'logo.png': '/wp-content/uploads/2023/06/scenkonsult-low-resolution-logo-white-on-transparent-background-180x180.png',
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
  'ljud/plugg_event.png':              '/wp-content/uploads/2026/01/plugg_event-scaled.png',
  'ljud/plugg_live.png':               '/wp-content/uploads/2026/01/plugg_live-scaled.png',
  'ljud/plugg_music.png':              '/wp-content/uploads/2026/01/plugg_music-scaled.png',
  'ljud/plugg_portabelt.png':          '/wp-content/uploads/2026/01/plugg_portabelt-scaled.png',
  'ljud/line_array.png':               '/wp-content/uploads/2025/08/Line_ArrayPNG.png',
  'ljus/plugg_paket.png':              '/wp-content/uploads/2026/01/plugg_paket-scaled.png',
  'ljus/plugg_effekter.png':           '/wp-content/uploads/2026/01/plugg_effekter-scaled.png',
  'ljus/plugg_rok.png':                '/wp-content/uploads/2026/01/plugg_rok-scaled.png',
  'ljus/plugg_stativ.png':             '/wp-content/uploads/2026/01/plugg_t-stativ-tross-scaled.png',
  'ljus/ljus_storre.png':              '/wp-content/uploads/2026/01/pp_ljus_storre_event.png',
  'hero/karusell_01.png':              '/wp-content/uploads/2025/12/Karusell_bild01_2512-scaled.png',
  'hero/karusell_02.png':              '/wp-content/uploads/2025/10/Karusell_bild02-scaled-e1759332176564.png',
  'hero/karusell_03.png':              '/wp-content/uploads/2025/10/Karusell_bild03-scaled-e1759332276863.png',
  'hero/karusell_04.png':              '/wp-content/uploads/2025/10/Karusell_bild04-scaled.png',
  'hero/karusell_05.png':              '/wp-content/uploads/2025/12/Karusell_bild05_2512-scaled-e1765920410283.png',
  'hero/karusell_06.png':              '/wp-content/uploads/2025/12/Karusell_bild06_2512-scaled.png',
  'tjanster/plugg_scener.png':         '/wp-content/uploads/2025/08/plugg_scener.png',
  'tjanster/plugg_ljus.png':           '/wp-content/uploads/2025/08/plugg_ljus.png',
  'tjanster/plugg_event_ljud.png':     '/wp-content/uploads/2025/08/plugg_event-ljud2.png',
  'tjanster/plugg_live_ljud.png':      '/wp-content/uploads/2025/08/plugg_live-ljud2.png',
  'tjanster/plugg_dance_ljud.png':     '/wp-content/uploads/2025/08/plugg_dance-ljud2.png',
  'tjanster/plugg_portabelt.png':      '/wp-content/uploads/2025/08/plugg_portabelt-ljud2.png',
  'tjanster/plugg_bild.png':           '/wp-content/uploads/2025/08/plugg_bild.png',
  'tjanster/plugg_dj.png':             '/wp-content/uploads/2025/08/plugg_dj.png',

  // === NYA PP_-BILDER (scanning 2026-03) – unika produktbilder per paket ===
  // SCEN – individuella produktbilder per scenpaket
  'scen/pp_small.png':               '/wp-content/uploads/2025/12/Scen_small-1024x853.png',
  'scen/pp_small_plus.png':          '/wp-content/uploads/2025/12/Scen_small_plus-1024x853.png',
  'scen/pp_small_pp.png':            '/wp-content/uploads/2025/12/Scen_small_plus_plus-1024x853.png',
  'scen/pp_medium.png':              '/wp-content/uploads/2025/12/Scen_medium-1024x853.png',
  'scen/pp_medium_plus.png':         '/wp-content/uploads/2025/12/Scen_medium_plus-1024x853.png',
  'scen/pp_medium_plus_tak.png':     '/wp-content/uploads/2025/12/Scen_medium_plus_med_tak-1024x853.png',
  'scen/pp_medium_pp.png':           '/wp-content/uploads/2025/12/Scen_medium_plus_plus-1024x853.png',
  'scen/pp_large.png':               '/wp-content/uploads/2025/12/Scen_large-1024x853.png',
  'scen/pp_large_plus.png':          '/wp-content/uploads/2025/12/Scen_large_plus-1024x853.png',
  'scen/pp_large_plus_tak.png':      '/wp-content/uploads/2025/12/Scen_large_plus_med_tak-1024x853.png',
  'scen/pp_xl.png':                  '/wp-content/uploads/2025/12/Scen_xl-1024x853.png',
  'scen/pp_xl_plus.png':             '/wp-content/uploads/2025/12/Scen_xl_plus-1024x853.png',
  'scen/pp_scentrapp.png':           '/wp-content/uploads/2025/12/Scentrapp-1024x853.png',
  'scen/pp_scenkjol.png':            '/wp-content/uploads/2025/12/Scenkjol-1024x853.png',
  'scen/pp_backdrop.png':            '/wp-content/uploads/2025/12/Backdrop-1024x853.png',
  'scen/pp_scentak.png':             '/wp-content/uploads/2025/12/Scentak-1024x853.png',
  // LJUD – event-paket (5 st, unika per storlek)
  'ljud/pp_event_small.png':         '/wp-content/uploads/2025/08/pp_ljud_event_small_20250824PNG.png',
  'ljud/pp_event_small_p.png':       '/wp-content/uploads/2025/08/pp_ljud_event_small-_20250824PNG.png',
  'ljud/pp_event_medium.png':        '/wp-content/uploads/2025/08/pp_ljud_event_medium_20250824PNG.png',
  'ljud/pp_event_medium_p.png':      '/wp-content/uploads/2025/08/pp_ljud_event_medium-_20250824PNG.png',
  'ljud/pp_event_large.png':         '/wp-content/uploads/2025/08/pp_ljud_event_large_20250824PNG.png',
  // LJUD – live-paket + delad XL/XXL/Concert
  'ljud/pp_live_small.png':          '/wp-content/uploads/2025/08/pp_ljud_live_small_20250824PNG.png',
  'ljud/pp_live_medium.png':         '/wp-content/uploads/2025/08/pp_ljud_live_medium_20250824PNG.png',
  'ljud/pp_live_large.png':          '/wp-content/uploads/2025/08/pp_ljud_live_large_20250824PNG.png',
  'ljud/pp_music_xl.png':            '/wp-content/uploads/2025/08/pp_ljud_music_xl_20250824PNG.png',
  'ljud/pp_music_xl_p.png':          '/wp-content/uploads/2025/08/pp_ljud_music_xl-_20250824PNG.png',
  'ljud/pp_music_xxl.png':           '/wp-content/uploads/2025/08/pp_ljud_music_xxl_20250824PNG.png',
  'ljud/pp_music_concert.png':       '/wp-content/uploads/2026/01/pp_ljud_music_concert_20250824-1024x853.png',
  // LJUD – music-paket
  'ljud/pp_music_small.png':         '/wp-content/uploads/2025/08/pp_ljud_music_small_20250824PNG.png',
  'ljud/pp_music_small_p.png':       '/wp-content/uploads/2025/08/pp_ljud_music_small-_20250824PNG.png',
  'ljud/pp_music_medium.png':        '/wp-content/uploads/2025/08/pp_ljud_music_medium_20250824PNG.png',
  'ljud/pp_music_large.png':         '/wp-content/uploads/2025/08/pp_ljud_music_large_20250824PNG.png',
  // LJUD – portable-paket (6 st)
  'ljud/pp_portable_small.png':      '/wp-content/uploads/2025/09/pp_ljud_portable_small_20250919.png',
  'ljud/pp_portable_small_p.png':    '/wp-content/uploads/2025/09/pp_ljud_portable_small_20250919-1.png',
  'ljud/pp_portable_medium.png':     '/wp-content/uploads/2025/09/pp_ljud_portable_medium_20250919.png',
  'ljud/pp_portable_medium_p.png':   '/wp-content/uploads/2025/09/pp_ljud_portable_medium_20250919-1.png',
  'ljud/pp_portable_large.png':      '/wp-content/uploads/2025/09/pp_ljud_portable_large_20250919.png',
  'ljud/pp_portable_large_p.png':    '/wp-content/uploads/2025/09/pp_ljud_portable_large_20250919-1.png',
  // LJUD – mixers (6 storlekar)
  'ljud/pp_mixer01.png':             '/wp-content/uploads/2025/08/pp_ljud_mixer01_20250824PNG.png',
  'ljud/pp_mixer02.png':             '/wp-content/uploads/2025/08/pp_ljud_mixer02_20250824PNG.png',
  'ljud/pp_mixer03.png':             '/wp-content/uploads/2025/08/pp_ljud_mixer03_20250824PNG.png',
  'ljud/pp_mixer04.png':             '/wp-content/uploads/2025/08/pp_ljud_mixer04_20250824PNG.png',
  'ljud/pp_mixer05.png':             '/wp-content/uploads/2025/08/pp_ljud_mixer05_20250824PNG.png',
  'ljud/pp_mixer06.png':             '/wp-content/uploads/2025/08/pp_ljud_mixer06_20250824PNG.png',
  // LJUD – mikrofoner och tillbehör
  'ljud/pp_mik01.png':               '/wp-content/uploads/2025/08/pp_ljud_mik01_20250824PNG.png',
  'ljud/pp_mik02.png':               '/wp-content/uploads/2025/08/pp_ljud_mik02_20250824PNG.png',
  'ljud/pp_mik05.png':               '/wp-content/uploads/2025/08/pp_ljud_mik05_20250824PNG.png',
  'ljud/pp_mik06.png':               '/wp-content/uploads/2025/08/pp_ljud_mik06_20250824PNG.png',
  'ljud/pp_mik_stativ.png':          '/wp-content/uploads/2025/08/pp_ljud_tillbehor06_20250824PNG.png',
  'ljud/pp_xlr.png':                 '/wp-content/uploads/2025/08/pp_ljud_tillbehor07_20250824PNG.png',
  'ljud/pp_bt_mottagare.png':        '/wp-content/uploads/2025/08/pp_ljud_tillbehor04_20250824PNG.png',
  'ljud/pp_grenuttag_1_5m.png':      '/wp-content/uploads/2025/08/pp_ljud_tillbehor13_20250824PNG-300x250.png',
  'ljud/pp_forlangning_10m.png':     '/wp-content/uploads/2025/08/pp_ljud_tillbehor12_20250824PNG-300x250.png',
  'ljud/pp_grenuttag_10m.png':       '/wp-content/uploads/2025/08/pp_ljud_tillbehor14_20250824PNG-300x250.png',
  'ljud/pp_grenuttag_25m.png':       '/wp-content/uploads/2025/08/pp_ljud_tillbehor15_20250824PNG-300x250.png',
  'ljud/pp_forlangning_20m.png':     '/wp-content/uploads/2025/08/pp_ljud_tillbehor16_20250824PNG-300x250.png',
  'ljud/pp_stromomv.png':            '/wp-content/uploads/2025/08/pp_ljud_tillbehor11_20250824PNG-300x250.png',
  'ljud/pp_kabelskydd.png':          '/wp-content/uploads/2025/08/pp_ljud_tillbehor17_20250824PNG-300x250.png',
  'ljud/pp_regnskydd.png':           '/wp-content/uploads/2026/01/pp_ljud_tillbehor19_20250824PNG-300x250.png',
  'ljud/pp_generator.png':           '/wp-content/uploads/2025/08/pp_ljud_tillbehor18_20250824PNG-300x250.png',
  'ljud/pp_mikset_8k.png':           '/wp-content/uploads/2025/12/pp_ljud_tillbehor20_20250824-1024x853.png',
  'ljud/pp_portabelt3.png':          '/wp-content/uploads/2025/09/plugg_portabelt3-scaled.png',
  'ljud/banner_dj.png':              '/wp-content/uploads/2026/02/plugg_banner_dj2-scaled.png',
  // LJUS – färdiga paket (6 st)
  'ljus/pp_small.png':               '/wp-content/uploads/2025/08/pp_ljus_small_20250824PNG.png',
  'ljus/pp_small_p.png':             '/wp-content/uploads/2026/01/pp_ljus_small-_20260117-1024x853.png',
  'ljus/pp_small_pp.png':            '/wp-content/uploads/2025/08/pp_ljus_small-_20250824PNG-1.png',
  'ljus/pp_medium.png':              '/wp-content/uploads/2026/01/pp_ljus_medium_20260117-1024x853.png',
  'ljus/pp_medium_p.png':            '/wp-content/uploads/2025/08/pp_ljus_medium-_20250824PNG.png',
  'ljus/pp_medium_pp.png':           '/wp-content/uploads/2025/08/pp_ljus_medium-_20250824PNG-1.png',
  'ljus/plugg_topplista.png':        '/wp-content/uploads/2026/01/plugg_topplista_ljus-scaled.png',
};

function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(0)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : BASE_URL + res.headers.location;
        return download(next).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

const entries = Object.entries(IMAGES);
console.log(`\n🖼  Laddar ned ${entries.length} bilder från ${BASE_URL}\n${'─'.repeat(70)}`);

let ok = 0, skip = 0, fail = 0, failed = [];

for (const [local, remote] of entries) {
  const dest = path.join(OUT_DIR, local);
  const label = local.padEnd(45);

  if (fs.existsSync(dest)) {
    console.log(`  –  ${label}  redan nedladdad`);
    skip++; continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  try {
    const data = await download(BASE_URL + remote);
    fs.writeFileSync(dest, data);
    console.log(`  ✓  ${label}  ${fmtBytes(data.length)}`);
    ok++;
  } catch (e) {
    console.log(`  ✗  ${label}  ${e.message}`);
    failed.push(local); fail++;
  }

  await new Promise(r => setTimeout(r, 120));
}

console.log(`${'─'.repeat(70)}\n✅  ${ok} nedladdade · ${skip} redan fanns · ${fail} misslyckades\n`);
if (failed.length) {
  console.log('⚠  Misslyckade (kontrollera URL i WordPress Media):');
  failed.forEach(f => console.log(`   ${f}`));
}
