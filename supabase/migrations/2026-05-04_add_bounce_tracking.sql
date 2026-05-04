-- 2026-05-04 — Bounce-tracking för utskickade offerter
-- Resend webhook (email.bounced / email.complained) hittar rätt cart via
-- last_quote_message_id och uppdaterar bounce_status + bounce_at + bounce_reason.

ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS last_quote_message_id TEXT,
  ADD COLUMN IF NOT EXISTS bounce_status         TEXT,
  ADD COLUMN IF NOT EXISTS bounce_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bounce_reason         TEXT;

-- Lookup-index för webhook (Resend message_id → cart)
CREATE INDEX IF NOT EXISTS idx_carts_last_quote_message_id
  ON carts(last_quote_message_id)
  WHERE last_quote_message_id IS NOT NULL;

-- bounce_status kan vara: NULL (inget problem), 'bounced', 'complained', 'delayed'
COMMENT ON COLUMN carts.bounce_status IS 'NULL | bounced | complained | delayed — sätts av resend-webhook.js';
COMMENT ON COLUMN carts.last_quote_message_id IS 'Resend email-ID från senaste admin-skickade offert. Används av webhook för att koppla bounce-event till rätt cart.';
