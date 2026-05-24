-- 2026-05-24 — Utlämningsflöde v3 (B2C/B2B + förberedelse-länk)
--
-- KÖRS MANUELLT i Supabase SQL Editor:
--   https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor
--
-- Lägger till kolumner för:
--   1. Kundtypsmarkering (customer_type — defensiv, bör redan finnas)
--   2. Förberedelse-länken: Beställarens leg-foto + signatur + signing-IP + prepared_via
--   3. Bud vid SJÄLVHÄMTNING (utsedd tredje person som hämtar)
--   4. Kontaktperson vid LEVERANS (om annan än Beställaren tar emot)
--
-- Alla ADD COLUMN är idempotenta (IF NOT EXISTS) — säker att köra om.

-- ─── Kundtyp (defensiv — används redan i kod men säkerställs nu) ─────────────
ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS customer_type TEXT;

COMMENT ON COLUMN carts.customer_type IS
  'b2c | b2b — sätts vid bokning (admin-send-quote.js, cart-update.js). Styr villkorsversion i faktura-PDF (sida 2) samt vilka hyresvillkor som länkas i mail/Sven.';

-- ─── Förberedelse-länken: Beställarens kvittens & evidence ───────────────────
ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS booker_id_photo_url         TEXT,
  ADD COLUMN IF NOT EXISTS booker_id_photo_uploaded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booker_signature_data_url   TEXT,
  ADD COLUMN IF NOT EXISTS booker_signature_ip         TEXT,
  ADD COLUMN IF NOT EXISTS prepared_via                TEXT;

COMMENT ON COLUMN carts.booker_id_photo_url IS
  'URL till uppladdad fotolegitimation (Supabase Storage). Raderas automatiskt 90 dagar efter återlämning enligt § 6 (B2C) / § 7 (B2B) i hyresvillkoren.';
COMMENT ON COLUMN carts.booker_id_photo_uploaded_at IS
  'Tidpunkt då Beställaren laddade upp leg-fotot via förberedelse-länken.';
COMMENT ON COLUMN carts.booker_signature_data_url IS
  'Base64-PNG av Beställarens digitala signatur från förberedelse-länken (canvas → data-URL). Bevisvärde tillsammans med IP + tidsstämpel + accepterade villkor.';
COMMENT ON COLUMN carts.booker_signature_ip IS
  'IP-adress vid Beställarens signering av förberedelse-länken. Del av bevisskiktet.';
COMMENT ON COLUMN carts.prepared_via IS
  'Hur förberedelse-länken nåddes: sms | email | admin. Påverkar inte avtalets giltighet men loggas för spårning.';

-- ─── Bud vid SJÄLVHÄMTNING ───────────────────────────────────────────────────
ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS pickup_method               TEXT,
  ADD COLUMN IF NOT EXISTS pickup_proxy_name           TEXT,
  ADD COLUMN IF NOT EXISTS pickup_proxy_phone          TEXT,
  ADD COLUMN IF NOT EXISTS pickup_proxy_id_verified_at TIMESTAMPTZ;

COMMENT ON COLUMN carts.pickup_method IS
  'Vid självhämtning: self | proxy. self = Beställaren hämtar själv; proxy = ett bud hämtar enligt fullmakt. NULL om delivery_mode = leverans.';
COMMENT ON COLUMN carts.pickup_proxy_name IS
  'Namn på bud (fullmaktshavare) som hämtar utrustningen. Krävs om pickup_method = proxy.';
COMMENT ON COLUMN carts.pickup_proxy_phone IS
  'Mobilnummer till bud (fullmaktshavare). Krävs om pickup_method = proxy. Används för kontakt om bud försenas.';
COMMENT ON COLUMN carts.pickup_proxy_id_verified_at IS
  'Tidpunkt då Scenkonsult-personal verifierade budens fotolegitimation mot uppladdad leg + fullmakt. Sätts av admin vid motkvittering.';

-- ─── Kontaktperson vid LEVERANS ──────────────────────────────────────────────
ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS delivery_recipient_method            TEXT,
  ADD COLUMN IF NOT EXISTS delivery_recipient_name              TEXT,
  ADD COLUMN IF NOT EXISTS delivery_recipient_phone             TEXT,
  ADD COLUMN IF NOT EXISTS delivery_recipient_id_verified_at    TIMESTAMPTZ;

COMMENT ON COLUMN carts.delivery_recipient_method IS
  'Vid leverans: self | other. self = Beställaren tar emot själv; other = en annan namngiven kontaktperson tar emot. NULL om delivery_mode = sjalvhamtning.';
COMMENT ON COLUMN carts.delivery_recipient_name IS
  'Namn på kontaktperson som tar emot leveransen. Krävs om delivery_recipient_method = other.';
COMMENT ON COLUMN carts.delivery_recipient_phone IS
  'Mobilnummer till kontaktperson som tar emot leveransen. Krävs om delivery_recipient_method = other.';
COMMENT ON COLUMN carts.delivery_recipient_id_verified_at IS
  'Tidpunkt då leveransteknikern verifierade kontaktpersonens fotolegitimation. Sätts vid motkvittering på plats.';

-- ─── Verifiering ─────────────────────────────────────────────────────────────
-- Kontrollera att alla kolumner skapats:
--   SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'carts' AND column_name LIKE 'booker_%' OR column_name LIKE 'pickup_proxy%' OR column_name LIKE 'delivery_recipient%' OR column_name IN ('customer_type','prepared_via','pickup_method');
