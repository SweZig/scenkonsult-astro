DOC3 = dict(
    doc_no=3,
    slug="Sidor_Navigation",
    title="Sidor & Navigation",
    subtitle="Nav-struktur, sidträd, nav-offset, referenssida, bokningsflöde",
    version="v16.0",
    date="2026-09-21",
    blocks=[
        ("h1", "1. Navigationsstruktur"),
        ("h2", "1.1 Top-level nav"),
        ("note", "Top-level nav = **Tjänster** (dropdown) + **Kontakta oss**. "
                 "Det finns INGET \"Kunskap\"-element i nav."),
        ("p", "Desktop-ordning: Logo → Tjänster → Kontakta oss → `margin-left:auto` → Telefon → "
              "Varukorg. Nav-höjd 130 px (100 px mobil), `--nav-offset: 166px`."),

        ("h2", "1.2 Dropdown \"Tjänster\""),
        ("p", "Hover-aktiverad 3-kolumns panel, `min-width:720px`, glassmorphism "
              "`rgba(15,12,40,0.98)`, lavendel-rubriker, 2,5 s stängningsfördröjning. "
              "Kategoriordning: **Scen · Ljud · Bild · Ljus · DJ**. Bild som hub + sub-länkar."),

        ("h2", "1.3 Mobil"),
        ("p", "Hamburger-meny med accordion för underkategorier. Varukorg-ikon till vänster om "
              "hamburger."),

        ("h1", "2. Sidträd"),
        ("note", "**Sidräkning (rättad 2026-09-21): 82 `.astro`-filer i `src/pages/` som bygger 107 "
                 "sidor.** 81 statiska filer plus `hyra-ljud-scen-[ort].astro`, som genererar 26 "
                 "ortssidor via `getStaticPaths`. Tidigare versioner angav 44 respektive ~79 — båda för "
                 "låga."),
        ("note", "**Sidlistan nedan är en inventarielista och blir inaktuell inom en månad.** Den bör "
                 "genereras ur `src/pages/` i stället för att handskrivas — se Dok 6 §9.2. "
                 "Läs den som en karta över strukturen, inte som facit på vilka filer som finns."),

        ("h2", "2.1 Tjänster"),
        ("table", [
            ["Sida", "URL"],
            ["Alla tjänster", "/vara-tjanster/"],
            ["Hyra scen", "/vara-tjanster/hyra-scen/ (+ /pipe-drape/)"],
            ["Hyra ljud (hub)", "/vara-tjanster/hyra-ljud/"],
            ["— Portable / Event / Music / Live", "/vara-tjanster/hyra-ljud/{portable,event,music,live}/"],
            ["— PA-anläggning / Kolumnhögtalare", "/vara-tjanster/hyra-ljud/{pa-anlaggning,kolumnhogtalare}/"],
            ["Hyra bild (hub)", "/vara-tjanster/hyra-bild/"],
            ["— Projektor & skärm / LED-vägg", "/vara-tjanster/{hyra-bild-projektorer-skarmar,hyra-bild-led-vagg}/"],
            ["Hyra ljus (hub) + undersidor", "/vara-tjanster/hyra-ljus/ (fardiga-paket, ljuseffekter, rok-pyro, stativ-tross, moving-heads)"],
            ["Hyra DJ / DJ-utrustning", "/vara-tjanster/{hyra-dj,hyra-dj-utrustning}/"],
            ["Karaoke / Ljudtekniker / Konferens-AV / Tillbehör", "/vara-tjanster/{hyra-karaoke,hyra-ljudtekniker,konferens-av,tillbehor}/"],
        ]),
        ("note", "**Bild-par:** /hyra-bild/ = SEO-hub (bred intent), /hyra-bild-projektorer-skarmar/ = "
                 "den \"riktiga\" produktsidan (long-tail). **DJ-par:** /hyra-dj/ = boka DJ (tjänst), "
                 "/hyra-dj-utrustning/ = hyra hårdvara — separerade på intent, ingen kannibalisering."),

        ("h2", "2.2 Färdiga ljuspaket — omstrukturerad 2026-09-20"),
        ("p", "`/vara-tjanster/hyra-ljus/fardiga-paket/` drivs sedan 2026-09-20 av `paketLayout` i "
              "`ljus.json` (Dok 2 §6.1) i stället för av produktarrayens ordning. Sidan renderar "
              "**tio kort i stället för tolv fristående** — fyra av dem är `PaketVariantCard` med "
              "knappväljare där flera artikelnummer delar ett kort:"),
        ("table", [
            ["Kort", "Varianter"],
            ["Ljuspaket, Small", "PAK-0018 · PAK-0019 (Duo)"],
            ["Ljuspaket, Small+", "PAK-0020 · PAK-0021 (Duo)"],
            ["Ljuspaket, Medium", "PAK-0001 · PAK-0022 (Duo)"],
            ["Ljuspaket, Medium+", "PAK-0002 · PAK-0023 (Duo) · PAK-0024 (Duo DMX)"],
            ["Ljuspaket, Medium++", "PAK-0025 (utan väljare)"],
        ]),
        ("p", "Hero-texten säger **\"Från 199 kr\"** (var 399). Pensionerade paket "
              "(`active: false`) filtreras bort i mallen och renderas aldrig."),

        ("h2", "2.3 För ditt event"),
        ("p", "Hub `/for/` + Bröllop, Företagsfest & kickoff, Konferens & föreläsning, "
              "Festival & utomhus, Studentflak."),

        ("h2", "2.4 Guider"),
        ("p", "Guide-hub `/for/guider/` + ~24 guider (hur-stor-pa, hur-stor-scen, dj-eller-liveband, "
              "ljussattning-tips, checklista-event, ljud-utomhus, vad-kostar-det, "
              "varfor-numark-denon-rane, hyra-scen-pris, hyra-pa-system, hyra-projektor-pris, "
              "hyra-rokmaskin, hyra-tradlos-mikrofon, hyra-uplights, dmx-styrning-guide, "
              "rokvatska-guide, sdi-hdmi-fiber-guide, ljud-brollop, ljud-foretagsfest, ljus-brollop, "
              "dj-brollop-pris, konferens-av-checklista, studentflak-checklista, "
              "led-vagg-kalkylator [301-redirect])."),
        ("note", "**Guide- och eventsidor slår upp produkter på `artno`, aldrig på index.** Sju sidor "
                 "(for/brollop, for/foretagsfest, ljud-brollop, ljud-foretagsfest, ljus-brollop, "
                 "ljussattning-tips, vad-kostar-det) pekade på fel produkt efter ljuspaket-"
                 "omstruktureringen eftersom de använde `products[0]`. Rättat 2026-09-20 — se Dok 6 §2.6."),

        ("h2", "2.5 Övrigt"),
        ("p", "Frontpage `/`, Varukorg, Bokningssida, Om oss, Kontakt, FAQ, Eventlokal-guide, "
              "Festguide, Hyresvillkor (hub + privatperson/foretag), Personuppgiftpolicy, Feedback, "
              "Referenser, Kundorder `/order/`, `/sign/`, `/tack/`, `/svens-kunskapsskola/`."),

        ("h2", "2.6 Admin (/admin/)"),
        ("table", [
            ["Underflik", "URL"],
            ["Kanban / order", "/admin/"],
            ["Produkter", "/admin/produkter/"],
            ["Referenskunder", "/admin/referenser/ (Ort-dropdown + Utvald-kryssruta)"],
            ["Recensioner", "/admin/recensioner/"],
            ["Bulletin", "/admin/bulletin/"],
            ["Statistik", "/admin/stats/ (+ /stats/forsaljning/)"],
            ["Sven-analytics", "/admin/sven/"],
        ]),
        ("p", "Innehålls-flikarna (Referenskunder, Recensioner, Bulletin) samlas under en "
              "\"Innehåll\"-dropdown i admin-topbaren. Datamodell i Dok 5."),

        ("h2", "2.7 Lokala SEO-sidor (genererade) — 26 orter"),
        ("p", "`/hyra-ljud-scen-[ort]/` genereras från `orter.json` via `getStaticPaths`. "
              "**26 orter** (Sollentuna tillagd efter v15.1):"),
        ("table", [
            ["Grupp", "Orter"],
            ["Kommuner (15)", "Solna, Nacka, Järfälla, Täby, Huddinge, Sundbyberg, Tyresö, Lidingö, "
                              "Värmdö, Ekerö, Danderyd, Sigtuna, Botkyrka, Haninge, Sollentuna"],
            ["Stockholms stadsdelar (11)", "Vällingby (hemmaplan), Hässelby, Bromma, Kista, Skärholmen, "
                                           "Kungsholmen, Vasastan, Södermalm, Enskede, Farsta, Skarpnäck"],
        ]),
        ("note", "**Ortssidornas uppbyggnad:** unikt lokalt innehåll per ort (utbyggd `areaDesc` "
                 "~80–100 ord, `localVenues`, `venuesIntro`, ort-specifik FAQ). **Intern länkning** — "
                 "upplänkade från kontaktsidan + korslänkning till 6 närmaste grannorter (fixar tidigare "
                 "föräldralös-status → GSC-indexering). **Kundkoppling** — kunder taggade med ort i "
                 "/admin/referenser/ visas under \"Kunder vi levererat till i [ort]\". Stockholm "
                 "medvetet utelämnad (kannibaliserar startsidans huvudterm). Scen-produktkortet använder "
                 "`DynamicPaketCard`."),

        ("h1", "3. Nav-offset per sida"),
        ("p", "Sidor utan `CategoryHero`/`ModernHero` måste sätta nav-offset manuellt (Dok 1 §4.2): "
              "`style=\"padding-top:calc(var(--nav-offset,166px) + 2.5rem)\"`. "
              "Har nav-offset manuellt: bokningssida, vara-tjanster/index, kontakt, om-oss, feedback, "
              "hyresvillkor (+ privatperson/foretag), personuppgiftpolicy, FAQ, eventlokal-guide, "
              "festguide, guider. Klarar sig utan (egen hero): for/index, for/guider/index, frontpage."),

        ("h1", "4. Referenssida"),
        ("note", "Korrekt sökväg är `/referenser/` (svensk stavning), inte `/referencer/`."),
        ("p", "Trust-stats: 100+ privatpersoner, 500+ uppdrag/år, 50+ referenskunder, grundat 1986, "
              "100 % nöjd-garanti."),

        ("h2", "4.1 Logobanner — 8 separata logotyper"),
        ("p", "Bannern var tidigare **en enda sammansatt rasterbild** (`public/images/logos.webp`, "
              "1600×343) med ramarna inbrända i pixlarna. Den delades upp 2026-09-18; filen är raderad "
              "ur repot. Nu: **en transparent WebP per kund** i `public/images/kunder/`, renderad ur "
              "`clientLogos`-arrayen i `referenser/index.astro` i ett CSS-grid (2 kolumner mobil / "
              "4 desktop). Ramen ritas i CSS, inte i bilden."),
        ("table", [
            ["Fil", "Kund"],
            ["logo_ica.webp", "ICA Sverige"],
            ["logo_hornbach.webp", "Hornbach"],
            ["logo_abg.webp", "ABG Sundal Collier"],
            ["logo_houdini.webp", "Houdini"],
            ["logo_mdu.webp", "Mälardalens universitet"],
            ["logo_hacksaw.webp", "Hacksaw Studios"],
            ["logo_hardrock.webp", "Hard Rock Café (ersatte Odd Fellow 2026-09-18)"],
            ["logo_uf.webp", "UF Företagande"],
        ]),
        ("note", "**Bannern är ett kurerat urval, inte kundlistan.** Odd Fellow ligger kvar som kund i "
                 "Supabase-tabellen `clients` trots att logotypen togs ur bannern. En kund kan finnas i "
                 "listan utan logotyp, och tvärtom. Bildkonventionen står i Dok 1 §3.3."),

        ("h2", "4.2 Eventgalleri — 13 kort"),
        ("p", "13 kort / 18 WebP-filer i `public/images/event/`. Grid 2 / 3 / 4 kolumner, kort i "
              "`aspect-ratio:3/4` med `object-cover`."),
        ("ul", [
            "**Taggar:** Festival · Företagsevent · Konferens · **Installation**",
            "**5 kort är crossfade-kort** — två bilder som växlar var 5:e sekund via fälten `src2`/`alt2`. Mönstret beskrivs i Dok 1 §4.7.",
            "Crossfade-korten: Festival – Vinterviken · Skridskodisco – Östermalms IP · Strawberry Arena – UF · ABG Sundal Collier – Konferens · German Beerhall.",
        ]),
        ("note", "**Liggande foton beskärs vid konverteringen, inte av `object-cover`.** Ett 4:3-foto i "
                 "en 3:4-ruta tappar 44 % av bredden på en centrerad crop. Välj horisontellt centrum "
                 "(och vid behov beskuren höjd) och spara 1050×1400 WebP. Se Dok 6 §8."),

        ("h2", "4.3 Kunddata och recensioner"),
        ("note", "Kundlistan hämtas från Supabase-tabellen `clients` (via `clients.json` + live "
                 "clients-list). Utvalda kunder styrs av `featured`-flaggan; kunder kan taggas med ort "
                 "för ortssidorna (Dok 5). Google Reviews renderas server-side från Supabase-tabellen "
                 "`reviews` (alla recensioner, inte längre max 5)."),

        ("h1", "5. Bokningsflöde (kund)"),
        ("p", "\"Begär offert\" → `/bokningssida/`. Produkter läggs i varukorg → skickas via "
              "\"Maila offertförfrågan\" (`intent=offert`) eller \"Boka detta nu\" (`intent=boka`). "
              "Ingen betaltjänst (avsiktligt). Detaljer om order/admin i Dok 5."),

        ("h1", "6. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v16.0", "2026-09-21",
             "§2 sidräkningen rättad till 82 filer / 107 sidor (var ~79) + not om att sidlistan bör "
             "genereras. Ny §2.2 Färdiga ljuspaket — paketLayout-driven, 10 kort varav 4 med "
             "variantväljare, hero \"Från 199 kr\". §2.4 not om artno-uppslag i guider. §2.7 orter "
             "25 → 26 (Sollentuna). Avsnitten efter §2.2 omnumrerade."],
            ["v15.1", "2026-09-18",
             "§4 Referenssida omarbetad och uppdelad i §4.1–4.3. Logobannern uppdelad i 8 transparenta "
             "WebP med CSS-ram; Odd Fellow ersatt av Hard Rock Café. Eventgalleriet 8 → 13 kort, ny "
             "tagg Installation, 5 crossfade-kort."],
            ["v15.0", "2026-07-25",
             "§2.6 lokala SEO-sidor: 25 orter (13 nya) + berikat lokalt innehåll, intern länkning, "
             "kundkoppling via ort-tagg. §2.1 bild/DJ-par bekräftade. §2.5 admin Ort/Utvald-fält."],
            ["v14.0", "2026-07-22", "Ny §2.6 Admin-underflikar + lokala SEO-sidor. Hyresvillkor privatperson/företag."],
            ["v13.0", "2026-06-22", "Full restrukturering. Nav-struktur, sidantal, referenssökväg /referenser/."],
        ]),
    ],
)
