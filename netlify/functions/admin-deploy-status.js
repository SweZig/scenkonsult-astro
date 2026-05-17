// netlify/functions/admin-deploy-status.js
// Returnerar status för senaste production-deploys
// GET /.netlify/functions/admin-deploy-status
// Kräver: Authorization: Bearer <ADMIN_TOKEN>
//
// Returnerar:
//   {
//     ok: true,
//     production: { id, state, commit_ref, deploy_time, error_message, admin_url, deploy_url, created_at, updated_at },
//     latest5: [ ... ]   // de senaste 5 production-deploys
//   }
//
// state-värden från Netlify: 'new','pending','enqueued','accepted','prepared','uploading',
// 'uploaded','preparing','building','processing','ready','error'

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const token = process.env.NETLIFY_API_TOKEN;
  if (!token) return err('NETLIFY_API_TOKEN saknas i Netlify env', 500);

  // SITE_ID sätts automatiskt av Netlify i functions
  const siteId = process.env.SITE_ID;
  if (!siteId) return err('SITE_ID saknas (oväntat — Netlify ska sätta den)', 500);

  try {
    const url = `https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=10`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent':    'scenkonsult-admin'
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return err(`Netlify API ${res.status}: ${text.slice(0, 200)}`, res.status);
    }

    const deploys = await res.json();

    // Filtrera bort branch-deploys och deploy-previews — bara production
    const productionDeploys = deploys.filter(d => d.context === 'production');

    const slim = (d) => ({
      id:            d.id,
      state:         d.state,
      commit_ref:    d.commit_ref,
      commit_url:    d.commit_url,
      deploy_url:    d.deploy_ssl_url || d.deploy_url,
      admin_url:     d.admin_url,
      created_at:    d.created_at,
      updated_at:    d.updated_at,
      published_at:  d.published_at,
      deploy_time:   d.deploy_time,
      error_message: d.error_message,
      title:         d.title
    });

    const latest = productionDeploys[0] || null;

    return ok({
      ok:         true,
      production: latest ? slim(latest) : null,
      latest5:    productionDeploys.slice(0, 5).map(slim)
    });
  } catch (e) {
    return err(`Netlify API error: ${e.message}`, 500);
  }
};
