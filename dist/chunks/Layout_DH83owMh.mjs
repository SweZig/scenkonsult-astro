import { c as createComponent, m as maybeRenderHead, r as renderTemplate, f as createAstro, e as addAttribute, d as defineScriptVars, b as renderComponent, g as renderSlot, a as renderHead, u as unescapeHTML } from './astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
/* empty css                         */
import 'clsx';

const $$InlineEditor = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Editor-knapp --><!-- Redigera-knappen är dold — aktivera via Alt+E eller ?edit=1 i URL -->${maybeRenderHead()}<div id="sk-editor-toggle" class="fixed bottom-6 right-6 z-50" style="display:none"> <button id="sk-edit-btn" class="bg-brand-orange hover:bg-brand-orange-light text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-orange/40 flex items-center gap-2 transition-all" title="Alt+E för att aktivera/avaktivera redigeringsläge"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg> <span id="sk-edit-label">Redigera sidan</span> </button> </div> <!-- Popup-overlay --> <div id="sk-overlay" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"> <div class="bg-[#0d1117] border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg"> <!-- Header --> <div class="flex items-center justify-between px-5 py-4 border-b border-white/10"> <h3 id="sk-popup-title" class="text-white font-bold text-base">Redigera</h3> <button id="sk-close" class="text-gray-400 hover:text-white transition-colors text-xl leading-none">×</button> </div> <!-- Body --> <div class="p-5 space-y-4"> <!-- Text editor --> <div id="sk-text-section" class="hidden"> <label class="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Text / Rubrik</label> <textarea id="sk-text-input" rows="4" class="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-brand-orange/60 placeholder-gray-600" placeholder="Ange ny text..."></textarea> </div> <!-- Pris editor --> <div id="sk-price-section" class="hidden"> <label class="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Pris (kr)</label> <input id="sk-price-input" type="number" min="0" step="1" class="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange/60" placeholder="T.ex. 599"> <p class="text-gray-400 text-xs mt-1.5">Ange priset utan decimaler. Suffix (kr/dygn) behålls automatiskt.</p> </div> <!-- Bild editor --> <div id="sk-image-section" class="hidden"> <label class="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Bildsökväg</label> <input id="sk-image-input" type="text" class="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange/60 font-mono" placeholder="/images/..."> <div id="sk-image-preview" class="mt-3 hidden"> <img id="sk-preview-img" src="" alt="" class="h-32 object-contain rounded-lg border border-white/10 bg-white/5 w-full"> </div> <!-- Bildbibliotek --> <div class="mt-3"> <label class="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Eller välj från biblioteket</label> <div id="sk-image-library" class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1"></div> </div> </div> <!-- Alt text (visas vid bildredigering) --> <div id="sk-alt-section" class="hidden"> <label class="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Alt-text (SEO)</label> <input id="sk-alt-input" type="text" class="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange/60" placeholder="Beskriv bilden för sökmotorer..."> </div> </div> <!-- Footer --> <div class="flex items-center justify-between px-5 py-4 border-t border-white/10"> <button id="sk-reset-field" class="text-gray-400 hover:text-red-400 text-sm transition-colors">Återställ ursprungsvärde</button> <div class="flex gap-3"> <button id="sk-cancel" class="border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Avbryt</button> <button id="sk-save" class="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors">Spara</button> </div> </div> </div> </div> <!-- Export panel --> <div id="sk-export-panel" class="hidden fixed bottom-20 right-6 z-50 bg-[#0d1117] border border-white/20 rounded-2xl shadow-2xl w-96 max-h-96 flex flex-col"> <div class="flex items-center justify-between px-4 py-3 border-b border-white/10"> <span class="text-white font-semibold text-sm">Exportera ändringar</span> <button id="sk-export-close" class="text-gray-400 hover:text-white text-lg leading-none">×</button> </div> <pre id="sk-export-json" class="flex-1 overflow-auto p-4 text-xs text-green-400 font-mono leading-relaxed"></pre> <div class="px-4 py-3 border-t border-white/10 flex gap-2"> <button id="sk-copy-json" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold flex-1 transition-colors">Kopiera JSON</button> <button id="sk-clear-edits" class="bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg text-xs font-semibold transition-colors">Rensa allt</button> </div> </div> `;
}, "/home/claude/scenkonsult-astro/src/components/InlineEditor.astro", void 0);

const $$Astro$1 = createAstro("https://scenkonsult.se");
const $$Tel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Tel;
  const { class: cls = "", label = "072-448 10 00", prefix = "" } = Astro2.props;
  const encoded = "MDcyNDQ4MTAwMA==";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(cls, "class")}${addAttribute(encoded, "data-tel")}${addAttribute(label, "data-label")}${addAttribute(prefix, "data-prefix")} href="#tel" aria-label="Ring oss" style="cursor:pointer"><noscript>${prefix}${label}</noscript></a>`;
}, "/home/claude/scenkonsult-astro/src/components/Tel.astro", void 0);

const metaTitle$3 = "Hyra Scen Stockholm – Scenpaket från 599 kr/dygn | Scenkonsult";
const metaDescription$3 = "Hyr scen i Stockholm från 599 kr/dygn. Scenpaket Small till XL+ med tak. Leverans och montering i hela Storstockholm. Sedan 1986. Ring 072-448 10 00!";
const intro$1 = "Vi har hyrt ut scener i Stockholm sedan 1986. Oavsett om du arrangerar en privat fest, ett företagsevent eller en utomhuskonsert har vi rätt scenpaket för dig – från kompakta podier på 4m² till kompletta XL-scener med tak på 48m². Alla scener levereras med halkfri yta och passar både inomhus- och utomhusbruk. Vi levererar till hela Storstockholm.";
const products$1 = [
	{
		id: "small",
		name: "Scenpaket Small",
		size: "4 m²",
		dimensions: "2×2 meter",
		heights: [
			"40 cm",
			"60 cm"
		],
		capacity: "1 person inkl. instrument",
		price: 599,
		priceNote: "per dygn",
		description: "Scenpodie som kan fungera som en liten scen eller podie på en större scen, t.ex. för att rigga upp ett trumset. Passar för 1 person inkl. instrument. Scentrapp och scenkjol hyrs separat.",
		transport: "tillägg",
		bulky: false,
		image: "/images/scen/pp_small.png",
		alt: "Scenpaket Small 4m² för 1 person",
		monteringMin: 20,
		artno: "SK-SCN-0001",
		slug: "scen-small"
	},
	{
		id: "small-plus",
		name: "Scenpaket Small+",
		size: "6 m²",
		dimensions: "2×3 eller 3×2 meter",
		heights: [
			"40 cm",
			"60 cm"
		],
		capacity: "1–3 personer inkl. instrument",
		price: 899,
		priceNote: "per dygn",
		description: "Scenpodie för 1–3 personer. Kan byggas vertikalt (2×3 m) eller horisontellt (3×2 m). Passar för duett eller trio med utrustning. Scentrapp och scenkjol hyrs separat.",
		transport: "tillägg",
		bulky: true,
		image: "/images/scen/pp_small_plus.png",
		alt: "Scenpaket Small+ 6m² för 1-3 personer",
		monteringMin: 25,
		artno: "SK-SCN-0002",
		slug: "scen-small-plus"
	},
	{
		id: "small-plusplus",
		name: "Scenpaket Small++",
		size: "8 m²",
		dimensions: "2×4 eller 3×2 meter",
		heights: [
			"40 cm",
			"60 cm"
		],
		capacity: "2–3 personer inkl. instrument",
		price: 1199,
		priceNote: "per dygn",
		description: "Scenpodie för 2–3 personer. Flexibla dimensioner – vertikalt 2×4 m eller horisontellt 3×2 m. Scentrapp och scenkjol hyrs separat.",
		transport: "tillägg",
		bulky: true,
		image: "/images/scen/pp_small_pp.png",
		alt: "Scenpaket Small++ 8m² för 2-3 personer",
		monteringMin: 30,
		artno: "SK-SCN-0003",
		slug: "scen-small-plusplus"
	},
	{
		id: "medium",
		name: "Scenpaket Medium",
		size: "10 m²",
		dimensions: "2×5 eller 5×2 meter",
		heights: [
			"40 cm",
			"60 cm"
		],
		capacity: "3–4 personer inkl. instrument",
		price: 1499,
		priceNote: "per dygn",
		description: "Scenpodie för 3–4 personer. Passar utmärkt för ett litet band eller talarpanel. Scentrapp och scenkjol hyrs separat.",
		transport: "tillägg",
		bulky: true,
		image: "/images/scen/pp_medium.png",
		alt: "Scenpaket Medium 10m² för 3-4 personer",
		monteringMin: 45,
		artno: "SK-SCN-0004",
		slug: "scen-medium"
	},
	{
		id: "medium-plus",
		name: "Scenpaket Medium+",
		size: "12 m²",
		dimensions: "2×6 eller 6×2 meter",
		heights: [
			"40 cm",
			"60 cm"
		],
		capacity: "4–5 personer inkl. instrument",
		price: 1799,
		priceNote: "per dygn",
		description: "Scenpodie för 4–5 personer. Bra storlek för band på 4–5 musiker eller konferensscen med talarpanel. Scentrapp och scenkjol hyrs separat.",
		transport: "tillägg",
		bulky: true,
		image: "/images/scen/pp_medium_plus.png",
		alt: "Scenpaket Medium+ 12m² för 4-5 personer",
		monteringMin: 60,
		artno: "SK-SCN-0005",
		slug: "scen-medium-plus"
	},
	{
		id: "medium-plus-tak",
		name: "Scenpaket Medium+ inkl. scentak",
		size: "12 m²",
		dimensions: "6×2 meter + tak",
		heights: [
			"Takhöjd 230 cm"
		],
		capacity: "4–5 personer inkl. instrument",
		price: 3799,
		priceNote: "per dygn – komplett paket",
		description: "Komplett paket: Scenpaket Medium+ (12m²) med scentak i aluminium med PVC-tak. Takhöjd 230 cm. Enkel montering på 20–30 min för 2 personer. Perfekt för utomhusevent.",
		transport: "tillägg",
		bulky: true,
		image: "/images/scen/pp_medium_plus_tak.png",
		alt: "Scenpaket Medium+ med scentak, 12m²",
		monteringMin: 90,
		artno: "SK-SCN-0006",
		slug: "scen-medium-plus-tak"
	},
	{
		id: "medium-plusplus",
		name: "Scenpaket Medium++",
		size: "16 m²",
		dimensions: "2×8 eller 8×2 meter",
		heights: [
			"60 cm",
			"80 cm"
		],
		capacity: "5–7 personer inkl. instrument",
		price: 2399,
		priceNote: "per dygn",
		description: "Scenpodie för 5–7 personer. Räcker för de flesta liveband och konferenser med större panel.",
		transport: "tillägg",
		bulky: true,
		image: "/images/scen/pp_medium_pp.png",
		alt: "Scenpaket Medium++ 16m² för 5-7 personer",
		monteringMin: 75,
		artno: "SK-SCN-0007",
		slug: "scen-medium-plusplus"
	},
	{
		id: "large",
		name: "Scenpaket Large",
		size: "20 m²",
		dimensions: "5×4 meter",
		heights: [
			"60 cm",
			"80 cm"
		],
		capacity: "5–8 personer inkl. instrument",
		price: 2999,
		priceNote: "per dygn – kräver leverans & montering",
		description: "Scen för 5–8 musiker eller uppträdande. Byggs horisontellt 5×4 m. Hyrs enbart ut kräver transport, montering och demontering av vår personal (tillkommer).",
		transport: "krävs",
		bulky: true,
		image: "/images/scen/pp_large.png",
		alt: "Scenpaket Large 20m² för 5-8 personer",
		monteringMin: 120,
		artno: "SK-SCN-0008",
		slug: "scen-large"
	},
	{
		id: "large-plus",
		name: "Scenpaket Large+",
		size: "24 m²",
		dimensions: "6×4 meter",
		heights: [
			"60 cm",
			"80 cm"
		],
		capacity: "6–9 personer inkl. instrument",
		price: 3599,
		priceNote: "per dygn – kräver leverans & montering",
		description: "Professionell konsertscen för 6–9 musiker. Hyrs enbart ut — transport, montering och demontering tillkommer.",
		transport: "krävs",
		bulky: true,
		image: "/images/scen/pp_large_plus.png",
		alt: "Scenpaket Large+ 24m² för 6-9 personer",
		monteringMin: 150,
		artno: "SK-SCN-0009",
		slug: "scen-large-plus"
	},
	{
		id: "large-plus-tak",
		name: "Scenpaket Large+ inkl. scentak",
		size: "24 m²",
		dimensions: "6×4 meter + tak",
		heights: [
			"Takhöjd 380 cm"
		],
		capacity: "6–9 personer inkl. instrument",
		price: 11999,
		priceNote: "per dygn – komplett paket kräver leverans & montering",
		description: "Komplett utomhusscen: 24m² med scentak i stål/aluminium med PVC-tak och scentrapp. Takhöjd 380 cm. Hyrs enbart ut — transport och montering av vår personal tillkommer.",
		transport: "krävs",
		bulky: true,
		image: "/images/scen/pp_large_plus_tak.png",
		alt: "Scenpaket Large+ med scentak, 24m²",
		monteringMin: 180,
		artno: "SK-SCN-0010",
		slug: "scen-large-plus-tak"
	},
	{
		id: "xl",
		name: "Scenpaket XL",
		size: "36 m²",
		dimensions: "9×4 meter",
		heights: [
			"60 cm",
			"80 cm"
		],
		capacity: "8–12 personer inkl. instrument",
		price: 5399,
		priceNote: "per dygn – kräver leverans & montering",
		description: "Stor konsertscen för 8–12 musiker. Byggs horisontellt 9×4 m. Hyrs enbart inkl. transport, montering och demontering.",
		transport: "krävs",
		bulky: true,
		image: "/images/scen/pp_xl.png",
		alt: "Scenpaket XL 36m² för 8-12 personer",
		monteringMin: 180,
		artno: "SK-SCN-0011",
		slug: "scen-xl"
	},
	{
		id: "xl-plus",
		name: "Scenpaket XL+",
		size: "48 m²",
		dimensions: "8×6 meter",
		heights: [
			"60 cm",
			"80 cm"
		],
		capacity: "10–14 personer inkl. instrument",
		price: 7199,
		priceNote: "per dygn – kräver leverans & montering",
		description: "Vår största standardscen – 48m² för 10–14 uppträdande. Byggs horisontellt 8×6 m. Hyrs enbart inkl. transport, montering och demontering.",
		transport: "krävs",
		bulky: true,
		image: "/images/scen/pp_xl_plus.png",
		alt: "Scenpaket XL+ 48m² för 10-14 personer",
		monteringMin: 240,
		artno: "SK-SCN-0012",
		slug: "scen-xl-plus"
	}
];
const accessories = [
	{
		name: "Scentrapp (40 cm)",
		price: 279,
		description: "Scentrapp för scener upp till 40 cm höjd.",
		image: "/images/scen/pp_scentrapp.png",
		alt: "Scentrapp 40cm hyra Stockholm",
		artno: "SK-SCN-ACC-0001"
	},
	{
		name: "Scentrapp (60 cm)",
		price: 349,
		description: "Scentrapp för scener upp till 60 cm höjd.",
		image: "/images/scen/pp_scentrapp.png",
		alt: "Scentrapp 60cm hyra Stockholm",
		artno: "SK-SCN-ACC-0002"
	},
	{
		name: "Scenkjol (per 4 m)",
		price: 79,
		description: "Scenkjol för scenens front och sidor. Finns för 40, 60 och 80 cm scener.",
		image: "/images/scen/pp_scenkjol.png",
		alt: "Scenkjol hyra Stockholm",
		artno: "SK-SCN-ACC-0003"
	},
	{
		name: "Backdrop 3,5×2,5 m",
		price: 799,
		description: "Backdrop med svart scenmolton. Moduluppbyggt – kan byggas ut i bredd. Montering 25–30 min.",
		image: "/images/scen/pp_backdrop.png",
		alt: "Backdrop scen hyra Stockholm",
		artno: "SK-SCN-ACC-0004"
	}
];
const scenData = {
	metaTitle: metaTitle$3,
	metaDescription: metaDescription$3,
	intro: intro$1,
	products: products$1,
	accessories: accessories
};

const metaTitle$2 = "Hyra Ljudanläggning Stockholm – PA-system för Event, Live, Musik & Portabelt | Scenkonsult";
const metaDescription$2 = "Hyr PA-system och ljudanläggning i Stockholm från 599 kr/dygn. Event, live, musik och portabelt ljud. Mixerbord, mikrofoner och tillbehör ingår. Leverans i hela Storstockholm.";
const event = {
	pluggImage: "/images/tjanster/plugg_event_ljud.png",
	products: [
		{
			name: "Event, Small",
			slug: "event-small",
			price: 799,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_event_small.png",
			description: "Passar för tal, sång och paus-/bakgrundsmusik för grupper upp till 100 personer. Två Alto 10\" fullrange högtalarenheter på stativ.",
			includes: [
				"Aktiva 10\"/1,4\" element",
				"2000W peak / 1000W RMS",
				"Max 130 dB",
				"48–20000 Hz",
				"Samlad vikt: 25 kg"
			],
			persons: "upp till 100 pers.",
			alt: "Event, Small",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJD-EVE-0001"
		},
		{
			name: "Event, Small+",
			slug: "event-small-plus",
			price: 1199,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_event_small-.png",
			description: "Passar för grupper upp till 180 personer. Två Alto 12\" fullrange högtalarenheter på stativ.",
			includes: [
				"Aktiva 12\"/1,4\" element",
				"2500W peak / 1250W RMS",
				"Max 130 dB",
				"48–20000 Hz",
				"Samlad vikt: 34 kg"
			],
			persons: "upp till 180 pers.",
			alt: "Event, Small+",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJD-EVE-0002"
		},
		{
			name: "Event, Medium",
			slug: "event-medium",
			price: 1599,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_event_medium.png",
			description: "Fyra Alto 10\" fullrange högtalarenheter på stativ för upp till 240 personer.",
			includes: [
				"Aktiva 10\"/1,4\" element",
				"2000W peak / 1000W RMS",
				"Max 130 dB",
				"4 högtalare, bredare ljudbild",
				"Samlad vikt: 54 kg"
			],
			persons: "upp till 240 pers.",
			alt: "Event, Medium",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJD-EVE-0003"
		},
		{
			name: "Event, Medium+",
			slug: "event-medium-plus",
			price: 2299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_event_medium-.png",
			description: "Fyra Alto 12\" fullrange högtalarenheter på stativ för upp till 380 personer.",
			includes: [
				"Aktiva 12\"/1,4\" element",
				"2500W peak / 1250W RMS",
				"Max 130 dB",
				"62–20000 Hz",
				"Samlad vikt: 62 kg"
			],
			persons: "upp till 380 pers.",
			alt: "Event, Medium+",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJD-EVE-0004"
		},
		{
			name: "Event, Large",
			slug: "event-large",
			price: 3199,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_event_large.png",
			description: "Fyra Alto 15\" fullrange högtalarenheter på stativ för upp till 560 personer.",
			includes: [
				"Aktiva 15\"/1,4\" element",
				"2500W peak / 1250W RMS",
				"Max 130 dB",
				"48–20000 Hz",
				"Samlad vikt: 78 kg"
			],
			persons: "upp till 560 pers.",
			alt: "Event, Large",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJD-EVE-0005"
		},
		{
			slug: "event-large-plus",
			name: "Event, Large+",
			price: 3199,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_event_large_.png",
			description: "Fyra Alto 15″ fullrange högtalarenheter för upp till 560 personer. Montering 20–25 min.",
			includes: [
				"15″/1,4″ aktiva element",
				"2 500 W peak / 1 250 W RMS",
				"Max 130 dB",
				"48–20 000 Hz",
				"Samlad vikt: 78 kg"
			],
			bulky: false,
			persons: "upp till 560 pers.",
			artno: "SK-LJD-EVE-0006"
		}
	],
	intro: "Hyr PA-system anpassat för konferenser, galor och presentationer i Stockholm. Alla paket inkluderar högtalare på stativ och kopplas in i vanliga eluttag – ingen tekniker behövs."
};
const live = {
	pluggImage: "/images/tjanster/plugg_live_ljud.png",
	products: [
		{
			name: "Live, Small",
			slug: "live-small",
			price: 599,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_live_small.png",
			description: "Passar för trubadur för grupper 20–60 personer. Två Alto 12\" högtalarenheter med inbyggd mixer.",
			includes: [
				"12\"/2\" fullrange",
				"720W peak / 360W RMS",
				"Max 120 dB",
				"8-bands EQ",
				"Samlad vikt: 58 kg"
			],
			persons: "20–60 pers.",
			alt: "Live, Small",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-LIV-0001"
		},
		{
			name: "Live, Medium",
			slug: "live-medium",
			price: 1199,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_live_medium.png",
			description: "Trubadur eller DJ för 60–100 personer. Två Alto 15S sub-basar samt två 12\" fullrange.",
			includes: [
				"15\" sub + 12\"/2\" fullrange",
				"2000W peak / 1080W RMS",
				"Max 130 dB",
				"45–20000 Hz",
				"Samlad vikt: 105 kg"
			],
			persons: "60–100 pers.",
			alt: "Live, Medium",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-LIV-0002"
		},
		{
			name: "Live, Large",
			slug: "live-large",
			price: 1599,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_live_large.png",
			description: "Liveband för 120–200 personer. Fyra 15S sub-basar och två 15\" fullrange.",
			includes: [
				"4x15\" sub + 2x15\" fullrange",
				"3600W peak / 1800W RMS",
				"Max 120 dB",
				"Samlad vikt: 140 kg"
			],
			persons: "120–200 pers.",
			alt: "Live, Large",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJD-LIV-0003"
		},
		{
			name: "Live/Music, XL",
			slug: "live-xl",
			price: 2299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_xl.png",
			description: "Trubadur eller DJ för 180–350 personer. Två 15\" fullrange och två 18\" sub-basar.",
			includes: [
				"15\"/1,4\" + 18\" sub",
				"8000W peak / 2000W RMS",
				"Max 132 dB",
				"29–20000 Hz",
				"Samlad vikt: 120 kg"
			],
			persons: "180–350 pers.",
			alt: "Live/Music, XL",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-LIV-0004"
		},
		{
			name: "Live/Music, XL+",
			slug: "live-xl-plus",
			price: 2999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_xl-.png",
			description: "DJ för 250–600 personer. Två 15\" fullrange, två 15\" sub och 18\" sub.",
			includes: [
				"15\"/1,4\" + 15\"/18\" sub",
				"8000W peak / 2000W RMS",
				"Max 132 dB",
				"29–20000 Hz",
				"Samlad vikt: 200 kg"
			],
			persons: "250–600 pers.",
			alt: "Live/Music, XL+",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJD-LIV-0005"
		},
		{
			name: "Live/Music, XXL",
			slug: "live-xxl",
			price: 4999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_xxl.png",
			description: "DJ för 500–1500 personer. Fyra 15\" fullrange och fyra 18\" sub-basar.",
			includes: [
				"4x15\"/1,4\" + 4x18\" sub",
				"10 000W peak / 2800W RMS",
				"Max 132 dB",
				"29–20000 Hz",
				"Samlad vikt: 320 kg"
			],
			persons: "500–1500 pers.",
			alt: "Live/Music, XXL",
			bulky: true,
			monteringMin: 30,
			artno: "SK-LJD-LIV-0006"
		},
		{
			name: "Live/Music, Concert",
			slug: "live-concert",
			price: 6999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_concert.png",
			description: "Konsert för liveband eller DJ. Två 12\" fullrange och fyra 18\" sub. Varje stack 2,3m hög.",
			includes: [
				"12\"/1,4\" + 18\" sub",
				"10 800W peak / 2700W RMS",
				"Max 135 dB",
				"37–17000 Hz",
				"Samlad vikt: 360 kg"
			],
			persons: "500–1500 pers.",
			alt: "Live/Music, Concert",
			bulky: true,
			monteringMin: 60,
			artno: "SK-LJD-LIV-0007"
		},
		{
			id: "line-array-small",
			name: "Line Array, Small",
			price: 14999,
			priceNote: "/enl. offert",
			image: "/images/ljud/pp_ljud_music_linearray1.png",
			description: "RCF line array-system för stora konserter och utomhusevent. 8× RCF HDL 6-A fullrange + 2× RCF Sub 8003-AS MK3. Pris från beroende på konfiguration och montering.",
			includes: [
				"8×6\" fullrange line array",
				"2×18\" sub-basar",
				"Max 138 dB SPL",
				"Räckvidd upp till 80 m",
				"Kräver lyfttorn eller rigg"
			],
			bulky: true,
			artno: "SK-LJD-LIV-0008",
			slug: "line-array-small"
		},
		{
			id: "line-array-medium",
			name: "Line Array, Medium",
			price: 19999,
			priceNote: "/enl. offert",
			image: "/images/ljud/pp_ljud_music_linearray2.png",
			description: "RCF line array-system för stora konserter och festivaler. 10× RCF HDL 6-A fullrange + 4× RCF Sub 8003-AS MK3. Pris från beroende på konfiguration och montering.",
			includes: [
				"10×6\" fullrange line array",
				"4×18\" sub-basar",
				"Max 140 dB SPL",
				"Räckvidd upp till 100 m",
				"Kräver lyfttorn eller rigg"
			],
			bulky: true,
			artno: "SK-LJD-LIV-0009",
			slug: "line-array-medium"
		}
	],
	intro: "Hyr liveljud för konserter, trubadurer och liveband i Stockholm. Kraftfulla sub-basar och fullrange högtalarpaket för 20–1500 personer."
};
const music = {
	pluggImage: "/images/tjanster/plugg_dance_ljud.png",
	products: [
		{
			name: "Music, Small",
			slug: "music-small",
			price: 999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_small.png",
			description: "DJ/trubadur för 20–80 personer. Två 10\" fullrange och en 12\" sub-bas.",
			includes: [
				"10\"/1,4\" + 12\" sub",
				"2000W peak / 1000W RMS",
				"Max 130 dB",
				"36–20000 Hz",
				"Samlad vikt: 65 kg"
			],
			persons: "20–80 pers.",
			alt: "Music, Small",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-MUS-0001"
		},
		{
			name: "Music, Small+",
			slug: "music-small-plus",
			price: 1299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_small-.png",
			description: "DJ/trubadur för 40–100 pers. Två 10\" fullrange och två 12\" sub-basar.",
			includes: [
				"10\"/1,4\" + 2x12\" sub",
				"2000W peak",
				"Max 130 dB",
				"36–20000 Hz",
				"Samlad vikt: 90 kg"
			],
			persons: "40–100 pers.",
			alt: "Music, Small+",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-MUS-0002"
		},
		{
			name: "Music, Medium",
			slug: "music-medium",
			price: 1499,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_medium.png",
			description: "DJ för 60–120 pers. Två 12\" fullrange och två 12\" sub-basar.",
			includes: [
				"12\"/1,4\" + 2x12\" sub",
				"2000W peak",
				"Max 130 dB",
				"36–20000 Hz",
				"Samlad vikt: 95 kg"
			],
			persons: "60–120 pers.",
			alt: "Music, Medium",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-MUS-0003"
		},
		{
			name: "Music, Large",
			slug: "music-large",
			price: 1899,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_large.png",
			description: "DJ för 120–250 pers. Två 12\" fullrange och två 15\" sub-basar.",
			includes: [
				"12\"/1,4\" + 2x15\" sub",
				"2000W peak",
				"Max 132 dB",
				"29–20000 Hz",
				"Samlad vikt: 115 kg"
			],
			persons: "120–250 pers.",
			alt: "Music, Large",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-MUS-0004"
		},
		{
			name: "Live/Music, XL",
			slug: "music-xl",
			price: 2299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_xl.png",
			description: "DJ för 180–350 pers. Två 15\" fullrange och två 18\" sub-basar.",
			includes: [
				"15\"/1,4\" + 18\" sub",
				"8000W peak / 2000W RMS",
				"Max 132 dB",
				"Samlad vikt: 120 kg"
			],
			persons: "180–350 pers.",
			alt: "Live/Music, XL",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-MUS-0005"
		},
		{
			name: "Live/Music, XL+",
			slug: "music-xl-plus",
			price: 2999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_xl-.png",
			description: "DJ för 250–600 pers. 15\" fullrange, 15\" och 18\" sub.",
			includes: [
				"15\"/1,4\" + 15\"/18\" sub",
				"8000W peak",
				"Max 132 dB",
				"Samlad vikt: 200 kg"
			],
			persons: "250–600 pers.",
			alt: "Live/Music, XL+",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJD-MUS-0006"
		},
		{
			name: "Live/Music, XXL",
			slug: "music-xxl",
			price: 4999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_music_xxl.png",
			description: "Fyra 15\" fullrange och fyra 18\" sub-basar. Skrymmande produkt.",
			includes: [
				"4x15\"/1,4\" + 4x18\" sub",
				"10 000W peak",
				"Max 132 dB",
				"Samlad vikt: 320 kg"
			],
			persons: "500–1500 pers.",
			alt: "Live/Music, XXL",
			bulky: true,
			monteringMin: 30,
			artno: "SK-LJD-MUS-0007"
		},
		{
			name: "Live/Music, Concert",
			slug: "music-concert",
			price: 6999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_concert.png",
			description: "Konsert. Två 12\" fullrange och fyra 18\" sub. Varje stack 2,3m hög.",
			includes: [
				"12\"/1,4\" + 18\" sub",
				"10 800W peak",
				"Max 135 dB",
				"Samlad vikt: 360 kg"
			],
			persons: "500–1500 pers.",
			alt: "Live/Music, Concert",
			bulky: true,
			monteringMin: 60,
			artno: "SK-LJD-MUS-0008"
		},
		{
			id: "line-array-small",
			name: "Line Array, Small",
			price: 14999,
			priceNote: "/enl. offert",
			image: "/images/ljud/pp_ljud_music_linearray1.png",
			description: "RCF line array-system för stora konserter och utomhusevent. 8× RCF HDL 6-A fullrange + 2× RCF Sub 8003-AS MK3. Pris från beroende på konfiguration och montering.",
			includes: [
				"8×6\" fullrange line array",
				"2×18\" sub-basar",
				"Max 138 dB SPL",
				"Räckvidd upp till 80 m",
				"Kräver lyfttorn eller rigg"
			],
			bulky: true,
			artno: "SK-LJD-MUS-0009"
		},
		{
			id: "line-array-medium",
			name: "Line Array, Medium",
			price: 19999,
			priceNote: "/enl. offert",
			image: "/images/ljud/pp_ljud_music_linearray2.png",
			description: "RCF line array-system för stora konserter och festivaler. 10× RCF HDL 6-A fullrange + 4× RCF Sub 8003-AS MK3. Pris från beroende på konfiguration och montering.",
			includes: [
				"10×6\" fullrange line array",
				"4×18\" sub-basar",
				"Max 140 dB SPL",
				"Räckvidd upp till 100 m",
				"Kräver lyfttorn eller rigg"
			],
			bulky: true,
			artno: "SK-LJD-MUS-0010"
		}
	],
	intro: "Hyr musikljud för DJ och dansgolv i Stockholm. Paket med sub-basar och fullrange högtalarenheter för 20–1500 personer."
};
const portable = {
	pluggImage: "/images/tjanster/plugg_portabelt.png",
	products: [
		{
			name: "Portable, Small",
			slug: "portable-small",
			price: 599,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_small.png",
			description: "Batteridrift, 20+ tim. Inbyggd mixer och Bluetooth. 6,5\" element.",
			includes: [
				"6,5\"/1\" element",
				"200W peak / 100W RMS",
				"Batteridrift upp till 20 tim",
				"Bluetooth",
				"Vikt: 5,4 kg"
			],
			persons: "20–60 pers.",
			alt: "Portable, Small",
			bulky: false,
			monteringMin: 10,
			artno: "SK-LJD-POR-0001"
		},
		{
			name: "Portable, Small+",
			slug: "portable-small-plus",
			price: 699,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_small.png",
			description: "Batteridrift, 7+ tim. Inbyggd mixer och Bluetooth. 12\" element.",
			includes: [
				"12\"/2\" element",
				"600W peak / 300W RMS",
				"Batteridrift upp till 7 tim",
				"Bluetooth",
				"Vikt: 13,4 kg"
			],
			persons: "40–80 pers.",
			alt: "Portable, Small+",
			bulky: false,
			monteringMin: 10,
			artno: "SK-LJD-POR-0002"
		},
		{
			name: "Portable, Medium",
			slug: "portable-medium",
			price: 799,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_medium.png",
			description: "Alto TS108 C kolumnhögtalare. 8″ bas och sex 2,75″ diskant. Inbyggd mixer. Smal och snygg design.",
			includes: [
				"8″ bas + 6×2,75″ element",
				"600 W peak / 300 W RMS",
				"Max 123 dB",
				"Bluetooth",
				"Vikt: 16 kg"
			],
			persons: "40–80 pers.",
			alt: "Portable, Medium",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJD-POR-0003"
		},
		{
			name: "Portable, Medium+",
			slug: "portable-medium-plus",
			price: 999,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_medium_.png",
			description: "Alto TS112 C kolumnhögtalare. 12″ bas och åtta 2,75″ diskant. Inbyggd mixer.",
			includes: [
				"12″ bas + 8×2,75″ element",
				"1 200 W peak / 600 W RMS",
				"Max 127 dB",
				"Bluetooth",
				"Vikt: 24,1 kg"
			],
			persons: "60–100 pers.",
			alt: "Portable, Medium+",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJD-POR-0004"
		},
		{
			slug: "portable-small-duo",
			name: "Portable, Small Duo",
			price: 1099,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_small_duo.png",
			description: "Två batteridrivna 6,5″ högtalare på stativ. Upp till 20 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ingår.",
			includes: [
				"2×6,5″/1″ aktiva element",
				"400 W peak / 200 W RMS",
				"Batteridrift upp till 20 tim",
				"Bluetooth",
				"Vikt: 10,8 kg"
			],
			bulky: false,
			artno: "SK-LJD-POR-0005"
		},
		{
			name: "Portable, Large",
			slug: "portable-large",
			price: 1199,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_large.png",
			description: "LD Systems Maui 28 G2. Två 8\" bas och 16 st 3\" element.",
			includes: [
				"2x8\" bas + 16x3\" element",
				"2000W peak / 1000W RMS",
				"Max 126 dB",
				"Bluetooth",
				"Vikt: 25,7 kg"
			],
			persons: "80–120 pers.",
			alt: "Portable, Large",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-POR-0006"
		},
		{
			slug: "portable-small-plus-duo",
			name: "Portable, Small+ Duo",
			price: 1299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_small__duo.png",
			description: "Två batteridrivna 12″ högtalare på stativ. Upp till 7 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ingår.",
			includes: [
				"2×12″/2″ aktiva element",
				"1 200 W peak / 600 W RMS",
				"Batteridrift upp till 7 tim",
				"Bluetooth",
				"Vikt: 26,8 kg"
			],
			bulky: false,
			artno: "SK-LJD-POR-0007"
		},
		{
			name: "Portable, Medium Duo",
			slug: "portable-medium-duo",
			price: 1499,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_medium_duo.png",
			description: "Två Alto TS108 C kolumnhögtalare. 8″ bas och sex 2,75″ diskant. Inbyggd mixer. Smal och snygg design.",
			includes: [
				"2×8″ bas + 12×2,75″ element",
				"1 200 W peak / 600 W RMS",
				"Max 124 dB",
				"Bluetooth",
				"Vikt: 32 kg"
			],
			persons: "60–100 pers.",
			alt: "Portable, Medium",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJD-POR-0008"
		},
		{
			name: "Portable, Medium+ Duo",
			slug: "portable-medium-plus-duo",
			price: 1899,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_medium_plus_duo.png",
			description: "Två Alto TS112 C kolumnhögtalare. 12″ bas och åtta 2,75″ diskant. Inbyggd mixer.",
			includes: [
				"2×12″ bas + 16×2,75″ element",
				"2 400 W peak / 1 200 W RMS",
				"Max 129 dB",
				"Bluetooth",
				"Vikt: 48,2 kg"
			],
			persons: "100–200 pers.",
			alt: "Portable, Medium+",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJD-POR-0009"
		},
		{
			name: "Portable, Large+",
			slug: "portable-large-plus",
			price: 2299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_large.png",
			description: "Två LD Systems Maui 28 G2 kolumner. 4 st 8\" bas och 32 st 3\" element.",
			includes: [
				"4x8\" bas + 32x3\" element",
				"4000W peak / 2000W RMS",
				"Max 126 dB",
				"Bluetooth",
				"Vikt: 51,4 kg"
			],
			persons: "100–240 pers.",
			alt: "Portable, Large+",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJD-POR-0010"
		},
		{
			slug: "portable-large-duo",
			name: "Portable, Large Duo",
			price: 2299,
			priceNote: "/dygn",
			image: "/images/ljud/pp_ljud_portable_large_.png",
			description: "Två LD Systems Maui 28 G2 kolumner. Fyra 8″ basar och 32 st 3″ diskant.",
			includes: [
				"4×8″ bas + 32×3″ diskant",
				"4 000 W peak / 2 000 W RMS",
				"Max 126 dB",
				"Bluetooth",
				"Vikt: 51,4 kg"
			],
			bulky: false,
			artno: "SK-LJD-POR-0011"
		}
	],
	intro: "Hyr portabelt ljud med batteridrift i Stockholm. Perfekt för utomhusevent, studentflak och tillfällen utan strömkälla."
};
const mixers = [
	{
		name: "Analogt Mixerbord, 2+2 kanaler",
		slug: "mixer-2-2",
		price: 159,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer01.png",
		description: "Kompakt Alto-mixer med 2 mic + 2 stereokanaler och inbyggd Bluetooth.",
		alt: "Analogt Mixerbord, 2+2 kanaler",
		artno: "SK-LJD-MIX-0001"
	},
	{
		name: "Analogt Mixerbord, 4+2 kanaler",
		slug: "mixer-4-2",
		price: 199,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer02.png",
		description: "Alto-mixer med 4 mic + 2 stereokanaler, inbyggda effekter och Bluetooth.",
		alt: "Analogt Mixerbord, 4+2 kanaler",
		artno: "SK-LJD-MIX-0002"
	},
	{
		name: "Analogt mixerbord, 4+1 kanaler",
		slug: "mixer-vibz8dc",
		price: 249,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer-vibz8dc.png",
		description: "LD System Vibz8dc med 4 mic-kanaler, 2 stereokanaler och inbyggd kompressor på kanal 1 & 2.",
		alt: "Analogt mixerbord, 4+1 kanaler",
		artno: "SK-LJD-MIX-0003"
	},
	{
		name: "Analogt Mixerbord, 4+4 kanaler",
		slug: "mixer-4-4",
		price: 299,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer03.png",
		description: "Mackie-mixer med 4 mic + 4 stereokanaler. Kommer i transportväska.",
		alt: "Analogt Mixerbord, 4+4 kanaler",
		artno: "SK-LJD-MIX-0004"
	},
	{
		name: "Analogt Mixerbord, 6+4 kanaler",
		slug: "mixer-6-4",
		price: 349,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer04.png",
		description: "Allen & Heath ZED14. 6 mic + 4 stereokanaler med 69 dB gain.",
		alt: "Analogt Mixerbord, 6+4 kanaler",
		artno: "SK-LJD-MIX-0005"
	},
	{
		name: "Analogt Mixerbord, 12+4 kanaler",
		slug: "mixer-12-4",
		price: 399,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer05.png",
		description: "Alto Live L16. 12 mic + 4 stereokanaler, 24-bit DSP och 256 effekter.",
		alt: "Analogt Mixerbord, 12+4 kanaler",
		artno: "SK-LJD-MIX-0006"
	},
	{
		name: "Analogt Mixerbord, 16+3 kanaler",
		slug: "mixer-16-3",
		price: 599,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer06.png",
		description: "Allen & Heath ZED22FX. 16 mic + 3 stereokanaler, USB, high-pass filter.",
		alt: "Analogt Mixerbord, 16+3 kanaler",
		artno: "SK-LJD-MIX-0007"
	},
	{
		name: "Digitalt mixerbord, 32+16 kanaler",
		slug: "mixer-ilive-t80",
		price: 2499,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mixer-ilive-t80.png",
		description: "Allen & Heath iLive T80 studio- & konsert-mixer med Stagebox på scenen via CAT5/6-kabel.",
		alt: "Digitalt mixerbord, 32+16 kanaler",
		artno: "SK-LJD-MIX-0008"
	}
];
const tillbehor_mikrofon = [
	{
		name: "Högtalarstativ Gravity",
		price: 40,
		priceNote: "/dygn",
		desc: "Max last 30 kg, vikt 3,7 kg",
		image: "/images/ljud/pp_ljud_stativ-gravity.png",
		artno: "SK-LJD-MIK-0001",
		slug: "hogtalarstativ-gravity"
	},
	{
		name: "XLR kablar",
		price: 40,
		priceNote: "/dygn",
		desc: "1,0m–15m, fr 40 kr (50 kr inkl moms)",
		image: "/images/ljud/pp_ljud_tillbehor07.png",
		artno: "SK-LJD-MIK-0002",
		slug: "xlr-kablar"
	},
	{
		name: "Högtalarstativ K&M",
		price: 50,
		priceNote: "/dygn",
		desc: "Max last 30 kg, vikt 3,7 kg",
		image: "/images/ljud/pp_ljud_stativ-km.png",
		artno: "SK-LJD-MIK-0003",
		slug: "hogtalarstativ-k&m"
	},
	{
		name: "Mikrofonstativ",
		price: 60,
		priceNote: "/dygn",
		desc: "Mikrofonstativ med justerbar höjd",
		image: "/images/ljud/pp_ljud_tillbehor06.png",
		artno: "SK-LJD-MIK-0004",
		slug: "mikrofonstativ"
	},
	{
		name: "Högtalarstativ Gravity Premium",
		price: 60,
		priceNote: "/dygn",
		desc: "Max last 50 kg, vikt 6,4 kg",
		image: "/images/ljud/pp_ljud_stativ-gravity-premium.png",
		artno: "SK-LJD-MIK-0005",
		slug: "hogtalarstativ-gravity-premium"
	},
	{
		name: "Handmikrofon",
		price: 80,
		priceNote: "/dygn",
		desc: "Handmikrofon inkl 6 m XLR kabel",
		image: "/images/ljud/pp_ljud_mik01.png",
		artno: "SK-LJD-MIK-0006",
		slug: "handmikrofon"
	},
	{
		name: "Bluetooth-mottagare",
		price: 80,
		priceNote: "/dygn",
		desc: "Omvandlar trådlöst ljud till analog signal",
		image: "/images/ljud/pp_ljud_tillbehor04.png",
		artno: "SK-LJD-MIK-0007",
		slug: "bluetooth-mottagare"
	},
	{
		id: "instrument-blas",
		name: "Instrumentmikrofon, blås",
		price: 80,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik04.png",
		description: "Mikrofon för blåsinstrument, inkl. XLR-kabel.",
		artno: "SK-LJD-MIK-0008",
		specs: [
			"För blåsinstrument",
			"Clip-on mikrofon",
			"XLR-anslutning",
			"Kardioid polarmönster"
		],
		slug: "instrument-blas"
	},
	{
		name: "Instrumentmikrofon",
		price: 120,
		priceNote: "/dygn",
		desc: "Instrumentmikrofon för t.ex. trumma eller blås",
		image: "/images/ljud/pp_ljud_mik02.png",
		artno: "SK-LJD-MIK-0009",
		slug: "instrumentmikrofon"
	},
	{
		name: "Högtalarstativ Gravity med vev",
		price: 120,
		priceNote: "/dygn",
		desc: "Max last 50 kg, vikt 9,1 kg",
		image: "/images/ljud/pp_ljud_stativ-gravity-vev.png",
		artno: "SK-LJD-MIK-0010",
		slug: "hogtalarstativ-gravity-med-vev"
	},
	{
		id: "bluetooth-mottagare-pro",
		name: "Bluetooth-mottagare Pro",
		price: 140,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor_BT-pro.png",
		description: "Bluetooth-mottagare med längre räckvidd. Trådlös anslutning till PA.",
		artno: "SK-LJD-MIK-0011",
		slug: "bluetooth-mottagare-pro"
	},
	{
		id: "di-box-passiv",
		name: "DI-box (passiv)",
		price: 160,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor_DI-passiv.png",
		description: "Passiv DI-box, 2 kanaler. XLR ut / 6,35 mm in.",
		artno: "SK-LJD-MIK-0012",
		slug: "di-box-passiv"
	},
	{
		id: "di-box-aktiv",
		name: "DI-box (aktiv)",
		price: 240,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor_DI-aktiv.png",
		description: "Aktiv DI-box, 1 kanal. XLR ut / 6,35 mm in, 9V batteri.",
		artno: "SK-LJD-MIK-0013",
		slug: "di-box-aktiv"
	},
	{
		id: "xlr-multikabel-6ch",
		name: "XLR Multikabel 15 m, 6 kanaler",
		price: 276,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor_MK-small.png",
		description: "Stagebox med 15 m multikabel, 6 kanaler.",
		artno: "SK-LJD-MIK-0014",
		slug: "xlr-multikabel-6ch"
	},
	{
		id: "xlr-multikabel-8ch",
		name: "XLR Multikabel 25 m, 8 kanaler",
		price: 384,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor_MK-medium.png",
		description: "Stagebox med 25 m multikabel, 8 kanaler.",
		artno: "SK-LJD-MIK-0015",
		slug: "xlr-multikabel-8ch"
	},
	{
		name: "Trådlös handmikrofon",
		price: 400,
		priceNote: "/dygn",
		desc: "Trådlös handmikrofon, ca 30 m räckvidd",
		image: "/images/ljud/pp_ljud_mik05.png",
		artno: "SK-LJD-MIK-0016",
		specs: [
			"UHF trådlös",
			"Räckvidd ca 30 m",
			"Kräver AA-batteri",
			"Mottagar-enhet ingår"
		],
		slug: "tradlos-handmikrofon"
	},
	{
		name: "Trådlöst headset",
		price: 480,
		priceNote: "/dygn",
		desc: "Trådlöst headset, ca 30 m räckvidd",
		image: "/images/ljud/pp_ljud_mik06.png",
		artno: "SK-LJD-MIK-0017",
		specs: [
			"UHF trådlös",
			"Räckvidd ca 30 m",
			"Bodypack + headset ingår",
			"Kräver AA-batteri"
		],
		slug: "tradlost-headset"
	},
	{
		id: "tradlos-iem",
		name: "Trådlöst IEM",
		price: 480,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor01.png",
		description: "In-ear monitor för scen, ca 30 m räckvidd.",
		artno: "SK-LJD-MIK-0018",
		specs: [
			"In-ear monitor för scen",
			"Räckvidd ca 30 m",
			"Bodypack + in-ear ingår",
			"Kräver AA-batteri"
		],
		slug: "tradlos-iem"
	},
	{
		id: "instrument-slagverk",
		name: "Instrumentmikrofoner, slagverk",
		price: 480,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik03.png",
		description: "Mikrofoner för trumset/slagverk, inkl. XLR-kablar.",
		artno: "SK-LJD-MIK-0019",
		specs: [
			"Mikrofonkit för trumset/slagverk",
			"Inkl. XLR-kablar och clips",
			"Dynamiska mikrofoner",
			"Kardioid/hyperkardoid polarmönster"
		],
		slug: "instrument-slagverk"
	},
	{
		id: "xlr-multikabel-24ch",
		name: "XLR Multikabel 15 m, 24+8 kanaler",
		price: 632,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor_MK-large.png",
		description: "Stagebox stor med 15 m multikabel, 24+8 kanaler.",
		artno: "SK-LJD-MIK-0020",
		slug: "xlr-multikabel-24ch"
	},
	{
		id: "slxd-1-mik",
		name: "Shure SLXD – trådlöst system, 1 mik",
		price: 699,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik09.png",
		description: "Digitalt trådlöst system med SM58-kapsel. AES-256, räckvidd ca 100 m.",
		includes: [
			"Digitalt, AES-256",
			"1× SM58-kapsel",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0021",
		specs: [
			"Digitalt AES-256 krypterat",
			"SM58-kapsel (vokal)",
			"Räckvidd ca 100 m",
			"Auto-scan frekvens",
			"Rack-monterbar mottagare"
		],
		slug: "slxd-1-mik"
	},
	{
		id: "slxd-1-myggmik",
		name: "Shure SLXD – trådlöst system, 1 myggmikrofon",
		price: 699,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik13.png",
		description: "Digitalt trådlöst system med bodypack och myggmikrofon. AES-256, ca 100 m.",
		includes: [
			"Digitalt, AES-256",
			"1× bodypack + myggmik",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0022",
		specs: [
			"Digitalt AES-256 krypterat",
			"Bodypack + myggmikrofon",
			"Räckvidd ca 100 m",
			"Auto-scan frekvens",
			"Rack-monterbar mottagare"
		],
		slug: "slxd-1-myggmik"
	},
	{
		id: "slxd-1-headset",
		name: "Shure SLXD – trådlöst system, 1 headset",
		price: 749,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik12.png",
		description: "Digitalt trådlöst system med bodypack och headset. AES-256, ca 100 m.",
		includes: [
			"Digitalt, AES-256",
			"1× bodypack + headset",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0023",
		specs: [
			"Digitalt AES-256 krypterat",
			"Bodypack + headset",
			"Räckvidd ca 100 m",
			"Auto-scan frekvens",
			"Rack-monterbar mottagare"
		],
		slug: "slxd-1-headset"
	},
	{
		id: "slxd-1-lagprofil",
		name: "Shure SLXD – trådlöst system, 1 lågprofil headset",
		price: 799,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik14.png",
		description: "Digitalt trådlöst system med bodypack och öronhängande lågprofil headset.",
		includes: [
			"Digitalt, AES-256",
			"1× bodypack + öronhängande headset",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0024",
		specs: [
			"Digitalt AES-256 krypterat",
			"Bodypack + öronhängande headset",
			"Räckvidd ca 100 m",
			"Diskret lågprofil-design",
			"Rack-monterbar mottagare"
		],
		slug: "slxd-1-lagprofil"
	},
	{
		id: "effektrack",
		name: "Effektrack med matrix & feedback-suppressor",
		price: 1036,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_effektrack.png",
		description: "5-zon ART-matrix + Klark Teknik DP1000 feedback-suppressor.",
		includes: [
			"5-zon ART-matrix",
			"Klark Teknik DP1000"
		],
		artno: "SK-LJD-MIK-0025",
		specs: [
			"5-zon ART-matrix",
			"Klark Teknik DP1000 feedback-suppressor",
			"Förhindrar rundgång",
			"Rack-monterat 19\"",
			"Används med PA-system"
		],
		slug: "effektrack"
	},
	{
		name: "Shure SLXD – Digitalt trådlöst system, 2 mikrofoner",
		price: 1299,
		priceNote: "/dygn",
		desc: "Dubbelt digitalt trådlöst system med 2 handhållna SM58-mikrofoner. Ca 100 m räckvidd. AES-256-kryptering.",
		image: "/images/ljud/pp_ljud_mik-shure-slxd4d.png",
		artno: "SK-LJD-MIK-0026",
		specs: [
			"Digitalt AES-256 krypterat",
			"2× SM58 handhållna mikrofoner",
			"Dual-channel mottagare",
			"Räckvidd ca 100 m",
			"Auto-scan frekvens"
		],
		slug: "shure-slxd-–-digitalt-tradlost-system,-2-mikrofoner"
	},
	{
		id: "slxd-2-myggmik",
		name: "Shure SLXD – trådlöst system, 2 myggmikrofoner",
		price: 1299,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik10.png",
		description: "Digitalt trådlöst system med 2 bodypack och myggmikrofoner. AES-256, ca 100 m.",
		includes: [
			"Digitalt, AES-256",
			"2× bodypack + myggmik",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0027",
		specs: [
			"Digitalt AES-256 krypterat",
			"2× bodypack + myggmikrofon",
			"Dual-channel mottagare",
			"Räckvidd ca 100 m",
			"Auto-scan frekvens"
		],
		slug: "slxd-2-myggmik"
	},
	{
		id: "slxd-2-headset",
		name: "Shure SLXD – trådlöst system, 2 headset",
		price: 1399,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik08.png",
		description: "Digitalt trådlöst system med 2 bodypack och headset. AES-256, ca 100 m.",
		includes: [
			"Digitalt, AES-256",
			"2× bodypack + headset",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0028",
		specs: [
			"Digitalt AES-256 krypterat",
			"2× bodypack + headset",
			"Dual-channel mottagare",
			"Räckvidd ca 100 m",
			"Auto-scan frekvens"
		],
		slug: "slxd-2-headset"
	},
	{
		id: "slxd-2-lagprofil",
		name: "Shure SLXD – trådlöst system, 2 lågprofil headset",
		price: 1499,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_mik11.png",
		description: "Digitalt trådlöst system med 2 bodypack och öronhängande lågprofil headset.",
		includes: [
			"Digitalt, AES-256",
			"2× bodypack + öronhängande headset",
			"Räckvidd ca 100 m"
		],
		artno: "SK-LJD-MIK-0029",
		specs: [
			"Digitalt AES-256 krypterat",
			"2× bodypack + lågprofil headset",
			"Dual-channel mottagare",
			"Räckvidd ca 100 m",
			"Diskret design"
		],
		slug: "slxd-2-lagprofil"
	},
	{
		id: "wireless-8ch",
		name: "Trådlöst mikrofonset, 8 kanaler",
		price: 3999,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_tillbehor20.png",
		description: "4 handmikrofoner och 4 headset med antennsplitter. 823–832 MHz, upp till 50 m räckvidd.",
		includes: [
			"4× trådlös handmikrofon",
			"4× trådlöst headset",
			"Antennsplitter",
			"823–832 MHz",
			"Räckvidd upp till 50 m"
		],
		artno: "SK-LJD-MIK-0030",
		specs: [
			"4× handmikrofon + 4× headset",
			"Antennsplitter ingår",
			"823–832 MHz band",
			"Räckvidd upp till 50 m",
			"8 oberoende kanaler"
		],
		slug: "wireless-8ch"
	}
];
const tillbehor_el = [
	{
		name: "Grenuttag, 1,5 m",
		price: 20,
		priceNote: "/dygn",
		desc: "Jordat grenuttag 1-fas, 3–5 uttag, 16A",
		artno: "SK-LJD-EL-0001"
	},
	{
		name: "Förlängningskabel, 10 m",
		price: 48,
		priceNote: "/dygn",
		desc: "Jordad förlängningskabel 1-fas, 16A, IP44",
		artno: "SK-LJD-EL-0002"
	},
	{
		name: "Grenuttag på rulle, 10 m",
		price: 100,
		priceNote: "/dygn",
		desc: "Jordat grenuttag 1-fas, 4 uttag, 16A, IP44",
		artno: "SK-LJD-EL-0003"
	},
	{
		name: "Grenuttag på rulle, 25 m",
		price: 159,
		priceNote: "/dygn",
		desc: "Jordat grenuttag 1-fas, 4 uttag, 16A, IP44",
		artno: "SK-LJD-EL-0004"
	},
	{
		name: "Förlängningskabel 3-fas, 20 m (16A)",
		price: 236,
		priceNote: "/dygn",
		desc: "Jordad förlängningskabel 3-fas, 16A, IP44",
		artno: "SK-LJD-EL-0005"
	},
	{
		name: "Förlängningskabel 3-fas, 20 m (32A)",
		price: 396,
		priceNote: "/dygn",
		desc: "Jordad förlängningskabel 3-fas, 32A, IP44",
		artno: "SK-LJD-EL-0006"
	},
	{
		name: "Strömomvandlare 3-fas > 1-fas",
		price: 320,
		priceNote: "/dygn",
		desc: "Omvandlar 32A 3-fas till 1-fas uttag",
		artno: "SK-LJD-EL-0007"
	},
	{
		name: "Överkörningsskydd, 1 m",
		price: 80,
		priceNote: "/dygn",
		desc: "Kabelskyddsramp, 1 meter, 2 kanaler",
		artno: "SK-LJD-EL-0008"
	},
	{
		name: "Regnskydd till högtalare",
		price: 159,
		priceNote: "/dygn",
		desc: "Lite olika passform beroende på paket",
		artno: "SK-LJD-EL-0009"
	},
	{
		name: "Elgenerator, 2200W",
		price: 799,
		priceNote: "/dygn",
		desc: "Etanolfri akrylatbensin (4-takt), 1900W kontinuerlig effekt. Drivmedel tillkommer.",
		artno: "SK-LJD-EL-0010"
	},
	{
		name: "Elgenerator 7 700 W",
		price: 1799,
		priceNote: "/dygn",
		desc: "7 000 W kontinuerlig, bensin 4-takt. Kipor IG6000.",
		artno: "SK-LJD-EL-0011"
	},
	{
		id: "lyfttorn-line-array",
		name: "Lyfttorn för line array",
		price: 2999,
		priceNote: "/dygn",
		image: "/images/ljud/pp_ljud_lift.png",
		description: "Lyfttorn för riggning av line array. Max last 200 kg, höjd upp till 6 m.",
		includes: [
			"Max last 200 kg",
			"Höjd upp till 6 m"
		],
		bulky: true,
		artno: "SK-LJD-EL-0012"
	}
];
const categories$1 = [
	{
		name: "Ljud för Event",
		href: "/vara-tjanster/hyra-ljud/event/",
		image: "/images/tjanster/plugg_event_ljud.png",
		desc: "PA-system för konferenser, galor och presentationer"
	},
	{
		name: "Ljud för Live",
		href: "/vara-tjanster/hyra-ljud/live/",
		image: "/images/tjanster/plugg_live_ljud.png",
		desc: "Kraftfullt liveljud för konserter och trubadurer"
	},
	{
		name: "Ljud för Musik",
		href: "/vara-tjanster/hyra-ljud/music/",
		image: "/images/tjanster/plugg_dance_ljud.png",
		desc: "DJ-system med sub-basar och fullrange för dansgolv"
	},
	{
		name: "Portabelt ljud",
		href: "/vara-tjanster/hyra-ljud/portable/",
		image: "/images/tjanster/plugg_portabelt.png",
		desc: "Batteridrivet ljud för utomhus och studentflak"
	}
];
const faq$2 = [
	{
		q: "Hur stor anläggning behöver jag?",
		a: "Tumregel: Event Small räcker till ca 100 pers, Event Medium+ upp till 380. Hör av dig om du är osäker – vi hjälper dig välja rätt."
	},
	{
		q: "Behöver jag teknisk kunskap för att koppla upp systemet?",
		a: "Nej, alla paket är designade för plug and play. Instruktioner medföljer och du kopplar in högtalarenheter i vanliga eluttag."
	},
	{
		q: "Kan jag använda min telefon/laptop som ljudkälla?",
		a: "Ja, alla paket stödjer Bluetooth eller XLR/RCA-anslutning. Mixerbordet erbjuder ytterligare flexibilitet."
	},
	{
		q: "Ingår mikrofoner?",
		a: "Nej, mikrofoner hyrs separat. Vi har handmikrofoner från 80 kr/dygn och trådlösa system från 400 kr/dygn."
	},
	{
		q: "Kan ni leverera och rigga upp systemet?",
		a: "Ja, vi erbjuder leverans, riggning och nedmontering som tilläggstjänst. Kontakta oss för offert."
	}
];
const ljudData = {
	metaTitle: metaTitle$2,
	metaDescription: metaDescription$2,
	event: event,
	live: live,
	music: music,
	portable: portable,
	mixers: mixers,
	tillbehor_mikrofon: tillbehor_mikrofon,
	tillbehor_el: tillbehor_el,
	categories: categories$1,
	faq: faq$2
};

const metaTitle$1 = "Hyra Ljusutrustning Stockholm – Ljuspaket, Effekter & Rökmaskiner | Scenkonsult";
const metaDescription$1 = "Hyr ljusutrustning i Stockholm från 399 kr/dygn. Kompletta ljuspaket, moving heads, LED PAR, rökmaskiner, kallgnistmaskiner och stativ. Leverans i hela Storstockholm.";
const categories = [
	{
		name: "Färdiga ljuspaket",
		href: "/vara-tjanster/hyra-ljus/fardiga-paket/",
		image: "/images/ljus/plugg_paket.png",
		desc: "Kompletta ljusrig för din storlek av event"
	},
	{
		name: "Lösa effekter",
		href: "/vara-tjanster/hyra-ljus/ljuseffekter/",
		image: "/images/ljus/plugg_effekter.png",
		desc: "LED PAR, moving heads, UV och scanners"
	},
	{
		name: "Rök & pyroteknik",
		href: "/vara-tjanster/hyra-ljus/rok-pyro/",
		image: "/images/ljus/plugg_rok.png",
		desc: "Rökmaskiner, kallgnistmaskiner och konfetti"
	},
	{
		name: "Stativ & tross",
		href: "/vara-tjanster/hyra-ljus/stativ-tross/",
		image: "/images/ljus/plugg_t-stativ-tross.png",
		desc: "T-bars, vevstativ och trosstorn"
	}
];
const paket = {
	pluggImage: "/images/ljus/plugg_paket.png",
	products: [
		{
			name: "Ljuspaket, Small",
			slug: "ljus-small",
			price: 399,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_small.png",
			description: "LED T-bar med fyra RGB PAR armaturer på stativ. Synkar till musik. Plug and play.",
			includes: [
				"1 stativ med T-bar",
				"4x PAR armaturer: 12x9W RGB",
				"Höjd: 2500 mm",
				"Strömförbrukning: 260W",
				"Samlad vikt: 16 kg"
			],
			persons: "10–30 pers.",
			alt: "Ljuspaket, Small",
			bulky: false,
			monteringMin: 12,
			artno: "SK-LJS-PAK-0001"
		},
		{
			name: "Ljuspaket, Small+",
			slug: "ljus-small-plus",
			price: 599,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_small-.png",
			description: "Trosstorn med 100W COB LED moving head på toppen. Roterar 540/180°, programmerbar.",
			includes: [
				"Trosstorn 1 m",
				"Moving head: 36x3W RGBW",
				"Strålvinkel: 15°",
				"DMX/musikstyrning",
				"Höjd på tross: 1 m"
			],
			persons: "20–40 pers.",
			alt: "Ljuspaket, Small+",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJS-PAK-0002"
		},
		{
			name: "Ljuspaket, Small++",
			slug: "ljus-small-pp",
			price: 799,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_small--.png",
			description: "Fyra effekter på två stativ: LED PAR, roterande armaturer, stroboskop/UV och laser.",
			includes: [
				"2 stativ med T-bars",
				"4 typer av effekter",
				"Strömförbrukning: 340W",
				"DMX och musikstyrning",
				"Samlad vikt: 30 kg"
			],
			persons: "20–60 pers.",
			alt: "Ljuspaket, Small++",
			bulky: false,
			monteringMin: 15,
			artno: "SK-LJS-PAK-0003"
		},
		{
			name: "Ljuspaket, Medium",
			slug: "ljus-medium",
			price: 1199,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_medium.png",
			description: "Två trosstorn med 120W COB LED + 26 RGBW moving heads. DMX eller automatik.",
			includes: [
				"2 trosstorn",
				"2x moving heads: 120W COB + 26x2W RGBW",
				"Strålvinkel: 25°",
				"DMX/musikstyrning",
				"Höjd på tross: 1 m"
			],
			persons: "40–80 pers.",
			alt: "Ljuspaket, Medium",
			bulky: false,
			monteringMin: 20,
			artno: "SK-LJS-PAK-0004"
		},
		{
			name: "Ljuspaket, Medium+",
			slug: "ljus-medium-plus",
			price: 1299,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_medium.png",
			description: "Fem effekter på tre stativ: LED PAR, roterande, stroboskop/UV och LED scanners.",
			includes: [
				"3 stativ",
				"5 typer av effekter inkl scanners",
				"Strömförbrukning: 340W",
				"DMX och musikstyrning",
				"Samlad vikt: 30 kg"
			],
			persons: "40–100 pers.",
			alt: "Ljuspaket, Medium+",
			bulky: false,
			monteringMin: 25,
			artno: "SK-LJS-PAK-0005"
		},
		{
			name: "Ljuspaket, Medium++",
			slug: "ljus-medium-pp",
			price: 1499,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_medium.png",
			description: "Sex effekter: LED PAR, Moving Head Wash, Moving Head Beam. Kan styras till musik.",
			includes: [
				"2 stativ",
				"4x LED PAR + 2x Moving Head Wash + 2x Moving Head Beam",
				"DMX och musikstyrning"
			],
			persons: "50–120 pers.",
			alt: "Ljuspaket, Medium++",
			bulky: false,
			monteringMin: 40,
			artno: "SK-LJS-PAK-0006"
		},
		{
			slug: "ljus-large",
			name: "Ljuspaket, Large",
			price: 1699,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_large.png",
			description: "Professionellt ljuspaket med moving heads, PAR-armaturer och stroboskop. Passar för medelstora event och galor.",
			includes: [
				"Moving heads",
				"PAR-armaturer",
				"Stroboskop",
				"DMX-styrning"
			],
			artno: "SK-LJS-PAK-0007"
		},
		{
			slug: "ljus-large-plus",
			name: "Ljuspaket, Large+",
			price: 2199,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_large_plus.png",
			description: "Komplett ljusrigg för större event med moving heads, PAR, stroboskop och effekter.",
			includes: [
				"Moving heads",
				"PAR-armaturer",
				"Stroboskop",
				"Laser/effekter",
				"DMX-styrning"
			],
			artno: "SK-LJS-PAK-0008"
		},
		{
			slug: "ljus-large-pp",
			name: "Ljuspaket, Large++",
			price: 2699,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_large_plusplus.png",
			description: "Maximal ljusrigg med komplett ljussättning för stora konserter och galor.",
			includes: [
				"Moving heads",
				"PAR-armaturer",
				"Stroboskop",
				"Laser/effekter",
				"LED wash",
				"DMX-styrning"
			],
			artno: "SK-LJS-PAK-0009"
		}
	]
};
const effekter = {
	pluggImage: "/images/ljus/plugg_effekter.png",
	products: [
		{
			name: "LED PAR (14x8W RGBW)",
			slug: "led-par",
			price: 79,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt19.png",
			description: "Klassisk PAR-armatur med 14 st 8W RGBW. DMX eller direktstyrning. Volymrabatt från 4 st.",
			includes: [
				"14x8W RGBW",
				"Strålvinkel: 16°",
				"60W",
				"DMX 4/8 kanaler",
				"Vikt: 4 kg"
			],
			alt: "LED PAR (14x8W RGBW)",
			bulky: false,
			artno: "SK-LJS-EFF-0001",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 79
				},
				{
					minQty: 4,
					unitPrice: 75
				},
				{
					minQty: 8,
					unitPrice: 62
				},
				{
					minQty: 12,
					unitPrice: 58
				},
				{
					minQty: 24,
					unitPrice: 54
				}
			],
			group: "led-par"
		},
		{
			name: "LED PAR (9x10W RGBW)",
			slug: "led-par-9",
			price: 99,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt26.png",
			description: "Modern PAR-armatur med 9 st 10W RGBW. DMX, fjärrkontroll eller ljudstyrning. Volymrabatt från 4 st.",
			includes: [
				"9x10W RGBW",
				"Strålvinkel: 16°",
				"90W",
				"DMX 8 kanaler",
				"Vikt: 4 kg"
			],
			alt: "LED PAR (9x10W RGBW)",
			bulky: false,
			artno: "SK-LJS-EFF-0002",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 99
				},
				{
					minQty: 4,
					unitPrice: 87
				},
				{
					minQty: 8,
					unitPrice: 75
				}
			],
			group: "led-par",
			video: "9LEDs_PAR_RGBW_MP4.mp4"
		},
		{
			name: "LED PAR UV",
			slug: "led-par-uv",
			price: 119,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt21.png",
			description: "36 st 1W UV PAR-armatur. Fluorescerande effekter i mörker. Volymrabatt från 4 st.",
			includes: [
				"36x1W UV",
				"Strålvinkel: 25°",
				"24W",
				"DMX 7 kanaler",
				"Vikt: 4 kg"
			],
			alt: "LED PAR UV",
			bulky: false,
			artno: "SK-LJS-EFF-0003",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 119
				},
				{
					minQty: 4,
					unitPrice: 112
				},
				{
					minQty: 8,
					unitPrice: 100
				}
			],
			group: "led-par"
		},
		{
			name: "LED PAR XL (60x2W RGBW)",
			slug: "led-par-xl",
			price: 149,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_par-xl.png",
			description: "Stor PAR-armatur med 60 st 2W RGBW. Bred strålvinkel 25°. Volymrabatt från 4 st.",
			includes: [
				"60x2W RGBW",
				"Strålvinkel: 25°",
				"120W",
				"DMX 8 kanaler",
				"Vikt: 4 kg"
			],
			alt: "LED PAR XL (60x2W RGBW)",
			bulky: false,
			artno: "SK-LJS-EFF-0004",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 149
				},
				{
					minQty: 4,
					unitPrice: 125
				},
				{
					minQty: 8,
					unitPrice: 112
				}
			],
			group: "led-par",
			video: "PAR-XL.mp4"
		},
		{
			name: "LED-armatur, uppladdningsbar",
			slug: "led-uppladdningsbar",
			price: 199,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt22.png",
			description: "IP65 wall wash-armatur med batteridrift upp till 14h. 4×18W RGBWA+UV. Volymrabatt från 4 st.",
			includes: [
				"4x18W RGBWA+UV",
				"Batteridrift 14h",
				"IP65 (utomhus)",
				"DMX 6/8/10 kanaler",
				"Vikt: kompakt"
			],
			alt: "LED-armatur, uppladdningsbar",
			bulky: false,
			artno: "SK-LJS-EFF-0005",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 199
				},
				{
					minQty: 4,
					unitPrice: 187
				},
				{
					minQty: 8,
					unitPrice: 175
				},
				{
					minQty: 16,
					unitPrice: 169
				}
			],
			group: "led-par",
			video: "4X18W_RGBWA_UV_Battery.mp4"
		},
		{
			name: "LED Bar",
			slug: "led-bar",
			price: 199,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt07.png",
			description: "LED-bar med 240 st RGB-LED. Wall wash för bakvägg eller backdrop. DMX-styrning.",
			includes: [
				"240×10mm RGB LED, spridn. 30°",
				"Wall wash för bakvägg/backdrop",
				"DMX 2/3/5/24 kanaler",
				"Mått 1064×89×65 mm, 2,6 kg"
			],
			alt: "LED Bar RGB wall wash",
			bulky: false,
			artno: "SK-LJS-EFF-0006",
			group: "led-par",
			video: "stairville_led_bar_240-8_rgb_dmx_30_02_02.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 199
				},
				{
					minQty: 4,
					unitPrice: 187
				},
				{
					minQty: 8,
					unitPrice: 175
				}
			]
		},
		{
			name: "LED Scanner",
			slug: "led-scanner",
			price: 239,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt05.png",
			description: "LED-scanner med roterande spegel och snabba rörelser. DMX-styrning.",
			includes: [
				"52×1W LED (RGBW), DMX 4 kanaler",
				"Spegel med snabba rörelser",
				"Mönster och färgvariationer",
				"Mått 425×145×165 mm, 4 kg"
			],
			alt: "LED Scanner effekt",
			bulky: false,
			artno: "SK-LJS-EFF-0007",
			group: "special",
			video: "stairville_matrixx-sc-100_dmx_led_03.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 239
				},
				{
					minQty: 2,
					unitPrice: 200
				}
			]
		},
		{
			name: "Strobe (2-pack)",
			slug: "strobe",
			price: 399,
			priceNote: "/2-pack/dygn",
			image: "/images/ljus/pp_ljus_effekt04.png",
			description: "Professionell Xenon-strobe. Levereras som 2-pack i transportcase.",
			includes: [
				"1500W Xenon, 0–15 blinkar/sek",
				"0–100% dimning via DMX",
				"DMX 2 kanaler",
				"2 st i transportcase, 4 kg/st"
			],
			alt: "Stroboskop 2-pack",
			bulky: false,
			artno: "SK-LJS-EFF-0008",
			group: "special",
			video: "Stairville-1-Strobe-1500-DMX-Power-Bundle.mp4"
		},
		{
			name: "Laser RGB",
			slug: "laser",
			price: 499,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt06.png",
			description: "Animeringslaser 400 mW RGB. Anpassar sig till musik. Kräver nödstopp.",
			includes: [
				"Animeringslaser 400 mW RGB",
				"Anpassar sig automatiskt till musik",
				"DMX 3/9 kanaler, kräver nödstopp",
				"Laserklass 3B, max 500 mW (SE-gräns)"
			],
			alt: "Laser RGB animering",
			bulky: false,
			artno: "SK-LJS-EFF-0009",
			group: "special",
			video: "cameo_wookie-400-RGB.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 499
				},
				{
					minQty: 2,
					unitPrice: 450
				}
			]
		},
		{
			name: "Moving Head Wash (36×3W RGBW)",
			slug: "mh-wash-36",
			price: 299,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt10.png",
			description: "Moving Head Wash med 36×3W RGBW. 540°/270° panorering. DMX-styrning.",
			includes: [
				"36×3W RGBW, strålv. 15°",
				"540°/270° panorering/lutning",
				"DMX 9/16 kanaler, LCD-display",
				"Mått 252×314×155 mm, 4,8 kg"
			],
			alt: "Moving Head Wash 36×3W RGBW",
			bulky: false,
			artno: "SK-LJS-EFF-0010",
			group: "moving-head",
			tag: "Moving Head | Wash",
			video: "MH-100.mp4"
		},
		{
			name: "Moving Head Wash – Demon's Eye",
			slug: "mh-wash-demons-eye",
			price: 299,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt11.png",
			description: "Moving Head Wash med motoriserad fokus och zoom. 285W LED.",
			includes: [
				"285W LED, strålv. 10°–55°",
				"Motoriserad fokus och zoom",
				"540°/270° panorering/lutning",
				"Mått 300×390×180 mm, 7 kg"
			],
			alt: "Moving Head Wash Demon's Eye",
			bulky: false,
			artno: "SK-LJS-EFF-0011",
			group: "moving-head",
			tag: "Moving Head | Wash",
			video: "Big-Dipper-LM120-introduction-720p.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 299
				},
				{
					minQty: 2,
					unitPrice: 250
				},
				{
					minQty: 4,
					unitPrice: 225
				}
			]
		},
		{
			name: "Moving Head Wash (19×15W RGBW)",
			slug: "mh-wash-19-15w",
			price: 399,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt13.png",
			description: "Moving Head Wash med 19×15W RGBW och motoriserad zoom.",
			includes: [
				"19×15W RGBW, strålv. 10°–55°",
				"Motoriserad fokus och zoom",
				"540°/270° panorering/lutning",
				"Mått 300×390×180 mm, 7 kg"
			],
			alt: "Moving Head Wash 19×15W",
			bulky: false,
			artno: "SK-LJS-EFF-0012",
			group: "moving-head",
			tag: "Moving Head | Wash",
			video: "LM1915Z.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 399
				},
				{
					minQty: 2,
					unitPrice: 350
				},
				{
					minQty: 4,
					unitPrice: 325
				}
			]
		},
		{
			name: "Moving Head Wash (19×8W + 60×0,2W RGB)",
			slug: "mh-wash-19-8w",
			price: 499,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt14.png",
			description: "Moving Head Wash med dubbla LED-system. 10 000 lux vid 5 m.",
			includes: [
				"19×8W RGBW + 60×0,2W RGB",
				"Strålv. 10°–60°, lux@5m: 10 000",
				"540°/220° panorering/lutning",
				"Mått 325×400×225 mm, 5,9 kg"
			],
			alt: "Moving Head Wash 19×8W",
			bulky: false,
			artno: "SK-LJS-EFF-0013",
			group: "moving-head",
			tag: "Moving Head | Wash",
			video: "LM1009Z.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 499
				},
				{
					minQty: 2,
					unitPrice: 450
				},
				{
					minQty: 4,
					unitPrice: 425
				}
			]
		},
		{
			name: "Moving Head Beam/Spot (100W COB)",
			slug: "mh-beam-100w",
			price: 299,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt16.png",
			description: "Moving Head Beam/Spot med 100W COB LED. Smal 3° strålvinkel med prismor och gobos.",
			includes: [
				"100W COB LED, strålv. 3°",
				"18 prismor, 7+1 gobos, 7+1 färger",
				"540°/180° panorering/lutning",
				"Mått 280×310×210 mm, 4,7 kg"
			],
			alt: "Moving Head Beam 100W COB",
			bulky: false,
			artno: "SK-LJS-EFF-0014",
			group: "moving-head",
			tag: "Moving Head | Beam/Spot",
			video: "LB100A.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 299
				},
				{
					minQty: 2,
					unitPrice: 250
				},
				{
					minQty: 4,
					unitPrice: 225
				}
			]
		},
		{
			name: "Moving Head Beam/Spot (180W COB)",
			slug: "mh-beam-180w",
			price: 399,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt17.png",
			description: "Moving Head Beam/Spot med 180W COB LED. 6+12 prismor och 7+1 gobos.",
			includes: [
				"180W COB LED, strålv. 3°",
				"6+12 prismor, 7+1 gobos",
				"540°/180° panorering/lutning",
				"Mått 205×305×205 mm, 4,5 kg"
			],
			alt: "Moving Head Beam 180W COB",
			bulky: false,
			artno: "SK-LJS-EFF-0015",
			group: "moving-head",
			tag: "Moving Head | Beam/Spot",
			video: "LB230.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 399
				},
				{
					minQty: 2,
					unitPrice: 350
				},
				{
					minQty: 4,
					unitPrice: 325
				}
			]
		},
		{
			name: "Moving Head Beam/Spot (230W COB)",
			slug: "mh-beam-230w",
			price: 499,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt18.png",
			description: "Kraftfull Moving Head Beam/Spot med 230W COB + 27×0,5W RGBW ring.",
			includes: [
				"230W COB + 27×0,5W RGBW LED",
				"18 prismor, 14+1 gobos, 13+1 färger",
				"540°/270° panorering/lutning",
				"Mått 290×450×240 mm, 10,2 kg"
			],
			alt: "Moving Head Beam 230W COB",
			bulky: false,
			artno: "SK-LJS-EFF-0016",
			group: "moving-head",
			tag: "Moving Head | Beam/Spot",
			video: "LB450C.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 499
				},
				{
					minQty: 2,
					unitPrice: 450
				},
				{
					minQty: 4,
					unitPrice: 425
				}
			]
		},
		{
			name: "Moving LED Bar",
			slug: "moving-led-bar",
			price: 399,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt09.png",
			description: "Moving LED Bar med 10×15W RGBW och 180° spridningsvinkel.",
			includes: [
				"10×15W RGBW 4-i-1 LED",
				"180° spridningsvinkel, strobe 1–30Hz",
				"DMX 7/13/43 kanaler",
				"Mått 985×153×73 mm, 12 kg"
			],
			alt: "Moving LED Bar",
			bulky: false,
			artno: "SK-LJS-EFF-0017",
			group: "moving-head",
			tag: "Moving LED Bar",
			video: "Betopper_L1015_short_720p.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 399
				},
				{
					minQty: 2,
					unitPrice: 350
				}
			]
		},
		{
			name: "Moving Head Bar (4-huvud)",
			slug: "mh-bar-4",
			price: 499,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt08.png",
			description: "Moving Head Bar med 4 oberoende huvuden. 10W Quad-LED RGBW.",
			includes: [
				"4 huvuden oberoende styrning",
				"10W Quad-LED (RGBW), 11° strålv.",
				"540°/270° panorering/lutning",
				"Mått 810×250×130 mm, 7,5 kg"
			],
			alt: "Moving Head Bar 4-huvud",
			bulky: false,
			artno: "SK-LJS-EFF-0018",
			group: "moving-head",
			tag: "Moving Head Bar",
			video: "cameo_hydrabeam_400_4x10W_Cree_rgbw_05.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 499
				},
				{
					minQty: 2,
					unitPrice: 450
				}
			]
		}
	]
};
const rok = {
	pluggImage: "/images/ljus/plugg_rok.png",
	products: [
		{
			name: "Rökmaskin (1500W)",
			slug: "rokmaskin-1500",
			price: 349,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt23.png",
			description: "Rökmaskin med inbyggd RGB-belysning. Inkl 1 l rökvätska. Volymrabatt från 2 st.",
			includes: [
				"6x3W LED RGB",
				"Dimeffekt: 85 m³/min",
				"Trådlös fjärrkontroll",
				"Inkl 1 l rökvätska",
				"Vikt: 5 kg"
			],
			alt: "Rökmaskin (1500W)",
			bulky: false,
			artno: "SK-LJS-ROK-0001",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 349
				},
				{
					minQty: 2,
					unitPrice: 325
				},
				{
					minQty: 4,
					unitPrice: 312
				}
			]
		},
		{
			name: "Rökmaskin (650W)",
			slug: "rokmaskin-650",
			price: 449,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt24.png",
			description: "Kraftfullare rökmaskin med 12 RGB-lampor. Inkl 1 l rökvätska. Volymrabatt från 2 st.",
			includes: [
				"12x3W LED RGB",
				"Dimeffekt: 125 m³/min",
				"Trådlös fjärrkontroll",
				"Inkl 1 l rökvätska",
				"Vikt: 10 kg"
			],
			alt: "Rökmaskin (650W)",
			bulky: false,
			artno: "SK-LJS-ROK-0002",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 449
				},
				{
					minQty: 2,
					unitPrice: 425
				},
				{
					minQty: 4,
					unitPrice: 425
				}
			]
		},
		{
			name: "Kallgnistmaskin",
			slug: "kallgnistmaskin",
			price: 499,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_effekt25.png",
			description: "Cold spark machine för scen, bröllop eller fest. Kräver granulat. Volymrabatt från 2 st.",
			includes: [
				"700W",
				"Förvärmningstid: ca 4 min",
				"DMX 512",
				"Granulat: 200g = ca 6 min",
				"Vikt: 8 kg"
			],
			alt: "Kallgnistmaskin",
			bulky: false,
			artno: "SK-LJS-ROK-0003",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 499
				},
				{
					minQty: 2,
					unitPrice: 475
				},
				{
					minQty: 4,
					unitPrice: 450
				}
			]
		},
		{
			name: "Konfettiavfyrare",
			slug: "konfettiavfyrare",
			price: 499,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_confettimaskin.png",
			description: "Konfettiavfyrare som skjuter av ett konfettirör – perfekt för firanden och shower.",
			includes: [
				"Elektrisk avfyrare",
				"Inkl konfettirör"
			],
			alt: "Konfettiavfyrare",
			bulky: false,
			artno: "SK-LJS-ROK-0004"
		},
		{
			name: "Hazer HZ-1500 Pro",
			slug: "hazer-hz1500",
			price: 649,
			priceNote: "/st/dygn",
			image: "/images/ljus/pp_ljus_rok3.png",
			alt: "Stairville HZ-1500 Pro Hazer DMX i flightcase",
			description: "Professionell hazer som skapar ett finfördelat dis — perfekt för att synliggöra ljusstrålar. Inkl 1 l rökvätska. Volymrabatt vid 2 st.",
			includes: [
				"DMX-styrning",
				"Kontinuerlig dis-produktion",
				"Stabil output utan pulsar",
				"Inkl 1 l rökvätska",
				"Flightcase-monterad"
			],
			artno: "SK-LJS-ROK-0005",
			bulky: false,
			video: "/videos/hazer-hz1500.mp4",
			volumePricing: [
				{
					minQty: 1,
					unitPrice: 649
				},
				{
					minQty: 2,
					unitPrice: 600
				}
			]
		}
	],
	tillbehor: [
		{
			name: "Ackrylatbensin 1 l",
			slug: "ackrylatbensin-1l",
			price: 59,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_ackrylatbensin_1L.png",
			alt: "Aspen 4 Ackrylatbensin 1 liter",
			desc: "Aspen 4 · ren alkylat · 4-taktsmotorer",
			artno: "SK-LJS-ROK-ACC-0001",
			bulky: false
		},
		{
			name: "Ackrylatbensin 5 l",
			slug: "ackrylatbensin-5l",
			price: 239,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_ackrylatbensin_5L.png",
			alt: "Aspen 4 Ackrylatbensin 5 liter",
			desc: "Aspen 4 · ren alkylat · 4-taktsmotorer",
			artno: "SK-LJS-ROK-ACC-0002",
			bulky: false
		},
		{
			name: "Granulat 100 g (~3 min)",
			slug: "granulat-100g",
			price: 299,
			priceNote: "/påse",
			image: "/images/ljus/pp_ljus_granulat.png",
			alt: "Granulat till Cold Spark-maskin 100 gram",
			desc: "Till kallgnistmaskin · ca 3 min",
			artno: "SK-LJS-ROK-ACC-0003",
			bulky: false
		},
		{
			name: "Granulat 200 g (~6 min)",
			slug: "granulat-200g",
			price: 479,
			priceNote: "/påse",
			image: "/images/ljus/pp_ljus_granulat.png",
			alt: "Granulat till Cold Spark-maskin 200 gram",
			desc: "Till kallgnistmaskin · ca 6 min",
			artno: "SK-LJS-ROK-ACC-0004",
			bulky: false
		},
		{
			name: "Rökvätska 1 l",
			slug: "rokvatska-1l",
			price: 119,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_rokvatska1.png",
			alt: "Rökvätska 1 liter Eurolite P",
			desc: "Standard · alla rökmaskiner",
			artno: "SK-LJS-ROK-ACC-0005",
			bulky: false
		},
		{
			name: "Rökvätska 3 l",
			slug: "rokvatska-3l",
			price: 239,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_rokvatska2.png",
			alt: "Rökvätska 3 liter Stairville E-C",
			desc: "Standard · alla rökmaskiner",
			artno: "SK-LJS-ROK-ACC-0006",
			bulky: false
		},
		{
			name: "Rökvätska 5 l",
			slug: "rokvatska-5l",
			price: 319,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_rokvatska4.png",
			alt: "Rökvätska 5 liter ADJ Fog Juice",
			desc: "Standard · alla rökmaskiner",
			artno: "SK-LJS-ROK-ACC-0007",
			bulky: false
		},
		{
			name: "Rökvätska 5 l (Haze)",
			slug: "rokvatska-5l-haze",
			price: 339,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_rokvatska3.png",
			alt: "Rökvätska 5 liter Stairville PHF Haze",
			desc: "Haze-fluid · till hazers",
			artno: "SK-LJS-ROK-ACC-0008",
			bulky: false
		},
		{
			name: "Konfettirör, Multifärg",
			slug: "konfettirör-multi",
			price: 119,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_confettirör_multi.png",
			desc: "Extra rör till konfettiavfyraren",
			artno: "SK-LJS-ROK-ACC-0009"
		},
		{
			name: "Konfettirör, Vit (snö)",
			slug: "konfettirör-vit",
			price: 119,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_confettirör_vit.png",
			desc: "Extra rör till konfettiavfyraren",
			artno: "SK-LJS-ROK-ACC-0010"
		},
		{
			name: "Konfettirör, Guld",
			slug: "konfettirör-guld",
			price: 139,
			priceNote: "/st",
			image: "/images/ljus/pp_ljus_confettirör_guld.png",
			desc: "Extra rör till konfettiavfyraren",
			artno: "SK-LJS-ROK-ACC-0011"
		}
	]
};
const stativ = {
	pluggImage: "/images/ljus/plugg_t-stativ-tross.png",
	products: [
		{
			name: "Stativ med T-bar (400 mm)",
			slug: "stativ-400",
			price: 40,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_stativ06.png",
			description: "Ljusstativ standard med 400 mm T-bar. Upp till 2,4 m höjd, max 20 kg.",
			includes: [
				"T-bar: 400 mm",
				"Höjd: 1,25–2,40 m",
				"Max 20 kg",
				"Vikt: 3,7 kg"
			],
			alt: "Stativ med T-bar (400 mm)",
			bulky: false,
			artno: "SK-LJS-STV-0001"
		},
		{
			name: "Stativ med T-bar (1200 mm)",
			slug: "stativ-1200",
			price: 40,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_stativ_1200.png",
			description: "Ljusstativ standard med 1200 mm T-bar. Plats för upp till 4 effekter.",
			includes: [
				"T-bar: 1200 mm",
				"Höjd: 1,25–2,40 m",
				"Max 20 kg",
				"Vikt: 3,7 kg"
			],
			alt: "Stativ med T-bar (1200 mm)",
			bulky: false,
			artno: "SK-LJS-STV-0002"
		},
		{
			name: "Stativ med T-bar (900 mm, premium)",
			slug: "stativ-900p",
			price: 60,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_stativ01.png",
			description: "Premiumstativ med 900 mm T-bar. Upp till 2,5 m höjd, max 30 kg.",
			includes: [
				"T-bar: 900 mm",
				"Höjd: 1,10–2,50 m",
				"Max 30 kg",
				"Vikt: 5,8 kg"
			],
			alt: "Stativ med T-bar (900 mm, premium)",
			bulky: false,
			artno: "SK-LJS-STV-0003"
		},
		{
			name: "Vevstativ med T-bar (1200 mm)",
			slug: "vevstativ-1200",
			price: 120,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_stativ02.png",
			description: "Premiumvevstativ med 1200 mm T-bar. Upp till 3,7 m höjd, max 35 kg.",
			includes: [
				"T-bar: 1200 mm",
				"Höjd: 1,70–3,70 m",
				"Max 35 kg",
				"Vikt: 20 kg"
			],
			alt: "Vevstativ med T-bar (1200 mm)",
			bulky: false,
			artno: "SK-LJS-STV-0004"
		},
		{
			name: "Trosstorn 1,0 m",
			slug: "tross-1m",
			price: 300,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_tross01.png",
			description: "Trosstorn med basplatta + 1,0 m 4-punktstross + topplatta. Max 50 kg.",
			includes: [
				"4-punkts tross",
				"Höjd: 1,0 m",
				"Max 50 kg",
				"Vikt: 16 kg"
			],
			alt: "Trosstorn 1,0 m",
			bulky: false,
			artno: "SK-LJS-STV-0005"
		},
		{
			name: "Trosstorn 1,5 m",
			slug: "tross-15m",
			price: 360,
			priceNote: "/dygn",
			image: "/images/ljus/pp_ljus_tross03.png",
			description: "Trosstorn med basplatta + 1,5 m 4-punktstross + topplatta. Max 50 kg.",
			includes: [
				"4-punkts tross",
				"Höjd: 1,5 m",
				"Max 50 kg",
				"Vikt: 18 kg"
			],
			alt: "Trosstorn 1,5 m",
			bulky: false,
			artno: "SK-LJS-STV-0006"
		}
	]
};
const faq$1 = [
	{
		q: "Måste jag ha DMX-kontroller för att styra ljuset?",
		a: "Nej – alla våra paket och de flesta effekter har automatiska program och musikstyrning inbyggd. Du pluggar in strömmen och ljuset sköter sig självt. DMX-kontroller är ett alternativ för den som vill ha full manuell kontroll, men det krävs inte för ett lyckat event."
	},
	{
		q: "Hur lång tid tar det att montera ett ljuspaket?",
		a: "Beroende på paket tar det 8–25 minuter. Instruktioner medföljer och allt är konstruerat för enkel montering utan verktyg. Färdiga paket Small och Small+ tar ca 8–10 minuter, medan Large-paket med trosstorn tar 20–25 minuter."
	},
	{
		q: "Kan jag hyra bara ett par LED PAR-lampor?",
		a: "Ja, du kan hyra enstaka armaturer – allt från 1 st LED PAR. Vi erbjuder volymrabatt vid fler enheter. Se priser per 1, 4, 8 och 16 st på sidan Lösa Effekter."
	},
	{
		q: "Får jag ha rökmaskin inomhus?",
		a: "Rökvätska i moderna rökmaskiner utlöser normalt inte brandlarm. Det beror dock på lokal och typ av brandvarnare – stäm alltid av med lokalen i förväg. Vi rekommenderar att meddela lokalens personal och ha god ventilation."
	},
	{
		q: "Vad skiljer kallgnistmaskin från vanlig pyroteknisk effekt?",
		a: "Kallgnistmaskiner är elektriska och producerar kalla gnistor (~50°C) utan öppen låga – du kan hålla handen i gnistsvansen utan att bränna dig. De klassas inte som pyroteknik, kräver inget tillstånd och är säkra att använda inomhus på de flesta lokaler."
	},
	{
		q: "Ingår stativer och kablar i hyrespriset?",
		a: "Ja – alla ljuspaket levereras komplett med stativer, kablar och nödvändiga adaptrar, testade och kalibrerade. Du behöver bara ett vanligt eluttag (230V). Vid enstaka effekter ingår monteringsfäste men inte stativ, om inget annat anges."
	},
	{
		q: "Erbjuder ni ljustekniker som kan sköta utrustningen?",
		a: "Ja, vi erbjuder ljustekniker för professionella events. Kontakta oss för offert. Färdiga paket är dock designade för att fungera utan tekniker – automatiska program och musikstyrning gör att du klarar dig utmärkt på egen hand."
	},
	{
		q: "Vad kostar leverans och kan ni montera utrustningen?",
		a: "Vi erbjuder leverans och montering/demontering i hela Storstockholm – kontakta oss för offert baserat på eventets storlek och plats. Hämtning i butik är alltid kostnadsfri. Alla priser på sidan gäller vid självhämtning."
	},
	{
		q: "Kan jag kombinera ljus- och ljudhyrning?",
		a: "Absolut – det är faktiskt det vanligaste. Vi hjälper dig sätta ihop ett komplett paket med ljud, ljus och eventuellt scen. Kontakta oss för ett samlat offert, då kan vi även optimera leveranslogistiken."
	},
	{
		q: "Hur långt i förväg behöver jag boka?",
		a: "Vi rekommenderar 1–2 veckor för enklare hyror och 3–4 veckor för större event eller om du vill ha tekniker. Under högsäsong (april–juni, september–december) är det extra viktigt att boka tidigt eftersom populära paket snabbt blir fullbokade."
	}
];
const ljusData = {
	metaTitle: metaTitle$1,
	metaDescription: metaDescription$1,
	categories: categories,
	paket: paket,
	effekter: effekter,
	rok: rok,
	stativ: stativ,
	faq: faq$1
};

const metaTitle = "Hyra DJ Stockholm – Professionell DJ & DJ-utrustning | Scenkonsult";
const metaDescription = "Hyr professionell DJ till fest, bröllop och event i Stockholm från 1 999 kr. Eller hyr DJ-utrustning från Numark och Denon. Leverans i hela Storstockholm.";
const djPhotos = [
	{
		name: "DJ Aasma",
		img: "/images/dj/DJ_Aasma.png"
	},
	{
		name: "DJ Måns",
		img: "/images/dj/DJ_Mans.png"
	},
	{
		name: "DJ Fuse",
		img: "/images/dj/DJ_Fuse.png"
	},
	{
		name: "DJ SweZig",
		img: "/images/dj/DJ_SweZig.png"
	}
];
const decades = [
	{
		decade: "70-tal",
		history: "Under 70-talet formades den moderna dansen på diskotek och nattklubbar världen över. I Sverige influerades vi av klubben Alexandra på Biblioteksgatan i Stockholm och klassiska Studio 54 i NYC.",
		artists: "Earth Wind & Fire, Diana Ross, Bee Gees, Kool & The Gang, Sister Sledge, Donna Summer, ABBA",
		ageGroup: "Passar bäst 45–75+ år, men fungerar för alla."
	},
	{
		decade: "80-tal",
		history: "På 80-talet fanns musik bara på vinyl och kassett. Satellitkanaler som Music Box och MTV räddade oss ur radions enformighet.",
		artists: "Madonna, Prince, Michael Jackson, Pet Shop Boys, Rick Astley, Bananarama, George Michael, Alphaville, Ratata, Tommy Nilsson",
		ageGroup: "Passar bäst 35–75+ år, men fungerar för alla."
	},
	{
		decade: "90-tal",
		history: "90-talet tog musiken från vinyl till CD och lade grunden för den digitala eran. Radio privatiserades – Rix FM, NRJ, Megapol och Z-TV tog över musikspridningen.",
		artists: "Ace of Base, E-Type, Backstreet Boys, Celine Dion, Rednex, No Doubt, Coolio, Ten Sharp, Savage Garden",
		ageGroup: "Passar bäst 30–70 år, men fungerar för alla."
	},
	{
		decade: "00-tal",
		history: "00-talet tog musiken från CD till USB och tidiga MP3-spelare. Vem minns inte Winamp eller Jens of Sweden som tidigt lanserade MP3-spelaren?",
		artists: "Britney Spears, Eminem, 50 Cent, Christina Aguilera, Kent, Darin, Agnes, The Ark, Katy Perry, Markoolio",
		ageGroup: "Passar bäst 25–60 år, men fungerar för alla."
	},
	{
		decade: "10-tal",
		history: "10-talet tog musiken från MP3 till streaming och gjorde den rumsren efter år av illegal nedladdning. Spotify förändrade allt.",
		artists: "Avicii, Beyoncé, Lady Gaga, Robyn, Bruno Mars, Daft Punk, Erik Saade, Adele, Ed Sheeran, David Guetta",
		ageGroup: "Passar bäst 20–50 år, men fungerar för alla."
	},
	{
		decade: "20-tal",
		history: "Dagens musik som spelas på klubbar – en viktig ingrediens framförallt för Generation Z.",
		artists: "The Weeknd, Dua Lipa, Kygo, Hov1, Miss Li, Victor Leksell, Zara Larsson, Ava Max, Ariana Grande",
		ageGroup: "Passar bäst 18–35 år, men fungerar för alla."
	}
];
const djService = {
	image: "/images/dj/pp_DJ_DJ-service.png",
	note: "DJ-hårdvara ingår. Resa, scen, ljud och ljus tillkommer.",
	priceTable: [
		{
			hours: "2 tim",
			junior: 1999,
			juniorInkl: 2499,
			senior: 2399,
			seniorInkl: 2999
		},
		{
			hours: "3 tim",
			junior: 2599,
			juniorInkl: 3249,
			senior: 3199,
			seniorInkl: 3999
		},
		{
			hours: "4 tim",
			junior: 3199,
			juniorInkl: 3999,
			senior: 3999,
			seniorInkl: 4999
		}
	],
	description: "Vi har 6 st professionella DJs med mångårig erfarenhet från nattklubbar, bröllop, studentfester och företagsevent. Spelar 70/80/90/00/10/20-tals musik i alla genre. Kvällen utformas efter önskemål.",
	alt: "Hyr Professionell DJ",
	includes: [
		"6 professionella DJs att välja bland",
		"70-tal till idag – alla genre",
		"Kvällen utformas efter dina önskemål",
		"DJ-hårdvara (digital) ingår",
		"Resa, scen, ljud och ljus tillkommer"
	]
};
const equipment = [
	{
		name: "DJ-controller, Standalone (Numark Mixstream Pro+)",
		slug: "dj-controller-numark",
		price: 799,
		priceNote: "/dygn",
		image: "/images/dj/pp_DJ_small.png",
		description: "Standalone DJ-controller. Stödjer Amazon Music, Tidal, Beatport, SoundCloud Go+, Serato DJ m.fl. Inbyggd 7\" touch-display och fyra effekter.",
		includes: [
			"Standalone – ingen dator krävs",
			"7\" högupplöst touch-display",
			"Amazon Music, Tidal, Beatport, SoundCloud, Serato DJ",
			"4 inbyggda effekter (Echo, Flanger, Delay, Phaser)",
			"2x6\" touch-jog wheels",
			"DMX-styrning"
		],
		alt: "Numark Mixstream Pro+",
		artno: "SK-DJ-0001"
	},
	{
		name: "DJ-controller, Standalone (Denon Prime GO+)",
		slug: "dj-controller-denon-go",
		price: 999,
		priceNote: "/dygn",
		image: "/images/dj/pp_DJ_denon_go_plus.png",
		description: "Bärbar standalone DJ-controller med inbyggt batteri (upp till 4 tim). Bluetooth för trådlösa högtalare. 26 Main FX, 2 Sweep FX, 10 Touch FX.",
		includes: [
			"Standalone – ingen dator krävs",
			"Upp till 4 tim batteridrift",
			"Bluetooth sändare för trådlösa högtalare",
			"26 Main FX, 2 Sweep FX, 10 Touch FX",
			"Amazon Music, Tidal, Beatport, SoundCloud"
		],
		alt: "Denon Prime GO+",
		artno: "SK-DJ-0002"
	},
	{
		name: "DJ-controller, Standalone (Denon Prime 4+)",
		slug: "dj-controller-denon-prime4",
		price: 1499,
		priceNote: "/dygn",
		image: "/images/dj/pp_DJ_large1.png",
		description: "Världens mest kraftfulla fristående DJ-system. Fyra deck, Stems-separation, Amazon Music, TIDAL, Beatsource, Beatport, Soundcloud GO+, Serato DJ.",
		includes: [
			"4 fristående deck",
			"Stems-separation (branschens första fristående)",
			"Amazon Music, TIDAL, Beatsource, Beatport, Serato",
			"Oberoende zonutgång för separat lounge",
			"2 mikrofonkanaler med EQ och talkover"
		],
		alt: "Denon Prime 4+",
		artno: "SK-DJ-0003"
	},
	{
		name: "DJ-system, Rane System One",
		slug: "dj-rane-system-one",
		price: 1999,
		priceNote: "/dygn",
		image: "/images/dj/pp_DJ_large2.png",
		description: "Världens första all-in-one DJ-system med motoriserade 7,2\" aluminiumtallrikar. Engine DJ inbyggt med Serato DJ-stöd.",
		includes: [
			"Motoriserade 7,2\" aluminiumtallrikar",
			"Engine DJ inbyggt + Serato DJ",
			"Fader FX, Sweep FX, Touch FX, Main FX",
			"Stems-separation",
			"Laptop-fri drift"
		],
		alt: "Rane System One",
		artno: "SK-DJ-0004"
	},
	{
		name: "DJ-bord",
		slug: "dj-bord",
		price: 80,
		priceNote: "/dygn",
		image: "/images/dj/pp_DJ_bord.png",
		description: "Portabelt DJ-bord som rymmer DJ-controller. Hopfällbart, lätt att frakta.",
		includes: [
			"Material: Metall",
			"Mått (BxDxH): 1000 x 480 x (700–900) mm",
			"Vikt: 11 kg"
		],
		alt: "DJ-bord portabelt",
		artno: "SK-DJ-0005"
	},
	{
		name: "DJ-bord med front- och sidopaneler",
		slug: "dj-bord2",
		price: 200,
		priceNote: "/dygn",
		image: "/images/dj/pp_DJ_bord2.png",
		description: "Portabelt DJ-bord med front- och sidopaneler som rymmer DJ-controller.",
		includes: [
			"Material: Aluminium/tyg",
			"Mått (BxDxH): 1203 x 605 x 1125 mm",
			"Vikt: 14 kg"
		],
		alt: "DJ-bord med kläde",
		artno: "SK-DJ-0006"
	},
	{
		name: "Hyr Scenengineer",
		slug: "scenengineer",
		price: 952,
		priceNote: "/tim",
		image: "/images/dj/pp_DJ_engineer.png",
		description: "Hyr en scenengineer till livespelningen eller festen. Vi har tekniker på olika nivåer som kan styra ljud, ljus och bild.",
		includes: [
			"952 kr/tim exkl moms (1 190 kr inkl)"
		],
		alt: "Scenengineer",
		artno: "SK-DJ-0007"
	},
	{
		name: "Hyr Rörlig media-editor",
		slug: "media-editor",
		price: 952,
		priceNote: "/tim",
		image: "/images/dj/pp_DJ_media-editor.png",
		description: "Hyr en media-editor för att skapa rörligt innehåll för skärmar och presentationer.",
		includes: [
			"Fotograf fast media: 600 kr/tim (750 inkl moms)",
			"Fotograf rörligt media: 792 kr/tim (990 inkl moms)",
			"AI-specialist: 1 592 kr/tim (1 990 inkl moms)"
		],
		alt: "Rörlig media-editor",
		artno: "SK-DJ-0008"
	}
];
const intro = "Hyr professionell DJ eller DJ-utrustning i Stockholm. Vi har 6 erfarna DJs med mångårig erfarenhet från klubbar, bröllop och företagsevent.";
const faq = [
	{
		q: "Ingår ljud och ljus när man hyr DJ?",
		a: "DJ-hårdvara (dator/controller) ingår i priset. Ljud och ljusutrustning hyrs separat – vi hjälper er med hela paketet."
	},
	{
		q: "Hur lång tid i förväg behöver jag boka?",
		a: "Vi rekommenderar att du bokar minst 4–6 veckor i förväg för att säkra en specifik DJ. Kortare ledtid kan fungera vid ledighet."
	},
	{
		q: "Kan DJ:n ta önskemål på plats?",
		a: "Ja, alla våra DJs spelar efter önskemål. Du kan diskutera musikval, tema och stämning i förväg via mejl eller telefon."
	},
	{
		q: "Kan jag hyra bara DJ-bordet utan DJ?",
		a: "Ja, vi hyr ut alla DJ-controllers separat. Perfekt för den som vill mixa själv."
	},
	{
		q: "Spelar ni utomhus?",
		a: "Ja, vi spelar inomhus och utomhus. Komplettera med vårt ljud- och ljuspaket för utomhusbruk."
	}
];
const dj = {
	metaTitle: metaTitle,
	metaDescription: metaDescription,
	djPhotos: djPhotos,
	decades: decades,
	djService: djService,
	equipment: equipment,
	intro: intro,
	faq: faq
};

const products = [
	{
		name: "Projektor (XGA)",
		slug: "projektor-xga",
		price: 299,
		priceNote: "/dygn",
		image: "/images/bild/pp_bild_projektor.png",
		description: "Miniprojektor Toshiba med XGA-upplösning (1024×768). Utmärkt för presentationer. Klarar 60″–100\".",
		includes: [
			"1024×768 (XGA)",
			"Klarar SXGA 1280×1024",
			"1100 ANSI lumen",
			"Bildförhållande 16:9",
			"Vikt: 0,9 kg"
		],
		alt: "Projektor (XGA)",
		bulky: false,
		artno: "SK-BLD-0001"
	},
	{
		name: "Projektor (FHD)",
		slug: "projektor-fhd",
		price: 399,
		priceNote: "/dygn",
		image: "/images/bild/pp_bild_projektor1.png",
		description: "BenQ Full HD-projektor (1920×1080). Fungerar i dagsljus. Klarar 60\"–300\".",
		includes: [
			"Full HD 1920×1080",
			"3200 ANSI lumen",
			"Bildförhållande 16:9",
			"Vikt: 2,6 kg"
		],
		alt: "Projektor (FHD)",
		bulky: false,
		artno: "SK-BLD-0002"
	},
	{
		name: "65\" Skärm (4K UHD)",
		slug: "skarm-65",
		price: 2399,
		priceNote: "/dygn",
		image: "/images/bild/pp_bild_65-skarm.png",
		description: "65\" Samsung professionell 4K-skärm (3840×2160). Perfekt för fest-, event- eller möteslokal.",
		includes: [
			"65\" Samsung",
			"Ultra HD 3840×2160",
			"VESA 400×300",
			"Vikt: 30,9 kg",
			"Skrymmande – transport tillkommer"
		],
		alt: "65\" Skärm (4K UHD)",
		bulky: true,
		artno: "SK-BLD-0003"
	},
	{
		name: "75\" Skärm (4K UHD)",
		slug: "skarm-75",
		price: 2799,
		priceNote: "/dygn",
		image: "/images/bild/pp_bild_75-skarm.png",
		description: "75\" Samsung professionell 4K-skärm (3840×2160). Perfekt för event eller möteslokal.",
		includes: [
			"75\" Samsung",
			"Ultra HD 3840×2160",
			"VESA 400×300",
			"Vikt: 30,9 kg",
			"Skrymmande – transport tillkommer"
		],
		alt: "75\" Skärm (4K UHD)",
		bulky: true,
		artno: "SK-BLD-0004"
	},
	{
		name: "Moduluppbyggd LED-skärm (FHD)",
		slug: "modulskarm-fhd",
		price: 1199,
		priceNote: "/kvm/dygn",
		image: "/images/bild/pp_bild_modulskarm.png",
		description: "Moduluppbyggd storbildsskärm Full HD. Start från 3,75 m² (4 496 kr exkl moms). Utomhus, scen eller mässa. Inkl transport och montering.",
		includes: [
			"Full HD 1920×1080",
			"Ljusstyrka 5000 nits",
			"Pris per kvm",
			"Strömbehov 3-fas 16A",
			"Kräver inhägnat/bevakat område utomhus"
		],
		alt: "Moduluppbyggd LED-skärm (FHD)",
		bulky: true,
		artno: "SK-BLD-0005"
	},
	{
		name: "LED-skärm på trailer (FHD)",
		slug: "trailer-skarm",
		price: 15499,
		priceNote: "/dygn",
		image: "/images/bild/pp_bild_trailer_skarm.png",
		description: "7 m² mobil storbildsskärm på trailer. Full HD. Optimalt avstånd ca 9–12 m. Inkl transport och montering.",
		includes: [
			"7 m² (1587\")",
			"Full HD 1920×1080",
			"Ljusstyrka 5000 nits",
			"Strömbehov 3-fas 16A",
			"Kräver inhägnat/bevakat område utomhus"
		],
		alt: "LED-skärm på trailer (FHD)",
		bulky: true,
		artno: "SK-BLD-0006"
	}
];
const tillbehor = [
	{
		name: "Projektorbord",
		price: 160,
		priceNote: "/dygn",
		desc: "Projektorbord",
		image: "/images/bild/pp_bild_projektorstativ.png",
		bulky: false,
		artno: "SK-BLD-ACC-0001"
	},
	{
		name: "Projektorduk 100\"",
		price: 400,
		priceNote: "/dygn",
		desc: "Projektorduk 100\"",
		image: "/images/bild/pp_bild_100-duk.png",
		bulky: false,
		artno: "SK-BLD-ACC-0002"
	},
	{
		name: "Golvstativ 65\"/75\"",
		price: 240,
		priceNote: "/dygn",
		desc: "Golvstativ för 65\" och 75\" skärmar",
		image: "/images/bild/pp_bild_skarmststiv.png",
		bulky: false,
		artno: "SK-BLD-ACC-0003"
	},
	{
		name: "HDMI-kabel, 5 m",
		price: 48,
		priceNote: "/dygn",
		desc: "HDMI 2.0, upp till 4K UHD",
		image: "/images/bild/pp_bild_HDMI.png",
		bulky: false,
		artno: "SK-BLD-ACC-0004"
	},
	{
		name: "HDMI-kabel, 10 m",
		price: 60,
		priceNote: "/dygn",
		desc: "HDMI 2.0, upp till 4K UHD",
		image: "/images/bild/pp_bild_HDMI.png",
		bulky: false,
		artno: "SK-BLD-ACC-0005"
	},
	{
		name: "HDMI-splitter (4-port)",
		price: 400,
		priceNote: "/dygn",
		desc: "4-portars HDMI-splitter, upp till 4K UHD 60Hz",
		image: "/images/bild/pp_bild_HDMI-splitter.png",
		bulky: false,
		artno: "SK-BLD-ACC-0006"
	},
	{
		name: "Mediaspelare 4K",
		price: 400,
		priceNote: "/dygn",
		desc: "Mediaspelare 4K för rörligt innehåll på skärm",
		image: "/images/bild/pp_bild_mediaspelare.png",
		bulky: false,
		artno: "SK-BLD-ACC-0007"
	},
	{
		name: "Scenmonitor 23\"",
		price: 480,
		priceNote: "/dygn",
		desc: "Extra 23\" monitor till scenen",
		image: "/images/bild/pp_bild_23-skarm.png",
		bulky: false,
		artno: "SK-BLD-ACC-0008"
	},
	{
		name: "USB \"Clicker\"",
		price: 60,
		priceNote: "/dygn",
		desc: "USB-clicker för talaren, räckvidd ca 30 m",
		image: "/images/bild/pp_bild_USB-clicker.png",
		bulky: false,
		artno: "SK-BLD-ACC-0009"
	}
];
const bildData = {
	products: products,
	tillbehor: tillbehor};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro("https://scenkonsult.se");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const svenProducts = {};
  scenData.products.forEach((p) => {
    if (p.id && p.price) svenProducts[`scen-${p.id}`] = { name: p.name, price: p.price, category: "Scen" };
  });
  ["event", "live", "music", "portable"].forEach((sec) => {
    (ljudData[sec]?.products || []).forEach((p) => {
      if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Ljud" };
    });
  });
  (ljudData.mixers || []).forEach((p) => {
    if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Ljud" };
  });
  ["paket", "effekter"].forEach((sec) => {
    (ljusData[sec]?.products || []).forEach((p) => {
      if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Ljus" };
    });
  });
  (ljusData.rok?.products || []).forEach((p) => {
    if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Ljus" };
  });
  (ljusData.rok?.tillbehor || []).forEach((p) => {
    if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Ljus tillbeh\xF6r" };
  });
  Object.values(dj.equipment || {}).forEach((p) => {
    if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "DJ" };
  });
  (bildData.products || []).forEach((p) => {
    if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Bild" };
  });
  (bildData.tillbehor || []).forEach((p) => {
    if (p.slug && p.price) svenProducts[p.slug] = { name: p.name, price: p.price, category: "Bild" };
  });
  const {
    title = "Hyra Scen, Ljud & Ljus Stockholm | Scenkonsult \u2013 Sedan 1986",
    description = "Uthyrning av scen, ljud, ljus, bild och DJ-utrustning f\xF6r fest, br\xF6llop, event och konsert. Komplett scenproduktion i Stockholm. Leverans och montering. Sedan 1986.",
    image = "/images/hero/scen3_hero.webp",
    schemaExtra
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, "https://scenkonsult.se");
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Scenkonsult Norden",
    "legalName": "Sigvardsson Consulting Group",
    "url": "https://scenkonsult.se",
    "telephone": "+46724481000",
    "email": "info@scenkonsult.se",
    "logo": "https://scenkonsult.se/logo-white.png",
    "image": "https://scenkonsult.se/images/hero/scen3_hero.webp",
    "description": "Uthyrning av scen, ljud, ljus, bild och DJ-utrustning f\xF6r fest, br\xF6llop, event och konsert i Stockholm. Leverans och montering. Sedan 1986.",
    "foundingDate": "1986",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Grimstagatan 164",
      "addressLocality": "V\xE4llingby",
      "postalCode": "162 58",
      "addressRegion": "Stockholms l\xE4n",
      "addressCountry": "SE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 59.3636,
      "longitude": 17.8784
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "areaServed": [
      "Stockholm",
      "Solna",
      "Nacka",
      "J\xE4rf\xE4lla",
      "T\xE4by",
      "Huddinge",
      "Sundbyberg",
      "Tyres\xF6",
      "Liding\xF6",
      "V\xE4rmd\xF6",
      "Eker\xF6",
      "Danderyd",
      "Sigtuna"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Uthyrning av eventutrustning",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hyra scen" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hyra PA-system och ljud" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hyra ljusutrustning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hyra DJ-utrustning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hyra projektor och bildsk\xE4rm" } }
      ]
    },
    "sameAs": [
      "https://www.google.com/maps/search/Scenkonsult+Norden"
    ]
  };
  return renderTemplate(_b || (_b = __template(['<html lang="sv"> <head><!-- GTM laddas endast efter cookie-samtycke --><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><link rel="canonical"', '><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:locale" content="sv_SE"><meta property="og:site_name" content="Scenkonsult Norden"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', "><title>", '</title><link rel="icon" type="image/png" href="/logo-icon.png"><!-- Structured data \u2014 LocalBusiness (global) --><script type="application/ld+json">', "<\/script><!-- Structured data \u2014 page-specific -->", '<!-- Preconnect for fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', `</head> <body> <!-- Cookie-banner --> <div id="sk-cookie-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:99999;background:rgba(12,10,36,0.97);border-top:1px solid rgba(196,181,244,0.25);padding:1rem 1.5rem;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;"> <p style="margin:0;color:rgba(255,255,255,0.7);font-size:0.875rem;font-family:'Space Grotesk',sans-serif;max-width:700px;">
Vi anv\xE4nder cookies f\xF6r bes\xF6ksstatistik (Google Analytics) f\xF6r att f\xF6rb\xE4ttra sajten.
<a href="/personuppgiftpolicy/" style="color:#c4b5f4;text-decoration:underline;">L\xE4s mer</a> </p> <div style="display:flex;gap:0.75rem;flex-shrink:0;"> <button id="sk-cookie-decline" style="padding:0.5rem 1.1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.6);font-size:0.875rem;cursor:pointer;font-family:'Space Grotesk',sans-serif;">
Avvisa
</button> <button id="sk-cookie-accept" style="padding:0.5rem 1.25rem;border-radius:0.5rem;border:none;background:#c4b5f4;color:#0c0a24;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif;">
Godk\xE4nn
</button> </div> </div> <script>
    (function() {
      var CONSENT_KEY = 'sk_cookie_consent';
      var CONSENT_DAYS = 395; // 13 m\xE5nader per personuppgiftspolicyn

      function getConsent() {
        try {
          var raw = localStorage.getItem(CONSENT_KEY);
          if (!raw) return null;
          var data = JSON.parse(raw);
          // Gammalt format (str\xE4ng) \u2014 migrera till nytt format med utg\xE5ngsdatum
          if (typeof data === 'string') {
            setConsent(data); // spara om med expires
            return data;
          }
          // Kolla utg\xE5ngsdatum
          if (data.expires && Date.now() > data.expires) {
            localStorage.removeItem(CONSENT_KEY);
            return null;
          }
          return data.value;
        } catch { return null; }
      }

      function setConsent(value) {
        var expires = Date.now() + CONSENT_DAYS * 24 * 60 * 60 * 1000;
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: value, expires: expires }));
      }

      var consent = getConsent();
      var banner = document.getElementById('sk-cookie-banner');

      // Visa eller d\xF6lj bannern explicit
      if (!consent) {
        if (banner) banner.style.display = 'flex';
      } else {
        if (banner) banner.style.display = 'none';
        if (consent === 'accepted') loadGTM();
      }

      function loadGTM() {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TL37V2GR');
      }

      document.getElementById('sk-cookie-accept')?.addEventListener('click', function() {
        setConsent('accepted');
        if (banner) banner.style.display = 'none';
        loadGTM();
      });

      document.getElementById('sk-cookie-decline')?.addEventListener('click', function() {
        setConsent('declined');
        if (banner) banner.style.display = 'none';
      });
    })();
  <\/script> <!-- Netlify Forms: dolda formul\xE4r f\xF6r registrering vid bygge --> <form name="offertforfragan" netlify netlify-honeypot="website" hidden> <input type="text" name="name"> <input type="email" name="email"> <input type="text" name="phone"> <input type="text" name="company"> <input type="text" name="datum_from"> <input type="text" name="datum_to"> <input type="text" name="adress"> <textarea name="meddelande"></textarea> <textarea name="varukorg"></textarea> <input type="text" name="website"> </form> <form name="kontaktformular" netlify netlify-honeypot="website" hidden> <input type="text" name="namn"> <input type="email" name="epost"> <input type="text" name="telefon"> <input type="text" name="typ"> <input type="text" name="gaster"> <input type="text" name="datum"> <textarea name="meddelande"></textarea> <input type="text" name="hittade"> <input type="text" name="website"> </form> <form name="feedbackformular" netlify netlify-honeypot="website" hidden> <input type="text" name="typ"> <textarea name="meddelande"></textarea> <input type="text" name="namn"> <input type="email" name="epost"> <input type="text" name="website"> </form> <!-- Netlify Forms: trello-kopia och kundkopia (dolda, f\xF6r byggtidsregistrering) --> <form name="trello-kopia" netlify netlify-honeypot="website" hidden> <input type="text" name="name"> <input type="email" name="email"> <input type="email" name="trello_to"> <input type="text" name="formular"> <textarea name="sammanfattning"></textarea> <input type="text" name="website"> </form> <form name="kundkopia" netlify netlify-honeypot="website" hidden> <input type="email" name="email"> <input type="text" name="namn"> <input type="text" name="formular"> <textarea name="sammanfattning"></textarea> <input type="text" name="website"> </form> <!-- TICKER --> <div class="ticker"> <div class="ticker-track"> <span class="tick-item">Uthyrning av scen, ljud, ljus &amp; bild<span class="tick-dot"></span></span> <span class="tick-item">Del av Sveriges scener sedan 1986<span class="tick-dot"></span></span> <span class="tick-item">Ingen scen \xE4r f\xF6r liten \u2014 eller f\xF6r stor<span class="tick-dot"></span></span> <span class="tick-item">Leverans och montering i hela Storstockholm<span class="tick-dot"></span></span> <span class="tick-item">Jourtj\xE4nst kv\xE4llstid<span class="tick-dot"></span></span> <span class="tick-item">Fest \xB7 Br\xF6llop \xB7 Event \xB7 Konsert<span class="tick-dot"></span></span> <!-- duplicate for seamless loop --> <span class="tick-item">Uthyrning av scen, ljud, ljus &amp; bild<span class="tick-dot"></span></span> <span class="tick-item">Del av Sveriges scener sedan 1986<span class="tick-dot"></span></span> <span class="tick-item">Ingen scen \xE4r f\xF6r liten \u2014 eller f\xF6r stor<span class="tick-dot"></span></span> <span class="tick-item">Leverans och montering i hela Storstockholm<span class="tick-dot"></span></span> <span class="tick-item">Jourtj\xE4nst kv\xE4llstid<span class="tick-dot"></span></span> <span class="tick-item">Fest \xB7 Br\xF6llop \xB7 Event \xB7 Konsert<span class="tick-dot"></span></span> </div> </div> <!-- NAV --> <nav class="nav" id="mainNav"> <a href="/" class="nav-logo" aria-label="Scenkonsult \u2013 Startsida"> <img class="logo-w" src="/logo-white.png" alt="Scenkonsult"> <img class="logo-c" src="/logo-color.png" alt="Scenkonsult"> </a> <a href="/varukorg/" class="nav-cart" id="navCartBtn" aria-label="Varukorg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span class="nav-cart-badge hidden" id="navCartBadge">0</span></a> <button class="nav-hamburger" id="hamburger" aria-label="\xD6ppna meny" aria-expanded="false"> <span></span><span></span><span></span> </button> <ul class="nav-links"> <li class="nav-dropdown"> <a href="/vara-tjanster/" class="nav-dropdown-trigger">Tj\xE4nster <span class="nav-arrow">\u25BE</span></a> <div class="nav-dropdown-menu"> <div class="nav-dd-col"> <span class="nav-dd-heading">H\xE5rdvara</span> <a href="/vara-tjanster/hyra-scen/">\u{1F3AA} Hyra scen</a> <a href="/vara-tjanster/hyra-ljud/portable/">\u{1F50A} Portabelt ljud</a> <a href="/vara-tjanster/hyra-ljud/event/">\u{1F399} Ljud \u2013 Event & konferens</a> <a href="/vara-tjanster/hyra-ljud/music/">\u{1F3B5} Ljud \u2013 Musik & dans</a> <a href="/vara-tjanster/hyra-ljud/live/">\u{1F3B8} Ljud \u2013 Live & konsert</a> <a href="/vara-tjanster/hyra-ljus/">\u{1F4A1} Hyra ljus</a> <a href="/vara-tjanster/hyra-bild-projektorer-skarmar/">\u{1F4FD} Projektor & sk\xE4rm</a> <a href="/vara-tjanster/hyra-dj/">\u{1F3A7} DJ & DJ-utrustning</a> </div> <div class="nav-dd-col"> <span class="nav-dd-heading">Tj\xE4nster</span> <a href="/vara-tjanster/">\u2728 Komplett event</a> <a href="/bokningssida/">\u{1F4CB} Beg\xE4r offert</a> <a href="/kontakt/">\u{1F4DE} Kontakta oss</a> </div> <div class="nav-dd-col"> <span class="nav-dd-heading">F\xF6r ditt event</span> <a href="/for/brollop/">\u{1F48D} Br\xF6llop</a> <a href="/for/foretagsfest/">\u{1F389} F\xF6retagsfest & kickoff</a> <a href="/for/konferens/">\u{1F3A4} Konferens & f\xF6rel\xE4sning</a> <a href="/for/festival/">\u{1F3B8} Festival & utomhus</a> <a href="/for/studentflak/">\u{1F393} Studentflak</a> <a href="/for/guider/" style="margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.07);">\u{1F4D6} Guider & tips</a> </div> </div> </li> <li><a href="/kontakt/">Kontakta oss</a></li> </ul> `, ' </nav> <!-- MOBILE MENU --> <div class="nav-mobile-menu" id="mobileMenu" aria-hidden="true"> <ul> <li class="nav-mob-parent"> <button class="nav-mob-trigger" id="mobTj\xE4nsterBtn">Tj\xE4nster <span class="nav-arrow">\u25BE</span></button> <ul class="nav-mob-sub" id="mobTj\xE4nsterSub"> <li><a href="/vara-tjanster/hyra-scen/">Hyra scen</a></li> <li><a href="/vara-tjanster/hyra-ljud/portable/">Portabelt ljud</a></li> <li><a href="/vara-tjanster/hyra-ljud/event/">Ljud \u2013 Event</a></li> <li><a href="/vara-tjanster/hyra-ljud/music/">Ljud \u2013 Musik & dans</a></li> <li><a href="/vara-tjanster/hyra-ljud/live/">Ljud \u2013 Live</a></li> <li><a href="/vara-tjanster/hyra-ljus/">Hyra ljus</a></li> <li><a href="/vara-tjanster/hyra-bild-projektorer-skarmar/">Projektor & sk\xE4rm</a></li> <li><a href="/vara-tjanster/hyra-dj/">DJ & DJ-utrustning</a></li> <li><a href="/vara-tjanster/">Komplett event</a></li> <li style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.08);"><span style="color:rgba(196,181,244,0.6); font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding: 0.25rem 0; display:block;">F\xF6r ditt event</span></li> <li><a href="/for/brollop/">\u{1F48D} Br\xF6llop</a></li> <li><a href="/for/foretagsfest/">\u{1F389} F\xF6retagsfest & kickoff</a></li> <li><a href="/for/konferens/">\u{1F3A4} Konferens & f\xF6rel\xE4sning</a></li> <li><a href="/for/festival/">\u{1F3B8} Festival & utomhus</a></li> <li><a href="/for/studentflak/">\u{1F393} Studentflak</a></li> <li><a href="/for/guider/">\u{1F4D6} Guider & tips</a></li> </ul> </li> <li><a href="/kontakt/">Kontakta oss</a></li> </ul> ', ' <a href="/varukorg/" class="nav-mobile-cart">\u{1F6D2} Varukorg <span class="nav-cart-badge hidden" id="mobileCartBadge" style="position:static;display:inline-flex;margin-left:0.4rem">0</span></a> </div> <!-- PAGE CONTENT --> <main> ', ' </main> <!-- FOOTER --> <footer> <div class="footer-top"> <div class="footer-brand"> <img src="/logo-white.png" alt="Scenkonsult"> <p class="footer-desc">\nUthyrning av scen, ljud, ljus, bild och DJ-utrustning f\xF6r fest,\n          br\xF6llop, event och konserter i Stockholm och hela Storstockholm.\n</p> <span class="footer-badge">\u2014 Del av Sveriges scener sedan 1986</span> </div> <div class="footer-col"> <h5>H\xE5rdvara</h5> <ul> <li><a href="/vara-tjanster/hyra-scen/">Hyra scen</a></li> <li><a href="/vara-tjanster/hyra-ljud/">Hyra ljud</a></li> <li><a href="/vara-tjanster/hyra-ljus/">Hyra ljus</a></li> <li><a href="/vara-tjanster/hyra-bild-projektorer-skarmar/">Hyra projektor &amp; sk\xE4rm</a></li> <li><a href="/vara-tjanster/hyra-dj/">Hyra DJ-utrustning</a></li> </ul> </div> <div class="footer-col"> <h5>Tj\xE4nster</h5> <ul> <li><a href="/vara-tjanster/">Alla tj\xE4nster</a></li> <li><a href="/kontakt/">Komplett event / offert</a></li> <li><a href="/vara-tjanster/hyra-dj/">Boka DJ</a></li> </ul> </div> <div class="footer-col"> <h5>Kunskapsbank</h5> <ul> <li><a href="/svens-kunskapsskola/">\u{1F3AC} Svens Kunskapsskola</a></li> <li><a href="/for/guider/">Alla guider</a></li> <li><a href="/for/guider/hur-stor-pa/">Hur stor PA?</a></li> <li><a href="/for/guider/ljussattning-tips/">Ljuss\xE4ttningstips</a></li> <li><a href="/for/guider/vad-kostar-det/">Vad kostar det?</a></li> <li><a href="/vara-vanligaste-fragor-faq/">FAQ</a></li> </ul> </div> <div class="footer-col"> <h5>Information</h5> <ul> <li><a href="/om-oss/">Om oss</a></li> <li><a href="/referenser/">V\xE5ra referenser</a></li> <li><a href="/guide-till-eventlokaler-i-stockholm/">Guide: Eventlokaler</a></li> <li><a href="/den-ultimata-guiden-till-minnesvarda-fester/">Guide: Minnesv\xE4rda fester</a></li> <li><a href="/hyresvillkor/">Hyresvillkor</a></li> <li><a href="/feedback/">Feedback</a></li> </ul> </div> <div class="footer-col"> <h5>Kontakt</h5> ', ' <ul> <li><a href="/bokningssida/">Boka / Beg\xE4r offert</a></li> <li><a href="/kontakt/">Skicka meddelande</a></li> <li><a href="/kontakt/">Hitta till oss \u2013 V\xE4llingby</a></li> </ul> </div> </div> <div class="footer-bottom"> <span class="footer-copy">\xA9 2025 Scenkonsult Norden AB. Alla r\xE4ttigheter f\xF6rbeh\xE5llna.</span> <span class="footer-copy"> <a href="/personuppgiftpolicy/" style="color:inherit;">Integritetspolicy</a>\n&nbsp;\xB7&nbsp;\n<a href="/personuppgiftpolicy/" style="color:inherit;">Cookies</a>\n&nbsp;\xB7&nbsp;\n<a href="/hyresvillkor/" style="color:inherit;">Hyresvillkor</a> </span> </div> </footer> <!-- VAT TOGGLE --> <div id="sk-vat-toggle" aria-label="Momsvisning"> <span class="sk-vat-label">Visa priser</span> <button id="sk-vat-excl" class="sk-vat-btn sk-vat-active" aria-pressed="true">Exkl. moms</button> <button id="sk-vat-incl" class="sk-vat-btn" aria-pressed="false">Inkl. moms</button> </div>  <!-- KONTAKTSKYDD: dekoda tel/mail ur base64 vid runtime \u2014 ej synligt i HTML-k\xE4llan -->  ', ' <!-- ========== SVEN INTENDENTEN \u2014 CHATBOT ========== --> <!-- SVG-definitioner f\xF6r teatermaskarna --> <svg style="display:none" aria-hidden="true"> <symbol id="mask-glad" viewBox="0 0 32 32" fill="none"> <ellipse cx="16" cy="14" rx="13" ry="12" fill="currentColor"></ellipse> <path d="M9 11.5 Q11 9 13 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M19 11.5 Q21 9 23 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M9 18.5 Q16 26 23 18.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <line x1="16" y1="26" x2="16" y2="31" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line> </symbol> <symbol id="mask-ledsen" viewBox="0 0 32 32" fill="none"> <ellipse cx="16" cy="16" rx="13" ry="12" fill="currentColor"></ellipse> <path d="M9 13.5 Q11 16 13 13.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M19 13.5 Q21 16 23 13.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M9 22 Q16 15.5 23 22" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <line x1="16" y1="28" x2="16" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line> </symbol> <symbol id="mask-duo" viewBox="0 0 44 32" fill="none"> <!-- Ledsen mask (bak) --> <ellipse cx="18" cy="17" rx="12" ry="11" fill="rgba(196,181,244,0.55)"></ellipse> <path d="M10 14 Q12 16.5 14 14" stroke="rgba(12,10,36,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"></path> <path d="M21 14 Q23 16.5 25 14" stroke="rgba(12,10,36,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"></path> <path d="M10 21.5 Q17.5 16 25 21.5" stroke="rgba(12,10,36,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"></path> <!-- Glad mask (fram) --> <ellipse cx="28" cy="15" rx="12" ry="11" fill="currentColor"></ellipse> <path d="M21 11.5 Q23 9 25 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.6" fill="none" stroke-linecap="round"></path> <path d="M31 11.5 Q33 9 35 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.6" fill="none" stroke-linecap="round"></path> <path d="M21 19 Q28 25.5 35 19" stroke="rgba(12,10,36,0.65)" stroke-width="1.6" fill="none" stroke-linecap="round"></path> </symbol> </svg> <div id="sven-chat-widget" aria-label="Chatta med Sven"> <!-- Trigger-knapp (teatermaskar) --> <button id="sven-toggle" aria-label="\xD6ppna chatten med Sven" title="Chatta med Sven \u2013 intendenten"> <span id="sven-icon-open"> <img src="/images/sven-avatar.png" alt="Sven" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;display:block;"> </span> <span id="sven-icon-close" style="display:none"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"> <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line> </svg> </span> <span id="sven-unread" style="display:none"></span> </button> <!-- Chattf\xF6nster --> <div id="sven-window" role="dialog" aria-modal="true" aria-label="Chatta med Sven"> <div id="sven-resize-handle" title="Dra f\xF6r att \xE4ndra storlek"></div> <!-- Header --> <div id="sven-header"> <div id="sven-avatar"> <img src="/images/sven-avatar.png" alt="Sven" style="width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:50%;display:block;"> </div> <div id="sven-header-text"> <strong>Sven heter jag, intendent h\xE4r p\xE5 Scenkonsult</strong> <span>Fr\xE5ga om utrustning, priser & bokning</span> </div> <button id="sven-close-btn" aria-label="St\xE4ng chatten"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"> <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line> </svg> </button> </div> <!-- Meddelanden --> <div id="sven-messages" role="log" aria-live="polite"></div> <!-- Snabbval --> <div id="sven-chips"></div> <!-- Inmatning --> <div id="sven-input-row"> <input id="sven-input" type="text" placeholder="Skriv din fr\xE5ga\u2026" maxlength="500" autocomplete="off" aria-label="Din fr\xE5ga till Sven"> <button id="sven-send" aria-label="Skicka"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon> </svg> </button> </div> <!-- Betygs\xE4ttning --> <div id="sven-rating-row"> <span id="sven-rating-label">Betygs\xE4tt Sven</span> <div id="sven-stars" role="group" aria-label="Betyg 1\u20135 stj\xE4rnor"> <button class="sven-star" data-star="1" aria-label="1 stj\xE4rna">\u2605</button> <button class="sven-star" data-star="2" aria-label="2 stj\xE4rnor">\u2605</button> <button class="sven-star" data-star="3" aria-label="3 stj\xE4rnor">\u2605</button> <button class="sven-star" data-star="4" aria-label="4 stj\xE4rnor">\u2605</button> <button class="sven-star" data-star="5" aria-label="5 stj\xE4rnor">\u2605</button> </div> </div> </div> </div>  <!-- \u2500\u2500 SVEN_PRODUCTS (auto-genererad fr\xE5n JSON vid build) \u2500\u2500 --> <script>(function(){', `
    window.__SK_PRODUCTS__ = svenProducts;
  })();<\/script>  <!-- ========== /SVEN ========== --> <!-- ========== LIGHTBOX ========== --> <div id="sk-lightbox" style="display:none;position:fixed;inset:0;z-index:9000;background:rgba(8,6,28,0.92);backdrop-filter:blur(4px);align-items:center;justify-content:center;cursor:zoom-out" onclick="window.skLightboxClose()"> <button onclick="event.stopPropagation();window.skLightboxClose()" style="position:absolute;top:1rem;right:1.25rem;background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:1.5rem;width:2.5rem;height:2.5rem;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">\u2715</button> <img id="sk-lightbox-img" src="" alt="" style="display:none;max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,0.6)" onclick="event.stopPropagation()"> <video id="sk-lightbox-vid" src="" controls style="display:none;max-width:90vw;max-height:85vh;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,0.6)" onclick="event.stopPropagation()"></video> </div> <script is:global>
    (function() {
      const lb   = document.getElementById('sk-lightbox');
      const lImg = document.getElementById('sk-lightbox-img');
      const lVid = document.getElementById('sk-lightbox-vid');

      window.skLightboxOpen = function(type, src, alt) {
        if (type === 'video') {
          lImg.style.display = 'none';
          lVid.style.display = 'block';
          lVid.src = src;
          lVid.play();
        } else {
          lVid.style.display = 'none';
          lImg.style.display = 'block';
          lImg.src = src;
          lImg.alt = alt || '';
        }
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      };

      window.skLightboxClose = function() {
        lb.style.display = 'none';
        lVid.pause();
        lVid.src = '';
        lImg.src = '';
        document.body.style.overflow = '';
      };

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') window.skLightboxClose();
      });

      // Make product images clickable \u2014 runs on DOMContentLoaded + after any Astro navigation
      function initLightboxTriggers() {
        // All product image containers: 1024/853 cards, aspect-square tillbeh\xF6r, hyra-scen inline
        const allImgs = document.querySelectorAll(
          '[style*="aspect-ratio:1024/853"] img,' +
          '[style*="aspect-ratio: 1024/853"] img,' +
          '.aspect-square img,' +
          '.sk-zoomable img'
        );
        allImgs.forEach(el => {
          if (el.dataset.lbInit) return;
          if (el.closest('button') || el.closest('.sk-cart-btn')) return;
          // Bilder inuti produktkort hanteras av sk-modal \u2014 hoppa \xF6ver dem
          if (el.closest('[data-sk-product]')) return;
          el.dataset.lbInit = '1';
          el.style.cursor = 'zoom-in';
          el.addEventListener('click', e => {
            e.stopPropagation();
            window.skLightboxOpen('image', el.src, el.alt);
          });
        });
      }

      document.addEventListener('DOMContentLoaded', initLightboxTriggers);
      // Re-run after short delay to catch dynamically rendered cards
      document.addEventListener('DOMContentLoaded', () => setTimeout(initLightboxTriggers, 800));
    })();
  <\/script> <!-- ========== /LIGHTBOX ========== --> <!-- ========== PRODUKTMODAL ========== --> <div id="sk-modal-overlay" style="display:none;position:fixed;inset:0;z-index:8500;background:rgba(6,4,22,0.85);align-items:flex-start;justify-content:center;padding:1rem;overflow-y:auto" onclick="window.skModalClose()"> <div id="sk-modal-box" onclick="event.stopPropagation()" style="background:#1e1850;border:1px solid rgba(196,181,244,0.2);border-radius:18px;overflow:hidden;width:100%;max-width:1075px;display:grid;grid-template-columns:1fr 1fr;position:relative;margin:auto"> <!-- St\xE4ng-header: alltid synlig, h\xF6g z-index, mobil-v\xE4nlig --> <div style="position:sticky;top:0;left:0;right:0;z-index:20;grid-column:1/-1;background:rgba(12,10,36,.95);border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem"> <span id="sk-modal-header-title" style="font-size:13px;font-weight:600;color:rgba(255,255,255,.6)"></span> <button onclick="window.skModalClose()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.8);width:2.2rem;height:2.2rem;border-radius:8px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;line-height:1;transition:background .15s;flex-shrink:0" onmouseover="this.style.background='rgba(255,255,255,.18)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">\u2715</button> </div> <!-- V\xE4nster: galleri + thumbnails --> <div style="background:#0c0a24;display:flex;flex-direction:column"> <div id="sk-modal-main" style="flex:1;position:relative;min-height:300px;overflow:hidden;cursor:zoom-in"></div> <div id="sk-modal-thumbs" style="display:flex;gap:6px;padding:8px 10px;background:#0c0a24;border-top:1px solid rgba(255,255,255,.08);flex-wrap:wrap"></div> </div> <!-- H\xF6ger: produktinfo --> <div style="padding:24px 22px;display:flex;flex-direction:column;overflow-y:auto;max-height:92vh"> <div id="sk-modal-artno" style="font-size:9px;font-family:monospace;color:rgba(196,181,244,.4);letter-spacing:.06em;margin-bottom:4px"></div> <h2 id="sk-modal-title" style="font-size:20px;font-weight:700;color:#fff;line-height:1.25;margin-bottom:4px"></h2> <div id="sk-modal-persons" style="font-size:11px;color:#c4b5f4;font-weight:600;margin-bottom:10px;display:none"></div> <p id="sk-modal-desc" style="font-size:12px;color:rgba(255,255,255,.52);line-height:1.65;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.08)"></p> <div id="sk-modal-rows" style="margin-bottom:12px"></div> <div id="sk-modal-specs-wrap" style="margin-bottom:16px;flex:1"> <div style="font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:8px;font-weight:600">Specifikation</div> <ul id="sk-modal-specs" style="list-style:none;display:flex;flex-direction:column;gap:5px"></ul> </div> <div style="font-size:10px;color:rgba(255,255,255,.3);padding:8px 10px;background:rgba(255,255,255,.04);border-radius:6px;margin-bottom:14px;line-height:1.5">Alla priser <span id="sk-modal-vat-note">exkl.</span> moms. Hyrtid 22 h. Leverans i hela Storstockholm.</div> <div style="border-top:1px solid rgba(255,255,255,.1);padding-top:16px;margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px"> <div> <div id="sk-modal-price" style="font-size:26px;font-weight:800;color:#c4b5f4;line-height:1"></div> <div id="sk-modal-pnote" style="font-size:10px;color:rgba(255,255,255,.3);margin-top:3px"></div> </div> <button id="sk-modal-cart-btn" onclick="window.skModalAddCart()" style="background:#c4b5f4;color:#0c0a24;border:none;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:background .15s" onmouseover="this.style.background='#e2dcfb'" onmouseout="this.style.background='#c4b5f4'"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
L\xE4gg i varukorg
</button> </div> </div> </div> </div> <script is:global>
  (function() {
    if (window.__skModalInit) return;
    window.__skModalInit = true;

    const overlay  = document.getElementById('sk-modal-overlay');
    const mainArea = document.getElementById('sk-modal-main');
    const thumbsEl = document.getElementById('sk-modal-thumbs');

    let _current = 0;
    let _product = null;

    // \u2500\u2500 Galleri-rendering (identisk logik som MediaCard) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderSlide(idx) {
      if (!_product) return;
      _current = idx;
      const slides = [..._product.images.map(s => ({type:'image',src:s})),
                      ..._product.videos.map(s => ({type:'video',src:s}))];
      if (!slides.length) return;
      const slide = slides[idx];

      // Stoppa eventuell video
      const oldVid = mainArea.querySelector('video');
      if (oldVid) { oldVid.pause(); oldVid.src = ''; }

      if (slide.type === 'video') {
        mainArea.style.cursor = 'pointer';
        mainArea.innerHTML = \`
          <video src="\${slide.src}" autoplay muted loop playsinline
            style="width:100%;height:100%;object-fit:cover;display:block;min-height:300px"></video>
          <div style="position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:5px;background:rgba(12,10,36,.75);border:1px solid rgba(196,181,244,.3);border-radius:4px;padding:3px 8px;font-size:9px;color:rgba(196,181,244,.85);font-weight:700;pointer-events:none">
            <span style="width:6px;height:6px;border-radius:50%;background:#c4b5f4;animation:mcPulse 1.1s ease-in-out infinite"></span>SPELAS
          </div>\`;
        mainArea.onclick = null; // video i kort \u2192 klick \xF6ppnar modalen (se handleCardClick)
      mainArea.style.cursor = 'pointer';
      } else {
        mainArea.style.cursor = 'zoom-in';
        mainArea.innerHTML = \`<img src="\${slide.src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;min-height:300px" />\`;
        mainArea.onclick = null; // bild i kort \u2192 klick \xF6ppnar modalen (se handleCardClick)
      mainArea.style.cursor = 'pointer';
      }

      // Uppdatera thumbnails
      if (thumbsEl) {
        thumbsEl.querySelectorAll('.sk-m-thumb').forEach((t, i) => {
          t.style.borderColor = i === idx ? '#c4b5f4' : 'transparent';
        });
      }
    }

    function buildThumbs() {
      if (!_product || !thumbsEl) return;
      const slides = [..._product.images.map(s => ({type:'image',src:s})),
                      ..._product.videos.map(s => ({type:'video',src:s}))];
      if (slides.length <= 1) { thumbsEl.style.display = 'none'; return; }
      thumbsEl.style.display = 'flex';
      thumbsEl.innerHTML = slides.map((s, i) => {
        if (s.type === 'video') {
          return \`<div class="sk-m-thumb" data-idx="\${i}" style="width:52px;height:43px;border-radius:5px;overflow:hidden;cursor:pointer;border:2px solid \${i===0?'#c4b5f4':'transparent'};background:#050410;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="52" height="43" viewBox="0 0 52 43"><rect width="52" height="43" fill="#06041e"/><path d="M22 16 L22 28 L33 22 Z" fill="#c4b5f4" opacity=".55"/></svg></div>\`;
        }
        return \`<div class="sk-m-thumb" data-idx="\${i}" style="width:52px;height:43px;border-radius:5px;overflow:hidden;cursor:pointer;border:2px solid \${i===0?'#c4b5f4':'transparent'};flex-shrink:0">
          <img src="\${s.src}" style="width:100%;height:100%;object-fit:cover;display:block" /></div>\`;
      }).join('');
      thumbsEl.querySelectorAll('.sk-m-thumb').forEach(t => {
        t.addEventListener('click', e => { e.stopPropagation(); renderSlide(parseInt(t.dataset.idx)); });
      });
    }

    function buildRows(rows) {
      const el = document.getElementById('sk-modal-rows');
      if (!el) return;
      if (!rows || !rows.length) { el.innerHTML = ''; return; }
      el.innerHTML = rows.map(g => \`
        <div style="margin-bottom:10px">
          \${g.label ? \`<div style="font-size:8.5px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.28);margin-bottom:5px;font-weight:600">\${g.label}</div>\` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 10px">
            \${g.rows.map(r => \`<div style="font-size:11px;color:rgba(255,255,255,.5)">\${r}</div>\`).join('')}
          </div>
        </div>\`).join('');
      el.style.borderTop = '1px solid rgba(255,255,255,.1)';
      el.style.paddingTop = '10px';
    }

    function updatePrices() {
      if (!_product) return;
      const inclMoms = (localStorage.getItem('sk-vat') || 'excl') === 'incl';
      const mult = inclMoms ? 1.25 : 1;
      const priceEl = document.getElementById('sk-modal-price');
      const vatNote = document.getElementById('sk-modal-vat-note');
      if (priceEl) priceEl.textContent = Math.round(_product.price * mult).toLocaleString('sv') + ' kr';
      if (vatNote) vatNote.textContent = inclMoms ? 'inkl.' : 'exkl.';
    }

    // \u2500\u2500 \xD6ppna modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.skModalOpen = function(product) {
      _product  = product;
      _current  = 0;

      const hdrTitle = document.getElementById('sk-modal-header-title');
      if (hdrTitle) hdrTitle.textContent = product.name;
      document.getElementById('sk-modal-artno').textContent = product.artno || '';
      document.getElementById('sk-modal-title').textContent = product.name;

      const personsEl = document.getElementById('sk-modal-persons');
      if (product.persons) { personsEl.textContent = product.persons; personsEl.style.display = 'block'; }
      else { personsEl.style.display = 'none'; }

      // Beskrivning \u2014 anv\xE4nd antingen desc-str\xE4ngen (specs joined) eller tom
      const descEl = document.getElementById('sk-modal-desc');
      descEl.textContent = '';
      descEl.style.display = 'none';

      // Specs-lista (pipe-separerade)
      const specsEl = document.getElementById('sk-modal-specs');
      const specsWrap = document.getElementById('sk-modal-specs-wrap');
      const specArr = product.desc ? product.desc.split('||').filter(Boolean) : [];
      if (specArr.length) {
        specsEl.innerHTML = specArr.map(s => \`<li style="font-size:11.5px;color:rgba(255,255,255,.55);display:flex;gap:7px"><span style="color:#4ade80;flex-shrink:0">\u25B8</span>\${s}</li>\`).join('');
        specsWrap.style.display = 'block';
      } else {
        specsWrap.style.display = 'none';
      }

      buildRows(product.rows);
      document.getElementById('sk-modal-pnote').textContent = product.priceNote || '/dygn';
      updatePrices();
      buildThumbs();
      renderSlide(0);

      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    // \u2500\u2500 St\xE4ng modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.skModalClose = function() {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      const vid = mainArea.querySelector('video');
      if (vid) { vid.pause(); vid.src = ''; }
      _product = null;
    };

    // \u2500\u2500 L\xE4gg i varukorg fr\xE5n modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.skModalAddCart = function() {
      if (!_product || !window.skCart) return;
      window.skCart.add({
        id:       _product.cartId,
        name:     _product.name,
        price:    _product.price,
        category: _product.category,
        image:    (_product.images && _product.images[0]) || '',
      });
      // Visuell feedback
      const btn = document.getElementById('sk-modal-cart-btn');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Tillagd!';
        btn.style.background = '#4ade80';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = '#c4b5f4'; }, 1800);
      }
    };

    // \u2500\u2500 Klickhanterare: f\xE5nga klick p\xE5 produktkort \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function handleCardClick(e) {
      // Skippa om klick p\xE5 knapp, l\xE4nk, pil-knapp, eller dot
      if (e.target.closest('button, a, [data-mc-dir], [data-mc-goto], .mc-dot, .mc-arr')) return;
      const card = e.target.closest('[data-sk-product]');
      if (!card) return;
      try {
        const product = JSON.parse(card.dataset.skProduct);
        e.preventDefault();
        window.skModalOpen(product);
      } catch {}
    }

    document.addEventListener('click', handleCardClick);
    document.addEventListener('astro:page-load', () => {
      // Re-attach listener after navigation (idempotent tack vare __skModalInit check)
    });

    // \u2500\u2500 Escape-tangent \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.style.display === 'flex') window.skModalClose();
    });

    // \u2500\u2500 Lyssna p\xE5 moms-toggle-\xE4ndringar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('click', e => {
      if (e.target.closest('.sk-toggle') && overlay.style.display === 'flex') {
        setTimeout(updatePrices, 50);
      }
    });

    // Pilar i modalen (tangentbord)
    document.addEventListener('keydown', e => {
      if (overlay.style.display !== 'flex') return;
      if (!_product) return;
      const total = (_product.images?.length || 0) + (_product.videos?.length || 0);
      if (e.key === 'ArrowRight') renderSlide((_current + 1) % total);
      if (e.key === 'ArrowLeft')  renderSlide((_current - 1 + total) % total);
    });

  })();
  <\/script> <!-- ========== /PRODUKTMODAL ========== -->  <!-- ========== SITEWIDE ADMINL\xC4GE ========== --> <div id="sk-admin-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(12,10,36,0.92);backdrop-filter:blur(8px);align-items:center;justify-content:center;"> <div style="background:#1a1740;border:1px solid rgba(196,181,244,0.35);border-radius:20px;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 32px 80px rgba(0,0,0,0.6);"> <div style="font-family:'DM Serif Display',serif;font-size:1.4rem;color:#c4b5f4;margin-bottom:0.25rem;">Scenkonsult Admin</div> <div style="font-family:'Space Grotesk',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.45);margin-bottom:1.75rem;">Ange adminl\xF6senord f\xF6r att aktivera adminl\xE4get</div> <input id="sk-admin-pw" type="password" placeholder="L\xF6senord" style="width:100%;background:#0c0a24;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:0.8rem 1rem;color:#f0eeff;font-family:'Space Grotesk',sans-serif;font-size:1rem;margin-bottom:0.75rem;outline:none;transition:border-color 0.2s;color-scheme:dark;" autocomplete="current-password"> <div id="sk-admin-error" style="display:none;color:#f87171;font-size:0.8rem;font-family:'Space Grotesk',sans-serif;margin-bottom:0.75rem;"></div> <div id="sk-admin-lockout" style="display:none;text-align:center;padding:1rem;background:rgba(251,191,36,0.1);border-radius:10px;margin-bottom:0.75rem;"> <span style="color:#fbbf24;font-family:'Space Grotesk',sans-serif;font-size:0.9rem;">\u{1F512} L\xE5st i <strong id="sk-admin-countdown">60</strong>s</span> </div> <button id="sk-admin-submit" style="width:100%;background:#332885;color:#fff;border:none;border-radius:10px;padding:0.8rem;font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;cursor:pointer;transition:background 0.2s;">
Aktivera adminl\xE4ge
</button> <button id="sk-admin-cancel" style="width:100%;margin-top:0.5rem;background:transparent;color:rgba(255,255,255,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.6rem;font-family:'Space Grotesk',sans-serif;font-size:0.875rem;cursor:pointer;">
Avbryt
</button> </div> </div> <!-- Admin pill-badge (visas n\xE4r adminl\xE4ge \xE4r aktivt) --> <div id="sk-admin-badge" style="display:none;position:fixed;bottom:5.5rem;right:1rem;z-index:9000;background:#332885;border:1px solid rgba(196,181,244,0.5);border-radius:999px;padding:0.4rem 0.85rem;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:600;color:#c4b5f4;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.4);align-items:center;gap:0.4rem;user-select:none;"> <span>Admin \u2726</span> <span id="sk-admin-badge-logout" title="Avaktivera" style="opacity:0.5;font-size:0.7rem;margin-left:0.2rem;">\u2715</span> </div> <script>
  (function() {
    const LS_KEY   = 'sk_admin_mode';   // localStorage \u2014 persisterar 8 h
    const FAIL_KEY = 'sk_admin_failures';
    const LOCK_KEY = 'sk_admin_locked_until';
    const TTL_MS   = 8 * 60 * 60 * 1000; // 8 timmar

    function isAdminActive() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return false;
        const { ts } = JSON.parse(raw);
        return (Date.now() - ts) < TTL_MS;
      } catch { return false; }
    }

    function activateAdmin(token) {
      const payload = { ts: Date.now() };
      if (token) payload.token = token;
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
      // S\xE4tt ocks\xE5 sessionStorage f\xF6r nuvarande flik
      if (token) sessionStorage.setItem('sk_admin_token', token);
      document.body.classList.add('sk-admin');
      const badge = document.getElementById('sk-admin-badge');
      if (badge) badge.style.display = 'flex';
    }

    function deactivateAdmin() {
      localStorage.removeItem(LS_KEY);
      sessionStorage.removeItem(FAIL_KEY);
      sessionStorage.removeItem(LOCK_KEY);
      sessionStorage.removeItem('sk_admin_token');
      document.body.classList.remove('sk-admin');
      const badge = document.getElementById('sk-admin-badge');
      if (badge) badge.style.display = 'none';
    }

    function openModal() {
      const modal = document.getElementById('sk-admin-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      setTimeout(() => {
        const pw = document.getElementById('sk-admin-pw');
        if (pw) pw.focus();
      }, 80);
    }

    function closeModal() {
      const modal = document.getElementById('sk-admin-modal');
      if (modal) modal.style.display = 'none';
      // Rensa ?admin=1 fr\xE5n URL utan reload
      const url = new URL(location.href);
      if (url.searchParams.has('admin')) {
        url.searchParams.delete('admin');
        history.replaceState({}, '', url.toString());
      }
    }

    function showError(msg) {
      const el = document.getElementById('sk-admin-error');
      if (el) { el.textContent = msg; el.style.display = 'block'; }
    }

    function clearError() {
      const el = document.getElementById('sk-admin-error');
      if (el) el.style.display = 'none';
    }

    function startCountdown(seconds) {
      const lockout = document.getElementById('sk-admin-lockout');
      const cd      = document.getElementById('sk-admin-countdown');
      const submit  = document.getElementById('sk-admin-submit');
      const pwInput = document.getElementById('sk-admin-pw');
      if (!lockout || !cd) return;

      lockout.style.display = 'block';
      if (submit) submit.disabled = true;
      if (pwInput) pwInput.disabled = true;

      let remaining = seconds;
      cd.textContent = remaining;

      const timer = setInterval(() => {
        remaining--;
        cd.textContent = remaining;
        if (remaining <= 0) {
          clearInterval(timer);
          lockout.style.display = 'none';
          if (submit) submit.disabled = false;
          if (pwInput) { pwInput.disabled = false; pwInput.focus(); }
          sessionStorage.removeItem(FAIL_KEY);
          sessionStorage.removeItem(LOCK_KEY);
        }
      }, 1000);
    }

    async function doAuth() {
      // Kontrollera lokal lockout
      const lockedUntil = parseInt(sessionStorage.getItem(LOCK_KEY) || '0', 10);
      if (lockedUntil > Date.now()) {
        const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
        startCountdown(secs);
        return;
      }

      const pwInput = document.getElementById('sk-admin-pw');
      const pw = pwInput ? pwInput.value.trim() : '';
      if (!pw) return;

      clearError();
      const submit = document.getElementById('sk-admin-submit');
      if (submit) { submit.disabled = true; submit.textContent = 'Kontrollerar\u2026'; }

      try {
        const res  = await fetch('/api/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pw })
        });
        const data = await res.json();

        if (data.ok) {
          sessionStorage.removeItem(FAIL_KEY);
          sessionStorage.removeItem(LOCK_KEY);
          // Brygga till /admin/ \u2014 sparar token s\xE5 adminpanelen slipper eget login
          closeModal();
          activateAdmin(pw);
        } else if (data.lockoutSeconds > 0) {
          const until = Date.now() + data.lockoutSeconds * 1000;
          sessionStorage.setItem(LOCK_KEY, String(until));
          showError(data.error || 'Kontot \xE4r l\xE5st.');
          startCountdown(data.lockoutSeconds);
        } else {
          showError(data.error || 'Fel l\xF6senord.');
          if (pwInput) { pwInput.value = ''; pwInput.focus(); }
        }
      } catch (err) {
        showError('N\xE4tverksfel \u2014 f\xF6rs\xF6k igen.');
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = 'Aktivera adminl\xE4ge'; }
      }
    }

    // \u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('DOMContentLoaded', function() {

      // \xC5teraktivera om localStorage-session \xE4r aktiv
      if (isAdminActive()) {
        try {
          const stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
          // Synka token till sessionStorage f\xF6r denna flik
          if (stored.token) sessionStorage.setItem('sk_admin_token', stored.token);
        } catch {}
        activateAdmin();
      } else if (sessionStorage.getItem('sk_admin_token')) {
        // Kom fr\xE5n /admin/ i samma flik
        activateAdmin(sessionStorage.getItem('sk_admin_token'));
      }

      // \xD6ppna modal vid ?admin=1
      const params = new URLSearchParams(location.search);
      if (params.get('admin') === '1') {
        if (isAdminActive()) {
          // Redan inloggad \u2014 bara rensa URL
          const url = new URL(location.href);
          url.searchParams.delete('admin');
          history.replaceState({}, '', url.toString());
        } else {
          openModal();
          // Kolla lokal lockout direkt
          const lockedUntil = parseInt(sessionStorage.getItem(LOCK_KEY) || '0', 10);
          if (lockedUntil > Date.now()) {
            const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
            startCountdown(secs);
          }
        }
      }

      // Event listeners
      const submit = document.getElementById('sk-admin-submit');
      const cancel = document.getElementById('sk-admin-cancel');
      const pwInput = document.getElementById('sk-admin-pw');
      const badge  = document.getElementById('sk-admin-badge');
      const logoutBtn = document.getElementById('sk-admin-badge-logout');

      if (submit)  submit.addEventListener('click', doAuth);
      if (cancel)  cancel.addEventListener('click', closeModal);
      if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAuth(); });
      if (logoutBtn) logoutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deactivateAdmin();
      });
      if (badge) badge.addEventListener('click', function(e) {
        if (!e.target.closest('#sk-admin-badge-logout')) {
          location.href = '/admin/';
        }
      });

      // St\xE4ng modal vid klick utanf\xF6r rutan
      const modal = document.getElementById('sk-admin-modal');
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) closeModal();
        });
      }

      // Hover-effekt submit-knapp
      if (submit) {
        submit.addEventListener('mouseenter', () => { if (!submit.disabled) submit.style.background = '#c4b5f4'; submit.style.color = '#0c0a24'; });
        submit.addEventListener('mouseleave', () => { if (!submit.disabled) submit.style.background = '#332885'; submit.style.color = '#fff'; });
      }
    });
  })();
  <\/script>  <!-- ========== /SITEWIDE ADMINL\xC4GE ========== --></body></html>`], ['<html lang="sv"> <head><!-- GTM laddas endast efter cookie-samtycke --><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><link rel="canonical"', '><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:locale" content="sv_SE"><meta property="og:site_name" content="Scenkonsult Norden"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', "><title>", '</title><link rel="icon" type="image/png" href="/logo-icon.png"><!-- Structured data \u2014 LocalBusiness (global) --><script type="application/ld+json">', "<\/script><!-- Structured data \u2014 page-specific -->", '<!-- Preconnect for fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', `</head> <body> <!-- Cookie-banner --> <div id="sk-cookie-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:99999;background:rgba(12,10,36,0.97);border-top:1px solid rgba(196,181,244,0.25);padding:1rem 1.5rem;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;"> <p style="margin:0;color:rgba(255,255,255,0.7);font-size:0.875rem;font-family:'Space Grotesk',sans-serif;max-width:700px;">
Vi anv\xE4nder cookies f\xF6r bes\xF6ksstatistik (Google Analytics) f\xF6r att f\xF6rb\xE4ttra sajten.
<a href="/personuppgiftpolicy/" style="color:#c4b5f4;text-decoration:underline;">L\xE4s mer</a> </p> <div style="display:flex;gap:0.75rem;flex-shrink:0;"> <button id="sk-cookie-decline" style="padding:0.5rem 1.1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.6);font-size:0.875rem;cursor:pointer;font-family:'Space Grotesk',sans-serif;">
Avvisa
</button> <button id="sk-cookie-accept" style="padding:0.5rem 1.25rem;border-radius:0.5rem;border:none;background:#c4b5f4;color:#0c0a24;font-size:0.875rem;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif;">
Godk\xE4nn
</button> </div> </div> <script>
    (function() {
      var CONSENT_KEY = 'sk_cookie_consent';
      var CONSENT_DAYS = 395; // 13 m\xE5nader per personuppgiftspolicyn

      function getConsent() {
        try {
          var raw = localStorage.getItem(CONSENT_KEY);
          if (!raw) return null;
          var data = JSON.parse(raw);
          // Gammalt format (str\xE4ng) \u2014 migrera till nytt format med utg\xE5ngsdatum
          if (typeof data === 'string') {
            setConsent(data); // spara om med expires
            return data;
          }
          // Kolla utg\xE5ngsdatum
          if (data.expires && Date.now() > data.expires) {
            localStorage.removeItem(CONSENT_KEY);
            return null;
          }
          return data.value;
        } catch { return null; }
      }

      function setConsent(value) {
        var expires = Date.now() + CONSENT_DAYS * 24 * 60 * 60 * 1000;
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: value, expires: expires }));
      }

      var consent = getConsent();
      var banner = document.getElementById('sk-cookie-banner');

      // Visa eller d\xF6lj bannern explicit
      if (!consent) {
        if (banner) banner.style.display = 'flex';
      } else {
        if (banner) banner.style.display = 'none';
        if (consent === 'accepted') loadGTM();
      }

      function loadGTM() {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TL37V2GR');
      }

      document.getElementById('sk-cookie-accept')?.addEventListener('click', function() {
        setConsent('accepted');
        if (banner) banner.style.display = 'none';
        loadGTM();
      });

      document.getElementById('sk-cookie-decline')?.addEventListener('click', function() {
        setConsent('declined');
        if (banner) banner.style.display = 'none';
      });
    })();
  <\/script> <!-- Netlify Forms: dolda formul\xE4r f\xF6r registrering vid bygge --> <form name="offertforfragan" netlify netlify-honeypot="website" hidden> <input type="text" name="name"> <input type="email" name="email"> <input type="text" name="phone"> <input type="text" name="company"> <input type="text" name="datum_from"> <input type="text" name="datum_to"> <input type="text" name="adress"> <textarea name="meddelande"></textarea> <textarea name="varukorg"></textarea> <input type="text" name="website"> </form> <form name="kontaktformular" netlify netlify-honeypot="website" hidden> <input type="text" name="namn"> <input type="email" name="epost"> <input type="text" name="telefon"> <input type="text" name="typ"> <input type="text" name="gaster"> <input type="text" name="datum"> <textarea name="meddelande"></textarea> <input type="text" name="hittade"> <input type="text" name="website"> </form> <form name="feedbackformular" netlify netlify-honeypot="website" hidden> <input type="text" name="typ"> <textarea name="meddelande"></textarea> <input type="text" name="namn"> <input type="email" name="epost"> <input type="text" name="website"> </form> <!-- Netlify Forms: trello-kopia och kundkopia (dolda, f\xF6r byggtidsregistrering) --> <form name="trello-kopia" netlify netlify-honeypot="website" hidden> <input type="text" name="name"> <input type="email" name="email"> <input type="email" name="trello_to"> <input type="text" name="formular"> <textarea name="sammanfattning"></textarea> <input type="text" name="website"> </form> <form name="kundkopia" netlify netlify-honeypot="website" hidden> <input type="email" name="email"> <input type="text" name="namn"> <input type="text" name="formular"> <textarea name="sammanfattning"></textarea> <input type="text" name="website"> </form> <!-- TICKER --> <div class="ticker"> <div class="ticker-track"> <span class="tick-item">Uthyrning av scen, ljud, ljus &amp; bild<span class="tick-dot"></span></span> <span class="tick-item">Del av Sveriges scener sedan 1986<span class="tick-dot"></span></span> <span class="tick-item">Ingen scen \xE4r f\xF6r liten \u2014 eller f\xF6r stor<span class="tick-dot"></span></span> <span class="tick-item">Leverans och montering i hela Storstockholm<span class="tick-dot"></span></span> <span class="tick-item">Jourtj\xE4nst kv\xE4llstid<span class="tick-dot"></span></span> <span class="tick-item">Fest \xB7 Br\xF6llop \xB7 Event \xB7 Konsert<span class="tick-dot"></span></span> <!-- duplicate for seamless loop --> <span class="tick-item">Uthyrning av scen, ljud, ljus &amp; bild<span class="tick-dot"></span></span> <span class="tick-item">Del av Sveriges scener sedan 1986<span class="tick-dot"></span></span> <span class="tick-item">Ingen scen \xE4r f\xF6r liten \u2014 eller f\xF6r stor<span class="tick-dot"></span></span> <span class="tick-item">Leverans och montering i hela Storstockholm<span class="tick-dot"></span></span> <span class="tick-item">Jourtj\xE4nst kv\xE4llstid<span class="tick-dot"></span></span> <span class="tick-item">Fest \xB7 Br\xF6llop \xB7 Event \xB7 Konsert<span class="tick-dot"></span></span> </div> </div> <!-- NAV --> <nav class="nav" id="mainNav"> <a href="/" class="nav-logo" aria-label="Scenkonsult \u2013 Startsida"> <img class="logo-w" src="/logo-white.png" alt="Scenkonsult"> <img class="logo-c" src="/logo-color.png" alt="Scenkonsult"> </a> <a href="/varukorg/" class="nav-cart" id="navCartBtn" aria-label="Varukorg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span class="nav-cart-badge hidden" id="navCartBadge">0</span></a> <button class="nav-hamburger" id="hamburger" aria-label="\xD6ppna meny" aria-expanded="false"> <span></span><span></span><span></span> </button> <ul class="nav-links"> <li class="nav-dropdown"> <a href="/vara-tjanster/" class="nav-dropdown-trigger">Tj\xE4nster <span class="nav-arrow">\u25BE</span></a> <div class="nav-dropdown-menu"> <div class="nav-dd-col"> <span class="nav-dd-heading">H\xE5rdvara</span> <a href="/vara-tjanster/hyra-scen/">\u{1F3AA} Hyra scen</a> <a href="/vara-tjanster/hyra-ljud/portable/">\u{1F50A} Portabelt ljud</a> <a href="/vara-tjanster/hyra-ljud/event/">\u{1F399} Ljud \u2013 Event & konferens</a> <a href="/vara-tjanster/hyra-ljud/music/">\u{1F3B5} Ljud \u2013 Musik & dans</a> <a href="/vara-tjanster/hyra-ljud/live/">\u{1F3B8} Ljud \u2013 Live & konsert</a> <a href="/vara-tjanster/hyra-ljus/">\u{1F4A1} Hyra ljus</a> <a href="/vara-tjanster/hyra-bild-projektorer-skarmar/">\u{1F4FD} Projektor & sk\xE4rm</a> <a href="/vara-tjanster/hyra-dj/">\u{1F3A7} DJ & DJ-utrustning</a> </div> <div class="nav-dd-col"> <span class="nav-dd-heading">Tj\xE4nster</span> <a href="/vara-tjanster/">\u2728 Komplett event</a> <a href="/bokningssida/">\u{1F4CB} Beg\xE4r offert</a> <a href="/kontakt/">\u{1F4DE} Kontakta oss</a> </div> <div class="nav-dd-col"> <span class="nav-dd-heading">F\xF6r ditt event</span> <a href="/for/brollop/">\u{1F48D} Br\xF6llop</a> <a href="/for/foretagsfest/">\u{1F389} F\xF6retagsfest & kickoff</a> <a href="/for/konferens/">\u{1F3A4} Konferens & f\xF6rel\xE4sning</a> <a href="/for/festival/">\u{1F3B8} Festival & utomhus</a> <a href="/for/studentflak/">\u{1F393} Studentflak</a> <a href="/for/guider/" style="margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.07);">\u{1F4D6} Guider & tips</a> </div> </div> </li> <li><a href="/kontakt/">Kontakta oss</a></li> </ul> `, ' </nav> <!-- MOBILE MENU --> <div class="nav-mobile-menu" id="mobileMenu" aria-hidden="true"> <ul> <li class="nav-mob-parent"> <button class="nav-mob-trigger" id="mobTj\xE4nsterBtn">Tj\xE4nster <span class="nav-arrow">\u25BE</span></button> <ul class="nav-mob-sub" id="mobTj\xE4nsterSub"> <li><a href="/vara-tjanster/hyra-scen/">Hyra scen</a></li> <li><a href="/vara-tjanster/hyra-ljud/portable/">Portabelt ljud</a></li> <li><a href="/vara-tjanster/hyra-ljud/event/">Ljud \u2013 Event</a></li> <li><a href="/vara-tjanster/hyra-ljud/music/">Ljud \u2013 Musik & dans</a></li> <li><a href="/vara-tjanster/hyra-ljud/live/">Ljud \u2013 Live</a></li> <li><a href="/vara-tjanster/hyra-ljus/">Hyra ljus</a></li> <li><a href="/vara-tjanster/hyra-bild-projektorer-skarmar/">Projektor & sk\xE4rm</a></li> <li><a href="/vara-tjanster/hyra-dj/">DJ & DJ-utrustning</a></li> <li><a href="/vara-tjanster/">Komplett event</a></li> <li style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.08);"><span style="color:rgba(196,181,244,0.6); font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding: 0.25rem 0; display:block;">F\xF6r ditt event</span></li> <li><a href="/for/brollop/">\u{1F48D} Br\xF6llop</a></li> <li><a href="/for/foretagsfest/">\u{1F389} F\xF6retagsfest & kickoff</a></li> <li><a href="/for/konferens/">\u{1F3A4} Konferens & f\xF6rel\xE4sning</a></li> <li><a href="/for/festival/">\u{1F3B8} Festival & utomhus</a></li> <li><a href="/for/studentflak/">\u{1F393} Studentflak</a></li> <li><a href="/for/guider/">\u{1F4D6} Guider & tips</a></li> </ul> </li> <li><a href="/kontakt/">Kontakta oss</a></li> </ul> ', ' <a href="/varukorg/" class="nav-mobile-cart">\u{1F6D2} Varukorg <span class="nav-cart-badge hidden" id="mobileCartBadge" style="position:static;display:inline-flex;margin-left:0.4rem">0</span></a> </div> <!-- PAGE CONTENT --> <main> ', ' </main> <!-- FOOTER --> <footer> <div class="footer-top"> <div class="footer-brand"> <img src="/logo-white.png" alt="Scenkonsult"> <p class="footer-desc">\nUthyrning av scen, ljud, ljus, bild och DJ-utrustning f\xF6r fest,\n          br\xF6llop, event och konserter i Stockholm och hela Storstockholm.\n</p> <span class="footer-badge">\u2014 Del av Sveriges scener sedan 1986</span> </div> <div class="footer-col"> <h5>H\xE5rdvara</h5> <ul> <li><a href="/vara-tjanster/hyra-scen/">Hyra scen</a></li> <li><a href="/vara-tjanster/hyra-ljud/">Hyra ljud</a></li> <li><a href="/vara-tjanster/hyra-ljus/">Hyra ljus</a></li> <li><a href="/vara-tjanster/hyra-bild-projektorer-skarmar/">Hyra projektor &amp; sk\xE4rm</a></li> <li><a href="/vara-tjanster/hyra-dj/">Hyra DJ-utrustning</a></li> </ul> </div> <div class="footer-col"> <h5>Tj\xE4nster</h5> <ul> <li><a href="/vara-tjanster/">Alla tj\xE4nster</a></li> <li><a href="/kontakt/">Komplett event / offert</a></li> <li><a href="/vara-tjanster/hyra-dj/">Boka DJ</a></li> </ul> </div> <div class="footer-col"> <h5>Kunskapsbank</h5> <ul> <li><a href="/svens-kunskapsskola/">\u{1F3AC} Svens Kunskapsskola</a></li> <li><a href="/for/guider/">Alla guider</a></li> <li><a href="/for/guider/hur-stor-pa/">Hur stor PA?</a></li> <li><a href="/for/guider/ljussattning-tips/">Ljuss\xE4ttningstips</a></li> <li><a href="/for/guider/vad-kostar-det/">Vad kostar det?</a></li> <li><a href="/vara-vanligaste-fragor-faq/">FAQ</a></li> </ul> </div> <div class="footer-col"> <h5>Information</h5> <ul> <li><a href="/om-oss/">Om oss</a></li> <li><a href="/referenser/">V\xE5ra referenser</a></li> <li><a href="/guide-till-eventlokaler-i-stockholm/">Guide: Eventlokaler</a></li> <li><a href="/den-ultimata-guiden-till-minnesvarda-fester/">Guide: Minnesv\xE4rda fester</a></li> <li><a href="/hyresvillkor/">Hyresvillkor</a></li> <li><a href="/feedback/">Feedback</a></li> </ul> </div> <div class="footer-col"> <h5>Kontakt</h5> ', ' <ul> <li><a href="/bokningssida/">Boka / Beg\xE4r offert</a></li> <li><a href="/kontakt/">Skicka meddelande</a></li> <li><a href="/kontakt/">Hitta till oss \u2013 V\xE4llingby</a></li> </ul> </div> </div> <div class="footer-bottom"> <span class="footer-copy">\xA9 2025 Scenkonsult Norden AB. Alla r\xE4ttigheter f\xF6rbeh\xE5llna.</span> <span class="footer-copy"> <a href="/personuppgiftpolicy/" style="color:inherit;">Integritetspolicy</a>\n&nbsp;\xB7&nbsp;\n<a href="/personuppgiftpolicy/" style="color:inherit;">Cookies</a>\n&nbsp;\xB7&nbsp;\n<a href="/hyresvillkor/" style="color:inherit;">Hyresvillkor</a> </span> </div> </footer> <!-- VAT TOGGLE --> <div id="sk-vat-toggle" aria-label="Momsvisning"> <span class="sk-vat-label">Visa priser</span> <button id="sk-vat-excl" class="sk-vat-btn sk-vat-active" aria-pressed="true">Exkl. moms</button> <button id="sk-vat-incl" class="sk-vat-btn" aria-pressed="false">Inkl. moms</button> </div>  <!-- KONTAKTSKYDD: dekoda tel/mail ur base64 vid runtime \u2014 ej synligt i HTML-k\xE4llan -->  ', ' <!-- ========== SVEN INTENDENTEN \u2014 CHATBOT ========== --> <!-- SVG-definitioner f\xF6r teatermaskarna --> <svg style="display:none" aria-hidden="true"> <symbol id="mask-glad" viewBox="0 0 32 32" fill="none"> <ellipse cx="16" cy="14" rx="13" ry="12" fill="currentColor"></ellipse> <path d="M9 11.5 Q11 9 13 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M19 11.5 Q21 9 23 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M9 18.5 Q16 26 23 18.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <line x1="16" y1="26" x2="16" y2="31" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line> </symbol> <symbol id="mask-ledsen" viewBox="0 0 32 32" fill="none"> <ellipse cx="16" cy="16" rx="13" ry="12" fill="currentColor"></ellipse> <path d="M9 13.5 Q11 16 13 13.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M19 13.5 Q21 16 23 13.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <path d="M9 22 Q16 15.5 23 22" stroke="rgba(12,10,36,0.65)" stroke-width="1.8" fill="none" stroke-linecap="round"></path> <line x1="16" y1="28" x2="16" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line> </symbol> <symbol id="mask-duo" viewBox="0 0 44 32" fill="none"> <!-- Ledsen mask (bak) --> <ellipse cx="18" cy="17" rx="12" ry="11" fill="rgba(196,181,244,0.55)"></ellipse> <path d="M10 14 Q12 16.5 14 14" stroke="rgba(12,10,36,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"></path> <path d="M21 14 Q23 16.5 25 14" stroke="rgba(12,10,36,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"></path> <path d="M10 21.5 Q17.5 16 25 21.5" stroke="rgba(12,10,36,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"></path> <!-- Glad mask (fram) --> <ellipse cx="28" cy="15" rx="12" ry="11" fill="currentColor"></ellipse> <path d="M21 11.5 Q23 9 25 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.6" fill="none" stroke-linecap="round"></path> <path d="M31 11.5 Q33 9 35 11.5" stroke="rgba(12,10,36,0.65)" stroke-width="1.6" fill="none" stroke-linecap="round"></path> <path d="M21 19 Q28 25.5 35 19" stroke="rgba(12,10,36,0.65)" stroke-width="1.6" fill="none" stroke-linecap="round"></path> </symbol> </svg> <div id="sven-chat-widget" aria-label="Chatta med Sven"> <!-- Trigger-knapp (teatermaskar) --> <button id="sven-toggle" aria-label="\xD6ppna chatten med Sven" title="Chatta med Sven \u2013 intendenten"> <span id="sven-icon-open"> <img src="/images/sven-avatar.png" alt="Sven" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;display:block;"> </span> <span id="sven-icon-close" style="display:none"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"> <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line> </svg> </span> <span id="sven-unread" style="display:none"></span> </button> <!-- Chattf\xF6nster --> <div id="sven-window" role="dialog" aria-modal="true" aria-label="Chatta med Sven"> <div id="sven-resize-handle" title="Dra f\xF6r att \xE4ndra storlek"></div> <!-- Header --> <div id="sven-header"> <div id="sven-avatar"> <img src="/images/sven-avatar.png" alt="Sven" style="width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:50%;display:block;"> </div> <div id="sven-header-text"> <strong>Sven heter jag, intendent h\xE4r p\xE5 Scenkonsult</strong> <span>Fr\xE5ga om utrustning, priser & bokning</span> </div> <button id="sven-close-btn" aria-label="St\xE4ng chatten"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"> <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line> </svg> </button> </div> <!-- Meddelanden --> <div id="sven-messages" role="log" aria-live="polite"></div> <!-- Snabbval --> <div id="sven-chips"></div> <!-- Inmatning --> <div id="sven-input-row"> <input id="sven-input" type="text" placeholder="Skriv din fr\xE5ga\u2026" maxlength="500" autocomplete="off" aria-label="Din fr\xE5ga till Sven"> <button id="sven-send" aria-label="Skicka"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon> </svg> </button> </div> <!-- Betygs\xE4ttning --> <div id="sven-rating-row"> <span id="sven-rating-label">Betygs\xE4tt Sven</span> <div id="sven-stars" role="group" aria-label="Betyg 1\u20135 stj\xE4rnor"> <button class="sven-star" data-star="1" aria-label="1 stj\xE4rna">\u2605</button> <button class="sven-star" data-star="2" aria-label="2 stj\xE4rnor">\u2605</button> <button class="sven-star" data-star="3" aria-label="3 stj\xE4rnor">\u2605</button> <button class="sven-star" data-star="4" aria-label="4 stj\xE4rnor">\u2605</button> <button class="sven-star" data-star="5" aria-label="5 stj\xE4rnor">\u2605</button> </div> </div> </div> </div>  <!-- \u2500\u2500 SVEN_PRODUCTS (auto-genererad fr\xE5n JSON vid build) \u2500\u2500 --> <script>(function(){', `
    window.__SK_PRODUCTS__ = svenProducts;
  })();<\/script>  <!-- ========== /SVEN ========== --> <!-- ========== LIGHTBOX ========== --> <div id="sk-lightbox" style="display:none;position:fixed;inset:0;z-index:9000;background:rgba(8,6,28,0.92);backdrop-filter:blur(4px);align-items:center;justify-content:center;cursor:zoom-out" onclick="window.skLightboxClose()"> <button onclick="event.stopPropagation();window.skLightboxClose()" style="position:absolute;top:1rem;right:1.25rem;background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:1.5rem;width:2.5rem;height:2.5rem;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">\u2715</button> <img id="sk-lightbox-img" src="" alt="" style="display:none;max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,0.6)" onclick="event.stopPropagation()"> <video id="sk-lightbox-vid" src="" controls style="display:none;max-width:90vw;max-height:85vh;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,0.6)" onclick="event.stopPropagation()"></video> </div> <script is:global>
    (function() {
      const lb   = document.getElementById('sk-lightbox');
      const lImg = document.getElementById('sk-lightbox-img');
      const lVid = document.getElementById('sk-lightbox-vid');

      window.skLightboxOpen = function(type, src, alt) {
        if (type === 'video') {
          lImg.style.display = 'none';
          lVid.style.display = 'block';
          lVid.src = src;
          lVid.play();
        } else {
          lVid.style.display = 'none';
          lImg.style.display = 'block';
          lImg.src = src;
          lImg.alt = alt || '';
        }
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      };

      window.skLightboxClose = function() {
        lb.style.display = 'none';
        lVid.pause();
        lVid.src = '';
        lImg.src = '';
        document.body.style.overflow = '';
      };

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') window.skLightboxClose();
      });

      // Make product images clickable \u2014 runs on DOMContentLoaded + after any Astro navigation
      function initLightboxTriggers() {
        // All product image containers: 1024/853 cards, aspect-square tillbeh\xF6r, hyra-scen inline
        const allImgs = document.querySelectorAll(
          '[style*="aspect-ratio:1024/853"] img,' +
          '[style*="aspect-ratio: 1024/853"] img,' +
          '.aspect-square img,' +
          '.sk-zoomable img'
        );
        allImgs.forEach(el => {
          if (el.dataset.lbInit) return;
          if (el.closest('button') || el.closest('.sk-cart-btn')) return;
          // Bilder inuti produktkort hanteras av sk-modal \u2014 hoppa \xF6ver dem
          if (el.closest('[data-sk-product]')) return;
          el.dataset.lbInit = '1';
          el.style.cursor = 'zoom-in';
          el.addEventListener('click', e => {
            e.stopPropagation();
            window.skLightboxOpen('image', el.src, el.alt);
          });
        });
      }

      document.addEventListener('DOMContentLoaded', initLightboxTriggers);
      // Re-run after short delay to catch dynamically rendered cards
      document.addEventListener('DOMContentLoaded', () => setTimeout(initLightboxTriggers, 800));
    })();
  <\/script> <!-- ========== /LIGHTBOX ========== --> <!-- ========== PRODUKTMODAL ========== --> <div id="sk-modal-overlay" style="display:none;position:fixed;inset:0;z-index:8500;background:rgba(6,4,22,0.85);align-items:flex-start;justify-content:center;padding:1rem;overflow-y:auto" onclick="window.skModalClose()"> <div id="sk-modal-box" onclick="event.stopPropagation()" style="background:#1e1850;border:1px solid rgba(196,181,244,0.2);border-radius:18px;overflow:hidden;width:100%;max-width:1075px;display:grid;grid-template-columns:1fr 1fr;position:relative;margin:auto"> <!-- St\xE4ng-header: alltid synlig, h\xF6g z-index, mobil-v\xE4nlig --> <div style="position:sticky;top:0;left:0;right:0;z-index:20;grid-column:1/-1;background:rgba(12,10,36,.95);border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem"> <span id="sk-modal-header-title" style="font-size:13px;font-weight:600;color:rgba(255,255,255,.6)"></span> <button onclick="window.skModalClose()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.8);width:2.2rem;height:2.2rem;border-radius:8px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;line-height:1;transition:background .15s;flex-shrink:0" onmouseover="this.style.background='rgba(255,255,255,.18)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">\u2715</button> </div> <!-- V\xE4nster: galleri + thumbnails --> <div style="background:#0c0a24;display:flex;flex-direction:column"> <div id="sk-modal-main" style="flex:1;position:relative;min-height:300px;overflow:hidden;cursor:zoom-in"></div> <div id="sk-modal-thumbs" style="display:flex;gap:6px;padding:8px 10px;background:#0c0a24;border-top:1px solid rgba(255,255,255,.08);flex-wrap:wrap"></div> </div> <!-- H\xF6ger: produktinfo --> <div style="padding:24px 22px;display:flex;flex-direction:column;overflow-y:auto;max-height:92vh"> <div id="sk-modal-artno" style="font-size:9px;font-family:monospace;color:rgba(196,181,244,.4);letter-spacing:.06em;margin-bottom:4px"></div> <h2 id="sk-modal-title" style="font-size:20px;font-weight:700;color:#fff;line-height:1.25;margin-bottom:4px"></h2> <div id="sk-modal-persons" style="font-size:11px;color:#c4b5f4;font-weight:600;margin-bottom:10px;display:none"></div> <p id="sk-modal-desc" style="font-size:12px;color:rgba(255,255,255,.52);line-height:1.65;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.08)"></p> <div id="sk-modal-rows" style="margin-bottom:12px"></div> <div id="sk-modal-specs-wrap" style="margin-bottom:16px;flex:1"> <div style="font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:8px;font-weight:600">Specifikation</div> <ul id="sk-modal-specs" style="list-style:none;display:flex;flex-direction:column;gap:5px"></ul> </div> <div style="font-size:10px;color:rgba(255,255,255,.3);padding:8px 10px;background:rgba(255,255,255,.04);border-radius:6px;margin-bottom:14px;line-height:1.5">Alla priser <span id="sk-modal-vat-note">exkl.</span> moms. Hyrtid 22 h. Leverans i hela Storstockholm.</div> <div style="border-top:1px solid rgba(255,255,255,.1);padding-top:16px;margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px"> <div> <div id="sk-modal-price" style="font-size:26px;font-weight:800;color:#c4b5f4;line-height:1"></div> <div id="sk-modal-pnote" style="font-size:10px;color:rgba(255,255,255,.3);margin-top:3px"></div> </div> <button id="sk-modal-cart-btn" onclick="window.skModalAddCart()" style="background:#c4b5f4;color:#0c0a24;border:none;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:background .15s" onmouseover="this.style.background='#e2dcfb'" onmouseout="this.style.background='#c4b5f4'"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
L\xE4gg i varukorg
</button> </div> </div> </div> </div> <script is:global>
  (function() {
    if (window.__skModalInit) return;
    window.__skModalInit = true;

    const overlay  = document.getElementById('sk-modal-overlay');
    const mainArea = document.getElementById('sk-modal-main');
    const thumbsEl = document.getElementById('sk-modal-thumbs');

    let _current = 0;
    let _product = null;

    // \u2500\u2500 Galleri-rendering (identisk logik som MediaCard) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderSlide(idx) {
      if (!_product) return;
      _current = idx;
      const slides = [..._product.images.map(s => ({type:'image',src:s})),
                      ..._product.videos.map(s => ({type:'video',src:s}))];
      if (!slides.length) return;
      const slide = slides[idx];

      // Stoppa eventuell video
      const oldVid = mainArea.querySelector('video');
      if (oldVid) { oldVid.pause(); oldVid.src = ''; }

      if (slide.type === 'video') {
        mainArea.style.cursor = 'pointer';
        mainArea.innerHTML = \\\`
          <video src="\\\${slide.src}" autoplay muted loop playsinline
            style="width:100%;height:100%;object-fit:cover;display:block;min-height:300px"></video>
          <div style="position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:5px;background:rgba(12,10,36,.75);border:1px solid rgba(196,181,244,.3);border-radius:4px;padding:3px 8px;font-size:9px;color:rgba(196,181,244,.85);font-weight:700;pointer-events:none">
            <span style="width:6px;height:6px;border-radius:50%;background:#c4b5f4;animation:mcPulse 1.1s ease-in-out infinite"></span>SPELAS
          </div>\\\`;
        mainArea.onclick = null; // video i kort \u2192 klick \xF6ppnar modalen (se handleCardClick)
      mainArea.style.cursor = 'pointer';
      } else {
        mainArea.style.cursor = 'zoom-in';
        mainArea.innerHTML = \\\`<img src="\\\${slide.src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;min-height:300px" />\\\`;
        mainArea.onclick = null; // bild i kort \u2192 klick \xF6ppnar modalen (se handleCardClick)
      mainArea.style.cursor = 'pointer';
      }

      // Uppdatera thumbnails
      if (thumbsEl) {
        thumbsEl.querySelectorAll('.sk-m-thumb').forEach((t, i) => {
          t.style.borderColor = i === idx ? '#c4b5f4' : 'transparent';
        });
      }
    }

    function buildThumbs() {
      if (!_product || !thumbsEl) return;
      const slides = [..._product.images.map(s => ({type:'image',src:s})),
                      ..._product.videos.map(s => ({type:'video',src:s}))];
      if (slides.length <= 1) { thumbsEl.style.display = 'none'; return; }
      thumbsEl.style.display = 'flex';
      thumbsEl.innerHTML = slides.map((s, i) => {
        if (s.type === 'video') {
          return \\\`<div class="sk-m-thumb" data-idx="\\\${i}" style="width:52px;height:43px;border-radius:5px;overflow:hidden;cursor:pointer;border:2px solid \\\${i===0?'#c4b5f4':'transparent'};background:#050410;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="52" height="43" viewBox="0 0 52 43"><rect width="52" height="43" fill="#06041e"/><path d="M22 16 L22 28 L33 22 Z" fill="#c4b5f4" opacity=".55"/></svg></div>\\\`;
        }
        return \\\`<div class="sk-m-thumb" data-idx="\\\${i}" style="width:52px;height:43px;border-radius:5px;overflow:hidden;cursor:pointer;border:2px solid \\\${i===0?'#c4b5f4':'transparent'};flex-shrink:0">
          <img src="\\\${s.src}" style="width:100%;height:100%;object-fit:cover;display:block" /></div>\\\`;
      }).join('');
      thumbsEl.querySelectorAll('.sk-m-thumb').forEach(t => {
        t.addEventListener('click', e => { e.stopPropagation(); renderSlide(parseInt(t.dataset.idx)); });
      });
    }

    function buildRows(rows) {
      const el = document.getElementById('sk-modal-rows');
      if (!el) return;
      if (!rows || !rows.length) { el.innerHTML = ''; return; }
      el.innerHTML = rows.map(g => \\\`
        <div style="margin-bottom:10px">
          \\\${g.label ? \\\`<div style="font-size:8.5px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.28);margin-bottom:5px;font-weight:600">\\\${g.label}</div>\\\` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 10px">
            \\\${g.rows.map(r => \\\`<div style="font-size:11px;color:rgba(255,255,255,.5)">\\\${r}</div>\\\`).join('')}
          </div>
        </div>\\\`).join('');
      el.style.borderTop = '1px solid rgba(255,255,255,.1)';
      el.style.paddingTop = '10px';
    }

    function updatePrices() {
      if (!_product) return;
      const inclMoms = (localStorage.getItem('sk-vat') || 'excl') === 'incl';
      const mult = inclMoms ? 1.25 : 1;
      const priceEl = document.getElementById('sk-modal-price');
      const vatNote = document.getElementById('sk-modal-vat-note');
      if (priceEl) priceEl.textContent = Math.round(_product.price * mult).toLocaleString('sv') + ' kr';
      if (vatNote) vatNote.textContent = inclMoms ? 'inkl.' : 'exkl.';
    }

    // \u2500\u2500 \xD6ppna modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.skModalOpen = function(product) {
      _product  = product;
      _current  = 0;

      const hdrTitle = document.getElementById('sk-modal-header-title');
      if (hdrTitle) hdrTitle.textContent = product.name;
      document.getElementById('sk-modal-artno').textContent = product.artno || '';
      document.getElementById('sk-modal-title').textContent = product.name;

      const personsEl = document.getElementById('sk-modal-persons');
      if (product.persons) { personsEl.textContent = product.persons; personsEl.style.display = 'block'; }
      else { personsEl.style.display = 'none'; }

      // Beskrivning \u2014 anv\xE4nd antingen desc-str\xE4ngen (specs joined) eller tom
      const descEl = document.getElementById('sk-modal-desc');
      descEl.textContent = '';
      descEl.style.display = 'none';

      // Specs-lista (pipe-separerade)
      const specsEl = document.getElementById('sk-modal-specs');
      const specsWrap = document.getElementById('sk-modal-specs-wrap');
      const specArr = product.desc ? product.desc.split('||').filter(Boolean) : [];
      if (specArr.length) {
        specsEl.innerHTML = specArr.map(s => \\\`<li style="font-size:11.5px;color:rgba(255,255,255,.55);display:flex;gap:7px"><span style="color:#4ade80;flex-shrink:0">\u25B8</span>\\\${s}</li>\\\`).join('');
        specsWrap.style.display = 'block';
      } else {
        specsWrap.style.display = 'none';
      }

      buildRows(product.rows);
      document.getElementById('sk-modal-pnote').textContent = product.priceNote || '/dygn';
      updatePrices();
      buildThumbs();
      renderSlide(0);

      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    // \u2500\u2500 St\xE4ng modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.skModalClose = function() {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      const vid = mainArea.querySelector('video');
      if (vid) { vid.pause(); vid.src = ''; }
      _product = null;
    };

    // \u2500\u2500 L\xE4gg i varukorg fr\xE5n modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.skModalAddCart = function() {
      if (!_product || !window.skCart) return;
      window.skCart.add({
        id:       _product.cartId,
        name:     _product.name,
        price:    _product.price,
        category: _product.category,
        image:    (_product.images && _product.images[0]) || '',
      });
      // Visuell feedback
      const btn = document.getElementById('sk-modal-cart-btn');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Tillagd!';
        btn.style.background = '#4ade80';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = '#c4b5f4'; }, 1800);
      }
    };

    // \u2500\u2500 Klickhanterare: f\xE5nga klick p\xE5 produktkort \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function handleCardClick(e) {
      // Skippa om klick p\xE5 knapp, l\xE4nk, pil-knapp, eller dot
      if (e.target.closest('button, a, [data-mc-dir], [data-mc-goto], .mc-dot, .mc-arr')) return;
      const card = e.target.closest('[data-sk-product]');
      if (!card) return;
      try {
        const product = JSON.parse(card.dataset.skProduct);
        e.preventDefault();
        window.skModalOpen(product);
      } catch {}
    }

    document.addEventListener('click', handleCardClick);
    document.addEventListener('astro:page-load', () => {
      // Re-attach listener after navigation (idempotent tack vare __skModalInit check)
    });

    // \u2500\u2500 Escape-tangent \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.style.display === 'flex') window.skModalClose();
    });

    // \u2500\u2500 Lyssna p\xE5 moms-toggle-\xE4ndringar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('click', e => {
      if (e.target.closest('.sk-toggle') && overlay.style.display === 'flex') {
        setTimeout(updatePrices, 50);
      }
    });

    // Pilar i modalen (tangentbord)
    document.addEventListener('keydown', e => {
      if (overlay.style.display !== 'flex') return;
      if (!_product) return;
      const total = (_product.images?.length || 0) + (_product.videos?.length || 0);
      if (e.key === 'ArrowRight') renderSlide((_current + 1) % total);
      if (e.key === 'ArrowLeft')  renderSlide((_current - 1 + total) % total);
    });

  })();
  <\/script> <!-- ========== /PRODUKTMODAL ========== -->  <!-- ========== SITEWIDE ADMINL\xC4GE ========== --> <div id="sk-admin-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(12,10,36,0.92);backdrop-filter:blur(8px);align-items:center;justify-content:center;"> <div style="background:#1a1740;border:1px solid rgba(196,181,244,0.35);border-radius:20px;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 32px 80px rgba(0,0,0,0.6);"> <div style="font-family:'DM Serif Display',serif;font-size:1.4rem;color:#c4b5f4;margin-bottom:0.25rem;">Scenkonsult Admin</div> <div style="font-family:'Space Grotesk',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.45);margin-bottom:1.75rem;">Ange adminl\xF6senord f\xF6r att aktivera adminl\xE4get</div> <input id="sk-admin-pw" type="password" placeholder="L\xF6senord" style="width:100%;background:#0c0a24;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:0.8rem 1rem;color:#f0eeff;font-family:'Space Grotesk',sans-serif;font-size:1rem;margin-bottom:0.75rem;outline:none;transition:border-color 0.2s;color-scheme:dark;" autocomplete="current-password"> <div id="sk-admin-error" style="display:none;color:#f87171;font-size:0.8rem;font-family:'Space Grotesk',sans-serif;margin-bottom:0.75rem;"></div> <div id="sk-admin-lockout" style="display:none;text-align:center;padding:1rem;background:rgba(251,191,36,0.1);border-radius:10px;margin-bottom:0.75rem;"> <span style="color:#fbbf24;font-family:'Space Grotesk',sans-serif;font-size:0.9rem;">\u{1F512} L\xE5st i <strong id="sk-admin-countdown">60</strong>s</span> </div> <button id="sk-admin-submit" style="width:100%;background:#332885;color:#fff;border:none;border-radius:10px;padding:0.8rem;font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;cursor:pointer;transition:background 0.2s;">
Aktivera adminl\xE4ge
</button> <button id="sk-admin-cancel" style="width:100%;margin-top:0.5rem;background:transparent;color:rgba(255,255,255,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.6rem;font-family:'Space Grotesk',sans-serif;font-size:0.875rem;cursor:pointer;">
Avbryt
</button> </div> </div> <!-- Admin pill-badge (visas n\xE4r adminl\xE4ge \xE4r aktivt) --> <div id="sk-admin-badge" style="display:none;position:fixed;bottom:5.5rem;right:1rem;z-index:9000;background:#332885;border:1px solid rgba(196,181,244,0.5);border-radius:999px;padding:0.4rem 0.85rem;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:600;color:#c4b5f4;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.4);align-items:center;gap:0.4rem;user-select:none;"> <span>Admin \u2726</span> <span id="sk-admin-badge-logout" title="Avaktivera" style="opacity:0.5;font-size:0.7rem;margin-left:0.2rem;">\u2715</span> </div> <script>
  (function() {
    const LS_KEY   = 'sk_admin_mode';   // localStorage \u2014 persisterar 8 h
    const FAIL_KEY = 'sk_admin_failures';
    const LOCK_KEY = 'sk_admin_locked_until';
    const TTL_MS   = 8 * 60 * 60 * 1000; // 8 timmar

    function isAdminActive() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return false;
        const { ts } = JSON.parse(raw);
        return (Date.now() - ts) < TTL_MS;
      } catch { return false; }
    }

    function activateAdmin(token) {
      const payload = { ts: Date.now() };
      if (token) payload.token = token;
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
      // S\xE4tt ocks\xE5 sessionStorage f\xF6r nuvarande flik
      if (token) sessionStorage.setItem('sk_admin_token', token);
      document.body.classList.add('sk-admin');
      const badge = document.getElementById('sk-admin-badge');
      if (badge) badge.style.display = 'flex';
    }

    function deactivateAdmin() {
      localStorage.removeItem(LS_KEY);
      sessionStorage.removeItem(FAIL_KEY);
      sessionStorage.removeItem(LOCK_KEY);
      sessionStorage.removeItem('sk_admin_token');
      document.body.classList.remove('sk-admin');
      const badge = document.getElementById('sk-admin-badge');
      if (badge) badge.style.display = 'none';
    }

    function openModal() {
      const modal = document.getElementById('sk-admin-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      setTimeout(() => {
        const pw = document.getElementById('sk-admin-pw');
        if (pw) pw.focus();
      }, 80);
    }

    function closeModal() {
      const modal = document.getElementById('sk-admin-modal');
      if (modal) modal.style.display = 'none';
      // Rensa ?admin=1 fr\xE5n URL utan reload
      const url = new URL(location.href);
      if (url.searchParams.has('admin')) {
        url.searchParams.delete('admin');
        history.replaceState({}, '', url.toString());
      }
    }

    function showError(msg) {
      const el = document.getElementById('sk-admin-error');
      if (el) { el.textContent = msg; el.style.display = 'block'; }
    }

    function clearError() {
      const el = document.getElementById('sk-admin-error');
      if (el) el.style.display = 'none';
    }

    function startCountdown(seconds) {
      const lockout = document.getElementById('sk-admin-lockout');
      const cd      = document.getElementById('sk-admin-countdown');
      const submit  = document.getElementById('sk-admin-submit');
      const pwInput = document.getElementById('sk-admin-pw');
      if (!lockout || !cd) return;

      lockout.style.display = 'block';
      if (submit) submit.disabled = true;
      if (pwInput) pwInput.disabled = true;

      let remaining = seconds;
      cd.textContent = remaining;

      const timer = setInterval(() => {
        remaining--;
        cd.textContent = remaining;
        if (remaining <= 0) {
          clearInterval(timer);
          lockout.style.display = 'none';
          if (submit) submit.disabled = false;
          if (pwInput) { pwInput.disabled = false; pwInput.focus(); }
          sessionStorage.removeItem(FAIL_KEY);
          sessionStorage.removeItem(LOCK_KEY);
        }
      }, 1000);
    }

    async function doAuth() {
      // Kontrollera lokal lockout
      const lockedUntil = parseInt(sessionStorage.getItem(LOCK_KEY) || '0', 10);
      if (lockedUntil > Date.now()) {
        const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
        startCountdown(secs);
        return;
      }

      const pwInput = document.getElementById('sk-admin-pw');
      const pw = pwInput ? pwInput.value.trim() : '';
      if (!pw) return;

      clearError();
      const submit = document.getElementById('sk-admin-submit');
      if (submit) { submit.disabled = true; submit.textContent = 'Kontrollerar\u2026'; }

      try {
        const res  = await fetch('/api/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pw })
        });
        const data = await res.json();

        if (data.ok) {
          sessionStorage.removeItem(FAIL_KEY);
          sessionStorage.removeItem(LOCK_KEY);
          // Brygga till /admin/ \u2014 sparar token s\xE5 adminpanelen slipper eget login
          closeModal();
          activateAdmin(pw);
        } else if (data.lockoutSeconds > 0) {
          const until = Date.now() + data.lockoutSeconds * 1000;
          sessionStorage.setItem(LOCK_KEY, String(until));
          showError(data.error || 'Kontot \xE4r l\xE5st.');
          startCountdown(data.lockoutSeconds);
        } else {
          showError(data.error || 'Fel l\xF6senord.');
          if (pwInput) { pwInput.value = ''; pwInput.focus(); }
        }
      } catch (err) {
        showError('N\xE4tverksfel \u2014 f\xF6rs\xF6k igen.');
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = 'Aktivera adminl\xE4ge'; }
      }
    }

    // \u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener('DOMContentLoaded', function() {

      // \xC5teraktivera om localStorage-session \xE4r aktiv
      if (isAdminActive()) {
        try {
          const stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
          // Synka token till sessionStorage f\xF6r denna flik
          if (stored.token) sessionStorage.setItem('sk_admin_token', stored.token);
        } catch {}
        activateAdmin();
      } else if (sessionStorage.getItem('sk_admin_token')) {
        // Kom fr\xE5n /admin/ i samma flik
        activateAdmin(sessionStorage.getItem('sk_admin_token'));
      }

      // \xD6ppna modal vid ?admin=1
      const params = new URLSearchParams(location.search);
      if (params.get('admin') === '1') {
        if (isAdminActive()) {
          // Redan inloggad \u2014 bara rensa URL
          const url = new URL(location.href);
          url.searchParams.delete('admin');
          history.replaceState({}, '', url.toString());
        } else {
          openModal();
          // Kolla lokal lockout direkt
          const lockedUntil = parseInt(sessionStorage.getItem(LOCK_KEY) || '0', 10);
          if (lockedUntil > Date.now()) {
            const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
            startCountdown(secs);
          }
        }
      }

      // Event listeners
      const submit = document.getElementById('sk-admin-submit');
      const cancel = document.getElementById('sk-admin-cancel');
      const pwInput = document.getElementById('sk-admin-pw');
      const badge  = document.getElementById('sk-admin-badge');
      const logoutBtn = document.getElementById('sk-admin-badge-logout');

      if (submit)  submit.addEventListener('click', doAuth);
      if (cancel)  cancel.addEventListener('click', closeModal);
      if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAuth(); });
      if (logoutBtn) logoutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deactivateAdmin();
      });
      if (badge) badge.addEventListener('click', function(e) {
        if (!e.target.closest('#sk-admin-badge-logout')) {
          location.href = '/admin/';
        }
      });

      // St\xE4ng modal vid klick utanf\xF6r rutan
      const modal = document.getElementById('sk-admin-modal');
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) closeModal();
        });
      }

      // Hover-effekt submit-knapp
      if (submit) {
        submit.addEventListener('mouseenter', () => { if (!submit.disabled) submit.style.background = '#c4b5f4'; submit.style.color = '#0c0a24'; });
        submit.addEventListener('mouseleave', () => { if (!submit.disabled) submit.style.background = '#332885'; submit.style.color = '#fff'; });
      }
    });
  })();
  <\/script>  <!-- ========== /SITEWIDE ADMINL\xC4GE ========== --></body></html>`])), addAttribute(description, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(`https://scenkonsult.se${image}`, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(`https://scenkonsult.se${image}`, "content"), title, unescapeHTML(JSON.stringify(localBusinessSchema)), schemaExtra && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(schemaExtra))), renderHead(), renderComponent($$result, "Tel", $$Tel, { "class": "nav-phone", "prefix": "\u{1F4DE} " }), renderComponent($$result, "Tel", $$Tel, { "class": "nav-mobile-phone", "prefix": "\u{1F4DE} " }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Tel", $$Tel, { "class": "footer-phone" }), renderComponent($$result, "InlineEditor", $$InlineEditor, {}), defineScriptVars({ svenProducts }));
}, "/home/claude/scenkonsult-astro/src/layouts/Layout.astro", void 0);

export { $$Layout as $, ljusData as a, bildData as b, dj as d, ljudData as l, scenData as s };
