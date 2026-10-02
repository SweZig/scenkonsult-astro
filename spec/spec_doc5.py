DOC5 = dict(
    doc_no=5,
    slug="Order_Admin_Infra",
    title="Order, Admin & Infra",
    subtitle="Varukorg, admin-panel, fakturering, innehålls-admin, Supabase, GitHub API, git & deploy",
    version="v17.0",
    date="2026-10-02",
    blocks=[
        ("h1", "1. Infrastruktur — snabbreferens"),
        ("table", [
            ["Del", "Detalj"],
            ["Databas", "Supabase ejhhgqvtvsmiwxygfqbu, eu-west-1"],
            ["Storage", "…/storage/v1/object/public/manualer/[ARTNO].pdf"],
            ["Admin-panel", "/admin/ (kanban + faktura + stats), /admin/sven/, /admin/produkter/, /admin/referenser/, /admin/recensioner/, /admin/bulletin/"],
            ["Kundordersida", "/order/?cart=SK-XXXXXX&token="],
            ["Env-variabler", "SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_TOKEN, RESEND_API_KEY, ANTHROPIC_API_KEY, GITHUB_TOKEN, GA4_OAUTH_*"],
        ]),
        ("note", "**`GOOGLE_PLACES_API_KEY` används inte längre** (2026-10-02) — `google-reviews.mjs` är "
                 "borttagen. Variabeln kan tas bort ur Netlify."),

        ("h1", "2. Varukorgssystem"),
        ("p", "**Lagring (`localStorage sk-cart`):** `id \"SK-[8HEX]-[4HEX]\"`, `expires` "
              "(Date.now()+21 dagar, förnyas vid ändring), `items[{id,name,price,category,qty}]`. "
              "TTL 21 dagar. Gammal ren-array migreras automatiskt. Globalt API: "
              "`window.skCart.{get,save,add,remove,updateQty,badge}`."),
        ("p", "**Bokningsflöde:** \"Maila offertförfrågan\" → `intent=offert`; \"Boka detta nu\" → "
              "`intent=boka`. Båda låses under utskick, reset vid fel. `sendCopy`-kryssruta styr "
              "kundkopia. Cart-ID skickas med i offert-POST."),
        ("p", "**Montering i varukorgen (2026-09-28):** raden heter \"Montering & demontering "
              "(beräknad)\" och räknas av `window.skMontering` ur produkternas tider (Dok 2 §5.1). "
              "`skicka-offert` räknar om på servern så att kunden inte kan skicka in en egen siffra. "
              "Med scen i korgen ber varukorgen kunden beskriva underlaget under Övrig information."),
        ("p", "**Flerdygnsrabatt:** raderna bär `unit_price`, `days`, `day_factor` och `price` "
              "(Dok 2 §5.2). Formeln `price × qty = radsumma` gäller överallt — fakturor, statistik och "
              "varukorg behöver inte känna till rabatten."),
        ("note", "**Ordern lagrar egen kopia av namn och pris.** `carts.items` är JSONB — en order från "
                 "2025 visar det namn och pris som gällde då, även om produkten sedan bytt namn. "
                 "Det är den mekanism som gör namnbyten i sortimentet ofarliga. Se Dok 2 §7."),

        ("h1", "3. Admin-panel"),
        ("h2", "3.1 Detaljpanel — flikar"),
        ("table", [
            ["Flik", "Funktion"],
            ["Info", "Status (dropdown), kundinformation, intern anteckning"],
            ["Produkter", "Redigerbar produkttabell — lägg till/ta bort rader, ändra antal/à-pris, spara till DB"],
            ["Chatt", "Meddelandehistorik + skicka meddelanden till kund. Hantera mallar: snabbmallar och offertpåminnelser (§3.7)"],
            ["Logg", "Audit-trail (läs-only)"],
        ]),

        ("h2", "3.2 Paneler, dirty-state & UI"),
        ("ul", [
            "Konfigurator-paneler (scen/led/frakt/montering) lyfts till `document.body` vid showApp (`_liftConfigPanelsToBody`) — fixed-modal med backdrop (z 8800/8900). Target-context `_configTarget=quote|productsTab`.",
            "`askDirtyChoice` 3-vals-dialog ersätter tysta förkasta-promptar — kritiskt innan utgående mail.",
            "Oläst-räknare sammanslagen (📬 Oläst (N)). 🕒 Aktivitet-drawer joinar messages + audit_log + carts. ✓ Markera som läst i panel-header.",
            "Topbar: 🕒 Aktivitet · ↻ Uppdatera (shift = hård reload) · Ny offert · Sajten · Sven · Katalog · Produkter · Innehåll ▾ · Logga ut.",
        ]),

        ("p", "**Montering i offerten:** monteringsrutan har knappen \"Beräkna från offertens "
              "produkter\" (samma motor som varukorgen). `admin-send-quote` loggar om offertens "
              "monteringsbelopp avviker från beräkningen."),

        ("h2", "3.3 Fakturering"),
        ("p", "B2B-fakturadetaljblock på `/order/` (org.nr, referens, fakturaadress, Peppol), "
              "kreditfakturor, `skip_pickup_flow`-toggle."),
        ("note", "**Sidbrytning (2026-09-30):** `_pdf-paging.js` (`ensureSpace()` + fortsättningsetikett) "
                 "används av `invoice-send`, `invoice-pdf-download` (faktura + order) och `invoice-credit`. "
                 "Produkttabellen bryts rad för rad och tabellhuvudet ritas om överst på nästa sida "
                 "(\"Faktura K… (forts.)\"); summa- och betalningsblocket (inkl. Swish-QR) hålls ihop. "
                 "Före rättningen gav 25 rader 14 sidor — PDFKit lade en ny sida för varje `text()` under "
                 "bottenmarginalen. Verifierat med 25 och 60 rader."),
        ("note", "**Juridisk avsändare (rättad 2026-10-02):** fakturornas sidfot och villkor anger "
                 "**Scenkonsult Norden (Sigvardsson Consulting AB) · Org.nr 559068-4931**. Två ställen "
                 "sa tidigare \"Consulting Group AB\"."),
        ("note", "**PDF-generering:** PDFKit i Netlify-funktioner (`invoice-pdf-download.js`). Använd "
                 "`.replace(/ /g, \" \")` i `fmtKr` för att undvika non-breaking-space-artefakter från "
                 "`toLocaleString(\"sv-SE\")`."),
        ("p", "**Faktura- & orderdokument:** `mode=order` → ORDER (ingen K-nr, ingen Swish-QR, ingen "
              "sida 2); `mode=faktura` → fullständig faktura med villkor på sida 2 "
              "(`_invoice-villkor.js`): B2C (12 §, inkl. Ångerrätt + ARN), B2B (11 §, inkl. "
              "Beställarens behörighet + Utlämning/fullmakt). `getVillkor(cart)` väljer version "
              "(B2C default — säkrast pga konsumenträtt). Kompakt tvåkolumn (font 7); förmät + sidbryt "
              "(aldrig hård cutoff — tappar sista paragrafen tyst). `VILLKOR_DATE = 2026-06-01`."),
        ("p", "**Betalningspåminnelser — 4 nivåer (`invoice-reminder-send.js`):** Påminnelse → Krav → "
              "Inkassokrav; momsfria lagstadgade avgifter (60 kr påminnelse / 180 kr inkasso, "
              "lag 1981:739) ackumuleras ovanpå fakturan. +8 dagars betalfrist på nivå 3–4. Avgifterna "
              "inskrivna i villkoren. Migration: `2026-07-17_reminder_levels.sql`."),

        ("h2", "3.4 Statistik (/admin/stats/)"),
        ("p", "GA4 Data API + Search Console API via OAuth refresh_token-flöde. Env: "
              "`GA4_OAUTH_CLIENT_ID/CLIENT_SECRET/REFRESH_TOKEN`. GA4 property 417375423, "
              "GSC `sc-domain:scenkonsult.se`."),

        ("h2", "3.5 Innehålls-admin (Referenser, Recensioner, Bulletin)"),
        ("p", "En \"Innehåll\"-dropdown i admin-topbaren samlar Referenskunder, Recensioner och "
              "Bulletin. Referensdata underhålls i Supabase och synkas till committade JSON-filer vid "
              "build (med säker fallback); sidorna läser JSON server-side och hydrerar live."),
        ("p", "**Kundlista / referenser** — i Supabase-tabellen `clients`. `admin-clients.js` (CRUD), "
              "`clients-list.js` (publik läs), `/admin/referenser/`. `netlify/generate-clients.mjs` "
              "synkar `src/data/clients.json` (prebuild). **Recensioner** — självförsörjande via "
              "Supabase-tabellen `reviews`: `admin-reviews.js`, `reviews-list.js`, "
              "`/admin/recensioner/`. `netlify/generate-reviews.mjs` synkar `src/data/reviews.json`. "
              "Migration: `2026-07-18_reviews.sql`. **Sedan 2026-10-02 läggs nya recensioner in "
              "manuellt** — \"Importera från Google\" och live-antalet från Places API är borttagna "
              "(Dok 3 §4.3). Admin-sidan länkar till Google-profilen."),
        ("note", "**Kolumnerna `ort` och `featured`** på clients-tabellen kopplar kund → ortssida "
                 "respektive driver utvalda-bannern via `getFeaturedClients()` (fallback = kurerad "
                 "kodlista). `featuredClients` är borttaget ur `site.json`. Defensivt mönster: valfria "
                 "kolumner inkluderas i skrivning endast när satta + retry-fallback som strippar dem om "
                 "kolumnen saknas → deploy-ordningen ofarlig."),

        ("h2", "3.6 Prebuild-kedjan"),
        ("code", "prebuild: generate-catalogs → generate-llms → minify-sven → sync-reviews → sync-clients → generate-excel\n"
                 "predev:   generate-catalogs → generate-llms\n"
                 "pretest:  generate-catalogs\n"
                 "prepare:  git config core.hooksPath .githooks || true   (körs av npm ci/install)"),
        ("p", "`generate-catalogs` = `generate-quote-catalog.py` (quote-, order- och "
              "montering-katalogen) + `generate-products.mjs` (Svens register). `generate-llms` = "
              "`scripts/generate-llms.mjs` → `public/llms.txt`."),
        ("note", "**`predev` och `pretest` tillagda 2026-09-20.** `astro dev` och `npm test` kör inte "
                 "`prebuild`, så utvecklingsservern och testerna gick tidigare mot inaktuella kataloger "
                 "utan att något sa ifrån. `generate-catalogs` anropar Python via "
                 "`node scripts/run-python.mjs` — se Dok 1 §1.1."),

        ("h2", "3.7 Offertpåminnelser v2 (NY 2026-09-29)"),
        ("ul", [
            "**Samlingsruta** vid start när offerter väntar på svar: \"Gå igenom nu\", \"Snooza 30 min\" eller \"Resten av dagen\". Snoozen ligger i `localStorage` (`sk_reminder_snooze_until`) och gäller per enhet. ⏰-märke med antal i kolumnen Offert skickad.",
            "**Två steg** räknat från `quote_sent_at` (sätts av `admin-send-quote`, nollställs inte av adminändringar): påminnelse 1 tidigast 48 h efter offerten, sista påminnelsen när eventet är ≤ 5 dagar bort och minst 48 h efter steg 1. Konstanter `REMINDER_HOURS`, `REMINDER_FINAL_DAYS`, `REMINDER_GAP_HOURS` i `admin/index.astro`.",
            "**Fyra mallar** — Formell, Neutral, Personlig, Sista påminnelse — med redigerbar ämnesrad och text och valbar nej-länk (förvald för sista). Förval efter kundtyp och steg. Mallarna lagras i `chat_templates` (`kind = 'reminder'`, `subject`) med inbyggda fallback-mallar.",
            "**📩 Påminn kund** i detaljpanelen öppnar samma mallväljare för en enskild offert, även om den inte står på tur. Ersätter den tidigare `prompt()`-fritexten.",
            "**Kunden kan tacka nej** — på ordersidan i chattsektionen eller via mailets länk (`?svar=nej`). Två orsaker (`need_changed`, `found_alternative`) + valfri kommentar. `cart-update` `customer_decline` sätter `status = cancelled`, `declined_at`, `decline_reason`, `decline_comment`, loggar `customer_declined` och mailar info@. Admin visar 🙅-badge, banner i Info och påminnelsehistorik.",
            "**Ordersidan för status `new`** (2026-09-29): `cart-get` gav tidigare 403, så kunden kunde varken läsa admins chattmeddelanden eller svara — även \"Se din förfrågan\"-länken från kontaktformuläret föll. Nu visas förfrågan + chatten. Läsmarkering av offerten loggas först när en offert skickats.",
        ]),
        ("note", "**Migrationen `2026-09-29_quote_reminder_v2.sql` måste vara körd i Supabase** "
                 "(`quote_sent_at`, `quote_reminder_log`, `declined_at`, `decline_reason`, "
                 "`decline_comment` på `carts`; `kind` + `subject` på `chat_templates`). Utan den "
                 "misslyckas nej-svar och påminnelsemallar kan inte sparas. Idempotent."),

        ("h1", "4. GitHub Contents API (produktredigeraren)"),
        ("p", "`/admin/produkter/` läser och skriver JSON-filer via GitHub Contents API "
              "(`admin-products-list.js` + `admin-products-update.js`), autentiserat med Netlify "
              "env-var `GITHUB_TOKEN`."),
        ("p", "**Kolumnen Montering (2026-09-28):** `monteringMin` underhålls per produkt i alla "
              "datafiler. Tomt fält = fältet tas bort (saknas), 0 = monteras inte, hela eller halva "
              "minuter, max 1440. `admin-products-update` validerar."),
        ("note", "**Admin-panelen rör aldrig den lokala klonen.** Den läser filen via API:t, ändrar "
                 "JSON i minnet och committar direkt till `main`. Netlify bygger om och regenererar "
                 "katalogerna. **Konsekvensen är att `origin` regelbundet går före den lokala klonen "
                 "utan att något varnar** — varje gång någon ändrar ett pris i admin. Därav kravet på "
                 "`npm run sync` innan arbete påbörjas (§6)."),
        ("note", "**Token-rotation:** när `GITHUB_TOKEN` går ut visar `/admin/produkter/` login-skärm "
                 "efter ~1 s (401). Fix: nytt PAT, uppdatera BÅDE GitHub och Netlify, trigga om-deploy."),
        ("note", "**Tokentyp:** fine-grained PAT (`github_pat_…`) begränsat till enbart "
                 "`scenkonsult-astro`, med **Contents: Read and write** (+ Workflows om "
                 "`.github/workflows/` ska kunna ändras — repot har `supabase-migrate.yml`). Ett "
                 "klassiskt `ghp_`-PAT med repo-scope ger full skrivåtkomst till samtliga repon — "
                 "onödig sprängradie. Samma fine-grained token duger både som Netlify `GITHUB_TOKEN` "
                 "och för push."),
        ("note", "**Contents: Read-only räcker inte och felet säger inte varför.** En token med bara "
                 "läsrättighet svarar 200 på `GET /repos/…` och `GET /contents/…`, men push avvisas med "
                 "`remote: Permission to … denied` / 403. Verifieringskedjan: API-läsning först, sedan "
                 "`git push --dry-run` — det är det anropet som testar skrivvägen "
                 "(`git-receive-pack`). Observerat 2026-09-21."),

        ("h1", "5. Supabase-mönster"),
        ("ul", [
            "`CREATE POLICY` utan `IF NOT EXISTS` (stöds inte i denna version).",
            "Alla nya kolumner måste läggas till i explicita `select()`-listor i relevanta funktioner (admin-clients, clients-list, generate-clients).",
            "`Prefer: return=representation` på PATCH returnerar uppdaterad rad som JSON.",
        ]),
        ("note", "**Migrationer körs MANUELLT mot Supabase — ingen auto-apply.** Migrationsfilerna i "
                 "repot är inte en tillförlitlig bild av live-schemat. Kod som refererar en icke-skapad "
                 "kolumn → PostgREST 400. Idempotent `ALTER TABLE`, kör i samband med deploy. "
                 "Se Dok 6 §4.1."),

        ("h1", "6. Git & deploy (omskrivet 2026-09-21)"),
        ("h2", "6.1 Arbetsgången"),
        ("code", "npm run sync        # git pull --rebase --autostash && npm ci\n"
                 "# ... arbeta ...\n"
                 "npm run preflight   # git fetch && git status --short && npm run build\n"
                 "git add <sökvägar>  # aldrig -A\n"
                 "git commit -m \"beskrivning\"\n"
                 "git push"),
        ("note", "**`npm run sync` först, alltid.** Admin-panelen committar direkt till `main` (§4), "
                 "så `origin` går före den lokala klonen varje gång någon ändrar ett pris. Ingenting "
                 "varnar förrän en push avvisas som non-fast-forward. `--autostash` gör att kommandot "
                 "går igenom även med osparade ändringar i arbetsträdet."),
        ("note", "**`git add -A` ska inte användas.** Ange sökvägar. `-A` har vid flera tillfällen svept "
                 "med genererade filer, verktygscacher och raderingar som inte hörde till batchen. "
                 "Den gamla receptraden i denna paragraf löd `git add -A` — den är ersatt."),
        ("p", "**Sparläge / batch-push:** inga pushes förrän en hel batch är klar — varje push till "
              "`main` triggar en Netlify-deploy. Git-identitet: `user.email=\"swezig@gmail.com\"`, "
              "`user.name=\"SweZig\"` (rättat 2026-10-02 — specen angav swezig@scenkonsult.se; "
              "nästan all historik sedan september har gmail-adressen)."),
        ("note", "**Pre-commit-kontroll mot hemligheter (2026-10-02).** `.githooks/pre-commit` kör "
                 "`scripts/check-secrets.mjs` på de stagade, **tillagda** raderna: Google-, Anthropic-, "
                 "OpenAI-, Resend-, GitHub- och Netlify-nycklar, privata nycklar, lösenord i URL:er och "
                 "JWT:er med annan roll än `anon` (Supabase `service_role` stoppas). Filer som `.env*`, "
                 "`.secrets/` och `*.pem` stoppas oavsett innehåll. `prepare` i `package.json` sätter "
                 "`core.hooksPath`, så `npm run sync` aktiverar den i varje klon. Vid falsklarm: "
                 "`git commit --no-verify`. Admin-panelens commits via API passerar inte hooken."),

        ("h2", "6.2 Push med token"),
        ("code", 'TOK=$(tr -d " \\r\\n" < .secrets/gh-pat.txt)\n'
                 'git push "https://SweZig:${TOK}@github.com/SweZig/scenkonsult-astro.git" HEAD:main'),
        ("ul", [
            "PAT ligger i `.secrets/gh-pat.txt`, som är gitignorerad. Filen innehåller enbart token — ingen etikett, ingen extra rad.",
            "**Formen `https://TOKEN@github.com/…` fungerar inte.** Git tolkar då token som användarnamn och frågar efter lösenord. Användarnamnet måste stå ut: `https://SweZig:${TOK}@…`",
            "**TLS-verifiering stängs aldrig av.** `http.sslVerify=false` förekommer i anteckningar från 2026-08; det behövs inte och exponerar token vid push.",
            "Skriv aldrig ut tokenvärdet — läs in det i en variabel och filtrera bort det ur utskrifter.",
        ]),
        ("note", "**Molnsessioner (2026-10-02):** git-proxyn i molncontainern injicerar inga credentials "
                 "för repot, så push därifrån nekas fortfarande (403). Arbetsgången: committa i "
                 "molnklonen → `git bundle` → skriv till `Claude outputs/` → i datorns VM: färsk klon i "
                 "hemkatalogen, hämta bundlen, pusha med PAT:en ur `.secrets/gh-pat.txt` → radera bundlen. "
                 "Den lokala arbetskopian rörs inte. Se Dok 1 §1.3."),
        ("note", "**Rättat 2026-09-21 — den gamla miljötabellen gäller inte längre.** v15.1 slog fast "
                 "att molncontainern inte kan pusha (git-proxyn nekade på repo-nivå innan credentials "
                 "kom till tals) och att det inte gick att åtgärda i efterhand. Med ett fine-grained PAT "
                 "med Contents: Read and write går push igenom från den monterade repo-mappen. "
                 "Verifierat 2026-09-21: `git push --dry-run` svarar \"Everything up-to-date\" i stället "
                 "för 403."),

        ("h2", "6.3 Radslut och .gitattributes"),
        ("note", "**`.gitattributes` med `* text=auto eol=lf` infördes 2026-09-20** tillsammans med "
                 "`git add --renormalize`. Innan dess jämförde Linux-VM:ens git mot CRLF i arbetskopian "
                 "och listade tusentals filer som modifierade. Den gamla regeln \"kör aldrig git från "
                 "device_bash\" är därmed upphävd — se Dok 6 §7.1."),
        ("p", "**Redigera filer på bytenivå** när radslut kan vara blandade (`open(f,'rb')` + "
              "`bytes.replace`). Läs-som-text-och-skriv-tillbaka normaliserar radsluten tyst: en "
              "enradsändring i `netlify.toml` blev en 306-raders diff."),

        ("h2", "6.4 Spårade filer och .gitignore"),
        ("note", "**`.gitignore` gäller aldrig retroaktivt.** Läggs en ignore-rad till måste "
                 "`git rm --cached` köras i **samma commit**. Annars är raden verkningslös och ingen "
                 "upptäcker det förrän filerna dyker upp i en diff långt senare. Har hänt tre gånger i "
                 "det här repot: genererade kataloger (juni → åtgärdat september), `node_modules` "
                 "(åtgärdat september), verktygscacher (åtgärdat september)."),
        ("p", "`node_modules` var spårat med 12 706 filer. Efter avspårning gick `git status` från "
              "120 s till 4,7 s och `git commit` från 170 s till 1,7 s. **Efter `git pull` krävs "
              "`npm ci`** — det ingår i `npm run sync`."),
        ("ul", [
            "**Pre-commit safety check (måste vara tom):** `git diff --cached --name-only | grep -E \"dist/|netlify.toml|package-lock.json|node_modules|\\.cjs$\"`",
            "Ändra ALDRIG `netlify.toml` (undantag: dokumenterade node_bundler-block). Committa ALDRIG `dist/`. Byt ALDRIG CJS-funktioner till `.cjs`.",
            "Desktop-appen lägger förhandsvisningar i `Claude outputs/` i projektmappen — gitignorerad sedan 2026-09-18.",
            "Lägg aldrig en tokenfil någon annanstans än i `.secrets/`, och kontrollera att mappen står i `.gitignore` innan filen skapas.",
            "`public/llms.txt` och `src/data/montering-catalog.json` är genererade och gitignorerade (Dok 2 §2.1). llms.txt avspårades med `git rm --cached` i samma commit som ignore-raden.",
        ]),

        ("h1", "7. Manualer & dokumentation"),
        ("ul", [
            "**Manual-generator:** `manual_generator.py` ligger i repot (tidigare bara i molncontainern, där den försvann mellan sessioner). Manualer i Supabase Storage: `manualer/[ARTNO].pdf`.",
            "Manualer namnges efter **paketets** artikelnummer, inte armaturens — se Dok 2 §7.",
            "**Spec-docx genereras av `spec_builder.py` + `spec_doc1–6.py`** (python-docx). Ramverk och innehåll ligger i samma uppsättning filer så att en enskild paragraf kan ändras och alla sex dokument byggas om med ett kommando.",
        ]),
        ("note", "**Leveransfiler ska aldrig dela filnamn med indata.** Regenererade manualer lades i "
                 "`_bilder-inbox/manualer/` bredvid originalen med identiska namn — originalen laddades "
                 "upp till Supabase i stället, och felet upptäcktes först när PDF:ernas sidhuvud lästes. "
                 "Lägg färdiga filer i en mapp vars namn säger vad som ska göras med dem "
                 "(`_till-supabase/`)."),

        ("h1", "8. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v17.0", "2026-10-02",
             "Ny §3.7 Offertpåminnelser v2 (samlingsruta/snooze, två steg från quote_sent_at, fyra "
             "mallar i chat_templates, Påminn kund, kunden tackar nej, ordersidan för status new) + "
             "migrationsnot. §2 beräknad montering och flerdygnsrabatt i varukorgen. §3.1 monteringsknapp "
             "i offerten. §3.3 PDF-sidbrytning (_pdf-paging.js) och juridisk avsändare. §3.5 recensioner "
             "manuellt. §3.6 prebuild med generate-llms och prepare. §4 kolumnen Montering. §6.1 git-"
             "e-post rättad + pre-commit-kontroll. §6.2 molnsessionernas push via bundle. §1 "
             "GOOGLE_PLACES_API_KEY kan tas bort."],
            ["v16.0", "2026-09-21",
             "§6 helt omskriven: npm run sync / preflight, git add -A förbjudet, push-syntax med "
             "användarnamn, .gitattributes, node_modules avspårat, .gitignore-regeln. Den gamla "
             "miljötabellen och påståendet att push från molnet är omöjligt är rättade. §4 "
             "admin-skrivvägen och dess konsekvens för origin förtydligad + not om att Contents: "
             "Read-only ger ett 403 som inte förklarar sig. Ny §3.6 Prebuild-kedjan med predev/pretest "
             "och run-python-wrappern. §2 not om att ordern lagrar egen kopia av namn och pris. §7 "
             "manual_generator.py flyttad till repot, spec-generatorn dokumenterad."],
            ["v15.1", "2026-08-31",
             "§6 omskriven: det gamla pushkommandot med token i URL fungerar inte längre. Miljötabell, "
             "add_repo-fyndet och tokenfil-varning tillagda. §4 kompletterad med fine-grained PAT."],
            ["v15.0", "2026-07-25", "§3.5 featuredClients → featured-flagga; nya clients-kolumner ort + featured. §5 select-lista-noter."],
            ["v14.1", "2026-07-22", "§3.3.1 villkorsklausul tredje persons legitimation vid fullmakt."],
            ["v14.0", "2026-07-22", "Ny §3.5 Innehålls-admin. §3.3 faktura-villkor + betalningspåminnelser. §5 manuella migrationer."],
        ]),
    ],
)
