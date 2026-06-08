// ================================================
// DARK MODE
// ================================================

// Terapkan tema tersimpan saat halaman pertama dibuka
if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap');
  document.querySelector('#theme-btn').textContent = '☀️ Mode Terang';
}

// Toggle dark mode saat tombol diklik
document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');

  const sedangGelap = document.body.classList.contains('gelap');

  // Simpan preferensi ke localStorage
  localStorage.setItem('tema', sedangGelap ? 'gelap' : 'terang');

  // Ubah teks tombol
  document.querySelector('#theme-btn').textContent =
    sedangGelap ? '☀️ Mode Terang' : '🌙 Mode Gelap';
});


// ================================================
// FUNGSI VALIDASI REUSABLE
// ================================================

function validasi(id, aturan, pesan) {
  const el  = document.querySelector('#' + id);
  const err = el.nextElementSibling;  // <span class="pesan-error">

  // Kalau next sibling-nya bukan pesan-error, cari yang lebih jauh
  // (untuk password yang punya .bilah dan .strength-label di antara)
  const pesanEl = el.closest('.field').querySelector('.pesan-error');

  const lulus = aturan(el.value.trim());

  el.classList.toggle('valid',   lulus);
  el.classList.toggle('invalid', !lulus && el.value !== '');

  if (pesanEl) {
    pesanEl.textContent = lulus ? '' : pesan;
  }

  return lulus;
}


// ================================================
// VALIDASI REAL-TIME PER FIELD
// ================================================

document.querySelector('#nama').addEventListener('input', () =>
  validasi('nama', v => v.length >= 3, 'Minimal 3 karakter')
);

document.querySelector('#email').addEventListener('input', () =>
  validasi('email',
    v => /^[^@]+@[^@]+\.[^@]+$/.test(v),
    'Format email tidak valid')
);

document.querySelector('#password').addEventListener('input', () =>
  validasi('password', v => v.length >= 8, 'Minimal 8 karakter')
);


// ================================================
// PASSWORD STRENGTH BAR
// ================================================

document.querySelector('#password').addEventListener('input', e => {
  const panjang = e.target.value.length;
  const persen  = Math.min(panjang / 12 * 100, 100);
  const bar     = document.querySelector('.isian');
  const label   = document.querySelector('#strength-label');

  bar.style.width = persen + '%';

  if (panjang === 0) {
    bar.style.background = 'transparent';
    label.textContent    = '';
  } else if (persen < 40) {
    bar.style.background = '#e54b5a';
    label.textContent    = 'Lemah';
    label.style.color    = '#e54b5a';
  } else if (persen < 70) {
    bar.style.background = '#ff9933';
    label.textContent    = 'Sedang';
    label.style.color    = '#ff9933';
  } else {
    bar.style.background = '#27c467';
    label.textContent    = 'Kuat';
    label.style.color    = '#27c467';
  }
});


// ================================================
// SUBMIT HANDLER
// ================================================

document.querySelector('#formulir').addEventListener('submit', e => {
  e.preventDefault(); // cegah halaman reload

  // Validasi semua field sekaligus
  const semuaValid = [
    validasi('nama',     v => v.length >= 3,                  'Minimal 3 karakter'),
    validasi('email',    v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email tidak valid'),
    validasi('password', v => v.length >= 8,                  'Minimal 8 karakter'),
  ].every(Boolean); // true hanya kalau SEMUA bernilai true

  if (!semuaValid) return; // ada yang tidak valid, berhenti

  // Semua valid → tampilkan pesan sukses
  document.querySelector('#formulir').classList.add('tersembunyi');
  document.querySelector('#sukses').classList.remove('tersembunyi');
});