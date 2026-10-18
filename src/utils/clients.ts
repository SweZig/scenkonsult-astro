// Delad hjälpfunktion för kundlistan (referenskunder).
// Läser src/data/clients.json (snapshot av Supabase-tabellen `clients`) och
// exponerar både kategori-grupperad vy och komplett lista till sidmallarna.
// Kategori-etiketter/ikoner definieras här (4 fasta kategorier).

import clientsData from '../data/clients.json';

export interface ClientRow { name: string; category: string | null; ort?: string | null; featured?: boolean; }

// Fasta kategorier — ordning styr visning på referenssidan.
export const CATEGORY_META = [
  { key: 'kommun', label: 'Kommuner & Myndigheter', icon: '🏛️' },
  { key: 'naringsliv', label: 'Näringsliv & Företag', icon: '🏢' },
  { key: 'ambassad', label: 'Ambassader & Org.', icon: '🌍' },
  { key: 'event', label: 'Event & Kultur', icon: '🎶' },
] as const;

function rows(): ClientRow[] {
  return (clientsData.clients as ClientRow[]) || [];
}

// De 4 kategorierna med sina kunder (i kurerad ordning). Tomma kategorier utelämnas.
export function getClientCategories() {
  const all = rows();
  return CATEGORY_META
    .map((c) => ({
      ...c,
      clients: all.filter((r) => r.category === c.key).map((r) => r.name),
    }))
    .filter((c) => c.clients.length > 0);
}

// Samtliga kundnamn (för "Samtliga referenskunder" och om-oss).
export function getAllClientNames(): string[] {
  return rows().map((r) => r.name);
}

// Kunder kopplade till en specifik ort (matchar `ort`-fältet, satt i /admin/referenser/).
// Case-insensitivt mot ortens namn (t.ex. "Solna"). Används på ortssidorna.
export function getClientsByOrt(ort: string): string[] {
  const target = (ort || '').trim().toLowerCase();
  if (!target) return [];
  return rows()
    .filter((r) => (r.ort || '').trim().toLowerCase() === target)
    .map((r) => r.name);
}

// Kurerat urval av kunder för logo-banners (foretagsfest, ort-sidor).
// PRIMÄR källa: kunder markerade som `featured` i /admin/referenser/ (Supabase).
// FALLBACK (om ingen kund ännu markerats som featured): denna kodlista.
// Namnen valideras mot clients.json — okända namn utelämnas tyst.
const FEATURED_CLIENT_NAMES = [
  'ICA Sverige',
  'Tele2',
  'EY',
  'Hornbach',
  'Houdini Sportsware',
  'ABG Sundal Collier',
  'Akademiska Hus',
  'Solna Stad',
  'Stockholm Stad',
  'Mälardalens Universitet',
  'Kommunalarbetareförbundet',
  'Ung Företagsamhet',
];

export function getFeaturedClients(): string[] {
  const all = rows();
  // Primärt: kunder markerade som featured i admin (i sort_order-ordning).
  const flagged = all.filter((r) => r.featured).map((r) => r.name);
  if (flagged.length) return flagged;
  // Fallback: kurerad kodlista (innan någon kund markerats featured i admin).
  const known = new Set(all.map((r) => r.name));
  return FEATURED_CLIENT_NAMES.filter((n) => known.has(n));
}

// Kundlogotyper ("De har hyrt av oss") — en fil per kund i /images/kunder/, transparent
// i lavendel. Används på startsidan och /referenser/.
// tall: höga märken (rundlar, sköldar) får större höjd än breda ordmärken.
export const KUNDLOGOTYPER: Array<{ src: string; name: string; w: number; h: number; tall?: boolean }> = [
  { src: '/images/kunder/logo_ica.webp', name: 'ICA Sverige', w: 222, h: 114 },
  { src: '/images/kunder/logo_hornbach.webp', name: 'Hornbach', w: 276, h: 52 },
  { src: '/images/kunder/logo_abg.webp', name: 'ABG Sundal Collier', w: 208, h: 115 },
  { src: '/images/kunder/logo_houdini.webp', name: 'Houdini', w: 325, h: 70 },
  { src: '/images/kunder/logo_german_beerhall.webp', name: 'German Beer Hall', w: 311, h: 360, tall: true },
  { src: '/images/kunder/logo_hacksaw.webp', name: 'Hacksaw Studios', w: 201, h: 61 },
  { src: '/images/kunder/logo_hardrock.webp', name: 'Hard Rock Café', w: 259, h: 150 },
  { src: '/images/kunder/logo_uf.webp', name: 'UF Företagande', w: 236, h: 81 },
];
