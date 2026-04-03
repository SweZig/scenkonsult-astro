import { f as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderTemplate, b as renderComponent } from './astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$CartButton } from './CartButton_DI3Qn4Bk.mjs';

const $$Astro = createAstro("https://scenkonsult.se");
const $$ElTillbehorCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ElTillbehorCard;
  const { img, name, excl, desc, category = "Tillbeh\xF6r", artno, modal = false, specs } = Astro2.props;
  const cartId = `acc-${name.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-")}`;
  const productJson = modal ? JSON.stringify({
    name,
    artno: artno ?? "",
    desc: (specs ?? (desc ? [desc] : [])).join("||"),
    rows: [],
    price: excl,
    priceNote: "/dygn",
    category,
    cartId,
    images: [img],
    videos: []
  }) : null;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["bg-brand-navy/60 border border-white/10 rounded-xl p-3 flex flex-col h-full", [modal && "hover:border-brand-orange/40 transition-colors"]], "class:list")}${addAttribute(productJson ?? void 0, "data-sk-product")}${addAttribute(modal ? "cursor:pointer" : void 0, "style")}> <div class="bg-brand-dark overflow-hidden rounded-lg mb-2" style="aspect-ratio:1024/853"> <img${addAttribute(img, "src")}${addAttribute(name, "alt")} width="150" height="150" loading="lazy" class="w-full h-full object-cover"> </div> <p class="text-white text-xs font-semibold leading-tight mb-0.5">${name}</p> ${artno && renderTemplate`<p class="artno-badge" style="margin-bottom:0.25rem">${artno}</p>`} ${desc && renderTemplate`<p class="text-gray-400 text-[10px] leading-tight mb-0.5 flex-1">${desc}</p>`} <div class="flex items-center justify-between mt-auto pt-2 gap-1 border-t border-white/10"> <div class="leading-none"> <span class="sk-price-excl text-brand-orange text-sm font-bold">${excl} kr</span> <span class="sk-price-incl hidden text-brand-orange text-sm font-bold">${Math.round(excl * 1.25)} kr</span> <span class="text-gray-400 text-[10px]">/dygn</span> </div> ${renderComponent($$result, "CartButton", $$CartButton, { "id": cartId, "name": name, "price": excl, "category": category, "image": img, "size": "sm", "iconOnly": true })} </div> </div>`;
}, "/home/claude/scenkonsult-astro/src/components/ElTillbehorCard.astro", void 0);

export { $$ElTillbehorCard as $ };
