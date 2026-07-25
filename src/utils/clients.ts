// Delad hjälpfunktion för kundlistan (referenskunder).
// Läser src/data/clients.json (snapshot av Supabase-tabellen `clients`) och
// exponerar både kategori-grupperad vy och komplett lista till sidmallarna.
// Kategori-etiketter/ikoner definieras här (4 fasta kategorier).

import clientsData from '../data/clients.json';

export interface ClientRow { name: string; category: string | null; ort?: string | null; }

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
// Ersätter den tidigare hårdkodade urvals-arrayen i site.json.
// Namnen valideras mot clients.json (kanonisk källa) — okända namn utelämnas
// tyst så att sidan aldrig visar en kund som inte längre finns i registret.
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
  const known = new Set(rows().map((r) => r.name));
  return FEATURED_CLIENT_NAMES.filter((n) => known.has(n));
}
