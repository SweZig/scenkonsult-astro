// netlify/functions/admin-reminder-dismiss.js
// Markerar att admin har dismissat 48h-påminnelse-popupen för en cart.
// Cross-device-state: sparas i carts.admin_reminder_dismissed_until så
// samma popup inte dyker upp när admin loggar in på en annan device.
//
// POST /.netlify/functions/admin-reminder-dismiss
// Body: { cart_id, action: 'snooze_24h' | 'snooze_forever' }
// Headers: Authorization: Bearer <ADMIN_TOKEN>

'use strict';
const { supabase, isAdmin, ok, err, preflight, logAudit } = require('./_lib');

// Sentinel: långt framtida datum för "visa aldrig igen". Räcker väl
// tills SweZig pensionerar sig och inte längre kör admin-panelen.
const SENTINEL_FOREVER = '2099-12-31T23:59:59.000Z';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight();
  if (event.httpMethod !== 'POST') return err('Metod ej tillåten', 405);
  if (!isAdmin(event)) return err('Ej behörig', 401);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return err('Ogiltig JSON', 400);
  }

  const cartId = body.cart_id;
  const action = body.action;
  if (!cartId) return err('cart_id krävs', 400);
  if (!['snooze_24h', 'snooze_forever'].includes(action)) {
    return err('action måste vara snooze_24h eller snooze_forever', 400);
  }

  const dismissedUntil = action === 'snooze_forever'
    ? SENTINEL_FOREVER
    : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const db = supabase();

  try {
    await db.update('carts', {
      admin_reminder_dismissed_until: dismissedUntil,
    }, 'id', cartId);

    await logAudit(db, cartId, 'admin', 'reminder_dismissed', {
      action,
      until: dismissedUntil,
    });

    return ok({ ok: true, dismissed_until: dismissedUntil });
  } catch (e) {
    console.error('REMINDER_DISMISS_ERROR:', e.message);
    return err('Serverfel', 500);
  }
};
