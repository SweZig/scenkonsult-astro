-- Referenscase Mr French, Skeppsbron (2026-10-17)
--
-- DJ och ljud (uppgift från Scenkonsult; bilderna visar DJ-kontroller,
-- Allen & Heath-mixer och högtalare på stativ). Tre porträttbilder, 1050×1400.
-- Visas på /referenser/ och på DJ-hubben, där det ersätter Läkarförbundet
-- (som ligger kvar på ljud- och ljushubbarna och på referenssidan).
--
-- Kör i Supabase SQL editor INNAN pushen — generatorn skriver om
-- event-cases.json ur databasen vid varje bygge.

BEGIN;

INSERT INTO event_cases (id, label, descr, tag, categories, sort_order) VALUES
  ('case-mr-french-skeppsbron', 'Mr French – Skeppsbron', 'DJ och ljud i restaurangmiljö', 'Företagsevent',
   ARRAY['dj','ljud'], (SELECT COALESCE(MIN(sort_order), 0) - 1 FROM event_cases))
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, descr = EXCLUDED.descr, tag = EXCLUDED.tag,
  categories = EXCLUDED.categories, active = TRUE, updated_at = NOW();

DELETE FROM event_case_images WHERE case_id = 'case-mr-french-skeppsbron';
INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-mr-french-skeppsbron', '/images/event/kundevent_mr_french_1.webp',
   'DJ spelar på Mr French med högtalare och mixerbord i förgrunden', TRUE, 0),
  ('case-mr-french-skeppsbron', '/images/event/kundevent_mr_french_2.webp',
   'DJ-kontroller och laptop framför gästerna på Mr French', TRUE, 1),
  ('case-mr-french-skeppsbron', '/images/event/kundevent_mr_french_3.webp',
   'DJ-båset mot loungen på Mr French, Skeppsbron', TRUE, 2);

-- DJ-hubben: Mr French först, Läkarförbundet ut.
DELETE FROM event_case_hub WHERE category = 'dj' AND case_id = 'case-lakarforbundet-ostermalm';
INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-mr-french-skeppsbron', 'dj', '/images/event/kundevent_mr_french_1.webp',
   'Mr French – Skeppsbron', 'DJ och ljud i restaurangmiljö',
   'DJ spelar på Mr French med högtalare och mixerbord i förgrunden', NULL, 0)
ON CONFLICT (case_id, category) DO UPDATE SET image_src = EXCLUDED.image_src, label = EXCLUDED.label,
  descr = EXCLUDED.descr, alt = EXCLUDED.alt, pos = EXCLUDED.pos, sort_order = EXCLUDED.sort_order;
UPDATE event_case_hub SET sort_order = 1 WHERE category = 'dj' AND case_id = 'case-skridskodisco-ostermalms-ip';
UPDATE event_case_hub SET sort_order = 2 WHERE category = 'dj' AND case_id = 'case-djursholms-slott';

COMMIT;
