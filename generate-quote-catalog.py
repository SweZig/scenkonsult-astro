#!/usr/bin/env python3
"""
Genererar src/data/quote-catalog.json och src/data/order-catalog-flat.json
Primärnyckel: artno (t.ex. SK-SCN-0002) — stabilt, mänskligt läsbart
Fallback: slug för bakåtkompatibilitet med äldre ordrar

Kategoristruktur:
  Scen | Scentillbehör | Ljud | Ljudtillbehör | Ljus | Ljustillbehör | DJ | Bild | Tjänster
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
def load(path): return json.load(open(os.path.join(BASE, 'src/data', path), encoding='utf-8'))

scenes = load('scenes.json')
ljud   = load('ljud.json')
ljus   = load('ljus.json')
bild   = load('bild.json')
dj     = load('dj.json')
frakt  = load('tjanster.json')

def prod(p, cat=None, item_type='product'):
    artno = p.get('artno','').strip()
    slug  = p.get('slug') or p.get('id','')
    return {
        'id':    artno or slug,
        'artno': artno,
        'slug':  slug,
        'name':  p['name'],
        'price': p['price'],
        'image': p.get('image',''),
        'desc':  p.get('description') or p.get('desc') or '',
        'type':  p.get('type', item_type),
    }

catalog = {}

# ── Scen ──────────────────────────────────────────────────────────────────────
catalog['Scen'] = {'products': [prod(p) for p in scenes.get('products', [])]}
catalog['Scentillbehör'] = {'products': [prod(p) for p in scenes.get('tillbehor', [])]}

# ── Ljud (paket + mixers) ─────────────────────────────────────────────────────
catalog['Ljud'] = {'sub': {
    'Portable': [prod(p) for p in ljud.get('portable',{}).get('products',[])],
    'Event':    [prod(p) for p in ljud.get('event',{}).get('products',[])],
    'Music':    [prod(p) for p in ljud.get('music',{}).get('products',[])],
    'Live':     [prod(p) for p in ljud.get('live',{}).get('products',[])],
    'Mixers':   [prod(p) for p in ljud.get('mixers',[])],
}}

# ── Ljudtillbehör (mikrofoner + kabel/tillbehör + el) ─────────────────────────
catalog['Ljudtillbehör'] = {'sub': {
    'Mikrofoner':       [prod(p) for p in ljud.get('mikrofoner',[])],
    'Kabel & tillbehör':[prod(p) for p in ljud.get('tillbehor_mikrofon',[])
                         if p.get('artno') or p.get('slug')],
    'Övriga tillbehör': [prod(p) for p in ljud.get('tillbehor_ljud',[])
                         if p.get('artno') or p.get('slug')],
    'El-tillbehör':     [prod(p) for p in ljud.get('tillbehor_el',[])
                         if p.get('artno') or p.get('slug')],
}}

# ── Ljus (paket + effekter) ───────────────────────────────────────────────────
catalog['Ljus'] = {'sub': {
    'Färdiga paket':  [prod(p) for p in ljus.get('paket',{}).get('products',[])],
    'Lösa effekter':  [prod(p) for p in ljus.get('effekter',{}).get('products',[])],
    'Rök & pyro':     [prod(p) for p in ljus.get('rok',{}).get('products',[])],
    'Stativ & tross': [prod(p) for p in ljus.get('stativ',{}).get('products',[])],
}}

# ── Ljustillbehör (dmx + stativ-tillbehör + rök-förbrukning + el) ─────────────
catalog['Ljustillbehör'] = {'sub': {
    'DMX-styrning':        [prod(p) for p in ljus.get('dmx',{}).get('tillbehor',[])
                            if p.get('artno') or p.get('slug')],
    'Stativ & fästen':     [prod(p) for p in ljus.get('stativ',{}).get('tillbehor',[])
                            if p.get('artno') or p.get('slug')],
    'Rök förbrukning':     [prod(p) for p in ljus.get('rok',{}).get('tillbehor',[])
                            if p.get('artno') or p.get('slug')],
    'El-tillbehör':        [prod(p) for p in ljus.get('el',[])
                            if p.get('artno') or p.get('slug')],
}}

# ── DJ ────────────────────────────────────────────────────────────────────────
eq = dj.get('equipment', [])
if isinstance(eq, dict): eq = list(eq.values())
dj_utr = [p for p in eq if p.get('type') != 'service']
dj_svc = [p for p in eq if p.get('type') == 'service']
catalog['DJ'] = {'products': [prod(p) for p in dj_utr]}
if dj_svc:
    catalog['DJ-tjänster'] = {'products': [prod(p) for p in dj_svc]}

# ── Bild (produkter + tillbehör) ──────────────────────────────────────────────
catalog['Bild'] = {'sub': {
    'Projektorer & skärmar': [prod(p) for p in bild.get('products',[])],
    'Tillbehör':             [prod(p) for p in bild.get('tillbehor',[])
                              if p.get('artno') or p.get('slug')],
}}

# ── Tjänster ──────────────────────────────────────────────────────────────────
def svc(id_, name, price, desc=''):
    return {'id': id_, 'artno': id_, 'slug': id_, 'name': name, 'price': price,
            'image': '', 'desc': desc, 'type': 'service'}

lev = frakt['leverans']
mon = frakt['montering']
catalog['Tjänster'] = {'products': [
    svc(lev['standard'].get('artno','lev-standard'),        lev['standard']['label'],   lev['standard']['pris']),
    svc(lev['skrymmande'].get('artno','lev-skrymmande'),    lev['skrymmande']['label'], lev['skrymmande']['pris']),
    svc(lev['lastbil'].get('artno','lev-lastbil'),          lev['lastbil']['label'],    lev['lastbil']['pris']),
    svc(lev.get('bakgavel',{}).get('artno','lev-bakgavel'),
        lev.get('bakgavel',{}).get('label','Lastbil med bakgavellift (t&r)'),
        lev.get('bakgavel',{}).get('pris',2998)),
    svc(mon.get('artno','SK-TJN-0001'), f"{mon['label']} (per tim)", mon['prisPerTimme'], mon.get('note','')),
    svc('SK-TJN-0003', 'Fakturaavgift', 49),
]}

# Tillägg-alias (bakåtkompatibilitet — quoteModal SVC_CATALOG_KEYS)
catalog['Tillägg'] = catalog['Tjänster']

catalog['Eigen rad'] = {'products': [
    {'id':'custom','artno':'','slug':'custom','name':'Ange benämning och pris →','price':0,
     'image':'','desc':'','type':'product','custom':True}
]}

# ── Spara quote-catalog.json ──────────────────────────────────────────────────
out_path = os.path.join(BASE, 'src/data/quote-catalog.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

# ── Bygg flat order-catalog ───────────────────────────────────────────────────
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
        if artno:
            order_catalog[artno] = entry
        if slug and slug != artno:
            order_catalog[slug] = entry

for cn, d in catalog.items():
    if cn in ('Tillägg', 'Eigen rad'): continue  # skip aliases
    if 'products' in d:
        add_flat(d['products'], cn)
    if 'sub' in d:
        for sn, sp in d['sub'].items():
            add_flat(sp, sn)

flat_path = os.path.join(BASE, 'src/data/order-catalog-flat.json')
with open(flat_path, 'w', encoding='utf-8') as f:
    json.dump(order_catalog, f, ensure_ascii=False, indent=2)

# ── Statistik ─────────────────────────────────────────────────────────────────
total = sum(
    len(v.get('products',[])) + sum(len(s) for s in v.get('sub',{}).values())
    for k,v in catalog.items() if k not in ('Tillägg','Eigen rad')
)
artno_keys   = [k for k in order_catalog if k.startswith('SK-') or k.startswith('lev-') or k.startswith('montering') or k.startswith('faktura')]
slug_aliases = [k for k in order_catalog if not (k.startswith('SK-') or k.startswith('lev-') or k.startswith('montering') or k.startswith('faktura'))]

print(f"✅ quote-catalog.json: {total} poster")
print(f"✅ order-catalog-flat.json: {len(artno_keys)} artno-nycklar + {len(slug_aliases)} slug-alias")
print("Kategorier:", [k for k in catalog if k not in ('Tillägg','Eigen rad')])

for check in ['SK-LJD-MIK-0016','SK-LJD-EL-0001','SK-LJS-EL-0001','SK-LJS-DMX-0001','SK-SCN-0002','SK-BLD-ACC-0003']:
    entry = order_catalog.get(check,{})
    print(f"   {check}: {entry.get('name','SAKNAS')} | cat={entry.get('catName','?')} | type={entry.get('type','?')}")
