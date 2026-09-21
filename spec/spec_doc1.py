DOC1 = dict(
    doc_no=1,
    slug="Grund_Design",
    title="Grund & Design",
    subtitle="Repo, stack, designsystem, bildkonventioner, layout, komponenter, företagsdata",
    version="v16.0",
    date="2026-09-21",
    blocks=[
        ("h1", "1. Repo, stack & deploy"),
        ("table", [
            ["Del", "Detalj"],
            ["Repo", "github.com/SweZig/scenkonsult-astro"],
            ["Live", "https://scenkonsult.se/"],
            ["Deploy", "Netlify — auto vid push till main (~2 min)"],
            ["Stack", "Astro (SSG) + Tailwind CSS v4 + JSON-datafiler + Netlify Functions + Supabase"],
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
        ("p", "De genererade katalogfilerna (`quote-catalog.json`, `order-catalog-flat.json`, "
              "`_products-generated.mjs`) är gitignorerade och **avspårade sedan 2026-09-20**. "
              "De byggs om vid varje Netlify-deploy. `generate-excel.mjs` körs i `prebuild` och "
              "auto-genererar `public/Scenkonsult_Produktkatalog.xlsx`. `build_excel_v3.py` är obsolet."),
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
            ["device_bash (Cowork-VM på datorn)", "Läsa, söka, redigera och konvertera filer i den monterade repo-mappen. Git går numera bra här — `.gitattributes` tog bort de falska radslutsdiffarna"],
            ["Cowork-molncontainer", "Klonar repot separat (`--depth 1 --filter=blob:none` + sparse-checkout) för att verifiera bygget, ~26 s från ingenting till verifierat bygge"],
        ]),
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
            ["ProductCard.astro", "object-contain + aspect-ratio:1024/853 + bg-brand-dark",
             "Sedan 2026-03-30 — fixar svart kant på produktbilder med vit bakgrund"],
            ["ElTillbehorCard.astro", "object-cover + aspect-ratio:1024/853 + bg-brand-dark",
             "Behållet 2026-04-05, återbekräftat 2026-07-25"],
            ["PaketVariantCard.astro", "object-contain + galleri (§5.1)",
             "NY 2026-09-20 — produktbilder på vit botten, samma regel som ProductCard"],
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
            "**Top-level nav (desktop, vänster→höger):** Logo → Tjänster (dropdown) → Kontakta oss → `margin-left:auto` → Telefon → Varukorg",
        ]),
        ("note", "Top-level nav är **Tjänster + Kontakta oss** — INTE \"Tjänster + Kunskap\". "
                 "Kunskapsinnehåll finns som sidor (/svens-kunskapsskola/, KunskapBlock.astro) men ligger "
                 "inte som eget nav-element."),
        ("ul", [
            "**Dropdown Tjänster:** hover-aktiverad, 3-kolumns panel, `min-width:720px`, lavendel-rubriker, 2,5 s stängningsfördröjning",
            "**Mobil:** hamburger med accordion. Varukorg-ikon till vänster om hamburger.",
        ]),

        ("h2", "4.2 Padding-top för fast navbar"),
        ("p", "Alla sidor **utan** `CategoryHero` eller `ModernHero` måste sätta nav-offset på yttersta "
              "containern: `style=\"padding-top:calc(var(--nav-offset,166px) + 2.5rem)\"`. "
              "Sidor med hero-komponent hanteras automatiskt."),

        ("h2", "4.3 Hero (frontpage)"),
        ("p", "2-kolumn 50/50, höjd `clamp(480px, 64vh, 700px)`. Vänster: text + checks. "
              "Höger: `scen3_hero.webp`, `object-fit:cover`. "
              "`padding-top: calc(var(--nav-offset,166px) + 1rem)`."),

        ("h2", "4.4 Manifesto-bar"),
        ("p", "Lavendel border ovan/under (`2px solid rgba(196,181,244,0.25)`). "
              "Stats: 1986 / 500+ / 20–2000 / 100 %. Inga CTA-knappar. "
              "**INGEN** `inline style=\"background:…\"` — styrs enbart via `.manifesto`."),

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

        ("h2", "4.7 Crossfade-kort"),
        ("p", "Ett kort kan visa **två bilder som växlar var 5:e sekund**. Används när ett uppdrag "
              "berättas bäst av två tagningar (före/under, översikt/detalj) utan att ta två rutor i "
              "griden. Infört på eventgalleriet 2026-09-18, Dok 3 §4.2 — mönstret är generellt."),
        ("p", "**Data:** posten får de valfria fälten `src2` och `alt2`. Typa arrayen så att fälten blir "
              "optional, annars klagar TypeScript på posterna som saknar dem. "
              "**Markup:** bildbehållaren får `relative`; förstabilden taggas villkorligt via `class:list`, "
              "andrabilden renderas bara när `src2` finns. "
              "**CSS** i ett scopat `<style>`-block i samma fil: `.sk-xfade { position:absolute; inset:0 }` "
              "plus två keyframes på 10 s — synlig 0–45 %, övertoning 45–55 %, dold 55–95 %. "
              "`@media (prefers-reduced-motion: reduce)` stänger av animationen och låser bild 1."),
        ("note", "**Animera opacity, inte display.** Hover-zoomen ligger på `transform` och krockar "
                 "därför inte med crossfaden. Scopat `<style>` räcker här eftersom bilderna renderas i "
                 "samma fil — till skillnad från Sven-widgeten, som kräver `<style is:global>` (§6)."),

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

        ("h2", "5.1 Komponentöversikt (verifierad mot repo 2026-09-21 — 21 filer)"),
        ("table", [
            ["Komponent", "Status / roll"],
            ["Price.astro", "Aktiv"],
            ["CartButton.astro", "Aktiv"],
            ["ProductCard.astro", "Aktiv (object-contain, §3.2)"],
            ["ElTillbehorCard.astro", "Aktiv (object-cover, §3.2)"],
            ["PaketVariantCard.astro",
             "Aktiv — **NY 2026-09-20.** MediaCards bildgalleri (pilar, dots, autoplay-video) kombinerat "
             "med MixerModelCards variantväljare. Används för färdiga ljuspaket där flera varianter delar kort."],
            ["DynamicPaketCard.astro", "Aktiv — konfigurerbart scenkort (yta/trappor/kjol, live-pris)"],
            ["SceneConfigurator.astro", "Aktiv (scensidan)"],
            ["YtaJamforelse.astro", "Aktiv (scensidan)"],
            ["SceneLinkCard.astro", "Aktiv — kompakt scen-länkkort till scensidans konfigurator"],
            ["CategoryHero.astro", "Aktiv — ortssidornas hjälte (badges + CTA)"],
            ["ModernHero.astro", "Aktiv — de facto-standard-hero (~30 sidor)"],
            ["SectionHeader.astro", "Aktiv"],
            ["MediaCard.astro", "Aktiv — bild/video-galleri med lightbox"],
            ["MixerModelCard.astro / MixerVariantCard.astro", "Aktiva (ljud-sidor)"],
            ["ThrowCalculator.astro", "Aktiv (i ProductCard)"],
            ["TrossPromoBanner.astro", "Aktiv"],
            ["KunskapBlock.astro", "Aktiv"],
            ["Tel.astro / Mail.astro", "Aktiva (kontaktskydd, §7)"],
            ["InlineEditor.astro", "Aktiv (Alt+E / ?edit=1)"],
            ["LjusTillbehor.astro · MomsToggle.astro", "Raderade — existerar inte"],
            ["AccessoryGrid.astro · SmartImage.astro", "Har aldrig existerat i repot"],
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
            ["Namn", "Scenkonsult Norden / Sigvardsson Consulting Group AB"],
            ["Org.nr", "559068-4931"],
            ["Tel", "072-448 10 00"],
            ["Besöks- / depåadress", "Grimstagatan 164, 162 58 Vällingby"],
            ["Fakturaadress", "Vinsta Skolgränd 4, 162 70 Vällingby"],
            ["Grundat", "1986"],
            ["Öppet", "Mån–sön 08:00–20:00"],
            ["Serviceområde", "Hela Storstockholm"],
        ]),

        ("h1", "9. Analytics & tracking"),
        ("table", [
            ["Fält", "Värde"],
            ["GTM Container", "GTM-TL37V2GR"],
            ["GA4 Measurement ID", "G-TZB1J3FF4P"],
            ["GA4 Property ID", "417375423"],
            ["Search Console", "sc-domain:scenkonsult.se"],
            ["Cookie consent", "localStorage sk_cookie_consent, 395 dagar; GTM laddas vid page load om consent finns"],
            ["Conversion", "\"Submit lead form\" triggar på /tack/"],
        ]),

        ("h1", "10. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
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
