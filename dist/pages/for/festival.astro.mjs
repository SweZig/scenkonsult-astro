/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DH83owMh.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const faq = [
    {
      q: "Hur stor scen beh\xF6ver jag till en festival med 500 bes\xF6kare?",
      a: "F\xF6r 500 bes\xF6kare utomhus rekommenderar vi en scen p\xE5 minst 6\xD74 m eller 8\xD74 m med ett PA p\xE5 8 000\u201315 000 W. Scenstorleken beror p\xE5 antalet artister och deras backline. Kontakta oss \u2014 vi r\xE4knar ihop exakt vad ni beh\xF6ver."
    },
    {
      q: "Kan ni leverera till utomhusfestivaler utan fast str\xF6m?",
      a: "Ja, vi kan kombinera v\xE5r utrustning med elverksaggregat och batteridrivna system. Vi r\xE5der er om elbehov f\xF6r hela riggen och kan hj\xE4lpa er kontakta r\xE4tt elverk-leverant\xF6r."
    },
    {
      q: "Levererar ni till festivaler utanf\xF6r Stockholm?",
      a: "Vi levererar prim\xE4rt i Storstockholm men hanterar \xE4ven st\xF6rre festivaler i M\xE4lardalsregionen. Kontakta oss med plats och datum f\xF6r en offert inkl. transport."
    },
    {
      q: "Kan utrustningen anv\xE4ndas i regn?",
      a: "All v\xE5r utrustning har en IP-klass som t\xE5l regn och h\xF6g luftfuktighet. Vi rekommenderar alltid v\xE4dert\xE4lt f\xF6r mixerbord och k\xE4nsligare elektronik vid l\xE4ngre utomhusarrangemang."
    },
    {
      q: "Ing\xE5r tekniker vid festivalhyra?",
      a: "Tekniker kan bokas som till\xE4gg (600 kr/tim). Vid st\xF6rre festivaler med flera scener rekommenderar vi starkt att boka en ljudtekniker \u2014 det \xE4r skillnad p\xE5 ett bra och ett fantastiskt ljud."
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Uthyrning av scen, ljud och ljus till festival och utomhus-event i Stockholm",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Scenkonsult Norden",
          "telephone": "+46724481000",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Palmfeltsv\xE4gen 5",
            "addressLocality": "Stockholm",
            "postalCode": "121 62",
            "addressCountry": "SE"
          }
        },
        "areaServed": "Stockholm",
        "url": "https://scenkonsult.se/for/festival/"
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra Scen, Ljud & Ljus till Festival & Utomhus-event Stockholm | Scenkonsult", "description": "Hyr festival-scen, storskaligt PA och ljus till utomhus-event i Stockholm. Event f\xF6r 100\u20132000 bes\xF6kare. Tekniker p\xE5 plats. Ring 072-448 10 00.", "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Scen & ljud till festival i", "h1Accent": "Stockholm", "intro": "Modulscener, kraftfulla PA-system och robust ljus f\xF6r utomhus-event och festivaler. Vi har utrustning f\xF6r 100 till 2 000 bes\xF6kare och hanterar hela Storstockholm.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "F\xF6r ditt event", href: "/for/" },
    { label: "Festival & utomhus" }
  ], "badges": [
    "Scener upp till 8\xD76 m",
    "PA-system f\xF6r 2 000 g\xE4ster",
    "T\xE5l utomhusbruk och v\xE4der",
    "Tekniker p\xE5 plats tillg\xE4ngligt"
  ] })}  ${maybeRenderHead()}<section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Komplett festival-rigg</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 1.25rem; max-width:680px;">Utrustning som håller utomhus</h2> <p style="color:rgba(255,255,255,0.55); font-size:1rem; line-height:1.75; max-width:640px; margin:0 0 3rem;">Utomhus-event kräver mer effekt, robustare utrustning och en plan för vädret. Vi har erfarenhet av allt från lokala stadsfester till stora festivaler — och vet vad som krävs för att det ska låta bra utomhus.</p> <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1.5rem;"> ${[
    { icon: "\u{1F3AD}", title: "Modulscener", desc: "Hopf\xE4llbara scener fr\xE5n 4\xD73 m upp till 8\xD76 m. Halkfria ytor, stabil konstruktion och montering ing\xE5r vid behov.", link: "/vara-tjanster/hyra-scen/", cta: "Se scener" },
    { icon: "\u{1F50A}", title: "Festival-PA", desc: "Line array och kraftfulla sub-systemer f\xF6r utomhus. R\xE4tt dimensionerat f\xF6r er publikstorlek och plats.", link: "/vara-tjanster/hyra-ljud/", cta: "Se ljud" },
    { icon: "\u{1F4A1}", title: "Scenljus", desc: "V\xE4dert\xE5liga moving heads, PAR-lampor och beam-effekter. T\xE4nds n\xE4r m\xF6rkret faller och tar over dansgolvet.", link: "/vara-tjanster/hyra-ljus/", cta: "Se ljus" },
    { icon: "\u{1F4E1}", title: "Projektor & LED", desc: "Ljusstarka projektorer och LED-sk\xE4rmar f\xF6r artistnamn, bakgrundsbilder och livefeed.", link: "/vara-tjanster/hyra-bild-projektorer-skarmar/", cta: "Se sk\xE4rmar" }
  ].map((item) => renderTemplate`<div style="background:#1e1850; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.75rem; display:flex; flex-direction:column; gap:0.75rem;"> <div style="font-size:1.75rem;">${item.icon}</div> <h3 style="font-family:'DM Serif Display',serif; font-size:1.2rem; color:white; margin:0;">${item.title}</h3> <p style="color:rgba(255,255,255,0.55); font-size:0.88rem; line-height:1.65; margin:0; flex:1;">${item.desc}</p> <a${addAttribute(item.link, "href")} style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; text-decoration:none;">${item.cta} →</a> </div>`)} </div> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1000px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem; text-align:center;">Storleksguide</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2.5rem; text-align:center;">Rätt rigg för ert antal gäster</h2> <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem;"> ${[
    { label: "Liten festival", guests: "100\u2013300 bes.", scen: "4\xD73 m", pa: "Live Small (4 000W)", ljus: "8\xD7 PAR + 2\xD7 moving head" },
    { label: "Mellanstor", guests: "300\u2013700 bes.", scen: "6\xD74 m", pa: "Live Medium (8 000W)", ljus: "16\xD7 PAR + 4\xD7 moving head" },
    { label: "Stor festival", guests: "700\u20132000 bes.", scen: "8\xD76 m", pa: "Live Large (15 000W+)", ljus: "Fullrig \u2014 kontakta oss" }
  ].map((p) => renderTemplate`<div style="background:#1e1850; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:1.5rem;"> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; font-weight:700; color:white; margin:0 0 0.25rem;">${p.label}</h3> <p style="color:#c4b5f4; font-size:0.8rem; font-weight:600; margin:0 0 1.25rem;">${p.guests}</p> ${[["Scen", p.scen], ["PA", p.pa], ["Ljus", p.ljus]].map(([l, v]) => renderTemplate`<div style="display:flex; flex-direction:column; gap:0.15rem; padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"> <span style="color:rgba(255,255,255,0.35); font-size:0.72rem; text-transform:uppercase; letter-spacing:0.06em;">${l}</span> <span style="color:rgba(255,255,255,0.75); font-size:0.85rem;">${v}</span> </div>`)} </div>`)} </div> <div style="text-align:center; margin-top:2.5rem;"> <a href="/bokningssida/" style="display:inline-block; background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:0.9rem 2.5rem; border-radius:4px;">
Begär offert för er festival
</a> </div> </div> </section>  <section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Vanliga frågor</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2.5rem;">Festival & utomhus — vanliga frågor</h2> <div style="display:flex; flex-direction:column;"> ${faq.map((item) => renderTemplate`<details style="border-bottom:1px solid rgba(255,255,255,0.07);"> <summary style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 0; cursor:pointer; list-style:none; color:white; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:1rem; gap:1rem;"> ${item.q} <span style="color:#c4b5f4; font-size:1.25rem; flex-shrink:0;">+</span> </summary> <p style="color:rgba(255,255,255,0.6); font-size:0.95rem; line-height:1.75; margin:0 0 1.25rem; padding-right:2rem;">${item.a}</p> </details>`)} </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/festival/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/festival/index.astro";
const $$url = "/for/festival/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
