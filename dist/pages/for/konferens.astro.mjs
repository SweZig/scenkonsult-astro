/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DH83owMh.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const faq = [
    {
      q: "Vilket PA-system passar en konferens f\xF6r 100 personer?",
      a: "F\xF6r 100 personer i en normal konferenslokal passar kolumnh\xF6gtalare (som Alto TS112C) utm\xE4rkt \u2014 diskret design, brett ljudspridning och enkel styrning via app. Beh\xF6ver ni mer volym eller salen \xE4r stor rekommenderar vi Event Small-paketet."
    },
    {
      q: "Hur hanterar ni mikrofoner f\xF6r panel och Q&A?",
      a: "Vi hyr ut tr\xE5dl\xF6sa handmikrofoner, headset och bordsmikrofoner. F\xF6r Q&A-format \xE4r tr\xE5dl\xF6sa handmikrofoner att f\xF6redra \u2014 en f\xF6r moderatorn och en eller flera att skicka runt i publiken."
    },
    {
      q: "Kan ni kombinera projektor och ljud i ett paket?",
      a: "Ja, vi s\xE4tter ihop kompletta AV-paket anpassade f\xF6r er lokal. Ber\xE4tta om lokalens storlek och antal sittplatser s\xE5 rekommenderar vi r\xE4tt projektorstyrka och PA-system."
    },
    {
      q: "Kan ni leverera och montera samma dag?",
      a: "Ja, vid tillg\xE4nglighet. Vi rekommenderar att boka med minst 2\u20133 dagars framf\xF6rh\xE5llning. Ring oss direkt f\xF6r akuta bokningar \u2014 072-448 10 00."
    },
    {
      q: "Hur fungerar betalning f\xF6r f\xF6retag och offentlig sektor?",
      a: "Vi fakturerar med individuella betalningsvillkor f\xF6r registrerade f\xF6retag och myndigheter (vanligen 5\u201330 dagar beroende p\xE5 kreditrating). Vi kan utf\xE4rda offerter och orderbekr\xE4ftelser f\xF6r upphandlingsprocesser."
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Uthyrning av AV-utrustning och konferensteknik i Stockholm",
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
        "description": "Hyr AV-utrustning, mikrofoner, projektorer och PA-system till konferenser och f\xF6rel\xE4sningar i Stockholm.",
        "url": "https://scenkonsult.se/for/konferens/"
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra AV-utrustning & Mikrofoner till Konferens Stockholm | Scenkonsult", "description": "Hyr projektor, PA-system och mikrofoner till konferens och f\xF6rel\xE4sning i Stockholm. Leverans & montering. Faktura med individuella villkor f\xF6r f\xF6retag. Ring 072-448 10 00.", "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "AV-teknik till konferens i", "h1Accent": "Stockholm", "intro": "Professionellt ljud och bild f\xF6r presentationer, paneldiskussioner, f\xF6rel\xE4sningar och hybridm\xF6ten. Vi levererar och monterar \u2014 ni fokuserar p\xE5 inneh\xE5llet.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "F\xF6r ditt event", href: "/for/" },
    { label: "Konferens & f\xF6rel\xE4sning" }
  ], "badges": [
    "Faktura med individuella villkor",
    "Leverans & montering i Storstockholm",
    "Konferens 20\u2013500 deltagare",
    "Tekniker p\xE5 plats tillg\xE4ngligt"
  ] })}  ${maybeRenderHead()}<section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">AV-utrustning</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 1.25rem; max-width:680px;">Allt för ett professionellt konferensljud</h2> <p style="color:rgba(255,255,255,0.55); font-size:1rem; line-height:1.75; max-width:640px; margin:0 0 3rem;">Dåligt ljud tvingar deltagarna att anstränga sig för att höra — det tömmer energi och fokus. Vi hyr ut utrustning som låter bra och är enkel att använda, med eller utan tekniker på plats.</p> <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1.5rem;"> ${[
    { icon: "\u{1F50A}", title: "Kolumnh\xF6gtalare", desc: "Alto TS112C \u2014 diskret, bred t\xE4ckning, styrbar via app. Perfekt f\xF6r konferenssalar och f\xF6rel\xE4sningslokaler.", link: "/vara-tjanster/hyra-ljud/", cta: "Se ljud" },
    { icon: "\u{1F3A4}", title: "Tr\xE5dl\xF6sa mikrofoner", desc: "Hand, headset och bordsmikrofoner. Shure och AKG f\xF6r kristallklart tal utan st\xF6rningar.", link: "/vara-tjanster/hyra-ljud/", cta: "Se mikrofoner" },
    { icon: "\u{1F4FD}\uFE0F", title: "Projektor & duk", desc: "4000\u20137000 lumen projektorer. Dukar fr\xE5n 180 till 400 cm. Passar konferenssalar i alla storlekar.", link: "/vara-tjanster/hyra-bild-projektorer-skarmar/", cta: "Se projektorer" },
    { icon: "\u{1F4FA}", title: "LED-sk\xE4rmar & TV", desc: "Platta sk\xE4rmar p\xE5 stativ f\xF6r presentationer och bildspel. Skarpa och tysta \u2014 inga fl\xE4ktljud.", link: "/vara-tjanster/hyra-bild-projektorer-skarmar/", cta: "Se sk\xE4rmar" }
  ].map((item) => renderTemplate`<div style="background:#1e1850; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.75rem; display:flex; flex-direction:column; gap:0.75rem;"> <div style="font-size:1.75rem;">${item.icon}</div> <h3 style="font-family:'DM Serif Display',serif; font-size:1.2rem; color:white; margin:0;">${item.title}</h3> <p style="color:rgba(255,255,255,0.55); font-size:0.88rem; line-height:1.65; margin:0; flex:1;">${item.desc}</p> <a${addAttribute(item.link, "href")} style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; text-decoration:none;">${item.cta} →</a> </div>`)} </div> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div class="g2c" style="max-width:1100px; margin:0 auto;"> <div> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Rekommenderade paket</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 1.5rem;">Rätt paket för er storlek</h2> ${[
    {
      size: "Litet m\xF6te / seminarium",
      guests: "20\u201350 deltagare",
      items: ["1\xD7 kolumnh\xF6gtalare", "1\xD7 tr\xE5dl\xF6s handmick", "1\xD7 projektor 4000 lumen", "1\xD7 projektorduk 180 cm"]
    },
    {
      size: "Medelstort event",
      guests: "50\u2013150 deltagare",
      items: ["2\xD7 kolumnh\xF6gtalare stereo", "2\xD7 tr\xE5dl\xF6sa mikrofoner", "1\xD7 projektor 6000 lumen", "1\xD7 duk 250 cm + stativ"]
    },
    {
      size: "Stor konferens / f\xF6rel\xE4sning",
      guests: "150\u2013500 deltagare",
      items: ["PA Event Medium med subs", "4\xD7 tr\xE5dl\xF6sa mikrofoner", "Dubbla projektorer eller LED-v\xE4gg", "Tekniker ing\xE5r i priset"]
    }
  ].map((p) => renderTemplate`<div style="background:#1e1850; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.5rem; margin-bottom:1rem;"> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;"> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; font-weight:700; color:white; margin:0;">${p.size}</h3> <span style="background:rgba(196,181,244,0.12); color:#c4b5f4; font-size:0.75rem; font-weight:600; padding:0.2rem 0.6rem; border-radius:9999px; white-space:nowrap;">${p.guests}</span> </div> ${p.items.map((i) => renderTemplate`<div style="display:flex; align-items:center; gap:0.5rem; padding:0.3rem 0;"> <span style="color:#86efac; font-size:0.75rem;">✓</span> <span style="color:rgba(255,255,255,0.6); font-size:0.85rem;">${i}</span> </div>`)} </div>`)} </div> <div style="position:sticky; top:calc(var(--nav-offset,166px) + 2rem);"> <div style="background:#1e1850; border:1px solid rgba(196,181,244,0.2); border-radius:16px; padding:2rem;"> <h3 style="font-family:'DM Serif Display',serif; font-size:1.4rem; color:white; margin:0 0 1rem;">Begär offert för er konferens</h3> <p style="color:rgba(255,255,255,0.45); font-size:0.85rem; margin:0 0 1.5rem; line-height:1.6;">Berätta om antal deltagare, lokal och datum — vi svarar med ett konkret förslag inom 2 timmar.</p> ${[
    ["Svarstid", "Inom 2 timmar"],
    ["Betalning", "Faktura med individuella villkor"],
    ["Leverans", "Storstockholm"],
    ["Montering", "Tillg\xE4ngligt"]
  ].map(([l, v]) => renderTemplate`<div style="display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.07);"> <span style="color:rgba(255,255,255,0.4); font-size:0.85rem;">${l}</span> <span style="color:white; font-size:0.85rem; font-weight:600;">${v}</span> </div>`)} <a href="/bokningssida/" style="display:block; background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:1rem 2rem; border-radius:4px; text-align:center; margin-top:1.5rem;">
Begär offert
</a> </div> </div> </div> </section>  <section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Vanliga frågor</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2.5rem;">Konferensteknik — vanliga frågor</h2> <div style="display:flex; flex-direction:column;"> ${faq.map((item) => renderTemplate`<details style="border-bottom:1px solid rgba(255,255,255,0.07);"> <summary style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 0; cursor:pointer; list-style:none; color:white; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:1rem; gap:1rem;"> ${item.q} <span style="color:#c4b5f4; font-size:1.25rem; flex-shrink:0;">+</span> </summary> <p style="color:rgba(255,255,255,0.6); font-size:0.95rem; line-height:1.75; margin:0 0 1.25rem; padding-right:2rem;">${item.a}</p> </details>`)} </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/konferens/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/konferens/index.astro";
const $$url = "/for/konferens/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
