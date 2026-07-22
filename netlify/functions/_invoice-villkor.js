// netlify/functions/_invoice-villkor.js
// Allmänna hyresvillkor (sida 2 i faktura-PDF) — anpassade per kundtyp.
// Versioner:
//   B2C: 12 paragrafer, inkluderar Ångerrätt (§11) och ARN-referens (§10)
//   B2B: 11 paragrafer, inkluderar Beställarens behörighet (§3) och Utlämning/fullmakt (§7)
//
// Båda matchar gällande hyresvillkor på scenkonsult.se/hyresvillkor/{privatperson,foretag}/
// Senast uppdaterad: 2026-06-01 (placeholder — sätts skarpt vid skarp publicering)

const VILLKOR_DATE = '2026-07-17';

const VILLKOR_B2C = [
  ['1. Hyresperiod',
   'Normal hyresperiod är 22 timmar — hämtning kl 13:00 och återlämning kl 11:00 påföljande dag. Längre hyresperioder mot tillägg. Utrustning som inte återlämnas i tid debiteras extra hyresdag per påbörjat dygn.'],
  ['2. Bokning och betalning',
   'Privatpersoner betalar alltid innan eller i samband med att utrustningen lämnas ut — via Swish, förskottsfaktura eller kortbetalning vid hämtning. Vid kortbetalning tar vi de flesta betalkort på marknaden (Visa, Mastercard, Maestro, American Express) samt Apple Pay och Google Pay. Bokningar inom 72 timmar kräver omedelbar betalning. Bokningsavgift om 49 kr (exkl. moms) tillkommer. Vid utebliven betalning i rätt tid debiteras dröjsmålsränta enligt räntelagen (referensränta + 8 %) samt påminnelseavgift om 60 kr per påminnelse och lagstadgad inkassoavgift om 180 kr enligt lag (1981:739) om ersättning för inkassokostnader m.m.'],
  ['3. Avbokning och ändring',
   'Mer än 7 dagar före: kostnadsfritt. 3–7 dagar: 50 % återbetalas. Färre än 3 dagar: ingen återbetalning. Byte av datum/utrustning är kostnadsfritt om tillgängligt. DJ-bokningar: mer än 60 dagar gratis; 30–60 dagar 50 %; färre än 30 dagar fullt pris. Avbokning ska göras skriftligen.'],
  ['4. Ansvar och försäkring',
   'Hyrestagaren ansvarar för utrustningen från hämtning till godkänd återlämning. Ansvaret kvarstår oavsett vem som fysiskt hanterar utrustningen. Vidareuthyrning är inte tillåten. Scenkonsult Norden har ingen försäkring som täcker skada eller stöld — hyrestagaren ska ha giltig allrisk- eller hemförsäkring för utrustningen. Utan försäkringsskydd är hyrestagaren betalningsskyldig för hela återanskaffningsvärdet.'],
  ['5. Leverans och hämtning',
   'Hämtning på vår depå eller leverans mot tillägg (pris per körning tur & retur). Avtalad ankomsttid är ungefärlig. Adressändring inom samma fraktzon är möjlig; annan fraktzon kräver bekräftelse. Hyrestagaren ansvarar för att behörig person finns på plats.'],
  ['6. Utlämning och fullmakt',
   'Inför utlämning skickar Scenkonsult en förberedelse-länk via SMS dagen innan: legitimering, signering och eventuell fullmakt åt bud eller kontaktperson. Hyresavtalet slutförs vid Scenkonsult Nordens motkvittering. Beställaren är fortsatt ansvarig för utrustningen oavsett vem som fysiskt hämtar eller tar emot den.'],
  ['7. Montering och teknik',
   'Enklare utrustning levereras för självmontering. Scenpaket Large och uppåt kräver professionell montering (prissätts separat). LED-skärmar och komplex ljusutrustning kräver tekniker. Monteringstjänst debiteras per påbörjad 15-minutersperiod à 150 kr exkl. moms (600 kr/tim). Kundens driftansvar: hyrestagaren ansvarar för att utrustningen kan användas på plats. Uppladdningsbar utrustning kan behöva laddas före användning. Batteridriven utrustning levereras med nya batterier men kan behöva batteribyte under hyresperioden — hyrestagaren ansvarar för byte vid behov. Nätströmsdriven utrustning kräver att hyrestagaren tillhandahåller lämplig strömförsörjning på plats samt nödvändiga förlängningskablar (kan hyras separat). Bristande laddning, uteblivet batteribyte eller otillräcklig ström utgör inte fel och ger inte prisavdrag.'],
  ['8. Fel och reklamation',
   'Fel vid hämtning/leverans anmäls omedelbart — senast innan evenemanget startar. Scenkonsult Norden avhjälper felet, erbjuder ersättningsutrustning eller återbetalar aktuell del. Reklamation efter återlämning utan anmärkning godtas normalt inte. Enstaka släckta eller missfärgade pixlar i LED-skärmar ligger i teknikens natur och utgör inte fel, förutsatt att skärmens helhetsfunktion inte väsentligt påverkas — sådana pixelavvikelser är inte grund för reklamation eller prisavdrag.'],
  ['9. Force majeure',
   'Scenkonsult Norden är fri från ansvar vid hinder utanför vår kontroll (extremväder, trafikolycka, strejk, myndighetsbeslut). Vid omöjlig leverans återbetalas erlagd hyra i sin helhet.'],
  ['10. Tvister',
   'Tvister löses i första hand genom dialog. I annat fall avgörs de i Stockholms tingsrätt med tillämpning av svensk lag. Konsumenter har alltid rätt att vända sig till Allmänna reklamationsnämnden (ARN).'],
  ['11. Ångerrätt vid distansavtal',
   'Konsumenter har normalt 14 dagars ångerrätt vid distansavtal. Genom att slutföra bokningen bekräftar konsumenten att tjänsten ska påbörjas omedelbart, vilket innebär att ångerrätten upphör om hyresperioden infaller inom ångerfristen. Återbetalning sker då enligt avbokningsvillkoren i §3.'],
  ['12. Personuppgifter',
   'Personuppgifter behandlas enligt GDPR och vår integritetspolicy (scenkonsult.se/personuppgiftpolicy/). Uppgifterna används enbart för att administrera bokning, fakturering och kundkommunikation.'],
];

const VILLKOR_B2B = [
  ['1. Hyresperiod',
   'Normal hyresperiod är 22 timmar — hämtning kl 13:00 och återlämning kl 11:00 påföljande dag. Längre hyresperioder mot tillägg. Utrustning som inte återlämnas i tid debiteras extra hyresdag per påbörjat dygn.'],
  ['2. Bokning och betalning',
   'Bokning är bindande och bekräftas skriftligen. Betalning sker normalt mot faktura (vanligen 5–30 dagar). Företag utan kreditmöjlighet kan i stället betala vid hämtning med kort (de flesta betalkort accepteras, samt Apple Pay och Google Pay) eller via Swish. Bokningar inom 72 timmar kräver omedelbar betalning. Bokningsavgift om 49 kr (exkl. moms) tillkommer per faktura. Dröjsmålsränta debiteras vid sen betalning (referensränta + 8 %). Vid utebliven betalning debiteras även påminnelseavgift om 60 kr per påminnelse samt lagstadgad inkassoavgift om 180 kr enligt lag (1981:739) om ersättning för inkassokostnader m.m.'],
  ['3. Beställarens ansvar och behörighet',
   'Den fysiska person som genomför bokningen ("Beställaren") intygar att hen är behörig att binda hyresgästen — företag, förening eller annan organisation. Om sådan behörighet saknas blir Beställaren personligen och primärt ansvarig för hela hyresavtalet, inklusive hyresbelopp, skada, förlust och återanskaffningskostnad.'],
  ['4. Avbokning och ändring',
   'Mer än 7 dagar före: kostnadsfritt. 3–7 dagar: 50 % återbetalas. Färre än 3 dagar: ingen återbetalning. Byte av datum/utrustning är kostnadsfritt om tillgängligt. DJ-bokningar: mer än 60 dagar gratis; 30–60 dagar 50 %; färre än 30 dagar fullt pris. Avbokning ska göras skriftligen.'],
  ['5. Ansvar och försäkring',
   'Hyrestagaren ansvarar för utrustningen från hämtning till godkänd återlämning. Ansvaret kvarstår oavsett vem som fysiskt hanterar utrustningen. Vidareuthyrning är inte tillåten. Scenkonsult Norden har ingen försäkring som täcker skada eller stöld — hyrestagaren ska ha giltig allrisk- eller företagsförsäkring för utrustningen. Utan försäkringsskydd är hyrestagaren betalningsskyldig för hela återanskaffningsvärdet.'],
  ['6. Leverans och hämtning',
   'Hämtning på vår depå eller leverans mot tillägg (pris per körning tur & retur). Avtalad ankomsttid är ungefärlig. Adressändring inom samma fraktzon är möjlig; annan fraktzon kräver bekräftelse. Hyrestagaren ansvarar för att behörig person finns på plats.'],
  ['7. Utlämning, fullmakt och motkvittering',
   'Inför utlämning skickar Scenkonsult en förberedelse-länk via SMS dagen innan: legitimering, signering och eventuell fullmakt åt bud eller kontaktperson. Hyresavtalet slutförs vid Scenkonsult Nordens motkvittering vid utlämning. Beställaren är fortsatt ansvarig för utrustningen oavsett vem som fysiskt hämtar eller tar emot den.'],
  ['8. Montering och teknik',
   'Enklare utrustning levereras för självmontering. Scenpaket Large och uppåt kräver professionell montering (prissätts separat). LED-skärmar och komplex ljusutrustning kräver tekniker. Monteringstjänst debiteras per påbörjad 15-minutersperiod à 150 kr exkl. moms (600 kr/tim). Kundens driftansvar: hyrestagaren ansvarar för att utrustningen kan användas på plats. Uppladdningsbar utrustning kan behöva laddas före användning. Batteridriven utrustning levereras med nya batterier men kan behöva batteribyte under hyresperioden — hyrestagaren ansvarar för byte vid behov. Nätströmsdriven utrustning kräver att hyrestagaren tillhandahåller lämplig strömförsörjning på plats samt nödvändiga förlängningskablar (kan hyras separat). Bristande laddning, uteblivet batteribyte eller otillräcklig ström utgör inte fel och ger inte prisavdrag.'],
  ['9. Fel och reklamation',
   'Fel vid hämtning/leverans anmäls omedelbart — senast innan evenemanget startar. Scenkonsult Norden avhjälper felet, erbjuder ersättningsutrustning eller återbetalar aktuell del. Reklamation efter återlämning utan anmärkning godtas normalt inte. Enstaka släckta eller missfärgade pixlar i LED-skärmar ligger i teknikens natur och utgör inte fel, förutsatt att skärmens helhetsfunktion inte väsentligt påverkas — sådana pixelavvikelser är inte grund för reklamation eller prisavdrag.'],
  ['10. Force majeure',
   'Scenkonsult Norden är fri från ansvar vid hinder utanför vår kontroll (extremväder, trafikolycka, strejk, myndighetsbeslut). Vid omöjlig leverans återbetalas erlagd hyra i sin helhet.'],
  ['11. Tvister',
   'Tvister löses i första hand genom dialog. I annat fall avgörs de i Stockholms tingsrätt med tillämpning av svensk lag.'],
];

/**
 * Avgör vilken villkorsversion som ska visas för en given cart.
 * Logik (samma som admin-send-quote.js):
 *   - cart.customer_type === 'b2b'        → B2B
 *   - cart.customer_company finns ifylld  → B2B  (fallback om customer_type saknas)
 *   - Annars                              → B2C  (default — säkrast eftersom konsumenträtt)
 */
function getVillkor(cart) {
  const isB2B =
    cart && (
      cart.customer_type === 'b2b' ||
      (!cart.customer_type && cart.customer_company)
    );
  return {
    villkor:  isB2B ? VILLKOR_B2B : VILLKOR_B2C,
    heading:  isB2B
      ? 'Allmänna hyresvillkor — företag och organisationer'
      : 'Allmänna hyresvillkor — privatpersoner',
    subhead:  `Scenkonsult Norden / Sigvardsson Consulting Group AB · Gäller från ${VILLKOR_DATE}`,
    type:     isB2B ? 'b2b' : 'b2c',
  };
}

module.exports = { getVillkor, VILLKOR_B2C, VILLKOR_B2B, VILLKOR_DATE };
