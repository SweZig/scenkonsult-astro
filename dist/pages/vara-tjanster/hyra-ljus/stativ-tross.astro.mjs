/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_DH83owMh.mjs';
import { $ as $$CategoryHero } from '../../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ElTillbehorCard } from '../../../chunks/ElTillbehorCard_cwYlohNI.mjs';
import { $ as $$ProductCard } from '../../../chunks/ProductCard_DdneY1u2.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyr Ljusstativ & Trosstorn Stockholm \u2013 T-bar, Tross & Traverser | Scenkonsult", "description": "Hyr ljusstativ med T-bar, vevstativ, trosstorn och trossryggar i Stockholm. Stativ fr 40 kr/dygn, trossb\xE5ge fr 1500 kr/dygn. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Stativ & Tross", "h1Accent": "Stockholm", "intro": "Stativ och tross \xE4r grunden f\xF6r alla h\xE4ftiga ljusupplevelser. Hyr ljusstativ med T-bar, vevstativ, trosstorn och kompletta trossb\xE5gar i Stockholm \u2013 fr\xE5n 40 kr/dygn. V\xE4lj stativ och tross f\xF6rst f\xF6r att se hur m\xE5nga effekter du f\xE5r plats med, v\xE4lj sedan vilka armaturer du vill ha. Allt fr\xE5n enkla stativ till 6 m breda trossb\xE5gar f\xF6r konserter. Leverans i hela Storstockholm.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljus", href: "/vara-tjanster/hyra-ljus/" },
    { label: "Stativ & Tross" }
  ], "badges": [
    "T-bar & vevstativ",
    "Trosstorn & traverser",
    "Passar alla effekter",
    "Leverans i Storstockholm"
  ], "priceFrom": 40 })}  ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Ljusstativ med T-bar</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${[
    { id: "stativ-tbar-400", img: "/images/ljus/pp_ljus_stativ06.png", name: "Stativ T-bar 400 mm", price: 40, description: "Standardstativ med 400 mm T-bar. Plats f\xF6r upp till 2 effekter.", specs: ["T-bar: 400 mm", "H\xF6jd: 1,25\u20132,40 m", "Max last: 20 kg, Vikt: 3,7 kg"] },
    { id: "stativ-tbar-1200", img: "/images/ljus/pp_ljus_stativ_1200.png", name: "Stativ T-bar 1200 mm", price: 40, description: "Standardstativ med 1200 mm T-bar. Plats f\xF6r upp till 4 effekter.", specs: ["T-bar: 1 200 mm", "H\xF6jd: 1,25\u20132,40 m", "Max last: 20 kg, Vikt: 3,7 kg"] },
    { id: "stativ-tbar-900", img: "/images/ljus/pp_ljus_stativ01.png", name: "Stativ T-bar 900 mm \u2605", price: 60, description: "Premiumstativ med 900 mm T-bar. Upp till 2,5 m h\xF6jd.", specs: ["T-bar: 900 mm", "H\xF6jd: 1,10\u20132,50 m", "Max last: 30 kg, Vikt: 5,8 kg"] },
    { id: "vevstativ-tbar-1200", img: "/images/ljus/pp_ljus_stativ02.png", name: "Vevstativ T-bar 1200 mm", price: 120, description: "Vevstativ f\xF6r h\xF6g monteringsh\xF6jd upp till 3,7 m.", specs: ["T-bar: 1 200 mm", "H\xF6jd: 1,70\u20133,70 m", "Max last: 35 kg, Vikt: 20 kg"] }
  ].map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": p.id, "name": p.name, "price": p.price, "priceNote": "/dygn", "image": p.img, "description": p.description, "specs": p.specs, "category": "Stativ & tross" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Trosstorn</h2> <div class="grid grid-cols-1 sm:grid-cols-3 gap-6"> ${[
    { id: "trosstorn-1m", img: "/images/ljus/pp_ljus_tross01.png", name: "Trosstorn 1,0 m", price: 300, specs: ["4-punkts tross, 50 mm tub", "H\xF6jd: 1,0 m", "Max last: 50 kg, Vikt: 16 kg"] },
    { id: "trosstorn-15m", img: "/images/ljus/pp_ljus_tross03.png", name: "Trosstorn 1,5 m", price: 360, specs: ["4-punkts tross, 50 mm tub", "H\xF6jd: 1,5 m", "Max last: 50 kg, Vikt: 18 kg"] },
    { id: "trosstorn-2m", img: "/images/ljus/pp_ljus_tross04.png", name: "Trosstorn 2,0 m", price: 400, specs: ["4-punkts tross, 50 mm tub", "H\xF6jd: 2,0 m", "Max last: 50 kg, Vikt: 20 kg"] }
  ].map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": p.id, "name": p.name, "price": p.price, "priceNote": "/dygn", "image": p.img, "specs": p.specs, "category": "Stativ & tross" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Trosstraverser &amp; Trossbågar</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${[
    { id: "trosstravers-3m", img: "/images/ljus/pp_ljus_stativ03.png", name: "Trosstravers 3,0 m", price: 460, description: "Kan hissas upp till 3,7 m. 3,0 m bred. Upp till 5 effekter.", specs: ["4-punkts tross, 50 mm tub", "3,0 m bred", "Max last: 50 kg, Vikt: 30 kg"] },
    { id: "trosstravers-4m", img: "/images/ljus/pp_ljus_stativ04.png", name: "Trosstravers 4,0 m", price: 500, description: "Kan hissas upp till 3,7 m. 4,0 m bred. Upp till 8 effekter.", specs: ["4-punkts tross, 50 mm tub", "4,0 m bred", "Max last: 50 kg, Vikt: 35 kg"] },
    { id: "trossbage-25x40", img: "/images/ljus/pp_ljus_tross06.png", name: "Trossb\xE5ge 2,5\xD74,0 m", price: 1500, description: "Byggs 2,5 m h\xF6g och 4,0 m bred. Upp till 18 effekter.", specs: ["4-punkts tross, 50 mm tub", "H\xF6jd: 2,5 m, Bredd: 4,0 m", "Max last: 75 kg, Vikt: 40 kg"] },
    { id: "trossbage-30x60", img: "/images/ljus/pp_ljus_tross08.png", name: "Trossb\xE5ge 3,0\xD76,0 m", price: 2100, description: "Byggs 3,0 m h\xF6g och 6,0 m bred. Upp till 24 effekter.", specs: ["4-punkts tross, 50 mm tub", "H\xF6jd: 3,0 m, Bredd: 6,0 m", "Max last: 75 kg, Vikt: 60 kg"] },
    { id: "trossvagg-25x20", img: "/images/ljus/pp_ljus_tross09.png", name: "Trossv\xE4gg 2,5\xD72,0 m", price: 2100, description: "Byggs 2,5 m h\xF6g och 2,0 m bred. Passar 8\u201316 effekter.", specs: ["4-punkts tross, 50 mm tub", "H\xF6jd: 2,5 m, Bredd: 2,0 m", "Max last: 75 kg, Vikt: 60 kg"] }
  ].map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": p.id, "name": p.name, "price": p.price, "priceNote": "/dygn", "image": p.img, "description": p.description, "specs": p.specs, "category": "Stativ & tross" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">Tillbehör – Fästen, Trossöverdrag &amp; DMX</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { img: "/images/ljus/pp_ljus_half_coupler.png", name: "Half Coupler 35/50 mm", excl: 20 },
    { img: "/images/ljus/pp_ljus_super_clamp.png", name: "Super Clamp 50 mm", excl: 32 },
    { img: "/images/ljus/pp_ljus_tross05.png", name: "Tross\xF6verdrag 1,0 m", excl: 60 },
    { img: "/images/ljus/pp_ljus_tross05.png", name: "Tross\xF6verdrag 1,5 m", excl: 80 },
    { img: "/images/ljus/pp_ljus_tross05.png", name: "Tross\xF6verdrag 2,0 m", excl: 100 },
    { img: "/images/ljus/pp_ljus_kablar.png", name: "DMX-kabel 1\u20135 m", excl: 40 },
    { img: "/images/ljus/pp_ljus_kablar.png", name: "DMX-kabel 10\u201315 m", excl: 60 },
    { img: "/images/ljus/pp_ljus_tradlos01.png", name: "DMX Tr\xE5dl\xF6s startkit (1+2)", excl: 239 },
    { img: "/images/ljus/pp_ljus_tradlos02.png", name: "DMX Tr\xE5dl\xF6s extra s\xE4ndare", excl: 80 },
    { img: "/images/ljus/pp_ljus_tradlos03.png", name: "DMX Tr\xE5dl\xF6s extra mottagare", excl: 80 }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "category": "Tillbeh\xF6r", "artno": t.artno })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">El-tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { img: "/images/ljus/pp_ljus_powercon.png", name: "PowerCon 0,5\u20131,5 m", excl: 20 },
    { img: "/images/ljus/pp_ljus_iec_kabel.png", name: "IEC C13/C14 0,5\u20131,5 m", excl: 20 },
    { img: "/images/ljus/pp_el_grenuttag_sm.png", name: "Grenuttag 1,5 m", excl: 20 },
    { img: "/images/ljus/pp_el_forlangning.png", name: "F\xF6rl\xE4ngning 10 m 1-fas", excl: 48 },
    { img: "/images/ljus/pp_ljus_powercon2.png", name: "PowerCon 5\u201310 m", excl: 80 },
    { img: "/images/ljus/pp_el_overloppsskydd.png", name: "\xD6verk\xF6rningsskydd 1 m", excl: 80 },
    { img: "/images/ljus/pp_el_grenuttag_lg.png", name: "Grenuttag 10 m IP44", excl: 100 },
    { img: "/images/ljus/pp_el_grenuttag_25m.png", name: "Grenuttag 25 m IP44", excl: 159 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 16A", excl: 236 },
    { img: "/images/ljus/pp_el_omvandlare.png", name: "Str\xF6momvandlare 3-fas\u21921-fas", excl: 320 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 32A", excl: 396 },
    { img: "/images/ljud/pp_ljud_tillbehor_elverk-small.png", name: "Elgenerator 2 200 W", excl: 799 },
    { img: "/images/ljud/pp_ljud_elverk-kipor.png", name: "Elgenerator 7 700 W", excl: 1799 },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_1L.png", name: "Ackrylatbensin 1 l", excl: 59, desc: "Aspen 4 \xB7 4-taktsmotorer" },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_5L.png", name: "Ackrylatbensin 5 l", excl: 239, desc: "Aspen 4 \xB7 4-taktsmotorer" }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "El-tillbeh\xF6r", "artno": t.artno })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="bg-brand-navy border border-white/10 rounded-2xl overflow-hidden"> <div class="grid grid-cols-1 md:grid-cols-2"> <div class="p-8"> <h2 class="text-2xl font-bold text-white mb-3">Scenljus för konserter eller större event</h2> <p class="text-gray-300 mb-2">Vi har scenljus för alla ändamål – vitt och färgat ljus på travers eller tross.</p> <p class="text-gray-400 text-sm mb-6">Kontakta oss och beskriv ditt behov så tar vi fram en lösning. Större ljusriggar kräver transport och montering — tillkommer som tillägg.</p> <a href="/kontakt/" class="inline-block bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">Begär offert</a> </div> <div class="hidden md:block"> <img src="/images/ljus/pp_ljus_storre_event.png" alt="Scenljus för konserter" width="600" height="400" loading="lazy" class="w-full h-full object-cover"> </div> </div> </div> </section> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-ljus/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till hyra ljus</a> <a href="/vara-tjanster/hyra-ljus/ljuseffekter/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">Lösa effekter</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/stativ-tross/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/stativ-tross/index.astro";
const $$url = "/vara-tjanster/hyra-ljus/stativ-tross/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
