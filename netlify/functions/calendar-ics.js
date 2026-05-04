// netlify/functions/calendar-ics.js
// iCal-feed för bokningar — för att prenumerera på i Google/iCloud/Outlook
// GET /.netlify/functions/calendar-ics?token=<CALENDAR_FEED_TOKEN>
//
// Authentication: Token i query-parameter eftersom kalenderfeeds inte stödjer custom headers.
// Använd ett separat CALENDAR_FEED_TOKEN (env var) — INTE samma som ADMIN_TOKEN.
// Token förekommer i feed-URL:en som lagras i kalenderklienter och cachas av Google etc.

'use strict';

// ── Hjälpfunktioner ──────────────────────────────────────────────
const ESC = (s) => String(s ?? '')
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')
  .replace(/\r?\n/g, '\\n');

// iCal kräver "folding" — rader > 75 oktetter måste brytas med CRLF + space
function foldLine(line) {
  if (line.length <= 75) return line;
  const parts = [];
  let i = 0;
  parts.push(line.slice(0, 75));
  i = 75;
  while (i < line.length) {
    parts.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return parts.join('\r\n');
}

// Bygg "floating" lokal datetid för Stockholm: YYYYMMDDTHHMMSS (utan Z, anges via TZID)
function fmtLocalDt(date, time) {
  if (!date) return null;
  const [Y, M, D] = String(date).split('-');
  let [h, m] = String(time || '00:00').split(':');
  h = String(h || '0').padStart(2, '0');
  m = String(m || '0').padStart(2, '0');
  if (!Y || !M || !D) return null;
  return `${Y}${M}${D}T${h}${m}00`;
}

// UTC-tidsstämpel för DTSTAMP — YYYYMMDDTHHMMSSZ
function nowUtc() {
  return new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
}

// Status-mapping till iCal STATUS
function icalStatus(s) {
  if (s === 'confirmed' || s === 'fakturerad' || s === 'betald') return 'CONFIRMED';
  if (s === 'cancelled') return 'CANCELLED';
  return 'TENTATIVE';
}

// Mänskligt status-label på svenska
function statusLabel(s) {
  return ({
    new:        'Inkommen',
    waiting:    'Offert skickad',
    confirmed:  'Bekräftad',
    fakturerad: 'Fakturerad',
    betald:     'Betald',
    cancelled:  'Avbruten',
  }[s]) || s || '';
}

exports.handler = async (event) => {
  // Endast GET (och HEAD för pre-flight i vissa kalenderklienter)
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // Token i query-param (inte header — kalenderprenumerationer stödjer inte headers)
  const provided = event.queryStringParameters?.token || '';
  const expected = process.env.CALENDAR_FEED_TOKEN || '';
  if (!expected) {
    return {
      statusCode: 503,
      body: 'CALENDAR_FEED_TOKEN är inte konfigurerad i Netlify-env. Sätt en hemlig sträng (t.ex. uuidgen) och försök igen.',
    };
  }
  // Konstanttidsjämförelse light — undvik timing-läckor
  if (provided.length !== expected.length || provided !== expected) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supaUrl || !supaKey) {
    return { statusCode: 500, body: 'Supabase saknas i env' };
  }

  // Hämta carts: 60 dagar bakåt → 730 dagar framåt (täcker säsongsplanering)
  const today = new Date();
  const min = new Date(today.getTime() - 60 * 86400000).toISOString().slice(0, 10);
  const max = new Date(today.getTime() + 730 * 86400000).toISOString().slice(0, 10);

  const fields = [
    'id', 'status',
    'customer_name', 'customer_company', 'customer_email', 'customer_phone',
    'event_date', 'return_date', 'delivery_time', 'return_time',
    'event_location', 'total_excl', 'items',
    'invoice_number', 'created_at', 'updated_at',
  ].join(',');

  const url = `${supaUrl}/rest/v1/carts?select=${fields}&event_date=gte.${min}&event_date=lte.${max}&id=not.like.SK-RESERVE-*&order=event_date.asc`;

  let carts = [];
  try {
    const res = await fetch(url, {
      headers: {
        apikey: supaKey,
        Authorization: `Bearer ${supaKey}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      console.error('CALENDAR_ICS_SUPABASE_ERR:', res.status, await res.text());
      return { statusCode: 502, body: 'Kunde inte hämta bokningar' };
    }
    carts = await res.json();
  } catch (e) {
    console.error('CALENDAR_ICS_FETCH_ERR:', e.message);
    return { statusCode: 502, body: 'Nätverksfel mot databasen' };
  }

  // ── Bygg VCALENDAR ─────────────────────────────────────────────
  const lines = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Scenkonsult Norden//Admin Calendar//SV');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push('X-WR-CALNAME:Scenkonsult Bokningar');
  lines.push('X-WR-TIMEZONE:Europe/Stockholm');
  lines.push('X-WR-CALDESC:Bokningar och uthyrningar från Scenkonsult Nordens admin');
  lines.push('REFRESH-INTERVAL;VALUE=DURATION:PT1H');
  lines.push('X-PUBLISHED-TTL:PT1H');

  // VTIMEZONE — Europe/Stockholm. Krävs för att DTSTART;TZID=… ska tolkas korrekt.
  lines.push('BEGIN:VTIMEZONE');
  lines.push('TZID:Europe/Stockholm');
  lines.push('X-LIC-LOCATION:Europe/Stockholm');
  lines.push('BEGIN:STANDARD');
  lines.push('DTSTART:19701025T030000');
  lines.push('TZOFFSETFROM:+0200');
  lines.push('TZOFFSETTO:+0100');
  lines.push('TZNAME:CET');
  lines.push('RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU');
  lines.push('END:STANDARD');
  lines.push('BEGIN:DAYLIGHT');
  lines.push('DTSTART:19700329T020000');
  lines.push('TZOFFSETFROM:+0100');
  lines.push('TZOFFSETTO:+0200');
  lines.push('TZNAME:CEST');
  lines.push('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU');
  lines.push('END:DAYLIGHT');
  lines.push('END:VTIMEZONE');

  const dtstamp = nowUtc();

  for (const c of carts) {
    if (!c.event_date) continue;

    const startDate  = c.event_date;
    const startTime  = c.delivery_time || '13:00';
    const hasReturn  = !!c.return_date && c.return_date >= c.event_date;
    const endDate    = hasReturn ? c.return_date : c.event_date;
    const endTime    = c.return_time || (hasReturn ? '11:00' : '17:00');

    const dtStart = fmtLocalDt(startDate, startTime);
    const dtEnd   = fmtLocalDt(endDate, endTime);
    if (!dtStart || !dtEnd) continue;

    // Summary: kund + ev. totalbelopp
    const totalKr = (typeof c.total_excl === 'number')
      ? Math.round(c.total_excl / 100).toLocaleString('sv-SE') + ' kr'
      : '';
    const customer = c.customer_company || c.customer_name || c.id;
    const summary  = totalKr ? `${customer} · ${totalKr}` : customer;

    // Description: produkter, status, kontaktinfo, admin-länk
    const items = Array.isArray(c.items) ? c.items : [];
    const itemsList = items
      .filter(i => i && i.name)
      .map(i => `• ${i.name} ×${i.qty || 1}`)
      .join('\n');
    const descParts = [];
    if (itemsList) descParts.push(itemsList);
    descParts.push(`Status: ${statusLabel(c.status)}`);
    if (hasReturn) {
      descParts.push(`Period: ${startDate} ${startTime} → ${endDate} ${endTime}`);
    }
    if (c.customer_phone) descParts.push(`Tel: ${c.customer_phone}`);
    if (c.customer_email) descParts.push(`Mail: ${c.customer_email}`);
    if (c.invoice_number) descParts.push(`Faktura: ${c.invoice_number}`);
    descParts.push('');
    descParts.push(`Öppna i admin: https://scenkonsult.se/admin/?cart=${c.id}`);
    const description = descParts.join('\n');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${c.id}@scenkonsult.se`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART;TZID=Europe/Stockholm:${dtStart}`);
    lines.push(`DTEND;TZID=Europe/Stockholm:${dtEnd}`);
    lines.push(foldLine(`SUMMARY:${ESC(summary)}`));
    lines.push(foldLine(`DESCRIPTION:${ESC(description)}`));
    if (c.event_location) lines.push(foldLine(`LOCATION:${ESC(c.event_location)}`));
    lines.push(`STATUS:${icalStatus(c.status)}`);
    lines.push(`URL:https://scenkonsult.se/admin/?cart=${c.id}`);
    if (c.created_at) {
      const created = new Date(c.created_at).toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
      lines.push(`CREATED:${created}`);
    }
    if (c.updated_at) {
      const modified = new Date(c.updated_at).toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
      lines.push(`LAST-MODIFIED:${modified}`);
    }
    // TRANSP:OPAQUE = "blockerar tid" i kalender (default), TRANSPARENT = "ledig"
    lines.push(c.status === 'cancelled' ? 'TRANSP:TRANSPARENT' : 'TRANSP:OPAQUE');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  // ICS-spec kräver CRLF
  const body = lines.join('\r\n') + '\r\n';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="scenkonsult-bokningar.ics"',
      'Cache-Control': 'private, max-age=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
    body,
  };
};
