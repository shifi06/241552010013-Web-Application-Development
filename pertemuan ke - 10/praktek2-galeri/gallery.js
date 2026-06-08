const filters = document.querySelectorAll('.filter');
const cards   = document.querySelectorAll('.card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    // Hapus class 'active' dari semua tombol
    filters.forEach(b => b.classList.remove('active'));
    // Tambah 'active' ke tombol yang diklik
    btn.classList.add('active');

    const cat = btn.dataset.cat; // ambil nilai data-cat

    // Tampilkan/sembunyikan card sesuai kategori
    cards.forEach(card => {
      const cocok = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !cocok);
      // toggle(class, kondisi): kalau kondisi true → tambah class, false → hapus
    });
  });
});