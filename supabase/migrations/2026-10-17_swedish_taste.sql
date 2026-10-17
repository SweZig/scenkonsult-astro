-- Referenscase Swedish Taste, Västermalm (2026-10-17)
--
-- Bara DJ (uppgift från Scenkonsult). Två porträttbilder, 1050×1400.
-- Visas på /referenser/, inte på DJ-hubben (beslut 2026-10-17) — kan bytas in
-- i /admin/referenscase/ senare.
--
-- Kör i Supabase SQL editor INNAN pushen.

BEGIN;

INSERT INTO event_cases (id, label, descr, tag, categories, sort_order) VALUES
  ('case-swedish-taste-vastermalm', 'Swedish Taste – Västermalm', 'DJ-kväll i restaurangmiljö', 'Företagsevent',
   ARRAY['dj'], (SELECT COALESCE(MIN(sort_order), 0) - 1 FROM event_cases))
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, descr = EXCLUDED.descr, tag = EXCLUDED.tag,
  categories = EXCLUDED.categories, active = TRUE, updated_at = NOW();

DELETE FROM event_case_images WHERE case_id = 'case-swedish-taste-vastermalm';
INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-swedish-taste-vastermalm', '/images/event/kundevent_swedish_taste_1.webp',
   'DJ spelar vid kontrollern framför vinhyllorna på Swedish Taste', TRUE, 0),
  ('case-swedish-taste-vastermalm', '/images/event/kundevent_swedish_taste_2.webp',
   'DJ vid laptop och kontroller på Swedish Taste, Västermalm', TRUE, 1);

COMMIT;
