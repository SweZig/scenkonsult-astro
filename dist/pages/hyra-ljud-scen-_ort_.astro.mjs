/* empty css                                 */
import { f as createAstro, c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout, s as scenData, l as ljudData } from '../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../chunks/CategoryHero_Dul6iQjy.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_OJnWGbO_.mjs';
export { renderers } from '../renderers.mjs';

const orter = [
	{
		slug: "solna",
		namn: "Solna",
		distans: "8 km",
		distansMin: 15,
		fas: 1,
		areaDesc: "Solna är hem till Friends Arena, Strawberry Arena och en hög koncentration av kontor och företag längs E4:an. Vi har levererat till evenemang i Solna sedan starten 1986 och känner området väl.",
		image: "/images/event/uf_strawberry_arena_1.webp",
		imageAlt: "Scenljus och PA-system vid evenemang i Solna",
		kunder: [
			"Solna Stad",
			"Solna Tingsrätt"
		]
	},
	{
		slug: "nacka",
		namn: "Nacka",
		distans: "18 km",
		distansMin: 25,
		fas: 1,
		areaDesc: "Nacka är en expansiv östlig förort med en blandning av villaområden, strandpromenader och moderna kontorskomplex. Här arrangeras allt från villaträdgårdfester till företagsgalor.",
		image: "/images/event/kundevent_djursholms_slott.webp",
		imageAlt: "Professionell scen- och ljudutrustning vid evenemang i Nackaregionen"
	},
	{
		slug: "jarfalla",
		namn: "Järfälla",
		distans: "12 km",
		distansMin: 18,
		fas: 1,
		areaDesc: "Järfälla är en av Stockholms snabbast växande kommuner med starka föreningsliv, kommunala festlokaler och ett aktivt näringsliv. Nära Vällingby — vi är grannar.",
		image: "/images/event/festival_vinterviken.webp",
		imageAlt: "PA-system och scenljus vid utomhusevent i Järfälla"
	},
	{
		slug: "taby",
		namn: "Täby",
		distans: "22 km",
		distansMin: 28,
		fas: 1,
		areaDesc: "Täby är en välbärgad nordlig förort med stor andel privata fester, bröllop och företagsevenemang. Arenaparken och Täby Centrum är populära eventplatser i kommunen.",
		image: "/images/event/uf_strawberry_arena_2.webp",
		imageAlt: "Scen och ljusutrustning vid evenemang i Täby"
	},
	{
		slug: "huddinge",
		namn: "Huddinge",
		distans: "20 km",
		distansMin: 25,
		fas: 1,
		areaDesc: "Huddinge är en mångfaldig sydlig kommun med Karolinska universitetssjukhuset Huddinge, Flemingsbergs konferensanläggningar och ett aktivt föreningsliv.",
		image: "/images/event/kundevent_abg.webp",
		imageAlt: "Professionell ljudanläggning och scenljus vid event i Huddinge"
	},
	{
		slug: "sundbyberg",
		namn: "Sundbyberg",
		distans: "7 km",
		distansMin: 12,
		fas: 1,
		areaDesc: "Sundbyberg är en av landets tätaste kommuner med ett expansivt stadsliv, restauranger och konferenslokaler längs Landsvägen. Det är vår närmaste granne — vi levererar dit på 12 minuter.",
		image: "/images/event/skridskodisco_ostermalm_1.webp",
		imageAlt: "Scen och PA-system vid stadsevent i Sundbyberg"
	},
	{
		slug: "tyreso",
		namn: "Tyresö",
		distans: "28 km",
		distansMin: 35,
		fas: 2,
		areaDesc: "Tyresö är en sydöstlig villakommun med starka föreningar, aktiv kommunal verksamhet och en vacker skärgårdsnära natur. Perfekt för sommarevenemang och utomhusfester.",
		image: "/images/event/kundevent_lakarforbundet.webp",
		imageAlt: "Ljud och scen vid evenemang i Tyresö",
		kunder: [
			"Tyresö Kommun"
		]
	},
	{
		slug: "lidingo",
		namn: "Lidingö",
		distans: "20 km",
		distansMin: 28,
		fas: 2,
		areaDesc: "Lidingö är en ö-kommun med hög levnadsstandard, exklusiva festvåningar och naturskön miljö. Millesgården och Lidingövallen är frekvent använda eventplatser.",
		image: "/images/event/kundevent_djursholms_slott.webp",
		imageAlt: "Professionell scen- och ljusutrustning på Lidingö"
	},
	{
		slug: "varmdo",
		namn: "Värmdö",
		distans: "35 km",
		distansMin: 40,
		fas: 2,
		areaDesc: "Värmdö är en skärgårdskommun med sommarstugor, bryggor och naturliga festplatser. Utomhusevenemang, bröllop i naturmiljö och sommarfester är vanliga uppdrag här.",
		image: "/images/event/festival_vinterviken.webp",
		imageAlt: "Utomhus PA-system och scenljus vid event i Värmdö"
	},
	{
		slug: "ekero",
		namn: "Ekerö",
		distans: "25 km",
		distansMin: 35,
		fas: 2,
		areaDesc: "Ekerö är en ö-kommun väster om Stockholm med Drottningholms slott, Birka och ett rikt föreningsliv. Här arrangeras bröllop, jubileum och sommarkonserter i unik miljö.",
		image: "/images/event/skridskodisco_ostermalm_2.webp",
		imageAlt: "Scen och ljud vid evenemang i Ekerö"
	},
	{
		slug: "danderyd",
		namn: "Danderyd",
		distans: "18 km",
		distansMin: 22,
		fas: 2,
		areaDesc: "Danderyd är en nordlig villakommun med Djursholms slott, exklusiva festvåningar och ett aktivt föreningsliv. Högnivåevenemang och bröllop i slottsmiljö är vanliga uppdrag.",
		image: "/images/event/kundevent_djursholms_slott.webp",
		imageAlt: "PA-system och scenljus vid evenemang på Djursholms slott i Danderyd"
	},
	{
		slug: "sigtuna",
		namn: "Sigtuna",
		distans: "45 km",
		distansMin: 45,
		fas: 2,
		areaDesc: "Sigtuna är Sveriges äldsta stad med en charmig medeltida stadskärna, konferenshotell och Arlanda flygplats som granne. Konferenser, bröllopsmiddagar och hotellgalor är typiska event.",
		image: "/images/event/kundevent_abg.webp",
		imageAlt: "Professionell scen och ljud vid konferens och event i Sigtuna"
	}
];

const $$Astro = createAstro("https://scenkonsult.se");
async function getStaticPaths() {
  return orter.map((ort) => ({
    params: { ort: ort.slug },
    props: { ort }
  }));
}
const $$HyraLjudScenort = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HyraLjudScenort;
  const { ort } = Astro2.props;
  const faq = [
    {
      q: `Levererar ni till ${ort.namn}?`,
      a: `Ja, vi levererar till ${ort.namn} och hela Storstockholm. Fr\xE5n v\xE5rt lager i V\xE4llingby \xE4r det ca ${ort.distans} och ${ort.distansMin} minuter till ${ort.namn}. Du kan ocks\xE5 h\xE4mta utrustningen sj\xE4lv i V\xE4llingby om du f\xF6redrar det.`
    },
    {
      q: `Hur l\xE5ng tid tar det att st\xE4lla upp utrustningen i ${ort.namn}?`,
      a: `Ett standard PA-paket tar 30\u201360 minuter att rigga. En komplett scen med ljus och ljud tar 2\u20134 timmar beroende p\xE5 storlek. Vi kan boka specifik leveranstid och hj\xE4lper g\xE4rna till med tips inf\xF6r er installering.`
    },
    {
      q: `Vad kostar leverans till ${ort.namn}?`,
      a: `Leveransavgiften baseras p\xE5 avst\xE5nd fr\xE5n V\xE4llingby. F\xF6r ${ort.namn} (ca ${ort.distans}) tillkommer ett frakttill\xE4gg \u2014 be om offert s\xE5 r\xE4knar vi ut exakt kostnad f\xF6r ert event. H\xE4mtning i V\xE4llingby \xE4r alltid kostnadsfritt.`
    },
    {
      q: `Kan jag hyra f\xF6r en kv\xE4ll i ${ort.namn}?`,
      a: `Absolut. V\xE5r standardperiod \xE4r ett dygn (24 h), men vi erbjuder flexibla uppl\xE4gg f\xF6r kortare och l\xE4ngre hyresperioder. Kontakta oss eller l\xE4gg produkterna i varukorgen och beg\xE4r offert \u2014 s\xE5 l\xF6ser vi det.`
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Scenkonsult Norden",
        "telephone": "+46724481000",
        "url": `https://scenkonsult.se/hyra-ljud-scen-${ort.slug}/`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Grimstagatan 164",
          "addressLocality": "V\xE4llingby",
          "postalCode": "162 58",
          "addressCountry": "SE"
        },
        "areaServed": {
          "@type": "City",
          "name": ort.namn
        },
        "description": `Hyr scen, ljud och ljus i ${ort.namn}. Leverans fr\xE5n V\xE4llingby p\xE5 ca ${ort.distansMin} min. Professionell eventutrustning sedan 1986.`,
        "openingHours": "Mo-Fr 09:00-17:00",
        "priceRange": "$$"
      },
      {
        "@type": "FAQPage",
        "mainEntity": faq.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Hyra Scen, Ljud & Ljus i ${ort.namn} | Scenkonsult Norden`, "description": `Hyr scen, PA-system, ljusutrustning och DJ-utrustning i ${ort.namn} \u2014 leverans fr\xE5n V\xE4llingby p\xE5 ca ${ort.distansMin} min. Eventutrustning sedan 1986. Ring 072-448 10 00.`, "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": `Hyra scen & ljud i`, "h1Accent": ort.namn, "intro": `Vi levererar professionell eventutrustning till ${ort.namn} och hela Storstockholm. Scen, PA-system, ljus och DJ-utrustning \u2014 hyrt av hundratals kunder sedan 1986. Fr\xE5n V\xE4llingby till ${ort.namn} p\xE5 ca ${ort.distansMin} minuter.`, "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: ort.namn }
  ], "badges": [
    `Leverans till ${ort.namn} p\xE5 ca ${ort.distansMin} min`,
    "Scen, ljud, ljus & DJ",
    "H\xE4mtning i V\xE4llingby kostnadsfritt",
    "\xD6ppet m\xE5n\u2013fre 09\u201317, jour vid uthyrning"
  ] })}  ${maybeRenderHead()}<section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Eventutrustning i ${ort.namn}</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 1.25rem; max-width:700px;">Professionell scen- och ljudutrustning — levererat till ${ort.namn}</h2> <p style="color:rgba(255,255,255,0.65); font-size:clamp(0.95rem,2vw,1.1rem); line-height:1.8; max-width:700px; margin:0 0 1.5rem;"> ${ort.areaDesc} </p> <p style="color:rgba(255,255,255,0.65); font-size:clamp(0.95rem,2vw,1.1rem); line-height:1.8; max-width:700px; margin:0 0 3rem;">
Vi hyr ut scener, PA-system, ljusutrustning och DJ-utrustning till privatpersoner, företag och föreningar i ${ort.namn}. Allt hyrs per dygn med möjlighet till leverans direkt till er eventplats.
</p> <!-- Tjänster grid --> <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.25rem;"> ${[
    {
      icon: "\u{1F3AD}",
      title: "Scen & podium",
      desc: `Modulscener i olika storlekar f\xF6r event i ${ort.namn}. Fr\xE5n kompakt podium till fullskalig konsertscen.`,
      link: "/vara-tjanster/hyra-scen/",
      cta: "Se scener"
    },
    {
      icon: "\u{1F50A}",
      title: "PA-system / Ljud",
      desc: `Aktiva PA-system dimensionerade f\xF6r er lokal i ${ort.namn}. Tr\xE5dl\xF6sa mikrofoner, mixerbord och mer.`,
      link: "/vara-tjanster/hyra-ljud/",
      cta: "Se ljudpaket"
    },
    {
      icon: "\u{1F4A1}",
      title: "Ljusutrustning",
      desc: `St\xE4mningsljus, moving heads, uplights och lasrar. S\xE4tter r\xE4tt st\xE4mning p\xE5 ert event i ${ort.namn}.`,
      link: "/vara-tjanster/hyra-ljus/",
      cta: "Se ljuspaket"
    },
    {
      icon: "\u{1F3A7}",
      title: "DJ-utrustning",
      desc: `Kompletta DJ-set med mixerbord, CDJ:s och monitorh\xF6gtalare \u2014 eller hyr en av v\xE5ra DJ:s.`,
      link: "/vara-tjanster/hyra-dj/",
      cta: "Se DJ-utrustning"
    }
  ].map((tj) => renderTemplate`<div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.5rem; display:flex; flex-direction:column; gap:0.75rem;"> <span style="font-size:2rem;">${tj.icon}</span> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700; color:white; margin:0;">${tj.title}</h3> <p style="color:rgba(255,255,255,0.6); font-size:0.9rem; line-height:1.6; margin:0; flex:1;">${tj.desc}</p> <a${addAttribute(tj.link, "href")} style="display:inline-flex; align-items:center; gap:0.4rem; color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600; text-decoration:none;"> ${tj.cta} →
</a> </div>`)} </div> </div> </section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"> <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color:#c4b5f4">Populäraste uthyrningar i ${ort.namn}</p> <h2 class="text-2xl font-bold text-white mb-8">Hyr till ditt event</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> ${scenData.products.filter((p) => ["medium", "large"].includes(p.id)).map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": `scen-${p.id}`, "artno": p.artno, "name": p.name, "price": p.price, "priceNote": `/${p.priceNote ?? "dygn"}`, "image": p.image, "alt": p.alt, "description": p.description, "specs": p.includes, "category": "Scen", "dimensionTable": [
    { label: "Storlek", value: p.size },
    { label: "M\xE5tt", value: p.dimensions },
    { label: "Kapacitet", value: p.capacity }
  ] })}`)} ${ljudData.event.products.filter((p) => p.id === "event-small").map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "id": p.id, "artno": p.artno, "name": p.name, "price": p.price, "priceNote": "/dygn", "image": p.image, "alt": p.alt, "description": p.description, "specs": p.includes, "category": "Ljud", "persons": p.persons })}`)} </div> <div class="flex flex-wrap gap-4"> <a href="/vara-tjanster/hyra-scen/" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">Se alla scener →</a> <a href="/vara-tjanster/hyra-ljud/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">Se alla ljud →</a> <a href="/vara-tjanster/hyra-ljus/" class="border border-white/20 text-gray-300 hover:border-brand-orange hover:text-brand-orange px-5 py-3 rounded-xl text-sm font-semibold transition-all">Se ljus & effekter →</a> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center;"> <div> <img${addAttribute(ort.image, "src")}${addAttribute(ort.imageAlt, "alt")} style="width:100%; border-radius:16px; object-fit:cover; aspect-ratio:4/3;" loading="lazy"> </div> <div> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Varför Scenkonsult i ${ort.namn}?</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 1.5rem;">Snabb leverans, hög kvalitet — sedan 1986</h2> <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:1rem;"> ${[
    `Lager i V\xE4llingby \u2014 ca ${ort.distans} och ${ort.distansMin} min till ${ort.namn}`,
    "Utrustning fr\xE5n ledande m\xE4rken: Alto, Allen & Heath, LD Systems, Shure, Denon (ljud) \xB7 ADJ, Cameo, Stairville, Global Truss (ljus) \xB7 Samsung, BenQ, Toshiba (bild)",
    "Fri r\xE5dgivning \u2014 vi hj\xE4lper dig v\xE4lja r\xE4tt setup f\xF6r din lokal",
    "\xD6ppet m\xE5n\u2013fre 09:00\u201317:00, jour kv\xE4llar och helger vid p\xE5g\xE5ende uthyrning",
    "H\xE4mtning i V\xE4llingby alltid kostnadsfritt",
    "Tekniker tillg\xE4nglig om ni vill ha hj\xE4lp p\xE5 plats (600 kr/tim)"
  ].map((item) => renderTemplate`<li style="display:flex; gap:0.75rem; align-items:flex-start; color:rgba(255,255,255,0.7); font-size:0.95rem; line-height:1.5;"> <span style="color:#a3e635; flex-shrink:0; margin-top:2px;">✓</span> ${item} </li>`)} </ul> </div> </div> </section>  <section style="background:#111030; padding: clamp(2.5rem,5vw,4rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto; text-align:center;"> <p style="color:rgba(255,255,255,0.45); font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:1.5rem;">Utvalda kunder vi levererat till i Storstockholm</p> <div style="display:flex; flex-wrap:wrap; gap:0.75rem; justify-content:center;"> ${["ICA Sverige", "Hornbach", "ABG Sundal Collier", "Houdini Sportswear", "Solna Stad", "Ung F\xF6retagsamhet", "Odd Fellow", "Kommunalarbetaref\xF6rbundet"].map((k) => renderTemplate`<span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:999px; padding:0.4rem 1rem; font-family:'Space Grotesk',sans-serif; font-size:0.82rem; color:rgba(255,255,255,0.6);"> ${k} </span>`)} </div> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:800px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem; text-align:center;">Vanliga frågor</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.6rem); color:white; text-align:center; margin:0 0 2.5rem;">Frågor om hyra i ${ort.namn}</h2> <div style="display:flex; flex-direction:column; gap:1rem;"> ${faq.map((f, i) => renderTemplate`<details style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem;"> <summary style="font-family:'Space Grotesk',sans-serif; font-weight:600; color:white; font-size:1rem; cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center; gap:1rem;"> ${f.q} <span style="color:#c4b5f4; flex-shrink:0; font-size:1.2rem;">+</span> </summary> <p style="color:rgba(255,255,255,0.65); font-size:0.95rem; line-height:1.75; margin:1rem 0 0;">${f.a}</p> </details>`)} </div> </div> </section>  <section style="background:linear-gradient(135deg,#1e1850 0%,#0c0a24 100%); padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem); border-top:1px solid rgba(196,181,244,0.15);"> <div style="max-width:700px; margin:0 auto; text-align:center;"> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 1rem;">Boka utrustning till ${ort.namn}</h2> <p style="color:rgba(255,255,255,0.65); font-size:1rem; line-height:1.7; margin:0 0 2.5rem;">
Lägg produkterna i varukorgen och begär offert — vi svarar inom en arbetsdag. Eller ring oss direkt på 072-448 10 00 (mån–fre 09–17).
</p> <div style="display:flex; flex-wrap:wrap; gap:1rem; justify-content:center;"> <a href="/vara-tjanster/" style="background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; padding:0.9rem 2rem; border-radius:10px; text-decoration:none; font-size:1rem;">
Bläddra bland produkter →
</a> <a href="/varukorg/" style="background:transparent; color:#c4b5f4; border:1px solid rgba(196,181,244,0.4); font-family:'Space Grotesk',sans-serif; font-weight:600; padding:0.9rem 2rem; border-radius:10px; text-decoration:none; font-size:1rem;">
Till varukorgen
</a> </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/hyra-ljud-scen-[ort].astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/hyra-ljud-scen-[ort].astro";
const $$url = "/hyra-ljud-scen-[ort]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HyraLjudScenort,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
