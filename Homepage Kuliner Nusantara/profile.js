// profile.js
document.addEventListener('DOMContentLoaded', ()=>{
  const authKey = 'authUser';
  let auth = JSON.parse(localStorage.getItem(authKey) || 'null');
  const nameEl = document.getElementById('profileName');
  const bioEl  = document.getElementById('profileBio');
  const provEl  = document.getElementById('profileProv');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarInput = document.getElementById('avatarInput');
  const saveBtn = document.getElementById('saveProfile');
  const logoutBtn = document.getElementById('logoutBtn');

  if(!auth){ window.location.href='login.html'; return; }

  // populate fields
  if(nameEl) nameEl.value = auth.name || '';
  if(bioEl) bioEl.value = auth.bio || '';
  if(avatarPreview) avatarPreview.src = auth.avatar || 'logo-kuliner.png';

  // load provinsi list
  fetch('mock/provinsi.json').then(r=>r.json()).then(list=>{
    if(!provEl) return;
    provEl.innerHTML = `<option value="">Pilih Provinsi</option>` + list.map(p=>`<option value="${p}">${p}</option>`).join('');
    if(auth.province) provEl.value = auth.province;
  });

  // avatar preview + optional compress resize to 300x300
  avatarInput?.addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      // compress using canvas
      const img = new Image();
      img.onload = function(){
        const MAX = 300;
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if(w > h){ if(w>MAX){ h = Math.round(h * MAX / w); w = MAX; } }
        else { if(h>MAX){ w = Math.round(w * MAX / h); h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        avatarPreview.src = dataUrl;
        // store temporarily on auth object, saved on Save
        auth.avatar = dataUrl;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(f);
  });

  // save profile
  saveBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    const newName = nameEl.value.trim();
    const newBio = bioEl.value.trim();
    const newProv = provEl.value;
    if(!newName){ alert('Nama wajib diisi'); nameEl.focus(); return; }
    if(newBio.length > 160){ alert('Bio maksimal 160 karakter'); return; }
    auth.name = newName; auth.bio = newBio; auth.province = newProv;
    // avatar may already be set on auth.avatar from upload
    localStorage.setItem(authKey, JSON.stringify(auth));
    // update header display (if any)
    const userNameHeader = document.getElementById('userNameHeader');
    if(userNameHeader) userNameHeader.textContent = auth.name;
    // show toast (simple)
    const t = document.createElement('div'); t.className='toast'; t.textContent='Profil tersimpan'; document.body.appendChild(t);
    setTimeout(()=> t.remove(),1500);
  });

  // logout
  logoutBtn?.addEventListener('click', ()=>{
    localStorage.removeItem(authKey);
    window.location.href = 'index.html';
  });

});
