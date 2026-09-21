DOC4 = dict(
    doc_no=4,
    slug="Kommunikation",
    title="Kommunikation",
    subtitle="E-post (Resend/SES), DNS & DMARC, SMS (46elks), Sven-chatbot",
    version="v16.0",
    date="2026-09-21",
    blocks=[
        ("h1", "1. E-postsystem (Resend)"),
        ("h2", "1.1 Arkitektur"),
        ("table", [
            ["Del", "Detalj"],
            ["Tjänst", "Resend API via Amazon SES (https://api.resend.com/emails)"],
            ["API-nyckel", "RESEND_API_KEY i Netlify Environment Variables"],
            ["Avsändare", "Scenkonsult Norden <hej@scenkonsult.se>"],
            ["Intern kopia", "info@scenkonsult.se (hej@ forwardar dit; reply_to = kundens e-post)"],
            ["Trello-kopia", "sunxpertadm+kvz53qihlyplkt6r9xnb@app.trello.com"],
            ["Click-tracking", "click.scenkonsult.se → links1.resend-dns.com"],
            ["Logo-URL", "https://scenkonsult.se/logo-white.png"],
            ["Maildesign", "Ljust tema (vit #ffffff kropp, #1e1850 header/footer) — spam-säkert"],
        ]),
        ("note", "**Avsändaren är `hej@scenkonsult.se` — INTE `noreply@`.** Definierad som `FROM` i "
                 "samtliga skicka-funktioner; verifierat i koden 2026-09-21. `noreply@` stod felaktigt i "
                 "projektets instruktionsfält fram till dess och bör inte kopieras därifrån."),

        ("h2", "1.2 Funktioner & versionering"),
        ("table", [
            ["Fil", "Endpoint", "Version"],
            ["skicka-offert.js", "/.netlify/functions/skicka-offert", "v1 (exports.handler)"],
            ["skicka-kontakt.js", "/.netlify/functions/skicka-kontakt", "v1"],
            ["skicka-feedback.js", "/.netlify/functions/skicka-feedback", "v1"],
        ]),
        ("p", "v1-funktioner (`exports.handler`) svarar på `/.netlify/functions/`. v2-funktioner "
              "(`export default` + `export const config={path}`) registreras ENBART på sin explicita "
              "path. Modulsystem (CJS vs .mjs): Dok 6 §3."),

        ("h2", "1.3 Rate limit-hantering"),
        ("p", "Resend free tier har rate limit. `await sleep(600)` mellan varje sendEmail: "
              "intern kopia → info@; `sleep(600)`; Trello-kopia; `sleep(600)`; kundkopia "
              "(om `sendCopy=true`)."),

        ("h2", "1.4 Boknings-intent"),
        ("table", [
            ["", "Maila offertförfrågan", "Boka detta nu"],
            ["Ämnesrad", "Offertförfrågan från [namn]", "⭐ BOKNING från [namn]"],
            ["Rubrik", "Ny offertförfrågan", "⭐ Bokningsönskan"],
            ["Kundkopia ämne", "Din offertförfrågan till Scenkonsult", "Din bokningsönskan hos Scenkonsult"],
        ]),

        ("h2", "1.5 Spam-skydd i funktioner"),
        ("ul", [
            "Honeypot-fält: `website`, `phone2`, `honeypot`",
            "Rate limiting: 3 req/min per IP",
            "Spamfilter: regex på `viagra|casino|crypto|bitcoin|…`",
            "`text`-version skickas alltid med HTML (Gmail penaliserar HTML-only)",
            "`height:auto` på logo-img (aldrig hårdkodat `height=\"40\"`)",
        ]),

        ("h1", "2. DNS-konfiguration"),
        ("h2", "2.1 SPF / DKIM"),
        ("table", [
            ["Post", "Typ", "Värde"],
            ["@", "TXT", "v=spf1 include:spf.loopia.se include:amazonses.com ~all"],
            ["send", "TXT", "v=spf1 include:amazonses.com ~all"],
            ["send", "MX", "feedback-smtp.eu-west-1.amazonses.com (prio 10)"],
            ["resend._domainkey", "TXT", "DKIM-nyckel (från Resend)"],
            ["click", "CNAME", "links1.resend-dns.com"],
        ]),
        ("note", "**Viktigt:** SPF på rotnivå måste inkludera `include:amazonses.com` — annars hamnar "
                 "Resend-mail i skräppost."),

        ("h2", "2.2 DMARC"),
        ("note", "**DMARC är enforced sedan 13 juni 2026 — INTE `p=none`.** `p=none` stod kvar i "
                 "projektets instruktionsfält fram till 2026-09-21 och beskrev läget före utrullningen."),
        ("table", [
            ["Post", "Typ", "Värde"],
            ["_dmarc", "TXT",
             "v=DMARC1; p=reject; pct=100; rua=mailto:info@scenkonsult.se; "
             "ruf=mailto:info@scenkonsult.se; adkim=r; aspf=r; sp=reject"],
        ]),
        ("p", "Alla mail som inte passerar SPF/DKIM avvisas vid SMTP-handshake. Subdomäner ärver "
              "reject. **`adkim=r` / `aspf=r` (relaxed alignment) är kritiskt för Resend-flödet** — "
              "envelope-from är `send.scenkonsult.se` medan header-from är `scenkonsult.se`; strict "
              "hade brutit detta. Rapporter (rua/ruf) → `info@scenkonsult.se` (inte `dmarc@` — "
              "existerar ej i Loopia, se lärdom A)."),

        ("h2", "2.2.1 DMARC-utrullningstrappa"),
        ("table", [
            ["Steg", "Policy", "Period"],
            ["1. Övervakning", "p=none", "≥ 30 dagar"],
            ["2. Karantän inledning", "p=quarantine; pct=25", "~2 veckor"],
            ["3. Karantän full", "p=quarantine; pct=100", "≥ 2 veckor rena rapporter"],
            ["4. Reject (slutmål)", "p=reject; sp=reject; pct=100", "Permanent — uppnådd 2026-06-13"],
        ]),
        ("p", "Varje steg ska ha rena rapporter innan nästa. Vid avvikelse — paus, fixa avsändaren, sen "
              "vidare. Aldrig hoppa över ett steg."),

        ("h2", "2.3 DMARC-rapportörer & TLS-RPT"),
        ("p", "Fem aktiva rapportörer skickar dagliga aggregat till info@: Amazon SES, Google "
              "(noreply-dmarc-support@google.com), Microsoft Enterprise + Outlook.com "
              "(dmarcreport@microsoft.com), Yahoo (dmarchelp@yahooinc.com). "
              "**Inga rapporter på flera dagar = problem** (vanligast: rua-adressen tar inte emot). "
              "TLS-RPT: `_smtp._tls` TXT `v=TLSRPTv1; rua=mailto:info@scenkonsult.se` "
              "(aktiverat 22 juni 2026)."),

        ("h2", "2.4 Lärdomar från DMARC-utrullningen"),
        ("ul", [
            "**A — Platshållarvärden i konfig:** `rua=mailto:dmarc@scenkonsult.se` skrevs som exempel och kopierades rakt av, men brevlådan existerade inte — 30 dagars rapportflöde försvann tyst. Fråga efter aktuellt värde eller markera platshållare tydligt.",
            "**B — DKIM överlever forwarding, SPF gör inte:** DMARC kräver bara ETT av DKIM/SPF. `spf:fail` + `dkim:pass` är friskt för forwarded mail.",
            "**C — Microsoft First Contact Safety Tip ≠ DMARC-problem:** \"Du får inte ofta e-post från X\"-banner är Defender by design; hantera med proaktiv kommunikation.",
            "**D — Resend suppression list ≠ DMARC:** suppression sker före DMARC — blockerade mail syns inte i rapporter. Kolla Resend Dashboard → Suppressions.",
            "**E — Stegvis utrullning är obligatorisk.** Aldrig hoppa från `p=none` direkt till reject.",
            "**F — Cache-fördröjning:** rapportör hänger kvar på gammal policy 24–72 h. Verifiera via mxtoolbox.com.",
        ]),

        ("h1", "3. SMS (46elks)"),
        ("table", [
            ["Del", "Detalj"],
            ["Tjänst", "46elks REST API (api.46elks.com/a1/)"],
            ["Avsändare", "FROM_NAME = \"Scenkonsult\" — hårdkodat i alla tre SMS-filer"],
            ["Filer", "_sms.js (delad), sms-send.js, sms-fallback.mjs, _pickup-sms.js"],
        ]),

        ("h1", "4. Sven — AI-chatbot"),
        ("table", [
            ["Del", "Detalj"],
            ["Backend", "netlify/functions/sven-chat.mjs — serverless proxy → Anthropic API (ESM/.mjs, esbuild-bundlad)"],
            ["Modell", "claude-haiku-4-5-20251001"],
            ["Widget", "src/layouts/Layout.astro"],
            ["Endpoint", "/api/sven-chat (v2, export const config)"],
            ["Env-var", "ANTHROPIC_API_KEY"],
            ["Analytics", "/admin/sven/"],
        ]),
        ("note", "**Modulsystem:** `sven-chat.mjs` är inneboende ESM och kräver "
                 "`node_bundler = \"esbuild\"` i `netlify.toml` (nft tracar inte .mjs-importen av "
                 "`_products-generated.mjs`). Se Dok 6 §3.3."),

        ("h2", "4.1 Produktregistret — en källa (förtydligat 2026-09-21)"),
        ("p", "Registret byggs vid varje build och skrivs **aldrig** för hand:"),
        ("code", "src/lib/sven-products.mjs      (SVEN_SOURCES, buildSvenProducts, cartIdFor)\n"
                 "        ↓  netlify/generate-products.mjs\n"
                 "netlify/functions/_products-generated.mjs\n"
                 "        ↓  import\n"
                 "netlify/functions/sven-chat.mjs"),
        ("p", "`sven-chat.mjs` importerar exakt tre symboler: `CART_ID_LISTA`, "
              "`PRODUKTER_OCH_PRISER` och `SVEN_FACTS`. Byggkörningen 2026-09-21 gav **301 cart-ID:n**, "
              "156 produktrader, 345 poster i QUOTE_CATALOG och 71 rader i SVEN_FACTS."),
        ("note", "**Rättelse:** flera äldre beskrivningar talade om \"80 produkter i "
                 "`SVEN_PRODUCTS`-objektet i `Layout.astro`\". Det stämmer inte sedan `d63a3f86`. "
                 "Det finns inget `SVEN_PRODUCTS`-objekt i `Layout.astro` — bara en kommentar som pekar "
                 "på källan. En handskriven produktlista där skulle tyst gå isär med katalogen."),

        ("h2", "4.2 Funktioner"),
        ("p", "Kundtyp tidigt (företag/privatperson/förening → `customerType` styr prisvisning); "
              "klickbara markdown-länkar; varukorgsintegrering via `[CART:id]`-taggar → lavendelknapp "
              "som kör `skCart.add()`; vidarekoppling via `[FORWARD:offert|ring|fraga]`. "
              "Teatermask-ikon växlar via regex. Inaktivitets-popup 40 s → badge, +8 s → auto-öppnar. "
              "Betyg 1–5 ★ efter 2 svar. Loggning via `SVEN_LOG:{JSON}`."),
        ("note", "**Kontaktkrav före vidarekoppling (2026-07-20):** Sven avger inte `[FORWARD]` förrän "
                 "kunden uppgett namn + minst en kontaktväg (e-post eller telefon). Obligatoriskt block "
                 "i systemprompten."),

        ("h2", "4.3 Svens karaktär"),
        ("p", "Ville bli artist, jobbar nu som intendent bakom scenen. Hjälpsam och kunnig med en "
              "bitter underton som slipper igenom ibland. Torr humor, aldrig på kundens bekostnad."),

        ("h1", "5. Ändringshistorik"),
        ("table", [
            ["Version", "Datum", "Ändring"],
            ["v16.0", "2026-09-21",
             "Ny §4.1 Produktregistret — en källa, med kedjan sven-products.mjs → generate-products.mjs "
             "→ _products-generated.mjs, de faktiska exportnamnen (CART_ID_LISTA, PRODUKTER_OCH_PRISER, "
             "SVEN_FACTS) och 301 cart-ID verifierade mot bygget. Rättelse av påståendet om 80 produkter "
             "i Layout.astro. §1.1 not om att avsändaren är hej@, inte noreply@. §2.2 not om att p=none "
             "är föråldrat. §4 uppdelad i §4.1–4.3."],
            ["v15.0", "2026-07-25", "Reissue oförändrad (inga funktionella ändringar i e-post/DNS/SMS/Sven under v15-genomgången)."],
            ["v14.0", "2026-07-22", "§4.1 sven-chat.mjs + esbuild-not. Ny §4.2 Svens kontaktkrav. §3 sms-fallback.mjs."],
            ["v13.1", "2026-06-23", "DMARC-sektionen utökad."],
        ]),
    ],
)
