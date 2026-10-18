DOC1 = dict(
    doc_no=1,
    slug="Grund_Design",
    title="Grund & Design",
    subtitle="Repo, stack, designsystem, bildkonventioner, layout, komponenter, företagsdata",
    version="v19.0",
    date="2026-10-18",
    blocks=[
        ("h1", "1. Repo, stack & deploy"),
        ("table", [
            ["Del", "Detalj"],
            ["Repo", "github.com/SweZig/scenkonsult-astro"],
            ["Live", "https://scenkonsult.se/"],
            ["Deploy", "Netlify — auto vid push till main (~2 min)"],
            ["Stack", "Astro 4 (SSG) + Tailwind CSS 3 + JSON-datafiler + Netlify Functions + Supabase"],
            ["Tjänster", "Resend (e-post) · 46elks (SMS) · Anthropic API (Sven) · GA4 + GSC"],
            ["Repo lokalt", "C:\\Users\\psigv\\Projects\\scenkonsult-astro"],
        ]),
        ("note", "**Sparläge / batch-push:** inga pushes till Netlify förrän en hel batch är klar. "
                 "Committa lokalt, pusha allt i ett svep så att inte varje delsteg triggar en deploy."),
        ("note", "**Rättat 2026-09-21 — sökvägen `/home/claude/scenkonsult-astro/` är historisk.** "
                 "Den pekade på en molncontainer som inte finns kvar mellan sessioner. Arbetskopian ligger "
                 "på datorn under `C:\\Users\\psigv\\Projects\\scenkonsult-astro`; molnsessioner klonar "
                 "repot separat (§1.3)."),

        ("h2", "1.1 Byggsekvens (alltid i denna ordning)"),
        ("ul", [
            "`node scripts/run-python.mjs generate-quote-catalog.py`",
            "`node netlify/generate-products.mjs`",
            "`npx astro build`",
        ]),
        ("p", "De genererade filerna (`quote-catalog.json`, `order-catalog-flat.json`, "
              "`montering-catalog.json`, `_products-generated.mjs`, `public/llms.txt`) är gitignorerade "
              "och byggs om vid varje Netlify-deploy. `generate-quote-catalog.py` skriver även "
              "`montering-catalog.json` (Dok 2 §5.1). `generate-llms.mjs` och `generate-excel.mjs` körs i "
              "`prebuild`. Hela kedjan: Dok 5 §3.6. `build_excel_v3.py` är obsolet."),
        ("p", "**`popular.json` och `event-cases.json` är inte sådana artefakter** (2026-10-17). De "
              "skrivs om ur Supabase i `prebuild` men är **committade fallbacks**, samma mönster som "
              "`clients.json` och `reviews.json`: saknas databasen behåller bygget den committade "
              "filen. Dok 2 §12, Dok 5 §3.5."),
        ("note", "**Python anropas via wrappern, inte direkt** (NY 2026-09-20). `python3` rakt av träffar "
                 "Microsoft Stores platshållare i PowerShell och bryter hela byggkedjan tyst. "
                 "`scripts/run-python.mjs` provar `python3`, `python` och `py -3` och validerar varje "
                 "kandidat med `--version` innan den används."),
        ("note", "**Kör alltid bygget innan push.** Astro/esbuild-buggar (Dok 6 §2) varnar inte alltid — "
                 "de ger silent runtime-fel. `npm run preflight` gör `git fetch` + `git status --short` "
                 "+ `npm run build` i ett svep."),

        ("h2", "1.2 Netlify Functions — modulsystem"),
        ("p", "Roten har `package.json` med `\"type\": \"module\"`, vilket läcker ned till "
              "`netlify/functions/`. Rå CommonJS-funktioner kraschar då om de inte skyddas. Kortversion: "
              "`netlify/functions/package.json = {\"type\":\"commonjs\"}` för v1-endpoints "
              "(`exports.handler`); inneboende ESM-/dep-lösa funktioner har `.mjs`. "
              "Fullständig genomgång i Dok 6 §3 och Dok 5."),

        ("h2", "1.3 Arbetsmiljöer — var vad körs (omskriven 2026-09-21)"),
        ("table", [
            ["Miljö", "Används till"],
            ["Windows / PowerShell", "Normal arbetsväg: redigering, build, git, push"],
            ["device_bash (Cowork-VM på datorn)", "Läsa, söka, redigera och konvertera filer i den monterade repo-mappen. **Git i den monterade arbetskopian bara om raderingsrättighet beviljats i sessionen** — annars lämnar även `git status` ett `.git/index.lock` efter sig (Dok 6 §7.1). Push sker från en färsk klon i VM:ens hemkatalog"],
            ["Cowork-molncontainer", "Klonar repot separat (`--depth 1 --filter=blob:none` + sparse-checkout) för att verifiera bygget, ~26 s från ingenting till verifierat bygge. **Kan inte pusha** — git-proxyn injicerar inga credentials för repot (verifierat 2026-10-02)"],
        ]),
        ("note", "**Push från en molnsession (2026-10-02):** färdiga commits paketeras som `git bundle` "
                 "och skrivs till `Claude outputs/` (gitignorerad). I datorns VM klonas repot färskt i "
                 "VM:ens hemkatalog, bundlen hämtas in och pushas med PAT:en ur `.secrets/gh-pat.txt` "
                 "inläst i en variabel. Den lokala arbetskopian rörs aldrig. Klonen i hemkatalogen "
                 "raderas efteråt, men **bundlarna blir kvar i `Claude outputs/`** — VM:en får inte "
                 "radera i den monterade mappen utan beviljad rättighet. Rensa mappen för hand då och då. "
                 "Byggverifiering i VM:en är inte praktiskt — `npm ci` där tar flera minuter för 72 MB. "
                 "Blir repot privat måste det kopplas till Claude-sessionernas källor först (Dok 6 §9.4)."),
        ("note", "**Bygget kan inte verifieras i den monterade mappen från molnsessionens sida** — "
                 "`node_modules` där är installerat för Windows. Därför molnklonen. "
                 "Den tidigare regeln \"kör aldrig git från device_bash\" är upphävd: "
                 "`.gitattributes` med `* text=auto eol=lf` (2026-09-20) gör att VM:ens git ser samma "
                 "radslut som indexet. Se Dok 6 §7.1."),
        ("note", "**TLS-verifiering stängs aldrig av.** `http.sslVerify=false` förekommer i äldre "
                 "anteckningar; det behövs inte och exponerar token vid push."),

        ("h1", "2. Designsystem"),
        ("h2", "2.1 Färgtokens"),
        ("table", [
            ["Token", "Värde", "Användning"],
            ["brand-dark", "#0c0a24", "Body-bakgrund, kategorisidor, produktbild-bakgrund"],
            ["brand-navy", "#1e1850", "Kort- och sektionsbakgrund"],
            ["brand-orange", "#c4b5f4", "Accent (lavendel) — pris, aktiva element, CTA-fyllning"],
            ["brand-orange-light", "#e2dcfb", "Hover-state på fyllda CTA-knappar"],
        ]),
        ("p", "**OBS — namnhistorik:** tokennamnen innehåller fortfarande \"orange\" av historiska skäl, "
              "men värdena är **lavendel**. Byt inte namnen utan att svepa hela kodbasen; de sitter i "
              "Tailwind-config, CSS-variabler och prop-namn."),

        ("h2", "2.2 Text på mörk bakgrund"),
        ("ul", [
            "`rgba(255,255,255,0.72)` — brödtext",
            "`rgba(255,255,255,0.55)` — sekundär text",
            "`text-gray-400` — dämpad UI-text",
        ]),
        ("note", "**ALDRIG `text-gray-500`** — ersätt alltid med `text-gray-400`. "
                 "(Verifierat 2026-07-24: 0 förekomster kvar i repot.)"),

        ("h2", "2.3 Typsnitt"),
        ("table", [
            ["Roll", "Typsnitt"],
            ["Rubriker", "DM Serif Display"],
            ["UI-labels", "Space Grotesk"],
            ["Brödtext", "Source Sans 3"],
        ]),

        ("h2", "2.4 Hover-regler"),
        ("ul", [
            "**Fyllda CTA-knappar:** `bg-brand-orange hover:bg-brand-orange-light` — aldrig `hover:bg-orange-500`",
            "**Kortborder:** `hover:border-brand-orange/40` eller `/50`",
        ]),

        ("h2", "2.5 Design 2026 — gemensamma klasser (NY 2026-10-18)"),
        ("p", "Hela sajten fick startsidans formspråk 2026-10-18: stora DM Serif-rubriker med en kursiv "
              "lavendeldel, pill-knappar, hårfina rutnät i stället för fyllda kort, fotokort med mörk "
              "toning och en lavendel slutruta. Reglerna sitter i `global.css` under rubriken "
              "**DESIGN 2026** och i ett fåtal delade komponenter (§5.1)."),
        ("table", [
            ["Klass / mönster", "Användning"],
            ["`sk-eyebrow`", "Liten versal etikett i lavendel ovanför en rubrik"],
            ["`sk-h2` / `sk-h2s`", "Sektionsrubrik (stor) / mindre sektionsrubrik — DM Serif, vikt 400"],
            ["`sk-knapp` / `sk-knapp sk-knapp-p`", "Pill-knapp med kontur / fylld lavendel. Fyllda `a.bg-brand-orange` och konturknappar får pill-form globalt"],
            ["`sk-band`", "Sektion med något ljusare botten (#110f30) och hårlinjer över och under"],
            ["`sk-prosa`", "Textsidor (villkor, policy): textspalt 780 px, h2 i DM Serif, sektioner åtskilda av hårlinje"],
            ["`details.bg-brand-navy`", "FAQ som lista med hårlinjer, inte rutor — gäller alla FAQ:er"],
            ["`[data-helkort]`", "Hela kortet klickbart (§4.10)"],
            ["Hårfint rutnät", "`gap:1px` på en behållare med `background: rgba(255,255,255,0.08)` och `border-radius:18px`; cellerna har sidans bakgrund. Används för faktarader, varför-oss och leverans/montering"],
            ["Radier", "Fotokort 20–22 px, rutor 18–22 px, knappar och chips 999 px (pill)"],
        ]),
        ("note", "**Inga emojis som ikoner** i den nya designen. Rubrikens kursiva del skrivs som "
                 "`<em>` (färgas lavendel av komponenterna) — texten i h1 ändras inte av designen."),

        ("h1", "3. Bildkonventioner"),
        ("h2", "3.1 Filnamn"),
        ("table", [
            ["Prefix / mönster", "Typ"],
            ["pp_{kategori}_{namn}.webp", "Produktbilder"],
            ["plugg_{kategori}.webp", "Banners / kategoribilder (/public/images/tjanster/)"],
            ["DJ_{namn}.png", "DJ-foton"],
            ["logo_{kund}.webp", "Kundlogotyper (/public/images/kunder/) — transparent WebP, se §3.3"],
            ["/public/images/hero/scen3_hero.webp", "Hero-bild (frontpage)"],
        ]),

        ("h2", "3.2 Bildrendering — beslutad, dokumenteras som den är"),
        ("note", "**Detta är ett medvetet designbeslut, inte en bugg.** De två kortkomponenterna skiljer "
                 "sig avsiktligt. Harmonisera dem INTE i kod — det skapar svarta kanter eller crop som "
                 "tidigare felsökts bort. (Bekräftat 2026-07-25: en audit-ändring av ElTillbehorCard till "
                 "`object-contain` återkallades — `object-cover` står fast.)"),
        ("table", [
            ["Komponent", "CSS", "Beslut"],
            ["ProductCard.astro", "object-contain + aspect-ratio:1024/853 på **vit platta** (`.sk-pkort-bild`)",
             "Sedan 2026-03-30 object-contain; sedan 2026-10-18 vit platta i stället för bg-brand-dark, så att vita produktbilder ser avsiktliga ut. Gäller även `.bg-brand-dark[style*=\"aspect-ratio:1024/853\"]` globalt"],
            ["ElTillbehorCard.astro", "object-cover + aspect-ratio:1024/853 + bg-brand-dark",
             "Behållet 2026-04-05, återbekräftat 2026-07-25"],
            ["PaketVariantCard.astro", "object-contain + galleri (§5.1)",
             "NY 2026-09-20 — produktbilder på vit botten, samma regel som ProductCard"],
            ["PopularaPaket.astro (topplistan)", "object-contain + bg-brand-dark, miniatyr 56×48 (`w-14 h-12`)",
             "NY 2026-10-17 — produktbild på vit botten, alltså samma regel som ProductCard"],
            ["EventBilder.astro (referensraden)", "object-cover + aspect-ratio:4/3, valfri `object-position` ur `pos`",
             "Eventfoto med fylld komposition. `pos` sätts per hubbrad när motivet hamnar utanför 4:3-utsnittet"],
        ]),
        ("p", "Storlek på korten styrs av **grid-kolumnbredden**, inte av komponenten. "
              "Bannerbilder/eventbilder (fylld komposition) använder `object-cover h-48`. "
              "Eventgalleriets kort på /referenser/ använder `aspect-ratio:3/4` + `object-cover`."),
        ("note", "**Beskär liggande foton vid konverteringen** (2026-09-18) — förlita dig inte på "
                 "`object-cover` för att välja utsnitt. Ett 4:3-foto i en 3:4-ruta tappar 44 % av bredden "
                 "på en centrerad crop, vilket kapar banderolltext och scenkanter. Välj horisontellt "
                 "centrum per bild och spara 1050×1400 WebP."),

        ("h2", "3.2.1 Namngivning (NY 2026-09-20)"),
        ("note", "**Bilder namnges efter vad de föreställer, inte efter paketets storlek.** "
                 "Paketnamn flyttar sig mellan produkter när sortimentet struktureras om; armaturer gör "
                 "det inte."),
        ("p", "Exempel från ljuspaket-omstruktureringen 2026-09-20: `pp_ljus_spider.webp`, "
              "`pp_ljus_kaleidoskop.webp`, `pp_ljus_tbar.webp`, `pp_ljus_trosstorn.webp`, "
              "`pp_ljus_trio.webp`. Hade de hetat `pp_ljus_small.webp` och `pp_ljus_medium.webp` hade "
              "varenda filnamn pekat på fel produkt efter omstruktureringen — Small blev Medium, och "
              "Small-namnet gick till en helt annan armatur."),

        ("h2", "3.3 Kundlogotyper"),
        ("p", "En fil per kund i `public/images/kunder/`, namngiven `logo_{kund}.webp`."),
        ("ul", [
            "**Transparent WebP i lavendel #c4b5f4**, tightbeskuren till logotypens bounding box.",
            "**Ramen ritas i CSS** — `rounded-xl border border-brand-orange/40` — aldrig i bilden. Då skalar ramen rent och en enskild logotyp kan bytas utan att övriga rörs.",
            "Renderas ur `clientLogos`-arrayen i `referenser/index.astro`; `img` får `max-h-[58%] max-w-[82%] object-contain` i en cell med fast höjd.",
            "**Fältet `tall`** (2026-10-03): höga märken — rundlar och sköldar, som UF och German Beer Hall — får `max-h-[92%]` i stället för 58 %, annars blir de frimärken bredvid de liggande logotyperna.",
        ]),
        ("note", "Bannern ersatte 2026-09-18 en sammansatt rasterbild (`logos.webp`) där ramarna var "
                 "inbrända i pixlarna. De sju ärvda logotyperna är nyckade ur den bilden och begränsas "
                 "därför av dess upplösning (1600 px bred totalt). Metoden står i Dok 6 §8. "
                 "Innehållet i bannern beskrivs i Dok 3 §4.1."),

        ("h2", "3.4 Video (NY 2026-09-20)"),
        ("p", "Video i repot hålls under ~15 MB. Omkodning:"),
        ("code", "ffmpeg -vf scale=1280:-2 -crf 26 -preset slow -an"),
        ("p", "Källfilerna för ljuspaketen var 1080p och 9 respektive 79 MB; resultatet blev 3,9 och "
              "13,9 MB utan synlig kvalitetsförlust i kortformat. `-an` tar bort ljudspåret — "
              "produktvideorna spelas upp tysta och autoplay kräver det ändå."),

        ("h1", "4. Layout & komponenter"),
        ("h2", "4.1 Nav / Header"),
        ("ul", [
            "**Ticker:** `--ticker-h: 36px` (32 px mobil), scrollande marknadsföringstext",
            "**Nav:** `height: 130px` (100 px mobil), glassmorphism mörk `rgba(12,10,36,0.97)`, fast position",
            "**Logo:** `logo-white.png` 120 px desktop / 58 px mobil. `.logo-c { display:none !important }` — ta ALDRIG bort `!important`",
            "**Nav-offset:** `--nav-offset: calc(36px + 130px)` = 166 px",
            "**Top-level nav (desktop, vänster→höger):** Logo → Tjänster (dropdown) → Kunskap (dropdown) → Kontakta oss → `margin-left:auto` → Telefon → Varukorg",
        ]),
        ("note", "Top-level nav är **Tjänster + Kunskap + Kontakta oss** (Kunskap tillagd i efterhand, "
                 "specen rättad 2026-10-18). Kunskap-dropdownen leder till Svens Kunskapsskola och "
                 "guiderna under /for/guider/; mobilmenyn har samma länkar."),
        ("ul", [
            "**Dropdown Tjänster:** hover-aktiverad, 3-kolumns panel, `min-width:720px`, lavendel-rubriker, 2,5 s stängningsfördröjning",
            "**Mobil:** hamburger med accordion. Varukorg-ikon till vänster om hamburger.",
        ]),

        ("h2", "4.2 Padding-top för fast navbar"),
        ("p", "Alla sidor **utan** rubrikkomponent måste sätta nav-offset på yttersta "
              "containern: `style=\"padding-top:calc(var(--nav-offset,166px) + 2.5rem)\"`. "
              "`ModernHero`, `SidHuvud` och `GuideLayout` hanterar det själva (mobil: `calc(132px + 0.75rem)`)."),

        ("h2", "4.3 Hero (frontpage)"),
        ("p", "Omgjord 2026-10-18. Text till vänster: eyebrow, h1 **\"Hyra scen, ljud, ljus & bild i "
              "*Stockholm*\"** (sökorden ska stå kvar i h1), ingress som börjar \"Klart till ert event.\", "
              "två knappar och betygsrad. Till höger ett eventfoto som växlar mellan fyra bilder "
              "(första laddas direkt, övriga ur `data-src`). Under heron: faktarad, åtta kategorikort med "
              "snabbval, topplistan \"Våra mest bokade paket\", referensrad, omdömen, Så funkar det, film "
              "(YouTubeKlick med poster) och slutruta. Klasser med prefix `st-` i `index.astro`."),

        ("h2", "4.4 Manifesto-bar"),
        ("p", "**Borttagen från startsidan 2026-10-18** — ersatt av faktaraden under heron. Klassen "
              "`.manifesto` finns kvar i `global.css`; regeln om att inte sätta inline-bakgrund gäller "
              "om den återanvänds."),

        ("h2", "4.5 Moms-toggle (global)"),
        ("ul", [
            "Fixed, bottom-left på alla sidor med priser. Döljs automatiskt på sidor utan priser.",
            "State i `localStorage` — kvarstår vid navigering. CSS + JS i `Layout.astro` + `global.css`.",
            "Hanterar `data-exkl` (guide-sidor) och `.sk-price-excl` / `.sk-price-incl` (produktsidor).",
        ]),
        ("note", "`src/components/MomsToggle.astro` är raderad — finns inte längre i repot "
                 "(global toggle i `Layout.astro`)."),

        ("h2", "4.6 Prismärkning"),
        ("p", "**Produktkort:**"),
        ("code", '<span class="sk-price-excl text-brand-orange font-extrabold text-xl">799 kr</span>\n'
                 '<span class="sk-price-incl hidden text-brand-orange font-extrabold text-xl">999 kr</span>\n'
                 '<span class="text-gray-400 text-xs">/dygn</span>'),
        ("p", "**Guide-sidor (`data-exkl`-attribut):** `<span data-exkl=\"599\">599</span> kr`. "
              "Den globala `applyVat()`-funktionen räknar om vid toggle (+25 %)."),

        ("h2", "4.7 Crossfade-kort (omskrivet 2026-10-17)"),
        ("p", "Ett kort kan visa **två till fyra bilder som växlar var 5:e sekund**. Används när ett "
              "uppdrag berättas bäst av flera tagningar (översikt/detalj, före/under) utan att ta flera "
              "rutor i griden. Infört på eventgalleriet 2026-09-18 med två bilder, utökat till 3–4 "
              "2026-10-03. Dok 3 §4.2."),
        ("p", "**Data:** varje case i `event-cases.json` har en `images[]`-lista (Dok 2 §12). Antalet "
              "bilder styr allt — fälten `src2`/`alt2` och `more` finns inte längre. "
              "**Markup:** bildbehållaren får `relative`; varje bild får klass efter antalet: 1 = statisk, "
              "2 = `sk-xfade-a` / `sk-xfade-b`, 3–4 = `sk-xfade-3` / `sk-xfade-4` med "
              "`animation-delay: i×5−1 s`. "
              "**CSS** i ett scopat `<style>`-block i samma fil: `.sk-xfade { position:absolute; inset:0 }`. "
              "Två bilder: 10 s-cykel, synlig 0–45 %, övertoning 45–55 %. Tre–fyra bilder: 15 respektive "
              "20 s, 5 s per bild med 1 s övertoning, `animation-fill-mode: backwards` så att bild 2–4 "
              "är dolda innan deras fördröjning löpt ut. "
              "`@media (prefers-reduced-motion: reduce)` stänger av animationen och låser bild 1."),
        ("note", "**Animera opacity, inte display.** Hover-zoomen ligger på `transform` och krockar "
                 "därför inte med crossfaden. Scopat `<style>` räcker här eftersom bilderna renderas i "
                 "samma fil — till skillnad från Sven-widgeten, som kräver `<style is:global>` (§6)."),

        ("h2", "4.8 Språk och hreflang (NY 2026-10-02)"),
        ("p", "`Layout.astro` har två props för flerspråkiga sidor: `lang` (`'sv'` default | `'en'`) och "
              "`alternates` (`[{ hreflang, href }]`). `lang` styr `<html lang>`, `og:locale` "
              "(`sv_SE`/`en_GB`) och cookiebannerns text. `alternates` ger `<link rel=\"alternate\" "
              "hreflang>` för sidan själv, alternativen och `x-default` (svenska) — absoluta URL:er. "
              "Används av `/` (pekar på `/en/`) och `/en/` (pekar på `/`). Nav och sidfot är svenska "
              "även på `/en/`."),

        ("h2", "4.9 Mobilens bottenlist (NY 2026-10-18)"),
        ("p", "`Layout` har propen `mobilBar`. På mobil visas då en fast list längst ned: Ring "
              "(avkodat `data-tel`), momsväljaren och Varukorg med antal. `body` får klassen "
              "`har-mobilbar` så att Sven och innehållet hamnar ovanför. Används på startsidan och "
              "ortssidorna. Skriptet är `is:inline` och vanlig JS."),

        ("h2", "4.10 Hela kortet klickbart (NY 2026-10-18)"),
        ("p", "Kort som ska leda vidare oavsett var man klickar får attributet `data-helkort`. Ett "
              "skript i `Layout.astro` (bredvid `skAnkare`) går till kortets första länk "
              "(`a[data-helkort-lank]` om den finns, annars första `a[href]`). Klick på egna länkar, "
              "knappar och fält inuti gör sitt eget — köpknappen lägger i varukorgen utan att lämna "
              "sidan. Ctrl/Cmd-klick öppnar ny flik. Används på startsidans kategorikort och topplista, "
              "KategoriKort, PopularaPaket, ProduktRader och tjänstekorten."),
        ("note", "**Använd inte `::after`-överlägg på länken** för att göra ett kort klickbart när "
                 "texten sitter i en absolut positionerad ruta — överlägget täcker då bara rutan. Det "
                 "var felet före 2026-10-18."),

        ("h1", "5. Produktkort — standardlayout"),
        ("code", '<article class="bg-brand-navy border border-white/10 hover:border-brand-orange/40\n'
                 '  rounded-2xl overflow-hidden transition-all group flex flex-col">\n'
                 '  <div class="bg-brand-dark overflow-hidden" style="aspect-ratio:1024/853">\n'
                 '    <img src="..." class="w-full h-full object-contain group-hover:scale-105\n'
                 '      transition-transform duration-300" />\n'
                 '  </div>\n'
                 '  <div class="p-5 flex flex-col flex-1">\n'
                 '    <h2 ...>...</h2>  <p ...>...</p>  <ul ...>...</ul>\n'
                 '    <div class="mt-auto ...">... pris + <CartButton ... /> ...</div>\n'
                 '  </div>\n'
                 '</article>'),
        ("note", "**ProductCard-props:** skicka alltid `bulky={p.bulky}` och "
                 "`forceLeverans={p.forceLeverans}`. Se Dok 2 §5 för fraktflaggor."),
        ("p", "**Design 2026:** `ProductCard` har klasserna `sk-pkort`, `sk-pkort-bild` (vit platta), "
              "`sk-pkort-namn` (DM Serif) och `sk-pkort-gaster` (\"pers.\" visas som \"gäster\"). "
              "Kompakta listor (`ProduktRader`) bär samma Product/Offer-mikrodata via `ErbjudandeMeta` "
              "— en ny produktlista utan mikrodata tappar data som Google läser."),

        ("h2", "5.1 Komponentöversikt (verifierad mot repo 2026-10-18 — 41 filer)"),
        ("table", [
            ["Komponent", "Status / roll"],
            ["ModernHero.astro", "Hero på hubb-, produkt-, konfigurator- och eventsidor (~30). Props `bild` (eventfoto till höger, 7/5-grid) och `knappar` sedan 2026-10-18"],
            ["SidHuvud.astro", "**NY 2026-10-18.** Rubrikyta för text- och informationssidor: brödsmulor, eyebrow, h1 med kursiv del, ingress, knappar, slot. `mikrodata` ger BreadcrumbList för sidor som inte skickar breadcrumbs till Layout"],
            ["GuideLayout.astro", "**NY 2026-10-18.** Mall för alla guider och de två långguiderna: rubrikyta, textspalt, fast sidokolumn (innehållsförteckning ur h2:or, Fråga Sven-ruta, länk till sortimentet), slutruta"],
            ["KategoriKort.astro", "**NY 2026-10-18.** Hubbarnas fotokort per underkategori; läser `kortbild`, `kortNamn`, `serie` i datan och räknar från-pris och gästspann"],
            ["TreSteg.astro", "**NY 2026-10-18.** Numrerade steg med slot för knappar"],
            ["event/EventOmraden, EventPaket, EventChecklista, ProduktRader, EventFaq, SlutRuta, KundRad", "**NYA 2026-10-18.** Byggstenarna för För ditt event-sidorna; ProduktRader, EventFaq, SlutRuta och KundRad används även på ortssidor, konfiguratorsidor och informationssidor (Dok 3 §2)"],
            ["ErbjudandeMeta.astro", "**NY 2026-10-18.** Dold Product/Offer-mikrodata för kompakta produktlistor (samma fält som ProductCard)"],
            ["ProductCard.astro", "Produktkortet (§5, §3.2)"],
            ["CartButton.astro", "Köpknapp (pill)"],
            ["Price.astro", "Prisvisning med moms"],
            ["ElTillbehorCard.astro", "object-cover (§3.2)"],
            ["PaketVariantCard.astro", "Färdiga ljuspaket med varianter och galleri"],
            ["DynamicPaketCard.astro", "Konfigurerbart scenkort. Skriptet (~35 kB) skrivs bara vid första kortet på sidan (`Astro.locals`) sedan 2026-10-18"],
            ["ScenkjolCard.astro", "Scenkjolar med höjd- och modellval"],
            ["SceneConfigurator.astro / YtaJamforelse.astro", "Scensidan"],
            ["MonteringEngine.astro / FraktEngine.astro", "`window.skMontering` / `window.skFrakt` (Dok 2 §5)"],
            ["KaraokeBuilder.astro / LjudLjusBuilder.astro", "Byggarna (Dok 2 §10–11)"],
            ["LjudLjusPromo.astro / TrossPromoBanner.astro", "Banners"],
            ["LeveransMonteringEl.astro", "Hubbarnas ruta Leverans, montering & el (hårfint rutnät)"],
            ["PopularaPaket.astro", "Topplistan med flikar per grupp; tar alla produktlistor i en serie (även `live.lineArray`)"],
            ["EventBilder.astro", "Referensraden \"Från våra event\""],
            ["SectionHeader.astro", "Sektionsrubrik"],
            ["MediaCard.astro / MixerModelCard.astro / MixerVariantCard.astro", "Galleri- och varianttyper"],
            ["ThrowCalculator.astro", "I ProductCard"],
            ["KunskapBlock.astro", "Guider och videoguider längst ned"],
            ["YouTubeKlick.astro", "Film först vid klick; prop `poster`"],
            ["Tel.astro / Mail.astro", "Kontaktskydd (§7)"],
            ["InlineEditor.astro", "Alt+E / ?edit=1"],
            ["CategoryHero.astro · SceneLinkCard.astro · layouts/ServiceLayout.astro", "**Raderade 2026-10-18** — oanvända efter omdesignen"],
        ]),
        ("note", "**Den här listan är en inventarielista och blir inaktuell.** Den bör genereras ur "
                 "`src/components/` i stället för att handskrivas — se Dok 6 §9.2. "
                 "Crossfade-korten och logotypgriddet på /referenser/ är **inte** komponenter; de ligger "
                 "inline i `referenser/index.astro` med scopad CSS."),

        ("h1", "6. Viktiga CSS- & build-regler"),
        ("ul", [
            "**Inline styles slår alltid extern CSS** oavsett specificitet — fixa genom att ta bort inline-stilen, aldrig `!important` (undantag: `.logo-c`).",
            "`.svc2-grid`: använd INTE Tailwind-grid — custom CSS.",
            "`text-gray-500`: använd ALDRIG — alltid `text-gray-400`. · `hover:bg-orange-500`: använd ALDRIG — alltid `hover:bg-brand-orange-light`.",
            "**Sven-widget CSS:** använd `<style is:global>` — Astro scopar annars bort stilar från dynamiskt skapade DOM-element.",
            "**Scopat `<style>` räcker för element i samma fil** — t.ex. `.sk-xfade` på eventgalleriet (§4.7). Det är bara dynamiskt injicerad DOM som kräver `is:global`.",
            "**Chrome autofill:** global fix i `global.css` via `-webkit-box-shadow … inset !important` håller mörkt tema på autofyllt fält.",
            "**OS-temaberoende formulärstilar:** `<select>`/`<textarea>`/`<input>` kan tvingas till systemfärger. Enda tillförlitliga fix: `color-scheme:dark` + `background` + `color` som **inline style** i HTML-strängen — inte via CSS-klass.",
            "**Astro `<script>` är ES-modul:** funktioner är inte globala. `onclick`/`onchange` i dynamisk `innerHTML` kräver `window.fn = fn;`. Se Dok 6 §2.3.",
            "**Mid-fil imports i frontmatter:** placera imports överst — en import efter kod i frontmatter kan ge esbuild-parsefel (\"Expected ; but found $\").",
            "**Frontmatter vs script-scope:** imports i frontmatter är INTE tillgängliga i `<script>`. Re-importera där. Se Dok 6 §2.2.",
        ]),

        ("h1", "7. Kontaktskydd (anti-scraping)"),
        ("p", "Alla `tel:` och `mailto:` borttagna ur HTML-källan. Lagras base64-kodat i "
              "`data-tel` / `data-mail`, avkodas vid `DOMContentLoaded`. Komponenter: `Tel.astro` och "
              "`Mail.astro`. Fristående sidor utan huvud-Layout (order, sign) har egen inline-avkodare. "
              "(Verifierat 2026-07-24: 0 råa `tel:`/`mailto:` i statisk källa på order/sign.)"),

        ("h1", "8. Företagsdata"),
        ("table", [
            ["Fält", "Värde"],
            ["Namn (utåt)", "**Scenkonsult Norden** — särskilt företagsnamn, används på alla publika ytor"],
            ["Juridisk person", "**Sigvardsson Consulting AB** — anges i villkor, personuppgiftspolicy och fakturor. Inte \"Consulting Group AB\" (fel som rättades 2026-10-02)"],
            ["Org.nr", "559068-4931"],
            ["Tel", "072-448 10 00"],
            ["Besöks- / depåadress", "Grimstagatan 164, 162 58 Vällingby"],
            ["Fakturaadress", "Vinsta Skolgränd 4, 162 70 Vällingby"],
            ["Grundat", "1986"],
            ["Öppettider", "Mån–fre 09–17, lör–sön 12–15 — **samma som Google-profilen**. Källa: `site.json → company.openingHours` (`\"Mo-Fr 09:00-17:00, Sa-Su 12:00-15:00\"`), JSON-LD i `Layout.astro`. Läses även av llms.txt, Sven och kontaktsidans öppet/stängt-pill"],
            ["Telefon och helger", "**Telefon mån–fre 09–17.** Lör–sön 12–15 är **depåtider för hämtning och återlämning**; **kvällar och helger är telefonen endast jour** för kunder med pågående uthyrning; nya förfrågningar går via formulär eller varukorg (2026-10-11). Klockslagen hämtas sedan 2026-10-17 ur `site.json → company.phoneHours` och `openingHours` via `src/utils/hours.ts` — `telefon()`, `vardag()` och `helg()` med valen `lang` (sv/en), `kort` (09–17 eller 09:00–17:00) och `versal`. Kontakt, om-oss, bokningssida, order, studentflak, fyra guider, ortssidorna och /en/ använder den. Sidorna skriver egna meningar; bara tiderna är datadrivna. Sven och llms.txt läser fälten direkt, `weekendNote` bara Sven"],
            ["Serviceområde", "Hela Storstockholm"],
        ]),

        ("note", "**Öppettiderna stod som mån–sön 08–20 i specen och instruktionsfältet medan sajten sa "
                 "mån–fre 09–17 — och Google-profilen en tredje sak.** Beslut 2026-10-02: Google-profilen "
                 "gäller. Ändras de, ändra `site.json`, JSON-LD i `Layout.astro`, ortsidornas schema och "
                 "Google-profilen i samma svep."),

        ("h1", "9. Analytics & tracking"),
        ("table", [
            ["Fält", "Värde"],
            ["GTM Container", "GTM-TL37V2GR"],
            ["GA4 Measurement ID", "G-TZB1J3FF4P"],
            ["GA4 Property ID", "417375423"],
            ["Search Console", "sc-domain:scenkonsult.se"],
            ["Cookie consent", "localStorage `sk_cookie_consent`, 395 dagar. Inget val = inget samtycke: GTM laddas bara efter Godkänn"],
            ["Conversion", "\"Submit lead form\" triggar på /tack/"],
        ]),
        ("h2", "9.1 Cookiebannern (omarbetad 2026-10-02)"),
        ("ul", [
            "**Avvisa och Godkänn har identisk stil** — samtycke ska vara lika lätt att neka som att ge.",
            "**Ångra/ändra:** alla element med `data-cookie-settings` öppnar bannern igen — länken \"Cookie-inställningar\" i sidfoten och knappen i personuppgiftspolicyn §6. Avvisa efter tidigare Godkänn tar bort `_ga`/`_gid`-cookies och laddar om sidan utan GTM.",
            "**GTM laddas en gång:** head-skriptet sätter `window.__skGtmLoaded`; bannerskriptets `loadGTM()` avbryter om flaggan finns. Före 2026-10-02 laddades GTM två gånger per sidvisning för återkommande besökare som godkänt — GA4-siffror före dess kan vara dubbelräknade.",
            "**Inget tredjepartsinnehåll före samtycke:** Google Maps på /kontakt/ laddas automatiskt för besökare som redan godkänt (`sk_cookie_consent = accepted`) och direkt när någon klickar Godkänn i bannern; utan samtycke ligger klickrutan \"Visa karta\" kvar (2026-10-11). YouTube (youtube-nocookie) först när besökaren startar en video.",
        ]),

        ("h1", "10. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v19.0", "2026-10-18",
             "Omdesignen: ny §2.5 Design 2026 (gemensamma klasser), §3.2 produktbild på vit platta, §4.2 "
             "rubrikkomponenterna sköter nav-offset, §4.3 ny startsida, §4.4 manifesto borttagen, ny §4.9 "
             "mobilens bottenlist, ny §4.10 hela kortet klickbart, §5 ProductCard-klasser och "
             "ErbjudandeMeta, §5.1 41 komponenter (SidHuvud, GuideLayout, KategoriKort, TreSteg, "
             "event/*, ErbjudandeMeta; CategoryHero, SceneLinkCard och ServiceLayout raderade)."],
            ["v18.4", "2026-10-18",
             "§1 stacken: Astro 4 och Tailwind 3 (stod v4). §4.1 Kunskap ligger i toppmenyn. §4.4 manifesto 100+ event/år (stod 500+). "
             "Ny komponent YouTubeKlick (film laddas först vid klick) och src/utils/utanInterna.ts (interna _-fält rensas före klienten)."],
            ["v18.3", "2026-10-17",
             "Inga ändringar — versionen följer Dok 2, 4 och 6 (rättelse: 1×1-plattformen bara 40 cm)."],
            ["v18.2", "2026-10-17",
             "§5.1 PopularaPaket länkar varje rad till produktens kort."],
            ["v18.1", "2026-10-17",
             "Telefon och helger: tiderna formateras av `src/utils/hours.ts` i stället för att stå inskrivna i elva filer."],
            ["v18.0", "2026-10-17",
             "§1.1 popular.json/event-cases.json är committade fallbacks, inte byggartefakter. §1.3 git i "
             "den monterade mappen kräver raderingsrättighet; bundlarna blir kvar i Claude outputs/. §3.2 "
             "PopularaPaket (miniatyr, object-contain) och EventBilder (4:3, object-cover, pos) i "
             "renderingstabellen. §3.3 fältet tall. §4.7 crossfade omskrivet: 2–4 bilder ur images[], "
             "sk-xfade-a/b och -3/-4. §5.1 30 komponenter (FraktEngine, KaraokeBuilder, LjudLjusBuilder, "
             "LjudLjusPromo, LeveransMonteringEl, PopularaPaket, EventBilder). §8 telefon och helger "
             "(depåtider, jour). §9.1 kartan laddas direkt vid samtycke."],
            ["v17.0", "2026-10-02",
             "§8 namn (Scenkonsult Norden utåt, Sigvardsson Consulting AB juridiskt) och öppettider "
             "(Google-profilen, källa site.json) + not. Ny §9.1 cookiebannern. Ny §4.8 språk och hreflang "
             "(lang/alternates). §5.1 23 komponenter (ScenkjolCard, MonteringEngine). §1.1 genererade "
             "filer inkl. montering-catalog.json och llms.txt. §1.3 molnet kan inte pusha — "
             "bundle-via-VM-flödet."],
            ["v16.0", "2026-09-21",
             "§1 Repo lokalt rättat till Windows-sökvägen; ny §1.3 Arbetsmiljöer (molnklon för "
             "byggverifiering, device_bash-git tillåtet efter .gitattributes) ersätter den upphävda "
             "regeln \"kör aldrig git från device_bash\". §1.1 byggsekvensen använder "
             "scripts/run-python.mjs; katalogfilerna avspårade. Ny §3.2.1 Namngivning (bilder namnges "
             "efter motiv). Ny §3.4 Video. §3.1 webp-prefix. §3.2 PaketVariantCard i renderingstabellen. "
             "§5.1 PaketVariantCard tillagd, lista verifierad mot repo (21 komponenter) + not om att "
             "inventarier bör genereras."],
            ["v15.1", "2026-09-18",
             "Ny §3.3 Kundlogotyper. Ny §4.7 Crossfade-kort. §3.1 logo_{kund}.webp. §3.2 not om "
             "beskärning av liggande foton. §6 scopat <style> vs is:global. §5.1 not om att "
             "/referenser/-mönstren inte är komponenter."],
            ["v15.0", "2026-07-25",
             "§5.1 komponentöversikt uppdaterad mot repo. §3.2 ElTillbehorCard object-cover "
             "återbekräftad. §2.2/§7 verifieringsnoteringar. Ny build-regel §6 (mid-fil imports)."],
            ["v14.0", "2026-07-22", "Ny §1.2 (modulsystem). §1.1 _products-generated.mjs. §8 org.nr + fakturaadress."],
            ["v13.0", "2026-06-22", "Full restrukturering till 6 dokument, verifierad mot main."],
        ]),
    ],
)
