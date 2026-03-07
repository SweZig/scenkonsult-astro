/**
 * Scenkonsult – Fullständig bildnedladdning
 * Täcker ALLA bilder som refereras i de nya sidorna
 */
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://scenkonsult.se';
const OUT  = path.join(__dirname, 'public', 'images');

// Skapa alla mappar
['ljud','ljus','scen','tjanster','hero','dj','bild'].forEach(d =>
  fs.mkdirSync(path.join(OUT, d), { recursive: true })
);

const IMAGES = {
  // ── LOGO ──────────────────────────────────────────────────────────────
  'logo.png': '/wp-content/uploads/2023/06/scenkonsult-low-resolution-logo-white-on-transparent-background-180x180.png',

  // ── HERO ──────────────────────────────────────────────────────────────
  'hero/karusell_01.png': '/wp-content/uploads/2025/12/Karusell_bild01_2512-scaled.png',
  'hero/karusell_02.png': '/wp-content/uploads/2025/10/Karusell_bild02-scaled-e1759332176564.png',
  'hero/karusell_03.png': '/wp-content/uploads/2025/10/Karusell_bild03-scaled-e1759332276863.png',
  'hero/karusell_04.png': '/wp-content/uploads/2025/10/Karusell_bild04-scaled.png',
  'hero/karusell_05.png': '/wp-content/uploads/2025/12/Karusell_bild05_2512-scaled-e1765920410283.png',
  'hero/karusell_06.png': '/wp-content/uploads/2025/12/Karusell_bild06_2512-scaled.png',

  // ── TJÄNSTER-PLUGGAR ──────────────────────────────────────────────────
  'tjanster/plugg_scener.png':     '/wp-content/uploads/2025/08/plugg_scener.png',
  'tjanster/plugg_ljus.png':       '/wp-content/uploads/2025/08/plugg_ljus.png',
  'tjanster/plugg_event_ljud.png': '/wp-content/uploads/2025/08/plugg_event-ljud2.png',
  'tjanster/plugg_live_ljud.png':  '/wp-content/uploads/2025/08/plugg_live-ljud2.png',
  'tjanster/plugg_dance_ljud.png': '/wp-content/uploads/2025/08/plugg_dance-ljud2.png',
  'tjanster/plugg_portabelt.png':  '/wp-content/uploads/2025/08/plugg_portabelt-ljud2.png',
  'tjanster/plugg_bild.png':       '/wp-content/uploads/2025/08/plugg_bild.png',
  'tjanster/plugg_dj.png':         '/wp-content/uploads/2025/08/plugg_dj.png',

  // ── SCEN ──────────────────────────────────────────────────────────────
  'scen/pp_small.png':              '/wp-content/uploads/2025/12/Scen_small-1024x853.png',
  'scen/pp_small_plus.png':         '/wp-content/uploads/2025/12/Scen_small_plus-1024x853.png',
  'scen/pp_small_pp.png':           '/wp-content/uploads/2025/12/Scen_small_plus_plus-1024x853.png',
  'scen/pp_medium.png':             '/wp-content/uploads/2025/12/Scen_medium-1024x853.png',
  'scen/pp_medium_plus.png':        '/wp-content/uploads/2025/12/Scen_medium_plus-1024x853.png',
  'scen/pp_medium_plus_tak.png':    '/wp-content/uploads/2025/12/Scen_medium_plus_med_tak-1024x853.png',
  'scen/pp_medium_pp.png':          '/wp-content/uploads/2025/12/Scen_medium_plus_plus-1024x853.png',
  'scen/pp_large.png':              '/wp-content/uploads/2025/12/Scen_large-1024x853.png',
  'scen/pp_large_plus.png':         '/wp-content/uploads/2025/12/Scen_large_plus-1024x853.png',
  'scen/pp_large_plus_tak.png':     '/wp-content/uploads/2025/12/Scen_large_plus_med_tak-1024x853.png',
  'scen/pp_xl.png':                 '/wp-content/uploads/2025/12/Scen_xl-1024x853.png',
  'scen/pp_xl_plus.png':            '/wp-content/uploads/2025/12/Scen_xl_plus-1024x853.png',
  'scen/pp_scentrapp.png':          '/wp-content/uploads/2025/12/Scentrapp-1024x853.png',
  'scen/pp_scenkjol.png':           '/wp-content/uploads/2025/12/Scenkjol-1024x853.png',
  'scen/pp_backdrop.png':           '/wp-content/uploads/2025/12/Backdrop-1024x853.png',

  // ── LJUD EVENT ────────────────────────────────────────────────────────
  'ljud/plugg_event.png':           '/wp-content/uploads/2026/01/plugg_event-scaled.png',
  'ljud/plugg_live.png':            '/wp-content/uploads/2026/01/plugg_live-scaled.png',
  'ljud/plugg_music.png':           '/wp-content/uploads/2026/01/plugg_music-scaled.png',
  'ljud/plugg_portabelt.png':       '/wp-content/uploads/2026/01/plugg_portabelt-scaled.png',
  'ljud/line_array.png':            '/wp-content/uploads/2025/08/Line_ArrayPNG.png',

  'ljud/pp_ljud_event_small.png':   '/wp-content/uploads/2025/08/pp_ljud_event_small_20250824PNG.png',
  'ljud/pp_ljud_event_small-.png':  '/wp-content/uploads/2025/08/pp_ljud_event_small-_20250824PNG.png',
  'ljud/pp_ljud_event_medium.png':  '/wp-content/uploads/2025/08/pp_ljud_event_medium_20250824PNG.png',
  'ljud/pp_ljud_event_medium-.png': '/wp-content/uploads/2025/08/pp_ljud_event_medium-_20250824PNG.png',
  'ljud/pp_ljud_event_large.png':   '/wp-content/uploads/2025/08/pp_ljud_event_large_20250824PNG.png',

  // ── LJUD LIVE ─────────────────────────────────────────────────────────
  'ljud/pp_ljud_live_small.png':    '/wp-content/uploads/2025/08/pp_ljud_live_small_20250824PNG.png',
  'ljud/pp_ljud_live_medium.png':   '/wp-content/uploads/2025/08/pp_ljud_live_medium_20250824PNG.png',
  'ljud/pp_ljud_live_large.png':    '/wp-content/uploads/2025/08/pp_ljud_live_large_20250824PNG.png',

  // ── LJUD MUSIC ────────────────────────────────────────────────────────
  'ljud/pp_ljud_music_small.png':   '/wp-content/uploads/2025/08/pp_ljud_music_small_20250824PNG.png',
  'ljud/pp_ljud_music_small-.png':  '/wp-content/uploads/2025/08/pp_ljud_music_small-_20250824PNG.png',
  'ljud/pp_ljud_music_medium.png':  '/wp-content/uploads/2025/08/pp_ljud_music_medium_20250824PNG.png',
  'ljud/pp_ljud_music_large.png':   '/wp-content/uploads/2025/08/pp_ljud_music_large_20250824PNG.png',
  'ljud/pp_ljud_music_xl.png':      '/wp-content/uploads/2025/08/pp_ljud_music_xl_20250824PNG.png',
  'ljud/pp_ljud_music_xl-.png':     '/wp-content/uploads/2025/08/pp_ljud_music_xl-_20250824PNG.png',
  'ljud/pp_ljud_music_xxl.png':     '/wp-content/uploads/2025/08/pp_ljud_music_xxl_20250824PNG.png',

  // ── LJUD PORTABLE ─────────────────────────────────────────────────────
  'ljud/pp_ljud_portable_small.png':   '/wp-content/uploads/2025/09/pp_ljud_portable_small_20250919.png',
  'ljud/pp_ljud_portable_medium.png':  '/wp-content/uploads/2025/09/pp_ljud_portable_medium_20250919.png',
  'ljud/pp_ljud_portable_large.png':   '/wp-content/uploads/2025/09/pp_ljud_portable_large_20250919.png',

  // ── LJUD MIXERS ───────────────────────────────────────────────────────
  'ljud/pp_ljud_mixer01.png': '/wp-content/uploads/2025/08/pp_ljud_mixer01_20250824PNG.png',
  'ljud/pp_ljud_mixer02.png': '/wp-content/uploads/2025/08/pp_ljud_mixer02_20250824PNG.png',
  'ljud/pp_ljud_mixer03.png': '/wp-content/uploads/2025/08/pp_ljud_mixer03_20250824PNG.png',
  'ljud/pp_ljud_mixer04.png': '/wp-content/uploads/2025/08/pp_ljud_mixer04_20250824PNG.png',
  'ljud/pp_ljud_mixer05.png': '/wp-content/uploads/2025/08/pp_ljud_mixer05_20250824PNG.png',
  'ljud/pp_ljud_mixer06.png': '/wp-content/uploads/2025/08/pp_ljud_mixer06_20250824PNG.png',

  // ── LJUD MIKROFONER ───────────────────────────────────────────────────
  'ljud/pp_ljud_mik01.png': '/wp-content/uploads/2025/08/pp_ljud_mik01_20250824PNG.png',
  'ljud/pp_ljud_mik02.png': '/wp-content/uploads/2025/08/pp_ljud_mik02_20250824PNG.png',
  'ljud/pp_ljud_mik03.png': '/wp-content/uploads/2025/08/pp_ljud_mik03_20250824PNG.png',
  'ljud/pp_ljud_mik05.png': '/wp-content/uploads/2025/08/pp_ljud_mik05_20250824PNG.png',
  'ljud/pp_ljud_mik06.png': '/wp-content/uploads/2025/08/pp_ljud_mik06_20250824PNG.png',

  // ── LJUD TILLBEHÖR ────────────────────────────────────────────────────
  'ljud/pp_ljud_tillbehor04.png': '/wp-content/uploads/2025/08/pp_ljud_tillbehor04_20250824PNG.png',
  'ljud/pp_ljud_tillbehor06.png': '/wp-content/uploads/2025/08/pp_ljud_tillbehor06_20250824PNG.png',
  'ljud/pp_ljud_tillbehor07.png': '/wp-content/uploads/2025/08/pp_ljud_tillbehor07_20250824PNG.png',
  'ljud/pp_ljud_tillbehor08.png': '/wp-content/uploads/2025/08/pp_ljud_tillbehor08_20250824PNG.png',
  'ljud/pp_ljud_tillbehor09.png': '/wp-content/uploads/2025/08/pp_ljud_tillbehor09_20250824PNG.png',
  'ljud/pp_ljud_tillbehor10.png': '/wp-content/uploads/2025/08/pp_ljud_tillbehor10_20250824PNG.png',

  // ── LJUS PLUGGAR ──────────────────────────────────────────────────────
  'ljus/plugg_paket.png':        '/wp-content/uploads/2026/01/plugg_paket-scaled.png',
  'ljus/plugg_effekter.png':     '/wp-content/uploads/2026/01/plugg_effekter-scaled.png',
  'ljus/plugg_rok.png':          '/wp-content/uploads/2026/01/plugg_rok-scaled.png',
  'ljus/plugg_t-stativ-tross.png': '/wp-content/uploads/2026/01/plugg_t-stativ-tross-scaled.png',
  'ljus/plugg_topplista.png':    '/wp-content/uploads/2026/01/plugg_topplista_ljus-scaled.png',
  'ljus/ljus_storre.png':        '/wp-content/uploads/2026/01/pp_ljus_storre_event.png',

  // ── LJUS PAKET ────────────────────────────────────────────────────────
  'ljus/pp_ljus_small.png':     '/wp-content/uploads/2025/08/pp_ljus_small_20250824PNG.png',
  'ljus/pp_ljus_small-.png':    '/wp-content/uploads/2026/01/pp_ljus_small-_20260117-1024x853.png',
  'ljus/pp_ljus_small--.png':   '/wp-content/uploads/2025/08/pp_ljus_small-_20250824PNG-1.png',
  'ljus/pp_ljus_medium.png':    '/wp-content/uploads/2026/01/pp_ljus_medium_20260117-1024x853.png',

  // ── LJUS EFFEKTER ─────────────────────────────────────────────────────
  'ljus/pp_ljus_effekt19.png':     '/wp-content/uploads/2025/08/pp_ljus_effekt19_20250824PNG.png',
  'ljus/pp_ljus_effekt21.png':     '/wp-content/uploads/2025/08/pp_ljus_effekt21_20250824PNG.png',
  'ljus/pp_ljus_effekt22.png':     '/wp-content/uploads/2025/08/pp_ljus_effekt22_20250824PNG.png',
  'ljus/pp_ljus_effekt23.png':     '/wp-content/uploads/2025/08/pp_ljus_effekt23_20250824PNG.png',
  'ljus/pp_ljus_effekt24.png':     '/wp-content/uploads/2025/08/pp_ljus_effekt24_20250824PNG.png',
  'ljus/pp_ljus_effekt25.png':     '/wp-content/uploads/2025/08/pp_ljus_effekt25_20250824PNG.png',
  'ljus/pp_ljus_effekt26.png':     '/wp-content/uploads/2026/01/pp_ljus_effekt26_20250824-1024x853.png',
  'ljus/pp_ljus_par-xl.png':       '/wp-content/uploads/2026/01/pp_ljus_par-xl-1024x853.png',
  'ljus/pp_ljus_confettimaskin.png':'/wp-content/uploads/2026/01/pp_ljus_confettimaskin-1024x853.png',

  // ── LJUS STATIV & TROSS ───────────────────────────────────────────────
  'ljus/pp_ljus_stativ01.png':  '/wp-content/uploads/2025/08/pp_ljus_stativ01_20250824PNG.png',
  'ljus/pp_ljus_stativ02.png':  '/wp-content/uploads/2025/08/pp_ljus_stativ02_20250824PNG.png',
  'ljus/pp_ljus_stativ06.png':  '/wp-content/uploads/2026/01/pp_ljus_stativ06_20260117-1024x853.png',
  'ljus/pp_ljus_tradlos01.png': '/wp-content/uploads/2025/08/pp_ljus_tradlos01_20250824PNGPNG.png',
  'ljus/pp_ljus_tross01.png':   '/wp-content/uploads/2026/01/pp_ljus_tross01_20260117-1024x853.png',
  'ljus/pp_ljus_tross03.png':   '/wp-content/uploads/2026/01/pp_ljus_tross03_20260117-1024x853.png',
  'ljus/pp_ljus_stativ03.png':  '/wp-content/uploads/2025/08/pp_ljus_stativ03_20250824PNG.png',
  'ljus/pp_ljus_stativ04.png':  '/wp-content/uploads/2025/08/pp_ljus_stativ04_20250824PNG.png',
  'ljus/pp_ljus_tross04.png':   '/wp-content/uploads/2026/01/pp_ljus_tross04_20260117-1024x853.png',
  'ljus/pp_ljus_tross05.png':   '/wp-content/uploads/2026/01/pp_ljus_tross05_20260117-300x250.png',
  'ljus/pp_ljus_tross06.png':   '/wp-content/uploads/2026/01/pp_ljus_tross06_20260117-1024x853.png',
  'ljus/pp_ljus_tross08.png':   '/wp-content/uploads/2026/01/pp_ljus_tross08_20260117-1024x853.png',
  'ljus/pp_ljus_tross09.png':   '/wp-content/uploads/2026/01/pp_ljus_tross09_20260117-1024x853.png',

  // Ljuspaket - nya
  'ljus/pp_ljus_small_plus.png':       '/wp-content/uploads/2026/01/pp_ljus_small-_20260117-1024x853.png',
  'ljus/pp_ljus_small_plusplus.png':   '/wp-content/uploads/2025/08/pp_ljus_small-_20250824PNG-1.png',
  'ljus/pp_ljus_medium_plus.png':      '/wp-content/uploads/2025/08/pp_ljus_medium-_20250824PNG.png',
  'ljus/pp_ljus_medium_plusplus.png':  '/wp-content/uploads/2025/08/pp_ljus_medium-_20250824PNG-1.png',
  'ljus/pp_ljus_large.png':            '/wp-content/uploads/2025/08/pp_ljus_large_20250824PNG.png',
  'ljus/pp_ljus_large_plus.png':       '/wp-content/uploads/2026/01/pp_ljus_large-_20260117-1024x853.png',
  'ljus/pp_ljus_large_plusplus.png':   '/wp-content/uploads/2026/01/pp_ljus_large_20260122-1024x853.png',
  'ljus/pp_ljus_xl.png':               '/wp-content/uploads/2026/01/pp_ljus_xl_20260122-1-1024x853.png',
  'ljus/pp_ljus_xl_plus.png':          '/wp-content/uploads/2026/01/pp_ljus_xl_20260122-1024x853.png',
  'ljus/pp_ljus_scen_bundle.png':      '/wp-content/uploads/2025/04/pp_ljus_scen_bundle-1024x853.png',
  'ljus/pp_ljus_topplista.png':        '/wp-content/uploads/2026/01/plugg_topplista_ljus-scaled.png',
  // Effekter
  'ljus/pp_ljus_effekt19.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt19_20250824PNG.png',
  'ljus/pp_ljus_effekt26.png':         '/wp-content/uploads/2026/01/pp_ljus_effekt26_20250824-1024x853.png',
  'ljus/pp_ljus_effekt21.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt21_20250824PNG.png',
  'ljus/pp_ljus_par_xl.png':           '/wp-content/uploads/2026/01/pp_ljus_par-xl-1024x853.png',
  'ljus/pp_ljus_effekt22.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt22_20250824PNG.png',
  'ljus/pp_ljus_effekt07.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt07_20250824PNG.png',
  'ljus/pp_ljus_effekt05.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt05_20250824PNG.png',
  'ljus/pp_ljus_effekt04.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt04_20250824PNG.png',
  'ljus/pp_ljus_effekt10.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt10_20250824PNG.png',
  'ljus/pp_ljus_effekt11.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt11_20250824PNG.png',
  'ljus/pp_ljus_effekt13.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt13_20250824PNG.png',
  'ljus/pp_ljus_effekt14.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt14_20250824PNG.png',
  'ljus/pp_ljus_effekt16.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt16_20250824PNG.png',
  'ljus/pp_ljus_effekt17.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt17_20250824PNG.png',
  'ljus/pp_ljus_effekt18.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt18_20250824PNG.png',
  'ljus/pp_ljus_effekt09.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt09_20250824PNG.png',
  'ljus/pp_ljus_effekt08.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt08_20250824PNG.png',
  'ljus/pp_ljus_effekt06.png':         '/wp-content/uploads/2025/08/pp_ljus_effekt06_20250824PNG.png',
  // Ljusstyrning
  'ljus/pp_ljus_styrning02.png':       '/wp-content/uploads/2025/08/pp_ljus_styrning02_20250824PNG.png',
  'ljus/pp_ljus_botex_sdc16.png':      '/wp-content/uploads/2026/01/pp_ljus_botex-sdc-16-1024x853.png',
  'ljus/pp_ljus_styrning03.png':       '/wp-content/uploads/2025/08/pp_ljus_styrning03_20250824PNG.png',
  'ljus/pp_ljus_styrning04.png':       '/wp-content/uploads/2025/08/pp_ljus_styrning04_20250824PNG.png',
  // DMX-tillbehör
  'ljus/pp_ljus_half_coupler.png':     '/wp-content/uploads/2025/08/pp_ljus_half_coupler-300x250.png',
  'ljus/pp_ljus_super_clamp.png':      '/wp-content/uploads/2025/08/Ljus_pp_superclamp-300x250.png',
  'ljus/pp_ljus_kablar.png':           '/wp-content/uploads/2025/08/pp_ljus_kablar01_20250824PNG-300x250.png',
  'ljus/pp_ljus_tradlos01.png':        '/wp-content/uploads/2025/08/pp_ljus_tradlos01_20250824PNG-300x250.png',
  'ljus/pp_ljus_tradlos02.png':        '/wp-content/uploads/2025/08/pp_ljus_tradlos02_20250824PNGPNG-300x250.png',
  'ljus/pp_ljus_tradlos03.png':        '/wp-content/uploads/2025/08/pp_ljus_tradlos03_20250824PNGPNG-300x250.png',
  'ljus/pp_ljus_powercon.png':         '/wp-content/uploads/2025/08/pp_ljus_powercon-300x250.png',
  'ljus/pp_ljus_powercon2.png':        '/wp-content/uploads/2025/08/pp_ljus_powercon2-300x250.png',
  'ljus/pp_ljus_iec_kabel.png':        '/wp-content/uploads/2025/08/pp_ljus_IEC_kabel-300x250.png',
  // El-tillbehör (delade med ljud)
  'ljus/pp_el_grenuttag_sm.png':       '/wp-content/uploads/2025/08/pp_ljud_tillbehor13_20250824PNG-300x250.png',
  'ljus/pp_el_forlangning.png':        '/wp-content/uploads/2025/08/pp_ljud_tillbehor12_20250824PNG-300x250.png',
  'ljus/pp_el_grenuttag_lg.png':       '/wp-content/uploads/2025/08/pp_ljud_tillbehor14_20250824PNG-300x250.png',
  'ljus/pp_el_grenuttag_25m.png':      '/wp-content/uploads/2025/08/pp_ljud_tillbehor15_20250824PNG-300x250.png',
  'ljus/pp_el_forlangning_20m.png':    '/wp-content/uploads/2025/08/pp_ljud_tillbehor16_20250824PNG-300x250.png',
  'ljus/pp_el_omvandlare.png':         '/wp-content/uploads/2025/08/pp_ljud_tillbehor11_20250824PNG-300x250.png',
  'ljus/pp_el_overloppsskydd.png':     '/wp-content/uploads/2025/08/pp_ljud_tillbehor17_20250824PNG-300x250.png',
  'ljus/pp_ljus_storre_event.png':     '/wp-content/uploads/2026/01/pp_ljus_storre_event.png',

  // ── DJ ────────────────────────────────────────────────────────────────
  'dj/pp_DJ_DJ-service.png': '/wp-content/uploads/2026/01/pp_DJ_DJ-service_202601-1024x853.png',
  'dj/pp_DJ_small.png':      '/wp-content/uploads/2026/01/pp_DJ_small_202601-1-1024x853.png',
  'dj/DJ_bild.png':          '/wp-content/uploads/2025/12/DJ-1024x450.png',
  'dj/DJ_Mans.png':          '/wp-content/uploads/2025/10/DJ_Mans2-scaled.png',
  'dj/DJ_Fuse.png':          '/wp-content/uploads/2025/10/DJ_Fuse2-scaled.png',
  'dj/DJ_SweZig.png':        '/wp-content/uploads/2025/10/DJ-SweZig2-scaled.png',
  'dj/DJ_Aasma.png':         '/wp-content/uploads/2025/10/DJ_Aasma2-scaled.png',
  'dj/pp_DJ_bord.png':     '/wp-content/uploads/2025/08/pp_DJ_bord_20250824.png',
  'dj/pp_DJ_bord2.png':    '/wp-content/uploads/2026/02/pp_DJ_bord2_202601-1024x853.png',
  'dj/pp_DJ_large1.png':   '/wp-content/uploads/2026/01/pp_DJ_large1_202601-1024x853.png',
  'dj/pp_DJ_large2.png':   '/wp-content/uploads/2026/01/pp_DJ_large2_202601-1024x853.png',
  'dj/pp_DJ_engineer.png': '/wp-content/uploads/2026/01/pp_Engineer-1024x853.png',
  // DJ-utrustning tillbehör (fallback – samma controller-bild om specifik saknas)

  // ── BILD ──────────────────────────────────────────────────────────────
  'bild/pp_bild_projektor.png':   '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_projektor1.png':  '/wp-content/uploads/2025/08/pp_bild_projektor1_20250824.png',
  'bild/pp_bild_65-skarm.png':    '/wp-content/uploads/2025/04/pp_bild_65-skarm-1024x853.png',
  'bild/pp_bild_75-skarm.png':    '/wp-content/uploads/2025/08/pp_bild_75-skarm_20250824.png',
  'bild/pp_bild_modulskarm.png':  '/wp-content/uploads/2025/10/pp_bild_modulskarm_20250824-1024x853.png',
  'bild/pp_bild_trailerscen.png': '/wp-content/uploads/2025/08/pp_bild_trailer_skarm_20250824.png',
  // Bild tillbehör
  'bild/pp_bild_projektorstativ.png': '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_100-duk.png':         '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_skarmststiv.png':     '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_HDMI.png':            '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_HDMI-splitter.png':   '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_mediaspelare.png':    '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
  'bild/pp_bild_23-skarm.png':        '/wp-content/uploads/2025/10/pp_bild_modulskarm_20250824-1024x853.png',
  'bild/pp_bild_USB-clicker.png':     '/wp-content/uploads/2025/10/pp_bild_projektor_20250824-1024x853.png',
};

// ── Nedladdningsfunktion ─────────────────────────────────────────────────
function download(relPath, wpPath) {
  return new Promise((resolve) => {
    const dest = path.join(OUT, relPath);
    if (fs.existsSync(dest)) { process.stdout.write(`  skip  ${relPath}\n`); return resolve(); }

    const url = BASE + wpPath;
    const get = url.startsWith('https') ? https.get : http.get;
    const req = get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (!loc) { process.stdout.write(`  redir-fail  ${relPath}\n`); return resolve(); }
        const r2 = loc.startsWith('https') ? https.get : http.get;
        r2(loc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          if (res2.statusCode !== 200) {
            process.stdout.write(`  ${res2.statusCode}  ${relPath}\n`); return resolve();
          }
          const ws = fs.createWriteStream(dest);
          res2.pipe(ws);
          ws.on('finish', () => { process.stdout.write(`  ✓  ${relPath}\n`); resolve(); });
          ws.on('error', () => { process.stdout.write(`  err  ${relPath}\n`); resolve(); });
        }).on('error', () => { process.stdout.write(`  net-err  ${relPath}\n`); resolve(); });
      } else if (res.statusCode === 200) {
        const ws = fs.createWriteStream(dest);
        res.pipe(ws);
        ws.on('finish', () => { process.stdout.write(`  ✓  ${relPath}\n`); resolve(); });
        ws.on('error', () => { process.stdout.write(`  err  ${relPath}\n`); resolve(); });
      } else {
        process.stdout.write(`  ${res.statusCode}  ${relPath}\n`);
        resolve();
      }
    });
    req.on('error', () => { process.stdout.write(`  net-err  ${relPath}\n`); resolve(); });
  });
}

// ── Kör nedladdning 5 parallellt ─────────────────────────────────────────
const entries = Object.entries(IMAGES);
console.log(`Laddar ner ${entries.length} bilder...\n`);

async function runBatch(items, batchSize = 5) {
  for (let i = 0; i < items.length; i += batchSize) {
    await Promise.all(items.slice(i, i + batchSize).map(([r, w]) => download(r, w)));
  }
}

runBatch(entries).then(() => {
  const count = Object.keys(IMAGES).filter(r => fs.existsSync(path.join(OUT, r))).length;
  console.log(`\nKlart! ${count}/${entries.length} bilder finns nu i public/images/`);
});
