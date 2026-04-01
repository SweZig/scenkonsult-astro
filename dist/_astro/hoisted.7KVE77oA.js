let O="",J=[],s=null,$=[],H=[],T="info",w=new Date().getFullYear(),x=new Date().getMonth(),X=null;const n=e=>document.getElementById(e),u=e=>typeof e=="number"?e.toLocaleString("sv-SE"):"–",W=e=>e?new Date(e).toLocaleDateString("sv-SE"):"–",S=e=>e?new Date(e).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short",hour12:!1}):"–";function c(e,t="success"){const a=n("toast");a.textContent=(t==="success"?"✓ ":"✕ ")+e,a.className=`show ${t}`,clearTimeout(a._t),a._t=setTimeout(()=>a.className="",3e3)}const j={open:{icon:"📬",label:"Inkommen",cls:"s-open"},proposal:{icon:"📤",label:"Offert skickad",cls:"s-proposal"},waiting:{icon:"⏳",label:"Väntar svar",cls:"s-waiting"},confirmed:{icon:"✅",label:"Bekräftad",cls:"s-confirmed"},fakturerad:{icon:"🧾",label:"Fakturerad",cls:"s-fakturerad"},betald:{icon:"💚",label:"Betald",cls:"s-betald"},cancelled:{icon:"❌",label:"Avbruten",cls:"s-cancelled"}};function ie(){let e=sessionStorage.getItem("sk_admin_token");if(!e)try{const t=JSON.parse(localStorage.getItem("sk_admin_mode")||"{}"),a=8*60*60*1e3;t.token&&t.ts&&Date.now()-t.ts<a&&(e=t.token,sessionStorage.setItem("sk_admin_token",e))}catch{}e&&(O=e,Z())}n("login-pw").addEventListener("keydown",e=>e.key==="Enter"&&Y());n("login-btn").addEventListener("click",Y);function Y(){const e=n("login-pw").value.trim();e&&(O=e,sessionStorage.setItem("sk_admin_token",e),localStorage.setItem("sk_admin_mode",JSON.stringify({ts:Date.now(),token:e})),Z())}function Z(){n("login-screen").style.display="none",n("app").style.display="flex",y(),Pe()}n("logout-btn").addEventListener("click",()=>{sessionStorage.removeItem("sk_admin_token"),localStorage.removeItem("sk_admin_mode"),location.reload()});document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),e.classList.add("active");const t=e.dataset.view;n(`view-${t}`).classList.add("active"),t==="calendar"&&z()})});async function g(e,t={}){const a=await fetch(`/.netlify/functions/${e}`,{...t,headers:{"Content-Type":"application/json",Authorization:`Bearer ${O}`,...t.headers||{}}}),r=await a.json();if(a.status===401)throw sessionStorage.removeItem("sk_admin_token"),O="",n("app").style.display="none",n("login-screen").style.display="flex",n("login-error").style.display="block",n("login-error").textContent="Fel lösenord, försök igen.",n("login-pw").value="",n("login-pw").focus(),new Error("Unauthorized");return{ok:a.ok,status:a.status,data:r}}async function y(){const{ok:e,data:t}=await g("admin-carts");if(!e){if(t.error==="Ej behörig"){n("login-error").style.display="block",n("login-error").textContent="Fel lösenord.",n("app").style.display="none",n("login-screen").style.display="flex",sessionStorage.removeItem("sk_admin_token");return}c("Kunde inte hämta varukorgar","error");return}J=t.carts||[];const a=t.summary?.total_unread||0,r=n("global-unread");a>0?(r.style.display="inline",r.textContent=`${a} nya`):r.style.display="none",R(),n("view-calendar").classList.contains("active")&&z()}function oe(){const e=n("filter-search").value.toLowerCase().trim(),t=n("filter-from").value,a=n("filter-to").value;return J.filter(r=>!(e&&!((r.customer_name||"").toLowerCase().includes(e)||(r.id||"").toLowerCase().includes(e))||t&&r.event_date&&r.event_date<t||a&&r.event_date&&r.event_date>a))}["filter-search","filter-from","filter-to"].forEach(e=>{n(e).addEventListener("input",R)});function R(){const e=oe(),t=["open","proposal","waiting","confirmed","fakturerad","betald","cancelled"],a=n("kanban-board");a.innerHTML=t.map(r=>{const i=j[r],d=e.filter(o=>o.status===r);return`
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="col-title ${i.cls}">${i.icon} ${i.label}</div>
          <div class="col-count">${d.length}</div>
        </div>
        <div class="kanban-cards">
          ${d.length===0?'<div class="empty-col">Tom</div>':d.map(o=>se(o)).join("")}
        </div>
      </div>`}).join(""),a.onclick=r=>{const i=r.target.closest(".cart-card");i&&Q(i.dataset.id)}}function se(e){const t=e.total_excl?u(Math.round(e.total_excl/100))+" kr":"–",a=e.unread_count>0?`<span class="unread-pill">💬 ${e.unread_count} ny${e.unread_count>1?"a":"t"}</span>`:"",r=e.created_at?Math.floor((Date.now()-new Date(e.created_at))/864e5):null,i=r===0?"Idag":r===1?"Igår":r!=null?`${r} dagar sedan`:"";return`
    <div class="cart-card" data-id="${e.id}">
      <div class="cart-card-name">${e.customer_name||"Okänd kund"}</div>
      <div class="cart-card-sub">${e.customer_email||""}</div>
      <div class="cart-card-meta">
        ${e.event_date?`<span>📅 ${W(e.event_date)}</span>`:""}
        ${e.event_location?`<span>📍 ${e.event_location}</span>`:""}
        ${i?`<span>🕐 ${i}</span>`:""}
      </div>
      <div class="cart-card-footer">
        <span class="cart-card-price">${t}</span>
        ${a}
      </div>
    </div>`}async function Q(e){s=null,$=[],H=[],T="info";const t=n("detail-overlay"),a=n("detail-panel");t.classList.add("open"),a.classList.add("open"),n("panel-body").innerHTML='<div class="loading-center"><div class="spinner"></div></div>',n("panel-footer").innerHTML="",n("panel-title").textContent="Laddar…";let r,i;try{({ok:r,data:i}=await g(`admin-carts?id=${e}`))}catch(v){c("Kunde inte ladda varukorg: "+v.message,"error"),q();return}if(!r){c("Kunde inte ladda varukorg","error"),q();return}s=i.cart,$=i.messages||[],H=i.audit_log||[],n("panel-title").textContent=`${s.customer_name||"Okänd"} — ${s.id}`;const d=document.getElementById("panel-quick");d&&d.remove();const o=$.filter(v=>v.sender==="customer"&&!v.read_at).length,l=n("chat-unread-badge");o>0?(l.style.display="inline",l.textContent=o):l.style.display="none",ee(),f("info"),L()}function ee(){document.querySelectorAll(".panel-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===T),e.onclick=()=>{T=e.dataset.tab,ee(),f(T)}})}function f(e){const t=n("panel-body");e==="info"&&(t.innerHTML=pe()),e==="products"&&(t.innerHTML=fe()),e==="faktura"&&(t.innerHTML=we()),requestAnimationFrame(()=>{document.querySelectorAll(".status-select, .admin-note-area, .prod-input, .chat-textarea").forEach(a=>{a.style.setProperty("background","#221f50","important"),a.style.setProperty("color","#f0eeff","important"),a.style.setProperty("color-scheme","dark","important"),(a.tagName==="SELECT"||a.classList.contains("admin-note-area"))&&a.style.setProperty("border","1px solid rgba(196,181,244,0.25)","important")})}),e==="chat"&&xe(),e==="log"&&(t.innerHTML=he()),e==="info"&&(n("status-select")?.addEventListener("change",async a=>{const r=a.target.value;if(!confirm(`Ändra status till "${j[r]?.label}"?`)){a.target.value=s.status;return}const{ok:i}=await g("cart-update",{method:"POST",body:JSON.stringify({cart_id:s.id,status:r})});i?(s.status=r,c("Status uppdaterad!"),y(),L()):c("Fel vid statusändring","error")}),document.querySelectorAll('input[name="ctype"]').forEach(a=>{a.addEventListener("change",()=>{const r=document.querySelector('input[name="ctype"]:checked')?.value==="b2b",i=document.getElementById("b2b-fields");i&&(i.style.display=r?"grid":"none")})}),n("save-info-btn")?.addEventListener("click",async()=>{const a=n("save-info-btn");a.disabled=!0,a.textContent="⏳ Sparar…";const r={cart_id:s.id,customer_name:n("edit-name")?.value.trim()||null,customer_email:n("edit-email")?.value.trim()||null,customer_phone:n("edit-phone")?.value.trim()||null,event_date:n("edit-date")?.value||null,event_location:n("edit-location")?.value.trim()||null,customer_type:document.querySelector('input[name="ctype"]:checked')?.value||"b2c",customer_address:n("edit-address")?.value.trim()||null,customer_orgnr:n("edit-orgnr")?.value.trim()||null,customer_ref:n("edit-custref")?.value.trim()||null},{ok:i}=await g("cart-update",{method:"POST",body:JSON.stringify(r)});i?(Object.assign(s,{customer_name:r.customer_name,customer_email:r.customer_email,customer_phone:r.customer_phone,event_date:r.event_date,event_location:r.event_location,customer_type:r.customer_type,customer_address:r.customer_address,customer_orgnr:r.customer_orgnr,customer_ref:r.customer_ref}),n("panel-title").textContent=`${s.customer_name||"Okänd"} — ${s.id}`,c("Kunduppgifter sparade!"),y()):c("Kunde inte spara","error"),a.disabled=!1,a.textContent="💾 Spara kunduppgifter"}),n("save-notes-btn")?.addEventListener("click",async()=>{const a=n("admin-notes").value,{ok:r}=await g("cart-update",{method:"POST",body:JSON.stringify({cart_id:s.id,notes_admin:a})});r?(s.notes_admin=a,c("Anteckning sparad!")):c("Kunde inte spara","error")})),e==="chat"&&(n("chat-send-btn")?.addEventListener("click",K),n("chat-input")?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.ctrlKey||a.metaKey)&&K()}))}function P(){const e=document.querySelectorAll("#prod-tbody .prod-row");return Array.from(e).map(t=>{const a=d=>t.querySelector(`[data-field="${d}"]`)?.value?.trim()||"",r=parseInt(a("qty"))||1,i=parseFloat(a("price"))||0;return{id:a("id"),name:a("name"),category:a("category"),qty:r,price:i}}).filter(t=>t.name)}function G(e){const t=document.querySelector(`[data-idx="${e}"]`);if(!t)return;const a=parseInt(t.querySelector('[data-field="qty"]')?.value)||1,r=parseFloat(t.querySelector('[data-field="price"]')?.value)||0,i=document.getElementById(`prod-sum-${e}`);i&&(i.textContent=u(a*r));const o=P().reduce((v,m)=>v+m.price*m.qty,0),l=document.getElementById("prod-tfoot");l&&(l.innerHTML=`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${u(o)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${u(Math.round(o*1.25))} kr</td><td></td></tr>`)}document.addEventListener("input",e=>{if(e.target.matches(".prod-qty, .prod-price")){const t=e.target.dataset.idx;t!==void 0&&G(t)}});function de(e,t){const a=document.querySelector(`[data-field="qty"][data-idx="${e}"]`);if(!a)return;const r=Math.max(1,(parseInt(a.value)||1)+t);a.value=r,G(e)}function le(e){const t=document.querySelector(`[data-idx="${e}"]`)?.closest("tr");t&&(t.remove(),G(-1))}function ce(){const e=document.getElementById("prod-tbody");if(!e)return;const t=Date.now(),a=document.createElement("tr");a.className="prod-row",a.dataset.idx=t,a.innerHTML=`
    <td>
      <input class="prod-input prod-name" value="" placeholder="Produktnamn" data-field="name" data-idx="${t}" style="width:100%;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="" placeholder="Kategori" data-field="category" data-idx="${t}" style="width:55%;font-size:0.72rem;margin-top:3px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="" placeholder="ID (valfri)" data-field="id" data-idx="${t}" style="width:40%;font-size:0.72rem;margin-top:3px;margin-left:3%;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:center;vertical-align:top;padding-top:0.75rem">
      <div style="display:flex;align-items:center;justify-content:center;gap:4px">
        <button class="qty-btn" onclick="prodQty(${t},-1)">−</button>
        <input class="prod-input prod-qty" value="1" data-field="qty" data-idx="${t}" style="width:44px;text-align:center;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
        <button class="qty-btn" onclick="prodQty(${t},1)">＋</button>
      </div>
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem">
      <input class="prod-input prod-price" value="0" data-field="price" data-idx="${t}" style="width:90px;text-align:right;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem;font-weight:600;color:var(--brand-lav)" id="prod-sum-${t}">0</td>
    <td style="vertical-align:top;padding-top:0.75rem">
      <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${t})" title="Ta bort">×</button>
    </td>`,e.appendChild(a),a.querySelectorAll(".prod-input").forEach(r=>{r.style.setProperty("background","#221f50","important"),r.style.setProperty("color","#f0eeff","important"),r.style.setProperty("color-scheme","dark","important")}),a.querySelector(".prod-name")?.focus()}async function te(){const e=document.getElementById("save-items-btn"),t=document.getElementById("prod-save-status"),a=P(),r=["Tjänster","Tillägg"],i=(s.items||[]).filter(m=>r.includes(m.category)),d=[...a,...i];e&&(e.disabled=!0,e.textContent="⏳ Sparar…");const o=document.getElementById("prod-note")?.value?.trim()||"";o&&d.push({_note:!0,id:"_note",name:o,price:0,qty:1});const l=Math.round(a.filter(m=>!m._note).reduce((m,h)=>m+h.price*h.qty,0)*100),{ok:v}=await g("cart-update",{method:"POST",body:JSON.stringify({cart_id:s.id,items:d,total_excl:l})});v?(s.items=d,s.total_excl=l,t&&(t.textContent="✓ Sparat",t.style.color="var(--green)"),setTimeout(()=>{t&&(t.textContent="")},3e3),c("Produkter uppdaterade!"),R()):(t&&(t.textContent="✗ Fel – kontrollera konsolen",t.style.color="var(--red)"),c("Kunde inte spara","error")),e&&(e.disabled=!1,e.textContent="💾 Spara produkter")}function pe(){const e=s,t=j[e.status];return`
    <div class="section-label">Status</div>
    <div class="status-row">
      <select class="status-select" id="status-select" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;padding-right:2.25rem">
        ${Object.entries(j).map(([a,r])=>`<option value="${a}" ${a===e.status?"selected":""}>${r.icon} ${r.label}</option>`).join("")}
      </select>
      <span class="${t.cls}" style="font-size:0.85rem;font-weight:600;">${t.icon} ${t.label}</span>
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
      <div class="info-field"><div class="info-field-label">Skapad</div><div class="info-field-value" style="font-size:0.8rem">${S(e.created_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Uppdaterad</div><div class="info-field-value" style="font-size:0.8rem">${S(e.updated_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Kund senast aktiv</div><div class="info-field-value" style="font-size:0.8rem">${S(e.last_read_customer)}</div></div>
      <div class="info-field"><div class="info-field-label">Utgår</div><div class="info-field-value" style="font-size:0.8rem;color:${e.expires_at?"var(--amber)":"var(--green)"}">${e.expires_at?W(e.expires_at):"♾ Bekräftad"}</div></div>
    </div>

    <div class="section-label">Intern anteckning (visas ej för kund)</div>
    <textarea class="admin-note-area" id="admin-notes" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;" placeholder="Anteckna priser, tillgänglighet, intern kommunikation...">${e.notes_admin||""}</textarea>
    <button class="btn-action" id="save-notes-btn" style="margin-top:0.75rem">💾 Spara anteckning</button>
  `}function me(){let e='<option value="">+ Välj produkt att lägga till</option>';return Object.entries(I).forEach(([t,a])=>{a.products?(e+=`<optgroup label="${t}">`,a.products.forEach(r=>{const i=JSON.stringify({id:r.id,name:r.name,price:r.price,category:t}).replace(/"/g,"&quot;");e+=`<option value="${i}">${r.name} — ${u(r.price)} kr</option>`}),e+="</optgroup>"):a.sub&&Object.entries(a.sub).forEach(([r,i])=>{e+=`<optgroup label="${t} — ${r}">`,i.forEach(d=>{const o=JSON.stringify({id:d.id,name:d.name,price:d.price,category:`${t} — ${r}`}).replace(/"/g,"&quot;");e+=`<option value="${o}">${d.name} — ${u(d.price)} kr</option>`}),e+="</optgroup>"})}),e}function ue(e){const t=(e||"").toLowerCase();return t.includes("scen")?{icon:"🎪",color:"var(--blue)"}:t.includes("ljud")?{icon:"🔊",color:"var(--green)"}:t.includes("ljus")?{icon:"💡",color:"var(--amber)"}:t.includes("dj")?{icon:"🎧",color:"var(--brand-lav)"}:t.includes("bild")?{icon:"📽",color:"var(--blue)"}:t.includes("tjänst")||t.includes("leverans")||t.includes("montering")?{icon:"🚚",color:"var(--gray)"}:{icon:"📦",color:"var(--gray)"}}function fe(){const e=s.items||[],t=e.find(o=>o._note),a=["Tjänster","Tillägg"],r=e.filter(o=>!o._note&&!a.includes(o.category)),i=r.reduce((o,l)=>o+(l.price||0)*(l.qty||l.quantity||1),0),d=r.map((o,l)=>{const v=o.qty||o.quantity||1,m=o.price||0,h=v*m,{icon:F,color:B}=ue(o.category),E=o.id||"",k=typeof PROD_DESC<"u"&&PROD_DESC[E]?PROD_DESC[E]:null,b=k?`<div style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;margin-top:4px">${k.desc||""}</div>${k.includes?.length?'<ul style="font-size:0.72rem;color:var(--text-faint);padding-left:14px;margin-top:3px">'+k.includes.map(N=>`<li>${N}</li>`).join("")+"</ul>":""}`:`<div style="font-size:0.78rem;color:var(--text-faint);margin-top:4px">Artno: ${E||"–"} · Kategori: ${o.category||"–"}</div>`;return`<tr data-idx="${l}" class="prod-row">
      <td style="vertical-align:top;padding:8px 6px">
        <div style="display:flex;align-items:flex-start;gap:6px">
          <button onclick="prodTogglePopout(${l})" style="flex-shrink:0;width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:rgba(0,0,0,.2);color:${B};cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center" title="Produktinfo">${F}</button>
          <div style="flex:1;min-width:0">
            <input class="prod-input prod-name" value="${(o.name||"").replace(/"/g,"&quot;")}" placeholder="Produktnamn" data-field="name" data-idx="${l}" style="width:100%;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
            <div id="po-${l}" style="display:none">${b}</div>
          </div>
        </div>
      </td>
      <td style="text-align:center;vertical-align:top;padding-top:10px">
        <div style="display:flex;align-items:center;justify-content:center;gap:2px">
          <button class="qty-btn" onclick="prodQty(${l},-1)">−</button>
          <input class="prod-input prod-qty" value="${v}" data-field="qty" data-idx="${l}" style="width:38px;text-align:center;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
          <button class="qty-btn" onclick="prodQty(${l},1)">＋</button>
        </div>
      </td>
      <td style="text-align:right;vertical-align:top;padding-top:10px">
        <input class="prod-input prod-price" value="${m}" data-field="price" data-idx="${l}" style="width:78px;text-align:right;font-size:0.85rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      </td>
      <td style="text-align:right;vertical-align:top;padding-top:10px;font-weight:600;color:var(--brand-lav);font-size:0.85rem" id="prod-sum-${l}">${u(h)} kr</td>
      <td style="vertical-align:top;padding-top:10px">
        <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${l})" title="Ta bort">×</button>
      </td>
    </tr>`}).join("");return`
    <div class="section-label">Produkter (${r.length} st)</div>
    <table class="product-table" id="prod-edit-table">
      <thead><tr>
        <th>Produkt</th>
        <th style="text-align:center;width:88px">Antal</th>
        <th style="text-align:right;width:80px">à-pris</th>
        <th style="text-align:right;width:80px">Summa</th>
        <th style="width:28px"></th>
      </tr></thead>
      <tbody id="prod-tbody">${d}</tbody>
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
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-muted);margin-bottom:3px"><span>Produkter exkl. moms</span><span>${u(i)} kr</span></div>
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-muted);margin-bottom:3px"><span>Moms 25%</span><span>${u(Math.round(i*.25))} kr</span></div>
      <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:var(--brand-lav)"><span>Inkl. moms</span><span>${u(Math.round(i*1.25))} kr</span></div>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-action" onclick="prodSave()" style="flex:1">💾 Spara</button>
      <button class="btn-action" onclick="prodSaveAndSendOffer()" style="flex:1;border-color:var(--brand-lav);color:var(--brand-lav)">📤 Spara & skicka offert</button>
    </div>
    <div style="margin-top:6px">
      <div class="section-label" style="margin-top:0">Anmärkningar till kund</div>
      <textarea class="admin-note-area" id="prod-note" rows="2"
        style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;min-height:55px"
        placeholder="Leveransinfo, prisvillkor…">${t?.name||""}</textarea>
    </div>
  `}function ve(e){const t=document.getElementById("po-"+e);t&&(t.style.display=t.style.display==="none"?"block":"none")}function ge(e){if(e.value)try{const t=JSON.parse(e.value.replace(/&quot;/g,'"')),a=P();a.push({id:t.id||"",name:t.name||"",price:t.price||0,qty:1,category:t.category||""}),s.items=a,f("products")}catch{c("Fel vid tillägg","error")}}function be(){const e=P();e.push({id:"",name:"",price:0,qty:1,category:""}),s.items=e,f("products")}function ye(){const e=P().filter(a=>!["lev-standard","lev-skrymmande","lev-lastbil","lev-standard-e","montering","fakturaavgift","lev-standard-e","lev-skrymmande-e","lev-lastbil-e"].some(r=>a.id===r||a.id===r+"-e")),t=a=>{const r=document.getElementById(a);if(!r||!r.value)return;const[i,d,o]=r.value.split("|");i&&d&&e.push({id:o,name:i,price:parseInt(d),qty:1,category:"Tjänster"})};t("svc-leverans"),t("svc-montering"),t("svc-faktura"),s.items=e,f("products")}async function ke(){await te(),V(s)}function xe(){const e=n("panel-body"),t=$,a=t.length===0?'<div class="chat-empty">Ingen chatt ännu.</div>':`<div class="chat-messages">${t.map(r=>{const i=r.sender==="admin"?r.read_at?`<span class="read-check">✓✓</span> Läst ${S(r.read_at)}`:"⏳ Inte läst":r.read_at?`Läst ${S(r.read_at)}`:"";return`
          <div class="msg-wrap ${r.sender}">
            <div class="msg-bubble">${r.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--brand-lav)">$1</a>')}</div>
            <div class="msg-meta">
              <span>${r.sender==="admin"?"👤 Du":"🧑 Kund"} · ${S(r.created_at)}</span>
              ${i?`<span>${i}</span>`:""}
            </div>
          </div>`}).join("")}</div>`;e.innerHTML=`
    ${a}
    <div class="section-label">Nytt meddelande till kund</div>
    <div class="chat-input-wrap">
      <textarea class="chat-textarea" id="chat-input" placeholder="Skriv ett meddelande… (Ctrl+Enter för att skicka)"></textarea>
      <button class="chat-send-btn" id="chat-send-btn">Skicka till kund →</button>
    </div>`,setTimeout(()=>{const r=e.querySelector(".chat-messages");r&&(r.scrollTop=r.scrollHeight),e.scrollTop=e.scrollHeight},50)}async function K(){const e=n("chat-input"),t=n("chat-send-btn"),a=e?.value.trim();if(!a)return;t.disabled=!0,t.textContent="Skickar…";const{ok:r,data:i}=await g("cart-message",{method:"POST",body:JSON.stringify({cart_id:s.id,body:a})});r?($.push({id:i.message?.id||Date.now(),cart_id:s.id,sender:"admin",body:a,read_at:null,created_at:new Date().toISOString()}),e.value="",f("chat"),c("Meddelande skickat!"),y()):(c(i.error||"Kunde inte skicka","error"),t.disabled=!1,t.textContent="Skicka till kund →")}function he(){const e=H;return e.length===0?'<div class="empty-col" style="padding:3rem">Ingen logg ännu.</div>':`
    <div class="section-label">Händelselogg (senaste 50)</div>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${e.map(t=>`
        <div style="background:var(--bg);border-radius:8px;padding:0.75rem;display:flex;gap:1rem;align-items:flex-start">
          <div style="font-size:0.75rem;color:var(--text-faint);white-space:nowrap;min-width:130px">${S(t.created_at)}</div>
          <div>
            <div style="font-size:0.85rem;font-weight:600">${t.event_type}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${t.actor} ${t.payload&&Object.keys(t.payload).length?"· "+JSON.stringify(t.payload):""}</div>
          </div>
        </div>`).join("")}
    </div>`}function we(){const e=s,a=(e.items||[]).filter(o=>!o._note).reduce((o,l)=>o+(l.price||0)*(l.qty||1),0),r=e.invoice_number||"— (ej skapad)",i=!!e.invoice_paid_at,d=!!e.invoice_sent_at;return`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <span style="font-size:1rem;font-weight:700;color:var(--brand-lav)">${r}</span>
      ${i?'<span class="s-betald" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">💚 Betald</span>':d?'<span class="s-fakturerad" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">🧾 Skickad</span>':'<span class="s-waiting" style="font-size:0.75rem;padding:2px 8px;border-radius:20px">⏳ Ej skickad</span>'}
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
      <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--text-muted)"><span>Produkter & tjänster exkl. moms</span><span>${u(a)} kr</span></div>
      <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--text-muted)"><span>Moms 25%</span><span>${u(Math.round(a*.25))} kr</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;font-size:0.95rem;color:var(--brand-lav);border-top:1px solid var(--border);margin-top:4px"><span>Att betala inkl. moms</span><span>${u(Math.round(a*1.25))} kr</span></div>
    </div>

    <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn-action" onclick="invSaveFields()" style="font-size:0.8rem">💾 Spara uppgifter</button>
      <button class="btn-action" onclick="toast('PDF-generering kommer i nästa version','error')" style="font-size:0.8rem">🖨 Förhandsgranska PDF</button>
      <button class="btn-action" onclick="invSendEmail()" style="font-size:0.8rem;border-color:var(--brand-lav);color:var(--brand-lav)">📧 Skicka faktura via mail</button>
      ${i?"":'<button class="btn-action btn-success" onclick="invMarkPaid()" style="font-size:0.8rem">💚 Markera betald</button>'}
    </div>
  `}async function ae(){const e={cart_id:s.id,invoice_date:document.getElementById("inv-date")?.value||null,invoice_due_date:document.getElementById("inv-due")?.value||null,payment_terms_days:parseInt(document.getElementById("inv-terms")?.value||"5")},{ok:t}=await g("cart-update",{method:"POST",body:JSON.stringify(e)});t?(Object.assign(s,e),c("Fakturauppgifter sparade!"),f("faktura")):c("Kunde inte spara","error")}async function Se(){if(!s.customer_email){c("Kunden saknar e-postadress","error");return}if(!confirm(`Skicka faktura till ${s.customer_email}?`))return;await ae().catch(()=>{});const e=document.querySelector('[onclick="invSendEmail()"]');e&&(e.disabled=!0,e.textContent="⏳ Genererar PDF…");try{const{ok:t,data:a}=await g("invoice-send",{method:"POST",body:JSON.stringify({cart_id:s.id})});t&&a.ok?(s.status="fakturerad",s.invoice_sent_at=new Date().toISOString(),s.invoice_number=a.invoice_number,c(`Faktura ${a.invoice_number} skickad! 📧`),y(),f("faktura"),L()):c(a?.error||"Fel vid utskick","error")}catch(t){c("Nätverksfel: "+t.message,"error")}finally{e&&(e.disabled=!1,e.textContent="📧 Skicka faktura via mail")}}async function re(){if(!confirm("Markera ordern som betald?"))return;const e=new Date().toISOString(),{ok:t}=await g("cart-update",{method:"POST",body:JSON.stringify({cart_id:s.id,status:"betald",invoice_paid_at:e})});t?(s.status="betald",s.invoice_paid_at=e,c("Order markerad som betald! 💚"),y(),f("faktura"),L()):c("Fel vid markering","error")}function L(){const e=s,t=n("panel-footer");t.innerHTML="";const a=(r,i,d)=>{const o=document.createElement("button");o.className=`btn-action ${i}`,o.textContent=r,o.onclick=d,t.appendChild(o)};e.status==="open"?(a("📤 Skapa & skicka offert","btn-success",()=>{f("products")}),a("❌ Avvisa","btn-danger",M)):e.status==="proposal"?(a("✅ Bekräfta order","btn-success",D),a("📦 Justera produkter","",()=>f("products")),a("❌ Avbryt","btn-danger",M)):e.status==="waiting"?(a("✅ Bekräfta order","btn-success",D),a("📩 Påminn kund","",C),a("❌ Avbryt","btn-danger",M)):e.status==="confirmed"?(a("🧾 Skapa faktura","btn-success",()=>f("faktura")),a("📩 Skicka notis","",C)):e.status==="fakturerad"?(a("💚 Markera betald","btn-success",re),a("📩 Påminn om betalning","",C)):e.status==="betald"||e.status!=="cancelled"&&(a("✅ Bekräfta order","btn-success",D),a("📤 Skicka offert","",()=>V(e)),a("❌ Avbryt","btn-danger",M)),e.cart_token&&a("🔗 Kopiera kundlänk","",()=>{const r=`https://scenkonsult.se/order/?cart=${e.id}&token=${e.cart_token}`;navigator.clipboard.writeText(r),c("Kundlänk kopierad!")})}async function D(){if(!confirm("Bekräfta ordern? Status ändras till Orderbekräftelse och TTL tas bort."))return;const{ok:e}=await g("cart-update",{method:"POST",body:JSON.stringify({cart_id:s.id,status:"confirmed"})});e?(s.status="confirmed",c("Order bekräftad! ✅"),y(),f("info"),L()):c("Fel vid bekräftelse","error")}async function M(){if(!confirm("Avbryt ordern? Den sparas i 90 dagar."))return;const{ok:e}=await g("cart-update",{method:"POST",body:JSON.stringify({cart_id:s.id,status:"cancelled"})});e?(s.status="cancelled",c("Order avbruten"),await y(),f("info"),L()):c("Fel vid avbrytning","error")}async function C(){const e=prompt("Meddelande till kund (skickas via e-post):");if(!e?.trim())return;const{ok:t}=await g("cart-message",{method:"POST",body:JSON.stringify({cart_id:s.id,body:e.trim()})});t?(c("Notis skickad till kund! 📩"),$.push({id:Date.now(),cart_id:s.id,sender:"admin",body:e.trim(),read_at:null,created_at:new Date().toISOString()}),T==="chat"&&f("chat")):c("Kunde inte skicka notis","error")}const I={Scen:{products:[{id:"small",name:"Scenpaket Small",price:599},{id:"small-plus",name:"Scenpaket Small+",price:899},{id:"small-plusplus",name:"Scenpaket Small++",price:1199},{id:"medium",name:"Scenpaket Medium",price:1499},{id:"medium-plus",name:"Scenpaket Medium+",price:1799},{id:"medium-plusplus",name:"Scenpaket Medium++",price:2399},{id:"medium-plus-tak",name:"Scenpaket Medium+ inkl. scentak",price:3799},{id:"large",name:"Scenpaket Large",price:2999},{id:"large-plus",name:"Scenpaket Large+",price:3599},{id:"large-plus-tak",name:"Scenpaket Large+ inkl. scentak",price:11999},{id:"xl",name:"Scenpaket XL",price:5399},{id:"xl-plus",name:"Scenpaket XL+",price:7199}]},"Scen tillbehör":{products:[{id:"scentrapp-40-cm-",name:"Scentrapp (40 cm)",price:279},{id:"scentrapp-60-cm-",name:"Scentrapp (60 cm)",price:349},{id:"scenkjol-per-4-m-",name:"Scenkjol (per 4 m)",price:79},{id:"backdrop-3-5-2-5-m",name:"Backdrop 3,5×2,5 m",price:799}]},Ljud:{sub:{Portable:[{id:"portable-small",name:"Portable, Small",price:599},{id:"portable-small-plus",name:"Portable, Small+",price:699},{id:"portable-medium",name:"Portable, Medium",price:799},{id:"portable-medium-plus",name:"Portable, Medium+",price:999},{id:"portable-large",name:"Portable, Large",price:1199}],Event:[{id:"event-small",name:"Event, Small",price:799},{id:"event-small-plus",name:"Event, Small+",price:1199},{id:"event-medium",name:"Event, Medium",price:1599},{id:"event-medium-plus",name:"Event, Medium+",price:2299},{id:"event-large",name:"Event, Large",price:3199}],Music:[{id:"music-small",name:"Music, Small",price:999},{id:"music-small-plus",name:"Music, Small+",price:1299},{id:"music-medium",name:"Music, Medium",price:1799},{id:"music-large",name:"Music, Large",price:2699},{id:"music-xl",name:"Music, XL",price:3599},{id:"music-xxl",name:"Music, XXL",price:5499}],Live:[{id:"live-small",name:"Live, Small",price:599},{id:"live-medium",name:"Live, Medium",price:1199},{id:"live-large",name:"Live, Large",price:1999},{id:"live-xl",name:"Live, XL",price:3199}],Mixers:[{id:"mixer-2-2",name:"Mixerbord 2+2 kanaler",price:159},{id:"mixer-4-2",name:"Mixerbord 4+2 kanaler",price:199},{id:"mixer-4-4",name:"Mixerbord 4+4 kanaler",price:299},{id:"mixer-6-4",name:"Mixerbord 6+4 kanaler",price:349},{id:"mixer-12-4",name:"Mixerbord 12+4 kanaler",price:399},{id:"mixer-16-3",name:"Mixerbord 16+3 kanaler",price:599},{id:"mixer-ilive-t80",name:"Digitalt mixerbord 32+16 kanaler",price:2499}],Mikrofoner:[{id:"handmikrofon",name:"Handmikrofon",price:80},{id:"instrumentmikrofon",name:"Instrumentmikrofon",price:120},{id:"tr-dl-s-handmikrofon",name:"Trådlös handmikrofon",price:400},{id:"tr-dl-st-headset",name:"Trådlöst headset",price:480},{id:"shure-slxd-digitalt-tr-dl-st-system-2-mikrofoner",name:"Shure SLXD trådlöst system (2 mik)",price:1299},{id:"wireless-8ch",name:"Trådlöst mikrofonset, 8 kanaler",price:2999},{id:"mikrofonstativ",name:"Mikrofonstativ",price:60}],"Stativ & kablar":[{id:"h-gtalarstativ-gravity",name:"Högtalarstativ Gravity",price:40},{id:"h-gtalarstativ-k-m",name:"Högtalarstativ K&M",price:50},{id:"h-gtalarstativ-gravity-premium",name:"Högtalarstativ Gravity Premium",price:60},{id:"h-gtalarstativ-gravity-med-vev",name:"Högtalarstativ med vev",price:120},{id:"xlr-kablar",name:"XLR kablar",price:40},{id:"bluetooth-mottagare",name:"Bluetooth-mottagare",price:80}]}},Ljus:{sub:{"Färdiga paket":[{id:"ljus-small",name:"Ljuspaket, Small",price:399},{id:"ljus-small-plus",name:"Ljuspaket, Small+",price:599},{id:"ljus-small-pp",name:"Ljuspaket, Small++",price:799},{id:"ljus-medium",name:"Ljuspaket, Medium",price:1199},{id:"ljus-medium-plus",name:"Ljuspaket, Medium+",price:1299},{id:"ljus-medium-pp",name:"Ljuspaket, Medium++",price:1499},{id:"ljus-large",name:"Ljuspaket, Large",price:1699},{id:"ljus-large-plus",name:"Ljuspaket, Large+",price:2199},{id:"ljus-large-pp",name:"Ljuspaket, Large++",price:2699}],"Lösa effekter":[{id:"led-par",name:"LED PAR (14x8W RGBW)",price:79},{id:"led-par-9",name:"LED PAR (9x10W RGBW)",price:99},{id:"led-par-uv",name:"LED PAR UV",price:119},{id:"led-par-xl",name:"LED PAR XL (60x2W RGBW)",price:149},{id:"led-uppladdningsbar",name:"LED-armatur, uppladdningsbar",price:199}],"Rök & pyro":[{id:"rokmaskin-1500",name:"Rökmaskin (1500W)",price:349},{id:"rokmaskin-650",name:"Rökmaskin (650W)",price:449},{id:"kallgnist",name:"Kallgnistmaskin",price:499},{id:"konfetti",name:"Konfettiavfyrare",price:499}],"Stativ & tross":[{id:"stativ-400",name:"Stativ med T-bar (400 mm)",price:40},{id:"stativ-1200",name:"Stativ med T-bar (1200 mm)",price:40},{id:"stativ-900p",name:"Stativ med T-bar (900 mm, premium)",price:60},{id:"vevstativ-1200",name:"Vevstativ med T-bar (1200 mm)",price:120},{id:"tross-1m",name:"Trosstorn 1,0 m",price:300},{id:"tross-15m",name:"Trosstorn 1,5 m",price:360}]}},"Projektor & skärm":{products:[{id:"projektor-xga",name:"Projektor (XGA)",price:299},{id:"projektor-fhd",name:"Projektor (Full HD)",price:499},{id:"skarm-65",name:'Skärm 65"',price:399},{id:"skarm-75",name:'Skärm 75"',price:799},{id:"trailer-skarm",name:"Trailerupphängd skärm",price:1999}]},"Projektor tillbehör":{products:[{id:"projektorbord",name:"Projektorbord",price:160},{id:"projektorduk-100-",name:'Projektorduk 100"',price:400},{id:"golvstativ-65-75-",name:'Golvstativ 65"/75"',price:240},{id:"hdmi-kabel-5-m",name:"HDMI-kabel 5 m",price:48},{id:"hdmi-kabel-10-m",name:"HDMI-kabel 10 m",price:60},{id:"hdmi-splitter-4-port-",name:"HDMI-splitter (4-port)",price:400},{id:"mediaspelare-4k",name:"Mediaspelare 4K",price:400},{id:"scenmonitor-23-",name:'Scenmonitor 23"',price:480},{id:"usb-clicker-",name:"USB Clicker",price:60}]},"DJ-utrustning":{products:[{id:"dj-controller-numark",name:"DJ-controller Numark Mixstream Pro+",price:799},{id:"dj-controller-denon-go",name:"DJ-controller Denon Prime GO+",price:999},{id:"dj-controller-denon-prime4",name:"DJ-controller Denon Prime 4+",price:1499},{id:"dj-rane-system-one",name:"DJ-system Rane System One",price:1999},{id:"dj-bord",name:"DJ-bord",price:80},{id:"dj-bord2",name:"DJ-bord med paneler",price:200},{id:"scenengineer",name:"Hyr Scenengineer",price:952},{id:"media-editor",name:"Hyr Media-editor",price:952}]},"El & kabel":{products:[{id:"grenuttag-1-5-m",name:"Grenuttag 1,5 m",price:20},{id:"f-rl-ngningskabel-10-m",name:"Förlängningskabel 10 m",price:48},{id:"grenuttag-p-rulle-10-m",name:"Grenuttag på rulle 10 m",price:100},{id:"grenuttag-p-rulle-25-m",name:"Grenuttag på rulle 25 m",price:159}]},Tillägg:{products:[{id:"lev-standard",name:"Leverans & upphämtning (standard bil)",price:1118},{id:"lev-skrymmande",name:"Leverans & upphämtning (bil med släp)",price:1598},{id:"lev-lastbil",name:"Leverans & upphämtning (lätt lastbil)",price:2198},{id:"lev-bakgavel",name:"Leverans & upphämtning (lastbil med bakgavellift)",price:2998},{id:"rigg-teknik",name:"Teknikertjänst på plats (per tim)",price:600},{id:"montering",name:"Montering & demontering (per tim)",price:600},{id:"faktura",name:"Fakturaavgift",price:49}]},"Egen rad":{products:[{id:"custom",name:"Ange benämning och pris →",price:0,custom:!0}]}};n("new-quote-btn").addEventListener("click",()=>U(null));n("quote-close").addEventListener("click",A);n("quote-overlay").addEventListener("click",e=>{e.target===n("quote-overlay")&&A()});let p=[];function U(e){if(p=[],n("qc-name").value=e?.customer_name||"",n("qc-email").value=e?.customer_email||"",n("qc-phone").value=e?.customer_phone||"",n("qc-date").value=e?.event_date||"",n("qc-location").value=e?.event_location||"",n("qc-note").value="",n("quote-error").style.display="none",n("quote-send-btn").disabled=!1,n("quote-send-btn").textContent="✉ Skicka offert",e?.items?.length){e.items.filter(r=>!r._note).forEach(r=>{p.push({id:r.id||"",name:r.name,price:r.price||0,qty:r.qty||1})});const a=e.items.find(r=>r._note);a&&(n("qc-note").value=a.name)}const t=n("qp-cat");t.innerHTML='<option value="">— välj kategori —</option>'+Object.keys(I).map(a=>`<option value="${a}">${a}</option>`).join(""),n("qp-sub-wrap").style.display="none",n("qp-prod").innerHTML='<option value="">— välj kategori —</option>',_(),n("quote-overlay").classList.add("open"),n("qc-name").focus()}function V(e){U(e)}function A(){n("quote-overlay").classList.remove("open")}function $e(){const e=n("qp-cat").value,t=I[e],a=n("qp-sub-wrap"),r=n("qp-prod");if(!t){a.style.display="none",r.innerHTML='<option value="">— välj kategori —</option>';return}if(t.sub){const i=n("qp-sub");i.innerHTML='<option value="">— välj underkategori —</option>'+Object.keys(t.sub).map(d=>`<option value="${d}">${d}</option>`).join(""),a.style.display="",r.innerHTML='<option value="">— välj underkategori —</option>'}else a.style.display="none",ne(t.products)}function _e(){const e=n("qp-cat").value,t=n("qp-sub").value,a=I[e];!a?.sub||!t||ne(a.sub[t]||[])}function ne(e){const t=n("qp-prod");t.innerHTML='<option value="">— välj produkt —</option>'+e.map(a=>{const r=a.custom?"✏ Skriv in benämning och pris själv":`${a.name} — ${a.price.toLocaleString("sv")} kr`;return`<option value="${a.id}" data-price="${a.price}" data-name="${a.name.replace(/"/g,"&quot;")}" data-custom="${a.custom||!1}">${r}</option>`}).join("")}function qe(){const e=n("qp-prod"),t=e.options[e.selectedIndex];if(!t||!t.value)return;if(t.dataset.custom==="true"){p.push({id:"custom-"+Date.now(),name:"",price:0,qty:1,custom:!0}),_(),setTimeout(()=>{const l=document.querySelectorAll(".quote-custom-name");l.length&&l[l.length-1].focus()},50);return}const r=t.dataset.name||t.textContent.split(" — ")[0],i=parseInt(t.dataset.price)||0,d=t.value,o=p.find(l=>l.id===d&&!l.custom);o?o.qty++:p.push({id:d,name:r,price:i,qty:1}),_(),e.selectedIndex=0}function _(){const e=n("quote-prod-tbody"),t=n("quote-prod-tfoot");if(!e)return;e.innerHTML=p.map((r,i)=>{const d=r.custom?`<input class="prod-input quote-custom-name" value="${r.name.replace(/"/g,"&quot;")}" placeholder="Ange benämning..." onchange="quoteEditName(${i},this.value)"
           style="width:100%;font-size:0.82rem;background:#0f0d2a!important;color:#f0eeff!important;color-scheme:dark;border-radius:5px;border:1px solid rgba(196,181,244,0.3);padding:0.2rem 0.5rem;">`:`<span style="font-size:0.82rem">${r.name}</span>`;return`
    <tr data-qidx="${i}">
      <td>${d}</td>
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
      <td style="text-align:right;font-size:0.82rem;font-weight:600;color:var(--brand-lav)">${u(r.price*r.qty)} kr</td>
      <td><button class="qty-btn" style="color:var(--red);border-color:var(--red);width:22px;height:22px" onclick="quoteDelIdx(${i})">×</button></td>
    </tr>`}).join("");const a=p.reduce((r,i)=>r+i.price*i.qty,0);t.innerHTML=p.length?`<tr><td colspan="3" style="font-weight:700;padding-top:0.5rem;font-size:0.82rem">Totalt (exkl. moms)</td>
       <td style="text-align:right;font-weight:700;color:var(--brand-lav);font-size:0.82rem">${u(a)} kr</td><td></td></tr>
       <tr><td colspan="3" style="color:var(--text-faint);font-size:0.72rem">Inkl. 25% moms</td>
       <td style="text-align:right;color:var(--text-muted);font-size:0.72rem">${u(Math.round(a*1.25))} kr</td><td></td></tr>`:""}function Le(e,t){p[e]&&(p[e].qty=Math.max(1,p[e].qty+t),_())}function Ee(e,t){p[e]&&(p[e].name=t)}function Me(e,t){p[e]&&(p[e].price=parseFloat(t)||0,_())}function Te(e){p.splice(e,1),_()}async function je(){const e=n("qc-name").value.trim(),t=n("qc-email").value.trim(),a=n("quote-error");if(a.style.display="none",!e){a.textContent="Namn krävs.",a.style.display="block",n("qc-name").focus();return}if(!t||!t.includes("@")){a.textContent="Giltig e-post krävs.",a.style.display="block",n("qc-email").focus();return}if(p.length===0){a.textContent="Lägg till minst en produkt.",a.style.display="block";return}const r=n("quote-send-btn");r.disabled=!0,r.textContent="⏳ Skickar…";const i={customer:{name:e,email:t,phone:n("qc-phone").value.trim()||null,date:n("qc-date").value||null,location:n("qc-location").value.trim()||null},items:p,note:n("qc-note").value.trim()||null};try{const{ok:d,data:o}=await g("admin-send-quote",{method:"POST",body:JSON.stringify(i)});d?(A(),c(`Offert skickad till ${t}! 🎉`),y()):(a.textContent=o?.error||"Kunde inte skicka offert.",a.style.display="block",r.disabled=!1,r.textContent="✉ Skicka offert")}catch{a.textContent="Nätverksfel — försök igen.",a.style.display="block",r.disabled=!1,r.textContent="✉ Skicka offert"}}n("panel-close").addEventListener("click",q);n("detail-overlay").addEventListener("click",q);document.addEventListener("keydown",e=>e.key==="Escape"&&q());function q(){n("detail-overlay").classList.remove("open"),n("detail-panel").classList.remove("open"),s=null}n("cal-prev").addEventListener("click",()=>{--x<0&&(x=11,w--),z()});n("cal-next").addEventListener("click",()=>{++x>11&&(x=0,w++),z()});n("cal-today").addEventListener("click",()=>{w=new Date().getFullYear(),x=new Date().getMonth(),z()});function z(){const e=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];n("cal-month-label").textContent=`${e[x]} ${w}`;const t=new Date(w,x,1),a=new Date(w,x+1,0),r=new Date;let i=t.getDay()-1;i<0&&(i=6);const d=n("cal-days");d.innerHTML="";const o=Math.ceil((i+a.getDate())/7)*7;for(let l=0;l<o;l++){const v=l-i+1,m=new Date(w,x,v),h=v<1||v>a.getDate(),F=!h&&m.toDateString()===r.toDateString(),B=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`,E=J.filter(b=>b.event_date===B&&b.status!=="cancelled"),k=document.createElement("div");k.className=`cal-day${h?" other-month":""}${F?" today":""}`,k.innerHTML=`<div class="cal-day-num">${m.getDate()}</div>
      ${E.map(b=>`
        <div class="cal-event s-${b.status}" data-id="${b.id}">
          ${j[b.status]?.icon} ${b.customer_name||b.id}
        </div>`).join("")}`,k.querySelectorAll(".cal-event").forEach(b=>{b.addEventListener("click",N=>{N.stopPropagation(),Q(b.dataset.id)})}),d.appendChild(k)}}n("refresh-btn").addEventListener("click",()=>{y(),c("Uppdaterat!")});function Pe(){clearInterval(X),X=setInterval(y,3e4)}ie();window.prodQty=de;window.prodDelete=le;window.prodAddRow=ce;window.prodSave=te;window.renderTab=f;window.prodTogglePopout=ve;window.prodAddFromCatalog=ge;window.prodAddFreeRow=be;window.prodUpdateSvc=ye;window.prodSaveAndSendOffer=ke;window.invMarkPaid=re;window.invSendEmail=Se;window.invSaveFields=ae;window.openPanel=Q;window.closePanel=q;window.sendMessage=K;window.confirmOrder=D;window.cancelOrder=M;window.notifyCustomer=C;window.quotePickerCat=$e;window.quotePickerSub=_e;window.quotePickerAdd=qe;window.quoteQtyIdx=Le;window.quoteEditName=Ee;window.quoteEditPrice=Me;window.quoteDelIdx=Te;window.sendQuote=je;window.closeQuoteModal=A;window.openQuoteModal=U;window.openQuoteModalForCart=V;
