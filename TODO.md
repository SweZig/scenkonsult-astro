# TODO & Ändringslogg

## Ändringslogg

### 2026-03-13
- **Varumärken korrigerade** på ortsidor (`hyra-ljud-scen-[ort].astro`):
  - **Ljud:** Alto, Allen & Heath, LD Systems, Shure, Denon
  - **Ljus:** ADJ, Cameo, Stairville, Global Truss
  - **Bild:** Samsung Professionell, BenQ, Toshiba
  - Borttagna felaktiga märken: RCF, Chauvet, Yamaha, Pioneer
- **Öppettider** rättade på 4 sidor — nu konsekvent: mån–fre 09:00–17:00, jour vid pågående uthyrning
- **Ortsidor** (12 st) skapade: `/hyra-ljud-scen-[ort]/` via `orter.json` + Astro-template
- **Schema `priceValidUntil`** tillagd på `ProductCard.astro`, `hyra-ljud/index.astro`, `hyra-ljus/index.astro`

---

## Backlog

- [ ] Radera `src/components/MomsToggle.astro` — obsolet
- [ ] Standardisera FAQ-nycklar: `ljus.json` använder `question`/`answer`, övriga `q`/`a`
- [ ] DNS cutover → uppdatera `LOGO_URL` i Netlify-funktioner
- [ ] Mobilvy-genomgång 390px
- [ ] Submit sitemap i GSC (`scenkonsult.se/sitemap-index.xml`)
- [ ] Fas 2 SEO: förbättra eventsidor (bröllop, företagsfest, konferens, festival, studentflak)
- [ ] Publicera nya guider (se SEO-strategi-dokument)
- [ ] Avbokningspolicy synlig i bokningsflödet
- [ ] Kontrollera att varumärken stämmer på övriga sidor (ljud, ljus, bild-produktsidor)
