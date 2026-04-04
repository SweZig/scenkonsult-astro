#!/usr/bin/env python3
"""
Genererar src/data/quote-catalog.json från källfilerna.
Kör: python3 generate-quote-catalog.py
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
def load(path): return json.load(open(os.path.join(BASE, 'src/data', path), encoding='utf-8'))

scenes = load('scenes.json')
ljud   = load('ljud.json')
ljus   = load('ljus.json')
bild   = load('bild.json')
dj     = load('dj.json')
frakt  = load('frakt.json')

def prod(p, cat=None):
    return {
        'id':    p.get('slug') or p.get('id',''),
        'name':  p['name'],
        'price': p['price'],
        **(({'category': cat}) if cat else {}),
    }

catalog = {}

# ── Scen ──────────────────────────────────────────────────────────
catalog['Scen'] = {'products': [prod(p) for p in scenes.get('products', [])]}

catalog['Scen tillbehör'] = {'products': [prod(p) for p in scenes.get('tillbehor', [])]}

# ── Ljud ──────────────────────────────────────────────────────────
catalog['Ljud'] = {'sub': {
    'Portable': [prod(p) for p in ljud.get('portable', {}).get('products', [])],
    'Event':    [prod(p) for p in ljud.get('event',    {}).get('products', [])],
    'Music':    [prod(p) for p in ljud.get('music',    {}).get('products', [])],
    'Live':     [prod(p) for p in ljud.get('live',     {}).get('products', [])],
    'Mixers':   [prod(p) for p in ljud.get('mixers', [])],
    'Mikrofoner': [prod(p) for p in ljud.get('tillbehor_mikrofon', [])
                   if p.get('slug') or p.get('id')],
    'El & kabel': [prod(p) for p in ljud.get('tillbehor_el', [])
                   if p.get('slug') or p.get('id')],
}}

# ── Ljus ──────────────────────────────────────────────────────────
catalog['Ljus'] = {'sub': {
    'Färdiga paket': [prod(p) for p in ljus.get('paket', {}).get('products', [])],
    'Lösa effekter': [prod(p) for p in ljus.get('effekter', {}).get('products', [])],
    'Rök & pyro':    [prod(p) for p in ljus.get('rok',      {}).get('products', [])],
    'Stativ & tross':[prod(p) for p in ljus.get('stativ',   {}).get('products', [])],
}}

# ── Projektor & skärm ────────────────────────────────────────────
catalog['Projektor & skärm'] = {'products': [prod(p) for p in bild.get('products', [])]}
catalog['Projektor tillbehör'] = {'products': [
    prod(p) for p in bild.get('tillbehor', []) if p.get('slug')
]}

# ── DJ ───────────────────────────────────────────────────────────
catalog['DJ-utrustning'] = {'products': [prod(p) for p in dj.get('equipment', [])]}

# ── Tillägg (frakt + tjänster) ────────────────────────────────────
lev = frakt['leverans']
mon = frakt['montering']
till = frakt.get('tillagg', [])

tillagg_products = [
    {'id': lev['standard']['id'],   'name': lev['standard']['label'],   'price': lev['standard']['pris']},
    {'id': lev['skrymmande']['id'], 'name': lev['skrymmande']['label'], 'price': lev['skrymmande']['pris']},
    {'id': lev['lastbil']['id'],    'name': lev['lastbil']['label'],    'price': lev['lastbil']['pris']},
    {'id': lev['bakgavel']['id'],   'name': lev['bakgavel']['label'],   'price': lev['bakgavel']['pris']},
    {'id': 'montering', 'name': f"{mon['label']} (per tim)", 'price': mon['prisPerTimme']},
]
for t in till:
    tillagg_products.append({'id': t['id'], 'name': t['label'] + (' (per tim)' if t.get('enhet') == '/tim' else ''), 'price': t['pris']})
tillagg_products.append({'id': 'fakturaavgift-49', 'name': 'Fakturaavgift', 'price': 49})

catalog['Tillägg'] = {'products': tillagg_products}

# Fri rad
catalog['Egen rad'] = {'products': [{'id': 'custom', 'name': 'Ange benämning och pris →', 'price': 0, 'custom': True}]}

out_path = os.path.join(BASE, 'src/data/quote-catalog.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

# Räkna produkter
total = sum(
    len(v.get('products', [])) + sum(len(s) for s in v.get('sub', {}).values())
    for v in catalog.values()
)
print(f"✅ quote-catalog.json genererad — {total} produkter/tjänster")
for cat, data in catalog.items():
    n = len(data.get('products', [])) + sum(len(s) for s in data.get('sub', {}).values())
    print(f"   {cat}: {n} st")
