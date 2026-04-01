import"./hoisted.DlaBVMPR.js";const b={open:{icon:"📬",label:"Förfrågan mottagen",desc:"Vi har tagit emot din förfrågan och återkommer inom kort.",cls:"s-open"},proposal:{icon:"📤",label:"Offert skickad",desc:"Vi har skickat ett offert — se produkter och priser nedan.",cls:"s-proposal"},waiting:{icon:"⏳",label:"Offert klar",desc:"Offerten är klar — granska detaljerna nedan och hör av dig om du har frågor.",cls:"s-waiting"},confirmed:{icon:"✅",label:"Order bekräftad",desc:"Ordern är bekräftad av Scenkonsult Norden.",cls:"s-confirmed"},fakturerad:{icon:"🧾",label:"Faktura skickad",desc:"En faktura har skickats till din e-post. Välkommen på eventet!",cls:"s-fakturerad"},betald:{icon:"💚",label:"Betald — klart!",desc:"Tack! Betalning mottagen. Vi ses på eventet!",cls:"s-betald"},cancelled:{icon:"❌",label:"Avbruten",desc:"Den här ordern är avbruten. Kontakta oss om du har frågor.",cls:"s-cancelled"}},i=e=>typeof e=="number"?e.toLocaleString("sv-SE"):"–",g=e=>e?new Date(e).toLocaleDateString("sv-SE",{year:"numeric",month:"long",day:"numeric"}):null,v=e=>e?new Date(e).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short"}):"",y={small:"/images/scen/pp_small.png","small-plus":"/images/scen/pp_small_plus.png","small-plusplus":"/images/scen/pp_small_pp.png",medium:"/images/scen/pp_medium.png","medium-plus":"/images/scen/pp_medium_plus.png","medium-plus-tak":"/images/scen/pp_medium_plus_tak.png","medium-plusplus":"/images/scen/pp_medium_pp.png",large:"/images/scen/pp_large.png","large-plus":"/images/scen/pp_large_plus.png","large-plus-tak":"/images/scen/pp_large_plus_tak.png",xl:"/images/scen/pp_xl.png","xl-plus":"/images/scen/pp_xl_plus.png","event-small":"/images/ljud/pp_ljud_event_small.png","event-small-plus":"/images/ljud/pp_ljud_event_small-.png","event-medium":"/images/ljud/pp_ljud_event_medium.png","event-medium-plus":"/images/ljud/pp_ljud_event_medium-.png","event-large":"/images/ljud/pp_ljud_event_large.png","portable-small":"/images/ljud/pp_ljud_portable_small.png","portable-medium":"/images/ljud/pp_ljud_portable_medium.png","portable-medium-plus":"/images/ljud/pp_ljud_portable_medium_.png","portable-large":"/images/ljud/pp_ljud_portable_large.png","music-small":"/images/ljud/pp_ljud_music_small.png","music-small-plus":"/images/ljud/pp_ljud_music_small-.png","music-medium":"/images/ljud/pp_ljud_music_medium.png","music-large":"/images/ljud/pp_ljud_music_large.png","live-small":"/images/ljud/pp_ljud_live_small.png","live-medium":"/images/ljud/pp_ljud_live_medium.png","live-large":"/images/ljud/pp_ljud_live_large.png","mixer-2-2":"/images/ljud/pp_ljud_mixer01.png","mixer-4-2":"/images/ljud/pp_ljud_mixer02.png","mixer-4-4":"/images/ljud/pp_ljud_mixer03.png","mixer-12-4":"/images/ljud/pp_ljud_mixer05.png","dj-controller-numark":"/images/dj/pp_DJ_small.png","dj-controller-denon-go":"/images/dj/pp_DJ_denon_go_plus.png","dj-controller-denon-prime4":"/images/dj/pp_DJ_large1.png","dj-rane-system-one":"/images/dj/pp_DJ_large2.png","dj-bord":"/images/dj/pp_DJ_bord.png","projektor-xga":"/images/bild/pp_bild_projektor.png","projektor-fhd":"/images/bild/pp_bild_projektor1.png","skarm-65":"/images/bild/pp_bild_65-skarm.png","skarm-75":"/images/bild/pp_bild_75-skarm.png","stativ-400":"/images/ljus/pp_ljus_stativ06.png","stativ-1200":"/images/ljus/pp_ljus_stativ_1200.png","tross-1m":"/images/ljus/pp_ljus_tross01.png","ljus-small":"/images/ljus/pp_ljus_small.png","ljus-small-plus":"/images/ljus/pp_ljus_small-.png","ljus-small-pp":"/images/ljus/pp_ljus_small--.png","ljus-medium":"/images/ljus/pp_ljus_medium.png","ljus-medium-plus":"/images/ljus/pp_ljus_medium_plus.png","ljus-medium-pp":"/images/ljus/pp_ljus_medium_plusplus.png","ljus-large":"/images/ljus/pp_ljus_large.png","ljus-large-plus":"/images/ljus/pp_ljus_large_plus.png","ljus-large-pp":"/images/ljus/pp_ljus_large_plusplus.png","rokmaskin-1500":"/images/ljus/pp_ljus_rokmaskin.png","rokmaskin-650":"/images/ljus/pp_ljus_rokmaskin650.png","led-par":"/images/ljus/pp_ljus_effekt19.png","led-par-9":"/images/ljus/pp_ljus_effekt26.png","led-par-uv":"/images/ljus/pp_ljus_effekt21.png","led-par-xl":"/images/ljus/pp_ljus_par-xl.png","led-uppladdningsbar":"/images/ljus/pp_ljus_effekt22.png"};let p=null,m=null,d=[];function o(e){["stateLoading","stateError","stateOrder"].forEach(s=>{document.getElementById(s).classList.toggle("active",s===e)})}async function x(){const e=new URLSearchParams(location.search);if(p=e.get("cart"),m=e.get("token"),!p||!m){o("stateError");return}try{const s=await fetch(`/.netlify/functions/cart-get?id=${p}&token=${m}`),t=await s.json();if(!s.ok){o("stateError");return}E(t.cart),d=t.messages||[],k(),o("stateOrder")}catch{o("stateError")}}function E(e){document.getElementById("orderId").textContent=e.id,document.getElementById("orderTitle").textContent=`Hej ${e.customer_name?.split(" ")[0]||"där"}!`,document.getElementById("orderSubtitle").textContent=e.event_date?`Order för event ${g(e.event_date)}${e.event_location?" · "+e.event_location:""}`:"Här kan du följa status på din order och skicka meddelanden till oss.";const s=b[e.status]||b.open,t=document.getElementById("statusBanner");t.className=`status-banner ${s.cls}`,document.getElementById("statusIcon").textContent=s.icon,document.getElementById("statusLabel").textContent=s.label,document.getElementById("statusDesc").textContent=s.desc;const n=document.getElementById("statusCta");n.innerHTML="",n.style.display="none",t.style.borderRadius="",e.confirmed_at?(t.style.borderRadius="12px 12px 0 0",n.style.display="",n.innerHTML=`
      <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:10px">
        <span style="font-size:1.4rem">✅</span>
        <div>
          <div style="color:rgba(255,255,255,0.9);font-size:0.9rem;font-weight:600">Digitalt bekräftad</div>
          <div style="color:rgba(255,255,255,0.5);font-size:0.8rem">Du godkände denna order ${v(e.confirmed_at)}</div>
        </div>
      </div>`):e.status==="confirmed"||e.status==="waiting"?(t.style.borderRadius="12px 12px 0 0",n.style.display="",n.innerHTML=$(e)):(e.status==="proposal"||e.status==="open")&&(t.style.borderRadius="12px 12px 0 0",n.style.display="",n.innerHTML=`
      <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08);">
        <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin:0;">Vi ser över din förfrågan och återkommer med en offert. Frågor? Ring oss på
          <a href="tel:0724481000" style="color:#c4b5f4;">072-448 10 00</a>.
        </p>
      </div>`),window._currentCart=e;const a=[];e.event_date&&a.push(["Datum",g(e.event_date)]),e.event_location&&a.push(["Plats",e.event_location]),e.customer_phone&&a.push(["Telefon",e.customer_phone]),e.customer_email&&a.push(["E-post",e.customer_email]),a.length>0&&(document.getElementById("sectionEvent").style.display="",document.getElementById("eventGrid").innerHTML=a.map(([l,r])=>`<div class="info-field"><div class="info-label">${l}</div><div class="info-value">${r}</div></div>`).join(""));const u=e.items||[],c=u.filter(l=>!l._note),_=u.find(l=>l._note),f=c.reduce((l,r)=>l+(r.price||0)*(r.qty||r.quantity||1),0);document.getElementById("prodTableBody").innerHTML=c.map(l=>{const r=l.qty||l.quantity||1,j=y[l.id]||y[(l.id||"").replace(/^(scen-|ljud-|ljus-|dj-utr-)/,"")]||null;return`<tr>
      <td style="padding:0.5rem 0.5rem 0.5rem 0.75rem;vertical-align:middle">${j?`<img src="${j}" alt="${l.name||""}" class="prod-thumb" loading="lazy" onerror="this.parentNode.innerHTML='<div class=prod-thumb-ph>📦</div>'">`:'<div class="prod-thumb-ph">📦</div>'}</td>
      <td><div class="prod-name">${l.name||"–"}</div>${l.category?`<div class="prod-cat">${l.category}</div>`:""}</td>
      <td style="text-align:center">${r}</td>
      <td style="text-align:right">${i(l.price)} kr</td>
      <td style="text-align:right" class="prod-total">${i((l.price||0)*r)} kr</td>
    </tr>`}).join("")+(_?`<tr class="prod-note-row"><td colspan="5">📝 ${_.name}</td></tr>`:""),document.getElementById("prodTableFoot").innerHTML=`
    <tr class="total-row">
      <td></td>
      <td colspan="2">Totalt exkl. moms</td>
      <td></td>
      <td style="text-align:right" class="grand-total">${i(f)} kr</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2" style="color:rgba(255,255,255,0.3);font-size:0.82rem">Inkl. 25% moms</td>
      <td></td>
      <td style="text-align:right;color:rgba(255,255,255,0.4);font-size:0.85rem">${i(Math.round(f*1.25))} kr</td>
    </tr>`}function k(){const e=document.getElementById("chatMessages"),s=d.filter(n=>n.sender==="admin"&&!n.read_at),t=document.getElementById("unreadBadge");if(s.length>0?(t.style.display="inline",t.textContent=`${s.length} ny${s.length>1?"a":"t"}`):t.style.display="none",d.length===0){e.innerHTML='<div class="chat-empty">Inga meddelanden ännu. Hör gärna av dig om du har frågor!</div>';return}e.innerHTML=d.map(n=>`
    <div class="msg-wrap ${n.sender}">
      <div class="msg-sender-label">${n.sender==="admin"?"🎭 Scenkonsult Norden":"👤 Du"}</div>
      <div class="msg-bubble">${n.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:#c4b5f4">$1</a>')}</div>
      <div class="msg-meta">${v(n.created_at)}</div>
    </div>`).join(""),setTimeout(()=>e.scrollTop=e.scrollHeight,50)}function $(e){const s=(e.items||[]).filter(t=>!t._note).reduce((t,n)=>t+(n.price||0)*(n.qty||1),0);return`
    <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08)">
      <div style="color:rgba(255,255,255,0.9);font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">
        Bekräfta din order
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem;margin-bottom:1rem;font-size:0.85rem;color:rgba(255,255,255,0.7);line-height:1.6">
        Ordern avser <strong style="color:#fff">${e.items?.filter(t=>!t._note).length||0} produkter</strong>
        ${e.event_date?` för event <strong style="color:#fff">${g(e.event_date)}</strong>`:""}
        ${e.event_location?` i <strong style="color:#fff">${e.event_location}</strong>`:""}.
        Totalt <strong style="color:#c4b5f4">${Math.round(s*1.25).toLocaleString("sv-SE")} kr inkl. moms</strong>.
      </div>
      <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;margin-bottom:1rem">
        <input type="checkbox" id="confirm-tos" onchange="document.getElementById('confirm-btn').disabled=!this.checked"
          style="margin-top:2px;accent-color:#c4b5f4;width:16px;height:16px;flex-shrink:0">
        <span style="color:rgba(255,255,255,0.7);font-size:0.85rem;line-height:1.5">
          Jag har läst och godkänner
          <a href="/hyresvillkor/" target="_blank" style="color:#c4b5f4">Scenkonsult Nordens allmänna hyresvillkor §1–§15</a>
          och bekräftar denna order.
        </span>
      </label>
      <button id="confirm-btn" disabled onclick="confirmOrder()"
        style="width:100%;padding:0.875rem;background:#c4b5f4;color:#0c0a24;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;transition:opacity .2s;font-family:inherit">
        ✅ Bekräfta order
      </button>
      <p style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:0.75rem;text-align:center">
        Din bekräftelse loggas med tidsstämpel och IP-adress som bindande avtal.
      </p>
    </div>`}async function h(){const e=document.getElementById("chatInput"),s=document.getElementById("chatSendBtn"),t=e?.value.trim();if(t){s.disabled=!0,s.textContent="Skickar…";try{const n=await fetch("/.netlify/functions/cart-message",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cart_id:p,token:m,body:t})}),a=await n.json();n.ok?(d.push({id:a.message?.id||Date.now(),sender:"customer",body:t,read_at:null,created_at:new Date().toISOString()}),e.value="",k()):alert(a.error||"Kunde inte skicka meddelandet. Försök igen.")}catch{alert("Nätverksfel — kontrollera din anslutning och försök igen.")}s.disabled=!1,s.textContent="Skicka meddelande →"}}document.getElementById("chatSendBtn").addEventListener("click",h);document.getElementById("chatInput").addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&h()});x();
