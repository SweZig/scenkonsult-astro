// src/data/konferensPaket.ts — konferenspaketen. EN källa för
// /vara-tjanster/konferens-av/ och /for/konferens/.
//
// Raderna anger bara artikelnummer och etikett; namn och pris slås upp i
// datafilerna av utils/paket.ts. Storleken på varje paket följer datan:
// kolumnhögtalarnas `persons` och skärmarnas rekommenderade publik.
// Tekniker och dator är tillval (se TILLVAL), inte en del av paketpriset.
import type { PaketDef } from '../utils/paket';

export const KONFERENS_PAKET: PaketDef[] = [
  {
    namn: 'Liten konferens',
    gaster: 'Upp till 40 deltagare',
    beskrivning: 'Föreläsning, seminarium eller frukostmöte i ett mindre rum.',
    rader: [
      { artno: 'SK-LJD-POR-0003', label: 'Kolumnhögtalare Portable Medium' },
      { artno: 'SK-LJD-MIK-0022', label: 'Shure SLXD myggmikrofon' },
      { artno: 'SK-BLD-0002', label: 'Projektor Full HD' },
      { artno: 'SK-BLD-ACC-0002', label: 'Projektorduk 100″' },
      { artno: 'SK-BLD-ACC-0009', label: 'USB-clicker' },
    ],
  },
  {
    namn: 'Medelstor konferens',
    gaster: '40–100 deltagare',
    beskrivning: 'Två talare, stor duk och scenmonitor så att talaren ser bilden utan att vända sig om.',
    featured: true,
    rader: [
      { artno: 'SK-LJD-POR-0004', label: 'Kolumnhögtalare Portable Medium+' },
      { artno: 'SK-LJD-MIK-0023', label: 'Shure SLXD headset', qty: 2 },
      { artno: 'SK-BLD-0002', label: 'Projektor Full HD' },
      { artno: 'SK-BLD-0010', label: 'Projektorduk 166″ i ram' },
      { artno: 'SK-BLD-ACC-0031', label: 'Scenmonitor 27″' },
      { artno: 'SK-BLD-ACC-0004', label: 'HDMI-kabel 5 m' },
    ],
  },
  {
    namn: 'Stor konferens',
    gaster: '100–200 deltagare',
    beskrivning: 'Kickoff eller kongress: två kolumner, 200″ duk och clicker med 75 m räckvidd.',
    rader: [
      { artno: 'SK-LJD-POR-0011', label: 'Kolumnhögtalare Portable Large Duo' },
      { artno: 'SK-LJD-MIK-0028', label: 'Shure SLXD, 2 headset' },
      { artno: 'SK-BLD-0007', label: 'Projektor 4K UHD' },
      { artno: 'SK-BLD-0016', label: 'Projektorduk 200″ i ram' },
      { artno: 'SK-BLD-ACC-0031', label: 'Scenmonitor 27″' },
      { artno: 'SK-BLD-ACC-0012', label: 'USB-clicker, lång räckvidd' },
    ],
  },
];

/** Tillval som visas under paketen — inte en del av paketpriset. */
export const KONFERENS_TILLVAL = ['SK-TJN-0002', 'SK-BLD-ACC-0033', 'SK-BLD-ACC-0030'];
