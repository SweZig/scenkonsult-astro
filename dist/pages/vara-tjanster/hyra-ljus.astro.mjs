/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$CategoryHero, a as $$Price } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$CartButton } from '../../chunks/CartButton_DI3Qn4Bk.mjs';
import { a as ljusData, $ as $$Layout } from '../../chunks/Layout_DH83owMh.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Hyra ljus Stockholm \u2013 paket och effekter",
    "description": ljusData.intro,
    "numberOfItems": ljusData.categories.length,
    "itemListElement": ljusData.categories.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Service",
        "name": c.name,
        "url": `https://scenkonsult.se/vara-tjanster/hyra-ljus/${c.slug}/`
      }
    }))
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ljusData.faq.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": ljusData.metaTitle, "description": ljusData.metaDescription, "schemaExtra": [pageSchema, faqSchema] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Hyra ljus", "h1Accent": "Stockholm", "intro": ljusData.intro, "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "V\xE5ra tj\xE4nster", href: "/vara-tjanster/" },
    { label: "Hyra ljus" }
  ], "badges": [
    "F\xE4rdiga paket \u2013 plug & play",
    "DMX & automatiska program",
    "Tekniker tillg\xE4nglig",
    "Leverans i Storstockholm"
  ] })} ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-8">Välj kategori</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${ljusData.categories.map((cat) => renderTemplate`<a${addAttribute(cat.href, "href")} class="bg-brand-navy border border-white/10 hover:border-brand-orange/50 rounded-2xl overflow-hidden transition-all group block"> <div class="h-40 bg-brand-dark overflow-hidden relative"> <img${addAttribute(cat.image, "src")}${addAttribute(cat.name, "alt")} width="600" height="333" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"> </div> <div class="p-5"> <h3 class="font-bold text-white text-lg group-hover:text-brand-orange transition-colors mb-2">${cat.name}</h3> <p class="text-gray-400 text-sm leading-relaxed mb-4">${cat.desc}</p> <span class="text-brand-orange text-sm font-semibold">Se sortiment →</span> </div> </a>`)} </div> </section> <section class="bg-brand-navy border-y border-white/10 py-14"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-2xl font-bold text-white mb-2">Populäraste paketen</h2> <p class="text-gray-400 mb-8">De vanligaste valen för bröllop, fester och konserter i Stockholm.</p> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> ${ljusData.paket.products.map((p) => renderTemplate`<article class="bg-brand-dark border border-white/10 hover:border-brand-orange/40 rounded-2xl p-5 transition-all" itemscope itemtype="https://schema.org/Product"> <meta itemprop="image"${addAttribute(p.image ? `https://scenkonsult.se${p.image}` : "https://scenkonsult.se/images/hero/scen3_hero.webp", "content")}> <meta itemprop="brand" content="Scenkonsult Norden"> <meta itemprop="description"${addAttribute(p.tagline ?? `Hyra ${p.name} \u2014 leverans i hela Storstockholm.`, "content")}> <span class="text-xs text-brand-orange font-bold uppercase tracking-wide">${p.guests}</span> <h3 class="font-bold text-white text-lg mt-1 mb-1" itemprop="name">${p.name}</h3> <p class="text-gray-400 text-xs mb-3">${p.tagline}</p> <ul class="space-y-1 mb-4"> ${p.includes.map((item) => renderTemplate`<li class="text-gray-400 text-xs flex gap-1.5"><span class="text-green-400 shrink-0">✓</span>${item}</li>`)} </ul> <div class="flex items-center justify-between border-t border-white/10 pt-4" itemprop="offers" itemscope itemtype="https://schema.org/Offer"> <meta itemprop="priceCurrency" content="SEK"> <meta itemprop="price"${addAttribute(String(p.price), "content")}> <meta itemprop="priceValidUntil" content="2027-12-31"> <meta itemprop="availability" content="https://schema.org/InStock"> <div itemprop="shippingDetails" itemscope itemtype="https://schema.org/OfferShippingDetails"> <div itemprop="shippingDestination" itemscope itemtype="https://schema.org/DefinedRegion"> <meta itemprop="addressCountry" content="SE"> </div> <div itemprop="shippingRate" itemscope itemtype="https://schema.org/MonetaryAmount"> <meta itemprop="currency" content="SEK"> <meta itemprop="value" content="0"> </div> <div itemprop="deliveryTime" itemscope itemtype="https://schema.org/ShippingDeliveryTime"> <div itemprop="handlingTime" itemscope itemtype="https://schema.org/QuantitativeValue"> <meta itemprop="minValue" content="0"> <meta itemprop="maxValue" content="1"> <meta itemprop="unitCode" content="DAY"> </div> <div itemprop="transitTime" itemscope itemtype="https://schema.org/QuantitativeValue"> <meta itemprop="minValue" content="0"> <meta itemprop="maxValue" content="1"> <meta itemprop="unitCode" content="DAY"> </div> </div> </div> <div itemprop="hasMerchantReturnPolicy" itemscope itemtype="https://schema.org/MerchantReturnPolicy"> <meta itemprop="applicableCountry" content="SE"> <meta itemprop="returnPolicyCategory" content="https://schema.org/MerchantReturnFiniteReturnWindow"> <meta itemprop="merchantReturnDays" content="1"> <meta itemprop="returnMethod" content="https://schema.org/ReturnInStore"> <meta itemprop="returnFees" content="https://schema.org/FreeReturn"> </div> <div> <span class="text-brand-orange font-extrabold text-xl">${renderComponent($$result2, "Price", $$Price, { "amount": p.price, "size": "xl", "suffix": p.priceNote })}</span> </div> ${renderComponent($$result2, "CartButton", $$CartButton, { "id": `ljus-${p.id ?? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, "name": p.name, "price": p.price, "priceNote": p.priceNote ?? "/dygn", "category": "Ljus", "image": p.image ?? "", "size": "md" })} </div> </article>`)} </div> <div class="mt-6 text-center"> <a href="/vara-tjanster/hyra-ljus/fardiga-paket/" class="text-brand-orange hover:text-white transition-colors text-sm font-semibold">Se alla ljuspaket →</a> </div> </div> </section> <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14"> <div class="bg-brand-navy border border-white/10 rounded-2xl p-8"> <h2 class="text-2xl font-bold text-white mb-4">Vad ingår alltid?</h2> <div class="text-gray-400 text-sm leading-relaxed space-y-3"> <p>Alla ljuspaket levereras komplett med stativer, kablar och adaptrar – testat och kalibrerat. Färdiga festpaket har automatiska program som kör sig självt, utan behov av ljustekniker.</p> <p>Vill du ha mer kontroll finns DMX-kontroller att hyra, och vi erbjuder ljustekniker för professionella events. Vi levererar till hela Storstockholm.</p> <p class="font-medium text-gray-300">Alla priser gäller per dygn (22 timmar). Hämtning från kl 13:00, återlämning innan kl 11:00 nästa dag.</p> </div> <div class="flex flex-wrap gap-4 mt-6"> <a href="/bokningssida/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-6 py-3 rounded-xl font-semibold transition-colors">Boka ljusutrustning</a> <a href="/kontakt/" class="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors">Fråga om offert</a> </div> </div> </section> <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-8">Vanliga frågor om ljushyrning</h2> <div class="space-y-4"> ${ljusData.faq.map((f) => renderTemplate`<details class="bg-brand-navy border border-white/10 rounded-xl overflow-hidden group"> <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-white hover:text-brand-orange transition-colors list-none"> ${f.q} <span class="text-brand-orange ml-4 shrink-0 group-open:rotate-45 transition-transform">+</span> </summary> <div class="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4">${f.a}</div> </details>`)} </div> </section> <section class="bg-brand-navy border-t border-white/10 py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-xl font-bold text-white mb-6">Komplettera med</h2> <div class="flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-scen/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">🎭 Hyra scen</a> <a href="/vara-tjanster/hyra-ljud/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">🔊 Hyra ljud</a> <a href="/vara-tjanster/hyra-dj/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">🎛 Hyra DJ-utrustning</a> <a href="/vara-tjanster/hyra-bild-projektorer-skarmar/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">📽 Hyra projektor</a> </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/hyra-ljus/index.astro";
const $$url = "/vara-tjanster/hyra-ljus/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
