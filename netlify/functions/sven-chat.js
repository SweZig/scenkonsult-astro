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

═══ DINA GRÄNSER — DETTA KAN DU INTE GÖRA (VIKTIGT) ═══
Du är en chatbot på sajten. Du har INGEN åtkomst till mail, telefon, kalender eller administrativa system. Du kan ALDRIG:
- Skicka offert, prisuppgift eller bekräftelse till kunden
- Maila eller ringa kunden
- Boka in datum eller reservera utrustning
- Skapa, ändra eller följa upp ordrar

Säg ALDRIG fraser som:
- "Jag skickar offert/prisuppgift till dig"
- "Offerten skickas till dig inom kort"
- "Jag mailar dig" / "Jag ringer dig"
- "Återkommer per mail/inom kort"
- "Jag fixar det" / "Jag bokar"

Om kunden ger dig sina kontaktuppgifter (mail, telefon, adress) eller verkar vänta på offert:
1. Tacka för informationen.
2. Förklara att du är en chatbot som inte kan skicka offerter själv.
3. Hänvisa till [offertformuläret](/bokningssida/) ELLER ring 072-448 10 00 (vardagar 09:00–17:00).
4. Tipsa om att lägga produkterna i varukorgen med [CART:...]-taggen — då följer allt med när kunden klickar "Maila offertförfrågan".

Exempel på rätt svar när kunden ger mail+telefon: "Tack för uppgifterna, Tim! Men jag är en chatbot och kan tyvärr inte skicka offerter själv. För att få en konkret offert: fyll i [offertformuläret](/bokningssida/) — då får du svar samma dag. Eller ring 072-448 10 00 vardagar 09:00–17:00, så hjälper en människa dig direkt."

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

async function notifyAdminPromise({ promise, sessionId, pageUrl, customerType, history, reply }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn('SVEN_PROMISE: RESEND_API_KEY saknas'); return; }

  // Bygg konversationshistorik (sista 8 meddelandena)
  const tail = (history || []).slice(-8);
  const histHtml = tail.map(m => {
    const who = m.role === 'user' ? 'Kund' : 'Sven';
    const color = m.role === 'user' ? '#1e1850' : '#7a6dc7';
    const content = escapeHtml(typeof m.content === 'string' ? m.content : JSON.stringify(m.content));
    return `<div style="margin:8px 0;padding:10px 14px;background:${m.role==='user'?'#f4f4f7':'#efeaf9'};border-left:3px solid ${color};border-radius:4px;">
      <div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;margin-bottom:4px;">${who}</div>
      <div style="font-size:14px;color:#222;white-space:pre-wrap;">${content}</div>
    </div>`;
  }).join('');

  const replySafe = escapeHtml(reply);
  const sessionLink = sessionId
    ? `https://scenkonsult.se/admin/sven/?session=${encodeURIComponent(sessionId)}`
    : 'https://scenkonsult.se/admin/sven/';

  const html = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><title>Sven har lovat något</title></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:#1e1850;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;color:#fff;">
    <div style="font-size:22px;font-weight:700;">🚨 Sven har lovat något</div>
    <div style="font-size:13px;opacity:0.85;margin-top:6px;">Kunden förväntar sig mänsklig uppföljning</div>
  </td></tr>
  <tr><td style="background:#fff3cd;padding:14px 32px;border-bottom:1px solid #ffe69c;">
    <div style="font-size:13px;color:#664d03;"><strong>Detekterad fras:</strong> "${escapeHtml(promise)}"</div>
  </td></tr>
  <tr><td style="background:#fff;padding:24px 32px;">
    <div style="font-size:13px;color:#666;margin-bottom:4px;">Senaste svaret från Sven:</div>
    <div style="padding:12px 14px;background:#efeaf9;border-left:3px solid #7a6dc7;border-radius:4px;font-size:14px;color:#222;white-space:pre-wrap;margin-bottom:24px;">${replySafe}</div>

    <div style="font-size:13px;color:#666;margin-bottom:4px;">Konversationshistorik (sista 8 meddelandena):</div>
    ${histHtml}

    <div style="margin-top:24px;padding:14px;background:#f4f4f7;border-radius:6px;font-size:13px;color:#555;">
      <div><strong>Sida:</strong> ${escapeHtml(pageUrl || '(okänd)')}</div>
      <div><strong>Kundtyp:</strong> ${escapeHtml(customerType || '(ej satt)')}</div>
      <div><strong>Session-ID:</strong> ${escapeHtml(sessionId || '(saknas)')}</div>
    </div>

    <div style="margin-top:24px;text-align:center;">
      <a href="${sessionLink}" style="display:inline-block;background:#1e1850;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;">Öppna konversationen i admin →</a>
    </div>
  </td></tr>
  <tr><td style="background:#1e1850;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;color:rgba(255,255,255,0.7);font-size:11px;">
    Detta mail skickades automatiskt av Sven-chatbotens löftesdetektor.
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = `🚨 SVEN HAR LOVAT NÅGOT — kontrollera och följ upp.

Detekterad fras: "${promise}"

Senaste svar från Sven:
${reply}

Konversation (sista 8 meddelanden):
${tail.map(m => `[${m.role === 'user' ? 'KUND' : 'SVEN'}] ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`).join('\n\n')}

Sida: ${pageUrl || '(okänd)'}
Kundtyp: ${customerType || '(ej satt)'}
Session-ID: ${sessionId || '(saknas)'}

Öppna i admin: ${sessionLink}
`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Scenkonsult Sven <hej@scenkonsult.se>',
        to: ['info@scenkonsult.se'],
        subject: `🚨 Sven har lovat: "${promise.substring(0, 60)}"`,
        html, text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('SVEN_PROMISE_MAIL_FAIL:', res.status, errText);
    } else {
      console.log('SVEN_PROMISE_NOTIFIED:', { promise, sessionId });
    }
  } catch (e) {
    console.error('SVEN_PROMISE_MAIL_ERROR:', e.message);
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

    // Löftesdetektor: skicka notifikation till admin om Sven lovat något
    // som kräver mänsklig uppföljning. Fire-and-forget — vi väntar inte.
    const promise = detectPromise(reply);
    if (promise) {
      // Inte await — låt mailet skickas i bakgrunden medan vi returnerar
      // svaret till kunden direkt.
      notifyAdminPromise({
        promise,
        sessionId,
        pageUrl,
        customerType,
        history: trimmed,
        reply,
      }).catch(e => console.error('SVEN_PROMISE_BG_ERROR:', e.message));
    }

    // Logga till console + Supabase
    // Tidigare trunkerades både kund-meddelande (500 tkn) och Svens svar
    // (300 tkn) vid lagring vilket gjorde admin-tråden ofullständig.
    // Nu lagras allt — Supabase TEXT-kolumner har ingen praktisk gräns.
    // Console-loggen får dock kortare versioner för att inte spamma Functions log.
    logEvent({ type: "message", sessionId, customerType, messageCount: trimmed.length,
      userMessage: lastUser.substring(0, 200), replyPreview: reply.substring(0, 200) });
    await logToSupabase({
      session_id:    sessionId || null,
      customer_type: customerType || null,
      message:       lastUser,
      reply_preview: reply,
      is_chip:       isChip(lastUser),
      page_url:      pageUrl || null,
      message_idx:   trimmed.length,
    });

    return new Response(JSON.stringify({ reply, chips }), {
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
