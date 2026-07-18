// netlify/functions/reviews-list.js
// Publik, oautentiserad GET — hämtas client-side av referens- och kontaktsidan
// för att spegla admin-ändringar direkt (utan att invänta en ny build).
// Server-renderad snapshot finns i src/data/reviews.json (SEO/fallback).
//
// Returnerar färdigformaterade objekt (initialer + svensk relativ tid) plus
// sammanvägt betyg. ANTALET i badgen kommer separat från Googles API
// (/api/google-reviews, userRatingCount) — inte härifrån.
//
// GET /.netlify/functions/reviews-list

'use strict';
const { supabase, err, preflight } = require('./_lib');

function initialsOf(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function relativeTimeSv(publishTime) {
  const then = new Date(publishTime).getTime();
  if (Number.isNaN(then)) return '';
  const days = Math.max(0, Math.floor((Date.now() - then) / 86400000));
  if (days <= 0) return 'idag';
  if (days === 1) return 'för en dag sedan';
  if (days < 7) return `för ${days} dagar sedan`;
  if (days < 28) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? 'för en vecka sedan' : `för ${weeks} veckor sedan`;
  }
  if (days < 365) {
    const months = Math.max(1, Math.round(days / 30));
    return months === 1 ? 'för en månad sedan' : `för ${months} månader sedan`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? 'för ett år sedan' : `för ${years} år sedan`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'GET') return err('Metod ej tillåten', 405);

  try {
    const db = supabase();
    const { data } = await db.from('reviews')
      .select('author,rating,review_text,published_at,sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    const rows = data || [];
    const reviews = rows.map(r => ({
      author: r.author,
      initials: initialsOf(r.author),
      rating: r.rating || 5,
      time: relativeTimeSv(r.published_at),
      publishTime: r.published_at,
      text: r.review_text,
    }));

    const count = reviews.length;
    const avg = count ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
    const rating = Math.round(avg * 10) / 10;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://scenkonsult.se',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
      body: JSON.stringify({ ok: true, reviews, count, rating, ratingStr: rating.toFixed(1).replace('.', ',') }),
    };
  } catch (e) {
    console.error('REVIEWS_LIST_ERROR:', e.message);
    return err('Internt fel', 500);
  }
};
