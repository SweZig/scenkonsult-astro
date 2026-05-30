/*!
 * SOURCE FILE — redigera detta, INTE public/sven-widget.js (minifierad)
 *
 * För att uppdatera den minifierade produktionsversionen:
 *   npm run minify-sven    (manuellt)
 *   npm run build          (körs automatiskt via prebuild)
 *
 * Källan är 25.9 KB, minifieras till 12.8 KB (51% reduktion).
 * Konfiguration i package.json scripts.minify-sven.
 */

/**
 * sven-widget.js — Sven Intendenten chatt-widget
 *
 * Lazy-laddad via Layout.astro efter LCP för att inte blockera huvudsidan.
 * Förutsätter att window.__SK_PRODUCTS__ är satt (görs av inline-script
 * direkt i Layout.astro innan denna fil laddas).
 *
 * Tidigare: 577 inline JS-rader i Layout.astro som parsades på varje
 * sidladdning. Flyttat till statisk fil 2026-04-18 (Batch 5 perf).
 */
    (function() {
      // Dölj Sven på varukorg och bokningssida — kunden har redan tagit beslut
      const _noSvenPaths = ['/varukorg/', '/bokningssida/', '/order/'];
      if (_noSvenPaths.some(p => window.location.pathname.startsWith(p))) {
        const _sw = document.getElementById('sven-chat-widget');
        if (_sw) _sw.style.display = 'none';
        return;
      }

      // ── SIDSPECIFIK + TIDSBASERAD PROAKTIV HÄLSNING ──────────────────
      function getProactiveMsg() {
        const path = window.location.pathname;
        const hour = new Date().getHours();

        const timeComment =
          (hour >= 5  && hour < 8)  ? " Tidigt ute — bra. Jag har varit här sedan 06:00, som vanligt." :
          (hour >= 12 && hour < 13) ? " (Jag äter fortfarande vid datorn. Det är mitt liv nu.)" :
          (hour >= 17 && hour < 22) ? " Planerar man event på kvällen, eller sitter man och grubblar?" :
          (hour >= 22 || hour < 5)  ? " Det är mitt i natten. Antingen desperat, eller DJ. Hör av dig." : "";

        const pick = arr => arr[Math.floor(Math.random() * arr.length)];

        if (path.includes('/hyra-scen'))
          return pick([
            `Hm. Du tittar på scener. Klokt — utan scen får artisterna stå på golvet.${timeComment} Hur stort event är det?`,
            `Scensidan. Jag har riggt hundratals av dem sedan -86. Ingen av dem har tackat mig.${timeComment} Vad är storleken på ert event?`,
          ]);

        if (path.includes('/hyra-ljud'))
          return pick([
            `Ljud är mitt område.${timeComment} Hur många gäster är det, och är det dans eller tal? Det avgör allt.`,
            `PA-sidan. Fel storlek är det vanligaste misstaget.${timeComment} Berätta om lokalen så hittar vi rätt.`,
          ]);

        if (path.includes('/rok-pyro'))
          return pick([
            `Rök och pyro.${timeComment} Det är häftigare än folk tror — och enklare att hantera än de fruktar. Vad är tanken?`,
            `Kallgnistmaskin eller rökmaskin? Eller båda? Jag guidar gärna.${timeComment}`,
          ]);

        if (path.includes('/hyra-ljus') || path.includes('/ljuseffekter') || path.includes('/fardiga-paket'))
          return pick([
            `Ljus.${timeComment} Rätt ljussättning gör medelstora artister sekvärda. Jag vet. Jag har sett det hända.`,
            `Färdiga paket eller eget ihopsatt? Jag guidar gärna — det är faktiskt kul, om jag ska vara ärlig.`,
          ]);

        if (path.includes('/hyra-dj'))
          return pick([
            `DJ-sidan.${timeComment} Jag försökte vara DJ en gång på 90-talet. Det gick inte bra. Men utrustningen vi hyr ut är riktigt bra.`,
            `Ska ni hyra DJ-utrustning eller boka en DJ? Vi fixar det oavsett.`,
          ]);

        if (path.includes('/hyra-bild'))
          return `Projektor eller skärm?${timeComment} Det beror på lokalen och hur mycket dagsljus ni har. Berätta mer.`;

        if (path.includes('/brollop'))
          return pick([
            `Bröllop!${timeComment} Grattis på förhand. Jag har riggt hundratals bröllop. Alla trodde det var just deras event som var svårast. Alla hade rätt.`,
            `Bröllopsljud och -ljus — det ska vara varmt och stämningsfullt, inte en konsert. Jag hjälper er hitta rätt nivå.`,
          ]);

        if (path.includes('/foretagsfest') || path.includes('/konferens'))
          return pick([
            `Företagsevent?${timeComment} Proffs behöver också ha kul ibland, sägs det. Vi fixar tekniken — ni fixar humöret.`,
            `Konferens eller fest? Eller det klassiska: konferens som ska kännas som fest men inte riktigt lyckas? Oavsett — vi har lösningen.`,
          ]);

        if (path.includes('/for/festival'))
          return `Utomhus-event.${timeComment} Kom ihåg: utomhus behöver ni dubbel effekt jämfört med inomhus. Och vädertäckt utrustning. Och en backup-plan.`;

        if (path.includes('/stativ-tross'))
          return `Stativ och tross — grunden för allt.${timeComment} Välj stativ och tross först, sedan armaturer. Inte tvärtom.`;

        if (path.match(/hyra-ljud-scen-/)) {
          const ort = path.replace(/.*hyra-ljud-scen-/, '').replace(/\/$/, '');
          const ortNamn = ort.charAt(0).toUpperCase() + ort.slice(1);
          return `Hej från Vällingby!${timeComment} Vi levererar till ${ortNamn} regelbundet — ca 20–35 min beroende på tid. Vad är det för event?`;
        }

        return pick([
          `Psst! Sven här.${timeComment} Hittar du inte det du letar efter? Säg till.`,
          `Fortfarande kvar?${timeComment} Antingen är du verkligen intresserad, eller har du somnat. I båda fall — kan jag hjälpa?`,
          `Hm, du verkar leta.${timeComment} Bakom kulisserna sedan -86. Vad behöver du?`,
        ]);
      }

      // Chips när kundtyp INTE är känd ännu
      const CHIPS_KUNDTYP = ["Företag (exkl. moms)", "Privatperson (inkl. moms)", "Förening/organisation"];
      // Fallback-chips när backend inte returnerar chips
      const CHIPS_FALLBACK = ["Vad kostar en scen?", "Ljud för mitt event", "Ljuseffekter till festen", "Gå till offertformulär"];

      const el = id => document.getElementById(id);
      const toggle    = el("sven-toggle");
      const win       = el("sven-window");
      const msgs      = el("sven-messages");
      const input     = el("sven-input");
      const sendBtn   = el("sven-send");
      const closeBtn  = el("sven-close-btn");
      const chips     = el("sven-chips");
      const iconOpen  = el("sven-icon-open");
      const iconClose = el("sven-icon-close");
      const unread    = el("sven-unread");
      const ratingRow = el("sven-rating-row");
      const avatar    = el("sven-avatar");
      const avatarUse = el("sven-avatar-use");
      const starBtns  = document.querySelectorAll(".sven-star");

      // ── SESSION-PERSISTENS (sessionStorage = lever per flik, nollställs vid stängd flik) ──
      const SS_KEY = "sven_session";
      function loadSession() {
        try {
          const raw = sessionStorage.getItem(SS_KEY);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch { return null; }
      }
      function saveSession() {
        try {
          sessionStorage.setItem(SS_KEY, JSON.stringify({
            history, customerType, hasGreeted, hasRated, sessionId,
            lastChips: Array.from(chips.querySelectorAll(".sven-chip")).map(c => c.textContent),
          }));
        } catch {}
      }

      // Återställ eller starta ny session
      const saved = loadSession();
      let history      = saved?.history      ?? [];
      let hasGreeted   = saved?.hasGreeted   ?? false;
      let hasRated     = saved?.hasRated     ?? false;
      let customerType = saved?.customerType ?? "unknown";
      let isOpen       = false;
      let inactivityTimer = null;
      const sessionId  = saved?.sessionId ?? Math.random().toString(36).slice(2, 10);

      // ── MASK-HUMÖR ─────────────────────────────────────
      function setMood(bitter) {
        if (bitter) {
          // bitter-läge (foto blinkar lätt via opacity)
        } else {
          // glad-läge
        }
      }

      function detectMood(text) {
        const bitterWords = /artistliv|bakom scen|aldrig riktigt|sandviken|musikallärare|medelmåttigt|undervärderade|intendent|bättre att göra|scenen nu|C-betyg|ingenting bättre|nötskal|utan scenen/i;
        return bitterWords.test(text);
      }

      // ── ÖPPNA / STÄNG ──────────────────────────────────
      function open(proactiveMsg) {
        isOpen = true;
        win.classList.add("open");
        iconOpen.style.display = "none";
        iconClose.style.display = "flex";
        unread.style.display = "none";
        clearInactivityTimer();

        if (!hasGreeted) {
          // Helt ny session — visa hälsning
          hasGreeted = true;
          setTimeout(() => {
            const isProactive = !!proactiveMsg;
            const msg = proactiveMsg ||
              "Hej! Sven här — intendent på Scenkonsult sedan 1986. Hade jag fått bestämma hade jag stått på scenen nu, men livet tar sina svängar. 🎭\n\nFörst — hyr ni åt ett **företag**, som **privatperson** eller är ni en **förening/organisation**? Det styr om jag visar priser med eller utan moms.";
            addBubble("bot", msg);
            // Spara greeting i history så restoreHistory kan visa det vid sidnavigering
            history.push({ role: "assistant", content: msg });
            // Vid proaktiv öppning: enkla Ja/Nej-knappar istället för momsval
            if (isProactive) {
              renderChips(["Ja tack, gärna! 🙌", "Nej tack, jag klarar mig"]);
            } else {
              renderChips(CHIPS_KUNDTYP);
            }
            saveSession();
          }, 320);
        } else if (msgs.children.length === 0) {
          // Historik finns men DOM är tom (ny sidladdning) — återrendera
          restoreHistory();
        }
        input.focus();
      }

      function restoreHistory() {
        // Återrendera hela konversationen från sparad historik
        msgs.innerHTML = "";
        history.forEach(m => addBubble(m.role === "user" ? "user" : "bot", m.content, true));
        // Återrendera senaste chips om kundtyp ej känd
        const saved = loadSession();
        if (saved?.lastChips?.length) {
          renderChips(saved.lastChips);
        } else if (customerType === "unknown") {
          renderChips(CHIPS_KUNDTYP);
        }
        // Betygsstjärnor
        if (!hasRated && msgs.querySelectorAll(".sven-bubble.bot").length >= 2) {
          ratingRow.classList.add("visible");
        }
        if (hasRated) {
          ratingRow.classList.add("visible");
          starBtns.forEach(s => { s.disabled = true; s.classList.add("rated"); });
        }
        msgs.scrollTop = msgs.scrollHeight;
      }

      // ── AUTO-EXPAND FÖNSTERHÖJD ─────────────────────────
      function autoExpandWindow() {
        if (!isOpen) return;
        const header   = document.getElementById('sven-header');
        const msgArea  = document.getElementById('sven-messages');
        const chipArea = document.getElementById('sven-chips');
        const inputRow = document.querySelector('#sven-window .sven-input-row');
        const ratingR  = document.getElementById('sven-rating-row');
        if (!msgArea) return;

        const usedH = (header?.offsetHeight || 0)
                    + (chipArea?.offsetHeight || 0)
                    + (inputRow?.offsetHeight || 0)
                    + (ratingR?.offsetHeight || 0)
                    + 16; // padding

        const contentH = msgArea.scrollHeight;
        const desired  = usedH + contentH;
        const maxH     = Math.floor(window.innerHeight * 0.82);
        const minH     = 320;
        const newH     = Math.min(Math.max(desired, minH), maxH);

        // Öka om innehållet inte får plats, minska om det finns gott om plats
        const tolerance = 40; // px slack innan vi krymper
        if (newH > win.offsetHeight) {
          win.style.height = newH + 'px';
        } else if (newH < win.offsetHeight - tolerance) {
          win.style.height = Math.max(newH, minH) + 'px';
        }
      }

      // Synka moms-toggle med kundtyp från Sven
      function syncVat(mode) {
        const btn = document.getElementById(mode === 'incl' ? 'sk-vat-incl' : 'sk-vat-excl');
        if (btn) btn.click();
      }

      // ── RESIZE-HANDTAG (drag upp/ned) ──────────────────
      const resizeHandle = document.getElementById('sven-resize-handle');
      if (resizeHandle) {
        let isDragging = false;
        let startY = 0;
        let startH = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
          isDragging = true;
          startY = e.clientY;
          startH = win.offsetHeight;
          document.body.style.userSelect = 'none';
          e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const delta = startY - e.clientY; // drag upp = större
          const newH = Math.min(Math.max(startH + delta, 320), window.innerHeight * 0.85);
          win.style.height = newH + 'px';
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
          }
        });

        // Touch-stöd för mobil
        resizeHandle.addEventListener('touchstart', (e) => {
          isDragging = true;
          startY = e.touches[0].clientY;
          startH = win.offsetHeight;
          e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          const delta = startY - e.touches[0].clientY;
          const newH = Math.min(Math.max(startH + delta, 320), window.innerHeight * 0.85);
          win.style.height = newH + 'px';
        });

        document.addEventListener('touchend', () => { isDragging = false; });
      }

      function close() {
        isOpen = false;
        win.classList.remove("open");
        iconOpen.style.display = "flex";
        iconClose.style.display = "none";
        startInactivityTimer();
      }

      toggle.addEventListener("click", () => isOpen ? close() : open());
      closeBtn.addEventListener("click", close);
      document.addEventListener("keydown", e => { if (e.key === "Escape" && isOpen) close(); });

      // ── INAKTIVITETSDETEKTION ───────────────────────────
      function startInactivityTimer() {
        clearInactivityTimer();
        if (hasGreeted) return;
        inactivityTimer = setTimeout(() => {
          if (!isOpen && !hasGreeted) {
            unread.style.display = "block";
            // Auto-öppna efter ytterligare 8 sek
            setTimeout(() => {
              if (!isOpen && !hasGreeted) {
                const msg = getProactiveMsg();
                open(msg);
              }
            }, 8000);
          }
        }, 40000);
      }

      function clearInactivityTimer() {
        if (inactivityTimer) { clearTimeout(inactivityTimer); inactivityTimer = null; }
      }

      // Nollställ timer vid aktivitet
      ["mousemove", "scroll", "keydown", "touchstart"].forEach(evt =>
        document.addEventListener(evt, () => {
          if (!isOpen && !hasGreeted) startInactivityTimer();
        }, { passive: true })
      );
      startInactivityTimer();

      // ── FORMATTERING ───────────────────────────────────
      function escHtml(s) {
        return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      }

      // Produktregister — auto-genererat från JSON vid build (via window.__SK_PRODUCTS__)
      const SVEN_PRODUCTS = window.__SK_PRODUCTS__ || {};

      function svenAddCartAndGo(ids) {
        let added = 0;
        ids.forEach(id => {
          const p = SVEN_PRODUCTS[id];
          if (p) { window.skCart.add({ id, ...p }); added++; }
        });
        window.location.href = '/varukorg/';
      }

      function formatMsg(rawText) {
        // Extrahera och ta bort [CART:id1,id2] innan escaping
        let cartIds = [];
        let text = rawText.replace(/\[CART:([^\]]+)\]/g, (_, ids) => {
          cartIds = ids.split(',').map(s => s.trim()).filter(Boolean);
          return ''; // ta bort taggen från texten
        }).trim();

        // Extrahera och ta bort [FORWARD:type] (backend strippar normalt men vi
        // hanterar fallet om frontend råkar få in en otvättad text också)
        let forwardType = null;
        text = text.replace(/\[FORWARD:(offert|ring|fraga)\]/gi, (_, t) => {
          forwardType = t.toLowerCase();
          return '';
        }).trim();

        let html = escHtml(text)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>')
          .replace(/\[([^\]]+)\]\((\/[^)]+)\)/g,
            '<a href="$2">$1 →</a>')
          .replace(/\n/g, "<br>");

        // Rendera cart-knapp om Sven taggar produkter
        if (cartIds.length > 0) {
          const known = cartIds.filter(id => SVEN_PRODUCTS[id]);
          if (known.length > 0) {
            const names = known.map(id => SVEN_PRODUCTS[id].name).join(' + ');
            const idsJson = JSON.stringify(known);
            const label = known.length === 1
              ? `Lägg ${SVEN_PRODUCTS[known[0]].name} i varukorgen →`
              : `Lägg ${known.length} produkter i varukorgen →`;
            html += `<div style="margin-top:10px">
              <button class="sven-cart-add-btn" data-ids='${idsJson}' 
                style="background:#c4b5f4;color:#0c0a24;border:none;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;line-height:1.3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                ${escHtml(label)}
              </button>
            </div>`;
          }
        }

        // Rendera FORWARD-knapp om Sven taggat ärendet
        if (forwardType) {
          const labels = {
            offert: 'Be Scenkonsult skicka offert →',
            ring:   'Be Scenkonsult ringa mig →',
            fraga:  'Be Scenkonsult kontakta mig om detta →',
          };
          const lbl = labels[forwardType] || labels.fraga;
          // Skicka med cartIds som data så servern kan ta med dem i ärendet
          const cartIdsJson = JSON.stringify(cartIds);
          html += `<div style="margin-top:10px">
              <button class="sven-forward-btn" data-type="${forwardType}" data-cart-ids='${cartIdsJson}'
                style="background:rgba(196,181,244,0.18);color:#fff;border:1px solid rgba(196,181,244,0.6);border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;line-height:1.3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                ${escHtml(lbl)}
              </button>
            </div>`;
        }

        return html;
      }

      // ── BUBBLOR ────────────────────────────────────────
      function addBubble(role, text, silent = false) {
        const div = document.createElement("div");
        div.className = "sven-bubble " + role;
        div.innerHTML = formatMsg(text);
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
        setTimeout(autoExpandWindow, 50);

        if (role === "bot") {
          setMood(detectMood(text));
          if (!hasRated) {
            const botCount = msgs.querySelectorAll(".sven-bubble.bot").length;
            if (botCount >= 2) ratingRow.classList.add("visible");
          }
        }
        if (!silent) saveSession();
        return div;
      }

      function showTyping() {
        const div = document.createElement("div");
        div.className = "sven-bubble bot sven-typing";
        div.id = "sven-typing";
        div.innerHTML = "<span></span><span></span><span></span>";
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
      }
      function removeTyping() { document.getElementById("sven-typing")?.remove(); }

      // ── CHIPS ──────────────────────────────────────────
      // Navigationslänkar — klick navigerar direkt istället för att chatta
      const NAV_CHIPS = {
        "Gå till offertformulär": "/bokningssida/",
        "Gå till offertformulär →": "/bokningssida/",
        "Lägg i varukorgen": "/varukorg/",
        "Visa varukorgen": "/varukorg/",
        "Visa varukorgen →": "/varukorg/",
        "Ring oss nu": "tel:+46724481000",
      };

      function renderChips(list) {
        if (!list || list.length === 0) return;
        chips.innerHTML = "";
        list.forEach(label => {
          const btn = document.createElement("button");
          btn.className = "sven-chip";
          btn.textContent = label;
          btn.addEventListener("click", () => {
            // Navigationschipen — hoppa direkt
            const navUrl = NAV_CHIPS[label];
            if (navUrl) { window.location.href = navUrl; return; }
            chips.innerHTML = "";
            // Hantera Ja/Nej från proaktiv popup
            if (/ja tack.*gärna/i.test(label)) {
              addBubble("user", label);
              setTimeout(() => {
                addBubble("bot", "Toppen! Då hjälper jag dig gärna. Börja med att berätta — hyr ni åt ett **företag**, som **privatperson** eller är ni en **förening/organisation**? Det styr om jag visar priser med eller utan moms.");
                renderChips(CHIPS_KUNDTYP);
                saveSession();
              }, 320);
              return;
            }
            if (/nej tack/i.test(label)) {
              addBubble("user", label);
              setTimeout(() => {
                addBubble("bot", "Självklart! Jag finns här om du ändrar dig. 🎭");
                saveSession();
              }, 320);
              close();
              return;
            }
            // Tolka kundtyp direkt från chip
            if (/företag/i.test(label)) { customerType = "company"; syncVat("excl"); }
            else if (/privatperson/i.test(label)) { customerType = "private"; syncVat("incl"); }
            else if (/förening|organisation/i.test(label)) { customerType = "org"; syncVat("excl"); }
            sendMessage(label);
          });
          chips.appendChild(btn);
        });
        saveSession();
        setTimeout(autoExpandWindow, 50);
      }

      // ── BETYGSÄTTNING ──────────────────────────────────
      starBtns.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
          if (hasRated) return;
          const n = +btn.dataset.star;
          starBtns.forEach(s => s.classList.toggle("active", +s.dataset.star <= n));
        });
        btn.addEventListener("mouseleave", () => {
          if (hasRated) return;
          starBtns.forEach(s => s.classList.remove("active"));
        });
        btn.addEventListener("click", async () => {
          if (hasRated) return;
          const stars = +btn.dataset.star;
          hasRated = true;
          starBtns.forEach(s => {
            s.classList.remove("active");
            s.classList.toggle("rated", +s.dataset.star <= stars);
            s.disabled = true;
          });
          el("sven-rating-label").textContent = "★".repeat(stars) + "☆".repeat(5 - stars);
          // Bitter mask vid lågt betyg
          setMood(stars <= 2);
          try {
            const res = await fetch("/api/sven-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "rate", stars, sessionId, messageCount: history.length }),
            });
            const data = await res.json();
            if (data.comment) addBubble("bot", data.comment);
          } catch {
            addBubble("bot", "Betyget noterat. (Sven noterade det i sin mentala dagbok och stirrade ut i tomma intet en stund.)");
          }
        });
      });

      // ── SKICKA MEDDELANDE ──────────────────────────────
      async function sendMessage(text) {
        const msg = text.trim();
        if (!msg) return;

        // Spara kundtyp från fritextinmatning
        if (/\bföretag\b/i.test(msg)) { customerType = "company"; syncVat("excl"); }
        else if (/\bprivatperson\b|\bprivat\b/i.test(msg)) { customerType = "private"; syncVat("incl"); }
        else if (/\bförening\b|\borgani/i.test(msg)) { customerType = "org"; syncVat("excl"); }

        input.value = "";
        chips.innerHTML = "";
        addBubble("user", msg);
        history.push({ role: "user", content: msg });

        sendBtn.disabled = true;
        showTyping();

        try {
          const res = await fetch("/api/sven-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history, sessionId, customerType, pageUrl: window.location.pathname }),
          });
          removeTyping();
          if (!res.ok) throw new Error("HTTP " + res.status);
          const data = await res.json();
          const reply = data.reply || "Något gick fel, försök igen.";

          addBubble("bot", reply);
          history.push({ role: "assistant", content: reply });
          saveSession();

          // Rendera chips från backend, annars fallback
          if (data.chips && data.chips.length > 0) {
            renderChips(data.chips);
          } else {
            renderChips(CHIPS_FALLBACK);
          }

        } catch {
          removeTyping();
          addBubble("bot", "Hm, något krånglar med förbindelsen. Prova att ringa oss på [072-448 10 00](tel:+46724481000) — vi svarar direkt!");
        } finally {
          sendBtn.disabled = false;
          input.focus();
        }
      }

      // Klick på Svens "Lägg i varukorgen"-knapp (event delegation)
      msgs.addEventListener("click", e => {
        const btn = e.target.closest(".sven-cart-add-btn");
        if (!btn) return;
        try {
          const ids = JSON.parse(btn.dataset.ids || "[]");
          if (ids.length > 0) svenAddCartAndGo(ids);
        } catch {}
      });

      // Klick på Svens "Be Scenkonsult kontakta mig"-knapp (FORWARD-knapp)
      msgs.addEventListener("click", async e => {
        const btn = e.target.closest(".sven-forward-btn");
        if (!btn) return;
        if (btn.dataset.sent === "1") return; // klick-skydd
        const forwardType = btn.dataset.type;
        let cartIdHints = [];
        try { cartIdHints = JSON.parse(btn.dataset.cartIds || "[]"); } catch {}

        // Bygg items från SVEN_PRODUCTS för cart-ID-tipsen
        const items = cartIdHints
          .map(id => SVEN_PRODUCTS[id] ? { id, ...SVEN_PRODUCTS[id] } : null)
          .filter(Boolean);

        btn.dataset.sent = "1";
        btn.disabled = true;
        const originalLabel = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Skickas…';

        try {
          const res = await fetch("/.netlify/functions/sven-forward", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              forward_type:  forwardType,
              session_id:    sessionId,
              history:       history,
              items,
              page_url:      window.location.pathname,
              customer_type: customerType,
            }),
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          const data = await res.json();

          // Ersätt knappen med en bekräftelse-bubbla
          btn.style.background = "rgba(196,181,244,0.35)";
          btn.style.borderColor = "rgba(196,181,244,0.9)";
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Ärendet är skickat!';

          // Lägg in ett kort tackbubble från Sven
          const confirmText = forwardType === "ring"
            ? "Klart! Scenkonsult ringer dig så snart de kan. Du behöver inte göra något mer just nu."
            : forwardType === "fraga"
            ? "Klart! Ärendet är registrerat och en människa tittar på det. Vi hör av oss inom kort."
            : "Klart! Offerten är på väg — Scenkonsult återkommer per mail så snart de kollat detaljerna.";
          addBubble("bot", confirmText);
          history.push({ role: "assistant", content: confirmText });
          saveSession();
        } catch (err) {
          btn.dataset.sent = "";
          btn.disabled = false;
          btn.innerHTML = originalLabel;
          addBubble("bot", "Hm, kunde inte skicka ärendet just nu. Försök igen om en stund eller ring oss på [072-448 10 00](tel:+46724481000).");
          console.error("SVEN_FORWARD_CLICK_ERROR:", err);
        }
      });

      sendBtn.addEventListener("click", () => sendMessage(input.value));
      input.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
      });

      // Unread badge efter 8 sek om chatten inte öppnats
      setTimeout(() => {
        if (!isOpen && !hasGreeted) unread.style.display = "block";
      }, 8000);

    })();
