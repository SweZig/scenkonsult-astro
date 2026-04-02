import"./hoisted.BBHk1fT0.js";if(!window.__mcInit){let d=function(e){const o=r[e];if(!o)return;const t=document.getElementById(`${e}-area`),i=document.getElementById(`${e}-dots`);if(!t)return;const n=o.slides[o.current],c=n.type==="video",s=t.querySelector("video");s&&(s.pause(),s.src=""),c?(t.innerHTML=`
        <video
          src="${n.src}"
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-cover"
          style="display:block"
        ></video>
        <div style="position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:5px;background:rgba(12,10,36,.75);border:1px solid rgba(196,181,244,.3);border-radius:4px;padding:3px 8px;font-size:9px;color:rgba(196,181,244,.85);font-weight:700;letter-spacing:.04em;pointer-events:none">
          <span style="width:6px;height:6px;border-radius:50%;background:#c4b5f4;animation:mcPulse 1.1s ease-in-out infinite;flex-shrink:0"></span>
          SPELAS
        </div>
        <div style="position:absolute;bottom:0;left:0;width:100%;height:2px;background:rgba(255,255,255,.1)">
          <div style="height:100%;background:#c4b5f4;animation:mcProgress 8s linear infinite"></div>
        </div>`,t.style.cursor="pointer",t.onclick=null):(t.innerHTML=`<img
        src="${n.src}"
        alt=""
        width="512" height="427"
        loading="lazy"
        class="w-full h-full object-cover"
        style="display:block;transition:transform .3s"
      />`,t.style.cursor="pointer",t.onclick=null),i&&i.querySelectorAll(".mc-dot").forEach((p,m)=>{const f=m===o.current,g=o.slides[m].type==="video";p.className=`mc-dot transition-all ${f?"bg-brand-orange w-2.5 h-2":"bg-white/30 w-2 h-2"} ${g?"rounded-sm":"rounded-full"}`})},l=function(e,o){const t=r[e];t&&(t.current=(t.current+o+t.slides.length)%t.slides.length,d(e))},u=function(e,o){const t=r[e];t&&(t.current=o,d(e))},a=function(){document.querySelectorAll("[data-mc-id]").forEach(e=>{const o=e.dataset.mcId;if(!r[o])try{const t=JSON.parse(e.dataset.mcSlides||"[]");r[o]={slides:t,current:0},d(o)}catch{}})};window.__mcInit=!0;const r={};window.mcGo=l,window.mcGoto=u,document.addEventListener("click",e=>{const o=e.target,t=o.closest(".mc-arr");if(t){e.stopPropagation();const n=t.closest("[data-mc-id]");if(!n)return;const c=n.dataset.mcId,s=parseInt(t.dataset.mcDir||"1",10);l(c,s);return}const i=o.closest(".mc-dot");if(i){e.stopPropagation();const n=i.closest("[data-mc-id]");if(!n)return;const c=n.dataset.mcId,s=parseInt(i.dataset.mcGoto||"0",10);u(c,s);return}}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a):a(),document.addEventListener("astro:page-load",a)}
