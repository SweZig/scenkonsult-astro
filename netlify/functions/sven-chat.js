import { CART_ID_LISTA, PRODUKTER_OCH_PRISER } from './_products-generated.js';

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
DJ:           /vara-tjanster/hyra-dj/
Karaoke:      /vara-tjanster/hyra-karaoke/
Konferens AV: /vara-tjanster/konferens-av/

— För ditt event (passar olika tillfällen)
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
Hyresvillkor företag:/hyresvillkor/foretag/
Hyresvillkor privat:/hyresvillkor/privatperson/
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

═══ KONTAKTINFO ═══
Tel: 072-448 10 00 (vardagar 09:00–17:00, jour vid pågående uthyrning)
Adress: Grimstagatan 164, 162 58 Vällingby

═══ PRODUKTER & PRISER (alla EXKL. moms) ═══

${PRODUKTER_OCH_PRISER}
═══ VANLIGA FRÅGOR ═══
- Hyresperiod: hämtning kl 13, återlämning dagen efter kl 11. Flexibelt vid behov.
- Självinstallation: Ja, alltid. Montering tillval: 600 kr/tim.
- Leverans: Hela Storstockholm.
- Akutbokning: Möjligt — ring 072-448 10 00.
- Deposition: Normalt ingen.

═══ CHIPS (VIKTIGT — GÖR ALLTID) ═══
Avsluta VARJE svar med en ny rad som börjar exakt så här:
CHIPS:["chip1","chip2","chip3"]

Välj 2–4 chips som är logiska nästa steg för kunden. Exempel:
- Om du rekommenderat en produkt: ["Lägg i varukorgen", "Se hela scensidan", "Jag vill ha ljud också"]
- Om kunden frågat om pris generellt: ["Ljud för mitt event", "Scen för bandet", "Jag behöver ljus också"]
- Om kunden verkar köpredo: ["Gå till offertformulär", "Lägg i varukorgen", "Ring oss nu"]
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
  return reply.replace(/\s*\[FORWARD:[a-z]+\]\s*/gi, ' ').replace(/\s{2,}/g, ' ').trim();
}

// Extrahera [CART:id1,id2]-IDs från svaret (utan att ta bort taggen — frontend gör det)
function extractCartIds(reply) {
  const m = reply.match(/\[CART:([^\]]+)\]/i);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim()).filter(Boolean);
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
    return new Response(JSON.stringify({ comment }), {
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
    
    // Extrahera chips från svaret (sista raden CHIPS:[...])
    let reply = rawReply;
    let chips = [];
    const chipsMatch = rawReply.match(/\nCHIPS:(\[.*?\])\s*$/s);
    if (chipsMatch) {
      try { chips = JSON.parse(chipsMatch[1]); } catch {}
      reply = rawReply.replace(/\nCHIPS:\[.*?\]\s*$/s, "").trim();
    }

    // Extrahera [FORWARD:type] från Svens svar — frontend renderar då en knapp
    const forwardTag = extractForwardTag(reply);
    if (forwardTag) {
      reply = stripForwardTag(reply);  // Ta bort taggen från text som visas
    }
    // [CART:...]-taggen lämnas kvar i texten — frontend hanterar den separat
    const cartIds = extractCartIds(reply);

    // Säkerhetsnät: regex-detektor flaggar löften som Sven gjorde UTAN att
    // tagga [FORWARD]. Tyst loggning till sven_logs.promise_detected.
    // Inga mail — kanban är notiskanalen.
    const detectedPromise = detectPromise(reply);
    const promiseDetected = !!detectedPromise && !forwardTag;
    if (promiseDetected) {
      console.warn('SVEN_PROMISE_UNTAGGED:', { phrase: detectedPromise, sessionId });
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
