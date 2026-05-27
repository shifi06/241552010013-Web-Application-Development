const fs = require('fs/promises');
const FILE = 'users.json';

async function baca() { 
  const r = await fs.readFile(FILE, 'utf8'); 
  return JSON.parse(r); 
}

async function simpan(data) { 
  await fs.writeFile(FILE, JSON.stringify(data, null, 2)); 
}

module.exports = { baca, simpan };