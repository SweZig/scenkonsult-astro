// Huvudmenyn — en källa för både datorns megameny och mobilens dragspel.
// Ändra här, aldrig i Layout.astro. Ordningen följer efterfrågan.
//
// Regel: gruppnamnet länkar till hubbsidan, men allt viktigt på en hubbsida
// ska också ha en egen rad. Ljud och Ljus täcks av sina undersidor; Scen, DJ
// och Karaoke säljer på själva hubbsidan och har därför egna rader dit.

export interface MenyLank {
  namn: string;
  href: string;
  /** Huvudingång i gruppen — lyfts fram något */
  framhavd?: boolean;
  /** Visar en "Nytt"-etikett */
  nytt?: boolean;
}

export interface MenyGrupp {
  namn: string;
  href: string;
  lankar: MenyLank[];
}

export interface MenyPanelRad {
  namn: string;
  href: string;
  beskrivning?: string;
}

/** Tjänster: fyra kolumner med grupper (dator), samma ordning uppifrån och ner (mobil) */
export const TJANSTER_KOLUMNER: MenyGrupp[][] = [
  [
    {
      namn: 'Ljud', href: '/vara-tjanster/hyra-ljud/', lankar: [
        { namn: 'Portabelt ljud', href: '/vara-tjanster/hyra-ljud/portable/' },
        { namn: 'Kolumn', href: '/vara-tjanster/hyra-ljud/kolumnhogtalare/' },
        { namn: 'Event & konferens', href: '/vara-tjanster/hyra-ljud/event/' },
        { namn: 'Musik & dans', href: '/vara-tjanster/hyra-ljud/music/' },
        { namn: 'Live & konsert', href: '/vara-tjanster/hyra-ljud/live/' },
        { namn: 'Ljudtekniker', href: '/vara-tjanster/hyra-ljudtekniker/' },
      ],
    },
  ],
  [
    {
      namn: 'Ljus', href: '/vara-tjanster/hyra-ljus/', lankar: [
        { namn: 'Färdiga paket', href: '/vara-tjanster/hyra-ljus/fardiga-paket/' },
        { namn: 'Ljuseffekter', href: '/vara-tjanster/hyra-ljus/ljuseffekter/' },
        { namn: 'Rök & pyro', href: '/vara-tjanster/hyra-ljus/rok-pyro/' },
        { namn: 'Stativ & tross', href: '/vara-tjanster/hyra-ljus/stativ-tross/' },
      ],
    },
    {
      namn: 'Ljud & ljus', href: '/vara-tjanster/hyra-ljud-och-ljus/', lankar: [
        { namn: 'Bygg ert paket', href: '/vara-tjanster/hyra-ljud-och-ljus/#bygg' },
      ],
    },
  ],
  [
    {
      namn: 'Scen', href: '/vara-tjanster/hyra-scen/', lankar: [
        { namn: 'Scenpodier – bygg din scen', href: '/vara-tjanster/hyra-scen/#scen-konfigurator', framhavd: true },
        { namn: 'Färdiga scenpaket', href: '/vara-tjanster/hyra-scen/#scenpaket' },
        { namn: 'Scenkjol & tillbehör', href: '/vara-tjanster/hyra-scen/#scenkjol' },
        { namn: 'Pipe & Drape', href: '/vara-tjanster/hyra-scen/pipe-drape/' },
      ],
    },
    {
      namn: 'Bild', href: '/vara-tjanster/hyra-bild/', lankar: [
        { namn: 'Projektor & skärm', href: '/vara-tjanster/hyra-bild-projektorer-skarmar/' },
        { namn: 'LED-vägg', href: '/vara-tjanster/hyra-bild-led-vagg/', nytt: true },
      ],
    },
  ],
  [
    {
      namn: 'DJ', href: '/vara-tjanster/hyra-dj/', lankar: [
        { namn: 'Boka DJ', href: '/vara-tjanster/hyra-dj/' },
        { namn: 'DJ-utrustning', href: '/vara-tjanster/hyra-dj-utrustning/' },
      ],
    },
    {
      namn: 'Karaoke', href: '/vara-tjanster/hyra-karaoke/', lankar: [
        { namn: 'Karaokepaket', href: '/vara-tjanster/hyra-karaoke/' },
        { namn: 'Bygg din karaoke', href: '/vara-tjanster/hyra-karaoke/#bygg' },
      ],
    },
  ],
];

/** Tonade rutan till höger i Tjänster (dator); sist i dragspelet (mobil) */
export const TJANSTER_PANEL: MenyPanelRad[] = [
  { namn: 'Komplett event', href: '/vara-tjanster/', beskrivning: 'Scen, ljud, ljus och bild i ett paket' },
  { namn: 'Fast installation', href: '/vara-tjanster/projektering-och-installation/', beskrivning: 'Projektering & installation' },
];

/** Event: tillfällen — egen meny, eftersom kunden tänker i tillfälle, inte i utrustning */
export const EVENT_LANKAR: MenyLank[] = [
  { namn: 'Bröllop', href: '/for/brollop/' },
  { namn: 'Företagsfest & kickoff', href: '/for/foretagsfest/' },
  { namn: 'Konferens & föreläsning', href: '/for/konferens/' },
  { namn: 'Festival & utomhus', href: '/for/festival/' },
  { namn: 'Studentflak', href: '/for/studentflak/' },
];

/** Kunskap */
export const KUNSKAP_FRAMHAVD = {
  namn: 'Svens Kunskapsskola',
  href: '/svens-kunskapsskola/',
  beskrivning: 'Videoguider om AV-teknik — lär dig av Sven innan du bokar',
};
export const KUNSKAP_GRUPPER: { namn: string; lankar: MenyLank[] }[] = [
  {
    namn: 'Dimensionera rätt', lankar: [
      { namn: 'Hur stor PA-anläggning?', href: '/for/guider/hur-stor-pa/' },
      { namn: 'Hur stor scen behöver du?', href: '/for/guider/hur-stor-scen/' },
      { namn: 'Ljussättningstips', href: '/for/guider/ljussattning-tips/' },
    ],
  },
  {
    namn: 'Planera eventet', lankar: [
      { namn: 'Checklista för event', href: '/for/guider/checklista-event/' },
      { namn: 'Vad kostar uthyrning?', href: '/for/guider/vad-kostar-det/' },
      { namn: 'Hyra scen — pris', href: '/for/guider/hyra-scen-pris/' },
    ],
  },
  {
    namn: 'Bröllop & fördjupning', lankar: [
      { namn: 'DJ till bröllop — pris', href: '/for/guider/dj-brollop-pris/' },
      { namn: 'Ljud till bröllop', href: '/for/guider/ljud-brollop/' },
    ],
  },
];
export const KUNSKAP_ALLA = { namn: 'Alla guider', href: '/for/guider/' };

export const OFFERT_HREF = '/bokningssida/';
