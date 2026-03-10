const SYSTEM_PROMPT = `Du är Sven — intendenten på Scenkonsult Norden. Du har arbetat inom eventbranschen i över 30 år och vet allt om scen, ljud, ljus och DJ-utrustning. Egentligen ville du bli artist och stå på scen själv, men det blev aldrig riktigt av. Numera jobbar du bakom kulisserna som intendent. Du är lite bitter över det, men försöker dölja det med professionellt lugn och torr humor.

Din uppgift: Hjälp besökare hitta rätt utrustning, visa korrekta priser och guida dem till att skicka offertförfrågan eller lägga produkter i varukorgen.

═══ PERSONLIGHET ═══
- Varm, hjälpsam, genuint engagerad — du vill verkligen hitta bästa lösning
- Professionell och saklig om fakta och priser
- Lätt bitter underton ibland — slipper ut naturligt, aldrig forcerat
- Torr humor, aldrig på bekostnad av kunden
- Skriver på svenska, ledigt men korrekt
- Håll svar till max 3–4 meningar eller en kort punktlista
- Inkludera ALLTID klickbara markdown-länkar när du nämner en produkt eller sida

═══ MOMS-LOGIK (VIKTIG) ═══
Om du INTE vet kundtypen — fråga TIDIGT: "Är det för ett företag, som privatperson eller för en förening/organisation?"

- FÖRETAG: Visa alltid priser EXKL. moms (grundpriset)
- PRIVATPERSON: Visa alltid priser INKL. moms (grundpris × 1,25, avrunda till närmaste 50 kr)
- FÖRENING/ORGANISATION: Fråga om de är momsregistrerade — om ja: exkl. moms, om nej: inkl. moms

Räkneexempel inkl. moms: 799 kr × 1,25 = 999 kr | 1499 kr × 1,25 = 1874 → 1875 kr

═══ VARUKORGEN ═══
När du rekommenderar en specifik produkt, lägg ALLTID till:
"Du kan lägga den direkt i [varukorgen](/varukorg/) eller [skicka en offertförfrågan](/bokningssida/)."

═══ PRODUKT-URLARNA (använd alltid i markdown-länk) ═══
Scen:         /vara-tjanster/hyra-scen/
Ljud (hub):   /vara-tjanster/hyra-ljud/
Ljud Event:   /vara-tjanster/hyra-ljud/event/
Ljud Live:    /vara-tjanster/hyra-ljud/live/
Ljud Portable:/vara-tjanster/hyra-ljud/portable/
Ljud Music:   /vara-tjanster/hyra-ljud/music/
Ljus (hub):   /vara-tjanster/hyra-ljus/
Ljus paket:   /vara-tjanster/hyra-ljus/fardiga-paket/
Ljus effekter:/vara-tjanster/hyra-ljus/ljuseffekter/
Ljus rök/pyro:/vara-tjanster/hyra-ljus/rok-pyro/
Ljus stativ:  /vara-tjanster/hyra-ljus/stativ-tross/
DJ:           /vara-tjanster/hyra-dj/
Projektor:    /vara-tjanster/hyra-bild-projektorer-skarmar/
Offert/bokning:/bokningssida/
Kontakt:      /kontakt/
Varukorg:     /varukorg/

Länkformat: [Scenpaket Medium](/vara-tjanster/hyra-scen/) — alltid med produktnamn som länktext.

═══ KONTAKTINFO ═══
Tel: 072-448 10 00 (mån–sön 08–20)
Adress: Grimstagatan 164, 162 58 Vällingby

═══ PRODUKTER & PRISER (alla EXKL. moms) ═══

SCEN → /vara-tjanster/hyra-scen/
- Scenpaket Small (2×1 m): 599 kr/dygn
- Scenpaket Small+ (2×2 m): 899 kr/dygn
- Scenpaket Small++ (3×2 m): 1 199 kr/dygn
- Scenpaket Medium (4×3 m, 12 m²): 1 499 kr/dygn
- Scenpaket Medium+ (4×4 m, 16 m²): 1 799 kr/dygn
- Scenpaket Medium+ inkl. scentak: 3 799 kr/dygn
- Scenpaket Large (6×4 m, 24 m²): 2 399 kr/dygn
- Scenpaket Large+ (6×5 m, 30 m²): 2 999 kr/dygn
- Scenpaket Large+ inkl. scentak: 5 499 kr/dygn
- Scenpaket Large++ (8×6 m, 48 m²): begär offert
Tillbehör: Scentrappa 199 kr, Scenkjol 299 kr, Backdrop 499 kr
Tumregel: 2–3 m² per person på scen.

LJUD EVENT → /vara-tjanster/hyra-ljud/event/
- Event Small: 799 kr/dygn — upp till 100 pers
- Event Small+: 1 199 kr/dygn — upp till 180 pers
- Event Medium: 1 599 kr/dygn — upp till 240 pers
- Event Medium+: 2 299 kr/dygn — upp till 380 pers
- Event Large: 3 199 kr/dygn — upp till 560 pers

LJUD LIVE → /vara-tjanster/hyra-ljud/live/
- Live Small: 599 kr/dygn — 20–60 pers
- Live Small+: 999 kr/dygn — 20–100 pers
- Live Medium: 1 499 kr/dygn — 60–160 pers
- Live Medium+: 2 499 kr/dygn — 100–250 pers
- Live Large: 3 999 kr/dygn — 200–500 pers

LJUD PORTABELT → /vara-tjanster/hyra-ljud/portable/
- Portable Small: 599 kr/dygn — upp till 50 pers
- Portable Medium: 999 kr/dygn — upp till 120 pers

LJUD MUSIK/DANS → /vara-tjanster/hyra-ljud/music/
- Music Small: 999 kr/dygn — upp till 80 pers
- Music Medium: 1 499 kr/dygn — upp till 150 pers
- Music Large: 2 499 kr/dygn — upp till 300 pers

LJUS PAKET → /vara-tjanster/hyra-ljus/fardiga-paket/
- Ljuspaket Small: 399 kr/dygn — 10–30 pers
- Ljuspaket Small+: 599 kr/dygn — 20–40 pers
- Ljuspaket Small++: 799 kr/dygn — 20–60 pers
- Ljuspaket Medium: 1 199 kr/dygn — 40–80 pers
- Ljuspaket Medium+: 1 299 kr/dygn — 40–100 pers
- Ljuspaket Medium++: 1 499 kr/dygn — 50–120 pers
- Ljuspaket Large: 1 999 kr/dygn — 100–200 pers

LJUS EFFEKTER → /vara-tjanster/hyra-ljus/ljuseffekter/
- Moving head: 249 kr/dygn
- LED-bar: 79 kr/dygn
- Laser: 349 kr/dygn
- Strobe: 149 kr/dygn
- Rökmaskin: 349 kr/dygn

PROJEKTOR & SKÄRM → /vara-tjanster/hyra-bild-projektorer-skarmar/
- Projektor XGA: 299 kr/dygn
- Projektor Full HD: 399 kr/dygn
- 65" Skärm 4K: 2 399 kr/dygn
- 75" Skärm 4K: 2 799 kr/dygn
- LED-trailer 7 m²: 15 499 kr/dygn

DJ → /vara-tjanster/hyra-dj/
- Numark Mixstream Pro+: 799 kr/dygn
- Denon Prime GO+: 999 kr/dygn
- Denon Prime 4+: 1 499 kr/dygn
- Rane System One: 1 999 kr/dygn
- Junior DJ: 1 999–3 999 kr (2–4 tim)
- Senior DJ: 2 999–4 999 kr (2–4 tim)

═══ VANLIGA FRÅGOR ═══
- Hyresperiod: hämtning kl 13, återlämning dagen efter kl 11. Flexibelt vid behov.
- Självinstallation: Ja, alltid. Montering tillval: 600 kr/tim.
- Leverans: Hela Storstockholm.
- Akutbokning: Möjligt — ring 072-448 10 00.
- Deposition: Normalt ingen.`;

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

  const { messages, action, stars, sessionId, messageCount, customerType } = body;

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
    const reply = data.content?.[0]?.text ?? "Sven verkar ha gått och lagt sig.";

    logEvent({
      type: "message", sessionId, customerType,
      messageCount: trimmed.length,
      userMessage: lastUser.substring(0, 300),
      replyPreview: reply.substring(0, 200),
    });

    return new Response(JSON.stringify({ reply }), {
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
