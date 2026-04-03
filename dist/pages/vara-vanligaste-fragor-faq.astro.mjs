/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DH83owMh.mjs';
import { s as site } from '../chunks/site_DPeIeR2P.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": site.faq.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Vanliga fr\xE5gor om hyra scen, ljud & ljus i Stockholm | Scenkonsult FAQ", "description": "Svar p\xE5 de vanligaste fr\xE5gorna om att hyra scen, ljud och ljus i Stockholm. Hyresperiod, installation, leverans, priser och bokning. Scenkonsult sedan 1986.", "schemaExtra": faqSchema }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 text-sm text-gray-400" style="padding-top:calc(var(--nav-offset,166px) + 1.5rem)" aria-label="Brödsmulor"> <a href="/" class="hover:text-gray-300">Hem</a> /
<span class="text-white ml-2">Vanliga frågor (FAQ)</span> </nav> <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <h1 class="text-4xl font-extrabold text-white mb-3">Vanliga frågor</h1> <p class="text-gray-400 mb-10 text-lg">Här svarar vi på de frågor vi får mest – om bokning, installation, leverans och mer. Hittar du inte svar på din fråga? <a href="/kontakt/" class="text-brand-orange hover:underline">Kontakta oss</a>.</p> <div class="space-y-4" itemscope itemtype="https://schema.org/FAQPage"> ${site.faq.map((f, i) => renderTemplate`<details class="bg-brand-navy border border-white/10 hover:border-brand-orange/30 rounded-2xl overflow-hidden group transition-colors" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"> <summary class="flex items-center justify-between p-5 cursor-pointer list-none"> <h2 class="text-white font-semibold text-lg pr-4 group-open:text-brand-orange transition-colors" itemprop="name"> ${f.q} </h2> <span class="text-brand-orange shrink-0 transition-transform group-open:rotate-180 text-xl">▾</span> </summary> <div class="px-5 pb-5 text-gray-400 leading-relaxed" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"> <p itemprop="text">${f.a}</p> </div> </details>`)} </div> <div class="mt-12 bg-brand-navy border border-white/10 rounded-2xl p-8 text-center"> <h2 class="text-white font-bold text-xl mb-3">Har du fler frågor?</h2> <p class="text-gray-400 mb-6">Vi svarar i regel inom ett par timmar – välkommen att höra av dig!</p> <div class="flex flex-wrap justify-center gap-4"> <a href="/kontakt/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-6 py-3 rounded-xl font-semibold transition-colors">
Kontakta oss
</a> <a data-tel="MDcyNDQ4MTAwMA==" data-prefix="📞 " data-label="072-448 10 00" href="#tel" class="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors" style="cursor:pointer"><noscript>072-448 10 00</noscript></a> </div> </div> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-vanligaste-fragor-faq/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-vanligaste-fragor-faq/index.astro";
const $$url = "/vara-vanligaste-fragor-faq/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
