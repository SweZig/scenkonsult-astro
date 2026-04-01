/* empty css                                 */
import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Qdf46Cx6.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const orter = [
    "V\xE4llingby",
    "Bromma",
    "Sp\xE5nga",
    "J\xE4rf\xE4lla",
    "Kista",
    "Solna",
    "Sundbyberg",
    "Sollentuna",
    "Upplands V\xE4sby",
    "M\xE4rsta",
    "Sigtuna",
    "Vallentuna",
    "T\xE4by",
    "Danderyd",
    "Liding\xF6",
    "\xD6stermalm",
    "Vasastan",
    "Kungsholmen",
    "S\xF6dermalm",
    "H\xE4gersten",
    "Sk\xE4rholmen",
    "Nacka",
    "V\xE4rmd\xF6",
    "\xD6ster\xE5ker",
    "Vaxholm",
    "Eker\xF6",
    "Huddinge",
    "Botkyrka",
    "Salem",
    "Nykvarn",
    "S\xF6dert\xE4lje",
    "Haninge",
    "Tyres\xF6",
    "Nyn\xE4shamn"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Kontakt & Hitta till oss | Scenkonsult \u2013 Hyra Scen, Ljud & Ljus Stockholm", "description": "Kontakta Scenkonsult f\xF6r offert eller bokning. Vi h\xE5ller till p\xE5 Grimstagatan 164, V\xE4llingby. Leverans i hela Storstockholm. Tel: 072-448 10 00." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14" style="padding-top:calc(var(--nav-offset,166px) + 2.5rem)"> <nav class="text-sm text-gray-400 mb-8"> <a href="/" class="hover:text-gray-300">Hem</a> <span class="mx-2">/</span> <span class="text-white">Kontakt</span> </nav> <h1 class="text-4xl font-extrabold text-white mb-3" style="font-family:'DM Serif Display',serif">Kontakta oss</h1> <p class="text-gray-400 text-lg mb-10">Vi svarar vardagar 09:00–17:00. Jour kvällar och helger gäller enbart för pågående uthyrningar.</p> <!-- Kontaktinfo + Formulär --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 lg:items-stretch"> <!-- Vänster: info --> <div class="flex flex-col gap-5 h-full"> <div class="rounded-2xl p-6 space-y-4 flex-1" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <h2 class="text-white font-bold text-lg mb-2">Kontaktuppgifter</h2> <div class="flex items-start gap-3"> <span class="text-xl mt-0.5" style="color:#c4b5f4">📞</span> <div> <div class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Telefon & Jour</div> <a data-tel="MDcyNDQ4MTAwMA==" data-label="072-448 10 00" href="#tel" class="text-white font-semibold hover:underline" style="color:#c4b5f4;cursor:pointer"><noscript>072-448 10 00</noscript></a> <div class="text-gray-400 text-xs mt-0.5">Mån–Fre 09:00–17:00 · Jour vid pågående hyra</div> </div> </div> <div class="flex items-start gap-3"> <span class="text-xl mt-0.5" style="color:#c4b5f4">✉️</span> <div> <div class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">E-post</div> <a data-mail="aW5mb0BzY2Vua29uc3VsdC5zZQ==" data-label="info@scenkonsult.se" href="#mail" class="font-semibold hover:underline" style="color:#c4b5f4" style="cursor:pointer"><noscript>info@scenkonsult.se</noscript></a> </div> </div> <div class="flex items-start gap-3"> <span class="text-xl mt-0.5" style="color:#c4b5f4">📍</span> <div> <div class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Depå / Hämtningsadress</div> <div class="text-white font-semibold">Green Storage</div> <div class="text-gray-400 text-sm">Grimstagatan 164, 162 58 Vällingby</div> <a href="https://maps.google.com/?q=Grimstagatan+164+Vällingby" target="_blank" rel="noopener" class="text-xs mt-1 inline-block hover:underline" style="color:#c4b5f4">Öppna i Google Maps ↗</a> </div> </div> <div class="flex items-start gap-3"> <span class="text-xl mt-0.5" style="color:#c4b5f4">🏢</span> <div> <div class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Bolag</div> <div class="text-gray-400 text-sm">Scenkonsult Norden / Sigvardsson Consulting Group AB</div> </div> </div> </div> <!-- Sociala medier --> <div class="rounded-2xl p-5" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <h2 class="text-white font-bold mb-3">Följ oss</h2> <div class="flex gap-3"> ${[
    { label: "Facebook", href: "https://www.facebook.com/scenkonsult", icon: "f" },
    { label: "Instagram", href: "https://www.instagram.com/scenkonsult", icon: "ig" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/scenkonsult", icon: "in" }
  ].map((s) => renderTemplate`<a${addAttribute(s.href, "href")} target="_blank" rel="noopener" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1)"> ${s.label} </a>`)} </div> </div> <a href="/varukorg/" class="block text-center py-4 rounded-xl font-bold text-lg transition-colors" style="background:#c4b5f4;color:#0c0a24">
Lägg till i varukorg & begär offert →
</a> </div> <!-- Höger: formulär --> <div class="rounded-2xl p-6" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <h2 class="text-white font-bold text-lg mb-4">Skicka meddelande</h2> <p class="text-gray-400 text-sm mb-5">Beskriv ditt behov — vi svarar med ett konkret prisförslag.</p> <!-- Honeypot: dolt för riktiga användare --> <input type="text" id="k-website" name="website" style="display:none" tabindex="-1" autocomplete="off"> <div class="space-y-3"> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"> <div> <label class="block text-xs text-gray-400 mb-1">Typ</label> <select id="k-typ" class="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> <option>Privat</option> <option>Företag</option> </select> </div> <div> <label class="block text-xs text-gray-400 mb-1">Antal gäster</label> <input id="k-gaster" type="number" placeholder="ex. 150" class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> </div> </div> <div> <label class="block text-xs text-gray-400 mb-1">Namn *</label> <input id="k-namn" type="text" placeholder="Förnamn Efternamn" class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> </div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"> <div> <label class="block text-xs text-gray-400 mb-1">Telefon *</label> <input id="k-telefon" type="tel" placeholder="07X-XXX XX XX" class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> </div> <div> <label class="block text-xs text-gray-400 mb-1">E-post *</label> <input id="k-epost" type="email" placeholder="din@epost.se" class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> </div> </div> <div> <label class="block text-xs text-gray-400 mb-1">Datum för eventet</label> <input id="k-datum" type="date" class="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white;color-scheme:dark"> </div> <div> <label class="block text-xs text-gray-400 mb-1">Beskriv ditt behov *</label> <textarea id="k-meddelande" rows="4" placeholder="Typ av event, lokal, vad du behöver hyra..." class="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none resize-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"></textarea> </div> <div> <label class="block text-xs text-gray-400 mb-1">Var hittade du oss? (valfri)</label> <select id="k-hittade" class="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none" style="background:#0c0a24;border:1px solid rgba(255,255,255,0.15);color:white"> <option value="">Välj...</option> <option>Google</option> <option>Sociala medier</option> <option>Rekommendation</option> <option>Blocket</option> <option>Annat</option> </select> </div> <label class="send-copy-label"> <input type="checkbox" id="sendCopyCheck"> <span>Sänd en kopia till mig</span> </label> <button id="k-skicka" class="w-full py-3.5 rounded-xl font-bold text-lg transition-colors cursor-pointer" style="background:#c4b5f4;color:#0c0a24;border:none">
Skicka meddelande
</button> <p class="text-xs text-gray-600 text-center">Svarstid vardagar 09:00–17:00 · Jour vid pågående uthyrning</p> </div> </div> </div> <!-- Hitta till oss --> <section class="mb-14"> <h2 class="text-2xl font-bold text-white mb-2" style="font-family:'DM Serif Display',serif">Hitta till oss</h2> <p class="text-gray-400 mb-6">Vårt lager ligger i <strong class="text-white">Green Storage</strong> på Grimstagatan 164, 162 58 Vällingby — nära E4/E18 och Vällingby tunnelbanastation (gröna linjen).</p> <!-- Google Maps embed --> <div class="rounded-2xl overflow-hidden mb-6" style="height:360px;border:1px solid rgba(255,255,255,0.08)"> <iframe src="https://maps.google.com/maps?q=Scenkonsult+Grimstagatan+164+Vällingby&output=embed&hl=sv" width="100%" height="360" style="border:0;filter:grayscale(100%) contrast(1.1)" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Scenkonsult Norden – Grimstagatan 164, Vällingby"></iframe> </div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div class="rounded-xl p-4" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <div class="font-bold text-white mb-1">🚇 Tunnelbana</div> <div class="text-gray-400 text-sm">Station Vällingby (gröna linjen) · 5 min promenad</div> </div> <div class="rounded-xl p-4" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <div class="font-bold text-white mb-1">🚗 Bil</div> <div class="text-gray-400 text-sm">Grimstagatan 164 · Parkering på plats · Nära E4/E18</div> </div> <div class="rounded-xl p-4" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <div class="font-bold text-white mb-1">⏰ Hämtning</div> <div class="text-gray-400 text-sm">Tid bestäms vid bokning · Ring i förväg</div> </div> </div> </section> <!-- Google-recensioner --> <section class="mb-14"> <div class="flex items-center gap-3 mb-6"> <h2 class="text-2xl font-bold text-white" style="font-family:'DM Serif Display',serif">Vad kunderna säger</h2> <a href="https://www.google.com/maps/search/Scenkonsult+Vällingby" target="_blank" rel="noopener" class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors" style="background:#1e1850;border:1px solid rgba(255,255,255,0.1);color:rgba(196,181,244,0.9)"> <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.33 0 9.25-3.65 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path></svg>
5,0 · 3 recensioner
</a> <a href="/referenser/" class="ml-auto text-xs font-medium hover:underline" style="color:rgba(196,181,244,0.7)">
Fler recensioner & kundcase →
</a> </div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"> ${[
    {
      name: "Cecilia \xD6rnj\xE4ger",
      initials: "C\xD6",
      time: "F\xF6r 2 \xE5r sedan",
      text: "Varmt rekommenderat! B\xE4st n\xE4r det g\xE4ller. Professionella med en glimt i \xF6gat."
    },
    {
      name: "Charlotte Axelsson",
      initials: "CA",
      time: "F\xF6r ett \xE5r sedan",
      text: "DJ M\xE5ns gjorde kv\xE4llen till en succ\xE9 och ingen ville l\xE4mna dansgolvet! Superproffsigt och bra kommunikation hela v\xE4gen. Varmt rekommenderat!"
    },
    {
      name: "Charlotta Frennby",
      initials: "CF",
      time: "F\xF6r 2 \xE5r sedan",
      text: "Hyrde ljud f\xF6r en helg och det var toppen. V\xE4ldigt hj\xE4lpsamma och l\xE4tta att ha att g\xF6ra med."
    }
  ].map((r) => renderTemplate`<div class="rounded-2xl p-5 flex flex-col gap-3" style="background:#1e1850;border:1px solid rgba(255,255,255,0.08)"> <div class="flex items-center gap-3"> <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style="background:#c4b5f4;color:#0c0a24"> ${r.initials} </div> <div> <div class="text-white text-sm font-semibold leading-tight">${r.name}</div> <div class="text-gray-400 text-xs">${r.time}</div> </div> <!-- Google G --> <svg class="ml-auto flex-shrink-0" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.33 0 9.25-3.65 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path></svg> </div> <!-- 5 stjärnor --> <div class="flex gap-0.5"> ${[1, 2, 3, 4, 5].map(() => renderTemplate`<svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`)} </div> <p class="text-gray-400 text-sm leading-relaxed flex-1">${r.text}</p> </div>`)} </div> </section> <!-- Leveransområde --> <section> <h2 class="text-2xl font-bold text-white mb-2" style="font-family:'DM Serif Display',serif">Leveransområde</h2> <p class="text-gray-400 mb-6">Vi levererar och hämtar upp utrustning inom ca <strong class="text-white">4 mils radie</strong> från Vällingby — det täcker hela Storstockholm och angränsande kommuner. Längre transporter: kontakta oss för offert.</p> <div class="flex flex-wrap gap-2 mb-6"> ${orter.map((o) => renderTemplate`<span class="text-sm px-3 py-1.5 rounded-full" style="background:#1e1850;border:1px solid rgba(196,181,244,0.2);color:rgba(196,181,244,0.8)"> ${o} </span>`)} </div> <p class="text-gray-400 text-sm">Leverans debiteras per tur-och-retur (559 kr med vanlig bil / 799 kr med släpvagn för skrymmande gods). Priser exkl. moms.</p> </section> </div>  ` })}`;
}, "/home/claude/scenkonsult-astro/src/pages/kontakt/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/kontakt/index.astro";
const $$url = "/kontakt/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
