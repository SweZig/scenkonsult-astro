/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { s as scenData, $ as $$Layout } from '../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ProductCard } from '../../chunks/ProductCard_OJnWGbO_.mjs';
import { $ as $$ElTillbehorCard } from '../../chunks/ElTillbehorCard_CS8VZJ6s.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Scenpaket f\xF6r uthyrning i Stockholm",
    "description": scenData.intro,
    "numberOfItems": scenData.products.length,
    "itemListElement": scenData.products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": `${p.name} \u2013 ${p.size}`,
        "description": p.description,
        "image": `https://scenkonsult.se${p.image}`,
        "brand": { "@type": "Brand", "name": "Scenkonsult Norden" },
        "offers": {
          "@type": "Offer",
          "price": String(p.price),
          "priceCurrency": "SEK",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": "Scenkonsult Norden" },
          "url": `https://scenkonsult.se/vara-tjanster/hyra-scen/#${p.id}`
        }
      }
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": scenData.metaTitle, "description": scenData.metaDescription, "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Hyra scen", "h1Accent": "Stockholm", "intro": scenData.intro, "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "V\xE5ra tj\xE4nster", href: "/vara-tjanster/" },
    { label: "Hyra scen" }
  ], "badges": [
    "Halkfria ytor \u2013 inomhus & utomhus",
    "Leverans & montering tillg\xE4ngligt",
    "Scentak till alla storlekar"
  ], "priceFrom": 599 })}  ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${scenData.products.map((p) => renderTemplate`<div${addAttribute(p.id, "id")}> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": `scen-${p.id}`, "artno": p.artno, "name": p.name, "price": p.price, "priceNote": `/${p.priceNote ?? "dygn"}`, "image": p.image, "alt": p.alt, "description": p.description, "category": "Scen", "bulky": p.bulky ?? false, "monteringMin": p.monteringMin, "dimensionTable": [
    { label: "Storlek", value: p.size },
    { label: "M\xE5tt", value: p.dimensions },
    { label: "H\xF6jd", value: p.heights.join(" / ") },
    { label: "Kapacitet", value: p.capacity },
    {
      label: "Transport",
      value: p.transport === "ing\xE5r" ? "Kr\xE4vs \u2013 tillkommer som till\xE4gg" : "Till\xE4ggstj\xE4nst",
      highlight: p.transport === "ing\xE5r"
    }
  ] })} </div>`)} </div> </section>  <section class="bg-brand-navy border-y border-white/10 py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold text-white mb-6">Tillbehör</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"> ${scenData.accessories.map((a) => renderTemplate`${renderComponent($$result2, "ElTillbehorCard", $$ElTillbehorCard, { "img": a.image, "name": a.name, "excl": a.price, "desc": a.description, "category": "Scen tillbeh\xF6r", "artno": a.artno })}`)} </div> </div> </section>  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14"> <div class="bg-brand-navy border border-white/10 rounded-2xl p-8"> <h2 class="text-2xl font-bold text-white mb-4">Generell information om våra scener</h2> <div class="text-gray-400 text-sm leading-relaxed space-y-3"> <p>Kontakta oss för hjälp med att planera eventet så det blir optimalt. Alla scener har halkfria ytor och passar för inomhus- och utomhusbruk.</p> <p>Scener upp till 12m² (Medium+) finns i 40 eller 60 cm höjd. Större scener finns i 60 eller 80 cm. Observera att scenräcken krävs för scener över 80 cm enligt Boverket.</p> <p>För scener från 20m² (Large) tillkommer alltid transport, montering och demontering av vår personal. Vi har scentak för alla storlekar – upp till 100m² på förfrågan.</p> <p class="font-medium text-gray-300">Alla priser gäller hyra per dygn (22 timmar). Hämtning från kl 13:00, återlämning innan kl 11:00 nästkommande dag. Längre perioder offerteras separat.</p> </div> <div class="flex flex-wrap gap-4 mt-6"> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-6 py-3 rounded-xl font-semibold transition-colors">
Boka scen
</a> <a href="/kontakt/" class="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors">
Fråga om offert
</a> <a href="/hyresvillkor/" class="text-brand-gray hover:text-white px-2 py-3 text-sm transition-colors">
Läs hyresvillkoren →
</a> </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-scen/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-scen/index.astro";
const $$url = "/vara-tjanster/hyra-scen/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
