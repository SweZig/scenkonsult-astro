let L="",C=[],r=null,b=[],D=[],$="info",p=new Date().getFullYear(),u=new Date().getMonth(),I=null;const s=e=>document.getElementById(e),h=e=>typeof e=="number"?e.toLocaleString("sv-SE"):"–",O=e=>e?new Date(e).toLocaleDateString("sv-SE"):"–",g=e=>e?new Date(e).toLocaleString("sv-SE",{dateStyle:"short",timeStyle:"short",hour12:!1}):"–";function o(e,n="success"){const t=s("toast");t.textContent=(n==="success"?"✓ ":"✕ ")+e,t.className=`show ${n}`,clearTimeout(t._t),t._t=setTimeout(()=>t.className="",3e3)}const _={open:{icon:"🛒",label:"Öppen varukorg",cls:"s-open"},proposal:{icon:"📋",label:"Orderförslag",cls:"s-proposal"},waiting:{icon:"⏳",label:"Inväntar svar",cls:"s-waiting"},confirmed:{icon:"✅",label:"Orderbekräftelse",cls:"s-confirmed"},cancelled:{icon:"❌",label:"Avbruten",cls:"s-cancelled"}};function B(){const e=sessionStorage.getItem("sk_admin_token");e&&(L=e,K())}s("login-pw").addEventListener("keydown",e=>e.key==="Enter"&&z());s("login-btn").addEventListener("click",z);function z(){const e=s("login-pw").value.trim();e&&(L=e,sessionStorage.setItem("sk_admin_token",e),K())}function K(){s("login-screen").style.display="none",s("app").style.display="flex",y(),ee()}s("logout-btn").addEventListener("click",()=>{sessionStorage.removeItem("sk_admin_token"),location.reload()});document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".view").forEach(t=>t.classList.remove("active")),e.classList.add("active");const n=e.dataset.view;s(`view-${n}`).classList.add("active"),n==="calendar"&&x()})});async function f(e,n={}){const t=await fetch(`/.netlify/functions/${e}`,{...n,headers:{"Content-Type":"application/json",Authorization:`Bearer ${L}`,...n.headers||{}}}),a=await t.json();if(t.status===401)throw sessionStorage.removeItem("sk_admin_token"),L="",s("app").style.display="none",s("login-screen").style.display="flex",s("login-error").style.display="block",s("login-error").textContent="Fel lösenord, försök igen.",s("login-pw").value="",s("login-pw").focus(),new Error("Unauthorized");return{ok:t.ok,status:t.status,data:a}}async function y(){const{ok:e,data:n}=await f("admin-carts");if(!e){if(n.error==="Ej behörig"){s("login-error").style.display="block",s("login-error").textContent="Fel lösenord.",s("app").style.display="none",s("login-screen").style.display="flex",sessionStorage.removeItem("sk_admin_token");return}o("Kunde inte hämta varukorgar","error");return}C=n.carts||[];const t=n.summary?.total_unread||0,a=s("global-unread");t>0?(a.style.display="inline",a.textContent=`${t} nya`):a.style.display="none",N(),s("view-calendar").classList.contains("active")&&x()}function U(){const e=s("filter-search").value.toLowerCase().trim(),n=s("filter-from").value,t=s("filter-to").value;return C.filter(a=>!(e&&!((a.customer_name||"").toLowerCase().includes(e)||(a.id||"").toLowerCase().includes(e))||n&&a.event_date&&a.event_date<n||t&&a.event_date&&a.event_date>t))}["filter-search","filter-from","filter-to"].forEach(e=>{s(e).addEventListener("input",N)});function N(){const e=U(),n=["open","proposal","waiting","confirmed","cancelled"],t=s("kanban-board");t.innerHTML=n.map(a=>{const i=_[a],d=e.filter(l=>l.status===a);return`
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="col-title ${i.cls}">${i.icon} ${i.label}</div>
          <div class="col-count">${d.length}</div>
        </div>
        <div class="kanban-cards">
          ${d.length===0?'<div class="empty-col">Tom</div>':d.map(l=>Y(l)).join("")}
        </div>
      </div>`}).join(""),t.onclick=a=>{const i=a.target.closest(".cart-card");i&&H(i.dataset.id)}}function Y(e){const n=e.total_excl?h(Math.round(e.total_excl/100))+" kr":"–",t=e.unread_count>0?`<span class="unread-pill">💬 ${e.unread_count} ny${e.unread_count>1?"a":"t"}</span>`:"",a=e.created_at?Math.floor((Date.now()-new Date(e.created_at))/864e5):null,i=a===0?"Idag":a===1?"Igår":a!=null?`${a} dagar sedan`:"";return`
    <div class="cart-card" data-id="${e.id}">
      <div class="cart-card-name">${e.customer_name||"Okänd kund"}</div>
      <div class="cart-card-sub">${e.customer_email||""}</div>
      <div class="cart-card-meta">
        ${e.event_date?`<span>📅 ${O(e.event_date)}</span>`:""}
        ${e.event_location?`<span>📍 ${e.event_location}</span>`:""}
        ${i?`<span>🕐 ${i}</span>`:""}
      </div>
      <div class="cart-card-footer">
        <span class="cart-card-price">${n}</span>
        ${t}
      </div>
    </div>`}async function H(e){r=null,b=[],D=[],$="info";const n=s("detail-overlay"),t=s("detail-panel");n.classList.add("open"),t.classList.add("open"),s("panel-body").innerHTML='<div class="loading-center"><div class="spinner"></div></div>',s("panel-footer").innerHTML="",s("panel-title").textContent="Laddar…";let a,i;try{({ok:a,data:i}=await f(`admin-carts?id=${e}`))}catch(v){o("Kunde inte ladda varukorg: "+v.message,"error"),w();return}if(!a){o("Kunde inte ladda varukorg","error"),w();return}r=i.cart,b=i.messages||[],D=i.audit_log||[],s("panel-title").textContent=`${r.customer_name||"Okänd"} — ${r.id}`;const d=document.getElementById("panel-quick");d&&d.remove();const l=b.filter(v=>v.sender==="customer"&&!v.read_at).length,m=s("chat-unread-badge");l>0?(m.style.display="inline",m.textContent=l):m.style.display="none",P(),k("info"),T()}function P(){document.querySelectorAll(".panel-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===$),e.onclick=()=>{$=e.dataset.tab,P(),k($)}})}function k(e){const n=s("panel-body");e==="info"&&(n.innerHTML=Q()),e==="products"&&(n.innerHTML=R()),e==="chat"&&G(),e==="log"&&(n.innerHTML=V()),e==="info"&&(s("status-select")?.addEventListener("change",async t=>{const a=t.target.value;if(!confirm(`Ändra status till "${_[a]?.label}"?`)){t.target.value=r.status;return}const{ok:i}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:r.id,status:a})});i?(r.status=a,o("Status uppdaterad!"),y(),T()):o("Fel vid statusändring","error")}),s("save-notes-btn")?.addEventListener("click",async()=>{const t=s("admin-notes").value,{ok:a}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:r.id,notes_admin:t})});a?(r.notes_admin=t,o("Anteckning sparad!")):o("Kunde inte spara","error")})),e==="chat"&&(s("chat-send-btn")?.addEventListener("click",A),s("chat-input")?.addEventListener("keydown",t=>{t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&A()}))}function Q(){const e=r,n=_[e.status];return`
    <div class="section-label">Status</div>
    <div class="status-row">
      <select class="status-select" id="status-select">
        ${Object.entries(_).map(([t,a])=>`<option value="${t}" ${t===e.status?"selected":""}>${a.icon} ${a.label}</option>`).join("")}
      </select>
      <span class="${n.cls}" style="font-size:0.85rem;font-weight:600;">${n.icon} ${n.label}</span>
    </div>

    <div class="section-label">Kundinformation</div>
    <div class="info-grid">
      <div class="info-field"><div class="info-field-label">Namn</div><div class="info-field-value">${e.customer_name||"–"}</div></div>
      <div class="info-field"><div class="info-field-label">E-post</div><div class="info-field-value">${e.customer_email?`<a href="mailto:${e.customer_email}" style="color:var(--brand-lav)">${e.customer_email}</a>`:"–"}</div></div>
      <div class="info-field"><div class="info-field-label">Telefon</div><div class="info-field-value">${e.customer_phone?`<a href="tel:${e.customer_phone}" style="color:var(--brand-lav)">${e.customer_phone}</a>`:"–"}</div></div>
      <div class="info-field"><div class="info-field-label">Eventdatum</div><div class="info-field-value">${O(e.event_date)}</div></div>
      <div class="info-field" style="grid-column:1/-1"><div class="info-field-label">Plats / Adress</div><div class="info-field-value">${e.event_location||"–"}</div></div>
    </div>

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
      <div class="info-field"><div class="info-field-label">Skapad</div><div class="info-field-value" style="font-size:0.8rem">${g(e.created_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Uppdaterad</div><div class="info-field-value" style="font-size:0.8rem">${g(e.updated_at)}</div></div>
      <div class="info-field"><div class="info-field-label">Kund senast aktiv</div><div class="info-field-value" style="font-size:0.8rem">${g(e.last_read_customer)}</div></div>
      <div class="info-field"><div class="info-field-label">Utgår</div><div class="info-field-value" style="font-size:0.8rem;color:${e.expires_at?"var(--amber)":"var(--green)"}">${e.expires_at?O(e.expires_at):"♾ Bekräftad"}</div></div>
    </div>

    <div class="section-label">Intern anteckning (visas ej för kund)</div>
    <textarea class="admin-note-area" id="admin-notes" placeholder="Anteckna priser, tillgänglighet, intern kommunikation...">${e.notes_admin||""}</textarea>
    <button class="btn-action" id="save-notes-btn" style="margin-top:0.75rem">💾 Spara anteckning</button>
  `}function R(){const e=r.items||[],n=e.reduce((t,a)=>t+(a.price||0)*(a.qty||a.quantity||1),0);return`
    <div class="section-label">Produkter (${e.length} st)</div>
    ${e.length===0?'<div class="empty-col">Inga produkter i varukorgen</div>':`
    <table class="product-table">
      <thead><tr>
        <th>Produkt</th><th style="text-align:center">Antal</th>
        <th style="text-align:right">à-pris</th><th style="text-align:right">Summa</th>
      </tr></thead>
      <tbody>
        ${e.map(t=>{const a=t.qty||t.quantity||1,i=(t.price||0)*a;return`<tr>
            <td>${t.name||"–"}<br><span style="color:var(--text-faint);font-size:0.75rem">${t.category||""} ${t.id?"· "+t.id:""}</span></td>
            <td style="text-align:center">${a}</td>
            <td style="text-align:right">${h(t.price)} kr</td>
            <td style="text-align:right;color:var(--brand-lav);font-weight:600">${h(i)} kr</td>
          </tr>`}).join("")}
      </tbody>
      <tfoot><tr class="total-row">
        <td colspan="3">Totalt (exkl. moms)</td>
        <td style="text-align:right">${h(n)} kr</td>
      </tr>
      <tr><td colspan="3" style="color:var(--text-faint);font-size:0.8rem">Inkl. 25% moms</td>
        <td style="text-align:right;color:var(--text-muted);font-size:0.85rem">${h(Math.round(n*1.25))} kr</td>
      </tr></tfoot>
    </table>`}
    <div style="margin-top:1.5rem;padding:1rem;background:var(--bg);border-radius:8px;font-size:0.82rem;color:var(--text-faint)">
      💡 Produktredigering via adminpanel kommer i nästa version. Ändringar görs tills vidare direkt i Supabase.
    </div>
  `}function G(){const e=s("panel-body"),n=b,t=n.length===0?'<div class="chat-empty">Ingen chatt ännu.</div>':`<div class="chat-messages">${n.map(a=>{const i=a.sender==="admin"?a.read_at?`<span class="read-check">✓✓</span> Läst ${g(a.read_at)}`:"⏳ Inte läst":a.read_at?`Läst ${g(a.read_at)}`:"";return`
          <div class="msg-wrap ${a.sender}">
            <div class="msg-bubble">${a.body.replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--brand-lav)">$1</a>')}</div>
            <div class="msg-meta">
              <span>${a.sender==="admin"?"👤 Du":"🧑 Kund"} · ${g(a.created_at)}</span>
              ${i?`<span>${i}</span>`:""}
            </div>
          </div>`}).join("")}</div>`;e.innerHTML=`
    ${t}
    <div class="section-label">Nytt meddelande till kund</div>
    <div class="chat-input-wrap">
      <textarea class="chat-textarea" id="chat-input" placeholder="Skriv ett meddelande… (Ctrl+Enter för att skicka)"></textarea>
      <button class="chat-send-btn" id="chat-send-btn">Skicka till kund →</button>
    </div>`,setTimeout(()=>{const a=e.querySelector(".chat-messages");a&&(a.scrollTop=a.scrollHeight),e.scrollTop=e.scrollHeight},50)}async function A(){const e=s("chat-input"),n=s("chat-send-btn"),t=e?.value.trim();if(!t)return;n.disabled=!0,n.textContent="Skickar…";const{ok:a,data:i}=await f("cart-message",{method:"POST",body:JSON.stringify({cart_id:r.id,body:t})});a?(b.push({id:i.message?.id||Date.now(),cart_id:r.id,sender:"admin",body:t,read_at:null,created_at:new Date().toISOString()}),e.value="",k("chat"),o("Meddelande skickat!"),y()):(o(i.error||"Kunde inte skicka","error"),n.disabled=!1,n.textContent="Skicka till kund →")}function V(){const e=D;return e.length===0?'<div class="empty-col" style="padding:3rem">Ingen logg ännu.</div>':`
    <div class="section-label">Händelselogg (senaste 50)</div>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${e.map(n=>`
        <div style="background:var(--bg);border-radius:8px;padding:0.75rem;display:flex;gap:1rem;align-items:flex-start">
          <div style="font-size:0.75rem;color:var(--text-faint);white-space:nowrap;min-width:130px">${g(n.created_at)}</div>
          <div>
            <div style="font-size:0.85rem;font-weight:600">${n.event_type}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${n.actor} ${n.payload&&Object.keys(n.payload).length?"· "+JSON.stringify(n.payload):""}</div>
          </div>
        </div>`).join("")}
    </div>`}function T(){const e=r,n=s("panel-footer");n.innerHTML="";const t=(a,i,d)=>{const l=document.createElement("button");l.className=`btn-action ${i}`,l.textContent=a,l.onclick=d,n.appendChild(l)};e.status!=="confirmed"&&e.status!=="cancelled"&&(t("✅ Bekräfta order","btn-success",W),t("📩 Skicka notis till kund","",Z)),e.status!=="cancelled"&&t("❌ Avbryt order","btn-danger",X),e.cart_token&&t("🔗 Kopiera kundlänk","",()=>{const a=`https://scenkonsult.se/varukorg/?cart=${e.id}&token=${e.cart_token}`;navigator.clipboard.writeText(a),o("Kundlänk kopierad!")})}async function W(){if(!confirm("Bekräfta ordern? Status ändras till Orderbekräftelse och TTL tas bort."))return;const{ok:e}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:r.id,status:"confirmed"})});e?(r.status="confirmed",o("Order bekräftad! ✅"),y(),k("info"),T()):o("Fel vid bekräftelse","error")}async function X(){if(!confirm("Avbryt ordern? Den sparas i 90 dagar."))return;const{ok:e}=await f("cart-update",{method:"POST",body:JSON.stringify({cart_id:r.id,status:"cancelled"})});e?(r.status="cancelled",o("Order avbruten"),y(),k("info"),T()):o("Fel vid avbrytning","error")}async function Z(){const e=prompt("Meddelande till kund (skickas via e-post):");if(!e?.trim())return;const{ok:n}=await f("cart-message",{method:"POST",body:JSON.stringify({cart_id:r.id,body:e.trim()})});n?(o("Notis skickad till kund! 📩"),b.push({id:Date.now(),cart_id:r.id,sender:"admin",body:e.trim(),read_at:null,created_at:new Date().toISOString()}),$==="chat"&&k("chat")):o("Kunde inte skicka notis","error")}s("panel-close").addEventListener("click",w);s("detail-overlay").addEventListener("click",w);document.addEventListener("keydown",e=>e.key==="Escape"&&w());function w(){s("detail-overlay").classList.remove("open"),s("detail-panel").classList.remove("open"),r=null}s("cal-prev").addEventListener("click",()=>{--u<0&&(u=11,p--),x()});s("cal-next").addEventListener("click",()=>{++u>11&&(u=0,p++),x()});s("cal-today").addEventListener("click",()=>{p=new Date().getFullYear(),u=new Date().getMonth(),x()});function x(){const e=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];s("cal-month-label").textContent=`${e[u]} ${p}`;const n=new Date(p,u,1),t=new Date(p,u+1,0),a=new Date;let i=n.getDay()-1;i<0&&(i=6);const d=s("cal-days");d.innerHTML="";const l=Math.ceil((i+t.getDate())/7)*7;for(let m=0;m<l;m++){const v=m-i+1,E=new Date(p,u,v),M=v<1||v>t.getDate(),j=!M&&E.toDateString()===a.toDateString(),q=E.toISOString().split("T")[0],F=C.filter(c=>c.event_date===q&&c.status!=="cancelled"),S=document.createElement("div");S.className=`cal-day${M?" other-month":""}${j?" today":""}`,S.innerHTML=`<div class="cal-day-num">${E.getDate()}</div>
      ${F.map(c=>`
        <div class="cal-event s-${c.status}" data-id="${c.id}">
          ${_[c.status]?.icon} ${c.customer_name||c.id}
        </div>`).join("")}`,S.querySelectorAll(".cal-event").forEach(c=>{c.addEventListener("click",J=>{J.stopPropagation(),H(c.dataset.id)})}),d.appendChild(S)}}s("refresh-btn").addEventListener("click",()=>{y(),o("Uppdaterat!")});function ee(){clearInterval(I),I=setInterval(y,3e4)}B();
