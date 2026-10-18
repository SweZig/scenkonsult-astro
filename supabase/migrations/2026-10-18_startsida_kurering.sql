-- Startsidans redesign (2026-10-18): topplista Konferens och referensraden "start"
--
-- 1. Kategorin 'start' i content_categories — referensraden på startsidan
--    (event_case_hub kräver att kategorin finns). Ingen hubbsida och ingen
--    egen topplista; startsidans topplista läser ljud, ljus, ljud & ljus, bild
--    och konferens.
-- 2. Topplista Konferens: fyra grupper per tillfälle. Visas bara på
--    startsidan (konferenssidan har ingen topplista). Trådlösa mikrofoner
--    saknar produktsida (produkt-sidor.mjs) och kan därför inte stå i listan.
--    Ta bort en eventuell äldre panelgrupp:
-- 3. Startsidans sex referenser, med egen bild och text per uppdrag.
--
-- Kör i Supabase SQL editor INNAN pushen — generatorerna skriver om de
-- committade fallback-filerna ur databasen vid varje bygge.
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

BEGIN;

-- ── 1. Kategorin 'start' ──────────────────────────────────────────────────
INSERT INTO content_categories (slug, label, hub_path, popular_heading, sort_order, active)
VALUES ('start', 'Startsida', '/', 'Våra mest bokade paket', 99, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label, hub_path = EXCLUDED.hub_path,
  popular_heading = EXCLUDED.popular_heading, active = TRUE, updated_at = NOW();

-- ── 2. Topplista Konferens ────────────────────────────────────────────────
DELETE FROM popular_groups WHERE id = 'pg-konferens-panel';

INSERT INTO popular_groups (id, category, rubrik, gaster, lead, sort_order) VALUES
  ('pg-konferens-tal', 'konferens', 'Tal, konferens & mingel', 'Upp till 380 gäster',
   'Talarljud och bakgrundsmusik som hörs i hela lokalen.', 0),
  ('pg-konferens-presentation', 'konferens', 'Presentation & bild', 'Upp till 100 deltagare',
   'Projektor som kopplas till er dator — duk eller skärm efter rummet.', 1),
  ('pg-konferens-kolumn', 'konferens', 'Diskret ljud i konferensrummet', NULL,
   'Smala kolumnhögtalare som syns lite i rummet.', 2),
  ('pg-konferens-talarscen', 'konferens', 'Talarscen', '4–8 m²',
   'En upphöjd plats för talare och panel.', 3)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category, rubrik = EXCLUDED.rubrik, gaster = EXCLUDED.gaster,
  lead = EXCLUDED.lead, sort_order = EXCLUDED.sort_order, active = TRUE, updated_at = NOW();

DELETE FROM popular_group_items
WHERE group_id IN ('pg-konferens-tal', 'pg-konferens-presentation', 'pg-konferens-kolumn', 'pg-konferens-talarscen');

INSERT INTO popular_group_items (group_id, artno, sort_order, source) VALUES
  ('pg-konferens-tal', 'SK-LJD-EVE-0001', 0, 'manual'),
  ('pg-konferens-tal', 'SK-LJD-EVE-0002', 1, 'manual'),
  ('pg-konferens-presentation', 'SK-BLD-0002', 0, 'manual'),
  ('pg-konferens-presentation', 'SK-BLD-0007', 1, 'manual'),
  ('pg-konferens-kolumn', 'SK-LJD-POR-0003-NM', 0, 'manual'),
  ('pg-konferens-kolumn', 'SK-LJD-POR-0004-NM', 1, 'manual'),
  ('pg-konferens-talarscen', 'SK-SCN-0002', 0, 'manual'),
  ('pg-konferens-talarscen', 'SK-SCN-0001', 1, 'manual'),
  ('pg-konferens-talarscen', 'SK-SCN-0003', 2, 'manual');

-- ── 3. Startsidans referensrad ────────────────────────────────────────────
INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-festival-vinterviken', 'start', '/images/event/festival_vinterviken_2.webp',
   'Festival – Vinterviken', 'Scen och ljud, Vasas Flora & Fauna m.fl.',
   'Publik framför scenen på festivalen i Vinterviken', NULL, 0),
  ('case-ea-sports-fc-27-ikea-gallerian', 'start', '/images/event/kundevent_ea_sports_fc27_1.webp',
   'EA Sports FC 27 – IKEA Gallerian', 'Lansering med Jung Co — skärmar på golvstativ',
   'TV-skärm på golvstativ med EA Sports FC 27 på IKEA Gallerian', NULL, 1),
  ('case-jazz-blues-konserthuset', 'start', '/images/event/festival_jazz_konserthuset_1.webp',
   'Jazz & Blues – Konserthuset', 'Scen klädd med svart filtmatta',
   'Scen klädd med svart filtmatta i Konserthuset under Stockholm Jazz & Blues Festival', NULL, 2),
  ('case-storytel-event', 'start', '/images/event/kundevent_storytel_1.webp',
   'Storytel', 'Med Studio S19 — ljud, LED-vägg och scenpodie',
   'Projektor över publiken på Storytels event', NULL, 3),
  ('case-mr-french-skeppsbron', 'start', '/images/event/kundevent_mr_french_1.webp',
   'Mr French – Skeppsbron', 'DJ och ljud i restaurangmiljö',
   'DJ spelar på Mr French med högtalare och mixerbord i förgrunden', NULL, 4),
  ('case-abg-sundal-collier-konferens', 'start', '/images/event/kundevent_abg_konferens.webp',
   'ABG Sundal Collier – Konferens', 'LED-skärmar, konferens-AV och uplight',
   'ABG Sundal Collier konferens med LED-skärmar och uplight', NULL, 5)
ON CONFLICT (case_id, category) DO UPDATE SET
  image_src = EXCLUDED.image_src, label = EXCLUDED.label, descr = EXCLUDED.descr,
  alt = EXCLUDED.alt, pos = EXCLUDED.pos, sort_order = EXCLUDED.sort_order;

COMMIT;
