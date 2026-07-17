-- 2026-07-17_b2b_invoice_peppol.sql
-- B2B: kundredigerbara fakturauppgifter + Peppol (commit 153e62f2)
-- Koden lades till utan migration, så dessa kolumner saknades i carts-tabellen.
-- Följden: admin-carts SELECT begärde icke-existerande kolumner -> PostgREST 400
-- -> "Kunde inte hämta varukorgar". Denna migration lägger till dem.
-- Idempotent (IF NOT EXISTS) — säker att köra även om någon kolumn redan finns.

ALTER TABLE carts ADD COLUMN IF NOT EXISTS customer_orgnr           text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS customer_ref             text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS customer_invoice_address text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS invoice_email            text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS peppol_id                text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS use_invoice_email        boolean NOT NULL DEFAULT false;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS wants_peppol             boolean NOT NULL DEFAULT false;
