/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Qdf46Cx6.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const occasions = [
    {
      slug: "brollop",
      icon: "\u{1F48D}",
      title: "Br\xF6llop",
      desc: "Ljud f\xF6r tal och trubadur, st\xE4mningsljus och scen. Vi har levererat till hundratals br\xF6llop sedan 1986.",
      badge: "Popul\xE4rast",
      guests: "30\u2013250 g\xE4ster"
    },
    {
      slug: "foretagsfest",
      icon: "\u{1F389}",
      title: "F\xF6retagsfest & kickoff",
      desc: "Fr\xE5n julfest till invigning. Faktura med individuella villkor. Tekniker p\xE5 plats om ni vill.",
      badge: null,
      guests: "20\u20132000 g\xE4ster"
    },
    {
      slug: "konferens",
      icon: "\u{1F3A4}",
      title: "Konferens & f\xF6rel\xE4sning",
      desc: "AV-teknik, mikrofoner och projektorer. Professionellt ljud f\xF6r presentationer och paneldiskussioner.",
      badge: null,
      guests: "20\u2013500 deltagare"
    },
    {
      slug: "festival",
      icon: "\u{1F3B8}",
      title: "Festival & utomhus",
      desc: "Modulscener, kraftfulla PA-system och robust ljus f\xF6r utomhus-event och festivaler.",
      badge: null,
      guests: "100\u20132000 bes\xF6kare"
    },
    {
      slug: "studentflak",
      icon: "\u{1F393}",
      title: "Studentflak",
      desc: "Kompakta och kraftfulla ljudsystem med Bluetooth och tr\xE5dl\xF6s mick. Boka tidigt \u2014 maj\u2013juni tar slut snabbt.",
      badge: "S\xE4song maj\u2013juni",
      guests: "15\u201350 studenter"
    }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Eventuthyrning Stockholm \u2013 Alla tillf\xE4llen",
    "description": "Hyr scen, ljud och ljus till ditt event i Stockholm. Vi hanterar br\xF6llop, f\xF6retagsfester, konferenser, festivaler och studentflak.",
    "itemListElement": occasions.map((o, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Service",
        "name": o.title,
        "url": `https://scenkonsult.se/for/${o.slug}/`
      }
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyr Teknik till Ditt Event i Stockholm | Scenkonsult \u2014 Alla Tillf\xE4llen", "description": "Hyr scen, ljud och ljus anpassat f\xF6r ditt event. Br\xF6llop, f\xF6retagsfest, konferens, festival och studentflak. Storstockholm. Sedan 1986.", "schemaExtra": schema }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div style="background:linear-gradient(135deg,#1e1850 0%,#0c0a24 60%); padding-top:calc(36px + 130px + clamp(2rem,5vw,4rem)); padding-bottom:clamp(3rem,6vw,5rem); padding-left:clamp(1rem,5vw,5rem); padding-right:clamp(1rem,5vw,5rem); position:relative; overflow:hidden;"> <div style="position:absolute; right:-5%; top:50%; transform:translateY(-50%); width:clamp(200px,35vw,460px); height:clamp(200px,35vw,460px); border-radius:50%; background-image:radial-gradient(circle,rgba(196,181,244,0.07) 2px,transparent 2px); background-size:22px 22px; pointer-events:none;"></div> <div style="max-width:min(1280px,100%); margin:0 auto; position:relative; z-index:2;"> <nav aria-label="Brödsmulor" style="margin-bottom:clamp(1rem,3vw,2rem);"> <ol style="display:flex; flex-wrap:wrap; gap:0.35rem; list-style:none; margin:0; padding:0; font-size:0.78rem; color:rgba(255,255,255,0.4);"> <li><a href="/" style="color:rgba(255,255,255,0.5); text-decoration:none;">Hem</a> <span style="opacity:0.3;">/</span></li> <li><span style="color:white;">För ditt event</span></li> </ol> </nav> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Anpassat för ditt tillfälle</p> <h1 style="font-family:'DM Serif Display',serif; font-size:clamp(2rem,5vw,3.75rem); line-height:1.05; color:white; margin:0 0 1.25rem; max-width:700px;">
Rätt teknik för <span style="color:#c4b5f4; font-style:italic;">varje event</span> </h1> <p style="color:rgba(255,255,255,0.6); font-size:clamp(0.95rem,2vw,1.1rem); line-height:1.75; max-width:580px; margin:0;">
Välj ditt event-typ nedan — vi har tagit fram specifika rekommendationer, checklistor och priser för varje tillfälle.
</p> </div> </div>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem;"> ${occasions.map((o) => renderTemplate`<a${addAttribute(`/for/${o.slug}/`, "href")} style="background:#1e1850; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:2rem; text-decoration:none; display:flex; flex-direction:column; gap:0.75rem; transition:border-color 0.2s, transform 0.15s; position:relative; overflow:hidden;" onmouseenter="this.style.borderColor='rgba(196,181,244,0.35)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='translateY(0)'"> ${o.badge && renderTemplate`<span style="position:absolute; top:1.25rem; right:1.25rem; background:rgba(196,181,244,0.15); color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.7rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; padding:0.2rem 0.6rem; border-radius:9999px;">${o.badge}</span>`} <div style="font-size:2rem;">${o.icon}</div> <h2 style="font-family:'DM Serif Display',serif; font-size:1.4rem; color:white; margin:0;">${o.title}</h2> <p style="color:rgba(255,255,255,0.55); font-size:0.9rem; line-height:1.65; margin:0; flex:1;">${o.desc}</p> <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.25rem;"> <span style="background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.4); font-size:0.75rem; padding:0.2rem 0.65rem; border-radius:9999px;">${o.guests}</span> <span style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.06em;">Se mer →</span> </div> </a>`)} </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem); border-top:1px solid rgba(255,255,255,0.06);"> <div style="max-width:1100px; margin:0 auto;"> <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:2rem; flex-wrap:wrap;"> <div> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.5rem;">Kunskapsbank</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0;">Guider & tips</h2> </div> <a href="/for/guider/" style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.82rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; text-decoration:none; white-space:nowrap;">Alla guider →</a> </div> <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1rem;"> ${[
    { href: "/for/guider/hur-stor-pa/", icon: "\u{1F50A}", title: "Hur stor PA beh\xF6ver jag?", tag: "Ljud" },
    { href: "/for/guider/hur-stor-scen/", icon: "\u{1F3AD}", title: "Hur stor scen beh\xF6ver jag?", tag: "Scen" },
    { href: "/for/guider/dj-eller-liveband/", icon: "\u{1F3B8}", title: "DJ eller liveband?", tag: "Musik" },
    { href: "/for/guider/ljussattning-tips/", icon: "\u{1F4A1}", title: "Ljuss\xE4ttning f\xF6r event", tag: "Ljus" },
    { href: "/for/guider/checklista-event/", icon: "\u2705", title: "Komplett checklista", tag: "Planering" },
    { href: "/for/guider/vad-kostar-det/", icon: "\u{1F4B0}", title: "Vad kostar det?", tag: "Pris" }
  ].map((g) => renderTemplate`<a${addAttribute(g.href, "href")} style="background:#1e1850; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:1.25rem; text-decoration:none; display:flex; gap:0.85rem; align-items:flex-start; transition:border-color 0.2s;" onmouseenter="this.style.borderColor='rgba(196,181,244,0.3)'" onmouseleave="this.style.borderColor='rgba(255,255,255,0.07)'"> <span style="font-size:1.35rem; flex-shrink:0;">${g.icon}</span> <div> <div style="color:white; font-family:'Space Grotesk',sans-serif; font-size:0.88rem; font-weight:600; line-height:1.3; margin-bottom:0.35rem;">${g.title}</div> <span style="background:rgba(196,181,244,0.1); color:#c4b5f4; font-size:0.68rem; font-weight:700; padding:0.12rem 0.45rem; border-radius:9999px;">${g.tag}</span> </div> </a>`)} </div> </div> </section>  <section style="background:#111030; padding: clamp(2rem,4vw,3.5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto; display:flex; flex-wrap:wrap; gap:2rem; justify-content:center; align-items:center;"> ${[
    ["1986", "Grundat"],
    ["100+", "Event per \xE5r"],
    ["20\u20132000", "G\xE4ster vi hanterar"],
    ["100%", "N\xF6jda kunder"],
    ["2 tim", "Svarstid p\xE5 offert"]
  ].map(([nr, label]) => renderTemplate`<div style="text-align:center;"> <div style="font-family:'DM Serif Display',serif; font-size:clamp(1.5rem,3vw,2.25rem); color:#c4b5f4;">${nr}</div> <div style="color:rgba(255,255,255,0.4); font-family:'Space Grotesk',sans-serif; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; margin-top:0.25rem;">${label}</div> </div>`)} </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/index.astro";
const $$url = "/for/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
