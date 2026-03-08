import"./hoisted.HnpTp137.js";function i(e){return e.toLocaleString("sv")+" kr"}function l(){try{return JSON.parse(localStorage.getItem("sk-cart")||"[]")}catch{return[]}}function f(e){try{localStorage.setItem("sk-cart",JSON.stringify(e))}catch{}}function h(){const e=l().reduce((r,c)=>r+c.qty,0),a=document.getElementById("navCartBadge");a&&(a.textContent=String(e),a.classList.toggle("hidden",e===0))}function p(){const e=l(),a=document.getElementById("cartEmpty"),r=document.getElementById("cartContent"),c=document.getElementById("cartTableBody");if(e.length===0){a.classList.remove("hidden"),r.classList.add("hidden");return}a.classList.add("hidden"),r.classList.remove("hidden"),c.innerHTML=e.map(t=>`
      <tr data-id="${t.id}">
        <td>
          <div class="cart-product">
            ${t.image?`<img class="cart-product-img" src="${t.image}" alt="${t.name}" loading="lazy" />`:'<div class="cart-product-img-placeholder"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>'}
            <div>
              <div class="cart-product-name">${t.name}</div>
              <div class="cart-product-cat">${t.category}</div>
              <div class="cart-product-note">${t.priceNote}</div>
            </div>
          </div>
        </td>
        <td class="td-price">${i(t.price)}</td>
        <td>
          <div class="qty-stepper">
            <button class="qty-btn" data-action="dec" data-id="${t.id}">−</button>
            <input class="qty-val" type="number" min="1" max="99" value="${t.qty}" data-id="${t.id}" readonly />
            <button class="qty-btn" data-action="inc" data-id="${t.id}">+</button>
          </div>
        </td>
        <td class="td-total">${i(t.price*t.qty)}</td>
        <td class="td-remove">
          <button class="remove-btn" data-id="${t.id}" aria-label="Ta bort">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join("");const d=e.reduce((t,s)=>t+s.price*s.qty,0),o=Math.round(d*.25),n=d+o;document.getElementById("cartSubtotal").textContent=i(d),document.getElementById("cartVat").textContent=i(o),document.getElementById("cartTotal").textContent=i(n),c.querySelectorAll(".qty-btn").forEach(t=>{t.addEventListener("click",s=>{const m=s.currentTarget,y=m.dataset.id,g=l(),u=g.find(v=>v.id===y);if(!u)return;m.dataset.action==="inc"?u.qty+=1:m.dataset.action==="dec"&&(u.qty=Math.max(0,u.qty-1));const b=g.filter(v=>v.qty>0);f(b),h(),p()})}),c.querySelectorAll(".remove-btn").forEach(t=>{t.addEventListener("click",s=>{const y=s.currentTarget.dataset.id;f(l().filter(g=>g.id!==y)),h(),p()})})}document.getElementById("btnEmail")?.addEventListener("click",()=>{const e=l();if(e.length===0)return;const a=e.reduce((o,n)=>o+n.price*n.qty,0),r=Math.round(a*.25),c=e.map(o=>`- ${o.name} × ${o.qty}  →  ${(o.price*o.qty).toLocaleString("sv")} kr exkl. moms`).join(`
`),d=encodeURIComponent(`Hej Scenkonsult!

Jag är intresserad av att hyra följande:

${c}

Delsumma: ${a.toLocaleString("sv")} kr exkl. moms
Moms (25%): ${r.toLocaleString("sv")} kr
Totalt: ${(a+r).toLocaleString("sv")} kr inkl. moms

Kontakta mig gärna för att boka!

Med vänliga hälsningar,`);window.location.href=`mailto:info@scenkonsult.se?subject=Offertförfrågan%20från%20scenkonsult.se&body=${d}`});document.getElementById("btnSave")?.addEventListener("click",()=>{const e=l();if(e.length===0)return;const a=e.reduce((n,t)=>n+t.price*t.qty,0),r=Math.round(a*.25),c=e.map(n=>`
      <tr>
        <td>${n.name}</td>
        <td>${n.category}</td>
        <td style="text-align:center">${n.qty}</td>
        <td style="text-align:right">${n.price.toLocaleString("sv")} kr</td>
        <td style="text-align:right">${(n.price*n.qty).toLocaleString("sv")} kr</td>
      </tr>`).join(""),d=`<!DOCTYPE html>
<html lang="sv"><head><meta charset="UTF-8"><title>Varukorg – Scenkonsult</title>
<style>
  body{font-family:Arial,sans-serif;padding:2rem;color:#111;max-width:750px;margin:0 auto}
  h1{color:#1e1850;margin-bottom:0.3rem}
  p.sub{color:#666;font-size:.85rem;margin-bottom:2rem}
  table{width:100%;border-collapse:collapse;margin-bottom:1.5rem}
  th{background:#1e1850;color:white;padding:.6rem 1rem;text-align:left;font-size:.8rem}
  td{padding:.6rem 1rem;border-bottom:1px solid #eee;font-size:.9rem}
  .summary{text-align:right}
  .total{font-weight:700;font-size:1.1rem;color:#1e1850}
  .footer{margin-top:2rem;font-size:.8rem;color:#999;border-top:1px solid #eee;padding-top:1rem}
</style></head><body>
<h1>Scenkonsult – Offertunderlag</h1>
<p class="sub">Genererat ${new Date().toLocaleDateString("sv")} | info@scenkonsult.se | 072-448 10 00</p>
<table>
  <thead><tr><th>Produkt</th><th>Kategori</th><th>Antal</th><th>Styckpris</th><th>Totalt</th></tr></thead>
  <tbody>${c}</tbody>
</table>
<div class="summary">
  <p>Exkl. moms: <strong>${a.toLocaleString("sv")} kr</strong></p>
  <p>Moms 25%: ${r.toLocaleString("sv")} kr</p>
  <p class="total">Totalt inkl. moms: ${(a+r).toLocaleString("sv")} kr</p>
</div>
<p class="footer">Alla priser avser hyra per dygn (22 timmar). Leverans och montering tillkommer. Kontakta oss för slutlig offert och bokning.</p>
</body></html>`,o=window.open("","_blank");o&&(o.document.write(d),o.document.close(),o.focus(),o.print())});document.getElementById("btnClear")?.addEventListener("click",()=>{confirm("Töm hela varukorgen?")&&(localStorage.removeItem("sk-cart"),h(),p())});p();h();
