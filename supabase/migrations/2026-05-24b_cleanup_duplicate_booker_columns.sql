-- 2026-05-24 — CLEANUP: ta bort duplicerade booker_*-kolumner
--
-- KÖRS MANUELLT i Supabase SQL Editor:
--   https://supabase.com/dashboard/project/ejhhgqvtvsmiwxygfqbu/editor
--
-- BAKGRUND:
-- I tidigare migration (2026-05-24_utlamningsflode_v3.sql) lade jag till
-- fyra "booker_*"-kolumner för förberedelse-länken — utan att först
-- granska att motsvarande "pickup_*"-kolumner redan fanns på tabellen
-- och används aktivt av sign-submit.js.
--
-- Mappning befintlig → påhittad duplikat:
--   pickup_signature   ←  booker_signature_data_url    (samma: signatur som data-URL)
--   pickup_sign_ip     ←  booker_signature_ip          (samma: IP vid signering)
--   pickup_id_photo    ←  booker_id_photo_url          (samma: fotolegitimation)
--   pickup_signed_at   ←  (booker_id_photo_uploaded_at, partiell duplicering)
--
-- Eftersom inget i koden skriver till booker_*-kolumnerna än är det säkert
-- att droppa dem. Batch 3 (förberedelse-länk-frontend) kommer använda
-- pickup_*-konventionen — samma som sign-submit.js redan gör.
--
-- KVAR från utlamningsflode_v3.sql:
--   ✓ prepared_via                          (NY funktion: sms|email|admin)
--   ✓ pickup_method                         (NY funktion: self|proxy)
--   ✓ pickup_proxy_name/_phone/_id_verified_at  (NY funktion: bud)
--   ✓ delivery_recipient_method/_name/_phone/_id_verified_at  (NY funktion)

ALTER TABLE carts
  DROP COLUMN IF EXISTS booker_id_photo_url,
  DROP COLUMN IF EXISTS booker_id_photo_uploaded_at,
  DROP COLUMN IF EXISTS booker_signature_data_url,
  DROP COLUMN IF EXISTS booker_signature_ip;

-- Verifiering efter körning — alla 4 ska saknas, 9 nya ska kvarstå:
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'carts'
--     AND (column_name LIKE 'booker_%'
--       OR column_name LIKE 'pickup_proxy%'
--       OR column_name LIKE 'delivery_recipient%'
--       OR column_name IN ('customer_type','prepared_via','pickup_method'))
--   ORDER BY column_name;
--
-- Förväntade rader: 11 (4 borttagna ska INTE komma med):
--   customer_type
--   delivery_recipient_id_verified_at
--   delivery_recipient_method
--   delivery_recipient_name
--   delivery_recipient_phone
--   pickup_method
--   pickup_proxy_id_verified_at
--   pickup_proxy_name
--   pickup_proxy_phone
--   prepared_via
--   (customer_type)
