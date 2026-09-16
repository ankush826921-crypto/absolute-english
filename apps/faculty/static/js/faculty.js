(function () { "use strict"; const api=window.LinguaFacultyAPI; if(!api)return;
document.addEventListener("DOMContentLoaded", async () => { const $=(s)=>document.querySelector(s), grid=$("#faculty-grid"), loading=$("#faculty-loading"), empty=$("#faculty-empty"), error=$("#faculty-error"), count=$("#faculty-result-count"), form=$("#faculty-filters"); let teachers=[];
const imageFallback=(event)=>{ event.currentTarget.onerror=null; event.currentTarget.src="https://placehold.co/700x440/e0e7ff/172554?text=Lingua+Academy"; };
const card=(t)=>`<article class="faculty-card" data-faculty-reveal><div class="faculty-card__image"><img src="${t.image}" alt="${t.name}, ${t.designation}" loading="lazy"></div><div class="faculty-card__body"><h3>${t.name}</h3><p class="faculty-card__designation">${t.designation}</p><p class="faculty-card__meta">${t.experience}+ years experience · ${t.language}</p><div class="faculty-tags">${t.specialization.map(x=>`<span class="faculty-tag">${x}</span>`).join("")}</div><div class="faculty-card__metrics"><span class="faculty-rating">★★★★★ ${t.rating}</span><span>${t.students.toLocaleString()}+ students</span></div><div class="faculty-card__actions">

<a class="faculty-button faculty-button--outline" href="/faculty/profile/?id=${t.id}">View Profile</a>

<a class="faculty-button faculty-button--outline"
href="/faculty/courses/?instructor=${t.id}">
Courses</a>

<a class="faculty-button faculty-button--orange" href="/trial/class/?teacher=${t.id}">Book Trial</a>

</div></div></article>`;
const opts=(id,values)=>{ const element=$(id); [...new Set(values)].sort().forEach(v=>element.insertAdjacentHTML("beforeend",`<option value="${v}">${v}</option>`)); };
function render(){ const q=$("#faculty-search").value.trim().toLowerCase(), lang=$("#faculty-language").value, spec=$("#faculty-specialization").value, exp=$("#faculty-experience").value; const results=teachers.filter(t=>!q||t.name.toLowerCase().includes(q)).filter(t=>!lang||t.language===lang).filter(t=>!spec||t.specialization.includes(spec)).filter(t=>!exp||(exp==="8+"?t.experience>=8:exp==="4-7"?t.experience>=4&&t.experience<=7:t.experience<=3)); grid.innerHTML=results.map(card).join(""); grid.querySelectorAll("img").forEach(img=>img.addEventListener("error",imageFallback)); count.textContent=`${results.length} instructor${results.length===1?"":"s"} found`; empty.hidden=results.length>0; observeReveals(); }
function reset(){ form.reset(); render(); } function observeReveals(){ document.querySelectorAll("[data-faculty-reveal]").forEach(el=>el.classList.add("is-visible")); }
try { teachers=await api.getTeachers(); opts("#faculty-language",teachers.map(t=>t.language)); opts("#faculty-specialization",teachers.flatMap(t=>t.specialization)); render(); loading.hidden=true; form.addEventListener("input",render); form.addEventListener("change",render); $("#faculty-reset").addEventListener("click",reset); document.querySelector("[data-reset-faculty]").addEventListener("click",reset); } catch(e) { loading.hidden=true; error.hidden=false; document.querySelector("[data-retry-faculty]").addEventListener("click",()=>location.reload()); }
const stats=document.querySelectorAll("[data-count]"); const statObserver=new IntersectionObserver((entries,o)=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count),suffix=el.dataset.suffix||"",start=performance.now();const tick=(now)=>{const p=Math.min((now-start)/900,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)))+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);o.unobserve(el)}),{threshold:.5}); stats.forEach(s=>statObserver.observe(s)); observeReveals(); }); })();
