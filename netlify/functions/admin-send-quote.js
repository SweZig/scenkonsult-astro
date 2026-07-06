// netlify/functions/admin-send-quote.js
// Admin skapar och skickar offert till kund
// POST /.netlify/functions/admin-send-quote — kräver ADMIN_TOKEN

'use strict';
const crypto = require('crypto');
const { supabase: createSupabase, generateCartToken, isAdmin, logAudit, ok, err, preflight,
        htmlWrapper, sendEmail, buildPriceTable, MAIL_FROM } = require('./_lib');

const sleep = ms => new Promise(r => setTimeout(r, ms));

function genCartId() {
  const hex = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `SK-${hex.slice(0,8)}-${hex.slice(8,12)}`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let data;
  try { data = JSON.parse(event.body); }
  catch { return err('Ogiltig data', 400); }

  const { customer, items, note, existing_cart_id, pdf_attachment } = data;

  if (!customer?.name || !customer?.email)
    return err('Namn och e-post krävs', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return err('Ogiltig e-postadress', 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return err('E-postkonfiguration saknas', 500);

  const db = createSupabase();

  let cartId    = existing_cart_id || genCartId();
  let cartToken = generateCartToken();
  // Sätts till true om vi skickar om en offert till en redan bekräftad order —
  // då måste den digitala signeringen nollställas så kunden kan godkänna på nytt.
  let clearPriorConfirmation = false;

  if (existing_cart_id) {
    const { data: existingCart } = await db.from('carts')
      .select('id, cart_token, status, confirmed_at')
      .eq('id', existing_cart_id).single().catch(() => ({ data: null }));

    if (!existingCart) {
      console.warn('ADMIN_QUOTE: existing_cart_id hittades ej, genererar nytt:', existing_cart_id);
      cartId    = genCartId();
      cartToken = generateCartToken();
    } else {
      cartToken = existingCart.cart_token || cartToken;
      // Kunden hade redan bekräftat. En ny/ändrad offert skickas ut → den gamla
      // signeringen gäller inte längre den nya offerten. Nollställ så att
      // cart-update.js (customer_confirm) släpper igenom en ny bekräftelse.
      if (existingCart.confirmed_at) clearPriorConfirmation = true;
    }
  }

  const realItems = (items || []).filter(i => !i._note && i.name).map(i => ({
    ...i,
    // type sätts från katalogen om det saknas (bakåtkompatibilitet)
    type: i.type || (['lev-standard','lev-skrymmande','lev-lastbil','lev-bakgavel','montering','rigg-teknik','fakturaavgift-49'].includes(i.id) ? 'service' : 'product'),
    category: i.category || (['lev-standard','lev-skrymmande','lev-lastbil','lev-bakgavel','montering','rigg-teknik','fakturaavgift-49'].includes(i.id) ? 'Tjänster' : ''),
  }));
  const allItems  = [...realItems];
  if (note?.trim()) {
    allItems.push({ _note: true, id: '_note', name: note.trim(), price: 0, qty: 1 });
  }

  const totalExcl = realItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const cartUrl   = `https://scenkonsult.se/order/?cart=${cartId}&token=${cartToken}`;

  try {
    // Validera delivery_mode (whitelist) — undvik att klient skickar skräpvärden
    const dmRaw = customer.delivery_mode;
    const deliveryMode = (dmRaw === 'self_pickup' || dmRaw === 'delivery') ? dmRaw : null;

    await db.upsert('carts', {
      id:               cartId,
      status:           'waiting',
      items:            allItems,
      customer_name:    customer.name,
      customer_email:   customer.email,
      customer_phone:   customer.phone    || null,
      customer_message: '',
      event_date:       customer.date     || null,
      event_location:   customer.location || null,
      delivery_mode:    deliveryMode,
      delivery_time:    customer.delivery_time || '13:00',
      return_time:      customer.return_time   || '11:00',
      return_date:      customer.return_date   || null,
      customer_company: customer.company  || null,
      customer_orgnr:   customer.orgnr    || null,
      customer_type:    customer.company  ? 'b2b' : 'b2c',
      total_excl:       totalExcl * 100,
      cart_token:       cartToken,
      cc_email:         customer.cc_email || null,
      // status blir 'waiting' här — ingen TTL på skickade offerter, länken
      // ska vara giltig tills kunden bekräftar eller ordern avbryts.
      expires_at:       null,
      // Vid omskickad offert till en redan bekräftad order: nollställ signeringen
      // så kunden kan godkänna den nya offerten på nytt.
      ...(clearPriorConfirmation ? {
        confirmed_at:         null,
        confirmed_ip:         null,
        confirmed_user_agent: null,
        confirmation_text:    null,
      } : {}),
    });
    await logAudit(db, cartId, 'admin', 'quote_sent', { to: customer.email });
    if (clearPriorConfirmation) {
      await logAudit(db, cartId, 'admin', 'confirmation_reset', {
        reason: 'Ny offert skickad till tidigare bekräftad order'
      });
    }
  } catch (e) {
    console.error('ADMIN_QUOTE_DB_ERROR:', e.message);
    return err('Databasfel: ' + e.message, 500);
  }

  const dlTime   = customer.delivery_time || '13:00';
  const rtTime   = customer.return_time   || '11:00';
  const retDate  = customer.return_date   || customer.date;
  const datumStr = customer.date
    ? `Utlämning: ${customer.date} kl ${dlTime}${retDate && retDate !== customer.date
        ? ' · Återlämning: ' + retDate + ' kl ' + rtTime
        : ' · Återlämning: ' + customer.date + ' kl ' + rtTime}`
    : '';
  const platsStr = customer.location ? `Plats: ${customer.location}` : '';
  const noteHtml = note?.trim()
    ? `<div style="margin:0 0 22px;padding:14px 16px;background:#fff8e6;border-left:3px solid #f59e0b;border-radius:0 6px 6px 0;color:#5a4a1a;font-size:13px;line-height:1.65;"><strong style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a07712;margin-bottom:4px;">Personlig hälsning</strong>${note.trim().replace(/\n/g,'<br>')}</div>`
    : '';

  // Beräkna summering för teaser (utan att avslöja priserna per rad)
  const totalIncl = Math.round(totalExcl * 1.25);
  const fmtN      = n => n.toLocaleString('sv-SE');
  const itemsCount = realItems.reduce((s, i) => s + (i.qty || 1), 0);
  const isB2B     = !!customer.company;

  // Kompakt produktlista (namn + antal, inga priser — driver till webben)
  const itemsList = realItems.length
    ? `<div style="margin:0 0 22px;padding:14px 16px;background:#fafaff;border:1px solid #ececf5;border-radius:8px;">
         <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Innehåll i offerten</p>
         <ul style="margin:0;padding:0 0 0 18px;color:#333;font-size:13px;line-height:1.8;">
           ${realItems.map(i => `<li>${i.name}${(i.qty||1) > 1 ? ` <span style="color:#888;">× ${i.qty}</span>` : ''}</li>`).join('')}
         </ul>
       </div>`
    : '';

  // B2B: visa exkl. moms primärt (företag drar av moms)
  // B2C: visa inkl. moms primärt (privatperson betalar totalen)
  const primaryAmount = isB2B ? totalExcl : totalIncl;
  const primaryLabel  = isB2B ? 'Total exkl. moms' : 'Total inkl. moms';
  const secondaryText = isB2B
    ? `${itemsCount} ${itemsCount === 1 ? 'artikel' : 'artiklar'} · ${fmtN(totalIncl)} kr inkl. moms`
    : `${itemsCount} ${itemsCount === 1 ? 'artikel' : 'artiklar'} · ${fmtN(totalExcl)} kr exkl. moms`;

  const bigCta = `
    <div style="margin:0 0 24px;padding:24px 20px;background:linear-gradient(135deg,#1e1850 0%,#332885 100%);border-radius:12px;text-align:center;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">${primaryLabel}</p>
      <p style="margin:0 0 4px;color:#c4b5f4;font-size:34px;font-weight:800;line-height:1;font-family:Arial,sans-serif;">${fmtN(primaryAmount)} kr</p>
      <p style="margin:0 0 18px;color:rgba(255,255,255,0.55);font-size:12px;">${secondaryText}</p>
      <a href="${cartUrl}" style="display:inline-block;background:#c4b5f4;color:#0c0a24;padding:16px 36px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:800;letter-spacing:0.01em;box-shadow:0 4px 12px rgba(0,0,0,0.25);">Öppna offerten →</a>
      <p style="margin:14px 0 0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.5;">På offertsidan kan du se hela prisspecifikationen,<br>ställa frågor och bekräfta direkt.</p>
    </div>`;

  const eventInfo = (datumStr || platsStr)
    ? `<div style="margin:0 0 22px;padding:12px 14px;background:#fafaff;border-radius:8px;color:#555;font-size:13px;line-height:1.7;">
         ${datumStr ? `<div>📅 ${datumStr}</div>` : ''}
         ${platsStr ? `<div>📍 ${platsStr}</div>` : ''}
       </div>`
    : '';

  const secondaryCta = `
    <div style="margin:24px 0 8px;padding:16px;background:#fafaff;border:1px dashed #d8d4f0;border-radius:8px;text-align:center;">
      <p style="margin:0 0 10px;color:#555;font-size:14px;line-height:1.5;">Klar att gå vidare? Bekräfta din offert med ett klick.</p>
      <a href="${cartUrl}" style="display:inline-block;background:#332885;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:700;">Se och bekräfta →</a>
    </div>`;

  const htmlBody = `
    <h2 style="margin:0 0 8px;color:#1e1850;font-size:22px;">Hej ${customer.name}!</h2>
    ${customer.company ? `<p style="margin:0 0 16px;padding:10px 14px;background:#f7f7fb;border-radius:6px;color:#555;font-size:14px;"><span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;display:block;margin-bottom:2px;">Offert till företag</span><strong style="color:#1e1850;">${customer.company}</strong>${customer.orgnr ? ` <span style="color:#888;font-size:12px;">· Org.nr ${customer.orgnr}</span>` : ''}</p>` : ''}
    <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">Vi har satt ihop en offert åt dig. Klicka nedan för att se den fullständiga specifikationen — där kan du också ställa frågor, justera och bekräfta direkt.</p>
    ${bigCta}
    ${noteHtml}
    ${itemsList}
    ${eventInfo}
    ${secondaryCta}
    <p style="margin:18px 0 0;color:#888;font-size:12px;text-align:center;">Länken är personlig och giltig i 21 dagar.</p>
    <p style="margin:14px 0 0;color:#555;font-size:13px;text-align:center;">Frågor? Ring <a href="tel:0724481000" style="color:#1e1850;font-weight:600;">072-448 10 00</a> eller svara på detta mail.</p>`;

  const plainText = `Hej ${customer.name}!\n${customer.company ? `\nOffert till företag: ${customer.company}${customer.orgnr ? ' (Org.nr ' + customer.orgnr + ')' : ''}\n` : ''}\nVi har en offert åt dig — totalt ${fmtN(primaryAmount)} kr ${isB2B ? 'exkl. moms' : 'inkl. moms'} (${itemsCount} ${itemsCount === 1 ? 'artikel' : 'artiklar'}).\n\nÖppna och bekräfta din offert här:\n${cartUrl}\n\nPå offertsidan ser du hela prisspecifikationen, kan ställa frågor och bekräfta direkt.\n${note?.trim() ? '\nPersonlig hälsning:\n' + note.trim() + '\n' : ''}${datumStr ? '\n' + datumStr : ''}${platsStr ? '\n' + platsStr : ''}\n\nLänken är personlig och giltig i 21 dagar.\n\nFrågor? Ring 072-448 10 00\n---\nScenkonsult Norden | scenkonsult.se`;

  try {
    const internalBody = `<p style="color:#888;font-size:13px;margin:0 0 20px;">Skickad till: <strong>${customer.email}</strong></p>${htmlBody}
      <hr style="border:none;border-top:1px solid #e0e0e8;margin:30px 0 20px;">
      <p style="margin:0 0 10px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Intern referens — full prisspecifikation</p>
      ${buildPriceTable(realItems)}`;
    await sendEmail(apiKey, {
      from:     MAIL_FROM,
      to:       ['info@scenkonsult.se'],
      reply_to: customer.email,
      subject:  `Offert skickad till ${customer.name}`,
      html:     htmlWrapper(internalBody),
      text:     `Offert skickad till ${customer.email}\n\n${plainText}`,
    });
    await sleep(600);

    const customerMailPayload = {
      from:     MAIL_FROM,
      to:       [customer.email],
      ...(customer.cc_email ? { cc: [customer.cc_email] } : {}),
      reply_to: 'info@scenkonsult.se',
      subject:  'Din offert från Scenkonsult Norden',
      html:     htmlWrapper(htmlBody),
      text:     plainText,
    };
    if (pdf_attachment?.content && pdf_attachment?.filename) {
      customerMailPayload.attachments = [{
        filename: pdf_attachment.filename,
        content:  pdf_attachment.content,
      }];
      console.log('ADMIN_QUOTE: bifogad PDF:', pdf_attachment.filename);
    }
    const customerSendResp = await sendEmail(apiKey, customerMailPayload);
    const messageId = customerSendResp?.id || null;

    // Spara Resend's message-id så resend-webhook.js kan koppla bounce → cart.
    // Rensa samtidigt eventuella gamla bounce-flaggor — admin har just skickat
    // ett nytt försök, ev. tidigare bounce ska inte längre flagga ordern.
    try {
      await db.update('carts', {
        last_quote_message_id: messageId,
        bounce_status:         null,
        bounce_at:             null,
        bounce_reason:         null,
      }, 'id', cartId);
    } catch (e) {
      // Icke-blockerande — kolumnerna kan saknas (migration ej körd än)
      console.warn('ADMIN_QUOTE: kunde inte spara message_id/bounce-rensning:', e.message);
    }

    console.log('ADMIN_QUOTE_SENT:', cartId, 'to', customer.email, 'message_id', messageId);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true, cart_id: cartId, cart_token: cartToken, cart_url: cartUrl, message_id: messageId }),
    };
  } catch (e) {
    console.error('ADMIN_QUOTE_MAIL_ERROR:', e.message);
    return err('Kunde inte skicka mail: ' + e.message, 500);
  }
};
