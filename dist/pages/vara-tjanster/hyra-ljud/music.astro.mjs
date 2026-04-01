/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { l as ljudData, $ as $$Layout } from '../../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ProductCard } from '../../../chunks/ProductCard_OJnWGbO_.mjs';
import { $ as $$ElTillbehorCard } from '../../../chunks/ElTillbehorCard_CS8VZJ6s.mjs';
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra Musikljud Stockholm \u2013 DJ-system med Sub-basar | Scenkonsult", "description": "Hyr musikljud och DJ-system i Stockholm fr\xE5n 999 kr/dygn. Kraftfulla sub-basar och fullrange f\xF6r dansgolv med 20\u20131 500 g\xE4ster. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Musikljud & DJ-system", "h1Accent": "Stockholm", "intro": "Hyr musikljud och DJ-system i Stockholm. Kraftfulla sub-basar och fullrange-system f\xF6r dansgolv och fest med 20\u20131 500 g\xE4ster. Komplettera med mixerbord och tr\xE5dl\xF6sa mikrofoner nedan.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljud", href: "/vara-tjanster/hyra-ljud/" },
    { label: "Ljud f\xF6r Musik" }
  ], "badges": [
    "Sub-basar f\xF6r dansgolv",
    "20\u20131 500 personer",
    "DJ-anpassat",
    "Leverans i Storstockholm"
  ], "priceFrom": 999 })} ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MUS-0001", "name": "Music, Small", "price": 999, "persons": "20\u201380 personer", "image": "/images/ljud/pp_ljud_music_small.png", "description": "DJ/trubadur f\xF6r 20\u201380 personer. Tv\xE5 10\u2033 fullrange och en 12\u2033 sub-bas. Bra bas och tryck.", "specs": ["10\u2033/1,4\u2033 + 12\u2033 sub", "2 000 W peak / 1 000 W RMS", "Max 130 dB", "36\u201320 000 Hz", "Samlad vikt: 65 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MUS-0002", "name": "Music, Small+", "price": 1299, "persons": "40\u2013100 personer", "image": "/images/ljud/pp_ljud_music_small-.png", "description": "DJ/trubadur f\xF6r 40\u2013100 personer. Tv\xE5 10\u2033 fullrange och tv\xE5 12\u2033 sub-basar.", "specs": ["10\u2033/1,4\u2033 + 2\xD712\u2033 sub", "2 000 W peak", "Max 130 dB", "36\u201320 000 Hz", "Samlad vikt: 90 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MUS-0003", "name": "Music, Medium", "price": 1499, "persons": "60\u2013120 personer", "image": "/images/ljud/pp_ljud_music_medium.png", "description": "DJ f\xF6r 60\u2013120 personer. Tv\xE5 12\u2033 fullrange och tv\xE5 12\u2033 sub-basar.", "specs": ["12\u2033/1,4\u2033 + 2\xD712\u2033 sub", "2 000 W peak", "Max 130 dB", "36\u201320 000 Hz", "Samlad vikt: 95 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MUS-0004", "name": "Music, Large", "price": 1899, "persons": "120\u2013250 personer", "image": "/images/ljud/pp_ljud_music_large.png", "description": "DJ f\xF6r 120\u2013250 personer. Tv\xE5 12\u2033 fullrange och tv\xE5 15\u2033 sub-basar.", "specs": ["12\u2033/1,4\u2033 + 2\xD715\u2033 sub", "2 000 W peak", "Max 132 dB", "29\u201320 000 Hz", "Samlad vikt: 115 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-LIV-0004", "name": "Live/Music, XL", "price": 2299, "persons": "180\u2013350 personer", "image": "/images/ljud/pp_ljud_music_xl.png", "description": "DJ f\xF6r 180\u2013350 personer. Tv\xE5 15\u2033 fullrange och tv\xE5 18\u2033 sub-basar.", "specs": ["15\u2033/1,4\u2033 + 18\u2033 sub", "8 000 W peak / 2 000 W RMS", "Max 132 dB", "29\u201320 000 Hz", "Samlad vikt: 120 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-LIV-0005", "name": "Live/Music, XL+", "price": 2999, "persons": "250\u2013600 personer", "image": "/images/ljud/pp_ljud_music_xl-.png", "description": "DJ f\xF6r 250\u2013600 personer. 15\u2033 fullrange, 15\u2033 och 18\u2033 sub.", "specs": ["15\u2033/1,4\u2033 + 15\u2033/18\u2033 sub", "8 000 W peak", "Max 132 dB", "Samlad vikt: 200 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-LIV-0006", "name": "Live/Music, XXL", "price": 4999, "persons": "500\u20131 500 personer", "image": "/images/ljud/pp_ljud_music_xxl.png", "description": "DJ f\xF6r 500\u20131 500 personer. Fyra 15\u2033 fullrange och fyra 18\u2033 sub-basar.", "specs": ["4\xD715\u2033/1,4\u2033 + 4\xD718\u2033 sub", "10 000 W peak", "Max 132 dB", "Samlad vikt: 320 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-LIV-0007", "name": "Live/Music, Concert", "price": 6999, "persons": "500\u20131 500 personer", "image": "/images/ljud/pp_ljud_music_concert.png", "description": "Konsert. Tv\xE5 12\u2033 fullrange och fyra 18\u2033 sub-basar. Varje stack 2,3 m h\xF6g.", "specs": ["2\xD712\u2033/1,4\u2033 + 4\xD718\u2033 sub", "10 800 W peak", "Max 135 dB", "Samlad vikt: 360 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-LIV-0008", "name": "Line Array, Small", "price": 14999, "persons": "1 500\u20132 500 personer", "image": "/images/ljud/pp_ljud_music_linearray1.png", "description": "RCF line array-system f\xF6r stora konserter och utomhusevent. 8\xD7 RCF HDL 6-A fullrange + 2\xD7 RCF Sub 8003-AS MK3. Pris fr\xE5n beroende p\xE5 konfiguration och montering.", "specs": ["8\xD76\u2033 fullrange line array", "2\xD718\u2033 sub-basar", "Max 138 dB SPL", "R\xE4ckvidd upp till 80 m", "Kr\xE4ver lyfttorn eller rigg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-LIV-0009", "name": "Line Array, Medium", "price": 19999, "persons": "2 000\u20133 000 personer", "image": "/images/ljud/pp_ljud_music_linearray2.png", "description": "RCF line array-system f\xF6r stora konserter och festivaler. 10\xD7 RCF HDL 6-A fullrange + 4\xD7 RCF Sub 8003-AS MK3. Pris fr\xE5n beroende p\xE5 konfiguration och montering.", "specs": ["10\xD76\u2033 fullrange line array", "4\xD718\u2033 sub-basar", "Max 140 dB SPL", "R\xE4ckvidd upp till 100 m", "Kr\xE4ver lyfttorn eller rigg"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-2 border-b border-white/10 pb-3">Mixerbord</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0001", "name": "Analogt mixerbord, 2+2 kanaler", "price": 159, "image": "/images/ljud/pp_ljud_mixer01.png", "description": "Alto, 2 mic + 2 stereo, Bluetooth.", "specs": ["2 mic/line", "2 stereo", "Bluetooth", "Fantommatning 48V"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0002", "name": "Analogt mixerbord, 4+2 kanaler", "price": 199, "image": "/images/ljud/pp_ljud_mixer02.png", "description": "Alto, 4 mic + 2 stereo, effekter + Bluetooth.", "specs": ["4 mic/line", "2 stereo", "Effekter + Bluetooth"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0003", "name": "Analogt mixerbord, 4+1 kanaler", "price": 249, "image": "/images/ljud/pp_ljud_mixer-vibz8dc.png", "description": "LD System Vibz8dc med 4 mic-kanaler, 2 stereokanaler och inbyggd kompressor p\xE5 kanal 1 & 2.", "specs": ["4 mic/line (XLR + 6,3 mm)", "Digital effektprocessor + kompressor", "Fantommatning 48V", "Vikt: 2,3 kg"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0004", "name": "Analogt mixerbord, 4+4 kanaler", "price": 299, "image": "/images/ljud/pp_ljud_mixer03.png", "description": "Mackie, 4 mic + 4 stereo, 60 dB gain.", "specs": ["4 mic/line", "4 stereo", "60 dB preamp"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0005", "name": "Analogt mixerbord, 6+4 kanaler", "price": 349, "image": "/images/ljud/pp_ljud_mixer04.png", "description": "Allen & Heath ZED14, 6 mic + 4 stereo.", "specs": ["6 mic/line", "4 stereo", "69 dB preamp"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0006", "name": "Analogt mixerbord, 12+4 kanaler", "price": 399, "image": "/images/ljud/pp_ljud_mixer05.png", "description": "Alto Live L16, 12 mic + 4 stereo, 256 effekter.", "specs": ["12 mic/line", "256 effekter"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0007", "name": "Analogt mixerbord, 16+3 kanaler", "price": 599, "image": "/images/ljud/pp_ljud_mixer06.png", "description": "Allen & Heath ZED22FX, 16 mic + 3 stereo, USB.", "specs": ["16 mic/line", "USB", "High-pass filter"] })} ${renderComponent($$result2, "ProductCard", $$ProductCard, { "artno": "SK-LJD-MIX-0008", "name": "Digitalt mixerbord, 32+16 kanaler", "price": 2499, "image": "/images/ljud/pp_ljud_mixer-ilive-t80.png", "description": "Allen & Heath iLive T80 studio- & konsert-mixer med Stagebox p\xE5 scenen via CAT5/6-kabel.", "specs": ["32 mik/line in, 16 XLR ut", "20 faders \u2013 2 banker, 4 lager = 80 kontroller", "8 in, 8 ut ljud", "Vikt: 32 kg"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Mikrofoner &amp; tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { name: "H\xF6gtalarstativ Gravity", desc: "Max last 30 kg, vikt 3,7 kg", price: 40, img: "/images/ljud/pp_ljud_stativ-gravity.png" },
    { name: "H\xF6gtalarstativ K&M", desc: "Max last 30 kg, vikt 3,7 kg", price: 50, img: "/images/ljud/pp_ljud_stativ-km.png" },
    { name: "H\xF6gtalarstativ Gravity Premium", desc: "Max last 50 kg, vikt 6,4 kg", price: 60, img: "/images/ljud/pp_ljud_stativ-gravity-premium.png" },
    { name: "H\xF6gtalarstativ Gravity med vev", desc: "Max last 50 kg, vikt 9,1 kg", price: 120, img: "/images/ljud/pp_ljud_stativ-gravity-vev.png" },
    { name: "Lyfttorn f\xF6r line array", desc: "Max last 200 kg, h\xF6jd upp till 6 m", price: 2999, img: "/images/ljud/pp_ljud_lift.png" },
    { name: "Mikrofonstativ", desc: "Justerbar h\xF6jd", price: 60, img: "/images/ljud/pp_ljud_tillbehor06.png" },
    { name: "XLR-kablar", desc: "1\u201315 m, fr 40 kr", price: 40, img: "/images/ljud/pp_ljud_tillbehor07.png" },
    { name: "XLR Multikabel 15 m, 6 kan.", desc: "Stagebox, 6 kanaler", price: 276, img: "/images/ljud/pp_ljud_tillbehor_MK-small.png" },
    { name: "XLR Multikabel 25 m, 8 kan.", desc: "Stagebox, 8 kanaler", price: 384, img: "/images/ljud/pp_ljud_tillbehor_MK-medium.png" },
    { name: "XLR Multikabel 15 m, 24+8 kan.", desc: "Stagebox stor, 24+8 kanaler", price: 632, img: "/images/ljud/pp_ljud_tillbehor_MK-large.png" },
    { name: "DI-box (passiv)", desc: "2-kan, XLR ut / 6,35 mm in", price: 160, img: "/images/ljud/pp_ljud_tillbehor_DI-passiv.png" },
    { name: "DI-box (aktiv)", desc: "1-kan, XLR ut / 6,35 mm in, 9V", price: 240, img: "/images/ljud/pp_ljud_tillbehor_DI-aktiv.png" },
    { name: "Bluetooth-mottagare", desc: "Tr\xE5dl\xF6s anslutning till PA", price: 100, img: "/images/ljud/pp_ljud_tillbehor04.png" },
    { name: "Bluetooth-mottagare pro", desc: "L\xE4ngre r\xE4ckvidd", price: 140, img: "/images/ljud/pp_ljud_tillbehor_BT-pro.png" },
    { name: "Instrumentmikrofon", desc: "Gitarr, bl\xE5s m.m., inkl XLR", price: 64, img: "/images/ljud/pp_ljud_mik02.png" },
    { name: "Instrumentmikrofon, bl\xE5s", desc: "Bl\xE5sinstrument, inkl XLR", price: 80, img: "/images/ljud/pp_ljud_mik04.png" },
    { name: "Handmikrofon", desc: "Inkl 6 m XLR-kabel", price: 80, img: "/images/ljud/pp_ljud_mik01.png" },
    { name: "Instrumentmikrofoner, slagverk", desc: "Trumset, inkl XLR-kablar", price: 480, img: "/images/ljud/pp_ljud_mik03.png" },
    { name: "Tr\xE5dl\xF6s handmikrofon", desc: "Ca 30 m r\xE4ckvidd", price: 400, img: "/images/ljud/pp_ljud_mik05.png", specs: ["UHF tr\xE5dl\xF6s, ca 30 m r\xE4ckvidd", "Mottagarenhet ing\xE5r", "Kr\xE4ver AA-batteri", "Plug & play"] },
    { name: "Tr\xE5dl\xF6st headset", desc: "Ca 30 m r\xE4ckvidd", price: 480, img: "/images/ljud/pp_ljud_mik06.png", specs: ["UHF tr\xE5dl\xF6s, ca 30 m r\xE4ckvidd", "Bodypack + headset ing\xE5r", "Kr\xE4ver AA-batteri"] },
    { name: "Tr\xE5dl\xF6st IEM", desc: "In-ear monitor, ca 30 m", price: 480, img: "/images/ljud/pp_ljud_tillbehor01.png" },
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
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljud/music/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljud/music/index.astro";
const $$url = "/vara-tjanster/hyra-ljud/music/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
