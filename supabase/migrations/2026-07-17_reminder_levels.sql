-- 2026-07-17_reminder_levels.sql
-- 4-nivåers betalningspåminnelse (Påminnelse → Påminnelse 2 → Krav → Inkassokrav).
-- invoice-reminder-send.js skriver dessa kolumner; utan migration faller
-- skrivningen tillbaka på enbart invoice_reminder_sent_at (graceful degradation),
-- men historik, nivå och avgifter loggas då inte. Kör denna FÖRE/samtidigt som deploy.
-- Idempotent (IF NOT EXISTS) — säker att köra flera gånger.

-- Senast skickade nivå: 0 = ingen, 1 Påminnelse, 2 Påminnelse 2, 3 Krav, 4 Inkassokrav
ALTER TABLE carts ADD COLUMN IF NOT EXISTS invoice_reminder_level    integer     NOT NULL DEFAULT 0;

-- Ackumulerad påminnelse-/inkassoavgift i öre (MOMSFRI). Nivå 3 = 6000, nivå 4 = 24000.
ALTER TABLE carts ADD COLUMN IF NOT EXISTS invoice_reminder_fee_ore  integer     NOT NULL DEFAULT 0;

-- Historik: [{ level, at (ISO), fee_ore, due (YYYY-MM-DD|null), overdue_days }]
ALTER TABLE carts ADD COLUMN IF NOT EXISTS invoice_reminder_log      jsonb       NOT NULL DEFAULT '[]'::jsonb;

-- Ny sista betaldag satt av krav/inkassokrav (nivå 3–4), annars NULL.
ALTER TABLE carts ADD COLUMN IF NOT EXISTS invoice_reminder_due_date date;

-- Tidsstämpel för senaste påminnelse (kolumnen användes redan av tidigare kod men saknade migration).
ALTER TABLE carts ADD COLUMN IF NOT EXISTS invoice_reminder_sent_at  timestamptz;
