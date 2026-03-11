let T="",O=[],i=null,$=[],q=[],x="info",v=new Date().getFullYear(),f=new Date().getMonth(),z=null;const r=t=>document.getElementById(t),y=t=>typeof t=="number"?t.toLocaleString("sv-SE"):"–",C=t=>t?new Date(t).toLocaleDateString("sv-SE"):"–",g=t=>t?new Date(t).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short",hour12:!1}):"–";function d(t,e="success"){const a=r("toast");a.textContent=(e==="success"?"✓ ":"✕ ")+t,a.className=`show ${e}`,clearTimeout(a._t),a._t=setTimeout(()=>a.className="",3e3)}const _={open:{icon:"🛒",label:"Öppen varukorg",cls:"s-open"},proposal:{icon:"📋",label:"Orderförslag",cls:"s-proposal"},waiting:{icon:"⏳",label:"Inväntar svar",cls:"s-waiting"},confirmed:{icon:"✅",label:"Orderbekräftelse",cls:"s-confirmed"},cancelled:{icon:"❌",label:"Avbruten",cls:"s-cancelled"}};function Y(){const t=sessionStorage.getItem("sk_admin_token");t&&(T=t,P())}r("login-pw").addEventListener("keydown",t=>t.key==="Enter"&&A());r("login-btn").addEventListener("click",A);function A(){const t=r("login-pw").value.trim();t&&(T=t,sessionStorage.setItem("sk_admin_token",t),P())}function P(){r("login-screen").style.display="none",r("app").style.display="flex",b(),dt()}r("logout-btn").addEventListener("click",()=>{sessionStorage.removeItem("sk_admin_token"),location.reload()});document.querySelectorAll(".nav-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),t.classList.add("active");const e=t.dataset.view;r(`view-${e}`).classList.add("active"),e==="calendar"&&S()})});async function m(t,e={}){const a=await fetch(`/.netlify/functions/${t}`,{...e,headers:{"Content-Type":"application/json",Authorization:`Bearer ${T}`,...e.headers||{}}}),n=await a.json();if(a.status===401)throw sessionStorage.removeItem("sk_admin_token"),T="",r("app").style.display="none",r("login-screen").style.display="flex",r("login-error").style.display="block",r("login-error").textContent="Fel lösenord, försök igen.",r("login-pw").value="",r("login-pw").focus(),new Error("Unauthorized");return{ok:a.ok,status:a.status,data:n}}async function b(){const{ok:t,data:e}=await m("admin-carts");if(!t){if(e.error==="Ej behörig"){r("login-error").style.display="block",r("login-error").textContent="Fel lösenord.",r("app").style.display="none",r("login-screen").style.display="flex",sessionStorage.removeItem("sk_admin_token");return}d("Kunde inte hämta varukorgar","error");return}O=e.carts||[];const a=e.summary?.total_unread||0,n=r("global-unread");a>0?(n.style.display="inline",n.textContent=`${a} nya`):n.style.display="none",K(),r("view-calendar").classList.contains("active")&&S()}function G(){const t=r("filter-search").value.toLowerCase().trim(),e=r("filter-from").value,a=r("filter-to").value;return O.filter(n=>!(t&&!((n.customer_name||"").toLowerCase().includes(t)||(n.id||"").toLowerCase().includes(t))||e&&n.event_date&&n.event_date<e||a&&n.event_date&&n.event_date>a))}["filter-search","filter-from","filter-to"].forEach(t=>{r(t).addEventListener("input",K)});function K(){const t=G(),e=["open","proposal","waiting","confirmed","cancelled"],a=r("kanban-board");a.innerHTML=e.map(n=>{const o=_[n],l=t.filter(s=>s.status===n);return`
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="col-title ${o.cls}">${o.icon} ${o.label}</div>
          <div class="col-count">${l.length}</div>
        </div>
        <div class="kanban-cards">
          ${l.length===0?'<div class="empty-col">Tom</div>':l.map(s=>V(s)).join("")}
        </div>
      </div>`}).join(""),a.onclick=n=>{const o=n.target.closest(".cart-card");o&&N(o.dataset.id)}}function V(t){const e=t.total_excl?y(Math.round(t.total_excl/100))+" kr":"–",a=t.unread_count>0?`<span class="unread-pill">💬 ${t.unread_count} ny${t.unread_count>1?"a":"t"}</span>`:"",n=t.created_at?Math.floor((Date.now()-new Date(t.created_at))/864e5):null,o=n===0?"Idag":n===1?"Igår":n!=null?`${n} dagar sedan`:"";return`
    <div class="cart-card" data-id="${t.id}">
      <div class="cart-card-name">${t.customer_name||"Okänd kund"}</div>
      <div class="cart-card-sub">${t.customer_email||""}</div>
      <div class="cart-card-meta">
        ${t.event_date?`<span>📅 ${C(t.event_date)}</span>`:""}
        ${t.event_location?`<span>📍 ${t.event_location}</span>`:""}
        ${o?`<span>🕐 ${o}</span>`:""}
      </div>
      <div class="cart-card-footer">
        <span class="cart-card-price">${e}</span>
        ${a}
      </div>
    </div>`}async function N(t){i=null,$=[],q=[],x="info";const e=r("detail-overlay"),a=r("detail-panel");e.classList.add("open"),a.classList.add("open"),r("panel-body").innerHTML='<div class="loading-center"><div class="spinner"></div></div>',r("panel-footer").innerHTML="",r("panel-title").textContent="Laddar…";let n,o;try{({ok:n,data:o}=await m(`admin-carts?id=${t}`))}catch(p){d("Kunde inte ladda varukorg: "+p.message,"error"),w();return}if(!n){d("Kunde inte ladda varukorg","error"),w();return}i=o.cart,$=o.messages||[],q=o.audit_log||[],r("panel-title").textContent=`${i.customer_name||"Okänd"} — ${i.id}`;const l=document.getElementById("panel-quick");l&&l.remove();const s=$.filter(p=>p.sender==="customer"&&!p.read_at).length,u=r("chat-unread-badge");s>0?(u.style.display="inline",u.textContent=s):u.style.display="none",j(),k("info"),E()}function j(){document.querySelectorAll(".panel-tab").forEach(t=>{t.classList.toggle("active",t.dataset.tab===x),t.onclick=()=>{x=t.dataset.tab,j(),k(x)}})}function k(t){const e=r("panel-body");t==="info"&&(e.innerHTML=et()),t==="products"&&(e.innerHTML=at()),requestAnimationFrame(()=>{document.querySelectorAll(".status-select, .admin-note-area, .prod-input, .chat-textarea").forEach(a=>{a.style.setProperty("background","#221f50","important"),a.style.setProperty("color","#f0eeff","important"),a.style.setProperty("color-scheme","dark","important"),(a.tagName==="SELECT"||a.classList.contains("admin-note-area"))&&a.style.setProperty("border","1px solid rgba(196,181,244,0.25)","important")})}),t==="chat"&&ot(),t==="log"&&(e.innerHTML=it()),t==="info"&&(r("status-select")?.addEventListener("change",async a=>{const n=a.target.value;if(!confirm(`Ändra status till "${_[n]?.label}"?`)){a.target.value=i.status;return}const{ok:o}=await m("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,status:n})});o?(i.status=n,d("Status uppdaterad!"),b(),E()):d("Fel vid statusändring","error")}),r("save-notes-btn")?.addEventListener("click",async()=>{const a=r("admin-notes").value,{ok:n}=await m("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,notes_admin:a})});n?(i.notes_admin=a,d("Anteckning sparad!")):d("Kunde inte spara","error")})),t==="chat"&&(r("chat-send-btn")?.addEventListener("click",D),r("chat-input")?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.ctrlKey||a.metaKey)&&D()}))}function H(){const t=document.querySelectorAll("#prod-tbody .prod-row");return Array.from(t).map(e=>{const a=l=>e.querySelector(`[data-field="${l}"]`)?.value?.trim()||"",n=parseInt(a("qty"))||1,o=parseFloat(a("price"))||0;return{id:a("id"),name:a("name"),category:a("category"),qty:n,price:o}}).filter(e=>e.name)}function I(t){const e=document.querySelector(`[data-idx="${t}"]`);if(!e)return;const a=parseInt(e.querySelector('[data-field="qty"]')?.value)||1,n=parseFloat(e.querySelector('[data-field="price"]')?.value)||0,o=document.getElementById(`prod-sum-${t}`);o&&(o.textContent=y(a*n));const s=H().reduce((p,h)=>p+h.price*h.qty,0),u=document.getElementById("prod-tfoot");u&&(u.innerHTML=`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${y(s)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${y(Math.round(s*1.25))} kr</td><td></td></tr>`)}document.addEventListener("input",t=>{if(t.target.matches(".prod-qty, .prod-price")){const e=t.target.dataset.idx;e!==void 0&&I(e)}});function W(t,e){const a=document.querySelector(`[data-field="qty"][data-idx="${t}"]`);if(!a)return;const n=Math.max(1,(parseInt(a.value)||1)+e);a.value=n,I(t)}function X(t){const e=document.querySelector(`[data-idx="${t}"]`)?.closest("tr");e&&(e.remove(),I(-1))}function Z(){const t=document.getElementById("prod-tbody");if(!t)return;const e=Date.now(),a=document.createElement("tr");a.className="prod-row",a.dataset.idx=e,a.innerHTML=`
    <td>
      <input class="prod-input prod-name" value="" placeholder="Produktnamn" data-field="name" data-idx="${e}" style="width:100%;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="" placeholder="Kategori" data-field="category" data-idx="${e}" style="width:55%;font-size:0.72rem;margin-top:3px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="" placeholder="ID (valfri)" data-field="id" data-idx="${e}" style="width:40%;font-size:0.72rem;margin-top:3px;margin-left:3%;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:center;vertical-align:top;padding-top:0.75rem">
      <div style="display:flex;align-items:center;justify-content:center;gap:4px">
        <button class="qty-btn" onclick="prodQty(${e},-1)">−</button>
        <input class="prod-input prod-qty" value="1" data-field="qty" data-idx="${e}" style="width:44px;text-align:center;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
        <button class="qty-btn" onclick="prodQty(${e},1)">＋</button>
      </div>
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem">
      <input class="prod-input prod-price" value="0" data-field="price" data-idx="${e}" style="width:90px;text-align:right;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem;font-weight:600;color:var(--brand-lav)" id="prod-sum-${e}">0</td>
    <td style="vertical-align:top;padding-top:0.75rem">
      <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${e})" title="Ta bort">×</button>
    </td>`,t.appendChild(a),a.querySelectorAll(".prod-input").forEach(n=>{n.style.setProperty("background","#221f50","important"),n.style.setProperty("color","#f0eeff","important"),n.style.setProperty("color-scheme","dark","important")}),a.querySelector(".prod-name")?.focus()}async function tt(){const t=document.getElementById("save-items-btn"),e=document.getElementById("prod-save-status"),a=H();t&&(t.disabled=!0,t.textContent="⏳ Sparar…");const n=Math.round(a.reduce((l,s)=>l+s.price*s.qty,0)*100),{ok:o}=await m("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,items:a,total_excl:n})});o?(i.items=a,i.total_excl=n,e&&(e.textContent="✓ Sparat",e.style.color="var(--green)"),setTimeout(()=>{e&&(e.textContent="")},3e3),d("Produkter uppdaterade!"),renderBoard()):(e&&(e.textContent="✗ Fel – kontrollera konsolen",e.style.color="var(--red)"),d("Kunde inte spara","error")),t&&(t.disabled=!1,t.textContent="💾 Spara produkter")}function et(){const t=i,e=_[t.status];return`
    <div class="section-label">Status</div>
    <div class="status-row">
      <select class="status-select" id="status-select" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;padding-right:2.25rem">
        ${Object.entries(_).map(([a,n])=>`<option value="${a}" ${a===t.status?"selected":""}>${n.icon} ${n.label}</option>`).join("")}
      </select>
      <span class="${e.cls}" style="font-size:0.85rem;font-weight:600;">${e.icon} ${e.label}</span>
    </div>

    <div class="section-label">Kundinformation</div>
    <div class="info-grid">
      <div class="info-field"><div class="info-field-label">Namn</div><div class="info-field-value">${t.customer_name||"–"}</div></div>
      <div class="info-field"><div class="info-field-label">E-post</div><div class="info-field-value">${t.customer_email?`<a href="mailto:${t.customer_email}" style="color:var(--brand-lav)">${t.customer_email}</a>`:"–"}</div></div>
      <div class="info-field"><div class="info-field-label">Telefon</div><div class="info-field-value">${t.customer_phone?`<a href="tel:${t.customer_phone}" style="color:var(--brand-lav)">${t.customer_phone}</a>`:"–"}</div></div>
      <div class="info-field"><div class="info-field-label">Eventdatum</div><div class="info-field-value">${C(t.event_date)}</div></div>
      <div class="info-field" style="grid-column:1/-1"><div class="info-field-label">Plats / Adress</div><div class="info-field-value">${t.event_location||"–"}</div></div>
    </div>

    ${t.customer_message?`
    <div class="section-label">Kundens meddelande</div>
    <div style="background:var(--bg);border-radius:8px;padding:1rem;font-size:0.9rem;line-height:1.6;font-family:'Source Sans 3',sans-serif;color:var(--text-muted)">
      ${t.customer_message.replace(/\n/g,"<br>")}
    </div>`:""}

    <div class="section-label">Snabblänkar</div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem">
      ${t.customer_email?`<a href="mailto:${t.customer_email}" style="background:var(--surface2);border:1px solid var(--border);color:var(--brand-lav);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.82rem;text-decoration:none;font-family:inherit">✉ ${t.customer_email}</a>`:""}
      ${t.customer_phone?`<a href="tel:${t.customer_phone}" style="background:var(--surface2);border:1px solid var(--border);color:var(--brand-lav);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.82rem;text-decoration:none;font-family:inherit">📞 ${t.customer_phone}</a>`:""}
      ${t.cart_token?`<a href="https://scenkonsult.se/order/?cart=${t.id}&token=${t.cart_token}" target="_blank" style="background:var(--surface2);border:1px solid var(--border);color:var(--text-muted);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.82rem;text-decoration:none;font-family:inherit">🔗 Kundlänk ↗</a>`:""}
    </div>

    <div class="section-label">Tidsstämplar</div>
    <div class="info-grid">
      <div class="info-field"><div class="info-field-label">Skapad</div><div class="info-field-value" style="font-size:0.8rem">${g(t.created_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Uppdaterad</div><div class="info-field-value" style="font-size:0.8rem">${g(t.updated_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Kund senast aktiv</div><div class="info-field-value" style="font-size:0.8rem">${g(t.last_read_customer)}</div></div>
      <div class="info-field"><div class="info-field-label">Utgår</div><div class="info-field-value" style="font-size:0.8rem;color:${t.expires_at?"var(--amber)":"var(--green)"}">${t.expires_at?C(t.expires_at):"♾ Bekräftad"}</div></div>
    </div>

    <div class="section-label">Intern anteckning (visas ej för kund)</div>
    <textarea class="admin-note-area" id="admin-notes" style="background:#221f50!important;color:#f0eeff!important;color-scheme:dark;" placeholder="Anteckna priser, tillgänglighet, intern kommunikation...">${t.notes_admin||""}</textarea>
    <button class="btn-action" id="save-notes-btn" style="margin-top:0.75rem">💾 Spara anteckning</button>
  `}function at(){const t=(i.items||[]).map((e,a)=>({...e,_idx:a}));return`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
      <div class="section-label" style="margin:0">Produkter (${t.length} st)</div>
      <button class="btn-sm" onclick="prodAddRow()" style="background:var(--surface2);border-color:var(--border-lav)">＋ Lägg till rad</button>
    </div>
    <table class="product-table" id="prod-edit-table">
      <thead><tr>
        <th>Produkt / Tjänst</th>
        <th style="text-align:center;width:90px">Antal</th>
        <th style="text-align:right;width:110px">à-pris (kr)</th>
        <th style="text-align:right;width:90px">Summa</th>
        <th style="width:36px"></th>
      </tr></thead>
      <tbody id="prod-tbody">
        ${t.map(e=>nt(e,e._idx)).join("")}
      </tbody>
      <tfoot id="prod-tfoot">${rt()}</tfoot>
    </table>
    <div style="margin-top:1rem;display:flex;gap:0.75rem;align-items:center">
      <button class="btn-action" id="save-items-btn" onclick="prodSave()">💾 Spara produkter</button>
      <span id="prod-save-status" style="font-size:0.8rem;color:var(--text-muted)"></span>
    </div>
  `}function nt(t,e){const a=t.qty||t.quantity||1,n=t.price||0,o=n*a,l=t.category||"",s=t.id||"";return`<tr data-idx="${e}" class="prod-row">
    <td>
      <input class="prod-input prod-name" value="${(t.name||"").replace(/"/g,"&quot;")}" placeholder="Produktnamn" data-field="name" data-idx="${e}" style="width:100%;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="${l}" placeholder="Kategori" data-field="category" data-idx="${e}" style="width:55%;font-size:0.72rem;margin-top:3px;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
      <input class="prod-input prod-meta" value="${s}" placeholder="ID (valfri)" data-field="id" data-idx="${e}" style="width:40%;font-size:0.72rem;margin-top:3px;margin-left:3%;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:center;vertical-align:top;padding-top:0.75rem">
      <div style="display:flex;align-items:center;justify-content:center;gap:4px">
        <button class="qty-btn" onclick="prodQty(${e},-1)">−</button>
        <input class="prod-input prod-qty" value="${a}" data-field="qty" data-idx="${e}" style="width:44px;text-align:center;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
        <button class="qty-btn" onclick="prodQty(${e},1)">＋</button>
      </div>
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem">
      <input class="prod-input prod-price" value="${n}" data-field="price" data-idx="${e}" style="width:90px;text-align:right;font-size:0.875rem;background:#221f50!important;color:#f0eeff!important;color-scheme:dark;">
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem;font-weight:600;color:var(--brand-lav)" id="prod-sum-${e}">${y(o)}</td>
    <td style="vertical-align:top;padding-top:0.75rem">
      <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${e})" title="Ta bort rad">×</button>
    </td>
  </tr>`}function rt(){const t=(i.items||[]).reduce((e,a)=>e+(a.price||0)*(a.qty||a.quantity||1),0);return`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${y(t)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${y(Math.round(t*1.25))} kr</td><td></td></tr>`}function ot(){const t=r("panel-body"),e=$,a=e.length===0?'<div class="chat-empty">Ingen chatt ännu.</div>':`<div class="chat-messages">${e.map(n=>{const o=n.sender==="admin"?n.read_at?`<span class="read-check">✓✓</span> Läst ${g(n.read_at)}`:"⏳ Inte läst":n.read_at?`Läst ${g(n.read_at)}`:"";return`
          <div class="msg-wrap ${n.sender}">
            <div class="msg-bubble">${n.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--brand-lav)">$1</a>')}</div>
            <div class="msg-meta">
              <span>${n.sender==="admin"?"👤 Du":"🧑 Kund"} · ${g(n.created_at)}</span>
              ${o?`<span>${o}</span>`:""}
            </div>
          </div>`}).join("")}</div>`;t.innerHTML=`
    ${a}
    <div class="section-label">Nytt meddelande till kund</div>
    <div class="chat-input-wrap">
      <textarea class="chat-textarea" id="chat-input" placeholder="Skriv ett meddelande… (Ctrl+Enter för att skicka)"></textarea>
      <button class="chat-send-btn" id="chat-send-btn">Skicka till kund →</button>
    </div>`,setTimeout(()=>{const n=t.querySelector(".chat-messages");n&&(n.scrollTop=n.scrollHeight),t.scrollTop=t.scrollHeight},50)}async function D(){const t=r("chat-input"),e=r("chat-send-btn"),a=t?.value.trim();if(!a)return;e.disabled=!0,e.textContent="Skickar…";const{ok:n,data:o}=await m("cart-message",{method:"POST",body:JSON.stringify({cart_id:i.id,body:a})});n?($.push({id:o.message?.id||Date.now(),cart_id:i.id,sender:"admin",body:a,read_at:null,created_at:new Date().toISOString()}),t.value="",k("chat"),d("Meddelande skickat!"),b()):(d(o.error||"Kunde inte skicka","error"),e.disabled=!1,e.textContent="Skicka till kund →")}function it(){const t=q;return t.length===0?'<div class="empty-col" style="padding:3rem">Ingen logg ännu.</div>':`
    <div class="section-label">Händelselogg (senaste 50)</div>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${t.map(e=>`
        <div style="background:var(--bg);border-radius:8px;padding:0.75rem;display:flex;gap:1rem;align-items:flex-start">
          <div style="font-size:0.75rem;color:var(--text-faint);white-space:nowrap;min-width:130px">${g(e.created_at)}</div>
          <div>
            <div style="font-size:0.85rem;font-weight:600">${e.event_type}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${e.actor} ${e.payload&&Object.keys(e.payload).length?"· "+JSON.stringify(e.payload):""}</div>
          </div>
        </div>`).join("")}
    </div>`}function E(){const t=i,e=r("panel-footer");e.innerHTML="";const a=(n,o,l)=>{const s=document.createElement("button");s.className=`btn-action ${o}`,s.textContent=n,s.onclick=l,e.appendChild(s)};t.status!=="confirmed"&&t.status!=="cancelled"&&(a("✅ Bekräfta order","btn-success",B),a("📩 Skicka notis till kund","",st)),t.status!=="cancelled"&&a("❌ Avbryt order","btn-danger",F),t.cart_token&&a("🔗 Kopiera kundlänk","",()=>{const n=`https://scenkonsult.se/varukorg/?cart=${t.id}&token=${t.cart_token}`;navigator.clipboard.writeText(n),d("Kundlänk kopierad!")})}async function B(){if(!confirm("Bekräfta ordern? Status ändras till Orderbekräftelse och TTL tas bort."))return;const{ok:t}=await m("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,status:"confirmed"})});t?(i.status="confirmed",d("Order bekräftad! ✅"),b(),k("info"),E()):d("Fel vid bekräftelse","error")}async function F(){if(!confirm("Avbryt ordern? Den sparas i 90 dagar."))return;const{ok:t}=await m("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,status:"cancelled"})});t?(i.status="cancelled",d("Order avbruten"),b(),k("info"),E()):d("Fel vid avbrytning","error")}async function st(){const t=prompt("Meddelande till kund (skickas via e-post):");if(!t?.trim())return;const{ok:e}=await m("cart-message",{method:"POST",body:JSON.stringify({cart_id:i.id,body:t.trim()})});e?(d("Notis skickad till kund! 📩"),$.push({id:Date.now(),cart_id:i.id,sender:"admin",body:t.trim(),read_at:null,created_at:new Date().toISOString()}),x==="chat"&&k("chat")):d("Kunde inte skicka notis","error")}r("panel-close").addEventListener("click",w);r("detail-overlay").addEventListener("click",w);document.addEventListener("keydown",t=>t.key==="Escape"&&w());function w(){r("detail-overlay").classList.remove("open"),r("detail-panel").classList.remove("open"),i=null}r("cal-prev").addEventListener("click",()=>{--f<0&&(f=11,v--),S()});r("cal-next").addEventListener("click",()=>{++f>11&&(f=0,v++),S()});r("cal-today").addEventListener("click",()=>{v=new Date().getFullYear(),f=new Date().getMonth(),S()});function S(){const t=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];r("cal-month-label").textContent=`${t[f]} ${v}`;const e=new Date(v,f,1),a=new Date(v,f+1,0),n=new Date;let o=e.getDay()-1;o<0&&(o=6);const l=r("cal-days");l.innerHTML="";const s=Math.ceil((o+a.getDate())/7)*7;for(let u=0;u<s;u++){const p=u-o+1,h=new Date(v,f,p),M=p<1||p>a.getDate(),J=!M&&h.toDateString()===n.toDateString(),Q=h.toISOString().split("T")[0],U=O.filter(c=>c.event_date===Q&&c.status!=="cancelled"),L=document.createElement("div");L.className=`cal-day${M?" other-month":""}${J?" today":""}`,L.innerHTML=`<div class="cal-day-num">${h.getDate()}</div>
      ${U.map(c=>`
        <div class="cal-event s-${c.status}" data-id="${c.id}">
          ${_[c.status]?.icon} ${c.customer_name||c.id}
        </div>`).join("")}`,L.querySelectorAll(".cal-event").forEach(c=>{c.addEventListener("click",R=>{R.stopPropagation(),N(c.dataset.id)})}),l.appendChild(L)}}r("refresh-btn").addEventListener("click",()=>{b(),d("Uppdaterat!")});function dt(){clearInterval(z),z=setInterval(b,3e4)}Y();window.prodQty=W;window.prodDelete=X;window.prodAddRow=Z;window.prodSave=tt;window.renderTab=k;window.openPanel=openPanel;window.closePanel=w;window.sendMessage=D;window.confirmOrder=B;window.cancelOrder=F;window.notifyCustomer=notifyCustomer;
