let T="",q=[],i=null,k=[],D=[],_="info",m=new Date().getFullYear(),f=new Date().getMonth(),M=null;const s=t=>document.getElementById(t),g=t=>typeof t=="number"?t.toLocaleString("sv-SE"):"–",O=t=>t?new Date(t).toLocaleDateString("sv-SE"):"–",y=t=>t?new Date(t).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short",hour12:!1}):"–";function d(t,e="success"){const a=s("toast");a.textContent=(e==="success"?"✓ ":"✕ ")+t,a.className=`show ${e}`,clearTimeout(a._t),a._t=setTimeout(()=>a.className="",3e3)}const x={open:{icon:"🛒",label:"Öppen varukorg",cls:"s-open"},proposal:{icon:"📋",label:"Orderförslag",cls:"s-proposal"},waiting:{icon:"⏳",label:"Inväntar svar",cls:"s-waiting"},confirmed:{icon:"✅",label:"Orderbekräftelse",cls:"s-confirmed"},cancelled:{icon:"❌",label:"Avbruten",cls:"s-cancelled"}};function J(){const t=sessionStorage.getItem("sk_admin_token");t&&(T=t,A())}s("login-pw").addEventListener("keydown",t=>t.key==="Enter"&&z());s("login-btn").addEventListener("click",z);function z(){const t=s("login-pw").value.trim();t&&(T=t,sessionStorage.setItem("sk_admin_token",t),A())}function A(){s("login-screen").style.display="none",s("app").style.display="flex",b(),st()}s("logout-btn").addEventListener("click",()=>{sessionStorage.removeItem("sk_admin_token"),location.reload()});document.querySelectorAll(".nav-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),t.classList.add("active");const e=t.dataset.view;s(`view-${e}`).classList.add("active"),e==="calendar"&&S()})});async function p(t,e={}){const a=await fetch(`/.netlify/functions/${t}`,{...e,headers:{"Content-Type":"application/json",Authorization:`Bearer ${T}`,...e.headers||{}}}),n=await a.json();if(a.status===401)throw sessionStorage.removeItem("sk_admin_token"),T="",s("app").style.display="none",s("login-screen").style.display="flex",s("login-error").style.display="block",s("login-error").textContent="Fel lösenord, försök igen.",s("login-pw").value="",s("login-pw").focus(),new Error("Unauthorized");return{ok:a.ok,status:a.status,data:n}}async function b(){const{ok:t,data:e}=await p("admin-carts");if(!t){if(e.error==="Ej behörig"){s("login-error").style.display="block",s("login-error").textContent="Fel lösenord.",s("app").style.display="none",s("login-screen").style.display="flex",sessionStorage.removeItem("sk_admin_token");return}d("Kunde inte hämta varukorgar","error");return}q=e.carts||[];const a=e.summary?.total_unread||0,n=s("global-unread");a>0?(n.style.display="inline",n.textContent=`${a} nya`):n.style.display="none",K(),s("view-calendar").classList.contains("active")&&S()}function U(){const t=s("filter-search").value.toLowerCase().trim(),e=s("filter-from").value,a=s("filter-to").value;return q.filter(n=>!(t&&!((n.customer_name||"").toLowerCase().includes(t)||(n.id||"").toLowerCase().includes(t))||e&&n.event_date&&n.event_date<e||a&&n.event_date&&n.event_date>a))}["filter-search","filter-from","filter-to"].forEach(t=>{s(t).addEventListener("input",K)});function K(){const t=U(),e=["open","proposal","waiting","confirmed","cancelled"],a=s("kanban-board");a.innerHTML=e.map(n=>{const r=x[n],l=t.filter(o=>o.status===n);return`
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="col-title ${r.cls}">${r.icon} ${r.label}</div>
          <div class="col-count">${l.length}</div>
        </div>
        <div class="kanban-cards">
          ${l.length===0?'<div class="empty-col">Tom</div>':l.map(o=>Q(o)).join("")}
        </div>
      </div>`}).join(""),a.onclick=n=>{const r=n.target.closest(".cart-card");r&&j(r.dataset.id)}}function Q(t){const e=t.total_excl?g(Math.round(t.total_excl/100))+" kr":"–",a=t.unread_count>0?`<span class="unread-pill">💬 ${t.unread_count} ny${t.unread_count>1?"a":"t"}</span>`:"",n=t.created_at?Math.floor((Date.now()-new Date(t.created_at))/864e5):null,r=n===0?"Idag":n===1?"Igår":n!=null?`${n} dagar sedan`:"";return`
    <div class="cart-card" data-id="${t.id}">
      <div class="cart-card-name">${t.customer_name||"Okänd kund"}</div>
      <div class="cart-card-sub">${t.customer_email||""}</div>
      <div class="cart-card-meta">
        ${t.event_date?`<span>📅 ${O(t.event_date)}</span>`:""}
        ${t.event_location?`<span>📍 ${t.event_location}</span>`:""}
        ${r?`<span>🕐 ${r}</span>`:""}
      </div>
      <div class="cart-card-footer">
        <span class="cart-card-price">${e}</span>
        ${a}
      </div>
    </div>`}async function j(t){i=null,k=[],D=[],_="info";const e=s("detail-overlay"),a=s("detail-panel");e.classList.add("open"),a.classList.add("open"),s("panel-body").innerHTML='<div class="loading-center"><div class="spinner"></div></div>',s("panel-footer").innerHTML="",s("panel-title").textContent="Laddar…";let n,r;try{({ok:n,data:r}=await p(`admin-carts?id=${t}`))}catch(v){d("Kunde inte ladda varukorg: "+v.message,"error"),w();return}if(!n){d("Kunde inte ladda varukorg","error"),w();return}i=r.cart,k=r.messages||[],D=r.audit_log||[],s("panel-title").textContent=`${i.customer_name||"Okänd"} — ${i.id}`;const l=document.getElementById("panel-quick");l&&l.remove();const o=k.filter(v=>v.sender==="customer"&&!v.read_at).length,u=s("chat-unread-badge");o>0?(u.style.display="inline",u.textContent=o):u.style.display="none",H(),$("info"),E()}function H(){document.querySelectorAll(".panel-tab").forEach(t=>{t.classList.toggle("active",t.dataset.tab===_),t.onclick=()=>{_=t.dataset.tab,H(),$(_)}})}function $(t){const e=s("panel-body");t==="info"&&(e.innerHTML=G()),t==="products"&&(e.innerHTML=V()),t==="chat"&&Z(),t==="log"&&(e.innerHTML=tt()),t==="info"&&(s("status-select")?.addEventListener("change",async a=>{const n=a.target.value;if(!confirm(`Ändra status till "${x[n]?.label}"?`)){a.target.value=i.status;return}const{ok:r}=await p("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,status:n})});r?(i.status=n,d("Status uppdaterad!"),b(),E()):d("Fel vid statusändring","error")}),s("save-notes-btn")?.addEventListener("click",async()=>{const a=s("admin-notes").value,{ok:n}=await p("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,notes_admin:a})});n?(i.notes_admin=a,d("Anteckning sparad!")):d("Kunde inte spara","error")})),t==="chat"&&(s("chat-send-btn")?.addEventListener("click",I),s("chat-input")?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.ctrlKey||a.metaKey)&&I()}))}function R(){const t=document.querySelectorAll("#prod-tbody .prod-row");return Array.from(t).map(e=>{const a=l=>e.querySelector(`[data-field="${l}"]`)?.value?.trim()||"",n=parseInt(a("qty"))||1,r=parseFloat(a("price"))||0;return{id:a("id"),name:a("name"),category:a("category"),qty:n,price:r}}).filter(e=>e.name)}function Y(t){const e=document.querySelector(`[data-idx="${t}"]`);if(!e)return;const a=parseInt(e.querySelector('[data-field="qty"]')?.value)||1,n=parseFloat(e.querySelector('[data-field="price"]')?.value)||0,r=document.getElementById(`prod-sum-${t}`);r&&(r.textContent=g(a*n));const o=R().reduce((v,h)=>v+h.price*h.qty,0),u=document.getElementById("prod-tfoot");u&&(u.innerHTML=`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${g(o)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${g(Math.round(o*1.25))} kr</td><td></td></tr>`)}document.addEventListener("input",t=>{if(t.target.matches(".prod-qty, .prod-price")){const e=t.target.dataset.idx;e!==void 0&&Y(e)}});function G(){const t=i,e=x[t.status];return`
    <div class="section-label">Status</div>
    <div class="status-row">
      <select class="status-select" id="status-select">
        ${Object.entries(x).map(([a,n])=>`<option value="${a}" ${a===t.status?"selected":""}>${n.icon} ${n.label}</option>`).join("")}
      </select>
      <span class="${e.cls}" style="font-size:0.85rem;font-weight:600;">${e.icon} ${e.label}</span>
    </div>

    <div class="section-label">Kundinformation</div>
    <div class="info-grid">
      <div class="info-field"><div class="info-field-label">Namn</div><div class="info-field-value">${t.customer_name||"–"}</div></div>
      <div class="info-field"><div class="info-field-label">E-post</div><div class="info-field-value">${t.customer_email?`<a href="mailto:${t.customer_email}" style="color:var(--brand-lav)">${t.customer_email}</a>`:"–"}</div></div>
      <div class="info-field"><div class="info-field-label">Telefon</div><div class="info-field-value">${t.customer_phone?`<a href="tel:${t.customer_phone}" style="color:var(--brand-lav)">${t.customer_phone}</a>`:"–"}</div></div>
      <div class="info-field"><div class="info-field-label">Eventdatum</div><div class="info-field-value">${O(t.event_date)}</div></div>
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
      <div class="info-field"><div class="info-field-label">Skapad</div><div class="info-field-value" style="font-size:0.8rem">${y(t.created_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Uppdaterad</div><div class="info-field-value" style="font-size:0.8rem">${y(t.updated_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Kund senast aktiv</div><div class="info-field-value" style="font-size:0.8rem">${y(t.last_read_customer)}</div></div>
      <div class="info-field"><div class="info-field-label">Utgår</div><div class="info-field-value" style="font-size:0.8rem;color:${t.expires_at?"var(--amber)":"var(--green)"}">${t.expires_at?O(t.expires_at):"♾ Bekräftad"}</div></div>
    </div>

    <div class="section-label">Intern anteckning (visas ej för kund)</div>
    <textarea class="admin-note-area" id="admin-notes" placeholder="Anteckna priser, tillgänglighet, intern kommunikation...">${t.notes_admin||""}</textarea>
    <button class="btn-action" id="save-notes-btn" style="margin-top:0.75rem">💾 Spara anteckning</button>
  `}function V(){const t=(i.items||[]).map((e,a)=>({...e,_idx:a}));return`
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
        ${t.map(e=>W(e,e._idx)).join("")}
      </tbody>
      <tfoot id="prod-tfoot">${X()}</tfoot>
    </table>
    <div style="margin-top:1rem;display:flex;gap:0.75rem;align-items:center">
      <button class="btn-action" id="save-items-btn" onclick="prodSave()">💾 Spara produkter</button>
      <span id="prod-save-status" style="font-size:0.8rem;color:var(--text-muted)"></span>
    </div>
  `}function W(t,e){const a=t.qty||t.quantity||1,n=t.price||0,r=n*a,l=t.category||"",o=t.id||"";return`<tr data-idx="${e}" class="prod-row">
    <td>
      <input class="prod-input prod-name" value="${(t.name||"").replace(/"/g,"&quot;")}" placeholder="Produktnamn" data-field="name" data-idx="${e}" style="width:100%;font-size:0.875rem">
      <input class="prod-input prod-meta" value="${l}" placeholder="Kategori" data-field="category" data-idx="${e}" style="width:55%;font-size:0.72rem;margin-top:3px">
      <input class="prod-input prod-meta" value="${o}" placeholder="ID (valfri)" data-field="id" data-idx="${e}" style="width:40%;font-size:0.72rem;margin-top:3px;margin-left:3%">
    </td>
    <td style="text-align:center;vertical-align:top;padding-top:0.75rem">
      <div style="display:flex;align-items:center;justify-content:center;gap:4px">
        <button class="qty-btn" onclick="prodQty(${e},-1)">−</button>
        <input class="prod-input prod-qty" value="${a}" data-field="qty" data-idx="${e}" style="width:44px;text-align:center;font-size:0.875rem">
        <button class="qty-btn" onclick="prodQty(${e},1)">＋</button>
      </div>
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem">
      <input class="prod-input prod-price" value="${n}" data-field="price" data-idx="${e}" style="width:90px;text-align:right;font-size:0.875rem">
    </td>
    <td style="text-align:right;vertical-align:top;padding-top:0.75rem;font-weight:600;color:var(--brand-lav)" id="prod-sum-${e}">${g(r)}</td>
    <td style="vertical-align:top;padding-top:0.75rem">
      <button class="qty-btn" style="color:var(--red);border-color:var(--red)" onclick="prodDelete(${e})" title="Ta bort rad">×</button>
    </td>
  </tr>`}function X(){const t=(i.items||[]).reduce((e,a)=>e+(a.price||0)*(a.qty||a.quantity||1),0);return`<tr class="total-row"><td colspan="3">Totalt (exkl. moms)</td>
    <td style="text-align:right">${g(t)} kr</td><td></td></tr>
  <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
    <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${g(Math.round(t*1.25))} kr</td><td></td></tr>`}function Z(){const t=s("panel-body"),e=k,a=e.length===0?'<div class="chat-empty">Ingen chatt ännu.</div>':`<div class="chat-messages">${e.map(n=>{const r=n.sender==="admin"?n.read_at?`<span class="read-check">✓✓</span> Läst ${y(n.read_at)}`:"⏳ Inte läst":n.read_at?`Läst ${y(n.read_at)}`:"";return`
          <div class="msg-wrap ${n.sender}">
            <div class="msg-bubble">${n.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--brand-lav)">$1</a>')}</div>
            <div class="msg-meta">
              <span>${n.sender==="admin"?"👤 Du":"🧑 Kund"} · ${y(n.created_at)}</span>
              ${r?`<span>${r}</span>`:""}
            </div>
          </div>`}).join("")}</div>`;t.innerHTML=`
    ${a}
    <div class="section-label">Nytt meddelande till kund</div>
    <div class="chat-input-wrap">
      <textarea class="chat-textarea" id="chat-input" placeholder="Skriv ett meddelande… (Ctrl+Enter för att skicka)"></textarea>
      <button class="chat-send-btn" id="chat-send-btn">Skicka till kund →</button>
    </div>`,setTimeout(()=>{const n=t.querySelector(".chat-messages");n&&(n.scrollTop=n.scrollHeight),t.scrollTop=t.scrollHeight},50)}async function I(){const t=s("chat-input"),e=s("chat-send-btn"),a=t?.value.trim();if(!a)return;e.disabled=!0,e.textContent="Skickar…";const{ok:n,data:r}=await p("cart-message",{method:"POST",body:JSON.stringify({cart_id:i.id,body:a})});n?(k.push({id:r.message?.id||Date.now(),cart_id:i.id,sender:"admin",body:a,read_at:null,created_at:new Date().toISOString()}),t.value="",$("chat"),d("Meddelande skickat!"),b()):(d(r.error||"Kunde inte skicka","error"),e.disabled=!1,e.textContent="Skicka till kund →")}function tt(){const t=D;return t.length===0?'<div class="empty-col" style="padding:3rem">Ingen logg ännu.</div>':`
    <div class="section-label">Händelselogg (senaste 50)</div>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${t.map(e=>`
        <div style="background:var(--bg);border-radius:8px;padding:0.75rem;display:flex;gap:1rem;align-items:flex-start">
          <div style="font-size:0.75rem;color:var(--text-faint);white-space:nowrap;min-width:130px">${y(e.created_at)}</div>
          <div>
            <div style="font-size:0.85rem;font-weight:600">${e.event_type}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${e.actor} ${e.payload&&Object.keys(e.payload).length?"· "+JSON.stringify(e.payload):""}</div>
          </div>
        </div>`).join("")}
    </div>`}function E(){const t=i,e=s("panel-footer");e.innerHTML="";const a=(n,r,l)=>{const o=document.createElement("button");o.className=`btn-action ${r}`,o.textContent=n,o.onclick=l,e.appendChild(o)};t.status!=="confirmed"&&t.status!=="cancelled"&&(a("✅ Bekräfta order","btn-success",et),a("📩 Skicka notis till kund","",nt)),t.status!=="cancelled"&&a("❌ Avbryt order","btn-danger",at),t.cart_token&&a("🔗 Kopiera kundlänk","",()=>{const n=`https://scenkonsult.se/varukorg/?cart=${t.id}&token=${t.cart_token}`;navigator.clipboard.writeText(n),d("Kundlänk kopierad!")})}async function et(){if(!confirm("Bekräfta ordern? Status ändras till Orderbekräftelse och TTL tas bort."))return;const{ok:t}=await p("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,status:"confirmed"})});t?(i.status="confirmed",d("Order bekräftad! ✅"),b(),$("info"),E()):d("Fel vid bekräftelse","error")}async function at(){if(!confirm("Avbryt ordern? Den sparas i 90 dagar."))return;const{ok:t}=await p("cart-update",{method:"POST",body:JSON.stringify({cart_id:i.id,status:"cancelled"})});t?(i.status="cancelled",d("Order avbruten"),b(),$("info"),E()):d("Fel vid avbrytning","error")}async function nt(){const t=prompt("Meddelande till kund (skickas via e-post):");if(!t?.trim())return;const{ok:e}=await p("cart-message",{method:"POST",body:JSON.stringify({cart_id:i.id,body:t.trim()})});e?(d("Notis skickad till kund! 📩"),k.push({id:Date.now(),cart_id:i.id,sender:"admin",body:t.trim(),read_at:null,created_at:new Date().toISOString()}),_==="chat"&&$("chat")):d("Kunde inte skicka notis","error")}s("panel-close").addEventListener("click",w);s("detail-overlay").addEventListener("click",w);document.addEventListener("keydown",t=>t.key==="Escape"&&w());function w(){s("detail-overlay").classList.remove("open"),s("detail-panel").classList.remove("open"),i=null}s("cal-prev").addEventListener("click",()=>{--f<0&&(f=11,m--),S()});s("cal-next").addEventListener("click",()=>{++f>11&&(f=0,m++),S()});s("cal-today").addEventListener("click",()=>{m=new Date().getFullYear(),f=new Date().getMonth(),S()});function S(){const t=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];s("cal-month-label").textContent=`${t[f]} ${m}`;const e=new Date(m,f,1),a=new Date(m,f+1,0),n=new Date;let r=e.getDay()-1;r<0&&(r=6);const l=s("cal-days");l.innerHTML="";const o=Math.ceil((r+a.getDate())/7)*7;for(let u=0;u<o;u++){const v=u-r+1,h=new Date(m,f,v),C=v<1||v>a.getDate(),N=!C&&h.toDateString()===n.toDateString(),P=h.toISOString().split("T")[0],F=q.filter(c=>c.event_date===P&&c.status!=="cancelled"),L=document.createElement("div");L.className=`cal-day${C?" other-month":""}${N?" today":""}`,L.innerHTML=`<div class="cal-day-num">${h.getDate()}</div>
      ${F.map(c=>`
        <div class="cal-event s-${c.status}" data-id="${c.id}">
          ${x[c.status]?.icon} ${c.customer_name||c.id}
        </div>`).join("")}`,L.querySelectorAll(".cal-event").forEach(c=>{c.addEventListener("click",B=>{B.stopPropagation(),j(c.dataset.id)})}),l.appendChild(L)}}s("refresh-btn").addEventListener("click",()=>{b(),d("Uppdaterat!")});function st(){clearInterval(M),M=setInterval(b,3e4)}J();
