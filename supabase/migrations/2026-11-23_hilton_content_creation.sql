-- Referenscase Content Creation Conference, Hilton Stockholm (2026-11-23)
--
-- Arrangör Impactic. Levererat av Scenkonsult (uppgift från Per): scen med
-- scenkjol och trapp, kolumnhögtalare, trådlösa mikrofoner och headset,
-- datorer med bildmixer för presentationer och video, tekniker som körde hela
-- eventet. Projektorerna, dukarna och talarstolen var hotellets — de nämns inte.
--
-- Två bilder ur samma foto i public/images/event/:
--   kundevent_hilton_content_creation_scen.webp  3:4 (1050×1400 + 640w) — /referenser/
--   kundevent_hilton_content_creation.webp       4:3 (1600×1200 + 640w) — hubbraden
--                                                och heron på /vara-tjanster/konferens-av/
--
-- Konferenshubben (visas på /vara-tjanster/konferens-av/ och /for/konferens/)
-- får Hilton först. Tele2 lämnar konferensraden så att den blir tre kort;
-- caset ligger kvar på /referenser/ och på bildhubben.
--
-- Kör i Supabase SQL editor INNAN pushen:
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

BEGIN;

INSERT INTO event_cases (id, label, descr, tag, categories, sort_order) VALUES
  ('case-hilton-content-creation-conference', 'Content Creation Conference',
   'Impactic på Hilton — scen, kolumnhögtalare, mikrofoner, bildmixer och tekniker som körde hela konferensen',
   'Konferens', ARRAY['konferens', 'scen', 'ljud', 'bild'],
   (SELECT COALESCE(MIN(sort_order), 0) - 1 FROM event_cases))
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, descr = EXCLUDED.descr, tag = EXCLUDED.tag,
  categories = EXCLUDED.categories, active = TRUE, updated_at = NOW();

DELETE FROM event_case_images WHERE case_id = 'case-hilton-content-creation-conference';
INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-hilton-content-creation-conference', '/images/event/kundevent_hilton_content_creation_scen.webp',
   'Scen med svart scenkjol och trapp, kolumnhögtalare och stolsrader inför Content Creation Conference på Hilton i Stockholm', TRUE, 0),
  ('case-hilton-content-creation-conference', '/images/event/kundevent_hilton_content_creation.webp',
   'Konferenssal på Hilton i Stockholm med scen i scenkjol, kolumnhögtalare och stolsrader inför Content Creation Conference', FALSE, 1);

-- Konferenshubben: Hilton, Solna Näringsliv, ABG Sundal Collier
INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-hilton-content-creation-conference', 'konferens', '/images/event/kundevent_hilton_content_creation.webp',
   'Content Creation Conference', 'Scen, kolumnhögtalare, bildmixer och tekniker på plats', NULL, NULL, 0)
ON CONFLICT (case_id, category) DO UPDATE SET image_src = EXCLUDED.image_src, label = EXCLUDED.label,
  descr = EXCLUDED.descr, alt = EXCLUDED.alt, pos = EXCLUDED.pos, sort_order = EXCLUDED.sort_order;

UPDATE event_case_hub SET sort_order = 1 WHERE case_id = 'case-solna-naringsliv-konferens' AND category = 'konferens';
UPDATE event_case_hub SET sort_order = 2 WHERE case_id = 'case-abg-sundal-collier-konferens' AND category = 'konferens';
DELETE FROM event_case_hub WHERE case_id = 'case-tele2-scenpodie' AND category = 'konferens';

COMMIT;

-- Kontroll: ska ge tre rader i ordningen Hilton, Solna, ABG
-- SELECT sort_order, case_id FROM event_case_hub WHERE category = 'konferens' ORDER BY sort_order;
