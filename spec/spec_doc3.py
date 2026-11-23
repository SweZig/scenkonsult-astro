DOC3 = dict(
    doc_no=3,
    slug="Sidor_Navigation",
    title="Sidor & Navigation",
    subtitle="Nav-struktur, sidträd, nav-offset, referenssida, bokningsflöde, SEO- och AI-filer",
    version="v19.1",
    date="2026-11-23",
    blocks=[
        ("h1", "1. Navigationsstruktur (omskriven 2026-11-23)"),
        ("note", "**En källa: `src/data/meny.ts`.** `Layout.astro` renderar både datorns megameny och "
                 "mobilens dragspel ur den. Ändra aldrig länkar direkt i `Layout.astro`. Beteendet "
                 "(öppna, stänga, Esc, telefon dold under 1 180 px) står i Dok 1 §4.1."),
        ("h2", "1.1 Toppnivå"),
        ("p", "**Tjänster · Event · Kunskap · Kontakta oss**, därefter telefon, offertknappen **Begär "
              "offert** (pill, `OFFERT_HREF` = /bokningssida/) och varukorg. Sedan 2026-11-22; före dess "
              "låg tillfällena (bröllop m.fl.) under Tjänster och Event fanns inte som toppval."),

        ("h2", "1.2 Menyerna"),
        ("table", [
            ["Meny", "Innehåll (`meny.ts`)"],
            ["Tjänster", "`TJANSTER_KOLUMNER`: fyra kolumner med grupperna Ljud · Ljus + Ljud & ljus · Scen + Bild · DJ + Karaoke. Gruppnamnet länkar till hubben; raderna under till undersidor. Scen har rader till sektionerna på /hyra-scen/ (Scenpodier – bygg din scen `#scen-konfigurator`, Färdiga scenpaket `#scenpaket`, Scenkjol & tillbehör `#scenkjol`) plus Pipe & Drape. LED-vägg har etiketten Nytt. `TJANSTER_PANEL`: tonad ruta med Komplett event, Fast installation och Begär offert"],
            ["Event", "`EVENT_LANKAR` under rubriken För ditt event: Bröllop, Företagsfest & kickoff, Konferens & föreläsning, Festival & utomhus, Studentflak. `EVENT_PLANERA` (2026-11-23) under rubriken Planera: Konferensteknik (/vara-tjanster/konferens-av/), Eventlokaler i Stockholm, Minnesvärda fester, Referenser, och sist `EVENT_ALLA` → /for/ (Alla tillfällen)"],
            ["Kunskap", "`KUNSKAP_FRAMHAVD` Svens Kunskapsskola överst, sedan `KUNSKAP_GRUPPER` i fyra kolumner (2026-11-23): **Dimensionera rätt** (Hur stor PA?, Hur stor scen?, Hyra PA-system, Ljud utomhus, Trådlös mikrofon) · **Ljus & bild** (Ljussättningstips, Uplights, DMX-styrning, Rökmaskin, Projektor – pris, HDMI, SDI & fiber) · **Planera & budget** (Checklista för event, Vad kostar uthyrning?, Hyra scen – pris, Konferens AV-checklista, Studentflak-checklista, Vanliga frågor) · **Fest & bröllop** (DJ till bröllop – pris, Ljud till bröllop, Ljus till bröllop, Ljud till företagsfest, DJ eller liveband?), och `KUNSKAP_ALLA` → /for/guider/"],
        ]),
        ("ul", [
            "**Menyregeln:** gruppnamnet länkar till hubbsidan, men allt viktigt på en hubbsida ska också ha en egen rad. Ljud och Ljus täcks av sina undersidor; Scen, DJ och Karaoke säljer på själva hubbsidan och har därför egna rader dit.",
            "**Kunskap har 22 länkar: 21 av de 23 aktiva guiderna plus Vanliga frågor** (före 2026-11-23: 8 guider). Smala ämnen — Rökvätska och Varför Numark, Denon & Rane — nås via Alla guider och från sina sortimentssidor. Lägg inte till dem utan skäl; menyn ska gå att skumma.",
            "**Ingen emoji** i menyn (Dok 1 §2.5). Ordningen inom en grupp följer efterfrågan.",
        ]),

        ("h2", "1.3 Mobil"),
        ("p", "Hamburger med ett dragspel per toppval i samma ordning som datorn, sedan telefon, Begär "
              "offert och Varukorg (SVG-ikon). Tjänster visar grupper med gruppnamnet som länk och "
              "underrader i gemener, sist panelens rader. Event visar tillfällena och under rubriken "
              "Planera sina fyra rader. Kunskap visar Svens Kunskapsskola, de fyra grupperna som egna "
              "små dragspel (`details` med klassen `nav-mob-del`) och Alla guider. Tjänster fälls ut "
              "automatiskt efter ca 3 s (Dok 1 §4.1)."),

        ("h2", "1.4 Sidfot (uppdaterad 2026-10-02)"),
        ("p", "Nedersta raden: `© {årtal} Scenkonsult Norden` — årtalet räknas fram vid bygget — "
              "och länkarna Integritetspolicy · **Cookie-inställningar** (öppnar cookiebannern igen, "
              "Dok 1 §9.1) · Hyresvillkor · **In English** (`/en/`)."),

        ("h1", "2. Sidträd"),
        ("note", "**Sidräkning (2026-11-23): 87 `.astro`-filer i `src/pages/` som bygger 112 "
                 "sidor.** 86 statiska filer plus `hyra-ljud-scen-[ort].astro`, som genererar 26 "
                 "ortssidor via `getStaticPaths`. Ny sedan v19.0: "
                 "`/vara-tjanster/projektering-och-installation/`."),
        ("note", "**Sidlistan nedan är en inventarielista och blir inaktuell inom en månad.** Den bör "
                 "genereras ur `src/pages/` i stället för att handskrivas — se Dok 6 §9.2. "
                 "Läs den som en karta över strukturen, inte som facit på vilka filer som finns."),

        ("note", "**Omdesignen 2026-10-18:** samtliga publika sidor har startsidans formspråk (Dok 1 "
                 "§2.5). Varukorg, order och signering är bara delvis berörda — kundflödet ändrades inte. "
                 "URL:er, titlar, metabeskrivningar och h1 är oförändrade utom startsidans h1 (§8) och "
                 "guideöversikten (\"eventteknik\"); kontrollerat med en jämförelse av hela bygget före "
                 "och efter (Dok 6 §6.3). Sidorna består av 85 `.astro`-filer (CategoryHero m.fl. "
                 "raderade) som bygger 111 sidor."),

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
            ["Projektering och fast installation", "/vara-tjanster/projektering-och-installation/ — NY 2026-11-13"],
        ]),
        ("note", "**Projektering och fast installation (2026-11-13).** Innehållet ligger i "
                 "`src/data/installation.json`. Sidan visar områden, tre installationer från 2026 "
                 "(German Beer Hall Gallerian och Uppsala, Ulvsunda idrottscentrum med MA3), en "
                 "processdel \"Från ritning till drift\", lokaler och FAQ. Gallerian har sex bilder i "
                 "rutnät med en stor bild över 2 × 2 rutor. Liggande projektbilder i "
                 "`public/images/installation/` (+ 640w), 3:4-bilder för referenscasen i "
                 "`public/images/event/`. Länkas från menyns panel, sidfoten, /vara-tjanster/, "
                 "startsidans ljuskort, ljushubben och llms.txt. **Kundvänd text nämner inga märken eller "
                 "leverantörer.**"),
        ("note", "**Event-sidan är för tal (2026-11-02).** /hyra-ljud/event/ säger i ingressen att "
                 "paketen är för tal och saknar subwoofer, och har rutan \"Ska det dansas?\" med länk till "
                 "Music-paketen och från-pris ur datan. ChatGPT svarade på \"högtalare till fest\" med "
                 "Event-serien och placerade Scenkonsult sist (Dok 6 §6.1). FAQ:n i `ljud.json` säger samma "
                 "sak."),
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
        ("p", "Hub `/for/` (fotokort per tillfälle, guider, faktarad, slutruta) + Bröllop, Företagsfest "
              "& kickoff, Konferens & föreläsning, Festival & utomhus, Studentflak. Sedan 2026-11-22 "
              "egen toppmeny, Event (§1.2). Texter om LED-trailrar säger 11/21 m² (Dok 2 §9)."),
        ("p", "**Mall sedan 2026-10-18** (komponenter i `src/components/event/`): ModernHero med foto → "
              "EventOmraden (områden som radkort) → EventPaket (tre nivåer ur `utils/paket.ts`, "
              "\"Lägg paketet i varukorgen\") → EventChecklista → ProduktRader → referensrad → "
              "EventFaq → SlutRuta. Studentflak har två paket (med och utan elverk SK-EL-0012) och "
              "TreSteg-tips."),
        ("note", "**Scenpaket läggs aldrig i varukorgen som en paketrad.** Scenen byggs av moduler, ben "
                 "och trappor i scenkonfiguratorn; i EventPaket och ProduktRader leder scenraden dit "
                 "(\"Scenen väljs i scenkonfiguratorn\" / pil-knapp) i stället för en köpknapp."),

        ("h2", "2.4 Guider"),
        ("p", "Guide-hub `/for/guider/` + ~24 guider (hur-stor-pa, hur-stor-scen, dj-eller-liveband, "
              "ljussattning-tips, checklista-event, ljud-utomhus, vad-kostar-det, "
              "varfor-numark-denon-rane, hyra-scen-pris, hyra-pa-system, hyra-projektor-pris, "
              "hyra-rokmaskin, hyra-tradlos-mikrofon, hyra-uplights, dmx-styrning-guide, "
              "rokvatska-guide, sdi-hdmi-fiber-guide, ljud-brollop, ljud-foretagsfest, ljus-brollop, "
              "dj-brollop-pris, konferens-av-checklista, studentflak-checklista, "
              "led-vagg-kalkylator [301-redirect])."),
        ("p", "**GuideLayout (2026-10-18):** alla guider och de två långguiderna (eventlokaler, "
              "minnesvärda fester) använder `GuideLayout`: rubrikyta utan gradient, textspalt och en fast "
              "sidokolumn med innehållsförteckning byggd ur guidens h2:or, Fråga Sven-ruta och länk till "
              "rätt sortiment, sedan slutrutan. Inga inbyggda CTA-rutor eller egna "
              "innehållsförteckningar i guiderna. Snabbsvar, tabellhuvuden, FAQ och relaterade guider "
              "har klasser (`gl-snabb`, `gl-th`, `gl-sum`, `gl-chip`) i stället för inline-stil. "
              "Guideöversikten har kategorihopp och kort utan emojis och lästid."),
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
            "**/kontakt/** — kartan (Google Maps) laddas automatiskt för besökare som godkänt cookies, annars vid klick på \"Visa karta\" (Dok 1 §9.1). Öppet/stängt-pillen räknas ur `site.json → company.openingHours` (byggs server-side som `data-periods`), inte längre ur Google Places API. **Sedan 2026-10-11** märks helgtiderna som depåtider för hämtning och återlämning, och telefonen på helger som jour vid pågående uthyrning Samma budskap på bokningssida, order, studentflak-FAQ, ortssidor och /en/; klockslagen hämtas sedan 2026-10-17 via `src/utils/hours.ts` (Dok 1 §8).",
            "**Informationssidorna (2026-10-18)** — om oss, kontakt, referenser, FAQ, hyresvillkor (3), personuppgiftspolicy, Svens kunskapsskola, feedback, tack och bokningssidan har `SidHuvud` som rubrikyta; villkor och policy använder `.sk-prosa`. Våra tjänster och För ditt event har fotokort med riktiga länkar (tjänstekorten var tidigare onclick-divar som Google inte följer). /tack/ är `noindex`.",
            "**/om-oss/ (2026-11-22/23)** — \"Vår historia\" utgår från Gävles revy- och operettradition: Pers pappa Lars Sigvard (amatörtävling utanför Ljusdal i slutet av 1940-talet, Gefle Lyriska Teater, turnerade med Tjaddenrevyn, startade Gävlerevyn, nyårsrevyn Go'natt Gävle 1979/80), Vita hästen 1983 med folkparksturné 1984 där Per skötte tekniken, DAV Produktion 1986 i Mackmyra utanför Gävle, retailåren 1992–2018 och nystarten efter pandemin. Avsnittet har tre rader (Lars / 1983–1986 / i dag) med familjens egna bilder i `public/images/om-oss/`. **Stavningen är Per, inte Pär.** Mackmyra nämns i historien, inte i startsidans faktarad.",
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
        ("p", "**Mall sedan 2026-10-18:** ModernHero med ortens foto (`orter.json → image`, mått ur "
              "`utils/bildmatt.ts`) → fyra fotokort för utbudet → ortstext med eventlokaler → "
              "populärt som ProduktRader (Scenpaket Medium och Large leder till konfiguratorn, Event "
              "Small med köpknapp — den slogs upp på ett id som inte fanns och visades aldrig före "
              "2026-10-18) → varför oss (hårfint rutnät) → lokala kunder + logotyper → EventFaq → "
              "grannorter → SlutRuta. `mobilBar` är på. Inga svarstidslöften, inget inskrivet "
              "teknikerpris."),

        ("h1", "3. Nav-offset per sida"),
        ("p", "Sedan 2026-10-18 har nästan alla sidor en rubrikkomponent som sätter nav-offset själv: "
              "`ModernHero` (hubbar, produkt-, konfigurator-, event- och ortssidor), `SidHuvud` "
              "(informationssidor) och `GuideLayout` (guider). Manuell nav-offset (Dok 1 §4.2) finns kvar "
              "på varukorg, order, sign, tack och guideöversikten."),

        ("h1", "4. Referenssida"),
        ("note", "Korrekt sökväg är `/referenser/` (svensk stavning), inte `/referencer/`."),
        ("p", "Trust-stats (verifierade mot sidan 2026-10-17): **100+ privatpersoner, 100+ uppdrag/år, "
              "100+ referenskunder** (var 75+ till 2026-10-18 — databasen har 78 och de verkliga är fler), grundat 1986, 100 % nöjd-garanti. "
              "Kundlistan på sidan hydreras live ur Supabase; den committade `clients.json` är en äldre ögonblicksbild. "
              "Tidigare versioner av specen angav 500+ uppdrag/år — sidan har sagt 100+ sedan mars."),
        ("p", "**Ordningen på sidan (2026-10-09):** \"De litar på oss\" (logobannern) ligger **ovanför** "
              "eventgalleriet, som blivit för långt för att bannern skulle synas under det."),

        ("h2", "4.1 Logobanner — tolv logotyper ur KUNDLOGOTYPER"),
        ("p", "Bannern var fram till 2026-09-18 en enda sammansatt rasterbild med inbrända ramar. Nu är "
              "det **en transparent WebP per kund** i `public/images/kunder/`. Sedan 2026-11-21 står "
              "listan i `src/utils/clients.ts → KUNDLOGOTYPER` (sidan läser den som `clientLogos`): tolv "
              "logotyper på en gemensam duk 260×127 med optiskt balanserad storlek. Nya 2026-11-21: "
              "TikTok, EY, foodora, Tele2. Samma lista används av startsidan och `KundRad`. Regler och "
              "ordning i Dok 1 §3.3."),
        ("note", "**Bannern är ett kurerat urval, inte kundlistan.** Odd Fellow ligger kvar som kund i "
                 "Supabase-tabellen `clients` trots att logotypen togs ur bannern. En kund kan finnas i "
                 "listan utan logotyp, och tvärtom. Bildkonventionen står i Dok 1 §3.3."),

        ("h2", "4.2 Eventgalleri — ur databasen"),
        ("p", "**Sedan 2026-10-17 läser galleriet `event-cases.json`**, som byggs ur Supabase "
              "(Dok 2 §12). Kort, texter, taggar och bilder underhålls i **/admin/referenscase/** — "
              "inte i sidfilen. Inline-arrayen i `referenser/index.astro` är borttagen."),
        ("p", "Grid 2 / 3 / 4 kolumner, kort i `aspect-ratio:3/4` med `object-cover`. Sektionen har "
              "`id=\"eventfoton\"` och `scroll-margin` — startsidans faktaruta \"100+ event per år\" "
              "länkar dit. Antalet kort räknas inte upp här (2026-11-23: 24 kort)."),
        ("ul", [
            "**Taggar:** Festival · Företagsevent · Konferens · Installation · Aktivering (ny 2026-10-15). Antal per tagg och bilder per kort räknas inte upp här — de ändras med varje nytt case; se /referenser/ eller `event-cases.json` (Dok 2 §12).",
            "**Bilder per kort:** 1–6 ur `images[]`; två eller fler ger crossfade (Dok 1 §4.7). Nya case levereras som porträtt 1050×1400 WebP (+ 640w).",
            "**Tillskott sedan 2026-10-18:** de tre installationerna (tagg Installation, 2026-11-13), Foodora (scen med scenkjol och rosa matta, tre bilder, 2026-11-17 — bara på /referenser/, inte på scenhubben) och spegelbollen i German Beer Hall Gallerian (ljusgården och monteringen, 2026-11-23 — kortet har sex bilder).",
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
                 "`reviews` och hydreras live via `reviews-list` — sedan 2026-10-23 med samma skript "
                 "(`src/scripts/recensioner-live.ts`) på startsidan, /en/, /referenser/ och /kontakt/, så "
                 "att en ny recension syns direkt (Dok 1 §4.3)."),
        ("note", "**Google Places API används inte längre (beslut 2026-10-02).** Den gav bara max 5 "
                 "recensioner, och efter att Google Cloud-testperioden löpt ut svarade den "
                 "PERMISSION_DENIED. Badgens betyg och antal på /referenser/ och /kontakt/ räknas nu ur "
                 "samma lista som korten. Nya recensioner läggs in för hand i /admin/recensioner/."),

        ("h1", "5. Bokningsflöde (kund)"),
        ("p", "\"Begär offert\" leder till varukorgen (`/bokningssida/` förklarar flödet). Produkter "
              "läggs i varukorgen och skickas med **en** knapp, \"Begär offert\", där kunden anger "
              "kundläge: *Jag är klar* eller *Jag vill ha förslag* (Dok 4 §1.4). "
              "Ingen betaltjänst (avsiktligt). Varukorgen visar \"Montering & demontering "
              "(beräknad)\" (Dok 2 §5.1) och ber kunden beskriva underlaget när en scen ligger i "
              "korgen. Engelsktalande kunder använder formuläret på `/en/`. Detaljer om order/admin "
              "i Dok 5."),

        ("h1", "6. Kategorihubbar — topplista och referensrad (NY 2026-10-17)"),
        ("p", "Två återanvändbara sektioner på kategorihubbarna, båda ur databasen (Dok 2 §12) och "
              "underhållna i admin:"),
        ("ul", [
            "**Topplistan** — `<PopularaPaket data={…} kategori=\"…\" category=\"…\" />`. Grupper efter tillfälle och gästantal (H3 = tillfället, gästantalet som etikett). En **rad per produkt**: rang 01–03, miniatyr, namn, pris med momsklasserna och köpknapp. Inga stora bilder, inga speclistor. Product/Offer-markeringen ligger kvar som dolda `meta`-taggar, så rich results påverkas inte. Sektionen är `max-w-5xl`. Rubriken heter **\"Våra mest bokade paket\"** sedan 2026-10-18 (`content_categories.popular_heading`); grupperna visas som flikar (WAI-ARIA tabs) i stället för under varandra.",
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

        ("p", "**Hubbarnas övriga delar (2026-10-18):** ModernHero med eventfoto, KategoriKort (fotokort "
              "per underkategori, Dok 2 §12.7), LjudLjusPromo/TrossPromoBanner som fotobanners, "
              "LeveransMonteringEl som hårfint rutnät, \"Vad ingår alltid\"-rutor med pill-knappar."),

        ("h1", "7. SEO- och AI-filer (NY 2026-10-02)"),
        ("table", [
            ["Fil / källa", "Innehåll och regel"],
            ["public/robots.txt", "Alla får läsa sajten; /admin/, /order/, /api/, /.netlify/ och wp-sökvägarna är spärrade. AI-agenterna (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, Applebot-Extended, CCBot, Meta-ExternalAgent, Amazonbot, DuckAssistBot) står i **en** gemensam grupp med samma Disallow — en namngiven grupp ersätter `*`-gruppen för den boten"],
            ["public/llms.txt", "**Genereras** av `scripts/generate-llms.mjs` i prebuild/predev ur datafilerna (Dok 2 §2.1). Redigeras aldrig för hand"],
            ["sitemap-index.xml", "@astrojs/sitemap. Filtret i `astro.config.mjs` utesluter /admin/, /order/, /sign/, /tack/ och sedan 2026-10-18 den omdirigerade /for/guider/led-vagg-kalkylator/"],
            ["JSON-LD LocalBusiness", "`Layout.astro`: name Scenkonsult Norden, legalName Sigvardsson Consulting AB, taxID, vatID, openingHoursSpecification (mån–fre + lör–sön), `sameAs` + `hasMap` = Google-profilens cid-URL, Facebook, Instagram, LinkedIn. Ingen AggregateRating (self-serving, borttaget 2026-06-15)"],
            ["hreflang", "`/` ↔ `/en/` + x-default (Dok 1 §4.8)"],
        ]),
        ("p", "**AI-synligheten mäts månadsvis** av ett schemalagt uppdrag (den 2:a kl 08:52): tre fasta "
              "ChatGPT-frågor, 15 sökfrågor via Claudes webbsök och en teknisk kontroll av robots.txt, "
              "llms.txt och JSON-LD. Rapporten skrivs till projektet som "
              "`claude/AI_Synlighet_Test_<datum>.md`. Baslinje: 2026-10-02. **Kör webbsöket i utökat läge** "
              "— standardläget gav 2026-11-02 ett annat index utan vare sig Scenkonsult eller "
              "konkurrenterna. `/api/google-reviews` finns inte längre och ska inte kontrolleras."),
        ("p", "**llms.txt (2026-11-02):** Event-rubriken säger \"inte för fest och dans, se Music\", med "
              "en hänvisningsrad till Music-paketen och en rad till AI-assistenter om att fest och dans "
              "betyder Music. Ljudpaketen anges även inklusive moms. Projektering och installation har "
              "en egen rad (2026-11-13)."),

        ("h1", "8. Startsidan (omgjord 2026-10-18)"),
        ("p", "h1 **\"Hyra scen, ljud, ljus & bild i Stockholm\"** — sökorden ska stå i rubriken; en tidigare "
              "variant (\"Scen, ljud, ljus & bild — klart till ert event.\") tappade \"hyra\" och "
              "\"Stockholm\" och rättades samma dag. Sektioner: hero med fyra växlande eventfoton, "
              "faktarad, åtta kategorikort (hela kortet klickbart, snabbval under), topplistan \"Våra "
              "mest bokade paket\" med flikar per tillfälle (popular.json), referensrad (`hub.start`), "
              "omdömen (live ur admin), Så funkar det, film och slutruta med Fråga Sven. `mobilBar` på. Faktaraden "
              "har samma pil → i alla rutor och \"100+ event per år\" länkar till /referenser/#eventfoton; "
              "logoraden fyller sina rader (Dok 1 §4.3). Kategorikortens "
              "bilder: Ljus = German Beer Hall, Karaoke = `plugg_karaoke_sang` (beskuren så att "
              "låttexten på skärmen inte syns)."),

        ("h1", "9. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v19.1", "2026-11-23",
             "§1 omskriven: menyn ur meny.ts, toppnivå Tjänster · Event · Kunskap · Kontakta oss + Begär offert, "
             "Event med Planera, Kunskap med fyra grupper och 22 länkar, menyregeln, mobilens dragspel. §2 87 filer / "
             "112 sidor. §2.1 Projektering och fast installation, Event-sidan är för tal. §2.3 Event som egen meny. "
             "§2.5 Om oss-historien. §4.1 tolv logotyper ur KUNDLOGOTYPER. §4.2 #eventfoton, 1–6 bilder, nya case. "
             "§4.3 recensioner live. §7 utökat läge i mätningen, llms.txt om Event/Music. §8 faktaraden och logoraden."],
            ["v19.0", "2026-10-18",
             "Omdesignen av alla publika sidor: §2 not om jämförelsen före/efter, §2.3 eventmallen och regeln "
             "att scenpaket inte läggs som paketrad, §2.4 GuideLayout, §2.5 informationssidorna och SidHuvud, "
             "§2.7 ortsmallen, §3 rubrikkomponenterna sköter nav-offset, §5 en knapp och kundläge, §6 "
             "rubriken \"Våra mest bokade paket\" med flikar och hubbarnas övriga delar, §7 sitemap-filtret, "
             "ny §8 Startsidan (historiken flyttad till §9)."],
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
