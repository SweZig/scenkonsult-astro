// scripts/run-python.mjs
//
// Kör ett Python-skript med vilken tolk som än finns på maskinen.
//
// Bakgrund: package.json och netlify.toml anropade `python3` rakt av. Det
// fungerar på Netlify (Linux) men inte i PowerShell på Windows, där `python3`
// är Microsoft Stores platshållare — den skriver ut ett installationsmeddelande
// och returnerar felkod, vilket bryter hela && -kedjan i prebuild.
//
// Ordningen är python3 → python → py -3. Varje kandidat verifieras med
// --version innan den används, så Store-stubben sorteras bort.
//
// Saknas Python helt: om katalogerna redan finns på disk varnar vi och låter
// bygget fortsätta (de är färska nog för lokalt arbete). Finns de inte
// avbryter vi med besked om vad som behöver installeras.
//
// Användning:  node scripts/run-python.mjs generate-quote-catalog.py

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIN = process.platform === 'win32';
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('run-python: ange ett skript att köra');
  process.exit(1);
}

const KANDIDATER = [
  ['python3', []],
  ['python', []],
  ['py', ['-3']],
];

function fungerar(cmd, pre) {
  const r = spawnSync(cmd, [...pre, '--version'], {
    encoding: 'utf8',
    shell: WIN,
    windowsHide: true,
  });
  if (r.error || r.status !== 0) return false;
  return /Python 3/.test(`${r.stdout ?? ''}${r.stderr ?? ''}`);
}

const tolk = KANDIDATER.find(([cmd, pre]) => fungerar(cmd, pre));

if (tolk) {
  const [cmd, pre] = tolk;
  const r = spawnSync(cmd, [...pre, ...args], {
    stdio: 'inherit',
    shell: WIN,
    windowsHide: true,
    cwd: ROOT,
  });
  process.exit(r.status ?? 1);
}

// Ingen Python hittad.
const GENERERADE = [
  'src/data/quote-catalog.json',
  'src/data/order-catalog-flat.json',
];
const finnsRedan = GENERERADE.every((f) => fs.existsSync(path.join(ROOT, f)));

if (finnsRedan) {
  console.warn(
    '\n⚠️  run-python: hittade ingen Python 3 (provade python3, python, py -3).\n' +
    `   ${args[0]} hoppades över — befintliga kataloger på disk används.\n` +
    '   De byggs om korrekt av Netlify vid deploy. Installera Python 3 om du\n' +
    '   vill att lokala bygg ska spegla ändringar i datafilerna direkt.\n'
  );
  process.exit(0);
}

console.error(
  '\n❌ run-python: hittade ingen Python 3 (provade python3, python, py -3),\n' +
  `   och ${GENERERADE.join(' / ')} saknas på disk.\n\n` +
  '   Installera Python 3 från python.org och öppna ett nytt terminalfönster.\n' +
  '   På Windows: bocka i "Add python.exe to PATH" i installeraren.\n'
);
process.exit(1);
