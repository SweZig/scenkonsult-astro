/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DH83owMh.mjs';
import { $ as $$CategoryHero } from '../../chunks/CategoryHero_Dul6iQjy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const faq = [
    {
      q: "Hur stor PA-anl\xE4ggning beh\xF6ver jag till ett br\xF6llop?",
      a: "F\xF6r 50\u201380 g\xE4ster inomhus r\xE4cker ett Event Small eller Medium-paket. Utomhus dubblas effektbehovet. Vi hj\xE4lper dig dimensionera exakt r\xE4tt utifr\xE5n lokal och antal g\xE4ster."
    },
    {
      q: "Kan vi hyra utrustning utan att ha tekniker p\xE5 plats?",
      a: "Ja, alla v\xE5ra standardpaket \xE4r byggda f\xF6r sj\xE4lvinstallation. Vi g\xE5r igenom allt vid avh\xE4mtning och tillhandah\xE5ller instruktioner. Vill du ha tekniker p\xE5 plats erbjuder vi det som till\xE4gg (600 kr/tim)."
    },
    {
      q: "Beh\xF6ver vi en scen p\xE5 ett br\xF6llop?",
      a: "En liten scen (4\u20136 m\xB2) f\xF6r trubaduren eller DJ:n ger ett professionellt intryck och skapar tydlig fokuspunkt. Den signalerar till g\xE4sterna att det h\xE4nder saker \u2014 och frig\xF6r naturligt dansyta framf\xF6r."
    },
    {
      q: "Vad kostar ett komplett br\xF6llopspaktet?",
      a: "Ett komplett paket med ljud, ljus och scen f\xF6r 80\u2013100 g\xE4ster startar fr\xE5n ca 4 000\u20137 000 kr f\xF6r ett dygn. Pris beror p\xE5 utrustning och eventuell leverans. Beg\xE4r offert s\xE5 r\xE4knar vi ihop exakt."
    },
    {
      q: "Hur l\xE5ngt i f\xF6rv\xE4g m\xE5ste vi boka f\xF6r br\xF6llop?",
      a: "Br\xF6llopss\xE4songen (maj\u2013september) bokas snabbt. Vi rekommenderar att boka 2\u20134 m\xE5nader i f\xF6rv\xE4g f\xF6r att s\xE4kra din dag. Vi hanterar \xE4ven korta varsel om utrustningen \xE4r tillg\xE4nglig."
    },
    {
      q: "Kan utrustningen anv\xE4ndas utomhus?",
      a: "Ja, all v\xE5r utrustning t\xE5l normal v\xE4ta och h\xF6g luftfuktighet. Vi rekommenderar alltid v\xE4derskydd vid l\xE4ngre utomhusarrangemang och kan r\xE5da om r\xE4tt l\xF6sning f\xF6r just er plats."
    }
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Uthyrning av ljud, ljus och scen till br\xF6llop i Stockholm",
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
        "description": "Hyr komplett ljud, ljus och scen till ert br\xF6llop i Stockholm. Leverans, montering och tekniker tillg\xE4ngligt.",
        "url": "https://scenkonsult.se/for/brollop/"
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hyra Ljud, Ljus & Scen till Br\xF6llop i Stockholm | Scenkonsult", "description": "Hyr komplett ljud, ljus och scen till ert br\xF6llop i Stockholm fr\xE5n 599 kr/dygn. Leverans i hela Storstockholm. Tekniker p\xE5 plats om ni vill. Ring 072-448 10 00.", "schemaExtra": pageSchema }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryHero", $$CategoryHero, { "h1": "Teknik till br\xF6llop i", "h1Accent": "Stockholm", "intro": "Ert br\xF6llop f\xF6rtj\xE4nar perfekt ljud, st\xE4mningsfull belysning och en scen som lyfter allt. Vi har levererat till hundratals br\xF6llop sedan 1986 \u2014 vi vet vad som fungerar.", "breadcrumbs": [
    { label: "Hem", href: "/" },
    { label: "F\xF6r ditt event", href: "/for/" },
    { label: "Br\xF6llop" }
  ], "badges": [
    "Br\xF6llopspaket fr\xE5n 2 500 kr/dygn",
    "Leverans & montering i Storstockholm",
    "Tekniker p\xE5 plats tillg\xE4ngligt",
    "Gener\xF6sa avbokningsregler"
  ] })}  ${maybeRenderHead()}<section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Bröllopsteknik</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,2.8rem); color:white; margin:0 0 1.25rem; max-width:700px;">Rätt teknik förvandlar en fin fest till ett oförglömligt ögonblick</h2> <p style="color:rgba(255,255,255,0.6); font-size:clamp(0.95rem,2vw,1.1rem); line-height:1.75; max-width:680px; margin:0 0 3rem;">
Dåligt ljud förstör talen. Fel ljussättning dödar stämningen. En scen som vacklar ger fel signaler. Vi hyr ut utrustning som faktiskt fungerar — och vi hjälper er välja rätt storlek för er lokal och era gäster.
</p> <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.5rem;"> ${[
    {
      icon: "\u{1F50A}",
      title: "Ljud",
      desc: "PA-system dimensionerat f\xF6r er lokal. Tr\xE5dl\xF6sa mikrofoner f\xF6r tal, trubadur eller bandet. Kristallklart ljud utan feedback.",
      link: "/vara-tjanster/hyra-ljud/",
      cta: "Se ljudpaket"
    },
    {
      icon: "\u{1F4A1}",
      title: "Ljus & st\xE4mning",
      desc: "Uplights l\xE4ngs v\xE4ggarna, spotlights p\xE5 bordsarrangemangen, dansgolvsbelysning. R\xE4tt ljus s\xE4tter hela st\xE4mningen.",
      link: "/vara-tjanster/hyra-ljus/",
      cta: "Se ljuspaket"
    },
    {
      icon: "\u{1F3AD}",
      title: "Scen & podium",
      desc: "En liten 4\u20136 m\xB2 scen f\xF6r DJ:n eller trubaduren. Professionell k\xE4nsla och tydlig fokuspunkt f\xF6r g\xE4sterna.",
      link: "/vara-tjanster/hyra-scen/",
      cta: "Se scener"
    },
    {
      icon: "\u{1F3A7}",
      title: "DJ-utrustning",
      desc: "Pioneer XDJ-RX3, CDJ-3000 eller kompakta kontroller. Hyr professionell DJ-utrustning om ni har en DJ ni litar p\xE5.",
      link: "/vara-tjanster/hyra-dj/",
      cta: "Se DJ-utrustning"
    }
  ].map((item) => renderTemplate`<div style="background:#1e1850; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.75rem; display:flex; flex-direction:column; gap:0.75rem; transition:border-color 0.2s;" onmouseenter="this.style.borderColor='rgba(196,181,244,0.35)'" onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)'"> <div style="font-size:1.75rem;">${item.icon}</div> <h3 style="font-family:'DM Serif Display',serif; font-size:1.25rem; color:white; margin:0;">${item.title}</h3> <p style="color:rgba(255,255,255,0.55); font-size:0.9rem; line-height:1.65; margin:0; flex:1;">${item.desc}</p> <a${addAttribute(item.link, "href")} style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; text-decoration:none; margin-top:0.25rem;"> ${item.cta} →
</a> </div>`)} </div> </div> </section>  <section style="background:#0c0a24; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div class="g2c" style="max-width:1100px; margin:0 auto;"> <div> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Bröllopschecklista</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 1.5rem;">Vad behöver ni till bröllopet?</h2> ${[
    { fas: "Ljud f\xF6r tal & tal", items: ["Tr\xE5dl\xF6s mikrofon f\xF6r toastmaster", "PA-system f\xF6r 50\u2013200 g\xE4ster", "Monitor s\xE5 artisten h\xF6r sig sj\xE4lv"] },
    { fas: "Ceremonin", items: ["Bluetooth-h\xF6gtalare f\xF6r processionsmusik", "Tr\xE5dl\xF6st headset f\xF6r pr\xE4sten/celebranten"] },
    { fas: "Middagen", items: ["Bakgrundsmusik i l\xE5g volym", "Mikrofon f\xF6r tal vid bordet"] },
    { fas: "Dansgolvet", items: ["PA med subbasar f\xF6r dansgolvet", "Discoljus, laser och r\xF6kmaskin", "DJ-utrustning eller scen f\xF6r live"] }
  ].map((block) => renderTemplate`<div style="margin-bottom:1.5rem;"> <h3 style="font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:700; color:#c4b5f4; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 0.6rem;">${block.fas}</h3> ${block.items.map((item) => renderTemplate`<div style="display:flex; align-items:center; gap:0.6rem; padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.05);"> <span style="color:#86efac; font-size:0.8rem;">✓</span> <span style="color:rgba(255,255,255,0.65); font-size:0.9rem;">${item}</span> </div>`)} </div>`)} </div> <div> <div style="background:#1e1850; border:1px solid rgba(196,181,244,0.2); border-radius:16px; padding:2rem; margin-bottom:1.5rem;"> <h3 style="font-family:'DM Serif Display',serif; font-size:1.4rem; color:white; margin:0 0 1rem;">Typiskt bröllopspaketet</h3> <p style="color:rgba(255,255,255,0.55); font-size:0.9rem; line-height:1.65; margin:0 0 1.25rem;">För 80–120 gäster inomhus rekommenderar vi:</p> ${[
    ["PA-system", "Event Medium (2 toppar + sub)"],
    ["Mikrofoner", "2\xD7 tr\xE5dl\xF6s hand + 1\xD7 headset"],
    ["Scenljus", "8\xD7 LED par-lampor"],
    ["Scen", "2\xD73 m podium f\xF6r DJ/artist"],
    ["Discoljus", "2\xD7 moving head + laser"],
    ["Leverans & montering", "Tillg\xE4ngligt som till\xE4gg"]
  ].map(([label, value]) => renderTemplate`<div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid rgba(255,255,255,0.07);"> <span style="color:rgba(255,255,255,0.5); font-size:0.85rem;">${label}</span> <span style="color:white; font-size:0.85rem; font-weight:600; text-align:right; max-width:55%;">${value}</span> </div>`)} <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(196,181,244,0.2);"> <div style="display:flex; justify-content:space-between; align-items:center;"> <span style="color:rgba(255,255,255,0.5); font-size:0.85rem;">Från ca</span> <span style="font-family:'DM Serif Display',serif; font-size:1.6rem; color:#c4b5f4;">4 500 kr</span> </div> <p style="color:rgba(255,255,255,0.3); font-size:0.75rem; margin:0.25rem 0 0;">Per dygn, exkl. leverans. Offert utan bindning.</p> </div> </div> <a href="/bokningssida/" style="display:block; background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:1rem 2rem; border-radius:4px; text-align:center; transition:background 0.2s;" onmouseenter="this.style.background='#e2dcfb'" onmouseleave="this.style.background='#c4b5f4'">
Begär offert — svar inom 2 timmar
</a> </div> </div> </section>  <section style="background:#111030; padding: clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px; margin:0 auto;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Vanliga frågor</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.6rem,3.5vw,2.4rem); color:white; margin:0 0 2.5rem;">Allt du undrar om bröllopsteknik</h2> <div style="display:flex; flex-direction:column; gap:0;"> ${faq.map((item, i) => renderTemplate`<details style="border-bottom:1px solid rgba(255,255,255,0.07); padding:0;"> <summary style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem 0; cursor:pointer; list-style:none; color:white; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:1rem; gap:1rem;"> ${item.q} <span style="color:#c4b5f4; font-size:1.25rem; flex-shrink:0; transition:transform 0.2s;">+</span> </summary> <p style="color:rgba(255,255,255,0.6); font-size:0.95rem; line-height:1.75; margin:0 0 1.25rem; padding-right:2rem;">${item.a}</p> </details>`)} </div> </div> </section>  <section style="background:linear-gradient(135deg,#1e1850,#0c0a24); padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem); text-align:center;"> <p style="color:#c4b5f4; font-family:'Space Grotesk',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem;">Sedan 1986</p> <h2 style="font-family:'DM Serif Display',serif; font-size:clamp(1.8rem,4vw,3rem); color:white; margin:0 0 1rem; max-width:600px; margin-inline:auto;">Ert bröllop förtjänar teknik som fungerar</h2> <p style="color:rgba(255,255,255,0.55); font-size:1rem; max-width:480px; margin:0 auto 2rem;">Ring oss eller begär offert — vi svarar inom ett par timmar och hjälper er välja rätt utrustning för er dag.</p> <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;"> <a href="/bokningssida/" style="background:#c4b5f4; color:#0c0a24; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; padding:0.9rem 2rem; border-radius:4px;">Begär offert</a> <a data-tel="MDcyNDQ4MTAwMA==" data-prefix="📞 " data-label="072-448 10 00" href="#tel" style="color:rgba(255,255,255,0.55); font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:0.9rem; text-decoration:none; padding:0.9rem 0; align-self:center;"><noscript>📞 072-448 10 00</noscript></a> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/brollop/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/brollop/index.astro";
const $$url = "/for/brollop/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
