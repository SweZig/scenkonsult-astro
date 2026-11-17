// Sven-ärenden i Inkommen ska bära produkterna Sven [CART:]-taggat.
//
// Före 2026-11-17 skapade sven-chat kortet med items: [] när Sven lovade
// uppföljning, och FORWARD-knappen tog bara med taggar ur sitt eget svar.
// Eftersom Sven nästan alltid taggar produkterna i ett tidigare svar än
// löftet/FORWARD saknade de flesta kort produkter.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { svenCartIdsFrom, svenItemsFor } from '../src/lib/sven-products.mjs';
import { SVEN_PRODUKTER } from '../netlify/functions/_products-generated.mjs';

test('svenCartIdsFrom samlar taggar ur hela samtalet, utan dubbletter', () => {
  const msgs = [
    { role: 'user', content: 'scen?' },
    { role: 'assistant', content: 'Medium passar. [CART:scen-medium]' },
    { role: 'user', content: 'och ljud?' },
    { role: 'assistant', content: 'Ta dessa [CART:a, b]\nCHIPS: ["x"]' },
    { role: 'user', content: '[CART:fran-kunden]' },
  ];
  assert.deepEqual(svenCartIdsFrom(msgs, 'Jag skickar offert [CART:b,c]'),
    ['scen-medium', 'a', 'b', 'c']);
});

test('svenItemsFor slår upp namn och pris i registret och hoppar över okända', () => {
  const items = svenItemsFor(['scen-medium', 'finns-inte'], SVEN_PRODUKTER);
  assert.equal(items.length, 1);
  assert.equal(items[0].id, 'scen-medium');
  assert.equal(items[0].name, SVEN_PRODUKTER['scen-medium'].name);
  assert.ok(items[0].price > 0);
  assert.equal(items[0].qty, 1);
});

test('auto-skapat Sven-kort får produkterna från ett tidigare svar', async () => {
  process.env.ANTHROPIC_API_KEY = 'test';
  process.env.SUPABASE_URL = 'https://sb.test';
  process.env.SUPABASE_SERVICE_KEY = 'test';
  const anrop = [];
  const orig = globalThis.fetch;
  globalThis.fetch = async (url, opt = {}) => {
    anrop.push({ url: String(url), method: opt.method || 'GET', body: opt.body });
    if (String(url).includes('api.anthropic.com')) {
      return new Response(JSON.stringify({ content: [{ text: 'Toppen! Jag skickar en offert till dig.' }] }));
    }
    if (String(url).includes('/rest/v1/carts?sven_session_id')) return new Response('[]');
    return new Response('[]', { status: 201 });
  };
  try {
    const { default: handler } = await import('../netlify/functions/sven-chat.mjs');
    const res = await handler(new Request('https://x/api/sven-chat', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'testsess', customerType: 'company', pageUrl: '/',
        messages: [
          { role: 'user', content: 'Vi behöver en scen' },
          { role: 'assistant', content: 'Scenpaket Medium passar. [CART:scen-medium]' },
          { role: 'user', content: 'Kan du skicka offert? per@example.se' },
        ],
      }),
    }));
    assert.equal(res.status, 200);
    const skapad = anrop.find(a => a.method === 'POST' && /\/rest\/v1\/carts$/.test(a.url));
    assert.ok(skapad, 'inget kort skapades');
    const rad = JSON.parse(skapad.body);
    assert.deepEqual(rad.items.map(i => i.id), ['scen-medium']);
    assert.equal(rad.total_excl, SVEN_PRODUKTER['scen-medium'].price * 100);
  } finally {
    globalThis.fetch = orig;
  }
});

test('FORWARD-knappen tar med taggar från tidigare svar i samtalet', () => {
  const src = fs.readFileSync('public/sven-widget.src.js', 'utf8');
  const klick = src.slice(src.indexOf('closest(".sven-forward-btn")'));
  assert.match(klick.slice(0, 1500), /for \(const m of history\)/);
});
