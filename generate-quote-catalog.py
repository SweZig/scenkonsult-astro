#!/usr/bin/env python3
"""
Genererar src/data/quote-catalog.json och src/data/order-catalog-flat.json
Primärnyckel: artno (t.ex. SK-SCN-0002) — stabilt, mänskligt läsbart
Fallback: slug för bakåtkompatibilitet med äldre ordrar
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
    # artno är primärnyckel; slug/id som fallback
    artno = p.get('artno','').strip()
    slug  = p.get('slug') or p.get('id','')
    return {
        'id':    artno or slug,   # artno om det finns, annars slug
        'artno': artno,
        'slug':  slug,
        'name':  p['name'],
        'price': p['price'],
        'image': p.get('image',''),
        'desc':  p.get('description') or p.get('desc') or '',
        'type':  p.get('type', item_type),
    }

catalog = {}

# ── Scen ─────────────────────────────────────────────────────────────────────
catalog['Scen'] = {'products': [prod(p) for p in scenes.get('products', [])]}
catalog['Scen tillbehör'] = {'products': [prod(p) for p in scenes.get('tillbehor', [])]}

# ── Ljud ─────────────────────────────────────────────────────────────────────
catalog['Ljud'] = {'sub': {
    'Portable':   [prod(p) for p in ljud.get('portable',{}).get('products',[])],
    'Event':      [prod(p) for p in ljud.get('event',{}).get('products',[])],
    'Music':      [prod(p) for p in ljud.get('music',{}).get('products',[])],
    'Live':       [prod(p) for p in ljud.get('live',{}).get('products',[])],
    'Mixers':     [prod(p) for p in ljud.get('mixers',[])],
    'Mikrofoner': [prod(p) for p in ljud.get('tillbehor_mikrofon',[]) if p.get('artno') or p.get('slug')],
    'El & kabel': [prod(p) for p in ljud.get('tillbehor_el',[]) if p.get('artno') or p.get('slug')],
}}

# ── Ljus ─────────────────────────────────────────────────────────────────────
catalog['Ljus'] = {'sub': {
    'Färdiga paket': [prod(p) for p in ljus.get('paket',{}).get('products',[])],
    'Lösa effekter': [prod(p) for p in ljus.get('effekter',{}).get('products',[])],
    'Rök & pyro':    [prod(p) for p in ljus.get('rok',{}).get('products',[])],
    'Stativ & tross':[prod(p) for p in ljus.get('stativ',{}).get('products',[])],
}}

# ── Bild ─────────────────────────────────────────────────────────────────────
catalog['Projektor & skärm']   = {'products': [prod(p) for p in bild.get('products',[])]}
catalog['Projektor tillbehör'] = {'products': [prod(p) for p in bild.get('tillbehor',[]) if p.get('artno') or p.get('slug')]}

# ── DJ ────────────────────────────────────────────────────────────────────────
eq = dj.get('equipment',{})
if isinstance(eq, dict): eq = list(eq.values())
catalog['DJ-utrustning'] = {'products': [prod(p) for p in eq]}

# ── Tillägg (tjänster) ────────────────────────────────────────────────────────
def svc(id_, name, price, desc=''):
    return {'id': id_, 'artno': id_, 'slug': id_, 'name': name, 'price': price,
            'image': '', 'desc': desc, 'type': 'service'}

lev  = frakt['leverans']
mon  = frakt['montering']
catalog['Tillägg'] = {'products': [
    svc(lev['standard'].get('artno','lev-standard'),      lev['standard']['label'],   lev['standard']['pris']),
    svc(lev['skrymmande'].get('artno','lev-skrymmande'),  lev['skrymmande']['label'], lev['skrymmande']['pris']),
    svc(lev['lastbil'].get('artno','lev-lastbil'),        lev['lastbil']['label'],    lev['lastbil']['pris']),
    svc(lev.get('bakgavel',{}).get('artno','lev-bakgavel'), lev.get('bakgavel',{}).get('label','Lastbil med bakgavellift (t&r)'), lev.get('bakgavel',{}).get('pris',2998)),
    svc('montering', f"{mon['label']} (per tim)", mon['prisPerTimme'], mon.get('note','')),
    svc('fakturaavgift-49', 'Fakturaavgift', 49),
]}
catalog['Egen rad'] = {'products': [
    {'id':'custom','artno':'','slug':'custom','name':'Ange benämning och pris →','price':0,'image':'','desc':'','type':'product','custom':True}
]}

# ── Spara quote-catalog.json ──────────────────────────────────────────────────
out_path = os.path.join(BASE, 'src/data/quote-catalog.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

# ── Bygg flat order-catalog ───────────────────────────────────────────────────
# Indexeras på artno PRIMÄRT, slug som alias
order_catalog = {}

def add_flat(prods, cat_name):
    for p in (prods or []):
        artno = (p.get('artno') or '').strip()
        slug  = p.get('slug','')
        if not artno and not slug: continue
        entry = {
            'desc':    p.get('desc',''),
            'image':   p.get('image',''),
            'artno':   artno,
            'slug':    slug,
            'name':    p.get('name',''),
            'catName': cat_name,
            'type':    p.get('type','product'),
        }
        # Primärnyckel: artno
        if artno:
            order_catalog[artno] = entry
        # Alias: slug → artno
        if slug and slug != artno:
            order_catalog[slug] = entry

for cn, d in catalog.items():
    if 'products' in d:
        add_flat(d['products'], cn)
    if 'sub' in d:
        for sn, sp in d['sub'].items():
            add_flat(sp, sn)

flat_path = os.path.join(BASE, 'src/data/order-catalog-flat.json')
with open(flat_path, 'w', encoding='utf-8') as f:
    json.dump(order_catalog, f, ensure_ascii=False, indent=2)

# Statistik
total = sum(
    len(v.get('products',[])) + sum(len(s) for s in v.get('sub',{}).values())
    for v in catalog.values()
)
artno_keys = [k for k in order_catalog if k.startswith('SK-') or k.startswith('lev-') or k.startswith('montering') or k.startswith('faktura')]
slug_aliases = [k for k in order_catalog if not (k.startswith('SK-') or k.startswith('lev-') or k.startswith('montering') or k.startswith('faktura'))]

print(f"✅ quote-catalog.json: {total} poster")
print(f"✅ order-catalog-flat.json: {len(artno_keys)} artno-nycklar + {len(slug_aliases)} slug-alias")

# Stickprov
for check in ['SK-LJD-MIK-0016','SK-SCN-0002','SK-BLD-ACC-0003','tradlos-handmikrofon','scen-small-plus']:
    entry = order_catalog.get(check,{})
    print(f"   {check}: image={'✓' if entry.get('image') else '–'} type={entry.get('type','?')} artno={entry.get('artno','?')}")
