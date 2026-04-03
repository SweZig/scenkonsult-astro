import { c as createComponent, m as maybeRenderHead, b as renderComponent, r as renderTemplate } from './astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$ElTillbehorCard } from './ElTillbehorCard_cwYlohNI.mjs';

const $$LjusTillbehor = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- DMX-TILLBEHÖR — fullbredd -->${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">DMX-tillbehör</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"> ${[
    { img: "/images/ljus/pp_ljus_half_coupler.png", name: "Half Coupler 35/50 mm", artno: "SK-LJS-DMX-0001", excl: 20, desc: "per coupler" },
    { img: "/images/ljus/pp_ljus_kablar.png", name: "DMX-kabel 1\u20135 m", artno: "SK-LJS-DMX-0002", excl: 20, desc: "per kabel" },
    { img: "/images/ljus/pp_ljus_kablar.png", name: "DMX-kabel 10/15 m", artno: "SK-LJS-DMX-0003", excl: 40, desc: "per kabel" },
    { img: "/images/ljus/pp_ljus_tradlos01.png", name: "DMX Tr\xE5dl\xF6s startkit", artno: "SK-LJS-DMX-0004", excl: 159, desc: "1 s\xE4nd + 2 mot." },
    { img: "/images/ljus/pp_ljus_tradlos02.png", name: "DMX Tr\xE5dl\xF6s s\xE4ndare", artno: "SK-LJS-DMX-0005", excl: 80, desc: "extra s\xE4ndare" },
    { img: "/images/ljus/pp_ljus_tradlos03.png", name: "DMX Tr\xE5dl\xF6s mottagare", artno: "SK-LJS-DMX-0006", excl: 80, desc: "extra mottagare" }
  ].map((t) => renderTemplate`${renderComponent($$result, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "DMX-tillbeh\xF6r", "artno": t.artno })}`)} </div> </section> <!-- EL-TILLBEHÖR — fullbredd --> <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <h2 class="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-3">El-tillbehör</h2> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"> ${[
    { img: "/images/ljus/pp_ljus_powercon.png", name: "PowerCon 0,5\u20131,5 m", artno: "SK-LJS-EL-0001", excl: 20 },
    { img: "/images/ljus/pp_ljus_iec_kabel.png", name: "IEC C13/C14 0,5\u20131,5 m", artno: "SK-LJS-EL-0002", excl: 20 },
    { img: "/images/ljus/pp_el_grenuttag_sm.png", name: "Grenuttag 1,5 m", artno: "SK-LJD-EL-0001", excl: 20 },
    { img: "/images/ljus/pp_el_forlangning.png", name: "F\xF6rl\xE4ngning 10 m 1-fas", artno: "SK-LJD-EL-0002", excl: 48 },
    { img: "/images/ljus/pp_ljus_powercon2.png", name: "PowerCon 5\u201310 m", artno: "SK-LJS-EL-0003", excl: 80 },
    { img: "/images/ljus/pp_el_overloppsskydd.png", name: "\xD6verk\xF6rningsskydd 1 m", artno: "SK-LJD-EL-0008", excl: 80 },
    { img: "/images/ljus/pp_el_grenuttag_lg.png", name: "Grenuttag 10 m IP44", artno: "SK-LJD-EL-0003", excl: 100 },
    { img: "/images/ljus/pp_el_grenuttag_25m.png", name: "Grenuttag 25 m IP44", artno: "SK-LJD-EL-0004", excl: 159 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 20 m 3-fas 16A", artno: "SK-LJD-EL-0005", excl: 236 },
    { img: "/images/ljus/pp_el_omvandlare.png", name: "3-fas \u2192 1-fas omvandlare", artno: "SK-LJD-EL-0007", excl: 320 },
    { img: "/images/ljus/pp_el_forlangning_20m.png", name: "F\xF6rl\xE4ngning 20 m 3-fas 32A", artno: "SK-LJD-EL-0006", excl: 396 },
    { img: "/images/ljud/pp_ljud_tillbehor_elverk-small.png", name: "Elgenerator 2 200 W", artno: "SK-LJD-EL-0010", excl: 799 },
    { img: "/images/ljud/pp_ljud_elverk-kipor.png", name: "Elgenerator 7 700 W", artno: "SK-LJD-EL-0011", excl: 1799 },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_1L.png", name: "Ackrylatbensin 1 l", artno: "SK-LJS-ROK-ACC-0001", excl: 59, desc: "Aspen 4 \xB7 4-taktsmotorer" },
    { img: "/images/ljus/pp_ljus_ackrylatbensin_5L.png", name: "Ackrylatbensin 5 l", artno: "SK-LJS-ROK-ACC-0002", excl: 239, desc: "Aspen 4 \xB7 4-taktsmotorer" }
  ].map((t) => renderTemplate`${renderComponent($$result, "ElTillbehorCard", $$ElTillbehorCard, { "img": t.img, "name": t.name, "excl": t.excl, "desc": t.desc, "category": "El-tillbeh\xF6r", "artno": t.artno })}`)} </div> </section> <!-- Större event — 2-kolumn: text vänster, bild höger på mörk bakgrund --> <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="bg-brand-navy border border-white/10 rounded-2xl overflow-hidden"> <div class="grid grid-cols-1 md:grid-cols-2"> <div class="p-8 flex flex-col justify-center"> <h2 class="text-2xl font-bold text-white mb-3">Scenljus för konserter & större event</h2> <p class="text-gray-300 mb-2">Vi har scenljus för alla ändamål – vitt och färgat ljus på travers eller tross.</p> <p class="text-gray-400 text-sm mb-6">Beskriv ditt behov så tar vi fram lösningen. Större ljusriggar kräver transport och montering — tillkommer som tillägg.</p> <div> <a href="/kontakt/" class="inline-block bg-brand-orange hover:bg-brand-orange-light text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">Fråga om offert</a> </div> </div> <div class="hidden md:block"> <img src="/images/ljus/pp_ljus_storre_event.png" alt="Scenljus för konserter och större event" width="600" height="400" loading="lazy" class="w-full h-full object-cover"> </div> </div> </div> </section>`;
}, "/home/claude/scenkonsult-astro/src/components/LjusTillbehor.astro", void 0);

export { $$LjusTillbehor as $ };
