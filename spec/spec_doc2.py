DOC2 = dict(
    doc_no=2,
    slug="Produkter_Data",
    title="Produkter & Data",
    subtitle="JSON-arkitektur, artikelnummerprinciper, kategoriordning, konsolideringar, fraktflaggor",
    version="v17.1",
    date="2026-10-05",
    blocks=[
        ("h1", "1. JSON-first — ofravikligt"),
        ("note", "**Hårdkoda ALDRIG produkter i .astro-filer.** Allt produktinnehåll bor i "
                 "`src/data/*.json`. ~90 % av innehållsändringar görs i JSON."),
        ("p", "**Vid prisändring eller ny produkt:** uppdatera JSON, kör sedan byggsekvensen "
              "(Dok 1 §1.1). En fysisk produkt = **ett** artikelnummer. Tilldela aldrig två artnos till "
              "samma fysiska föremål. Principerna i sin helhet: §7."),
        ("note", "**Build-time-validering:** `generate-quote-catalog.py` avslutar med `sys.exit(1)` om "
                 "något artno saknas i katalogen — Netlify avbryter deploy vid desync. `EXCLUDE_ARTNOS` "
                 "dokumenterar avsiktliga undantag (SK-SCN-TAK-0001/0002)."),
        ("note", "**Katalog-desync:** en JSON-ändring utan build regenererar inte de deriverade "
                 "katalogerna → produktsidan visar nytt pris medan offert och Sven citerar det gamla. "
                 "En full deploy självläker; manuella redigeringar kräver `npm run generate-catalogs`. "
                 "Se Dok 6 §4.2."),

        ("h1", "2. Datafiler i src/data/"),
        ("table", [
            ["Fil", "Innehåll"],
            ["site.json", "Företagsdata (`company`: name, legalName, orgNr, openingHours …), globala texter (featuredClients BORTTAGET — se not nedan)"],
            ["scenes.json", "Scen-paket + tillbehör (tillbehor[])"],
            ["ljud.json", "Ljud: portable / event / music / live / mixers"],
            ["ljus.json", "Ljus: paket (paketLayout + gruppen scenpaket, §6), effekter, rök/pyro, stativ/tross, dmx.tillbehor (bord i prisordning → splitter/förstärkare → kablar)"],
            ["bild.json", "Bild: projektor/skärm, intro, categories[]"],
            ["led-paneler.json", "LED-vägg-paneler"],
            ["dj.json", "DJ-paket + djProfiles"],
            ["dj-konkurrentdata.json", "Jämförelsedata DJ-guide"],
            ["el.json", "El-tillbehör (SK-EL-0001..0014)"],
            ["karaoke.json", "Karaoke-kategori"],
            ["tjanster.json", "Tjänster + leverans/montering (inkl. `montering.modell`, §5.1)/tillägg/fakturaavgift/hyresdagar (§5.2)"],
            ["ljudtekniker.json", "Ljudtekniker-profiler"],
            ["orter.json", "Orter för lokal SEO — 26 orter (Dok 3 §2.6)"],
            ["clients.json", "Referenskunder — synkas från Supabase vid build"],
            ["reviews.json", "Recensioner — synkas från Supabase vid build"],
        ]),
        ("note", "**Det finns ingen `frakt.json`.** Namnet levde kvar i projektets instruktionsfält ända "
                 "till 2026-09-21. Fraktlogiken ligger i `tjanster.json` (leverans/montering/tillägg) "
                 "plus fraktflaggor på produkterna (§5)."),
        ("note", "Kundlistan och recensionerna underhålls i **Supabase**. `google-reviews-cache.json` är "
                 "raderad (skrevs men lästes aldrig). `site.json.featuredClients` är borttaget — utvalda "
                 "kunder styrs av `featured`-flaggan i clients-tabellen (fallback: kurerad kodlista i "
                 "`src/utils/clients.ts`, `getFeaturedClients()`)."),

        ("h2", "2.1 Genererade filer — committas aldrig"),
        ("table", [
            ["Fil", "Byggs av"],
            ["src/data/quote-catalog.json", "generate-quote-catalog.py"],
            ["src/data/order-catalog-flat.json", "generate-quote-catalog.py"],
            ["netlify/functions/_products-generated.mjs", "netlify/generate-products.mjs"],
            ["public/Scenkonsult_Produktkatalog.xlsx", "generate-excel.mjs"],
            ["src/data/montering-catalog.json", "generate-quote-catalog.py (NY 2026-09-28, §5.1)"],
            ["public/llms.txt", "scripts/generate-llms.mjs (NY 2026-10-02 — Dok 3 §7)"],
        ]),
        ("note", "**Avspårade ur git 2026-09-20.** Ignore-reglerna skrevs redan i juni men fick aldrig "
                 "effekt, eftersom `git rm --cached` aldrig kördes — `.gitignore` gäller aldrig "
                 "retroaktivt. Filerna låg därför kvar som spårade och dök upp som modifierade i varje "
                 "`git status`. Se Dok 6 §7.3."),
        ("p", "Katalog-JSON-filerna ligger fysiskt i `src/data/` men är byggartefakter, inte "
              "innehåll. Redigera dem aldrig för hand."),
        ("note", "**llms.txt var handskriven fram till 2026-10-02 och stod still sedan april** — scenpriser "
                 "~50 % för höga, gamla ljuspaketnamn, fel DJ- och leveranspriser, en projektor som inte "
                 "fanns. ChatGPT citerade den. Nu byggs den ur datafilerna; utgångna produkter och "
                 "redirect-sidor filtreras bort, och länkar utan sida i `src/pages/` loggas som varning."),

        ("h1", "3. Kategori-prioriteringsordning"),
        ("note", "**Genomgående ordning för all kommunikation: Scen · Ljud · Bild · Ljus · DJ**"),
        ("p", "Genomförd i: mail-templates, page titles (\"Hyra Scen, Ljud & Bild\"), descriptions, "
              "dropdown, mobilmeny, footer, frontpage-grid och JSON-LD schema. **Bild ligger före Ljus** "
              "i hela strukturen. Tekniska tjänstebeskrivningar är inte omordnade."),

        ("h1", "4. Dataarkitektur — konsolideringar"),
        ("h2", "4.1 El-tillbehör (el.json)"),
        ("p", "14 artiklar SK-EL-0001..0014. Importeras i 8 sidor (4 ljud + 4 ljus). Gamla "
              "`SK-LJD-EL-*` och `SK-LJS-EL-*` borttagna."),
        ("p", "**Categories-konvention:** ingen flagga → visas på alla sidor · `categories:[\"ljud\"]` → "
              "bara ljud-sidor · `categories:[\"ljus\"]` → bara ljus-sidor "
              "(filtrering: `!p.categories || p.categories.includes(\"ljus\")`)."),

        ("h2", "4.2 Live ↔ Music-konsolidering"),
        ("p", "Live-kategorin delar paket med Music via MUS-artnos, men behåller egna unika "
              "LIV-artiklar. `ljud.json live.products` innehåller LIV-0001 (Small 499), LIV-0002 "
              "(Medium 1199), LIV-0004 (Medium+ 1399), LIV-0003 (Large 1999), LIV-0005 (Large+ 2299) "
              "och MUS-0008 (Live, XL 4999). Live-sidan itererar: "
              "`[...live.products, ...music.products.filter(p => p.categories?.includes(\"live\"))]`."),

        ("h2", "4.3 scenes.json"),
        ("p", "`products[]` (scenpaket), `tillbehor[]` (18 poster 2026-10-02), `pipeDrape[]` och "
              "`modules[]` (plattformarna 1×1 och 1×2). `accessories[]` är borttaget. "
              "`SceneConfigurator` och `DynamicPaketCard` läser `tillbehor`; scen- och tillbehörssidan filtrerar "
              "fram kjolarna ur `tillbehor` och skickar dem till `ScenkjolCard`."),
        ("ul", [
            "**Scenkjolar (2026-09-28):** rak 4 m för 20/40/60 cm (ACC-0011/0017/0003) och veckad 2 m för 40/60 cm (ACC-0009/0018). Fältet `skirtStyle` anger modellen. Visas som ett `ScenkjolCard` med höjd- och modellval, inte som separata tillbehörskort. Konfiguratorn räknar segment per vald modell (`SKIRT_BY_HEIGHT[höjd][modell]`).",
            "**Höjdregler (2026-09-28):** 1×2-plattformen finns i 20, 40 och 60 cm; 1×1 endast i 40 cm. Vid 20 cm låses trappor till 0.",
            "**Underlag:** monteringen förutsätter plant underlag (tumregel ca 5 cm höjdskillnad). Justerbara ben om kunden meddelar vid bokning — står på scensidan (#underlag), i FAQ, i varukorgen och i Svens fakta.",
            "**Nya tillbehör sedan v16:** Filtmatta svart ACC-0015 (149 kr/m²) och Rullstolsramp i aluminium ACC-0016.",
        ]),

        ("h2", "4.4 Tjänster (tjanster.json.services)"),
        ("p", "6 unika produktkortstjänster med `categories[]`. Duplikat eliminerade. Bevarat orört: "
              "leverans/montering/tillägg/fakturaavgift (checkout/cart auto-logik)."),
        ("note", "**Leverans-data (rättad 2026-10-02):** alla LEV-poster följer nu tur & retur = "
                 "enkelresa × 2 — även SK-LEV-0003 (Lätt lastbil), vars tidigare rabatt (1 299/2 399 kr) "
                 "inte längre gäller. Aktuella priser står i `tjanster.json → leverans`; specen listar "
                 "dem inte."),

        ("h1", "5. Fraktflaggor"),
        ("note", "**Kärnregel:** transport, frakt och montering **ingår ALDRIG** i priset — inte ens för "
                 "stora scenpaket eller skrymmande skärmar. Skriv alltid \"tillkommer\" eller "
                 "\"offereras separat\", aldrig \"ingår\"."),
        ("table", [
            ["Produkt", "Fraktflagga"],
            ["Concert (LIV-0007 + MUS-0008)", "storbil_slap"],
            ["Line Array Small (LIV-0008 + MUS-0009)", "lastbil"],
            ["Line Array Medium (LIV-0009 + MUS-0010)", "lastbil"],
            ["LED-trailers (BLD-0006/0011/0012)", "extern_lev (SK-LEV-0007, 12 000 kr)"],
            ["Live/Music XXL (LIV-0006 + MUS-0007)", "bulky:true (skrymmande / bil med släp)"],
        ]),
        ("p", "**Regel:** `bulky=true` räknas i bulkyCount-regeln (≥2 → storbil_slap). `forceLeverans` "
              "tvingar specifik leverans. `ProductCard.astro` accepterar `bulky` + `forceLeverans` i "
              "Props. `CartButton` har `data-force-leverans`."),

        ("h2", "5.1 Montering — en gemensam beräkning (NY 2026-09-28)"),
        ("p", "Montering och demontering räknas fram ur produkternas egna tider av **en** motor, "
              "`src/lib/montering.cjs` (UMD: `require` i Netlify-funktioner, inline i `Layout.astro` som "
              "`window.SkMonteringLib` / `window.skMontering`). Varukorgen, scenkonfiguratorn, "
              "scenpaketkorten, admins offert och serverfunktionerna (`skicka-offert` räknar om, "
              "`admin-send-quote` loggar avvikelse) använder samma kod. Test: `test/montering.test.mjs`."),
        ("note", "**Undantag: LED-väggen** räknar sin tid själv på LED-sidan ur "
                 "`led-paneler.json → tillbehor.montering` (avrundning 30 min) och lägger den på "
                 "varukorgsraden som `assemblyMinutesTotal` + `assemblyBemanning` (2 tekniker). Motorn "
                 "multiplicerar bara — sida och kassa visar därför samma belopp."),
        ("table", [
            ["Fält på produkten", "Betydelse"],
            ["monteringMin", "Minuter per styck (total tid, inte per person). Tomt = saknas, 0 = monteras inte. Underhålls i /admin/produkter/ (kolumn Montering)"],
            ["monteringBemanning", "Antal tekniker (default `tjanster.json → montering.bemanning` = 1). LED-väggen: `led-paneler.json → tillbehor.montering.bemanning` = 2"],
            ["monteringSkalning", "`styck` (default) · `tung` · `yta` · `fast` (t.ex. DJ-paketens rigg 60 min, ingen demontering)"],
            ["monteringManuell", "Offereras separat (LED-trailrar)"],
        ]),
        ("p", "Parametrarna står i `tjanster.json → montering.modell`: radtid = tid × antal^k "
              "(k styck 0,65 / tung 0,85 / yta 0,37), småtillbehör räknas i en gemensam pott, montering "
              "+ demontering = × 2, teknikerminuter för **hela ordern** avrundas uppåt till 15 min "
              "(minst 15). Timpris och minimidebitering står i `tjanster.json → montering`. "
              "`generate-quote-catalog.py` bygger `montering-catalog.json` och **varnar för aktiva "
              "produkter utan tid**."),
        ("note", "**Kundvänt heter raden \"Montering & demontering (beräknad)\".** Varukorgen visar "
                 "beräknad teknikertid och att priset kan justeras efter genomgång av plats och "
                 "upplägg. Ingen tid stämplas längre på varukorgsraderna — motorn slår upp den på "
                 "artikelnummer vid varje beräkning."),

        ("h2", "5.2 Hyresdygn och flerdygnsrabatt"),
        ("p", "Infört 2026-08 men saknades i specen före v17. Raden bär `unit_price` (listpris per dygn — "
              "ändras aldrig av rabatt), `days`, `day_factor` (Σ (1 − rabatt/100)) och "
              "`price = round(unit_price × day_factor)`; `qty` är alltid antal enheter, aldrig "
              "antal × dagar. Logiken ligger i `src/lib/day-pricing.js`, parametrarna i "
              "`tjanster.json → hyresdagar` (`satser`, `standard`, `fortsattning`, `maxDygn`, "
              "`kundtext`). Tester: `day-pricing`, `admin-days-flow`, `offertmodal-days`, "
              "`inga-satser-kundvant`."),
        ("note", "**Rabattstegen är intern prispolicy och publiceras aldrig.** Kundvända vyer visar "
                 "dygnspriset och vad kunden sparar i kronor — aldrig satserna. Testet "
                 "`inga-satser-kundvant` vaktar det. Kunden ser bara `hyresdagar.kundtext`."),

        ("h1", "6. Ljuspaket — omstrukturerade 2026-09-20"),
        ("table", [
            ["Artno", "Namn", "Kapacitet", "Pris exkl"],
            ["SK-LJS-PAK-0018", "Ljuspaket, Small", "Upp till 20 pers.", "199"],
            ["SK-LJS-PAK-0019", "Ljuspaket, Small Duo", "Upp till 40 pers.", "379"],
            ["SK-LJS-PAK-0020", "Ljuspaket, Small+", "Upp till 30 pers.", "299"],
            ["SK-LJS-PAK-0021", "Ljuspaket, Small+ Duo", "Upp till 50 pers.", "579"],
            ["SK-LJS-PAK-0001", "Ljuspaket, Medium", "Upp till 40 pers.", "399"],
            ["SK-LJS-PAK-0022", "Ljuspaket, Medium Duo", "Upp till 60 pers.", "799"],
            ["SK-LJS-PAK-0002", "Ljuspaket, Medium+", "Upp till 40 pers.", "599"],
            ["SK-LJS-PAK-0023", "Ljuspaket, Medium+ Duo", "Upp till 60 pers.", "1099"],
            ["SK-LJS-PAK-0024", "Ljuspaket, Medium+ Duo DMX", "Upp till 60 pers.", "1299"],
            ["SK-LJS-PAK-0025", "Ljuspaket, Medium++", "Upp till 60 pers.", "899"],
        ]),
        ("ul", [
            "`PAK-0001` och `0002` är **samma fysiska riggar som tidigare** (hette Small och Small+), oförändrat pris. Endast namnen byttes.",
            "`PAK-0003`–`0006` är pensionerade: `active: false` + namnsuffix `(utgått)`.",
            "`0012`–`0015` är oanvända luckor — återanvänds inte.",
            "`SK-LJS-EFF-0020/0021` är reserverade om Kaleidoskop och Mini Spider ska kunna hyras styckvis.",
            "**Gruppen `scenpaket`** (fältet `group`) samlar Scenpaket I (PAK-0016), Scenpaket II (PAK-0017) och Följespot Eurolite SL-575 (PAK-0026, ny 2026-09-28). Den renderas i en egen sektion på Färdiga paket, utanför `paketLayout`.",
            "Large–XL+ (PAK-0007–0011) är `single`-platser i `paketLayout`.",
        ]),
        ("note", "**Slugarna på `PAK-0001` och `0002` rördes inte.** De heter fortfarande `ljus-small` "
                 "och `ljus-small-plus` trots att produkterna nu heter Medium och Medium+. Hade "
                 "`PAK-0001` fått slug `ljus-medium` vid namnbytet hade den krockat med pensionerade "
                 "`PAK-0004`, som redan har den sluggen — och gamla ordrar hade slagit upp fel produkt. "
                 "Se §7."),

        ("h2", "6.1 Datastruktur — paketLayout"),
        ("p", "`ljus.json → paket` har fått en layoutlista i stil med `mixerLayout` i `ljud.json`. Den "
              "styr vilka kort sidan renderar och i vilken ordning, oberoende av produktarrayens "
              "sortering. Två slot-typer:"),
        ("code", '{ "type": "group",  "title": "Ljuspaket, Small", "selectLabel": "Välj storlek",\n'
                 '  "members": ["SK-LJS-PAK-0018", "SK-LJS-PAK-0019"] }\n'
                 '{ "type": "single", "artno": "SK-LJS-PAK-0025" }'),
        ("p", "En `group` renderas som ett `PaketVariantCard` med knappväljare; en `single` som ett "
              "vanligt kort. Varje produkt har dessutom fått `variantLabel` (knapptexten, t.ex. "
              "\"Upp till 40 pers.\") och `active` (false = pensionerad)."),
        ("note", "**Sidan filtrerar på `active !== false` och slår upp på `artno`, aldrig på index.** "
                 "Indexbaserade uppslag (`products[0]`) pekade fel på fem guide- och eventsidor efter "
                 "omstruktureringen. Se Dok 6 §2.6."),

        ("h1", "7. Artikelnummerprinciper (NYTT AVSNITT 2026-09-21)"),
        ("p", "Format `SK-<KAT>-<TYP>-<NNNN>`, t.ex. `SK-LJS-PAK-0018`. Dessa regler styr hela "
              "sortimentet och är förutsättningen för att gamla ordrar och offerter ska gå att läsa om "
              "flera år."),
        ("ul", [
            "**En hyrbar rad = ett artikelnummer.** En Duo är två fysiska riggar och en egen pris- och lagerrad — den får eget nummer, inte en variant-flagga på basen.",
            "**Ett befintligt nummer byter aldrig fysisk produkt.** Namn får bytas, nummer får aldrig återanvändas. Ett pensionerat nummer blir en lucka, inte en återvunnen plats.",
            "**Utgångna produkter får `\"active\": false` och namnsuffix `(utgått)`.** De ligger kvar i datafilen och i katalogerna så att gamla ordrar och offerter kan slå upp dem, men renderas aldrig på sajten.",
            "**`slug` är fallback-nyckel för gamla ordrar i katalogen.** Ändra den aldrig på en befintlig post, inte ens när namnet byts. Det är den regel som gör att omstruktureringen 2026-09-20 kunde göras utan att röra historiken.",
            "**Manualer namnges efter paketets artikelnummer, inte armaturens.** Varianter länkar till basens manual. Manualer i Supabase Storage: `manualer/[ARTNO].pdf`.",
            "**Ordrar lagrar egen kopia av namn och pris** i `carts.items` (JSONB). Namnbyten skriver alltså inte om någon historik — en order från 2025 visar det namn och pris som gällde då.",
        ]),
        ("note", "**Konsekvensen av de två sista punkterna:** namn är fri text, nummer och slug är "
                 "identitet. Byt gärna namn när sortimentet ändras — men rör aldrig numret eller "
                 "sluggen på en post som kan finnas i en gammal order."),

        ("h1", "8. FAQ-nycklar — standardiserat"),
        ("note", "**Löst sedan v15.** Alla datafiler och mallar använder `q` / `a`. Verifierat "
                 "2026-09-20: noll förekomster av `question`/`answer` i repot. Den tidigare "
                 "inkonsistensen (ljus.json använde `question`/`answer`) och backlog-posten i Dok 6 är "
                 "avförda."),
        ("p", "Inline-FAQ som tidigare låg hårdkodad i vissa .astro-sidor (moving-heads, pa-anlaggning, "
              "kolumnhogtalare) är flyttad till respektive JSON (q/a), 2026-07-24 — byte-identisk "
              "renderad HTML + schema.org FAQPage."),

        ("h1", "9. Bild-kategorin"),
        ("p", "Bild har egen hub `/vara-tjanster/hyra-bild/index.astro` likt ljud/ljus. Sub-sidorna "
              "ligger på top-level (`hyra-bild-projektorer-skarmar`, `hyra-bild-led-vagg`) av historiska "
              "skäl — hubben länkar till dem. `bild.json` har `intro` + `categories[]` "
              "(4 sub-kategorier)."),
        ("note", "**Hub-omfokusering (2026-07-25):** hubbens meta ändrad till bred intent (\"Hyra Bild & "
                 "AV-teknik Stockholm\") så den inte kannibaliserar projektorer-skarmar-sidans long-tail "
                 "(\"Hyra Projektor & Storbildsskärm\"). Frontpage-kortet pekar på hubben (Dok 3)."),

        ("h1", "10. Karaokebyggaren (NY 2026-10-05)"),
        ("p", "`/vara-tjanster/hyra-karaoke/` säljer inte längre färdiga paket. Kunden bygger sin "
              "uppsättning av vanliga artiklar och varje val läggs i varukorgen som egen rad. "
              "`karaoke.json → builder` innehåller **bara artikelnummer** — namn, pris, cart-ID och "
              "fraktflaggor slås upp i ljud/bild/ljus/dj.json av `src/lib/karaoke-builder.mjs`, som "
              "använder samma källor och cart-ID-regel som Svens register."),
        ("table", [
            ["Del av builder", "Innehåll"],
            ["slots", "En post per val: `options[]` med `id`, `artno` (null = kundens egen), `qty`, "
                      "`label`, `sub`. `required` = måste väljas, `toggle` = av/på, `showIf` = visas bara "
                      "för en viss bildtyp (duk och projektorbord med projektor, golvstativ med skärm), "
                      "`groups` = bildtyperna Egen skärm / Projektor / Skärm"],
            ["tabs", "Flikarnas ordning: Högtalare · Mikrofoner · Mixer · Bild · Dator · Ljus · Rök"],
            ["presets", "Snabbvalen Hemmafest / Fest / Gala (`sel` = fullständigt urval)"],
            ["guide", "\"Hjälp mig välja\": fyra frågor (antal gäster, var texten ska synas, hur mycket "
                      "fest, karaokevärd) där varje svar sätter en del av urvalet"],
        ]),
        ("ul", [
            "**Från-priset** (karaokesidans titel/hero, startsidans banner, företagsfest, llms.txt, "
            "Sven) = billigaste obligatoriska uppsättning, `minTotal()`. Skrivs aldrig in för hand; "
            "`{fran}` i `karaoke.json → metaTitle/metaDescription` ersätts vid bygget.",
            "**SK-KAR-PAK-0001–0006** är `active: false` + `(utgått)`. De ligger kvar för gamla "
            "ordrar; Sven och llms.txt tar bara med aktiva paket.",
            "**Ny artikel SK-BLD-ACC-0029 Bärbar dator** (500 kr, `bild.json → tillbehor`, grupp "
            "`signal`). Neutralt nummer — datorn hyrs även till presentationer.",
            "**DJ-bord SK-DJ-0005** heter \"Teknikbord\" i byggaren. Samma artikel, annan etikett.",
            "**Karaokerabatt** (`builder.rabatt.steg`): 0–5 produkter 0 %, 6–8 5 %, 9–12 8 %, 13+ 10 %. "
            "Räknas på **antal produkter i styck** (2 mikrofoner = 2) som lagts via byggaren — raderna "
            "får flaggan `kb`. Tjänster rabatteras inte. I varukorgen är rabatten en egen rad "
            "(id `karaoke-rabatt`, `type: rabatt`, negativt pris, kategori Tillägg) som räknas om vid "
            "varje ändring och följer med offerten. Montering hoppar över rabattrader; flerdygn "
            "rabatteras inte om raden (Tillägg).",
            "**Kundens egna saker** (egen skärm, egen dator) visas i sammanfattningen med `ownLabel`, t.ex. "
            "\"Karaokeappen körs på er egen dator eller telefon\". De läggs inte i varukorgen.",
            "**Karaokevärd SK-TJN-0004** (900 kr/tim, `tjanster.json → services`, `type: service`, resa "
            "tillkommer). Valen 2/3/4 timmar sätter `qty` = timmar. Byggaren summerar värden separat "
            "från dygnshyran, och raden dygnsprissätts aldrig (SK-TJN-prefixet).",
            "Builder-alternativen anger artikeln i fältet **`art`**, inte `artno` — annars läser "
            "katalog- och monteringsgeneratorerna dem som egna produkter och skapar falska alias "
            "(`ja`, `fest`, `100` …). Upptäckt och rättat 2026-10-05.",
            "Mikrofoner: 2 st kabel eller trådlösa (qty 2) eller Shure SLXD (ett system med två mikrofoner). "
            "Mixerbordet är alltid med.",
        ]),
        ("note", "**Scenens bildlager** ligger i `public/images/karaoke/scen/` (1600×900 + `-800`-variant, "
                 "transparent WebP). Varje komponent är redan placerad i bilden, så sidan staplar bara "
                 "lager. Koordinaterna för dukytor, projektorer och ljusarmaturer står i "
                 "`src/data/karaoke-scen.json` och hör ihop med bilderna — byts en bild ska geometrin "
                 "göras om samtidigt. Namn: `<plats>_<artno>.webp`."),

        ("h1", "11. Redaktionellt undantag"),
        ("p", "`varfor-numark-denon-rane.astro` behåller **avsiktligt** redaktionellt innehåll "
              "(beskrivning/bra_for/spec) i `const guideContent` — guidens röst ≠ produktdata, markerat "
              "med kodkommentar. Namn, pris och schema dras dock från JSON."),

        ("h1", "12. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v17.1", "2026-10-05",
             "Ny §10 Karaokebyggaren: karaoke.json.builder (slots/tabs/presets/guide), "
             "karaoke-builder.mjs, karaoke-scen.json och bildlagren. KAR-PAK-0001–0006 utgångna. Ny "
             "artikel SK-BLD-ACC-0029 Bärbar dator och tjänsten SK-TJN-0004 Karaokevärd. Karaokerabatt "
             "(rabattrad i varukorgen). §10–11 omnumrerade."],
            ["v17.0", "2026-10-02",
             "Ny §5.1 Montering — en gemensam beräkning (montering.cjs, monteringMin/-Bemanning/"
             "-Skalning/-Manuell, montering-catalog.json). Ny §5.2 Hyresdygn och flerdygnsrabatt "
             "(saknades sedan augusti). §4.3 scenes.json omskriven: 18 tillbehör (var felaktigt 6), "
             "scenkjolar rak/veckad, höjdregler, underlag, nya tillbehör. §4.4 leveransnoten rättad "
             "(LEV-0003 följer nu ×2). §6 gruppen scenpaket inkl. Följespot PAK-0026. §2/§2.1 site.json-"
             "fält, ljus.json dmx, genererade montering-catalog.json och llms.txt + not. Produkter och "
             "prisändringar 09-22–09-28 (EFF-0022, DMX-0011–0018, DJ-0018, BLD-0015, DJ-paket +800 kr, "
             "AI-specialist 2 500 kr) ligger i datafilerna och listas inte här."],
            ["v16.0", "2026-09-21",
             "**Nytt §7 Artikelnummerprinciper** — reglerna som styr sortimentet och skyddar "
             "orderhistoriken saknades helt i specen. §6 ljuspaketen omstrukturerade (10 aktiva artnos, "
             "0003–0006 pensionerade) + ny §6.1 paketLayout/variantLabel/active. Ny §2.1 genererade "
             "filer (avspårade 2026-09-20). §2 datafillistan verifierad mot repo; frakt.json-noten "
             "skärpt. §2 orter 25 → 26. FAQ-avsnittet flyttat till §8, bild till §9."],
            ["v15.0", "2026-07-25",
             "§2 google-reviews-cache raderad; featuredClients borttaget ur site.json. §4.1 "
             "LjusTillbehor-referens borttagen. SK-LEV-0003-rättning. FAQ standardiserad till q/a. "
             "Bild-hub-omfokusering."],
            ["v14.0", "2026-07-22", "§2 Supabase-synkade clients/reviews. §4.2 LIV-0004/0005. Katalog-desync-callout."],
            ["v13.0", "2026-06-22", "Full restrukturering. Rättelser: ingen frakt.json, el-konsolidering, kategori-ordning."],
        ]),
    ],
)
