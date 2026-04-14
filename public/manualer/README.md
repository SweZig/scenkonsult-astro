# Produktmanualer

PDF-filer för produktmanualer hostas här och serveras från scenkonsult.se/manualer/

## Namnkonvention

Använd artno som filnamn:

```
SK-DJ-0001.pdf       → Numark Mixstream Pro+
SK-DJ-0002.pdf       → Denon Prime GO+
SK-DJ-0003.pdf       → Denon Prime 4+
SK-LJD-MIK-0016.pdf  → Trådlös handmikrofon
SK-LJS-EFF-0010.pdf  → Moving Head Wash
```

## Koppla manual till produkt i JSON

Lägg till fältet `manualUrl` på respektive produkt i src/data/*.json:

```json
{
  "artno": "SK-DJ-0003",
  "name": "DJ-controller, Standalone (Denon Prime 4+)",
  "price": 1499,
  "manualUrl": "/manualer/SK-DJ-0003.pdf"
}
```

## Ladda upp PDF via GitHub

1. Gå till https://github.com/SweZig/scenkonsult-astro/tree/main/public/manualer
2. Klicka "Add file" → "Upload files"
3. Dra och släpp PDF-filerna (namngivna enligt ovan)
4. Commit direkt till main → Netlify deployas automatiskt
