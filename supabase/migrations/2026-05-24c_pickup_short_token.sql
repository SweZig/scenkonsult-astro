-- 2026-05-24c — pickup_short_token (kort URL-token för SMS-länkar)
--
-- KÖRS MANUELLT i Supabase SQL Editor:
--   https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor
--
-- Bakgrund:
-- För att hålla SMS-meddelanden under 160 tecken (1 SMS-segment) behövs en
-- kortare URL än /sign/?cart=SK-XXXX-XXXX&token=<32 hex>. Lösningen är en
-- separat kort token i URL:en (8 hex = 4.3 miljarder kombinationer) som
-- mappar till den fulla cart_token server-side via /u/:token-redirect.
--
-- Säkerhetsmodell:
--   - pickup_short_token är ENDAST en lookup-nyckel. Den FULLA cart_token
--     (32 hex) krävs fortfarande för att kunna signera (sign-submit.js).
--   - 8 hex ger ~4.3 miljarder kombinationer — för 4-6 carts/vecka är
--     collision-risk försumbar, men UNIQUE-indexet garanterar att duplicering
--     omöjliggörs på DB-nivå (insert misslyckas → retry).

ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS pickup_short_token TEXT;

-- Unique-index garanterar att samma short_token aldrig kan tilldelas två carts.
-- WHERE-klausul gör det till ett partial index — NULL-värden ignoreras
-- (carts utan short_token får inte unique-constraint).
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_pickup_short_token
  ON carts(pickup_short_token)
  WHERE pickup_short_token IS NOT NULL;

COMMENT ON COLUMN carts.pickup_short_token IS
  '8-tecken hex-token för kort URL i SMS (scenkonsult.se/u/<token>). Genereras vid första SMS- eller mail-utskick av förberedelse-länken. /u/:token-funktionen slår upp denna och redirectar till /sign/?cart=X&token=<full cart_token>. ENDAST lookup-nyckel — den fulla 32-hex cart_token krävs fortfarande för signering.';
