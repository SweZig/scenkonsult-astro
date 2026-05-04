// netlify/functions/admin-calendar-feed-url.js
// Returnerar feed-URL för iCal-prenumeration. Skyddad — kräver giltig ADMIN_TOKEN.
// Detta gör att FEED_TOKEN aldrig syns i admin-HTML:n innan admin har loggat in.

'use strict';
const { isAdmin, ok, err, preflight } = require('./_lib');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  const token = process.env.CALENDAR_FEED_TOKEN || '';
  if (!token) {
    return ok({
      configured: false,
      message: 'CALENDAR_FEED_TOKEN är inte satt i Netlify-env. Sätt en hemlig sträng (t.ex. uuidgen) och deploya om.',
    });
  }

  // Bygg URL — använd custom-domain om satt, annars host-headern
  const host = event.headers?.['x-forwarded-host'] || event.headers?.host || 'scenkonsult.se';
  const proto = event.headers?.['x-forwarded-proto'] || 'https';
  const url = `${proto}://${host}/.netlify/functions/calendar-ics?token=${encodeURIComponent(token)}`;
  // För Google Calendar fungerar webcal:// protokoll bra för auto-prenumeration på Apple/iCal
  const webcalUrl = url.replace(/^https?:/, 'webcal:');

  return ok({
    configured: true,
    url,
    webcal_url: webcalUrl,
  });
};
