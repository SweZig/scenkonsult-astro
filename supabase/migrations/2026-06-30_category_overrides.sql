-- Migration: category_overrides
-- Manuell klassning av okända artikel-ID:n i försäljningsstatistiken.
-- När ett orderrad-id/artno inte kan kategoriseras via artno-prefix (t.ex.
-- gamla fritext-/legacy-rader på fakturor) kan admin koppla det till rätt
-- toppkategori här. admin-stats-sales.js läser denna tabell och låter den
-- VINNA över prefix-gissningen.
-- Kör i Supabase SQL editor:
-- https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

CREATE TABLE IF NOT EXISTS category_overrides (
  item_key    TEXT PRIMARY KEY,          -- orderradens id ELLER artno (det som inte kunde mappas)
  category    TEXT NOT NULL,             -- toppkategori: Scen/Ljud/Bild/Ljus/DJ/Karaoke/El & ström/Tjänster
  sample_name TEXT,                      -- senast sedda fakturatext (för igenkänning i UI)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: deny-all för anon/authenticated (samma mönster som carts/messages/chat_templates).
-- Service role key (Netlify Functions) bypasser RLS.
ALTER TABLE category_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_anon" ON category_overrides;
DROP POLICY IF EXISTS "deny_all_auth" ON category_overrides;

CREATE POLICY "deny_all_anon" ON category_overrides
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "deny_all_auth" ON category_overrides
  FOR ALL TO authenticated USING (false) WITH CHECK (false);
