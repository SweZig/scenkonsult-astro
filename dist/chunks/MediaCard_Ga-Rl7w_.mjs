import { f as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, b as renderComponent, F as Fragment, r as renderTemplate } from './astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$CartButton } from './CartButton_Da8QPJ3L.mjs';
/* empty css                         */

const $$Astro = createAstro("https://scenkonsult.se");
const $$MediaCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MediaCard;
  const {
    title,
    images,
    imgAlt = title,
    videos = [],
    priceExcl,
    priceSuffix = "/dygn",
    rows = [],
    bullets = [],
    tag = "",
    artno,
    category = "Produkt",
    id,
    class: extra = ""
  } = Astro2.props;
  const cartId = id ?? `mc-${title.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const mcId = `mc-${Math.random().toString(36).slice(2, 8)}`;
  const slides = [
    ...images.map((src) => ({ type: "image", src })),
    ...videos.map((src) => ({ type: "video", src }))
  ];
  const hasMultiple = slides.length > 1;
  const slidesJson = JSON.stringify(slides);
  const productJson = JSON.stringify({
    name: title,
    artno: artno ?? "",
    desc: bullets.join("||"),
    rows,
    price: priceExcl,
    priceNote: priceSuffix,
    category,
    cartId,
    images,
    videos
  });
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`bg-brand-navy border border-white/10 hover:border-brand-orange/40 rounded-2xl overflow-hidden transition-all group h-full flex flex-col ${extra}`, "class")}${addAttribute(mcId, "data-mc-id")}${addAttribute(slidesJson, "data-mc-slides")}${addAttribute(productJson, "data-sk-product")} style="cursor:pointer"> <!-- ── GALLERIYTA ── --> <div class="relative bg-brand-dark overflow-hidden" style="aspect-ratio:1024/853"> <!-- Aktiv slide renderas här av JS; SSR visar första bilden som fallback --> <div class="mc-slide-area w-full h-full"${addAttribute(`${mcId}-area`, "id")}> <!-- SSR-fallback: första bilden synlig utan JS, JS byter ut vid init --> <img${addAttribute(images[0], "src")}${addAttribute(imgAlt, "alt")} width="512" height="427" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"> </div> <!-- Pilar — dolda om bara ett slide --> ${hasMultiple && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <button class="mc-arr mc-arr-l absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-8 flex items-center justify-center bg-black/65 hover:bg-brand-orange/70 border border-white/15 rounded-md text-white text-base leading-none transition-colors" data-mc-dir="-1" aria-label="Föregående">‹</button> <button class="mc-arr mc-arr-r absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-8 flex items-center justify-center bg-black/65 hover:bg-brand-orange/70 border border-white/15 rounded-md text-white text-base leading-none transition-colors" data-mc-dir="1" aria-label="Nästa">›</button>  <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 flex gap-1"${addAttribute(`${mcId}-dots`, "id")}> ${slides.map((s, i) => renderTemplate`<button${addAttribute(`mc-dot transition-all ${i === 0 ? "bg-brand-orange w-2.5 h-2" : "bg-white/30 w-2 h-2"} ${s.type === "video" ? "rounded-sm" : "rounded-full"}`, "class")}${addAttribute(i, "data-mc-goto")}${addAttribute(`Slide ${i + 1}`, "aria-label")}></button>`)} </div> ` })}`} </div> <!-- ── INNEHÅLL ── --> <div class="p-5 flex flex-col flex-1"> ${tag && renderTemplate`<div class="text-brand-orange text-[10px] font-semibold uppercase tracking-wider mb-1">${tag}</div>`} <h3 class="font-bold text-white leading-snug mb-3 group-hover:text-brand-orange transition-colors" style="font-size:17px">${title}</h3> ${artno && renderTemplate`<p class="artno-badge mb-2">${artno}</p>`} ${rows.length > 0 && renderTemplate`<div class="border-t border-white/10 pt-3 mb-3 space-y-2.5"> ${rows.map((g) => renderTemplate`<div> ${g.label && renderTemplate`<div class="text-[9px] uppercase tracking-[0.1em] text-white/30 font-semibold mb-1">${g.label}</div>`} <div class="grid grid-cols-2 gap-x-3 gap-y-0.5"> ${g.rows.map((r) => renderTemplate`<div class="text-gray-400 text-xs">${r}</div>`)} </div> </div>`)} </div>`} ${bullets.length > 0 && renderTemplate`<ul class="space-y-1 border-t border-white/10 pt-3 flex-1 mb-0"> ${bullets.map((b) => renderTemplate`<li class="flex gap-1.5 text-gray-400 text-xs"> <span class="text-green-400 shrink-0">▸</span> ${b} </li>`)} </ul>`} <!-- Spacer så bottenraden alltid trycks ned --> <div class="flex-1 min-h-[0.25rem]"></div> <!-- Bottenrad: pris vänster, knapp höger --> <div class="mt-auto flex items-center justify-between border-t border-white/10 pt-3 gap-3"> <div class="shrink-0 leading-none"> <span class="sk-price-excl text-brand-orange font-extrabold" style="font-size:17px"> ${priceExcl.toLocaleString("sv")} kr
</span> <span class="sk-price-incl hidden text-brand-orange font-extrabold" style="font-size:17px"> ${Math.round(priceExcl * 1.25).toLocaleString("sv")} kr
</span> <div class="text-gray-400 text-[10px] mt-0.5">${priceSuffix}</div> </div> ${renderComponent($$result, "CartButton", $$CartButton, { "id": cartId, "name": title, "price": priceExcl, "priceNote": `/${priceSuffix.replace(/^\//, "")}`, "category": category, "image": images[0], "size": "sm", "label": "L\xE4gg i varukorg" })} </div> </div> </article>  `;
}, "/home/claude/scenkonsult-astro/src/components/MediaCard.astro", void 0);

export { $$MediaCard as $ };
