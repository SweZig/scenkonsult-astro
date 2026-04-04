// netlify/functions/admin-send-quote.js
// Admin skapar och skickar en offert till en kund
// POST /.netlify/functions/admin-send-quote
// Kräver ADMIN_TOKEN

'use strict';
const { supabase: createSupabase, generateCartToken, isAdmin, logAudit, ok, err, preflight } = require('./_lib');



exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let data;
  try { data = JSON.parse(event.body); }
  catch { return err('Ogiltig data', 400); }

  const { customer, items, note, existing_cart_id } = data;

  if (!customer?.name || !customer?.email)
    return err('Namn och e-post krävs', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return err('Ogiltig e-postadress', 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return err('E-postkonfiguration saknas', 500);

  const db = createSupabase();

  // Om existing_cart_id skickas: verifiera att den finns och inte är en annan kunds skyddade cart
  let cartId    = existing_cart_id || genCartId();
  let cartToken = generateCartToken();

  if (existing_cart_id) {
    const { data: existingCart } = await db.from('carts')
      .select('id, cart_token, status, customer_email')
      .eq('id', existing_cart_id).single().catch(() => ({ data: null }));

    if (!existingCart) {
      // existing_cart_id finns inte i databasen — generera nytt
      console.warn('ADMIN_QUOTE: existing_cart_id hittades ej, genererar nytt:', existing_cart_id);
      cartId    = `SK-${Array.from(crypto.getRandomValues(new Uint8Array(6))).map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase().slice(0,8)}-${Array.from(crypto.getRandomValues(new Uint8Array(2))).map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase()}`;
      cartToken = generateCartToken();
    } else {
      // Bevara befintlig token (så gamla länkarna fortfarande fungerar)
      cartToken = existingCart.cart_token || cartToken;
    }
  }
  const realItems  = (items || []).filter(i => !i._note && i.name);
  
  // Lägg till notraden om det finns anteckningar
  const allItems = [...realItems];
  if (note?.trim()) {
    allItems.push({ _note: true, id: '_note', name: note.trim(), price: 0, qty: 1 });
  }

  const totalExcl = realItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const cartUrl   = `https://scenkonsult.se/order/?cart=${cartId}&token=${cartToken}`;

  try {
    await db.upsert('carts', {
      id:               cartId,
      status:           'waiting',
      items:            allItems,
      customer_name:    customer.name,
      customer_email:   customer.email,
      customer_phone:   customer.phone || null,
      customer_message: '',
      event_date:        customer.date || null,
      event_location:    customer.location || null,
      delivery_time:     customer.delivery_time || '13:00',
      return_time:       customer.return_time   || '11:00',
      return_date:       customer.return_date   || null,
      customer_company:  customer.company  || null,
      customer_orgnr:    customer.orgnr    || null,
      customer_type:     customer.company  ? 'b2b' : 'b2c',
      total_excl:       totalExcl * 100,
      cart_token:       cartToken,
      expires_at:       new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    });
    await logAudit(db, cartId, 'admin', 'quote_sent', { to: customer.email });
  } catch (e) {
    console.error('ADMIN_QUOTE_DB_ERROR:', e.message);
    return err('Databasfel: ' + e.message, 500);
  }

  const dlTime  = customer.delivery_time || '13:00';
  const rtTime  = customer.return_time   || '11:00';
  const retDate = customer.return_date   || customer.date;
  const datumStr = customer.date
    ? `Utlämning: ${customer.date} kl ${dlTime}${retDate && retDate !== customer.date ? ' · Återlämning: ' + retDate + ' kl ' + rtTime : ' · Återlämning: ' + customer.date + ' kl ' + rtTime}`
    : '';
  const platsStr   = customer.location ? `Plats: ${customer.location}` : '';
  const noteHtml   = note?.trim()
    ? `<p style="margin:16px 0 0;padding:12px 14px;background:#f7f7fb;border-left:3px solid #8b7dd4;border-radius:0 6px 6px 0;color:#555;font-size:13px;line-height:1.6;">${note.trim().replace(/\n/g,'<br>')}</p>`
    : '';

  const htmlBody = `
    <h2 style="margin:0 0 8px;color:#1e1850;font-size:22px;">Offert från Scenkonsult Norden</h2>
    <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">Hej ${customer.name}! Vi har satt ihop en offert åt dig baserat på dina önskemål. Klicka på knappen nedan för att se, granska och eventuellt justera — sedan kan du enkelt skicka tillbaka din bekräftelse till oss.</p>
    <p style="margin:0 0 10px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Din offert</p>
    ${buildPriceTable(realItems)}
    ${noteHtml}
    ${datumStr || platsStr ? `<p style="margin:14px 0 0;color:#666;font-size:13px;">${[datumStr,platsStr].filter(Boolean).join(' &middot; ')}</p>` : ''}
    <p style="margin:28px 0 8px;"><a href="${cartUrl}" style="background:#332885;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">Se och bekräfta din offert →</a></p>
    <p style="margin:10px 0 0;color:#888;font-size:12px;">Via länken kan du justera produkter och skicka tillbaka din beställning. Länken är giltig i 21 dagar.</p>
    <p style="margin:20px 0 0;color:#555;font-size:13px;">Frågor? Kontakta oss gärna på <a href="tel:0724481000" style="color:#1e1850;">072-448 10 00</a> eller svara på detta mail.</p>`;

  const plainText = `Offert från Scenkonsult Norden\n\nHej ${customer.name}!\n\nVi har satt ihop en offert åt dig. Klicka på länken nedan för att se och bekräfta:\n${cartUrl}\n\n${realItems.map(i=>`${i.name} x${i.qty||1} — ${((i.price||0)*(i.qty||1)).toLocaleString('sv-SE')} kr`).join('\n')}\nTotalt: ${totalExcl.toLocaleString('sv-SE')} kr (exkl. moms)\n${note?.trim()?'\nAnmärkning:\n'+note.trim():''}${datumStr?'\n'+datumStr:''}\n\nFrågor? Ring 072-448 10 00\n---\nScenkonsult Norden | scenkonsult.se`;

  try {
    // 1. Intern kopia
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: ['info@scenkonsult.se'],
      reply_to: customer.email,
      subject: `Offert skickad till ${customer.name}`,
      html: htmlWrapper(`<p style="color:#888;font-size:13px;margin:0 0 20px;">Skickad till: <strong>${customer.email}</strong></p>${htmlBody}`),
      text: `Offert skickad till ${customer.email}\n\n${plainText}`
    });
    await sleep(600);

    // 2. Till kunden
    await sendEmail(apiKey, {
      from: MAIL_FROM,
      to: [customer.email],
      reply_to: 'info@scenkonsult.se',
      subject: `Din offert från Scenkonsult Norden`,
      html: htmlWrapper(htmlBody),
      text: plainText
    });

    console.log('ADMIN_QUOTE_SENT:', cartId, 'to', customer.email);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true, cart_id: cartId, cart_token: cartToken, cart_url: cartUrl }) };
  } catch (e) {
    console.error('ADMIN_QUOTE_MAIL_ERROR:', e.message);
    return err('Kunde inte skicka mail: ' + e.message, 500);
  }
};
