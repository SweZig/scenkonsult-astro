-- 2026-05-24d — AI-verifiering av leg-foto (Claude Vision soft check)
--
-- KÖRS MANUELLT i Supabase SQL Editor:
--   https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor
--
-- Bakgrund:
-- När kund laddar upp foto av legitimation under förberedelse-flödet anropas
-- Claude Haiku Vision för att verifiera att det faktiskt är en leg och inte
-- t.ex. ett kvitto eller annan bild. Resultatet sparas i denna jsonb-kolumn
-- så admin-panelen kan visa AI-bedömningen senare vid motkvittering.
--
-- Soft check: kunden kan fortsätta oavsett resultat — admins okulärbesiktning
-- vid utlämning är fortfarande den slutgiltiga kontrollen.
--
-- Struktur på id_photo_ai_result (jsonb):
-- {
--   "checked_at": "2026-05-24T14:32:18Z",
--   "is_id":      true,                       -- bool
--   "confidence": 0.92,                       -- number 0.0–1.0
--   "type":       "korkort" | "id-kort" | "pass" | "annat",
--   "issues":     ["suddig", "mörk"] | [],   -- array
--   "reason":     "kort förklaring om confidence < 0.8 eller is_id=false"
-- }

ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS id_photo_ai_result jsonb;

COMMENT ON COLUMN carts.id_photo_ai_result IS
  'AI-verifiering av leg-foto från förberedelse-flödet. Soft check via Claude Haiku Vision. Innehåller is_id, confidence, type, issues[], reason, checked_at. Skrivs över vid varje ny foto-upload.';
