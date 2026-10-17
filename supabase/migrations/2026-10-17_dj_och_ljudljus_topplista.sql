-- DJ-hubbens referensrad och en egen topplista för ljud & ljus (2026-10-17)
--
-- 1. DJ: Djursholms Slott och Läkarförbundet är uppdragen med DJ (uppgift från
--    Scenkonsult). Systembolaget lämnar DJ-hubben — där var det ljud och ljus.
--    Båda casen får 'dj' bland sina kategorier och DJ i texten, liksom
--    Skridskodiscot som redan låg på DJ-hubben.
-- 2. Ljud & ljus: kategorin ärvde ljud + ljus (åtta grupper, 24 produkter) men
--    renderades inte. Den får nu tre egna, korta grupper per tillfälle och
--    visas på /vara-tjanster/hyra-ljud-och-ljus/.
--
-- Kör i Supabase SQL editor INNAN pushen — generatorn skriver om de committade
-- fallback-filerna ur databasen vid varje bygge.
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

BEGIN;

-- ── 1. DJ-hubben ───────────────────────────────────────────────────────────
UPDATE event_cases SET
  descr = 'Galakväll med DJ, scenljus & PA-system',
  categories = ARRAY(SELECT DISTINCT unnest(categories || ARRAY['dj']) ORDER BY 1),
  updated_at = NOW()
WHERE id = 'case-djursholms-slott';

UPDATE event_cases SET
  descr = 'Festvåning med DJ, komplett ljud & ljus',
  categories = ARRAY(SELECT DISTINCT unnest(categories || ARRAY['dj']) ORDER BY 1),
  updated_at = NOW()
WHERE id = 'case-lakarforbundet-ostermalm';

-- Skridskodiscot låg redan på DJ-hubben men saknade kategorin.
UPDATE event_cases SET
  categories = ARRAY(SELECT DISTINCT unnest(categories || ARRAY['dj']) ORDER BY 1),
  updated_at = NOW()
WHERE id = 'case-skridskodisco-ostermalms-ip';

DELETE FROM event_case_hub WHERE category = 'dj' AND case_id = 'case-systembolaget';

INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-djursholms-slott', 'dj', '/images/event/kundevent_djursholms_slott.webp',
   'Djursholms Slott', 'DJ, ljud och scenljus till galakväll',
   'Galakväll med DJ på Djursholms Slott', NULL, 1)
ON CONFLICT (case_id, category) DO UPDATE SET
  image_src = EXCLUDED.image_src, label = EXCLUDED.label, descr = EXCLUDED.descr,
  alt = EXCLUDED.alt, pos = EXCLUDED.pos, sort_order = EXCLUDED.sort_order;

UPDATE event_case_hub SET descr = 'DJ, ljud och ljus i festvåning', sort_order = 2
WHERE category = 'dj' AND case_id = 'case-lakarforbundet-ostermalm';

UPDATE content_categories SET
  cases_lead = 'Fester och event där vi stått för DJ, ljud och ljus.',
  updated_at = NOW()
WHERE slug = 'dj';

-- ── 2. Topplista Ljud & ljus ───────────────────────────────────────────────
UPDATE content_categories SET
  source_categories = '{}',
  popular_lead = 'Ljud och ljus som brukar hyras tillsammans. Klicka på ett paket för att se storlek och gästantal.',
  updated_at = NOW()
WHERE slug = 'ljud-och-ljus';

INSERT INTO popular_groups (id, category, rubrik, gaster, lead, sort_order) VALUES
  ('pg-ljudljus-fest-brollop', 'ljud-och-ljus', 'Fest, bröllop & dans', NULL,
   'Subwoofer för dansgolvet och ljus som ramar in det.', 0),
  ('pg-ljudljus-stor-fest', 'ljud-och-ljus', 'Stor fest & dansgolv', NULL,
   'Mer bas och fler armaturer när dansgolvet är stort.', 1),
  ('pg-ljudljus-konferens-scen', 'ljud-och-ljus', 'Konferens, tal & scen', NULL,
   'Tydligt tal i högtalarna och scenljus på den som pratar.', 2)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category, rubrik = EXCLUDED.rubrik, gaster = EXCLUDED.gaster,
  lead = EXCLUDED.lead, sort_order = EXCLUDED.sort_order, active = TRUE, updated_at = NOW();

DELETE FROM popular_group_items
WHERE group_id IN ('pg-ljudljus-fest-brollop', 'pg-ljudljus-stor-fest', 'pg-ljudljus-konferens-scen');

INSERT INTO popular_group_items (group_id, artno, sort_order, source) VALUES
  ('pg-ljudljus-fest-brollop',   'SK-LJD-MUS-0001', 0, 'manual'),
  ('pg-ljudljus-fest-brollop',   'SK-LJD-MUS-0002', 1, 'manual'),
  ('pg-ljudljus-fest-brollop',   'SK-LJS-PAK-0022', 2, 'manual'),
  ('pg-ljudljus-fest-brollop',   'SK-LJS-PAK-0025', 3, 'manual'),
  ('pg-ljudljus-stor-fest',      'SK-LJD-MUS-0004', 0, 'manual'),
  ('pg-ljudljus-stor-fest',      'SK-LJS-PAK-0007', 1, 'manual'),
  ('pg-ljudljus-stor-fest',      'SK-LJS-PAK-0008', 2, 'manual'),
  ('pg-ljudljus-konferens-scen', 'SK-LJD-EVE-0001', 0, 'manual'),
  ('pg-ljudljus-konferens-scen', 'SK-LJD-EVE-0002', 1, 'manual'),
  ('pg-ljudljus-konferens-scen', 'SK-LJS-PAK-0016', 2, 'manual');

COMMIT;
