// auth.js
function showToast(msg, timeout=3000){
  let t = document.getElementById('globalToast');
  if(!t){
    t = document.createElement('div'); t.id='globalToast'; t.className='toast';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.display='block';
  setTimeout(()=> t.style.display='none', timeout);
}

/* helper validate email */
function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

/* LOGIN */
document.addEventListener('DOMContentLoaded', ()=>{
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    const emailEl = loginForm.querySelector('#loginEmail');
    const passEl  = loginForm.querySelector('#loginPassword');
    const toggle  = loginForm.querySelector('#togglePassword');
    // show/hide
    toggle?.addEventListener('click', ()=>{
      if(passEl.type==='password'){passEl.type='text'; toggle.textContent='Sembunyikan'} else {passEl.type='password'; toggle.textContent='Tampilkan'}
    });

    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = emailEl.value.trim();
      const pass = passEl.value.trim();
      if(!email || !pass){ showToast('Silakan isi semua field'); return; }
      if(!validEmail(email)){ showToast('Format email tidak valid'); return; }
      if(pass.length < 6){ showToast('Password minimal 6 karakter'); return; }

      // dummy authUser
      const nameFromEmail = email.split('@')[0].replace(/[^\w]/g,' ');
      const authUser = { name: nameFromEmail, email, avatar:'', bio:'', province:'' };
      localStorage.setItem('authUser', JSON.stringify(authUser));
      showToast('Login berhasil');
      // update header name and redirect to homepage after short delay
      setTimeout(()=> window.location.href = 'index.html', 700);
    });
  }

  /* REGISTER */
  const regForm = document.getElementById('registerForm');
  if(regForm){
    const nameEl = regForm.querySelector('#regName');
    const emailEl = regForm.querySelector('#regEmail');
    const passEl = regForm.querySelector('#regPassword');
    const confEl = regForm.querySelector('#regConfirm');
    const strengthEl = regForm.querySelector('#pwStrength');

    passEl?.addEventListener('input', ()=>{
      const v = passEl.value;
      // simple strength meter
      let score = 0;
      if(v.length >= 8) score++;
      if(/[A-Z]/.test(v)) score++;
      if(/[0-9]/.test(v)) score++;
      if(/[^A-Za-z0-9]/.test(v)) score++;
      const labels = ['Lemah','Sedang','Kuat','Sangat Kuat'];
      strengthEl.textContent = v ? labels[Math.min(score-1,3)] : '';
    });

    regForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const pass = passEl.value;
      const conf = confEl.value;
      if(!name || !email || !pass || !conf){ showToast('Semua field wajib diisi'); return; }
      if(!validEmail(email)){ showToast('Format email tidak valid'); return; }
      if(pass.length < 6){ showToast('Password minimal 6 karakter'); return; }
      if(pass !== conf){ showToast('Konfirmasi password tidak cocok'); return; }

      const authUser = { name, email, avatar:'', bio:'', province:'' };
      localStorage.setItem('authUser', JSON.stringify(authUser));
      showToast('Pendaftaran berhasil. Sedang diarahkan...');
      setTimeout(()=> window.location.href = 'index.html',700);
    });
  }

  /* FORGOT PASSWORD */
  const forgotForm = document.getElementById('forgotForm');
  if(forgotForm){
    forgotForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = forgotForm.querySelector('#forgotEmail').value.trim();
      if(!validEmail(email)){ showToast('Masukkan email valid'); return; }
      // show card / info
      const info = document.getElementById('forgotInfo');
      if(info){ info.style.display = 'block'; }
      showToast('Email reset telah dikirim (simulasi)');
    });
  }

});
