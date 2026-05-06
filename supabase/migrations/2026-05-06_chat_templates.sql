-- Migration: chat_templates
-- Snabbmallar för admin-chatten — redigerbara via UI istället för hårdkodat objekt.
-- Kör i Supabase SQL editor: https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor

CREATE TABLE IF NOT EXISTS chat_templates (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  title       TEXT,
  body        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_templates_enabled_sort
  ON chat_templates(enabled, sort_order)
  WHERE enabled = TRUE;

-- RLS: deny-all för anon/authenticated (samma mönster som carts/messages/audit_log).
-- Service role key (Netlify Functions) bypasser RLS, så funktionen fungerar som vanligt.
ALTER TABLE chat_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_anon" ON chat_templates;
DROP POLICY IF EXISTS "deny_all_auth" ON chat_templates;

CREATE POLICY "deny_all_anon" ON chat_templates
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "deny_all_auth" ON chat_templates
  FOR ALL TO authenticated USING (false) WITH CHECK (false);

-- Seed med befintlig Google-recension-mall så admin har något att börja med.
INSERT INTO chat_templates (id, label, title, body, sort_order)
VALUES (
  'google-review',
  '⭐ Be om Google-recension',
  'Vänlig förfrågan om kunden vill skriva en recension på Google',
  E'Hej!\n\nOm ni är nöjda med vår service eller produkter får ni jättegärna ta 2-3 minuter och skriva ett betyg på Google så andra kunder hittar till oss.\n\nHär är en [direktlänk](https://search.google.com/local/writereview?placeid=ChIJuWsoFN2fX0YRzIoYyrIjdEY) till Google.\n\nTusen tack!\n/Teamet på Scenkonsult',
  0
)
ON CONFLICT (id) DO NOTHING;
