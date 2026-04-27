#!/usr/bin/env python3
"""
Genererar src/data/quote-catalog.json och src/data/order-catalog-flat.json
Primärnyckel: artno (t.ex. SK-SCN-0002) — stabilt, mänskligt läsbart
Fallback: slug för bakåtkompatibilitet med äldre ordrar

Kategoristruktur:
  Scen | Scentillbehör | Ljud | Ljudtillbehör | Ljus | Ljustillbehör | DJ | Bild | Tjänster

Ändringar v2 (2026-04-27):
  • Datadriven Tjänster-sektion — läser från JSON-filerna istället för hårdkodning
  • Plockar upp services-arrays från ljud.json, ljus.json, bild.json
  • Plockar upp tillagg-arrayen från tjanster.json
  • Plockar upp ALLA leveransalternativ + enkelresor från tjanster.leverans
  • Plockar upp ALLA fakturaavgift-options (SK-TJN-0003-0/29/49)
  • DJ-tjänster (SK-DJ-0009..0017) flyttade till Tjänster-kategorin
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

# ── DJ-utrustning (paket + controllers + bord, EXKL DJ-spel som är tjänster) ──
eq = dj.get('equipment', [])
if isinstance(eq, dict): eq = list(eq.values())
DJ_SVC_PREFIXES = ('SK-DJ-0009','SK-DJ-0010','SK-DJ-0011',
                   'SK-DJ-0012','SK-DJ-0013','SK-DJ-0014',
                   'SK-DJ-0015','SK-DJ-0016','SK-DJ-0017')
dj_utr = [p for p in eq if p.get('type') != 'service'
                       and not (p.get('artno','') in DJ_SVC_PREFIXES)]
dj_svc_eq = [p for p in eq if p.get('type') == 'service'
                          or p.get('artno','') in DJ_SVC_PREFIXES]
catalog['DJ'] = {'products': [prod(p) for p in dj_utr]}
# DJ-paketen (SK-DJ-PAK-*) ligger redan i equipment och hamnar under DJ ovan

# ── Bild (produkter + tillbehör) ──────────────────────────────────────────────
catalog['Bild'] = {'sub': {
    'Projektorer & skärmar': [prod(p) for p in bild.get('products',[])],
    'Tillbehör':             [prod(p) for p in bild.get('tillbehor',[])
                              if p.get('artno') or p.get('slug')],
}}

# ── Tjänster (DATADRIVEN — läses från tjanster.json + services-arrays) ────────
def svc(p):
    """Konvertera ett tjänste-objekt till quote-catalog-format."""
    artno = (p.get('artno') or '').strip()
    return {
        'id':    artno or p.get('id') or p.get('slug',''),
        'artno': artno,
        'slug':  p.get('slug') or artno,
        'name':  p.get('name') or p.get('label') or '',
        'price': p.get('price') or p.get('pris') or 0,
        'image': p.get('image',''),
        'desc':  p.get('description') or p.get('desc') or p.get('note','') or '',
        'type':  'service',
    }

tjanster_products = []

# 1) Personal — services från ljud.json + ljus.json (dedupliceras på artno)
seen_svc = set()
for src_file in (ljud, ljus):
    for s in src_file.get('services', []):
        a = (s.get('artno') or '').strip()
        if a and a not in seen_svc:
            seen_svc.add(a)
            tjanster_products.append(svc(s))

# 2) Foto/Video — services från bild.json
for s in bild.get('services', []):
    a = (s.get('artno') or '').strip()
    if a and a not in seen_svc:
        seen_svc.add(a)
        tjanster_products.append(svc(s))

# 3) DJ-spel — equipment-rader markerade som tjänster
for s in dj_svc_eq:
    a = (s.get('artno') or '').strip()
    if a and a not in seen_svc:
        seen_svc.add(a)
        tjanster_products.append(svc(s))

# 4) Leverans — alla huvudalternativ + enkelresor från tjanster.leverans
for key, item in frakt.get('leverans', {}).items():
    if not isinstance(item, dict) or not item.get('artno'):
        continue
    # Huvudalternativ (tur & retur)
    a = item['artno'].strip()
    if a not in seen_svc:
        seen_svc.add(a)
        tjanster_products.append({
            'id': a, 'artno': a, 'slug': item.get('id', a),
            'name': item.get('label',''),
            'price': item.get('pris', 0),
            'image': '',
            'desc': item.get('note',''),
            'type': 'service',
        })
    # Enkelresa-variant (om finns)
    enkel = item.get('enkel')
    if isinstance(enkel, dict) and enkel.get('artno'):
        ae = enkel['artno'].strip()
        if ae not in seen_svc:
            seen_svc.add(ae)
            tjanster_products.append({
                'id': ae, 'artno': ae, 'slug': enkel.get('id', ae),
                'name': enkel.get('label',''),
                'price': enkel.get('pris', 0),
                'image': '',
                'desc': enkel.get('note',''),
                'type': 'service',
            })

# 5) Tillägg — t.ex. SK-TJN-0002 Tekniker
for t in frakt.get('tillagg', []):
    if not t.get('artno'):
        continue
    a = t['artno'].strip()
    if a in seen_svc:
        continue
    seen_svc.add(a)
    tjanster_products.append({
        'id': a, 'artno': a, 'slug': t.get('id', a),
        'name': t.get('label',''),
        'price': t.get('pris', 0),
        'image': '',
        'desc': t.get('description',''),
        'type': 'service',
    })

# 6) Montering
mon = frakt.get('montering', {})
if mon.get('artno'):
    a = mon['artno'].strip()
    if a not in seen_svc:
        seen_svc.add(a)
        tjanster_products.append({
            'id': a, 'artno': a, 'slug': a,
            'name': f"{mon.get('label','Montering')} (per tim)",
            'price': mon.get('prisPerTimme', 0),
            'image': '',
            'desc': mon.get('note',''),
            'type': 'service',
        })

# 7) Bokningsavgift — alla options
fa = frakt.get('fakturaavgift', {})
for opt in fa.get('options', []):
    if not opt.get('artno'):
        continue
    a = opt['artno'].strip()
    if a in seen_svc:
        continue
    seen_svc.add(a)
    tjanster_products.append({
        'id': a, 'artno': a, 'slug': opt.get('id', a),
        'name': opt.get('label',''),
        'price': opt.get('pris', 0),
        'image': '',
        'desc': fa.get('description',''),
        'type': 'service',
    })

catalog['Tjänster'] = {'products': tjanster_products}

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
print(f"   Tjänster: {len(catalog['Tjänster']['products'])} st")

# Verifiera tidigare saknade artno
print("\n🔎 Verifiering — tidigare saknade artno:")
for check in ['SK-LJD-TJN-0001','SK-TJN-0002','SK-BLD-TJN-0001','SK-BLD-TJN-0002',
              'SK-BLD-TJN-0003','SK-BLD-TJN-0004','SK-LEV-0005','SK-LEV-0005-E',
              'SK-LEV-0006','SK-LEV-0006-E','SK-TJN-0003-49','SK-DJ-0010']:
    entry = order_catalog.get(check,{})
    name = entry.get('name','SAKNAS')
    print(f"   {check}: {name} | cat={entry.get('catName','?')}")

# Sanity-check oförändrade artno
print("\n🔎 Sanity check — oförändrade artno:")
for check in ['SK-LJD-MIK-0016','SK-LJD-EL-0001','SK-LJS-EL-0001','SK-LJS-DMX-0001','SK-SCN-0002','SK-BLD-ACC-0003']:
    entry = order_catalog.get(check,{})
    print(f"   {check}: {entry.get('name','SAKNAS')} | cat={entry.get('catName','?')} | type={entry.get('type','?')}")
