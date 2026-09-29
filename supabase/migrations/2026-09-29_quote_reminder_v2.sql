-- 2026-09-29_quote_reminder_v2.sql
-- Offertpåminnelse v2: två påminnelsesteg, redigerbara påminnelsemallar
-- och möjlighet för kunden att tacka nej till en offert.
-- Kör FÖRE deploy (Supabase SQL Editor). Idempotent — säker att köra flera gånger.

-- ── carts ─────────────────────────────────────────────────────────────
-- När offerten senast skickades (sätts av admin-send-quote.js). Påminnelseklockan
-- räknas härifrån i stället för updated_at, som nollställs vid varje adminändring.
ALTER TABLE carts ADD COLUMN IF NOT EXISTS quote_sent_at      timestamptz;

-- Historik över skickade offertpåminnelser: [{ template, at, final, include_decline }]
ALTER TABLE carts ADD COLUMN IF NOT EXISTS quote_reminder_log jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Kunden tackade nej via ordersidan
ALTER TABLE carts ADD COLUMN IF NOT EXISTS declined_at        timestamptz;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS decline_reason     text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS decline_comment    text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'carts_decline_reason_check') THEN
    ALTER TABLE carts ADD CONSTRAINT carts_decline_reason_check
      CHECK (decline_reason IS NULL OR decline_reason IN ('need_changed', 'found_alternative'));
  END IF;
END $$;

-- Backfill: befintliga offerter räknar från senaste uppdatering (samma proxy som tidigare)
UPDATE carts SET quote_sent_at = COALESCE(updated_at, created_at)
 WHERE quote_sent_at IS NULL AND status = 'waiting';

-- Backfill: offerter som redan fått den gamla engångspåminnelsen räknas som steg 1
UPDATE carts
   SET quote_reminder_log = jsonb_build_array(jsonb_build_object(
         'template', 'legacy', 'at', admin_reminder_sent_at, 'final', false, 'include_decline', false))
 WHERE admin_reminder_sent_at IS NOT NULL
   AND quote_reminder_log = '[]'::jsonb;

-- ── chat_templates ────────────────────────────────────────────────────
-- kind = 'chat' (snabbmallar i Chatt-fliken) | 'reminder' (offertpåminnelser)
ALTER TABLE chat_templates ADD COLUMN IF NOT EXISTS kind    text NOT NULL DEFAULT 'chat';
ALTER TABLE chat_templates ADD COLUMN IF NOT EXISTS subject text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chat_templates_kind_check') THEN
    ALTER TABLE chat_templates ADD CONSTRAINT chat_templates_kind_check
      CHECK (kind IN ('chat', 'reminder'));
  END IF;
END $$;

-- Fyra påminnelsemallar. ON CONFLICT DO NOTHING → redigeringar i admin skrivs aldrig över.
INSERT INTO chat_templates (id, kind, label, title, subject, body, sort_order) VALUES
(
  'paminnelse-formell', 'reminder', '🎩 Formell',
  'Formell ton — passar företag och myndigheter',
  'Påminnelse: offert {ordernummer} från Scenkonsult Norden',
  E'Hej {förnamn},\n\nVi vill påminna om offerten vi skickat avseende ert evenemang den {datum}. Offerten finns tillgänglig via länken i detta mail, där ni också kan godkänna den direkt.\n\nHar ni frågor eller önskar justeringar är ni välkomna att kontakta oss.\n\nMed vänliga hälsningar\nScenkonsult Norden',
  100
),
(
  'paminnelse-neutral', 'reminder', '💬 Neutral',
  'Vänlig men saklig — standard för privatkunder',
  'Din offert från Scenkonsult Norden',
  E'Hej {förnamn}!\n\nVi ville bara påminna om offerten inför den {datum}. Du ser och godkänner den via länken nedan.\n\nHör av dig om något behöver ändras — vi anpassar gärna upplägget.\n\nVänliga hälsningar\nScenkonsult Norden',
  101
),
(
  'paminnelse-personlig', 'reminder', '🙂 Personlig',
  'Personlig ton — för återkommande kunder',
  'Hur går planeringen, {förnamn}?',
  E'Hej {förnamn}!\n\nHoppas planeringen inför den {datum} rullar på bra. Jag ville bara höra hur du tänker kring offerten vi skickade.\n\nSäg till om du vill bolla upplägget eller ändra något — det löser vi. 😊\n\nVarma hälsningar\nScenkonsult Norden',
  102
),
(
  'paminnelse-sista', 'reminder', '⏳ Sista påminnelse',
  'Sista påminnelsen — eventet är nära, med möjlighet att tacka nej',
  '{dagar_kvar} kvar till eventet — vill du gå vidare med offerten?',
  E'Hej {förnamn}!\n\nNu är det bara {dagar_kvar} kvar till den {datum}. För att kunna planera leverans och utrustning behöver vi veta om du vill gå vidare med offerten.\n\nGodkänn gärna offerten via länken nedan. Behöver du den inte längre går det bra att tacka nej med ett klick — då vet vi hur vi ska planera, och du slipper fler påminnelser.\n\nVänliga hälsningar\nScenkonsult Norden',
  103
)
ON CONFLICT (id) DO NOTHING;
