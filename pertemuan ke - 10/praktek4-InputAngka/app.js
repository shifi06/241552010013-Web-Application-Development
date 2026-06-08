function tampilkanAngka() {
  const input = document.querySelector('#angka');
  const hasil = document.querySelector('#hasil');
  const angka = input.value;

  if (angka === '') return; // kalau kosong, berhenti

  hasil.textContent = `Kamu memasukkan angka: ${angka}`;
  hasil.classList.remove('hidden'); // tampilkan elemen hasil
  input.value = ''; // kosongkan input
}

document.querySelector('#tampil').addEventListener('click', tampilkanAngka);

document.querySelector('#angka').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tampilkanAngka();
});