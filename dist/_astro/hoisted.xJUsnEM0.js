let I="",K=[],d=null,$=[],B=[],T="info",h=new Date().getFullYear(),y=new Date().getMonth(),V=null;const r=e=>document.getElementById(e),m=e=>typeof e=="number"?e.toLocaleString("sv-SE"):"–",X=e=>e?new Date(e).toLocaleDateString("sv-SE"):"–",x=e=>e?new Date(e).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short",hour12:!1}):"–";function l(e,a="success"){const t=r("toast");t.textContent=(a==="success"?"✓ ":"✕ ")+e,t.className=`show ${a}`,clearTimeout(t._t),t._t=setTimeout(()=>t.className="",3e3)}const j={open:{icon:"📬",label:"Inkommen",cls:"s-open"},proposal:{icon:"📤",label:"Offert skickad",cls:"s-proposal"},waiting:{icon:"⏳",label:"Väntar svar",cls:"s-waiting"},confirmed:{icon:"✅",label:"Bekräftad",cls:"s-confirmed"},fakturerad:{icon:"🧾",label:"Fakturerad",cls:"s-fakturerad"},betald:{icon:"💚",label:"Betald",cls:"s-betald"},cancelled:{icon:"❌",label:"Avbruten",cls:"s-cancelled"}};function ie(){let e=sessionStorage.getItem("sk_admin_token");if(!e)try{const a=JSON.parse(localStorage.getItem("sk_admin_mode")||"{}"),t=8*60*60*1e3;a.token&&a.ts&&Date.now()-a.ts<t&&(e=a.token,sessionStorage.setItem("sk_admin_token",e))}catch{}e&&(I=e,Y())}r("login-pw").addEventListener("keydown",e=>e.key==="Enter"&&W());r("login-btn").addEventListener("click",W);function W(){const e=r("login-pw").value.trim();e&&(I=e,sessionStorage.setItem("sk_admin_token",e),localStorage.setItem("sk_admin_mode",JSON.stringify({ts:Date.now(),token:e})),Y())}function Y(){r("login-screen").style.display="none",r("app").style.display="flex",k(),Pe()}r("logout-btn").addEventListener("click",()=>{sessionStorage.removeItem("sk_admin_token"),localStorage.removeItem("sk_admin_mode"),location.reload()});document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".view").forEach(t=>t.classList.remove("active")),e.classList.add("active");const a=e.dataset.view;r(`view-${a}`).classList.add("active"),a==="calendar"&&z()})});async function f(e,a={}){const t=await fetch(`/.netlify/functions/${e}`,{...a,headers:{"Content-Type":"application/json",Authorization:`Bearer ${I}`,...a.headers||{}}}),n=await t.json();if(t.status===401)throw sessionStorage.removeItem("sk_admin_token"),I="",r("app").style.display="none",r("login-screen").style.display="flex",r("login-error").style.display="block",r("login-error").textContent="Fel lösenord, försök igen.",r("login-pw").value="",r("login-pw").focus(),new Error("Unauthorized");return{ok:t.ok,status:t.status,data:n}}async function k(){const{ok:e,data:a}=await f("admin-carts");if(!e){if(a.error==="Ej behörig"){r("login-error").style.display="block",r("login-error").textContent="Fel lösenord.",r("app").style.display="none",r("login-screen").style.display="flex",sessionStorage.removeItem("sk_admin_token");return}l("Kunde inte hämta varukorgar","error");return}K=a.carts||[];const t=a.summary?.total_unread||0,n=r("global-unread");t>0?(n.style.display="inline",n.textContent=`${t} nya`):n.style.display="none",J(),r("view-calendar").classList.contains("active")&&z()}function oe(){const e=r("filter-search").value.toLowerCase().trim(),a=r("filter-from").value,t=r("filter-to").value;return K.filter(n=>!(e&&!((n.customer_name||"").toLowerCase().includes(e)||(n.id||"").toLowerCase().includes(e))||a&&n.event_date&&n.event_date<a||t&&n.event_date&&n.event_date>t))}["filter-search","filter-from","filter-to"].forEach(e=>{r(e).addEventListener("input",J)});function J(){const e=oe(),a=["open","proposal","waiting","confirmed","fakturerad","betald","cancelled"],t=r("kanban-board");t.innerHTML=a.map(n=>{const i=j[n],o=e.filter(s=>s.status===n);return`
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="col-title ${i.cls}">${i.icon} ${i.label}</div>
          <div class="col-count">${o.length}</div>
        </div>
        <div class="kanban-cards">
          ${o.length===0?'<div class="empty-col">Tom</div>':o.map(s=>se(s)).join("")}
        </div>
      </div>`}).join(""),t.onclick=n=>{const i=n.target.closest(".cart-card");i&&R(i.dataset.id)}}function se(e){const a=e.total_excl?m(Math.round(e.total_excl/100))+" kr":"–",t=e.unread_count>0?`<span class="unread-pill">💬 ${e.unread_count} ny${e.unread_count>1?"a":"t"}</span>`:"",n=e.created_at?Math.floor((Date.now()-new Date(e.created_at))/864e5):null,i=n===0?"Idag":n===1?"Igår":n!=null?`${n} dagar sedan`:"";return`
    <div class="cart-card" data-id="${e.id}">
      <div class="cart-card-name">${e.customer_name||"Okänd kund"}</div>
      <div class="cart-card-sub">${e.customer_email||""}</div>
      <div class="cart-card-meta">
        ${e.event_date?`<span>📅 ${X(e.event_date)}</span>`:""}
        ${e.event_location?`<span>📍 ${e.event_location}</span>`:""}
        ${i?`<span>🕐 ${i}</span>`:""}
      </div>
      <div class="cart-card-footer">
        <span class="cart-card-price">${a}</span>
        ${t}
      </div>
    </div>`}async function R(e){d=null,$=[],B=[],T="info";const a=r("detail-overlay"),t=r("detail-panel");a.classList.add("open"),t.classList.add("open"),r("panel-body").innerHTML='<div class="loading-center"><div class="spinner"></div></div>',r("panel-footer").innerHTML="",r("panel-title").textContent="Laddar…";let n,i;try{({ok:n,data:i}=await f(`admin-carts?id=${e}`))}catch(v){l("Kunde inte ladda varukorg: "+v.message,"error"),q();return}if(!n){l("Kunde inte ladda varukorg","error"),q();return}d=i.cart,$=i.messages||[],B=i.audit_log||[],r("panel-title").textContent=`${d.customer_name||"Okänd"} — ${d.id}`;const o=document.getElementById("panel-quick");o&&o.remove();const s=$.filter(v=>v.sender==="customer"&&!v.read_at).length,c=r("chat-unread-badge");s>0?(c.style.display="inline",c.textContent=s):c.style.display="none",Z(),u("info"),L()}function Z(){document.querySelectorAll(".panel-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===T),e.onclick=()=>{T=e.dataset.tab,Z(),u(T)}})}function u(e){const a=r("panel-body");e==="info"&&(a.innerHTML=pe()),e==="products"&&(a.innerHTML=fe()),e==="faktura"&&(a.innerHTML=we()),requestAnimationFrame(()=>{document.querySelectorAll(".status-select, .admin-note-area, .prod-input, .chat-textarea").forEach(t=>{t.style.setProperty("background","#221f50","important"),t.style.setProperty("color","#f0eeff","important"),t.style.setProperty("color-scheme","dark","important"),(t.tagName==="SELECT"||t.classList.contains("admin-note-area"))&&t.style.setProperty("border","1px solid rgba(196,181,244,0.25)","important")})}),e==="chat"&&he(),e==="log"&&(a.innerHTML=xe()),e==="info"&&(r("status-select")?.addEventListener("change",async t=>{const n=t.target.value;if(!confirm(`Ändra status till "${j[n]?.label}"?`)){t.target.value=d.status;return}const{ok:i}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:d.id,status:n})});i?(d.status=n,l("Status uppdaterad!"),k(),L()):l("Fel vid statusändring","error")}),r("save-info-btn")?.addEventListener("click",async()=>{const t=r("save-info-btn");t.disabled=!0,t.textContent="⏳ Sparar…";const n={cart_id:d.id,customer_name:r("edit-name")?.value.trim()||null,customer_email:r("edit-email")?.value.trim()||null,customer_phone:r("edit-phone")?.value.trim()||null,event_date:r("edit-date")?.value||null,event_location:r("edit-location")?.value.trim()||null},{ok:i}=await f("cart-update",{method:"POST",body:JSON.stringify(n)});i?(Object.assign(d,{customer_name:n.customer_name,customer_email:n.customer_email,customer_phone:n.customer_phone,event_date:n.event_date,event_location:n.event_location}),r("panel-title").textContent=`${d.customer_name||"Okänd"} — ${d.id}`,l("Kunduppgifter sparade!"),k()):l("Kunde inte spara","error"),t.disabled=!1,t.textContent="💾 Spara kunduppgifter"}),r("save-notes-btn")?.addEventListener("click",async()=>{const t=r("admin-notes").value,{ok:n}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:d.id,notes_admin:t})});n?(d.notes_admin=t,l("Anteckning sparad!")):l("Kunde inte spara","error")})),e==="chat"&&(r("chat-send-btn")?.addEventListener("click",H),r("chat-input")?.addEventListener("keydown",t=>{t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&H()}))}function P(){const e=document.querySelectorAll("#prod-tbody .prod-row");return Array.from(e).map(a=>{const t=o=>a.querySelector(`[data-field="${o}"]`)?.value?.trim()||"",n=parseInt(t("qty"))||1,i=parseFloat(t("price"))||0;return{id:t("id"),name:t("name"),category:t("category"),qty:n,price:i}}).filter(a=>a.name)}function Q(e){const a=document.querySelector(`[data-idx="${e}"]`);if(!a)return;const t=parseInt(a.querySelector('[data-field="qty"]')?.value)||1,n=parseFloat(a.querySelector('[data-field="price"]')?.value)||0,i=document.getElementById(`prod-sum-${e}`);i&&(i.textContent=m(t*n));const s=P().reduce((v,b)=>v+b.price*b.qty,0),c=document.getElementById("prod-tfoot");c&&(c.innerHTML=`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${m(s)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${m(Math.round(s*1.25))} kr</td><td></td></tr>`)}document.addEventListener("input",e=>{if(e.target.matches(".prod-qty, .prod-price")){const a=e.target.dataset.idx;a!==void 0&&Q(a)}});function de(e,a){const t=document.querySelector(`[data-field="qty"][data-idx="${e}"]`);if(!t)return;const n=Math.max(1,(parseInt(t.value)||1)+a);t.value=n,Q(e)}function le(e){const a=document.querySelector(`[data-idx="${e}"]`)?.closest("tr");a&&(a.remove(),Q(-1))}function ce(){const e=document.getElementById("prod-tbody");if(!e)return;const a=Date.now(),t=document.createElement("tr");t.className="prod-row",t.dataset.idx=a,t.innerHTML=`
    <td>
      <input class="prod-input prod-name" value="" placeholder="Produktnamn" data-field="name" data-idx="${a}" style="width:100%;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="" placeholder="Kategori" data-field="category" data-idx="${a}" style="width:55%;font-size:0.72rem;margin-top:3px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="" placeholder="ID (valfri)" data-field="id" data-idx="${a}" style="width:40%;font-size:0.72rem;margin-top:3px;margin-left:3%;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:center;vertical-align:top;padding-top:0.75rem">
      <div style="display:flex;align-items:center;justify-content:center;gap:4px">
        <button class="qty-btn" onclick="prodQty(${a},-1)">−</button>
        <input class="prod-input prod-qty" value="1" data-field="qty" data-idx="${a}" style="width:44px;text-align:center;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
        <button class="qty-btn" onclick="prodQty(${a},1)">＋</button>
      </div>
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem">
      <input class="prod-input prod-price" value="0" data-field="price" data-idx="${a}" style="width:90px;text-align:right;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem;font-weight:600;color:var(--brand-lav)" id="prod-sum-${a}">0</td>
    <td style="vertical-align:top;padding-top:0.75rem">
      <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${a})" title="Ta bort">×</button>
    </td>`,e.appendChild(t),t.querySelectorAll(".prod-input").forEach(n=>{n.style.setProperty("background","#221f50","important"),n.style.setProperty("color","#f0eeff","important"),n.style.setProperty("color-scheme","dark","important")}),t.querySelector(".prod-name")?.focus()}async function ee(){const e=document.getElementById("save-items-btn"),a=document.getElementById("prod-save-status"),t=P();e&&(e.disabled=!0,e.textContent="⏳ Sparar…");const n=document.getElementById("prod-note")?.value?.trim()||"";n&&t.push({_note:!0,id:"_note",name:n,price:0,qty:1});const i=Math.round(t.filter(s=>!s._note).reduce((s,c)=>s+c.price*c.qty,0)*100),{ok:o}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:d.id,items:t,total_excl:i})});o?(d.items=t,d.total_excl=i,a&&(a.textContent="✓ Sparat",a.style.color="var(--green)"),setTimeout(()=>{a&&(a.textContent="")},3e3),l("Produkter uppdaterade!"),J()):(a&&(a.textContent="✗ Fel – kontrollera konsolen",a.style.color="var(--red)"),l("Kunde inte spara","error")),e&&(e.disabled=!1,e.textContent="💾 Spara produkter")}function pe(){const e=d,a=j[e.status];return`
    <div class="section-label">Status</div>
    <div class="status-row">
      <select class="status-select" id="status-select" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;padding-right:2.25rem">
        ${Object.entries(j).map(([t,n])=>`<option value="${t}" ${t===e.status?"selected":""}>${n.icon} ${n.label}</option>`).join("")}
      </select>
      <span class="${a.cls}" style="font-size:0.85rem;font-weight:600;">${a.icon} ${a.label}</span>
    </div>

    <div class="section-label">Kundinformation</div>
    <div class="info-grid">
      <div class="info-field">
        <div class="info-field-label">Namn</div>
        <input class="info-edit-input" id="edit-name" value="${(e.customer_name||"").replace(/"/g,"&quot;")}" placeholder="Namn" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%;font-weight:500">
      </div>
      <div class="info-field">
        <div class="info-field-label">E-post</div>
        <input class="info-edit-input" id="edit-email" type="email" value="${(e.customer_email||"").replace(/"/g,"&quot;")}" placeholder="E-post" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
      <div class="info-field">
        <div class="info-field-label">Telefon</div>
        <input class="info-edit-input" id="edit-phone" value="${(e.customer_phone||"").replace(/"/g,"&quot;")}" placeholder="Telefon" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
      <div class="info-field">
        <div class="info-field-label">Eventdatum</div>
        <input class="info-edit-input" id="edit-date" type="date" value="${e.event_date||""}" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
      <div class="info-field" style="grid-column:1/-1">
        <div class="info-field-label">Plats / Adress</div>
        <input class="info-edit-input" id="edit-location" value="${(e.event_location||"").replace(/"/g,"&quot;")}" placeholder="Plats / Adress" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
    </div>
    <button class="btn-action" id="save-info-btn" style="margin-top:0.5rem;font-size:0.8rem">💾 Spara kunduppgifter</button>

    ${e.customer_message?`
    <div class="section-label">Kundens meddelande</div>
    <div style="background:var(--bg);border-radius:8px;padding:1rem;font-size:0.9rem;line-height:1.6;font-family:'Source Sans 3',sans-serif;color:var(--text-muted)">
      ${e.customer_message.replace(/\n/g,"<br>")}
    </div>`:""}

    <div class="section-label">Snabblänkar</div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem">
      ${e.customer_email?`<a href="mailto:${e.customer_email}" style="background:var(--surface2);border:1px solid var(--border);color:var(--brand-lav);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.82rem;text-decoration:none;font-family:inherit">✉ ${e.customer_email}</a>`:""}
      ${e.customer_phone?`<a href="tel:${e.customer_phone}" style="background:var(--surface2);border:1px solid var(--border);color:var(--brand-lav);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.82rem;text-decoration:none;font-family:inherit">📞 ${e.customer_phone}</a>`:""}
      ${e.cart_token?`<a href="https://scenkonsult.se/order/?cart=${e.id}&token=${e.cart_token}" target="_blank" style="background:var(--surface2);border:1px solid var(--border);color:var(--text-muted);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.82rem;text-decoration:none;font-family:inherit">🔗 Kundlänk ↗</a>`:""}
    </div>

    <div class="section-label">Tidsstämplar</div>
    <div class="info-grid">
      <div class="info-field"><div class="info-field-label">Skapad</div><div class="info-field-value" style="font-size:0.8rem">${x(e.created_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Uppdaterad</div><div class="info-field-value" style="font-size:0.8rem">${x(e.updated_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Kund senast aktiv</div><div class="info-field-value" style="font-size:0.8rem">${x(e.last_read_customer)}</div></div>
      <div class="info-field"><div class="info-field-label">Utgår</div><div class="info-field-value" style="font-size:0.8rem;color:${e.expires_at?"var(--amber)":"var(--green)"}">${e.expires_at?X(e.expires_at):"♾ Bekräftad"}</div></div>
    </div>

    <div class="section-label">Intern anteckning (visas ej för kund)</div>
    <textarea class="admin-note-area" id="admin-notes" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;" placeholder="Anteckna priser, tillgänglighet, intern kommunikation...">${e.notes_admin||""}</textarea>
    <button class="btn-action" id="save-notes-btn" style="margin-top:0.75rem">💾 Spara anteckning</button>
  `}function me(){let e='<option value="">+ Välj produkt att lägga till</option>';return Object.entries(A).forEach(([a,t])=>{t.products?(e+=`<optgroup label="${a}">`,t.products.forEach(n=>{const i=JSON.stringify({id:n.id,name:n.name,price:n.price,category:a}).replace(/"/g,"&quot;");e+=`<option value="${i}">${n.name} — ${m(n.price)} kr</option>`}),e+="</optgroup>"):t.sub&&Object.entries(t.sub).forEach(([n,i])=>{e+=`<optgroup label="${a} — ${n}">`,i.forEach(o=>{const s=JSON.stringify({id:o.id,name:o.name,price:o.price,category:`${a} — ${n}`}).replace(/"/g,"&quot;");e+=`<option value="${s}">${o.name} — ${m(o.price)} kr</option>`}),e+="</optgroup>"})}),e}function ue(e){const a=(e||"").toLowerCase();return a.includes("scen")?{icon:"🎪",color:"var(--blue)"}:a.includes("ljud")?{icon:"🔊",color:"var(--green)"}:a.includes("ljus")?{icon:"💡",color:"var(--amber)"}:a.includes("dj")?{icon:"🎧",color:"var(--brand-lav)"}:a.includes("bild")?{icon:"📽",color:"var(--blue)"}:a.includes("tjänst")||a.includes("leverans")||a.includes("montering")?{icon:"🚚",color:"var(--gray)"}:{icon:"📦",color:"var(--gray)"}}function fe(){const e=d.items||[],a=e.find(o=>o._note),t=e.filter(o=>!o._note),n=t.reduce((o,s)=>o+(s.price||0)*(s.qty||s.quantity||1),0),i=t.map((o,s)=>{const c=o.qty||o.quantity||1,v=o.price||0,b=c*v,{icon:D,color:N}=ue(o.category),M=o.id||"",w=typeof PROD_DESC<"u"&&PROD_DESC[M]?PROD_DESC[M]:null,S=w?`<div style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;margin-top:4px">${w.desc||""}</div>${w.includes?.length?'<ul style="font-size:0.72rem;color:var(--text-faint);padding-left:14px;margin-top:3px">'+w.includes.map(g=>`<li>${g}</li>`).join("")+"</ul>":""}`:`<div style="font-size:0.78rem;color:var(--text-faint);margin-top:4px">Artno: ${M||"–"} · Kategori: ${o.category||"–"}</div>`;return`<tr data-idx="${s}" class="prod-row">
      <td style="vertical-align:top;padding:8px 6px">
        <div style="display:flex;align-items:flex-start;gap:6px">
          <button onclick="prodTogglePopout(${s})" style="flex-shrink:0;width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:rgba(0,0,0,.2);color:${N};cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center" title="Produktinfo">${D}</button>
          <div style="flex:1;min-width:0">
            <input class="prod-input prod-name" value="${(o.name||"").replace(/"/g,"&quot;")}" placeholder="Produktnamn" data-field="name" data-idx="${s}" style="width:100%;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
            <div id="po-${s}" style="display:none">${S}</div>
          </div>
        </div>
      </td>
      <td style="text-align:center;vertical-align:top;padding-top:10px">
        <div style="display:flex;align-items:center;justify-content:center;gap:2px">
          <button class="qty-btn" onclick="prodQty(${s},-1)">−</button>
          <input class="prod-input prod-qty" value="${c}" data-field="qty" data-idx="${s}" style="width:38px;text-align:center;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
          <button class="qty-btn" onclick="prodQty(${s},1)">＋</button>
        </div>
      </td>
      <td style="text-align:right;vertical-align:top;padding-top:10px">
        <input class="prod-input prod-price" value="${v}" data-field="price" data-idx="${s}" style="width:78px;text-align:right;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      </td>
      <td style="text-align:right;vertical-align:top;padding-top:10px;font-weight:600;color:var(--brand-lav);font-size:0.85rem" id="prod-sum-${s}">${m(b)} kr</td>
      <td style="vertical-align:top;padding-top:10px">
        <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${s})" title="Ta bort">×</button>
      </td>
    </tr>`}).join("");return`
    <div class="section-label">Produkter (${t.length} st)</div>
    <table class="product-table" id="prod-edit-table">
      <thead><tr>
        <th>Produkt</th>
        <th style="text-align:center;width:88px">Antal</th>
        <th style="text-align:right;width:80px">à-pris</th>
        <th style="text-align:right;width:80px">Summa</th>
        <th style="width:28px"></th>
      </tr></thead>
      <tbody id="prod-tbody">${i}</tbody>
    </table>
    <select id="prod-add-select" onchange="prodAddFromCatalog(this)"
      style="width:100%;margin-top:8px;font-size:0.82rem;padding:6px 8px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px dashed var(--border-lav);border-radius:8px">
      ${me()}
    </select>
    <button onclick="prodAddFreeRow()" style="width:100%;margin-top:6px;font-size:0.78rem;padding:5px;background:transparent;border:1px dashed rgba(255,255,255,0.12);border-radius:6px;color:var(--text-faint);cursor:pointer;text-align:left">
      + Fri rad (specialfrakt, rabatt, övrigt…)
    </button>

    <div class="section-label" style="margin-top:14px">Tjänster</div>
    <div style="display:grid;grid-template-columns:1fr auto;gap:4px 8px;align-items:center;font-size:0.82rem">
      <span style="color:var(--text-muted)">Leverans</span>
      <select id="svc-leverans" onchange="prodUpdateSvc()" style="font-size:0.78rem;padding:3px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
        <option value="">— (välj)</option>
        <option value="Leverans — Vanlig bil (t&r)|1118|lev-standard">Vanlig bil t&r — 1 118 kr</option>
        <option value="Leverans — Bil med släp (t&r)|1598|lev-skrymmande">Bil med släp t&r — 1 598 kr</option>
        <option value="Leverans — Vanlig bil (enkel)|559|lev-standard-e">Vanlig bil enkel — 559 kr</option>
        <option value="Leverans — Lastbil (t&r)|2998|lev-lastbil">Lastbil t&r — 2 998 kr</option>
        <option value="">Ingen leverans</option>
      </select>
      <span style="color:var(--text-muted)">Montering</span>
      <select id="svc-montering" onchange="prodUpdateSvc()" style="font-size:0.78rem;padding:3px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
        <option value="">— (ingen)</option>
        <option value="Montering & demontering|600|montering">600 kr (auto)</option>
        <option value="Montering & demontering|1200|montering">1 200 kr (2 tim)</option>
        <option value="Montering & demontering|1800|montering">1 800 kr (3 tim)</option>
        <option value="Montering & demontering|300|montering">300 kr (30 min)</option>
      </select>
    </div>

    <div class="section-label" style="margin-top:12px">Fakturaavgift</div>
    <div style="display:grid;grid-template-columns:1fr auto;gap:4px 8px;align-items:center;font-size:0.82rem">
      <span style="color:var(--text-muted)">Fakturaavgift</span>
      <select id="svc-faktura" onchange="prodUpdateSvc()" style="font-size:0.78rem;padding:3px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
        <option value="Fakturaavgift|49|fakturaavgift" selected>49 kr (standard)</option>
        <option value="Fakturaavgift|29|fakturaavgift">29 kr</option>
        <option value="">Ingen</option>
      </select>
    </div>

    <div style="border-top:1px solid var(--border);margin-top:14px;padding-top:10px">
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-muted);margin-bottom:3px"><span>Produkter exkl. moms</span><span>${m(n)} kr</span></div>
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-muted);margin-bottom:3px"><span>Moms 25%</span><span>${m(Math.round(n*.25))} kr</span></div>
      <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:var(--brand-lav)"><span>Inkl. moms</span><span>${m(Math.round(n*1.25))} kr</span></div>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-action" onclick="prodSave()" style="flex:1">💾 Spara</button>
      <button class="btn-action" onclick="prodSaveAndSendOffer()" style="flex:1;border-color:var(--brand-lav);color:var(--brand-lav)">📤 Spara & skicka offert</button>
    </div>
    <div style="margin-top:6px">
      <div class="section-label" style="margin-top:0">Anmärkningar till kund</div>
      <textarea class="admin-note-area" id="prod-note" rows="2"
        style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;min-height:55px"
        placeholder="Leveransinfo, prisvillkor…">${a?.name||""}</textarea>
    </div>
  `}function ve(e){const a=document.getElementById("po-"+e);a&&(a.style.display=a.style.display==="none"?"block":"none")}function ge(e){if(e.value)try{const a=JSON.parse(e.value.replace(/&quot;/g,'"')),t=P();t.push({id:a.id||"",name:a.name||"",price:a.price||0,qty:1,category:a.category||""}),d.items=t,u("products")}catch{l("Fel vid tillägg","error")}}function ke(){const e=P();e.push({id:"",name:"",price:0,qty:1,category:""}),d.items=e,u("products")}function be(){const e=P().filter(t=>!["lev-standard","lev-skrymmande","lev-lastbil","lev-standard-e","montering","fakturaavgift","lev-standard-e","lev-skrymmande-e","lev-lastbil-e"].some(n=>t.id===n||t.id===n+"-e")),a=t=>{const n=document.getElementById(t);if(!n||!n.value)return;const[i,o,s]=n.value.split("|");i&&o&&e.push({id:s,name:i,price:parseInt(o),qty:1,category:"Tjänster"})};a("svc-leverans"),a("svc-montering"),a("svc-faktura"),d.items=e,u("products")}async function ye(){await ee(),U(d)}function he(){const e=r("panel-body"),a=$,t=a.length===0?'<div class="chat-empty">Ingen chatt ännu.</div>':`<div class="chat-messages">${a.map(n=>{const i=n.sender==="admin"?n.read_at?`<span class="read-check">✓✓</span> Läst ${x(n.read_at)}`:"⏳ Inte läst":n.read_at?`Läst ${x(n.read_at)}`:"";return`
          <div class="msg-wrap ${n.sender}">
            <div class="msg-bubble">${n.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--brand-lav)">$1</a>')}</div>
            <div class="msg-meta">
              <span>${n.sender==="admin"?"👤 Du":"🧑 Kund"} · ${x(n.created_at)}</span>
              ${i?`<span>${i}</span>`:""}
            </div>
          </div>`}).join("")}</div>`;e.innerHTML=`
    ${t}
    <div class="section-label">Nytt meddelande till kund</div>
    <div class="chat-input-wrap">
      <textarea class="chat-textarea" id="chat-input" placeholder="Skriv ett meddelande… (Ctrl+Enter för att skicka)"></textarea>
      <button class="chat-send-btn" id="chat-send-btn">Skicka till kund →</button>
    </div>`,setTimeout(()=>{const n=e.querySelector(".chat-messages");n&&(n.scrollTop=n.scrollHeight),e.scrollTop=e.scrollHeight},50)}async function H(){const e=r("chat-input"),a=r("chat-send-btn"),t=e?.value.trim();if(!t)return;a.disabled=!0,a.textContent="Skickar…";const{ok:n,data:i}=await f("cart-message",{method:"POST",body:JSON.stringify({cart_id:d.id,body:t})});n?($.push({id:i.message?.id||Date.now(),cart_id:d.id,sender:"admin",body:t,read_at:null,created_at:new Date().toISOString()}),e.value="",u("chat"),l("Meddelande skickat!"),k()):(l(i.error||"Kunde inte skicka","error"),a.disabled=!1,a.textContent="Skicka till kund →")}function xe(){const e=B;return e.length===0?'<div class="empty-col" style="padding:3rem">Ingen logg ännu.</div>':`
    <div class="section-label">Händelselogg (senaste 50)</div>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${e.map(a=>`
        <div style="background:var(--bg);border-radius:8px;padding:0.75rem;display:flex;gap:1rem;align-items:flex-start">
          <div style="font-size:0.75rem;color:var(--text-faint);white-space:nowrap;min-width:130px">${x(a.created_at)}</div>
          <div>
            <div style="font-size:0.85rem;font-weight:600">${a.event_type}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${a.actor} ${a.payload&&Object.keys(a.payload).length?"· "+JSON.stringify(a.payload):""}</div>
          </div>
        </div>`).join("")}
    </div>`}function we(){const e=d,t=(e.items||[]).filter(s=>!s._note).reduce((s,c)=>s+(c.price||0)*(c.qty||1),0),n=e.invoice_number||"— (ej skapad)",i=!!e.invoice_paid_at,o=!!e.invoice_sent_at;return`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <span style="font-size:1rem;font-weight:700;color:var(--brand-lav)">${n}</span>
      ${i?'<span class="s-betald" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">💚 Betald</span>':o?'<span class="s-fakturerad" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">🧾 Skickad</span>':'<span class="s-waiting" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">⏳ Ej skickad</span>'}
    </div>

    <div class="section-label">Fakturainformation</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.82rem;margin-bottom:8px">
      <div>
        <div style="color:var(--text-faint);font-size:0.72rem;margin-bottom:2px">Fakturadatum</div>
        <input id="inv-date" type="date" value="${e.invoice_date||new Date().toISOString().slice(0,10)}"
          style="width:100%;font-size:0.82rem;padding:4px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
      </div>
      <div>
        <div style="color:var(--text-faint);font-size:0.72rem;margin-bottom:2px">Förfallodag</div>
        <input id="inv-due" type="date" value="${e.invoice_due_date||""}"
          style="width:100%;font-size:0.82rem;padding:4px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
      </div>
      <div>
        <div style="color:var(--text-faint);font-size:0.72rem;margin-bottom:2px">Betalningsvillkor</div>
        <select id="inv-terms" style="width:100%;font-size:0.78rem;padding:4px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
          <option value="5" ${(e.payment_terms_days||5)==5?"selected":""}>5 dagar netto</option>
          <option value="10" ${(e.payment_terms_days||5)==10?"selected":""}>10 dagar netto</option>
          <option value="20" ${(e.payment_terms_days||5)==20?"selected":""}>20 dagar netto</option>
          <option value="30" ${(e.payment_terms_days||5)==30?"selected":""}>30 dagar netto</option>
          <option value="0" ${(e.payment_terms_days||5)==0?"selected":""}>Förskott</option>
        </select>
      </div>
      <div>
        <div style="color:var(--text-faint);font-size:0.72rem;margin-bottom:2px">Vår referens</div>
        <input id="inv-ref" type="text" value="${e.invoice_ref||"Per S"}"
          style="width:100%;font-size:0.82rem;padding:4px 6px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:5px">
      </div>
    </div>

    <div class="section-label">Kund</div>
    <div style="font-size:0.82rem;padding:8px 10px;background:var(--surface);border-radius:8px;border:1px solid var(--border);margin-bottom:8px">
      <div style="font-weight:600;color:var(--text)">${e.customer_name||"—"} <span style="font-size:0.75rem;font-weight:400;color:var(--text-muted)">(${e.customer_type==="b2b"?"B2B":"Privatperson"})</span></div>
      ${e.customer_orgnr?`<div style="color:var(--text-muted)">Org.nr: ${e.customer_orgnr}</div>`:""}
      ${e.customer_address||e.event_location?`<div style="color:var(--text-muted)">${e.customer_address||e.event_location}</div>`:""}
      ${e.customer_ref?`<div style="color:var(--text-muted)">Er ref: ${e.customer_ref}</div>`:""}
      ${!e.customer_address&&!e.event_location||e.customer_type==="b2b"&&!e.customer_orgnr?`<a href="#" onclick="window.renderTab('info');return false;" style="color:var(--amber);font-size:0.78rem">⚠ Komplettera i Info-fliken →</a>`:""}
    </div>

    <div class="section-label">Belopp</div>
    <div style="font-size:0.82rem">
      <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--text-muted)"><span>Produkter & tjänster exkl. moms</span><span>${m(t)} kr</span></div>
      <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--text-muted)"><span>Moms 25%</span><span>${m(Math.round(t*.25))} kr</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;font-size:0.95rem;color:var(--brand-lav);border-top:1px solid var(--border);margin-top:4px"><span>Att betala inkl. moms</span><span>${m(Math.round(t*1.25))} kr</span></div>
    </div>

    <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn-action" onclick="invSaveFields()" style="font-size:0.8rem">💾 Spara uppgifter</button>
      <button class="btn-action" onclick="toast('PDF-generering kommer i nästa version','error')" style="font-size:0.8rem">🖨 Förhandsgranska PDF</button>
      <button class="btn-action" onclick="invSendEmail()" style="font-size:0.8rem;border-color:var(--brand-lav);color:var(--brand-lav)">📧 Skicka faktura via mail</button>
      ${i?"":'<button class="btn-action btn-success" onclick="invMarkPaid()" style="font-size:0.8rem">💚 Markera betald</button>'}
    </div>
  `}async function te(){const e={cart_id:d.id,invoice_date:document.getElementById("inv-date")?.value||null,invoice_due_date:document.getElementById("inv-due")?.value||null,payment_terms_days:parseInt(document.getElementById("inv-terms")?.value||"5")},{ok:a}=await f("cart-update",{method:"POST",body:JSON.stringify(e)});a?(Object.assign(d,e),l("Fakturauppgifter sparade!"),u("faktura")):l("Kunde inte spara","error")}async function Se(){if(!d.customer_email){l("Kunden saknar e-postadress","error");return}if(!confirm(`Skicka faktura till ${d.customer_email}?`))return;await te().catch(()=>{});const e=document.querySelector('[onclick="invSendEmail()"]');e&&(e.disabled=!0,e.textContent="⏳ Genererar PDF…");try{const{ok:a,data:t}=await f("invoice-send",{method:"POST",body:JSON.stringify({cart_id:d.id})});a&&t.ok?(d.status="fakturerad",d.invoice_sent_at=new Date().toISOString(),d.invoice_number=t.invoice_number,l(`Faktura ${t.invoice_number} skickad! 📧`),k(),u("faktura"),L()):l(t?.error||"Fel vid utskick","error")}catch(a){l("Nätverksfel: "+a.message,"error")}finally{e&&(e.disabled=!1,e.textContent="📧 Skicka faktura via mail")}}async function ae(){if(!confirm("Markera ordern som betald?"))return;const e=new Date().toISOString(),{ok:a}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:d.id,status:"betald",invoice_paid_at:e})});a?(d.status="betald",d.invoice_paid_at=e,l("Order markerad som betald! 💚"),k(),u("faktura"),L()):l("Fel vid markering","error")}function L(){const e=d,a=r("panel-footer");a.innerHTML="";const t=(n,i,o)=>{const s=document.createElement("button");s.className=`btn-action ${i}`,s.textContent=n,s.onclick=o,a.appendChild(s)};e.status==="open"?(t("📤 Skapa & skicka offert","btn-success",()=>{u("products")}),t("❌ Avvisa","btn-danger",E)):e.status==="proposal"?(t("✅ Bekräfta order","btn-success",O),t("📦 Justera produkter","",()=>u("products")),t("❌ Avbryt","btn-danger",E)):e.status==="waiting"?(t("✅ Bekräfta order","btn-success",O),t("📩 Påminn kund","",C),t("❌ Avbryt","btn-danger",E)):e.status==="confirmed"?(t("🧾 Skapa faktura","btn-success",()=>u("faktura")),t("📩 Skicka notis","",C)):e.status==="fakturerad"?(t("💚 Markera betald","btn-success",ae),t("📩 Påminn om betalning","",C)):e.status==="betald"||e.status!=="cancelled"&&(t("✅ Bekräfta order","btn-success",O),t("📤 Skicka offert","",()=>U(e)),t("❌ Avbryt","btn-danger",E)),e.cart_token&&t("🔗 Kopiera kundlänk","",()=>{const n=`https://scenkonsult.se/order/?cart=${e.id}&token=${e.cart_token}`;navigator.clipboard.writeText(n),l("Kundlänk kopierad!")})}async function O(){if(!confirm("Bekräfta ordern? Status ändras till Orderbekräftelse och TTL tas bort."))return;const{ok:e}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:d.id,status:"confirmed"})});e?(d.status="confirmed",l("Order bekräftad! ✅"),k(),u("info"),L()):l("Fel vid bekräftelse","error")}async function E(){if(!confirm("Avbryt ordern? Den sparas i 90 dagar."))return;const{ok:e}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:d.id,status:"cancelled"})});e?(d.status="cancelled",l("Order avbruten"),k(),u("info"),L()):l("Fel vid avbrytning","error")}async function C(){const e=prompt("Meddelande till kund (skickas via e-post):");if(!e?.trim())return;const{ok:a}=await f("cart-message",{method:"POST",body:JSON.stringify({cart_id:d.id,body:e.trim()})});a?(l("Notis skickad till kund! 📩"),$.push({id:Date.now(),cart_id:d.id,sender:"admin",body:e.trim(),read_at:null,created_at:new Date().toISOString()}),T==="chat"&&u("chat")):l("Kunde inte skicka notis","error")}const A={Scen:{products:[{id:"small",name:"Scenpaket Small",price:599},{id:"small-plus",name:"Scenpaket Small+",price:899},{id:"small-plusplus",name:"Scenpaket Small++",price:1199},{id:"medium",name:"Scenpaket Medium",price:1499},{id:"medium-plus",name:"Scenpaket Medium+",price:1799},{id:"medium-plusplus",name:"Scenpaket Medium++",price:2399},{id:"medium-plus-tak",name:"Scenpaket Medium+ inkl. scentak",price:3799},{id:"large",name:"Scenpaket Large",price:2999},{id:"large-plus",name:"Scenpaket Large+",price:3599},{id:"large-plus-tak",name:"Scenpaket Large+ inkl. scentak",price:11999},{id:"xl",name:"Scenpaket XL",price:5399},{id:"xl-plus",name:"Scenpaket XL+",price:7199}]},"Scen tillbehör":{products:[{id:"scentrapp-40-cm-",name:"Scentrapp (40 cm)",price:279},{id:"scentrapp-60-cm-",name:"Scentrapp (60 cm)",price:349},{id:"scenkjol-per-4-m-",name:"Scenkjol (per 4 m)",price:79},{id:"backdrop-3-5-2-5-m",name:"Backdrop 3,5×2,5 m",price:799}]},Ljud:{sub:{Portable:[{id:"portable-small",name:"Portable, Small",price:599},{id:"portable-small-plus",name:"Portable, Small+",price:699},{id:"portable-medium",name:"Portable, Medium",price:799},{id:"portable-medium-plus",name:"Portable, Medium+",price:999},{id:"portable-large",name:"Portable, Large",price:1199}],Event:[{id:"event-small",name:"Event, Small",price:799},{id:"event-small-plus",name:"Event, Small+",price:1199},{id:"event-medium",name:"Event, Medium",price:1599},{id:"event-medium-plus",name:"Event, Medium+",price:2299},{id:"event-large",name:"Event, Large",price:3199}],Music:[{id:"music-small",name:"Music, Small",price:999},{id:"music-small-plus",name:"Music, Small+",price:1299},{id:"music-medium",name:"Music, Medium",price:1799},{id:"music-large",name:"Music, Large",price:2699},{id:"music-xl",name:"Music, XL",price:3599},{id:"music-xxl",name:"Music, XXL",price:5499}],Live:[{id:"live-small",name:"Live, Small",price:599},{id:"live-medium",name:"Live, Medium",price:1199},{id:"live-large",name:"Live, Large",price:1999},{id:"live-xl",name:"Live, XL",price:3199}],Mixers:[{id:"mixer-2-2",name:"Mixerbord 2+2 kanaler",price:159},{id:"mixer-4-2",name:"Mixerbord 4+2 kanaler",price:199},{id:"mixer-4-4",name:"Mixerbord 4+4 kanaler",price:299},{id:"mixer-6-4",name:"Mixerbord 6+4 kanaler",price:349},{id:"mixer-12-4",name:"Mixerbord 12+4 kanaler",price:399},{id:"mixer-16-3",name:"Mixerbord 16+3 kanaler",price:599},{id:"mixer-ilive-t80",name:"Digitalt mixerbord 32+16 kanaler",price:2499}],Mikrofoner:[{id:"handmikrofon",name:"Handmikrofon",price:80},{id:"instrumentmikrofon",name:"Instrumentmikrofon",price:120},{id:"tr-dl-s-handmikrofon",name:"Trådlös handmikrofon",price:400},{id:"tr-dl-st-headset",name:"Trådlöst headset",price:480},{id:"shure-slxd-digitalt-tr-dl-st-system-2-mikrofoner",name:"Shure SLXD trådlöst system (2 mik)",price:1299},{id:"wireless-8ch",name:"Trådlöst mikrofonset, 8 kanaler",price:2999},{id:"mikrofonstativ",name:"Mikrofonstativ",price:60}],"Stativ & kablar":[{id:"h-gtalarstativ-gravity",name:"Högtalarstativ Gravity",price:40},{id:"h-gtalarstativ-k-m",name:"Högtalarstativ K&M",price:50},{id:"h-gtalarstativ-gravity-premium",name:"Högtalarstativ Gravity Premium",price:60},{id:"h-gtalarstativ-gravity-med-vev",name:"Högtalarstativ med vev",price:120},{id:"xlr-kablar",name:"XLR kablar",price:40},{id:"bluetooth-mottagare",name:"Bluetooth-mottagare",price:80}]}},Ljus:{sub:{"Färdiga paket":[{id:"ljus-small",name:"Ljuspaket, Small",price:399},{id:"ljus-small-plus",name:"Ljuspaket, Small+",price:599},{id:"ljus-small-pp",name:"Ljuspaket, Small++",price:799},{id:"ljus-medium",name:"Ljuspaket, Medium",price:1199},{id:"ljus-medium-plus",name:"Ljuspaket, Medium+",price:1299},{id:"ljus-medium-pp",name:"Ljuspaket, Medium++",price:1499},{id:"ljus-large",name:"Ljuspaket, Large",price:1699},{id:"ljus-large-plus",name:"Ljuspaket, Large+",price:2199},{id:"ljus-large-pp",name:"Ljuspaket, Large++",price:2699}],"Lösa effekter":[{id:"led-par",name:"LED PAR (14x8W RGBW)",price:79},{id:"led-par-9",name:"LED PAR (9x10W RGBW)",price:99},{id:"led-par-uv",name:"LED PAR UV",price:119},{id:"led-par-xl",name:"LED PAR XL (60x2W RGBW)",price:149},{id:"led-uppladdningsbar",name:"LED-armatur, uppladdningsbar",price:199}],"Rök & pyro":[{id:"rokmaskin-1500",name:"Rökmaskin (1500W)",price:349},{id:"rokmaskin-650",name:"Rökmaskin (650W)",price:449},{id:"kallgnist",name:"Kallgnistmaskin",price:499},{id:"konfetti",name:"Konfettiavfyrare",price:499}],"Stativ & tross":[{id:"stativ-400",name:"Stativ med T-bar (400 mm)",price:40},{id:"stativ-1200",name:"Stativ med T-bar (1200 mm)",price:40},{id:"stativ-900p",name:"Stativ med T-bar (900 mm, premium)",price:60},{id:"vevstativ-1200",name:"Vevstativ med T-bar (1200 mm)",price:120},{id:"tross-1m",name:"Trosstorn 1,0 m",price:300},{id:"tross-15m",name:"Trosstorn 1,5 m",price:360}]}},"Projektor & skärm":{products:[{id:"projektor-xga",name:"Projektor (XGA)",price:299},{id:"projektor-fhd",name:"Projektor (Full HD)",price:499},{id:"skarm-65",name:'Skärm 65"',price:399},{id:"skarm-75",name:'Skärm 75"',price:799},{id:"trailer-skarm",name:"Trailerupphängd skärm",price:1999}]},"Projektor tillbehör":{products:[{id:"projektorbord",name:"Projektorbord",price:160},{id:"projektorduk-100-",name:'Projektorduk 100"',price:400},{id:"golvstativ-65-75-",name:'Golvstativ 65"/75"',price:240},{id:"hdmi-kabel-5-m",name:"HDMI-kabel 5 m",price:48},{id:"hdmi-kabel-10-m",name:"HDMI-kabel 10 m",price:60},{id:"hdmi-splitter-4-port-",name:"HDMI-splitter (4-port)",price:400},{id:"mediaspelare-4k",name:"Mediaspelare 4K",price:400},{id:"scenmonitor-23-",name:'Scenmonitor 23"',price:480},{id:"usb-clicker-",name:"USB Clicker",price:60}]},"DJ-utrustning":{products:[{id:"dj-controller-numark",name:"DJ-controller Numark Mixstream Pro+",price:799},{id:"dj-controller-denon-go",name:"DJ-controller Denon Prime GO+",price:999},{id:"dj-controller-denon-prime4",name:"DJ-controller Denon Prime 4+",price:1499},{id:"dj-rane-system-one",name:"DJ-system Rane System One",price:1999},{id:"dj-bord",name:"DJ-bord",price:80},{id:"dj-bord2",name:"DJ-bord med paneler",price:200},{id:"scenengineer",name:"Hyr Scenengineer",price:952},{id:"media-editor",name:"Hyr Media-editor",price:952}]},"El & kabel":{products:[{id:"grenuttag-1-5-m",name:"Grenuttag 1,5 m",price:20},{id:"f-rl-ngningskabel-10-m",name:"Förlängningskabel 10 m",price:48},{id:"grenuttag-p-rulle-10-m",name:"Grenuttag på rulle 10 m",price:100},{id:"grenuttag-p-rulle-25-m",name:"Grenuttag på rulle 25 m",price:159}]},Tillägg:{products:[{id:"lev-standard",name:"Leverans & upphämtning (standard bil)",price:1118},{id:"lev-skrymmande",name:"Leverans & upphämtning (bil med släp)",price:1598},{id:"lev-lastbil",name:"Leverans & upphämtning (lätt lastbil)",price:2198},{id:"lev-bakgavel",name:"Leverans & upphämtning (lastbil med bakgavellift)",price:2998},{id:"rigg-teknik",name:"Teknikertjänst på plats (per tim)",price:600},{id:"montering",name:"Montering & demontering (per tim)",price:600},{id:"faktura",name:"Fakturaavgift",price:49}]},"Egen rad":{products:[{id:"custom",name:"Ange benämning och pris →",price:0,custom:!0}]}};r("new-quote-btn").addEventListener("click",()=>G(null));r("quote-close").addEventListener("click",F);r("quote-overlay").addEventListener("click",e=>{e.target===r("quote-overlay")&&F()});let p=[];function G(e){if(p=[],r("qc-name").value=e?.customer_name||"",r("qc-email").value=e?.customer_email||"",r("qc-phone").value=e?.customer_phone||"",r("qc-date").value=e?.event_date||"",r("qc-location").value=e?.event_location||"",r("qc-note").value="",r("quote-error").style.display="none",r("quote-send-btn").disabled=!1,r("quote-send-btn").textContent="✉ Skicka offert",e?.items?.length){e.items.filter(n=>!n._note).forEach(n=>{p.push({id:n.id||"",name:n.name,price:n.price||0,qty:n.qty||1})});const t=e.items.find(n=>n._note);t&&(r("qc-note").value=t.name)}const a=r("qp-cat");a.innerHTML='<option value="">— välj kategori —</option>'+Object.keys(A).map(t=>`<option value="${t}">${t}</option>`).join(""),r("qp-sub-wrap").style.display="none",r("qp-prod").innerHTML='<option value="">— välj kategori —</option>',_(),r("quote-overlay").classList.add("open"),r("qc-name").focus()}function U(e){G(e)}function F(){r("quote-overlay").classList.remove("open")}function $e(){const e=r("qp-cat").value,a=A[e],t=r("qp-sub-wrap"),n=r("qp-prod");if(!a){t.style.display="none",n.innerHTML='<option value="">— välj kategori —</option>';return}if(a.sub){const i=r("qp-sub");i.innerHTML='<option value="">— välj underkategori —</option>'+Object.keys(a.sub).map(o=>`<option value="${o}">${o}</option>`).join(""),t.style.display="",n.innerHTML='<option value="">— välj underkategori —</option>'}else t.style.display="none",ne(a.products)}function _e(){const e=r("qp-cat").value,a=r("qp-sub").value,t=A[e];!t?.sub||!a||ne(t.sub[a]||[])}function ne(e){const a=r("qp-prod");a.innerHTML='<option value="">— välj produkt —</option>'+e.map(t=>{const n=t.custom?"✏ Skriv in benämning och pris själv":`${t.name} — ${t.price.toLocaleString("sv")} kr`;return`<option value="${t.id}" data-price="${t.price}" data-name="${t.name.replace(/"/g,"&quot;")}" data-custom="${t.custom||!1}">${n}</option>`}).join("")}function qe(){const e=r("qp-prod"),a=e.options[e.selectedIndex];if(!a||!a.value)return;if(a.dataset.custom==="true"){p.push({id:"custom-"+Date.now(),name:"",price:0,qty:1,custom:!0}),_(),setTimeout(()=>{const c=document.querySelectorAll(".quote-custom-name");c.length&&c[c.length-1].focus()},50);return}const n=a.dataset.name||a.textContent.split(" — ")[0],i=parseInt(a.dataset.price)||0,o=a.value,s=p.find(c=>c.id===o&&!c.custom);s?s.qty++:p.push({id:o,name:n,price:i,qty:1}),_(),e.selectedIndex=0}function _(){const e=r("quote-prod-tbody"),a=r("quote-prod-tfoot");if(!e)return;e.innerHTML=p.map((n,i)=>{const o=n.custom?`<input class="prod-input quote-custom-name" value="${n.name.replace(/"/g,"&quot;")}" placeholder="Ange benämning..." onchange="quoteEditName(${i},this.value)"
           style="width:100%;font-size:0.82rem;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border-radius:5px;border:1px solid rgba(196,181,244,0.3);padding:0.2rem 0.5rem;">`:`<span style="font-size:0.82rem">${n.name}</span>`;return`
    <tr data-qidx="${i}">
      <td>${o}</td>
      <td style="text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:3px">
          <button class="qty-btn" onclick="quoteQtyIdx(${i},-1)" style="width:22px;height:22px;font-size:0.9rem">−</button>
          <span style="min-width:24px;text-align:center;font-size:0.82rem">${n.qty}</span>
          <button class="qty-btn" onclick="quoteQtyIdx(${i},1)" style="width:22px;height:22px;font-size:0.9rem">＋</button>
        </div>
      </td>
      <td style="text-align:right">
        <input class="prod-input" value="${n.price}" onchange="quoteEditPrice(${i},this.value)"
          style="width:80px;text-align:right;font-size:0.82rem;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border-radius:5px;border:1px solid transparent;padding:0.2rem 0.4rem;">
      </td>
      <td style="text-align:right;font-size:0.82rem;font-weight:600;color:var(--brand-lav)">${m(n.price*n.qty)} kr</td>
      <td><button class="qty-btn" style="color:var(--red);border-color:var(--red);width:22px;height:22px" onclick="quoteDelIdx(${i})">×</button></td>
    </tr>`}).join("");const t=p.reduce((n,i)=>n+i.price*i.qty,0);a.innerHTML=p.length?`<tr><td colspan="3" style="font-weight:700;padding-top:0.5rem;font-size:0.82rem">Totalt (exkl. moms)</td>
       <td style="text-align:right;font-weight:700;color:var(--brand-lav);font-size:0.82rem">${m(t)} kr</td><td></td></tr>
       <tr><td colspan="3" style="color:var(--text-faint);font-size:0.72rem">Inkl. 25% moms</td>
       <td style="text-align:right;color:var(--text-muted);font-size:0.72rem">${m(Math.round(t*1.25))} kr</td><td></td></tr>`:""}function Le(e,a){p[e]&&(p[e].qty=Math.max(1,p[e].qty+a),_())}function Me(e,a){p[e]&&(p[e].name=a)}function Ee(e,a){p[e]&&(p[e].price=parseFloat(a)||0,_())}function Te(e){p.splice(e,1),_()}async function je(){const e=r("qc-name").value.trim(),a=r("qc-email").value.trim(),t=r("quote-error");if(t.style.display="none",!e){t.textContent="Namn krävs.",t.style.display="block",r("qc-name").focus();return}if(!a||!a.includes("@")){t.textContent="Giltig e-post krävs.",t.style.display="block",r("qc-email").focus();return}if(p.length===0){t.textContent="Lägg till minst en produkt.",t.style.display="block";return}const n=r("quote-send-btn");n.disabled=!0,n.textContent="⏳ Skickar…";const i={customer:{name:e,email:a,phone:r("qc-phone").value.trim()||null,date:r("qc-date").value||null,location:r("qc-location").value.trim()||null},items:p,note:r("qc-note").value.trim()||null};try{const{ok:o,data:s}=await f("admin-send-quote",{method:"POST",body:JSON.stringify(i)});o?(F(),l(`Offert skickad till ${a}! 🎉`),k()):(t.textContent=s?.error||"Kunde inte skicka offert.",t.style.display="block",n.disabled=!1,n.textContent="✉ Skicka offert")}catch{t.textContent="Nätverksfel — försök igen.",t.style.display="block",n.disabled=!1,n.textContent="✉ Skicka offert"}}r("panel-close").addEventListener("click",q);r("detail-overlay").addEventListener("click",q);document.addEventListener("keydown",e=>e.key==="Escape"&&q());function q(){r("detail-overlay").classList.remove("open"),r("detail-panel").classList.remove("open"),d=null}r("cal-prev").addEventListener("click",()=>{--y<0&&(y=11,h--),z()});r("cal-next").addEventListener("click",()=>{++y>11&&(y=0,h++),z()});r("cal-today").addEventListener("click",()=>{h=new Date().getFullYear(),y=new Date().getMonth(),z()});function z(){const e=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];r("cal-month-label").textContent=`${e[y]} ${h}`;const a=new Date(h,y,1),t=new Date(h,y+1,0),n=new Date;let i=a.getDay()-1;i<0&&(i=6);const o=r("cal-days");o.innerHTML="";const s=Math.ceil((i+t.getDate())/7)*7;for(let c=0;c<s;c++){const v=c-i+1,b=new Date(h,y,v),D=v<1||v>t.getDate(),N=!D&&b.toDateString()===n.toDateString(),M=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`,w=K.filter(g=>g.event_date===M&&g.status!=="cancelled"),S=document.createElement("div");S.className=`cal-day${D?" other-month":""}${N?" today":""}`,S.innerHTML=`<div class="cal-day-num">${b.getDate()}</div>
      ${w.map(g=>`
        <div class="cal-event s-${g.status}" data-id="${g.id}">
          ${j[g.status]?.icon} ${g.customer_name||g.id}
        </div>`).join("")}`,S.querySelectorAll(".cal-event").forEach(g=>{g.addEventListener("click",re=>{re.stopPropagation(),R(g.dataset.id)})}),o.appendChild(S)}}r("refresh-btn").addEventListener("click",()=>{k(),l("Uppdaterat!")});function Pe(){clearInterval(V),V=setInterval(k,3e4)}ie();window.prodQty=de;window.prodDelete=le;window.prodAddRow=ce;window.prodSave=ee;window.renderTab=u;window.prodTogglePopout=ve;window.prodAddFromCatalog=ge;window.prodAddFreeRow=ke;window.prodUpdateSvc=be;window.prodSaveAndSendOffer=ye;window.invMarkPaid=ae;window.invSendEmail=Se;window.invSaveFields=te;window.openPanel=R;window.closePanel=q;window.sendMessage=H;window.confirmOrder=O;window.cancelOrder=E;window.notifyCustomer=C;window.quotePickerCat=$e;window.quotePickerSub=_e;window.quotePickerAdd=qe;window.quoteQtyIdx=Le;window.quoteEditName=Me;window.quoteEditPrice=Ee;window.quoteDelIdx=Te;window.sendQuote=je;window.closeQuoteModal=F;window.openQuoteModal=G;window.openQuoteModalForCart=U;
