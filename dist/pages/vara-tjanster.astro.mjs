/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Qdf46Cx6.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const kategorier = [
    {
      rubrik: "Scener",
      beskrivning: "V\xE5rt ursprung. Fr\xE5n 4m\xB2 podie till 48m\xB2 XL-scen med tak. Vi har scener f\xF6r inomhus och utomhus, med eller utan scentak, halkfria ytor och professionell finish. Beskriv ditt behov s\xE5 presenterar vi en l\xF6sning.",
      href: "/vara-tjanster/hyra-scen/",
      fran: "599 kr/dygn",
      icon: "\u{1F3AD}",
      tjanster: ["Scenpaket Small \u2192 XL+", "Scen med tak", "Inomhus & utomhus", "Leverans & montering"]
    },
    {
      rubrik: "Ljud",
      beskrivning: "Noggrant utvalda professionella varum\xE4rken. Fr\xE5n kompakta anl\xE4ggningar f\xF6r tal och mingel till kraftfulla PA-system f\xF6r konserter och festival. Vi t\xE4cker event, live, DJ/musik och portabelt ljud.",
      href: "/vara-tjanster/hyra-ljud/",
      fran: "Offert",
      icon: "\u{1F50A}",
      tjanster: [
        { label: "Event / tal & konferens", href: "/vara-tjanster/hyra-ljud/event/" },
        { label: "Live / band & konsert", href: "/vara-tjanster/hyra-ljud/live/" },
        { label: "Musik / DJ & dans", href: "/vara-tjanster/hyra-ljud/music/" },
        { label: "Portabelt ljud", href: "/vara-tjanster/hyra-ljud/portable/" }
      ]
    },
    {
      rubrik: "Ljus",
      beskrivning: "R\xE4tt ljuss\xE4ttning f\xF6rvandlar vilken lokal som helst. Moving heads, PAR-lampor, laser, stroboskop, r\xF6k, pyroteknik \u2013 vi har f\xE4rdiga paket och l\xF6sa effekter f\xF6r alla typer av event.",
      href: "/vara-tjanster/hyra-ljus/",
      fran: "Offert",
      icon: "\u{1F4A1}",
      tjanster: [
        { label: "F\xE4rdiga ljuspaket", href: "/vara-tjanster/hyra-ljus/fardiga-paket/" },
        { label: "L\xF6sa ljuseffekter", href: "/vara-tjanster/hyra-ljus/ljuseffekter/" },
        { label: "R\xF6k & pyroteknik", href: "/vara-tjanster/hyra-ljus/rok-pyro/" },
        { label: "Stativ & tross", href: "/vara-tjanster/hyra-ljus/stativ-tross/" }
      ]
    },
    {
      rubrik: "Bild \u2013 Projektorer & Sk\xE4rmar",
      beskrivning: "HD/4K-projektorer, Samsung professionella displaysk\xE4rmar och moduluppbyggd LED-v\xE4gg. Perfekt f\xF6r presentationer, konferenser, produktlanseringar och storbildsvisning p\xE5 event.",
      href: "/vara-tjanster/hyra-bild-projektorer-skarmar/",
      fran: "Offert",
      icon: "\u{1F4FD}\uFE0F",
      tjanster: ["HD/4K projektorer", "Professionella sk\xE4rmar", "LED-v\xE4gg", "Duk & stativ"]
    },
    {
      rubrik: "Professionella DJs",
      beskrivning: "Erfarna DJs till br\xF6llop, privata fester och f\xF6retagsevent. Vi har DJs som t\xE4cker allt fr\xE5n 80-tal till idag. V\xE4lj junior, senior eller PRO-DJ beroende p\xE5 behov och budget.",
      href: "/vara-tjanster/hyra-dj/",
      fran: "2 995 kr",
      icon: "\u{1F3A7}",
      tjanster: ["Junior DJ", "Senior DJ", "PRO DJ med tekniker", "Boka DJ-utrustning sj\xE4lv"]
    },
    {
      rubrik: "Komplett event",
      beskrivning: "Vill du slippa hantera flera leverant\xF6rer? Vi tar ett helhetsansvar f\xF6r scen, ljud, ljus, bild och DJ. En kontaktperson, ett avtal, ett prisf\xF6rslag \u2013 allt p\xE5 plats n\xE4r du beh\xF6ver det.",
      href: "/kontakt/",
      fran: "Offert",
      icon: "\u{1F3AA}",
      tjanster: ["Scen + ljud + ljus", "DJ ing\xE5r vid \xF6nskan", "Leverans & montering", "Tekniker p\xE5 plats"]
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "V\xE5ra tj\xE4nster \u2013 Hyra Scen, Ljud, Ljus & DJ Stockholm | Scenkonsult", "description": "Komplett scenproduktion i Stockholm. Hyr scen, ljud, ljus, projektorer och DJ f\xF6r fest, br\xF6llop, event och konsert. Leverans i hela Storstockholm. Sedan 1986." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" style="padding-top:calc(var(--nav-offset,166px) + 2.5rem)"> <nav class="text-sm text-gray-400 mb-8" aria-label="Brödsmulor"> <a href="/" class="hover:text-gray-300">Hem</a> <span class="mx-2">/</span> <span class="text-white">Våra tjänster</span> </nav> <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-4" style="font-family:'DM Serif Display',serif">Våra tjänster</h1> <p class="text-gray-400 text-lg max-w-3xl mb-12">
Vi är er kompletta partner för scenproduktion – oavsett om det gäller en privat fest för 20 eller ett stort utomhurevent för 2 000 gäster. Välj bland kategorierna nedan eller <a href="/kontakt/" class="hover:underline" style="color:#c4b5f4">kontakta oss</a> för ett komplett paket.
</p> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"> ${kategorier.map((k) => renderTemplate`<div${addAttribute(`window.location='${k.href}'`, "onclick")} class="group flex flex-col rounded-2xl p-6 transition-all border cursor-pointer hover:border-opacity-40" style="background:#1e1850;border-color:rgba(255,255,255,0.08)" onmouseover="this.style.borderColor='rgba(196,181,244,0.35)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'"> <div class="flex items-start justify-between mb-4"> <div class="flex items-center gap-3"> <span class="text-3xl">${k.icon}</span> <div> <h2 class="text-white font-bold text-lg group-hover:text-brand-orange transition-colors">${k.rubrik}</h2> <span class="text-xs font-semibold" style="color:#c4b5f4">Från ${k.fran}</span> </div> </div> <span class="text-gray-400 group-hover:text-brand-orange transition-colors text-sm mt-1">Läs mer →</span> </div> <p class="text-gray-400 text-sm leading-relaxed mb-4 flex-1">${k.beskrivning}</p> <div class="flex flex-wrap gap-2 pt-4 border-t border-white/5"> ${k.tjanster.map((t) => typeof t === "object" ? renderTemplate`<a${addAttribute(t.href, "href")} onclick="event.stopPropagation()" class="text-xs px-2.5 py-1 rounded-full transition-colors hover:bg-brand-orange/20" style="background:rgba(196,181,244,0.1);color:rgba(196,181,244,0.7)"> ${t.label} </a>` : renderTemplate`<span class="text-xs px-2.5 py-1 rounded-full" style="background:rgba(196,181,244,0.1);color:rgba(196,181,244,0.7)"> ${t} </span>`)} </div> </div>`)} </div> </div>  <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"> ${[
    { icon: "\u{1F69A}", rubrik: "Leverans i hela Storstockholm", text: "Vi k\xF6r ut, riggar och h\xE4mtar tillbaka. Leverans fr\xE5n 1 118 kr." },
    { icon: "\u{1F527}", rubrik: "Montering ing\xE5r vid behov", text: "V\xE4lj sj\xE4lvinstallation eller l\xE5t oss sk\xF6ta det \u2013 600 kr/tim." },
    { icon: "\u{1F4DE}", rubrik: "Jour kv\xE4llstid", text: "Vi finns tillg\xE4ngliga under hela din hyresperiod om n\xE5got kr\xE5nglar." }
  ].map((u) => renderTemplate`<div class="flex gap-4 rounded-2xl p-5" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <span class="text-2xl shrink-0">${u.icon}</span> <div> <div class="font-bold text-white text-sm mb-1">${u.rubrik}</div> <div class="text-gray-400 text-sm">${u.text}</div> </div> </div>`)} </div>  <div class="rounded-2xl p-8 text-center" style="background:linear-gradient(135deg,#1e1850,#0c0a24);border:1px solid rgba(196,181,244,0.2)"> <h2 class="text-2xl font-bold text-white mb-3">Osäker på vad du behöver?</h2> <p class="text-gray-400 mb-6">Beskriv ditt event – datum, plats, antal gäster och typ av event – så tar vi fram ett komplett förslag inom ett par timmar.</p> <div class="flex flex-wrap gap-4 justify-center"> <a href="/kontakt/" class="px-6 py-3 rounded-xl font-semibold transition-colors" style="background:#c4b5f4;color:#0c0a24">
Boka eller fråga om pris
</a> <a data-tel="MDcyNDQ4MTAwMA==" data-prefix="📞 " data-label="072-448 10 00" href="#tel" class="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors" style="cursor:pointer"><noscript>072-448 10 00</noscript></a> </div> </div> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/vara-tjanster/index.astro";
const $$url = "/vara-tjanster/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
