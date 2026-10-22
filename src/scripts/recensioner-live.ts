// Live-recensioner i webbläsaren.
//
// Sidorna byggs med src/data/reviews.json, som synkas ur Supabase först vid
// nästa bygge. Det här skriptet hämtar den aktuella listan från
// /.netlify/functions/reviews-list så att en recension som lagts in i
// /admin/recensioner/ syns direkt. Den inbakade HTML:en står kvar som den är
// om hämtningen misslyckas.
//
// Antal och snitt skrivs om i alla element med
//   data-rec-antal              → antal (t.ex. "9")
//   data-rec-snitt              → snitt med decimalkomma ("4,9")
//   data-rec-snitt="en"         → snitt med decimalpunkt ("4.9")
// Korten renderar varje sida själv med listan som hamtaRecensioner() ger.

export interface LivRecension {
  author: string;
  initials: string;
  rating: number;
  time: string;
  publishTime: string;
  text: string;
}

export interface LivRecensioner {
  reviews: LivRecension[];
  count: number;
  rating: number;
  ratingStr: string;
}

let pagaende: Promise<LivRecensioner | null> | null = null;

/** Hämtar listan en gång per sidvisning, hur många som än frågar. */
export function hamtaRecensioner(): Promise<LivRecensioner | null> {
  if (!pagaende) {
    pagaende = fetch('/.netlify/functions/reviews-list')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (j && j.ok && Array.isArray(j.reviews) && j.reviews.length ? (j as LivRecensioner) : null))
      .catch(() => null);
  }
  return pagaende;
}

/** Skriver antal och snitt i alla element som bär data-rec-antal / data-rec-snitt. */
export function skrivSammanfattning(d: LivRecensioner, rot: ParentNode = document): void {
  rot.querySelectorAll<HTMLElement>('[data-rec-antal]').forEach((el) => {
    el.textContent = String(d.count);
  });
  rot.querySelectorAll<HTMLElement>('[data-rec-snitt]').forEach((el) => {
    el.textContent = el.dataset.recSnitt === 'en' ? d.rating.toFixed(1) : d.ratingStr;
  });
}

/** Hämtar och skriver antal och snitt. Returnerar listan för sidans egna kort. */
export async function hydreraSammanfattning(): Promise<LivRecensioner | null> {
  const d = await hamtaRecensioner();
  if (d) skrivSammanfattning(d);
  return d;
}

export function esc(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>
  )[c]);
}

/** "okt 2026" — samma format som startsidan använder vid bygget. */
export function manad(publishTime: string): string {
  const d = new Date(publishTime);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' }).replace('.', '');
}

/** Nyckel för att avgöra om listan skiljer sig från den inbakade. */
export function nyckel(r: Pick<LivRecension, 'author' | 'publishTime' | 'text'>): string {
  return `${r.author}|${String(r.publishTime || '').slice(0, 10)}|${r.text}`;
}
