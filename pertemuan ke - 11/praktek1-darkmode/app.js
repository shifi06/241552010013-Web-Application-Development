// === DARK MODE ===

// Terapkan tema tersimpan saat halaman dibuka
if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap');
  document.querySelector('#theme-btn').textContent = '☀️ Mode Terang';
}

document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');
  const sedangGelap = document.body.classList.contains('gelap');
  localStorage.setItem('tema', sedangGelap ? 'gelap' : 'terang');
  document.querySelector('#theme-btn').textContent =
    sedangGelap ? '☀️ Mode Terang' : '🌙 Mode Gelap';
});

// === ANIMASI COUNT-UP ===

// requestAnimationFrame: minta browser jalankan fungsi ini
// di setiap frame (60x per detik), jauh lebih smooth dari setInterval
document.querySelectorAll('.penghitung').forEach(el => {
  const target = +el.dataset.target; // angka tujuan
  let n = 0;
  const langkah = target / 60; // naik sebanyak ini tiap frame

  const jalankan = () => {
    n = Math.min(n + langkah, target); // jangan melebihi target
    el.textContent = Math.floor(n).toLocaleString(); // format ribuan
    if (n < target) requestAnimationFrame(jalankan); // lanjut frame berikutnya
  };

  requestAnimationFrame(jalankan); // mulai
});