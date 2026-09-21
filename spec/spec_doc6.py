DOC6 = dict(
    doc_no=6,
    slug="Lardomar_Roadmap",
    title="Lärdomar & Roadmap",
    subtitle="Build-buggar, CSS-mönster, felsökning, backlog, öppna punkter, versionshistorik",
    version="v16.0",
    date="2026-09-21",
    blocks=[
        ("h1", "1. Arbetssätt"),
        ("p", "Implementera → build-verifiera → safety check → commit → push → Netlify auto-deploy "
              "(~2 min) → hård refresh. Direkt implementation framför planeringsdiskussion. Hitta "
              "**alla** instanser av ett fel innan fix — inte bara där det påpekats. Config-beslut "
              "presenteras kort som alternativ; ett väljs och körs."),

        ("h1", "2. Astro / esbuild-buggar"),
        ("ul", [
            "**2.1 Escapad citat i template:** ALDRIG `\\\"` inom Astro-template (HTML-attribut/JSX) — parsern tolkar det som strängavslut. Använd smart-quote, PRIME, skriv om, eller flytta arrayer till frontmatter.",
            "**2.2 Frontmatter vs script-scope:** imports i frontmatter är INTE tillgängliga i `<script>`. Re-importera där. Build varnar INTE.",
            "**2.3 Script är ES-modul:** `onclick`/`onchange` kräver `window.fn = fn;` (gäller även statiska element). Referensfall 2026-07-17: `quotePdfSelected` exponerades inte på window.",
            "**2.4 Mid-fil imports i frontmatter:** en import placerad EFTER kod kan ge esbuild-parsefel (\"Expected ; but found $\") som pekar på fel rad. Placera alltid imports överst.",
            "**2.5 Villkorliga klasser:** använd `class:list={[...]}` när en klass ska sättas beroende på data. Strängkonkatenering fungerar men tappar falsy-filtreringen. Referensfall: crossfade-korten, Dok 1 §4.7.",
        ]),
        ("note", "**2.6 Indexbaserade uppslag i datalistor går sönder (NY 2026-09-20).** `products[0]` "
                 "pekar fel så fort listan omordnas, filtreras eller får en ny post inskjuten. Slå alltid "
                 "upp på `artno`. Efter ljuspaket-omstruktureringen pekade sju guide- och eventsidor på "
                 "fel produkt — de hade alla mönstret `ljusData.paket.products[n]`. Felet ger ingen "
                 "varning: sidan bygger, kortet renderas, bara innehållet är fel."),

        ("h1", "3. Netlify Functions — modulsystem & deploy"),
        ("p", "Roten har `package.json` med `\"type\": \"module\"`. Det läcker ned till "
              "`netlify/functions/` och avgör hur varje funktionsfil laddas. Största "
              "infrastruktur-fällan i projektet."),
        ("ul", [
            "**3.1 CommonJS-funktioner kraschar under type:module.** Fix: `netlify/functions/package.json = {\"type\":\"commonjs\"}` → v1-funktioner (`exports.handler`) laddas korrekt.",
            "**3.2 v2-funktioner (export default) måste vara `.mjs`** under type:commonjs-mappen. Berörda: admin-auth.mjs, google-reviews.mjs, sms-fallback.mjs, sven-chat.mjs, u-resolve.mjs.",
            "**3.3 `.mjs` med lokal import → esbuild-bundler.** nft tracar inte alltid en relativ .mjs-import. Sätt `node_bundler=\"esbuild\"`. Referensfall: sven-chat.mjs → _products-generated.mjs.",
            "**3.4 Verifiera bundling lokalt** med @netlify/zip-it-and-ship-it. Öppna funktions-URL:en: 401 = kör; \"This function has crashed\" = modulproblem.",
        ]),

        ("h1", "4. Databas & migrationer"),
        ("note", "**4.1 Migrationer körs manuellt; migrationsfiler ≠ live-schema.** Kod som lägger till "
                 "en kolumn i SELECT/INSERT måste följas av att `ALTER TABLE` körs mot Supabase. "
                 "Symptom vid glapp: PostgREST 400 \"column X does not exist\" → 500. Diagnos: kör "
                 "funktionsfrågan med `limit=0` mot REST-endpointen; felkroppen namnger kolumnen. "
                 "health-endpoint (§8) gör detta automatiskt."),
        ("note", "**4.1b Defensiva valfria kolumner.** När kod refererar en ny Supabase-kolumn: "
                 "inkludera fältet i skrivning ENDAST när det är satt, och gör läsning/skrivning med "
                 "ett retry UTAN fältet om kolumnen saknas. Då är deploy-ordningen ofarlig."),
        ("p", "**4.2 Katalog-desync:** en prisändring i `src/data/*.json` måste följas av att "
              "generatorerna körs, annars ligger de deriverade katalogerna kvar med gamla värden. En "
              "full deploy självläker. Referensfall: \"Live, XL\" 5999→4999 utan regenerering."),
        ("p", "**4.3 PDF-paginering — tyst cutoff tappar innehåll.** En hård `if (vy > cutoff) return` "
              "tappar allt som inte får plats — tyst. Förmät (`heightOfString`) + "
              "sidbryt/kolumnbalansera. Referensfall 2026-07-22: faktura-villkorens GDPR-paragraf "
              "försvann."),

        ("h1", "5. DOM- & state-synk"),
        ("p", "Efter DOM-mutation (t.ex. `prodDelete`): synka alltid in-memory-state "
              "(`currentCart.items = prodGetItems()`) och anropa `markPanelDirty()`. Annars silent "
              "revert när tab-byten re-renderar från stale minne."),

        ("h1", "6. SEO — lärdomar"),
        ("ul", [
            "**Tunt/föräldralöst programmatiskt lokalinnehåll → doorway.** Google indexerar inte mallade närduplikat utan interna länkar. Fix som fick ortssidorna indexerbara: (a) genuint unikt innehåll per sida, (b) intern länkning från relevant sida, (c) korslänkning mellan syskonsidor.",
            "**Sökords-kannibalisering.** Två sidor som konkurrerar om samma head-term splittrar rankingsignalerna. Gör den ena till hub med bred intent och låt barnsidan äga long-tailen. Referens: /hyra-bild/.",
            "**Google Ads:** 74 % av impression share-förlusten berodde på Quality Score/ranking, inte budget — omstrukturera annonsgrupper före ökad spend.",
        ]),

        ("h1", "7. Process & arbetsmiljö — lärdomar"),
        ("ul", [
            "**Spec ≠ kod: verifiera specen innan \"fix\".** Ett audit-pass ändrade ElTillbehorCard till object-contain — men Dok 1 §3.2 dokumenterade object-cover som ett medvetet beslut. Ändringen återkallades.",
            "**Platshållarvärden i konfig:** föreslagen konfig som ersätter befintliga värden ska fråga efter aktuellt värde eller tydligt markera platshållare. (DMARC-rua-exemplet, Dok 4.)",
            "**Stegvis utrullning av brytande ändringar:** övervakning → delvis → full (reversibel) → enforce. Rena rapporter mellan stegen.",
            "**Cache-fördröjning vid extern ändring:** DNS/DMARC/CDN — downstream ser gammal version 24–72 h. Verifiera direkt mot källan.",
        ]),

        ("h2", "7.1 Git från device_bash — regeln är upphävd (2026-09-20)"),
        ("p", "v15.1 slog fast att git aldrig skulle köras från Cowork-VM:en (device_bash). Två problem "
              "låg bakom, och båda är åtgärdade:"),
        ("ul", [
            "**Falska radslutsdiffar.** Arbetskopian hade CRLF, VM:ens git jämförde mot LF i indexet och listade tusentals filer. **Löst med `.gitattributes` (`* text=auto eol=lf`) + `git add --renormalize`.**",
            "**Kvarlämnat `index.lock`.** Radering var avstängd i kopplade mappar, så VM:en fick inte städa bort låset. **Löst genom att raderingsrättighet numera begärs för repo-mappen när den behövs.**",
        ]),
        ("note", "**Kvar gäller att bygget inte kan verifieras i den monterade mappen** — `node_modules` "
                 "där är installerat för Windows. Molnsessioner klonar repot separat i stället "
                 "(`--depth 1 --filter=blob:none` + sparse-checkout, ~26 s till verifierat bygge). "
                 "Se Dok 1 §1.3."),

        ("h2", "7.2 Städa efter verktygen"),
        ("ul", [
            "Ett byggförsök i fel miljö kan peta i `node_modules` och `package-lock.json`. Kontrollera `git status` efteråt.",
            "Desktop-appen lägger förhandsvisningar i `Claude outputs/` i projektmappen — gitignorerad sedan 2026-09-18.",
        ]),

        ("h2", "7.3 .gitignore gäller aldrig retroaktivt (NY 2026-09-20)"),
        ("note", "Läggs en ignore-rad till måste **`git rm --cached` köras i samma commit**. Annars är "
                 "raden verkningslös och ingen upptäcker det förrän filerna dyker upp i en diff långt "
                 "senare. **Tre gånger i det här repot:** genererade kataloger (ignorerade i juni, "
                 "fortfarande spårade i september), `node_modules` (12 706 filer — `git status` tog "
                 "120 s, `git commit` 170 s), verktygscacher. Alla tre åtgärdade 2026-09-20."),

        ("h2", "7.4 Läs konfigurationen innan du ändrar det den styr (NY 2026-09-20)"),
        ("p", "Tre av fyra fel under ljuspaket-batchen hade undvikits av en enda läsning: "
              "katalogfilerna committades trots att `.gitignore` rad 28–30 uttryckligen förbjöd det; "
              "ett påstående om att produktionen serverade inaktuell katalogdata var fel eftersom "
              "`netlify.toml` regenererar allt före varje bygge. `.gitignore` före `git add`, "
              "`netlify.toml` och `package.json` före påståenden om bygget."),

        ("h2", "7.5 Ett dokument som inte laddas automatiskt driver isär (NY 2026-09-21)"),
        ("note", "Spec-underlaget i juli uppdaterade Dok 1–6 men inte **projektets instruktionsfält** — "
                 "det fält som faktiskt laddas vid varje sessionsstart. Instruktionen var sex månader "
                 "inaktuell innan någon märkte det: den varnade för en FAQ-inkonsistens som var löst, "
                 "listade två komponenter som aldrig funnits, angav fel avsändaradress och fel "
                 "DMARC-policy."),
        ("p", "**Regel:** när ett uppdateringsunderlag skrivs ska instruktionsfältet uppdateras i samma "
              "svep som Dok 1–6. Instruktionsfältet innehåller **regler som ändrar vad man gör** — "
              "inventarier, resonemang och historik hör hemma i dokumenten."),

        ("h2", "7.6 Leveransfiler ska aldrig dela filnamn med indata (NY 2026-09-20)"),
        ("p", "Regenererade manualer lades i `_bilder-inbox/manualer/` bredvid originalen med identiska "
              "filnamn. Originalen laddades upp till Supabase i stället för de nya, och felet upptäcktes "
              "först när PDF:ernas sidhuvud lästes (`SK-LJS-EFF-0010` stod i `SK-LJS-PAK-0018.pdf`). "
              "Lägg färdiga filer i en mapp vars namn säger vad som ska göras med dem — "
              "`_till-supabase/` — aldrig med samma filnamn som en fil i indatamappen."),

        ("h1", "8. Verktyg & felsökning"),
        ("ul", [
            "**health-endpoint:** `GET /.netlify/functions/health` — öppen, läcker aldrig nyckelvärden. Rapporterar env-vars satta, Supabase-reachability, carts_query (namnger saknad kolumn). Första anhalten när admin strular.",
            "**Netlify-cache:** hård refresh (Ctrl+Shift+R); vänta 8–15 s efter deploy före screenshot.",
            "**Verifiera deploy i DOM, inte i HTML-texten.** En HEAD-request mot en ny assetfil avgör på en sekund om deployen landat. `document.querySelectorAll` + `getComputedStyle` visar sedan vad som faktiskt renderas.",
            "**Cachelager utanför CDN:n.** Verktyg som hämtar sidor kan ha egen cache — WebFetch cachar 15 min per URL. Använd cache-buster (`?cb=2`) eller en riktig webbläsare vid verifiering.",
            "**Astro-syntaxkontroll utan full build:** @astrojs/compilers `transform()` kompilerar en enskild .astro-fil och rapporterar diagnostik.",
            "**CSS-debugging:** `getComputedStyle` mer tillförlitligt än källäsning; `getBoundingClientRect()` för overflow.",
            "**Bulk find-replace:** `find . -name \"*.astro\" -exec sed -i` tillförlitligt för sajt-vida token-byten.",
            "**HEIC-bilder:** ImageMagicks libheif är ofta för gammal. `pip install pillow-heif --break-system-packages` + `pillow_heif.register_heif_opener()` läser dem direkt i PIL. Glöm inte `ImageOps.exif_transpose()`.",
            "**Nyckla ut logotyper ur en rasterbild:** när en logotyp ligger som enfärgad figur på enfärgad botten kan alfan räknas per pixel — `t = (lum − lum_bakgrund) / (lum_logo − lum_bakgrund)`. Sätt ett litet alfa-golv (~14/255).",
            "**Video:** `ffmpeg -vf scale=1280:-2 -crf 26 -preset slow -an` håller produktvideor under ~15 MB (Dok 1 §3.4).",
            "**DOCX-generering:** `spec_builder.py` + `spec_doc1–6.py` (python-docx) för specen; `docx`-js via Node för övrigt.",
            "**Extern-API-fullständighet:** Google Places API returnerar max 5 recensioner — underhåll kurerad källa (Supabase).",
        ]),

        ("h1", "9. Roadmap"),
        ("h2", "9.1 Admin-backlog"),
        ("ul", [
            "Inloggat läge sitewide för admin-funktioner",
            "Produktkort i checkout — utveckla + visa på fler ställen",
            "Offertfunktion helt online",
            "Automatisk fakturering i adminvyn",
            "Orderbekräftelse med digital signering",
        ]),

        ("h2", "9.2 Teknisk skuld & härdning"),
        ("ul", [
            "**Generera inventarielistorna ur repot (NY 2026-09-21).** Komponentlistan (Dok 1 §5.1), sidlistan (Dok 3 §2) och ortslistan blir fel inom en månad när de handskrivs. Ett litet skript som läser `src/components/`, `src/pages/` och `orter.json` och skriver tabellerna vore billigare än att korrigera dem i varje genomgång.",
            "**Flytta de fem äldre armatur-manualerna in i repots `manual_generator.py` (NY 2026-09-21).** `EFF-0004`, `DMX-0001`, `ROK-0006`, `EFF-0007`, `EFF-0008` finns bara i projektdokumentets kopia av generatorn.",
            "**Frontend-härdning:** tydlig felruta med \"Försök igen\" vid nätverksfel.",
            "**Migration-hygien:** rutin för `ALTER TABLE` när kod lägger till kolumner (§4.1).",
            "**Priser → JSON (uppskjutet):** hårdkodade priser i markup/meta/prosa går inte att datadriva rent. Trigger: prisbyte som går fel till kund, eller inför priskampanj.",
            "**admin/index.astro (9 200+ rader):** dela upp i komponenter. Trigger: när det blir flaskhals att redigera.",
            "**hyra-bild-led-vagg (1 600 rader):** bryt ut LED-konfiguratorn.",
            "**Katalogkonsolidering:** `order-catalog-flat.json` vs `quote-catalog.json` — gemensam källa. Trigger: tredje konsument.",
            "**FAQ-nyckelstandardisering — LÖST** (allt q/a, Dok 2 §8). Verifierat 2026-09-20: noll förekomster av question/answer.",
            "**`git rm --cached` på de genererade katalogfilerna — LÖST** 2026-09-20, tillsammans med `node_modules` och verktygscacherna (§7.3).",
        ]),

        ("h2", "9.3 På horisonten"),
        ("ul", [
            "Tillgänglighets-/lagerkalender (infrastruktur ~70 %)",
            "Produktmanual-expansion (ljud/DJ + övriga ljus-paket)",
            "DNSSEC-aktivering via Loopia (förberett 23 juni 2026)",
            "MTA-STS på mta-sts.scenkonsult.se",
            "Order & Kommunikation Fas 3: PDF-orderbekräftelse, klick-bekräftelse (utan BankID), TTL-rensning av utgångna carts, SMS-notiser via 46elks",
            "Mobilvy-genomgång 390 px — systematisk review, fokus på tabeller i guider och nav vid 768 px",
            "Avbokningspolicy — synlig rad i bokningsflödet (varukorgen)",
        ]),

        ("h2", "9.4 Öppna punkter"),
        ("ul", [
            "**Lokal SEO — ortssidor:** 26 orter. Utvärdera GSC-indexering och trafik; fler orter/stadsdelar vid behov. Stockholm medvetet ej egen sida (kannibalisering).",
            "**GSC-indexering:** begär omindexering för sidor med content-, länk- och schema-fixar. Submit sitemap (`scenkonsult.se/sitemap-index.xml`).",
            "**DJ Alex:** saknar foto (`DJ_Alex.png` + `dj.json djProfiles`).",
            "**Referenssidan:** fler crossfade-par bland befintliga eventfoton. Kundlogotyperna i högre upplösning; de sju ärvda är nyckade ur en 1600 px-bild.",
            "**Bild-tillbehör (Projektor & skärm):** produktbilder saknas för projektorstativ, 100\" duk, skärmstativ, HDMI, HDMI-splitter, mediaspelare, 23\"-skärm, USB-clicker.",
            "**Google Ads:** lägg till annonsgrupper (Phrase Match), radera gamla svaga keywords. Importera GA4 conversion events när de börjar landa.",
        ]),
        ("note", "**Avfört 2026-09-21:** `public/images/ljud/pp_ljud_tillbehor_DI-palmer.webp` låg "
                 "ospårad och refererades inte. Gammal produkt — filen är raderad."),

        ("h1", "10. Versionshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v16.0", "2026-09-21",
             "Genomgång efter ljuspaket-omstruktureringen och processgenomgången 2026-09-20/21. "
             "Ny §2.6 (indexbaserade uppslag), §7.3 (.gitignore retroaktivt), §7.4 (läs konfigurationen "
             "först), §7.5 (dokument som inte laddas driver isär), §7.6 (leveransfiler vs indata). §7.1 "
             "omskriven — regeln att inte köra git från device_bash är upphävd efter .gitattributes. "
             "§9.2 två nya skuldposter (generera inventarier, flytta armatur-manualerna); FAQ- och "
             "git-rm-posterna markerade lösta. §9.3/§9.4 uppdaterade; DI-palmer-bilden avförd."],
            ["v15.1", "2026-09-18",
             "Referenssidans arbete. Ny §7.1 (kör inte git från device_bash) och §7.2 (städa efter "
             "verktygen). §2.5 class:list. §8 nya verktygsposter. §9.2 git rm --cached."],
            ["v15.0", "2026-07-25",
             "Tvärgående genomgång mot main. Nya lärdomar: §2.4 mid-fil imports, §4.1b defensiva "
             "valfria DB-kolumner, §6 SEO, §7 spec-vs-kod-verifiering."],
            ["v14.0", "2026-07-22", "Innehålls-admin, betalningspåminnelser, faktura-villkor sida 2, Svens kontaktkrav. Ny §4.3 PDF-paginering."],
            ["v13.0", "2026-06-22", "Full restrukturering från monolitisk spec till 6 dokument."],
        ]),

        ("h1", "11. Dokumentstruktur"),
        ("table", [
            ["Dok", "Innehåll", "Version"],
            ["Dok 1", "Grund & Design", "v16.0 (2026-09-21)"],
            ["Dok 2", "Produkter & Data", "v16.0 (2026-09-21)"],
            ["Dok 3", "Sidor & Navigation", "v16.0 (2026-09-21)"],
            ["Dok 4", "Kommunikation", "v16.0 (2026-09-21)"],
            ["Dok 5", "Order, Admin & Infra", "v16.0 (2026-09-21)"],
            ["Dok 6", "Lärdomar & Roadmap (detta)", "v16.0 (2026-09-21)"],
        ]),
        ("note", "**Princip:** inget addendum-staplande. När en uppgift ändras — rätta den på plats i "
                 "rätt dokument och bumpa versionsraden. Repots `main` är alltid facit; specen "
                 "beskriver, styr inte koden. **Och: uppdatera projektets instruktionsfält i samma "
                 "svep** (§7.5)."),
    ],
)
