/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Qdf46Cx6.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const filmer = [
    {
      id: "hmIlyWm69nI",
      titel: "Hur det fungerar att hyra hos oss",
      beskrivning: "En snabb genomg\xE5ng av hela uthyrningsprocessen \u2014 fr\xE5n att du kontaktar oss till att utrustningen \xE4r levererad och riggad. Perfekt om du aldrig hyrt AV-utrustning f\xF6rut.",
      tags: ["Kom ig\xE5ng", "Uthyrning"],
      slug: "hur-det-fungerar"
    },
    {
      id: "05nTsqFyjwM",
      titel: "Hur man kopplar in ett hyrt ljudsystem",
      beskrivning: "Steg f\xF6r steg: hur du kopplar in PA-systemet du hyrt, vad som kopplas var och hur du undviker de vanligaste misstagen. Inga f\xF6rkunskaper kr\xE4vs.",
      tags: ["Ljud", "Installation"],
      slug: "koppla-in-ljudsystem"
    },
    {
      id: "nBwdoFUn8uk",
      titel: "Kontakter inom ljud \u2014 vad heter vad?",
      beskrivning: "L\xE4r dig k\xE4nna igen och namnge de vanligaste kontakterna inom ljud \u2014 XLR, jack, RCA och mer. Bra att ha koll p\xE5 innan du hyr PA-utrustning.",
      tags: ["Ljud", "Kontakter", "Teknik"],
      slug: "kontakter-ljud"
    },
    {
      id: "NtYcryqyfsw",
      titel: "Kontakter inom bild \u2014 vad heter vad?",
      beskrivning: "De vanligaste kontakterna f\xF6r projektorer och sk\xE4rmar \u2014 HDMI, DisplayPort, VGA, SDI och mer. Vet du vilken kabel du beh\xF6ver innan du hyr?",
      tags: ["Bild", "Kontakter", "Projektor", "Sk\xE4rm"],
      slug: "kontakter-bild"
    },
    {
      id: "R-GMd6uMNVY",
      titel: "LED-teknik \u2014 egenskaper och funktioner hos olika LED-sk\xE4rmar",
      beskrivning: "Vad skiljer olika LED-sk\xE4rmar \xE5t? Sven g\xE5r igenom pixelpitch, ljusstyrka, inomhus vs utomhus och vad du b\xF6r t\xE4nka p\xE5 n\xE4r du hyr LED-utrustning.",
      tags: ["Bild", "LED", "Sk\xE4rm", "Teknik"],
      slug: "led-teknik"
    }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Svens Kunskapsskola \u2014 videoguider om AV-teknik",
    "description": "Videoguider om ljud, kontakter och uthyrning av AV-utrustning fr\xE5n Scenkonsult Norden.",
    "itemListElement": filmer.map((f, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "VideoObject",
        "name": f.titel,
        "embedUrl": `https://www.youtube.com/embed/${f.id}`
      }
    }))
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Svens Kunskapsskola \u2014 Videoguider om AV-teknik | Scenkonsult", "description": "L\xE4r dig koppla in ljud, f\xF6rst\xE5 kontakter och hyra AV-utrustning r\xE4tt. Korta, konkreta videoguider fr\xE5n Scenkonsult Nordens intendent Sven.", "schemaExtra": schema, "data-astro-cid-splkz44b": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div style="background:linear-gradient(135deg,#1e1850 0%,#0c0a24 60%);padding-top:calc(36px + 130px + clamp(2rem,4vw,3.5rem));padding-bottom:clamp(2.5rem,5vw,4rem);padding-inline:clamp(1rem,5vw,5rem);position:relative;overflow:hidden;" data-astro-cid-splkz44b> <!-- Dekorativ cirkel --> <div style="position:absolute;right:-5%;top:50%;transform:translateY(-50%);width:clamp(200px,35vw,460px);height:clamp(200px,35vw,460px);border-radius:50%;background-image:radial-gradient(circle,rgba(196,181,244,0.07) 2px,transparent 2px);background-size:22px 22px;pointer-events:none;" data-astro-cid-splkz44b></div> <div style="max-width:820px;margin:0 auto;position:relative;z-index:2;" data-astro-cid-splkz44b> <!-- Brödsmulor --> <nav aria-label="Brödsmulor" style="margin-bottom:1.5rem;" data-astro-cid-splkz44b> <ol style="display:flex;flex-wrap:wrap;gap:0.35rem;list-style:none;margin:0;padding:0;font-size:0.78rem;color:rgba(255,255,255,0.4);" data-astro-cid-splkz44b> <li data-astro-cid-splkz44b><a href="/" style="color:rgba(255,255,255,0.5);text-decoration:none;" data-astro-cid-splkz44b>Hem</a> <span style="opacity:0.3;" data-astro-cid-splkz44b>/</span></li> <li data-astro-cid-splkz44b><a href="/for/guider/" style="color:rgba(255,255,255,0.5);text-decoration:none;" data-astro-cid-splkz44b>Guider</a> <span style="opacity:0.3;" data-astro-cid-splkz44b>/</span></li> <li data-astro-cid-splkz44b><span style="color:white;" data-astro-cid-splkz44b>Svens Kunskapsskola</span></li> </ol> </nav> <!-- Sven-avatar badge --> <div style="display:inline-flex;align-items:center;gap:0.6rem;background:rgba(196,181,244,0.1);border:1px solid rgba(196,181,244,0.2);border-radius:9999px;padding:0.35rem 1rem 0.35rem 0.5rem;margin-bottom:1.25rem;" data-astro-cid-splkz44b> <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true" data-astro-cid-splkz44b> <use href="#mask-glad" data-astro-cid-splkz44b></use> </svg> <span style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;" data-astro-cid-splkz44b>Sven Intendenten presenterar</span> </div> <h1 style="font-family:'DM Serif Display',serif;font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;color:white;margin:0 0 1rem;" data-astro-cid-splkz44b>
Svens<br data-astro-cid-splkz44b><em data-astro-cid-splkz44b>Kunskapsskola</em> </h1> <p style="color:rgba(255,255,255,0.6);font-size:clamp(0.95rem,2vw,1.1rem);line-height:1.75;margin:0 0 1.5rem;max-width:560px;" data-astro-cid-splkz44b>
Korta, konkreta videoguider om ljud-teknik, kontakter och hur du hyr utrustning rätt. Inga förkunskaper krävs — Sven förklarar som om du aldrig sett en XLR-kabel förut.
</p> <p style="color:rgba(255,255,255,0.35);font-size:0.85rem;font-style:italic;" data-astro-cid-splkz44b>
"Hade jag fått välja hade jag stått på scen. Nu förklarar jag hur den kopplas in istället." — Sven
</p> </div> </div>  <section style="background:#0c0a24;padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);" data-astro-cid-splkz44b> <div style="max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:4rem;" data-astro-cid-splkz44b> ${filmer.map((film, i) => renderTemplate`<div${addAttribute(film.slug, "id")}${addAttribute(`display:grid;grid-template-columns:${i % 2 === 0 ? "1.3fr 1fr" : "1fr 1.3fr"};gap:clamp(2rem,5vw,4rem);align-items:center;`, "style")} class="film-row" data-astro-cid-splkz44b> <!-- Video (alternerande vänster/höger) --> <div${addAttribute(i % 2 !== 0 ? "order:2" : "", "style")} class="film-video" data-astro-cid-splkz44b> <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 40px rgba(0,0,0,0.5);background:#000;aspect-ratio:16/9;" data-astro-cid-splkz44b> <iframe width="100%" height="100%"${addAttribute(`https://www.youtube.com/embed/${film.id}`, "src")}${addAttribute(film.titel, "title")} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;" data-astro-cid-splkz44b></iframe> </div> </div> <!-- Text --> <div${addAttribute(i % 2 !== 0 ? "order:1" : "", "style")} class="film-text" data-astro-cid-splkz44b> <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;" data-astro-cid-splkz44b> <span style="background:rgba(196,181,244,0.15);color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;padding:0.2rem 0.6rem;border-radius:4px;" data-astro-cid-splkz44b>AVSNITT ${String(i + 1).padStart(2, "0")}</span> </div> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.4rem,2.5vw,2rem);color:white;margin:0 0 1rem;line-height:1.2;" data-astro-cid-splkz44b>${film.titel}</h2> <p style="color:rgba(255,255,255,0.55);font-size:clamp(0.9rem,1.5vw,1rem);line-height:1.75;margin:0 0 1.5rem;" data-astro-cid-splkz44b>${film.beskrivning}</p> <div style="display:flex;flex-wrap:wrap;gap:0.4rem;" data-astro-cid-splkz44b> ${film.tags.map((t) => renderTemplate`<span style="background:rgba(196,181,244,0.1);color:#c4b5f4;font-size:0.7rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:9999px;" data-astro-cid-splkz44b>${t}</span>`)} </div> </div> </div>`)} </div> </section>  <section style="background:#111030;padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,5rem);border-top:1px solid rgba(255,255,255,0.06);" data-astro-cid-splkz44b> <div style="max-width:680px;margin:0 auto;text-align:center;" data-astro-cid-splkz44b> <span style="color:#c4b5f4;font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;" data-astro-cid-splkz44b>Redo att hyra?</span> <h2 style="font-family:'DM Serif Display',serif;font-size:clamp(1.6rem,3vw,2.25rem);color:white;margin:0.75rem 0 1rem;" data-astro-cid-splkz44b>Nu vet du hur det fungerar —<br data-astro-cid-splkz44b><em data-astro-cid-splkz44b>dags att boka</em></h2> <p style="color:rgba(255,255,255,0.5);font-size:clamp(0.9rem,1.5vw,1rem);line-height:1.75;margin:0 0 2rem;" data-astro-cid-splkz44b>Sven och teamet hjälper dig välja rätt utrustning och svarar på frågor — utan krångel.</p> <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;" data-astro-cid-splkz44b> <a href="/kontakt" style="background:#c4b5f4;color:#0c0a24;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:0.04em;padding:0.85rem 2rem;border-radius:6px;text-decoration:none;transition:background 0.2s;" onmouseenter="this.style.background='#e2dcfb'" onmouseleave="this.style.background='#c4b5f4'" data-astro-cid-splkz44b>
Boka eller fråga om pris
</a> <a href="/for/guider/" style="background:transparent;color:#c4b5f4;border:1px solid rgba(196,181,244,0.35);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.9rem;padding:0.85rem 2rem;border-radius:6px;text-decoration:none;" data-astro-cid-splkz44b>
Fler guider →
</a> </div> </div> </section> ` })} `;
}, "/home/claude/scenkonsult-astro/src/pages/svens-kunskapsskola/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/svens-kunskapsskola/index.astro";
const $$url = "/svens-kunskapsskola/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
