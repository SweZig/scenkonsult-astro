-- Migration: clients
-- Komplett kundlista (referenskunder). Ersätter den hårdkodade clients-listan i
-- site.json OCH kategori-arrayerna i referenser/index.astro. Varje kund har ETT
-- kategori-fält — kategorivyn och "Samtliga referenskunder" byggs automatiskt.
-- Underhålls i admin (/admin/referenser/). Driver referens- och om-oss-sidan.
-- Kör i Supabase SQL editor: https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor
--
-- Kategori-nycklar: 'kommun' = Kommuner & Myndigheter, 'naringsliv' = Näringsliv &
-- Företag, 'ambassad' = Ambassader & Org., 'event' = Event & Kultur, NULL = endast
-- i Samtliga-listan (ingen kategori).

CREATE TABLE IF NOT EXISTS clients (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT CHECK (category IN ('kommun','naringsliv','ambassad','event')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_active_sort
  ON clients(active, sort_order)
  WHERE active = TRUE;

-- RLS: deny-all för anon/authenticated (service role key bypasser).
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_all_anon" ON clients;
DROP POLICY IF EXISTS "deny_all_auth" ON clients;
CREATE POLICY "deny_all_anon" ON clients FOR ALL TO anon USING (false) WITH CHECK (false);
CREATE POLICY "deny_all_auth" ON clients FOR ALL TO authenticated USING (false) WITH CHECK (false);

-- Seed: 61 befintliga kunder med kategori (nyckel enligt ovan).
INSERT INTO clients (id, name, category, sort_order, active) VALUES
  ('cli-solna-stad', 'Solna Stad', 'kommun', 0, TRUE),
  ('cli-stockholm-stad', 'Stockholm Stad', 'kommun', 1, TRUE),
  ('cli-haninge-kommun', 'Haninge Kommun', 'kommun', 2, TRUE),
  ('cli-tyreso-kommun', 'Tyresö Kommun', 'kommun', 3, TRUE),
  ('cli-solna-tingsratt', 'Solna Tingsrätt', 'kommun', 4, TRUE),
  ('cli-ica-sverige', 'ICA Sverige', 'naringsliv', 5, TRUE),
  ('cli-abg-sundal-collier', 'ABG Sundal Collier', 'naringsliv', 6, TRUE),
  ('cli-akademiska-hus', 'Akademiska Hus', 'naringsliv', 7, TRUE),
  ('cli-hornbach', 'Hornbach', 'naringsliv', 8, TRUE),
  ('cli-houdini-sportsware', 'Houdini Sportsware', 'naringsliv', 9, TRUE),
  ('cli-kameo', 'Kameo', 'naringsliv', 10, TRUE),
  ('cli-ioffice', 'iOffice', 'naringsliv', 11, TRUE),
  ('cli-backingminds', 'Backingminds', 'naringsliv', 12, TRUE),
  ('cli-kustom', 'Kustom', 'naringsliv', 13, TRUE),
  ('cli-ekologigruppen', 'Ekologigruppen', 'naringsliv', 14, TRUE),
  ('cli-linnskog-rudh-partner', 'Linnskog-Rudh & Partner', 'naringsliv', 15, TRUE),
  ('cli-wave-stockholm', 'Wave Stockholm', 'naringsliv', 16, TRUE),
  ('cli-i-know-a-guy', 'i know a GUY', 'naringsliv', 17, TRUE),
  ('cli-fredericia-furniture', 'Fredericia Furniture', 'naringsliv', 18, TRUE),
  ('cli-7a-sevena', '7A Sevena', 'naringsliv', 19, TRUE),
  ('cli-playground-group', 'Playground Group', 'naringsliv', 20, TRUE),
  ('cli-kry-vardcentral', 'KRY Vårdcentral', 'naringsliv', 21, TRUE),
  ('cli-tele2', 'Tele2', 'naringsliv', 22, TRUE),
  ('cli-ey', 'EY', 'naringsliv', 23, TRUE),
  ('cli-lucky-bowl', 'Lucky Bowl', 'naringsliv', 24, TRUE),
  ('cli-ps-matsalar', 'PS Matsalar', 'naringsliv', 25, TRUE),
  ('cli-strand-rederi', 'Strand Rederi', 'naringsliv', 26, TRUE),
  ('cli-varopreem-sverige', 'VAROPreem Sverige', 'naringsliv', 27, TRUE),
  ('cli-differ-strategy', 'Differ Strategy', 'naringsliv', 28, TRUE),
  ('cli-jensen-beds', 'Jensen Beds', 'naringsliv', 29, TRUE),
  ('cli-hilding-anders', 'Hilding Anders', 'naringsliv', 30, TRUE),
  ('cli-bullando-krog', 'Bullandö Krog', 'naringsliv', 31, TRUE),
  ('cli-brasiliens-ambassad', 'Brasiliens Ambassad', 'ambassad', 32, TRUE),
  ('cli-indiens-ambassad', 'Indiens Ambassad', 'ambassad', 33, TRUE),
  ('cli-kommunalarbetareforbundet', 'Kommunalarbetareförbundet', 'ambassad', 34, TRUE),
  ('cli-malardalens-universitet', 'Mälardalens Universitet', 'ambassad', 35, TRUE),
  ('cli-internationella-engelska-skolan', 'Internationella Engelska Skolan', 'ambassad', 36, TRUE),
  ('cli-forum-civ', 'Forum Civ', 'ambassad', 37, TRUE),
  ('cli-ung-foretagsamhet', 'Ung Företagsamhet', 'ambassad', 38, TRUE),
  ('cli-scoutkaren-gustav-vasa', 'Scoutkåren Gustav Vasa', 'ambassad', 39, TRUE),
  ('cli-miljopartiet', 'Miljöpartiet', 'ambassad', 40, TRUE),
  ('cli-vansterpartiet', 'Vänsterpartiet', 'ambassad', 41, TRUE),
  ('cli-vision', 'Vision', 'ambassad', 42, TRUE),
  ('cli-odd-fellow', 'Odd Fellow', 'ambassad', 43, TRUE),
  ('cli-korpen', 'Korpen', 'ambassad', 44, TRUE),
  ('cli-nti-gymnasiet', 'NTI Gymnasiet', 'ambassad', 45, TRUE),
  ('cli-pakistan-cultural-society', 'Pakistan Cultural Society', 'ambassad', 46, TRUE),
  ('cli-boodlas-forening', 'Boodlas förening', 'ambassad', 47, TRUE),
  ('cli-s-kvinnor', 'S-kvinnor', 'ambassad', 48, TRUE),
  ('cli-aiva-productions', 'Aiva Productions', 'event', 49, TRUE),
  ('cli-immersive-music-group', 'Immersive Music Group', 'event', 50, TRUE),
  ('cli-favorevent', 'Favorevent', 'event', 51, TRUE),
  ('cli-hacksaw-studios', 'Hacksaw Studios', 'event', 52, TRUE),
  ('cli-cash-in-drop-out', 'Cash In Drop Out', 'event', 53, TRUE),
  ('cli-a-beautiful-soap', 'A Beautiful Soap', 'event', 54, TRUE),
  ('cli-soullink', 'SoulLink', 'event', 55, TRUE),
  ('cli-house-of-photography', 'House of Photography', 'event', 56, TRUE),
  ('cli-crashdiet', 'Crashdïet', 'event', 57, TRUE),
  ('cli-studio-s19', 'Studio S19', 'event', 58, TRUE),
  ('cli-benefit-cosmetics', 'Benefit Cosmetics', NULL, 59, TRUE),
  ('cli-christian-dior', 'Christian Dior', NULL, 60, TRUE)
ON CONFLICT (id) DO NOTHING;
