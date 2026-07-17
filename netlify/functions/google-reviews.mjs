// netlify/functions/google-reviews.js
// Hämtar Google-recensioner via Places API (New) och returnerar normaliserad JSON.
// Cachas på Netlify CDN i 6h via Cache-Control: s-maxage=21600.
//
// Kräver miljövariabel GOOGLE_PLACES_API_KEY (Netlify → Site config → Environment variables).
// Place-ID är hårdkodat — Scenkonsult Nordens Google Business Profile.
//
// Anrop: GET /api/google-reviews → { ok, rating, count, reviews: [{author,initials,time,text,rating,uri}] }

const PLACE_ID = 'ChIJuWsoFN2fX0YRzIoYyrIjdEY';
const FIELD_MASK = 'rating,userRatingCount,reviews,regularOpeningHours';

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // 6h fresh på edge, 24h stale-while-revalidate. Browsern cachar 5 min.
    'Cache-Control': 'public, max-age=300, s-maxage=21600, stale-while-revalidate=86400',
  };

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'API key saknas' }), {
      status: 503, headers,
    });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=sv`;
    const r = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('GOOGLE_REVIEWS_ERROR:', r.status, errText.slice(0, 200));
      return new Response(JSON.stringify({ ok: false, error: `API ${r.status}` }), {
        status: 502, headers,
      });
    }

    const data = await r.json();
    // Sortera reviews: nyaste först. Places API:s default är MOST_RELEVANT,
    // och endpointen stödjer inte reviewsSort-parameter (returnerar 400).
    // Vi sorterar därför själva på publishTime (ISO timestamp).
    const rawReviews = (data.reviews || []).slice().sort((a, b) => {
      const ta = new Date(a.publishTime || 0).getTime();
      const tb = new Date(b.publishTime || 0).getTime();
      return tb - ta;
    });
    const reviews = rawReviews.map(rv => {
      const author = rv.authorAttribution?.displayName || 'Anonym';
      return {
        author,
        initials: initials(author),
        time: rv.relativePublishTimeDescription || '',
        publishTime: rv.publishTime || null,
        text: rv.text?.text || rv.originalText?.text || '',
        rating: rv.rating || 5,
        uri: rv.authorAttribution?.uri || null,
      };
    });

    return new Response(JSON.stringify({
      ok: true,
      rating: data.rating || null,
      count: data.userRatingCount || reviews.length,
      reviews,
      // Veckovis öppettider — periods används av frontend för "öppet nu"-pill
      // periods: [{ open: {day, hour, minute}, close: {day, hour, minute} }]
      // day: 0=Sunday, 1=Monday, ... 6=Saturday
      openingHours: data.regularOpeningHours ? {
        periods: data.regularOpeningHours.periods || [],
        weekdayDescriptions: data.regularOpeningHours.weekdayDescriptions || [],
      } : null,
    }), { status: 200, headers });
  } catch (err) {
    console.error('GOOGLE_REVIEWS_EXCEPTION:', err.message);
    return new Response(JSON.stringify({ ok: false, error: 'Fetch misslyckades' }), {
      status: 500, headers,
    });
  }
};

export const config = { path: '/api/google-reviews' };
