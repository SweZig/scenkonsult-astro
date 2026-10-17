-- Migration: content_curation
-- Flyttar kurateringslagret från hårdkodad JSON till databasen — en källa.
--
--   content_categories   kategorier/hubbar + rubriker (ingen hårdkodad lista i koden)
--   popular_groups       "Populäraste paketen": grupper per tillfälle och gästantal
--   popular_group_items  vilka artiklar som ligger i varje grupp (endast artno)
--   event_cases          referenscase — ersätter eventGallery i referenser/index.astro
--   event_case_images    casets bilder
--   event_case_hub       vilket case som visas på vilken hubb, med hubb-egen bild och text
--
-- Produktkatalogen ligger kvar i src/data/*.json och underhålls via /admin/produkter/.
-- Tabellerna här refererar bara artno — aldrig kopierad produktdata.
--
-- Läses vid prebuild av netlify/generate-popular.mjs och generate-event-cases.mjs,
-- som skriver src/data/popular.json och src/data/event-cases.json (committade
-- fallbacks, samma mönster som clients/reviews).
--
-- Kör i Supabase SQL editor:
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

-- ── Kategorier ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_categories (
  slug              TEXT PRIMARY KEY,                 -- 'ljud','ljus','bild','scen','dj',...
  label             TEXT NOT NULL,                    -- 'Ljud'
  hub_path          TEXT NOT NULL,                    -- '/vara-tjanster/hyra-ljud/'
  alla_href         TEXT,                             -- målet för "Se alla ..."-länken
  alla_label        TEXT,                             -- 'Se alla ljudpaket →'
  popular_heading   TEXT NOT NULL DEFAULT 'Populäraste paketen',
  popular_lead      TEXT,
  cases_lead        TEXT,                             -- lead över referensraden
  source_categories TEXT[] NOT NULL DEFAULT '{}',     -- tomt = sig själv. ljud-och-ljus = {ljud,ljus}
  stats_categories  TEXT[] NOT NULL DEFAULT '{}',     -- toppkategorier i admin-stats-sales som rankningen läser
  sort_order        INTEGER NOT NULL DEFAULT 0,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Populäraste paketen ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS popular_groups (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL REFERENCES content_categories(slug) ON UPDATE CASCADE,
  rubrik      TEXT NOT NULL,                          -- 'Fest, bröllop & dans'
  gaster      TEXT,                                   -- '20–250 gäster'
  lead        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_popular_groups_cat
  ON popular_groups(category, sort_order) WHERE active = TRUE;

CREATE TABLE IF NOT EXISTS popular_group_items (
  group_id    TEXT NOT NULL REFERENCES popular_groups(id) ON DELETE CASCADE,
  artno       TEXT NOT NULL,                          -- SK-LJD-EVE-0002
  sort_order  INTEGER NOT NULL DEFAULT 0,
  source      TEXT NOT NULL DEFAULT 'manual'          -- 'manual' | 'data' (vem satte raden)
              CHECK (source IN ('manual','data')),
  PRIMARY KEY (group_id, artno)
);

-- ── Referenscase ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_cases (
  id          TEXT PRIMARY KEY,                       -- 'case-systembolaget'
  label       TEXT NOT NULL,
  descr       TEXT NOT NULL,                          -- texten på referenssidan
  tag         TEXT NOT NULL,                          -- Festival/Företagsevent/Konferens/Installation/Aktivering
  categories  TEXT[] NOT NULL DEFAULT '{}',           -- {'ljud','ljus'} — styr var caset hör hemma
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_case_images (
  case_id     TEXT NOT NULL REFERENCES event_cases(id) ON DELETE CASCADE,
  src         TEXT NOT NULL,                          -- /images/event/...webp
  alt         TEXT NOT NULL,
  in_gallery  BOOLEAN NOT NULL DEFAULT TRUE,          -- FALSE = hör till caset men visas bara på hubb
  sort_order  INTEGER NOT NULL DEFAULT 0,             -- 0 = första bilden, sedan crossfade
  PRIMARY KEY (case_id, src)
);

-- Vilket case som syns på vilken hubb. En rad = caset visas på den hubben.
-- Hubben har egen bild och egen text: på ljudhubben lyfts ljudet fram,
-- på ljushubben ljuset — samma uppdrag, olika vinkel.
CREATE TABLE IF NOT EXISTS event_case_hub (
  case_id     TEXT NOT NULL REFERENCES event_cases(id) ON DELETE CASCADE,
  category    TEXT NOT NULL REFERENCES content_categories(slug) ON UPDATE CASCADE,
  image_src   TEXT NOT NULL,                          -- en av casets bilder
  label       TEXT,                                   -- NULL = casets egen rubrik
  descr       TEXT,                                   -- NULL = casets egen text
  alt         TEXT,                                   -- NULL = bildens egen alt-text
  pos         TEXT,                                   -- object-position vid 4:3-beskärning
  sort_order  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (case_id, category)
);

CREATE INDEX IF NOT EXISTS idx_event_case_hub_cat
  ON event_case_hub(category, sort_order);

-- ── RLS: deny-all för anon/authenticated (service role key bypassar) ───────
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['content_categories','popular_groups','popular_group_items',
                           'event_cases','event_case_images','event_case_hub']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "deny_all_anon" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "deny_all_auth" ON %I', t);
    EXECUTE format('CREATE POLICY "deny_all_anon" ON %I FOR ALL TO anon USING (false) WITH CHECK (false)', t);
    EXECUTE format('CREATE POLICY "deny_all_auth" ON %I FOR ALL TO authenticated USING (false) WITH CHECK (false)', t);
  END LOOP;
END $$;

-- Seed — exakt dagens innehåll. Sajten ska se likadan ut efter etapp 0.

INSERT INTO content_categories (slug, label, hub_path, alla_href, alla_label, popular_heading, popular_lead, source_categories, stats_categories, cases_lead, sort_order) VALUES
  ('ljud', 'Ljud', '/vara-tjanster/hyra-ljud/', '/vara-tjanster/hyra-ljud/event/', 'Se alla ljudpaket →', 'Populäraste paketen', 'Välj efter tillfälle och hur många ni blir – gästantalet står på varje paket.', '{}', ARRAY['Ljud'], 'Ett urval av ljudsystem vi levererat i Stockholm.', 0),
  ('ljus', 'Ljus', '/vara-tjanster/hyra-ljus/', '/vara-tjanster/hyra-ljus/fardiga-paket/', 'Se alla ljuspaket →', 'Populäraste paketen', 'Välj efter tillfälle och hur många ni blir – gästantalet står på varje paket.', '{}', ARRAY['Ljus'], 'Ett urval av ljussättningar vi levererat i Stockholm.', 1),
  ('bild', 'Bild', '/vara-tjanster/hyra-bild/', '/vara-tjanster/hyra-bild-projektorer-skarmar/', 'Se alla bildpaket →', 'Topplista Bild', NULL, '{}', ARRAY['Bild'], NULL, 2),
  ('scen', 'Scen', '/vara-tjanster/hyra-scen/', '/vara-tjanster/hyra-scen/', 'Se alla scenpaket →', 'Topplista Scen', NULL, '{}', ARRAY['Scen'], NULL, 3),
  ('dj', 'DJ', '/vara-tjanster/hyra-dj/', '/vara-tjanster/hyra-dj-utrustning/', 'Se all DJ-utrustning →', 'Topplista DJ', NULL, '{}', ARRAY['DJ'], NULL, 4),
  ('karaoke', 'Karaoke', '/vara-tjanster/hyra-karaoke/', '/vara-tjanster/hyra-karaoke/', 'Se alla karaokepaket →', 'Topplista Karaoke', NULL, '{}', ARRAY['Karaoke'], NULL, 5),
  ('konferens', 'Konferens-AV', '/vara-tjanster/konferens-av/', '/vara-tjanster/konferens-av/', 'Se all konferensteknik →', 'Topplista Konferens', NULL, '{}', ARRAY['Bild','Ljud','Scen'], NULL, 6),
  ('ljud-och-ljus', 'Ljud & ljus', '/vara-tjanster/hyra-ljud-och-ljus/', '/vara-tjanster/hyra-ljud-och-ljus/', 'Se alla paket →', 'Populäraste paketen', 'Välj efter tillfälle och hur många ni blir – gästantalet står på varje paket.', ARRAY['ljud','ljus'], ARRAY['Ljud','Ljus'], NULL, 7)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO popular_groups (id, category, rubrik, gaster, lead, sort_order) VALUES
  ('pg-ljud-tal-konferens-mingel', 'ljud', 'Tal, konferens & mingel', 'Upp till 380 gäster', 'Tydligt tal och behaglig bakgrundsmusik – för föreläsningar, konferenser och AW.', 0),
  ('pg-ljud-fest-brollop-dans', 'ljud', 'Fest, bröllop & dans', '20–250 gäster', 'Subwoofer för bas som fyller dansgolvet – till DJ, spellista eller band.', 1),
  ('pg-ljud-liveband-upptradanden', 'ljud', 'Liveband & uppträdanden', '20–280 gäster', 'Monitorer för musikerna och mixer för sång och instrument.', 2),
  ('pg-ljud-utomhus-utan-el', 'ljud', 'Utomhus & utan el', '20–200 gäster', 'Batteridrivna högtalare med inbyggd mixer – för mingel, studentflak och park.', 3),
  ('pg-ljus-hemmafest-mindre-fest', 'ljus', 'Hemmafest & mindre fest', 'Upp till 40 gäster', 'Ljudstyrda effekter på ett stativ – ställ upp, koppla in och dansgolvet lever.', 0),
  ('pg-ljus-brollop-fodelsedag-foretagsfest', 'ljus', 'Bröllop, födelsedag & företagsfest', 'Upp till 60 gäster', 'Två eller tre stativ som ramar in dansgolvet eller scenen och följer musiken.', 1),
  ('pg-ljus-stor-fest-dansgolv', 'ljus', 'Stor fest & dansgolv', '60–180 gäster', 'Moving heads, scanner och tross – ljus som fyller en hel festlokal.', 2),
  ('pg-ljus-scen-konsert-tal', 'ljus', 'Scen, konsert & tal', 'Scenljus', 'Jämnt ljus på talare, band och skådespelare – och följespot för solisten.', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO popular_group_items (group_id, artno, sort_order, source) VALUES
  ('pg-ljud-tal-konferens-mingel', 'SK-LJD-EVE-0001', 0, 'manual'),
  ('pg-ljud-tal-konferens-mingel', 'SK-LJD-EVE-0002', 1, 'manual'),
  ('pg-ljud-tal-konferens-mingel', 'SK-LJD-EVE-0004', 2, 'manual'),
  ('pg-ljud-fest-brollop-dans', 'SK-LJD-MUS-0001', 0, 'manual'),
  ('pg-ljud-fest-brollop-dans', 'SK-LJD-MUS-0002', 1, 'manual'),
  ('pg-ljud-fest-brollop-dans', 'SK-LJD-MUS-0004', 2, 'manual'),
  ('pg-ljud-liveband-upptradanden', 'SK-LJD-LIV-0001', 0, 'manual'),
  ('pg-ljud-liveband-upptradanden', 'SK-LJD-LIV-0002', 1, 'manual'),
  ('pg-ljud-liveband-upptradanden', 'SK-LJD-LIV-0003', 2, 'manual'),
  ('pg-ljud-utomhus-utan-el', 'SK-LJD-POR-0001', 0, 'manual'),
  ('pg-ljud-utomhus-utan-el', 'SK-LJD-POR-0002', 1, 'manual'),
  ('pg-ljud-utomhus-utan-el', 'SK-LJD-POR-0009', 2, 'manual'),
  ('pg-ljus-hemmafest-mindre-fest', 'SK-LJS-PAK-0018', 0, 'manual'),
  ('pg-ljus-hemmafest-mindre-fest', 'SK-LJS-PAK-0020', 1, 'manual'),
  ('pg-ljus-hemmafest-mindre-fest', 'SK-LJS-PAK-0001', 2, 'manual'),
  ('pg-ljus-brollop-fodelsedag-foretagsfest', 'SK-LJS-PAK-0022', 0, 'manual'),
  ('pg-ljus-brollop-fodelsedag-foretagsfest', 'SK-LJS-PAK-0023', 1, 'manual'),
  ('pg-ljus-brollop-fodelsedag-foretagsfest', 'SK-LJS-PAK-0025', 2, 'manual'),
  ('pg-ljus-stor-fest-dansgolv', 'SK-LJS-PAK-0007', 0, 'manual'),
  ('pg-ljus-stor-fest-dansgolv', 'SK-LJS-PAK-0008', 1, 'manual'),
  ('pg-ljus-stor-fest-dansgolv', 'SK-LJS-PAK-0010', 2, 'manual'),
  ('pg-ljus-scen-konsert-tal', 'SK-LJS-PAK-0016', 0, 'manual'),
  ('pg-ljus-scen-konsert-tal', 'SK-LJS-PAK-0017', 1, 'manual'),
  ('pg-ljus-scen-konsert-tal', 'SK-LJS-PAK-0026', 2, 'manual')
ON CONFLICT (group_id, artno) DO NOTHING;

INSERT INTO event_cases (id, label, descr, tag, categories, sort_order) VALUES
  ('case-festival-vinterviken', 'Festival – Vinterviken', 'Scen & ljud, Vasas Flora & Fauna m.fl.', 'Festival', ARRAY['ljud','scen'], 0),
  ('case-skridskodisco-ostermalms-ip', 'Skridskodisco – Östermalms IP', 'Stockholms Stad — DJ & ljud utomhus, återkommande event', 'Företagsevent', ARRAY['ljud','ljus'], 1),
  ('case-ea-sports-fc-27-ikea-gallerian', 'EA Sports FC 27 – IKEA Gallerian', 'Lansering i samarbete med Jung Co — TV-skärmar på golvstativ', 'Företagsevent', ARRAY['bild'], 2),
  ('case-storytel-event', 'Storytel – Event', 'I samarbete med Studio S19 — ljud, LED-vägg, scenpodie, draperi & scenljus', 'Företagsevent', ARRAY['ljud','bild','scen','ljus'], 3),
  ('case-kundevent-abg-sundal-collier', 'Kundevent – ABG Sundal Collier', 'Ljud & ljus, exklusivt inomhusevent', 'Företagsevent', ARRAY['ljud','ljus'], 4),
  ('case-djursholms-slott', 'Djursholms Slott', 'Galakväll, scenljus & PA-system', 'Företagsevent', ARRAY['ljud','ljus','scen'], 5),
  ('case-lakarforbundet-ostermalm', 'Läkarförbundet – Östermalm', 'Festvåning, komplett ljud & ljus', 'Företagsevent', ARRAY['ljud','ljus'], 6),
  ('case-strawberry-arena-uf', 'Strawberry Arena – UF', 'Ung Företagsamhet — stor scen, PA & ljusrigg', 'Konferens', ARRAY['scen','ljud','ljus'], 7),
  ('case-solna-naringsliv-konferens', 'Solna Näringsliv – Konferens', '3× skärmar, uplight & PA-system', 'Konferens', ARRAY['bild','ljus','ljud','konferens'], 8),
  ('case-abg-sundal-collier-konferens', 'ABG Sundal Collier – Konferens', 'LED-skärmar, konferens-AV & uplight i lokalen', 'Konferens', ARRAY['bild','ljus','konferens'], 9),
  ('case-tele2-scenpodie', 'Tele2 – Scenpodie', 'Scenpodie, ridå & LED-skärm för konferens', 'Konferens', ARRAY['scen','bild','konferens'], 10),
  ('case-hard-rock-cafe-hard-rock-rising', 'Hard Rock Café – Hard Rock Rising', 'Global Live Music Challenge — ljud & scenljus', 'Festival', ARRAY['ljud','ljus'], 11),
  ('case-german-beerhall', 'German Beerhall', 'Fast ljusinstallation — LED-ramper & styrning', 'Installation', ARRAY['ljus'], 12),
  ('case-midnattsloppet-klara-fardiga-film', 'Midnattsloppet – Klara Färdiga Film', 'Flak med PA & ljus längs banan', 'Festival', ARRAY['ljud','ljus'], 13),
  ('case-galleri-existens', 'Galleri Existens', 'I samarbete med PerPR — projektorinstallation på tross med ljud', 'Företagsevent', ARRAY['bild','ljud'], 14),
  ('case-systembolaget', 'Systembolaget', 'PA-system & LED-uplights i festvåning', 'Företagsevent', ARRAY['ljud','ljus'], 15),
  ('case-jazz-blues-konserthuset', 'Jazz & Blues – Konserthuset', 'Stockholm International Jazz & Blues Festival — scen klädd med svart filtmatta', 'Festival', ARRAY['scen'], 16),
  ('case-emberlin-stureplan', 'Emberlin – Stureplan', 'Björn Frantzéns nya restaurang — i samarbete med Jung Co och TV4, skärmar', 'Företagsevent', ARRAY['bild'], 17),
  ('case-100-knivar-odenplan', '100 Knivar – Odenplan', 'I samarbete med Jung Co och TV4 — ljud, skärmar & bildmix/stream', 'Aktivering', ARRAY['ljud','bild'], 18)
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_case_images (case_id, src, alt, in_gallery, sort_order) VALUES
  ('case-festival-vinterviken', '/images/event/festival_vinterviken.webp', 'Scenuppbyggnad vid Vintervikens trädgård', TRUE, 0),
  ('case-festival-vinterviken', '/images/event/festival_vinterviken_2.webp', 'Publik framför scenen under konsert i Vintervikens trädgård', TRUE, 1),
  ('case-skridskodisco-ostermalms-ip', '/images/event/skridskodisco_ostermalm_1.webp', 'Skridskodisco på Östermalms IP', TRUE, 0),
  ('case-skridskodisco-ostermalms-ip', '/images/event/skridskodisco_ostermalm_2.webp', 'DJ- och ljudsetup för skridskodisco på Östermalms IP', TRUE, 1),
  ('case-ea-sports-fc-27-ikea-gallerian', '/images/event/kundevent_ea_sports_fc27_1.webp', 'TV-skärm på golvstativ med EA Sports FC 27 på IKEA Gallerian', TRUE, 0),
  ('case-ea-sports-fc-27-ikea-gallerian', '/images/event/kundevent_ea_sports_fc27_2.webp', 'Spelstation med EA Sports FC 27 på storbildsskärm vid lanseringen på IKEA Gallerian', TRUE, 1),
  ('case-ea-sports-fc-27-ikea-gallerian', '/images/event/kundevent_ea_sports_fc27_3.webp', 'Besökare spelar EA Sports FC 27 i soffa framför TV-skärm på IKEA Gallerian', TRUE, 2),
  ('case-ea-sports-fc-27-ikea-gallerian', '/images/event/kundevent_ea_sports_fc27_4.webp', 'TV-skärm på golvstativ i IKEA:s vardagsrumsmiljö under FC 27-lanseringen', TRUE, 3),
  ('case-storytel-event', '/images/event/kundevent_storytel_1.webp', 'Scenljus riktat mot LED-vägg och publikbord på Storytel-event', TRUE, 0),
  ('case-storytel-event', '/images/event/kundevent_storytel_2.webp', 'LED-vägg med svart draperi på scenpodie inför Storytel-event', TRUE, 1),
  ('case-kundevent-abg-sundal-collier', '/images/event/kundevent_abg.webp', 'Kundevent med ABG Sundal Collier', TRUE, 0),
  ('case-djursholms-slott', '/images/event/kundevent_djursholms_slott.webp', 'Event på Djursholms Slott', TRUE, 0),
  ('case-lakarforbundet-ostermalm', '/images/event/kundevent_lakarforbundet.webp', 'Kundevent på Läkarförbundets festvåning Östermalm', TRUE, 0),
  ('case-strawberry-arena-uf', '/images/event/uf_strawberry_arena_1.webp', 'Ung Företagsamhet på Strawberry Arena', TRUE, 0),
  ('case-strawberry-arena-uf', '/images/event/uf_strawberry_arena_2.webp', 'Scen- och ljusrigg för Ung Företagsamhet på Strawberry Arena', TRUE, 1),
  ('case-solna-naringsliv-konferens', '/images/event/kundevent_solna_naringsliv.webp', 'Konferens för Solna Näringsliv med skärmar och uplight', TRUE, 0),
  ('case-abg-sundal-collier-konferens', '/images/event/kundevent_abg_konferens.webp', 'ABG Sundal Collier konferens med LED-skärmar och uplight', TRUE, 0),
  ('case-abg-sundal-collier-konferens', '/images/event/uplight_bardisk.webp', 'Uplight-belysning på bardisk vid event', TRUE, 1),
  ('case-abg-sundal-collier-konferens', '/images/event/kundevent_abg_uplight.webp', 'Uplight-belysning i ABG Sundal Colliers konferenslokal', FALSE, 2),
  ('case-tele2-scenpodie', '/images/event/kundevent_tele2_scenpodie.webp', 'Scenpodie med ridå och LED-skärm hos Tele2', TRUE, 0),
  ('case-hard-rock-cafe-hard-rock-rising', '/images/event/festival_hard_rock_rising.webp', 'Liveband på scen under Hard Rock Rising på Hard Rock Café', TRUE, 0),
  ('case-hard-rock-cafe-hard-rock-rising', '/images/event/festival_hard_rock_rising_2.webp', 'Rockband med tre gitarrer på scenen under Hard Rock Rising, publik i förgrunden', TRUE, 1),
  ('case-hard-rock-cafe-hard-rock-rising', '/images/event/festival_hard_rock_rising_3.webp', 'Skylt med kvällarnas band i Hard Rock Rising – Global Live Music Challenge', TRUE, 2),
  ('case-german-beerhall', '/images/event/installation_german_beerhall_1.webp', 'Fast ljusinstallation i taket på German Beerhall', TRUE, 0),
  ('case-german-beerhall', '/images/event/installation_german_beerhall_2.webp', 'LED-ramper och ljusarmaturer i taket på German Beerhall', TRUE, 1),
  ('case-midnattsloppet-klara-fardiga-film', '/images/event/festival_midnattsloppet.webp', 'Ljud- och ljusrigg på flak vid Midnattsloppet', TRUE, 0),
  ('case-galleri-existens', '/images/event/kundevent_galleri_existens.webp', 'Projektorinstallation på trosstorn hos Galleri Existens', TRUE, 0),
  ('case-systembolaget', '/images/event/kundevent_systembolaget_1.webp', 'Festvåning med gröna och blå uplights för Systembolagets event', TRUE, 0),
  ('case-systembolaget', '/images/event/kundevent_systembolaget_2.webp', 'LED-uplight som lyser grönt mot väggen i festvåningen', TRUE, 1),
  ('case-systembolaget', '/images/event/kundevent_systembolaget_3.webp', 'PA-högtalare och subwoofer i festvåningen', TRUE, 2),
  ('case-systembolaget', '/images/event/kundevent_systembolaget_4.webp', 'Översikt av festvåningen med uplights och dansgolv', TRUE, 3),
  ('case-jazz-blues-konserthuset', '/images/event/festival_jazz_konserthuset_1.webp', 'Scen klädd med svart filtmatta i Konserthuset under Stockholm Jazz & Blues Festival', TRUE, 0),
  ('case-jazz-blues-konserthuset', '/images/event/festival_jazz_konserthuset_2.webp', 'Scenpodier och trappsteg med svart filtmatta under uppbyggnad i Konserthuset', TRUE, 1),
  ('case-emberlin-stureplan', '/images/event/kundevent_emberlin_1.webp', 'Storbildsskärm på stativ i Emberlins matsal vid lanseringen', TRUE, 0),
  ('case-emberlin-stureplan', '/images/event/kundevent_emberlin_2.webp', 'Skärm ovanför baren på Emberlin som visar 100 Knivar', TRUE, 1),
  ('case-100-knivar-odenplan', '/images/event/kundevent_100knivar_1.webp', 'Skärm på stativ med kolonnhögtalare och sub vid 100 Knivar på Odenplan', TRUE, 0),
  ('case-100-knivar-odenplan', '/images/event/kundevent_100knivar_2.webp', 'Publik vid 100 Knivar-trucken på Odenplan', TRUE, 1),
  ('case-100-knivar-odenplan', '/images/event/kundevent_100knivar_3.webp', '100 Knivar-trucken med kampanjskylt på Odenplan', TRUE, 2)
ON CONFLICT (case_id, src) DO NOTHING;

INSERT INTO event_case_hub (case_id, category, image_src, label, descr, alt, pos, sort_order) VALUES
  ('case-festival-vinterviken', 'ljud', '/images/event/festival_vinterviken.webp', 'Festival – Vinterviken', 'Scen och PA-system utomhus', 'Scen med PA-högtalare på stativ vid Vintervikens trädgård', NULL, 0),
  ('case-systembolaget', 'ljud', '/images/event/kundevent_systembolaget_3.webp', 'Systembolaget', 'PA-system med subwoofer i festvåning', 'PA-högtalare och subwoofer i festvåningen på Systembolagets event', '50% 70%', 1),
  ('case-hard-rock-cafe-hard-rock-rising', 'ljud', '/images/event/festival_hard_rock_rising_2.webp', 'Hard Rock Rising – Hard Rock Café', 'Ljud för liveband', 'Rockband på scenen under Hard Rock Rising på Hard Rock Café', NULL, 2),
  ('case-systembolaget', 'ljus', '/images/event/kundevent_systembolaget_1.webp', 'Systembolaget', 'LED-uplights i festvåning', 'Festvåning med gröna och blå uplights för Systembolagets event', NULL, 0),
  ('case-abg-sundal-collier-konferens', 'ljus', '/images/event/kundevent_abg_uplight.webp', 'ABG Sundal Collier', 'Uplights i konferenslokal', 'Konferenslokal med varma uplights hos ABG Sundal Collier', NULL, 1),
  ('case-skridskodisco-ostermalms-ip', 'ljus', '/images/event/skridskodisco_ostermalm_2.webp', 'Skridskodisco – Östermalms IP', 'Ljus och ljud utomhus för Stockholms stad', 'Ljuseffekter på isen under skridskodisco på Östermalms IP', NULL, 2)
ON CONFLICT (case_id, category) DO NOTHING;
