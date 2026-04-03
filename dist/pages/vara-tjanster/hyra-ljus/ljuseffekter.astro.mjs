/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { a as ljusData, $ as $$Layout } from '../../../chunks/Layout_DH83owMh.mjs';
import { $ as $$CategoryHero } from '../../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$MediaCard } from '../../../chunks/MediaCard_D9M31j3v.mjs';
import { $ as $$LjusTillbehor } from '../../../chunks/LjusTillbehor_BfNmRSci.mjs';
import { $ as $$ElTillbehorCard } from '../../../chunks/ElTillbehorCard_cwYlohNI.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const WP = "/videos";
  const allEffekter = ljusData.effekter.products;
  function volRows(artno) {
    const p = allEffekter.find((x) => x.artno === artno);
    const tiers = p?.volumePricing;
    if (!tiers?.length) return [];
    return [{ label: "Volympriser", rows: tiers.map((t) => `${t.minQty} st \u2013 ${(t.unitPrice * t.minQty).toLocaleString("sv")} kr`) }];
  }
  function toCard(p) {
    return {
      id: p.slug,
      // cart-ID = slug — säkerställer match mot PROD_CATALOG
      title: p.name,
      artno: p.artno,
      img: p.image,
      excl: p.price,
      videos: p.video ? [`${WP}/${p.video}`] : [],
      rows: volRows(p.artno),
      bullets: p.includes ?? [],
      tag: p.tag
    };
  }
  const ledPar = allEffekter.filter((p) => p.group === "led-par").map(toCard);
  const specialEffekter = allEffekter.filter((p) => p.group === "special").map(toCard);
  const movingHeads = allEffekter.filter((p) => p.group === "moving-head").map(toCard);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyr L\xF6sa Ljuseffekter Stockholm \u2013 LED PAR, Moving Heads & Laser | Scenkonsult", "description": "Hyr l\xF6sa ljuseffekter i Stockholm fr\xE5n 79 kr/dygn. LED PAR, Moving Head, Scanner, Strobe, Laser, LED Bar. Volympriser. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Ljuseffekter", "h1Accent": "Stockholm", "intro": "Hyr l\xF6sa ljuseffekter i Stockholm. LED PAR, Moving Heads, stroboskop, UV, laser och scanners \u2013 bygg din egna ljussetup. Volympriser f\xF6r fler enheter. Leverans i hela Storstockholm.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "Hyra ljus", href: "/vara-tjanster/hyra-ljus/" },
    { label: "Ljuseffekter" }
  ], "badges": [
    "LED PAR & moving heads",
    "Stroboskop & UV & laser",
    "DMX-styrda",
    "Leverans i Storstockholm"
  ], "priceFrom": 79 })}  ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"> <h2 class="text-2xl font-bold text-white mb-6">LED PAR & armaturer</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${ledPar.map((p) => renderTemplate`${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": p.title, "images": [p.img], "videos": p.videos ?? [], "priceExcl": p.excl, "rows": p.rows, "bullets": p.bullets, "artno": p.artno, "category": "Ljuseffekter" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"> <h2 class="text-2xl font-bold text-white mb-6">Scanner, Strobe & Laser</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${specialEffekter.map((p) => renderTemplate`${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": p.title, "images": [p.img], "videos": p.videos ?? [], "priceExcl": p.excl, "rows": p.rows, "bullets": p.bullets, "artno": p.artno, "category": "Ljuseffekter" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6">Moving Heads</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${movingHeads.map((p) => renderTemplate`${renderComponent($$result2, "MediaCard", $$MediaCard, { "title": p.title, "tag": p.tag, "images": [p.img], "videos": p.videos ?? [], "priceExcl": p.excl, "rows": p.rows, "bullets": p.bullets, "artno": p.artno, "category": "Ljuseffekter" })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"> <div class="bg-brand-navy border border-white/10 rounded-2xl p-6"> <h2 class="text-xl font-bold text-white mb-2">Komplettera med stativ & tross</h2> <p class="text-gray-400 text-sm mb-4">Alla lösa armaturer behöver monteras på stativ eller tross. Se vårt sortiment av stativ, trosstorn och tillbehör.</p> <a href="/vara-tjanster/hyra-ljus/stativ-tross/" class="inline-block bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Se stativ & tross →</a> </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Ljusstyrning (DMX)</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"> ${[
    {
      img: "/images/ljus/pp_ljus_styrning02.png",
      name: "Styrenhet 192 kan.",
      artno: "SK-LJS-DMX-0001",
      excl: 99,
      desc: "Enkel DMX-kontroll f\xF6r upp till 12 scannrar \xD7 16 kanaler",
      specs: ["192 DMX-kanaler", "12 scannrar \xD7 16 kanaler", "240 sekvenser i 30 banker", "Musikstyrning via inbyggd mikrofon", "Standalone \u2013 ingen dator kr\xE4vs"]
    },
    {
      img: "/images/ljus/pp_ljus_botex_sdc16.png",
      name: "Botex SDC-16",
      artno: "SK-LJS-DMX-0002",
      excl: 199,
      desc: "16 individuella kanalfaders f\xF6r direkt manuell styrning",
      specs: ["192 DMX-kanaler", "16 individuella faders + masterfader", "Startkanal st\xE4lls via display", "Parallellstyrning av 16 enheter", "Rack-monterbar"]
    },
    {
      img: "/images/ljus/pp_ljus_styrning03.png",
      name: "Styrenhet 512 kan.",
      artno: "SK-LJS-DMX-0003",
      excl: 299,
      desc: "Professionell 512-kanalers DMX-kontroller f\xF6r medelstora produktioner",
      specs: ["512 DMX-kanaler", "Styr upp till 48 enheter", "4 600 scener i 96 banker", "Mjukpatch alla 512 kanaler", "Musikstyrning via inbyggd mikrofon", "LCD-display"]
    },
    {
      img: "/images/ljus/pp_ljus_styrning04.png",
      name: "PC-mjukvara + gr\xE4nssnitt",
      artno: "SK-LJS-DMX-0004",
      excl: 799,
      desc: "Professionell DMX-programvara med USB-gr\xE4nssnitt, 512 kanaler",
      specs: ["512 DMX-kanaler via USB", "Dra-och-sl\xE4pp programmering", "Ljud-till-ljus med BPM-analys", "Live-dimning och scen-uppspelning", "St\xF6der Moving Heads, dimmer, LED", "Inkl. Sunlite Suite 2 licens"]
    },
    {
      img: "/images/ljus/pp_ljus_styrning-m6.png",
      name: "Martin M6 Ljusstyrning",
      artno: "SK-LJS-DMX-0005",
      excl: 2499,
      desc: "Professionell konsol f\xF6r avancerade produktioner \u2013 dubbla touchsk\xE4rmar",
      specs: ['Dubbla 15,4" touchsk\xE4rmar', "44 playbacks med timing", "4\xD7 FastBlend RGB-faders", "12\xD7 FastDial rotary encoders", "4\xD7 FastTrack linj\xE4ra encoders", "Kompakt rackmonterad design", "St\xF6der Martin, Robe, Chauvet m.fl."]
    }
  ].map((p) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": p.img, "name": p.name, "excl": p.excl, "desc": p.desc, "category": "DMX-styrning", "artno": p.artno, "modal": true, "specs": p.specs })}`)} </div> </section> ${renderComponent($$result2, "LjusTillbehor", $$LjusTillbehor, {})} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-ljus/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till ljus</a> <a href="/vara-tjanster/hyra-ljus/fardiga-paket/" class="border border-white/30 text-white hover:bg-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Färdiga paket →</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/ljuseffekter/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/ljuseffekter/index.astro";
const $$url = "/vara-tjanster/hyra-ljus/ljuseffekter/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
