// ============================================================
// DASHBOARD KEBUN BUAH NUSANTARA — app.js
// Fitur: Dark Mode, Tab Navigation, Accordion, Modal, Validasi
// ============================================================


// ============================================================
// 1. DARK MODE
//    - Toggle class 'gelap' ke body
//    - Simpan preferensi ke localStorage supaya tidak reset saat refresh
// ============================================================

// Terapkan tema tersimpan saat halaman pertama dibuka
if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap');
  document.querySelector('#theme-btn').textContent = '☀️ Mode Terang';
}

// Klik tombol dark mode
document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');

  const sedangGelap = document.body.classList.contains('gelap');

  // Simpan ke localStorage
  localStorage.setItem('tema', sedangGelap ? 'gelap' : 'terang');

  // Ubah label tombol
  document.querySelector('#theme-btn').textContent =
    sedangGelap ? '☀️ Mode Terang' : '🌙 Mode Gelap';
});


// ============================================================
// 2. TAB NAVIGATION
//    - Semua panel disembunyikan kecuali yang punya class 'aktif'
//    - Saat tombol tab diklik, panggil gantiTab(idPanel)
// ============================================================

function gantiTab(idPanel) {
  // Hapus class 'aktif' dari semua panel dan semua tombol tab
  document.querySelectorAll('.panel, .tombol-tab')
    .forEach(el => el.classList.remove('aktif'));

  // Tambah 'aktif' ke panel yang sesuai
  document.querySelector('#' + idPanel).classList.add('aktif');

  // Tambah 'aktif' ke tombol yang sesuai (pakai data-tab)
  document.querySelector(`[data-tab="${idPanel}"]`).classList.add('aktif');
}

// Pasang event listener ke semua tombol tab
document.querySelectorAll('.tombol-tab').forEach(btn => {
  btn.addEventListener('click', () => gantiTab(btn.dataset.tab));
});


// ============================================================
// 3. ACCORDION (FAQ)
//    - Klik judul → toggle class 'terbuka' di .item parent-nya
//    - CSS mengurus animasi max-height dan rotasi arrow
// ============================================================

document.querySelectorAll('.judul-akordion').forEach(tombol => {
  tombol.addEventListener('click', () => {
    // Toggle class 'terbuka' pada elemen .item (parent tombol)
    tombol.closest('.item').classList.toggle('terbuka');
  });
});


// ============================================================
// 4. MODAL
//    - Buka: tambah class 'terbuka' ke .overlay
//    - Tutup: hapus class 'terbuka' dari .overlay
//    - Bisa ditutup dengan klik di luar modal atau tekan Escape
// ============================================================

const overlay = document.querySelector('#overlay');

// Fungsi buka dan tutup modal
const bukaModal = () => overlay.classList.add('terbuka');
const tutupModal = () => {
  overlay.classList.remove('terbuka');
  // Reset form dan tampilan sukses saat modal ditutup
  setTimeout(() => {
    resetForm();
  }, 250); // tunggu animasi selesai dulu
};

// Tombol buka modal dari halaman Ikhtisar
document.querySelector('#btn-buka-modal').addEventListener('click', () => {
  document.querySelector('#f-buah').value = 'Umum';
  document.querySelector('#modal-judul').textContent = '📋 Tambah Laporan Panen';
  bukaModal();
});

// Tombol tutup (X) dan Batal
document.querySelector('#btn-tutup').addEventListener('click', tutupModal);
document.querySelector('#btn-batal').addEventListener('click', tutupModal);

// Tombol tutup di halaman sukses
document.querySelector('#btn-modal-close').addEventListener('click', tutupModal);

// Klik area gelap di luar modal = tutup
overlay.addEventListener('click', e => {
  if (e.target === overlay) tutupModal();
});

// Tekan Escape = tutup modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') tutupModal();
});

// Fungsi buka modal dari tabel (dengan nama buah)
function bukaModalPanen(namaBuah) {
  document.querySelector('#f-buah').value = namaBuah;
  document.querySelector('#modal-judul').textContent = `📋 Laporan Panen — ${namaBuah}`;
  bukaModal();
}

// Reset form ke kondisi awal
function resetForm() {
  document.querySelector('#form-laporan').classList.remove('tersembunyi');
  document.querySelector('#modal-sukses').classList.add('tersembunyi');
  document.querySelector('#form-laporan').reset();

  // Bersihkan class valid/invalid dari semua input
  document.querySelectorAll('#form-laporan input').forEach(input => {
    input.classList.remove('valid', 'invalid');
  });

  // Bersihkan semua pesan error
  document.querySelectorAll('#form-laporan .pesan-error').forEach(el => {
    el.textContent = '';
  });

  // Reset strength bar
  document.querySelector('.isian').style.width = '0%';
  document.querySelector('.isian').style.background = 'transparent';
  document.querySelector('#strength-label').textContent = '';
}


// ============================================================
// 5. VALIDASI FORM REAL-TIME
//    - Fungsi validasi() reusable untuk semua field
//    - Feedback visual langsung saat pengguna mengetik
// ============================================================

/**
 * Fungsi validasi reusable
 * @param {string} id       - ID elemen input
 * @param {Function} aturan - Fungsi yang menerima value, return true/false
 * @param {string} pesan    - Pesan error jika tidak valid
 * @returns {boolean}       - true jika valid
 */
function validasi(id, aturan, pesan) {
  const el      = document.querySelector('#' + id);
  const field   = el.closest('.field');
  const pesanEl = field.querySelector('.pesan-error');

  const lulus = aturan(el.value.trim());

  // Tambah/hapus class valid & invalid
  el.classList.toggle('valid',   lulus);
  // invalid hanya muncul jika sudah ada isian (bukan saat halaman baru dibuka)
  el.classList.toggle('invalid', !lulus && el.value !== '');

  // Tampilkan atau kosongkan pesan error
  if (pesanEl) {
    pesanEl.textContent = lulus ? '' : pesan;
  }

  return lulus;
}

// Validasi nama saat mengetik
document.querySelector('#f-nama').addEventListener('input', () =>
  validasi('f-nama', v => v.length >= 3, 'Nama minimal 3 karakter')
);

// Validasi email saat mengetik
document.querySelector('#f-email').addEventListener('input', () =>
  validasi('f-email',
    v => /^[^@]+@[^@]+\.[^@]+$/.test(v),
    'Format email tidak valid')
);

// Validasi PIN saat mengetik
document.querySelector('#f-pin').addEventListener('input', () =>
  validasi('f-pin', v => v.length >= 8, 'PIN minimal 8 karakter')
);

// ============================================================
// 6. PASSWORD STRENGTH BAR (untuk field PIN)
//    - Hitung persentase berdasarkan panjang karakter
//    - Warna bar berubah: merah (lemah) → oranye (sedang) → hijau (kuat)
// ============================================================

document.querySelector('#f-pin').addEventListener('input', e => {
  const panjang = e.target.value.length;
  const persen  = Math.min(panjang / 12 * 100, 100);
  const bar     = document.querySelector('.isian');
  const label   = document.querySelector('#strength-label');

  bar.style.width = persen + '%';

  if (panjang === 0) {
    bar.style.background  = 'transparent';
    label.textContent     = '';
  } else if (persen < 40) {
    bar.style.background  = '#e54b5a';
    label.textContent     = 'PIN Lemah';
    label.style.color     = '#e54b5a';
  } else if (persen < 70) {
    bar.style.background  = '#ff9933';
    label.textContent     = 'PIN Sedang';
    label.style.color     = '#ff9933';
  } else {
    bar.style.background  = '#27c467';
    label.textContent     = 'PIN Kuat ✓';
    label.style.color     = '#27c467';
  }
});


// ============================================================
// 7. SUBMIT FORM
//    - Validasi semua field sekaligus
//    - Jika semua valid → tampilkan pesan sukses di modal
// ============================================================

document.querySelector('#form-laporan').addEventListener('submit', e => {
  e.preventDefault(); // cegah halaman reload

  // Jalankan validasi semua field sekaligus
  // .every(Boolean) = hanya true jika SEMUA validasi lulus
  const semuaValid = [
    validasi('f-nama',  v => v.length >= 3,                    'Nama minimal 3 karakter'),
    validasi('f-email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v),  'Format email tidak valid'),
    validasi('f-pin',   v => v.length >= 8,                    'PIN minimal 8 karakter'),
  ].every(Boolean);

  // Jika ada field tidak valid → berhenti, jangan submit
  if (!semuaValid) return;

  // Semua valid → tampilkan pesan sukses
  const namaBuah = document.querySelector('#f-buah').value;
  document.querySelector('#sukses-buah').textContent = namaBuah;
  document.querySelector('#form-laporan').classList.add('tersembunyi');
  document.querySelector('#modal-sukses').classList.remove('tersembunyi');
});


// ============================================================
// 8. ANIMASI COUNT-UP (Kartu Statistik)
//    - requestAnimationFrame: animasi 60fps, lebih smooth dari setInterval
//    - Angka naik dari 0 ke nilai data-target
// ============================================================

document.querySelectorAll('.kartu-stat').forEach(kartu => {
  const el      = kartu.querySelector('.penghitung');
  const target  = +kartu.dataset.target; // konversi string ke number
  let n         = 0;
  const langkah = target / 80; // naik sebanyak ini tiap frame

  const jalankan = () => {
    n = Math.min(n + langkah, target);
    el.textContent = Math.floor(n).toLocaleString('id-ID'); // format ribuan Indonesia
    if (n < target) requestAnimationFrame(jalankan); // lanjutkan ke frame berikutnya
  };

  requestAnimationFrame(jalankan); // mulai animasi
});