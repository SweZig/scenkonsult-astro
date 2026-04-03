/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DH83owMh.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Din order \u2013 Scenkonsult Norden", "description": "F\xF6lj status p\xE5 din order och chatta med oss direkt.", "data-astro-cid-fykiapu7": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="order-page" data-astro-cid-fykiapu7> <div class="order-wrap" data-astro-cid-fykiapu7> <!-- LOADING --> <div class="state active" id="stateLoading" data-astro-cid-fykiapu7> <div class="loading-box" data-astro-cid-fykiapu7> <div class="spinner" data-astro-cid-fykiapu7></div>
Hämtar din order…
</div> </div> <!-- ERROR --> <div class="state" id="stateError" data-astro-cid-fykiapu7> <div class="error-box" data-astro-cid-fykiapu7> <h2 data-astro-cid-fykiapu7>Länken är ogiltig</h2> <p data-astro-cid-fykiapu7>Orderinformationen kunde inte hittas. Kontrollera att du använder rätt länk från bekräftelsemailet.</p> <p style="margin-top:1.5rem" data-astro-cid-fykiapu7>
Frågor? Ring oss på <a href="tel:0724481000" style="color:#f87171" data-astro-cid-fykiapu7>072-448 10 00</a> </p> </div> </div> <!-- ORDER --> <div class="state" id="stateOrder" data-astro-cid-fykiapu7> <!-- Header --> <div class="order-header" data-astro-cid-fykiapu7> <div class="order-id" id="orderId" data-astro-cid-fykiapu7></div> <h1 class="order-title" id="orderTitle" data-astro-cid-fykiapu7>Din order</h1> <p class="order-subtitle" id="orderSubtitle" data-astro-cid-fykiapu7></p> </div> <!-- Status banner --> <div class="status-banner" id="statusBanner" data-astro-cid-fykiapu7> <div class="status-icon" id="statusIcon" data-astro-cid-fykiapu7></div> <div style="flex:1" data-astro-cid-fykiapu7> <div class="status-label" id="statusLabel" data-astro-cid-fykiapu7></div> <div class="status-desc" id="statusDesc" data-astro-cid-fykiapu7></div> </div> </div> <div id="statusCta" style="display:none" data-astro-cid-fykiapu7></div> <!-- Event info --> <div class="section" id="sectionEvent" style="display:none" data-astro-cid-fykiapu7> <div class="section-head" data-astro-cid-fykiapu7>Eventinformation</div> <div class="section-body" data-astro-cid-fykiapu7> <div class="info-grid" id="eventGrid" data-astro-cid-fykiapu7></div> </div> </div> <!-- Products --> <div class="section" data-astro-cid-fykiapu7> <div class="section-head" data-astro-cid-fykiapu7>Din beställning</div> <div class="section-body" data-astro-cid-fykiapu7> <div style="overflow-x:auto" data-astro-cid-fykiapu7><table class="prod-table" data-astro-cid-fykiapu7> <thead data-astro-cid-fykiapu7> <tr data-astro-cid-fykiapu7> <th style="width:52px" data-astro-cid-fykiapu7></th> <th data-astro-cid-fykiapu7>Produkt</th> <th style="text-align:center" data-astro-cid-fykiapu7>Antal</th> <th style="text-align:right" data-astro-cid-fykiapu7>Pris</th> <th style="text-align:right" data-astro-cid-fykiapu7>Summa</th> </tr> </thead> <tbody id="prodTableBody" data-astro-cid-fykiapu7></tbody> <tfoot id="prodTableFoot" data-astro-cid-fykiapu7></tfoot> </table></div> <p class="moms-note" data-astro-cid-fykiapu7>* Priser exklusive moms. Moms tillkommer med 25%.</p> </div> </div> <!-- Chatt --> <div class="section" data-astro-cid-fykiapu7> <div class="section-head" data-astro-cid-fykiapu7>Meddelanden <span id="unreadBadge" style="display:none;background:#f87171;color:#fff;border-radius:99px;padding:1px 7px;font-size:0.7rem;margin-left:6px;font-weight:700;text-transform:none;letter-spacing:0" data-astro-cid-fykiapu7></span></div> <div class="section-body" data-astro-cid-fykiapu7> <div class="chat-messages" id="chatMessages" data-astro-cid-fykiapu7> <div class="chat-empty" data-astro-cid-fykiapu7>Inga meddelanden ännu.</div> </div> <div class="chat-input-wrap" data-astro-cid-fykiapu7> <textarea class="chat-textarea" id="chatInput" placeholder="Skriv ett meddelande till Scenkonsult…" data-astro-cid-fykiapu7></textarea> <button class="chat-send-btn" id="chatSendBtn" data-astro-cid-fykiapu7>Skicka meddelande →</button> </div> </div> </div> <!-- Footer --> <div class="order-footer" data-astro-cid-fykiapu7>
Scenkonsult Norden &nbsp;·&nbsp;
<a href="tel:0724481000" data-astro-cid-fykiapu7>072-448 10 00</a> &nbsp;·&nbsp;
<a href="mailto:info@scenkonsult.se" data-astro-cid-fykiapu7>info@scenkonsult.se</a><br data-astro-cid-fykiapu7>
Mån–Fre 09:00–17:00 · Jour vid pågående uthyrning
</div> </div><!-- /stateOrder --> </div> </div>  ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/order/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/order/index.astro";
const $$url = "/order/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
