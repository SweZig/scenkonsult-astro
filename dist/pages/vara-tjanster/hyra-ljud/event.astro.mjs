/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { l as ljudData, $ as $$Layout } from '../../../chunks/Layout_DH83owMh.mjs';
import { $ as $$CategoryHero } from '../../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ProductCard } from '../../../chunks/ProductCard_DdneY1u2.mjs';
import { $ as $$ElTillbehorCard } from '../../../chunks/ElTillbehorCard_cwYlohNI.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const _artnoAliases = {
    "XLR Multikabel 15 m, 6 kan.": "SK-LJD-MIK-0014",
    "XLR Multikabel 25 m, 8 kan.": "SK-LJD-MIK-0015",
    "XLR Multikabel 15 m, 24+8 kan.": "SK-LJD-MIK-0020",
    "Instrumentmikrofon, bl\xE5s": "SK-LJD-MIK-0008",
    "Instrumentmikrofoner, slagverk": "SK-LJD-MIK-0019",
    "Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 mik": "SK-LJD-MIK-0026",
    "Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 myggmikrofon": "SK-LJD-MIK-0027",
    "XLR-kablar": "SK-LJD-MIK-0002",
    "Bluetooth-mottagare pro": "SK-LJD-MIK-0011",
    "Tr\xE5dl\xF6st mikrofonset 8 kan.": "SK-LJD-MIK-0030",
    "Tr\xE5dl\xF6st IEM": "SK-LJD-MIK-0018",
    // El-tillbehör förkortade namn
    "Grenuttag 1,5 m": "SK-LJD-EL-0001",
    "F\xF6rl\xE4ngning 10 m": "SK-LJD-EL-0002",
    "Grenuttag p\xE5 rulle 10 m": "SK-LJD-EL-0003",
    "Grenuttag p\xE5 rulle 25 m": "SK-LJD-EL-0004",
    "F\xF6rl\xE4ngning 3-fas 16A": "SK-LJD-EL-0005",
    "F\xF6rl\xE4ngning 3-fas 20 m 16A": "SK-LJD-EL-0005",
    "F\xF6rl\xE4ngning 3-fas 20 m 32A": "SK-LJD-EL-0006",
    "F\xF6rl\xE4ngning 3-fas 32A": "SK-LJD-EL-0006",
    "Str\xF6momvandlare 3-fas\u21921-fas": "SK-LJD-EL-0007",
    "Str\xF6momvandlare 3-fas>1-fas": "SK-LJD-EL-0007",
    "\xD6verk\xF6rningsskydd 1 m": "SK-LJD-EL-0008",
    "Elgenerator 2 200 W": "SK-LJD-EL-0010",
    "Elgenerator 7 700 W": "SK-LJD-EL-0011",
    "Regnskydd till h\xF6gtalare": "SK-LJD-EL-0009",
    "Elgenerator 7700W": "SK-LJD-EL-0011",
    "Elgenerator, 2200W": "SK-LJD-EL-0010"
  };
  const artnoByName = { ..._artnoAliases, ...Object.fromEntries(
    [...ljudData.tillbehor_mikrofon || [], ...ljudData.tillbehor_el || [], ...ljudData.mixers || []].filter((p) => p.artno).map((p) => [p.name, p.artno])
  ) };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra PA-system f\xF6r Event & Konferens Stockholm | Scenkonsult", "description": "Hyr PA-system f\xF6r konferenser, galor och presentationer i Stockholm fr\xE5n 799 kr/dygn. Plug & play med fullrange h\xF6gtalarenheter p\xE5 stativ \u2013 ingen tekniker kr\xE4vs. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Ljud f\xF6r Event & Konferens", "h1Accent": "Stockholm", "intro": "Hyr PA-system f\xF6r konferens, gala och f\xF6retagsevent i Stockholm. Plug & play-paket med fullrange h\xF6gtalarenheter p\xE5 stativ \u2013 ingen tekniker kr\xE4vs. Komplettera med mixerbord, tr\xE5dl\xF6sa mikrofoner och el-tillbeh\xF6r nedan.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljud", href: "/vara-tjanster/hyra-ljud/" },
    { label: "Event & Konferens" }
  ], "badges": [
    "Plug & play",
    "Mikrofoner & mixer hyrs separat",
    "Ingen tekniker kr\xE4vs",
    "Leverans i Storstockholm"
  ], "priceFrom": 799 })}  ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-EVE-0001", "name": "Event, Small", "price": 799, "persons": "Upp till 100 personer", "image": "/images/ljud/pp_ljud_event_small.png", "description": "Passar f\xF6r tal, s\xE5ng och bakgrundsmusik f\xF6r grupper upp till 100 personer. Tv\xE5 kompakta Alto 10\u2033 fullrange h\xF6gtalarenheter p\xE5 stativ. Kopplas in i vanliga eluttag. Montering 10\u201315 min.", "specs": ["10\u2033/1,4\u2033 aktiva element", "2 000 W peak / 1 000 W RMS", "Max 130 dB", "48\u201320 000 Hz", "Samlad vikt: 25 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-EVE-0003", "name": "Event, Medium", "price": 1199, "persons": "Upp till 180 personer", "image": "/images/ljud/pp_ljud-event_medium.png", "description": "Tv\xE5 Alto 12\u2033 fullrange h\xF6gtalarenheter p\xE5 stativ. Kraftfullare bas och r\xE4ckvidd \xE4n 10\u2033-systemet. Montering 10\u201315 min.", "specs": ["12\u2033/1,4\u2033 aktiva element", "2 500 W peak / 1 250 W RMS", "Max 130 dB", "48\u201320 000 Hz", "Samlad vikt: 34 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-EVE-0002", "name": "Event, Small+", "price": 1599, "persons": "Upp till 240 personer", "image": "/images/ljud/pp_ljud_event_small_.png", "description": "Fyra Alto 10\u2033 fullrange h\xF6gtalarenheter f\xF6r upp till 240 personer. Bredare ljudbild med fyra enheter. Montering 20\u201325 min.", "specs": ["10\u2033/1,4\u2033 aktiva element", "2 000 W peak / 1 000 W RMS", "Max 130 dB", "48\u201320 000 Hz", "Samlad vikt: 54 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-EVE-0005", "name": "Event, Large", "price": 1599, "persons": "Upp till 280 personer", "image": "/images/ljud/pp_ljud_event_large2.png", "description": "Tv\xE5 Alto 15\u2033 fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 280 personer. Kraftfullt och tydligt ljud. Montering 10\u201315 min.", "specs": ["15\u2033/1,4\u2033 aktiva element", "2 500 W peak / 1 250 W RMS", "Max 130 dB", "48\u201320 000 Hz", "Samlad vikt: 39 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-EVE-0004", "name": "Event, Medium+", "price": 2399, "persons": "Upp till 380 personer", "image": "/images/ljud/pp_ljud_event_medium-.png", "description": "Fyra Alto 12\u2033 fullrange h\xF6gtalarenheter f\xF6r upp till 380 personer. Montering 20\u201325 min.", "specs": ["12\u2033/1,4\u2033 aktiva element", "2 500 W peak / 1 250 W RMS", "Max 130 dB", "62\u201320 000 Hz", "Samlad vikt: 62 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-EVE-0006", "name": "Event, Large+", "price": 3199, "persons": "Upp till 560 personer", "image": "/images/ljud/pp_ljud_event_large_.png", "description": "Fyra Alto 15\u2033 fullrange h\xF6gtalarenheter f\xF6r upp till 560 personer. Montering 20\u201325 min.", "specs": ["15\u2033/1,4\u2033 aktiva element", "2 500 W peak / 1 250 W RMS", "Max 130 dB", "48\u201320 000 Hz", "Samlad vikt: 78 kg"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-2 border-b border-white/10 pb-3">Mixerbord</h2> <p class="text-gray-400 mb-8 text-sm">Koppla in mikrofoner och musikspelare. Mixerbord hyrs separat och ansluts till högtalarpaket.</p> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0001", "name": "Analogt mixerbord, 2+2 kanaler", "price": 159, "image": "/images/ljud/pp_ljud_mixer01.png", "description": "Kompakt Alto-mixer med 2 mic-kanaler och 2 stereokanaler. Inbyggd Bluetooth. Passar till Event Small/Small+.", "specs": ["2 mic/line (XLR + 6,3 mm)", "2 stereo (RCA + 6,3 mm)", "Bluetooth", "Fantommatning 48V", "Vikt: 1,4 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0002", "name": "Analogt mixerbord, 4+2 kanaler", "price": 199, "image": "/images/ljud/pp_ljud_mixer02.png", "description": "Alto-mixer med 4 mic-kanaler, 2 stereokanaler, inbyggda effekter och Bluetooth.", "specs": ["4 mic/line (XLR + 6,3 mm)", "2 stereo (RCA + 6,3 mm)", "Inbyggda effekter + Bluetooth", "Fantommatning 48V", "Vikt: 2 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0003", "name": "Analogt mixerbord, 4+1 kanaler", "price": 249, "image": "/images/ljud/pp_ljud_mixer-vibz8dc.png", "description": "LD System Vibz8dc med 4 mic-kanaler, 2 stereokanaler och inbyggd kompressor p\xE5 kanal 1 & 2.", "specs": ["4 mic/line (XLR + 6,3 mm)", "Digital effektprocessor + kompressor", "Fantommatning 48V", "Vikt: 2,3 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0004", "name": "Analogt mixerbord, 4+4 kanaler", "price": 299, "image": "/images/ljud/pp_ljud_mixer03.png", "description": "Mackie-mixer med 4 mic och 4 stereokanaler. 60 dB gain. Levereras i transportv\xE4ska.", "specs": ["4 mic/line (XLR + 6,3 mm)", "4 stereo", "Preamp 60 dB", "Fantommatning 48V", "Vikt: 3 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0005", "name": "Analogt mixerbord, 6+4 kanaler", "price": 349, "image": "/images/ljud/pp_ljud_mixer04.png", "description": "Allen & Heath ZED14 \u2013 6 mic och 4 stereokanaler. 69 dB gain. Professionell mixer.", "specs": ["6 mic/line (XLR + 6,3 mm)", "4 stereo", "69 dB preamp gain", "Fantommatning 48V", "Vikt: 4,3 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0006", "name": "Analogt mixerbord, 12+4 kanaler", "price": 399, "image": "/images/ljud/pp_ljud_mixer05.png", "description": "Alto Live L16 med 12 mic-kanaler, 4 stereokanaler och 256 inbyggda effekter.", "specs": ["12 mic/line (XLR)", "4 stereo", "24-bit DSP, 256 effekter", "Fantommatning 48V", "Vikt: 6,8 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0007", "name": "Analogt mixerbord, 16+3 kanaler", "price": 599, "image": "/images/ljud/pp_ljud_mixer06.png", "description": "Allen & Heath ZED22FX \u2013 16 mic, 3 stereo, USB och high-pass filter. Toppmixer f\xF6r live.", "specs": ["16 mic/line (XLR)", "3 stereo", "USB-anslutning", "High-pass filter per kanal", "Vikt: 9 kg"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Mikrofoner &amp; tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { name: "H\xF6gtalarstativ Gravity", desc: "Max last 30 kg, vikt 3,7 kg", price: 40, img: "/images/ljud/pp_ljud_stativ-gravity.png" },
    { name: "H\xF6gtalarstativ K&M", desc: "Max last 30 kg, vikt 3,7 kg", price: 50, img: "/images/ljud/pp_ljud_stativ-km.png" },
    { name: "H\xF6gtalarstativ Gravity Premium", desc: "Max last 50 kg, vikt 6,4 kg", price: 60, img: "/images/ljud/pp_ljud_stativ-gravity-premium.png" },
    { name: "H\xF6gtalarstativ Gravity med vev", desc: "Max last 50 kg, vikt 9,1 kg", price: 120, img: "/images/ljud/pp_ljud_stativ-gravity-vev.png" },
    { name: "Mikrofonstativ", desc: "Justerbar h\xF6jd", price: 60, img: "/images/ljud/pp_ljud_tillbehor06.png" },
    { name: "XLR-kablar", desc: "1\u201315 m, fr 40 kr", price: 40, img: "/images/ljud/pp_ljud_tillbehor07.png" },
    { name: "Bluetooth-mottagare", desc: "Koppla in telefon/dator tr\xE5dl\xF6st", price: 100, img: "/images/ljud/pp_ljud_tillbehor04.png" },
    { name: "Bluetooth-mottagare pro", desc: "L\xE4ngre r\xE4ckvidd", price: 140, img: "/images/ljud/pp_ljud_tillbehor_BT-pro.png" },
    { name: "Instrumentmikrofon", desc: "F\xF6r trumma, bl\xE5s, gitarr", price: 64, img: "/images/ljud/pp_ljud_mik02.png" },
    { name: "Handmikrofon", desc: "Inkl 6 m XLR-kabel", price: 80, img: "/images/ljud/pp_ljud_mik01.png" },
    { name: "Tr\xE5dl\xF6s handmikrofon", desc: "Ca 30 m r\xE4ckvidd", price: 400, img: "/images/ljud/pp_ljud_mik05.png", specs: ["UHF tr\xE5dl\xF6s, ca 30 m r\xE4ckvidd", "Mottagarenhet ing\xE5r", "Kr\xE4ver AA-batteri", "Plug & play"] },
    { name: "Tr\xE5dl\xF6st headset", desc: "Ca 30 m r\xE4ckvidd", price: 480, img: "/images/ljud/pp_ljud_mik06.png", specs: ["UHF tr\xE5dl\xF6s, ca 30 m r\xE4ckvidd", "Bodypack + headset ing\xE5r", "Kr\xE4ver AA-batteri"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 mik", desc: "Digitalt, AES-256, 1\xD7 SM58-kapsel, ca 100 m", price: 699, img: "/images/ljud/pp_ljud_mik09.png", specs: ["Digitalt AES-256 krypterat", "SM58-kapsel (vokal)", "R\xE4ckvidd ca 100 m", "Auto-scan frekvens", "Rack-monterbar mottagare"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 myggmikrofon", desc: "Digitalt, AES-256, 1\xD7 bodypack + myggmik, ca 100 m", price: 699, img: "/images/ljud/pp_ljud_mik13.png", specs: ["Digitalt AES-256 krypterat", "Bodypack + myggmikrofon", "R\xE4ckvidd ca 100 m", "Auto-scan frekvens", "Rack-monterbar mottagare"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 headset", desc: "Digitalt, AES-256, 1\xD7 bodypack + headset, ca 100 m", price: 749, img: "/images/ljud/pp_ljud_mik12.png", specs: ["Digitalt AES-256 krypterat", "Bodypack + headset", "R\xE4ckvidd ca 100 m", "Auto-scan frekvens", "Rack-monterbar mottagare"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 l\xE5gprofil headset", desc: "Digitalt, AES-256, 1\xD7 bodypack + \xF6ronh\xE4ngande headset, ca 100 m", price: 799, img: "/images/ljud/pp_ljud_mik14.png", specs: ["Digitalt AES-256 krypterat", "Bodypack + \xF6ronh\xE4ngande headset", "R\xE4ckvidd ca 100 m", "Diskret l\xE5gprofil-design"] },
    { name: "Effektrack med matrix & feedback-suppressor", desc: "5-zon ART-matrix + Klark Teknik DP1000", price: 1036, img: "/images/ljud/pp_ljud_effektrack.png", specs: ["5-zon ART-matrix", "Klark Teknik DP1000 feedback-suppressor", "F\xF6rhindrar rundg\xE5ng", 'Rack-monterat 19"'] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 mik", desc: "Digitalt, AES-256, 2\xD7 SM58, ca 100 m", price: 1299, img: "/images/ljud/pp_ljud_mik-shure-slxd4d.png", specs: ["Digitalt AES-256 krypterat", "2\xD7 SM58 handh\xE5llna mikrofoner", "Dual-channel mottagare", "R\xE4ckvidd ca 100 m"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 myggmikrofon", desc: "Digitalt, AES-256, 2\xD7 bodypack + myggmik, ca 100 m", price: 1299, img: "/images/ljud/pp_ljud_mik10.png", specs: ["Digitalt AES-256 krypterat", "2\xD7 bodypack + myggmikrofon", "Dual-channel mottagare", "R\xE4ckvidd ca 100 m"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 headset", desc: "Digitalt, AES-256, 2\xD7 bodypack + headset, ca 100 m", price: 1399, img: "/images/ljud/pp_ljud_mik08.png", specs: ["Digitalt AES-256 krypterat", "2\xD7 bodypack + headset", "Dual-channel mottagare", "R\xE4ckvidd ca 100 m"] },
    { name: "Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 l\xE5gprofil headset", desc: "Digitalt, AES-256, 2\xD7 bodypack + \xF6ronh\xE4ngande headset, ca 100 m", price: 1499, img: "/images/ljud/pp_ljud_mik11.png", specs: ["Digitalt AES-256 krypterat", "2\xD7 bodypack + l\xE5gprofil headset", "Dual-channel mottagare", "R\xE4ckvidd ca 100 m"] },
    { name: "Tr\xE5dl\xF6st mikrofonset 8 kan.", desc: "4 hand + 4 headset, antennsplitter", price: 3999, img: "/images/ljud/pp_ljud_tillbehor20.png", specs: ["4\xD7 handmikrofon + 4\xD7 headset", "Antennsplitter ing\xE5r", "823\u2013832 MHz band", "R\xE4ckvidd upp till 50 m", "8 oberoende kanaler"] }
  ].map((item) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": item.img, "name": item.name, "excl": item.price, "desc": item.desc, "category": "Ljud tillbeh\xF6r", "artno": artnoByName[item.name], "modal": item.price >= 400, "specs": item.specs ?? (item.desc ? [item.desc] : []) })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">El-tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { img: "/images/ljus/pp_el_grenuttag_sm.png", name: "Grenuttag 1,5 m", excl: 20, desc: "Jordat, 3\u20135 uttag, 16A" },
    { img: "/images/ljus/pp_el_forlangning.png", name: "F\xF6rl\xE4ngning 10 m", excl: 48, desc: "1-fas, 16A, IP44" },
    { img: "/images/ljus/pp_el_overloppsskydd.png", name: "\xD6verk\xF6rningsskydd 1 m", excl: 80, desc: "Kabelramp, 2 kanaler" },
    { img: "/images/ljus/pp_el_grenuttag_lg.png", name: "Grenuttag p\xE5 rulle 10 m", excl: 100, desc: "4 uttag, 16A, IP44" },
    { img: "/images/ljus/pp_el_grenuttag_25m.png", name: "Grenuttag p\xE5 rulle 25 m", excl: 159, desc: "4 uttag, 16A, IP44" },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 20 m 16A", excl: 236, desc: "3-fas, 16A, IP44" },
    { img: "/images/ljus/pp_el_omvandlare.png", name: "Str\xF6momvandlare 3-fas\u21921-fas", excl: 320, desc: "32A 3-fas till 1-fas uttag" },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 20 m 32A", excl: 396, desc: "3-fas, 32A, IP44" },
    { img: "/images/ljud/pp_ljud_tillbehor_elverk-small.png", name: "Elgenerator 2 200 W", excl: 799, desc: "1 900 W kontinuerlig, bensin 4-takt" },
    { img: "/images/ljud/pp_ljud_elverk-kipor.png", name: "Elgenerator 7 700 W", excl: 1799, desc: "7 000 W kontinuerlig, bensin 4-takt. Kipor IG6000." },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_1L.png", name: "Ackrylatbensin 1 l", excl: 59, desc: "Aspen 4 \xB7 4-taktsmotorer" },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_5L.png", name: "Ackrylatbensin 5 l", excl: 239, desc: "Aspen 4 \xB7 4-taktsmotorer" }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "El-tillbeh\xF6r", "artno": artnoByName[t.name] })}`)} </div> </section> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-ljud/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till hyra ljud</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> <a href="/kontakt/" class="border border-white/30 text-white hover:bg-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Fråga om offert</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljud/event/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljud/event/index.astro";
const $$url = "/vara-tjanster/hyra-ljud/event/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
