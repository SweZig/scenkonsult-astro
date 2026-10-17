DOC6 = dict(
    doc_no=6,
    slug="Lardomar_Roadmap",
    title="Lärdomar & Roadmap",
    subtitle="Build-buggar, CSS-mönster, felsökning, backlog, öppna punkter, versionshistorik",
    version="v18.1",
    date="2026-10-17",
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
            "**3.2 v2-funktioner (export default) måste vara `.mjs`** under type:commonjs-mappen. Berörda: admin-auth.mjs, sms-fallback.mjs, sven-chat.mjs, u-resolve.mjs.",
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
        ("p", "**4.4 PDFKit lägger själv till en sida för varje `text()` under bottenmarginalen.** Med "
              "absoluta koordinater hamnar då varje element efter en lång tabell på en egen sida — "
              "faktura K2179 med 25 rader blev 14 sidor, \"Att betala\" och beloppet på olika sidor. "
              "Kontrollera utrymmet före varje block (`_pdf-paging.js`, `ensureSpace()`), bryt tabeller "
              "rad för rad och håll ihop summa- och betalningsblock. Rättat 2026-09-30."),

        ("h1", "5. DOM- & state-synk"),
        ("p", "Efter DOM-mutation (t.ex. `prodDelete`): synka alltid in-memory-state "
              "(`currentCart.items = prodGetItems()`) och anropa `markPanelDirty()`. Annars silent "
              "revert när tab-byten re-renderar från stale minne."),

        ("h1", "6. SEO — lärdomar"),
        ("ul", [
            "**Tunt/föräldralöst programmatiskt lokalinnehåll → doorway.** Google indexerar inte mallade närduplikat utan interna länkar. Fix som fick ortssidorna indexerbara: (a) genuint unikt innehåll per sida, (b) intern länkning från relevant sida, (c) korslänkning mellan syskonsidor.",
            "**Sökords-kannibalisering.** Två sidor som konkurrerar om samma head-term splittrar rankingsignalerna. Gör den ena till hub med bred intent och låt barnsidan äga long-tailen. Referens: /hyra-bild/.",
            "**Google Ads:** 74 % av impression share-förlusten berodde på Quality Score/ranking, inte budget — omstrukturera annonsgrupper före ökad spend.",
            "**Byt titlar och termer utan att byta URL** (2026-10-02). Ljudsidan fick \"högtalare\" i titel och H1 men behöll \"ljudanläggning\" och \"hyra ljud\"; eventsidans H1 lämnades orörd. Det som rankar idag ska ha något kvar att stå på. Begär omindexering i GSC efteråt.",
        ]),
        ("h2", "6.1 AI-synlighet — lärdomar (NY 2026-10-02)"),
        ("ul", [
            "**AI-assistenter läser llms.txt, JSON-LD och Google-profilen som sanning.** En handskriven llms.txt som stått still i sex månader gav ChatGPT scenpriser ~50 % för höga. Allt som AI kan citera ska genereras ur samma data som sajten.",
            "**Samma uppgift på flera ställen glider isär.** Öppettiderna stod på fyra olika sätt (specen, JSON-LD, kontaktsidan, Google-profilen), och bolagsnamnet i tre varianter. Välj en källa (`site.json`, Google-profilen för tider) och låt resten läsa därifrån.",
            "**ChatGPT hämtar betyg och företagskort från Google-profilen** — den syns direkt i svaren. Utfall 2026-10-02: Scenkonsult först på \"ljud, ljus och scen till 100 personer\" men utanför topp 5 på \"hyra högtalare\".",
            "**Mät upprepbart:** samma fasta frågor varje månad (schemalagt uppdrag, Dok 3 §7). Enskilda AI-svar varierar; trenden är det som säger något.",
        ]),
        ("h2", "6.2 Cookies — lärdomar (NY 2026-10-02)"),
        ("ul", [
            "**Inget val = inget samtycke.** Besökaren behöver inte tvingas välja; det avgörande är att inget spårande laddas före Godkänn. En cookievägg vore sämre.",
            "**Ladda tredjepartsskript en gång.** GTM laddades både av head-skriptet och av bannerskriptet för återkommande besökare — dubbla sidvisningar i GA4 utan att något syntes. En flagga (`window.__skGtmLoaded`) räcker.",
            "**Inbäddningar räknas också.** En Google Maps-iframe laddades före samtycke. Klick-för-att-ladda löser det.",
        ]),

        ("h1", "7. Process & arbetsmiljö — lärdomar"),
        ("ul", [
            "**Spec ≠ kod: verifiera specen innan \"fix\".** Ett audit-pass ändrade ElTillbehorCard till object-contain — men Dok 1 §3.2 dokumenterade object-cover som ett medvetet beslut. Ändringen återkallades.",
            "**Platshållarvärden i konfig:** föreslagen konfig som ersätter befintliga värden ska fråga efter aktuellt värde eller tydligt markera platshållare. (DMARC-rua-exemplet, Dok 4.)",
            "**Stegvis utrullning av brytande ändringar:** övervakning → delvis → full (reversibel) → enforce. Rena rapporter mellan stegen.",
            "**Cache-fördröjning vid extern ändring:** DNS/DMARC/CDN — downstream ser gammal version 24–72 h. Verifiera direkt mot källan.",
        ]),

        ("h2", "7.0 Tre lärdomar från 2026-10-02"),
        ("ul", [
            "**Cacha aldrig felsvar.** `google-reviews` gav sitt 502-svar samma `Cache-Control` som ett lyckat svar (6 h på CDN, 24 h stale). Ett rättat fel hade fortsatt synas i upp till ett dygn. Felsvar ska vara `no-store`.",
            "**Skicka med orsaken.** Funktionen returnerade bara \"API 403\"; först när Googles `status`, `reason` och meddelande följde med gick felet att spåra. Nyckeln maskas, orsaken visas.",
            "**Externa tjänster med testperiod slutar tyst.** Google Cloud-testperioden löpte ut och Places API svarade PERMISSION_DENIED utan reason. Nyckeln var korrekt inställd — det var betalkontot. Kontrollera billing tidigt vid generiska 403.",
        ]),

        ("h2", "7.1 Git från device_bash — bara med raderingsrättighet (förtydligat 2026-10-17)"),
        ("p", "v15.1 slog fast att git aldrig skulle köras från Cowork-VM:en (device_bash). v16.0 "
              "upphävde regeln. Två problem låg bakom, och bara det ena är löst för gott:"),
        ("ul", [
            "**Falska radslutsdiffar.** Arbetskopian hade CRLF, VM:ens git jämförde mot LF i indexet och listade tusentals filer. **Löst med `.gitattributes` (`* text=auto eol=lf`) + `git add --renormalize`.**",
            "**Kvarlämnat `index.lock`.** Raderingar är avstängda i kopplade mappar tills användaren beviljar det — **per session**. Git skapar och raderar själv låsfiler, så utan rättigheten lämnar `commit`, `pull`, `stash` och även `git status` (som uppdaterar indexet) ett `.git/index.lock` efter sig, och git i PowerShell vägrar sedan köra. Det är alltså inte löst, bara villkorat.",
        ]),
        ("note", "**Praxis sedan 2026-10-02:** kör inte git i den monterade arbetskopian alls från en "
                 "molnsession. Push går från en färsk klon i VM:ens hemkatalog (Dok 5 §6.2), "
                 "byggverifiering från en klon i molnet. Då behövs ingen raderingsrättighet och "
                 "arbetskopian rörs aldrig."),
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

        ("h2", "7.7 Lärdomar från topplist- och referensbatchen (NY 2026-10-17)"),
        ("p", "Flera av punkterna nedan är fel som Claude gjorde under batchen. De står här för att "
              "mönstren upprepas, inte för att de är ovanliga."),
        ("ul", [
            "**Ett godkänt visuellt beslut får inte köras över av en rekommendation i ett underlag.** Användaren godkände en skiss på en kompakt topplista utan bilder och speclistor. Designunderlaget för databasflytten rekommenderade sedan att behålla de stora korten, beslutet följde med flytten utan att lyftas, och bildhubben fick nio nya stora kort. Upptäckt först när användaren tittade på sidan live. Säger underlaget emot något som redan är godkänt ska det stå som en egen fråga, inte som en bisats.",
            "**Kärnregler läses före kundvänd text.** Dok 2 §5 säger att montering och transport aldrig ingår. Bildhubben sa \"ingår alltid montering\" på tre ställen sedan tidigare, och Claude skrev två nya varianter i topplistans ingresser. Sök efter `ingår` innan text om frakt, montering eller tekniker publiceras.",
            "**Databasen först, push sedan.** Innehåll med committad fallback skrivs över ur databasen vid varje bygge. Pushas fallback-filen före SQL:en försvinner det nya innehållet vid deployen (Dok 2 §12.3).",
            "**Flytta data — flytta testerna i samma commit.** När `populara` flyttades ur ljud.json blev `npm test` rött — och det pushades, eftersom bara `npm run build` kördes och Netlify inte kör testerna. Upptäckt samma dag, men först vid dokumentgenomgången. Värre: eventbild-kontrollen löd `data[f].eventbilder ?? []` och passerade utan att testa något alls. `?? []` i ett test är en tyst avstängning. Kör `npm test` före push.",
            "**Kör en funktion du ändrat — `node --check` räcker inte.** När `set-items` i `admin-popular.js` gjordes om till ursprung per rad blev en variabel kvar i loggraden. Syntaxen var giltig, så kontrollen gick igenom, men varje sparning av artiklar i /admin/topplistor/ skrev raderna och svarade sedan 500. Fångat av en oberoende granskning av specen samma dag, innan någon använt sidan. Endpoints utan test är skuld (§9.2).",
            "**Samma data har olika form i olika filer.** ljud.json har nästlade serier, bild.json toppnivå-arrayer. `PopularaPaket` läste bara den ena formen och hittade noll bildprodukter — utan fel, sektionen blev bara tom. Testa en ny kategori mot dess egen fil innan utrullning.",
            "**Arbeta alltid från en färsk klon av origin.** Två nära-olyckor i samma vecka: en ändring av `referenser/index.astro` byggd på en inaktuell arbetskopia hade backat 79 rader som redan låg i `main` (fångat av diffen mot färsk klon), och en komponent höll på att byggas som redan fanns i `main`. Arbetskopian på datorn är aldrig facit.",
            "**Supabase SQL editor varnar falskt** för `DROP POLICY IF EXISTS` och för RLS satt i en `DO`-loop. Varningen betyder inte att skriptet är fel — men den ska läsas, inte klickas bort (Dok 5 §5).",
            "**Påstå bara det som är dokumenterat.** DJ-hubbens referensrad har ett case där DJ står i underlaget; de två andra beskrivs som festevent med ljud och ljus. Samma princip som när projektorduken togs ur Systembolagets text.",
        ]),

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
            "**Recensioner:** Google Places API är borttaget (2026-10-02). Recensionerna underhålls manuellt i Supabase via /admin/recensioner/.",
            "**Sök efter läckta hemligheter i hela historiken:** `gitleaks git <spegelklon> --redact` (mirror-klon ~840 MB, ~20 s). Körning 2026-10-02 över 1 205 commits: bara Supabase anon-nyckel (publik per design) och Astros byggnycklar i gamla `dist/`-filer.",
            "**Headless-test av sajten i molnet:** `npx serve dist` + Playwright med `executablePath: '/opt/pw-browsers/chromium'` (installera inte webbläsare). Mocka funktionsanrop med `page.route`.",
            "**Search Console URL-inspektion** kan köras i den inbyggda webbläsaren när användaren är inloggad. Den smala panelen gör att sökfältet öppnas via förstoringsglaset; klicka sedan i fältet innan du skriver.",
            "**Verifiera live utan att navigera:** i den inbyggda webbläsaren kan `fetch('/sida/?v='+Date.now(), {cache:'no-store'})` + `DOMParser` läsa flera sidor från samma origin i ett anrop — rubriker, antal rader, referenskort. `/admin/` är robots-spärrat och kan inte hämtas av webbhämtningsverktyg; användaren får kontrollera admin själv.",
            "**HTML-diff som kvitto på en flytt:** bygg en baslinje ur en ren klon, gör ändringen, bygg igen och jämför med whitespace normaliserat (`tr '\\n' ' ' | tr -s ' ' | sed 's/> *</>\\n</g'`). Noll rader = ren flytt. Ett CSS-bundle-hash i `<link>` är väntad brus.",
            "**Testa att ett test kan falla:** lägg in ett känt fel (t.ex. ett utgånget artno), kör testet, ta bort felet. Ett test som aldrig setts rött kan vara tomt.",
            "**Validera SQL utan databas:** `pip install pglast` → `pglast.parse_sql(sql)`.",
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
            "**Göra GitHub-repot privat (parkerat 2026-10-02).** Inga hemligheter har läckt (gitleaks) och pre-commit-kontrollen skyddar framåt. Före bytet: koppla repot till Claude-sessionernas källor (annars faller molnklon och push), kontrollera Netlify-appens åtkomst och att `GITHUB_TOKEN` gäller just repot. Ta bort `public/manualer/README.md` från sajten (länkar till GitHub).",
            "**Generera inventarielistorna ur repot (NY 2026-09-21).** Komponentlistan (Dok 1 §5.1), sidlistan (Dok 3 §2) och ortslistan blir fel inom en månad när de handskrivs. Ett litet skript som läser `src/components/`, `src/pages/` och `orter.json` och skriver tabellerna vore billigare än att korrigera dem i varje genomgång.",
            "**Flytta de fem äldre armatur-manualerna in i repots `manual_generator.py` (NY 2026-09-21).** `EFF-0004`, `DMX-0001`, `ROK-0006`, `EFF-0007`, `EFF-0008` finns bara i projektdokumentets kopia av generatorn.",
            "**Frontend-härdning:** tydlig felruta med \"Försök igen\" vid nätverksfel.",
            "**Migration-hygien:** rutin för `ALTER TABLE` när kod lägger till kolumner (§4.1).",
            "**Priser → JSON (uppskjutet):** hårdkodade priser i markup/meta/prosa går inte att datadriva rent. Trigger: prisbyte som går fel till kund, eller inför priskampanj.",
            "**admin/index.astro (9 200+ rader):** dela upp i komponenter. Trigger: när det blir flaskhals att redigera.",
            "**hyra-bild-led-vagg (1 600 rader):** bryt ut LED-konfiguratorn.",
            "**Katalogkonsolidering:** `order-catalog-flat.json` vs `quote-catalog.json` — gemensam källa. Trigger: tredje konsument.",
            "**Admin-endpoints saknar tester — LÖST 2026-10-17.** `test/admin-innehall.test.cjs`, 29 kontroller, ingår i `npm test` (Dok 5 §3.5).",
            "**Hårdkodade tider — LÖST 2026-10-17.** Klockslagen hämtas ur site.json via `src/utils/hours.ts` (Dok 1 §9).",
            "**Utgångna produkter i Svens register och offertväljaren — LÖST 2026-10-17.** Tretton i registret (307 cart-ID:n kvar) och tretton i väljaren (350 poster kvar); `order-catalog-flat.json` behåller dem. Testet i `produktregister.test.mjs` kontrollerar nu åt båda hållen.",
            "**LjudLjusBuilder och KaraokeBuilder delar inte CSS (NY 2026-10-17).** Konfiguratorns stilar är kopierade med prefixet `llb-`. Kandidat för en gemensam fil. Trigger: en tredje byggare, eller en designändring som måste göras två gånger.",
            "**Utvalda kunder → admin — LÖST.** `featured`-kolumnen och kryssrutan i /admin/referenser/ finns; kodlistan `FEATURED_CLIENT_NAMES` i `src/utils/clients.ts` är bara fallback. Posten står fortfarande som öppen i `claude/Teknisk_Skuld_Backlog.md`.",
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
            "**GSC-indexering:** omindexering begärd 2026-10-02 för /vara-tjanster/hyra-ljud/, /hyra-ljud/event/, /for/guider/hyra-pa-system/, eventlokal-guiden och /en/. Följ upp positionerna för \"hyra högtalare stockholm\" och \"hyra ljud stockholm\".",
            "**/en/:** följ upp om engelska förfrågningar kommer in (märkta \"[ENGLISH ENQUIRY]\"). Nav och sidfot är svenska — utvärdera om det behövs mer än en sida.",
            "**Netlify:** `GOOGLE_PLACES_API_KEY` kan tas bort.",
            "**DJ Alex:** saknar foto (`DJ_Alex.png` + `dj.json djProfiles`).",
            "**Referenssidan:** kundlogotyperna i högre upplösning; de ärvda är nyckade ur en 1600 px-bild. (Crossfade-paren är utbyggda — 12 av 19 kort har 2–4 bilder.)",
            "**\"Montering ingår vid behov\" — LÖST 2026-10-17.** Rubriken på /vara-tjanster/ är nu *Montering när du behöver* med timpriset ur tjanster.json, och festivalsidan säger att montering tillkommer. (Ursprunglig notering: `/vara-tjanster/` har rubriken *Montering ingår vid behov* ovanför brödtexten *600 kr/tim*, och `/for/festival/` säger om modulscenerna att \"montering ingår vid behov\". Båda läses som gratis montering och motsäger Dok 2 §5 och scenprisguiden. Beslut behövs: medveten formulering eller fel.)",
            "**Scensidans \"Tolv\" — LÖST 2026-10-17.** Antalet räknas ur `scenes.json` (aktiva paket), liksom startsidans scenkort.",
            "**Festivalsidan (NY 2026-10-17):** \"Hopfällbara scener från 4×3 m\" — minsta scenpaketet är 2×2 m. Samma sida slår upp `ljudData.live.products[0]` på index, inte artno (projektinstruktionens princip).",
            "**DJ-hubbens referensrad:** bara Skridskodisco har DJ dokumenterat. Systembolaget och Läkarförbundet är festevent med ljud och ljus. Byt i /admin/referenscase/ när fler DJ-uppdrag finns med foto.",
            "**Topplistans rader länkar ingenstans.** Skissen hade \"länk till paketen\". Bildprodukterna har inga egna sidor, och alla-sidan har bara ankarna `#led-trailer`, `#projektorduk`, `#tillbehor`. Ett valfritt länkfält per grupp i `popular_groups` löser det.",
            "**Kategorin `ljud-och-ljus`** finns i databasen (ärver ljud + ljus via `source_categories`) men kombinationssidan anropar inte komponenterna. Arvet ger 24 produkter — för långt för en kombinationssida. Behöver egna korta grupper om sektionen ska in.",
            "**Ljud & ljus steg 2 (planerat 2026-10-26):** startsidans titel och en länk från startsidan till /hyra-ljud-och-ljus/, efter GSC-koll av konfiguratorsidan.",
            "**Bild-tillbehör (Projektor & skärm):** produktbilder saknas för projektorstativ, 100\" duk, skärmstativ, HDMI, HDMI-splitter, mediaspelare, 23\"-skärm, USB-clicker.",
            "**Google Ads:** lägg till annonsgrupper (Phrase Match), radera gamla svaga keywords. Importera GA4 conversion events när de börjar landa.",
        ]),
        ("note", "**Avfört 2026-09-21:** `public/images/ljud/pp_ljud_tillbehor_DI-palmer.webp` låg "
                 "ospårad och refererades inte. Gammal produkt — filen är raderad."),

        ("h1", "10. Versionshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v18.1", "2026-10-17",
             "§9.2 admin-tester, hårdkodade tider och utgångna produkter i registret/väljaren lösta. §9.4 montering-formuleringarna och scensidans antal lösta; festivalsidans 4×3 m och indexuppslag tillagda."],
            ["v18.0", "2026-10-17",
             "Genomgång av 49 commits sedan v17.0, varav fyra prisändringar från admin (frakt med en motor, montering i admin, offerten alltid "
             "sparad, karaokerabatt, ljud & ljus-konfiguratorn, referenssidan, kurateringslagret i "
             "Supabase, topplistan, montering-rättelsen). §7.1 git från device_bash är villkorat, inte "
             "löst. Ny §7.7 nio lärdomar från topplist- och referensbatchen, bl.a. set-items-felet som gav 500. §8 live-verifiering via "
             "fetch, HTML-diff som kvitto, testa att ett test kan falla, pglast. §9.2 delad CSS för "
             "byggarna, admin-endpoints utan test, hårdkodad helgtext, utgångna produkter i cart-ID-listan, utvalda kunder löst. §9.4 scensidans \"tolv\", montering-formuleringarna, DJ-hubben, länk per rad, "
             "ljud-och-ljus-kategorin, steg 2."],
            ["v17.0", "2026-10-02",
             "Genomgång av 42 commits sedan v16.0 (montering v2, offertpåminnelse v2, scenkjolar, nya "
             "produkter, AI-synlighet, cookies, /en/). Nya §4.4 PDFKit-sidbrytning, §6 titlar utan "
             "URL-byte, §6.1 AI-synlighet, §6.2 cookies, §7.0 felsvar/orsak/testperiod. §8 recensioner, "
             "gitleaks, headless-test, GSC i webbläsaren. §9.2 GitHub privat (parkerat). §9.4 GSC, /en/, "
             "Netlify-variabel."],
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
            ["Dok 1", "Grund & Design", "v18.1 (2026-10-17)"],
            ["Dok 2", "Produkter & Data", "v18.1 (2026-10-17)"],
            ["Dok 3", "Sidor & Navigation", "v18.1 (2026-10-17)"],
            ["Dok 4", "Kommunikation", "v18.1 (2026-10-17)"],
            ["Dok 5", "Order, Admin & Infra", "v18.1 (2026-10-17)"],
            ["Dok 6", "Lärdomar & Roadmap (detta)", "v18.1 (2026-10-17)"],
        ]),
        ("note", "**Princip:** inget addendum-staplande. När en uppgift ändras — rätta den på plats i "
                 "rätt dokument och bumpa versionsraden. Repots `main` är alltid facit; specen "
                 "beskriver, styr inte koden. **Och: uppdatera projektets instruktionsfält i samma "
                 "svep** (§7.5)."),
    ],
)
