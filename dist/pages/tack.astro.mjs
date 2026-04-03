/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DH83owMh.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tack f\xF6r din f\xF6rfr\xE5gan \u2014 Scenkonsult Norden", "description": "Vi \xE5terkommer inom kort med offert." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<main style="padding-top:calc(var(--nav-offset,166px) + 2.5rem); min-height: 70vh;"> <div class="max-w-2xl mx-auto px-6 py-20 text-center"> <div class="mb-8 flex justify-center"> <div style="width:80px;height:80px;border-radius:50%;background:rgba(196,181,244,0.15);border:2px solid rgba(196,181,244,0.4);display:flex;align-items:center;justify-content:center;"> <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4b5f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <polyline points="20 6 9 17 4 12"></polyline> </svg> </div> </div> <h1 class="text-4xl font-bold text-white mb-4" style="font-family:'DM Serif Display',serif;">
Tack f\xF6r din f\xF6rfr\xE5gan!
</h1> <p class="text-gray-400 text-lg mb-8">
Vi \xE5terkommer inom kort \u2014 normalt samma dag om du h\xF6r av dig p\xE5 vardagar.
</p> <div class="bg-brand-navy border border-white/10 rounded-2xl p-6 mb-10 text-left space-y-3"> <p class="text-gray-400 text-sm"> <span class="text-white font-semibold">Vad h\xE4nder nu?</span> </p> <ul class="space-y-2 text-gray-400 text-sm"> <li class="flex gap-2"><span class="text-brand-orange">\u2192</span> Vi granskar din f\xF6rfr\xE5gan och kontrollerar tillg\xE4nglighet</li> <li class="flex gap-2"><span class="text-brand-orange">\u2192</span> Du f\xE5r en offert med specificerade priser (exkl. och inkl. moms)</li> <li class="flex gap-2"><span class="text-brand-orange">\u2192</span> Inget \xE4r bindande f\xF6rr\xE4n du godk\xE4nner offerten</li> </ul> </div> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/" class="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/20 hover:border-brand-orange/40 transition-colors">
\u2190 Tillbaka till startsidan
</a> <a href="/vara-tjanster/" class="inline-block px-6 py-3 rounded-xl text-sm font-semibold bg-brand-orange text-brand-dark hover:bg-brand-orange-light transition-colors">
Se alla tj\xE4nster
</a> </div> </div> </main> <script>
  try { localStorage.removeItem('sk-cart'); } catch(e) {}
<\/script> `])), maybeRenderHead()) })}`;
}, "/home/claude/scenkonsult-astro/src/pages/tack/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/tack/index.astro";
const $$url = "/tack/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
