// === 1. DARK MODE ===
function terapkanTema() {
  if (localStorage.getItem('tema') === 'gelap')
    document.body.classList.add('gelap');
}
terapkanTema();

function toggleTema() {
  document.body.classList.toggle('gelap');
  const gelap = document.body.classList.contains('gelap');
  localStorage.setItem('tema', gelap ? 'gelap' : 'terang');
}
document.querySelector('#theme-btn').addEventListener('click', toggleTema);
document.querySelector('#theme-btn-2').addEventListener('click', toggleTema);

// === 2. TAB NAVIGATION ===
function gantiTab(idPanel) {
  document.querySelectorAll('.panel, .tombol-tab')
    .forEach(el => el.classList.remove('aktif'));
  document.querySelector('#' + idPanel).classList.add('aktif');
  document.querySelector(`[data-tab='${idPanel}']`).classList.add('aktif');
}
document.querySelectorAll('.tombol-tab').forEach(btn => {
  btn.addEventListener('click', () => gantiTab(btn.dataset.tab));
});

// === 3. ACCORDION ===
document.querySelectorAll('.judul-akordion').forEach(tombol => {
  tombol.addEventListener('click', () => {
    tombol.closest('.item').classList.toggle('terbuka');
  });
});

// === 4. ANIMASI COUNT-UP ===
document.querySelectorAll('.kartu-stat').forEach(kartu => {
  const el     = kartu.querySelector('.penghitung');
  const target = +kartu.dataset.target;
  let n = 0;
  const langkah = target / 60;

  const jalankan = () => {
    n = Math.min(n + langkah, target);
    el.textContent = Math.floor(n).toLocaleString();
    if (n < target) requestAnimationFrame(jalankan);
  };
  requestAnimationFrame(jalankan);
});