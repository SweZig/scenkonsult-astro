import"./hoisted.BfbnoOJF.js";document.getElementById("fbSend")?.addEventListener("click",()=>{const c=document.querySelector('input[name="feedbackType"]:checked')?.value||"Ej angiven",e=document.getElementById("fb-text")?.value.trim(),t=document.getElementById("fb-name")?.value.trim(),n=document.getElementById("fb-email")?.value.trim();if(!e){alert("Beskriv din feedback innan du skickar.");return}const o=encodeURIComponent(`Feedback-typ: ${c}

${e}`+(t?`

Från: ${t}`:"")+(n?`
E-post: ${n}`:""));window.location.href=`mailto:info@scenkonsult.se?subject=Feedback%20fr%C3%A5n%20scenkonsult.se&body=${o}`});
