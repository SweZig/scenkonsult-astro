/* empty css                                 */
import { c as createComponent, r as renderTemplate, a as renderHead, d as defineScriptVars } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const Scen = {
	products: [
		{
			id: "scen-small",
			name: "Scenpaket Small",
			price: 599
		},
		{
			id: "scen-small-plus",
			name: "Scenpaket Small+",
			price: 899
		},
		{
			id: "scen-small-plusplus",
			name: "Scenpaket Small++",
			price: 1199
		},
		{
			id: "scen-medium",
			name: "Scenpaket Medium",
			price: 1499
		},
		{
			id: "scen-medium-plus",
			name: "Scenpaket Medium+",
			price: 1799
		},
		{
			id: "scen-medium-plus-tak",
			name: "Scenpaket Medium+ inkl. scentak",
			price: 3799
		},
		{
			id: "scen-medium-plusplus",
			name: "Scenpaket Medium++",
			price: 2399
		},
		{
			id: "scen-large",
			name: "Scenpaket Large",
			price: 2999
		},
		{
			id: "scen-large-plus",
			name: "Scenpaket Large+",
			price: 3599
		},
		{
			id: "scen-large-plus-tak",
			name: "Scenpaket Large+ inkl. scentak",
			price: 11999
		},
		{
			id: "scen-xl",
			name: "Scenpaket XL",
			price: 5399
		},
		{
			id: "scen-xl-plus",
			name: "Scenpaket XL+",
			price: 7199
		}
	]
};
const Ljud = {
	sub: {
		Event: [
			{
				id: "event-small",
				name: "Event, Small",
				price: 799
			},
			{
				id: "event-small-plus",
				name: "Event, Small+",
				price: 1199
			},
			{
				id: "event-medium",
				name: "Event, Medium",
				price: 1599
			},
			{
				id: "event-medium-plus",
				name: "Event, Medium+",
				price: 2299
			},
			{
				id: "event-large",
				name: "Event, Large",
				price: 3199
			},
			{
				id: "event-large-plus",
				name: "Event, Large+",
				price: 3199
			}
		],
		Live: [
			{
				id: "live-small",
				name: "Live, Small",
				price: 599
			},
			{
				id: "live-medium",
				name: "Live, Medium",
				price: 1199
			},
			{
				id: "live-large",
				name: "Live, Large",
				price: 1599
			},
			{
				id: "live-xl",
				name: "Live/Music, XL",
				price: 2299
			},
			{
				id: "live-xl-plus",
				name: "Live/Music, XL+",
				price: 2999
			},
			{
				id: "live-xxl",
				name: "Live/Music, XXL",
				price: 4999
			},
			{
				id: "live-concert",
				name: "Live/Music, Concert",
				price: 6999
			}
		],
		Music: [
			{
				id: "music-small",
				name: "Music, Small",
				price: 999
			},
			{
				id: "music-small-plus",
				name: "Music, Small+",
				price: 1299
			},
			{
				id: "music-medium",
				name: "Music, Medium",
				price: 1499
			},
			{
				id: "music-large",
				name: "Music, Large",
				price: 1899
			},
			{
				id: "music-xl",
				name: "Live/Music, XL",
				price: 2299
			},
			{
				id: "music-xl-plus",
				name: "Live/Music, XL+",
				price: 2999
			},
			{
				id: "music-xxl",
				name: "Live/Music, XXL",
				price: 4999
			},
			{
				id: "music-concert",
				name: "Live/Music, Concert",
				price: 6999
			}
		],
		Portable: [
			{
				id: "portable-small",
				name: "Portable, Small",
				price: 599
			},
			{
				id: "portable-small-plus",
				name: "Portable, Small+",
				price: 699
			},
			{
				id: "portable-medium",
				name: "Portable, Medium",
				price: 799
			},
			{
				id: "portable-medium-plus",
				name: "Portable, Medium+",
				price: 999
			},
			{
				id: "portable-small-duo",
				name: "Portable, Small Duo",
				price: 1099
			},
			{
				id: "portable-large",
				name: "Portable, Large",
				price: 1199
			},
			{
				id: "portable-small-plus-duo",
				name: "Portable, Small+ Duo",
				price: 1299
			},
			{
				id: "portable-medium-duo",
				name: "Portable, Medium Duo",
				price: 1499
			},
			{
				id: "portable-medium-plus-duo",
				name: "Portable, Medium+ Duo",
				price: 1899
			},
			{
				id: "portable-large-plus",
				name: "Portable, Large+",
				price: 2299
			},
			{
				id: "portable-large-duo",
				name: "Portable, Large Duo",
				price: 2299
			}
		],
		Mixers: [
			{
				id: "mixer-2-2",
				name: "Analogt Mixerbord, 2+2 kanaler",
				price: 159
			},
			{
				id: "mixer-4-2",
				name: "Analogt Mixerbord, 4+2 kanaler",
				price: 199
			},
			{
				id: "mixer-vibz8dc",
				name: "Analogt mixerbord, 4+1 kanaler",
				price: 249
			},
			{
				id: "mixer-4-4",
				name: "Analogt Mixerbord, 4+4 kanaler",
				price: 299
			},
			{
				id: "mixer-6-4",
				name: "Analogt Mixerbord, 6+4 kanaler",
				price: 349
			},
			{
				id: "mixer-12-4",
				name: "Analogt Mixerbord, 12+4 kanaler",
				price: 399
			},
			{
				id: "mixer-16-3",
				name: "Analogt Mixerbord, 16+3 kanaler",
				price: 599
			},
			{
				id: "mixer-ilive-t80",
				name: "Digitalt mixerbord, 32+16 kanaler",
				price: 2499
			}
		]
	}
};
const Ljus = {
	sub: {
		"Färdiga paket": [
			{
				id: "ljus-small",
				name: "Ljuspaket, Small",
				price: 399
			},
			{
				id: "ljus-small-plus",
				name: "Ljuspaket, Small+",
				price: 599
			},
			{
				id: "ljus-small-pp",
				name: "Ljuspaket, Small++",
				price: 799
			},
			{
				id: "ljus-medium",
				name: "Ljuspaket, Medium",
				price: 1199
			},
			{
				id: "ljus-medium-plus",
				name: "Ljuspaket, Medium+",
				price: 1299
			},
			{
				id: "ljus-medium-pp",
				name: "Ljuspaket, Medium++",
				price: 1499
			},
			{
				id: "ljus-large",
				name: "Ljuspaket, Large",
				price: 1699
			},
			{
				id: "ljus-large-plus",
				name: "Ljuspaket, Large+",
				price: 2199
			},
			{
				id: "ljus-large-pp",
				name: "Ljuspaket, Large++",
				price: 2699
			}
		],
		Effekter: [
			{
				id: "led-par",
				name: "LED PAR (14x8W RGBW)",
				price: 79
			},
			{
				id: "led-par-9",
				name: "LED PAR (9x10W RGBW)",
				price: 99
			},
			{
				id: "led-par-uv",
				name: "LED PAR UV",
				price: 119
			},
			{
				id: "led-par-xl",
				name: "LED PAR XL (60x2W RGBW)",
				price: 149
			},
			{
				id: "led-uppladdningsbar",
				name: "LED-armatur, uppladdningsbar",
				price: 199
			}
		],
		"Rök & pyro": [
			{
				id: "rokmaskin-1500",
				name: "Rökmaskin (1500W)",
				price: 349
			},
			{
				id: "rokmaskin-650",
				name: "Rökmaskin (650W)",
				price: 449
			},
			{
				id: "kallgnistmaskin",
				name: "Kallgnistmaskin",
				price: 499
			},
			{
				id: "konfettiavfyrare",
				name: "Konfettiavfyrare",
				price: 499
			},
			{
				id: "hazer-hz1500",
				name: "Hazer HZ-1500 Pro",
				price: 649
			}
		],
		"Rök tillbehör": [
			{
				id: "ackrylatbensin-1l",
				name: "Ackrylatbensin 1 l",
				price: 59
			},
			{
				id: "ackrylatbensin-5l",
				name: "Ackrylatbensin 5 l",
				price: 239
			},
			{
				id: "granulat-100g",
				name: "Granulat 100 g (~3 min)",
				price: 299
			},
			{
				id: "granulat-200g",
				name: "Granulat 200 g (~6 min)",
				price: 479
			},
			{
				id: "rokvatska-1l",
				name: "Rökvätska 1 l",
				price: 119
			},
			{
				id: "rokvatska-3l",
				name: "Rökvätska 3 l",
				price: 239
			},
			{
				id: "rokvatska-5l",
				name: "Rökvätska 5 l",
				price: 319
			},
			{
				id: "rokvatska-5l-haze",
				name: "Rökvätska 5 l (Haze)",
				price: 339
			},
			{
				id: "konfettirör-multi",
				name: "Konfettirör, Multifärg",
				price: 119
			},
			{
				id: "konfettirör-vit",
				name: "Konfettirör, Vit (snö)",
				price: 119
			},
			{
				id: "konfettirör-guld",
				name: "Konfettirör, Guld",
				price: 139
			}
		],
		"Stativ & tross": [
			{
				id: "stativ-400",
				name: "Stativ med T-bar (400 mm)",
				price: 40
			},
			{
				id: "stativ-1200",
				name: "Stativ med T-bar (1200 mm)",
				price: 40
			},
			{
				id: "stativ-900p",
				name: "Stativ med T-bar (900 mm, premium)",
				price: 60
			},
			{
				id: "vevstativ-1200",
				name: "Vevstativ med T-bar (1200 mm)",
				price: 120
			},
			{
				id: "tross-1m",
				name: "Trosstorn 1,0 m",
				price: 300
			},
			{
				id: "tross-15m",
				name: "Trosstorn 1,5 m",
				price: 360
			}
		]
	}
};
const DJ = {
	products: [
		{
			id: "dj-controller-numark",
			name: "DJ-controller, Standalone (Numark Mixstream Pro+)",
			price: 799
		},
		{
			id: "dj-controller-denon-go",
			name: "DJ-controller, Standalone (Denon Prime GO+)",
			price: 999
		},
		{
			id: "dj-controller-denon-prime4",
			name: "DJ-controller, Standalone (Denon Prime 4+)",
			price: 1499
		},
		{
			id: "dj-rane-system-one",
			name: "DJ-system, Rane System One",
			price: 1999
		},
		{
			id: "dj-bord",
			name: "DJ-bord",
			price: 80
		},
		{
			id: "dj-bord2",
			name: "DJ-bord med front- och sidopaneler",
			price: 200
		},
		{
			id: "scenengineer",
			name: "Hyr Scenengineer",
			price: 952
		},
		{
			id: "media-editor",
			name: "Hyr Rörlig media-editor",
			price: 952
		}
	]
};
const Bild = {
	products: [
		{
			id: "projektor-xga",
			name: "Projektor (XGA)",
			price: 299
		},
		{
			id: "projektor-fhd",
			name: "Projektor (FHD)",
			price: 399
		},
		{
			id: "skarm-65",
			name: "65\" Skärm (4K UHD)",
			price: 2399
		},
		{
			id: "skarm-75",
			name: "75\" Skärm (4K UHD)",
			price: 2799
		},
		{
			id: "modulskarm-fhd",
			name: "Moduluppbyggd LED-skärm (FHD)",
			price: 1199
		},
		{
			id: "trailer-skarm",
			name: "LED-skärm på trailer (FHD)",
			price: 15499
		}
	]
};
const quoteCatalogData = {
	Scen: Scen,
	"Scen tillbehör": {
	products: [
		{
			id: "SK-SCN-ACC-0001",
			name: "Scentrapp (40 cm)",
			price: 279
		},
		{
			id: "SK-SCN-ACC-0002",
			name: "Scentrapp (60 cm)",
			price: 349
		},
		{
			id: "SK-SCN-ACC-0003",
			name: "Scenkjol (per 4 m)",
			price: 79
		},
		{
			id: "SK-SCN-ACC-0004",
			name: "Backdrop 3,5×2,5 m",
			price: 799
		}
	]
},
	Ljud: Ljud,
	Ljus: Ljus,
	DJ: DJ,
	Bild: Bild,
	"Tjänster": {
	products: [
		{
			id: "lev-standard",
			name: "Leverans — Vanlig bil (t&r)",
			price: 1118
		},
		{
			id: "lev-standard-e",
			name: "Leverans — Vanlig bil (enkel)",
			price: 559
		},
		{
			id: "lev-skrymmande",
			name: "Leverans — Bil med släp (t&r)",
			price: 1598
		},
		{
			id: "lev-skrymmande-e",
			name: "Leverans — Bil med släp (enkel)",
			price: 799
		},
		{
			id: "lev-lastbil",
			name: "Leverans — Lastbil (t&r)",
			price: 2998
		},
		{
			id: "lev-lastbil-e",
			name: "Leverans — Lastbil (enkel)",
			price: 1499
		},
		{
			id: "montering-tim",
			name: "Montering & demontering (600 kr/tim)",
			price: 600
		},
		{
			id: "fakturaavgift-49",
			name: "Fakturaavgift",
			price: 49
		},
		{
			id: "fakturaavgift-29",
			name: "Fakturaavgift (reducerad)",
			price: 29
		}
	]
}
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="sv"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin \u2014 Scenkonsult Norden</title><meta name="robots" content="noindex, nofollow"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"><script>(function(){', "\n    window.__ADMIN_QUOTE_CATALOG__ = quoteCatalog;\n  })();<\/script>", '</head> <body> <!-- \u2500\u2500 LOGIN \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div id="login-screen"> <div class="login-box"> <div class="login-logo">\u2699 Scenkonsult Admin</div> <div class="login-sub">Adminpanel \u2014 ej publik</div> <input type="password" id="login-pw" placeholder="Adminl\xF6senord" autocomplete="current-password"> <div class="login-error" id="login-error">Fel l\xF6senord, f\xF6rs\xF6k igen.</div> <button class="btn-primary" id="login-btn">Logga in</button> </div> </div> <!-- \u2500\u2500 APP \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div id="app"> <!-- Topbar --> <div class="topbar"> <div class="topbar-left"> <div class="topbar-brand">\u2699 Admin</div> <div class="topbar-nav"> <button class="nav-btn active" data-view="kanban">\u{1F4CB} Ordrar</button> <button class="nav-btn" data-view="calendar">\u{1F4C5} Kalender</button> </div> </div> <div class="topbar-right"> <span class="unread-badge" id="global-unread">0 nya</span> <button class="btn-sm" id="new-quote-btn" style="border-color:var(--brand-lav);color:var(--brand-lav)">\u2709 Ny manuell order</button> <button class="btn-sm" id="refresh-btn">\u21BB Uppdatera</button> <a href="https://scenkonsult.se" target="_blank" class="btn-sm" style="text-decoration:none;">\u2197 Sajten</a> <button class="btn-sm" id="logout-btn">Logga ut</button> </div> </div> <!-- \u2500\u2500 KANBAN VIEW \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="view active" id="view-kanban"> <div class="kanban-header"> <div class="kanban-title">Order\xF6versikt</div> <div class="kanban-filters"> <input class="filter-input" id="filter-search" placeholder="\u{1F50D} S\xF6k kund..." style="width:180px"> <input class="filter-input" type="date" id="filter-from" title="Event fr\xE5n"> <input class="filter-input" type="date" id="filter-to" title="Event till"> </div> </div> <div class="kanban-board" id="kanban-board"> <div class="loading-center"><div class="spinner"></div></div> </div> </div> <!-- \u2500\u2500 CALENDAR VIEW \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="view" id="view-calendar"> <div class="cal-header"> <div class="cal-title" id="cal-month-label">\u2014</div> <div class="cal-nav"> <button class="cal-nav-btn" id="cal-prev">\u25C0</button> <button class="cal-nav-btn" id="cal-today">Idag</button> <button class="cal-nav-btn" id="cal-next">\u25B6</button> </div> </div> <div class="cal-grid"> <div class="cal-weekdays"> <div class="cal-weekday">M\xE5n</div><div class="cal-weekday">Tis</div> <div class="cal-weekday">Ons</div><div class="cal-weekday">Tor</div> <div class="cal-weekday">Fre</div><div class="cal-weekday">L\xF6r</div> <div class="cal-weekday">S\xF6n</div> </div> <div class="cal-days" id="cal-days"></div> </div> </div> </div> <!-- \u2500\u2500 OFFERT-MODAL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="modal-overlay" id="quote-overlay"> <div class="modal" style="max-width:640px"> <div class="modal-head"> <div class="modal-title">\u2709 Skicka offert till kund</div> <button class="panel-close" id="quote-close">\u2715</button> </div> <div class="modal-body" id="quote-body"> <!-- Kunduppgifter --> <div class="section-label" style="margin-top:0">Kunduppgifter</div> <div class="form-row"> <div><label class="form-label">Namn *</label><input class="form-input" id="qc-name" placeholder="F\xF6r- och efternamn" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;"></div> <div><label class="form-label">E-post *</label><input class="form-input" type="email" id="qc-email" placeholder="kund@exempel.se" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;"></div> </div> <div class="form-row"> <div><label class="form-label">Telefon</label><input class="form-input" id="qc-phone" placeholder="070 000 00 00" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;"></div> <div><label class="form-label">Eventdatum</label><input class="form-input" type="date" id="qc-date" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;"></div> </div> <div class="form-row full" style="margin-bottom:0"> <div><label class="form-label">Plats / Adress</label><input class="form-input" id="qc-location" placeholder="Lokal eller adress" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;"></div> </div> <!-- Produktv\xE4ljare --> <div class="section-label">L\xE4gg till produkter</div> <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:0.5rem;align-items:end;margin-bottom:0.75rem" id="quote-picker-row"> <div> <label class="form-label">Kategori</label> <select id="qp-cat" onchange="quotePickerCat()" style="width:100%;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.55rem 0.75rem;font-family:inherit;font-size:0.82rem"> <option value="">\u2014 v\xE4lj \u2014</option> </select> </div> <div id="qp-sub-wrap" style="display:none"> <label class="form-label">Underkategori</label> <select id="qp-sub" onchange="quotePickerSub()" style="width:100%;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.55rem 0.75rem;font-family:inherit;font-size:0.82rem"> <option value="">\u2014 v\xE4lj \u2014</option> </select> </div> <div id="qp-prod-wrap"> <label class="form-label">Produkt</label> <select id="qp-prod" style="width:100%;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.55rem 0.75rem;font-family:inherit;font-size:0.82rem"> <option value="">\u2014 v\xE4lj kategori \u2014</option> </select> </div> <button class="btn-action btn-success" onclick="quotePickerAdd()" style="height:34px;padding:0 0.75rem;font-size:0.82rem;white-space:nowrap">\uFF0B L\xE4gg till</button> </div> <!-- Produkttabell --> <table class="quote-prod-table" id="quote-prod-table"> <thead><tr> <th>Produkt / Tj\xE4nst</th> <th style="width:80px;text-align:center">Antal</th> <th style="width:100px;text-align:right">\xE0-pris (kr)</th> <th style="width:80px;text-align:right">Summa</th> <th style="width:28px"></th> </tr></thead> <tbody id="quote-prod-tbody"></tbody> <tfoot id="quote-prod-tfoot"></tfoot> </table> <!-- Anm\xE4rkning --> <div class="section-label" style="margin-top:1rem">Anm\xE4rkning (synlig f\xF6r kunden)</div> <textarea class="form-input" id="qc-note" rows="3" placeholder="Leveransinfo, villkor, \xF6vrigt..." style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;resize:vertical;min-height:70px"></textarea> <div id="quote-error" style="display:none;margin-top:0.75rem;padding:0.75rem;background:var(--red-bg);border-radius:8px;color:var(--red);font-size:0.85rem"></div> </div> <div class="modal-foot"> <button class="btn-action" onclick="closeQuoteModal()">Avbryt</button> <button class="btn-action btn-success" id="quote-send-btn" onclick="sendQuote()">\u2709 Skicka offert</button> </div> </div> </div> <!-- \u2500\u2500 DETAIL PANEL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div id="detail-overlay"></div> <div id="detail-panel"> <div class="panel-header"> <div class="panel-title" id="panel-title">Varukorg</div> <button class="panel-close" id="panel-close">\u2715</button> </div> <div class="panel-tabs"> <button class="panel-tab active" data-tab="info">\u2139 Info</button> <button class="panel-tab" data-tab="products">\u{1F4E6} Produkter</button> <button class="panel-tab" data-tab="faktura">\u{1F9FE} Faktura</button> <button class="panel-tab" data-tab="chat">\u{1F4AC} Chatt <span id="chat-unread-badge" style="display:none;background:var(--red);color:#fff;border-radius:99px;padding:1px 6px;font-size:0.7rem;margin-left:4px"></span></button> <button class="panel-tab" data-tab="log">\u{1F4DC} Logg</button> </div> <div class="panel-body" id="panel-body"> <div class="loading-center"><div class="spinner"></div></div> </div> <div class="panel-footer" id="panel-footer"></div> </div> <!-- \u2500\u2500 TOAST \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div id="toast"></div>  </body> </html>'])), defineScriptVars({ quoteCatalog: quoteCatalogData }), renderHead());
}, "/home/claude/scenkonsult-astro/src/pages/admin/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/admin/index.astro";
const $$url = "/admin/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
