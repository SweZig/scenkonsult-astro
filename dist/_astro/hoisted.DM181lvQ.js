import"./hoisted.DlaBVMPR.js";const b={open:{icon:"📬",label:"Förfrågan mottagen",desc:"Vi har tagit emot din förfrågan och återkommer inom kort.",cls:"s-open"},proposal:{icon:"📤",label:"Offert skickad",desc:"Vi har skickat ett offert — se produkter och priser nedan.",cls:"s-proposal"},waiting:{icon:"⏳",label:"Offert klar",desc:"Offerten är klar — granska detaljerna nedan och hör av dig om du har frågor.",cls:"s-waiting"},confirmed:{icon:"✅",label:"Order bekräftad",desc:"Ordern är bekräftad av Scenkonsult Norden.",cls:"s-confirmed"},fakturerad:{icon:"🧾",label:"Faktura skickad",desc:"En faktura har skickats till din e-post. Välkommen på eventet!",cls:"s-fakturerad"},betald:{icon:"💚",label:"Betald — klart!",desc:"Tack! Betalning mottagen. Vi ses på eventet!",cls:"s-betald"},cancelled:{icon:"❌",label:"Avbruten",desc:"Den här ordern är avbruten. Kontakta oss om du har frågor.",cls:"s-cancelled"}},m=e=>typeof e=="number"?e.toLocaleString("sv-SE"):"–",u=e=>e?new Date(e).toLocaleDateString("sv-SE",{year:"numeric",month:"long",day:"numeric"}):null,v=e=>e?new Date(e).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short"}):"",k={small:"/images/scen/pp_small.png","small-plus":"/images/scen/pp_small_plus.png","small-plusplus":"/images/scen/pp_small_pp.png",medium:"/images/scen/pp_medium.png","medium-plus":"/images/scen/pp_medium_plus.png","medium-plus-tak":"/images/scen/pp_medium_plus_tak.png","medium-plusplus":"/images/scen/pp_medium_pp.png",large:"/images/scen/pp_large.png","large-plus":"/images/scen/pp_large_plus.png","large-plus-tak":"/images/scen/pp_large_plus_tak.png",xl:"/images/scen/pp_xl.png","xl-plus":"/images/scen/pp_xl_plus.png","event-small":"/images/ljud/pp_ljud_event_small.png","event-small-plus":"/images/ljud/pp_ljud_event_small-.png","event-medium":"/images/ljud/pp_ljud_event_medium.png","event-medium-plus":"/images/ljud/pp_ljud_event_medium-.png","event-large":"/images/ljud/pp_ljud_event_large.png","portable-small":"/images/ljud/pp_ljud_portable_small.png","portable-medium":"/images/ljud/pp_ljud_portable_medium.png","portable-medium-plus":"/images/ljud/pp_ljud_portable_medium_.png","portable-large":"/images/ljud/pp_ljud_portable_large.png","music-small":"/images/ljud/pp_ljud_music_small.png","music-small-plus":"/images/ljud/pp_ljud_music_small-.png","music-medium":"/images/ljud/pp_ljud_music_medium.png","music-large":"/images/ljud/pp_ljud_music_large.png","live-small":"/images/ljud/pp_ljud_live_small.png","live-medium":"/images/ljud/pp_ljud_live_medium.png","live-large":"/images/ljud/pp_ljud_live_large.png","mixer-2-2":"/images/ljud/pp_ljud_mixer01.png","mixer-4-2":"/images/ljud/pp_ljud_mixer02.png","mixer-4-4":"/images/ljud/pp_ljud_mixer03.png","mixer-12-4":"/images/ljud/pp_ljud_mixer05.png","dj-controller-numark":"/images/dj/pp_DJ_small.png","dj-controller-denon-go":"/images/dj/pp_DJ_denon_go_plus.png","dj-controller-denon-prime4":"/images/dj/pp_DJ_large1.png","dj-rane-system-one":"/images/dj/pp_DJ_large2.png","dj-bord":"/images/dj/pp_DJ_bord.png","projektor-xga":"/images/bild/pp_bild_projektor.png","projektor-fhd":"/images/bild/pp_bild_projektor1.png","skarm-65":"/images/bild/pp_bild_65-skarm.png","skarm-75":"/images/bild/pp_bild_75-skarm.png","stativ-400":"/images/ljus/pp_ljus_stativ06.png","stativ-1200":"/images/ljus/pp_ljus_stativ_1200.png","tross-1m":"/images/ljus/pp_ljus_tross01.png","ljus-small":"/images/ljus/pp_ljus_small.png","ljus-small-plus":"/images/ljus/pp_ljus_small-.png","ljus-small-pp":"/images/ljus/pp_ljus_small--.png","ljus-medium":"/images/ljus/pp_ljus_medium.png","ljus-medium-plus":"/images/ljus/pp_ljus_medium_plus.png","ljus-medium-pp":"/images/ljus/pp_ljus_medium_plusplus.png","ljus-large":"/images/ljus/pp_ljus_large.png","ljus-large-plus":"/images/ljus/pp_ljus_large_plus.png","ljus-large-pp":"/images/ljus/pp_ljus_large_plusplus.png","rokmaskin-1500":"/images/ljus/pp_ljus_rokmaskin.png","rokmaskin-650":"/images/ljus/pp_ljus_rokmaskin650.png","led-par":"/images/ljus/pp_ljus_effekt19.png","led-par-9":"/images/ljus/pp_ljus_effekt26.png","led-par-uv":"/images/ljus/pp_ljus_effekt21.png","led-par-xl":"/images/ljus/pp_ljus_par-xl.png","led-uppladdningsbar":"/images/ljus/pp_ljus_effekt22.png"};let i=null,o=null,d=[];function g(e){["stateLoading","stateError","stateOrder"].forEach(n=>{document.getElementById(n).classList.toggle("active",n===e)})}async function x(){const e=new URLSearchParams(location.search);if(i=e.get("cart"),o=e.get("token"),!i||!o){g("stateError");return}try{const n=await fetch(`/.netlify/functions/cart-get?id=${i}&token=${o}`),s=await n.json();if(!n.ok){g("stateError");return}E(s.cart),d=s.messages||[],j(),g("stateOrder")}catch{g("stateError")}}function E(e){document.getElementById("orderId").textContent=e.id,document.getElementById("orderTitle").textContent=`Hej ${e.customer_name?.split(" ")[0]||"där"}!`,document.getElementById("orderSubtitle").textContent=e.event_date?`Order för event ${u(e.event_date)}${e.event_location?" · "+e.event_location:""}`:"Här kan du följa status på din order och skicka meddelanden till oss.";const n=b[e.status]||b.open,s=document.getElementById("statusBanner");s.className=`status-banner ${n.cls}`,document.getElementById("statusIcon").textContent=n.icon,document.getElementById("statusLabel").textContent=n.label,document.getElementById("statusDesc").textContent=n.desc;const t=document.getElementById("statusCta");t.innerHTML="",t.style.display="none",s.style.borderRadius="",e.confirmed_at?(s.style.borderRadius="12px 12px 0 0",t.style.display="",t.innerHTML=`
      <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:10px">
        <span style="font-size:1.4rem">✅</span>
        <div>
          <div style="color:rgba(255,255,255,0.9);font-size:0.9rem;font-weight:600">Digitalt bekräftad</div>
          <div style="color:rgba(255,255,255,0.5);font-size:0.8rem">Du godkände denna order ${v(e.confirmed_at)}</div>
        </div>
      </div>`):e.status==="confirmed"||e.status==="waiting"?(s.style.borderRadius="12px 12px 0 0",t.style.display="",t.innerHTML=$(e)):(e.status==="proposal"||e.status==="open")&&(s.style.borderRadius="12px 12px 0 0",t.style.display="",t.innerHTML=`
      <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08);">
        <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin:0;">Vi ser över din förfrågan och återkommer med en offert. Frågor? Ring oss på
          <a href="tel:0724481000" style="color:#c4b5f4;">072-448 10 00</a>.
        </p>
      </div>`),window._currentCart=e;const a=[];e.event_date&&a.push(["Datum",u(e.event_date)]),e.event_location&&a.push(["Plats",e.event_location]),e.customer_phone&&a.push(["Telefon",e.customer_phone]),e.customer_email&&a.push(["E-post",e.customer_email]),a.length>0&&(document.getElementById("sectionEvent").style.display="",document.getElementById("eventGrid").innerHTML=a.map(([l,r])=>`<div class="info-field"><div class="info-label">${l}</div><div class="info-value">${r}</div></div>`).join(""));const p=e.items||[],c=p.filter(l=>!l._note),_=p.find(l=>l._note),f=c.reduce((l,r)=>l+(r.price||0)*(r.qty||r.quantity||1),0);document.getElementById("prodTableBody").innerHTML=c.map(l=>{const r=l.qty||l.quantity||1,y=k[l.id]||k[(l.id||"").replace(/^(scen-|ljud-|ljus-|dj-utr-)/,"")]||null;return`<tr>
      <td style="padding:0.5rem 0.5rem 0.5rem 0.75rem;vertical-align:middle">${y?`<img src="${y}" alt="${l.name||""}" class="prod-thumb" loading="lazy" onerror="this.parentNode.innerHTML='<div class=prod-thumb-ph>📦</div>'">`:'<div class="prod-thumb-ph">📦</div>'}</td>
      <td><div class="prod-name">${l.name||"–"}</div>${l.category?`<div class="prod-cat">${l.category}</div>`:""}</td>
      <td style="text-align:center">${r}</td>
      <td style="text-align:right">${m(l.price)} kr</td>
      <td style="text-align:right" class="prod-total">${m((l.price||0)*r)} kr</td>
    </tr>`}).join("")+(_?`<tr class="prod-note-row"><td colspan="5">📝 ${_.name}</td></tr>`:""),document.getElementById("prodTableFoot").innerHTML=`
    <tr class="total-row">
      <td></td>
      <td colspan="2">Totalt exkl. moms</td>
      <td></td>
      <td style="text-align:right" class="grand-total">${m(f)} kr</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2" style="color:rgba(255,255,255,0.3);font-size:0.82rem">Inkl. 25% moms</td>
      <td></td>
      <td style="text-align:right;color:rgba(255,255,255,0.4);font-size:0.85rem">${m(Math.round(f*1.25))} kr</td>
    </tr>`}function j(){const e=document.getElementById("chatMessages"),n=d.filter(t=>t.sender==="admin"&&!t.read_at),s=document.getElementById("unreadBadge");if(n.length>0?(s.style.display="inline",s.textContent=`${n.length} ny${n.length>1?"a":"t"}`):s.style.display="none",d.length===0){e.innerHTML='<div class="chat-empty">Inga meddelanden ännu. Hör gärna av dig om du har frågor!</div>';return}e.innerHTML=d.map(t=>`
    <div class="msg-wrap ${t.sender}">
      <div class="msg-sender-label">${t.sender==="admin"?"🎭 Scenkonsult Norden":"👤 Du"}</div>
      <div class="msg-bubble">${t.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:#c4b5f4">$1</a>')}</div>
      <div class="msg-meta">${v(t.created_at)}</div>
    </div>`).join(""),setTimeout(()=>e.scrollTop=e.scrollHeight,50)}function $(e){const n=(e.items||[]).filter(s=>!s._note).reduce((s,t)=>s+(t.price||0)*(t.qty||1),0);return`
    <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08)">
      <div style="color:rgba(255,255,255,0.9);font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">
        Bekräfta din order
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem;margin-bottom:1rem;font-size:0.85rem;color:rgba(255,255,255,0.7);line-height:1.6">
        Ordern avser <strong style="color:#fff">${e.items?.filter(s=>!s._note).length||0} produkter</strong>
        ${e.event_date?` för event <strong style="color:#fff">${u(e.event_date)}</strong>`:""}
        ${e.event_location?` i <strong style="color:#fff">${e.event_location}</strong>`:""}.
        Totalt <strong style="color:#c4b5f4">${Math.round(n*1.25).toLocaleString("sv-SE")} kr inkl. moms</strong>.
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
    </div>`}async function B(){const e=document.getElementById("confirm-btn");if(!e||e.disabled)return;e.disabled=!0,e.textContent="⏳ Bekräftar…";const n=window._currentCart,s=`Order ${n.id} bekräftad av kund. Hyresvillkor §1–§15 godkända. Totalt ${(n.items||[]).filter(t=>!t._note).reduce((t,a)=>t+(a.price||0)*(a.qty||1),0)} kr exkl. moms.`;try{const t=await fetch("/.netlify/functions/cart-update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:o,cart_id:i,action:"customer_confirm",confirmation_text:s})}),a=await t.json();if(t.ok&&a.ok){const p=document.getElementById("statusCta");p.innerHTML=`
        <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:0.75rem">
            <span style="font-size:1.5rem">✅</span>
            <div>
              <div style="color:rgba(255,255,255,0.9);font-size:0.95rem;font-weight:700">Order digitalt bekräftad!</div>
              <div style="color:rgba(255,255,255,0.5);font-size:0.8rem">Tack! Vi bekräftar via e-post och ses på eventet.</div>
            </div>
          </div>
          <div style="font-size:0.8rem;color:rgba(255,255,255,0.3);font-family:monospace">
            Ref: ${n.id} · ${new Date().toLocaleString("sv-SE")}
          </div>
        </div>`}else alert(a.error||"Något gick fel. Försök igen eller kontakta oss."),e.disabled=!1,e.textContent="✅ Bekräfta order"}catch{alert("Nätverksfel — kontrollera din anslutning och försök igen."),e.disabled=!1,e.textContent="✅ Bekräfta order"}}async function h(){const e=document.getElementById("chatInput"),n=document.getElementById("chatSendBtn"),s=e?.value.trim();if(s){n.disabled=!0,n.textContent="Skickar…";try{const t=await fetch("/.netlify/functions/cart-message",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cart_id:i,token:o,body:s})}),a=await t.json();t.ok?(d.push({id:a.message?.id||Date.now(),sender:"customer",body:s,read_at:null,created_at:new Date().toISOString()}),e.value="",j()):alert(a.error||"Kunde inte skicka meddelandet. Försök igen.")}catch{alert("Nätverksfel — kontrollera din anslutning och försök igen.")}n.disabled=!1,n.textContent="Skicka meddelande →"}}document.getElementById("chatSendBtn").addEventListener("click",h);document.getElementById("chatInput").addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&h()});window.confirmOrder=B;x();
