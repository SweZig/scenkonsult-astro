#!/usr/bin/env python3
"""
Genererar src/data/quote-catalog.json och src/data/order-catalog-flat.json
Primärnyckel: artno (t.ex. SK-SCN-0002) — stabilt, mänskligt läsbart
Fallback: slug för bakåtkompatibilitet med äldre ordrar

Kategoristruktur:
  Scen | Scentillbehör | Ljud | Ljudtillbehör | Ljus | Ljustillbehör | DJ | Bild | Tjänster

Datadriven från JSON (2026-04-27 v3):
  • Inga hårdkodade artno eller priser — allt läses från src/data/*.json
  • Tjänster strukturerade i undergrupper: Personal | Foto/Video | DJ-spel |
    Leverans | Montering | Bokningsavgift
  • DJ-spel (SK-DJ-0009..0017) flyttat till Tjänster (matchar Excel-katalogen)
  • Tillägg-alias borttaget — Tjänster är ENDA tjänstekategorin
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
def load(p): return json.load(open(os.path.join(BASE, 'src/data', p), encoding='utf-8'))

scenes = load('scenes.json')
ljud   = load('ljud.json')
ljus   = load('ljus.json')
bild   = load('bild.json')
dj     = load('dj.json')
karaoke = load('karaoke.json')
frakt  = load('tjanster.json')
el     = load('el.json')

# El-tillbehör (konsoliderat i el.json 2026):
#   ingen 'categories'-flagga = visas på BÅDA (ljud + ljus)
#   categories=['ljud']       = endast Ljudtillbehör
#   categories=['ljus']       = endast Ljustillbehör
def _el_for(category):
    out = []
    for p in el.get('products', []):
        cats = p.get('categories')
        if not cats or category in cats:
            out.append(p)
    return out

# ── Generiska helpers ────────────────────────────────────────────────────────
def prod(p, item_type='product'):
    """Hyresprodukt-format (bil/scen/ljud-paket m.fl.)."""
    artno = (p.get('artno') or '').strip()
    slug  = p.get('slug') or p.get('id','')
    out = {
        'id':    artno or slug,
        'artno': artno,
        'slug':  slug,
        'name':  p['name'],
        'price': p['price'],
        'image': p.get('image',''),
        'desc':  p.get('description') or p.get('desc') or '',
        'type':  p.get('type', item_type),
    }
    # Extra-fält för modal-visning — passas igenom bara om de finns
    #   Scen:  tagline, size, dimensions, capacity, useCase, transport
    #   Ljud/ljus/dj/bild: persons, specs, monteringMin, manualUrl, bulky
    #   Ljus-effekter: volumePricing (volymrabatt)
    for k in ('tagline','size','dimensions','capacity','useCase','transport',
              'persons','specs','features',
              'monteringMin','manualUrl','bulky','volumePricing',
              'priceNote','section','linkedServices','cartSplit'):
        v = p.get(k)
        if v is not None and v != '' and v != [] and v != {}:
            out[k] = v
    return out

def svc_from_service(s):
    """Konvertera ett services-array-objekt (ljud/ljus/bild) till tjänsterad."""
    a = (s.get('artno') or '').strip()
    return {
        'id': a or s.get('slug',''), 'artno': a, 'slug': s.get('slug') or a,
        'name': s.get('name') or s.get('label') or '',
        'price': s.get('price') or s.get('pris') or 0,
        'image': s.get('image',''),
        'desc':  s.get('description') or s.get('desc') or s.get('note','') or '',
        'type':  'service',
    }

def svc_from_dict(d, label_key='label', price_key='pris'):
    """Konvertera ett dict-objekt (leverans/montering/avgift) till tjänsterad."""
    a = (d.get('artno') or '').strip()
    return {
        'id': a or d.get('id',''), 'artno': a, 'slug': d.get('id', a),
        'name': d.get(label_key,'') or d.get('name',''),
        'price': d.get(price_key, d.get('price', 0)),
        'image': '',
        'desc':  d.get('description','') or d.get('note',''),
        'type':  'service',
    }

catalog = {}

# ── Scen ──────────────────────────────────────────────────────────────────────
catalog['Scen'] = {'sub': {
    'Färdiga paket':        [prod(p) for p in scenes.get('products', [])],
    'Plattformsmoduler':    [prod(p) for p in scenes.get('modules', [])],
}}
catalog['Scentillbehör'] = {'products': [prod(p) for p in scenes.get('tillbehor', [])]}
catalog['Pipe & Drape'] = {'products': [prod(p) for p in scenes.get('pipeDrape', [])]}

# ── Ljud (paket + mixers) ─────────────────────────────────────────────────────
catalog['Ljud'] = {'sub': {
    'Portable': [prod(p) for p in ljud.get('portable',{}).get('products',[])],
    'Kolumnhögtalare (utan mik)': [prod(p) for p in ljud.get('kolumnNoMic',[])],
    'Event':    [prod(p) for p in ljud.get('event',{}).get('products',[])],
    'Music':    [prod(p) for p in ljud.get('music',{}).get('products',[])],
    'Live':     [prod(p) for p in ljud.get('live',{}).get('products',[])],
    'Line Array': [prod(p) for p in ljud.get('live',{}).get('lineArray',[])],
    'Mixers':   [prod(p) for p in ljud.get('mixers',[])],
}}

# ── Ljudtillbehör (mikrofoner + kabel/tillbehör + el) ─────────────────────────
catalog['Ljudtillbehör'] = {'sub': {
    'Mikrofoner':       [prod(p) for p in ljud.get('mikrofoner',[])],
    'Kabel & tillbehör':[prod(p) for p in ljud.get('tillbehor_mikrofon',[])
                         if p.get('artno') or p.get('slug')],
    'Övriga tillbehör': [prod(p) for p in ljud.get('tillbehor_ljud',[])
                         if p.get('artno') or p.get('slug')],
    'El-tillbehör':     [prod(p) for p in _el_for('ljud')
                         if p.get('artno') or p.get('slug')],
}}

# ── Ljus (paket + effekter) ───────────────────────────────────────────────────
catalog['Ljus'] = {'sub': {
    'Färdiga paket':  [prod(p) for p in ljus.get('paket',{}).get('products',[])],
    'Lösa effekter':  [prod(p) for p in ljus.get('effekter',{}).get('products',[])],
    'Rök & pyro':     [prod(p) for p in ljus.get('rok',{}).get('products',[])],
    'Stativ & tross': [prod(p) for p in ljus.get('stativ',{}).get('products',[])],
}}

# ── Ljustillbehör (DMX + stativ-tillbehör + rök-förbrukning + el) ─────────────
catalog['Ljustillbehör'] = {'sub': {
    'DMX-styrning':    [prod(p) for p in ljus.get('dmx',{}).get('tillbehor',[])
                        if p.get('artno') or p.get('slug')],
    'Stativ & fästen': [prod(p) for p in ljus.get('stativ',{}).get('tillbehor',[])
                        if p.get('artno') or p.get('slug')],
    'Rök förbrukning': [prod(p) for p in ljus.get('rok',{}).get('tillbehor',[])
                        if p.get('artno') or p.get('slug')],
    'El-tillbehör':    [prod(p) for p in _el_for('ljus')
                        if p.get('artno') or p.get('slug')],
}}

# ── DJ — utrustning + paket (DJ-spel klassas som Tjänster, läggs nedan) ───────
DJ_SVC_ARTNOS = {f'SK-DJ-{i:04d}' for i in range(9, 18)}  # SK-DJ-0009..0017
eq = dj.get('equipment', [])
if isinstance(eq, dict): eq = list(eq.values())
dj_utr = [p for p in eq if p.get('type') != 'service' and p.get('artno','') not in DJ_SVC_ARTNOS]
dj_svc_eq = [p for p in eq if p.get('type') == 'service' or p.get('artno','') in DJ_SVC_ARTNOS]
catalog['DJ'] = {'sub': {
    'DJ-utrustning':   [prod(p) for p in dj_utr],
    'DJ-paket':        [prod(p) for p in dj.get('packages', [])],
}}

# ── Karaoke (paket) ───────────────────────────────────────────────────────────
catalog['Karaoke'] = {'sub': {
    'Karaokepaket':    [prod(p) for p in karaoke.get('packages', [])],
}}

# ── Bild (produkter + dukar + tillbehör; services hamnar under Tjänster) ─────
def split_entries(products):
    """Emittera cartSplit-rader som egna katalog-entries (parent-länkade).
    Används så admin känner igen artno:na när orders med split-rader kommer in
    från sajten, och kan plocka samma rader manuellt för att replikera offerten."""
    out = []
    for p in products:
        splits = p.get('cartSplit') or []
        if not splits: continue
        parent_artno = (p.get('artno') or '').strip()
        parent_name = p.get('name','')
        for sp in splits:
            artno = (sp.get('artno') or '').strip()
            if not artno: continue
            out.append({
                'id': artno, 'artno': artno,
                'name': sp.get('name',''),
                'price': sp.get('price',0),
                'qty': sp.get('qty',1),
                'image': sp.get('image') or p.get('image',''),
                'desc': f'Komponent i {parent_name} ({parent_artno}). '
                        f'Lägg in tillsammans med övriga komponentrader + leverans + montering '
                        f'för att replikera kundvarukorgen.',
                'type': 'product',
                'parent': parent_artno,
                'priceNote': '/dygn',
            })
    return out

catalog['Bild'] = {'sub': {
    'Projektorer & skärmar': [prod(p) for p in bild.get('products',[])],
    'Paketkomponenter':      split_entries(bild.get('products',[])),
    'Projektordukar':        [prod(p) for p in bild.get('dukar',[])
                              if p.get('artno') or p.get('slug')],
    'Tillbehör':             [prod(p) for p in bild.get('tillbehor',[])
                              if p.get('artno') or p.get('slug')],
}}

# ── Tjänster (DATADRIVEN, strukturerad i undergrupper) ────────────────────────
seen_svc = set()
def take(rows):
    """Filtrera bort dubbletter på artno när vi bygger tjänstegrupperna."""
    out = []
    for r in rows:
        a = r['artno']
        if a and a not in seen_svc:
            seen_svc.add(a)
            out.append(r)
    return out

# Personal — services från tjanster.json.services (centraliserat efter konsolidering)
# Filtrera på 'ljud' eller 'ljus' i categories[]
personal = []
for s in frakt.get('services', []):
    cats = s.get('categories', [])
    if 'ljud' in cats or 'ljus' in cats:
        personal.append(svc_from_service(s))
# Lägg också till tillagg (legacy fallback — tjanster.json.tillagg används av varukorgens
# checkbox-UI, har egen struktur). SK-TJN-0002 finns redan i services ovan men tillagg
# kan ha andra poster i framtiden.
for t in frakt.get('tillagg', []):
    artno = t.get('artno','').strip()
    if artno and artno not in {p.get('artno','') for p in personal}:
        personal.append({
            'id': artno, 'artno': artno,
            'slug': t.get('id', artno),
            'name': t.get('label',''),
            'price': t.get('pris', 0), 'image': '',
            'desc': t.get('description',''),
            'type': 'service',
        })
personal = take(personal)

# Foto/Video — services med 'bild' i categories[]
foto_video = take([svc_from_service(s) for s in frakt.get('services', []) if 'bild' in s.get('categories', [])])

# DJ-spel — equipment-rader markerade som tjänster
dj_spel = take([svc_from_service(p) for p in dj_svc_eq])

# Leverans — alla huvudalternativ + enkelresor från tjanster.leverans
leverans = []
for key, item in frakt.get('leverans', {}).items():
    if not isinstance(item, dict) or not item.get('artno'):
        continue
    leverans.append(svc_from_dict(item))
    enkel = item.get('enkel')
    if isinstance(enkel, dict) and enkel.get('artno'):
        leverans.append(svc_from_dict(enkel))
leverans = take(leverans)

# Montering
montering = []
mon = frakt.get('montering', {})
if mon.get('artno'):
    montering.append({
        'id': mon['artno'], 'artno': mon['artno'].strip(), 'slug': mon['artno'],
        'name': f"{mon.get('label','Montering')} (per tim)",
        'price': mon.get('prisPerTimme', 0), 'image': '',
        'desc': mon.get('note',''), 'type': 'service',
    })
montering = take(montering)

# Bokningsavgift — alla options
bokningsavgift = []
fa = frakt.get('fakturaavgift', {})
for opt in fa.get('options', []):
    if not opt.get('artno'):
        continue
    bokningsavgift.append({
        'id': opt['artno'], 'artno': opt['artno'].strip(),
        'slug': opt.get('id', opt['artno']),
        'name': opt.get('label',''),
        'price': opt.get('pris', 0), 'image': '',
        'desc': fa.get('description',''),
        'type': 'service',
    })
bokningsavgift = take(bokningsavgift)

catalog['Tjänster'] = {'sub': {
    'Personal':       personal,
    'Foto/Video':     foto_video,
    'DJ-spel':        dj_spel,
    'Leverans':       leverans,
    'Montering':      montering,
    'Bokningsavgift': bokningsavgift,
}}

# ── Egen rad (custom-row för admin-quote) ─────────────────────────────────────
catalog['Egen rad'] = {'products': [
    {'id':'custom','artno':'','slug':'custom','name':'Ange benämning och pris →',
     'price':0,'image':'','desc':'','type':'product','custom':True}
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
        # Passa igenom extra-fält för modal-visning på ordersidan
        for k in ('tagline','size','dimensions','capacity','useCase','transport',
                  'persons','specs','features',
                  'monteringMin','manualUrl','bulky','volumePricing',
                  'priceNote','section'):
            v = p.get(k)
            if v is not None and v != '' and v != [] and v != {}:
                entry[k] = v
        if artno:
            order_catalog[artno] = entry
        if slug and slug != artno:
            order_catalog[slug] = entry

for cn, d in catalog.items():
    if cn == 'Egen rad': continue
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
    for k,v in catalog.items() if k != 'Egen rad'
)
artno_keys = [k for k in order_catalog if k.startswith('SK-')]
slug_aliases = [k for k in order_catalog if not k.startswith('SK-')]

print(f"✅ quote-catalog.json: {total} poster")
print(f"✅ order-catalog-flat.json: {len(artno_keys)} artno-nycklar + {len(slug_aliases)} slug-alias")
print()
print("Kategoristruktur:")
for cn, d in catalog.items():
    if cn == 'Egen rad': continue
    if 'products' in d:
        print(f"  {cn}: {len(d['products'])} produkter")
    if 'sub' in d:
        print(f"  {cn}:")
        for sn, sp in d['sub'].items():
            print(f"    └─ {sn}: {len(sp)}")

# Verifiera tidigare saknade artno
print("\n🔎 Verifiering — tidigare saknade artno i admin:")
for check in ['SK-LJD-TJN-0001','SK-TJN-0002','SK-BLD-TJN-0001','SK-BLD-TJN-0002',
              'SK-BLD-TJN-0003','SK-BLD-TJN-0004','SK-LEV-0005','SK-LEV-0005-E',
              'SK-LEV-0006','SK-LEV-0006-E','SK-TJN-0003-49','SK-DJ-0010']:
    e = order_catalog.get(check, {})
    print(f"   {check:18}  {e.get('name','SAKNAS'):50}  cat={e.get('catName','?')}")
