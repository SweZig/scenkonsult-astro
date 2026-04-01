/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_Qdf46Cx6.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const faq = [
    {
      q: "Hur mycket ljud beh\xF6vs p\xE5 ett studentflak?",
      a: "Tumregel: 2 aktiva h\xF6gtalare (minst 12-tum) + 1 subbasen f\xF6r ett flak med 20\u201340 studenter. Viktigare \xE4n watt \xE4r r\xE4tt placering \u2014 h\xF6gtalarna b\xF6r riktas mot folket, inte ut\xE5t. Vi hj\xE4lper er v\xE4lja r\xE4tt system."
    },
    {
      q: "Hur fixar man str\xF6mmen p\xE5 ett flak?",
      a: "Vi levererar utrustning med 230V-anslutning (vanliga eluttag). Ni beh\xF6ver en dragkabel fr\xE5n fordonets 230V-uttag eller ett separat batteri/elverk. Vi kan r\xE5da om r\xE4tt effektbehov f\xF6r er rigg."
    },
    {
      q: "Kan vi ansluta mobil eller Spotify direkt?",
      a: "Ja! Alla v\xE5ra paket har Bluetooth och AUX-ing\xE5ng. Koppla in mobilen eller datorn och spela direkt fr\xE5n Spotify eller er studentl\xE5tlista."
    },
    {
      q: "Hur l\xE5nar man b\xE4st en mikrofon till studentflaket?",
      a: "Vi hyr ut tr\xE5dl\xF6sa handmikrofoner som passar perfekt f\xF6r talen och s\xE5ngen p\xE5 flaket. En tr\xE5dl\xF6s mick \xE4r smidigare \xE4n med sladd och ger mer r\xF6relseyta."
    },
    {
      q: "Hur tidigt m\xE5ste jag boka f\xF6r studentflaket?",
      a: "Studentperioden (maj\u2013juni) \xE4r v\xE5r allra mest bokade tid. Vi rekommenderar att boka 4\u20138 veckor i f\xF6rv\xE4g. Ring oss tidigt \u2014 popul\xE4ra helger tar slut snabbt."
    },
    {
      q: "Kan vi h\xE4mta och l\xE4mna utrustningen p\xE5 en l\xF6rdag?",
      a: "Ja, vi har \xF6ppet vardagar 09:00\u201317:00. Hyr fredag och l\xE4mna tillbaka m\xE5ndag \u2014 du betalar bara ett dygn, f\xF6rutsatt att utrustningen inte \xE4r bokad av annan kund. Perfekt f\xF6r studentflaket som k\xF6rs p\xE5 l\xF6rdag."
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Uthyrning av ljud och mikrofoner till studentflak i Stockholm",
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
        "url": "https://scenkonsult.se/for/studentflak/"
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra Ljud & Mikrofon till Studentflak i Stockholm | Scenkonsult", "description": "Hyr ett komplett ljudsystem till studentflaket i Stockholm. Bluetooth, tr\xE5dl\xF6s mick och bra bas. Fr\xE5n 1 000 kr/dygn. Ring 072-448 10 00.", "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Ljud till studentflaket i", "h1Accent": "Stockholm", "intro": "Flaket rullar, solen skiner och musiken ska d\xE5na. Vi hyr ut kompakta och kraftfulla ljudsystem till studentflak \u2014 enkla att koppla in och sv\xE5ra att stoppa.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "F\xF6r ditt event", href: "/for/" },
    { label: "Studentflak" }
  ], "badges": [
    "L\xE4tta att montera",
    "Bluetooth & AUX",
    "Tr\xE5dl\xF6s mikrofon tillg\xE4nglig",
    "Helg = betala bara 1 dygn*"
  ] })}  ${maybeRenderHead()}<section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1000px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Det ni behöver</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 3rem; max-width:640px;">Enkel checklista för ett bra flak</h2> <div class="g2c"> <div> ${[
    { must: true, item: "PA-system med subbasen", desc: 'Minst 2\xD712" + 1 sub f\xF6r riktigt tryck' },
    { must: true, item: "Tr\xE5dl\xF6s mikrofon", desc: "F\xF6r talen, s\xE5ngen och uppror p\xE5 flaket" },
    { must: true, item: "Bluetooth-anslutning", desc: "Spela direkt fr\xE5n Spotify via mobil" },
    { must: false, item: "Extra subbasen", desc: "Om ni vill ha rej\xE4lt basstryck" },
    { must: false, item: "Discoljus", desc: "R\xF6kmaskin + laser f\xF6r kv\xE4llsfinalen" },
    { must: false, item: "Tillsatsstativ", desc: "Placera h\xF6gtalarna p\xE5 r\xE4tt h\xF6jd" }
  ].map((row) => renderTemplate`<div style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"> <span${addAttribute(`font-size:0.75rem; margin-top:0.2rem; flex-shrink:0; color:${row.must ? "#86efac" : "rgba(255,255,255,0.25)"}`, "style")}>${row.must ? "\u2713" : "+"}</span> <div> <div${addAttribute(`font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:600; color:${row.must ? "white" : "rgba(255,255,255,0.5)"};`, "style")}>${row.item}</div> <div style="color:rgba(255,255,255,0.4); font-size:0.8rem;">${row.desc}</div> </div> </div>`)} <p style="color:rgba(255,255,255,0.3); font-size:0.75rem; margin-top:0.75rem;">✓ = Måste ha &nbsp;&nbsp; + = Kul att ha</p> </div> <div> <div style="background:#1e1850; border:1px solid rgba(196,181,244,0.2); border-radius:16px; padding:2rem;"> <h3 style="font-family:'DM Serif Display',serif; font-size:1.35rem; color:white; margin:0 0 0.5rem;">Studentflak-paketet</h3> <p style="color:rgba(255,255,255,0.45); font-size:0.85rem; margin:0 0 1.25rem;">Populäraste kombinationen för ett flak med 20–40 studenter:</p> ${[
    ["PA-system", '2\xD7 LD Systems 12" aktiva'],
    ["Subbasen", '1\xD7 aktiv 18"'],
    ["Mikrofon", "1\xD7 tr\xE5dl\xF6s hand"],
    ["Anslutning", "Bluetooth + AUX"],
    ["Stativ", "2\xD7 h\xF6gtalarstativ"]
  ].map(([l, v]) => renderTemplate`<div style="display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.07);"> <span style="color:rgba(255,255,255,0.4); font-size:0.85rem;">${l}</span> <span style="color:white; font-size:0.85rem; font-weight:600;">${v}</span> </div>`)} <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(196,181,244,0.2);"> <div style="display:flex; justify-content:space-between; align-items:center;"> <span style="color:rgba(255,255,255,0.5); font-size:0.85rem;">Från ca</span> <span style="font-family:'DM Serif Display',serif; font-size:1.75rem; color:#c4b5f4;">2 500 kr</span> </div> <p style="color:rgba(255,255,255,0.3); font-size:0.75rem; margin:0.25rem 0 0;">Per dygn (*helg = 1 dygns pris fredag–måndag, förutsatt tillgänglighet)</p> </div> <a href="/bokningssida/" style="display:block; background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:0.9rem 2rem; border-radius:4px; text-align:center; margin-top:1.25rem;">
Boka nu
</a> </div> <p style="color:rgba(255,255,255,0.3); font-size:0.8rem; text-align:center; margin-top:0.75rem;">Boka tidigt — maj–juni är fullbokat snabbt</p> </div> </div> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Tips</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2rem;">3 tips för ett bra flakljud</h2> <div style="display:flex; flex-direction:column; gap:1rem;"> ${[
    { nr: "01", tip: "Placera h\xF6gtalarna r\xE4tt", desc: "Rikta h\xF6gtalarna in\xE5t mot folket \u2014 inte ut\xE5t. Ljudet ska tr\xE4ffa personerna, inte \xE5ka f\xF6rbi dem." },
    { nr: "02", tip: "Anv\xE4nd tr\xE5dl\xF6s mikrofon", desc: "En mikrofon med sladd p\xE5 ett flak \xE4r ett snubbelrisk och begr\xE4nsar r\xF6relsefrihet. Tr\xE5dl\xF6st \xE4r v\xE4rt det." },
    { nr: "03", tip: "Ha en backup-spellista", desc: "Bluetooth kan droppa. Ha en AUX-kabel som backup och en f\xF6rberedd spellista p\xE5 tv\xE5 enheter." }
  ].map((t) => renderTemplate`<div style="background:#1e1850; border-radius:12px; padding:1.5rem; display:flex; gap:1.25rem; align-items:flex-start;"> <span style="font-family:'DM Serif Display',serif; font-size:1.5rem; color:rgba(196,181,244,0.3); flex-shrink:0; line-height:1;">${t.nr}</span> <div> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; font-weight:700; color:white; margin:0 0 0.4rem;">${t.tip}</h3> <p style="color:rgba(255,255,255,0.5); font-size:0.88rem; line-height:1.6; margin:0;">${t.desc}</p> </div> </div>`)} </div> </div> </section>  <section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Vanliga frågor</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2.5rem;">Studentflak — vanliga frågor</h2> <div style="display:flex; flex-direction:column;"> ${faq.map((item) => renderTemplate`<details style="border-bottom:1px solid rgba(255,255,255,0.07);"> <summary style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 0; cursor:pointer; list-style:none; color:white; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:1rem; gap:1rem;"> ${item.q} <span style="color:#c4b5f4; font-size:1.25rem; flex-shrink:0;">+</span> </summary> <p style="color:rgba(255,255,255,0.6); font-size:0.95rem; line-height:1.75; margin:0 0 1.25rem; padding-right:2rem;">${item.a}</p> </details>`)} </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/studentflak/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/studentflak/index.astro";
const $$url = "/for/studentflak/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
