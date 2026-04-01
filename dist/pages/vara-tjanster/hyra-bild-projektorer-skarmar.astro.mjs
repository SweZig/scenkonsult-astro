/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout, b as bildData } from '../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ProductCard } from '../../chunks/ProductCard_OJnWGbO_.mjs';
import { $ as $$ElTillbehorCard } from '../../chunks/ElTillbehorCard_CS8VZJ6s.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyr Projektor & Storbildssk\xE4rm Stockholm \u2013 LED-v\xE4gg & Trailerscen | Scenkonsult", "description": "Hyr projektor, storbildssk\xE4rm, LED-v\xE4gg och trailerscen f\xF6r event och konferenser i Stockholm. Projektor fr 299 kr/dygn. Leverans i hela Storstockholm." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Hyr Projektor & Sk\xE4rm", "h1Accent": "Stockholm", "intro": "Hyr projektor, storbildssk\xE4rm eller moduluppbyggd LED-v\xE4gg f\xF6r konferens, presentation och event i Stockholm. Vi levererar hela l\xF6sningen med stativ, duk och kablar. Transport och montering finns som till\xE4ggstj\xE4nst.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "V\xE5ra tj\xE4nster", href: "/vara-tjanster/" },
    { label: "Hyr bild, projektorer & sk\xE4rmar" }
  ], "badges": [
    "3 500\u201312 000 ANSI lumen",
    "Full HD och 4K",
    "LED-v\xE4gg & trailerscen",
    "Leverans i Storstockholm"
  ], "priceFrom": 299 })}  ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${bildData.products.map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": p.slug, "artno": p.artno, "name": p.name, "price": p.price, "priceNote": p.priceNote, "image": p.image, "alt": p.alt, "description": p.description, "specs": p.includes, "category": "Projektor & sk\xE4rm", "bulky": p.bulky })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${bildData.tillbehor.map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.image, "name": t.name, "excl": t.price, "desc": t.desc, "category": "Projektor tillbeh\xF6r", "artno": t.artno })}`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">El-tillbehör</h2> <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3"> ${[
    { img: "/images/ljus/pp_el_grenuttag_sm.png", name: "Grenuttag 1,5 m", excl: 20 },
    { img: "/images/ljus/pp_el_forlangning.png", name: "F\xF6rl\xE4ngning 10 m 1-fas", excl: 48 },
    { img: "/images/ljus/pp_el_overloppsskydd.png", name: "\xD6verk\xF6rningsskydd 1 m", excl: 80 },
    { img: "/images/ljus/pp_el_grenuttag_lg.png", name: "Grenuttag 10 m IP44", excl: 100 },
    { img: "/images/ljus/pp_el_grenuttag_25m.png", name: "Grenuttag 25 m IP44", excl: 159 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 16A", excl: 236 },
    { img: "/images/ljus/pp_el_omvandlare.png", name: "Str\xF6momvandlare 3-fas\u21921-fas", excl: 320 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 3-fas 32A", excl: 396 },
    { img: "/images/ljud/pp_ljud_tillbehor_elverk-small.png", name: "Elgenerator 2 200 W", excl: 799 },
    { img: "/images/ljud/pp_ljud_elverk-kipor.png", name: "Elgenerator 7 700 W", excl: 1799 },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_1L.png", name: "Ackrylatbensin 1 l", excl: 59, desc: "Aspen 4" },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_5L.png", name: "Ackrylatbensin 5 l", excl: 239, desc: "Aspen 4" }
  ].map((t) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "El-tillbeh\xF6r" })}`)} </div> </section> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap gap-4"> <a href="/vara-tjanster/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">← Tillbaka till tjänster</a> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Boka nu</a> <a href="/kontakt/" class="border border-white/30 text-white hover:bg-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Fråga om offert</a> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-bild-projektorer-skarmar/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-bild-projektorer-skarmar/index.astro";
const $$url = "/vara-tjanster/hyra-bild-projektorer-skarmar/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
