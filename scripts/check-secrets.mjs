// scripts/check-secrets.mjs
// Körs av .githooks/pre-commit. Stoppar en commit om de ändringar som ska
// committas innehåller något som ser ut som en hemlighet.
//
// Varför: repot är publikt. En nyckel som committas är synlig för alla direkt
// och måste roteras — att stoppa den före commit är billigare än att städa
// historiken efteråt.
//
// Kontrollerar bara TILLAGDA rader i det som är stagat (git diff --cached),
// så befintlig kod stör inte. Supabase anon-nyckel släpps igenom (den är
// publik per design); service_role-nyckel stoppas.
//
// Nödutgång om det är ett falsklarm: git commit --no-verify
// Testa manuellt: node scripts/check-secrets.mjs

import { execSync } from 'node:child_process';

const PATTERNS = [
  ['Google API-nyckel', /AIza[0-9A-Za-z_-]{35}/],
  ['Anthropic API-nyckel', /sk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI API-nyckel', /\bsk-(proj-)?[A-Za-z0-9]{32,}/],
  ['Resend API-nyckel', /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}/],
  ['GitHub-token', /\b(ghp|gho|ghs|ghu|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}/],
  ['Netlify-token', /\bnfp_[A-Za-z0-9]{30,}/],
  ['Privat nyckel', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['Lösenord i URL', /[a-z]+:\/\/[^\s:/@]+:[^\s:/@]{6,}@/i],
];

const BLOCKED_FILES = [/(^|\/)\.env(\.(?!example$)|$)/, /(^|\/)\.secrets\//, /\.(pem|p12|pfx|key)$/i, /gh-pat/i];

function jwtRole(token) {
  try {
    const payload = token.split('.')[1];
    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    return JSON.parse(json).role || null;
  } catch {
    return null;
  }
}

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const files = sh('git diff --cached --name-only --diff-filter=ACMR').split('\n').filter(Boolean);
const problems = [];

for (const f of files) {
  if (BLOCKED_FILES.some((re) => re.test(f))) problems.push(`${f}: filen ska aldrig committas`);
}

let file = null;
let line = 0;
for (const row of sh('git diff --cached -U0 --no-color --diff-filter=ACMR').split('\n')) {
  if (row.startsWith('+++ ')) { file = row.slice(6); continue; }
  const hunk = row.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
  if (hunk) { line = Number(hunk[1]); continue; }
  if (!row.startsWith('+') || row.startsWith('+++')) continue;
  const text = row.slice(1);
  for (const [label, re] of PATTERNS) {
    if (re.test(text)) problems.push(`${file}:${line}: ${label}`);
  }
  for (const jwt of text.match(/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+/g) || []) {
    const role = jwtRole(jwt);
    if (role !== 'anon') problems.push(`${file}:${line}: JWT med roll "${role ?? 'okänd'}"`);
  }
  line++;
}

if (problems.length) {
  console.error('\n✖ Commit stoppad — möjlig hemlighet i det som ska committas:\n');
  for (const p of problems) console.error('  ' + p);
  console.error('\nTa bort värdet (lägg det i Netlify env eller .secrets/) och försök igen.');
  console.error('Är det ett falsklarm: git commit --no-verify\n');
  process.exit(1);
}
