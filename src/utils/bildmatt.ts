/**
 * Bredd och höjd för en WebP-bild i public/ — läses ur filhuvudet vid bygget,
 * så att sidor kan sätta width/height (ingen layoutförskjutning) utan att
 * måtten skrivs in för hand i datan.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const cache = new Map<string, { w: number; h: number } | null>();

export function bildmatt(src: string): { w: number; h: number } | null {
  if (cache.has(src)) return cache.get(src)!;
  const fil = join(process.cwd(), 'public', src);
  let svar: { w: number; h: number } | null = null;
  if (existsSync(fil)) {
    const b = readFileSync(fil);
    const typ = b.toString('ascii', 12, 16);
    if (typ === 'VP8X') svar = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    else if (typ === 'VP8 ') svar = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    else if (typ === 'VP8L') {
      const v = b.readUInt32LE(21);
      svar = { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 };
    }
  }
  cache.set(src, svar);
  return svar;
}

/** srcset med 640w-varianten när den finns. */
export function bildSrcset(src: string): string | undefined {
  const m = bildmatt(src);
  const liten = src.replace(/\.webp$/, '-640w.webp');
  if (!m || !existsSync(join(process.cwd(), 'public', liten))) return undefined;
  return `${liten} 640w, ${src} ${m.w}w`;
}
