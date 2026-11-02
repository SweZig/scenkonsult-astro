/* src/lib/moms.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Moms — EN gemensam regel för hela orderflödet.
 *
 * Används av fakturan, kreditfakturan, påminnelserna, offertmejlet,
 * orderbekräftelsen, kundens ordersida, admin och försäljningsstatistiken.
 * Skriv aldrig `* 1.25` eller `* 0.25` direkt i en sida eller funktion.
 *
 * Utländsk företagskund (admin → Info → "Utländsk företagskund — ej svensk
 * moms") faktureras utan moms:
 *   vat_exempt = true, vat_region = 'eu' | 'non_eu'
 *   customer_vat_id  — köparens VAT-nummer (krävs för EU)
 *   customer_country — köparens land
 * Gäller bara företag (B2B). En utländsk privatperson betalar svensk moms.
 *
 * Filen är UMD:
 *   - Node/Netlify: require('../../src/lib/moms.cjs')
 *   - Webbläsaren: läses in som text (?raw) och körs inline → window.SkMoms
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SkMoms = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var RATE = 0.25;
  var SELLER_VAT_ID = 'SE559068493101';

  // EU:s medlemsstater (ISO 3166-1 alpha-2). Grekland använder EL i VAT-nummer.
  var EU = ['AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU',
            'IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK'];

  function isB2B(cart) {
    return !!cart && (cart.customer_type === 'b2b' || (!cart.customer_type && !!cart.customer_company));
  }

  function normVatId(v) {
    return v ? String(v).toUpperCase().replace(/[\s.\-]/g, '') : '';
  }

  /** Momsbehandling för en order. Momsfri bara för B2B med flaggan satt. */
  function info(cart) {
    var exempt = !!(cart && cart.vat_exempt) && isB2B(cart);
    var region = exempt ? (cart.vat_region === 'non_eu' ? 'non_eu' : 'eu') : null;
    var rate = exempt ? 0 : RATE;
    var notice = null;
    if (region === 'eu') {
      notice = {
        sv: 'Omvänd betalningsskyldighet — köparen redovisar momsen.',
        en: 'Reverse charge — VAT to be accounted for by the recipient (Article 196, Directive 2006/112/EC).',
      };
    } else if (region === 'non_eu') {
      notice = {
        sv: 'Tjänsten omsätts utomlands — ej svensk moms.',
        en: 'Outside the scope of Swedish VAT — place of supply outside Sweden.',
      };
    }
    return {
      exempt: exempt,
      region: region,
      rate: rate,
      ratePct: Math.round(rate * 100),
      buyerVatId: exempt ? (normVatId(cart.customer_vat_id) || null) : null,
      country: exempt ? (cart.customer_country || null) : null,
      notice: notice,
      sellerVatId: SELLER_VAT_ID,
      /** Fakturans rubrik. */
      title: exempt ? 'FAKTURA — NON-VAT INVOICE' : 'FAKTURA',
      // Kortform efter belopp: "kr inkl. moms" eller "kr (ingen svensk moms)"
      suffix: exempt ? 'ingen svensk moms' : 'inkl. moms',
    };
  }

  /** Momsbelopp i hela kronor (avrundat). */
  function vatOf(totalExcl, cart) {
    return Math.round((Number(totalExcl) || 0) * info(cart).rate);
  }

  /** Att betala: exkl + moms (avrundat). Momsfri → samma som exkl. */
  function inclOf(totalExcl, cart) {
    var ex = Number(totalExcl) || 0;
    return Math.round(ex + ex * info(cart).rate);
  }

  /** Multiplikator för pris inkl. moms (1.25 eller 1). */
  function factor(cart) {
    return 1 + info(cart).rate;
  }

  /**
   * Kontroll innan admin sparar / innan faktura skickas.
   * Returnerar null om allt är i ordning, annars ett felmeddelande.
   */
  function validate(fields) {
    if (!fields || !fields.vat_exempt) return null;
    if (!isB2B(fields)) return 'Momsfrihet gäller bara företagskunder (B2B). En utländsk privatperson betalar svensk moms.';
    var region = fields.vat_region;
    if (region !== 'eu' && region !== 'non_eu') return 'Välj om kunden finns inom eller utanför EU.';
    var country = (fields.customer_country || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(country)) return 'Ange kundens land (landskod, t.ex. DE eller NO).';
    if (country === 'SE') return 'En svensk kund kan inte faktureras utan svensk moms.';
    var isEuCountry = EU.indexOf(country) !== -1;
    if (region === 'eu' && !isEuCountry) return 'Landet ' + country + ' ligger inte i EU — välj "Utanför EU".';
    if (region === 'non_eu' && isEuCountry) return 'Landet ' + country + ' ligger i EU — välj "Inom EU" och ange VAT-nummer.';
    if (region === 'eu') {
      var id = normVatId(fields.customer_vat_id);
      if (!id) return 'EU-kund kräver VAT-nummer (omvänd betalningsskyldighet).';
      if (!/^[A-Z]{2}[0-9A-Z]{2,13}$/.test(id)) return 'Ogiltigt VAT-nummer — börja med landskoden, t.ex. DE123456789.';
      var prefix = id.slice(0, 2);
      if (prefix === 'SE') return 'Ett svenskt VAT-nummer ger inte momsfrihet.';
      var expected = country === 'GR' ? 'EL' : country;
      if (prefix !== expected) return 'VAT-numret börjar med ' + prefix + ' men landet är ' + country + '.';
    }
    return null;
  }

  return {
    RATE: RATE, SELLER_VAT_ID: SELLER_VAT_ID, EU: EU,
    isB2B: isB2B, normVatId: normVatId, info: info,
    vatOf: vatOf, inclOf: inclOf, factor: factor, validate: validate,
  };
});
