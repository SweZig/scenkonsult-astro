-- ─── Scenkonsult Admin: Kreditfaktura-funktion ──────────────────────────────
-- Kör dessa i Supabase SQL Editor för att aktivera kreditfakturor.
-- Projekt: ejhhgqvtvsmiwxygfqbu

-- Nya kolumner på carts-tabellen för att spara kreditfaktura per order
ALTER TABLE carts ADD COLUMN IF NOT EXISTS credit_invoice_number TEXT;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS credit_sent_at        TIMESTAMPTZ;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS credit_amount_excl    INTEGER;  -- exkl moms, i kr (negativt)
ALTER TABLE carts ADD COLUMN IF NOT EXISTS credit_mode           TEXT;     -- 'full' | 'cancel_rules' | 'custom'
ALTER TABLE carts ADD COLUMN IF NOT EXISTS credit_reason         TEXT;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS credit_items          JSONB;    -- snapshot av kreditrader

-- Unique constraint för att garantera att kreditnummer är unika
-- (använder DO-block för att inte faila om constraint redan finns)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'carts_credit_invoice_number_unique'
  ) THEN
    ALTER TABLE carts ADD CONSTRAINT carts_credit_invoice_number_unique UNIQUE (credit_invoice_number);
  END IF;
END$$;

-- Klart! Admin kan nu skapa kreditfakturor via Faktura-fliken i adminpanelen.
