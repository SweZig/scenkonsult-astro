let O="",J=[],o=null,S=[],B=[],T="info",h=new Date().getFullYear(),k=new Date().getMonth(),W=null;const n=e=>document.getElementById(e),m=e=>typeof e=="number"?e.toLocaleString("sv-SE"):"–",V=e=>e?new Date(e).toLocaleDateString("sv-SE"):"–",x=e=>e?new Date(e).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short",hour12:!1}):"–";function c(e,a="success"){const t=n("toast");t.textContent=(a==="success"?"✓ ":"✕ ")+e,t.className=`show ${a}`,clearTimeout(t._t),t._t=setTimeout(()=>t.className="",3e3)}const M={open:{icon:"📬",label:"Inkommen",cls:"s-open"},waiting:{icon:"⏳",label:"Väntar svar",cls:"s-waiting"},confirmed:{icon:"✅",label:"Bekräftad",cls:"s-confirmed"},fakturerad:{icon:"🧾",label:"Fakturerad",cls:"s-fakturerad"},betald:{icon:"💚",label:"Betald",cls:"s-betald"},cancelled:{icon:"❌",label:"Avbruten",cls:"s-cancelled"}};function de(){let e=sessionStorage.getItem("sk_admin_token");if(!e)try{const a=JSON.parse(localStorage.getItem("sk_admin_mode")||"{}"),t=8*60*60*1e3;a.token&&a.ts&&Date.now()-a.ts<t&&(e=a.token,sessionStorage.setItem("sk_admin_token",e))}catch{}e&&(O=e,Z())}n("login-pw").addEventListener("keydown",e=>e.key==="Enter"&&Y());n("login-btn").addEventListener("click",Y);function Y(){const e=n("login-pw").value.trim();e&&(O=e,sessionStorage.setItem("sk_admin_token",e),localStorage.setItem("sk_admin_mode",JSON.stringify({ts:Date.now(),token:e})),Z())}function Z(){n("login-screen").style.display="none",n("app").style.display="flex",b(),De()}n("logout-btn").addEventListener("click",()=>{sessionStorage.removeItem("sk_admin_token"),localStorage.removeItem("sk_admin_mode"),location.reload()});document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".view").forEach(t=>t.classList.remove("active")),e.classList.add("active");const a=e.dataset.view;n(`view-${a}`).classList.add("active"),a==="calendar"&&P()})});async function v(e,a={}){const t=await fetch(`/.netlify/functions/${e}`,{...a,headers:{"Content-Type":"application/json",Authorization:`Bearer ${O}`,...a.headers||{}}}),r=await t.json();if(t.status===401)throw sessionStorage.removeItem("sk_admin_token"),O="",n("app").style.display="none",n("login-screen").style.display="flex",n("login-error").style.display="block",n("login-error").textContent="Fel lösenord, försök igen.",n("login-pw").value="",n("login-pw").focus(),new Error("Unauthorized");return{ok:t.ok,status:t.status,data:r}}async function b(){const{ok:e,data:a}=await v("admin-carts");if(!e){if(a.error==="Ej behörig"){n("login-error").style.display="block",n("login-error").textContent="Fel lösenord.",n("app").style.display="none",n("login-screen").style.display="flex",sessionStorage.removeItem("sk_admin_token");return}c("Kunde inte hämta varukorgar","error");return}J=a.carts||[];const t=a.summary?.total_unread||0,r=n("global-unread");t>0?(r.style.display="inline",r.textContent=`${t} nya`):r.style.display="none",R(),n("view-calendar").classList.contains("active")&&P()}function se(){const e=n("filter-search").value.toLowerCase().trim(),a=n("filter-from").value,t=n("filter-to").value;return J.filter(r=>!(e&&!((r.customer_name||"").toLowerCase().includes(e)||(r.id||"").toLowerCase().includes(e))||a&&r.event_date&&r.event_date<a||t&&r.event_date&&r.event_date>t))}["filter-search","filter-from","filter-to"].forEach(e=>{n(e).addEventListener("input",R)});function R(){const e=se(),a=["open","waiting","confirmed","fakturerad","betald","cancelled"],t=n("kanban-board");t.innerHTML=a.map(r=>{const i=M[r],s=e.filter(l=>l.status===r);return`
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="col-title ${i.cls}">${i.icon} ${i.label}</div>
          <div class="col-count">${s.length}</div>
        </div>
        <div class="kanban-cards">
          ${s.length===0?'<div class="empty-col">Tom</div>':s.map(l=>le(l)).join("")}
        </div>
      </div>`}).join(""),t.onclick=r=>{const i=r.target.closest(".cart-card");i&&Q(i.dataset.id)}}function le(e){const a=e.total_excl?m(Math.round(e.total_excl/100))+" kr":"–",t=e.unread_count>0?`<span class="unread-pill">💬 ${e.unread_count} ny${e.unread_count>1?"a":"t"}</span>`:"",r=e.created_at?Math.floor((Date.now()-new Date(e.created_at))/864e5):null,i=r===0?"Idag":r===1?"Igår":r!=null?`${r} dagar sedan`:"";return`
    <div class="cart-card" data-id="${e.id}">
      <div class="cart-card-name">${e.customer_name||"Okänd kund"}</div>
      <div class="cart-card-sub">${e.customer_email||""}</div>
      <div class="cart-card-meta">
        ${e.event_date?`<span>📅 ${V(e.event_date)}</span>`:""}
        ${e.event_location?`<span>📍 ${e.event_location}</span>`:""}
        ${i?`<span>🕐 ${i}</span>`:""}
      </div>
      <div class="cart-card-footer">
        <span class="cart-card-price">${a}</span>
        ${t}
      </div>
    </div>`}async function Q(e){o=null,S=[],B=[],T="info";const a=n("detail-overlay"),t=n("detail-panel");a.classList.add("open"),t.classList.add("open"),n("panel-body").innerHTML='<div class="loading-center"><div class="spinner"></div></div>',n("panel-footer").innerHTML="",n("panel-title").textContent="Laddar…";let r,i;try{({ok:r,data:i}=await v(`admin-carts?id=${e}`))}catch(p){c("Kunde inte ladda varukorg: "+p.message,"error"),q();return}if(!r){c("Kunde inte ladda varukorg","error"),q();return}o=i.cart,S=i.messages||[],B=i.audit_log||[],n("panel-title").textContent=`${o.customer_name||"Okänd"} — ${o.id}`;const s=document.getElementById("panel-quick");s&&s.remove();const l=S.filter(p=>p.sender==="customer"&&!p.read_at).length,d=n("chat-unread-badge");l>0?(d.style.display="inline",d.textContent=l):d.style.display="none",ee(),g("info"),L()}function ee(){document.querySelectorAll(".panel-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===T),e.onclick=()=>{T=e.dataset.tab,ee(),g(T)}})}function g(e){const a=n("panel-body");e==="info"&&(a.innerHTML=me()),e==="products"&&(a.innerHTML=ge()),e==="faktura"&&(a.innerHTML=Se()),requestAnimationFrame(()=>{document.querySelectorAll(".status-select, .admin-note-area, .prod-input, .chat-textarea").forEach(t=>{t.style.setProperty("background","#221f50","important"),t.style.setProperty("color","#f0eeff","important"),t.style.setProperty("color-scheme","dark","important"),(t.tagName==="SELECT"||t.classList.contains("admin-note-area"))&&t.style.setProperty("border","1px solid rgba(196,181,244,0.25)","important")})}),e==="chat"&&we(),e==="log"&&(a.innerHTML=$e()),e==="info"&&(n("status-select")?.addEventListener("change",async t=>{const r=t.target.value;if(!confirm(`Ändra status till "${M[r]?.label}"?`)){t.target.value=o.status;return}const{ok:i}=await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,status:r})});i?(o.status=r,c("Status uppdaterad!"),b(),L()):c("Fel vid statusändring","error")}),document.querySelectorAll('input[name="ctype"]').forEach(t=>{t.addEventListener("change",()=>{const r=document.querySelector('input[name="ctype"]:checked')?.value==="b2b",i=document.getElementById("b2b-fields");i&&(i.style.display=r?"grid":"none")})}),n("save-info-btn")?.addEventListener("click",async()=>{const t=n("save-info-btn");t.disabled=!0,t.textContent="⏳ Sparar…";const r={cart_id:o.id,customer_name:n("edit-name")?.value.trim()||null,customer_email:n("edit-email")?.value.trim()||null,customer_phone:n("edit-phone")?.value.trim()||null,event_date:n("edit-date")?.value||null,event_location:n("edit-location")?.value.trim()||null,customer_type:document.querySelector('input[name="ctype"]:checked')?.value||"b2c",customer_address:n("edit-address")?.value.trim()||null,customer_orgnr:n("edit-orgnr")?.value.trim()||null,customer_ref:n("edit-custref")?.value.trim()||null},{ok:i}=await v("cart-update",{method:"POST",body:JSON.stringify(r)});i?(Object.assign(o,{customer_name:r.customer_name,customer_email:r.customer_email,customer_phone:r.customer_phone,event_date:r.event_date,event_location:r.event_location,customer_type:r.customer_type,customer_address:r.customer_address,customer_orgnr:r.customer_orgnr,customer_ref:r.customer_ref}),n("panel-title").textContent=`${o.customer_name||"Okänd"} — ${o.id}`,c("Kunduppgifter sparade!"),b()):c("Kunde inte spara","error"),t.disabled=!1,t.textContent="💾 Spara kunduppgifter"}),n("save-notes-btn")?.addEventListener("click",async()=>{const t=n("admin-notes").value,{ok:r}=await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,notes_admin:t})});r?(o.notes_admin=t,c("Anteckning sparad!")):c("Kunde inte spara","error")})),e==="chat"&&(n("chat-send-btn")?.addEventListener("click",H),n("chat-input")?.addEventListener("keydown",t=>{t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&H()}))}function j(){const e=document.querySelectorAll("#prod-tbody .prod-row");return Array.from(e).map(a=>{const t=s=>a.querySelector(`[data-field="${s}"]`)?.value?.trim()||"",r=parseInt(t("qty"))||1,i=parseFloat(t("price"))||0;return{id:t("id"),name:t("name"),category:t("category"),qty:r,price:i}}).filter(a=>a.name)}function G(e){const a=document.querySelector(`[data-idx="${e}"]`);if(!a)return;const t=parseInt(a.querySelector('[data-field="qty"]')?.value)||1,r=parseFloat(a.querySelector('[data-field="price"]')?.value)||0,i=document.getElementById(`prod-sum-${e}`);i&&(i.textContent=m(t*r));const l=j().reduce((p,y)=>p+y.price*y.qty,0),d=document.getElementById("prod-tfoot");d&&(d.innerHTML=`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${m(l)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${m(Math.round(l*1.25))} kr</td><td></td></tr>`)}document.addEventListener("input",e=>{if(e.target.matches(".prod-qty, .prod-price")){const a=e.target.dataset.idx;a!==void 0&&G(a)}});function ce(e,a){const t=document.querySelector(`[data-field="qty"][data-idx="${e}"]`);if(!t)return;const r=Math.max(1,(parseInt(t.value)||1)+a);t.value=r,G(e)}function pe(e){const a=document.querySelector(`[data-idx="${e}"]`)?.closest("tr");a&&(a.remove(),G(-1))}function ue(){const e=document.getElementById("prod-tbody");if(!e)return;const a=Date.now(),t=document.createElement("tr");t.className="prod-row",t.dataset.idx=a,t.innerHTML=`
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
    </td>`,e.appendChild(t),t.querySelectorAll(".prod-input").forEach(r=>{r.style.setProperty("background","#221f50","important"),r.style.setProperty("color","#f0eeff","important"),r.style.setProperty("color-scheme","dark","important")}),t.querySelector(".prod-name")?.focus()}async function te(){const e=document.getElementById("save-items-btn"),a=document.getElementById("prod-save-status"),t=j();e&&(e.disabled=!0,e.textContent="⏳ Sparar…");const r=document.getElementById("prod-note")?.value?.trim()||"";r&&t.push({_note:!0,id:"_note",name:r,price:0,qty:1});const i=Math.round(t.filter(l=>!l._note).reduce((l,d)=>l+d.price*d.qty,0)*100),{ok:s}=await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,items:t,total_excl:i})});s?(o.items=t,o.total_excl=i,a&&(a.textContent="✓ Sparat",a.style.color="var(--green)"),setTimeout(()=>{a&&(a.textContent="")},3e3),c("Produkter uppdaterade!"),R()):(a&&(a.textContent="✗ Fel – kontrollera konsolen",a.style.color="var(--red)"),c("Kunde inte spara","error")),e&&(e.disabled=!1,e.textContent="💾 Spara produkter")}function me(){const e=o,a=M[e.status];return`
    <div class="section-label">Status</div>
    <div class="status-row">
      <select class="status-select" id="status-select" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;padding-right:2.25rem">
        ${Object.entries(M).map(([t,r])=>`<option value="${t}" ${t===e.status?"selected":""}>${r.icon} ${r.label}</option>`).join("")}
      </select>
      <span class="${a.cls}" style="font-size:0.85rem;font-weight:600;">${a.icon} ${a.label}</span>
    </div>

    <div class="section-label">Kundtyp</div>
    <div style="display:flex;gap:8px;margin-bottom:10px">
      <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:0.85rem;padding:5px 12px;border-radius:6px;border:1px solid var(--border)">
        <input type="radio" name="ctype" value="b2c" ${!e.customer_type||e.customer_type==="b2c"?"checked":""}>
        👤 Privatperson (B2C)
      </label>
      <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:0.85rem;padding:5px 12px;border-radius:6px;border:1px solid var(--border)">
        <input type="radio" name="ctype" value="b2b" ${e.customer_type==="b2b"?"checked":""}>
        🏢 Företag/förening (B2B)
      </label>
    </div>

    <div class="section-label">Kontaktuppgifter</div>
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
        <div class="info-field-label">Eventplats / Leveransadress</div>
        <input class="info-edit-input" id="edit-location" value="${(e.event_location||"").replace(/"/g,"&quot;")}" placeholder="Plats / Adress" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
      <div class="info-field" style="grid-column:1/-1">
        <div class="info-field-label">Fakturaadress (om annan)</div>
        <input class="info-edit-input" id="edit-address" value="${(e.customer_address||"").replace(/"/g,"&quot;")}" placeholder="Gatuadress, postnr, ort" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
    </div>

    <div id="b2b-fields" style="display:${e.customer_type==="b2b"?"grid":"none"}" class="info-grid" onload="">
      <div class="info-field">
        <div class="info-field-label">Organisationsnummer</div>
        <input class="info-edit-input" id="edit-orgnr" value="${(e.customer_orgnr||"").replace(/"/g,"&quot;")}" placeholder="556xxx-xxxx" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
      <div class="info-field">
        <div class="info-field-label">Er referensperson</div>
        <input class="info-edit-input" id="edit-custref" value="${(e.customer_ref||"").replace(/"/g,"&quot;")}" placeholder="T.ex. Hannah Johansson" style="background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;font-family:inherit;font-size:0.9rem;width:100%">
      </div>
    </div>
    <button class="btn-action" id="save-info-btn" style="margin-top:0.75rem;font-size:0.8rem">💾 Spara kunduppgifter</button>

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
      <div class="info-field"><div class="info-field-label">Utgår</div><div class="info-field-value" style="font-size:0.8rem;color:${e.expires_at?"var(--amber)":"var(--green)"}">${e.expires_at?V(e.expires_at):"♾ Bekräftad"}</div></div>
    </div>

    <div class="section-label">Intern anteckning (visas ej för kund)</div>
    <textarea class="admin-note-area" id="admin-notes" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;" placeholder="Anteckna priser, tillgänglighet, intern kommunikation...">${e.notes_admin||""}</textarea>
    <button class="btn-action" id="save-notes-btn" style="margin-top:0.75rem">💾 Spara anteckning</button>
  `}function fe(){let e='<option value="">+ Välj produkt att lägga till</option>';return Object.entries(C).forEach(([a,t])=>{t.products?(e+=`<optgroup label="${a}">`,t.products.forEach(r=>{const i=JSON.stringify({id:r.id,name:r.name,price:r.price,category:a}).replace(/"/g,"&quot;");e+=`<option value="${i}">${r.name} — ${m(r.price)} kr</option>`}),e+="</optgroup>"):t.sub&&Object.entries(t.sub).forEach(([r,i])=>{e+=`<optgroup label="${a} — ${r}">`,i.forEach(s=>{const l=JSON.stringify({id:s.id,name:s.name,price:s.price,category:`${a} — ${r}`}).replace(/"/g,"&quot;");e+=`<option value="${l}">${s.name} — ${m(s.price)} kr</option>`}),e+="</optgroup>"})}),e}function ve(e){const a=(e||"").toLowerCase();return a.includes("scen")?{icon:"🎪",color:"var(--blue)"}:a.includes("ljud")?{icon:"🔊",color:"var(--green)"}:a.includes("ljus")?{icon:"💡",color:"var(--amber)"}:a.includes("dj")?{icon:"🎧",color:"var(--brand-lav)"}:a.includes("bild")?{icon:"📽",color:"var(--blue)"}:a.includes("tjänst")||a.includes("leverans")||a.includes("montering")?{icon:"🚚",color:"var(--gray)"}:{icon:"📦",color:"var(--gray)"}}function ge(){const e=o.items||[],a=e.find(d=>d._note),t=e.filter(d=>!d._note),r=t.reduce((d,p)=>d+(p.price||0)*(p.qty||p.quantity||1),0),i=["Tjänster","Tillägg"],s=t.findIndex(d=>i.includes(d.category)),l=t.map((d,p)=>{const y=d.qty||d.quantity||1,E=d.price||0,A=y*E,{icon:F,color:N}=ve(d.category);i.includes(d.category);const w=p===s&&s>0?'<tr><td colspan="5" style="padding:4px 0 2px"><div style="border-top:1px dashed rgba(196,181,244,0.25);margin:2px 0"></div><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;color:rgba(196,181,244,0.4);padding:2px 4px">Tjänster</div></td></tr>':"",f=d.id||"",$=typeof PROD_DESC<"u"&&PROD_DESC[f]?PROD_DESC[f]:null,ie=$?`<div style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;margin-top:4px">${$.desc||""}</div>${$.includes?.length?'<ul style="font-size:0.72rem;color:var(--text-faint);padding-left:14px;margin-top:3px">'+$.includes.map(oe=>`<li>${oe}</li>`).join("")+"</ul>":""}`:`<div style="font-size:0.78rem;color:var(--text-faint);margin-top:4px">Artno: ${f||"–"} · Kategori: ${d.category||"–"}</div>`;return w+`<tr data-idx="${p}" class="prod-row">
      <td style="vertical-align:top;padding:8px 6px">
        <div style="display:flex;align-items:flex-start;gap:6px">
          <button onclick="prodTogglePopout(${p})" style="flex-shrink:0;width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:rgba(0,0,0,.2);color:${N};cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center" title="Produktinfo">${F}</button>
          <div style="flex:1;min-width:0">
            <input class="prod-input prod-name" value="${(d.name||"").replace(/"/g,"&quot;")}" placeholder="Produktnamn" data-field="name" data-idx="${p}" style="width:100%;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
            <input type="hidden" data-field="category" data-idx="${p}" value="${(d.category||"").replace(/"/g,"&quot;")}">
            <input type="hidden" data-field="id" data-idx="${p}" value="${(d.id||"").replace(/"/g,"&quot;")}">
            <div id="po-${p}" style="display:none">${ie}</div>
          </div>
        </div>
      </td>
      <td style="text-align:center;vertical-align:top;padding-top:10px">
        <div style="display:flex;align-items:center;justify-content:center;gap:2px">
          <button class="qty-btn" onclick="prodQty(${p},-1)">−</button>
          <input class="prod-input prod-qty" value="${y}" data-field="qty" data-idx="${p}" style="width:38px;text-align:center;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
          <button class="qty-btn" onclick="prodQty(${p},1)">＋</button>
        </div>
      </td>
      <td style="text-align:right;vertical-align:top;padding-top:10px">
        <input class="prod-input prod-price" value="${E}" data-field="price" data-idx="${p}" style="width:78px;text-align:right;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      </td>
      <td style="text-align:right;vertical-align:top;padding-top:10px;font-weight:600;color:var(--brand-lav);font-size:0.85rem" id="prod-sum-${p}">${m(A)} kr</td>
      <td style="vertical-align:top;padding-top:10px">
        <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${p})" title="Ta bort">×</button>
      </td>
    </tr>`}).join("");return`
    <div class="section-label">Produkter &amp; tjänster (${t.length} st)</div>
    <table class="product-table" id="prod-edit-table">
      <thead><tr>
        <th>Produkt</th>
        <th style="text-align:center;width:88px">Antal</th>
        <th style="text-align:right;width:80px">à-pris</th>
        <th style="text-align:right;width:80px">Summa</th>
        <th style="width:28px"></th>
      </tr></thead>
      <tbody id="prod-tbody">${l}</tbody>
    </table>
    <select id="prod-add-select" onchange="prodAddFromCatalog(this)"
      style="width:100%;margin-top:8px;font-size:0.82rem;padding:6px 8px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;border:1px dashed var(--border-lav);border-radius:8px">
      ${fe()}
    </select>
    <button onclick="prodAddFreeRow()" style="width:100%;margin-top:6px;font-size:0.78rem;padding:5px;background:transparent;border:1px dashed rgba(255,255,255,0.12);border-radius:6px;color:var(--text-faint);cursor:pointer;text-align:left">
      + Fri rad (specialfrakt, rabatt, övrigt…)
    </button>



    <div style="border-top:1px solid var(--border);margin-top:14px;padding-top:10px">
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-muted);margin-bottom:3px"><span>Produkter exkl. moms</span><span>${m(r)} kr</span></div>
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-muted);margin-bottom:3px"><span>Moms 25%</span><span>${m(Math.round(r*.25))} kr</span></div>
      <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:var(--brand-lav)"><span>Inkl. moms</span><span>${m(Math.round(r*1.25))} kr</span></div>
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
  `}function ye(e){const a=document.getElementById("po-"+e);a&&(a.style.display=a.style.display==="none"?"block":"none")}function be(e){if(e.value)try{const a=JSON.parse(e.value.replace(/&quot;/g,'"')),t=j();t.push({id:a.id||"",name:a.name||"",price:a.price||0,qty:1,category:a.category||""}),o.items=t,g("products")}catch{c("Fel vid tillägg","error")}}function ke(){const e=j();e.push({id:"",name:"",price:0,qty:1,category:""}),o.items=e,g("products")}function he(){const e=j().filter(t=>!["lev-standard","lev-skrymmande","lev-lastbil","lev-standard-e","montering","fakturaavgift","lev-standard-e","lev-skrymmande-e","lev-lastbil-e"].some(r=>t.id===r||t.id===r+"-e")),a=t=>{const r=document.getElementById(t);if(!r||!r.value)return;const[i,s,l]=r.value.split("|");i&&s&&e.push({id:l,name:i,price:parseInt(s),qty:1,category:"Tjänster"})};a("svc-leverans"),a("svc-montering"),a("svc-faktura"),o.items=e,g("products")}async function xe(){await te(),X(o)}function we(){const e=n("panel-body"),a=S,t=a.length===0?'<div class="chat-empty">Ingen chatt ännu.</div>':`<div class="chat-messages">${a.map(r=>{const i=r.sender==="admin"?r.read_at?`<span class="read-check">✓✓</span> Läst ${x(r.read_at)}`:"⏳ Inte läst":r.read_at?`Läst ${x(r.read_at)}`:"";return`
          <div class="msg-wrap ${r.sender}">
            <div class="msg-bubble">${r.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--brand-lav)">$1</a>')}</div>
            <div class="msg-meta">
              <span>${r.sender==="admin"?"👤 Du":"🧑 Kund"} · ${x(r.created_at)}</span>
              ${i?`<span>${i}</span>`:""}
            </div>
          </div>`}).join("")}</div>`;e.innerHTML=`
    ${t}
    <div class="section-label">Nytt meddelande till kund</div>
    <div class="chat-input-wrap">
      <textarea class="chat-textarea" id="chat-input" placeholder="Skriv ett meddelande… (Ctrl+Enter för att skicka)"></textarea>
      <button class="chat-send-btn" id="chat-send-btn">Skicka till kund →</button>
    </div>`,setTimeout(()=>{const r=e.querySelector(".chat-messages");r&&(r.scrollTop=r.scrollHeight),e.scrollTop=e.scrollHeight},50)}async function H(){const e=n("chat-input"),a=n("chat-send-btn"),t=e?.value.trim();if(!t)return;a.disabled=!0,a.textContent="Skickar…";const{ok:r,data:i}=await v("cart-message",{method:"POST",body:JSON.stringify({cart_id:o.id,body:t})});r?(S.push({id:i.message?.id||Date.now(),cart_id:o.id,sender:"admin",body:t,read_at:null,created_at:new Date().toISOString()}),e.value="",g("chat"),c("Meddelande skickat!"),b()):(c(i.error||"Kunde inte skicka","error"),a.disabled=!1,a.textContent="Skicka till kund →")}function $e(){const e=B;return e.length===0?'<div class="empty-col" style="padding:3rem">Ingen logg ännu.</div>':`
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
    </div>`}function Se(){const e=o,t=(e.items||[]).filter(l=>!l._note).reduce((l,d)=>l+(d.price||0)*(d.qty||1),0),r=e.invoice_number||"— (ej skapad)",i=!!e.invoice_paid_at,s=!!e.invoice_sent_at;return`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <span style="font-size:1rem;font-weight:700;color:var(--brand-lav)">${r}</span>
      ${i?'<span class="s-betald" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">💚 Betald</span>':s?'<span class="s-fakturerad" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">🧾 Skickad</span>':'<span class="s-waiting" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">⏳ Ej skickad</span>'}
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
  `}async function ae(){const e={cart_id:o.id,invoice_date:document.getElementById("inv-date")?.value||null,invoice_due_date:document.getElementById("inv-due")?.value||null,payment_terms_days:parseInt(document.getElementById("inv-terms")?.value||"5")},{ok:a}=await v("cart-update",{method:"POST",body:JSON.stringify(e)});a?(Object.assign(o,e),c("Fakturauppgifter sparade!"),g("faktura")):c("Kunde inte spara","error")}async function _e(){if(!o.customer_email){c("Kunden saknar e-postadress","error");return}if(!confirm(`Skicka faktura till ${o.customer_email}?`))return;await ae().catch(()=>{});const e=document.querySelector('[onclick="invSendEmail()"]');e&&(e.disabled=!0,e.textContent="⏳ Genererar PDF…");try{const{ok:a,data:t}=await v("invoice-send",{method:"POST",body:JSON.stringify({cart_id:o.id})});a&&t.ok?(o.status="fakturerad",o.invoice_sent_at=new Date().toISOString(),o.invoice_number=t.invoice_number,c(`Faktura ${t.invoice_number} skickad! 📧`),b(),g("faktura"),L()):c(t?.error||"Fel vid utskick","error")}catch(a){c("Nätverksfel: "+a.message,"error")}finally{e&&(e.disabled=!1,e.textContent="📧 Skicka faktura via mail")}}async function re(){if(!confirm("Markera ordern som betald?"))return;const e=new Date().toISOString(),{ok:a}=await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,status:"betald",invoice_paid_at:e})});a?(o.status="betald",o.invoice_paid_at=e,c("Order markerad som betald! 💚"),b(),g("faktura"),L()):c("Fel vid markering","error")}function L(){const e=o,a=n("panel-footer");a.innerHTML="";const t=(r,i,s)=>{const l=document.createElement("button");l.className=`btn-action ${i}`,l.textContent=r,l.onclick=s,a.appendChild(l)};e.status==="open"?(t("📤 Skapa & skicka offert","btn-success",()=>{g("products")}),t("❌ Avvisa","btn-danger",z)):e.status==="waiting"?(t("✅ Bekräfta order","btn-success",K),t("📩 Påminn kund","",D),t("❌ Avbryt","btn-danger",z)):e.status==="confirmed"?(t("🧾 Skapa faktura","btn-success",()=>g("faktura")),t("📩 Skicka notis","",D)):e.status==="fakturerad"?(t("💚 Markera betald","btn-success",re),t("📩 Påminn om betalning","",D)):e.status==="betald"||e.status!=="cancelled"&&(t("✅ Bekräfta order","btn-success",K),t("📤 Skicka offert","",()=>X(e)),t("❌ Avbryt","btn-danger",z)),e.cart_token&&t("🔗 Kopiera kundlänk","",()=>{const r=`https://scenkonsult.se/order/?cart=${e.id}&token=${e.cart_token}`;navigator.clipboard.writeText(r),c("Kundlänk kopierad!")})}async function K(){if(!confirm("Bekräfta ordern? Status ändras till Orderbekräftelse och TTL tas bort."))return;const{ok:e}=await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,status:"confirmed"})});e?(o.status="confirmed",c("Order bekräftad! ✅"),b(),g("info"),L()):c("Fel vid bekräftelse","error")}async function z(){if(!confirm("Avbryt ordern? Den sparas i 90 dagar."))return;const{ok:e}=await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,status:"cancelled"})});e?(o.status="cancelled",c("Order avbruten"),await b(),g("info"),L()):c("Fel vid avbrytning","error")}async function D(){const e=prompt("Meddelande till kund (skickas via e-post):");if(!e?.trim())return;const{ok:a}=await v("cart-message",{method:"POST",body:JSON.stringify({cart_id:o.id,body:e.trim()})});a?(c("Notis skickad till kund! 📩"),S.push({id:Date.now(),cart_id:o.id,sender:"admin",body:e.trim(),read_at:null,created_at:new Date().toISOString()}),T==="chat"&&g("chat")):c("Kunde inte skicka notis","error")}const C={Scen:{products:[{id:"small",name:"Scenpaket Small",price:599},{id:"small-plus",name:"Scenpaket Small+",price:899},{id:"small-plusplus",name:"Scenpaket Small++",price:1199},{id:"medium",name:"Scenpaket Medium",price:1499},{id:"medium-plus",name:"Scenpaket Medium+",price:1799},{id:"medium-plusplus",name:"Scenpaket Medium++",price:2399},{id:"medium-plus-tak",name:"Scenpaket Medium+ inkl. scentak",price:3799},{id:"large",name:"Scenpaket Large",price:2999},{id:"large-plus",name:"Scenpaket Large+",price:3599},{id:"large-plus-tak",name:"Scenpaket Large+ inkl. scentak",price:11999},{id:"xl",name:"Scenpaket XL",price:5399},{id:"xl-plus",name:"Scenpaket XL+",price:7199}]},"Scen tillbehör":{products:[{id:"scentrapp-40-cm-",name:"Scentrapp (40 cm)",price:279},{id:"scentrapp-60-cm-",name:"Scentrapp (60 cm)",price:349},{id:"scenkjol-per-4-m-",name:"Scenkjol (per 4 m)",price:79},{id:"backdrop-3-5-2-5-m",name:"Backdrop 3,5×2,5 m",price:799}]},Ljud:{sub:{Portable:[{id:"portable-small",name:"Portable, Small",price:599},{id:"portable-small-plus",name:"Portable, Small+",price:699},{id:"portable-medium",name:"Portable, Medium",price:799},{id:"portable-medium-plus",name:"Portable, Medium+",price:999},{id:"portable-large",name:"Portable, Large",price:1199}],Event:[{id:"event-small",name:"Event, Small",price:799},{id:"event-small-plus",name:"Event, Small+",price:1199},{id:"event-medium",name:"Event, Medium",price:1599},{id:"event-medium-plus",name:"Event, Medium+",price:2299},{id:"event-large",name:"Event, Large",price:3199}],Music:[{id:"music-small",name:"Music, Small",price:999},{id:"music-small-plus",name:"Music, Small+",price:1299},{id:"music-medium",name:"Music, Medium",price:1799},{id:"music-large",name:"Music, Large",price:2699},{id:"music-xl",name:"Music, XL",price:3599},{id:"music-xxl",name:"Music, XXL",price:5499}],Live:[{id:"live-small",name:"Live, Small",price:599},{id:"live-medium",name:"Live, Medium",price:1199},{id:"live-large",name:"Live, Large",price:1999},{id:"live-xl",name:"Live, XL",price:3199}],Mixers:[{id:"mixer-2-2",name:"Mixerbord 2+2 kanaler",price:159},{id:"mixer-4-2",name:"Mixerbord 4+2 kanaler",price:199},{id:"mixer-4-4",name:"Mixerbord 4+4 kanaler",price:299},{id:"mixer-6-4",name:"Mixerbord 6+4 kanaler",price:349},{id:"mixer-12-4",name:"Mixerbord 12+4 kanaler",price:399},{id:"mixer-16-3",name:"Mixerbord 16+3 kanaler",price:599},{id:"mixer-ilive-t80",name:"Digitalt mixerbord 32+16 kanaler",price:2499}],Mikrofoner:[{id:"handmikrofon",name:"Handmikrofon",price:80},{id:"instrumentmikrofon",name:"Instrumentmikrofon",price:120},{id:"tr-dl-s-handmikrofon",name:"Trådlös handmikrofon",price:400},{id:"tr-dl-st-headset",name:"Trådlöst headset",price:480},{id:"shure-slxd-digitalt-tr-dl-st-system-2-mikrofoner",name:"Shure SLXD trådlöst system (2 mik)",price:1299},{id:"wireless-8ch",name:"Trådlöst mikrofonset, 8 kanaler",price:2999},{id:"mikrofonstativ",name:"Mikrofonstativ",price:60}],"Stativ & kablar":[{id:"h-gtalarstativ-gravity",name:"Högtalarstativ Gravity",price:40},{id:"h-gtalarstativ-k-m",name:"Högtalarstativ K&M",price:50},{id:"h-gtalarstativ-gravity-premium",name:"Högtalarstativ Gravity Premium",price:60},{id:"h-gtalarstativ-gravity-med-vev",name:"Högtalarstativ med vev",price:120},{id:"xlr-kablar",name:"XLR kablar",price:40},{id:"bluetooth-mottagare",name:"Bluetooth-mottagare",price:80}]}},Ljus:{sub:{"Färdiga paket":[{id:"ljus-small",name:"Ljuspaket, Small",price:399},{id:"ljus-small-plus",name:"Ljuspaket, Small+",price:599},{id:"ljus-small-pp",name:"Ljuspaket, Small++",price:799},{id:"ljus-medium",name:"Ljuspaket, Medium",price:1199},{id:"ljus-medium-plus",name:"Ljuspaket, Medium+",price:1299},{id:"ljus-medium-pp",name:"Ljuspaket, Medium++",price:1499},{id:"ljus-large",name:"Ljuspaket, Large",price:1699},{id:"ljus-large-plus",name:"Ljuspaket, Large+",price:2199},{id:"ljus-large-pp",name:"Ljuspaket, Large++",price:2699}],"Lösa effekter":[{id:"led-par",name:"LED PAR (14x8W RGBW)",price:79},{id:"led-par-9",name:"LED PAR (9x10W RGBW)",price:99},{id:"led-par-uv",name:"LED PAR UV",price:119},{id:"led-par-xl",name:"LED PAR XL (60x2W RGBW)",price:149},{id:"led-uppladdningsbar",name:"LED-armatur, uppladdningsbar",price:199}],"Rök & pyro":[{id:"rokmaskin-1500",name:"Rökmaskin (1500W)",price:349},{id:"rokmaskin-650",name:"Rökmaskin (650W)",price:449},{id:"kallgnist",name:"Kallgnistmaskin",price:499},{id:"konfetti",name:"Konfettiavfyrare",price:499}],"Stativ & tross":[{id:"stativ-400",name:"Stativ med T-bar (400 mm)",price:40},{id:"stativ-1200",name:"Stativ med T-bar (1200 mm)",price:40},{id:"stativ-900p",name:"Stativ med T-bar (900 mm, premium)",price:60},{id:"vevstativ-1200",name:"Vevstativ med T-bar (1200 mm)",price:120},{id:"tross-1m",name:"Trosstorn 1,0 m",price:300},{id:"tross-15m",name:"Trosstorn 1,5 m",price:360}]}},"Projektor & skärm":{products:[{id:"projektor-xga",name:"Projektor (XGA)",price:299},{id:"projektor-fhd",name:"Projektor (Full HD)",price:499},{id:"skarm-65",name:'Skärm 65"',price:399},{id:"skarm-75",name:'Skärm 75"',price:799},{id:"trailer-skarm",name:"Trailerupphängd skärm",price:1999}]},"Projektor tillbehör":{products:[{id:"projektorbord",name:"Projektorbord",price:160},{id:"projektorduk-100-",name:'Projektorduk 100"',price:400},{id:"golvstativ-65-75-",name:'Golvstativ 65"/75"',price:240},{id:"hdmi-kabel-5-m",name:"HDMI-kabel 5 m",price:48},{id:"hdmi-kabel-10-m",name:"HDMI-kabel 10 m",price:60},{id:"hdmi-splitter-4-port-",name:"HDMI-splitter (4-port)",price:400},{id:"mediaspelare-4k",name:"Mediaspelare 4K",price:400},{id:"scenmonitor-23-",name:'Scenmonitor 23"',price:480},{id:"usb-clicker-",name:"USB Clicker",price:60}]},"DJ-utrustning":{products:[{id:"dj-controller-numark",name:"DJ-controller Numark Mixstream Pro+",price:799},{id:"dj-controller-denon-go",name:"DJ-controller Denon Prime GO+",price:999},{id:"dj-controller-denon-prime4",name:"DJ-controller Denon Prime 4+",price:1499},{id:"dj-rane-system-one",name:"DJ-system Rane System One",price:1999},{id:"dj-bord",name:"DJ-bord",price:80},{id:"dj-bord2",name:"DJ-bord med paneler",price:200},{id:"scenengineer",name:"Hyr Scenengineer",price:952},{id:"media-editor",name:"Hyr Media-editor",price:952}]},"El & kabel":{products:[{id:"grenuttag-1-5-m",name:"Grenuttag 1,5 m",price:20},{id:"f-rl-ngningskabel-10-m",name:"Förlängningskabel 10 m",price:48},{id:"grenuttag-p-rulle-10-m",name:"Grenuttag på rulle 10 m",price:100},{id:"grenuttag-p-rulle-25-m",name:"Grenuttag på rulle 25 m",price:159}]},Tillägg:{products:[{id:"lev-standard",name:"Leverans & upphämtning (standard bil)",price:1118},{id:"lev-skrymmande",name:"Leverans & upphämtning (bil med släp)",price:1598},{id:"lev-lastbil",name:"Leverans & upphämtning (lätt lastbil)",price:2198},{id:"lev-bakgavel",name:"Leverans & upphämtning (lastbil med bakgavellift)",price:2998},{id:"rigg-teknik",name:"Teknikertjänst på plats (per tim)",price:600},{id:"montering",name:"Montering & demontering (per tim)",price:600},{id:"faktura",name:"Fakturaavgift",price:49}]},"Egen rad":{products:[{id:"custom",name:"Ange benämning och pris →",price:0,custom:!0}]}};n("new-quote-btn").addEventListener("click",()=>U(null));n("quote-close").addEventListener("click",I);n("quote-overlay").addEventListener("click",e=>{e.target===n("quote-overlay")&&I()});let u=[];function U(e){if(u=[],n("qc-name").value=e?.customer_name||"",n("qc-email").value=e?.customer_email||"",n("qc-phone").value=e?.customer_phone||"",n("qc-date").value=e?.event_date||"",n("qc-location").value=e?.event_location||"",n("qc-note").value="",n("quote-error").style.display="none",n("quote-send-btn").disabled=!1,n("quote-send-btn").textContent="✉ Skicka offert",e?.items?.length){e.items.filter(r=>!r._note).forEach(r=>{u.push({id:r.id||"",name:r.name,price:r.price||0,qty:r.qty||1})});const t=e.items.find(r=>r._note);t&&(n("qc-note").value=t.name)}const a=n("qp-cat");a.innerHTML='<option value="">— välj kategori —</option>'+Object.keys(C).map(t=>`<option value="${t}">${t}</option>`).join(""),n("qp-sub-wrap").style.display="none",n("qp-prod").innerHTML='<option value="">— välj kategori —</option>',_(),n("quote-overlay").classList.add("open"),n("qc-name").focus()}function X(e){U(e)}function I(){n("quote-overlay").classList.remove("open")}function qe(){const e=n("qp-cat").value,a=C[e],t=n("qp-sub-wrap"),r=n("qp-prod");if(!a){t.style.display="none",r.innerHTML='<option value="">— välj kategori —</option>';return}if(a.sub){const i=n("qp-sub");i.innerHTML='<option value="">— välj underkategori —</option>'+Object.keys(a.sub).map(s=>`<option value="${s}">${s}</option>`).join(""),t.style.display="",r.innerHTML='<option value="">— välj underkategori —</option>'}else t.style.display="none",ne(a.products)}function Le(){const e=n("qp-cat").value,a=n("qp-sub").value,t=C[e];!t?.sub||!a||ne(t.sub[a]||[])}function ne(e){const a=n("qp-prod");a.innerHTML='<option value="">— välj produkt —</option>'+e.map(t=>{const r=t.custom?"✏ Skriv in benämning och pris själv":`${t.name} — ${t.price.toLocaleString("sv")} kr`;return`<option value="${t.id}" data-price="${t.price}" data-name="${t.name.replace(/"/g,"&quot;")}" data-custom="${t.custom||!1}">${r}</option>`}).join("")}function Ee(){const e=n("qp-prod"),a=e.options[e.selectedIndex];if(!a||!a.value)return;if(a.dataset.custom==="true"){u.push({id:"custom-"+Date.now(),name:"",price:0,qty:1,custom:!0}),_(),setTimeout(()=>{const d=document.querySelectorAll(".quote-custom-name");d.length&&d[d.length-1].focus()},50);return}const r=a.dataset.name||a.textContent.split(" — ")[0],i=parseInt(a.dataset.price)||0,s=a.value,l=u.find(d=>d.id===s&&!d.custom);l?l.qty++:u.push({id:s,name:r,price:i,qty:1}),_(),e.selectedIndex=0}function _(){const e=n("quote-prod-tbody"),a=n("quote-prod-tfoot");if(!e)return;e.innerHTML=u.map((r,i)=>{const s=r.custom?`<input class="prod-input quote-custom-name" value="${r.name.replace(/"/g,"&quot;")}" placeholder="Ange benämning..." onchange="quoteEditName(${i},this.value)"
           style="width:100%;font-size:0.82rem;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border-radius:5px;border:1px solid rgba(196,181,244,0.3);padding:0.2rem 0.5rem;">`:`<span style="font-size:0.82rem">${r.name}</span>`;return`
    <tr data-qidx="${i}">
      <td>${s}</td>
      <td style="text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:3px">
          <button class="qty-btn" onclick="quoteQtyIdx(${i},-1)" style="width:22px;height:22px;font-size:0.9rem">−</button>
          <span style="min-width:24px;text-align:center;font-size:0.82rem">${r.qty}</span>
          <button class="qty-btn" onclick="quoteQtyIdx(${i},1)" style="width:22px;height:22px;font-size:0.9rem">＋</button>
        </div>
      </td>
      <td style="text-align:right">
        <input class="prod-input" value="${r.price}" onchange="quoteEditPrice(${i},this.value)"
          style="width:80px;text-align:right;font-size:0.82rem;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border-radius:5px;border:1px solid transparent;padding:0.2rem 0.4rem;">
      </td>
      <td style="text-align:right;font-size:0.82rem;font-weight:600;color:var(--brand-lav)">${m(r.price*r.qty)} kr</td>
      <td><button class="qty-btn" style="color:var(--red);border-color:var(--red);width:22px;height:22px" onclick="quoteDelIdx(${i})">×</button></td>
    </tr>`}).join("");const t=u.reduce((r,i)=>r+i.price*i.qty,0);a.innerHTML=u.length?`<tr><td colspan="3" style="font-weight:700;padding-top:0.5rem;font-size:0.82rem">Totalt (exkl. moms)</td>
       <td style="text-align:right;font-weight:700;color:var(--brand-lav);font-size:0.82rem">${m(t)} kr</td><td></td></tr>
       <tr><td colspan="3" style="color:var(--text-faint);font-size:0.72rem">Inkl. 25% moms</td>
       <td style="text-align:right;color:var(--text-muted);font-size:0.72rem">${m(Math.round(t*1.25))} kr</td><td></td></tr>`:""}function Te(e,a){u[e]&&(u[e].qty=Math.max(1,u[e].qty+a),_())}function Me(e,a){u[e]&&(u[e].name=a)}function je(e,a){u[e]&&(u[e].price=parseFloat(a)||0,_())}function Pe(e){u.splice(e,1),_()}async function ze(){const e=n("qc-name").value.trim(),a=n("qc-email").value.trim(),t=n("quote-error");if(t.style.display="none",!e){t.textContent="Namn krävs.",t.style.display="block",n("qc-name").focus();return}if(!a||!a.includes("@")){t.textContent="Giltig e-post krävs.",t.style.display="block",n("qc-email").focus();return}if(u.length===0){t.textContent="Lägg till minst en produkt.",t.style.display="block";return}const r=n("quote-send-btn");r.disabled=!0,r.textContent="⏳ Skickar…";const i={customer:{name:e,email:a,phone:n("qc-phone").value.trim()||null,date:n("qc-date").value||null,location:n("qc-location").value.trim()||null},items:u,note:n("qc-note").value.trim()||null};try{const{ok:s,data:l}=await v("admin-send-quote",{method:"POST",body:JSON.stringify(i)});s?(I(),c(`Offert skickad till ${a}! 🎉`),o?.id&&o.status==="open"&&(await v("cart-update",{method:"POST",body:JSON.stringify({cart_id:o.id,status:"waiting"})}),o.status="waiting"),b()):(t.textContent=l?.error||"Kunde inte skicka offert.",t.style.display="block",r.disabled=!1,r.textContent="✉ Skicka offert")}catch{t.textContent="Nätverksfel — försök igen.",t.style.display="block",r.disabled=!1,r.textContent="✉ Skicka offert"}}n("panel-close").addEventListener("click",q);n("detail-overlay").addEventListener("click",q);document.addEventListener("keydown",e=>e.key==="Escape"&&q());function q(){n("detail-overlay").classList.remove("open"),n("detail-panel").classList.remove("open"),o=null}n("cal-prev").addEventListener("click",()=>{--k<0&&(k=11,h--),P()});n("cal-next").addEventListener("click",()=>{++k>11&&(k=0,h++),P()});n("cal-today").addEventListener("click",()=>{h=new Date().getFullYear(),k=new Date().getMonth(),P()});function P(){const e=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];n("cal-month-label").textContent=`${e[k]} ${h}`;const a=new Date(h,k,1),t=new Date(h,k+1,0),r=new Date;let i=a.getDay()-1;i<0&&(i=6);const s=n("cal-days");s.innerHTML="";const l=Math.ceil((i+t.getDate())/7)*7;for(let d=0;d<l;d++){const p=d-i+1,y=new Date(h,k,p),E=p<1||p>t.getDate(),A=!E&&y.toDateString()===r.toDateString(),F=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}-${String(y.getDate()).padStart(2,"0")}`,N=J.filter(f=>f.event_date===F&&f.status!=="cancelled"),w=document.createElement("div");w.className=`cal-day${E?" other-month":""}${A?" today":""}`,w.innerHTML=`<div class="cal-day-num">${y.getDate()}</div>
      ${N.map(f=>`
        <div class="cal-event s-${f.status}" data-id="${f.id}">
          ${M[f.status]?.icon} ${f.customer_name||f.id}
        </div>`).join("")}`,w.querySelectorAll(".cal-event").forEach(f=>{f.addEventListener("click",$=>{$.stopPropagation(),Q(f.dataset.id)})}),s.appendChild(w)}}n("refresh-btn").addEventListener("click",()=>{b(),c("Uppdaterat!")});function De(){clearInterval(W),W=setInterval(b,3e4)}de();window.prodQty=ce;window.prodDelete=pe;window.prodAddRow=ue;window.prodSave=te;window.renderTab=g;window.prodTogglePopout=ye;window.prodAddFromCatalog=be;window.prodAddFreeRow=ke;window.prodUpdateSvc=he;window.prodSaveAndSendOffer=xe;window.invMarkPaid=re;window.invSendEmail=_e;window.invSaveFields=ae;window.openPanel=Q;window.closePanel=q;window.sendMessage=H;window.confirmOrder=K;window.cancelOrder=z;window.notifyCustomer=D;window.quotePickerCat=qe;window.quotePickerSub=Le;window.quotePickerAdd=Ee;window.quoteQtyIdx=Te;window.quoteEditName=Me;window.quoteEditPrice=je;window.quoteDelIdx=Pe;window.sendQuote=ze;window.closeQuoteModal=I;window.openQuoteModal=U;window.openQuoteModalForCart=X;
