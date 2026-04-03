import { f as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderTemplate, b as renderComponent, F as Fragment } from './astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro$1 = createAstro("https://scenkonsult.se");
const $$Price = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Price;
  const {
    amount,
    suffix = "/dygn",
    size = "base",
    bold = true,
    class: extraClass = ""
  } = Astro2.props;
  const exclMoms = Math.round(amount);
  const inclMoms = Math.round(amount * 1.25);
  const sizeClass = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };
  const fontClass = bold ? "font-bold" : "font-normal";
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(`sk-price ${sizeClass[size]} ${fontClass} ${extraClass}`, "class")}${addAttribute(exclMoms, "data-excl")}${addAttribute(inclMoms, "data-incl")}${addAttribute(`${inclMoms} kronor inklusive moms per dygn`, "aria-label")}>  <span class="sk-price-excl">${exclMoms.toLocaleString("sv")} kr<span class="sk-price-suffix text-[0.75em] font-normal opacity-70">${suffix}</span></span> <span class="sk-price-incl hidden">${inclMoms.toLocaleString("sv")} kr<span class="sk-price-suffix text-[0.75em] font-normal opacity-70">${suffix}</span></span> </span>`;
}, "/home/claude/scenkonsult-astro/src/components/Price.astro", void 0);

const $$Astro = createAstro("https://scenkonsult.se");
const $$CategoryHero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategoryHero;
  const {
    h1,
    h1Accent,
    intro,
    badges = [],
    breadcrumbs = [],
    bannerImage,
    bannerAlt = "",
    priceFrom,
    priceSuffix = "/dygn"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="cat-hero-wrap" data-astro-cid-vnmiil5a> <!-- Mörk hero — täcker nav och ticker --> <div class="cat-hero" data-astro-cid-vnmiil5a> <div class="cat-hero-dot" aria-hidden="true" data-astro-cid-vnmiil5a></div> <div class="cat-hero-inner" data-astro-cid-vnmiil5a> <!-- Brödsmulor --> ${breadcrumbs.length > 0 && renderTemplate`<nav class="cat-breadcrumb" aria-label="Brödsmulor" data-astro-cid-vnmiil5a> <ol itemscope itemtype="https://schema.org/BreadcrumbList" data-astro-cid-vnmiil5a> ${breadcrumbs.map((crumb, i) => renderTemplate`<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" data-astro-cid-vnmiil5a> ${crumb.href ? renderTemplate`<a${addAttribute(crumb.href, "href")} itemprop="item" data-astro-cid-vnmiil5a><span itemprop="name" data-astro-cid-vnmiil5a>${crumb.label}</span></a>` : renderTemplate`<span itemprop="name" data-astro-cid-vnmiil5a>${crumb.label}</span>`} <meta itemprop="position"${addAttribute(String(i + 1), "content")}> ${i < breadcrumbs.length - 1 && renderTemplate`<span class="cat-sep" aria-hidden="true" data-astro-cid-vnmiil5a>/</span>`} </li>`)} </ol> </nav>`} <!-- H1 --> <h1 class="cat-h1" data-astro-cid-vnmiil5a> ${h1}${h1Accent && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-vnmiil5a": true }, { "default": ($$result2) => renderTemplate` i <span class="cat-accent" data-astro-cid-vnmiil5a>${h1Accent}</span>` })}`} </h1> <!-- Intro --> ${intro && renderTemplate`<p class="cat-intro" data-astro-cid-vnmiil5a>${intro}</p>`} <!-- Pris från (toggle-kopplat) --> ${priceFrom && renderTemplate`<p class="cat-price-from" data-astro-cid-vnmiil5a>
från ${renderComponent($$result, "Price", $$Price, { "amount": priceFrom, "suffix": priceSuffix, "size": "lg", "bold": true, "data-astro-cid-vnmiil5a": true })} </p>`} <!-- Trust badges --> ${badges.length > 0 && renderTemplate`<div class="cat-badges" data-astro-cid-vnmiil5a> ${badges.map((badge) => renderTemplate`<div class="cat-badge" data-astro-cid-vnmiil5a> <span class="cat-badge-check" aria-hidden="true" data-astro-cid-vnmiil5a>✓</span> ${badge} </div>`)} </div>`} <!-- CTA knappar --> <div class="cat-ctas" data-astro-cid-vnmiil5a> <a href="/bokningssida/" class="cat-btn-primary" data-astro-cid-vnmiil5a>Boka nu</a> <a data-tel="MDcyNDQ4MTAwMA==" data-prefix="📞 " data-label="072-448 10 00" href="#tel" class="cat-btn-ghost" style="cursor:pointer" data-astro-cid-vnmiil5a><noscript>📞 072-448 10 00</noscript></a> </div> </div> </div> <!-- Optional banner image — visas under hero, inte som bakgrund --> ${bannerImage && renderTemplate`<div class="cat-banner-wrap" data-astro-cid-vnmiil5a> <img${addAttribute(bannerImage, "src")}${addAttribute(bannerAlt, "alt")} loading="eager" class="cat-banner-img" data-astro-cid-vnmiil5a> </div>`} </div> `;
}, "/home/claude/scenkonsult-astro/src/components/CategoryHero.astro", void 0);

export { $$CategoryHero as $, $$Price as a };
