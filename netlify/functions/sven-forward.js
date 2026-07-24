// netlify/functions/sven-forward.js
// Skapas när kund klickar [FORWARD]-knappen i Sven-chatten.
// Skapar en cart i Supabase med source='sven' som hamnar i ordinarie
// kanban-pipeline. Admin ser den med lavendel-badge "🤖 Sven".
//
// Anropas av sven-widget.src.js när kunden klickar
// "Be Scenkonsult kontakta mig om detta →"-knappen som Sven
// taggat med [FORWARD:offert] / [FORWARD:ring] / [FORWARD:fraga].

'use strict';
const { supabase: createSupabase, generateCartToken, logAudit } = require('./_lib');

const ALLOWED_TYPES = ['offert', 'ring', 'fraga'];

function generateCartId() {
  const hex = (n) => {
    const a = new Uint8Array(n);
    crypto.getRandomValues(a);
    return Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  return `SK-${hex(4)}-${hex(2)}`;
}

function buildConversationSnapshot(history) {
  if (!Array.isArray(history) || history.length === 0) return '';
  // Ta sista 12 meddelandena — räcker som kontext, ej för mycket
  const tail = history.slice(-12);
  const lines = tail.map(m => {
    const who = m.role === 'user' ? '👤 Kund' : '🎭 Sven';
    const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    return `${who}:\n${content}`;
  });
  return lines.join('\n\n────────────\n\n');
}

function describeForward(type) {
  switch (type) {
    case 'offert': return 'Kunden vill få en offert via mail';
    case 'ring':   return 'Kunden vill bli uppringd';
    case 'fraga':  return 'Kunden har en fråga som kräver en människa';
    default:       return 'Sven-ärende — kontrollera konversationen';
  }
}

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let data;
  try { data = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ogiltig JSON' }) }; }

  const {
    forward_type,
    session_id,
    history,             // array av {role, content}
    items,               // valfri lista av {id, name, price, category, qty}
    page_url,
    customer_type,       // 'company' | 'private' | 'org' | 'unknown'
  } = data;

  if (!ALLOWED_TYPES.includes(forward_type)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Okänd forward_type' }) };
  }

  // Bygg cart-objekt
  const cartId    = generateCartId();
  const cartToken = generateCartToken();
  const snapshot  = buildConversationSnapshot(history);
  const desc      = describeForward(forward_type);

  // Items: skicka in tomma om Sven inte taggade några produkter
  const cleanItems = Array.isArray(items)
    ? items.filter(i => i && i.id && i.name).map(i => ({
        id: i.id,
        name: i.name,
        price: Number(i.price) || 0,
        category: i.category || 'Övrigt',
        qty: Number(i.qty) || 1,
      }))
    : [];

  const totalExcl = cleanItems.reduce((sum, i) => sum + (i.price * i.qty), 0);

  // customer_type-mappning: Sven använder 'company'/'private'/'org' men
  // carts.customer_type är 'b2b'/'b2c' i pipelinen.
  const dbCustomerType = customer_type === 'company' ? 'b2b'
                       : customer_type === 'private' ? 'b2c'
                       : customer_type === 'org'     ? 'b2c'
                       : null;

  const db = createSupabase();
  try {
    // ── DEDUP ────────────────────────────────────────────────────────────
    // Sven-chat.mjs kan redan ha auto-skapat ett kort för sessionen (när Sven
    // lovade uppföljning). Skapa då inte ett andra — uppdatera det befintliga
    // med produkterna kunden faktiskt bekräftade via knappen.
    if (session_id) {
      let existing = null;
      try {
        const res = await db.from('carts')
          .select('id,status,items,sven_forward_type')
          .eq('sven_session_id', session_id)
          .limit(1);
        existing = Array.isArray(res.data) ? res.data[0] : (res.data || null);
      } catch (lookupErr) {
        console.warn('SVEN_FORWARD_LOOKUP_WARN:', lookupErr.message);
      }

      if (existing) {
        const patch = {};
        // Fyll produkter om knappen bar med sig sådana och kortet saknar dem.
        const hasItems = Array.isArray(existing.items) && existing.items.length > 0;
        if (!hasItems && cleanItems.length) {
          patch.items = cleanItems;
          patch.total_excl = totalExcl * 100;
        }
        // Uppgradera ärendetyp (fraga < ring < offert) om knappen är starkare.
        const rank = { fraga: 1, ring: 2, offert: 3 };
        if ((rank[forward_type] || 0) > (rank[existing.sven_forward_type] || 0)) {
          patch.sven_forward_type = forward_type;
        }
        if (Object.keys(patch).length) {
          await db.update('carts', patch, 'id', existing.id);
        }
        try {
          await logAudit(db, existing.id, 'system', 'sven_forward_confirmed', {
            forward_type, session_id, item_count: cleanItems.length, deduped: true,
          });
        } catch (auditErr) { console.warn('SVEN_FORWARD_AUDIT_WARN:', auditErr.message); }

        console.log('SVEN_FORWARD_DEDUP:', existing.id, forward_type, session_id);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ ok: true, cart_id: existing.id, forward_type, deduped: true }),
        };
      }
    }

    await db.insert('carts', {
      id:                 cartId,
      status:             'new',
      source:             'sven',
      sven_session_id:    session_id || null,
      sven_forward_type:  forward_type,
      items:              cleanItems,
      customer_name:      null,           // Sven samlar inte in detta strukturerat
      customer_email:     null,
      customer_phone:     null,
      customer_message:   desc,
      customer_type:      dbCustomerType,
      notes_admin:        `🤖 Skapad via Svens [FORWARD:${forward_type}]-knapp.\nSida: ${page_url || '(okänd)'}\nSession: ${session_id || '(saknas)'}\n\n── Konversationssnapshot ──\n\n${snapshot}`,
      total_excl:         totalExcl * 100,
      cart_token:         cartToken,
      expires_at:         new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Audit-logg
    try {
      await logAudit(db, cartId, 'system', 'sven_forward_created', {
        forward_type,
        session_id: session_id || null,
        page_url:   page_url || null,
        item_count: cleanItems.length,
      });
    } catch (auditErr) {
      console.warn('SVEN_FORWARD_AUDIT_WARN:', auditErr.message);
    }

    console.log('SVEN_FORWARD_OK:', cartId, forward_type, session_id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, cart_id: cartId, forward_type }),
    };
  } catch (e) {
    console.error('SVEN_FORWARD_ERROR:', e.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Kunde inte spara ärendet. Försök igen.' }),
    };
  }
};
