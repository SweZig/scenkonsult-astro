/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DH83owMh.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Feedback | Scenkonsult Norden", "description": "L\xE4mna feedback till Scenkonsult Norden \u2014 om sortiment, priser, hemsidan eller ber\xF6m. Vi tar all feedback p\xE5 allvar." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-14" style="padding-top:calc(var(--nav-offset,166px) + 2.5rem)"> <nav class="text-sm text-gray-400 mb-8"> <a href="/" class="hover:text-gray-300">Hem</a> <span class="mx-2">/</span> <span class="text-white">Feedback</span> </nav> <h1 class="text-4xl font-extrabold text-white mb-3" style="font-family:'DM Serif Display',serif">Vi älskar feedback!</h1> <p class="text-gray-400 text-lg mb-10">Din åsikt hjälper oss bli bättre. Lämna beröm, förbättringsförslag eller berätta vad vi kan göra annorlunda — vi läser allt.</p> <div class="rounded-2xl p-8" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <!-- Honeypot --> <input type="text" id="fb-website" name="website" style="display:none" tabindex="-1" autocomplete="off"> <div class="mb-6"> <label class="block text-sm font-medium text-gray-300 mb-3">Vad handlar din feedback om? *</label> <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="feedbackTypes"> ${["Sortiment (jag saknar n\xE5got)", "Priser (n\xE5got skiljer mot andra)", "Hemsidan (n\xE5got \xE4r fel/otydligt)", "Ber\xF6m \u2013 detta vill jag hylla!", "Leverans & service", "Annat"].map((t) => renderTemplate`<label class="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08)"> <input type="radio" name="feedbackType"${addAttribute(t, "value")} class="accent-[#c4b5f4]"> <span class="text-gray-300 text-sm">${t}</span> </label>`)} </div> </div> <div class="mb-5"> <label class="block text-sm font-medium text-gray-300 mb-2" for="fb-text">Beskriv din feedback *</label> <textarea id="fb-text" rows="5" placeholder="Skriv gärna så detaljerat du kan — det hjälper oss förstå och agera..." class="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none resize-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"></textarea> </div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"> <div> <label class="block text-xs text-gray-400 mb-1" for="fb-name">Namn (valfri)</label> <input id="fb-name" type="text" placeholder="Förnamn Efternamn" class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> </div> <div> <label class="block text-xs text-gray-400 mb-1" for="fb-email">E-post (om du vill ha svar)</label> <input id="fb-email" type="email" placeholder="din@epost.se" class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> </div> </div> <label class="send-copy-label"> <input type="checkbox" id="sendCopyCheck"> <span>Sänd en kopia till mig</span> </label> <button id="fbSend" class="w-full py-3.5 rounded-xl font-bold text-lg transition-colors cursor-pointer" style="background:#c4b5f4;color:#0c0a24;border:none">
Skicka feedback
</button> <p class="text-xs text-gray-600 text-center mt-3">Vi läser och agerar på all feedback vi får in.</p> </div> </div>  ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/feedback/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/feedback/index.astro";
const $$url = "/feedback/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
