// netlify/functions/verify-id-photo.js
// Verifierar att kunden laddat upp ett leg-foto (inte t.ex. kvitto eller selfie).
// Använder Claude Haiku 4.5 Vision för analys. Soft check — frontenden låter
// kunden fortsätta oavsett resultat.
//
// POST { cart_id, token, image_data }
//   - image_data: data:image/jpeg;base64,... (samma format som sign-submit)
//   - token: cart_token (samma auth som sign-submit)
//
// Returnerar:
//   { ok: true, result: {
//       is_id, confidence (0..1), type, issues[], reason, checked_at
//     } }
//
// Sparar resultatet direkt i carts.id_photo_ai_result, så admin-panelen kan
// visa det senare. Skriver över vid varje ny foto-upload (replaces).

'use strict';
const { supabase, ok, err, preflight, logAudit } = require('./_lib');

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL         = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `Du verifierar foton av legitimation för en uthyrningsfirma i Sverige.

Analysera bilden och returnera ENDAST en JSON med dessa fält:
- is_id (boolean): Visar bilden ett körkort, ID-kort, pass eller annan officiell legitimation? Var generös — utländska legitimationsdokument räknas.
- confidence (number 0.0-1.0): Hur säker är du på din bedömning?
- type (string): "korkort", "id-kort", "pass", eller "annat"
- issues (array av strängar): Lista kvalitetsproblem som kan göra det svårt att verifiera identiteten visuellt. Möjliga värden: "suddig", "mork", "reflex", "avskuren", "for_langt_fran", "skarm_av_foto". Lämna [] om bilden är OK.
- reason (string, max 100 tecken): Om confidence < 0.8 eller is_id = false, förklara kort på svenska. Annars: null.

Svara med BARA JSON, ingen annan text, ingen markdown, ingen kommentar.`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);

  let body;
  try {
    let raw = event.body || '{}';
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, 'base64').toString('utf-8');
    body = JSON.parse(raw);
  } catch (e) {
    return err('Ogiltig JSON', 400);
  }

  const { cart_id, token, image_data } = body;
  if (!cart_id || !token) return err('cart_id och token krävs', 400);
  if (!image_data || !image_data.startsWith('data:image/')) {
    return err('Ogiltig image_data', 400);
  }

  // Storlekskontroll (samma som sign-submit för id_photo_data)
  const MAX = 512 * 1024 * 4;
  if (image_data.length > MAX) return err('Bilden är för stor', 400);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return err('AI-konfiguration saknas (ANTHROPIC_API_KEY)', 500);

  const db = supabase();

  // Autentisera mot cart_token
  try {
    const { data: cart, error } = await db.from('carts')
      .select('id, cart_token, pickup_signed_at')
      .eq('id', cart_id)
      .eq('cart_token', token)
      .single();
    if (error || !cart) return err('Varukorg hittades ej eller ogiltig token', 404);
    if (cart.pickup_signed_at) return err('Förberedelsen är redan signerad', 409);
  } catch (e) {
    return err('Auth-fel: ' + e.message, 500);
  }

  // Extrahera media_type + base64 från data URL
  const match = image_data.match(/^data:(image\/(jpeg|jpg|png|webp));base64,(.+)$/);
  if (!match) return err('Bilden måste vara JPEG, PNG eller WebP', 400);
  const mediaType = match[1].replace('image/jpg', 'image/jpeg');
  const base64    = match[3];

  // ── Anropa Claude Haiku Vision ────────────────────────────────────────
  let result;
  try {
    const apiRes = await fetch(ANTHROPIC_URL, {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 300,
        system:     SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text',  text: 'Verifiera denna bild enligt instruktionerna.' },
            ],
          },
        ],
      }),
    });

    const apiData = await apiRes.json();
    if (!apiRes.ok) {
      console.error('VERIFY_ID_API_ERROR:', apiRes.status, apiData);
      return err(`AI-fel: ${apiData?.error?.message || apiRes.status}`, 502);
    }

    // Parse modellens svar — förväntad: ren JSON
    const rawText = (apiData?.content?.[0]?.text || '').trim();
    // Tillåt eventuell ```json...``` wrapping
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('VERIFY_ID_PARSE_ERROR:', rawText.slice(0, 300));
      return err('AI-svar kunde inte tolkas', 502);
    }

    // Validera struktur — sätt defaults om något saknas
    result = {
      is_id:      typeof result.is_id === 'boolean' ? result.is_id : false,
      confidence: typeof result.confidence === 'number' ? Math.min(1, Math.max(0, result.confidence)) : 0,
      type:       typeof result.type === 'string' ? result.type : 'annat',
      issues:     Array.isArray(result.issues) ? result.issues.slice(0, 6) : [],
      reason:     typeof result.reason === 'string' ? result.reason.slice(0, 200) : null,
      checked_at: new Date().toISOString(),
    };
  } catch (e) {
    console.error('VERIFY_ID_FETCH_ERROR:', e.message);
    return err('AI-anrop misslyckades: ' + e.message, 502);
  }

  // ── Spara resultat på cart ────────────────────────────────────────────
  try {
    await db.update('carts', { id_photo_ai_result: result }, 'id', cart_id);
    await logAudit(db, cart_id, 'system', 'id_photo_verified', {
      is_id: result.is_id, confidence: result.confidence, type: result.type,
    });
  } catch (e) {
    // Loggar men returnerar ändå resultatet — frontend ska kunna visa det
    console.error('VERIFY_ID_DB_ERROR:', e.message);
  }

  return ok({ result });
};
