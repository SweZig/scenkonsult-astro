#!/usr/bin/env python3
"""
Genererar src/data/quote-catalog.json och src/data/order-catalog-flat.json
från källfilerna. Kör: python3 generate-quote-catalog.py

Varje produkt får ett type-fält: "product" eller "service".
Detta fält följer med in i Supabase via items-arrayen och används
för att avgöra visning utan fragil kategori-strängmatchning.
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

def prod(p, cat=None, item_type='product'):
    out = {
        'id':    p.get('slug') or p.get('id', ''),
        'name':  p['name'],
        'price': p['price'],
        'artno': p.get('artno', ''),
        'image': p.get('image', ''),
        'desc':  p.get('description') or p.get('desc') or '',
        'type':  p.get('type', item_type),  # hämta från källan om satt, annars default
    }
    if cat:
        out['category'] = cat
    return out

catalog = {}

# ── Scen (products) ───────────────────────────────────────────────
catalog['Scen'] = {'products': [prod(p) for p in scenes.get('products', [])]}
catalog['Scen tillbehör'] = {'products': [prod(p) for p in scenes.get('tillbehor', [])]}

# ── Ljud (products) ───────────────────────────────────────────────
catalog['Ljud'] = {'sub': {
    'Portable':   [prod(p) for p in ljud.get('portable', {}).get('products', [])],
    'Event':      [prod(p) for p in ljud.get('event',    {}).get('products', [])],
    'Music':      [prod(p) for p in ljud.get('music',    {}).get('products', [])],
    'Live':       [prod(p) for p in ljud.get('live',     {}).get('products', [])],
    'Mixers':     [prod(p) for p in ljud.get('mixers', [])],
    'Mikrofoner': [prod(p) for p in ljud.get('tillbehor_mikrofon', [])
                   if p.get('slug') or p.get('id')],
    'El & kabel': [prod(p) for p in ljud.get('tillbehor_el', [])
                   if p.get('slug') or p.get('id')],
}}

# ── Ljus (products) ───────────────────────────────────────────────
catalog['Ljus'] = {'sub': {
    'Färdiga paket': [prod(p) for p in ljus.get('paket',    {}).get('products', [])],
    'Lösa effekter': [prod(p) for p in ljus.get('effekter', {}).get('products', [])],
    'Rök & pyro':    [prod(p) for p in ljus.get('rok',      {}).get('products', [])],
    'Stativ & tross':[prod(p) for p in ljus.get('stativ',   {}).get('products', [])],
}}

# ── Bild (products) ───────────────────────────────────────────────
catalog['Projektor & skärm']  = {'products': [prod(p) for p in bild.get('products', [])]}
catalog['Projektor tillbehör'] = {'products': [
    prod(p) for p in bild.get('tillbehor', []) if p.get('slug')
]}

# ── DJ (products) ─────────────────────────────────────────────────
catalog['DJ-utrustning'] = {'products': [prod(p) for p in dj.get('equipment', [])]}

# ── Tillägg (services) ────────────────────────────────────────────
lev  = frakt['leverans']
mon  = frakt['montering']
till = frakt.get('tillagg', [])

def svc(id_, name, price, desc=''):
    return {'id': id_, 'name': name, 'price': price, 'artno': '', 'image': '', 'desc': desc, 'type': 'service'}

tillagg = [
    svc(lev['standard']['id'],   lev['standard']['label'],   lev['standard']['pris']),
    svc(lev['skrymmande']['id'], lev['skrymmande']['label'], lev['skrymmande']['pris']),
    svc(lev['lastbil']['id'],    lev['lastbil']['label'],    lev['lastbil']['pris']),
    svc(lev['bakgavel']['id'],   lev['bakgavel']['label'],   lev['bakgavel']['pris']),
    svc('montering', f"{mon['label']} (per tim)", mon['prisPerTimme'], mon.get('note', '')),
]
for t in till:
    tillagg.append(svc(t['id'], t['label'] + (' (per tim)' if t.get('enhet') == '/tim' else ''), t['pris'], t.get('description', '')))
tillagg.append(svc('fakturaavgift-49', 'Fakturaavgift', 49))

catalog['Tillägg'] = {'products': tillagg}
catalog['Egen rad'] = {'products': [{'id': 'custom', 'name': 'Ange benämning och pris →', 'price': 0,
                                      'artno': '', 'image': '', 'desc': '', 'type': 'product', 'custom': True}]}

# ── Spara quote-catalog.json ──────────────────────────────────────
out_path = os.path.join(BASE, 'src/data/quote-catalog.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

# ── Bygg flat order-catalog (id → {desc, image, artno, catName, type}) ──
order_catalog = {}
def add_flat(prods, cat_name):
    for p in (prods or []):
        if not p.get('id'): continue
        order_catalog[p['id']] = {
            'desc':    p.get('desc', ''),
            'image':   p.get('image', ''),
            'artno':   p.get('artno', ''),
            'catName': cat_name,
            'type':    p.get('type', 'product'),
        }

for cn, d in catalog.items():
    if 'products' in d:
        add_flat(d['products'], cn)
    if 'sub' in d:
        for sn, sp in d['sub'].items():
            add_flat(sp, sn)

flat_path = os.path.join(BASE, 'src/data/order-catalog-flat.json')
with open(flat_path, 'w', encoding='utf-8') as f:
    json.dump(order_catalog, f, ensure_ascii=False, indent=2)

# Räkna och verifiera
total = sum(
    len(v.get('products', [])) + sum(len(s) for s in v.get('sub', {}).values())
    for v in catalog.values()
)
svc_count = sum(1 for v in order_catalog.values() if v.get('type') == 'service')
prod_count = sum(1 for v in order_catalog.values() if v.get('type') == 'product')
print(f"✅ quote-catalog.json — {total} poster")
print(f"✅ order-catalog-flat.json — {prod_count} produkter + {svc_count} tjänster")

# Stickprov
for check_id in ['montering', 'lev-standard', 'scen-small', 'scentrapp-40cm']:
    entry = order_catalog.get(check_id, {})
    print(f"   {check_id}: type={entry.get('type','?')} image={'✓' if entry.get('image') else '–'}")
