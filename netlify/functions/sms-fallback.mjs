// netlify/functions/sms-fallback.js
// Schemalagd funktion — körs var 30:e minut
// Hittar carts där:
//   - status = 'waiting' (offert skickad till kund)
//   - last_read_customer IS NULL (kunden har inte öppnat ordersidan)
//   - sms_sent_at IS NULL (SMS ej skickat)
//   - updated_at är äldre än 30 min (vi har väntat tillräckligt)
//   - customer_phone finns
// Skickar SMS med orderlänk + markerar sms_sent_at

const ELKS_URL    = 'https://api.46elks.com/a1/SMS';
const FROM_NAME   = 'Scenkonsult';
const DELAY_MIN   = 30; // Minuter att vänta efter offert skickad

async function sendSms(to, message, user, pass) {
  let phone = to.replace(/\s/g, '').replace(/^0/, '+46');
  if (!phone.startsWith('+')) phone = '+46' + phone;

  const body = new URLSearchParams({ from: FROM_NAME, to: phone, message });
  const res = await fetch(ELKS_URL, {
    method:  'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await res.json();
  if (!res.ok || data.status === 'error') throw new Error(data.message || `46elks fel: ${res.status}`);
  return data;
}

export default async () => {
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_KEY;
  const elksUser = process.env.ELKS_API_USER;
  const elksPass = process.env.ELKS_API_PASSWORD;

  if (!supaUrl || !supaKey || !elksUser || !elksPass) {
    console.log('SMS_FALLBACK: Miljövariabler saknas — hoppar över');
    return new Response('skipped');
  }

  const cutoff = new Date(Date.now() - DELAY_MIN * 60 * 1000).toISOString();

  // Hämta kandidater
  const res = await fetch(
    `${supaUrl}/rest/v1/carts` +
    `?status=eq.waiting` +
    `&last_read_customer=is.null` +
    `&sms_sent_at=is.null` +
    `&customer_phone=not.is.null` +
    `&updated_at=lt.${cutoff}` +
    `&select=id,customer_name,customer_phone,cart_token,event_date`,
    {
      headers: {
        apikey:        supaKey,
        Authorization: `Bearer ${supaKey}`,
      },
    }
  );

  if (!res.ok) {
    console.error('SMS_FALLBACK: Supabase-fel', res.status);
    return new Response('error');
  }

  const carts = await res.json();
  console.log(`SMS_FALLBACK: ${carts.length} kandidat(er)`);

  let sent = 0;
  for (const cart of carts) {
    if (!cart.customer_phone || !cart.cart_token) continue;

    const name  = (cart.customer_name || '').split(' ')[0] || 'Hej';
    const url   = `https://scenkonsult.se/order/?cart=${cart.id}&token=${cart.cart_token}`;
    const msg   = `${name}! Din offert från Scenkonsult är klar. Se din order här: ${url}`;

    try {
      await sendSms(cart.customer_phone, msg, elksUser, elksPass);

      // Markera sms_sent_at
      await fetch(
        `${supaUrl}/rest/v1/carts?id=eq.${cart.id}`,
        {
          method:  'PATCH',
          headers: {
            apikey:          supaKey,
            Authorization:   `Bearer ${supaKey}`,
            'Content-Type':  'application/json',
            Prefer:          'return=minimal',
          },
          body: JSON.stringify({ sms_sent_at: new Date().toISOString() }),
        }
      );

      console.log(`SMS_FALLBACK: Skickat till ${cart.id} (${cart.customer_phone})`);
      sent++;
    } catch (e) {
      console.error(`SMS_FALLBACK: Fel för ${cart.id}:`, e.message);
    }
  }

  console.log(`SMS_FALLBACK: Klart — ${sent} av ${carts.length} skickade`);
  return new Response(`sent:${sent}`);
};

// Kör var 30:e minut
export const config = { schedule: '*/30 * * * *' };
