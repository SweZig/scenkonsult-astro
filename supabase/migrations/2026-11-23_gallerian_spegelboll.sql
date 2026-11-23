-- German Beer Hall, Gallerian — två nya bilder (2026-11-23)
--
-- Spegelbollen i ljusgården och monteringen av den. 3:4-bilder
-- (1050×1400 + 640w) i public/images/event/. Kortet på /referenser/ får sex
-- bilder i bildspelet (sk-xfade-6). Samma bilder i 4:3 ligger i
-- src/data/installation.json för installationssidan.
--
-- Rör bara bilderna i galleriet: befintliga rader får ny ordning, de nya läggs
-- in. Inget raderas (hubbarnas egna bilder ligger kvar).
--
-- Kör i Supabase SQL editor INNAN pushen:
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

BEGIN;

INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-german-beerhall', '/images/event/installation_beerhall_gallerian_spegelboll.webp',
   'Spegelbollen i ljusgården på German Beer Hall, Gallerian, belyst i blått', TRUE, 1),
  ('case-german-beerhall', '/images/event/installation_beerhall_gallerian_spegelboll_montage.webp',
   'Montering av spegelbollen från en ställning i ljusgården på German Beer Hall, Gallerian', TRUE, 4)
ON CONFLICT (case_id, src) DO UPDATE SET alt = EXCLUDED.alt, in_gallery = TRUE, sort_order = EXCLUDED.sort_order;

UPDATE event_case_images SET sort_order = 0 WHERE case_id = 'case-german-beerhall' AND src = '/images/event/installation_beerhall_gallerian_ljusramper.webp';
UPDATE event_case_images SET sort_order = 2 WHERE case_id = 'case-german-beerhall' AND src = '/images/event/installation_beerhall_gallerian_ljusramper_gron.webp';
UPDATE event_case_images SET sort_order = 3 WHERE case_id = 'case-german-beerhall' AND src = '/images/event/installation_beerhall_gallerian_montage.webp';
UPDATE event_case_images SET sort_order = 5 WHERE case_id = 'case-german-beerhall' AND src = '/images/event/installation_beerhall_gallerian_tak.webp';

UPDATE event_cases SET updated_at = NOW() WHERE id = 'case-german-beerhall';

COMMIT;

-- Kontroll: ska ge sex rader i ordningen ljusramper, spegelboll, ljusramper_gron,
-- montage, spegelboll_montage, tak
-- SELECT sort_order, src FROM event_case_images
--   WHERE case_id = 'case-german-beerhall' AND in_gallery ORDER BY sort_order;
