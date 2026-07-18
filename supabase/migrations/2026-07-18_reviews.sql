-- Migration: reviews
-- Komplett, kurerad lista över Google-recensioner. Google Places API returnerar
-- max 5 recensioner (och väljer själv vilka), så nya recensioner syns aldrig via
-- API:t. Denna tabell underhålls i admin (/admin/recensioner/) och driver
-- referens- och kontaktsidan. Antalet i badgen hämtas separat live från Googles API.
-- Kör i Supabase SQL editor: https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

CREATE TABLE IF NOT EXISTS reviews (
  id            TEXT PRIMARY KEY,
  author        TEXT NOT NULL,
  rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT NOT NULL,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_active_sort
  ON reviews(active, sort_order)
  WHERE active = TRUE;

-- RLS: deny-all för anon/authenticated (samma mönster som chat_templates/carts).
-- Service role key (Netlify Functions) bypasser RLS, så funktionerna fungerar.
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_anon" ON reviews;
DROP POLICY IF EXISTS "deny_all_auth" ON reviews;

CREATE POLICY "deny_all_anon" ON reviews
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "deny_all_auth" ON reviews
  FOR ALL TO authenticated USING (false) WITH CHECK (false);

-- Seed: befintliga 8 recensioner (från Google 2026-07-18), nyaste först (sort_order 0..7).
INSERT INTO reviews (id, author, rating, review_text, published_at, sort_order) VALUES
  ('rev-seed-01', 'Sivar Rasq', 5, 'Mycket bra service, hjälpsamhet och tillgänglighet!', '2026-07-13T12:00:00Z', 0),
  ('rev-seed-02', 'Marcus L', 5, 'Mycket nöjd både med hyrd anläggning och kundservice. Snabba, trevliga och professionella. Allt det där lilla extra för att man ska ge 5/5 och rekommendera till andra!', '2026-06-27T12:00:00Z', 1),
  ('rev-seed-03', 'Jan Enberg', 5, 'Fantastisk service och flexibilitet.', '2026-06-18T12:00:00Z', 2),
  ('rev-seed-04', 'Amanda Månsson', 5, 'Smidig leverans, enkel uppsättning av utrustning och riktigt bra ljud för livemusik, Spotify etc. Rekommenderar verkligen Scenkonsulterna för alla typer av evenemang.', '2026-05-31T07:17:23Z', 3),
  ('rev-seed-05', 'Nikita Sohlan', 5, 'Prisvärt, proffsigt och smidigt. Rekommenderar starkt!', '2026-05-06T06:23:43Z', 4),
  ('rev-seed-06', 'Charlotte Axelsson', 5, 'DJ Måns gjorde kvällen till en succé och ingen ville lämna dansgolvet! Grymt smidigt och bra kommunikation hela vägen. Kan varmt rekommenderas!', '2024-09-02T18:07:52Z', 5),
  ('rev-seed-07', 'Cecilia Örnjäger', 5, 'Rekommenderar varmt! Garanterat bäst när det gäller. Proffsigt med glimten i ögat.', '2024-03-07T08:07:29Z', 6),
  ('rev-seed-08', 'Charlotta Frennby', 5, 'Hyrde ljud för en helg och var toppen. Mycket hjälpsamma och enkla att ha att göra med.', '2023-11-08T07:31:30Z', 7)
ON CONFLICT (id) DO NOTHING;
