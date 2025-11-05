// home.js
document.addEventListener('DOMContentLoaded', () => {
  // render chips
  const chips = ['Pedas Nusantara','Manis Tradisional','Seafood','Jajanan Jalanan'];
  const chipsEl = document.createElement('div'); chipsEl.className='chips';
  chips.forEach(c=>{
    const btn=document.createElement('button');
    btn.type='button'; btn.className='chip'; btn.textContent=c;
    btn.addEventListener('click', ()=> window.location.href='jelajah.html');
    chipsEl.appendChild(btn);
  });

  // insert chips into hero container (if exists)
  const hero = document.querySelector('.hero');
  if(hero) hero.parentNode.insertBefore(chipsEl, hero.nextSibling);

  // load popular
  fetch('mock/popular.json').then(r=>{
    if(!r.ok) throw new Error('gagal load popular');
    return r.json();
  }).then(list=>{
    const grid=document.getElementById('popular-grid');
    if(!grid) return;
    grid.innerHTML = list.slice(0,4).map(item => `
      <article class="card" tabindex="0" aria-label="${item.title}">
        <img src="${item.image}" alt="${item.title}">
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
          <div class="card-sub">${item.region} • ★ ${item.rating}</div>
          <p class="card-desc">${item.short}</p>
          <div style="margin-top:10px;">
            <button class="btn-ghost" onclick="alert('Detail UI-only')">Lihat</button>
          </div>
        </div>
      </article>
    `).join('');
  }).catch(err => {
    const grid=document.getElementById('popular-grid');
    if(grid) grid.innerHTML = '<div role="alert">Tidak dapat memuat data populer.</div>';
    console.error(err);
  });

  // show user name if logged in
  try {
    const auth = JSON.parse(localStorage.getItem('authUser') || 'null');
    if(auth && auth.name){
      const el = document.getElementById('userNameHeader');
      if(el) el.textContent = auth.name;
    }
  } catch(e){/* ignore */}
});
