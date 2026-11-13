-- Projektering och fast installation (2026-11-13)
--
-- Ny kategori 'installation' (sidan /vara-tjanster/projektering-och-installation/)
-- och tre referenscase. Uppgifter från Scenkonsult:
--   German Beer Hall, Gallerian  — ljuseffekter, ljusstyrning, scen 4×4 m (ca 10 armaturer)
--   German Beer Hall, Uppsala    — ljuseffekter, ljusstyrning, ljudstyrning, scen 2×1 m (ca 20)
--   Ulvsunda idrottscentrum      — bara ljuset: ljuseffekter, ljusstyrning, stödbelysning
--                                  1 200 → 2 000 lux på spelytan (ca 60). Kund Skanska och
--                                  Stockholms stad, idrottsförvaltningen.
-- Alla installerade 2026. Bilderna är 3:4 (1050×1400 + 640w) i public/images/event/.
--
-- case-german-beerhall behåller sitt id (det är Gallerian-projektet); de två gamla
-- bilderna ersätts i galleriet men ligger kvar som filer — startsidan, /vara-tjanster/
-- och ljushubben använder dem direkt.
--
-- Kategorin behövs för att kryssrutan ska finnas i /admin/referenscase/ — annars
-- tappar caset 'installation' nästa gång det sparas där.
--
-- Kör i Supabase SQL editor INNAN pushen:
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

BEGIN;

INSERT INTO content_categories (slug, label, hub_path, alla_href, alla_label, popular_heading, cases_lead, sort_order) VALUES
  ('installation', 'Installation', '/vara-tjanster/projektering-och-installation/',
   '/vara-tjanster/projektering-och-installation/', 'Se alla installationer →', 'Topplista Installation',
   'Fasta installationer vi projekterat och byggt.',
   (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM content_categories))
ON CONFLICT (slug) DO NOTHING;

-- Gallerian — befintligt case, ny rubrik, text och bilder
UPDATE event_cases SET
  label = 'German Beer Hall – Gallerian',
  descr = 'Fast installation — ljuseffekter, ljusstyrning och scen 4 × 4 m',
  tag = 'Installation',
  categories = ARRAY['ljus', 'scen', 'installation'],
  active = TRUE, updated_at = NOW()
WHERE id = 'case-german-beerhall';

INSERT INTO event_cases (id, label, descr, tag, categories, sort_order) VALUES
  ('case-german-beerhall-uppsala', 'German Beer Hall – Uppsala',
   'Fast installation — ljuseffekter, ljus- och ljudstyrning, scen', 'Installation',
   ARRAY['ljus', 'ljud', 'scen', 'installation'], (SELECT COALESCE(MIN(sort_order), 0) - 1 FROM event_cases)),
  ('case-ulvsunda-idrottscentrum', 'Ulvsunda idrottscentrum – Bromma',
   'Fast ljusinstallation — 1 200 → 2 000 lux på spelytan', 'Installation',
   ARRAY['ljus', 'installation'], (SELECT COALESCE(MIN(sort_order), 0) - 2 FROM event_cases))
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, descr = EXCLUDED.descr, tag = EXCLUDED.tag,
  categories = EXCLUDED.categories, active = TRUE, updated_at = NOW();

DELETE FROM event_case_images
 WHERE case_id IN ('case-german-beerhall', 'case-german-beerhall-uppsala', 'case-ulvsunda-idrottscentrum');

INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-german-beerhall', '/images/event/installation_beerhall_gallerian_ljusramper.webp',
   'Ljusramper i lila och blått längs takribborna på German Beer Hall i Gallerian', TRUE, 0),
  ('case-german-beerhall', '/images/event/installation_beerhall_gallerian_ljusramper_gron.webp',
   'Ljusramper och effektljus i grönt och blått i taket på German Beer Hall, Gallerian', TRUE, 1),
  ('case-german-beerhall', '/images/event/installation_beerhall_gallerian_montage.webp',
   'Två av våra tekniker monterar ljus i taket från en saxlift på German Beer Hall, Gallerian', TRUE, 2),
  ('case-german-beerhall', '/images/event/installation_beerhall_gallerian_tak.webp',
   'Taket med installerade ljusramper på German Beer Hall, Gallerian', TRUE, 3),
  ('case-german-beerhall-uppsala', '/images/event/installation_beerhall_uppsala_bar_rod.webp',
   'Rött, blått och grönt effektljus över baren på German Beer Hall i Uppsala', TRUE, 0),
  ('case-german-beerhall-uppsala', '/images/event/installation_beerhall_uppsala_bar_bla.webp',
   'Blått effektljus i restaurangen på German Beer Hall i Uppsala', TRUE, 1),
  ('case-ulvsunda-idrottscentrum', '/images/event/installation_ulvsunda_golv_ljusmonster.webp',
   'Ljusmönster från effektljuset på spelytan i arenahallen, Ulvsunda idrottscentrum', TRUE, 0),
  ('case-ulvsunda-idrottscentrum', '/images/event/installation_ulvsunda_golv_gront.webp',
   'Grönt effektljus på spelytan i Ulvsunda idrottscentrum', TRUE, 1),
  ('case-ulvsunda-idrottscentrum', '/images/event/installation_ulvsunda_hallen_oversikt.webp',
   'Arenahallen i Ulvsunda idrottscentrum med läktare och effektljus på golvet', TRUE, 2);

COMMIT;
