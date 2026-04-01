/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { a as ljusData, $ as $$Layout } from '../../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ElTillbehorCard } from '../../../chunks/ElTillbehorCard_CS8VZJ6s.mjs';
import { $ as $$MediaCard } from '../../../chunks/MediaCard_Ga-Rl7w_.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const forbr = ljusData.rok.tillbehor.filter(
    (t) => !t.slug?.startsWith("ackrylatbensin")
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyr R\xF6kmaskin & Kallgnistmaskin Stockholm \u2013 Granulat & R\xF6kv\xE4tska | Scenkonsult", "description": "Hyr r\xF6kmaskin, kallgnistmaskin, hazer och konfettiavfyrare i Stockholm. R\xF6kmaskin fr 349 kr/dygn. R\xF6kv\xE4tska, granulat och ackrylatbensin. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "R\xF6k & Pyroteknik", "h1Accent": "Stockholm", "intro": "Hyr r\xF6kmaskin, kallgnistmaskin och konfettiavfyrare i Stockholm fr\xE5n 349 kr/dygn. V\xE5ra r\xF6kmaskiner har inbyggt RGB-ljus och fyller lokalen snabbt \u2013 perfekt till br\xF6llop, konserter och f\xF6retagsevent. Kallgnistmaskiner (Cold Spark) producerar kalla gnistor som \xE4r helt s\xE4kra inomhus, kr\xE4ver inget tillst\xE5nd och ger ett professionellt scen-intryck. R\xF6k och pyro-effekter f\xF6rst\xE4rker alla ljuspaket och g\xF6r stor skillnad i upplevelsen. Leverans i hela Storstockholm.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljus", href: "/vara-tjanster/hyra-ljus/" },
    { label: "R\xF6k & Pyroteknik" }
  ], "badges": [
    "R\xF6kmaskin & kallgnistmaskin",
    "Konfettiavfyrare",
    "Volymrabatt",
    "Leverans i Storstockholm"
  ], "priceFrom": 349 })}  ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": "R\xF6kmaskin, 1500W", "images": ["/images/ljus/pp_ljus_effekt23.png"], "videos": ["/videos/1200W_Fog_Machine_6LEDs_Remote.mp4"], "priceExcl": 349, "priceSuffix": "/st/dygn fr", "artno": "SK-LJS-ROK-0001", "category": "R\xF6k & pyro", "bullets": ["6\xD73W LED RGB inbyggd", "Dimeffekt: 85 m\xB3/min", "Str\xF6mf\xF6rbrukning: 1 500 W", "M\xE5tt: 397\xD7302\xD7191 mm, Vikt: 5 kg", "1 L r\xF6kv\xE4tska ing\xE5r"], "rows": [
    { label: "Volympriser", rows: ["1 st \u2013 349 kr", "2 st \u2013 649 kr", "4 st \u2013 1 249 kr"] }
  ] })} ${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": "R\xF6kmaskin, 650W", "images": ["/images/ljus/pp_ljus_effekt24.png"], "videos": ["/videos/adj_fog_fury_jett-04.mp4"], "priceExcl": 449, "priceSuffix": "/st/dygn fr", "artno": "SK-LJS-ROK-0002", "category": "R\xF6k & pyro", "bullets": ["12\xD73W LED RGB inbyggd", "Dimeffekt: 125 m\xB3/min", "Str\xF6mf\xF6rbrukning: 650 W", "Vikt: 10 kg", "1 L r\xF6kv\xE4tska ing\xE5r"], "rows": [
    { label: "Volympriser", rows: ["1 st \u2013 449 kr", "2 st \u2013 849 kr", "4 st \u2013 1 699 kr"] }
  ] })} ${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": "Hazer HZ-1500 Pro", "images": ["/images/ljus/pp_ljus_rok3.png"], "videos": ["/videos/hazer-hz1500.mp4"], "priceExcl": 649, "priceSuffix": "/st/dygn fr", "artno": "SK-LJS-ROK-0005", "category": "R\xF6k & pyro", "bullets": ["Finf\xF6rdelat dis \u2013 synligg\xF6r ljusstr\xE5lar", "DMX 512-styrning", "Touring flightcase", "Stabil kontinuerlig output", "Inkl 1 l r\xF6kv\xE4tska"], "rows": [
    { label: "Volympriser", rows: ["1 st \u2013 649 kr", "2 st \u2013 1 199 kr"] }
  ] })} ${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": "Kallgnistmaskin", "images": ["/images/ljus/pp_ljus_effekt25.png"], "videos": ["/videos/Cold_Spark_Machine.mp4"], "priceExcl": 499, "priceSuffix": "/st/dygn fr", "artno": "SK-LJS-ROK-0003", "category": "R\xF6k & pyro", "bullets": ["Cold Spark \u2013 s\xE4kra gnisteffekter", "Effekt: 700 W, f\xF6rv\xE4rmningstid ~4 min", "DMX 512, Vikt: 8 kg"], "rows": [
    { label: "Volympriser", rows: ["1 st \u2013 499 kr", "2 st \u2013 949 kr", "4 st \u2013 1 799 kr"] },
    { label: "Granulat (drivmedel)", rows: ["100 g (~3 min) \u2013 299 kr", "200 g (~6 min) \u2013 479 kr"] }
  ] })} ${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": "Konfettiavfyrare", "images": ["/images/ljus/pp_ljus_confettimaskin.png"], "priceExcl": 499, "priceSuffix": "/dygn", "artno": "SK-LJS-ROK-0004", "category": "R\xF6k & pyro", "bullets": ["Utskjutningsvinkel stegl\xF6st justerbar", "DMX 512 Standard", "Str\xF6mf\xF6rbrukning: 100 W", "Inkl ett konfettir\xF6r"] })} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Ljusstyrning (DMX)</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"> ${[
    { img: "/images/ljus/pp_ljus_styrning02.png", name: "Styrenhet 192 kan.", excl: 99, artno: "SK-LJS-DMX-0001", desc: "12 scanners\xD716 kan, 240 sekvenser, musikstyrning" },
    { img: "/images/ljus/pp_ljus_botex_sdc16.png", name: "Botex SDC-16", excl: 199, artno: "SK-LJS-DMX-0002", desc: "16 kanalfaders + masterfader, startkanal via display" },
    { img: "/images/ljus/pp_ljus_styrning03.png", name: "Styrenhet 512 kan.", excl: 299, artno: "SK-LJS-DMX-0003", desc: "48 enheter, 4 600 scener, 96 banker, musikstyrning" },
    { img: "/images/ljus/pp_ljus_styrning04.png", name: "PC-mjukvara DMX", excl: 799, artno: "SK-LJS-DMX-0004", desc: "512 kan, dra/sl\xE4pp programmering, BPM-analys, SSL2" },
    { img: "/images/ljus/pp_ljus_styrning-m6.png", name: "Martin M6 Ljusstyrning", excl: 2499, artno: "SK-LJS-DMX-0005", desc: 'Dubbla 15,4" touchsk\xE4rmar, 44 playbacks, 4\xD7 FastBlend RGB' }
  ].map((p) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": p.img, "name": p.name, "excl": p.excl, "desc": p.desc, "category": "DMX-styrning", "artno": p.artno, "modal": true, "specs": [p.desc] })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Förbrukningsartiklar</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${forbr.map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.image, "name": t.name, "excl": t.price, "desc": t.desc, "category": "F\xF6rbrukningsartiklar", "artno": t.artno })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">Tillbehör – Fästen &amp; DMX</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { img: "/images/ljus/pp_ljus_half_coupler.png", name: "Half Coupler 35/50 mm", artno: "SK-LJS-STV-0010", excl: 20 },
    { img: "/images/ljus/pp_ljus_super_clamp.png", name: "Super Clamp 50 mm", artno: "SK-LJS-STV-0011", excl: 32 },
    { img: "/images/ljus/pp_ljus_kablar.png", name: "DMX-kabel 1\u20135 m", artno: "SK-LJS-DMX-0006", excl: 20 },
    { img: "/images/ljus/pp_ljus_kablar.png", name: "DMX-kabel 10\u201315 m", artno: "SK-LJS-DMX-0007", excl: 40 },
    { img: "/images/ljus/pp_ljus_tradlos01.png", name: "DMX Tr\xE5dl\xF6s startkit (1+2)", artno: "SK-LJS-DMX-0008", excl: 159 },
    { img: "/images/ljus/pp_ljus_tradlos02.png", name: "DMX Tr\xE5dl\xF6s extra s\xE4ndare", artno: "SK-LJS-DMX-0009", excl: 80 },
    { img: "/images/ljus/pp_ljus_tradlos03.png", name: "DMX Tr\xE5dl\xF6s extra mottagare", artno: "SK-LJS-DMX-0010", excl: 80 }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "category": "DMX-tillbeh\xF6r", "artno": t.artno })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">El-tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { img: "/images/ljus/pp_ljus_powercon.png", name: "PowerCon 0,5\u20131,5 m", artno: "SK-LJS-EL-0001", excl: 20 },
    { img: "/images/ljus/pp_ljus_iec_kabel.png", name: "IEC C13/C14 0,5\u20131,5 m", artno: "SK-LJS-EL-0002", excl: 20 },
    { img: "/images/ljus/pp_el_grenuttag_sm.png", name: "Grenuttag 1,5 m", artno: "SK-LJS-EL-0003", excl: 20 },
    { img: "/images/ljus/pp_el_forlangning.png", name: "F\xF6rl\xE4ngning 10 m 1-fas", artno: "SK-LJS-EL-0004", excl: 48 },
    { img: "/images/ljus/pp_ljus_powercon2.png", name: "PowerCon 5\u201310 m", artno: "SK-LJS-EL-0005", excl: 80 },
    { img: "/images/ljus/pp_el_overloppsskydd.png", name: "\xD6verk\xF6rningsskydd 1 m", artno: "SK-LJS-EL-0006", excl: 80 },
    { img: "/images/ljus/pp_el_grenuttag_lg.png", name: "Grenuttag 10 m IP44", artno: "SK-LJS-EL-0007", excl: 100 },
    { img: "/images/ljus/pp_el_grenuttag_25m.png", name: "Grenuttag 25 m IP44", artno: "SK-LJS-EL-0008", excl: 159 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 16A", artno: "SK-LJS-EL-0009", excl: 236 },
    { img: "/images/ljus/pp_el_omvandlare.png", name: "Str\xF6momvandlare 3-fas\u21921-fas", artno: "SK-LJS-EL-0010", excl: 320 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 32A", artno: "SK-LJS-EL-0011", excl: 396 },
    { img: "/images/ljud/pp_ljud_tillbehor_elverk-small.png", name: "Elgenerator 2 200 W", artno: "SK-LJS-EL-0012", excl: 799 },
    { img: "/images/ljud/pp_ljud_elverk-kipor.png", name: "Elgenerator 7 700 W", artno: "SK-LJS-EL-0013", excl: 1799 },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_1L.png", name: "Ackrylatbensin 1 l", artno: "SK-LJS-ROK-ACC-0001", excl: 59, desc: "Aspen 4 \xB7 4-taktsmotorer" },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_5L.png", name: "Ackrylatbensin 5 l", artno: "SK-LJS-ROK-ACC-0002", excl: 239, desc: "Aspen 4 \xB7 4-taktsmotorer" }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "El-tillbeh\xF6r", "artno": t.artno })}`)} </div> </section> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-ljus/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till hyra ljus</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> <a href="/kontakt/" class="border border-white/30 text-white hover:bg-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Fråga om offert</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/rok-pyro/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/rok-pyro/index.astro";
const $$url = "/vara-tjanster/hyra-ljus/rok-pyro/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
