-- Etapp 1: Bild — topplista och referensrader för /vara-tjanster/hyra-bild/

UPDATE content_categories SET
  popular_lead = 'Välj efter lokal och publik – från projektor i konferensrummet till LED-trailer i full sol.',
  cases_lead   = 'Ett urval av bild- och skärmlösningar vi levererat i Stockholm.',
  alla_label   = 'Se alla bildprodukter →',
  updated_at   = NOW()
WHERE slug = 'bild';

INSERT INTO popular_groups (id, category, rubrik, gaster, lead, sort_order) VALUES
  ('pg-bild-konferens-presentation', 'bild', 'Konferens & presentation', 'Upp till 100 deltagare', 'Projektor med duk i nedmörkat rum, skärm när lokalen är ljus. HDMI-kabel, fjärrkontroll och adaptrar ingår alltid.', 0),
  ('pg-bild-stor-bild-inomhus', 'bild', 'Stor bild inomhus', '100+ deltagare', 'När bakersta raden sitter långt bak – stora dukar och LED-vägg på tross, monterade på plats.', 1),
  ('pg-bild-utomhus-dagsljus', 'bild', 'Utomhus & dagsljus', 'Festival, sportevent & torg', 'Full sol utan nedmörkning. Mobil LED-trailer som rullas in färdigriggad – montering och tekniker ingår.', 2)
ON CONFLICT (id) DO UPDATE SET
  rubrik = EXCLUDED.rubrik, gaster = EXCLUDED.gaster, lead = EXCLUDED.lead,
  sort_order = EXCLUDED.sort_order, active = TRUE, updated_at = NOW();

INSERT INTO popular_group_items (group_id, artno, sort_order, source) VALUES
  ('pg-bild-konferens-presentation', 'SK-BLD-0002', 0, 'manual'),
  ('pg-bild-konferens-presentation', 'SK-BLD-0007', 1, 'manual'),
  ('pg-bild-konferens-presentation', 'SK-BLD-0004', 2, 'manual'),
  ('pg-bild-stor-bild-inomhus', 'SK-BLD-0010', 0, 'manual'),
  ('pg-bild-stor-bild-inomhus', 'SK-BLD-0016', 1, 'manual'),
  ('pg-bild-stor-bild-inomhus', 'SK-BLD-0013', 2, 'manual'),
  ('pg-bild-utomhus-dagsljus', 'SK-BLD-0006', 0, 'manual'),
  ('pg-bild-utomhus-dagsljus', 'SK-BLD-0011', 1, 'manual'),
  ('pg-bild-utomhus-dagsljus', 'SK-BLD-0012', 2, 'manual')
ON CONFLICT (group_id, artno) DO NOTHING;

INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-ea-sports-fc-27-ikea-gallerian', 'bild', '/images/event/kundevent_ea_sports_fc27_1.webp', 'EA Sports FC 27 – IKEA Gallerian', 'Skärmar på golvstativ för produktlansering', 'TV-skärm på golvstativ med EA Sports FC 27 på IKEA Gallerian', NULL, 0),
  ('case-tele2-scenpodie', 'bild', '/images/event/kundevent_tele2_scenpodie.webp', 'Tele2', 'LED-skärm och ridå för konferens', 'Scenpodie med ridå och LED-skärm hos Tele2', NULL, 1),
  ('case-100-knivar-odenplan', 'bild', '/images/event/kundevent_100knivar_1.webp', '100 Knivar – Odenplan', 'Skärm, ljud och bildmix för TV4', 'Skärm på stativ med kolonnhögtalare vid 100 Knivar på Odenplan', NULL, 2)
ON CONFLICT (case_id, category) DO UPDATE SET
  image_src = EXCLUDED.image_src, label = EXCLUDED.label, descr = EXCLUDED.descr,
  alt = EXCLUDED.alt, pos = EXCLUDED.pos, sort_order = EXCLUDED.sort_order;
