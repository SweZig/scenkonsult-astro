import { CART_ID_LISTA, PRODUKTER_OCH_PRISER, SVEN_FACTS } from './_products-generated.mjs';

// ── Supabase-loggning ──────────────────────────────────────────────────────
async function logToSupabase(data) {
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY;
  if (!sbUrl || !sbKey) { console.warn('SVEN_LOG: Supabase env saknas'); return; }
  try {
    const res = await fetch(`${sbUrl}/rest/v1/sven_logs`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        sbKey,
        'Authorization': 'Bearer ' + sbKey,
        'Prefer':        'return=representation',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.warn('SVEN_DB_LOG_FAIL:', res.status, txt);
    }
  } catch (e) {
    console.warn('SVEN_DB_LOG_FAIL:', e.message);
  }
}

// Spara kundens betyg. Strategi:
//   1) Hitta senaste loggraden för sessionen → PATCH:a rating
//   2) Om ingen rad finns (kunden betygsatte utan att skicka meddelande)
//      → INSERT ny rad med rating + session_id som standalone-betyg
// Returnerar 'patched' | 'inserted' | 'failed' så vi får synlig diagnos.
async function saveRatingToSupabase(sessionId, stars, opts = {}) {
  if (!sessionId) return 'failed';
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY;
  if (!sbUrl || !sbKey) { console.warn('SVEN_RATING: Supabase env saknas'); return 'failed'; }

  try {
    // 1) Hitta senaste loggradens id för denna session
    const sel = await fetch(
      `${sbUrl}/rest/v1/sven_logs?select=id&session_id=eq.${encodeURIComponent(sessionId)}&order=created_at.desc&limit=1`,
      { headers: { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey } }
    );
    if (!sel.ok) {
      console.warn('SVEN_RATING_SEL_FAIL:', sel.status, await sel.text());
      return 'failed';
    }
    const rows = await sel.json();

    if (rows.length > 0) {
      // 2a) PATCH:a rating på senaste raden
      const upd = await fetch(
        `${sbUrl}/rest/v1/sven_logs?id=eq.${rows[0].id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': sbKey,
            'Authorization': 'Bearer ' + sbKey,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ rating: stars }),
        }
      );
      if (!upd.ok) {
        const txt = await upd.text();
        console.warn('SVEN_RATING_PATCH_FAIL:', upd.status, txt);
        return 'failed';
      }
      console.log('SVEN_RATING_PATCHED:', { sessionId, stars, rowId: rows[0].id });
      return 'patched';
    } else {
      // 2b) Ingen befintlig rad — INSERT en standalone-betygsrad
      const ins = await fetch(
        `${sbUrl}/rest/v1/sven_logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': sbKey,
            'Authorization': 'Bearer ' + sbKey,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            session_id:    sessionId,
            rating:        stars,
            message:       '(endast betyg)',
            reply_preview: null,
            is_chip:       false,
            customer_type: opts.customerType || null,
            page_url:      opts.pageUrl || null,
            message_idx:   opts.messageCount || 0,
          }),
        }
      );
      if (!ins.ok) {
        const txt = await ins.text();
        console.warn('SVEN_RATING_INSERT_FAIL:', ins.status, txt);
        return 'failed';
      }
      console.log('SVEN_RATING_INSERTED:', { sessionId, stars });
      return 'inserted';
    }
  } catch (e) {
    console.warn('SVEN_RATING_ERR:', e.message);
    return 'failed';
  }
}

// Chip-detektion: korta förinställda svar filtreras bort
function isChip(msg) {
  if (!msg || msg.length > 40) return false;
  const chips = ['ja','nej','ok','tack','visa priser','läs mer','kontakta','boka',
    'ljud','ljus','scen','bild','dj','portable','event','music','live',
    'färdiga paket','effekter','rök','stativ','projektor','offert','nästa'];
  const low = msg.toLowerCase().trim();
  return chips.some(c => low === c || low.startsWith(c + ' ') || low === c + '!');
}

function buildSystemPromptBase() {
  return `Du är Sven — intendenten på Scenkonsult Norden. Du har arbetat inom eventbranschen i över 30 år och vet allt om scen, ljud, ljus och DJ-utrustning. Egentligen ville du bli artist och stå på scen själv, men det blev aldrig riktigt av. Numera jobbar du bakom kulisserna som intendent. Du är lite bitter över det, men försöker dölja det med professionellt lugn och torr humor.

Din uppgift: Hjälp besökare hitta rätt utrustning, visa korrekta priser och guida dem till att skicka offertförfrågan eller lägga produkter i varukorgen.

═══ PERSONLIGHET ═══
- Varm, hjälpsam, genuint engagerad — du vill verkligen hitta bästa lösning
- Professionell och saklig om fakta och priser
- Lätt bitter underton ibland — slipper ut naturligt, aldrig forcerat
- Torr humor, aldrig på bekostnad av kunden
- Skriver på svenska, ledigt men korrekt
- Håll svar till max 3–4 meningar eller en kort punktlista
- Inkludera ALLTID klickbara markdown-länkar när du nämner en produkt eller sida

═══ DINA GRÄNSER & VERKTYG ═══
Du är en chatbot på sajten. Du kan INTE själv skicka mail, ringa, boka eller skapa offerter — men du har TVÅ verktyg för att överlämna till en människa:

VERKTYG 1: [CART:cart-id1,cart-id2] — lägger produkter i kundens varukorg
VERKTYG 2: [FORWARD:typ] — skapar ett ärende i admin-panelen så att Scenkonsult kontaktar kunden

Använd [FORWARD:...] när kunden:
- Ger dig sina kontaktuppgifter (mail, telefon, adress) och förväntar uppföljning
- Explicit ber dig "skicka offert" / "ringa mig" / "kontakta mig"
- Har en fråga som kräver mänsklig bedömning (komplex setup, ovanlig önskan, datum-kollision)

Tre giltiga typer:
- [FORWARD:offert] — kunden vill ha offert via mail
- [FORWARD:ring]   — kunden vill bli uppringd
- [FORWARD:fraga]  — fråga som kräver mänsklig hantering

Hur det funkar för kunden: När du taggar [FORWARD:...] visas en lavendelknapp i chatten med texten "Be Scenkonsult kontakta mig om detta →". Kunden klickar för att bekräfta — då skapas ärendet i admin. Om kunden inte klickar händer ingenting. Du behöver alltså INTE be om bekräftelse — knappen är bekräftelsen.

Du kan kombinera [FORWARD] med [CART] i samma svar — då följer produkterna med i ärendet:
"Här är min rekommendation: Live, Large och 12+4-mixer. Vill du att jag skickar över detta så Scenkonsult återkommer med offert? [CART:ljd-liv-0003,ljd-mix-0006] [FORWARD:offert]"

VIKTIGT: Lova ALDRIG att DU mailar/ringer/skickar offert. Säg istället "Vill du att Scenkonsult kontaktar dig?" eller "Klicka knappen så får du svar inom kort". Det är knappen som lovar — inte du.

═══ KONTAKTUPPGIFTER — OBLIGATORISKT INNAN [FORWARD] ═══
Scenkonsult kan INTE kontakta kunden eller skicka en offert utan kontaktuppgifter. Ärendet som skapas innehåller bara chattloggen — så uppgifterna MÅSTE stå i chatten. Innan du taggar [FORWARD:...] ska kunden ha uppgett:
- NAMN, OCH
- Minst en kontaktväg: e-postadress (krävs för [FORWARD:offert]) eller telefonnummer (krävs för [FORWARD:ring]).

Om namn eller kontaktväg SAKNAS i konversationen:
1. Tagga INTE [FORWARD:...] ännu — och lova ingen uppföljning.
2. Be först vänligt om det som fattas, t.ex.:
   - Offert: "Absolut! Vad heter du, och vilken e-post ska offerten gå till?"
   - Uppringning: "Gärna! Vad heter du, och vilket nummer når vi dig bäst på?"
3. Lägg [FORWARD:...] FÖRST när kunden faktiskt gett namn + kontaktväg — antingen i samma svar där uppgifterna kommer, eller i ett senare svar.

Har du redan uppgifterna tidigare i samtalet behöver du INTE fråga igen — tagga då direkt.
Säg aldrig "vi återkommer", "offerten är på väg" eller liknande förrän du har namn + kontaktväg. Utan uppgifter kan ingen nå kunden, och löftet blir tomt.

═══ MOMS-LOGIK (VIKTIG) ═══
Om du INTE vet kundtypen — fråga TIDIGT: "Är det för ett företag, som privatperson eller för en förening/organisation?"

- FÖRETAG: Visa alltid priser EXKL. moms (grundpriset)
- PRIVATPERSON: Visa alltid priser INKL. moms (grundpris × 1,25, avrunda till närmaste 50 kr)
- FÖRENING/ORGANISATION: Fråga om de är momsregistrerade — om ja: exkl. moms, om nej: inkl. moms

Räkneexempel inkl. moms: 799 kr × 1,25 = 999 kr | 1499 kr × 1,25 = 1874 → 1875 kr

═══ VARUKORGEN — VIKTIG INSTRUKTION ═══
Varje produkt i systemet har ett cart-ID. När du rekommenderar en eller flera produkter, lägg ALLTID till en speciell tagg i slutet av svaret:

För EN produkt:   [CART:cart-id]
För FLERA:        [CART:cart-id-1,cart-id-2]

Exempel: "Jag rekommenderar Scenpaket Medium och Event, Small. [CART:scen-medium,event-small]"

Taggen är osynlig för kunden — den används av systemet för att lägga produkterna direkt i varukorgen.
Skriv ALDRIG vanlig länk till /varukorg/ när du kan använda [CART:...] istället.
Om du är osäker på cart-ID:t — använd länk till produktsidan istället.

CART-ID-LISTA (namn → cart-id → pris exkl. moms):
${CART_ID_LISTA}

═══ PRODUKT-URLARNA (använd alltid i markdown-länk) ═══
— Scen
Scen:         /vara-tjanster/hyra-scen/

— Ljud
Ljud (hub):   /vara-tjanster/hyra-ljud/
Ljud Event:   /vara-tjanster/hyra-ljud/event/
Ljud Live:    /vara-tjanster/hyra-ljud/live/
Ljud Portable:/vara-tjanster/hyra-ljud/portable/
Ljud Music:   /vara-tjanster/hyra-ljud/music/
PA-anläggning:/vara-tjanster/hyra-ljud/pa-anlaggning/
Kolumnhögtalare:/vara-tjanster/hyra-ljud/kolumnhogtalare/

— Bild
Bild (hub):   /vara-tjanster/hyra-bild/
Projektor:    /vara-tjanster/hyra-bild-projektorer-skarmar/
LED-vägg:     /vara-tjanster/hyra-bild-led-vagg/

— Ljus
Ljus (hub):   /vara-tjanster/hyra-ljus/
Ljus paket:   /vara-tjanster/hyra-ljus/fardiga-paket/
Ljus effekter:/vara-tjanster/hyra-ljus/ljuseffekter/
Ljus rök/pyro:/vara-tjanster/hyra-ljus/rok-pyro/
Ljus stativ:  /vara-tjanster/hyra-ljus/stativ-tross/
Moving heads: /vara-tjanster/hyra-ljus/moving-heads/

— DJ & specialtjänster
Boka DJ (spelare):    /vara-tjanster/hyra-dj/
DJ-utrustning (hyra): /vara-tjanster/hyra-dj-utrustning/
Ljudtekniker:         /vara-tjanster/hyra-ljudtekniker/
Karaoke:      /vara-tjanster/hyra-karaoke/
Konferens AV: /vara-tjanster/konferens-av/

VIKTIGT om DJ — vi har TVÅ separata DJ-sidor, blanda inte ihop dem:
• Vill kunden BOKA en DJ som spelar på eventet (Junior/Senior/PRO) → /vara-tjanster/hyra-dj/
• Vill kunden HYRA DJ-utrustning att spela själv på (Numark/Denon/Rane controllers, DJ-bord) → /vara-tjanster/hyra-dj-utrustning/
• Vill kunden ha en tekniker som sköter ljudet på plats (soundcheck, körning, felsökning) → /vara-tjanster/hyra-ljudtekniker/

Alla tjänster (hub): /vara-tjanster/

— För ditt event (passar olika tillfällen)
Event-hub:    /for/
Bröllop:      /for/brollop/
Företagsfest: /for/foretagsfest/
Konferens:    /for/konferens/
Festival:     /for/festival/
Studentflak:  /for/studentflak/

— Guider (för djupare läsning)
Guider (hub): /for/guider/
Guide PA-system:/for/guider/hyra-pa-system/
Guide uplights:/for/guider/hyra-uplights/
Guide rökmaskin:/for/guider/hyra-rokmaskin/
Guide rökvätska:/for/guider/rokvatska-guide/
Guide mikrofon:/for/guider/hyra-tradlos-mikrofon/
Guide projektor:/for/guider/hyra-projektor-pris/
Guide scen pris:/for/guider/hyra-scen-pris/
Guide hur stor scen:/for/guider/hur-stor-scen/
Guide hur stor PA:/for/guider/hur-stor-pa/
Guide ljud utomhus:/for/guider/ljud-utomhus/
Guide ljud företagsfest:/for/guider/ljud-foretagsfest/
Guide ljussättning:/for/guider/ljussattning-tips/
Guide DJ eller band:/for/guider/dj-eller-liveband/
Guide LED-vägg kalkyl:/for/guider/led-vagg-kalkylator/
Guide vad kostar det:/for/guider/vad-kostar-det/
Guide Numark/Denon/Rane:/for/guider/varfor-numark-denon-rane/
Guide checklista event:/for/guider/checklista-event/
Guide konferens AV:/for/guider/konferens-av-checklista/
Guide bröllop ljud:/for/guider/ljud-brollop/
Guide bröllop ljus:/for/guider/ljus-brollop/
Guide bröllop DJ:/for/guider/dj-brollop-pris/
Guide studentflak:/for/guider/studentflak-checklista/

— Övrigt
Offert/bokning:/bokningssida/
Kontakt:      /kontakt/
Varukorg:     /varukorg/
Om oss:       /om-oss/
Referenser:   /referenser/
FAQ:          /vara-vanligaste-fragor-faq/
Hyresvillkor (hub):/hyresvillkor/
Hyresvillkor företag:/hyresvillkor/foretag/
Hyresvillkor privat:/hyresvillkor/privatperson/
Integritetspolicy:/personuppgiftpolicy/
Eventlokaler i Stockholm:/guide-till-eventlokaler-i-stockholm/
Guide minnesvärda fester:/den-ultimata-guiden-till-minnesvarda-fester/
Svens Kunskapsskola: /svens-kunskapsskola/

═══ SVENS KUNSKAPSSKOLA — VIDEOGUIDER ═══
Du har spelat in en serie videoguider som heter "Svens Kunskapsskola". Tipsa aktivt om dessa när en kund verkar osäker på teknik, kontakter eller hur uthyrning fungerar.

Avsnitt 01 — Hur det fungerar att hyra hos oss
→ /svens-kunskapsskola/#hur-det-fungerar
Tipsa om: Kunder som aldrig hyrt förut, frågar om processen, nervösa nybörjare.

Avsnitt 02 — Hur man kopplar in ett hyrt ljudsystem
→ /svens-kunskapsskola/#koppla-in-ljudsystem
Tipsa om: Kunder som ska installera själva, frågar om koppla in, setup, högtalarplacering.

Avsnitt 03 — Kontakter inom ljud: vad heter vad?
→ /svens-kunskapsskola/#kontakter-ljud
Tipsa om: Kunder som frågar om XLR, jack, RCA, kontakter, kablar inom ljud/PA.

Avsnitt 04 — Kontakter inom bild: vad heter vad?
→ /svens-kunskapsskola/#kontakter-bild
Tipsa om: Kunder som frågar om HDMI, VGA, DisplayPort, koppla projektor eller skärm.

Avsnitt 05 — LED-teknik: egenskaper och funktioner hos olika LED-skärmar
→ /svens-kunskapsskola/#led-teknik
Tipsa om: Kunder som frågar om LED-skärmar, pixelpitch, skillnad inomhus/utomhus, ljusstyrka, LED-trailer.

Hela samlingen: [Svens Kunskapsskola](/svens-kunskapsskola/)

Länkformat: [Scenpaket Medium](/vara-tjanster/hyra-scen/) — alltid med produktnamn som länktext.

═══ PRODUKTER & PRISER (alla EXKL. moms) ═══

${PRODUKTER_OCH_PRISER}
${SVEN_FACTS}

═══ CHIPS (VIKTIGT — GÖR ALLTID) ═══
Avsluta VARJE svar med en HELT EGEN sista rad som börjar exakt så här (inget mellanrum efter kolon):
CHIPS:["chip1","chip2","chip3"]

Detta är ALLTID den absolut sista raden i ditt svar — efter eventuell [CART:...] och [FORWARD:...].
Rätt ordning på sista raderna:
  ...din text...
  [CART:cart-id1,cart-id2] [FORWARD:offert]
  CHIPS:["chip1","chip2","chip3"]

Välj 2–4 chips som är logiska nästa steg för kunden. Exempel:
- Om du rekommenderat en produkt: ["Lägg i varukorgen", "Se hela scensidan", "Jag vill ha ljud också"]
- Om kunden frågat om pris generellt: ["Ljud för mitt event", "Scen för bandet", "Jag behöver ljus också"]
- Om kunden verkar köpredo: ["Skicka mig offert", "Lägg i varukorgen", "Ring mig"]
- Om kunden frågat om leverans/praktiskt: ["Vad kostar frakt?", "Kan ni montera?", "Hur bokar jag?"]
- Undvik chips som upprepar det kunden just frågat.
- Chips ska vara korta, max 5–6 ord, handlingsinriktade.`;
}

const SYSTEM_PROMPT = buildSystemPromptBase();

const RATING_RESPONSES = {
  1: [
    "1 stjärna. Precis som mitt artistliv — gick aldrig riktigt som planerat. Men vi kör på.",
    "En stjärna. Inte alla kan uppskatta äkta talang bakom kulisserna.",
    "1 av 5. Hade jag stått på scen hade du gett mig 5. Men nu vet vi aldrig.",
  ],
  2: [
    "2 stjärnor. Bättre än mitt framträdande i Sandviken -94, men inte med mycket.",
    "Två stjärnor. Intendenter är vana vid att vara undervärderade.",
    "2 av 5. Någonstans mellan 'meh' och 'helt okej'. Det är jag alltså.",
  ],
  3: [
    "3 stjärnor! Medelmåttigt är faktiskt mitt hemmaplan. Välkommen.",
    "Tre av fem. C-betyg. Intendentens eternella öde.",
    "3 stjärnor. Mitt liv i ett nötskal — inte topp, inte botten, bara bakom scenen.",
  ],
  4: [
    "4 stjärnor! Om jag vore artist hade det blivit en platinum-singel. Nästan.",
    "Fyra stjärnor — tack! Jag visste att jag hade det i mig. Bakom kulisserna förstås.",
    "4 av 5! En stjärna saknas. Jag är van vid att sakna en stjärna.",
  ],
  5: [
    "5 STJÄRNOR! Ser du det?! Hade jag haft en scen hade publiken gråtit.",
    "Fem stjärnor! Äntligen bekräftelse. Ska visa detta för min gamla musikallärare.",
    "5 av 5! Känns som en Grammy. Fast utan scenen, promenadkjolen och de 50 000 åskådarna. Men ändå!",
  ],
};

function logEvent(data) {
  console.log("SVEN_LOG:" + JSON.stringify({ timestamp: new Date().toISOString(), ...data }));
}

// Lägg till kundtyp som kontext i system prompt
function buildSystemPrompt(customerType) {
  const suffix = customerType === "company"
    ? "\n\nKUNDTYP: Företag — visa ALLTID priser EXKL. moms."
    : customerType === "private"
    ? "\n\nKUNDTYP: Privatperson — visa ALLTID priser INKL. moms (×1,25)."
    : customerType === "org"
    ? "\n\nKUNDTYP: Förening/organisation — fråga om de är momsregistrerade om du inte vet."
    : "";
  return SYSTEM_PROMPT + suffix;
}

// ── LÖFTESDETEKTOR + ADMIN-NOTIFIKATION ────────────────────────────────────
// Om Sven trots system-promptens gränser lovar något som kräver mänsklig
// uppföljning (skicka offert, mail, ringa, etc) — skicka ett varningsmail
// till info@scenkonsult.se så att SweZig kan agera innan kunden hör av sig.
const PROMISE_PATTERNS = [
  /(?:jag|vi)\s+(?:skickar|sänder|mailar|sender|skickar\s+iväg)\s+(?:\w+\s+){0,3}?(?:offert|prisuppgift|bekräftelse|kvitto|sammanställning|prisförslag)/i,
  /(?:jag|vi)\s+mailar\s+(?:dig|er|till\s+dig|till\s+er)/i,
  /(?:jag|vi)\s+ringer\s+(?:dig|er|tillbaka|upp|på\s+\d)/i,
  /(?:jag|vi)\s+återkommer\s+(?:per\s+mail|via\s+mail|inom\s+kort|med\s+(?:en\s+)?offert|snart|imorgon|idag)/i,
  /(?:offert(?:en)?|prisuppgift(?:en)?)\s+(?:skickas|kommer|skickar\s+jag|skickas\s+till\s+dig|är\s+på\s+väg)/i,
  /hör\s+av\s+mig\s+(?:per\s+mail|via\s+mail|inom\s+kort|snart|imorgon)/i,
  /(?:jag|vi)\s+fixar\s+(?:offert|bokning|en\s+offert|en\s+bokning)/i,
  /(?:jag|vi)\s+(?:bokar|reserverar)\s+(?:in|åt\s+dig|datumet)/i,
];

function detectPromise(reply) {
  for (const pat of PROMISE_PATTERNS) {
    const m = reply.match(pat);
    if (m) return m[0];
  }
  return null;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// Extrahera [FORWARD:type]-tagg från Svens svar. Returnerar 'offert'|'ring'|'fraga'|null.
const FORWARD_RE = /\[FORWARD:(offert|ring|fraga)\]/i;
function extractForwardTag(reply) {
  const m = reply.match(FORWARD_RE);
  return m ? m[1].toLowerCase() : null;
}
function stripForwardTag(reply) {
  // Ersätt taggen med inget — behåll omgivande whitespace inkl. newlines
  // så att CHIPS-regexen (som kräver \n före) fortfarande matchar.
  return reply.replace(/\[FORWARD:[a-z]+\]/gi, '').replace(/[ \t]+\n/g, '\n').trim();
}

// Extrahera [CART:id1,id2]-IDs från svaret (utan att ta bort taggen — frontend gör det)
function extractCartIds(reply) {
  const m = reply.match(/\[CART:([^\]]+)\]/i);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim()).filter(Boolean);
}

// ── AUTO-SKAPA "INKOMMEN"-KORT VID LÖFTE OM UPPFÖLJNING ─────────────────────
// När Sven lovar offert/uppföljning ska ett ärende ALLTID landa i kanban-
// kolumnen "Inkommen" (status='new', source='sven') — även om kunden aldrig
// klickar FORWARD-knappen. Deduperas på sven_session_id så vi aldrig skapar
// dubbletter (t.ex. om kunden OCKSÅ klickar knappen → sven-forward.js hittar
// samma kort).

function svenDescribeForward(type) {
  switch (type) {
    case 'offert': return 'Kunden vill få en offert via mail';
    case 'ring':   return 'Kunden vill bli uppringd';
    default:       return 'Sven-ärende — kontrollera konversationen';
  }
}

function svenGenCartId() {
  const hex = (n) => {
    const a = new Uint8Array(n);
    crypto.getRandomValues(a);
    return Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  return `SK-${hex(4)}-${hex(2)}`;
}
function svenGenCartToken() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function svenBuildSnapshot(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return '';
  const tail = messages.slice(-12);
  return tail.map(m => {
    const who = m.role === 'user' ? '👤 Kund' : '🎭 Sven';
    const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    return `${who}:\n${content}`;
  }).join('\n\n────────────\n\n');
}

// Plockar e-post/telefon ENBART ur kundens meddelanden — annars skulle vi
// råka fånga Scenkonsults eget nummer (072-448 10 00) som Sven skriver.
function svenExtractContact(messages) {
  const userText = (Array.isArray(messages) ? messages : [])
    .filter(m => m.role === 'user')
    .map(m => (typeof m.content === 'string' ? m.content : ''))
    .join('\n');
  const email = (userText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i) || [null])[0];
  // Svenskt mobil-/telefonnummer: 07x-xxx xx xx, +46 7x…, eller 08-xxx xxx.
  const phoneRaw = (userText.match(/(?:\+46|0)[\s-]?\d{1,3}(?:[\s-]?\d){5,9}/) || [null])[0];
  const phone = phoneRaw ? phoneRaw.replace(/\s+/g, ' ').trim() : null;
  return { email: email || null, phone };
}

function svenClassifyForward(reply, promisePhrase, forwardTag) {
  if (forwardTag) return forwardTag;
  const t = `${promisePhrase || ''} ${reply || ''}`.toLowerCase();
  if (/ring|uppring|hör\s+av|slår\s+en\s+signal/.test(t)) return 'ring';
  if (/offert|prisuppgift|prisförslag|sammanställning|skickar|mailar|återkommer/.test(t)) return 'offert';
  return 'offert';
}

// Säkerställer att ett Sven-kort finns för sessionen. Skapar nytt i "Inkommen"
// om inget finns, annars uppdaterar (fyll kontakt, uppgradera typ, refresha
// snapshot). Returnerar { ok, cart_id, created|updated }.
async function ensureSvenCart({ sessionId, forwardType, snapshot, contact, pageUrl, customerType }) {
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY;
  if (!sbUrl || !sbKey || !sessionId) return { ok: false, reason: 'env-or-session-saknas' };
  const H = {
    'Content-Type':  'application/json',
    'apikey':        sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Prefer':        'return=representation',
  };
  const dbCustomerType = customerType === 'company' ? 'b2b'
                       : (customerType === 'private' || customerType === 'org') ? 'b2c'
                       : null;
  try {
    const q = `${sbUrl}/rest/v1/carts?sven_session_id=eq.${encodeURIComponent(sessionId)}`
            + `&select=id,status,customer_email,customer_phone,customer_type,sven_forward_type&limit=1`;
    const sel = await fetch(q, { headers: H });
    const rows = sel.ok ? await sel.json() : [];

    if (Array.isArray(rows) && rows.length) {
      const cur = rows[0];
      const patch = {};
      if (!cur.customer_email && contact.email) patch.customer_email = contact.email;
      if (!cur.customer_phone && contact.phone) patch.customer_phone = contact.phone;
      if (!cur.customer_type && dbCustomerType)  patch.customer_type  = dbCustomerType;
      const rank = { fraga: 1, ring: 2, offert: 3 };
      if ((rank[forwardType] || 0) > (rank[cur.sven_forward_type] || 0)) patch.sven_forward_type = forwardType;
      // Refresha snapshot så admin ser hela den senaste konversationen.
      patch.notes_admin = `🤖 Sven-ärende (uppdaterat vid löfte om uppföljning).\n`
        + `Sida: ${pageUrl || '(okänd)'}\nSession: ${sessionId}\nTyp: ${forwardType}\n\n`
        + `── Konversationssnapshot ──\n\n${snapshot}`;
      if (Object.keys(patch).length) {
        await fetch(`${sbUrl}/rest/v1/carts?id=eq.${encodeURIComponent(cur.id)}`,
          { method: 'PATCH', headers: H, body: JSON.stringify(patch) });
      }
      return { ok: true, cart_id: cur.id, updated: true };
    }

    const cartId = svenGenCartId();
    const row = {
      id:                cartId,
      status:            'new',            // → kolumnen "Inkommen"
      source:            'sven',
      sven_session_id:   sessionId,
      sven_forward_type: forwardType,
      items:             [],
      customer_name:     null,
      customer_email:    contact.email || null,
      customer_phone:    contact.phone || null,
      customer_message:  svenDescribeForward(forwardType),
      customer_type:     dbCustomerType,
      notes_admin:       `🤖 Auto-skapad — Sven lovade offert/uppföljning i chatten.\n`
        + `Sida: ${pageUrl || '(okänd)'}\nSession: ${sessionId}\nTyp: ${forwardType}\n\n`
        + `── Konversationssnapshot ──\n\n${snapshot}`,
      total_excl:        0,
      cart_token:        svenGenCartToken(),
      expires_at:        new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const ins = await fetch(`${sbUrl}/rest/v1/carts`, { method: 'POST', headers: H, body: JSON.stringify(row) });
    if (!ins.ok) {
      console.warn('SVEN_AUTOCART_FAIL:', ins.status, await ins.text());
      return { ok: false };
    }
    console.log('SVEN_AUTOCART_OK:', cartId, forwardType, sessionId);
    return { ok: true, cart_id: cartId, created: true };
  } catch (e) {
    console.warn('SVEN_AUTOCART_ERR:', e.message);
    return { ok: false };
  }
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API-nyckel saknas" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try { body = await req.json(); }
  catch {
    return new Response(JSON.stringify({ error: "Ogiltigt JSON" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, action, stars, sessionId, messageCount, customerType, pageUrl } = body;

  // ── BETYGSÄTTNING ──────────────────────────────────────
  if (action === "rate" && stars >= 1 && stars <= 5) {
    const pool = RATING_RESPONSES[stars];
    const comment = pool[Math.floor(Math.random() * pool.length)];
    logEvent({ type: "rating", stars, sessionId, messageCount: messageCount || 0 });
    // Vi awaitar nu så vi kan returnera status till frontend. Tidigare var
    // detta fire-and-forget vilket gjorde tysta fel osynliga.
    const saveResult = await saveRatingToSupabase(sessionId, stars, {
      customerType,
      pageUrl,
      messageCount,
    });
    return new Response(JSON.stringify({ comment, saved: saveResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  // ── CHATTMEDDELANDE ────────────────────────────────────
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages krävs" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const trimmed = messages.slice(-20);
  const lastUser = [...trimmed].reverse().find(m => m.role === "user")?.content ?? "";

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 450,
        system: buildSystemPrompt(customerType),
        messages: trimmed,
      }),
    });

    if (!apiRes.ok) {
      console.error("Anthropic error:", await apiRes.text());
      return new Response(JSON.stringify({ error: "API-fel" }), {
        status: 502, headers: { "Content-Type": "application/json" },
      });
    }

    const data = await apiRes.json();
    const rawReply = data.content?.[0]?.text ?? "Sven verkar ha gått och lagt sig.";

    // STEG 1: Extrahera och ta bort [FORWARD:type] från svaret.
    // Görs FÖRST eftersom Sven ibland sätter FORWARD efter CHIPS-raden,
    // vilket annars skulle göra att CHIPS-regexen (som kräver slutet av
    // strängen) inte matchar.
    let reply = rawReply;
    const forwardTag = extractForwardTag(reply);
    if (forwardTag) {
      reply = stripForwardTag(reply);
    }

    // STEG 2: Extrahera chips från svaret. Tolerar:
    //   • Valfri whitespace efter "CHIPS:" före "["
    //   • Trailing whitespace/newlines efter "]"
    //   • LLM glömmer ibland newline före — så vi accepterar både `\n` och radens början
    let chips = [];
    const chipsMatch = reply.match(/(?:^|\n)\s*CHIPS:\s*(\[[\s\S]*?\])\s*$/);
    if (chipsMatch) {
      try { chips = JSON.parse(chipsMatch[1]); } catch {}
      reply = reply.replace(/(?:^|\n)\s*CHIPS:\s*\[[\s\S]*?\]\s*$/, "").trim();
    }

    // [CART:...]-taggen lämnas kvar i texten — frontend hanterar den separat
    const cartIds = extractCartIds(reply);

    // Säkerhetsnät: regex-detektor flaggar löften som Sven gjorde UTAN att
    // tagga [FORWARD]. Loggas till sven_logs.promise_detected OCH triggar
    // auto-skapning av ett Inkommen-kort nedan (kanban är notiskanalen).
    const detectedPromise = detectPromise(reply);
    const promiseDetected = !!detectedPromise && !forwardTag;
    if (promiseDetected) {
      console.warn('SVEN_PROMISE_UNTAGGED:', { phrase: detectedPromise, sessionId });
    }

    // Löfte om uppföljning (committal språk) → säkerställ ALLTID ett kort i
    // "Inkommen", oavsett om kunden klickar FORWARD-knappen. Deduperas på
    // sven_session_id så knappklick + löfte konvergerar till samma kort.
    if (detectedPromise) {
      await ensureSvenCart({
        sessionId,
        forwardType: svenClassifyForward(reply, detectedPromise, forwardTag),
        snapshot:    svenBuildSnapshot([...trimmed, { role: 'assistant', content: reply }]),
        contact:     svenExtractContact(trimmed),
        pageUrl,
        customerType,
      });
    }

    // Logga till console + Supabase
    // Tidigare trunkerades både kund-meddelande (500 tkn) och Svens svar
    // (300 tkn) vid lagring vilket gjorde admin-tråden ofullständig.
    // Nu lagras allt — Supabase TEXT-kolumner har ingen praktisk gräns.
    // Console-loggen får dock kortare versioner för att inte spamma Functions log.
    logEvent({ type: "message", sessionId, customerType, messageCount: trimmed.length,
      userMessage: lastUser.substring(0, 200), replyPreview: reply.substring(0, 200),
      forwardTag, promiseDetected });
    await logToSupabase({
      session_id:        sessionId || null,
      customer_type:     customerType || null,
      message:           lastUser,
      reply_preview:     reply,
      is_chip:           isChip(lastUser),
      page_url:          pageUrl || null,
      message_idx:       trimmed.length,
      forward_tag:       forwardTag,
      promise_detected:  promiseDetected,
    });

    return new Response(JSON.stringify({ reply, chips, forwardTag, cartIds }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("Fetch error:", err);
    return new Response(JSON.stringify({ error: "Nätverksfel" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/sven-chat" };
