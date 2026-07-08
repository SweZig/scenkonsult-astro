-- Migration: bulletins
-- Bulletin board / löpande meddelanden för frontpage-tickern.
-- Redigeras via /admin/bulletin/. Två typer av rader i samma tabell:
--   type='campaign' — tidsbegränsade meddelanden (från/till-datum valfritt)
--   type='default'  — den rullande standardtexten som visas när ingen
--                      kampanj är aktiv just nu (ersätter de tidigare
--                      hårdkodade raderna i Layout.astro — nu redigerbara)
-- Kör i Supabase SQL editor: https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

CREATE TABLE IF NOT EXISTS bulletins (
  id          TEXT PRIMARY KEY,
  text        TEXT NOT NULL,
  link_url    TEXT,
  type        TEXT NOT NULL DEFAULT 'campaign' CHECK (type IN ('campaign','default')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at   TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bulletins_type_active_sort
  ON bulletins(type, active, sort_order);

-- RLS: deny-all för anon/authenticated (samma mönster som chat_templates m.fl.).
-- Frontend läser ALDRIG Supabase direkt — bulletin-list.js (service key) exponerar
-- bara text/link_url för aktiva rader inom sitt tidsfönster.
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_anon" ON bulletins;
DROP POLICY IF EXISTS "deny_all_auth" ON bulletins;

CREATE POLICY "deny_all_anon" ON bulletins
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "deny_all_auth" ON bulletins
  FOR ALL TO authenticated USING (false) WITH CHECK (false);

-- Seed: dagens statiska ticker-text som redigerbar default-lista.
INSERT INTO bulletins (id, text, type, sort_order, active) VALUES
  ('default-1', 'Uthyrning av scen, ljud, bild & ljus',         'default', 0, TRUE),
  ('default-2', 'Del av Sveriges scener sedan 1986',            'default', 1, TRUE),
  ('default-3', 'Ingen scen är för liten — eller för stor',     'default', 2, TRUE),
  ('default-4', 'Leverans och montering i hela Storstockholm',  'default', 3, TRUE),
  ('default-5', 'Jourtjänst kvällstid',                         'default', 4, TRUE),
  ('default-6', 'Fest · Bröllop · Event · Konsert',             'default', 5, TRUE)
ON CONFLICT (id) DO NOTHING;
