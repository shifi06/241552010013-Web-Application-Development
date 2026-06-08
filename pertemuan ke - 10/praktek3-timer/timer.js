const TOTAL = 25 * 60; // 1500 detik = 25 menit
let remaining = TOTAL;
let interval  = null;

// Dipanggil setiap 1 detik
function tick() {
  remaining--;
  if (remaining <= 0) {
    clearInterval(interval);
    interval = null;
    document.querySelector('#status').textContent = '✅ Selesai!';
    document.querySelector('#display').textContent = '00:00';
    document.querySelector('#bar').style.width = '100%';
    return;
  }
  updateDisplay();
}

function updateDisplay() {
  const menit  = String(Math.floor(remaining / 60)).padStart(2, '0');
  const detik  = String(remaining % 60).padStart(2, '0');
  document.querySelector('#display').textContent = `${menit}:${detik}`;

  // Hitung persentase sudah berjalan
  const persen = ((TOTAL - remaining) / TOTAL) * 100;
  document.querySelector('#bar').style.width = persen + '%';
}

document.querySelector('#start').addEventListener('click', () => {
  if (interval) return; // sudah berjalan, abaikan
  interval = setInterval(tick, 1000); // jalankan tick() tiap 1000ms
  document.querySelector('#status').textContent = 'Berjalan...';
});

document.querySelector('#pause').addEventListener('click', () => {
  clearInterval(interval);
  interval = null;
  document.querySelector('#status').textContent = 'Dijeda ⏸';
});

document.querySelector('#reset').addEventListener('click', () => {
  clearInterval(interval);
  interval  = null;
  remaining = TOTAL;
  document.querySelector('#status').textContent = 'Siap mulai';
  updateDisplay();
});