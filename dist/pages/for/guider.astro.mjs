/* empty css                                    */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DH83owMh.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const guider = [
    {
      slug: "varfor-numark-denon-rane",
      icon: "\u{1F39B}\uFE0F",
      title: "Varf\xF6r Numark, Denon & Rane \u2014 inte Pioneer?",
      desc: "Konkreta argument f\xF6r standalone DJ-controllers med inbyggd Spotify/Tidal-streaming mot Pioneer CDJ-systemet.",
      tags: ["DJ", "Utrustning"],
      lasttid: "5 min"
    },
    {
      slug: "hur-stor-pa",
      icon: "\u{1F50A}",
      title: "Hur stor PA-anl\xE4ggning beh\xF6ver jag?",
      desc: "Tabeller f\xF6r inomhus och utomhus, g\xE4stantal och eventtyp. Inkl. guide till subbasen.",
      tags: ["Ljud", "Dimensionering"],
      lasttid: "4 min"
    },
    {
      slug: "hur-stor-scen",
      icon: "\u{1F3AD}",
      title: "Hur stor scen beh\xF6ver jag?",
      desc: "Referenstabell: scenstorlekar, antal artister, scenh\xF6jder och tillbeh\xF6r.",
      tags: ["Scen"],
      lasttid: "3 min"
    },
    {
      slug: "dj-eller-liveband",
      icon: "\u{1F3B8}",
      title: "DJ eller liveband till festen?",
      desc: "\xC4rlig j\xE4mf\xF6relse p\xE5 pris, st\xE4mning, logistik och teknikkrav. Inkl. combo-alternativet.",
      tags: ["DJ", "Musik"],
      lasttid: "4 min"
    },
    {
      slug: "ljussattning-tips",
      icon: "\u{1F4A1}",
      title: "Ljuss\xE4ttning f\xF6r event",
      desc: "Typer av ljus, placering, dramaturgi under kv\xE4llen och de 4 vanligaste misstagen.",
      tags: ["Ljus", "St\xE4mning"],
      lasttid: "5 min"
    },
    {
      slug: "checklista-event",
      icon: "\u2705",
      title: "Komplett checklista f\xF6r event",
      desc: "Allt fr\xE5n bokning till retur \u2014 8\u201312 veckor f\xF6re, event-dagen och backup-plan.",
      tags: ["Planering", "Checklista"],
      lasttid: "3 min"
    },
    {
      slug: "ljud-utomhus",
      icon: "\u{1F324}\uFE0F",
      title: "Ljud utomhus \u2014 komplett guide",
      desc: "Effektbehov, placering, v\xE4derskydd och tillst\xE5ndsregler f\xF6r utomhus-event.",
      tags: ["Utomhus", "Ljud"],
      lasttid: "4 min"
    },
    {
      slug: "vad-kostar-det",
      icon: "\u{1F4B0}",
      title: "Vad kostar det att hyra utrustning?",
      desc: "Prisguide 2025 med tabeller, exempelpaket och tips f\xF6r att s\xE4nka totalkostnaden.",
      tags: ["Pris", "Budget"],
      lasttid: "3 min"
    }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Guider om eventproduktion och AV-uthyrning",
    "description": "Kompletta guider om PA-dimensionering, scenstorlekar, ljuss\xE4ttning och event-planering fr\xE5n Scenkonsult Norden.",
    "itemListElement": guider.map((g, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Article",
        "name": g.title,
        "url": `https://scenkonsult.se/for/guider/${g.slug}/`
      }
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Guider om Eventproduktion & AV-uthyrning | Scenkonsult Stockholm", "description": "Kompletta guider om PA-dimensionering, scenstorlek, ljuss\xE4ttning, DJ vs liveband och event-planering. Fr\xE5n Scenkonsult \u2014 uthyrare sedan 1986.", "schemaExtra": schema }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div style="background:linear-gradient(135deg,#1e1850 0%,#0c0a24 60%);padding-top:calc(36px + 130px + clamp(2rem,4vw,3.5rem));padding-bottom:clamp(2.5rem,5vw,4rem);padding-inline:clamp(1rem,5vw,5rem);position:relative;overflow:hidden;"> <div style="position:absolute;right:-5%;top:50%;transform:translateY(-50%);width:clamp(200px,35vw,460px);height:clamp(200px,35vw,460px);border-radius:50%;background-image:radial-gradient(circle,rgba(196,181,244,0.07) 2px,transparent 2px);background-size:22px 22px;pointer-events:none;"></div> <div style="max-width:820px;margin:0 auto;position:relative;z-index:2;"> <nav aria-label="Brödsmulor" style="margin-bottom:1.5rem;"> <ol style="display:flex;flex-wrap:wrap;gap:0.35rem;list-style:none;margin:0;padding:0;font-size:0.78rem;color:rgba(255,255,255,0.4);"> <li><a href="/" style="color:rgba(255,255,255,0.5);text-decoration:none;">Hem</a> <span style="opacity:0.3;">/</span></li> <li><a href="/for/" style="color:rgba(255,255,255,0.5);text-decoration:none;">För ditt event</a> <span style="opacity:0.3;">/</span></li> <li><span style="color:white;">Guider</span></li> </ol> </nav> <p style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.6rem;">Kunskapsbank · Av Scenkonsult Norden</p> <h1 style="font-family:'DM Serif Display',serif;font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;color:white;margin:0 0 1rem;">Guider om event-teknik</h1> <p style="color:rgba(255,255,255,0.6);font-size:clamp(0.95rem,2vw,1.1rem);line-height:1.75;margin:0;max-width:580px;">Konkreta svar på de vanligaste frågorna om ljud, ljus, scen och eventproduktion — byggda på erfarenheter från hundratals event sedan 1986.</p> </div> </div>  <section style="background:#111030;padding:clamp(2rem,5vw,3.5rem) clamp(1rem,5vw,5rem);border-bottom:1px solid rgba(255,255,255,0.06);"> <div style="max-width:1100px;margin:0 auto;"> <a href="/svens-kunskapsskola/" style="display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center;background:linear-gradient(135deg,#1e1850 0%,#2a1f6e 100%);border:1px solid rgba(196,181,244,0.2);border-radius:16px;padding:clamp(1.5rem,4vw,2.5rem);text-decoration:none;transition:border-color 0.2s,transform 0.15s;" onmouseenter="this.style.borderColor='rgba(196,181,244,0.5)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='rgba(196,181,244,0.2)';this.style.transform='translateY(0)'"> <div> <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;"> <span style="background:rgba(196,181,244,0.15);color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.2rem 0.6rem;border-radius:4px;">🎬 Videoguider</span> <span style="background:rgba(196,181,244,0.15);color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.2rem 0.6rem;border-radius:4px;">4 avsnitt</span> </div> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.3rem,2.5vw,1.75rem);color:white;margin:0 0 0.6rem;line-height:1.2;">Svens Kunskapsskola</h2> <p style="color:rgba(255,255,255,0.55);font-size:clamp(0.85rem,1.5vw,0.95rem);line-height:1.65;margin:0;max-width:560px;">Videoguider om att koppla in ljud, förstå kontakter och hyra rätt — av Sven intendenten. Inga förkunskaper krävs.</p> </div> <span style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:1.5rem;flex-shrink:0;">→</span> </a> </div> </section>  <section style="background:#0c0a24;padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem;"> ${guider.map((g) => renderTemplate`<a${addAttribute(`/for/guider/${g.slug}/`, "href")} style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:1.75rem;text-decoration:none;display:flex;flex-direction:column;gap:0.75rem;transition:border-color 0.2s,transform 0.15s;" onmouseenter="this.style.borderColor='rgba(196,181,244,0.35)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='translateY(0)'"> <div style="display:flex;justify-content:space-between;align-items:flex-start;"> <span style="font-size:1.75rem;">${g.icon}</span> <span style="color:rgba(255,255,255,0.25);font-family:'Space Grotesk',sans-serif;font-size:0.72rem;">${g.lasttid} läsning</span> </div> <h2 style="font-family:'DM Serif Display',serif;font-size:1.2rem;color:white;margin:0;line-height:1.25;">${g.title}</h2> <p style="color:rgba(255,255,255,0.5);font-size:0.88rem;line-height:1.65;margin:0;flex:1;">${g.desc}</p> <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;"> <div style="display:flex;gap:0.4rem;flex-wrap:wrap;"> ${g.tags.map((t) => renderTemplate`<span style="background:rgba(196,181,244,0.1);color:#c4b5f4;font-size:0.7rem;font-weight:600;padding:0.15rem 0.5rem;border-radius:9999px;">${t}</span>`)} </div> <span style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.06em;">Läs →</span> </div> </a>`)} </div> </section>  <section style="background:#111030;padding:clamp(2.5rem,5vw,4rem) clamp(1rem,5vw,5rem);"> <div style="max-width:1100px;margin:0 auto;"> <p style="color:rgba(255,255,255,0.3);font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:1.25rem;">Eller — välj ditt event-typ</p> <div style="display:flex;flex-wrap:wrap;gap:0.75rem;"> ${[
    { href: "/for/brollop/", label: "\u{1F48D} Br\xF6llop" },
    { href: "/for/foretagsfest/", label: "\u{1F389} F\xF6retagsfest" },
    { href: "/for/konferens/", label: "\u{1F3A4} Konferens" },
    { href: "/for/festival/", label: "\u{1F3B8} Festival" },
    { href: "/for/studentflak/", label: "\u{1F393} Studentflak" },
    { href: "/vara-tjanster/", label: "\u2728 Alla tj\xE4nster" }
  ].map((l) => renderTemplate`<a${addAttribute(l.href, "href")} style="background:#1e1850;border:1px solid rgba(255,255,255,0.08);border-radius:9999px;padding:0.55rem 1.1rem;color:rgba(255,255,255,0.65);font-family:'Space Grotesk',sans-serif;font-size:0.85rem;text-decoration:none;transition:border-color 0.2s,color 0.2s;" onmouseenter="this.style.borderColor='rgba(196,181,244,0.4)';this.style.color='white'" onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)';this.style.color='rgba(255,255,255,0.65)'">${l.label}</a>`)} </div> </div> </section> ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/for/guider/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/for/guider/index.astro";
const $$url = "/for/guider/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
