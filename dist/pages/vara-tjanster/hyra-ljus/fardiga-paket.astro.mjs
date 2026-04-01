/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { a as ljusData, $ as $$Layout } from '../../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$MediaCard } from '../../../chunks/MediaCard_Ga-Rl7w_.mjs';
import { $ as $$LjusTillbehor } from '../../../chunks/LjusTillbehor_60T6GKFL.mjs';
import { $ as $$ElTillbehorCard } from '../../../chunks/ElTillbehorCard_CS8VZJ6s.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  Object.fromEntries(
    (ljusData.paket?.products || []).map((p) => [p.name, p.artno]).filter(([, a]) => a)
  );
  const WP = "/videos";
  const paket = [
    {
      title: "Ljuspaket, Small",
      artno: "SK-LJS-PAK-0001",
      img: "/images/ljus/pp_ljus_small.png",
      excl: 399,
      videos: [`${WP}/stairville_led_boss_fx-2_pro_01.mp4`],
      persons: "10\u201330 pers",
      bullets: ["LED T-bar med 4 PAR-armaturer p\xE5 stativ", "12\xD79W RGB LED", "Synkroniseras med musik automatiskt", "Montering: 8\u201312 min, vikt: 16 kg"]
    },
    {
      title: "Ljuspaket, Small+",
      artno: "SK-LJS-PAK-0002",
      img: "/images/ljus/pp_ljus_small_plus.png",
      excl: 599,
      videos: [`${WP}/LB100A.mp4`],
      persons: "20\u201340 pers",
      bullets: ["Trosstorn med Moving Head 100W COB p\xE5 toppen", "540\xB0/180\xB0 rotation", "DMX eller automatik till musik", "Montering: 10\u201315 min, vikt: 28 kg"]
    },
    {
      title: "Ljuspaket, Small++",
      artno: "SK-LJS-PAK-0003",
      img: "/images/ljus/pp_ljus_small_plusplus.png",
      excl: 799,
      videos: [`${WP}/stairville_led_boss_fx-2_pro_01.mp4`],
      persons: "20\u201360 pers",
      bullets: ["2 stativ med T-bars, 4 olika effekttyper", "24\xD79W PAR + roterande + stroboskop + UV + laser + scanners", "Montering: 10\u201315 min, vikt: 30 kg"]
    },
    {
      title: "Ljuspaket, Medium",
      artno: "SK-LJS-PAK-0004",
      img: "/images/ljus/pp_ljus_medium.png",
      excl: 1199,
      videos: [`${WP}/Big-Dipper-LM120-introduction-720p.mp4`],
      persons: "40\u201380 pers",
      bullets: ["2 trosstorn med Moving Head (120W COB + 26\xD72W RGBW)", "540\xB0/270\xB0 rotation, motoriserad zoom", "DMX eller automatik till musik", "Montering: 15\u201320 min, vikt: 52 kg"]
    },
    {
      title: "Ljuspaket, Medium+",
      artno: "SK-LJS-PAK-0005",
      img: "/images/ljus/pp_ljus_medium_plus.png",
      excl: 1299,
      videos: [`${WP}/stairville_led_boss_fx-2_pro_01.mp4`, `${WP}/stairville_matrixx-sc-100_dmx_led_03.mp4`],
      persons: "40\u2013100 pers",
      bullets: ["3 stativ, 5 effekttyper f\xF6rmonterade", "24\xD79W PAR + roterande + stroboskop + UV + laser + 2 scanners", "Montering: 20\u201325 min, vikt: 30 kg"]
    },
    {
      title: "Ljuspaket, Medium++",
      artno: "SK-LJS-PAK-0006",
      img: "/images/ljus/pp_ljus_medium_plusplus.png",
      excl: 1499,
      videos: [`${WP}/Big-Dipper-LM120-introduction-720p.mp4`, `${WP}/LB100A.mp4`],
      persons: "50\u2013120 pers",
      bullets: ["2 stativ med 8 effekter", "4\xD7PAR + 2\xD7Moving Head Wash + 2\xD7Moving Head Beam", "Musikstyrning automatik eller DMX", "Montering: 30\u201340 min, vikt: 30 kg"]
    },
    {
      title: "Ljuspaket, Large",
      artno: "SK-LJS-PAK-0007",
      img: "/images/ljus/pp_ljus_large.png",
      excl: 1999,
      videos: [`${WP}/Big-Dipper-LM120-introduction-720p.mp4`, `${WP}/LB100A.mp4`, `${WP}/stairville_matrixx-sc-100_dmx_led_03.mp4`],
      persons: "60\u2013140 pers",
      bullets: ["2 stativ med 2m tross, 5 effekttyper", "1\xD7Scanner + 2\xD7Moving Head Wash + 2\xD7Moving Head Beam", "Musikstyrning automatik eller DMX", "Montering: 40\u201345 min, vikt: 30 kg"]
    },
    {
      title: "Ljuspaket, Large+",
      artno: "SK-LJS-PAK-0008",
      img: "/images/ljus/pp_ljus_large_plus.png",
      excl: 2299,
      videos: [`${WP}/Big-Dipper-LM120-introduction-720p.mp4`, `${WP}/LB100A.mp4`],
      persons: "60\u2013160 pers",
      bullets: ["4 trosstorn med Moving Heads", "2\xD7Wash 120W COB + 2\xD7Beam 100W COB", "DMX eller automatik till musik", "Montering: 25\u201330 min, vikt: 30 kg"]
    },
    {
      title: "Ljuspaket, Large++",
      artno: "SK-LJS-PAK-0009",
      img: "/images/ljus/pp_ljus_large_plusplus.png",
      excl: 2999,
      videos: [`${WP}/stairville_led_boss_fx-2_pro_01.mp4`, `${WP}/stairville_matrixx-sc-100_dmx_led_03.mp4`, `${WP}/cameo_wookie-400-RGB.mp4`, `${WP}/adj_fog_fury_jett-04.mp4`],
      persons: "80\u2013160 pers",
      bullets: ["5 stativ, 6 effekttyper + 2 r\xF6kmaskiner med ljus", "24\xD79W PAR + stroboskop + UV + scanner + laser + r\xF6kmaskiner", "CO\u2082 r\xF6kv\xE4tska ing\xE5r (2L)", "Montering: 35\u201350 min, vikt: 66 kg"]
    },
    {
      title: "Ljuspaket, XL",
      artno: "SK-LJS-PAK-0010",
      img: "/images/ljus/pp_ljus_xl.png",
      excl: 4999,
      videos: [`${WP}/LM1915Z.mp4`, `${WP}/LB100A.mp4`, `${WP}/adj_fog_fury_jett-04.mp4`],
      persons: "100\u2013180 pers",
      bullets: ["Trossv\xE4gg 2,5\xD72,0m med 8 Moving Heads", "4\xD7Wash 19\xD715W RGBW + 4\xD7Beam 100W COB + 2 r\xF6kmaskiner", "CO\u2082 r\xF6kv\xE4tska ing\xE5r (2L)", "Montering: 45\u201360 min, vikt: 50 kg"]
    },
    {
      title: "Ljuspaket, XL+",
      artno: "SK-LJS-PAK-0011",
      img: "/images/ljus/pp_ljus_xl_plus.png",
      excl: 5999,
      videos: [`${WP}/LM1915Z.mp4`, `${WP}/LB100A.mp4`, `${WP}/stairville_matrixx-sc-100_dmx_led_03.mp4`, `${WP}/Betopper_L1015_short_720p.mp4`],
      persons: "100\u2013250 pers",
      bullets: ["Trossb\xE5ge 2,5\xD74,0m med 8+4 armaturer", "2\xD7Wash + 4\xD7Beam + 2\xD7Scanner + 2\xD7LED Bar + 4 r\xF6kmaskiner", "CO\u2082 r\xF6kv\xE4tska ing\xE5r (4L)", "Montering: 60\u201390 min, vikt: 60 kg"]
    },
    {
      title: "Scenpaket",
      img: "/images/ljus/pp_ljus_scen_bundle.png",
      excl: 1499,
      videos: [],
      persons: "Konserter",
      bullets: ["8 armaturer \u2013 varmvitt eller f\xE4rgat ljus p\xE5 stativ", "56\xD74W LED WW/RGB per armatur", "DMX-styrenhet inkluderad", "Montering: 20\u201330 min, vikt: 40 kg"]
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra F\xE4rdiga Ljuspaket Stockholm \u2013 Small till XL+ | Scenkonsult", "description": "Hyr f\xE4rdiga ljuspaket i Stockholm fr\xE5n 399 kr/dygn. Small till XL+ \u2013 12 paket f\xF6r 10\u2013250 personer. LED PAR, Moving Heads, Strobe, Laser. Leverans Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "F\xE4rdiga Ljuspaket", "h1Accent": "Stockholm", "intro": "Hyr f\xE4rdiga ljuspaket f\xF6r fest, br\xF6llop och event i Stockholm. Tolv paket fr\xE5n Small till XL+ \u2013 f\xF6r 10 till 250 personer. Plug & play med automatisk musiksynk, ingen DMX-kunskap kr\xE4vs. Leverans i hela Storstockholm.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljus", href: "/vara-tjanster/hyra-ljus/" },
    { label: "F\xE4rdiga ljuspaket" }
  ], "badges": [
    "Plug & play",
    "Automatisk musiksynk",
    "DMX eller automatik",
    "Leverans i Storstockholm"
  ], "priceFrom": 399 })} ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${paket.map((p) => renderTemplate`${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": p.title, "images": [p.img], "videos": p.videos ?? [], "priceExcl": p.excl, "bullets": p.bullets, "artno": p.artno, "tag": p.persons, "category": "F\xE4rdiga ljuspaket" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Ljusstyrning (DMX)</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"> ${[
    { img: "/images/ljus/pp_ljus_styrning02.png", name: "Styrenhet 192 kan.", artno: "SK-LJS-DMX-0001", excl: 99, desc: "12 scanners\xD716 kan, 240 sekvenser, musikstyrning" },
    { img: "/images/ljus/pp_ljus_botex_sdc16.png", name: "Botex SDC-16", artno: "SK-LJS-DMX-0002", excl: 199, desc: "16 kanalfaders + masterfader, startkanal via display" },
    { img: "/images/ljus/pp_ljus_styrning03.png", name: "Styrenhet 512 kan.", artno: "SK-LJS-DMX-0003", excl: 299, desc: "48 enheter, 4 600 scener, 96 banker, musikstyrning" },
    { img: "/images/ljus/pp_ljus_styrning04.png", name: "PC-mjukvara DMX", artno: "SK-LJS-DMX-0004", excl: 799, desc: "512 kan, dra/sl\xE4pp programmering, BPM-analys, SSL2" },
    { img: "/images/ljus/pp_ljus_styrning-m6.png", name: "Martin M6 Ljusstyrning", artno: "SK-LJS-DMX-0005", excl: 2499, desc: "Dubbla 15,4\u2033 touchsk\xE4rmar, 44 playbacks, 4\xD7 FastBlend RGB" }
  ].map((p) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": p.img, "name": p.name, "excl": p.excl, "desc": p.desc, "category": "DMX-styrning", "artno": p.artno, "modal": true, "specs": [p.desc] })}`)} </div> </section> ${renderComponent($$result2, "LjusTillbehor", $$LjusTillbehor, {})} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-ljus/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till ljus</a> <a href="/vara-tjanster/hyra-ljus/ljuseffekter/" class="border border-white/30 text-white hover:bg-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Lösa effekter →</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/fardiga-paket/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/fardiga-paket/index.astro";
const $$url = "/vara-tjanster/hyra-ljus/fardiga-paket/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
