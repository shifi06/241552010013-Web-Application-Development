let todos = [];

// Pasang event listener ke tombol tambah
document.querySelector('#add').addEventListener('click', addTodo);

// Pasang event listener ke input — kalau tekan Enter juga tambah
document.querySelector('#inp').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

function addTodo() {
  const text = document.querySelector('#inp').value.trim();
  if (!text) return; // kalau kosong, berhenti

  todos.push({ id: Date.now(), text, done: false });
  document.querySelector('#inp').value = ''; // kosongkan input
  render();
}

// Event delegation untuk tombol selesai & hapus
document.querySelector('#list').addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = +li.dataset.id; // + untuk ubah string ke number

  if (e.target.matches('.btn-done')) {
    todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  }
  if (e.target.matches('.btn-del')) {
    todos = todos.filter(t => t.id !== id);
  }
  render();
});

function render() {
  // Gambar ulang semua list
  document.querySelector('#list').innerHTML = todos.map(t => `
    <li data-id="${t.id}" class="${t.done ? 'done' : ''}">
      <span>${t.text}</span>
      <button class="btn-done">✓</button>
      <button class="btn-del">✕</button>
    </li>
  `).join('');

  // Update counter
  const left = todos.filter(t => !t.done).length;
  document.querySelector('#count').textContent = `${left} todo tersisa`;
}