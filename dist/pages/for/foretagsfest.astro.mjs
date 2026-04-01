/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const faq = [
    {
      q: "Hur l\xE5ng tid tar det att rigga och plocka ned utrustningen?",
      a: "Ett standardpaket med ljud och ljus tar 1\u20132 timmar att rigga upp. V\xE5r monteringstj\xE4nst (600 kr/tim) \xE4r tillg\xE4nglig om ni inte vill sk\xF6ta det sj\xE4lva \u2014 vi kan vara klara i god tid innan g\xE4sterna anl\xE4nder."
    },
    {
      q: "Kan vi hyra utrustning till en lokal vi inte \xE4ger?",
      a: "Absolut. Vi levererar och monterar i era lokaler, extern konferenslokal eller hyrd festlokal. Vi beh\xF6ver bara adress och tillg\xE4nglig tid f\xF6r leverans."
    },
    {
      q: "Fungerar utrustningen f\xF6r b\xE5de presentationer och fest p\xE5 samma kv\xE4ll?",
      a: "Ja. V\xE5ra PA-system hanterar b\xE5de talljud f\xF6r presentationer och fullt tryck f\xF6r fest och dans. Vi kan r\xE5dge om r\xE4tt inst\xE4llningar f\xF6r varje fas av kv\xE4llen."
    },
    {
      q: "Kan vi boka tekniker som \xE4r p\xE5 plats hela kv\xE4llen?",
      a: "Ja, vi erbjuder tekniker p\xE5 plats (600 kr/tim, min 4 timmar). Det ger er trygghet och frig\xF6r er att fokusera p\xE5 g\xE4sterna \u2014 inte p\xE5 kablar och volymknappar."
    },
    {
      q: "Kan ni hantera stora f\xF6retagsevent med 300+ g\xE4ster?",
      a: "Ja, vi har utrustning f\xF6r event upp till 2 000 g\xE4ster. Kontakta oss med era krav s\xE5 tar vi fram ett f\xF6rslag anpassat f\xF6r er storlek, lokal och budget."
    },
    {
      q: "Hur fakturerar ni f\xF6r f\xF6retag?",
      a: "Vi fakturerar med individuella betalningsvillkor f\xF6r registrerade f\xF6retag (vanligen 5\u201330 dagar beroende p\xE5 kreditrating). Privatpersoner betalar i f\xF6rv\xE4g. Kontakta oss f\xF6r offert och fakturaunderlag."
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Uthyrning av ljud, ljus och scen till f\xF6retagsfest i Stockholm",
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
        "description": "Hyr komplett AV-utrustning, ljud, ljus och scen till f\xF6retagsfester, kickoffs och firmafester i Stockholm.",
        "url": "https://scenkonsult.se/for/foretagsfest/"
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
  const kunder = [
    "ICA Sverige",
    "Solna Stad",
    "Stockholm Stad",
    "Haninge Kommun",
    "Akademiska Hus",
    "ABG Sundal Collier",
    "Kommunalarbetaref\xF6rbundet",
    "M\xE4lardalens Universitet",
    "Houdini Sportsware",
    "Hornbach"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra AV-teknik till F\xF6retagsfest & Kickoff Stockholm | Scenkonsult", "description": "Hyr professionell ljud, ljus och scen till er f\xF6retagsfest i Stockholm. Tekniker p\xE5 plats, fakturabetalning f\xF6r f\xF6retag. Leverans i hela Storstockholm. Ring 072-448 10 00.", "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Teknik till f\xF6retagsfest i", "h1Accent": "Stockholm", "intro": "Fr\xE5n kickoff och julfest till invigning och personalfest. Vi levererar komplett AV-teknik till f\xF6retagsevent i alla storlekar \u2014 med eller utan tekniker p\xE5 plats.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "F\xF6r ditt event", href: "/for/" },
    { label: "F\xF6retagsfest & kickoff" }
  ], "badges": [
    "Faktura med individuella villkor",
    "Tekniker p\xE5 plats tillg\xE4ngligt",
    "Event 20\u20132 000 g\xE4ster",
    "Leverans i hela Storstockholm"
  ] })}  ${maybeRenderHead()}<section style="background:#0c0a24; padding: 2rem clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto;"> <p style="color:rgba(255,255,255,0.3); font-family:'Space Grotesk',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:1rem; text-align:center;">Anlitade av bland annat</p> <div style="display:flex; flex-wrap:wrap; gap:0.5rem 1.5rem; justify-content:center;"> ${kunder.map((k) => renderTemplate`<span style="color:rgba(255,255,255,0.35); font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600;">${k}</span>`)} </div> </div> </section>  <section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Vi hanterar allt</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 2.5rem; max-width:700px;">Från AW till storkonferens</h2> <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.25rem;"> ${[
    { icon: "\u{1F389}", title: "Julfest & personalfest", desc: "Ljud f\xF6r underh\xE5llning och tal, scenljus och discoljus f\xF6r dansgolvet. Vi hanterar 50\u2013500 g\xE4ster.", guests: "50\u2013500 g\xE4ster" },
    { icon: "\u{1F680}", title: "Kickoff & teambuilding", desc: "PA f\xF6r presentationer, scen f\xF6r underh\xE5llning, bakgrundsmusik under minglet.", guests: "20\u2013200 g\xE4ster" },
    { icon: "\u{1F3A4}", title: "Konferens & f\xF6rel\xE4sning", desc: "Kolumnh\xF6gtalare, tr\xE5dl\xF6sa mikrofoner och projektor. Klart ljud f\xF6r presentationer och Q&A.", guests: "20\u2013500 g\xE4ster" },
    { icon: "\u{1F942}", title: "Invigning & AW", desc: "Portabelt ljud, st\xE4mningsljus och en DJ-rigg. Perfekt f\xF6r galor och lanseringar.", guests: "30\u2013300 g\xE4ster" },
    { icon: "\u{1F3C6}", title: "Prisutdelning & gala", desc: "Scen med spotlight, h\xF6gtalaranl\xE4ggning och belysning som lyfter kv\xE4llens h\xF6jdpunkter.", guests: "50\u20131000 g\xE4ster" },
    { icon: "\u{1F4E2}", title: "M\xE4ssa & utomhus", desc: "Batteridrivna h\xF6gtalare, robust ljus och mobila scener. Fungerar utan fast str\xF6m.", guests: "Valfri storlek" }
  ].map((item) => renderTemplate`<div style="background:#1e1850; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.5rem;"> <div style="font-size:1.5rem; margin-bottom:0.75rem;">${item.icon}</div> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; font-weight:700; color:white; margin:0 0 0.5rem;">${item.title}</h3> <p style="color:rgba(255,255,255,0.5); font-size:0.85rem; line-height:1.6; margin:0 0 0.75rem;">${item.desc}</p> <span style="background:rgba(196,181,244,0.12); color:#c4b5f4; font-size:0.75rem; font-weight:600; padding:0.25rem 0.65rem; border-radius:9999px;">${item.guests}</span> </div>`)} </div> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div class="g2c" style="max-width:1100px; margin:0 auto;"> <div> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Utrustning</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 1.5rem;">Allt ni behöver, på ett ställe</h2> ${[
    { title: "Ljud", items: ["PA-system f\xF6r 20\u20132000 g\xE4ster", "Tr\xE5dl\xF6sa mikrofoner & headset", "Mixerbord & monitorer", "Portabla batteririvna system"], link: "/vara-tjanster/hyra-ljud/" },
    { title: "Ljus", items: ["LED par-lampor f\xF6r st\xE4mning", "Moving heads & effektljus", "R\xF6kmaskin & haze", "Uplights l\xE4ngs v\xE4ggarna"], link: "/vara-tjanster/hyra-ljus/" },
    { title: "Scen & bild", items: ["Modulscenar 2\xD72 m upp till 8\xD76 m", "Projektorer & dukar", "LED-sk\xE4rmar", "TV-sk\xE4rmar p\xE5 stativ"], link: "/vara-tjanster/hyra-scen/" }
  ].map((block) => renderTemplate`<div style="margin-bottom:2rem;"> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;"> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:700; color:#c4b5f4; text-transform:uppercase; letter-spacing:0.08em; margin:0;">${block.title}</h3> <a${addAttribute(block.link, "href")} style="color:rgba(255,255,255,0.35); font-size:0.75rem; text-decoration:none;">Se sortiment →</a> </div> ${block.items.map((item) => renderTemplate`<div style="display:flex; align-items:center; gap:0.6rem; padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.05);"> <span style="color:#86efac; font-size:0.8rem;">✓</span> <span style="color:rgba(255,255,255,0.65); font-size:0.9rem;">${item}</span> </div>`)} </div>`)} </div> <div> <div style="background:#1e1850; border:1px solid rgba(196,181,244,0.2); border-radius:16px; padding:2rem; margin-bottom:1.5rem;"> <h3 style="font-family:'DM Serif Display',serif; font-size:1.4rem; color:white; margin:0 0 0.5rem;">Begär offert</h3> <p style="color:rgba(255,255,255,0.45); font-size:0.85rem; margin:0 0 1.5rem; line-height:1.6;">Berätta om ert event, antal gäster och lokal — vi återkommer med ett konkret förslag inom 2 timmar.</p> <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;"> ${[
    ["Svarstid", "Inom 2 timmar"],
    ["Betalning", "Faktura med individuella villkor"],
    ["Leverans", "Hela Storstockholm"],
    ["Tekniker", "Tillg\xE4ngligt som till\xE4gg"]
  ].map(([label, value]) => renderTemplate`<div style="display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.07);"> <span style="color:rgba(255,255,255,0.45); font-size:0.85rem;">${label}</span> <span style="color:white; font-size:0.85rem; font-weight:600;">${value}</span> </div>`)} </div> <a href="/bokningssida/" style="display:block; background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:1rem 2rem; border-radius:4px; text-align:center; margin-bottom:0.75rem;">
Begär offert
</a> <a data-tel="MDcyNDQ4MTAwMA==" data-prefix="📞 " data-label="072-448 10 00" href="#tel" style="display:block; text-align:center; color:rgba(255,255,255,0.4); font-family:'Space Grotesk',sans-serif; font-size:0.85rem; text-decoration:none;"><noscript>📞 072-448 10 00</noscript></a> </div> </div> </div> </section>  <section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Vanliga frågor</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2.5rem;">Vanliga frågor om företagsevent</h2> <div style="display:flex; flex-direction:column; gap:0;"> ${faq.map((item) => renderTemplate`<details style="border-bottom:1px solid rgba(255,255,255,0.07); padding:0;"> <summary style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 0; cursor:pointer; list-style:none; color:white; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:1rem; gap:1rem;"> ${item.q} <span style="color:#c4b5f4; font-size:1.25rem; flex-shrink:0;">+</span> </summary> <p style="color:rgba(255,255,255,0.6); font-size:0.95rem; line-height:1.75; margin:0 0 1.25rem; padding-right:2rem;">${item.a}</p> </details>`)} </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/foretagsfest/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/foretagsfest/index.astro";
const $$url = "/for/foretagsfest/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
