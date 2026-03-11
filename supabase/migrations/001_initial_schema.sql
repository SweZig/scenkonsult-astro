-- ============================================================
-- Scenkonsult Norden — Order & Kommunikationssystem
-- Migration 001: Initial schema
-- Körs i Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- ── Aktivera UUID-extension ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enum-typer ───────────────────────────────────────────────
CREATE TYPE cart_status AS ENUM (
  'open',         -- Öppen varukorg
  'proposal',     -- Orderförslag/offert skickad
  'waiting',      -- Inväntar kundsvar
  'confirmed',    -- Orderbekräftelse — sparas 48 mån
  'cancelled'     -- Avbruten — sparas 90 dagar
);

CREATE TYPE message_sender AS ENUM ('admin', 'customer');
CREATE TYPE audit_actor AS ENUM ('admin', 'customer', 'system');

-- ── Tabell: carts ────────────────────────────────────────────
CREATE TABLE carts (
  id                  TEXT PRIMARY KEY,           -- SK-A1B2C3D4-E5F6
  status              cart_status NOT NULL DEFAULT 'open',
  items               JSONB NOT NULL DEFAULT '[]',
  customer_name       TEXT,
  customer_email      TEXT,
  customer_phone      TEXT,
  customer_message    TEXT,                       -- Ursprungligt meddelande från offert
  event_date          DATE,
  event_location      TEXT,
  notes_admin         TEXT,                       -- Intern, visas aldrig för kund
  total_excl          INTEGER NOT NULL DEFAULT 0, -- Öre (kr * 100)
  cart_token          TEXT UNIQUE,                -- 32-char hex, kund-URL-token
  expires_at          TIMESTAMPTZ,                -- NULL = bekräftad (ingen expiry)
  confirmed_at        TIMESTAMPTZ,
  bankid_required     BOOLEAN NOT NULL DEFAULT FALSE,
  signature_ref       TEXT,                       -- Referens från Scrive/Signicat
  last_read_customer  TIMESTAMPTZ,
  last_read_admin     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabell: messages ─────────────────────────────────────────
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  sender      message_sender NOT NULL,
  body        TEXT NOT NULL,
  read_at     TIMESTAMPTZ,                        -- NULL = oläst
  attachments JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabell: audit_log ────────────────────────────────────────
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  actor       audit_actor NOT NULL,
  event_type  TEXT NOT NULL,                      -- status_change | message_sent | item_added | confirmed | ...
  payload     JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Index ─────────────────────────────────────────────────────
CREATE INDEX idx_carts_status       ON carts(status);
CREATE INDEX idx_carts_expires      ON carts(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_carts_token        ON carts(cart_token) WHERE cart_token IS NOT NULL;
CREATE INDEX idx_messages_cart      ON messages(cart_id);
CREATE INDEX idx_messages_unread    ON messages(cart_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_audit_cart         ON audit_log(cart_id);

-- ── Trigger: auto-uppdatera updated_at ───────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
-- OBS: Alla anrop sker via Netlify Functions med service_role key.
-- RLS är aktiverat men service_role kringgår alltid RLS.
-- Anon-nyckel exponeras ALDRIG i frontend.
ALTER TABLE carts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log  ENABLE ROW LEVEL SECURITY;

-- Service role kringgår RLS — inga policies behövs för Fas 1.
-- I Fas 2: lägg till policies för magic-link-autentiserade kunder.

-- ── Hjälpfunktion: förläng TTL ───────────────────────────────
CREATE OR REPLACE FUNCTION extend_cart_ttl(cart_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE carts
  SET expires_at = NOW() + INTERVAL '21 days'
  WHERE id = cart_id
    AND status != 'confirmed'
    AND status != 'cancelled';
END;
$$ LANGUAGE plpgsql;

-- ── Schemalagd rensning (körs via Supabase cron / pg_cron) ───
-- Aktivera pg_cron under Extensions i Supabase Dashboard
-- Kör sedan detta:
/*
SELECT cron.schedule(
  'cleanup-expired-carts',
  '0 3 * * *',   -- Varje natt 03:00
  $$
    DELETE FROM carts
    WHERE expires_at IS NOT NULL
      AND expires_at < NOW()
      AND status IN ('open');

    UPDATE carts SET status = 'cancelled'
    WHERE expires_at IS NOT NULL
      AND expires_at < NOW() - INTERVAL '90 days'
      AND status = 'cancelled';
  $$
);
*/

-- ── Klar! ─────────────────────────────────────────────────────
-- Verifiera med:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
