# Karantän 2026-07-25

Filerna här är **flyttade ut ur `public/`** och deployas därför inte längre till
Netlify — men de ligger kvar i git och kan återställas när som helst.

Syftet är att kunna gå igenom sajten sida för sida och bekräfta att inget saknas
innan de raderas på riktigt.

## Vad ligger här

**46 bildfiler (2,0 MB)** som inte refereras från någon `.astro`-sida, någon
`src/data/*.json`, någon Netlify-funktion eller något build-script.

Urvalet gjordes genom att söka efter varje filnamn i hela `src/`, `netlify/` och
`scripts/`. Sajten byggdes rent (107 sidor) efter flytten, och `dist/` innehåller
inga referenser till någon av filerna.

Grupper:

- `images/kunder/` (20 st) — kundlogotyper. Logobannern på `/referenser/`
  ersattes av en textbaserad marquee ("Anlitade av"), så logotyperna används
  inte längre. **Kontrollera `/referenser/` och `/om-oss/` extra noga.**
- `images/ljud/` (19 st) — mest dubbletter och varianter från
  Live↔Music-konsolideringen: tre nästan identiska `*_concert.webp`,
  `pp_ljud_music_linearray1/2` (produkterna använder
  `pp_ljud_live_linearray_*`), samt gamla `_1stav`/`_2stav`-varianter av
  portable medium.
- `images/ljus/` (3 st), `images/bild/` (3 st) — enstaka gamla produktbilder.
- `pp_ljud_music_concert.png.webp` — dubbel filändelse, skräp från
  WebP-konverteringen.

## Även i karantän (men inte här)

29 sökvägar i `src/components/InlineEditor.astro` pekade på `.png`-filer som
inte finns kvar i repot alls. De gick inte att flytta hit — filerna är redan
borta. De är i stället **utkommenterade** i ett `KARANTÄN 2026-07-25`-block i
slutet av `IMAGE_LIBRARY`. Effekten är att bildväljaren i adminläget slutar visa
trasiga miniatyrer.

## Återställa

Enskild fil:

```bash
mkdir -p public/images/kunder
git mv _karantan/2026-07-25/images/kunder/logo_ica.webp public/images/kunder/
```

Allt på en gång:

```bash
cp -r _karantan/2026-07-25/images/* public/images/
git rm -r _karantan/2026-07-25
```

## Radera på riktigt

När alla sidor är kontrollerade:

```bash
git rm -r _karantan/2026-07-25
```

Filerna finns kvar i git-historiken även efter det.
