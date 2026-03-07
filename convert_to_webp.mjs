/**
 * Scenkonsult – PNG → WebP konvertering
 * Kör: node convert_to_webp.mjs
 *
 * Installera sharp en gång:
 *   npm install sharp --save-dev
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR   = path.join(__dirname, 'public', 'images');
const QUALITY   = 82;   // 0–100, bra balans mellan kvalitet och storlek
const DELETE_PNG = false; // sätt till true om du vill ta bort originalen efteråt

function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(0)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

function findPngs(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findPngs(full, list);
    else if (entry.name.endsWith('.png')) list.push(full);
  }
  return list;
}

if (!fs.existsSync(IMG_DIR)) {
  console.error('\n❌  public/images saknas – kör download_images.mjs först.\n');
  process.exit(1);
}

const pngs = findPngs(IMG_DIR);
if (pngs.length === 0) {
  console.log('\n⚠  Inga PNG-filer hittades i public/images.\n');
  process.exit(0);
}

console.log(`\n🔄  Konverterar ${pngs.length} PNG-filer till WebP (kvalitet ${QUALITY})\n${'─'.repeat(70)}`);

let ok = 0, skip = 0, saved = 0;

for (const src of pngs) {
  const dest = src.replace(/\.png$/, '.webp');
  const label = path.relative(IMG_DIR, src).padEnd(45);

  if (fs.existsSync(dest)) {
    console.log(`  –  ${label}  redan konverterad`);
    skip++; continue;
  }

  try {
    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    const before = fs.statSync(src).size;
    const after  = fs.statSync(dest).size;
    const pct    = Math.round((1 - after / before) * 100);
    saved += before - after;
    console.log(`  ✓  ${label}  ${fmtBytes(before)} → ${fmtBytes(after)}  (-${pct}%)`);
    if (DELETE_PNG) fs.unlinkSync(src);
    ok++;
  } catch (e) {
    console.log(`  ✗  ${label}  ${e.message}`);
  }
}

console.log(`${'─'.repeat(70)}`);
console.log(`\n✅  ${ok} konverterade · ${skip} redan klara · ${fmtBytes(saved)} totalt sparat\n`);

if (!DELETE_PNG && ok > 0) {
  console.log('💡  PNG-originalen finns kvar (DELETE_PNG = false).');
  console.log('   SmartImage.astro väljer WebP automatiskt i moderna browsers.');
  console.log('   Sätt DELETE_PNG = true i scriptet om du vill ta bort PNG:erna.\n');
}
