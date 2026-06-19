// Delad hjälpfunktion för event-sidornas prissatta paket.
// Priser hämtas ALLTID från live-JSON via artno — aldrig hårdkodade.
// Resultatet kopplas mot moms-toggle i sidmallen via data-exkl-attribut.

import ljudData from '../data/ljud.json';
import ljusData from '../data/ljus.json';
import sceneData from '../data/scenes.json';
import bildData from '../data/bild.json';
import elData from '../data/el.json';

// Bygg en platt uppslagstabell över alla produkter med artno + pris
const _prodIndex: Record<string, any> = {};
function _indexProducts(node: any) {
  if (!node) return;
  if (Array.isArray(node)) { node.forEach(_indexProducts); return; }
  if (typeof node === 'object') {
    if (node.artno && typeof node.price === 'number') _prodIndex[node.artno] = node;
    Object.values(node).forEach(_indexProducts);
  }
}
[ljudData, ljusData, sceneData, bildData, elData].forEach(_indexProducts);

export function getProduct(artno: string) {
  const p = _prodIndex[artno];
  if (!p) throw new Error('Paket: saknar artno ' + artno + ' i JSON-data');
  return p;
}

export type PaketRad = { artno: string; label: string; qty?: number };

export type PaketDef = {
  namn: string;
  gaster: string;
  beskrivning?: string;
  rader: PaketRad[];
  featured?: boolean;
  // Sätt round=false för exakt JSON-summa (t.ex. studentflak). Default: avrunda nedåt till hel 100-lapp.
  round?: boolean;
};

export type PaketRadResolved = PaketRad & {
  qty: number;
  name: string;
  unitPrice: number;
  radPrice: number;
};

export type Paket = Omit<PaketDef, 'rader'> & {
  rader: PaketRadResolved[];
  summa: number;
  franPris: number;
};

// Lös upp ett paket: hämta namn/pris per rad från JSON och summera.
export function buildPaket(def: PaketDef): Paket {
  const rader: PaketRadResolved[] = def.rader.map(r => {
    const p = getProduct(r.artno);
    const qty = r.qty ?? 1;
    return { ...r, qty, name: p.name, unitPrice: p.price, radPrice: p.price * qty };
  });
  const summa = rader.reduce((s, r) => s + r.radPrice, 0);
  const franPris = def.round === false ? summa : Math.floor(summa / 100) * 100;
  return { ...def, rader, summa, franPris };
}

export function buildPaket3(defs: PaketDef[]): Paket[] {
  return defs.map(buildPaket);
}

// Svensk talformatering utan U+00A0 (PDFKit/visuell konsekvens)
export function fmtKr(n: number): string {
  return n.toLocaleString('sv-SE').replace(/\u00A0/g, ' ');
}
