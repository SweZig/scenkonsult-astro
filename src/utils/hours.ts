// src/utils/hours.ts — telefon- och depåtider ur site.json, formaterade för text.
//
// Källa: site.json → company.phoneHours ("Mo-Fr 09:00-17:00") och
// company.openingHours ("Mo-Fr 09:00-17:00, Sa-Su 12:00-15:00"), samma
// schema.org-format som JSON-LD i Layout.astro. Sidorna skriver sina egna
// meningar men hämtar klockslagen här, så att tiderna inte glider isär när de
// ändras — de stod tidigare inskrivna för hand i elva filer.
//
//   telefon()                → "mån–fre 09–17"
//   telefon({ lang: 'en' })  → "Mon–Fri 09–17"
//   telefon({ kort: false }) → "mån–fre 09:00–17:00"
//   telefon({ versal: true }) → "Mån–fre 09–17"
//   helg()                   → depåns helgtider, "lör–sön 12–15"
//   vardag()                 → depåns vardagstider, "mån–fre 09–17"
import site from '../data/site.json';

type Lang = 'sv' | 'en';
type Opt = { lang?: Lang; kort?: boolean; versal?: boolean };
type Period = { dagar: string[]; fran: string; till: string };

const DAG: Record<Lang, Record<string, string>> = {
  sv: { Mo: 'mån', Tu: 'tis', We: 'ons', Th: 'tors', Fr: 'fre', Sa: 'lör', Su: 'sön' },
  en: { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' },
};

const co = (site as any).company ?? {};

function tolka(s: string): Period[] {
  return String(s || '')
    .split(',')
    .map((del) => del.trim().match(/^([A-Z][a-z])(?:-([A-Z][a-z]))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/))
    .filter(Boolean)
    .map((m) => ({ dagar: [m![1], m![2] ?? m![1]], fran: m![3], till: m![4] }));
}

const klocka = (t: string, kort: boolean) => (kort && t.endsWith(':00') ? t.slice(0, 2) : t);

function text(p: Period | undefined, { lang = 'sv', kort = true, versal = false }: Opt = {}): string {
  if (!p) return '';
  const [a, b] = p.dagar.map((d) => DAG[lang][d] ?? d);
  const dagar = a === b ? a : `${a}–${b}`;
  const s = `${dagar} ${klocka(p.fran, kort)}–${klocka(p.till, kort)}`;
  return versal ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const telefonPerioder = tolka(co.phoneHours || co.openingHours);
const depaPerioder = tolka(co.openingHours);
const arHelg = (p: Period) => p.dagar[0] === 'Sa' || p.dagar[0] === 'Su';

/** Telefontid, t.ex. "mån–fre 09–17". */
export const telefon = (o?: Opt) => text(telefonPerioder[0], o);
/** Depåns vardagstider, t.ex. "mån–fre 09–17". */
export const vardag = (o?: Opt) => text(depaPerioder.find((p) => !arHelg(p)), o);
/** Depåns helgtider (hämtning och återlämning), t.ex. "lör–sön 12–15". */
export const helg = (o?: Opt) => text(depaPerioder.find(arHelg), o);
