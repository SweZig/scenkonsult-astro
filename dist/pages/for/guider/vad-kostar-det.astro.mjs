/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_Qdf46Cx6.mjs';
export { renderers } from '../../../renderers.mjs';

const $$VadKostarDet = createComponent(($$result, $$props, $$slots) => {
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "Article", "headline": "Vad kostar det att hyra scen, ljud och ljus? Prisguide 2025", "author": { "@type": "Organization", "name": "Scenkonsult Norden" }, "datePublished": "2025-01-01", "url": "https://scenkonsult.se/for/guider/vad-kostar-det/" }, { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "Vad kostar det att hyra ett PA-system?", "acceptedAnswer": { "@type": "Answer", "text": "Portable Small (10\u201350 pers) kostar 599 kr/dygn exkl moms. Music Small (50\u2013100 pers, dans) 999 kr. Music Large (200\u2013500 pers) 1 899 kr. Priser exkl moms." } }, { "@type": "Question", "name": "Vad kostar hyra av scen?", "acceptedAnswer": { "@type": "Answer", "text": "Scenpaket Small (4 m\xB2) kostar 599 kr/dygn exkl moms. Medium+ (12 m\xB2) 1 799 kr. Large+ med scentak (24 m\xB2) 11 999 kr. Alla priser exkl moms." } }, { "@type": "Question", "name": "\xC4r det billigare att h\xE4mta sj\xE4lv?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, avh\xE4mtning \xE4r alltid gratis. Leverans tillkommer och kostar beroende p\xE5 m\xE4ngd och adress." } }] }] };
  const paket = [
    { title: "Liten fest, ~50 g\xE4ster", rows: [
      { kat: "Ljud", prod: "Portable Medium", p: 799, l: "/vara-tjanster/hyra-ljud/portable/" },
      { kat: "Ljus", prod: "Ljuspaket Small", p: 399, l: "/vara-tjanster/hyra-ljus/" }
    ], total: 1198, note: "H\xE4mta sj\xE4lv = 0 kr transport" },
    { title: "Br\xF6llop, ~100 g\xE4ster", rows: [
      { kat: "Ljud", prod: "Music Small", p: 999, l: "/vara-tjanster/hyra-ljud/music/" },
      { kat: "Scen", prod: "Scenpaket Small+ (6 m\xB2)", p: 899, l: "/vara-tjanster/hyra-scen/" },
      { kat: "Scen", prod: "Scentrapp 60 cm", p: 349, l: "/vara-tjanster/hyra-scen/" },
      { kat: "Ljus", prod: "Ljuspaket Medium", p: 1199, l: "/vara-tjanster/hyra-ljus/" }
    ], total: 3446, note: "Transport och montering tillkommer" },
    { title: "F\xF6retagsfest, ~200 g\xE4ster", rows: [
      { kat: "Ljud", prod: "Music Large", p: 1899, l: "/vara-tjanster/hyra-ljud/music/" },
      { kat: "Mixer", prod: "Mixerbord 12+4 kanaler", p: 399, l: "/vara-tjanster/hyra-ljud/event/" },
      { kat: "Scen", prod: "Scenpaket Medium++ (16 m\xB2)", p: 2399, l: "/vara-tjanster/hyra-scen/" },
      { kat: "Ljus", prod: "Ljuspaket Medium++", p: 1499, l: "/vara-tjanster/hyra-ljus/" },
      { kat: "DJ", prod: "Denon Prime 4+", p: 1499, l: "/vara-tjanster/hyra-dj/" }
    ], total: 7695, note: "Transport och montering tillkommer" },
    { title: "Festival, ~500 g\xE4ster utomhus", rows: [
      { kat: "Ljud", prod: "Live/Music XL+", p: 2999, l: "/vara-tjanster/hyra-ljud/music/" },
      { kat: "Scen", prod: "Scenpaket Large+ inkl. scentak", p: 11999, l: "/vara-tjanster/hyra-scen/" },
      { kat: "Ljus", prod: "Ljuspaket Medium++", p: 1499, l: "/vara-tjanster/hyra-ljus/" },
      { kat: "R\xF6k", prod: "R\xF6kmaskin 1500W", p: 349, l: "/vara-tjanster/hyra-ljus/" }
    ], total: 16846, note: "Kontakta oss f\xF6r festivalpris" }
  ];
  const sparTips = [
    { t: "H\xE4mta sj\xE4lv", d: "Avh\xE4mtning \xE4r alltid gratis. Spara leveranskostnaden om ni har l\xE4mpligt fordon." },
    { t: "Helg = 1 dygn", d: "Hyr fredag, l\xE4mna tillbaka m\xE5ndag \u2014 betala ett dygn om utrustningen inte \xE4r bokad." },
    { t: "Installera sj\xE4lv", d: "Standardpaket \xE4r byggda f\xF6r enkel installation. Spara monteringskostnaden p\xE5 enkla rigg." },
    { t: "Boka i f\xF6rv\xE4g", d: "Popul\xE4ra helger (maj\u2013sept) tar slut. Boka 4\u20138 veckor i f\xF6rv\xE4g f\xF6r b\xE4st urval." }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Vad Kostar det att Hyra Scen, Ljud & Ljus? Prisguide 2025 | Scenkonsult", "description": "Exakta priser ur v\xE5rt sortiment f\xF6r PA, scen, ljus och DJ-utrustning. Exempelpaket f\xF6r br\xF6llop, f\xF6retagsfest och festival. Scenkonsult sedan 1986.", "schemaExtra": schema }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="background:linear-gradient(135deg,#1e1850 0%,#0c0a24 60%);padding-top:calc(36px + 130px + clamp(2rem,4vw,3.5rem));padding-bottom:clamp(2.5rem,5vw,4rem);padding-inline:clamp(1rem,5vw,5rem);"> <div style="max-width:820px;margin:0 auto;"> <nav aria-label="Brödsmulor" style="margin-bottom:1.5rem;"><ol style="display:flex;flex-wrap:wrap;gap:0.35rem;list-style:none;margin:0;padding:0;font-size:0.78rem;color:rgba(255,255,255,0.4);"><li><a href="/" style="color:rgba(255,255,255,0.5);text-decoration:none;">Hem</a> <span style="opacity:0.3;">/</span></li><li><a href="/for/guider/" style="color:rgba(255,255,255,0.5);text-decoration:none;">Guider</a> <span style="opacity:0.3;">/</span></li><li style="color:white;">Vad kostar det?</li></ol></nav> <p style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.6rem;">Prisguide 2025 · Av Scenkonsult Norden</p> <h1 style="font-family:'DM Serif Display',serif;font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;color:white;margin:0 0 1rem;">Vad kostar det att hyra scen, ljud och ljus?</h1> <p style="color:rgba(255,255,255,0.6);font-size:clamp(0.95rem,2vw,1.1rem);line-height:1.75;margin:0;">Exakta priser ur vårt sortiment — inga uppskattningar. Använd moms-toggle för att växla inkl/exkl.</p> </div> </div> <article style="background:#0c0a24;padding:clamp(2.5rem,5vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px;margin:0 auto;color:rgba(255,255,255,0.65);font-size:1rem;line-height:1.8;"> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.4rem,3vw,1.9rem);color:white;margin:0 0 1.5rem;">Exempelpaket — verkliga produkter och priser</h2> <div style="display:flex;flex-direction:column;gap:2rem;margin-bottom:3rem;"> ${paket.map((pak) => renderTemplate`<div style="background:#1e1850;border-radius:16px;overflow:hidden;"> <div style="padding:1.25rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.07);"> <h3 style="font-family:'DM Serif Display',serif;font-size:1.15rem;color:white;margin:0;">${pak.title}</h3> </div> <div style="padding:1rem 1.5rem;"> ${pak.rows.map((r) => renderTemplate`<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);"> <div style="display:flex;gap:0.75rem;align-items:center;"> <span style="background:rgba(196,181,244,0.1);color:#c4b5f4;font-size:0.7rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:9999px;white-space:nowrap;">${r.kat}</span> <a${addAttribute(r.l, "href")} style="color:rgba(255,255,255,0.65);font-size:0.88rem;text-decoration:none;">${r.prod}</a> </div> <span style="color:white;font-weight:600;white-space:nowrap;margin-left:1rem;"><span${addAttribute(r.p, "data-exkl")}>${r.p}</span> kr</span> </div>`)} <div style="display:flex;justify-content:space-between;align-items:center;padding:0.85rem 0 0.25rem;"> <div> <span style="color:rgba(255,255,255,0.35);font-size:0.8rem;">${pak.note}</span> </div> <div style="text-align:right;"> <div style="color:rgba(255,255,255,0.3);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.06em;">Delsumma</div> <div style="font-family:'DM Serif Display',serif;font-size:1.5rem;color:#c4b5f4;"><span${addAttribute(pak.total, "data-exkl")}>${pak.total}</span> kr</div> </div> </div> </div> </div>`)} </div> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.4rem,3vw,1.9rem);color:white;margin:3rem 0 1rem;">Sparatips</h2> <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:3rem;"> ${sparTips.map((r) => renderTemplate`<div style="display:flex;gap:1rem;padding:0.85rem 1rem;background:#1e1850;border-radius:8px;"> <span style="color:#86efac;font-size:0.8rem;flex-shrink:0;margin-top:0.2rem;">✓</span> <div><strong style="color:white;font-size:0.9rem;">${r.t}:</strong> <span style="color:rgba(255,255,255,0.55);font-size:0.88rem;">${r.d}</span></div> </div>`)} </div> <div style="background:linear-gradient(135deg,#1e1850,#0c0a24);border:1px solid rgba(196,181,244,0.2);border-radius:16px;padding:2rem;text-align:center;margin-top:3rem;"> <h2 style="font-family:'DM Serif Display',serif;font-size:1.5rem;color:white;margin:0 0 0.5rem;">Begär offert — svar inom 2 timmar</h2> <p style="color:rgba(255,255,255,0.55);font-size:0.95rem;margin:0 0 1.5rem;">Berätta om ditt event så sätter vi ihop exakt pris.</p> <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;"> <a href="/bokningssida/" style="background:#c4b5f4;color:#0c0a24;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:0.8rem 1.75rem;border-radius:4px;">Begär offert</a> <a href="/vara-tjanster/" style="border:1px solid rgba(196,181,244,0.4);color:rgba(255,255,255,0.7);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:0.8rem 1.75rem;border-radius:4px;">Se hela sortimentet</a> </div> </div> </div> </article> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/guider/vad-kostar-det.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/guider/vad-kostar-det.astro";
const $$url = "/for/guider/vad-kostar-det/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VadKostarDet,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
