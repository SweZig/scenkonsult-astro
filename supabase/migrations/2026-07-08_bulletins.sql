-- Migration: bulletins
-- Bulletin board / löpande meddelanden för frontpage-tickern.
-- Redigeras via /admin/bulletin/. När minst ett meddelande är aktivt (och ej
-- utgånget) ersätter dessa den statiska default-texten i nav-tickern.
-- Kör i Supabase SQL editor: https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

CREATE TABLE IF NOT EXISTS bulletins (
  id          TEXT PRIMARY KEY,
  text        TEXT NOT NULL,
  link_url    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bulletins_active_sort
  ON bulletins(active, sort_order)
  WHERE active = TRUE;

-- RLS: deny-all för anon/authenticated (samma mönster som chat_templates m.fl.).
-- Frontend läser ALDRIG Supabase direkt — bulletin-list.js (service key) exponerar
-- bara text/link_url för aktiva, ej utgångna rader.
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_anon" ON bulletins;
DROP POLICY IF EXISTS "deny_all_auth" ON bulletins;

CREATE POLICY "deny_all_anon" ON bulletins
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "deny_all_auth" ON bulletins
  FOR ALL TO authenticated USING (false) WITH CHECK (false);
