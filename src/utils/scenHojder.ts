// src/utils/scenHojder.ts — vilka benhöjder varje scenplattform finns i.
//
// Källa: scenes.json → modules[].heights. Konfiguratorn, paketkorten,
// ytjämförelsen och scensidan läser härifrån i stället för att skriva in
// "endast 40 cm" var för sig — när 1×1-podierna fick 20 cm-ben 2026-10-17
// stod regeln på sju ställen.
//
//   HOJDER['1x1-halkfri']          → [20, 40]
//   hojdText([20, 40])             → "20 eller 40 cm"
//   hojdText([20, 40, 60], 'och')  → "20, 40 och 60 cm"
//   saknasText('1x1-halkfri')      → "1×1 m-podier finns i 20 och 40 cm. 60 cm finns för 1×2 m-podier"
import scenData from '../data/scenes.json';

type Modul = { size?: string; surface?: string; heights?: number[] };

/** '1×1 m' + 'halkfri' → '1x1-halkfri' — samma nyckel som konfiguratorerna använder. */
export function ytaNyckel(m: Modul): string {
  const storlek = (m.size || '').replace(/\s*m\b/i, '').replace(/\s/g, '').replace(/×/g, 'x');
  return `${storlek}-${m.surface === 'slät' ? 'slat' : 'halkfri'}`;
}

// Utgångna plattformar (active:false) räknas inte — de kan ha samma storlek och yta.
const moduler = (((scenData as any).modules || []) as (Modul & { active?: boolean })[]).filter((m) => m.active !== false);

/** Benhöjder per plattformsyta, stigande. */
export const HOJDER: Record<string, number[]> = Object.fromEntries(
  moduler.map((m) => [ytaNyckel(m), [...(m.heights || [])].sort((a, b) => a - b)])
);

/** Alla höjder som någon plattform finns i. */
export const ALLA_HOJDER: number[] = [...new Set(Object.values(HOJDER).flat())].sort((a, b) => a - b);

/** [20, 40, 60] → "20, 40 eller 60 cm". */
export function hojdText(h: number[], bindeord: 'eller' | 'och' = 'eller'): string {
  if (!h.length) return '';
  if (h.length === 1) return `${h[0]} cm`;
  return `${h.slice(0, -1).join(', ')} ${bindeord} ${h[h.length - 1]} cm`;
}

/** Förklaring när en yta saknar höjder som andra ytor har, annars ''. */
export function saknasText(yta: string): string {
  const har = HOJDER[yta] || [];
  const saknas = ALLA_HOJDER.filter((h) => !har.includes(h));
  if (!saknas.length) return '';
  const storlek = yta.split('-')[0].replace('x', '×');
  const andra = Object.keys(HOJDER)
    .filter((k) => saknas.every((h) => HOJDER[k].includes(h)))
    .map((k) => k.split('-')[0].replace('x', '×'));
  const var_ = [...new Set(andra)].join('/');
  return `${storlek} m-podier finns i ${hojdText(har, 'och')}. ${hojdText(saknas, 'och')} finns för ${var_} m-podier`;
}
