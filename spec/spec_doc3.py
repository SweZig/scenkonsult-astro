DOC3 = dict(
    doc_no=3,
    slug="Sidor_Navigation",
    title="Sidor & Navigation",
    subtitle="Nav-struktur, sidträd, nav-offset, referenssida, bokningsflöde, SEO- och AI-filer",
    version="v18.6",
    date="2026-10-18",
    blocks=[
        ("h1", "1. Navigationsstruktur"),
        ("h2", "1.1 Top-level nav"),
        ("note", "Top-level nav = **Tjänster** (dropdown) + **Kunskap** (dropdown) + **Kontakta oss**. "
                 "Kunskap lades till i efterhand och specen rättades 2026-10-18: Svens Kunskapsskola och "
                 "guiderna under /for/guider/."),
        ("p", "Desktop-ordning: Logo → Tjänster → Kunskap → Kontakta oss → `margin-left:auto` → Telefon → "
              "Varukorg. Nav-höjd 130 px (100 px mobil), `--nav-offset: 166px`."),

        ("h2", "1.2 Dropdown \"Tjänster\""),
        ("p", "Hover-aktiverad 3-kolumns panel, `min-width:720px`, glassmorphism "
              "`rgba(15,12,40,0.98)`, lavendel-rubriker, 2,5 s stängningsfördröjning. "
              "Kategoriordning: **Scen · Ljud · Bild · Ljus · DJ · Karaoke**. Bild som hub + sub-länkar. "
              "**Karaoke har egen rubrik sedan 2026-10-05** (låg tidigare under \"DJ & Karaoke\"): "
              "hub \"Hyra karaoke\" + \"Bygg din karaoke\" (`#bygg`). Mobilmenyn har samma två länkar. "
              "**Ljud-kolumnen har sedan 2026-10-12** \"✨ Hyra ljud och ljus\" + \"Bygg ert paket\" "
              "(`/vara-tjanster/hyra-ljud-och-ljus/#bygg`); länken finns också i mobilmenyn och sidfoten."),

        ("h2", "1.3 Mobil"),
        ("p", "Hamburger-meny med accordion för underkategorier. Varukorg-ikon till vänster om "
              "hamburger."),

        ("h2", "1.4 Sidfot (uppdaterad 2026-10-02)"),
        ("p", "Nedersta raden: `© {årtal} Scenkonsult Norden` — årtalet räknas fram vid bygget — "
              "och länkarna Integritetspolicy · **Cookie-inställningar** (öppnar cookiebannern igen, "
              "Dok 1 §9.1) · Hyresvillkor · **In English** (`/en/`)."),

        ("h1", "2. Sidträd"),
        ("note", "**Sidräkning (2026-10-17): 86 `.astro`-filer i `src/pages/` som bygger 111 "
                 "sidor.** 85 statiska filer plus `hyra-ljud-scen-[ort].astro`, som genererar 26 "
                 "ortssidor via `getStaticPaths`. Nya sedan v17: `/vara-tjanster/hyra-ljud-och-ljus/`, "
                 "`/admin/topplistor/`, `/admin/referenscase/`."),
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
            ["— Kolumnhögtalare", "/vara-tjanster/hyra-ljud/kolumnhogtalare/"],
            ["Hyra bild (hub)", "/vara-tjanster/hyra-bild/"],
            ["— Projektor & skärm / LED-vägg", "/vara-tjanster/{hyra-bild-projektorer-skarmar,hyra-bild-led-vagg}/"],
            ["Hyra ljus (hub) + undersidor", "/vara-tjanster/hyra-ljus/ (fardiga-paket, ljuseffekter, rok-pyro, stativ-tross, moving-heads)"],
            ["Hyra ljud och ljus (konfigurator)", "/vara-tjanster/hyra-ljud-och-ljus/ — NY 2026-10-12, Dok 2 §11"],
            ["Hyra DJ / DJ-utrustning", "/vara-tjanster/{hyra-dj,hyra-dj-utrustning}/"],
            ["Karaoke / Ljudtekniker / Konferens-AV / Tillbehör", "/vara-tjanster/{hyra-karaoke,hyra-ljudtekniker,konferens-av,tillbehor}/"],
        ]),
        ("note", "**Bild-par:** /hyra-bild/ = SEO-hub (bred intent), /hyra-bild-projektorer-skarmar/ = "
                 "den \"riktiga\" produktsidan (long-tail). **DJ-par:** /hyra-dj/ = boka DJ (tjänst), "
                 "/hyra-dj-utrustning/ = hyra hårdvara — separerade på intent, ingen kannibalisering."),
        ("note", "**Ljud-paret (2026-10-02, titeln justerad 2026-10-12):** /hyra-ljud/ äger \"hyra ljud\", "
                 "\"hyra högtalare\" och \"ljudanläggning\" (titel **\"Hyra Ljud Stockholm — Högtalare & "
                 "Ljudanläggning\"**, H1 \"Hyra högtalare & ljud i Stockholm\", ingress ur "
                 "`ljud.json → intro`). /hyra-ljud/event/ har inte längre \"Ljudanläggning\" i titeln så "
                 "att den slutar konkurrera; H1 lämnades orörd. Inga URL:er ändrades. "
                 "Metabeskrivningens lägsta pris räknas ur datan (`{fran}` i `ljud.json → metaDescription`)."),
        ("note", "**Undersidornas titlar efter kundens sökord (2026-10-02):** music → \"ljud till fest & "
                 "dans\", live → \"konsert, liveband & trubadur\", portable → studentflak/studentfest. "
                 "GSC visade att \"fest\" saknades i alla ljudtitlar medan \"ljudanläggning fest\" och "
                 "\"ljud för band\" låg på position 20–45 utan klick. Event lämnades orörd — den rankar. "
                 "\"Högtalare\" hålls utanför undersidornas titlar så att hubben behåller termen. "
                 "Hubbarna får länktexten \"Hyra ljud/ljus i Stockholm\" från ortssidor, /for/brollop/ "
                 "och guider (2026-10-12)."),
        ("note", "**Karaokesidan (2026-10-05)** är byggd kring `KaraokeBuilder.astro` (Dok 2 §10): scen med "
                 "bildlager, snabbval, \"Hjälp mig välja\" och flikar. Mobil är primär layout (≈60 % av "
                 "besökarna): horisontella rader för snabbval, flikar och alternativ, fast nederkant med "
                 "summa och varukorgsknapp (momstogglen döljs och Sven lyfts medan den syns), lista i "
                 "bottenblad. Desktop: sammanfattning i sticky kolumn och klickbara markörer i scenen. "
                 "Paketkorten och tillbehörssektionen är borttagna; Singa-blocket och FAQ ligger kvar."),
        ("p", "Projektor- och skärmsidan har sedan 2026-09-23 samma \"Glöm inte tillbehören\"-banner "
              "som scensidan, under LED-skärmarna; den leder till projektordukarna (`#projektorduk`)."),

        ("h2", "2.2 Färdiga ljuspaket — omstrukturerad 2026-09-20"),
        ("p", "`/vara-tjanster/hyra-ljus/fardiga-paket/` drivs sedan 2026-09-20 av `paketLayout` i "
              "`ljus.json` (Dok 2 §6.1) i stället för av produktarrayens ordning. `paketLayout` har "
              "**tio platser** — fyra `PaketVariantCard` med knappväljare där flera artikelnummer delar "
              "ett kort, och sex enkla kort (Medium++ och Large–XL+, PAK-0025 och 0007–0011). "
              "Därefter en egen sektion för gruppen `scenpaket`: Scenpaket I, Scenpaket II och "
              "Följespot (PAK-0016/0017/0026). Variantkorten:"),
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
        ("p", "**Titlar 2026-10-02:** sex guidetitlar hade \"2025\" och bytte till 2026. "
              "`hyra-pa-system` heter nu \"Hyra Högtalare & PA-system Stockholm — Priser 2026\" med H1 "
              "\"… priser per gästantal\" (samma URL). Prisguidens etikett säger \"Prisguide 2026\"."),
        ("note", "**Guide- och eventsidor slår upp produkter på `artno`, aldrig på index.** Sju sidor "
                 "(for/brollop, for/foretagsfest, ljud-brollop, ljud-foretagsfest, ljus-brollop, "
                 "ljussattning-tips, vad-kostar-det) pekade på fel produkt efter ljuspaket-"
                 "omstruktureringen eftersom de använde `products[0]`. Rättat 2026-09-20 — se Dok 6 §2.6."),
        ("p", "**Guidegenomgång 2026-10-13:** länk till Hyra ljud och ljus i åtta guider; elrådet i "
              "checklista-event (även FAQ-schemat) — *ett vanligt 10 A-uttag räcker oftast; stora "
              "ljudpaket med flera subbasar, eller ljud + ljus + rök tillsammans, behöver el från minst "
              "två uttag på olika faser* (stod tidigare \"PA kräver ofta 16A dedicerad krets\"); "
              "leverans och montering \"räknas fram i varukorgen\" i stället för \"offert\"; priser ur "
              "data i ljud-foretagsfest och dj-brollop-pris; artno-uppslag i stället för `products[0]`."),

        ("h2", "2.5 Övrigt"),
        ("p", "Frontpage `/`, Varukorg, Bokningssida, Om oss, Kontakt, FAQ, Eventlokal-guide, "
              "Festguide, Hyresvillkor (hub + privatperson/foretag), Personuppgiftpolicy, Feedback, "
              "Referenser, Kundorder `/order/`, `/sign/`, `/tack/`, `/svens-kunskapsskola/`, "
              "**`/en/`**."),
        ("ul", [
            "**`/en/` (NY 2026-10-02)** — engelsk landningssida för internationella företag, ambassader och organisationer samt utländska eventbyråer. Tjänster med \"från\"-priser ur datan, referenskunder ur `clients.json`, FAQ med `FAQPage`-schema (`inLanguage: en`). Detaljlänkar går till de svenska produktsidorna. Formuläret postar till `skicka-kontakt` med `typ: Företag`, `sendCopy: false` (kundkvittot finns bara på svenska) och meddelandet märkt **\"[ENGLISH ENQUIRY — svara på engelska]\"**. Tack visas på sidan. `lang=\"en\"` + hreflang (Dok 1 §4.8).",
            "**/kontakt/** — kartan (Google Maps) laddas automatiskt för besökare som godkänt cookies, annars vid klick på \"Visa karta\" (Dok 1 §9.1). Öppet/stängt-pillen räknas ur `site.json → company.openingHours` (byggs server-side som `data-periods`), inte längre ur Google Places API. **Sedan 2026-10-11** märks helgtiderna som depåtider för hämtning och återlämning, och telefonen på helger som jour vid pågående uthyrning Samma budskap på bokningssida, order, studentflak-FAQ, ortssidor och /en/ — **hårdkodat i varje sida**, inte läst ur `site.json` (Dok 1 §8).",
            "**Eventlokal-guiden** — faktagranskad 2026-10-02 (3Arena, Spegelsalen 70–300, Münchenbryggeriet 10–3 500, Annexet, Cirkus m.fl.). Antalet år sedan 1986 räknas fram.",
        ]),

        ("h2", "2.6 Admin (/admin/)"),
        ("table", [
            ["Underflik", "URL"],
            ["Kanban / order", "/admin/"],
            ["Produkter", "/admin/produkter/"],
            ["Referenskunder", "/admin/referenser/ (Ort-dropdown + Utvald-kryssruta)"],
            ["Recensioner", "/admin/recensioner/ (manuell inläggning, länk till Google-profilen)"],
            ["Bulletin", "/admin/bulletin/"],
            ["Topplistor", "/admin/topplistor/ — NY 2026-10-17 (grupper, artiklar, \"Fyll från bokningsdata\")"],
            ["Referenscase", "/admin/referenscase/ — NY 2026-10-17 (case, bilder, hubbrader)"],
            ["Statistik", "/admin/stats/ (+ /stats/forsaljning/)"],
            ["Sven-analytics", "/admin/sven/"],
        ]),
        ("p", "Innehålls-flikarna (Referenskunder, Recensioner, Bulletin, **Topplistor, "
              "Referenscase**) samlas under en \"Innehåll\"-dropdown i admin-topbaren. Datamodell i "
              "Dok 2 §12 och Dok 5 §3.5."),

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
        ("p", "Trust-stats (verifierade mot sidan 2026-10-17): **100+ privatpersoner, 100+ uppdrag/år, "
              "100+ referenskunder** (var 75+ till 2026-10-18 — databasen har 78 och de verkliga är fler), grundat 1986, 100 % nöjd-garanti. "
              "Kundlistan på sidan hydreras live ur Supabase; den committade `clients.json` är en äldre ögonblicksbild. "
              "Tidigare versioner av specen angav 500+ uppdrag/år — sidan har sagt 100+ sedan mars."),
        ("p", "**Ordningen på sidan (2026-10-09):** \"De litar på oss\" (logobannern) ligger **ovanför** "
              "eventgalleriet, som blivit för långt för att bannern skulle synas under det."),

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
            ["logo_german_beerhall.webp", "German Beer Hall (ersatte Mälardalens universitet 2026-10-03; `tall`, Dok 1 §3.3). `logo_mdu.webp` ligger kvar i mappen"],
            ["logo_hacksaw.webp", "Hacksaw Studios"],
            ["logo_hardrock.webp", "Hard Rock Café (ersatte Odd Fellow 2026-09-18)"],
            ["logo_uf.webp", "UF Företagande"],
        ]),
        ("note", "**Bannern är ett kurerat urval, inte kundlistan.** Odd Fellow ligger kvar som kund i "
                 "Supabase-tabellen `clients` trots att logotypen togs ur bannern. En kund kan finnas i "
                 "listan utan logotyp, och tvärtom. Bildkonventionen står i Dok 1 §3.3."),

        ("h2", "4.2 Eventgalleri — 19 kort, ur databasen"),
        ("p", "**Sedan 2026-10-17 läser galleriet `event-cases.json`**, som byggs ur Supabase "
              "(Dok 2 §12). Kort, texter, taggar och bilder underhålls i **/admin/referenscase/** — "
              "inte i sidfilen. Inline-arrayen i `referenser/index.astro` är borttagen."),
        ("p", "19 kort och 37 galleribilder (38 WebP-filer i `public/images/event/`; en bild visas bara "
              "på ljushubben). Grid 2 / 3 / 4 kolumner, kort i `aspect-ratio:3/4` med `object-cover`."),
        ("ul", [
            "**Taggar:** Festival · Företagsevent · Konferens · Installation · Aktivering (ny 2026-10-15). Antal per tagg och bilder per kort räknas inte upp här — de ändras med varje nytt case; se /referenser/ eller `event-cases.json` (Dok 2 §12).",
            "**Bilder per kort:** 1–4 ur `images[]`; två eller fler ger crossfade (Dok 1 §4.7). Nya case levereras som porträtt 1050×1400 WebP.",
            "**Senaste tillskotten (2026-10-17):** Swedish Taste (Västermalm, DJ, två bilder) och Mr French (Skeppsbron, DJ och ljud, tre bilder). Swedish Taste visas bara på /referenser/, inte på DJ-hubben.",
            "**Samarbetspartner skrivs som de själva skriver sig:** Jung Co (inte \"Jung\" eller \"Jung & Co\"), Studio S19, PerPR.",
            "**Leverera bara det vi levererat.** Systembolagets text nämnde en projektorduk som inte var vår — borttagen 2026-10-09. Samma noggrannhet gäller hubbraderna: DJ-hubben visar sedan 2026-10-17 bara uppdrag med DJ — Mr French, Skridskodisco och Djursholms Slott (uppgift från Scenkonsult); Systembolaget och sedan Läkarförbundet lämnade raden.",
        ]),
        ("note", "**Liggande foton beskärs vid konverteringen, inte av `object-cover`.** Ett 4:3-foto i "
                 "en 3:4-ruta tappar 44 % av bredden på en centrerad crop. Välj horisontellt centrum "
                 "(och vid behov beskuren höjd) och spara 1050×1400 WebP. Se Dok 6 §8."),

        ("h2", "4.3 Kunddata och recensioner"),
        ("note", "Kundlistan hämtas från Supabase-tabellen `clients` (via `clients.json` + live "
                 "clients-list). Utvalda kunder styrs av `featured`-flaggan; kunder kan taggas med ort "
                 "för ortssidorna (Dok 5). Google-recensioner renderas server-side från Supabase-tabellen "
                 "`reviews` och hydreras live via `reviews-list`."),
        ("note", "**Google Places API används inte längre (beslut 2026-10-02).** Den gav bara max 5 "
                 "recensioner, och efter att Google Cloud-testperioden löpt ut svarade den "
                 "PERMISSION_DENIED. Badgens betyg och antal på /referenser/ och /kontakt/ räknas nu ur "
                 "samma lista som korten. Nya recensioner läggs in för hand i /admin/recensioner/."),

        ("h1", "5. Bokningsflöde (kund)"),
        ("p", "\"Begär offert\" → `/bokningssida/`. Produkter läggs i varukorg → skickas via "
              "\"Maila offertförfrågan\" (`intent=offert`) eller \"Boka detta nu\" (`intent=boka`). "
              "Ingen betaltjänst (avsiktligt). Varukorgen visar \"Montering & demontering "
              "(beräknad)\" (Dok 2 §5.1) och ber kunden beskriva underlaget när en scen ligger i "
              "korgen. Engelsktalande kunder använder formuläret på `/en/`. Detaljer om order/admin "
              "i Dok 5."),

        ("h1", "6. Kategorihubbar — topplista och referensrad (NY 2026-10-17)"),
        ("p", "Två återanvändbara sektioner på kategorihubbarna, båda ur databasen (Dok 2 §12) och "
              "underhållna i admin:"),
        ("ul", [
            "**Topplistan** — `<PopularaPaket data={…} kategori=\"…\" category=\"…\" />`. Grupper efter tillfälle och gästantal (H3 = tillfället, gästantalet som etikett). En **rad per produkt**: rang 01–03, miniatyr, namn, pris med momsklasserna och köpknapp. Inga stora bilder, inga speclistor. Product/Offer-markeringen ligger kvar som dolda `meta`-taggar, så rich results påverkas inte. Sektionen är `max-w-5xl`. Rubriken heter **\"Topplista <Kategori>\"** överallt (`content_categories.popular_heading`).",
            "**Länk per rad (2026-10-17):** namn och miniatyr länkar till `<sida>#<artno med gemener>`, t.ex. `/vara-tjanster/hyra-ljus/fardiga-paket/#sk-ljs-pak-0022`. Artikelnumret är produktens ID. Produktkorten bär `data-sk-ankare` med sina artikelnummer — variantkort listar alla och varje variantknapp har `data-sk-ankare-val` — och skriptet `skAnkare` sist i `Layout.astro` väljer rätt variant, scrollar till kortet under navigationen och markerar det. Inga `id`-attribut, eftersom samma produkt kan synas på flera kort på en sida. Vilken sida en serie säljs på står i `src/lib/produkt-sidor.mjs` (via `src/utils/produktLank.ts`); en serie utan rad får ingen länk, aldrig fel länk; `ljud-ljus.test` kontrollerar att varje topplistad produkt har en sida som finns. Ny kortkomponent → ge den `data-sk-ankare`.",
            "**Referensraden** — `<EventBilder kategori=\"…\" />`, rubrik \"Från våra event\". Tre kort med hubbens egen bild och text för uppdraget (4:3), länk till /referenser/.",
        ]),
        ("table", [
            ["Hubb", "Topplista", "Referensrad"],
            ["/hyra-ljud/", "Ja — 4 grupper, 12 rader", "Vinterviken · Systembolaget · Hard Rock Rising"],
            ["/hyra-ljus/", "Ja — 4 grupper, 12 rader", "Systembolaget · ABG Sundal Collier · Skridskodisco"],
            ["/hyra-bild/", "Ja — 3 grupper, 9 rader", "EA Sports FC 27 · Tele2 · 100 Knivar"],
            ["/hyra-scen/", "Nej", "Strawberry Arena (UF) · Jazz & Blues Konserthuset · Storytel"],
            ["/hyra-dj/", "Nej", "Mr French · Skridskodisco · Djursholms Slott (alla med DJ)"],
            ["/konferens-av/", "Nej", "Solna Näringsliv · ABG Sundal Collier · Tele2"],
            ["/hyra-karaoke/", "Nej", "Nej"],
            ["/hyra-ljud-och-ljus/", "Ja — 3 egna grupper, 10 rader (ljud och ljus blandat), efter konfiguratorn. \"Se alla\"-länken döljs eftersom den pekar på sidan själv", "Nej"],
        ]),
        ("note", "**Topplistan bara där den tillför något** (beslut 2026-10-17). Scenhubben renderar "
                 "redan alla elva scenpaket i interaktiva kort, DJ-hubben har fyra paket och visar alla "
                 "fyra, karaoke har inga aktiva paket alls (byggaren). En topplista där vore samma "
                 "produkter två gånger eller tom. Referensraden kostar lite och ger förtroende och interna "
                 "länkar, så den rullades ut bredare."),
        ("note", "**Komponenterna renderar ingenting utan data.** En hubb kan få anropet innan "
                 "innehållet finns i databasen — sidan ser oförändrad ut tills raderna läggs in och en "
                 "deploy gått. Motsatsen är farlig: nytt innehåll i fallback-filen före databasen "
                 "försvinner vid nästa deploy (Dok 2 §12.3)."),

        ("h1", "7. SEO- och AI-filer (NY 2026-10-02)"),
        ("table", [
            ["Fil / källa", "Innehåll och regel"],
            ["public/robots.txt", "Alla får läsa sajten; /admin/, /order/, /api/, /.netlify/ och wp-sökvägarna är spärrade. AI-agenterna (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, Applebot-Extended, CCBot, Meta-ExternalAgent, Amazonbot, DuckAssistBot) står i **en** gemensam grupp med samma Disallow — en namngiven grupp ersätter `*`-gruppen för den boten"],
            ["public/llms.txt", "**Genereras** av `scripts/generate-llms.mjs` i prebuild/predev ur datafilerna (Dok 2 §2.1). Redigeras aldrig för hand"],
            ["sitemap-index.xml", "@astrojs/sitemap"],
            ["JSON-LD LocalBusiness", "`Layout.astro`: name Scenkonsult Norden, legalName Sigvardsson Consulting AB, taxID, vatID, openingHoursSpecification (mån–fre + lör–sön), `sameAs` + `hasMap` = Google-profilens cid-URL, Facebook, Instagram, LinkedIn. Ingen AggregateRating (self-serving, borttaget 2026-06-15)"],
            ["hreflang", "`/` ↔ `/en/` + x-default (Dok 1 §4.8)"],
        ]),
        ("p", "**AI-synligheten mäts månadsvis** av ett schemalagt uppdrag (den 2:a kl 08:52): tre fasta "
              "ChatGPT-frågor, 15 sökfrågor via Claudes webbsök och en teknisk kontroll av robots.txt, "
              "llms.txt och JSON-LD. Rapporten skrivs till projektet som "
              "`claude/AI_Synlighet_Test_<datum>.md`. Baslinje: 2026-10-02."),

        ("h1", "8. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v18.6", "2026-10-18",
             "§1.1 Kunskap ligger i toppmenyn. §4 100+ referenskunder. YouTube-filmer på startsidan och Svens Kunskapsskola laddas först vid klick."],
            ["v18.5", "2026-10-17",
             "§5 referenscase Swedish Taste (Västermalm, DJ). Taggräkning och bildräkning per kort borttagna — inventarier skrivs inte för hand."],
            ["v18.4", "2026-10-17",
             "§5 nytt referenscase Mr French (Skeppsbron, DJ och ljud). §6 DJ-hubbens rad: Mr French ersätter Läkarförbundet."],
            ["v18.3", "2026-10-17",
             "Inga ändringar — versionen följer Dok 2, 4 och 6 (rättelse: 1×1-plattformen bara 40 cm)."],
            ["v18.2", "2026-10-17",
             "§6 länk per topplisterad (data-sk-ankare, skAnkare, produkt-sidor.mjs), topplista på /hyra-ljud-och-ljus/, DJ-hubbens rad med DJ-uppdragen. §5 referenssidan: Djursholms Slott och Läkarförbundet nämner DJ."],
            ["v18.1", "2026-10-17",
             "Scensidans ingress räknar antalet paket ur scenes.json; startsidans scenkort räknar antal och storleksspann. Montering-formuleringarna på /vara-tjanster/, /for/festival/ och bildhubben rättade."],
            ["v18.0", "2026-10-17",
             "§1.2 Hyra ljud och ljus i Ljud-kolumnen. §2 86 filer / 111 sidor. §2.1 konfiguratorsidan, "
             "ljudhubbens titel, undersidornas titlar efter sökord. §2.4 guidegenomgången och elrådet. "
             "§2.5 kartan och helger som jour. §2.6 Topplistor och Referenscase. §4 trust-stats "
             "rättade (100+ uppdrag/år, 75+ referenskunder), bannern ovanför galleriet, German Beer Hall "
             "ersätter MDU. §4.2 galleriet ur event-cases.json: 19 kort, 2–4 bilder, taggen Aktivering. "
             "Ny §6 Kategorihubbar — topplista och referensrad, med beslutet var topplistan inte hör hemma."],
            ["v17.1", "2026-10-05",
             "§1.2 Karaoke egen rubrik i menyn. §2.1 not om karaokesidan med byggaren."],
            ["v17.0", "2026-10-02",
             "Ny §7 SEO- och AI-filer (robots.txt, genererad llms.txt, JSON-LD, hreflang, månadsmätning "
             "av AI-synlighet). Ny §1.4 Sidfot. §2 108 sidor / 83 filer, ny `/en/` och not om "
             "kontaktsidan och eventlokal-guiden. §2.1 /hyra-ljud/pa-anlaggning/ borttagen (fanns inte) "
             "+ not om ljud-paret och tillbehörsbannern. §2.2 tio layoutplatser + scenpaket-sektionen. "
             "§2.4 titlar 2026. §4.3 Google Places API borttaget. §5 beräknad montering, /en/. "
             "Historiken flyttad till §8."],
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
