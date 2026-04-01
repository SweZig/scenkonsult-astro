/* empty css                                 */
import { c as createComponent, r as renderTemplate, d as defineScriptVars, b as renderComponent, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_Jwki9XgL.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Qdf46Cx6.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const _comment = "Alla priser exkl. moms. Uppdatera priser här — inga kodfiler behöver ändras.";
const leverans = {
	label: "Leverans & upphämtning",
	description: "Vi kör ut och hämtar upp utrustningen. Priset avser tur-och-retur.",
	zon: "Priser gäller inom Storstockholm. Längre transporter — kontakta oss.",
	standard: {
		id: "lev-standard",
		label: "Vanlig bil (tur & retur)",
		enkelresa: 559,
		pris: 1118,
		note: "559 kr × 2 resor"
	},
	skrymmande: {
		id: "lev-skrymmande",
		label: "Bil med släpvagn — skrymmande gods (tur & retur)",
		enkelresa: 799,
		pris: 1598,
		note: "799 kr × 2 resor — tillämpas automatiskt om varukorgen innehåller skrymmande produkt"
	},
	lastbil: {
		id: "lev-lastbil",
		label: "Lätt/tung lastbil",
		pris: 2998,
		note: "1499 kr × 2 resor",
		enkelresa: 1499
	}
};
const montering = {
	label: "Montering & demontering",
	description: "Vår personal monterar och demonterar utrustningen på plats.",
	prisPerTimme: 600,
	minDebiteringMin: 15,
	note: "Monteringstid per produkt finns angiven i produktinfo. Demonteringstid = monteringstid × 2.",
	note2: "Obligatorisk för scener ≥ Large (20 m²) vid leverans."
};
const tillagg = [
	{
		id: "rigg-teknik",
		label: "Teknikertjänst på plats",
		description: "Tekniker på plats under hela eventet (per timme, min 2 timmar)",
		pris: 600,
		enhet: "/tim",
		qty: true
	}
];
const frakt = {
	_comment: _comment,
	leverans: leverans,
	montering: montering,
	tillagg: tillagg
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const fraktRules = JSON.stringify(frakt);
  return renderTemplate(_a || (_a = __template(["", "  <script>(function(){", `
  const FRAKT = JSON.parse(fraktRules);
  const fmt = n => n.toLocaleString('sv') + ' kr';
  const SK_TTL = 21 * 24 * 60 * 60 * 1000;

  // Fallback-bilder f\xF6r produkter utan image-f\xE4lt (t.ex. fr\xE5n admin-offert)
  const PROD_IMG = {"small":"/images/scen/pp_small.png","small-plus":"/images/scen/pp_small_plus.png","small-plusplus":"/images/scen/pp_small_pp.png","medium":"/images/scen/pp_medium.png","medium-plus":"/images/scen/pp_medium_plus.png","medium-plus-tak":"/images/scen/pp_medium_plus_tak.png","medium-plusplus":"/images/scen/pp_medium_pp.png","large":"/images/scen/pp_large.png","large-plus":"/images/scen/pp_large_plus.png","large-plus-tak":"/images/scen/pp_large_plus_tak.png","xl":"/images/scen/pp_xl.png","xl-plus":"/images/scen/pp_xl_plus.png","event-small":"/images/ljud/pp_ljud_event_small.png","event-small-plus":"/images/ljud/pp_ljud_event_small-.png","event-medium":"/images/ljud/pp_ljud_event_medium.png","event-medium-plus":"/images/ljud/pp_ljud_event_medium-.png","event-large":"/images/ljud/pp_ljud_event_large.png","portable-small":"/images/ljud/pp_ljud_portable_small.png","portable-medium":"/images/ljud/pp_ljud_portable_medium.png","portable-medium-plus":"/images/ljud/pp_ljud_portable_medium_.png","portable-large":"/images/ljud/pp_ljud_portable_large.png","music-small":"/images/ljud/pp_ljud_music_small.png","music-small-plus":"/images/ljud/pp_ljud_music_small-.png","music-medium":"/images/ljud/pp_ljud_music_medium.png","music-large":"/images/ljud/pp_ljud_music_large.png","live-small":"/images/ljud/pp_ljud_live_small.png","live-medium":"/images/ljud/pp_ljud_live_medium.png","live-large":"/images/ljud/pp_ljud_live_large.png","mixer-2-2":"/images/ljud/pp_ljud_mixer01.png","mixer-4-2":"/images/ljud/pp_ljud_mixer02.png","mixer-4-4":"/images/ljud/pp_ljud_mixer03.png","mixer-12-4":"/images/ljud/pp_ljud_mixer05.png","dj-controller-numark":"/images/dj/pp_DJ_small.png","dj-controller-denon-go":"/images/dj/pp_DJ_denon_go_plus.png","dj-controller-denon-prime4":"/images/dj/pp_DJ_large1.png","dj-rane-system-one":"/images/dj/pp_DJ_large2.png","dj-bord":"/images/dj/pp_DJ_bord.png","projektor-xga":"/images/bild/pp_bild_projektor.png","projektor-fhd":"/images/bild/pp_bild_projektor1.png","skarm-65":"/images/bild/pp_bild_65-skarm.png","skarm-75":"/images/bild/pp_bild_75-skarm.png","stativ-400":"/images/ljus/pp_ljus_stativ06.png","stativ-1200":"/images/ljus/pp_ljus_stativ_1200.png","tross-1m":"/images/ljus/pp_ljus_tross01.png","ljus-small":"/images/ljus/pp_ljus_small.png","ljus-small-plus":"/images/ljus/pp_ljus_small-.png","ljus-small-pp":"/images/ljus/pp_ljus_small--.png","ljus-medium":"/images/ljus/pp_ljus_medium.png","ljus-medium-plus":"/images/ljus/pp_ljus_medium_plus.png","ljus-medium-pp":"/images/ljus/pp_ljus_medium_plusplus.png","ljus-large":"/images/ljus/pp_ljus_large.png","ljus-large-plus":"/images/ljus/pp_ljus_large_plus.png","ljus-large-pp":"/images/ljus/pp_ljus_large_plusplus.png","rokmaskin-1500":"/images/ljus/pp_ljus_rokmaskin.png","rokmaskin-650":"/images/ljus/pp_ljus_rokmaskin650.png","led-par":"/images/ljus/pp_ljus_effekt19.png","led-par-9":"/images/ljus/pp_ljus_effekt26.png","led-par-uv":"/images/ljus/pp_ljus_effekt21.png","led-par-xl":"/images/ljus/pp_ljus_par-xl.png","led-uppladdningsbar":"/images/ljus/pp_ljus_effekt22.png"};

  function _getImg(item) {
    if (item.image) return item.image;
    const id = item.id || '';
    return PROD_IMG[id] || PROD_IMG[id.replace(/^(scen-|ljud-|ljus-|dj-utr-)/,'')] || '';
  }

  // \u2500\u2500 PRODUKTKATALOG \u2014 auto-genererad fr\xE5n JSON (synkad) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const PROD_CATALOG = {"Scen":{"products":[{"id":"scen-small","name":"Scenpaket Small","price":599,"artno":"SK-SCN-0001","image":"/images/scen/pp_small.png","priceNote":"/dygn"},{"id":"scen-small-plus","name":"Scenpaket Small+","price":899,"artno":"SK-SCN-0002","image":"/images/scen/pp_small_plus.png","priceNote":"/dygn"},{"id":"scen-small-plusplus","name":"Scenpaket Small++","price":1199,"artno":"SK-SCN-0003","image":"/images/scen/pp_small_pp.png","priceNote":"/dygn"},{"id":"scen-medium","name":"Scenpaket Medium","price":1499,"artno":"SK-SCN-0004","image":"/images/scen/pp_medium.png","priceNote":"/dygn"},{"id":"scen-medium-plus","name":"Scenpaket Medium+","price":1799,"artno":"SK-SCN-0005","image":"/images/scen/pp_medium_plus.png","priceNote":"/dygn"},{"id":"scen-medium-plus-tak","name":"Scenpaket Medium+ inkl. scentak","price":3799,"artno":"SK-SCN-0006","image":"/images/scen/pp_medium_plus_tak.png","priceNote":"/dygn"},{"id":"scen-medium-plusplus","name":"Scenpaket Medium++","price":2399,"artno":"SK-SCN-0007","image":"/images/scen/pp_medium_pp.png","priceNote":"/dygn"},{"id":"scen-large","name":"Scenpaket Large","price":2999,"artno":"SK-SCN-0008","image":"/images/scen/pp_large.png","priceNote":"/dygn"},{"id":"scen-large-plus","name":"Scenpaket Large+","price":3599,"artno":"SK-SCN-0009","image":"/images/scen/pp_large_plus.png","priceNote":"/dygn"},{"id":"scen-large-plus-tak","name":"Scenpaket Large+ inkl. scentak","price":11999,"artno":"SK-SCN-0010","image":"/images/scen/pp_large_plus_tak.png","priceNote":"/dygn"},{"id":"scen-xl","name":"Scenpaket XL","price":5399,"artno":"SK-SCN-0011","image":"/images/scen/pp_xl.png","priceNote":"/dygn"},{"id":"scen-xl-plus","name":"Scenpaket XL+","price":7199,"artno":"SK-SCN-0012","image":"/images/scen/pp_xl_plus.png","priceNote":"/dygn"},{"id":"scentrapp_(40_cm)","name":"Scentrapp (40 cm)","price":279,"artno":"SK-SCN-ACC-0001","image":"/images/scen/pp_scentrapp.png","priceNote":"/st"},{"id":"scentrapp_(60_cm)","name":"Scentrapp (60 cm)","price":349,"artno":"SK-SCN-ACC-0002","image":"/images/scen/pp_scentrapp.png","priceNote":"/st"},{"id":"scenkjol_(per_4_m)","name":"Scenkjol (per 4 m)","price":79,"artno":"SK-SCN-ACC-0003","image":"/images/scen/pp_scenkjol.png","priceNote":"/st"},{"id":"backdrop_3,5\xD72,5_m","name":"Backdrop 3,5\xD72,5 m","price":799,"artno":"SK-SCN-ACC-0004","image":"/images/scen/pp_backdrop.png","priceNote":"/st"}]},"Ljud":{"sub":{"Portable":[{"id":"portable-small","name":"Portable, Small","price":599,"artno":"SK-LJD-POR-0001","image":"/images/ljud/pp_ljud_portable_small.png","priceNote":"/dygn"},{"id":"portable-small-plus","name":"Portable, Small+","price":699,"artno":"SK-LJD-POR-0002","image":"/images/ljud/pp_ljud_portable_small.png","priceNote":"/dygn"},{"id":"portable-medium","name":"Portable, Medium","price":799,"artno":"SK-LJD-POR-0003","image":"/images/ljud/pp_ljud_portable_medium.png","priceNote":"/dygn"},{"id":"portable-medium-plus","name":"Portable, Medium+","price":999,"artno":"SK-LJD-POR-0004","image":"/images/ljud/pp_ljud_portable_medium_.png","priceNote":"/dygn"},{"id":"portable-small-duo","name":"Portable, Small Duo","price":1099,"artno":"SK-LJD-POR-0005","image":"/images/ljud/pp_ljud_portable_small_duo.png","priceNote":"/dygn"},{"id":"portable-large","name":"Portable, Large","price":1199,"artno":"SK-LJD-POR-0006","image":"/images/ljud/pp_ljud_portable_large.png","priceNote":"/dygn"},{"id":"portable-small-plus-duo","name":"Portable, Small+ Duo","price":1299,"artno":"SK-LJD-POR-0007","image":"/images/ljud/pp_ljud_portable_small__duo.png","priceNote":"/dygn"},{"id":"portable-medium-duo","name":"Portable, Medium Duo","price":1499,"artno":"SK-LJD-POR-0008","image":"/images/ljud/pp_ljud_portable_medium_duo.png","priceNote":"/dygn"},{"id":"portable-medium-plus-duo","name":"Portable, Medium+ Duo","price":1899,"artno":"SK-LJD-POR-0009","image":"/images/ljud/pp_ljud_portable_medium_plus_duo.png","priceNote":"/dygn"},{"id":"portable-large-plus","name":"Portable, Large+","price":2299,"artno":"SK-LJD-POR-0010","image":"/images/ljud/pp_ljud_portable_large.png","priceNote":"/dygn"},{"id":"portable-large-duo","name":"Portable, Large Duo","price":2299,"artno":"SK-LJD-POR-0011","image":"/images/ljud/pp_ljud_portable_large_.png","priceNote":"/dygn"}],"Event":[{"id":"event-small","name":"Event, Small","price":799,"artno":"SK-LJD-EVE-0001","image":"/images/ljud/pp_ljud_event_small.png","priceNote":"/dygn"},{"id":"event-small-plus","name":"Event, Small+","price":1199,"artno":"SK-LJD-EVE-0002","image":"/images/ljud/pp_ljud_event_small-.png","priceNote":"/dygn"},{"id":"event-medium","name":"Event, Medium","price":1599,"artno":"SK-LJD-EVE-0003","image":"/images/ljud/pp_ljud_event_medium.png","priceNote":"/dygn"},{"id":"event-medium-plus","name":"Event, Medium+","price":2299,"artno":"SK-LJD-EVE-0004","image":"/images/ljud/pp_ljud_event_medium-.png","priceNote":"/dygn"},{"id":"event-large","name":"Event, Large","price":3199,"artno":"SK-LJD-EVE-0005","image":"/images/ljud/pp_ljud_event_large.png","priceNote":"/dygn"},{"id":"event-large-plus","name":"Event, Large+","price":3199,"artno":"SK-LJD-EVE-0006","image":"/images/ljud/pp_ljud_event_large_.png","priceNote":"/dygn"}],"Music":[{"id":"music-small","name":"Music, Small","price":999,"artno":"SK-LJD-MUS-0001","image":"/images/ljud/pp_ljud_music_small.png","priceNote":"/dygn"},{"id":"music-small-plus","name":"Music, Small+","price":1299,"artno":"SK-LJD-MUS-0002","image":"/images/ljud/pp_ljud_music_small-.png","priceNote":"/dygn"},{"id":"music-medium","name":"Music, Medium","price":1499,"artno":"SK-LJD-MUS-0003","image":"/images/ljud/pp_ljud_music_medium.png","priceNote":"/dygn"},{"id":"music-large","name":"Music, Large","price":1899,"artno":"SK-LJD-MUS-0004","image":"/images/ljud/pp_ljud_music_large.png","priceNote":"/dygn"},{"id":"music-xl","name":"Live/Music, XL","price":2299,"artno":"SK-LJD-MUS-0005","image":"/images/ljud/pp_ljud_music_xl.png","priceNote":"/dygn"},{"id":"music-xl-plus","name":"Live/Music, XL+","price":2999,"artno":"SK-LJD-MUS-0006","image":"/images/ljud/pp_ljud_music_xl-.png","priceNote":"/dygn"},{"id":"music-xxl","name":"Live/Music, XXL","price":4999,"artno":"SK-LJD-MUS-0007","image":"/images/ljud/pp_ljud_music_xxl.png","priceNote":"/dygn"},{"id":"music-concert","name":"Live/Music, Concert","price":6999,"artno":"SK-LJD-MUS-0008","image":"/images/ljud/pp_ljud_concert.png","priceNote":"/dygn"},{"id":"line-array-small","name":"Line Array, Small","price":14999,"artno":"SK-LJD-MUS-0009","image":"/images/ljud/pp_ljud_music_linearray1.png","priceNote":"/dygn"},{"id":"line-array-medium","name":"Line Array, Medium","price":19999,"artno":"SK-LJD-MUS-0010","image":"/images/ljud/pp_ljud_music_linearray2.png","priceNote":"/dygn"}],"Live":[{"id":"live-small","name":"Live, Small","price":599,"artno":"SK-LJD-LIV-0001","image":"/images/ljud/pp_ljud_live_small.png","priceNote":"/dygn"},{"id":"live-medium","name":"Live, Medium","price":1199,"artno":"SK-LJD-LIV-0002","image":"/images/ljud/pp_ljud_live_medium.png","priceNote":"/dygn"},{"id":"live-large","name":"Live, Large","price":1599,"artno":"SK-LJD-LIV-0003","image":"/images/ljud/pp_ljud_live_large.png","priceNote":"/dygn"},{"id":"live-xl","name":"Live/Music, XL","price":2299,"artno":"SK-LJD-LIV-0004","image":"/images/ljud/pp_ljud_music_xl.png","priceNote":"/dygn"},{"id":"live-xl-plus","name":"Live/Music, XL+","price":2999,"artno":"SK-LJD-LIV-0005","image":"/images/ljud/pp_ljud_music_xl-.png","priceNote":"/dygn"},{"id":"live-xxl","name":"Live/Music, XXL","price":4999,"artno":"SK-LJD-LIV-0006","image":"/images/ljud/pp_ljud_music_xxl.png","priceNote":"/dygn"},{"id":"live-concert","name":"Live/Music, Concert","price":6999,"artno":"SK-LJD-LIV-0007","image":"/images/ljud/pp_ljud_concert.png","priceNote":"/dygn"},{"id":"line-array-small","name":"Line Array, Small","price":14999,"artno":"SK-LJD-LIV-0008","image":"/images/ljud/pp_ljud_music_linearray1.png","priceNote":"/dygn"},{"id":"line-array-medium","name":"Line Array, Medium","price":19999,"artno":"SK-LJD-LIV-0009","image":"/images/ljud/pp_ljud_music_linearray2.png","priceNote":"/dygn"}],"Mixers":[{"id":"mixer-2-2","name":"Analogt Mixerbord, 2+2 kanaler","price":159,"artno":"SK-LJD-MIX-0001","image":"/images/ljud/pp_ljud_mixer01.png","priceNote":"/dygn"},{"id":"mixer-4-2","name":"Analogt Mixerbord, 4+2 kanaler","price":199,"artno":"SK-LJD-MIX-0002","image":"/images/ljud/pp_ljud_mixer02.png","priceNote":"/dygn"},{"id":"mixer-vibz8dc","name":"Analogt mixerbord, 4+1 kanaler","price":249,"artno":"SK-LJD-MIX-0003","image":"/images/ljud/pp_ljud_mixer-vibz8dc.png","priceNote":"/dygn"},{"id":"mixer-4-4","name":"Analogt Mixerbord, 4+4 kanaler","price":299,"artno":"SK-LJD-MIX-0004","image":"/images/ljud/pp_ljud_mixer03.png","priceNote":"/dygn"},{"id":"mixer-6-4","name":"Analogt Mixerbord, 6+4 kanaler","price":349,"artno":"SK-LJD-MIX-0005","image":"/images/ljud/pp_ljud_mixer04.png","priceNote":"/dygn"},{"id":"mixer-12-4","name":"Analogt Mixerbord, 12+4 kanaler","price":399,"artno":"SK-LJD-MIX-0006","image":"/images/ljud/pp_ljud_mixer05.png","priceNote":"/dygn"},{"id":"mixer-16-3","name":"Analogt Mixerbord, 16+3 kanaler","price":599,"artno":"SK-LJD-MIX-0007","image":"/images/ljud/pp_ljud_mixer06.png","priceNote":"/dygn"},{"id":"mixer-ilive-t80","name":"Digitalt mixerbord, 32+16 kanaler","price":2499,"artno":"SK-LJD-MIX-0008","image":"/images/ljud/pp_ljud_mixer-ilive-t80.png","priceNote":"/dygn"}],"Mikrofoner":[{"id":"hogtalarstativ-gravity","name":"H\xF6gtalarstativ Gravity","price":40,"artno":"SK-LJD-MIK-0001","image":"/images/ljud/pp_ljud_stativ-gravity.png","priceNote":"/dygn"},{"id":"xlr-kablar","name":"XLR kablar","price":40,"artno":"SK-LJD-MIK-0002","image":"/images/ljud/pp_ljud_tillbehor07.png","priceNote":"/dygn"},{"id":"hogtalarstativ-k&m","name":"H\xF6gtalarstativ K&M","price":50,"artno":"SK-LJD-MIK-0003","image":"/images/ljud/pp_ljud_stativ-km.png","priceNote":"/dygn"},{"id":"mikrofonstativ","name":"Mikrofonstativ","price":60,"artno":"SK-LJD-MIK-0004","image":"/images/ljud/pp_ljud_tillbehor06.png","priceNote":"/dygn"},{"id":"hogtalarstativ-gravity-premium","name":"H\xF6gtalarstativ Gravity Premium","price":60,"artno":"SK-LJD-MIK-0005","image":"/images/ljud/pp_ljud_stativ-gravity-premium.png","priceNote":"/dygn"},{"id":"handmikrofon","name":"Handmikrofon","price":80,"artno":"SK-LJD-MIK-0006","image":"/images/ljud/pp_ljud_mik01.png","priceNote":"/dygn"},{"id":"bluetooth-mottagare","name":"Bluetooth-mottagare","price":80,"artno":"SK-LJD-MIK-0007","image":"/images/ljud/pp_ljud_tillbehor04.png","priceNote":"/dygn"},{"id":"instrument-blas","name":"Instrumentmikrofon, bl\xE5s","price":80,"artno":"SK-LJD-MIK-0008","image":"/images/ljud/pp_ljud_mik04.png","priceNote":"/dygn"},{"id":"instrumentmikrofon","name":"Instrumentmikrofon","price":120,"artno":"SK-LJD-MIK-0009","image":"/images/ljud/pp_ljud_mik02.png","priceNote":"/dygn"},{"id":"hogtalarstativ-gravity-med-vev","name":"H\xF6gtalarstativ Gravity med vev","price":120,"artno":"SK-LJD-MIK-0010","image":"/images/ljud/pp_ljud_stativ-gravity-vev.png","priceNote":"/dygn"},{"id":"bluetooth-mottagare-pro","name":"Bluetooth-mottagare Pro","price":140,"artno":"SK-LJD-MIK-0011","image":"/images/ljud/pp_ljud_tillbehor_BT-pro.png","priceNote":"/dygn"},{"id":"di-box-passiv","name":"DI-box (passiv)","price":160,"artno":"SK-LJD-MIK-0012","image":"/images/ljud/pp_ljud_tillbehor_DI-passiv.png","priceNote":"/dygn"},{"id":"di-box-aktiv","name":"DI-box (aktiv)","price":240,"artno":"SK-LJD-MIK-0013","image":"/images/ljud/pp_ljud_tillbehor_DI-aktiv.png","priceNote":"/dygn"},{"id":"xlr-multikabel-6ch","name":"XLR Multikabel 15 m, 6 kanaler","price":276,"artno":"SK-LJD-MIK-0014","image":"/images/ljud/pp_ljud_tillbehor_MK-small.png","priceNote":"/dygn"},{"id":"xlr-multikabel-8ch","name":"XLR Multikabel 25 m, 8 kanaler","price":384,"artno":"SK-LJD-MIK-0015","image":"/images/ljud/pp_ljud_tillbehor_MK-medium.png","priceNote":"/dygn"},{"id":"tradlos-handmikrofon","name":"Tr\xE5dl\xF6s handmikrofon","price":400,"artno":"SK-LJD-MIK-0016","image":"/images/ljud/pp_ljud_mik05.png","priceNote":"/dygn"},{"id":"tradlost-headset","name":"Tr\xE5dl\xF6st headset","price":480,"artno":"SK-LJD-MIK-0017","image":"/images/ljud/pp_ljud_mik06.png","priceNote":"/dygn"},{"id":"tradlos-iem","name":"Tr\xE5dl\xF6st IEM","price":480,"artno":"SK-LJD-MIK-0018","image":"/images/ljud/pp_ljud_tillbehor01.png","priceNote":"/dygn"},{"id":"instrument-slagverk","name":"Instrumentmikrofoner, slagverk","price":480,"artno":"SK-LJD-MIK-0019","image":"/images/ljud/pp_ljud_mik03.png","priceNote":"/dygn"},{"id":"xlr-multikabel-24ch","name":"XLR Multikabel 15 m, 24+8 kanaler","price":632,"artno":"SK-LJD-MIK-0020","image":"/images/ljud/pp_ljud_tillbehor_MK-large.png","priceNote":"/dygn"},{"id":"slxd-1-mik","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 mik","price":699,"artno":"SK-LJD-MIK-0021","image":"/images/ljud/pp_ljud_mik09.png","priceNote":"/dygn"},{"id":"slxd-1-myggmik","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 myggmikrofon","price":699,"artno":"SK-LJD-MIK-0022","image":"/images/ljud/pp_ljud_mik13.png","priceNote":"/dygn"},{"id":"slxd-1-headset","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 headset","price":749,"artno":"SK-LJD-MIK-0023","image":"/images/ljud/pp_ljud_mik12.png","priceNote":"/dygn"},{"id":"slxd-1-lagprofil","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 l\xE5gprofil headset","price":799,"artno":"SK-LJD-MIK-0024","image":"/images/ljud/pp_ljud_mik14.png","priceNote":"/dygn"},{"id":"effektrack","name":"Effektrack med matrix & feedback-suppressor","price":1036,"artno":"SK-LJD-MIK-0025","image":"/images/ljud/pp_ljud_effektrack.png","priceNote":"/dygn"},{"id":"shure-slxd-\u2013-digitalt-tradlost-system,-2-mikrofoner","name":"Shure SLXD \u2013 Digitalt tr\xE5dl\xF6st system, 2 mikrofoner","price":1299,"artno":"SK-LJD-MIK-0026","image":"/images/ljud/pp_ljud_mik-shure-slxd4d.png","priceNote":"/dygn"},{"id":"slxd-2-myggmik","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 myggmikrofoner","price":1299,"artno":"SK-LJD-MIK-0027","image":"/images/ljud/pp_ljud_mik10.png","priceNote":"/dygn"},{"id":"slxd-2-headset","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 headset","price":1399,"artno":"SK-LJD-MIK-0028","image":"/images/ljud/pp_ljud_mik08.png","priceNote":"/dygn"},{"id":"slxd-2-lagprofil","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 l\xE5gprofil headset","price":1499,"artno":"SK-LJD-MIK-0029","image":"/images/ljud/pp_ljud_mik11.png","priceNote":"/dygn"},{"id":"wireless-8ch","name":"Tr\xE5dl\xF6st mikrofonset, 8 kanaler","price":3999,"artno":"SK-LJD-MIK-0030","image":"/images/ljud/pp_ljud_tillbehor20.png","priceNote":"/dygn"}]}},"Ljus":{"sub":{"F\xE4rdiga paket":[{"id":"ljus-small","name":"Ljuspaket, Small","price":399,"artno":"SK-LJS-PAK-0001","image":"/images/ljus/pp_ljus_small.png","priceNote":"/dygn"},{"id":"ljus-small-plus","name":"Ljuspaket, Small+","price":599,"artno":"SK-LJS-PAK-0002","image":"/images/ljus/pp_ljus_small-.png","priceNote":"/dygn"},{"id":"ljus-small-pp","name":"Ljuspaket, Small++","price":799,"artno":"SK-LJS-PAK-0003","image":"/images/ljus/pp_ljus_small--.png","priceNote":"/dygn"},{"id":"ljus-medium","name":"Ljuspaket, Medium","price":1199,"artno":"SK-LJS-PAK-0004","image":"/images/ljus/pp_ljus_medium.png","priceNote":"/dygn"},{"id":"ljus-medium-plus","name":"Ljuspaket, Medium+","price":1299,"artno":"SK-LJS-PAK-0005","image":"/images/ljus/pp_ljus_medium.png","priceNote":"/dygn"},{"id":"ljus-medium-pp","name":"Ljuspaket, Medium++","price":1499,"artno":"SK-LJS-PAK-0006","image":"/images/ljus/pp_ljus_medium.png","priceNote":"/dygn"},{"id":"ljus-large","name":"Ljuspaket, Large","price":1699,"artno":"SK-LJS-PAK-0007","image":"/images/ljus/pp_ljus_large.png","priceNote":"/dygn"},{"id":"ljus-large-plus","name":"Ljuspaket, Large+","price":2199,"artno":"SK-LJS-PAK-0008","image":"/images/ljus/pp_ljus_large_plus.png","priceNote":"/dygn"},{"id":"ljus-large-pp","name":"Ljuspaket, Large++","price":2699,"artno":"SK-LJS-PAK-0009","image":"/images/ljus/pp_ljus_large_plusplus.png","priceNote":"/dygn"}],"R\xF6k & pyro":[{"id":"rokmaskin-1500","name":"R\xF6kmaskin (1500W)","price":349,"artno":"SK-LJS-ROK-0001","image":"/images/ljus/pp_ljus_effekt23.png","priceNote":"/dygn"},{"id":"rokmaskin-650","name":"R\xF6kmaskin (650W)","price":449,"artno":"SK-LJS-ROK-0002","image":"/images/ljus/pp_ljus_effekt24.png","priceNote":"/dygn"},{"id":"kallgnistmaskin","name":"Kallgnistmaskin","price":499,"artno":"SK-LJS-ROK-0003","image":"/images/ljus/pp_ljus_effekt25.png","priceNote":"/dygn"},{"id":"konfettiavfyrare","name":"Konfettiavfyrare","price":499,"artno":"SK-LJS-ROK-0004","image":"/images/ljus/pp_ljus_confettimaskin.png","priceNote":"/dygn"},{"id":"hazer-hz1500","name":"Hazer HZ-1500 Pro","price":649,"artno":"SK-LJS-ROK-0005","image":"/images/ljus/pp_ljus_rok3.png","priceNote":"/dygn"}],"Stativ & tross":[{"id":"stativ-400","name":"Stativ med T-bar (400 mm)","price":40,"artno":"SK-LJS-STV-0001","image":"/images/ljus/pp_ljus_stativ06.png","priceNote":"/dygn"},{"id":"stativ-1200","name":"Stativ med T-bar (1200 mm)","price":40,"artno":"SK-LJS-STV-0002","image":"/images/ljus/pp_ljus_stativ_1200.png","priceNote":"/dygn"},{"id":"stativ-900p","name":"Stativ med T-bar (900 mm, premium)","price":60,"artno":"SK-LJS-STV-0003","image":"/images/ljus/pp_ljus_stativ01.png","priceNote":"/dygn"},{"id":"vevstativ-1200","name":"Vevstativ med T-bar (1200 mm)","price":120,"artno":"SK-LJS-STV-0004","image":"/images/ljus/pp_ljus_stativ02.png","priceNote":"/dygn"},{"id":"tross-1m","name":"Trosstorn 1,0 m","price":300,"artno":"SK-LJS-STV-0005","image":"/images/ljus/pp_ljus_tross01.png","priceNote":"/dygn"},{"id":"tross-15m","name":"Trosstorn 1,5 m","price":360,"artno":"SK-LJS-STV-0006","image":"/images/ljus/pp_ljus_tross03.png","priceNote":"/dygn"}]}},"DJ-utrustning":{"products":[{"id":"dj-utr-dj-controller-numark","name":"DJ-controller, Standalone (Numark Mixstream Pro+)","price":799,"artno":"SK-DJ-0001","image":"/images/dj/pp_DJ_small.png","priceNote":"/dygn"},{"id":"dj-utr-dj-controller-denon-go","name":"DJ-controller, Standalone (Denon Prime GO+)","price":999,"artno":"SK-DJ-0002","image":"/images/dj/pp_DJ_denon_go_plus.png","priceNote":"/dygn"},{"id":"dj-utr-dj-controller-denon-prime4","name":"DJ-controller, Standalone (Denon Prime 4+)","price":1499,"artno":"SK-DJ-0003","image":"/images/dj/pp_DJ_large1.png","priceNote":"/dygn"},{"id":"dj-utr-dj-rane-system-one","name":"DJ-system, Rane System One","price":1999,"artno":"SK-DJ-0004","image":"/images/dj/pp_DJ_large2.png","priceNote":"/dygn"},{"id":"dj-utr-dj-bord","name":"DJ-bord","price":80,"artno":"SK-DJ-0005","image":"/images/dj/pp_DJ_bord.png","priceNote":"/dygn"},{"id":"dj-utr-dj-bord2","name":"DJ-bord med front- och sidopaneler","price":200,"artno":"SK-DJ-0006","image":"/images/dj/pp_DJ_bord2.png","priceNote":"/dygn"},{"id":"dj-utr-scenengineer","name":"Hyr Scenengineer","price":952,"artno":"SK-DJ-0007","image":"/images/dj/pp_DJ_engineer.png","priceNote":"/tim"},{"id":"dj-utr-media-editor","name":"Hyr R\xF6rlig media-editor","price":952,"artno":"SK-DJ-0008","image":"/images/dj/pp_DJ_media-editor.png","priceNote":"/tim"}]},"Projektor & sk\xE4rm":{"products":[{"id":"projektor-xga","name":"Projektor (XGA)","price":299,"artno":"SK-BLD-0001","image":"/images/bild/pp_bild_projektor.png","priceNote":"/dygn"},{"id":"projektor-fhd","name":"Projektor (FHD)","price":399,"artno":"SK-BLD-0002","image":"/images/bild/pp_bild_projektor1.png","priceNote":"/dygn"},{"id":"skarm-65","name":"65\\" Sk\xE4rm (4K UHD)","price":2399,"artno":"SK-BLD-0003","image":"/images/bild/pp_bild_65-skarm.png","priceNote":"/dygn"},{"id":"skarm-75","name":"75\\" Sk\xE4rm (4K UHD)","price":2799,"artno":"SK-BLD-0004","image":"/images/bild/pp_bild_75-skarm.png","priceNote":"/dygn"},{"id":"modulskarm-fhd","name":"Moduluppbyggd LED-sk\xE4rm (FHD)","price":1199,"artno":"SK-BLD-0005","image":"/images/bild/pp_bild_modulskarm.png","priceNote":"/kvm/dygn"},{"id":"trailer-skarm","name":"LED-sk\xE4rm p\xE5 trailer (FHD)","price":15499,"artno":"SK-BLD-0006","image":"/images/bild/pp_bild_trailer_skarm.png","priceNote":"/dygn"}]}};

  // \u2500\u2500 ARTNO-KARTA \u2014 id \u2192 artikelnummer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const PROD_ARTNO = {"scen-small":"SK-SCN-0001","scen-small-plus":"SK-SCN-0002","scen-small-plusplus":"SK-SCN-0003","scen-medium":"SK-SCN-0004","scen-medium-plus":"SK-SCN-0005","scen-medium-plus-tak":"SK-SCN-0006","scen-medium-plusplus":"SK-SCN-0007","scen-large":"SK-SCN-0008","scen-large-plus":"SK-SCN-0009","scen-large-plus-tak":"SK-SCN-0010","scen-xl":"SK-SCN-0011","scen-xl-plus":"SK-SCN-0012","portable-small":"SK-LJD-POR-0001","portable-small-plus":"SK-LJD-POR-0002","portable-medium":"SK-LJD-POR-0003","portable-medium-plus":"SK-LJD-POR-0004","portable-small-duo":"SK-LJD-POR-0005","portable-large":"SK-LJD-POR-0006","portable-small-plus-duo":"SK-LJD-POR-0007","portable-medium-duo":"SK-LJD-POR-0008","portable-medium-plus-duo":"SK-LJD-POR-0009","portable-large-plus":"SK-LJD-POR-0010","portable-large-duo":"SK-LJD-POR-0011","event-small":"SK-LJD-EVE-0001","event-small-plus":"SK-LJD-EVE-0002","event-medium":"SK-LJD-EVE-0003","event-medium-plus":"SK-LJD-EVE-0004","event-large":"SK-LJD-EVE-0005","event-large-plus":"SK-LJD-EVE-0006","music-small":"SK-LJD-MUS-0001","music-small-plus":"SK-LJD-MUS-0002","music-medium":"SK-LJD-MUS-0003","music-large":"SK-LJD-MUS-0004","music-xl":"SK-LJD-MUS-0005","music-xl-plus":"SK-LJD-MUS-0006","music-xxl":"SK-LJD-MUS-0007","music-concert":"SK-LJD-MUS-0008","line-array-small":"SK-LJD-LIV-0008","line-array-medium":"SK-LJD-LIV-0009","live-small":"SK-LJD-LIV-0001","live-medium":"SK-LJD-LIV-0002","live-large":"SK-LJD-LIV-0003","live-xl":"SK-LJD-LIV-0004","live-xl-plus":"SK-LJD-LIV-0005","live-xxl":"SK-LJD-LIV-0006","live-concert":"SK-LJD-LIV-0007","mixer-2-2":"SK-LJD-MIX-0001","mixer-4-2":"SK-LJD-MIX-0002","mixer-vibz8dc":"SK-LJD-MIX-0003","mixer-4-4":"SK-LJD-MIX-0004","mixer-6-4":"SK-LJD-MIX-0005","mixer-12-4":"SK-LJD-MIX-0006","mixer-16-3":"SK-LJD-MIX-0007","mixer-ilive-t80":"SK-LJD-MIX-0008","hogtalarstativ-gravity":"SK-LJD-MIK-0001","xlr-kablar":"SK-LJD-MIK-0002","hogtalarstativ-k&m":"SK-LJD-MIK-0003","mikrofonstativ":"SK-LJD-MIK-0004","hogtalarstativ-gravity-premium":"SK-LJD-MIK-0005","handmikrofon":"SK-LJD-MIK-0006","bluetooth-mottagare":"SK-LJD-MIK-0007","instrument-blas":"SK-LJD-MIK-0008","instrumentmikrofon":"SK-LJD-MIK-0009","hogtalarstativ-gravity-med-vev":"SK-LJD-MIK-0010","bluetooth-mottagare-pro":"SK-LJD-MIK-0011","di-box-passiv":"SK-LJD-MIK-0012","di-box-aktiv":"SK-LJD-MIK-0013","xlr-multikabel-6ch":"SK-LJD-MIK-0014","xlr-multikabel-8ch":"SK-LJD-MIK-0015","tradlos-handmikrofon":"SK-LJD-MIK-0016","tradlost-headset":"SK-LJD-MIK-0017","tradlos-iem":"SK-LJD-MIK-0018","instrument-slagverk":"SK-LJD-MIK-0019","xlr-multikabel-24ch":"SK-LJD-MIK-0020","slxd-1-mik":"SK-LJD-MIK-0021","slxd-1-myggmik":"SK-LJD-MIK-0022","slxd-1-headset":"SK-LJD-MIK-0023","slxd-1-lagprofil":"SK-LJD-MIK-0024","effektrack":"SK-LJD-MIK-0025","shure-slxd-\u2013-digitalt-tradlost-system,-2-mikrofoner":"SK-LJD-MIK-0026","slxd-2-myggmik":"SK-LJD-MIK-0027","slxd-2-headset":"SK-LJD-MIK-0028","slxd-2-lagprofil":"SK-LJD-MIK-0029","wireless-8ch":"SK-LJD-MIK-0030","ljus-small":"SK-LJS-PAK-0001","ljus-small-plus":"SK-LJS-PAK-0002","ljus-small-pp":"SK-LJS-PAK-0003","ljus-medium":"SK-LJS-PAK-0004","ljus-medium-plus":"SK-LJS-PAK-0005","ljus-medium-pp":"SK-LJS-PAK-0006","ljus-large":"SK-LJS-PAK-0007","ljus-large-plus":"SK-LJS-PAK-0008","ljus-large-pp":"SK-LJS-PAK-0009","rokmaskin-1500":"SK-LJS-ROK-0001","rokmaskin-650":"SK-LJS-ROK-0002","kallgnistmaskin":"SK-LJS-ROK-0003","konfettiavfyrare":"SK-LJS-ROK-0004","hazer-hz1500":"SK-LJS-ROK-0005","stativ-400":"SK-LJS-STV-0001","stativ-1200":"SK-LJS-STV-0002","stativ-900p":"SK-LJS-STV-0003","vevstativ-1200":"SK-LJS-STV-0004","tross-1m":"SK-LJS-STV-0005","tross-15m":"SK-LJS-STV-0006","dj-utr-dj-controller-numark":"SK-DJ-0001","dj-utr-dj-controller-denon-go":"SK-DJ-0002","dj-utr-dj-controller-denon-prime4":"SK-DJ-0003","dj-utr-dj-rane-system-one":"SK-DJ-0004","dj-utr-dj-bord":"SK-DJ-0005","dj-utr-dj-bord2":"SK-DJ-0006","dj-utr-scenengineer":"SK-DJ-0007","dj-utr-media-editor":"SK-DJ-0008","projektor-xga":"SK-BLD-0001","projektor-fhd":"SK-BLD-0002","skarm-65":"SK-BLD-0003","skarm-75":"SK-BLD-0004","modulskarm-fhd":"SK-BLD-0005","trailer-skarm":"SK-BLD-0006"};

    // \u2500\u2500 PRODUKTBESKRIVNINGAR \u2014 auto-genererad fr\xE5n JSON \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const PROD_DESC = {"scen-small":{"desc":"Scenpodie som kan fungera som en liten scen eller podie p\xE5 en st\xF6rre scen, t.ex. f\xF6r att rigga upp ett trumset. Passar f\xF6r 1 person inkl. instrument. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-small-plus":{"desc":"Scenpodie f\xF6r 1\u20133 personer. Kan byggas vertikalt (2\xD73 m) eller horisontellt (3\xD72 m). Passar f\xF6r duett eller trio med utrustning. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-small-plusplus":{"desc":"Scenpodie f\xF6r 2\u20133 personer. Flexibla dimensioner \u2013 vertikalt 2\xD74 m eller horisontellt 3\xD72 m. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium":{"desc":"Scenpodie f\xF6r 3\u20134 personer. Passar utm\xE4rkt f\xF6r ett litet band eller talarpanel. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium-plus":{"desc":"Scenpodie f\xF6r 4\u20135 personer. Bra storlek f\xF6r band p\xE5 4\u20135 musiker eller konferensscen med talarpanel. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium-plus-tak":{"desc":"Komplett paket: Scenpaket Medium+ (12m\xB2) med scentak i aluminium med PVC-tak. Takh\xF6jd 230 cm. Enkel montering p\xE5 20\u201330 min f\xF6r 2 personer. Perfekt f\xF6r utomhusevent.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium-plusplus":{"desc":"Scenpodie f\xF6r 5\u20137 personer. R\xE4cker f\xF6r de flesta liveband och konferenser med st\xF6rre panel.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-large":{"desc":"Scen f\xF6r 5\u20138 musiker eller upptr\xE4dande. Byggs horisontellt 5\xD74 m. Hyrs enbart ut inkl. transport, montering och demontering av v\xE5r personal.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-large-plus":{"desc":"Professionell konsertscen f\xF6r 6\u20139 musiker. Hyrs enbart ut inkl. transport, montering och demontering.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-large-plus-tak":{"desc":"Komplett utomhusscen: 24m\xB2 med scentak i st\xE5l/aluminium med PVC-tak och scentrapp. Takh\xF6jd 380 cm. Hyrs enbart inkl. transport och montering av v\xE5r personal.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-xl":{"desc":"Stor konsertscen f\xF6r 8\u201312 musiker. Byggs horisontellt 9\xD74 m. Hyrs enbart inkl. transport, montering och demontering.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-xl-plus":{"desc":"V\xE5r st\xF6rsta standardscen \u2013 48m\xB2 f\xF6r 10\u201314 upptr\xE4dande. Byggs horisontellt 8\xD76 m. Hyrs enbart inkl. transport, montering och demontering.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"portable-small":{"desc":"Batteridrift, 20+ tim. Inbyggd mixer och Bluetooth. 6,5\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["6,5\\"/1\\" element","200W peak / 100W RMS","Batteridrift upp till 20 tim","Bluetooth","Vikt: 5,4 kg"]},"portable-small-plus":{"desc":"Batteridrift, 7+ tim. Inbyggd mixer och Bluetooth. 12\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["12\\"/2\\" element","600W peak / 300W RMS","Batteridrift upp till 7 tim","Bluetooth","Vikt: 13,4 kg"]},"portable-medium":{"desc":"Alto TS108 C kolumnh\xF6gtalare. 8\u2033 bas och sex 2,75\u2033 diskant. Inbyggd mixer. Smal och snygg design.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["8\u2033 bas + 6\xD72,75\u2033 element","600 W peak / 300 W RMS","Max 123 dB","Bluetooth","Vikt: 16 kg"]},"portable-medium-plus":{"desc":"Alto TS112 C kolumnh\xF6gtalare. 12\u2033 bas och \xE5tta 2,75\u2033 diskant. Inbyggd mixer.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["12\u2033 bas + 8\xD72,75\u2033 element","1 200 W peak / 600 W RMS","Max 127 dB","Bluetooth","Vikt: 24,1 kg"]},"portable-small-duo":{"desc":"Tv\xE5 batteridrivna 6,5\u2033 h\xF6gtalare p\xE5 stativ. Upp till 20 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ing\xE5r.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD76,5\u2033/1\u2033 aktiva element","400 W peak / 200 W RMS","Batteridrift upp till 20 tim","Bluetooth","Vikt: 10,8 kg"]},"portable-large":{"desc":"LD Systems Maui 28 G2. Tv\xE5 8\\" bas och 16 st 3\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2x8\\" bas + 16x3\\" element","2000W peak / 1000W RMS","Max 126 dB","Bluetooth","Vikt: 25,7 kg"]},"portable-small-plus-duo":{"desc":"Tv\xE5 batteridrivna 12\u2033 h\xF6gtalare p\xE5 stativ. Upp till 7 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ing\xE5r.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD712\u2033/2\u2033 aktiva element","1 200 W peak / 600 W RMS","Batteridrift upp till 7 tim","Bluetooth","Vikt: 26,8 kg"]},"portable-medium-duo":{"desc":"Tv\xE5 Alto TS108 C kolumnh\xF6gtalare. 8\u2033 bas och sex 2,75\u2033 diskant. Inbyggd mixer. Smal och snygg design.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD78\u2033 bas + 12\xD72,75\u2033 element","1 200 W peak / 600 W RMS","Max 124 dB","Bluetooth","Vikt: 32 kg"]},"portable-medium-plus-duo":{"desc":"Tv\xE5 Alto TS112 C kolumnh\xF6gtalare. 12\u2033 bas och \xE5tta 2,75\u2033 diskant. Inbyggd mixer.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD712\u2033 bas + 16\xD72,75\u2033 element","2 400 W peak / 1 200 W RMS","Max 129 dB","Bluetooth","Vikt: 48,2 kg"]},"portable-large-plus":{"desc":"Tv\xE5 LD Systems Maui 28 G2 kolumner. 4 st 8\\" bas och 32 st 3\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["4x8\\" bas + 32x3\\" element","4000W peak / 2000W RMS","Max 126 dB","Bluetooth","Vikt: 51,4 kg"]},"portable-large-duo":{"desc":"Tv\xE5 LD Systems Maui 28 G2 kolumner. Fyra 8\u2033 basar och 32 st 3\u2033 diskant.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["4\xD78\u2033 bas + 32\xD73\u2033 diskant","4 000 W peak / 2 000 W RMS","Max 126 dB","Bluetooth","Vikt: 51,4 kg"]},"event-small":{"desc":"Passar f\xF6r tal, s\xE5ng och paus-/bakgrundsmusik f\xF6r grupper upp till 100 personer. Tv\xE5 Alto 10\\" fullrange h\xF6gtalarenheter p\xE5 stativ.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 10\\"/1,4\\" element","2000W peak / 1000W RMS","Max 130 dB","48\u201320000 Hz","Samlad vikt: 25 kg"]},"event-small-plus":{"desc":"Passar f\xF6r grupper upp till 180 personer. Tv\xE5 Alto 12\\" fullrange h\xF6gtalarenheter p\xE5 stativ.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 12\\"/1,4\\" element","2500W peak / 1250W RMS","Max 130 dB","48\u201320000 Hz","Samlad vikt: 34 kg"]},"event-medium":{"desc":"Fyra Alto 10\\" fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 240 personer.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 10\\"/1,4\\" element","2000W peak / 1000W RMS","Max 130 dB","4 h\xF6gtalare, bredare ljudbild","Samlad vikt: 54 kg"]},"event-medium-plus":{"desc":"Fyra Alto 12\\" fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 380 personer.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 12\\"/1,4\\" element","2500W peak / 1250W RMS","Max 130 dB","62\u201320000 Hz","Samlad vikt: 62 kg"]},"event-large":{"desc":"Fyra Alto 15\\" fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 560 personer.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 15\\"/1,4\\" element","2500W peak / 1250W RMS","Max 130 dB","48\u201320000 Hz","Samlad vikt: 78 kg"]},"event-large-plus":{"desc":"Fyra Alto 15\u2033 fullrange h\xF6gtalarenheter f\xF6r upp till 560 personer. Montering 20\u201325 min.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["15\u2033/1,4\u2033 aktiva element","2 500 W peak / 1 250 W RMS","Max 130 dB","48\u201320 000 Hz","Samlad vikt: 78 kg"]},"music-small":{"desc":"DJ/trubadur f\xF6r 20\u201380 personer. Tv\xE5 10\\" fullrange och en 12\\" sub-bas.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["10\\"/1,4\\" + 12\\" sub","2000W peak / 1000W RMS","Max 130 dB","36\u201320000 Hz","Samlad vikt: 65 kg"]},"music-small-plus":{"desc":"DJ/trubadur f\xF6r 40\u2013100 pers. Tv\xE5 10\\" fullrange och tv\xE5 12\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["10\\"/1,4\\" + 2x12\\" sub","2000W peak","Max 130 dB","36\u201320000 Hz","Samlad vikt: 90 kg"]},"music-medium":{"desc":"DJ f\xF6r 60\u2013120 pers. Tv\xE5 12\\" fullrange och tv\xE5 12\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["12\\"/1,4\\" + 2x12\\" sub","2000W peak","Max 130 dB","36\u201320000 Hz","Samlad vikt: 95 kg"]},"music-large":{"desc":"DJ f\xF6r 120\u2013250 pers. Tv\xE5 12\\" fullrange och tv\xE5 15\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["12\\"/1,4\\" + 2x15\\" sub","2000W peak","Max 132 dB","29\u201320000 Hz","Samlad vikt: 115 kg"]},"music-xl":{"desc":"DJ f\xF6r 180\u2013350 pers. Tv\xE5 15\\" fullrange och tv\xE5 18\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["15\\"/1,4\\" + 18\\" sub","8000W peak / 2000W RMS","Max 132 dB","Samlad vikt: 120 kg"]},"music-xl-plus":{"desc":"DJ f\xF6r 250\u2013600 pers. 15\\" fullrange, 15\\" och 18\\" sub.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["15\\"/1,4\\" + 15\\"/18\\" sub","8000W peak","Max 132 dB","Samlad vikt: 200 kg"]},"music-xxl":{"desc":"Fyra 15\\" fullrange och fyra 18\\" sub-basar. Skrymmande produkt.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["4x15\\"/1,4\\" + 4x18\\" sub","10 000W peak","Max 132 dB","Samlad vikt: 320 kg"]},"music-concert":{"desc":"Konsert. Tv\xE5 12\\" fullrange och fyra 18\\" sub. Varje stack 2,3m h\xF6g.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["12\\"/1,4\\" + 18\\" sub","10 800W peak","Max 135 dB","Samlad vikt: 360 kg"]},"line-array-small":{"desc":"RCF line array-system f\xF6r stora konserter och utomhusevent. 8\xD7 RCF HDL 6-A fullrange + 2\xD7 RCF Sub 8003-AS MK3. Pris fr\xE5n beroende p\xE5 konfiguration och montering.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["8\xD76\\" fullrange line array","2\xD718\\" sub-basar","Max 138 dB SPL","R\xE4ckvidd upp till 80 m","Kr\xE4ver lyfttorn eller rigg"]},"line-array-medium":{"desc":"RCF line array-system f\xF6r stora konserter och festivaler. 10\xD7 RCF HDL 6-A fullrange + 4\xD7 RCF Sub 8003-AS MK3. Pris fr\xE5n beroende p\xE5 konfiguration och montering.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["10\xD76\\" fullrange line array","4\xD718\\" sub-basar","Max 140 dB SPL","R\xE4ckvidd upp till 100 m","Kr\xE4ver lyfttorn eller rigg"]},"live-small":{"desc":"Passar f\xF6r trubadur f\xF6r grupper 20\u201360 personer. Tv\xE5 Alto 12\\" h\xF6gtalarenheter med inbyggd mixer.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["12\\"/2\\" fullrange","720W peak / 360W RMS","Max 120 dB","8-bands EQ","Samlad vikt: 58 kg"]},"live-medium":{"desc":"Trubadur eller DJ f\xF6r 60\u2013100 personer. Tv\xE5 Alto 15S sub-basar samt tv\xE5 12\\" fullrange.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["15\\" sub + 12\\"/2\\" fullrange","2000W peak / 1080W RMS","Max 130 dB","45\u201320000 Hz","Samlad vikt: 105 kg"]},"live-large":{"desc":"Liveband f\xF6r 120\u2013200 personer. Fyra 15S sub-basar och tv\xE5 15\\" fullrange.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["4x15\\" sub + 2x15\\" fullrange","3600W peak / 1800W RMS","Max 120 dB","Samlad vikt: 140 kg"]},"live-xl":{"desc":"Trubadur eller DJ f\xF6r 180\u2013350 personer. Tv\xE5 15\\" fullrange och tv\xE5 18\\" sub-basar.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["15\\"/1,4\\" + 18\\" sub","8000W peak / 2000W RMS","Max 132 dB","29\u201320000 Hz","Samlad vikt: 120 kg"]},"live-xl-plus":{"desc":"DJ f\xF6r 250\u2013600 personer. Tv\xE5 15\\" fullrange, tv\xE5 15\\" sub och 18\\" sub.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["15\\"/1,4\\" + 15\\"/18\\" sub","8000W peak / 2000W RMS","Max 132 dB","29\u201320000 Hz","Samlad vikt: 200 kg"]},"live-xxl":{"desc":"DJ f\xF6r 500\u20131500 personer. Fyra 15\\" fullrange och fyra 18\\" sub-basar.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["4x15\\"/1,4\\" + 4x18\\" sub","10 000W peak / 2800W RMS","Max 132 dB","29\u201320000 Hz","Samlad vikt: 320 kg"]},"live-concert":{"desc":"Konsert f\xF6r liveband eller DJ. Tv\xE5 12\\" fullrange och fyra 18\\" sub. Varje stack 2,3m h\xF6g.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["12\\"/1,4\\" + 18\\" sub","10 800W peak / 2700W RMS","Max 135 dB","37\u201317000 Hz","Samlad vikt: 360 kg"]},"mixer-2-2":{"desc":"Kompakt Alto-mixer med 2 mic + 2 stereokanaler och inbyggd Bluetooth.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-4-2":{"desc":"Alto-mixer med 4 mic + 2 stereokanaler, inbyggda effekter och Bluetooth.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-vibz8dc":{"desc":"LD System Vibz8dc med 4 mic-kanaler, 2 stereokanaler och inbyggd kompressor p\xE5 kanal 1 & 2.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-4-4":{"desc":"Mackie-mixer med 4 mic + 4 stereokanaler. Kommer i transportv\xE4ska.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-6-4":{"desc":"Allen & Heath ZED14. 6 mic + 4 stereokanaler med 69 dB gain.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-12-4":{"desc":"Alto Live L16. 12 mic + 4 stereokanaler, 24-bit DSP och 256 effekter.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-16-3":{"desc":"Allen & Heath ZED22FX. 16 mic + 3 stereokanaler, USB, high-pass filter.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-ilive-t80":{"desc":"Allen & Heath iLive T80 studio- & konsert-mixer med Stagebox p\xE5 scenen via CAT5/6-kabel.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-gravity":{"desc":"Max last 30 kg, vikt 3,7 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"xlr-kablar":{"desc":"1,0m\u201315m, fr 40 kr (50 kr inkl moms)","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-k&m":{"desc":"Max last 30 kg, vikt 3,7 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mikrofonstativ":{"desc":"Mikrofonstativ med justerbar h\xF6jd","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-gravity-premium":{"desc":"Max last 50 kg, vikt 6,4 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"handmikrofon":{"desc":"Handmikrofon inkl 6 m XLR kabel","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"bluetooth-mottagare":{"desc":"Omvandlar tr\xE5dl\xF6st ljud till analog signal","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"instrument-blas":{"desc":"Mikrofon f\xF6r bl\xE5sinstrument, inkl. XLR-kabel.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["F\xF6r bl\xE5sinstrument","Clip-on mikrofon","XLR-anslutning","Kardioid polarm\xF6nster"]},"instrumentmikrofon":{"desc":"Instrumentmikrofon f\xF6r t.ex. trumma eller bl\xE5s","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-gravity-med-vev":{"desc":"Max last 50 kg, vikt 9,1 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"bluetooth-mottagare-pro":{"desc":"Bluetooth-mottagare med l\xE4ngre r\xE4ckvidd. Tr\xE5dl\xF6s anslutning till PA.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"di-box-passiv":{"desc":"Passiv DI-box, 2 kanaler. XLR ut / 6,35 mm in.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"di-box-aktiv":{"desc":"Aktiv DI-box, 1 kanal. XLR ut / 6,35 mm in, 9V batteri.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"xlr-multikabel-6ch":{"desc":"Stagebox med 15 m multikabel, 6 kanaler.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"xlr-multikabel-8ch":{"desc":"Stagebox med 25 m multikabel, 8 kanaler.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"tradlos-handmikrofon":{"desc":"Tr\xE5dl\xF6s handmikrofon, ca 30 m r\xE4ckvidd","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["UHF tr\xE5dl\xF6s","R\xE4ckvidd ca 30 m","Kr\xE4ver AA-batteri","Mottagar-enhet ing\xE5r"]},"tradlost-headset":{"desc":"Tr\xE5dl\xF6st headset, ca 30 m r\xE4ckvidd","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["UHF tr\xE5dl\xF6s","R\xE4ckvidd ca 30 m","Bodypack + headset ing\xE5r","Kr\xE4ver AA-batteri"]},"tradlos-iem":{"desc":"In-ear monitor f\xF6r scen, ca 30 m r\xE4ckvidd.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["In-ear monitor f\xF6r scen","R\xE4ckvidd ca 30 m","Bodypack + in-ear ing\xE5r","Kr\xE4ver AA-batteri"]},"instrument-slagverk":{"desc":"Mikrofoner f\xF6r trumset/slagverk, inkl. XLR-kablar.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Mikrofonkit f\xF6r trumset/slagverk","Inkl. XLR-kablar och clips","Dynamiska mikrofoner","Kardioid/hyperkardoid polarm\xF6nster"]},"xlr-multikabel-24ch":{"desc":"Stagebox stor med 15 m multikabel, 24+8 kanaler.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"slxd-1-mik":{"desc":"Digitalt tr\xE5dl\xF6st system med SM58-kapsel. AES-256, r\xE4ckvidd ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","SM58-kapsel (vokal)","R\xE4ckvidd ca 100 m","Auto-scan frekvens","Rack-monterbar mottagare"]},"slxd-1-myggmik":{"desc":"Digitalt tr\xE5dl\xF6st system med bodypack och myggmikrofon. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","Bodypack + myggmikrofon","R\xE4ckvidd ca 100 m","Auto-scan frekvens","Rack-monterbar mottagare"]},"slxd-1-headset":{"desc":"Digitalt tr\xE5dl\xF6st system med bodypack och headset. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","Bodypack + headset","R\xE4ckvidd ca 100 m","Auto-scan frekvens","Rack-monterbar mottagare"]},"slxd-1-lagprofil":{"desc":"Digitalt tr\xE5dl\xF6st system med bodypack och \xF6ronh\xE4ngande l\xE5gprofil headset.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","Bodypack + \xF6ronh\xE4ngande headset","R\xE4ckvidd ca 100 m","Diskret l\xE5gprofil-design","Rack-monterbar mottagare"]},"effektrack":{"desc":"5-zon ART-matrix + Klark Teknik DP1000 feedback-suppressor.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["5-zon ART-matrix","Klark Teknik DP1000 feedback-suppressor","F\xF6rhindrar rundg\xE5ng","Rack-monterat 19\\"","Anv\xE4nds med PA-system"]},"shure-slxd-\u2013-digitalt-tradlost-system,-2-mikrofoner":{"desc":"Dubbelt digitalt tr\xE5dl\xF6st system med 2 handh\xE5llna SM58-mikrofoner. Ca 100 m r\xE4ckvidd. AES-256-kryptering.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 SM58 handh\xE5llna mikrofoner","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Auto-scan frekvens"]},"slxd-2-myggmik":{"desc":"Digitalt tr\xE5dl\xF6st system med 2 bodypack och myggmikrofoner. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 bodypack + myggmikrofon","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Auto-scan frekvens"]},"slxd-2-headset":{"desc":"Digitalt tr\xE5dl\xF6st system med 2 bodypack och headset. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 bodypack + headset","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Auto-scan frekvens"]},"slxd-2-lagprofil":{"desc":"Digitalt tr\xE5dl\xF6st system med 2 bodypack och \xF6ronh\xE4ngande l\xE5gprofil headset.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 bodypack + l\xE5gprofil headset","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Diskret design"]},"wireless-8ch":{"desc":"4 handmikrofoner och 4 headset med antennsplitter. 823\u2013832 MHz, upp till 50 m r\xE4ckvidd.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["4\xD7 handmikrofon + 4\xD7 headset","Antennsplitter ing\xE5r","823\u2013832 MHz band","R\xE4ckvidd upp till 50 m","8 oberoende kanaler"]},"ljus-small":{"desc":"LED T-bar med fyra RGB PAR armaturer p\xE5 stativ. Synkar till musik. Plug and play.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["1 stativ med T-bar","4x PAR armaturer: 12x9W RGB","H\xF6jd: 2500 mm","Str\xF6mf\xF6rbrukning: 260W","Samlad vikt: 16 kg"]},"ljus-small-plus":{"desc":"Trosstorn med 100W COB LED moving head p\xE5 toppen. Roterar 540/180\xB0, programmerbar.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Trosstorn 1 m","Moving head: 36x3W RGBW","Str\xE5lvinkel: 15\xB0","DMX/musikstyrning","H\xF6jd p\xE5 tross: 1 m"]},"ljus-small-pp":{"desc":"Fyra effekter p\xE5 tv\xE5 stativ: LED PAR, roterande armaturer, stroboskop/UV och laser.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["2 stativ med T-bars","4 typer av effekter","Str\xF6mf\xF6rbrukning: 340W","DMX och musikstyrning","Samlad vikt: 30 kg"]},"ljus-medium":{"desc":"Tv\xE5 trosstorn med 120W COB LED + 26 RGBW moving heads. DMX eller automatik.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["2 trosstorn","2x moving heads: 120W COB + 26x2W RGBW","Str\xE5lvinkel: 25\xB0","DMX/musikstyrning","H\xF6jd p\xE5 tross: 1 m"]},"ljus-medium-plus":{"desc":"Fem effekter p\xE5 tre stativ: LED PAR, roterande, stroboskop/UV och LED scanners.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["3 stativ","5 typer av effekter inkl scanners","Str\xF6mf\xF6rbrukning: 340W","DMX och musikstyrning","Samlad vikt: 30 kg"]},"ljus-medium-pp":{"desc":"Sex effekter: LED PAR, Moving Head Wash, Moving Head Beam. Kan styras till musik.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["2 stativ","4x LED PAR + 2x Moving Head Wash + 2x Moving Head Beam","DMX och musikstyrning"]},"ljus-large":{"desc":"Professionellt ljuspaket med moving heads, PAR-armaturer och stroboskop. Passar f\xF6r medelstora event och galor.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Moving heads","PAR-armaturer","Stroboskop","DMX-styrning"]},"ljus-large-plus":{"desc":"Komplett ljusrigg f\xF6r st\xF6rre event med moving heads, PAR, stroboskop och effekter.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Moving heads","PAR-armaturer","Stroboskop","Laser/effekter","DMX-styrning"]},"ljus-large-pp":{"desc":"Maximal ljusrigg med komplett ljuss\xE4ttning f\xF6r stora konserter och galor.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Moving heads","PAR-armaturer","Stroboskop","Laser/effekter","LED wash","DMX-styrning"]},"rokmaskin-1500":{"desc":"R\xF6kmaskin med inbyggd RGB-belysning. Inkl 1 l r\xF6kv\xE4tska. 1 st: 349 kr, 2 st: 649 kr, 4 st: 1249 kr.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["6x3W LED RGB","Dimeffekt: 85 m\xB3/min","Tr\xE5dl\xF6s fj\xE4rrkontroll","Inkl 1 l r\xF6kv\xE4tska","Vikt: 5 kg"]},"rokmaskin-650":{"desc":"Kraftfullare r\xF6kmaskin med 12 RGB-lampor. Inkl 1 l r\xF6kv\xE4tska. 1 st: 449 kr, 2 st: 849 kr, 4 st: 1699 kr.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["12x3W LED RGB","Dimeffekt: 125 m\xB3/min","Tr\xE5dl\xF6s fj\xE4rrkontroll","Inkl 1 l r\xF6kv\xE4tska","Vikt: 10 kg"]},"kallgnistmaskin":{"desc":"Cold spark machine f\xF6r scen, br\xF6llop eller fest. Kr\xE4ver granulat. 1 st: 499 kr, 2 st: 949 kr, 4 st: 1799 kr.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["700W","F\xF6rv\xE4rmningstid: ca 4 min","DMX 512","Granulat: 200g = ca 6 min","Vikt: 8 kg"]},"konfettiavfyrare":{"desc":"Konfettiavfyrare som skjuter av ett konfettir\xF6r \u2013 perfekt f\xF6r firanden och shower.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["Elektrisk avfyrare","Inkl konfettir\xF6r"]},"hazer-hz1500":{"desc":"Professionell hazer som skapar ett finf\xF6rdelat dis \u2014 perfekt f\xF6r att synligg\xF6ra ljusstr\xE5lar. 1 st: 649 kr, 2 st: 1 199 kr. Inkl 1 l r\xF6kv\xE4tska.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["DMX-styrning","Kontinuerlig dis-produktion","Stabil output utan pulsar","Inkl 1 l r\xF6kv\xE4tska","Flightcase-monterad"]},"stativ-400":{"desc":"Ljusstativ standard med 400 mm T-bar. Upp till 2,4 m h\xF6jd, max 20 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 400 mm","H\xF6jd: 1,25\u20132,40 m","Max 20 kg","Vikt: 3,7 kg"]},"stativ-1200":{"desc":"Ljusstativ standard med 1200 mm T-bar. Plats f\xF6r upp till 4 effekter.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 1200 mm","H\xF6jd: 1,25\u20132,40 m","Max 20 kg","Vikt: 3,7 kg"]},"stativ-900p":{"desc":"Premiumstativ med 900 mm T-bar. Upp till 2,5 m h\xF6jd, max 30 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 900 mm","H\xF6jd: 1,10\u20132,50 m","Max 30 kg","Vikt: 5,8 kg"]},"vevstativ-1200":{"desc":"Premiumvevstativ med 1200 mm T-bar. Upp till 3,7 m h\xF6jd, max 35 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 1200 mm","H\xF6jd: 1,70\u20133,70 m","Max 35 kg","Vikt: 20 kg"]},"tross-1m":{"desc":"Trosstorn med basplatta + 1,0 m 4-punktstross + topplatta. Max 50 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["4-punkts tross","H\xF6jd: 1,0 m","Max 50 kg","Vikt: 16 kg"]},"tross-15m":{"desc":"Trosstorn med basplatta + 1,5 m 4-punktstross + topplatta. Max 50 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["4-punkts tross","H\xF6jd: 1,5 m","Max 50 kg","Vikt: 18 kg"]},"dj-utr-dj-controller-numark":{"desc":"Standalone DJ-controller. St\xF6djer Amazon Music, Tidal, Beatport, SoundCloud Go+, Serato DJ m.fl. Inbyggd 7\\" touch-display och fyra effekter.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Standalone \u2013 ingen dator kr\xE4vs","7\\" h\xF6guppl\xF6st touch-display","Amazon Music, Tidal, Beatport, SoundCloud, Serato DJ","4 inbyggda effekter (Echo, Flanger, Delay, Phaser)","2x6\\" touch-jog wheels","DMX-styrning"]},"dj-utr-dj-controller-denon-go":{"desc":"B\xE4rbar standalone DJ-controller med inbyggt batteri (upp till 4 tim). Bluetooth f\xF6r tr\xE5dl\xF6sa h\xF6gtalare. 26 Main FX, 2 Sweep FX, 10 Touch FX.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Standalone \u2013 ingen dator kr\xE4vs","Upp till 4 tim batteridrift","Bluetooth s\xE4ndare f\xF6r tr\xE5dl\xF6sa h\xF6gtalare","26 Main FX, 2 Sweep FX, 10 Touch FX","Amazon Music, Tidal, Beatport, SoundCloud"]},"dj-utr-dj-controller-denon-prime4":{"desc":"V\xE4rldens mest kraftfulla frist\xE5ende DJ-system. Fyra deck, Stems-separation, Amazon Music, TIDAL, Beatsource, Beatport, Soundcloud GO+, Serato DJ.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["4 frist\xE5ende deck","Stems-separation (branschens f\xF6rsta frist\xE5ende)","Amazon Music, TIDAL, Beatsource, Beatport, Serato","Oberoende zonutg\xE5ng f\xF6r separat lounge","2 mikrofonkanaler med EQ och talkover"]},"dj-utr-dj-rane-system-one":{"desc":"V\xE4rldens f\xF6rsta all-in-one DJ-system med motoriserade 7,2\\" aluminiumtallrikar. Engine DJ inbyggt med Serato DJ-st\xF6d.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Motoriserade 7,2\\" aluminiumtallrikar","Engine DJ inbyggt + Serato DJ","Fader FX, Sweep FX, Touch FX, Main FX","Stems-separation","Laptop-fri drift"]},"dj-utr-dj-bord":{"desc":"Portabelt DJ-bord som rymmer DJ-controller. Hopf\xE4llbart, l\xE4tt att frakta.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Material: Metall","M\xE5tt (BxDxH): 1000 x 480 x (700\u2013900) mm","Vikt: 11 kg"]},"dj-utr-dj-bord2":{"desc":"Portabelt DJ-bord med front- och sidopaneler som rymmer DJ-controller.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Material: Aluminium/tyg","M\xE5tt (BxDxH): 1203 x 605 x 1125 mm","Vikt: 14 kg"]},"dj-utr-scenengineer":{"desc":"Hyr en scenengineer till livespelningen eller festen. Vi har tekniker p\xE5 olika niv\xE5er som kan styra ljud, ljus och bild.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["952 kr/tim exkl moms (1 190 kr inkl)"]},"dj-utr-media-editor":{"desc":"Hyr en media-editor f\xF6r att skapa r\xF6rligt inneh\xE5ll f\xF6r sk\xE4rmar och presentationer.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Fotograf fast media: 600 kr/tim (750 inkl moms)","Fotograf r\xF6rligt media: 792 kr/tim (990 inkl moms)","AI-specialist: 1 592 kr/tim (1 990 inkl moms)"]},"projektor-xga":{"desc":"Miniprojektor Toshiba med XGA-uppl\xF6sning (1024\xD7768). Utm\xE4rkt f\xF6r presentationer. Klarar 60\u2033\u2013100\\".","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["1024\xD7768 (XGA)","Klarar SXGA 1280\xD71024","1100 ANSI lumen","Bildf\xF6rh\xE5llande 16:9","Vikt: 0,9 kg"]},"projektor-fhd":{"desc":"BenQ Full HD-projektor (1920\xD71080). Fungerar i dagsljus. Klarar 60\\"\u2013300\\".","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["Full HD 1920\xD71080","3200 ANSI lumen","Bildf\xF6rh\xE5llande 16:9","Vikt: 2,6 kg"]},"skarm-65":{"desc":"65\\" Samsung professionell 4K-sk\xE4rm (3840\xD72160). Perfekt f\xF6r fest-, event- eller m\xF6teslokal.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["65\\" Samsung","Ultra HD 3840\xD72160","VESA 400\xD7300","Vikt: 30,9 kg","Skrymmande \u2013 transport ing\xE5r"]},"skarm-75":{"desc":"75\\" Samsung professionell 4K-sk\xE4rm (3840\xD72160). Perfekt f\xF6r event eller m\xF6teslokal.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["75\\" Samsung","Ultra HD 3840\xD72160","VESA 400\xD7300","Vikt: 30,9 kg","Skrymmande \u2013 transport ing\xE5r"]},"modulskarm-fhd":{"desc":"Moduluppbyggd storbildssk\xE4rm Full HD. Start fr\xE5n 3,75 m\xB2 (4 496 kr exkl moms). Utomhus, scen eller m\xE4ssa. Inkl transport och montering.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["Full HD 1920\xD71080","Ljusstyrka 5000 nits","Pris per kvm","Str\xF6mbehov 3-fas 16A","Kr\xE4ver inh\xE4gnat/bevakat omr\xE5de utomhus"]},"trailer-skarm":{"desc":"7 m\xB2 mobil storbildssk\xE4rm p\xE5 trailer. Full HD. Optimalt avst\xE5nd ca 9\u201312 m. Inkl transport och montering.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["7 m\xB2 (1587\\")","Full HD 1920\xD71080","Ljusstyrka 5000 nits","Str\xF6mbehov 3-fas 16A","Kr\xE4ver inh\xE4gnat/bevakat omr\xE5de utomhus"]}};

    // \u2500\u2500 PRODUKT-MODAL (globalt via Layout.astro sk-modal) \u2500\u2500\u2500\u2500\u2500
  function openProductModal(item) {
    if (!window.skModalOpen) return;
    const info = PROD_DESC[item.id] || PROD_DESC[item.id?.replace(/^(scen-)/,'')] || {};
    const imgSrc = _getImg(item);
    const artno = item.artno || PROD_ARTNO[item.id] || '';
    const specArr = info.includes?.length ? info.includes : (info.desc ? [info.desc] : []);
    window.skModalOpen({
      name:      item.name,
      artno:     artno,
      desc:      specArr.join('||'),
      rows:      [],
      price:     item.price,
      priceNote: item.priceNote || '/dygn',
      category:  item.category || item.cat || '',
      cartId:    item.id,
      images:    imgSrc ? [imgSrc] : [],
      videos:    [],
      persons:   '',
    });
  }

  // \u2500\u2500 PRODUKTV\xC4LJARE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  (function initPicker() {
    const catSel  = document.getElementById('pp-cat');
    const subWrap = document.getElementById('pp-sub-wrap');
    const subSel  = document.getElementById('pp-sub');
    const prodSel = document.getElementById('pp-prod');
    const addBtn  = document.getElementById('pp-add-btn');
    if (!catSel) return;

    // Fyll kategorier
    catSel.innerHTML = '<option value="">\u2014 v\xE4lj kategori \u2014</option>' +
      Object.keys(PROD_CATALOG).map(k => \`<option value="\${k}">\${k}</option>\`).join('');

    function populateProducts(prods) {
      prodSel.innerHTML = '<option value="">\u2014 v\xE4lj produkt \u2014</option>' +
        (prods||[]).map(p => {
          const artno = p.artno || PROD_ARTNO[p.id] || '';
          const artnoStr = artno ? \` [\${artno}]\` : '';
          return \`<option value="\${p.id}" data-price="\${p.price}" data-name="\${p.name.replace(/"/g,'&quot;')}" data-artno="\${artno}">\${p.name}\${artnoStr} \u2014 \${p.price.toLocaleString('sv')} kr</option>\`;
        }).join('');
    }

    catSel.addEventListener('change', () => {
      const entry = PROD_CATALOG[catSel.value];
      subWrap.style.display = 'none';
      prodSel.innerHTML = '<option value="">\u2014 v\xE4lj kategori \u2014</option>';
      if (!entry) return;
      if (entry.sub) {
        subSel.innerHTML = '<option value="">\u2014 v\xE4lj underkategori \u2014</option>' +
          Object.keys(entry.sub).map(k => \`<option value="\${k}">\${k}</option>\`).join('');
        subWrap.style.display = '';
      } else {
        populateProducts(entry.products);
      }
    });

    subSel.addEventListener('change', () => {
      const entry = PROD_CATALOG[catSel.value];
      if (entry?.sub && subSel.value) populateProducts(entry.sub[subSel.value]);
    });

    addBtn.addEventListener('click', () => {
      const opt = prodSel.options[prodSel.selectedIndex];
      if (!opt || !opt.value) return;
      const id     = opt.value;
      const name   = opt.dataset.name || opt.textContent.split(' \u2014 ')[0];
      const price  = parseInt(opt.dataset.price) || 0;
      const imgSrc = PROD_IMG[id] || '';
      const artnoVal = opt.dataset.artno || PROD_ARTNO[id] || '';

      const cart = getCart();
      const ex = cart.find(i => i.id === id);
      const artno = PROD_ARTNO[id] || '';
      if (ex) { ex.qty++; } else {
        cart.push({ id, name, price, qty: 1, category: catSel.value, priceNote: '/dygn', image: imgSrc, artno: artnoVal });
      }
      saveCart(cart);
      updateNavBadge(); renderCart(); updateSummary();

      // Visuell feedback
      addBtn.textContent = '\u2713 Tillagd!';
      addBtn.style.background = '#166534';
      setTimeout(() => { addBtn.textContent = '\uFF0B L\xE4gg till'; addBtn.style.background = ''; }, 1500);
      prodSel.selectedIndex = 0;
    });
  })();
  function _genCartId() { const h=()=>Math.random().toString(16).slice(2,6).toUpperCase(); return \`SK-\${h()}\${h()}-\${h()}\`; }
  function _getCartData() {
    try {
      const raw = localStorage.getItem('sk-cart');
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (Array.isArray(d)) return { id: _genCartId(), expires: Date.now()+SK_TTL, items: d };
      if (d.expires && Date.now() > d.expires) { localStorage.removeItem('sk-cart'); return null; }
      return d;
    } catch { return null; }
  }
  const getCart = () => _getCartData()?.items || [];
  const getCartId = () => _getCartData()?.id || null;
  const saveCart = items => {
    try {
      const ex = _getCartData();
      localStorage.setItem('sk-cart', JSON.stringify({ id: ex?.id || _genCartId(), expires: Date.now()+SK_TTL, items }));
    } catch {}
  };

  function updateNavBadge() {
    const total = getCart().reduce((s,i) => s + i.qty, 0);
    ['navCartBadge','mobileCartBadge'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = String(total); el.classList.toggle('hidden', total === 0); }
    });
  }

  // Leverans: automatisk bil/sl\xE4pvagn beroende p\xE5 om varukorgen har skrymmande produkt
  function cartHasBulky(cart) {
    return cart.some(i => i.bulky === true);
  }
  function calcLev(cart) {
    const hasBulky = cartHasBulky(cart);
    if (hasBulky) {
      return {
        price: FRAKT.leverans.skrymmande.pris,
        label: FRAKT.leverans.skrymmande.label,
        note: FRAKT.leverans.skrymmande.note,
      };
    }
    return {
      price: FRAKT.leverans.standard.pris,
      label: FRAKT.leverans.standard.label,
      note: FRAKT.leverans.standard.note,
    };
  }

  // Montering: 600 kr/tim, min 15 min, baserat p\xE5 monteringMin per produkt \xD7 qty
  // Demontering = monteringMin \xD7 2 (redan inr\xE4knat i totalen)
  function calcMon(cart) {
    const prisPerMin = FRAKT.montering.prisPerTimme / 60;
    const minMin     = FRAKT.montering.minDebiteringMin;
    let totalMin = 0;
    cart.forEach(item => {
      if (item.monteringMin) {
        // montering + demontering (\xD7 2), \xD7 antal
        const minPerItem = item.monteringMin * 2;
        totalMin += Math.max(minMin, minPerItem) * item.qty;
      }
    });
    // Om inget monteringMin finns: schablonbelopp 60 min
    if (totalMin === 0) totalMin = 60;
    return Math.ceil(totalMin * prisPerMin);
  }
  function calcMonLabel(cart) {
    const prisPerMin = FRAKT.montering.prisPerTimme / 60;
    const minMin     = FRAKT.montering.minDebiteringMin;
    let totalMin = 0;
    cart.forEach(item => { if (item.monteringMin) totalMin += Math.max(minMin, item.monteringMin * 2) * item.qty; });
    if (totalMin === 0) totalMin = 60;
    const h = Math.floor(totalMin/60), m = totalMin%60;
    return (h ? h+'h ' : '') + (m ? m+'min ' : '') + '\xD7 ' + FRAKT.montering.prisPerTimme + ' kr/tim';
  }

  // \u2500\u2500 VILLKOR + FORM VALIDATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function checkCanProceed() {
    const villkorOk = document.getElementById('chkVillkor')?.checked;
    const nameOk    = document.getElementById('f-name')?.value.trim().length > 1;
    const emailOk   = document.getElementById('f-email')?.value.includes('@');
    const phoneOk   = document.getElementById('f-phone')?.value.trim().length > 6;
    const ok = villkorOk && nameOk && emailOk && phoneOk;

    const btnEmail = document.getElementById('btnEmail');
    const btnBoka  = document.getElementById('btnBoka');
    const hint     = document.getElementById('villkorHint');

    if (btnEmail) { btnEmail.disabled = !ok; }
    if (btnBoka)  { btnBoka.disabled = !ok; btnBoka.classList.toggle('disabled-btn', !ok); }
    if (hint) hint.classList.toggle('hidden', ok);
  }

  document.getElementById('chkVillkor')?.addEventListener('change', checkCanProceed);
  ['f-name','f-email','f-phone'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', checkCanProceed);
  });

  // \u2500\u2500 RENDER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function renderCart() {
    const cart = getCart();
    const emptyEl   = document.getElementById('cartEmpty');
    const contentEl = document.getElementById('cartContent');
    if (cart.length === 0) {
      emptyEl.style.display = 'flex';
      contentEl.style.display = 'none';
      return;
    }
    emptyEl.style.display = 'none';
    contentEl.style.display = 'block';

    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = cart.map(item => {
      const imgSrc = _getImg(item);
      return \`
      <tr data-id="\${item.id}" class="cart-row-clickable" title="Klicka f\xF6r mer info">
        <td>
          <div class="cart-product">
            \${imgSrc
              ? \`<img class="cart-thumb" src="\${imgSrc}" alt="\${item.name}" loading="lazy" width="72" height="60" onerror="this.style.display='none'">\`
              : \`<div class="cart-thumb-ph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>\`
            }
            <div class="cart-product-text">
              <div class="cart-pname">\${item.name}</div>
              \${(item.artno || PROD_ARTNO[item.id]) ? \`<div class="cart-partno">\${item.artno || PROD_ARTNO[item.id]}</div>\` : ''}
              <div class="cart-pcat">\${item.category || ''}</div>
              <div class="cart-pnote">\${item.priceNote || '/dygn'}</div>
            </div>
          </div>
        </td>
        <td class="td-price">\${fmt(item.price)}</td>
        <td class="td-qty">
          <div class="qty-stepper">
            <button class="qty-btn" data-action="dec" data-id="\${item.id}">\u2212</button>
            <input class="qty-input" type="text" inputmode="numeric" value="\${item.qty}" data-id="\${item.id}" readonly />
            <button class="qty-btn" data-action="inc" data-id="\${item.id}">+</button>
          </div>
        </td>
        <td class="td-total">\${fmt(item.price * item.qty)}</td>
        <td class="td-remove">
          <button class="remove-btn" data-id="\${item.id}" aria-label="Ta bort">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </td>
      </tr>
    \`}).join('');

    tbody.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = getCart();
        const it = c.find(i => i.id === btn.dataset.id);
        if (!it) return;
        it.qty += btn.dataset.action === 'inc' ? 1 : -1;
        saveCart(c.filter(i => i.qty > 0));
        updateNavBadge(); renderCart(); updateSummary();
      });
    });
    tbody.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCart(getCart().filter(i => i.id !== btn.dataset.id));
        updateNavBadge(); renderCart(); updateSummary();
      });
    });

    // Klick p\xE5 rad \u2192 popup (ej p\xE5 knappar)
    tbody.querySelectorAll('.cart-row-clickable').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('.qty-btn, .remove-btn, .qty-input')) return;
        const id   = row.dataset.id;
        const item = getCart().find(i => i.id === id);
        if (item) openProductModal(item);
      });
    });

    // Uppdatera tj\xE4nstepriser
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    const { price: lp, label: ll, note: ln } = calcLev(cart);
    const mp = calcMon(cart);
    const levEl = document.getElementById('leveransPrice');
    if (levEl) levEl.textContent = fmt(lp);
    const levNote = document.getElementById('leveransNote');
    if (levNote) levNote.textContent = ll + (cartHasBulky(cart) ? ' \u2014 bil med sl\xE4p' : '');
    const monEl = document.getElementById('monteringPrice');
    if (monEl) monEl.textContent = fmt(mp);

    updateSummary();
    checkCanProceed();
  }

  // \u2500\u2500 SUMMARY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function updateSummary() {
    const cart = getCart();
    if (!cart.length) return;
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    let extras = 0;

    const chkLev = document.getElementById('chkLeverans');
    const rowLev = document.getElementById('rowLeverans');
    if (chkLev?.checked) {
      const lp = calcLev(cart).price;
      document.getElementById('summLeverans').textContent = fmt(lp);
      rowLev.style.display = 'flex'; extras += lp;
    } else { if(rowLev) rowLev.style.display = 'none'; }

    const chkMon = document.getElementById('chkMontering');
    const rowMon = document.getElementById('rowMontering');
    if (chkMon?.checked) {
      const mp = calcMon(cart);
      document.getElementById('summMontering').textContent = fmt(mp);
      rowMon.style.display = 'flex'; extras += mp;
    } else { if(rowMon) rowMon.style.display = 'none'; }

    const rowsTillagg = document.getElementById('rowsTillagg');
    rowsTillagg.innerHTML = '';
    document.querySelectorAll('.chk-tillagg:checked').forEach(chk => {
      const pris = Number(chk.dataset.pris);
      const qty  = chk.dataset.qty === 'true'
        ? Number(document.getElementById('qtyval-'+chk.dataset.id)?.textContent || 1) : 1;
      const tot = pris * qty; extras += tot;
      rowsTillagg.insertAdjacentHTML('beforeend',
        \`<div class="summ-row"><span>\${chk.dataset.label}\${qty>1?' \xD7 '+qty:''}</span><span>\${fmt(tot)}</span></div>\`);
    });

    const FAKTURAAVGIFT = 49;
    const vat = Math.round((subtotal + extras + FAKTURAAVGIFT) * 0.25);
    document.getElementById('cartSubtotal').textContent = fmt(subtotal);
    document.getElementById('cartVat').textContent = fmt(vat);
    document.getElementById('cartTotal').textContent = fmt(subtotal + extras + FAKTURAAVGIFT + vat);
  }

  // Service events
  document.getElementById('chkLeverans')?.addEventListener('change', updateSummary);
  document.getElementById('chkMontering')?.addEventListener('change', updateSummary);
  // Admin leverans-override: uppdatera pris live vid val
  document.getElementById('adminLevType')?.addEventListener('change', updateSummary);
  document.getElementById('adminLevResor')?.addEventListener('change', updateSummary);
  document.querySelectorAll('.chk-tillagg').forEach(chk => {
    chk.addEventListener('change', function() {
      const w = document.getElementById('qty-wrap-'+this.dataset.id);
      if (w) w.classList.toggle('hidden', !this.checked);
      updateSummary();
    });
  });
  document.querySelectorAll('.tqty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const valEl = document.getElementById('qtyval-'+id);
      if (!valEl) return;
      let v = Number(valEl.textContent);
      valEl.textContent = String(btn.classList.contains('tillagg-inc') ? Math.min(20, v+1) : Math.max(1, v-1));
      updateSummary();
    });
  });

  // \u2500\u2500 BYGG ORDER-SAMMANFATTNING \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function buildOrder() {
    const cart = getCart();
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    let extras = 0; const extraLines = [];

    if (document.getElementById('chkLeverans')?.checked) {
      const lp = calcLev(cart).price; extras += lp;
      extraLines.push(\`Leverans: \${lp.toLocaleString('sv')} kr\`);
    }
    if (document.getElementById('chkMontering')?.checked) {
      const mp = calcMon(cart); extras += mp;
      extraLines.push(\`Montering & demontering: \${mp.toLocaleString('sv')} kr\`);
    }
    document.querySelectorAll('.chk-tillagg:checked').forEach(chk => {
      const pris = Number(chk.dataset.pris);
      const qty  = chk.dataset.qty === 'true' ? Number(document.getElementById('qtyval-'+chk.dataset.id)?.textContent||1) : 1;
      const tot  = pris * qty; extras += tot;
      extraLines.push(\`\${chk.dataset.label}\${qty>1?' \xD7 '+qty:''}: \${tot.toLocaleString('sv')} kr\`);
    });

    const vat = Math.round((subtotal + extras + 49) * 0.25);
    const customer = {
      name:    document.getElementById('f-name')?.value.trim() || '',
      company: document.getElementById('f-company')?.value.trim() || '',
      email:   document.getElementById('f-email')?.value.trim() || '',
      phone:   document.getElementById('f-phone')?.value.trim() || '',
      from:    document.getElementById('f-date-from')?.value || '',
      to:      document.getElementById('f-date-to')?.value || '',
      address: document.getElementById('f-address')?.value.trim() || '',
      notes:   document.getElementById('f-notes')?.value.trim() || '',
    };
    return { cart, subtotal, extras, extraLines, vat, total: subtotal + extras + 49 + vat, customer };
  }

  // \u2500\u2500 EMAIL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function submitOffert(triggerBtn, intent) {
    const { cart, subtotal, extras, extraLines, vat, total, customer } = buildOrder();
    const isBokning = intent === 'boka';

    const prodLines = cart.map(i => \`- \${i.name} \xD7 \${i.qty}  \u2192  \${(i.price*i.qty).toLocaleString('sv')} kr\`).join('\\n');
    const custInfo = [
      \`Namn: \${customer.name}\`,
      customer.company ? \`F\xF6retag: \${customer.company}\` : '',
      \`E-post: \${customer.email}\`,
      \`Telefon: \${customer.phone}\`,
      customer.from ? \`Datum fr\xE5n: \${customer.from}\` : '',
      customer.to ? \`Datum till: \${customer.to}\` : '',
      customer.address ? \`Leveransadress: \${customer.address}\` : '',
      customer.notes ? \`\xD6vrig info: \${customer.notes}\` : '',
    ].filter(Boolean).join('\\n');

    const inledning = isBokning
      ? \`Hej Scenkonsult!\\n\\n\u2B50 \xD6NSKAR BOKA \u2014 Kunden vill boka f\xF6ljande utrustning:\\n\`
      : \`Hej Scenkonsult!\\n\\nOffertf\xF6rfr\xE5gan \u2014 Kunden \xF6nskar prisf\xF6rslag p\xE5:\\n\`;

    const msgBody =
      inledning + \`\\n\${prodLines}\`
      + (extraLines.length ? \`\\n\\nTill\xE4ggstj\xE4nster:\\n\` + extraLines.map(l=>'- '+l).join('\\n') : '')
      + \`\\n\\nProdukter: \${subtotal.toLocaleString('sv')} kr exkl. moms\`
      + (extras ? \`\\nTill\xE4gg (estimat): \${extras.toLocaleString('sv')} kr\` : '')
      + \`\\nMoms: \${vat.toLocaleString('sv')} kr\\nTotalt: \${total.toLocaleString('sv')} kr inkl. moms\`
      + \`\\n\\nObs: Alla frakt- och tj\xE4nstepriser \xE4r estimat och bekr\xE4ftas som en del av orderprocessen.\`
      + \`\\n\\n\u2500\u2500 Kontaktuppgifter \u2500\u2500\\n\${custInfo}\`
      + \`\\n\\nMed v\xE4nliga h\xE4lsningar,\\n\${customer.name}\`;

    const origHtml = triggerBtn.innerHTML;
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Skickar\u2026';

    // L\xE5s \xE4ven den andra knappen
    const btnEmail = document.getElementById('btnEmail');
    const btnBoka  = document.getElementById('btnBoka');
    if (btnEmail) btnEmail.disabled = true;
    if (btnBoka)  btnBoka.disabled = true;

    try {
      const resp = await fetch('/.netlify/functions/skicka-offert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, cart, body: msgBody, intent, sendCopy: true, cart_id: getCartId() }),
      });

      const result = await resp.json();

      if (resp.ok && result.ok) {
        window.location.href = '/tack/';
      } else {
        alert(result.error || 'N\xE5got gick fel, f\xF6rs\xF6k igen eller ring oss p\xE5 072-448 10 00.');
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = origHtml;
        if (btnEmail) btnEmail.disabled = false;
        if (btnBoka)  btnBoka.disabled = false;
      }
    } catch (err) {
      alert('N\xE4tverksfel \u2014 f\xF6rs\xF6k igen eller ring 072-448 10 00.');
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = origHtml;
      if (btnEmail) btnEmail.disabled = false;
      if (btnBoka)  btnBoka.disabled = false;
    }
  }

  document.getElementById('btnEmail')?.addEventListener('click', function() { submitOffert(this, 'offert'); });
  document.getElementById('btnBoka')?.addEventListener('click', function() { submitOffert(this, 'boka'); });

  // \u2500\u2500 PDF / PRINT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.getElementById('btnSave')?.addEventListener('click', () => {
    const { cart, subtotal, extras, extraLines, vat, total, customer } = buildOrder();
    const rows = cart.map(i=>\`<tr><td>\${i.name}</td><td>\${i.category}</td><td style="text-align:center">\${i.qty}</td><td style="text-align:right">\${i.price.toLocaleString('sv')} kr</td><td style="text-align:right">\${(i.price*i.qty).toLocaleString('sv')} kr</td></tr>\`).join('');
    const extRows = extraLines.map(l=>\`<tr><td colspan="4" style="color:#555">\${l}</td><td></td></tr>\`).join('');
    const custRows = [
      ['Namn', customer.name],
      customer.company ? ['F\xF6retag', customer.company] : null,
      ['E-post', customer.email],
      ['Telefon', customer.phone],
      customer.from ? ['Datum fr\xE5n', customer.from] : null,
      customer.to   ? ['Datum till', customer.to]   : null,
      customer.address ? ['Leveransadress', customer.address] : null,
      customer.notes   ? ['\xD6vrig info', customer.notes] : null,
    ].filter(Boolean).map(([k,v])=>\`<tr><td style="color:#666;width:140px">\${k}</td><td>\${v}</td></tr>\`).join('');

    const html=\`<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><title>Varukorg \u2013 Scenkonsult</title>
<style>body{font-family:Arial,sans-serif;padding:2rem;color:#111;max-width:750px;margin:0 auto}
h1{color:#1e1850;margin-bottom:.2rem}p.sub{color:#666;font-size:.83rem;margin-bottom:1.5rem}
h2{color:#1e1850;font-size:1rem;margin-top:1.5rem;margin-bottom:.5rem;border-bottom:1px solid #eee;padding-bottom:.3rem}
table{width:100%;border-collapse:collapse;margin-bottom:1rem}
th{background:#1e1850;color:white;padding:.5rem .8rem;text-align:left;font-size:.78rem}
td{padding:.5rem .8rem;border-bottom:1px solid #eee;font-size:.88rem}
.total{font-weight:700;font-size:1.05rem;color:#1e1850;text-align:right}
.footer{font-size:.75rem;color:#999;border-top:1px solid #eee;padding-top:.8rem;margin-top:1.5rem}</style></head>
<body>
<h1>Scenkonsult \u2013 Offertunderlag</h1>
<p class="sub">Genererat \${new Date().toLocaleDateString('sv')} | \${atob('aW5mb0BzY2Vua29uc3VsdC5zZQ==')} | \${atob('MDcyNDQ4MTAwMA==').replace(/(\\d{3})(\\d{3})(\\d{2})(\\d{2})/, '$1-$2 $3 $4')}</p>
<h2>Produkter</h2>
<table><thead><tr><th>Produkt</th><th>Kategori</th><th>Antal</th><th>Styckpris</th><th>Totalt</th></tr></thead>
<tbody>\${rows}\${extRows}</tbody></table>
<p>Produkter exkl. moms: <strong>\${subtotal.toLocaleString('sv')} kr</strong></p>
\${extras?\`<p>Till\xE4gg: \${extras.toLocaleString('sv')} kr</p>\`:''}
<p>Moms 25%: \${vat.toLocaleString('sv')} kr</p>
<p class="total">Totalt inkl. moms: \${total.toLocaleString('sv')} kr</p>
\${custRows ? \`<h2>Kontaktuppgifter</h2><table><tbody>\${custRows}</tbody></table>\` : ''}
<p class="footer">Alla priser avser hyra per dygn (22 h). Kontakta oss f\xF6r slutlig bekr\xE4ftelse och bokning.<br><strong>Obs: Alla frakt- och tj\xE4nstepriser \xE4r estimat och bekr\xE4ftas som en del av orderprocessen.</strong></p>
</body></html>\`;
    const w=window.open('','_blank');
    if(w){w.document.write(html);w.document.close();w.focus();w.print();}
  });

  // \u2500\u2500 T\xD6MT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.getElementById('btnClear')?.addEventListener('click', () => {
    if (confirm('T\xF6m hela varukorgen?')) {
      localStorage.removeItem('sk-cart');
      updateNavBadge(); renderCart();
    }
  });

  // \u2500\u2500 URL-PARAM CART LOADING (admin-skickad offert) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function loadCartFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const cartParam  = params.get('cart');
    const tokenParam = params.get('token');
    if (!cartParam || !tokenParam) return;

    // Kontrollera att det inte redan \xE4r r\xE4tt cart i localStorage
    const existing = _getCartData();
    if (existing?.id === cartParam && (existing?.items?.length || 0) > 0) return;

    try {
      const res  = await fetch(\`/.netlify/functions/cart-get?token=\${encodeURIComponent(tokenParam)}\`);
      const data = await res.json();
      if (!res.ok || !data.cart) return;

      const c = data.cart;
      // Filtrera bort _note-items (anm\xE4rkningar) och s\xE4tt format som varukorgssidan f\xF6rst\xE5r
      const items = (c.items || [])
        .filter(i => !i._note && i.name)
        .map(i => ({
          id:       i.id || ('adm-' + Math.random().toString(36).slice(2,8)),
          name:     i.name,
          price:    i.price || 0,
          qty:      i.qty || i.quantity || 1,
          category: i.category || '',
          priceNote: '',
        }));

      if (items.length > 0) {
        localStorage.setItem('sk-cart', JSON.stringify({
          id:      cartParam,
          expires: Date.now() + SK_TTL,
          items
        }));
        renderCart();
        updateNavBadge();
        updateSummary();
      }
    } catch (e) { /* tyst fel \u2014 forts\xE4tt med tom varukorg */ }
  }

  // \u2500\u2500 INIT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  loadCartFromUrl().then(() => {
    renderCart();
    updateNavBadge();
    checkCanProceed();
  });
})();<\/script>`], ["", "  <script>(function(){", `
  const FRAKT = JSON.parse(fraktRules);
  const fmt = n => n.toLocaleString('sv') + ' kr';
  const SK_TTL = 21 * 24 * 60 * 60 * 1000;

  // Fallback-bilder f\xF6r produkter utan image-f\xE4lt (t.ex. fr\xE5n admin-offert)
  const PROD_IMG = {"small":"/images/scen/pp_small.png","small-plus":"/images/scen/pp_small_plus.png","small-plusplus":"/images/scen/pp_small_pp.png","medium":"/images/scen/pp_medium.png","medium-plus":"/images/scen/pp_medium_plus.png","medium-plus-tak":"/images/scen/pp_medium_plus_tak.png","medium-plusplus":"/images/scen/pp_medium_pp.png","large":"/images/scen/pp_large.png","large-plus":"/images/scen/pp_large_plus.png","large-plus-tak":"/images/scen/pp_large_plus_tak.png","xl":"/images/scen/pp_xl.png","xl-plus":"/images/scen/pp_xl_plus.png","event-small":"/images/ljud/pp_ljud_event_small.png","event-small-plus":"/images/ljud/pp_ljud_event_small-.png","event-medium":"/images/ljud/pp_ljud_event_medium.png","event-medium-plus":"/images/ljud/pp_ljud_event_medium-.png","event-large":"/images/ljud/pp_ljud_event_large.png","portable-small":"/images/ljud/pp_ljud_portable_small.png","portable-medium":"/images/ljud/pp_ljud_portable_medium.png","portable-medium-plus":"/images/ljud/pp_ljud_portable_medium_.png","portable-large":"/images/ljud/pp_ljud_portable_large.png","music-small":"/images/ljud/pp_ljud_music_small.png","music-small-plus":"/images/ljud/pp_ljud_music_small-.png","music-medium":"/images/ljud/pp_ljud_music_medium.png","music-large":"/images/ljud/pp_ljud_music_large.png","live-small":"/images/ljud/pp_ljud_live_small.png","live-medium":"/images/ljud/pp_ljud_live_medium.png","live-large":"/images/ljud/pp_ljud_live_large.png","mixer-2-2":"/images/ljud/pp_ljud_mixer01.png","mixer-4-2":"/images/ljud/pp_ljud_mixer02.png","mixer-4-4":"/images/ljud/pp_ljud_mixer03.png","mixer-12-4":"/images/ljud/pp_ljud_mixer05.png","dj-controller-numark":"/images/dj/pp_DJ_small.png","dj-controller-denon-go":"/images/dj/pp_DJ_denon_go_plus.png","dj-controller-denon-prime4":"/images/dj/pp_DJ_large1.png","dj-rane-system-one":"/images/dj/pp_DJ_large2.png","dj-bord":"/images/dj/pp_DJ_bord.png","projektor-xga":"/images/bild/pp_bild_projektor.png","projektor-fhd":"/images/bild/pp_bild_projektor1.png","skarm-65":"/images/bild/pp_bild_65-skarm.png","skarm-75":"/images/bild/pp_bild_75-skarm.png","stativ-400":"/images/ljus/pp_ljus_stativ06.png","stativ-1200":"/images/ljus/pp_ljus_stativ_1200.png","tross-1m":"/images/ljus/pp_ljus_tross01.png","ljus-small":"/images/ljus/pp_ljus_small.png","ljus-small-plus":"/images/ljus/pp_ljus_small-.png","ljus-small-pp":"/images/ljus/pp_ljus_small--.png","ljus-medium":"/images/ljus/pp_ljus_medium.png","ljus-medium-plus":"/images/ljus/pp_ljus_medium_plus.png","ljus-medium-pp":"/images/ljus/pp_ljus_medium_plusplus.png","ljus-large":"/images/ljus/pp_ljus_large.png","ljus-large-plus":"/images/ljus/pp_ljus_large_plus.png","ljus-large-pp":"/images/ljus/pp_ljus_large_plusplus.png","rokmaskin-1500":"/images/ljus/pp_ljus_rokmaskin.png","rokmaskin-650":"/images/ljus/pp_ljus_rokmaskin650.png","led-par":"/images/ljus/pp_ljus_effekt19.png","led-par-9":"/images/ljus/pp_ljus_effekt26.png","led-par-uv":"/images/ljus/pp_ljus_effekt21.png","led-par-xl":"/images/ljus/pp_ljus_par-xl.png","led-uppladdningsbar":"/images/ljus/pp_ljus_effekt22.png"};

  function _getImg(item) {
    if (item.image) return item.image;
    const id = item.id || '';
    return PROD_IMG[id] || PROD_IMG[id.replace(/^(scen-|ljud-|ljus-|dj-utr-)/,'')] || '';
  }

  // \u2500\u2500 PRODUKTKATALOG \u2014 auto-genererad fr\xE5n JSON (synkad) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const PROD_CATALOG = {"Scen":{"products":[{"id":"scen-small","name":"Scenpaket Small","price":599,"artno":"SK-SCN-0001","image":"/images/scen/pp_small.png","priceNote":"/dygn"},{"id":"scen-small-plus","name":"Scenpaket Small+","price":899,"artno":"SK-SCN-0002","image":"/images/scen/pp_small_plus.png","priceNote":"/dygn"},{"id":"scen-small-plusplus","name":"Scenpaket Small++","price":1199,"artno":"SK-SCN-0003","image":"/images/scen/pp_small_pp.png","priceNote":"/dygn"},{"id":"scen-medium","name":"Scenpaket Medium","price":1499,"artno":"SK-SCN-0004","image":"/images/scen/pp_medium.png","priceNote":"/dygn"},{"id":"scen-medium-plus","name":"Scenpaket Medium+","price":1799,"artno":"SK-SCN-0005","image":"/images/scen/pp_medium_plus.png","priceNote":"/dygn"},{"id":"scen-medium-plus-tak","name":"Scenpaket Medium+ inkl. scentak","price":3799,"artno":"SK-SCN-0006","image":"/images/scen/pp_medium_plus_tak.png","priceNote":"/dygn"},{"id":"scen-medium-plusplus","name":"Scenpaket Medium++","price":2399,"artno":"SK-SCN-0007","image":"/images/scen/pp_medium_pp.png","priceNote":"/dygn"},{"id":"scen-large","name":"Scenpaket Large","price":2999,"artno":"SK-SCN-0008","image":"/images/scen/pp_large.png","priceNote":"/dygn"},{"id":"scen-large-plus","name":"Scenpaket Large+","price":3599,"artno":"SK-SCN-0009","image":"/images/scen/pp_large_plus.png","priceNote":"/dygn"},{"id":"scen-large-plus-tak","name":"Scenpaket Large+ inkl. scentak","price":11999,"artno":"SK-SCN-0010","image":"/images/scen/pp_large_plus_tak.png","priceNote":"/dygn"},{"id":"scen-xl","name":"Scenpaket XL","price":5399,"artno":"SK-SCN-0011","image":"/images/scen/pp_xl.png","priceNote":"/dygn"},{"id":"scen-xl-plus","name":"Scenpaket XL+","price":7199,"artno":"SK-SCN-0012","image":"/images/scen/pp_xl_plus.png","priceNote":"/dygn"},{"id":"scentrapp_(40_cm)","name":"Scentrapp (40 cm)","price":279,"artno":"SK-SCN-ACC-0001","image":"/images/scen/pp_scentrapp.png","priceNote":"/st"},{"id":"scentrapp_(60_cm)","name":"Scentrapp (60 cm)","price":349,"artno":"SK-SCN-ACC-0002","image":"/images/scen/pp_scentrapp.png","priceNote":"/st"},{"id":"scenkjol_(per_4_m)","name":"Scenkjol (per 4 m)","price":79,"artno":"SK-SCN-ACC-0003","image":"/images/scen/pp_scenkjol.png","priceNote":"/st"},{"id":"backdrop_3,5\xD72,5_m","name":"Backdrop 3,5\xD72,5 m","price":799,"artno":"SK-SCN-ACC-0004","image":"/images/scen/pp_backdrop.png","priceNote":"/st"}]},"Ljud":{"sub":{"Portable":[{"id":"portable-small","name":"Portable, Small","price":599,"artno":"SK-LJD-POR-0001","image":"/images/ljud/pp_ljud_portable_small.png","priceNote":"/dygn"},{"id":"portable-small-plus","name":"Portable, Small+","price":699,"artno":"SK-LJD-POR-0002","image":"/images/ljud/pp_ljud_portable_small.png","priceNote":"/dygn"},{"id":"portable-medium","name":"Portable, Medium","price":799,"artno":"SK-LJD-POR-0003","image":"/images/ljud/pp_ljud_portable_medium.png","priceNote":"/dygn"},{"id":"portable-medium-plus","name":"Portable, Medium+","price":999,"artno":"SK-LJD-POR-0004","image":"/images/ljud/pp_ljud_portable_medium_.png","priceNote":"/dygn"},{"id":"portable-small-duo","name":"Portable, Small Duo","price":1099,"artno":"SK-LJD-POR-0005","image":"/images/ljud/pp_ljud_portable_small_duo.png","priceNote":"/dygn"},{"id":"portable-large","name":"Portable, Large","price":1199,"artno":"SK-LJD-POR-0006","image":"/images/ljud/pp_ljud_portable_large.png","priceNote":"/dygn"},{"id":"portable-small-plus-duo","name":"Portable, Small+ Duo","price":1299,"artno":"SK-LJD-POR-0007","image":"/images/ljud/pp_ljud_portable_small__duo.png","priceNote":"/dygn"},{"id":"portable-medium-duo","name":"Portable, Medium Duo","price":1499,"artno":"SK-LJD-POR-0008","image":"/images/ljud/pp_ljud_portable_medium_duo.png","priceNote":"/dygn"},{"id":"portable-medium-plus-duo","name":"Portable, Medium+ Duo","price":1899,"artno":"SK-LJD-POR-0009","image":"/images/ljud/pp_ljud_portable_medium_plus_duo.png","priceNote":"/dygn"},{"id":"portable-large-plus","name":"Portable, Large+","price":2299,"artno":"SK-LJD-POR-0010","image":"/images/ljud/pp_ljud_portable_large.png","priceNote":"/dygn"},{"id":"portable-large-duo","name":"Portable, Large Duo","price":2299,"artno":"SK-LJD-POR-0011","image":"/images/ljud/pp_ljud_portable_large_.png","priceNote":"/dygn"}],"Event":[{"id":"event-small","name":"Event, Small","price":799,"artno":"SK-LJD-EVE-0001","image":"/images/ljud/pp_ljud_event_small.png","priceNote":"/dygn"},{"id":"event-small-plus","name":"Event, Small+","price":1199,"artno":"SK-LJD-EVE-0002","image":"/images/ljud/pp_ljud_event_small-.png","priceNote":"/dygn"},{"id":"event-medium","name":"Event, Medium","price":1599,"artno":"SK-LJD-EVE-0003","image":"/images/ljud/pp_ljud_event_medium.png","priceNote":"/dygn"},{"id":"event-medium-plus","name":"Event, Medium+","price":2299,"artno":"SK-LJD-EVE-0004","image":"/images/ljud/pp_ljud_event_medium-.png","priceNote":"/dygn"},{"id":"event-large","name":"Event, Large","price":3199,"artno":"SK-LJD-EVE-0005","image":"/images/ljud/pp_ljud_event_large.png","priceNote":"/dygn"},{"id":"event-large-plus","name":"Event, Large+","price":3199,"artno":"SK-LJD-EVE-0006","image":"/images/ljud/pp_ljud_event_large_.png","priceNote":"/dygn"}],"Music":[{"id":"music-small","name":"Music, Small","price":999,"artno":"SK-LJD-MUS-0001","image":"/images/ljud/pp_ljud_music_small.png","priceNote":"/dygn"},{"id":"music-small-plus","name":"Music, Small+","price":1299,"artno":"SK-LJD-MUS-0002","image":"/images/ljud/pp_ljud_music_small-.png","priceNote":"/dygn"},{"id":"music-medium","name":"Music, Medium","price":1499,"artno":"SK-LJD-MUS-0003","image":"/images/ljud/pp_ljud_music_medium.png","priceNote":"/dygn"},{"id":"music-large","name":"Music, Large","price":1899,"artno":"SK-LJD-MUS-0004","image":"/images/ljud/pp_ljud_music_large.png","priceNote":"/dygn"},{"id":"music-xl","name":"Live/Music, XL","price":2299,"artno":"SK-LJD-MUS-0005","image":"/images/ljud/pp_ljud_music_xl.png","priceNote":"/dygn"},{"id":"music-xl-plus","name":"Live/Music, XL+","price":2999,"artno":"SK-LJD-MUS-0006","image":"/images/ljud/pp_ljud_music_xl-.png","priceNote":"/dygn"},{"id":"music-xxl","name":"Live/Music, XXL","price":4999,"artno":"SK-LJD-MUS-0007","image":"/images/ljud/pp_ljud_music_xxl.png","priceNote":"/dygn"},{"id":"music-concert","name":"Live/Music, Concert","price":6999,"artno":"SK-LJD-MUS-0008","image":"/images/ljud/pp_ljud_concert.png","priceNote":"/dygn"},{"id":"line-array-small","name":"Line Array, Small","price":14999,"artno":"SK-LJD-MUS-0009","image":"/images/ljud/pp_ljud_music_linearray1.png","priceNote":"/dygn"},{"id":"line-array-medium","name":"Line Array, Medium","price":19999,"artno":"SK-LJD-MUS-0010","image":"/images/ljud/pp_ljud_music_linearray2.png","priceNote":"/dygn"}],"Live":[{"id":"live-small","name":"Live, Small","price":599,"artno":"SK-LJD-LIV-0001","image":"/images/ljud/pp_ljud_live_small.png","priceNote":"/dygn"},{"id":"live-medium","name":"Live, Medium","price":1199,"artno":"SK-LJD-LIV-0002","image":"/images/ljud/pp_ljud_live_medium.png","priceNote":"/dygn"},{"id":"live-large","name":"Live, Large","price":1599,"artno":"SK-LJD-LIV-0003","image":"/images/ljud/pp_ljud_live_large.png","priceNote":"/dygn"},{"id":"live-xl","name":"Live/Music, XL","price":2299,"artno":"SK-LJD-LIV-0004","image":"/images/ljud/pp_ljud_music_xl.png","priceNote":"/dygn"},{"id":"live-xl-plus","name":"Live/Music, XL+","price":2999,"artno":"SK-LJD-LIV-0005","image":"/images/ljud/pp_ljud_music_xl-.png","priceNote":"/dygn"},{"id":"live-xxl","name":"Live/Music, XXL","price":4999,"artno":"SK-LJD-LIV-0006","image":"/images/ljud/pp_ljud_music_xxl.png","priceNote":"/dygn"},{"id":"live-concert","name":"Live/Music, Concert","price":6999,"artno":"SK-LJD-LIV-0007","image":"/images/ljud/pp_ljud_concert.png","priceNote":"/dygn"},{"id":"line-array-small","name":"Line Array, Small","price":14999,"artno":"SK-LJD-LIV-0008","image":"/images/ljud/pp_ljud_music_linearray1.png","priceNote":"/dygn"},{"id":"line-array-medium","name":"Line Array, Medium","price":19999,"artno":"SK-LJD-LIV-0009","image":"/images/ljud/pp_ljud_music_linearray2.png","priceNote":"/dygn"}],"Mixers":[{"id":"mixer-2-2","name":"Analogt Mixerbord, 2+2 kanaler","price":159,"artno":"SK-LJD-MIX-0001","image":"/images/ljud/pp_ljud_mixer01.png","priceNote":"/dygn"},{"id":"mixer-4-2","name":"Analogt Mixerbord, 4+2 kanaler","price":199,"artno":"SK-LJD-MIX-0002","image":"/images/ljud/pp_ljud_mixer02.png","priceNote":"/dygn"},{"id":"mixer-vibz8dc","name":"Analogt mixerbord, 4+1 kanaler","price":249,"artno":"SK-LJD-MIX-0003","image":"/images/ljud/pp_ljud_mixer-vibz8dc.png","priceNote":"/dygn"},{"id":"mixer-4-4","name":"Analogt Mixerbord, 4+4 kanaler","price":299,"artno":"SK-LJD-MIX-0004","image":"/images/ljud/pp_ljud_mixer03.png","priceNote":"/dygn"},{"id":"mixer-6-4","name":"Analogt Mixerbord, 6+4 kanaler","price":349,"artno":"SK-LJD-MIX-0005","image":"/images/ljud/pp_ljud_mixer04.png","priceNote":"/dygn"},{"id":"mixer-12-4","name":"Analogt Mixerbord, 12+4 kanaler","price":399,"artno":"SK-LJD-MIX-0006","image":"/images/ljud/pp_ljud_mixer05.png","priceNote":"/dygn"},{"id":"mixer-16-3","name":"Analogt Mixerbord, 16+3 kanaler","price":599,"artno":"SK-LJD-MIX-0007","image":"/images/ljud/pp_ljud_mixer06.png","priceNote":"/dygn"},{"id":"mixer-ilive-t80","name":"Digitalt mixerbord, 32+16 kanaler","price":2499,"artno":"SK-LJD-MIX-0008","image":"/images/ljud/pp_ljud_mixer-ilive-t80.png","priceNote":"/dygn"}],"Mikrofoner":[{"id":"hogtalarstativ-gravity","name":"H\xF6gtalarstativ Gravity","price":40,"artno":"SK-LJD-MIK-0001","image":"/images/ljud/pp_ljud_stativ-gravity.png","priceNote":"/dygn"},{"id":"xlr-kablar","name":"XLR kablar","price":40,"artno":"SK-LJD-MIK-0002","image":"/images/ljud/pp_ljud_tillbehor07.png","priceNote":"/dygn"},{"id":"hogtalarstativ-k&m","name":"H\xF6gtalarstativ K&M","price":50,"artno":"SK-LJD-MIK-0003","image":"/images/ljud/pp_ljud_stativ-km.png","priceNote":"/dygn"},{"id":"mikrofonstativ","name":"Mikrofonstativ","price":60,"artno":"SK-LJD-MIK-0004","image":"/images/ljud/pp_ljud_tillbehor06.png","priceNote":"/dygn"},{"id":"hogtalarstativ-gravity-premium","name":"H\xF6gtalarstativ Gravity Premium","price":60,"artno":"SK-LJD-MIK-0005","image":"/images/ljud/pp_ljud_stativ-gravity-premium.png","priceNote":"/dygn"},{"id":"handmikrofon","name":"Handmikrofon","price":80,"artno":"SK-LJD-MIK-0006","image":"/images/ljud/pp_ljud_mik01.png","priceNote":"/dygn"},{"id":"bluetooth-mottagare","name":"Bluetooth-mottagare","price":80,"artno":"SK-LJD-MIK-0007","image":"/images/ljud/pp_ljud_tillbehor04.png","priceNote":"/dygn"},{"id":"instrument-blas","name":"Instrumentmikrofon, bl\xE5s","price":80,"artno":"SK-LJD-MIK-0008","image":"/images/ljud/pp_ljud_mik04.png","priceNote":"/dygn"},{"id":"instrumentmikrofon","name":"Instrumentmikrofon","price":120,"artno":"SK-LJD-MIK-0009","image":"/images/ljud/pp_ljud_mik02.png","priceNote":"/dygn"},{"id":"hogtalarstativ-gravity-med-vev","name":"H\xF6gtalarstativ Gravity med vev","price":120,"artno":"SK-LJD-MIK-0010","image":"/images/ljud/pp_ljud_stativ-gravity-vev.png","priceNote":"/dygn"},{"id":"bluetooth-mottagare-pro","name":"Bluetooth-mottagare Pro","price":140,"artno":"SK-LJD-MIK-0011","image":"/images/ljud/pp_ljud_tillbehor_BT-pro.png","priceNote":"/dygn"},{"id":"di-box-passiv","name":"DI-box (passiv)","price":160,"artno":"SK-LJD-MIK-0012","image":"/images/ljud/pp_ljud_tillbehor_DI-passiv.png","priceNote":"/dygn"},{"id":"di-box-aktiv","name":"DI-box (aktiv)","price":240,"artno":"SK-LJD-MIK-0013","image":"/images/ljud/pp_ljud_tillbehor_DI-aktiv.png","priceNote":"/dygn"},{"id":"xlr-multikabel-6ch","name":"XLR Multikabel 15 m, 6 kanaler","price":276,"artno":"SK-LJD-MIK-0014","image":"/images/ljud/pp_ljud_tillbehor_MK-small.png","priceNote":"/dygn"},{"id":"xlr-multikabel-8ch","name":"XLR Multikabel 25 m, 8 kanaler","price":384,"artno":"SK-LJD-MIK-0015","image":"/images/ljud/pp_ljud_tillbehor_MK-medium.png","priceNote":"/dygn"},{"id":"tradlos-handmikrofon","name":"Tr\xE5dl\xF6s handmikrofon","price":400,"artno":"SK-LJD-MIK-0016","image":"/images/ljud/pp_ljud_mik05.png","priceNote":"/dygn"},{"id":"tradlost-headset","name":"Tr\xE5dl\xF6st headset","price":480,"artno":"SK-LJD-MIK-0017","image":"/images/ljud/pp_ljud_mik06.png","priceNote":"/dygn"},{"id":"tradlos-iem","name":"Tr\xE5dl\xF6st IEM","price":480,"artno":"SK-LJD-MIK-0018","image":"/images/ljud/pp_ljud_tillbehor01.png","priceNote":"/dygn"},{"id":"instrument-slagverk","name":"Instrumentmikrofoner, slagverk","price":480,"artno":"SK-LJD-MIK-0019","image":"/images/ljud/pp_ljud_mik03.png","priceNote":"/dygn"},{"id":"xlr-multikabel-24ch","name":"XLR Multikabel 15 m, 24+8 kanaler","price":632,"artno":"SK-LJD-MIK-0020","image":"/images/ljud/pp_ljud_tillbehor_MK-large.png","priceNote":"/dygn"},{"id":"slxd-1-mik","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 mik","price":699,"artno":"SK-LJD-MIK-0021","image":"/images/ljud/pp_ljud_mik09.png","priceNote":"/dygn"},{"id":"slxd-1-myggmik","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 myggmikrofon","price":699,"artno":"SK-LJD-MIK-0022","image":"/images/ljud/pp_ljud_mik13.png","priceNote":"/dygn"},{"id":"slxd-1-headset","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 headset","price":749,"artno":"SK-LJD-MIK-0023","image":"/images/ljud/pp_ljud_mik12.png","priceNote":"/dygn"},{"id":"slxd-1-lagprofil","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 1 l\xE5gprofil headset","price":799,"artno":"SK-LJD-MIK-0024","image":"/images/ljud/pp_ljud_mik14.png","priceNote":"/dygn"},{"id":"effektrack","name":"Effektrack med matrix & feedback-suppressor","price":1036,"artno":"SK-LJD-MIK-0025","image":"/images/ljud/pp_ljud_effektrack.png","priceNote":"/dygn"},{"id":"shure-slxd-\u2013-digitalt-tradlost-system,-2-mikrofoner","name":"Shure SLXD \u2013 Digitalt tr\xE5dl\xF6st system, 2 mikrofoner","price":1299,"artno":"SK-LJD-MIK-0026","image":"/images/ljud/pp_ljud_mik-shure-slxd4d.png","priceNote":"/dygn"},{"id":"slxd-2-myggmik","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 myggmikrofoner","price":1299,"artno":"SK-LJD-MIK-0027","image":"/images/ljud/pp_ljud_mik10.png","priceNote":"/dygn"},{"id":"slxd-2-headset","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 headset","price":1399,"artno":"SK-LJD-MIK-0028","image":"/images/ljud/pp_ljud_mik08.png","priceNote":"/dygn"},{"id":"slxd-2-lagprofil","name":"Shure SLXD \u2013 tr\xE5dl\xF6st system, 2 l\xE5gprofil headset","price":1499,"artno":"SK-LJD-MIK-0029","image":"/images/ljud/pp_ljud_mik11.png","priceNote":"/dygn"},{"id":"wireless-8ch","name":"Tr\xE5dl\xF6st mikrofonset, 8 kanaler","price":3999,"artno":"SK-LJD-MIK-0030","image":"/images/ljud/pp_ljud_tillbehor20.png","priceNote":"/dygn"}]}},"Ljus":{"sub":{"F\xE4rdiga paket":[{"id":"ljus-small","name":"Ljuspaket, Small","price":399,"artno":"SK-LJS-PAK-0001","image":"/images/ljus/pp_ljus_small.png","priceNote":"/dygn"},{"id":"ljus-small-plus","name":"Ljuspaket, Small+","price":599,"artno":"SK-LJS-PAK-0002","image":"/images/ljus/pp_ljus_small-.png","priceNote":"/dygn"},{"id":"ljus-small-pp","name":"Ljuspaket, Small++","price":799,"artno":"SK-LJS-PAK-0003","image":"/images/ljus/pp_ljus_small--.png","priceNote":"/dygn"},{"id":"ljus-medium","name":"Ljuspaket, Medium","price":1199,"artno":"SK-LJS-PAK-0004","image":"/images/ljus/pp_ljus_medium.png","priceNote":"/dygn"},{"id":"ljus-medium-plus","name":"Ljuspaket, Medium+","price":1299,"artno":"SK-LJS-PAK-0005","image":"/images/ljus/pp_ljus_medium.png","priceNote":"/dygn"},{"id":"ljus-medium-pp","name":"Ljuspaket, Medium++","price":1499,"artno":"SK-LJS-PAK-0006","image":"/images/ljus/pp_ljus_medium.png","priceNote":"/dygn"},{"id":"ljus-large","name":"Ljuspaket, Large","price":1699,"artno":"SK-LJS-PAK-0007","image":"/images/ljus/pp_ljus_large.png","priceNote":"/dygn"},{"id":"ljus-large-plus","name":"Ljuspaket, Large+","price":2199,"artno":"SK-LJS-PAK-0008","image":"/images/ljus/pp_ljus_large_plus.png","priceNote":"/dygn"},{"id":"ljus-large-pp","name":"Ljuspaket, Large++","price":2699,"artno":"SK-LJS-PAK-0009","image":"/images/ljus/pp_ljus_large_plusplus.png","priceNote":"/dygn"}],"R\xF6k & pyro":[{"id":"rokmaskin-1500","name":"R\xF6kmaskin (1500W)","price":349,"artno":"SK-LJS-ROK-0001","image":"/images/ljus/pp_ljus_effekt23.png","priceNote":"/dygn"},{"id":"rokmaskin-650","name":"R\xF6kmaskin (650W)","price":449,"artno":"SK-LJS-ROK-0002","image":"/images/ljus/pp_ljus_effekt24.png","priceNote":"/dygn"},{"id":"kallgnistmaskin","name":"Kallgnistmaskin","price":499,"artno":"SK-LJS-ROK-0003","image":"/images/ljus/pp_ljus_effekt25.png","priceNote":"/dygn"},{"id":"konfettiavfyrare","name":"Konfettiavfyrare","price":499,"artno":"SK-LJS-ROK-0004","image":"/images/ljus/pp_ljus_confettimaskin.png","priceNote":"/dygn"},{"id":"hazer-hz1500","name":"Hazer HZ-1500 Pro","price":649,"artno":"SK-LJS-ROK-0005","image":"/images/ljus/pp_ljus_rok3.png","priceNote":"/dygn"}],"Stativ & tross":[{"id":"stativ-400","name":"Stativ med T-bar (400 mm)","price":40,"artno":"SK-LJS-STV-0001","image":"/images/ljus/pp_ljus_stativ06.png","priceNote":"/dygn"},{"id":"stativ-1200","name":"Stativ med T-bar (1200 mm)","price":40,"artno":"SK-LJS-STV-0002","image":"/images/ljus/pp_ljus_stativ_1200.png","priceNote":"/dygn"},{"id":"stativ-900p","name":"Stativ med T-bar (900 mm, premium)","price":60,"artno":"SK-LJS-STV-0003","image":"/images/ljus/pp_ljus_stativ01.png","priceNote":"/dygn"},{"id":"vevstativ-1200","name":"Vevstativ med T-bar (1200 mm)","price":120,"artno":"SK-LJS-STV-0004","image":"/images/ljus/pp_ljus_stativ02.png","priceNote":"/dygn"},{"id":"tross-1m","name":"Trosstorn 1,0 m","price":300,"artno":"SK-LJS-STV-0005","image":"/images/ljus/pp_ljus_tross01.png","priceNote":"/dygn"},{"id":"tross-15m","name":"Trosstorn 1,5 m","price":360,"artno":"SK-LJS-STV-0006","image":"/images/ljus/pp_ljus_tross03.png","priceNote":"/dygn"}]}},"DJ-utrustning":{"products":[{"id":"dj-utr-dj-controller-numark","name":"DJ-controller, Standalone (Numark Mixstream Pro+)","price":799,"artno":"SK-DJ-0001","image":"/images/dj/pp_DJ_small.png","priceNote":"/dygn"},{"id":"dj-utr-dj-controller-denon-go","name":"DJ-controller, Standalone (Denon Prime GO+)","price":999,"artno":"SK-DJ-0002","image":"/images/dj/pp_DJ_denon_go_plus.png","priceNote":"/dygn"},{"id":"dj-utr-dj-controller-denon-prime4","name":"DJ-controller, Standalone (Denon Prime 4+)","price":1499,"artno":"SK-DJ-0003","image":"/images/dj/pp_DJ_large1.png","priceNote":"/dygn"},{"id":"dj-utr-dj-rane-system-one","name":"DJ-system, Rane System One","price":1999,"artno":"SK-DJ-0004","image":"/images/dj/pp_DJ_large2.png","priceNote":"/dygn"},{"id":"dj-utr-dj-bord","name":"DJ-bord","price":80,"artno":"SK-DJ-0005","image":"/images/dj/pp_DJ_bord.png","priceNote":"/dygn"},{"id":"dj-utr-dj-bord2","name":"DJ-bord med front- och sidopaneler","price":200,"artno":"SK-DJ-0006","image":"/images/dj/pp_DJ_bord2.png","priceNote":"/dygn"},{"id":"dj-utr-scenengineer","name":"Hyr Scenengineer","price":952,"artno":"SK-DJ-0007","image":"/images/dj/pp_DJ_engineer.png","priceNote":"/tim"},{"id":"dj-utr-media-editor","name":"Hyr R\xF6rlig media-editor","price":952,"artno":"SK-DJ-0008","image":"/images/dj/pp_DJ_media-editor.png","priceNote":"/tim"}]},"Projektor & sk\xE4rm":{"products":[{"id":"projektor-xga","name":"Projektor (XGA)","price":299,"artno":"SK-BLD-0001","image":"/images/bild/pp_bild_projektor.png","priceNote":"/dygn"},{"id":"projektor-fhd","name":"Projektor (FHD)","price":399,"artno":"SK-BLD-0002","image":"/images/bild/pp_bild_projektor1.png","priceNote":"/dygn"},{"id":"skarm-65","name":"65\\\\" Sk\xE4rm (4K UHD)","price":2399,"artno":"SK-BLD-0003","image":"/images/bild/pp_bild_65-skarm.png","priceNote":"/dygn"},{"id":"skarm-75","name":"75\\\\" Sk\xE4rm (4K UHD)","price":2799,"artno":"SK-BLD-0004","image":"/images/bild/pp_bild_75-skarm.png","priceNote":"/dygn"},{"id":"modulskarm-fhd","name":"Moduluppbyggd LED-sk\xE4rm (FHD)","price":1199,"artno":"SK-BLD-0005","image":"/images/bild/pp_bild_modulskarm.png","priceNote":"/kvm/dygn"},{"id":"trailer-skarm","name":"LED-sk\xE4rm p\xE5 trailer (FHD)","price":15499,"artno":"SK-BLD-0006","image":"/images/bild/pp_bild_trailer_skarm.png","priceNote":"/dygn"}]}};

  // \u2500\u2500 ARTNO-KARTA \u2014 id \u2192 artikelnummer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const PROD_ARTNO = {"scen-small":"SK-SCN-0001","scen-small-plus":"SK-SCN-0002","scen-small-plusplus":"SK-SCN-0003","scen-medium":"SK-SCN-0004","scen-medium-plus":"SK-SCN-0005","scen-medium-plus-tak":"SK-SCN-0006","scen-medium-plusplus":"SK-SCN-0007","scen-large":"SK-SCN-0008","scen-large-plus":"SK-SCN-0009","scen-large-plus-tak":"SK-SCN-0010","scen-xl":"SK-SCN-0011","scen-xl-plus":"SK-SCN-0012","portable-small":"SK-LJD-POR-0001","portable-small-plus":"SK-LJD-POR-0002","portable-medium":"SK-LJD-POR-0003","portable-medium-plus":"SK-LJD-POR-0004","portable-small-duo":"SK-LJD-POR-0005","portable-large":"SK-LJD-POR-0006","portable-small-plus-duo":"SK-LJD-POR-0007","portable-medium-duo":"SK-LJD-POR-0008","portable-medium-plus-duo":"SK-LJD-POR-0009","portable-large-plus":"SK-LJD-POR-0010","portable-large-duo":"SK-LJD-POR-0011","event-small":"SK-LJD-EVE-0001","event-small-plus":"SK-LJD-EVE-0002","event-medium":"SK-LJD-EVE-0003","event-medium-plus":"SK-LJD-EVE-0004","event-large":"SK-LJD-EVE-0005","event-large-plus":"SK-LJD-EVE-0006","music-small":"SK-LJD-MUS-0001","music-small-plus":"SK-LJD-MUS-0002","music-medium":"SK-LJD-MUS-0003","music-large":"SK-LJD-MUS-0004","music-xl":"SK-LJD-MUS-0005","music-xl-plus":"SK-LJD-MUS-0006","music-xxl":"SK-LJD-MUS-0007","music-concert":"SK-LJD-MUS-0008","line-array-small":"SK-LJD-LIV-0008","line-array-medium":"SK-LJD-LIV-0009","live-small":"SK-LJD-LIV-0001","live-medium":"SK-LJD-LIV-0002","live-large":"SK-LJD-LIV-0003","live-xl":"SK-LJD-LIV-0004","live-xl-plus":"SK-LJD-LIV-0005","live-xxl":"SK-LJD-LIV-0006","live-concert":"SK-LJD-LIV-0007","mixer-2-2":"SK-LJD-MIX-0001","mixer-4-2":"SK-LJD-MIX-0002","mixer-vibz8dc":"SK-LJD-MIX-0003","mixer-4-4":"SK-LJD-MIX-0004","mixer-6-4":"SK-LJD-MIX-0005","mixer-12-4":"SK-LJD-MIX-0006","mixer-16-3":"SK-LJD-MIX-0007","mixer-ilive-t80":"SK-LJD-MIX-0008","hogtalarstativ-gravity":"SK-LJD-MIK-0001","xlr-kablar":"SK-LJD-MIK-0002","hogtalarstativ-k&m":"SK-LJD-MIK-0003","mikrofonstativ":"SK-LJD-MIK-0004","hogtalarstativ-gravity-premium":"SK-LJD-MIK-0005","handmikrofon":"SK-LJD-MIK-0006","bluetooth-mottagare":"SK-LJD-MIK-0007","instrument-blas":"SK-LJD-MIK-0008","instrumentmikrofon":"SK-LJD-MIK-0009","hogtalarstativ-gravity-med-vev":"SK-LJD-MIK-0010","bluetooth-mottagare-pro":"SK-LJD-MIK-0011","di-box-passiv":"SK-LJD-MIK-0012","di-box-aktiv":"SK-LJD-MIK-0013","xlr-multikabel-6ch":"SK-LJD-MIK-0014","xlr-multikabel-8ch":"SK-LJD-MIK-0015","tradlos-handmikrofon":"SK-LJD-MIK-0016","tradlost-headset":"SK-LJD-MIK-0017","tradlos-iem":"SK-LJD-MIK-0018","instrument-slagverk":"SK-LJD-MIK-0019","xlr-multikabel-24ch":"SK-LJD-MIK-0020","slxd-1-mik":"SK-LJD-MIK-0021","slxd-1-myggmik":"SK-LJD-MIK-0022","slxd-1-headset":"SK-LJD-MIK-0023","slxd-1-lagprofil":"SK-LJD-MIK-0024","effektrack":"SK-LJD-MIK-0025","shure-slxd-\u2013-digitalt-tradlost-system,-2-mikrofoner":"SK-LJD-MIK-0026","slxd-2-myggmik":"SK-LJD-MIK-0027","slxd-2-headset":"SK-LJD-MIK-0028","slxd-2-lagprofil":"SK-LJD-MIK-0029","wireless-8ch":"SK-LJD-MIK-0030","ljus-small":"SK-LJS-PAK-0001","ljus-small-plus":"SK-LJS-PAK-0002","ljus-small-pp":"SK-LJS-PAK-0003","ljus-medium":"SK-LJS-PAK-0004","ljus-medium-plus":"SK-LJS-PAK-0005","ljus-medium-pp":"SK-LJS-PAK-0006","ljus-large":"SK-LJS-PAK-0007","ljus-large-plus":"SK-LJS-PAK-0008","ljus-large-pp":"SK-LJS-PAK-0009","rokmaskin-1500":"SK-LJS-ROK-0001","rokmaskin-650":"SK-LJS-ROK-0002","kallgnistmaskin":"SK-LJS-ROK-0003","konfettiavfyrare":"SK-LJS-ROK-0004","hazer-hz1500":"SK-LJS-ROK-0005","stativ-400":"SK-LJS-STV-0001","stativ-1200":"SK-LJS-STV-0002","stativ-900p":"SK-LJS-STV-0003","vevstativ-1200":"SK-LJS-STV-0004","tross-1m":"SK-LJS-STV-0005","tross-15m":"SK-LJS-STV-0006","dj-utr-dj-controller-numark":"SK-DJ-0001","dj-utr-dj-controller-denon-go":"SK-DJ-0002","dj-utr-dj-controller-denon-prime4":"SK-DJ-0003","dj-utr-dj-rane-system-one":"SK-DJ-0004","dj-utr-dj-bord":"SK-DJ-0005","dj-utr-dj-bord2":"SK-DJ-0006","dj-utr-scenengineer":"SK-DJ-0007","dj-utr-media-editor":"SK-DJ-0008","projektor-xga":"SK-BLD-0001","projektor-fhd":"SK-BLD-0002","skarm-65":"SK-BLD-0003","skarm-75":"SK-BLD-0004","modulskarm-fhd":"SK-BLD-0005","trailer-skarm":"SK-BLD-0006"};

    // \u2500\u2500 PRODUKTBESKRIVNINGAR \u2014 auto-genererad fr\xE5n JSON \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const PROD_DESC = {"scen-small":{"desc":"Scenpodie som kan fungera som en liten scen eller podie p\xE5 en st\xF6rre scen, t.ex. f\xF6r att rigga upp ett trumset. Passar f\xF6r 1 person inkl. instrument. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-small-plus":{"desc":"Scenpodie f\xF6r 1\u20133 personer. Kan byggas vertikalt (2\xD73 m) eller horisontellt (3\xD72 m). Passar f\xF6r duett eller trio med utrustning. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-small-plusplus":{"desc":"Scenpodie f\xF6r 2\u20133 personer. Flexibla dimensioner \u2013 vertikalt 2\xD74 m eller horisontellt 3\xD72 m. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium":{"desc":"Scenpodie f\xF6r 3\u20134 personer. Passar utm\xE4rkt f\xF6r ett litet band eller talarpanel. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium-plus":{"desc":"Scenpodie f\xF6r 4\u20135 personer. Bra storlek f\xF6r band p\xE5 4\u20135 musiker eller konferensscen med talarpanel. Scentrapp och scenkjol hyrs separat.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium-plus-tak":{"desc":"Komplett paket: Scenpaket Medium+ (12m\xB2) med scentak i aluminium med PVC-tak. Takh\xF6jd 230 cm. Enkel montering p\xE5 20\u201330 min f\xF6r 2 personer. Perfekt f\xF6r utomhusevent.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-medium-plusplus":{"desc":"Scenpodie f\xF6r 5\u20137 personer. R\xE4cker f\xF6r de flesta liveband och konferenser med st\xF6rre panel.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-large":{"desc":"Scen f\xF6r 5\u20138 musiker eller upptr\xE4dande. Byggs horisontellt 5\xD74 m. Hyrs enbart ut inkl. transport, montering och demontering av v\xE5r personal.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-large-plus":{"desc":"Professionell konsertscen f\xF6r 6\u20139 musiker. Hyrs enbart ut inkl. transport, montering och demontering.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-large-plus-tak":{"desc":"Komplett utomhusscen: 24m\xB2 med scentak i st\xE5l/aluminium med PVC-tak och scentrapp. Takh\xF6jd 380 cm. Hyrs enbart inkl. transport och montering av v\xE5r personal.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-xl":{"desc":"Stor konsertscen f\xF6r 8\u201312 musiker. Byggs horisontellt 9\xD74 m. Hyrs enbart inkl. transport, montering och demontering.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"scen-xl-plus":{"desc":"V\xE5r st\xF6rsta standardscen \u2013 48m\xB2 f\xF6r 10\u201314 upptr\xE4dande. Byggs horisontellt 8\xD76 m. Hyrs enbart inkl. transport, montering och demontering.","cat":"Scen","link":"/vara-tjanster/hyra-scen/","includes":[]},"portable-small":{"desc":"Batteridrift, 20+ tim. Inbyggd mixer och Bluetooth. 6,5\\\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["6,5\\\\"/1\\\\" element","200W peak / 100W RMS","Batteridrift upp till 20 tim","Bluetooth","Vikt: 5,4 kg"]},"portable-small-plus":{"desc":"Batteridrift, 7+ tim. Inbyggd mixer och Bluetooth. 12\\\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["12\\\\"/2\\\\" element","600W peak / 300W RMS","Batteridrift upp till 7 tim","Bluetooth","Vikt: 13,4 kg"]},"portable-medium":{"desc":"Alto TS108 C kolumnh\xF6gtalare. 8\u2033 bas och sex 2,75\u2033 diskant. Inbyggd mixer. Smal och snygg design.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["8\u2033 bas + 6\xD72,75\u2033 element","600 W peak / 300 W RMS","Max 123 dB","Bluetooth","Vikt: 16 kg"]},"portable-medium-plus":{"desc":"Alto TS112 C kolumnh\xF6gtalare. 12\u2033 bas och \xE5tta 2,75\u2033 diskant. Inbyggd mixer.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["12\u2033 bas + 8\xD72,75\u2033 element","1 200 W peak / 600 W RMS","Max 127 dB","Bluetooth","Vikt: 24,1 kg"]},"portable-small-duo":{"desc":"Tv\xE5 batteridrivna 6,5\u2033 h\xF6gtalare p\xE5 stativ. Upp till 20 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ing\xE5r.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD76,5\u2033/1\u2033 aktiva element","400 W peak / 200 W RMS","Batteridrift upp till 20 tim","Bluetooth","Vikt: 10,8 kg"]},"portable-large":{"desc":"LD Systems Maui 28 G2. Tv\xE5 8\\\\" bas och 16 st 3\\\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2x8\\\\" bas + 16x3\\\\" element","2000W peak / 1000W RMS","Max 126 dB","Bluetooth","Vikt: 25,7 kg"]},"portable-small-plus-duo":{"desc":"Tv\xE5 batteridrivna 12\u2033 h\xF6gtalare p\xE5 stativ. Upp till 7 timmars batteridrift. Inbyggd mixer och Bluetooth. Handmikrofon ing\xE5r.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD712\u2033/2\u2033 aktiva element","1 200 W peak / 600 W RMS","Batteridrift upp till 7 tim","Bluetooth","Vikt: 26,8 kg"]},"portable-medium-duo":{"desc":"Tv\xE5 Alto TS108 C kolumnh\xF6gtalare. 8\u2033 bas och sex 2,75\u2033 diskant. Inbyggd mixer. Smal och snygg design.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD78\u2033 bas + 12\xD72,75\u2033 element","1 200 W peak / 600 W RMS","Max 124 dB","Bluetooth","Vikt: 32 kg"]},"portable-medium-plus-duo":{"desc":"Tv\xE5 Alto TS112 C kolumnh\xF6gtalare. 12\u2033 bas och \xE5tta 2,75\u2033 diskant. Inbyggd mixer.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["2\xD712\u2033 bas + 16\xD72,75\u2033 element","2 400 W peak / 1 200 W RMS","Max 129 dB","Bluetooth","Vikt: 48,2 kg"]},"portable-large-plus":{"desc":"Tv\xE5 LD Systems Maui 28 G2 kolumner. 4 st 8\\\\" bas och 32 st 3\\\\" element.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["4x8\\\\" bas + 32x3\\\\" element","4000W peak / 2000W RMS","Max 126 dB","Bluetooth","Vikt: 51,4 kg"]},"portable-large-duo":{"desc":"Tv\xE5 LD Systems Maui 28 G2 kolumner. Fyra 8\u2033 basar och 32 st 3\u2033 diskant.","cat":"Ljud \u2014 Portable","link":"/vara-tjanster/hyra-ljud/portable/","includes":["4\xD78\u2033 bas + 32\xD73\u2033 diskant","4 000 W peak / 2 000 W RMS","Max 126 dB","Bluetooth","Vikt: 51,4 kg"]},"event-small":{"desc":"Passar f\xF6r tal, s\xE5ng och paus-/bakgrundsmusik f\xF6r grupper upp till 100 personer. Tv\xE5 Alto 10\\\\" fullrange h\xF6gtalarenheter p\xE5 stativ.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 10\\\\"/1,4\\\\" element","2000W peak / 1000W RMS","Max 130 dB","48\u201320000 Hz","Samlad vikt: 25 kg"]},"event-small-plus":{"desc":"Passar f\xF6r grupper upp till 180 personer. Tv\xE5 Alto 12\\\\" fullrange h\xF6gtalarenheter p\xE5 stativ.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 12\\\\"/1,4\\\\" element","2500W peak / 1250W RMS","Max 130 dB","48\u201320000 Hz","Samlad vikt: 34 kg"]},"event-medium":{"desc":"Fyra Alto 10\\\\" fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 240 personer.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 10\\\\"/1,4\\\\" element","2000W peak / 1000W RMS","Max 130 dB","4 h\xF6gtalare, bredare ljudbild","Samlad vikt: 54 kg"]},"event-medium-plus":{"desc":"Fyra Alto 12\\\\" fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 380 personer.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 12\\\\"/1,4\\\\" element","2500W peak / 1250W RMS","Max 130 dB","62\u201320000 Hz","Samlad vikt: 62 kg"]},"event-large":{"desc":"Fyra Alto 15\\\\" fullrange h\xF6gtalarenheter p\xE5 stativ f\xF6r upp till 560 personer.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["Aktiva 15\\\\"/1,4\\\\" element","2500W peak / 1250W RMS","Max 130 dB","48\u201320000 Hz","Samlad vikt: 78 kg"]},"event-large-plus":{"desc":"Fyra Alto 15\u2033 fullrange h\xF6gtalarenheter f\xF6r upp till 560 personer. Montering 20\u201325 min.","cat":"Ljud \u2014 Event","link":"/vara-tjanster/hyra-ljud/event/","includes":["15\u2033/1,4\u2033 aktiva element","2 500 W peak / 1 250 W RMS","Max 130 dB","48\u201320 000 Hz","Samlad vikt: 78 kg"]},"music-small":{"desc":"DJ/trubadur f\xF6r 20\u201380 personer. Tv\xE5 10\\\\" fullrange och en 12\\\\" sub-bas.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["10\\\\"/1,4\\\\" + 12\\\\" sub","2000W peak / 1000W RMS","Max 130 dB","36\u201320000 Hz","Samlad vikt: 65 kg"]},"music-small-plus":{"desc":"DJ/trubadur f\xF6r 40\u2013100 pers. Tv\xE5 10\\\\" fullrange och tv\xE5 12\\\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["10\\\\"/1,4\\\\" + 2x12\\\\" sub","2000W peak","Max 130 dB","36\u201320000 Hz","Samlad vikt: 90 kg"]},"music-medium":{"desc":"DJ f\xF6r 60\u2013120 pers. Tv\xE5 12\\\\" fullrange och tv\xE5 12\\\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["12\\\\"/1,4\\\\" + 2x12\\\\" sub","2000W peak","Max 130 dB","36\u201320000 Hz","Samlad vikt: 95 kg"]},"music-large":{"desc":"DJ f\xF6r 120\u2013250 pers. Tv\xE5 12\\\\" fullrange och tv\xE5 15\\\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["12\\\\"/1,4\\\\" + 2x15\\\\" sub","2000W peak","Max 132 dB","29\u201320000 Hz","Samlad vikt: 115 kg"]},"music-xl":{"desc":"DJ f\xF6r 180\u2013350 pers. Tv\xE5 15\\\\" fullrange och tv\xE5 18\\\\" sub-basar.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["15\\\\"/1,4\\\\" + 18\\\\" sub","8000W peak / 2000W RMS","Max 132 dB","Samlad vikt: 120 kg"]},"music-xl-plus":{"desc":"DJ f\xF6r 250\u2013600 pers. 15\\\\" fullrange, 15\\\\" och 18\\\\" sub.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["15\\\\"/1,4\\\\" + 15\\\\"/18\\\\" sub","8000W peak","Max 132 dB","Samlad vikt: 200 kg"]},"music-xxl":{"desc":"Fyra 15\\\\" fullrange och fyra 18\\\\" sub-basar. Skrymmande produkt.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["4x15\\\\"/1,4\\\\" + 4x18\\\\" sub","10 000W peak","Max 132 dB","Samlad vikt: 320 kg"]},"music-concert":{"desc":"Konsert. Tv\xE5 12\\\\" fullrange och fyra 18\\\\" sub. Varje stack 2,3m h\xF6g.","cat":"Ljud \u2014 Music","link":"/vara-tjanster/hyra-ljud/music/","includes":["12\\\\"/1,4\\\\" + 18\\\\" sub","10 800W peak","Max 135 dB","Samlad vikt: 360 kg"]},"line-array-small":{"desc":"RCF line array-system f\xF6r stora konserter och utomhusevent. 8\xD7 RCF HDL 6-A fullrange + 2\xD7 RCF Sub 8003-AS MK3. Pris fr\xE5n beroende p\xE5 konfiguration och montering.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["8\xD76\\\\" fullrange line array","2\xD718\\\\" sub-basar","Max 138 dB SPL","R\xE4ckvidd upp till 80 m","Kr\xE4ver lyfttorn eller rigg"]},"line-array-medium":{"desc":"RCF line array-system f\xF6r stora konserter och festivaler. 10\xD7 RCF HDL 6-A fullrange + 4\xD7 RCF Sub 8003-AS MK3. Pris fr\xE5n beroende p\xE5 konfiguration och montering.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["10\xD76\\\\" fullrange line array","4\xD718\\\\" sub-basar","Max 140 dB SPL","R\xE4ckvidd upp till 100 m","Kr\xE4ver lyfttorn eller rigg"]},"live-small":{"desc":"Passar f\xF6r trubadur f\xF6r grupper 20\u201360 personer. Tv\xE5 Alto 12\\\\" h\xF6gtalarenheter med inbyggd mixer.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["12\\\\"/2\\\\" fullrange","720W peak / 360W RMS","Max 120 dB","8-bands EQ","Samlad vikt: 58 kg"]},"live-medium":{"desc":"Trubadur eller DJ f\xF6r 60\u2013100 personer. Tv\xE5 Alto 15S sub-basar samt tv\xE5 12\\\\" fullrange.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["15\\\\" sub + 12\\\\"/2\\\\" fullrange","2000W peak / 1080W RMS","Max 130 dB","45\u201320000 Hz","Samlad vikt: 105 kg"]},"live-large":{"desc":"Liveband f\xF6r 120\u2013200 personer. Fyra 15S sub-basar och tv\xE5 15\\\\" fullrange.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["4x15\\\\" sub + 2x15\\\\" fullrange","3600W peak / 1800W RMS","Max 120 dB","Samlad vikt: 140 kg"]},"live-xl":{"desc":"Trubadur eller DJ f\xF6r 180\u2013350 personer. Tv\xE5 15\\\\" fullrange och tv\xE5 18\\\\" sub-basar.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["15\\\\"/1,4\\\\" + 18\\\\" sub","8000W peak / 2000W RMS","Max 132 dB","29\u201320000 Hz","Samlad vikt: 120 kg"]},"live-xl-plus":{"desc":"DJ f\xF6r 250\u2013600 personer. Tv\xE5 15\\\\" fullrange, tv\xE5 15\\\\" sub och 18\\\\" sub.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["15\\\\"/1,4\\\\" + 15\\\\"/18\\\\" sub","8000W peak / 2000W RMS","Max 132 dB","29\u201320000 Hz","Samlad vikt: 200 kg"]},"live-xxl":{"desc":"DJ f\xF6r 500\u20131500 personer. Fyra 15\\\\" fullrange och fyra 18\\\\" sub-basar.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["4x15\\\\"/1,4\\\\" + 4x18\\\\" sub","10 000W peak / 2800W RMS","Max 132 dB","29\u201320000 Hz","Samlad vikt: 320 kg"]},"live-concert":{"desc":"Konsert f\xF6r liveband eller DJ. Tv\xE5 12\\\\" fullrange och fyra 18\\\\" sub. Varje stack 2,3m h\xF6g.","cat":"Ljud \u2014 Live","link":"/vara-tjanster/hyra-ljud/live/","includes":["12\\\\"/1,4\\\\" + 18\\\\" sub","10 800W peak / 2700W RMS","Max 135 dB","37\u201317000 Hz","Samlad vikt: 360 kg"]},"mixer-2-2":{"desc":"Kompakt Alto-mixer med 2 mic + 2 stereokanaler och inbyggd Bluetooth.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-4-2":{"desc":"Alto-mixer med 4 mic + 2 stereokanaler, inbyggda effekter och Bluetooth.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-vibz8dc":{"desc":"LD System Vibz8dc med 4 mic-kanaler, 2 stereokanaler och inbyggd kompressor p\xE5 kanal 1 & 2.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-4-4":{"desc":"Mackie-mixer med 4 mic + 4 stereokanaler. Kommer i transportv\xE4ska.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-6-4":{"desc":"Allen & Heath ZED14. 6 mic + 4 stereokanaler med 69 dB gain.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-12-4":{"desc":"Alto Live L16. 12 mic + 4 stereokanaler, 24-bit DSP och 256 effekter.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-16-3":{"desc":"Allen & Heath ZED22FX. 16 mic + 3 stereokanaler, USB, high-pass filter.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mixer-ilive-t80":{"desc":"Allen & Heath iLive T80 studio- & konsert-mixer med Stagebox p\xE5 scenen via CAT5/6-kabel.","cat":"Ljud \u2014 Mixers","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-gravity":{"desc":"Max last 30 kg, vikt 3,7 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"xlr-kablar":{"desc":"1,0m\u201315m, fr 40 kr (50 kr inkl moms)","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-k&m":{"desc":"Max last 30 kg, vikt 3,7 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"mikrofonstativ":{"desc":"Mikrofonstativ med justerbar h\xF6jd","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-gravity-premium":{"desc":"Max last 50 kg, vikt 6,4 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"handmikrofon":{"desc":"Handmikrofon inkl 6 m XLR kabel","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"bluetooth-mottagare":{"desc":"Omvandlar tr\xE5dl\xF6st ljud till analog signal","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"instrument-blas":{"desc":"Mikrofon f\xF6r bl\xE5sinstrument, inkl. XLR-kabel.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["F\xF6r bl\xE5sinstrument","Clip-on mikrofon","XLR-anslutning","Kardioid polarm\xF6nster"]},"instrumentmikrofon":{"desc":"Instrumentmikrofon f\xF6r t.ex. trumma eller bl\xE5s","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"hogtalarstativ-gravity-med-vev":{"desc":"Max last 50 kg, vikt 9,1 kg","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"bluetooth-mottagare-pro":{"desc":"Bluetooth-mottagare med l\xE4ngre r\xE4ckvidd. Tr\xE5dl\xF6s anslutning till PA.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"di-box-passiv":{"desc":"Passiv DI-box, 2 kanaler. XLR ut / 6,35 mm in.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"di-box-aktiv":{"desc":"Aktiv DI-box, 1 kanal. XLR ut / 6,35 mm in, 9V batteri.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"xlr-multikabel-6ch":{"desc":"Stagebox med 15 m multikabel, 6 kanaler.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"xlr-multikabel-8ch":{"desc":"Stagebox med 25 m multikabel, 8 kanaler.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"tradlos-handmikrofon":{"desc":"Tr\xE5dl\xF6s handmikrofon, ca 30 m r\xE4ckvidd","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["UHF tr\xE5dl\xF6s","R\xE4ckvidd ca 30 m","Kr\xE4ver AA-batteri","Mottagar-enhet ing\xE5r"]},"tradlost-headset":{"desc":"Tr\xE5dl\xF6st headset, ca 30 m r\xE4ckvidd","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["UHF tr\xE5dl\xF6s","R\xE4ckvidd ca 30 m","Bodypack + headset ing\xE5r","Kr\xE4ver AA-batteri"]},"tradlos-iem":{"desc":"In-ear monitor f\xF6r scen, ca 30 m r\xE4ckvidd.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["In-ear monitor f\xF6r scen","R\xE4ckvidd ca 30 m","Bodypack + in-ear ing\xE5r","Kr\xE4ver AA-batteri"]},"instrument-slagverk":{"desc":"Mikrofoner f\xF6r trumset/slagverk, inkl. XLR-kablar.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Mikrofonkit f\xF6r trumset/slagverk","Inkl. XLR-kablar och clips","Dynamiska mikrofoner","Kardioid/hyperkardoid polarm\xF6nster"]},"xlr-multikabel-24ch":{"desc":"Stagebox stor med 15 m multikabel, 24+8 kanaler.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":[]},"slxd-1-mik":{"desc":"Digitalt tr\xE5dl\xF6st system med SM58-kapsel. AES-256, r\xE4ckvidd ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","SM58-kapsel (vokal)","R\xE4ckvidd ca 100 m","Auto-scan frekvens","Rack-monterbar mottagare"]},"slxd-1-myggmik":{"desc":"Digitalt tr\xE5dl\xF6st system med bodypack och myggmikrofon. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","Bodypack + myggmikrofon","R\xE4ckvidd ca 100 m","Auto-scan frekvens","Rack-monterbar mottagare"]},"slxd-1-headset":{"desc":"Digitalt tr\xE5dl\xF6st system med bodypack och headset. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","Bodypack + headset","R\xE4ckvidd ca 100 m","Auto-scan frekvens","Rack-monterbar mottagare"]},"slxd-1-lagprofil":{"desc":"Digitalt tr\xE5dl\xF6st system med bodypack och \xF6ronh\xE4ngande l\xE5gprofil headset.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","Bodypack + \xF6ronh\xE4ngande headset","R\xE4ckvidd ca 100 m","Diskret l\xE5gprofil-design","Rack-monterbar mottagare"]},"effektrack":{"desc":"5-zon ART-matrix + Klark Teknik DP1000 feedback-suppressor.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["5-zon ART-matrix","Klark Teknik DP1000 feedback-suppressor","F\xF6rhindrar rundg\xE5ng","Rack-monterat 19\\\\"","Anv\xE4nds med PA-system"]},"shure-slxd-\u2013-digitalt-tradlost-system,-2-mikrofoner":{"desc":"Dubbelt digitalt tr\xE5dl\xF6st system med 2 handh\xE5llna SM58-mikrofoner. Ca 100 m r\xE4ckvidd. AES-256-kryptering.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 SM58 handh\xE5llna mikrofoner","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Auto-scan frekvens"]},"slxd-2-myggmik":{"desc":"Digitalt tr\xE5dl\xF6st system med 2 bodypack och myggmikrofoner. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 bodypack + myggmikrofon","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Auto-scan frekvens"]},"slxd-2-headset":{"desc":"Digitalt tr\xE5dl\xF6st system med 2 bodypack och headset. AES-256, ca 100 m.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 bodypack + headset","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Auto-scan frekvens"]},"slxd-2-lagprofil":{"desc":"Digitalt tr\xE5dl\xF6st system med 2 bodypack och \xF6ronh\xE4ngande l\xE5gprofil headset.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["Digitalt AES-256 krypterat","2\xD7 bodypack + l\xE5gprofil headset","Dual-channel mottagare","R\xE4ckvidd ca 100 m","Diskret design"]},"wireless-8ch":{"desc":"4 handmikrofoner och 4 headset med antennsplitter. 823\u2013832 MHz, upp till 50 m r\xE4ckvidd.","cat":"Ljud \u2014 Mikrofoner","link":"/vara-tjanster/hyra-ljud/","includes":["4\xD7 handmikrofon + 4\xD7 headset","Antennsplitter ing\xE5r","823\u2013832 MHz band","R\xE4ckvidd upp till 50 m","8 oberoende kanaler"]},"ljus-small":{"desc":"LED T-bar med fyra RGB PAR armaturer p\xE5 stativ. Synkar till musik. Plug and play.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["1 stativ med T-bar","4x PAR armaturer: 12x9W RGB","H\xF6jd: 2500 mm","Str\xF6mf\xF6rbrukning: 260W","Samlad vikt: 16 kg"]},"ljus-small-plus":{"desc":"Trosstorn med 100W COB LED moving head p\xE5 toppen. Roterar 540/180\xB0, programmerbar.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Trosstorn 1 m","Moving head: 36x3W RGBW","Str\xE5lvinkel: 15\xB0","DMX/musikstyrning","H\xF6jd p\xE5 tross: 1 m"]},"ljus-small-pp":{"desc":"Fyra effekter p\xE5 tv\xE5 stativ: LED PAR, roterande armaturer, stroboskop/UV och laser.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["2 stativ med T-bars","4 typer av effekter","Str\xF6mf\xF6rbrukning: 340W","DMX och musikstyrning","Samlad vikt: 30 kg"]},"ljus-medium":{"desc":"Tv\xE5 trosstorn med 120W COB LED + 26 RGBW moving heads. DMX eller automatik.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["2 trosstorn","2x moving heads: 120W COB + 26x2W RGBW","Str\xE5lvinkel: 25\xB0","DMX/musikstyrning","H\xF6jd p\xE5 tross: 1 m"]},"ljus-medium-plus":{"desc":"Fem effekter p\xE5 tre stativ: LED PAR, roterande, stroboskop/UV och LED scanners.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["3 stativ","5 typer av effekter inkl scanners","Str\xF6mf\xF6rbrukning: 340W","DMX och musikstyrning","Samlad vikt: 30 kg"]},"ljus-medium-pp":{"desc":"Sex effekter: LED PAR, Moving Head Wash, Moving Head Beam. Kan styras till musik.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["2 stativ","4x LED PAR + 2x Moving Head Wash + 2x Moving Head Beam","DMX och musikstyrning"]},"ljus-large":{"desc":"Professionellt ljuspaket med moving heads, PAR-armaturer och stroboskop. Passar f\xF6r medelstora event och galor.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Moving heads","PAR-armaturer","Stroboskop","DMX-styrning"]},"ljus-large-plus":{"desc":"Komplett ljusrigg f\xF6r st\xF6rre event med moving heads, PAR, stroboskop och effekter.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Moving heads","PAR-armaturer","Stroboskop","Laser/effekter","DMX-styrning"]},"ljus-large-pp":{"desc":"Maximal ljusrigg med komplett ljuss\xE4ttning f\xF6r stora konserter och galor.","cat":"Ljus \u2014 F\xE4rdiga paket","link":"/vara-tjanster/hyra-ljus/fardiga-paket/","includes":["Moving heads","PAR-armaturer","Stroboskop","Laser/effekter","LED wash","DMX-styrning"]},"rokmaskin-1500":{"desc":"R\xF6kmaskin med inbyggd RGB-belysning. Inkl 1 l r\xF6kv\xE4tska. 1 st: 349 kr, 2 st: 649 kr, 4 st: 1249 kr.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["6x3W LED RGB","Dimeffekt: 85 m\xB3/min","Tr\xE5dl\xF6s fj\xE4rrkontroll","Inkl 1 l r\xF6kv\xE4tska","Vikt: 5 kg"]},"rokmaskin-650":{"desc":"Kraftfullare r\xF6kmaskin med 12 RGB-lampor. Inkl 1 l r\xF6kv\xE4tska. 1 st: 449 kr, 2 st: 849 kr, 4 st: 1699 kr.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["12x3W LED RGB","Dimeffekt: 125 m\xB3/min","Tr\xE5dl\xF6s fj\xE4rrkontroll","Inkl 1 l r\xF6kv\xE4tska","Vikt: 10 kg"]},"kallgnistmaskin":{"desc":"Cold spark machine f\xF6r scen, br\xF6llop eller fest. Kr\xE4ver granulat. 1 st: 499 kr, 2 st: 949 kr, 4 st: 1799 kr.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["700W","F\xF6rv\xE4rmningstid: ca 4 min","DMX 512","Granulat: 200g = ca 6 min","Vikt: 8 kg"]},"konfettiavfyrare":{"desc":"Konfettiavfyrare som skjuter av ett konfettir\xF6r \u2013 perfekt f\xF6r firanden och shower.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["Elektrisk avfyrare","Inkl konfettir\xF6r"]},"hazer-hz1500":{"desc":"Professionell hazer som skapar ett finf\xF6rdelat dis \u2014 perfekt f\xF6r att synligg\xF6ra ljusstr\xE5lar. 1 st: 649 kr, 2 st: 1 199 kr. Inkl 1 l r\xF6kv\xE4tska.","cat":"Ljus \u2014 R\xF6k & pyro","link":"/vara-tjanster/hyra-ljus/rok-pyro/","includes":["DMX-styrning","Kontinuerlig dis-produktion","Stabil output utan pulsar","Inkl 1 l r\xF6kv\xE4tska","Flightcase-monterad"]},"stativ-400":{"desc":"Ljusstativ standard med 400 mm T-bar. Upp till 2,4 m h\xF6jd, max 20 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 400 mm","H\xF6jd: 1,25\u20132,40 m","Max 20 kg","Vikt: 3,7 kg"]},"stativ-1200":{"desc":"Ljusstativ standard med 1200 mm T-bar. Plats f\xF6r upp till 4 effekter.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 1200 mm","H\xF6jd: 1,25\u20132,40 m","Max 20 kg","Vikt: 3,7 kg"]},"stativ-900p":{"desc":"Premiumstativ med 900 mm T-bar. Upp till 2,5 m h\xF6jd, max 30 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 900 mm","H\xF6jd: 1,10\u20132,50 m","Max 30 kg","Vikt: 5,8 kg"]},"vevstativ-1200":{"desc":"Premiumvevstativ med 1200 mm T-bar. Upp till 3,7 m h\xF6jd, max 35 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["T-bar: 1200 mm","H\xF6jd: 1,70\u20133,70 m","Max 35 kg","Vikt: 20 kg"]},"tross-1m":{"desc":"Trosstorn med basplatta + 1,0 m 4-punktstross + topplatta. Max 50 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["4-punkts tross","H\xF6jd: 1,0 m","Max 50 kg","Vikt: 16 kg"]},"tross-15m":{"desc":"Trosstorn med basplatta + 1,5 m 4-punktstross + topplatta. Max 50 kg.","cat":"Ljus \u2014 Stativ & tross","link":"/vara-tjanster/hyra-ljus/stativ-tross/","includes":["4-punkts tross","H\xF6jd: 1,5 m","Max 50 kg","Vikt: 18 kg"]},"dj-utr-dj-controller-numark":{"desc":"Standalone DJ-controller. St\xF6djer Amazon Music, Tidal, Beatport, SoundCloud Go+, Serato DJ m.fl. Inbyggd 7\\\\" touch-display och fyra effekter.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Standalone \u2013 ingen dator kr\xE4vs","7\\\\" h\xF6guppl\xF6st touch-display","Amazon Music, Tidal, Beatport, SoundCloud, Serato DJ","4 inbyggda effekter (Echo, Flanger, Delay, Phaser)","2x6\\\\" touch-jog wheels","DMX-styrning"]},"dj-utr-dj-controller-denon-go":{"desc":"B\xE4rbar standalone DJ-controller med inbyggt batteri (upp till 4 tim). Bluetooth f\xF6r tr\xE5dl\xF6sa h\xF6gtalare. 26 Main FX, 2 Sweep FX, 10 Touch FX.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Standalone \u2013 ingen dator kr\xE4vs","Upp till 4 tim batteridrift","Bluetooth s\xE4ndare f\xF6r tr\xE5dl\xF6sa h\xF6gtalare","26 Main FX, 2 Sweep FX, 10 Touch FX","Amazon Music, Tidal, Beatport, SoundCloud"]},"dj-utr-dj-controller-denon-prime4":{"desc":"V\xE4rldens mest kraftfulla frist\xE5ende DJ-system. Fyra deck, Stems-separation, Amazon Music, TIDAL, Beatsource, Beatport, Soundcloud GO+, Serato DJ.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["4 frist\xE5ende deck","Stems-separation (branschens f\xF6rsta frist\xE5ende)","Amazon Music, TIDAL, Beatsource, Beatport, Serato","Oberoende zonutg\xE5ng f\xF6r separat lounge","2 mikrofonkanaler med EQ och talkover"]},"dj-utr-dj-rane-system-one":{"desc":"V\xE4rldens f\xF6rsta all-in-one DJ-system med motoriserade 7,2\\\\" aluminiumtallrikar. Engine DJ inbyggt med Serato DJ-st\xF6d.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Motoriserade 7,2\\\\" aluminiumtallrikar","Engine DJ inbyggt + Serato DJ","Fader FX, Sweep FX, Touch FX, Main FX","Stems-separation","Laptop-fri drift"]},"dj-utr-dj-bord":{"desc":"Portabelt DJ-bord som rymmer DJ-controller. Hopf\xE4llbart, l\xE4tt att frakta.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Material: Metall","M\xE5tt (BxDxH): 1000 x 480 x (700\u2013900) mm","Vikt: 11 kg"]},"dj-utr-dj-bord2":{"desc":"Portabelt DJ-bord med front- och sidopaneler som rymmer DJ-controller.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Material: Aluminium/tyg","M\xE5tt (BxDxH): 1203 x 605 x 1125 mm","Vikt: 14 kg"]},"dj-utr-scenengineer":{"desc":"Hyr en scenengineer till livespelningen eller festen. Vi har tekniker p\xE5 olika niv\xE5er som kan styra ljud, ljus och bild.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["952 kr/tim exkl moms (1 190 kr inkl)"]},"dj-utr-media-editor":{"desc":"Hyr en media-editor f\xF6r att skapa r\xF6rligt inneh\xE5ll f\xF6r sk\xE4rmar och presentationer.","cat":"DJ-utrustning","link":"/vara-tjanster/hyra-dj/","includes":["Fotograf fast media: 600 kr/tim (750 inkl moms)","Fotograf r\xF6rligt media: 792 kr/tim (990 inkl moms)","AI-specialist: 1 592 kr/tim (1 990 inkl moms)"]},"projektor-xga":{"desc":"Miniprojektor Toshiba med XGA-uppl\xF6sning (1024\xD7768). Utm\xE4rkt f\xF6r presentationer. Klarar 60\u2033\u2013100\\\\".","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["1024\xD7768 (XGA)","Klarar SXGA 1280\xD71024","1100 ANSI lumen","Bildf\xF6rh\xE5llande 16:9","Vikt: 0,9 kg"]},"projektor-fhd":{"desc":"BenQ Full HD-projektor (1920\xD71080). Fungerar i dagsljus. Klarar 60\\\\"\u2013300\\\\".","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["Full HD 1920\xD71080","3200 ANSI lumen","Bildf\xF6rh\xE5llande 16:9","Vikt: 2,6 kg"]},"skarm-65":{"desc":"65\\\\" Samsung professionell 4K-sk\xE4rm (3840\xD72160). Perfekt f\xF6r fest-, event- eller m\xF6teslokal.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["65\\\\" Samsung","Ultra HD 3840\xD72160","VESA 400\xD7300","Vikt: 30,9 kg","Skrymmande \u2013 transport ing\xE5r"]},"skarm-75":{"desc":"75\\\\" Samsung professionell 4K-sk\xE4rm (3840\xD72160). Perfekt f\xF6r event eller m\xF6teslokal.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["75\\\\" Samsung","Ultra HD 3840\xD72160","VESA 400\xD7300","Vikt: 30,9 kg","Skrymmande \u2013 transport ing\xE5r"]},"modulskarm-fhd":{"desc":"Moduluppbyggd storbildssk\xE4rm Full HD. Start fr\xE5n 3,75 m\xB2 (4 496 kr exkl moms). Utomhus, scen eller m\xE4ssa. Inkl transport och montering.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["Full HD 1920\xD71080","Ljusstyrka 5000 nits","Pris per kvm","Str\xF6mbehov 3-fas 16A","Kr\xE4ver inh\xE4gnat/bevakat omr\xE5de utomhus"]},"trailer-skarm":{"desc":"7 m\xB2 mobil storbildssk\xE4rm p\xE5 trailer. Full HD. Optimalt avst\xE5nd ca 9\u201312 m. Inkl transport och montering.","cat":"Projektor & sk\xE4rm","link":"/vara-tjanster/hyra-bild-projektorer-skarmar/","includes":["7 m\xB2 (1587\\\\")","Full HD 1920\xD71080","Ljusstyrka 5000 nits","Str\xF6mbehov 3-fas 16A","Kr\xE4ver inh\xE4gnat/bevakat omr\xE5de utomhus"]}};

    // \u2500\u2500 PRODUKT-MODAL (globalt via Layout.astro sk-modal) \u2500\u2500\u2500\u2500\u2500
  function openProductModal(item) {
    if (!window.skModalOpen) return;
    const info = PROD_DESC[item.id] || PROD_DESC[item.id?.replace(/^(scen-)/,'')] || {};
    const imgSrc = _getImg(item);
    const artno = item.artno || PROD_ARTNO[item.id] || '';
    const specArr = info.includes?.length ? info.includes : (info.desc ? [info.desc] : []);
    window.skModalOpen({
      name:      item.name,
      artno:     artno,
      desc:      specArr.join('||'),
      rows:      [],
      price:     item.price,
      priceNote: item.priceNote || '/dygn',
      category:  item.category || item.cat || '',
      cartId:    item.id,
      images:    imgSrc ? [imgSrc] : [],
      videos:    [],
      persons:   '',
    });
  }

  // \u2500\u2500 PRODUKTV\xC4LJARE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  (function initPicker() {
    const catSel  = document.getElementById('pp-cat');
    const subWrap = document.getElementById('pp-sub-wrap');
    const subSel  = document.getElementById('pp-sub');
    const prodSel = document.getElementById('pp-prod');
    const addBtn  = document.getElementById('pp-add-btn');
    if (!catSel) return;

    // Fyll kategorier
    catSel.innerHTML = '<option value="">\u2014 v\xE4lj kategori \u2014</option>' +
      Object.keys(PROD_CATALOG).map(k => \\\`<option value="\\\${k}">\\\${k}</option>\\\`).join('');

    function populateProducts(prods) {
      prodSel.innerHTML = '<option value="">\u2014 v\xE4lj produkt \u2014</option>' +
        (prods||[]).map(p => {
          const artno = p.artno || PROD_ARTNO[p.id] || '';
          const artnoStr = artno ? \\\` [\\\${artno}]\\\` : '';
          return \\\`<option value="\\\${p.id}" data-price="\\\${p.price}" data-name="\\\${p.name.replace(/"/g,'&quot;')}" data-artno="\\\${artno}">\\\${p.name}\\\${artnoStr} \u2014 \\\${p.price.toLocaleString('sv')} kr</option>\\\`;
        }).join('');
    }

    catSel.addEventListener('change', () => {
      const entry = PROD_CATALOG[catSel.value];
      subWrap.style.display = 'none';
      prodSel.innerHTML = '<option value="">\u2014 v\xE4lj kategori \u2014</option>';
      if (!entry) return;
      if (entry.sub) {
        subSel.innerHTML = '<option value="">\u2014 v\xE4lj underkategori \u2014</option>' +
          Object.keys(entry.sub).map(k => \\\`<option value="\\\${k}">\\\${k}</option>\\\`).join('');
        subWrap.style.display = '';
      } else {
        populateProducts(entry.products);
      }
    });

    subSel.addEventListener('change', () => {
      const entry = PROD_CATALOG[catSel.value];
      if (entry?.sub && subSel.value) populateProducts(entry.sub[subSel.value]);
    });

    addBtn.addEventListener('click', () => {
      const opt = prodSel.options[prodSel.selectedIndex];
      if (!opt || !opt.value) return;
      const id     = opt.value;
      const name   = opt.dataset.name || opt.textContent.split(' \u2014 ')[0];
      const price  = parseInt(opt.dataset.price) || 0;
      const imgSrc = PROD_IMG[id] || '';
      const artnoVal = opt.dataset.artno || PROD_ARTNO[id] || '';

      const cart = getCart();
      const ex = cart.find(i => i.id === id);
      const artno = PROD_ARTNO[id] || '';
      if (ex) { ex.qty++; } else {
        cart.push({ id, name, price, qty: 1, category: catSel.value, priceNote: '/dygn', image: imgSrc, artno: artnoVal });
      }
      saveCart(cart);
      updateNavBadge(); renderCart(); updateSummary();

      // Visuell feedback
      addBtn.textContent = '\u2713 Tillagd!';
      addBtn.style.background = '#166534';
      setTimeout(() => { addBtn.textContent = '\uFF0B L\xE4gg till'; addBtn.style.background = ''; }, 1500);
      prodSel.selectedIndex = 0;
    });
  })();
  function _genCartId() { const h=()=>Math.random().toString(16).slice(2,6).toUpperCase(); return \\\`SK-\\\${h()}\\\${h()}-\\\${h()}\\\`; }
  function _getCartData() {
    try {
      const raw = localStorage.getItem('sk-cart');
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (Array.isArray(d)) return { id: _genCartId(), expires: Date.now()+SK_TTL, items: d };
      if (d.expires && Date.now() > d.expires) { localStorage.removeItem('sk-cart'); return null; }
      return d;
    } catch { return null; }
  }
  const getCart = () => _getCartData()?.items || [];
  const getCartId = () => _getCartData()?.id || null;
  const saveCart = items => {
    try {
      const ex = _getCartData();
      localStorage.setItem('sk-cart', JSON.stringify({ id: ex?.id || _genCartId(), expires: Date.now()+SK_TTL, items }));
    } catch {}
  };

  function updateNavBadge() {
    const total = getCart().reduce((s,i) => s + i.qty, 0);
    ['navCartBadge','mobileCartBadge'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = String(total); el.classList.toggle('hidden', total === 0); }
    });
  }

  // Leverans: automatisk bil/sl\xE4pvagn beroende p\xE5 om varukorgen har skrymmande produkt
  function cartHasBulky(cart) {
    return cart.some(i => i.bulky === true);
  }
  function calcLev(cart) {
    const hasBulky = cartHasBulky(cart);
    if (hasBulky) {
      return {
        price: FRAKT.leverans.skrymmande.pris,
        label: FRAKT.leverans.skrymmande.label,
        note: FRAKT.leverans.skrymmande.note,
      };
    }
    return {
      price: FRAKT.leverans.standard.pris,
      label: FRAKT.leverans.standard.label,
      note: FRAKT.leverans.standard.note,
    };
  }

  // Montering: 600 kr/tim, min 15 min, baserat p\xE5 monteringMin per produkt \xD7 qty
  // Demontering = monteringMin \xD7 2 (redan inr\xE4knat i totalen)
  function calcMon(cart) {
    const prisPerMin = FRAKT.montering.prisPerTimme / 60;
    const minMin     = FRAKT.montering.minDebiteringMin;
    let totalMin = 0;
    cart.forEach(item => {
      if (item.monteringMin) {
        // montering + demontering (\xD7 2), \xD7 antal
        const minPerItem = item.monteringMin * 2;
        totalMin += Math.max(minMin, minPerItem) * item.qty;
      }
    });
    // Om inget monteringMin finns: schablonbelopp 60 min
    if (totalMin === 0) totalMin = 60;
    return Math.ceil(totalMin * prisPerMin);
  }
  function calcMonLabel(cart) {
    const prisPerMin = FRAKT.montering.prisPerTimme / 60;
    const minMin     = FRAKT.montering.minDebiteringMin;
    let totalMin = 0;
    cart.forEach(item => { if (item.monteringMin) totalMin += Math.max(minMin, item.monteringMin * 2) * item.qty; });
    if (totalMin === 0) totalMin = 60;
    const h = Math.floor(totalMin/60), m = totalMin%60;
    return (h ? h+'h ' : '') + (m ? m+'min ' : '') + '\xD7 ' + FRAKT.montering.prisPerTimme + ' kr/tim';
  }

  // \u2500\u2500 VILLKOR + FORM VALIDATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function checkCanProceed() {
    const villkorOk = document.getElementById('chkVillkor')?.checked;
    const nameOk    = document.getElementById('f-name')?.value.trim().length > 1;
    const emailOk   = document.getElementById('f-email')?.value.includes('@');
    const phoneOk   = document.getElementById('f-phone')?.value.trim().length > 6;
    const ok = villkorOk && nameOk && emailOk && phoneOk;

    const btnEmail = document.getElementById('btnEmail');
    const btnBoka  = document.getElementById('btnBoka');
    const hint     = document.getElementById('villkorHint');

    if (btnEmail) { btnEmail.disabled = !ok; }
    if (btnBoka)  { btnBoka.disabled = !ok; btnBoka.classList.toggle('disabled-btn', !ok); }
    if (hint) hint.classList.toggle('hidden', ok);
  }

  document.getElementById('chkVillkor')?.addEventListener('change', checkCanProceed);
  ['f-name','f-email','f-phone'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', checkCanProceed);
  });

  // \u2500\u2500 RENDER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function renderCart() {
    const cart = getCart();
    const emptyEl   = document.getElementById('cartEmpty');
    const contentEl = document.getElementById('cartContent');
    if (cart.length === 0) {
      emptyEl.style.display = 'flex';
      contentEl.style.display = 'none';
      return;
    }
    emptyEl.style.display = 'none';
    contentEl.style.display = 'block';

    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = cart.map(item => {
      const imgSrc = _getImg(item);
      return \\\`
      <tr data-id="\\\${item.id}" class="cart-row-clickable" title="Klicka f\xF6r mer info">
        <td>
          <div class="cart-product">
            \\\${imgSrc
              ? \\\`<img class="cart-thumb" src="\\\${imgSrc}" alt="\\\${item.name}" loading="lazy" width="72" height="60" onerror="this.style.display='none'">\\\`
              : \\\`<div class="cart-thumb-ph"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>\\\`
            }
            <div class="cart-product-text">
              <div class="cart-pname">\\\${item.name}</div>
              \\\${(item.artno || PROD_ARTNO[item.id]) ? \\\`<div class="cart-partno">\\\${item.artno || PROD_ARTNO[item.id]}</div>\\\` : ''}
              <div class="cart-pcat">\\\${item.category || ''}</div>
              <div class="cart-pnote">\\\${item.priceNote || '/dygn'}</div>
            </div>
          </div>
        </td>
        <td class="td-price">\\\${fmt(item.price)}</td>
        <td class="td-qty">
          <div class="qty-stepper">
            <button class="qty-btn" data-action="dec" data-id="\\\${item.id}">\u2212</button>
            <input class="qty-input" type="text" inputmode="numeric" value="\\\${item.qty}" data-id="\\\${item.id}" readonly />
            <button class="qty-btn" data-action="inc" data-id="\\\${item.id}">+</button>
          </div>
        </td>
        <td class="td-total">\\\${fmt(item.price * item.qty)}</td>
        <td class="td-remove">
          <button class="remove-btn" data-id="\\\${item.id}" aria-label="Ta bort">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </td>
      </tr>
    \\\`}).join('');

    tbody.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = getCart();
        const it = c.find(i => i.id === btn.dataset.id);
        if (!it) return;
        it.qty += btn.dataset.action === 'inc' ? 1 : -1;
        saveCart(c.filter(i => i.qty > 0));
        updateNavBadge(); renderCart(); updateSummary();
      });
    });
    tbody.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCart(getCart().filter(i => i.id !== btn.dataset.id));
        updateNavBadge(); renderCart(); updateSummary();
      });
    });

    // Klick p\xE5 rad \u2192 popup (ej p\xE5 knappar)
    tbody.querySelectorAll('.cart-row-clickable').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('.qty-btn, .remove-btn, .qty-input')) return;
        const id   = row.dataset.id;
        const item = getCart().find(i => i.id === id);
        if (item) openProductModal(item);
      });
    });

    // Uppdatera tj\xE4nstepriser
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    const { price: lp, label: ll, note: ln } = calcLev(cart);
    const mp = calcMon(cart);
    const levEl = document.getElementById('leveransPrice');
    if (levEl) levEl.textContent = fmt(lp);
    const levNote = document.getElementById('leveransNote');
    if (levNote) levNote.textContent = ll + (cartHasBulky(cart) ? ' \u2014 bil med sl\xE4p' : '');
    const monEl = document.getElementById('monteringPrice');
    if (monEl) monEl.textContent = fmt(mp);

    updateSummary();
    checkCanProceed();
  }

  // \u2500\u2500 SUMMARY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function updateSummary() {
    const cart = getCart();
    if (!cart.length) return;
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    let extras = 0;

    const chkLev = document.getElementById('chkLeverans');
    const rowLev = document.getElementById('rowLeverans');
    if (chkLev?.checked) {
      const lp = calcLev(cart).price;
      document.getElementById('summLeverans').textContent = fmt(lp);
      rowLev.style.display = 'flex'; extras += lp;
    } else { if(rowLev) rowLev.style.display = 'none'; }

    const chkMon = document.getElementById('chkMontering');
    const rowMon = document.getElementById('rowMontering');
    if (chkMon?.checked) {
      const mp = calcMon(cart);
      document.getElementById('summMontering').textContent = fmt(mp);
      rowMon.style.display = 'flex'; extras += mp;
    } else { if(rowMon) rowMon.style.display = 'none'; }

    const rowsTillagg = document.getElementById('rowsTillagg');
    rowsTillagg.innerHTML = '';
    document.querySelectorAll('.chk-tillagg:checked').forEach(chk => {
      const pris = Number(chk.dataset.pris);
      const qty  = chk.dataset.qty === 'true'
        ? Number(document.getElementById('qtyval-'+chk.dataset.id)?.textContent || 1) : 1;
      const tot = pris * qty; extras += tot;
      rowsTillagg.insertAdjacentHTML('beforeend',
        \\\`<div class="summ-row"><span>\\\${chk.dataset.label}\\\${qty>1?' \xD7 '+qty:''}</span><span>\\\${fmt(tot)}</span></div>\\\`);
    });

    const FAKTURAAVGIFT = 49;
    const vat = Math.round((subtotal + extras + FAKTURAAVGIFT) * 0.25);
    document.getElementById('cartSubtotal').textContent = fmt(subtotal);
    document.getElementById('cartVat').textContent = fmt(vat);
    document.getElementById('cartTotal').textContent = fmt(subtotal + extras + FAKTURAAVGIFT + vat);
  }

  // Service events
  document.getElementById('chkLeverans')?.addEventListener('change', updateSummary);
  document.getElementById('chkMontering')?.addEventListener('change', updateSummary);
  // Admin leverans-override: uppdatera pris live vid val
  document.getElementById('adminLevType')?.addEventListener('change', updateSummary);
  document.getElementById('adminLevResor')?.addEventListener('change', updateSummary);
  document.querySelectorAll('.chk-tillagg').forEach(chk => {
    chk.addEventListener('change', function() {
      const w = document.getElementById('qty-wrap-'+this.dataset.id);
      if (w) w.classList.toggle('hidden', !this.checked);
      updateSummary();
    });
  });
  document.querySelectorAll('.tqty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const valEl = document.getElementById('qtyval-'+id);
      if (!valEl) return;
      let v = Number(valEl.textContent);
      valEl.textContent = String(btn.classList.contains('tillagg-inc') ? Math.min(20, v+1) : Math.max(1, v-1));
      updateSummary();
    });
  });

  // \u2500\u2500 BYGG ORDER-SAMMANFATTNING \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function buildOrder() {
    const cart = getCart();
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    let extras = 0; const extraLines = [];

    if (document.getElementById('chkLeverans')?.checked) {
      const lp = calcLev(cart).price; extras += lp;
      extraLines.push(\\\`Leverans: \\\${lp.toLocaleString('sv')} kr\\\`);
    }
    if (document.getElementById('chkMontering')?.checked) {
      const mp = calcMon(cart); extras += mp;
      extraLines.push(\\\`Montering & demontering: \\\${mp.toLocaleString('sv')} kr\\\`);
    }
    document.querySelectorAll('.chk-tillagg:checked').forEach(chk => {
      const pris = Number(chk.dataset.pris);
      const qty  = chk.dataset.qty === 'true' ? Number(document.getElementById('qtyval-'+chk.dataset.id)?.textContent||1) : 1;
      const tot  = pris * qty; extras += tot;
      extraLines.push(\\\`\\\${chk.dataset.label}\\\${qty>1?' \xD7 '+qty:''}: \\\${tot.toLocaleString('sv')} kr\\\`);
    });

    const vat = Math.round((subtotal + extras + 49) * 0.25);
    const customer = {
      name:    document.getElementById('f-name')?.value.trim() || '',
      company: document.getElementById('f-company')?.value.trim() || '',
      email:   document.getElementById('f-email')?.value.trim() || '',
      phone:   document.getElementById('f-phone')?.value.trim() || '',
      from:    document.getElementById('f-date-from')?.value || '',
      to:      document.getElementById('f-date-to')?.value || '',
      address: document.getElementById('f-address')?.value.trim() || '',
      notes:   document.getElementById('f-notes')?.value.trim() || '',
    };
    return { cart, subtotal, extras, extraLines, vat, total: subtotal + extras + 49 + vat, customer };
  }

  // \u2500\u2500 EMAIL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function submitOffert(triggerBtn, intent) {
    const { cart, subtotal, extras, extraLines, vat, total, customer } = buildOrder();
    const isBokning = intent === 'boka';

    const prodLines = cart.map(i => \\\`- \\\${i.name} \xD7 \\\${i.qty}  \u2192  \\\${(i.price*i.qty).toLocaleString('sv')} kr\\\`).join('\\\\n');
    const custInfo = [
      \\\`Namn: \\\${customer.name}\\\`,
      customer.company ? \\\`F\xF6retag: \\\${customer.company}\\\` : '',
      \\\`E-post: \\\${customer.email}\\\`,
      \\\`Telefon: \\\${customer.phone}\\\`,
      customer.from ? \\\`Datum fr\xE5n: \\\${customer.from}\\\` : '',
      customer.to ? \\\`Datum till: \\\${customer.to}\\\` : '',
      customer.address ? \\\`Leveransadress: \\\${customer.address}\\\` : '',
      customer.notes ? \\\`\xD6vrig info: \\\${customer.notes}\\\` : '',
    ].filter(Boolean).join('\\\\n');

    const inledning = isBokning
      ? \\\`Hej Scenkonsult!\\\\n\\\\n\u2B50 \xD6NSKAR BOKA \u2014 Kunden vill boka f\xF6ljande utrustning:\\\\n\\\`
      : \\\`Hej Scenkonsult!\\\\n\\\\nOffertf\xF6rfr\xE5gan \u2014 Kunden \xF6nskar prisf\xF6rslag p\xE5:\\\\n\\\`;

    const msgBody =
      inledning + \\\`\\\\n\\\${prodLines}\\\`
      + (extraLines.length ? \\\`\\\\n\\\\nTill\xE4ggstj\xE4nster:\\\\n\\\` + extraLines.map(l=>'- '+l).join('\\\\n') : '')
      + \\\`\\\\n\\\\nProdukter: \\\${subtotal.toLocaleString('sv')} kr exkl. moms\\\`
      + (extras ? \\\`\\\\nTill\xE4gg (estimat): \\\${extras.toLocaleString('sv')} kr\\\` : '')
      + \\\`\\\\nMoms: \\\${vat.toLocaleString('sv')} kr\\\\nTotalt: \\\${total.toLocaleString('sv')} kr inkl. moms\\\`
      + \\\`\\\\n\\\\nObs: Alla frakt- och tj\xE4nstepriser \xE4r estimat och bekr\xE4ftas som en del av orderprocessen.\\\`
      + \\\`\\\\n\\\\n\u2500\u2500 Kontaktuppgifter \u2500\u2500\\\\n\\\${custInfo}\\\`
      + \\\`\\\\n\\\\nMed v\xE4nliga h\xE4lsningar,\\\\n\\\${customer.name}\\\`;

    const origHtml = triggerBtn.innerHTML;
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Skickar\u2026';

    // L\xE5s \xE4ven den andra knappen
    const btnEmail = document.getElementById('btnEmail');
    const btnBoka  = document.getElementById('btnBoka');
    if (btnEmail) btnEmail.disabled = true;
    if (btnBoka)  btnBoka.disabled = true;

    try {
      const resp = await fetch('/.netlify/functions/skicka-offert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, cart, body: msgBody, intent, sendCopy: true, cart_id: getCartId() }),
      });

      const result = await resp.json();

      if (resp.ok && result.ok) {
        window.location.href = '/tack/';
      } else {
        alert(result.error || 'N\xE5got gick fel, f\xF6rs\xF6k igen eller ring oss p\xE5 072-448 10 00.');
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = origHtml;
        if (btnEmail) btnEmail.disabled = false;
        if (btnBoka)  btnBoka.disabled = false;
      }
    } catch (err) {
      alert('N\xE4tverksfel \u2014 f\xF6rs\xF6k igen eller ring 072-448 10 00.');
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = origHtml;
      if (btnEmail) btnEmail.disabled = false;
      if (btnBoka)  btnBoka.disabled = false;
    }
  }

  document.getElementById('btnEmail')?.addEventListener('click', function() { submitOffert(this, 'offert'); });
  document.getElementById('btnBoka')?.addEventListener('click', function() { submitOffert(this, 'boka'); });

  // \u2500\u2500 PDF / PRINT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.getElementById('btnSave')?.addEventListener('click', () => {
    const { cart, subtotal, extras, extraLines, vat, total, customer } = buildOrder();
    const rows = cart.map(i=>\\\`<tr><td>\\\${i.name}</td><td>\\\${i.category}</td><td style="text-align:center">\\\${i.qty}</td><td style="text-align:right">\\\${i.price.toLocaleString('sv')} kr</td><td style="text-align:right">\\\${(i.price*i.qty).toLocaleString('sv')} kr</td></tr>\\\`).join('');
    const extRows = extraLines.map(l=>\\\`<tr><td colspan="4" style="color:#555">\\\${l}</td><td></td></tr>\\\`).join('');
    const custRows = [
      ['Namn', customer.name],
      customer.company ? ['F\xF6retag', customer.company] : null,
      ['E-post', customer.email],
      ['Telefon', customer.phone],
      customer.from ? ['Datum fr\xE5n', customer.from] : null,
      customer.to   ? ['Datum till', customer.to]   : null,
      customer.address ? ['Leveransadress', customer.address] : null,
      customer.notes   ? ['\xD6vrig info', customer.notes] : null,
    ].filter(Boolean).map(([k,v])=>\\\`<tr><td style="color:#666;width:140px">\\\${k}</td><td>\\\${v}</td></tr>\\\`).join('');

    const html=\\\`<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><title>Varukorg \u2013 Scenkonsult</title>
<style>body{font-family:Arial,sans-serif;padding:2rem;color:#111;max-width:750px;margin:0 auto}
h1{color:#1e1850;margin-bottom:.2rem}p.sub{color:#666;font-size:.83rem;margin-bottom:1.5rem}
h2{color:#1e1850;font-size:1rem;margin-top:1.5rem;margin-bottom:.5rem;border-bottom:1px solid #eee;padding-bottom:.3rem}
table{width:100%;border-collapse:collapse;margin-bottom:1rem}
th{background:#1e1850;color:white;padding:.5rem .8rem;text-align:left;font-size:.78rem}
td{padding:.5rem .8rem;border-bottom:1px solid #eee;font-size:.88rem}
.total{font-weight:700;font-size:1.05rem;color:#1e1850;text-align:right}
.footer{font-size:.75rem;color:#999;border-top:1px solid #eee;padding-top:.8rem;margin-top:1.5rem}</style></head>
<body>
<h1>Scenkonsult \u2013 Offertunderlag</h1>
<p class="sub">Genererat \\\${new Date().toLocaleDateString('sv')} | \\\${atob('aW5mb0BzY2Vua29uc3VsdC5zZQ==')} | \\\${atob('MDcyNDQ4MTAwMA==').replace(/(\\\\d{3})(\\\\d{3})(\\\\d{2})(\\\\d{2})/, '$1-$2 $3 $4')}</p>
<h2>Produkter</h2>
<table><thead><tr><th>Produkt</th><th>Kategori</th><th>Antal</th><th>Styckpris</th><th>Totalt</th></tr></thead>
<tbody>\\\${rows}\\\${extRows}</tbody></table>
<p>Produkter exkl. moms: <strong>\\\${subtotal.toLocaleString('sv')} kr</strong></p>
\\\${extras?\\\`<p>Till\xE4gg: \\\${extras.toLocaleString('sv')} kr</p>\\\`:''}
<p>Moms 25%: \\\${vat.toLocaleString('sv')} kr</p>
<p class="total">Totalt inkl. moms: \\\${total.toLocaleString('sv')} kr</p>
\\\${custRows ? \\\`<h2>Kontaktuppgifter</h2><table><tbody>\\\${custRows}</tbody></table>\\\` : ''}
<p class="footer">Alla priser avser hyra per dygn (22 h). Kontakta oss f\xF6r slutlig bekr\xE4ftelse och bokning.<br><strong>Obs: Alla frakt- och tj\xE4nstepriser \xE4r estimat och bekr\xE4ftas som en del av orderprocessen.</strong></p>
</body></html>\\\`;
    const w=window.open('','_blank');
    if(w){w.document.write(html);w.document.close();w.focus();w.print();}
  });

  // \u2500\u2500 T\xD6MT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.getElementById('btnClear')?.addEventListener('click', () => {
    if (confirm('T\xF6m hela varukorgen?')) {
      localStorage.removeItem('sk-cart');
      updateNavBadge(); renderCart();
    }
  });

  // \u2500\u2500 URL-PARAM CART LOADING (admin-skickad offert) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function loadCartFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const cartParam  = params.get('cart');
    const tokenParam = params.get('token');
    if (!cartParam || !tokenParam) return;

    // Kontrollera att det inte redan \xE4r r\xE4tt cart i localStorage
    const existing = _getCartData();
    if (existing?.id === cartParam && (existing?.items?.length || 0) > 0) return;

    try {
      const res  = await fetch(\\\`/.netlify/functions/cart-get?token=\\\${encodeURIComponent(tokenParam)}\\\`);
      const data = await res.json();
      if (!res.ok || !data.cart) return;

      const c = data.cart;
      // Filtrera bort _note-items (anm\xE4rkningar) och s\xE4tt format som varukorgssidan f\xF6rst\xE5r
      const items = (c.items || [])
        .filter(i => !i._note && i.name)
        .map(i => ({
          id:       i.id || ('adm-' + Math.random().toString(36).slice(2,8)),
          name:     i.name,
          price:    i.price || 0,
          qty:      i.qty || i.quantity || 1,
          category: i.category || '',
          priceNote: '',
        }));

      if (items.length > 0) {
        localStorage.setItem('sk-cart', JSON.stringify({
          id:      cartParam,
          expires: Date.now() + SK_TTL,
          items
        }));
        renderCart();
        updateNavBadge();
        updateSummary();
      }
    } catch (e) { /* tyst fel \u2014 forts\xE4tt med tom varukorg */ }
  }

  // \u2500\u2500 INIT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  loadCartFromUrl().then(() => {
    renderCart();
    updateNavBadge();
    checkCanProceed();
  });
})();<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": "Varukorg \u2013 Scenkonsult", "description": "Granska din varukorg och skicka en f\xF6rfr\xE5gan till Scenkonsult." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="cart-page"> <div class="cart-wrap"> <div class="cart-header"> <h1>Din varukorg</h1> <p class="cart-subtitle">Lägg till produkter via produktsidorna, sedan skickar du en förfrågan direkt.</p> </div> <!-- EMPTY STATE --> <div id="cartEmpty" class="cart-empty"> <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <p>Varukorgen är tom.</p> <a href="/#tjanster" class="cart-empty-cta">Se alla tjänster →</a> </div> <!-- CART CONTENT --> <div id="cartContent" style="display:none"> <!-- PRODUKTLÄGG-TILL-VÄLJARE --> <div class="prod-picker-wrap"> <div class="prod-picker-header">Lägg till produkter</div> <div class="prod-picker-row" id="prod-picker-row"> <div> <label class="prod-picker-label">Kategori</label> <select id="pp-cat" class="prod-picker-sel"> <option value="">— välj kategori —</option> </select> </div> <div id="pp-sub-wrap" style="display:none"> <label class="prod-picker-label">Underkategori</label> <select id="pp-sub" class="prod-picker-sel"> <option value="">— välj —</option> </select> </div> <div> <label class="prod-picker-label">Produkt</label> <select id="pp-prod" class="prod-picker-sel"> <option value="">— välj kategori —</option> </select> </div> <button id="pp-add-btn" class="prod-picker-btn">＋ Lägg till</button> </div> </div> <!-- PRODUKTTABELL --> <div class="cart-table-wrap"> <table class="cart-table"> <thead> <tr> <th class="th-product">Produkt</th> <th class="th-price">Pris</th> <th class="th-qty">Antal</th> <th class="th-total">Totalt</th> <th class="th-remove"></th> </tr> </thead> <tbody id="cartTableBody"></tbody> </table> </div> <!-- TILLÄGGSTJÄNSTER --> <div class="services-wrap"> <div class="services-header">Tilläggstjänster</div> <!-- Leverans --> <label class="service-row"> <input type="checkbox" id="chkLeverans" class="sr-only"> <div class="service-check" id="checkLeverans"></div> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"> <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon> <circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle> </svg> <div class="service-info"> <span class="service-label">${frakt.leverans.label}</span> <span class="service-desc">${frakt.leverans.description}</span> <span class="service-note" id="leveransNote">${frakt.leverans.zon}</span> </div> <span class="service-price" id="leveransPrice">– kr</span> </label> <!-- Montering --> <label class="service-row"> <input type="checkbox" id="chkMontering" class="sr-only"> <div class="service-check"></div> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"> <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path> </svg> <div class="service-info"> <span class="service-label">${frakt.montering.label}</span> <span class="service-desc">${frakt.montering.description}</span> <span class="service-note">${frakt.montering.note}</span> </div> <span class="service-price" id="monteringPrice">– kr</span> </label> <!-- Extra tillägg från frakt.json --> ${frakt.tillagg.map((t) => renderTemplate`<label class="service-row"${addAttribute(t.id, "data-tillagg-id")}> <input type="checkbox" class="sr-only chk-tillagg"${addAttribute(t.id, "data-id")}${addAttribute(t.pris, "data-pris")}${addAttribute(t.label, "data-label")}${addAttribute(t.enhet, "data-enhet")}${addAttribute(t.qty ? "true" : "false", "data-qty")}> <div class="service-check"></div> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"> <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line> </svg> <div class="service-info"> <span class="service-label">${t.label}</span> <span class="service-desc">${t.description}</span> </div> <div class="service-price-right"> ${t.qty && renderTemplate`<div class="tillagg-qty hidden"${addAttribute(`qty-wrap-${t.id}`, "id")}> <button type="button" class="tqty-btn tillagg-dec"${addAttribute(t.id, "data-id")}>−</button> <span class="tqty-val"${addAttribute(`qtyval-${t.id}`, "id")}>1</span> <button type="button" class="tqty-btn tillagg-inc"${addAttribute(t.id, "data-id")}>+</button> </div>`} <span class="service-price">${t.pris.toLocaleString("sv")} kr<span class="service-enhet">${t.enhet}</span></span> </div> </label>`)} </div> <!-- SUMMERING --> <div class="cart-summary"> <div class="summ-row"><span>Produkter (exkl. moms)</span><span id="cartSubtotal">–</span></div> <div class="summ-row" id="rowLeverans" style="display:none"><span>Leverans</span><span id="summLeverans">–</span></div> <div class="summ-row" id="rowMontering" style="display:none"><span>Montering & demontering</span><span id="summMontering">–</span></div> <div id="rowsTillagg"></div> <div class="summ-row muted"><span>Fakturaavgift</span><span>49 kr</span></div> <div class="summ-row muted"><span>Moms 25%</span><span id="cartVat">–</span></div> <div class="summ-row total"><span>Totalt (inkl. moms)</span><span id="cartTotal">–</span></div> <p class="summ-note">* Priser avser hyra per dygn (22 h). Slutlig faktura bekräftas vid bokning.</p> <p class="summ-note summ-note-estimate">⚠ Alla frakt- och tjänstepriser är estimat och bekräftas som en del av orderprocessen.</p> </div> <!-- KUNDUPPGIFTER --> <div class="customer-wrap"> <div class="customer-header">Dina uppgifter</div> <div class="customer-grid"> <div class="field-group"> <label class="field-label" for="f-name">Namn *</label> <input type="text" id="f-name" class="field-input" placeholder="För- och efternamn" autocomplete="name"> </div> <div class="field-group"> <label class="field-label" for="f-company">Företag</label> <input type="text" id="f-company" class="field-input" placeholder="Företagsnamn (valfritt)" autocomplete="organization"> </div> <div class="field-group"> <label class="field-label" for="f-email">E-post *</label> <input type="email" id="f-email" class="field-input" placeholder="din@epost.se" autocomplete="email"> </div> <div class="field-group"> <label class="field-label" for="f-phone">Telefon *</label> <input type="tel" id="f-phone" class="field-input" placeholder="070 000 00 00" autocomplete="tel"> </div> <div class="field-group"> <label class="field-label" for="f-date-from">Önskat datum, från *</label> <input type="date" id="f-date-from" class="field-input"> </div> <div class="field-group"> <label class="field-label" for="f-date-to">Önskat datum, till *</label> <input type="date" id="f-date-to" class="field-input"> </div> <div class="field-group field-full"> <label class="field-label" for="f-address">Leveransadress</label> <input type="text" id="f-address" class="field-input" placeholder="Gatuadress, postnummer, stad" autocomplete="street-address"> </div> <div class="field-group field-full"> <label class="field-label" for="f-notes">Övrig information</label> <textarea id="f-notes" class="field-input field-textarea" placeholder="Beskriv eventet, önskemål, antal gäster, lokalbeskrivning…" rows="4"></textarea> </div> </div> </div> <!-- HYRESVILLKOR --> <label class="villkor-row" id="villkorRow"> <input type="checkbox" id="chkVillkor" class="sr-only"> <div class="service-check villkor-check"></div> <span class="villkor-text">
Jag har läst och godkänner
<a href="/hyresvillkor/" target="_blank" class="villkor-link">hyresvillkoren ↗</a> </span> </label> <!-- ACTIONS --> <div class="cart-actions"> <button id="btnEmail" class="cart-btn primary" disabled> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 7L2 7"></path></svg>
Maila offertförfrågan
</button> <button id="btnSave" class="cart-btn secondary"> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
Spara som PDF
</button> <button id="btnBoka" class="cart-btn accent disabled-btn" aria-disabled="true" disabled> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><polyline points="12 5 19 12 12 19"></polyline></svg>
Boka detta nu
</button> <button id="btnClear" class="cart-btn ghost">Töm varukorg</button> </div> <p class="villkor-hint hidden" id="villkorHint">Vänligen godkänn hyresvillkoren och fyll i namn, e-post och telefon för att fortsätta.</p> </div><!-- /cartContent --> </div> </section> ` }), defineScriptVars({ fraktRules }));
}, "/home/claude/scenkonsult-astro/src/pages/varukorg/index.astro", void 0);

const $$file = "/home/claude/scenkonsult-astro/src/pages/varukorg/index.astro";
const $$url = "/varukorg/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
