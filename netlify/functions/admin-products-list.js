// netlify/functions/admin-products-list.js
// Hämtar en datafil från src/data/ via GitHub Contents API
// GET /.netlify/functions/admin-products-list?fil=ljud
// Kräver: Authorization: Bearer <ADMIN_TOKEN>
//
// Returnerar:
//   { ok: true, fil, sha, data, githubPath }
//
// SHA används som optimistic lock vid efterföljande update.

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

const REPO_OWNER = 'SweZig';
const REPO_NAME  = 'scenkonsult-astro';
const BRANCH     = 'main';

// Whitelist av tillåtna filer (säkerhet: inga godtyckliga sökvägar)
const ALLOWED_FILES = {
  ljud:    'src/data/ljud.json',
  ljus:    'src/data/ljus.json',
  dj:      'src/data/dj.json',
  scenes:  'src/data/scenes.json',
  bild:    'src/data/bild.json',
  el:      'src/data/el.json',
  karaoke: 'src/data/karaoke.json',
  tjanster:'src/data/tjanster.json',
  site:    'src/data/site.json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const { fil } = event.queryStringParameters || {};
  const path = ALLOWED_FILES[fil];
  if (!path) return err(`Ogiltig fil: ${fil}. Tillåtna: ${Object.keys(ALLOWED_FILES).join(', ')}`, 400);

  const token = process.env.GITHUB_TOKEN;
  if (!token) return err('GITHUB_TOKEN saknas i Netlify env', 500);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'scenkonsult-admin'
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return err(`GitHub API ${res.status}: ${text.slice(0, 200)}`, res.status);
    }

    const json = await res.json();
    // GitHub returnerar { content: base64, sha, ... }
    const content = Buffer.from(json.content, 'base64').toString('utf8');
    let data;
    try {
      data = JSON.parse(content);
    } catch (e) {
      return err(`Filen i GitHub är inte giltig JSON: ${e.message}`, 500);
    }

    return ok({
      ok:         true,
      fil,
      sha:        json.sha,
      data,
      githubPath: path
    });
  } catch (e) {
    return err(`Kunde inte hämta från GitHub: ${e.message}`, 500);
  }
};
