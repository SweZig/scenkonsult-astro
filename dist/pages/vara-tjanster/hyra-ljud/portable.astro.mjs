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
    "F\xF6rl\xE4ngning 3-fas 32A": "SK-LJD-EL-0006",
    "F\xF6rl\xE4ngning 3-fas 20 m 32A": "SK-LJD-EL-0006",
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra Portabelt Ljud Stockholm \u2013 Batteridrivet PA-system | Scenkonsult", "description": "Hyr portabelt batteridrivet ljud i Stockholm fr\xE5n 599 kr/dygn. Kompakta kolumnsystem perfekta f\xF6r utomhus, studentflak och event utan str\xF6mk\xE4lla. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Portabelt Ljud", "h1Accent": "Stockholm", "intro": "Hyr batteridrivet portabelt ljud i Stockholm. Kompakta kolumnsystem som enkelt kan flyttas \u2013 flera modeller kr\xE4ver ingen str\xF6mk\xE4lla alls. Perfekt f\xF6r studentflak, gallerior, torg och utomhusbruk. Ju st\xF6rre paket, desto fler \xE5h\xF6rare n\xE5r du och basen \xF6kar markant.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljud", href: "/vara-tjanster/hyra-ljud/" },
    { label: "Portabelt ljud" }
  ], "badges": [
    "Batteridrivet",
    "Bluetooth & inbyggd mixer",
    "Ingen str\xF6mk\xE4lla kr\xE4vs",
    "Leverans i Storstockholm"
  ], "priceFrom": 599 })} ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4"> <div class="inline-flex items-center gap-2 bg-brand-navy border border-brand-orange/30 rounded-xl px-4 py-2.5"> <span class="text-brand-orange text-base">🎤</span> <span class="text-white text-sm font-medium">Handmikrofon ingår i alla paket</span> </div> </section> <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0001", "name": "Portable, Small", "price": 599, "persons": "20\u201360 personer", "image": "/images/ljud/pp_ljud_portable_small.png", "description": "Batteridrift 20+ timmar. Inbyggd mixer och Bluetooth. Perfekt f\xF6r studentflak, park-event och sm\xE5 utomhusevent. 6,5\u2033 element.", "specs": ["6,5\u2033/1\u2033 aktiva element", "200 W peak / 100 W RMS", "Batteridrift upp till 20 tim", "Bluetooth", "Vikt: 5,4 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0002", "name": "Portable, Small+", "price": 699, "persons": "40\u201380 personer", "image": "/images/ljud/pp_ljud_portable_small_.png", "description": "Batteridrift 7+ timmar. Inbyggd mixer och Bluetooth. 12\u2033 element f\xF6r kraftfullare ljud.", "specs": ["12\u2033/2\u2033 aktiva element", "600 W peak / 300 W RMS", "Batteridrift upp till 7 tim", "Bluetooth", "Vikt: 13,4 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0003", "name": "Portable, Medium", "price": 799, "persons": "40\u201380 personer", "image": "/images/ljud/pp_ljud_portable_medium.png", "description": "Alto TS108 C kolumnh\xF6gtalare. 8\u2033 bas och sex 2,75\u2033 diskant. Inbyggd mixer. Smal och snygg design.", "specs": ["8\u2033 bas + 6\xD72,75\u2033 element", "600 W peak / 300 W RMS", "Max 123 dB", "Bluetooth", "Vikt: 16 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0004", "name": "Portable, Medium+", "price": 999, "persons": "60\u2013100 personer", "image": "/images/ljud/pp_ljud_portable_medium_.png", "description": "Alto TS112 C kolumnh\xF6gtalare. 12\u2033 bas och \xE5tta 2,75\u2033 diskant. Inbyggd mixer.", "specs": ["12\u2033 bas + 8\xD72,75\u2033 element", "1 200 W peak / 600 W RMS", "Max 127 dB", "Bluetooth", "Vikt: 24,1 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0005", "name": "Portable, Small Duo", "price": 1099, "persons": "40\u201380 personer", "image": "/images/ljud/pp_ljud_portable_small_duo.png", "description": "Tv\xE5 batteridrivna 6,5\u2033 h\xF6gtalare p\xE5 stativ. Upp till 20 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ing\xE5r.", "specs": ["2\xD76,5\u2033/1\u2033 aktiva element", "400 W peak / 200 W RMS", "Batteridrift upp till 20 tim", "Bluetooth", "Vikt: 10,8 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0006", "name": "Portable, Large", "price": 1199, "persons": "80\u2013120 personer", "image": "/images/ljud/pp_ljud_portable_large.png", "description": "LD Systems Maui 28 G2. Tv\xE5 8\u2033 basar och 16 st 3\u2033 diskant. Kraftfullt och smidigt kolumnsystem.", "specs": ["2\xD78\u2033 bas + 16\xD73\u2033 diskant", "2 000 W peak / 1 000 W RMS", "Max 126 dB", "Bluetooth", "Vikt: 25,7 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0007", "name": "Portable, Small+ Duo", "price": 1299, "persons": "80\u2013120 personer", "image": "/images/ljud/pp_ljud_portable_small__duo.png", "description": "Tv\xE5 batteridrivna 12\u2033 h\xF6gtalare p\xE5 stativ. Upp till 7 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ing\xE5r.", "specs": ["2\xD712\u2033/2\u2033 aktiva element", "1 200 W peak / 600 W RMS", "Batteridrift upp till 7 tim", "Bluetooth", "Vikt: 26,8 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0008", "name": "Portable, Medium Duo", "price": 1499, "persons": "60\u2013100 personer", "image": "/images/ljud/pp_ljud_portable_medium_duo.png", "description": "Tv\xE5 Alto TS108 C kolumnh\xF6gtalare. 8\u2033 bas och sex 2,75\u2033 diskant. Inbyggd mixer. Smal och snygg design.", "specs": ["2\xD78\u2033 bas + 12\xD72,75\u2033 element", "1 200 W peak / 600 W RMS", "Max 124 dB", "Bluetooth", "Vikt: 32 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0009", "name": "Portable, Medium+ Duo", "price": 1899, "persons": "100\u2013200 personer", "image": "/images/ljud/pp_ljud_portable_medium_plus_duo.png", "description": "Tv\xE5 Alto TS112 C kolumnh\xF6gtalare. 12\u2033 bas och \xE5tta 2,75\u2033 diskant. Inbyggd mixer.", "specs": ["2\xD712\u2033 bas + 16\xD72,75\u2033 element", "2 400 W peak / 1 200 W RMS", "Max 129 dB", "Bluetooth", "Vikt: 48,2 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-POR-0011", "name": "Portable, Large Duo", "price": 2299, "persons": "100\u2013240 personer", "image": "/images/ljud/pp_ljud_portable_large_.png", "description": "Tv\xE5 LD Systems Maui 28 G2 kolumner. Fyra 8\u2033 basar och 32 st 3\u2033 diskant.", "specs": ["4\xD78\u2033 bas + 32\xD73\u2033 diskant", "4 000 W peak / 2 000 W RMS", "Max 126 dB", "Bluetooth", "Vikt: 51,4 kg"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-2 border-b border-white/10 pb-3">Mixerbord</h2> <p class="text-gray-400 mb-8 text-sm">Koppla in mikrofoner och musikspelare. Mixerbord hyrs separat och ansluts till högtalarpaket.</p> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0001", "name": "Analogt mixerbord, 2+2 kanaler", "price": 159, "image": "/images/ljud/pp_ljud_mixer01.png", "description": "Kompakt Alto-mixer med 2 mic-kanaler och 2 stereokanaler. Inbyggd Bluetooth. Passar till Portable Small/Small+.", "specs": ["2 mic/line (XLR + 6,3 mm)", "2 stereo (RCA + 6,3 mm)", "Bluetooth", "Fantommatning 48V", "Vikt: 1,4 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0002", "name": "Analogt mixerbord, 4+2 kanaler", "price": 199, "image": "/images/ljud/pp_ljud_mixer02.png", "description": "Alto-mixer med 4 mic-kanaler, 2 stereokanaler, inbyggda effekter och Bluetooth.", "specs": ["4 mic/line (XLR + 6,3 mm)", "2 stereo (RCA + 6,3 mm)", "Inbyggda effekter + Bluetooth", "Fantommatning 48V", "Vikt: 2 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0003", "name": "Analogt mixerbord, 4+1 kanaler", "price": 249, "image": "/images/ljud/pp_ljud_mixer-vibz8dc.png", "description": "LD System Vibz8dc med 4 mic-kanaler, 2 stereokanaler och inbyggd kompressor p\xE5 kanal 1 & 2.", "specs": ["4 mic/line (XLR + 6,3 mm)", "Digital effektprocessor + kompressor", "Fantommatning 48V", "Vikt: 2,3 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0004", "name": "Analogt mixerbord, 4+4 kanaler", "price": 299, "image": "/images/ljud/pp_ljud_mixer03.png", "description": "Mackie-mixer med 4 mic och 4 stereokanaler. 60 dB gain. Levereras i transportv\xE4ska.", "specs": ["4 mic/line (XLR + 6,3 mm)", "4 stereo", "Preamp 60 dB", "Fantommatning 48V", "Vikt: 3 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0005", "name": "Analogt mixerbord, 6+4 kanaler", "price": 349, "image": "/images/ljud/pp_ljud_mixer04.png", "description": "Allen & Heath ZED14 \u2013 6 mic och 4 stereokanaler. 69 dB gain. Professionell mixer.", "specs": ["6 mic/line (XLR + 6,3 mm)", "4 stereo", "69 dB preamp gain", "Fantommatning 48V", "Vikt: 4,3 kg"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Mikrofoner &amp; tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { name: "H\xF6gtalarstativ Gravity", desc: "Max last 30 kg, vikt 3,7 kg", price: 40, img: "/images/ljud/pp_ljud_stativ-gravity.png" },
    { name: "H\xF6gtalarstativ K&M", desc: "Max last 30 kg, vikt 3,7 kg", price: 50, img: "/images/ljud/pp_ljud_stativ-km.png" },
    { name: "H\xF6gtalarstativ Gravity Premium", desc: "Max last 50 kg, vikt 6,4 kg", price: 60, img: "/images/ljud/pp_ljud_stativ-gravity-premium.png" },
    { name: "H\xF6gtalarstativ Gravity med vev", desc: "Max last 50 kg, vikt 9,1 kg", price: 120, img: "/images/ljud/pp_ljud_stativ-gravity-vev.png" },
    { name: "Mikrofonstativ", desc: "Justerbar h\xF6jd", price: 60, img: "/images/ljud/pp_ljud_tillbehor06.png" },
    { name: "XLR-kablar", desc: "1\u201315 m, fr 40 kr", price: 40, img: "/images/ljud/pp_ljud_tillbehor07.png" },
    { name: "Bluetooth-mottagare", desc: "Koppla in extra enhet tr\xE5dl\xF6st", price: 100, img: "/images/ljud/pp_ljud_tillbehor04.png" },
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
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 16A", excl: 236, desc: "3-fas, 16A, IP44" },
    { img: "/images/ljus/pp_el_omvandlare.png", name: "Str\xF6momvandlare 3-fas\u21921-fas", excl: 320, desc: "32A 3-fas till 1-fas" },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 32A", excl: 396, desc: "3-fas, 32A, IP44" },
    { img: "/images/ljud/pp_ljud_tillbehor_elverk-small.png", name: "Elgenerator 2 200 W", excl: 799, desc: "1 900 W kontinuerlig, bensin 4-takt" },
    { img: "/images/ljud/pp_ljud_elverk-kipor.png", name: "Elgenerator 7 700 W", excl: 1799, desc: "7 000 W kontinuerlig, bensin 4-takt. Kipor IG6000." },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_1L.png", name: "Ackrylatbensin 1 l", excl: 59, desc: "Aspen 4 \xB7 4-taktsmotorer" },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_5L.png", name: "Ackrylatbensin 5 l", excl: 239, desc: "Aspen 4 \xB7 4-taktsmotorer" }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "El-tillbeh\xF6r", "artno": artnoByName[t.name] })}`)} </div> </section> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-ljud/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till hyra ljud</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> <a href="/kontakt/" class="border border-white/30 text-white hover:bg-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Fråga om offert</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljud/portable/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljud/portable/index.astro";
const $$url = "/vara-tjanster/hyra-ljud/portable/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
