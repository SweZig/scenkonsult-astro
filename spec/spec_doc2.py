DOC2 = dict(
    doc_no=2,
    slug="Produkter_Data",
    title="Produkter & Data",
    subtitle="JSON-arkitektur, artikelnummerprinciper, kategoriordning, konsolideringar, fraktflaggor",
    version="v16.0",
    date="2026-09-21",
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
            ["site.json", "Företagsdata, globala texter (featuredClients BORTTAGET — se not nedan)"],
            ["scenes.json", "Scen-paket + tillbehör (tillbehor[])"],
            ["ljud.json", "Ljud: portable / event / music / live / mixers"],
            ["ljus.json", "Ljus: paket (paketLayout, §6), effekter, rök/pyro, stativ/tross"],
            ["bild.json", "Bild: projektor/skärm, intro, categories[]"],
            ["led-paneler.json", "LED-vägg-paneler"],
            ["dj.json", "DJ-paket + djProfiles"],
            ["dj-konkurrentdata.json", "Jämförelsedata DJ-guide"],
            ["el.json", "El-tillbehör (SK-EL-0001..0014)"],
            ["karaoke.json", "Karaoke-kategori"],
            ["tjanster.json", "Tjänster + leverans/montering/tillägg/fakturaavgift"],
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
        ]),
        ("note", "**Avspårade ur git 2026-09-20.** Ignore-reglerna skrevs redan i juni men fick aldrig "
                 "effekt, eftersom `git rm --cached` aldrig kördes — `.gitignore` gäller aldrig "
                 "retroaktivt. Filerna låg därför kvar som spårade och dök upp som modifierade i varje "
                 "`git status`. Se Dok 6 §7.3."),
        ("p", "De två katalog-JSON-filerna ligger fysiskt i `src/data/` men är byggartefakter, inte "
              "innehåll. Redigera dem aldrig för hand."),

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
        ("p", "`accessories[]` borttaget (var dubblettkopia). Endast `tillbehor[]` kvar med 6 "
              "scen-tillbehör (Scentrapp 40/60, Scenkjol, Backdrop 3,5×2,5, Skyddsräcke 1,0/2,0). "
              "`SceneConfigurator` + `DynamicPaketCard` använder `tillbehor`."),

        ("h2", "4.4 Tjänster (tjanster.json.services)"),
        ("p", "6 unika produktkortstjänster med `categories[]`. Duplikat eliminerade. Bevarat orört: "
              "leverans/montering/tillägg/fakturaavgift (checkout/cart auto-logik)."),
        ("note", "**Leverans-data:** SK-LEV-0003 (Lätt lastbil) — 1299 kr enkel resa · 2399 kr tur & "
                 "retur (medveten rabatt som bryter enkelresa×2-mönstret; övriga LEV-poster följer ×2)."),

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

        ("h1", "10. Redaktionellt undantag"),
        ("p", "`varfor-numark-denon-rane.astro` behåller **avsiktligt** redaktionellt innehåll "
              "(beskrivning/bra_for/spec) i `const guideContent` — guidens röst ≠ produktdata, markerat "
              "med kodkommentar. Namn, pris och schema dras dock från JSON."),

        ("h1", "11. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
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
