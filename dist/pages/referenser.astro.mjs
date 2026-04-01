/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Qdf46Cx6.mjs';
import { s as site } from '../chunks/site_DPeIeR2P.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const { clients, reviews } = site;
  const eventGallery = [
    {
      src: "/images/event/festival_vinterviken.webp",
      alt: "Scenuppbyggnad vid Vintervikens tr\xE4dg\xE5rd",
      label: "Festival \u2013 Vinterviken",
      desc: "Scen & ljud, Vasas Flora & Fauna m.fl.",
      tag: "Festival"
    },
    {
      src: "/images/event/skridskodisco_ostermalm_1.webp",
      alt: "Skridskodisco p\xE5 \xD6stermalms IP",
      label: "Skridskodisco \u2013 \xD6stermalms IP",
      desc: "Stockholms Stad, \xE5terkommande event",
      tag: "F\xF6retagsevent"
    },
    {
      src: "/images/event/kundevent_abg.webp",
      alt: "Kundevent med ABG Sundal Collier",
      label: "Kundevent \u2013 ABG Sundal Collier",
      desc: "Ljud & ljus, exklusivt inomhusevent",
      tag: "F\xF6retagsevent"
    },
    {
      src: "/images/event/kundevent_djursholms_slott.webp",
      alt: "Event p\xE5 Djursholms Slott",
      label: "Djursholms Slott",
      desc: "Galakv\xE4ll, scenljus & PA-system",
      tag: "F\xF6retagsevent"
    },
    {
      src: "/images/event/kundevent_lakarforbundet.webp",
      alt: "Kundevent p\xE5 L\xE4karf\xF6rbundets festv\xE5ning \xD6stermalm",
      label: "L\xE4karf\xF6rbundet \u2013 \xD6stermalm",
      desc: "Festv\xE5ning, komplett ljud & ljus",
      tag: "F\xF6retagsevent"
    },
    {
      src: "/images/event/uf_strawberry_arena_1.webp",
      alt: "Ung F\xF6retagsamhet p\xE5 Strawberry Arena",
      label: "Strawberry Arena \u2013 UF",
      desc: "Ung F\xF6retagsamhet, stor scen & PA",
      tag: "Konferens"
    },
    {
      src: "/images/event/uf_strawberry_arena_2.webp",
      alt: "Ung F\xF6retagsamhet scensetup Strawberry Arena",
      label: "Strawberry Arena \u2013 UF setup",
      desc: "Ung F\xF6retagsamhet, scen & ljusrigg",
      tag: "Konferens"
    },
    {
      src: "/images/event/skridskodisco_ostermalm_2.webp",
      alt: "Skridskodisco setup \xD6stermalms IP",
      label: "Skridskodisco \u2013 setup",
      desc: "Stockholms Stad, DJ & ljud utomhus",
      tag: "Festival"
    }
  ];
  const clientCategories = [
    {
      label: "Kommuner & Myndigheter",
      icon: "\u{1F3DB}\uFE0F",
      clients: ["Solna Stad", "Stockholm Stad", "Haninge Kommun", "Tyres\xF6 Kommun", "Solna Tingsr\xE4tt"]
    },
    {
      label: "N\xE4ringsliv & F\xF6retag",
      icon: "\u{1F3E2}",
      clients: ["ICA Sverige", "ABG Sundal Collier", "Akademiska Hus", "Hornbach", "Houdini Sportsware", "Kameo", "iOffice", "Backingminds", "Kustom", "Ekologigruppen", "Linnskog-Rudh & Partner"]
    },
    {
      label: "Ambassader & Org.",
      icon: "\u{1F30D}",
      clients: ["Brasiliens Ambassad", "Indiens Ambassad", "Kommunalarbetaref\xF6rbundet", "M\xE4lardalens Universitet", "Forum Civ", "Ung F\xF6retagsamhet", "Milj\xF6partiet", "V\xE4nsterpartiet", "Vision", "Odd Fellow", "Korpen"]
    },
    {
      label: "Event & Kultur",
      icon: "\u{1F3B6}",
      clients: ["Aiva Productions", "Immersive Music Group", "Favorevent", "Hacksaw Studios", "Cash In Drop Out", "A Beautiful Soap"]
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "V\xE5ra referenser \u2013 Scenkonsult Norden",
    "description": "Se hur Scenkonsult Norden hj\xE4lpt kommuner, ambassader, f\xF6retag och privatpersoner med ljud, ljus, scen och DJ sedan 1986.",
    "url": "https://scenkonsult.se/referenser/"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "V\xE5ra referenser \u2013 Scenkonsult Norden | Ljud, Ljus & Scen sedan 1986", "description": "Se hur vi hj\xE4lpt Stockholm Stad, ICA Sverige, ambassader, kommuner och hundratals privatpersoner med professionell eventproduktion. Scenkonsult Norden \u2013 sedan 1986.", "schema": pageSchema }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2" style="padding-top:calc(var(--nav-offset,166px) + 1.5rem)" aria-label="Brödsmulor"> <ol class="flex items-center gap-2 text-sm text-gray-400" itemscope itemtype="https://schema.org/BreadcrumbList"> <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"> <a href="/" class="hover:text-gray-300 transition-colors" itemprop="item"><span itemprop="name">Hem</span></a> <meta itemprop="position" content="1"> </li> <span>/</span> <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"> <span class="text-white" itemprop="name">Referenser</span> <meta itemprop="position" content="2"> </li> </ol> </nav>  <header class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <p class="text-sm font-semibold uppercase tracking-wide mb-3" style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif">Förtroende sedan 1986</p> <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-6" style="font-family:'DM Serif Display',serif">
Våra <span style="color:#c4b5f4">Kunder &amp; Uppdrag</span> </h1> <p class="text-gray-300 text-xl leading-relaxed mb-8">
Från ambassader och kommuner till bröllopssällskap och festivaler — vi har levererat professionell scen, ljud och ljus till hundratals nöjda kunder i Storstockholm.
</p> <!-- Trust stats-rad --> <div class="flex flex-wrap gap-6"> <div class="flex items-center gap-2"> <span class="text-2xl font-extrabold" style="color:#c4b5f4">100+</span> <span class="text-gray-400 text-sm">privatpersoner</span> </div> <div class="w-px bg-white/10 hidden sm:block"></div> <div class="flex items-center gap-2"> <span class="text-2xl font-extrabold" style="color:#c4b5f4">100+</span> <span class="text-gray-400 text-sm">uppdrag/år</span> </div> <div class="w-px bg-white/10 hidden sm:block"></div> <div class="flex items-center gap-2"> <span class="text-2xl font-extrabold" style="color:#c4b5f4">50+</span> <span class="text-gray-400 text-sm">referenskunder</span> </div> <div class="w-px bg-white/10 hidden sm:block"></div> <div class="flex items-center gap-2"> <span class="text-2xl font-extrabold" style="color:#c4b5f4">1986</span> <span class="text-gray-400 text-sm">grundat</span> </div> <div class="w-px bg-white/10 hidden sm:block"></div> <div class="flex items-center gap-2"> <span class="text-2xl font-extrabold" style="color:#c4b5f4">100%</span> <span class="text-gray-400 text-sm">nöjd-garanti</span> </div> </div> <p class="text-gray-400 text-sm mt-4">Utöver organisationer har vi hjälpt hundratals privatpersoner med bröllop, fester och studentfiranden i Storstockholm.</p> </header>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="mb-6"> <h2 class="text-2xl font-bold text-white mb-2">De litar på oss</h2> <p class="text-gray-400">Ett urval av de organisationer vi levererat till.</p> </div> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"> ${[
    { file: "logo_ica.png", name: "ICA Sverige" },
    { file: "logo_hornbach.png", name: "Hornbach" },
    { file: "logo_abg.png", name: "ABG Sundal Collier" },
    { file: "logo_houdini.png", name: "Houdini Sportswear" },
    { file: "logo_mdu.svg", name: "M\xE4lardalens Universitet" },
    { file: "logo_hacksaw.svg", name: "Hacksaw Studios" },
    { file: "logo_oddfellow.png", name: "Odd Fellow" },
    { file: "logo_uf.png", name: "Ung F\xF6retagsamhet" }
  ].map((logo) => renderTemplate`<div class="bg-white border border-white/10 hover:border-brand-orange/30 rounded-xl overflow-hidden transition-all group flex items-center justify-center p-4" style="aspect-ratio:13/5"> <img${addAttribute(`/images/kunder/${logo.file}`, "src")}${addAttribute(logo.name, "alt")}${addAttribute(logo.name, "title")} class="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy"> </div>`)}
))}
</div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="mb-8"> <h2 class="text-2xl font-bold text-white mb-2">Eventfoton</h2> <p class="text-gray-400">Verkliga uppdrag — från Strawberry Arena till Djursholms Slott.</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> ${eventGallery.map((item) => renderTemplate`<div class="group relative bg-brand-navy border border-white/10 hover:border-brand-orange/40 rounded-2xl overflow-hidden transition-all cursor-default"> <div class="overflow-hidden bg-brand-dark" style="aspect-ratio:3/4"> <img${addAttribute(item.src, "src")}${addAttribute(item.alt, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"> </div> <div class="p-4"> <div class="flex items-start justify-between gap-2 mb-1"> <p class="font-semibold text-white text-sm leading-snug">${item.label}</p> <span class="shrink-0 text-xs px-2 py-0.5 rounded-full border" style="color:#c4b5f4;border-color:rgba(196,181,244,0.3);background:rgba(196,181,244,0.08);font-family:'Space Grotesk',sans-serif">${item.tag}</span> </div> <p class="text-gray-400 text-xs">${item.desc}</p> </div> </div>`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="mb-8"> <h2 class="text-2xl font-bold text-white mb-2">Utvalda kunder</h2> <p class="text-gray-400">Vi har förtroendet att leverera till några av Stockholms mest kräsna beställare.</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${clientCategories.map((cat) => renderTemplate`<div class="bg-brand-navy border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-colors"> <div class="flex items-center gap-3 mb-5"> <span class="text-2xl">${cat.icon}</span> <h3 class="font-bold text-white">${cat.label}</h3> </div> <ul class="flex flex-wrap gap-2"> ${cat.clients.map((client) => renderTemplate`<li class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:border-brand-orange/30 hover:text-white transition-colors"> ${client} </li>`)} </ul> </div>`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="bg-brand-navy border border-white/10 rounded-2xl p-8"> <h2 class="text-xl font-bold text-white mb-2">Samtliga referenskunder</h2> <p class="text-gray-400 text-sm mb-6">Totalt ${clients.length}+ organisationer som litat på oss.</p> <div class="flex flex-wrap gap-2"> ${clients.sort((a, b) => a.localeCompare(b, "sv")).map((client) => renderTemplate`<span class="text-xs bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-gray-400 hover:text-white hover:border-brand-orange/30 transition-colors cursor-default"> ${client} </span>`)} </div> </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="mb-8"> <h2 class="text-2xl font-bold text-white mb-2">Vad våra kunder säger</h2> <p class="text-gray-400">Riktiga omdömen från riktiga kunder.</p> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"> ${reviews.map((review) => renderTemplate`<div class="bg-brand-navy border border-white/10 rounded-2xl p-6 hover:border-brand-orange/30 transition-colors flex flex-col gap-4"> <!-- Stjärnor --> <div class="flex gap-0.5"> ${Array.from({ length: review.rating }).map(() => renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#c4b5f4" class="w-4 h-4"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg>`)} </div> <!-- Citat --> <p class="text-gray-300 leading-relaxed text-sm flex-1">"${review.text}"</p> <!-- Avsändare --> <div class="flex items-center gap-3 border-t border-white/10 pt-4"> <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style="background:rgba(196,181,244,0.15);color:#c4b5f4"> ${review.author.charAt(0)} </div> <div> <p class="text-white text-sm font-semibold">${review.author}</p> <p class="text-gray-400 text-xs">${review.location}</p> </div> </div> </div>`)} <!-- Extra "tom" kort med CTA att lämna omdöme --> <div class="bg-brand-navy border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center hover:border-brand-orange/30 transition-colors"> <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background:rgba(196,181,244,0.12)"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c4b5f4" stroke-width="2" class="w-5 h-5"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path> </svg> </div> <p class="text-gray-400 text-sm">Kund hos oss? Vi tar gärna emot ditt omdöme.</p> <a href="/feedback/" class="text-sm font-semibold transition-colors" style="color:#c4b5f4">
Lämna feedback →
</a> </div> </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"> <div class="flex items-center gap-3 mb-6"> <h2 class="text-2xl font-bold text-white" style="font-family:'DM Serif Display',serif">På Google</h2> <a href="https://www.google.com/maps/search/Scenkonsult+Vällingby" target="_blank" rel="noopener" class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors" style="background:#1e1850;border:1px solid rgba(255,255,255,0.1);color:rgba(196,181,244,0.9)"> <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.33 0 9.25-3.65 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path></svg>
5,0 · 3 recensioner
</a> </div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"> ${[
    { name: "Cecilia \xD6rnj\xE4ger", initials: "C\xD6", time: "F\xF6r 2 \xE5r sedan", text: "Varmt rekommenderat! B\xE4st n\xE4r det g\xE4ller. Professionella med en glimt i \xF6gat." },
    { name: "Charlotte Axelsson", initials: "CA", time: "F\xF6r ett \xE5r sedan", text: "DJ M\xE5ns gjorde kv\xE4llen till en succ\xE9 och ingen ville l\xE4mna dansgolvet! Superproffsigt och bra kommunikation hela v\xE4gen. Varmt rekommenderat!" },
    { name: "Charlotta Frennby", initials: "CF", time: "F\xF6r 2 \xE5r sedan", text: "Hyrde ljud f\xF6r en helg och det var toppen. V\xE4ldigt hj\xE4lpsamma och l\xE4tta att ha att g\xF6ra med." }
  ].map((r) => renderTemplate`<div class="bg-brand-navy border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-brand-orange/30 transition-colors"> <div class="flex items-center gap-3"> <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style="background:#c4b5f4;color:#0c0a24"> ${r.initials} </div> <div> <div class="text-white text-sm font-semibold leading-tight">${r.name}</div> <div class="text-gray-400 text-xs">${r.time}</div> </div> <svg class="ml-auto flex-shrink-0" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.33 0 9.25-3.65 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path></svg> </div> <div class="flex gap-0.5"> ${[1, 2, 3, 4, 5].map(() => renderTemplate`<svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`)} </div> <p class="text-gray-300 text-sm leading-relaxed flex-1">"${r.text}"</p> </div>`)} </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"> <div class="rounded-2xl p-8 sm:p-12 text-center border border-brand-orange/20" style="background:linear-gradient(135deg,rgba(30,24,80,0.9) 0%,rgba(12,10,36,0.95) 100%)"> <p class="text-sm font-semibold uppercase tracking-wide mb-3" style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif">Bli nästa nöjd kund</p> <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4" style="font-family:'DM Serif Display',serif">
Redo att skapa ert event?
</h2> <p class="text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
Vi hjälper er med allt från rådgivning och utrustningsval till leverans och montering. Kontakta oss idag — vi svarar samma dag.
</p> <div class="flex flex-wrap gap-4 justify-center"> <a href="/kontakt/" class="bg-brand-orange hover:bg-brand-orange-light text-brand-dark font-bold px-8 py-3.5 rounded-xl transition-colors text-sm">
Begär offert
</a> <a href="/vara-tjanster/" class="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm">
Se alla tjänster
</a> </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/referenser/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/referenser/index.astro";
const $$url = "/referenser/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
