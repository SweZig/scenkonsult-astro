// src/utils/produktLank.ts — länk till en produkts kort på den sida där den säljs.
//
// Artikelnumret är produktens ID. Varje produktkort bär attributet
// `data-sk-ankare="<artno> …"` (ett kort med varianter listar alla sina
// artikelnummer, och varje variantknapp har `data-sk-ankare-val`). Länken pekar
// på `<sida>#<artno med gemener>`; skriptet skAnkare i Layout.astro letar upp
// kortet, väljer rätt variant och scrollar dit. Inget id-attribut används,
// eftersom samma produkt kan synas på flera kort på en sida.
//
//   produktSida('SK-LJD-EVE-0001')  → '/vara-tjanster/hyra-ljud/event/'
//   produktLank('SK-LJD-EVE-0001')  → '/vara-tjanster/hyra-ljud/event/#sk-ljd-eve-0001'
//
// Tabellen över vilken serie som säljs på vilken sida: src/lib/produkt-sidor.mjs.
import ljud from '../data/ljud.json';
import ljus from '../data/ljus.json';
import bild from '../data/bild.json';
import dj from '../data/dj.json';
import scenes from '../data/scenes.json';
import { byggSidor, ankare } from '../lib/produkt-sidor.mjs';

const SIDA: Map<string, string> = byggSidor({ ljud, ljus, bild, dj, scenes });

export { ankare };

/** Sidan där produkten säljs, eller null om den inte har någon. */
export const produktSida = (artno: string): string | null => SIDA.get(artno) ?? null;

/** Länk direkt till produktens kort, eller null. */
export function produktLank(artno: string): string | null {
  const s = produktSida(artno);
  return s ? `${s}#${ankare(artno)}` : null;
}
