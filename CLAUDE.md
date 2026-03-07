# CLAUDE.md – Underhållsguide för Scenkonsult Norden

Denna fil förklarar hur du som underhåller sajten (med hjälp av Claude) gör vanliga ändringar. Läs den varje gång du ber Claude om hjälp med sajten.

## Projektstruktur

```
scenkonsult-astro/
├── src/
│   ├── data/              ← HÄR gör du 90% av alla ändringar
│   │   ├── site.json      ← Globala inställningar, kontakt, recensioner, FAQ, kunder
│   │   ├── scenes.json    ← Alla scenpaket och tillbehör (priser, beskrivningar)
│   │   ├── ljud.json      ← Alla ljudpaket
│   │   ├── ljus.json      ← Alla ljuspaket
│   │   └── dj.json        ← DJ-tjänster
│   ├── layouts/
│   │   └── Layout.astro   ← Header, footer, SEO – ändras sällan
│   ├── components/        ← Återanvändbara UI-delar
│   └── pages/             ← En fil per URL
├── public/
│   ├── robots.txt         ← Sökmotordirektiv
│   ├── llms.txt           ← AI-plattformsdirektiv (uppdatera vid stora ändringar)
│   └── images/            ← Alla bilder läggs här
└── astro.config.mjs       ← Ändras nästan aldrig
```

## Vanliga uppgifter

### Ändra ett pris
Redigera rätt JSON-fil i `src/data/`. Exempel i `scenes.json`:
```json
{ "id": "small", "price": 649, ... }
```

### Lägga till ett nytt scenpaket
Lägg till ett objekt i `products`-arrayen i `src/data/scenes.json`. Kopiera ett befintligt objekt och ändra värdena.

### Lägga till en kundrecension
Lägg till i `reviews`-arrayen i `src/data/site.json`:
```json
{ "author": "Namn", "location": "Stad", "rating": 5, "text": "Bra service!" }
```

### Lägga till FAQ-fråga
Lägg till i `faq`-arrayen i `src/data/site.json`:
```json
{ "question": "Din fråga?", "answer": "Svaret på frågan." }
```

### Lägga till en ny sida
Skapa en ny fil i `src/pages/`. Filens sökväg = URL. Exempel:
- `src/pages/brollop/index.astro` → `/brollop/`
- `src/pages/foretagsevent/index.astro` → `/foretagsevent/`

Kopiera strukturen från en befintlig sida. Kom ihåg att:
1. Sätta `title` och `description` i frontmatter
2. Lägga till passande schema-markup
3. Inkludera breadcrumb-navigering

### Uppdatera kontaktuppgifter
Ändra i `site.json` under `"company"`. Ändringen sprids automatiskt till header, footer och schema-markup på alla sidor.

### Lägga till bilder
1. Kopiera bildfilen till `public/images/`
2. Referera till den som `/images/filnamn.jpg` i JSON-data eller i .astro-filen

## Driftsätta till produktion

```bash
# Bygg sajten
npm run build

# Förhandsgranska
npm run preview

# Deploya via Netlify CLI
netlify deploy --prod --dir=dist
```

## Köra lokalt för utveckling

```bash
npm install
npm run dev
# Öppna http://localhost:4321
```

## SEO-checklista vid nya sidor

- [ ] Unik `title` (max 60 tecken) med primärt nyckelord + "Stockholm"
- [ ] Unik `description` (max 155 tecken) med geo + uppmaning
- [ ] Breadcrumb-navigering med schema markup
- [ ] Minst ett schema-objekt (Product, FAQPage, Article etc.)
- [ ] Alt-text på alla bilder
- [ ] Intern länkning från relevanta befintliga sidor
- [ ] Lägg till sidan i llms.txt om den är viktig

## URL-regler (kritiska för SEO!)

**Ändra aldrig befintliga URL:er.** Om du måste byta URL, skapa en redirect i `netlify.toml`:

```toml
[[redirects]]
  from = "/gammal-url/"
  to = "/ny-url/"
  status = 301
```

## Kontakt för felsökning

- Astro docs: https://docs.astro.build
- Netlify docs: https://docs.netlify.com
- Tailwind docs: https://tailwindcss.com/docs
