-- 2026-11-02_momsfri_utlandsk_kund.sql
-- Utländsk företagskund — faktureras utan svensk moms (admin → Info).
-- Regeln ligger i src/lib/moms.cjs.
--
-- KÖR DENNA I SUPABASE SQL EDITOR INNAN KODEN PUSHAS.
-- admin-carts begär kolumnerna i sin select; saknas de svarar PostgREST 400
-- och admin visar "Kunde inte hämta varukorgar" (samma fel som 2026-07-17).
-- Idempotent — säker att köra flera gånger.

ALTER TABLE carts ADD COLUMN IF NOT EXISTS vat_exempt       boolean NOT NULL DEFAULT false;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS vat_region       text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS customer_vat_id  text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS customer_country text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'carts_vat_region_chk') THEN
    ALTER TABLE carts ADD CONSTRAINT carts_vat_region_chk
      CHECK (vat_region IS NULL OR vat_region IN ('eu', 'non_eu'));
  END IF;
END $$;

COMMENT ON COLUMN carts.vat_exempt       IS 'Utländsk företagskund — faktureras utan svensk moms (src/lib/moms.cjs)';
COMMENT ON COLUMN carts.vat_region       IS 'eu = omvänd betalningsskyldighet, non_eu = omsätts utomlands';
COMMENT ON COLUMN carts.customer_vat_id  IS 'Köparens VAT-nummer (krävs för EU), t.ex. DE123456789';
COMMENT ON COLUMN carts.customer_country IS 'Köparens land, ISO 3166-1 alpha-2';
