/* empty css                                 */
import { f as createAstro, c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { a as ljusData, $ as $$Layout } from '../chunks/Layout_DH83owMh.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const _comment = "Alla priser exkl. moms. Uppdatera priser här — inga kodfiler behöver ändras.";
const leverans = {
	label: "Leverans & upphämtning",
	description: "Vi kör ut och hämtar upp utrustningen. Priset avser tur-och-retur.",
	zon: "Priser gäller inom Storstockholm. Längre transporter — kontakta oss.",
	standard: {
		id: "lev-standard",
		label: "Vanlig bil (tur & retur)",
		enkelresa: 559,
		pris: 1118,
		note: "559 kr × 2 resor"
	},
	skrymmande: {
		id: "lev-skrymmande",
		label: "Bil med släpvagn — skrymmande gods (tur & retur)",
		enkelresa: 799,
		pris: 1598,
		note: "799 kr × 2 resor — tillämpas automatiskt om varukorgen innehåller skrymmande produkt"
	},
	lastbil: {
		id: "lev-lastbil",
		label: "Lätt/tung lastbil",
		pris: 2998,
		note: "1499 kr × 2 resor",
		enkelresa: 1499
	}
};
const montering = {
	label: "Montering & demontering",
	description: "Vår personal monterar och demonterar utrustningen på plats.",
	prisPerTimme: 600,
	minDebiteringMin: 15,
	note: "Monteringstid per produkt finns angiven i produktinfo. Demonteringstid = monteringstid × 2.",
	note2: "Obligatorisk för scener ≥ Large (20 m²) vid leverans."
};
const tillagg = [
	{
		id: "rigg-teknik",
		label: "Teknikertjänst på plats",
		description: "Tekniker på plats under hela eventet (per timme, min 2 timmar)",
		pris: 600,
		enhet: "/tim",
		qty: true
	}
];
const frakt = {
	_comment: _comment,
	leverans: leverans,
	montering: montering,
	tillagg: tillagg
};

const $$Astro = createAstro("https://scenkonsult.se");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const volPricingMap = {};
  for (const cat of [ljusData.effekter?.products, ljusData.rok?.products]) {
    for (const p of cat ?? []) {
      if (p.slug && p.volumePricing?.length) {
        volPricingMap[p.slug] = p.volumePricing;
      }
    }
  }
  JSON.stringify(frakt);
  JSON.stringify(volPricingMap);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Varukorg \u2013 Scenkonsult", "description": "Granska din varukorg och skicka en f\xF6rfr\xE5gan till Scenkonsult." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="cart-page"> <div class="cart-wrap"> <div class="cart-header"> <h1>Din varukorg</h1> <p class="cart-subtitle">Lägg till produkter via produktsidorna, sedan skickar du en förfrågan direkt.</p> </div> <!-- EMPTY STATE --> <div id="cartEmpty" class="cart-empty"> <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <p>Varukorgen är tom.</p> <a href="/#tjanster" class="cart-empty-cta">Se alla tjänster →</a> </div> <!-- CART CONTENT --> <div id="cartContent" style="display:none"> <!-- PRODUKTLÄGG-TILL-VÄLJARE --> <!-- PRODUKTTABELL --> <div class="cart-table-wrap"> <table class="cart-table"> <thead> <tr> <th class="th-product">Produkt</th> <th class="th-price">Pris</th> <th class="th-qty">Antal</th> <th class="th-total">Totalt</th> <th class="th-remove"></th> </tr> </thead> <tbody id="cartTableBody"></tbody> </table> </div> <!-- TILLÄGGSTJÄNSTER --> <div class="services-wrap"> <div class="services-header">Tilläggstjänster</div> <!-- Leverans --> <label class="service-row"> <input type="checkbox" id="chkLeverans" class="sr-only"> <div class="service-check" id="checkLeverans"></div> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"> <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon> <circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle> </svg> <div class="service-info"> <span class="service-label">${frakt.leverans.label}</span> <span class="service-desc">${frakt.leverans.description}</span> <span class="service-note" id="leveransNote">${frakt.leverans.zon}</span> </div> <span class="service-price" id="leveransPrice">– kr</span> </label> <!-- Montering --> <label class="service-row"> <input type="checkbox" id="chkMontering" class="sr-only"> <div class="service-check"></div> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"> <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path> </svg> <div class="service-info"> <span class="service-label">${frakt.montering.label}</span> <span class="service-desc">${frakt.montering.description}</span> <span class="service-note">${frakt.montering.note}</span> </div> <span class="service-price" id="monteringPrice">– kr</span> </label> <!-- Extra tillägg från frakt.json --> ${frakt.tillagg.map((t) => renderTemplate`<label class="service-row"${addAttribute(t.id, "data-tillagg-id")}> <input type="checkbox" class="sr-only chk-tillagg"${addAttribute(t.id, "data-id")}${addAttribute(t.pris, "data-pris")}${addAttribute(t.label, "data-label")}${addAttribute(t.enhet, "data-enhet")}${addAttribute(t.qty ? "true" : "false", "data-qty")}> <div class="service-check"></div> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"> <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line> </svg> <div class="service-info"> <span class="service-label">${t.label}</span> <span class="service-desc">${t.description}</span> </div> <div class="service-price-right"> ${t.qty && renderTemplate`<div class="tillagg-qty hidden"${addAttribute(`qty-wrap-${t.id}`, "id")}> <button type="button" class="tqty-btn tillagg-dec"${addAttribute(t.id, "data-id")}>−</button> <span class="tqty-val"${addAttribute(`qtyval-${t.id}`, "id")}>1</span> <button type="button" class="tqty-btn tillagg-inc"${addAttribute(t.id, "data-id")}>+</button> </div>`} <span class="service-price">${t.pris.toLocaleString("sv")} kr<span class="service-enhet">${t.enhet}</span></span> </div> </label>`)} </div> <!-- SUMMERING --> <div class="cart-summary"> <div class="summ-row"><span>Produkter (exkl. moms)</span><span id="cartSubtotal">–</span></div> <div class="summ-row" id="rowLeverans" style="display:none"><span>Leverans</span><span id="summLeverans">–</span></div> <div class="summ-row" id="rowMontering" style="display:none"><span>Montering & demontering</span><span id="summMontering">–</span></div> <div id="rowsTillagg"></div> <div class="summ-row muted"><span>Fakturaavgift</span><span>49 kr</span></div> <div class="summ-row muted"><span>Moms 25%</span><span id="cartVat">–</span></div> <div class="summ-row total"><span>Totalt (inkl. moms)</span><span id="cartTotal">–</span></div> <p class="summ-note">* Priser avser hyra per dygn (22 h). Slutlig faktura bekräftas vid bokning.</p> <p class="summ-note summ-note-estimate">⚠ Alla frakt- och tjänstepriser är estimat och bekräftas som en del av orderprocessen.</p> </div> <!-- KUNDUPPGIFTER --> <div class="customer-wrap"> <div class="customer-header">Dina uppgifter</div> <div class="customer-grid"> <div class="field-group"> <label class="field-label" for="f-name">Namn *</label> <input type="text" id="f-name" class="field-input" placeholder="För- och efternamn" autocomplete="name"> </div> <div class="field-group"> <label class="field-label" for="f-company">Företag</label> <input type="text" id="f-company" class="field-input" placeholder="Företagsnamn (valfritt)" autocomplete="organization"> </div> <div class="field-group"> <label class="field-label" for="f-email">E-post *</label> <input type="email" id="f-email" class="field-input" placeholder="din@epost.se" autocomplete="email"> </div> <div class="field-group"> <label class="field-label" for="f-phone">Telefon *</label> <input type="tel" id="f-phone" class="field-input" placeholder="070 000 00 00" autocomplete="tel"> </div> <div class="field-group"> <label class="field-label" for="f-date-from">Önskat datum, från *</label> <input type="date" id="f-date-from" class="field-input"> </div> <div class="field-group"> <label class="field-label" for="f-date-to">Önskat datum, till *</label> <input type="date" id="f-date-to" class="field-input"> </div> <div class="field-group field-full"> <label class="field-label" for="f-address">Leveransadress</label> <input type="text" id="f-address" class="field-input" placeholder="Gatuadress, postnummer, stad" autocomplete="street-address"> </div> <div class="field-group field-full"> <label class="field-label" for="f-notes">Övrig information</label> <textarea id="f-notes" class="field-input field-textarea" placeholder="Beskriv eventet, önskemål, antal gäster, lokalbeskrivning…" rows="4"></textarea> </div> </div> </div> <!-- HYRESVILLKOR --> <label class="villkor-row" id="villkorRow"> <input type="checkbox" id="chkVillkor" class="sr-only"> <div class="service-check villkor-check"></div> <span class="villkor-text">
Jag har läst och godkänner
<a href="/hyresvillkor/" target="_blank" class="villkor-link">hyresvillkoren ↗</a> </span> </label> <!-- ACTIONS --> <div class="cart-actions"> <button id="btnEmail" class="cart-btn primary" disabled> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 7L2 7"></path></svg>
Maila offertförfrågan
</button> <button id="btnSave" class="cart-btn secondary"> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
Spara som PDF
</button> <button id="btnBoka" class="cart-btn accent disabled-btn" aria-disabled="true" disabled> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><polyline points="12 5 19 12 12 19"></polyline></svg>
Boka detta nu
</button> <button id="btnClear" class="cart-btn ghost">Töm varukorg</button> </div> <p class="villkor-hint hidden" id="villkorHint">Vänligen godkänn hyresvillkoren och fyll i namn, e-post och telefon för att fortsätta.</p> </div><!-- /cartContent --> </div> </section> ` })}  `;
}, "/home/claude/scenkonsult-astro/src/pages/varukorg/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/varukorg/index.astro";
const $$url = "/varukorg/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
