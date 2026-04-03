/* empty css                                       */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_DH83owMh.mjs';
export { renderers } from '../../../renderers.mjs';

const $$ChecklistaEvent = createComponent(($$result, $$props, $$slots) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Komplett checklista f\xF6r event \u2014 teknik, logistik och timing",
        "description": "Komplett checklista f\xF6r att planera teknik till fest och event. Ljud, ljus, scen, leverans och backup-plan. Nedladdningsbar PDF-version.",
        "author": { "@type": "Organization", "name": "Scenkonsult Norden" },
        "publisher": { "@type": "Organization", "name": "Scenkonsult Norden", "url": "https://scenkonsult.se" },
        "datePublished": "2025-01-01",
        "dateModified": "2025-03-01",
        "url": "https://scenkonsult.se/for/guider/checklista-event/"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Vad beh\xF6ver man t\xE4nka p\xE5 n\xE4r man hyr AV-utrustning till ett event?", "acceptedAnswer": { "@type": "Answer", "text": "De viktigaste faktorerna: 1) Boka i r\xE4tt tid (4\u20138 veckor f\xF6r popul\xE4ra datum). 2) M\xE4t lokalen och planera placering av h\xF6gtalare och scen. 3) Kontrollera eltillg\xE5ng (ampere och antal uttag). 4) Ha alltid en backup-plan f\xF6r tekniska problem. 5) Boka leverans och montering om ni inte vill sk\xF6ta det sj\xE4lva." } },
          { "@type": "Question", "name": "Hur l\xE5ng tid innan ska man boka teknik till ett br\xF6llop?", "acceptedAnswer": { "@type": "Answer", "text": "Boka teknik till br\xF6llop minst 2\u20134 m\xE5nader i f\xF6rv\xE4g om det \xE4r under h\xF6gs\xE4songen (maj\u2013september). Popul\xE4ra helger kan vara slutbokade l\xE5ngt i f\xF6rv\xE4g. Vi hanterar \xE4ven korta varsel om utrustningen \xE4r tillg\xE4nglig." } },
          { "@type": "Question", "name": "Vad ska man kontrollera i lokalen innan ett event?", "acceptedAnswer": { "@type": "Answer", "text": "Kontrollera: antal eluttag och ampere (PA kr\xE4ver ofta 16A), takh\xF6jd (f\xF6r h\xE4ngande ljus), akustik och efterklangstid, m\xF6jligheter att k\xF6ra kablar, eventuella ljud-restriktioner och st\xE4ngningstider." } }
        ]
      }
    ]
  };
  const checklistor = [
    {
      fas: "8\u201312 veckor f\xF6re",
      icon: "\u{1F4C5}",
      items: [
        { done: false, text: "V\xE4lj datum och boka lokal" },
        { done: false, text: "Uppskatta antal g\xE4ster" },
        { done: false, text: "Best\xE4m format: dans, middag, konferens, show" },
        { done: false, text: "Besluta om DJ, liveband eller kombination" },
        { done: false, text: "Beg\xE4r offert p\xE5 teknik" },
        { done: false, text: "Boka teknik (popul\xE4ra helger tar slut tidigt)" }
      ]
    },
    {
      fas: "4\u20136 veckor f\xF6re",
      icon: "\u{1F5D3}",
      items: [
        { done: false, text: "M\xE4t lokalens yta och planera layout" },
        { done: false, text: "Kontrollera eltillg\xE5ng (antal uttag, ampere)" },
        { done: false, text: "Best\xE4m placering av scen, PA och ljus" },
        { done: false, text: "Bekr\xE4fta leveransdag och leveranstid" },
        { done: false, text: "Boka eventuell tekniker p\xE5 plats" },
        { done: false, text: "Planera kabelv\xE4gar och dolda ledningar" }
      ]
    },
    {
      fas: "1 vecka f\xF6re",
      icon: "\u2705",
      items: [
        { done: false, text: "Bekr\xE4fta bokning och g\xE5 igenom specifikation" },
        { done: false, text: "Skicka lokal-ritning till leverant\xF6ren" },
        { done: false, text: "Testa all utrustning du hyr (om m\xF6jligt)" },
        { done: false, text: "Planera soundcheck-tid p\xE5 event-dagen" },
        { done: false, text: "Ha backup: reservkablar, extra mikrofon" },
        { done: false, text: "Informera DJ/artist om scenstorlek och setup" }
      ]
    },
    {
      fas: "Event-dagen",
      icon: "\u{1F3AA}",
      items: [
        { done: false, text: "Leverans och uppackning: r\xE4kna all utrustning" },
        { done: false, text: "Rigga i r\xE4tt ordning: scen \u2192 kablage \u2192 ljud \u2192 ljus" },
        { done: false, text: "Soundcheck: testa alla mikrofoner och kanaler" },
        { done: false, text: "Ljustest: k\xF6r igenom alla l\xE4gen" },
        { done: false, text: "Dokumentera riggning med foto (vid retur-fr\xE5gor)" },
        { done: false, text: "Ha tekniker-kontaktnummer l\xE4ttillg\xE4ngligt" }
      ]
    },
    {
      fas: "Retur",
      icon: "\u{1F4E6}",
      items: [
        { done: false, text: "Packa ner i original-f\xF6rpackning" },
        { done: false, text: "Rensa och torka av utrustningen" },
        { done: false, text: "R\xE4kna kablar och tillbeh\xF6r mot leveranslistan" },
        { done: false, text: "\xC5terl\xE4mna i tid (normalt dagen efter kl 11:00)" },
        { done: false, text: "Rapportera eventuella skador omg\xE5ende" }
      ]
    }
  ];
  const lokalKoll = [
    { punkt: "Eltillg\xE5ng", detalj: "R\xE4kna uttag, kontrollera s\xE4kringar. PA kr\xE4ver ofta 16A dedicerad krets." },
    { punkt: "Takh\xF6jd", detalj: "Min 2,5 m f\xF6r normal rigg. Moving heads h\xE4nger ofta p\xE5 3\u20134 m." },
    { punkt: "Akustik", detalj: "H\xE5rd lokal (sten, glas) = mycket efterklang. Kr\xE4ver l\xE4gre volym och EQ-anpassning." },
    { punkt: "Kabeldragning", detalj: "Planera hur kablar dras utan att folk snubblar. Kabelskydd finns att hyra." },
    { punkt: "Ljudrestriktioner", detalj: "Fr\xE5ga lokalen om max dB-niv\xE5 och st\xE4ngningstid. Vanligt p\xE5 hotell och restauranger." },
    { punkt: "Tillg\xE5ng f\xF6r leverans", detalj: "Lastbrygga, hiss eller ramp? Scenelement v\xE4ger 15\u201330 kg per modul." }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Komplett Checklista f\xF6r Event \u2014 Teknik, Logistik & Timing | Scenkonsult", "description": "Komplett checklista f\xF6r att planera AV-teknik till fest och event. Ljud, ljus, scen, leverans och backup-plan. Fr\xE5n Scenkonsult \u2014 uthyrare sedan 1986.", "schemaExtra": schema }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="background:linear-gradient(135deg,#1e1850 0%,#0c0a24 60%);padding-top:calc(36px + 130px + clamp(2rem,4vw,3.5rem));padding-bottom:clamp(2.5rem,5vw,4rem);padding-inline:clamp(1rem,5vw,5rem);"> <div style="max-width:820px;margin:0 auto;"> <nav aria-label="Brödsmulor" style="margin-bottom:1.5rem;"> <ol style="display:flex;flex-wrap:wrap;gap:0.35rem;list-style:none;margin:0;padding:0;font-size:0.78rem;color:rgba(255,255,255,0.4);"> <li><a href="/" style="color:rgba(255,255,255,0.5);text-decoration:none;">Hem</a> <span style="opacity:0.3;">/</span></li> <li><a href="/for/guider/" style="color:rgba(255,255,255,0.5);text-decoration:none;">Guider</a> <span style="opacity:0.3;">/</span></li> <li><span style="color:white;">Checklista för event</span></li> </ol> </nav> <p style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.6rem;">Guide · Av Scenkonsult Norden</p> <h1 style="font-family:'DM Serif Display',serif;font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;color:white;margin:0 0 1rem;">Komplett checklista för event</h1> <p style="color:rgba(255,255,255,0.6);font-size:clamp(0.95rem,2vw,1.1rem);line-height:1.75;margin:0;">Från bokning till retur — allt du behöver tänka på för att få tekniken att fungera. Byggt på erfarenheter från hundratals event sedan 1986.</p> </div> </div> <article style="background:#0c0a24;padding:clamp(2.5rem,5vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:820px;margin:0 auto;color:rgba(255,255,255,0.65);font-size:1rem;line-height:1.8;"> <!-- Checklistor per fas --> ${checklistor.map((fas, fi) => renderTemplate`<div${addAttribute(`margin-bottom:2.5rem;${fi > 0 ? "padding-top:2.5rem;border-top:1px solid rgba(255,255,255,0.07);" : ""}`, "style")}> <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;"> <span style="font-size:1.5rem;">${fas.icon}</span> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.3rem,3vw,1.7rem);color:white;margin:0;">${fas.fas}</h2> </div> <div style="display:flex;flex-direction:column;gap:0;"> ${fas.items.map((item) => renderTemplate`<div style="display:flex;align-items:flex-start;gap:0.85rem;padding:0.65rem 0;border-bottom:1px solid rgba(255,255,255,0.05);"> <div style="width:18px;height:18px;border:2px solid rgba(196,181,244,0.3);border-radius:4px;flex-shrink:0;margin-top:0.15rem;"></div> <span style="color:rgba(255,255,255,0.7);font-size:0.95rem;">${item.text}</span> </div>`)} </div> </div>`)} <!-- Lokalkoll --> <div style="padding-top:2.5rem;border-top:1px solid rgba(255,255,255,0.07);margin-bottom:2.5rem;"> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.3rem,3vw,1.7rem);color:white;margin:0 0 1.25rem;">🏛 Lokalen — vad du måste kontrollera</h2> <div style="display:flex;flex-direction:column;gap:0.75rem;"> ${lokalKoll.map((r) => renderTemplate`<div style="background:#1e1850;border-radius:10px;padding:1rem 1.25rem;display:flex;gap:1.25rem;align-items:flex-start;"> <span style="color:#c4b5f4;font-weight:700;font-family:'Space Grotesk',sans-serif;font-size:0.85rem;min-width:130px;flex-shrink:0;">${r.punkt}</span> <span style="color:rgba(255,255,255,0.55);font-size:0.88rem;line-height:1.6;">${r.detalj}</span> </div>`)} </div> </div> <!-- Backup-plan --> <div style="background:#1e1850;border:1px solid rgba(255,100,100,0.2);border-radius:14px;padding:1.75rem;margin-bottom:3rem;"> <h2 style="font-family:'DM Serif Display',serif;font-size:1.4rem;color:white;margin:0 0 1rem;">🛟 Backup-plan — ha alltid en plan B</h2> <div style="display:flex;flex-direction:column;gap:0.6rem;"> ${[
    "Extra XLR-kablar (minst 2 st per kanal)",
    "Reservmikrofon \u2014 minst en extra tr\xE5dl\xF6s",
    "Tekniker-nummret inlagt i mobilen",
    "Vetskap om n\xE4rmaste elcentral och s\xE4kringar",
    "Str\xF6m-UPS eller reservgenerator vid kritiska event",
    "Backup-spellista p\xE5 separat enhet (USB + dator)"
  ].map((i) => renderTemplate`<div style="display:flex;gap:0.75rem;align-items:flex-start;"> <span style="color:#fbbf24;font-size:0.8rem;margin-top:0.2rem;flex-shrink:0;">⚡</span> <span style="color:rgba(255,255,255,0.65);font-size:0.9rem;">${i}</span> </div>`)} </div> </div> <!-- CTA --> <div style="background:linear-gradient(135deg,#1e1850,#0c0a24);border:1px solid rgba(196,181,244,0.2);border-radius:16px;padding:2rem;text-align:center;margin-top:3rem;"> <h2 style="font-family:'DM Serif Display',serif;font-size:1.5rem;color:white;margin:0 0 0.5rem;">Vi hjälper dig checka av listan</h2> <p style="color:rgba(255,255,255,0.55);font-size:0.95rem;margin:0 0 1.5rem;">Berätta om ditt event — vi återkommer med ett förslag och kan svara på alla tekniska frågor.</p> <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;"> <a href="/bokningssida/" style="background:#c4b5f4;color:#0c0a24;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:0.8rem 1.75rem;border-radius:4px;">Begär offert</a> <a href="/vara-tjanster/" style="border:1px solid rgba(196,181,244,0.4);color:rgba(255,255,255,0.7);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:0.8rem 1.75rem;border-radius:4px;">Se sortiment</a> </div> </div> <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.08);"> <p style="color:rgba(255,255,255,0.3);font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1rem;">Alla guider</p> <div style="display:flex;flex-wrap:wrap;gap:0.75rem;"> <a href="/for/guider/hur-stor-pa/" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;color:rgba(255,255,255,0.6);font-size:0.85rem;text-decoration:none;">Hur stor PA? →</a> <a href="/for/guider/hur-stor-scen/" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;color:rgba(255,255,255,0.6);font-size:0.85rem;text-decoration:none;">Hur stor scen? →</a> <a href="/for/guider/dj-eller-liveband/" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;color:rgba(255,255,255,0.6);font-size:0.85rem;text-decoration:none;">DJ eller liveband? →</a> <a href="/for/guider/ljussattning-tips/" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;color:rgba(255,255,255,0.6);font-size:0.85rem;text-decoration:none;">Ljussättning →</a> <a href="/for/guider/ljud-utomhus/" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;color:rgba(255,255,255,0.6);font-size:0.85rem;text-decoration:none;">Ljud utomhus →</a> <a href="/for/guider/vad-kostar-det/" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;color:rgba(255,255,255,0.6);font-size:0.85rem;text-decoration:none;">Vad kostar det? →</a> </div> </div> </div> </article> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/guider/checklista-event.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/guider/checklista-event.astro";
const $$url = "/for/guider/checklista-event/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChecklistaEvent,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
