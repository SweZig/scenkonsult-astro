// scripts/fetch-google-reviews-buildtime.mjs
// Build-time fetch av Google Places API → cachas till src/data/google-reviews-cache.json
// Används av Layout.astro för att injicera aggregateRating i LocalBusiness-schemat.
//
// Robust: vid fel (saknad API-nyckel, API-fel, ofullständig data) behålls existerande cache
// så att build aldrig faller. Lokal dev utan API-nyckel använder cache från senaste deploy.
//
// Kräver GOOGLE_PLACES_API_KEY i environment. Place-ID hårdkodat (samma som
// netlify/functions/google-reviews.js).

import fs from 'fs';
import path from 'path';

const PLACE_ID = 'ChIJuWsoFN2fX0YRzIoYyrIjdEY';
const FIELD_MASK = 'rating,userRatingCount';
const CACHE_PATH = path.resolve('src/data/google-reviews-cache.json');

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    if (fs.existsSync(CACHE_PATH)) {
      console.log('ℹ️  GOOGLE_PLACES_API_KEY saknas — behåller existerande cache');
    } else {
      console.log('ℹ️  GOOGLE_PLACES_API_KEY saknas och ingen cache — schema får ingen aggregateRating');
    }
    return;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=sv`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`⚠️  Places API svarade ${res.status} — behåller cache. Detalj: ${errText.slice(0, 200)}`);
      return;
    }

    const data = await res.json();
    const rating = typeof data.rating === 'number' ? data.rating : null;
    const count = typeof data.userRatingCount === 'number' ? data.userRatingCount : null;

    if (rating === null || count === null || count < 1) {
      console.error(`⚠️  Places API returnerade ofullständig data (rating=${rating}, count=${count}) — behåller cache`);
      return;
    }

    const cache = {
      rating: Math.round(rating * 10) / 10, // 1 decimal
      count,
      fetchedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
    console.log(`✅ Google reviews-cache: ${cache.rating}★ (${cache.count} recensioner)`);
  } catch (err) {
    console.error(`⚠️  Fetch error: ${err.message} — behåller cache`);
  }
}

main();
