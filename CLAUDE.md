# CLAUDE.md – Underhållsguide för Scenkonsult Norden

Kort guide för den som ändrar sajten, med eller utan Claude. **Reglerna i sin
helhet står i projektspecifikationen** (claude.ai-projektet "Scenkonsult-astro",
`claude/Scenkonsult_Projektspecifikation.md`) och i Dok 1–6, som byggs av
`spec/` i det här repot (`python3 spec_builder.py <utkatalog> --md`). Säger den
här filen emot specen gäller specen.

## Arbetsgång

```powershell
npm run sync        # git pull --rebase --autostash && npm ci — alltid först
# ... ändra ...
npm run preflight   # git fetch, git status och npm run build
npm test            # Netlify kör inte testerna
git add <sökvägar>  # aldrig -A
git commit -m "..."
git push            # Netlify bygger och publicerar main automatiskt
```

`npm run sync` först, eftersom admin-panelen committar prisändringar direkt
till `main`. Det finns inget manuellt deploy-steg — en push till `main` är en
publicering.

## Var saker bor

```
src/data/        ← ~90 % av alla ändringar: priser, texter, produkter (JSON)
src/components/  ← återanvändbara delar
src/pages/       ← en fil per URL
src/lib/         ← motorer: montering, frakt, Svens register, produktsidor
src/utils/       ← hjälpare: tider (hours.ts), benhöjder (scenHojder.ts), länkar
netlify/         ← serverless-funktioner och generatorer som körs vid bygget
spec/            ← generatorn för specdokumenten Dok 1–6
```

Genererade filer committas aldrig: `quote-catalog.json`,
`order-catalog-flat.json`, `montering-catalog.json`,
`netlify/functions/_products-generated.mjs`, `public/llms.txt` och
Excel-katalogen. De byggs av `prebuild`.

Topplistor, referenscase, referenskunder och recensioner underhålls i
`/admin/` och ligger i Supabase. `popular.json`, `event-cases.json`,
`clients.json` och `reviews.json` är bara fallback-kopior — **databasen först,
push sedan**.

## Vanliga ändringar

- **Pris eller produkt:** redigera rätt fil i `src/data/` (eller via
  `/admin/produkter/`). Slå alltid upp produkter på `artno`, aldrig på plats i
  listan. En hyrbar rad = ett artikelnummer; ett nummer återanvänds aldrig.
  Utgångna produkter får `"active": false` och ligger kvar.
- **FAQ:** nycklarna heter `q` och `a` i alla filer.
- **Kontaktuppgifter och tider:** `site.json → company`. Sidorna hämtar
  klockslagen via `src/utils/hours.ts` — skriv aldrig in tider i en sida.
- **Montering och frakt** räknas av motorerna i `src/lib/` — skriv aldrig
  belopp för hand, och skriv aldrig att montering eller frakt "ingår".
- **Ny sida:** en fil i `src/pages/` (sökvägen blir URL:en). Unik `title`
  (max 60 tecken) och `description` (max 155), breadcrumbs, schema-markup och
  alt-text på bilder.

## URL:er

Ändra aldrig en befintlig URL. Måste den bytas: lägg en 301 i `netlify.toml`.

```toml
[[redirects]]
  from = "/gammal-url/"
  to = "/ny-url/"
  status = 301
```

## Lokalt

```bash
npm ci
npm run dev        # http://localhost:4321
```

Python anropas via `node scripts/run-python.mjs <skript>` — `python3` rakt av
är Microsoft Stores platshållare i PowerShell.
