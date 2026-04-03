import { f as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderTemplate } from './astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://scenkonsult.se");
const $$CartButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CartButton;
  const {
    id,
    name,
    price,
    priceNote = "/dygn",
    artno = "",
    category,
    image = "",
    bulky = false,
    monteringMin,
    size = "md",
    label,
    iconOnly = false
  } = Astro2.props;
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-sm gap-2"
  }[size];
  return renderTemplate`${maybeRenderHead()}<button${addAttribute(`sk-cart-btn cart-add-btn inline-flex items-center whitespace-nowrap ${sizeClasses} bg-brand-orange hover:bg-brand-orange-light text-brand-dark font-semibold rounded-lg transition-all duration-200`, "class")}${addAttribute(id, "data-id")}${addAttribute(name, "data-name")}${addAttribute(artno, "data-artno")}${addAttribute(price, "data-price")}${addAttribute(priceNote, "data-price-note")}${addAttribute(category, "data-category")}${addAttribute(image, "data-image")}${addAttribute(bulky ? "true" : "false", "data-bulky")}${addAttribute(monteringMin ?? "", "data-montering-min")}${addAttribute(`L\xE4gg ${name} i varukorgen`, "aria-label")}> <svg class="sk-cart-icon-add shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <svg class="sk-cart-icon-check shrink-0 hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <polyline points="20 6 9 17 4 12"></polyline> </svg> ${!iconOnly && renderTemplate`<span class="sk-cart-btn-label">${label ?? "L\xE4gg i varukorg"}</span>`} </button>`;
}, "/home/claude/scenkonsult-astro/src/components/CartButton.astro", void 0);

export { $$CartButton as $ };
