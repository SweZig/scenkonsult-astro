-- Referenscase Foodora (2026-11-17)
--
-- Scen med scenkjol och matta i Foodoras rosa (uppgift från Scenkonsult).
-- Tre bilder, liggande original beskurna till 3:4 vid konverteringen
-- (1050×1400 + 640w) i public/images/event/.
-- Visas på /referenser/, inte på scenhubben (den har redan tre rader) — kan
-- bytas in i /admin/referenscase/ senare.
--
-- Kör i Supabase SQL editor INNAN pushen:
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

BEGIN;

INSERT INTO event_cases (id, label, descr, tag, categories, sort_order) VALUES
  ('case-foodora', 'Foodora', 'Scen med scenkjol och matta i Foodoras rosa', 'Företagsevent',
   ARRAY['scen'], (SELECT COALESCE(MIN(sort_order), 0) - 1 FROM event_cases))
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, descr = EXCLUDED.descr, tag = EXCLUDED.tag,
  categories = EXCLUDED.categories, active = TRUE, updated_at = NOW();

DELETE FROM event_case_images WHERE case_id = 'case-foodora';
INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-foodora', '/images/event/kundevent_foodora_scen_1.webp',
   'Scen med svart scenkjol och rosa matta framför Foodora-skylten', TRUE, 0),
  ('case-foodora', '/images/event/kundevent_foodora_scen_2.webp',
   'Scenen rakt framifrån med rosa matta i mitten och svart scenkjol hos Foodora', TRUE, 1),
  ('case-foodora', '/images/event/kundevent_foodora_scen_3.webp',
   'Närbild på scenkanten med svart scenkjol och rosa matta, Foodora-skylten i bakgrunden', TRUE, 2);

COMMIT;
