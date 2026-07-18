// Delad hjälpfunktion för Google-recensioner.
// Läser den kompletta, kurerade listan i src/data/reviews.json (kringgår Places
// API:ts 5-recensioners-tak) och exponerar färdigberäknad data till sidmallarna.
// Tidsetiketten ('för X sedan') beräknas vid build från publishTime.

import reviewsData from '../data/reviews.json';

export interface Review {
  author: string;
  initials: string;
  rating: number;
  publishTime: string;
  time: string; // svensk relativ etikett, beräknad vid build
  text: string;
}

// Initialer: första + sista ordets begynnelsebokstav (versaler).
function initialsOf(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Svensk relativ tid i Google-stil ("för 5 dagar sedan", "för en månad sedan").
function relativeTimeSv(publishTime: string): string {
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

// Alla recensioner i kurerad ordning (från admin/sort_order — filen skrivs redan
// i rätt ordning av netlify/generate-reviews.mjs), med härledda fält.
export function getReviews(): Review[] {
  return (reviewsData.reviews as Array<Omit<Review, 'initials' | 'time'>>)
    .map((r) => ({
      ...r,
      initials: initialsOf(r.author),
      time: relativeTimeSv(r.publishTime),
    }));
}

// Sammanvägt betyg (1 decimal) och antal — härlett ur listan.
export function getSummary(): { rating: number; count: number; ratingStr: string } {
  const list = reviewsData.reviews as Array<{ rating: number }>;
  const count = list.length;
  const avg = count ? list.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
  const rating = Math.round(avg * 10) / 10;
  return { rating, count, ratingStr: rating.toFixed(1).replace('.', ',') };
}
