-- Etapp 2: referensrader for scen, dj och konferens-av + harmoniserade rubriker

UPDATE content_categories SET popular_heading = CASE slug
  WHEN 'ljud' THEN 'Topplista Ljud'
  WHEN 'ljus' THEN 'Topplista Ljus'
  WHEN 'ljud-och-ljus' THEN 'Topplista Ljud & ljus'
  ELSE popular_heading END, updated_at = NOW()
WHERE slug IN ('ljud', 'ljus', 'ljud-och-ljus');

UPDATE content_categories SET cases_lead = CASE slug
  WHEN 'scen' THEN 'Scener vi byggt för festival, konsert och konferens i Stockholm.'
  WHEN 'dj' THEN 'Fester och event där vi stått för ljudet och ljuset.'
  WHEN 'konferens' THEN 'Konferenser vi utrustat med skärmar, ljud och scen i Stockholm.'
  ELSE cases_lead END, updated_at = NOW()
WHERE slug IN ('scen', 'dj', 'konferens');

INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-strawberry-arena-uf', 'scen', '/images/event/uf_strawberry_arena_2.webp', 'Strawberry Arena – Ung Företagsamhet', 'Stor scen med PA och ljusrigg', 'Scen- och ljusrigg för Ung Företagsamhet på Strawberry Arena', NULL, 0),
  ('case-jazz-blues-konserthuset', 'scen', '/images/event/festival_jazz_konserthuset_1.webp', 'Jazz & Blues – Konserthuset', 'Scen klädd med svart filtmatta', 'Scen klädd med svart filtmatta i Konserthuset under Stockholm Jazz & Blues Festival', NULL, 1),
  ('case-storytel-event', 'scen', '/images/event/kundevent_storytel_2.webp', 'Storytel', 'Scenpodie med LED-vägg och draperi', 'LED-vägg med svart draperi på scenpodie inför Storytel-event', NULL, 2),
  ('case-skridskodisco-ostermalms-ip', 'dj', '/images/event/skridskodisco_ostermalm_2.webp', 'Skridskodisco – Östermalms IP', 'DJ och ljud utomhus för Stockholms stad', 'DJ- och ljudsetup för skridskodisco på Östermalms IP', NULL, 0),
  ('case-systembolaget', 'dj', '/images/event/kundevent_systembolaget_4.webp', 'Systembolaget', 'Ljud och ljus till festvåning med dansgolv', 'Översikt av festvåningen med uplights och dansgolv', NULL, 1),
  ('case-lakarforbundet-ostermalm', 'dj', '/images/event/kundevent_lakarforbundet.webp', 'Läkarförbundet – Östermalm', 'Komplett ljud och ljus i festvåning', 'Kundevent på Läkarförbundets festvåning Östermalm', NULL, 2),
  ('case-solna-naringsliv-konferens', 'konferens', '/images/event/kundevent_solna_naringsliv.webp', 'Solna Näringsliv', 'Tre skärmar, uplight och PA-system', 'Konferens för Solna Näringsliv med skärmar och uplight', NULL, 0),
  ('case-abg-sundal-collier-konferens', 'konferens', '/images/event/kundevent_abg_konferens.webp', 'ABG Sundal Collier', 'LED-skärmar och konferens-AV i lokalen', 'ABG Sundal Collier konferens med LED-skärmar och uplight', NULL, 1),
  ('case-tele2-scenpodie', 'konferens', '/images/event/kundevent_tele2_scenpodie.webp', 'Tele2', 'Scenpodie, ridå och LED-skärm', 'Scenpodie med ridå och LED-skärm hos Tele2', NULL, 2)
ON CONFLICT (case_id, category) DO UPDATE SET
  image_src = EXCLUDED.image_src, label = EXCLUDED.label, descr = EXCLUDED.descr,
  alt = EXCLUDED.alt, pos = EXCLUDED.pos, sort_order = EXCLUDED.sort_order;
