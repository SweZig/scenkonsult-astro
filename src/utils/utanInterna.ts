// Tar bort interna fält (nycklar som börjar med "_") innan data skickas till
// webbläsaren: inköpspriser, priskällor och interna anteckningar ska aldrig
// hamna i publik HTML eller JS. Används på data som serialiseras med
// define:vars eller på annat sätt skickas till klienten.
export function utanInterna<T>(v: T): T {
  if (Array.isArray(v)) return v.map(utanInterna) as unknown as T;
  if (v && typeof v === 'object') {
    const ut: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (!k.startsWith('_')) ut[k] = utanInterna(x);
    }
    return ut as T;
  }
  return v;
}
