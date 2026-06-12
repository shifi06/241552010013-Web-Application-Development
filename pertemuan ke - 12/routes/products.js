// routes/products.js - Route untuk produk
const express = require('express');
const router = express.Router();

// Import data dari seed
const { products, nextId } = require('../data/seed');
let currentProducts = products;
let currentId = nextId;

// GET /products - ambil semua produk
router.get('/', (req, res) => {
  res.json(currentProducts);
});

// GET /products/:id - ambil satu produk
router.get('/:id', (req, res) => {
  const product = currentProducts.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  res.json(product);
});

// POST /products - buat produk baru
router.post('/', (req, res) => {
  const { nama, kategori, harga, stok = 0 } = req.body;
  
  if (!nama) {
    return res.status(400).json({ error: 'nama wajib diisi' });
  }
  if (!harga) {
    return res.status(400).json({ error: 'harga wajib diisi' });
  }
  if (harga <= 0) {
    return res.status(400).json({ error: 'harga harus positif' });
  }
  
  const newProduct = {
    id: currentId++,
    nama,
    kategori: kategori || 'umum',
    harga,
    stok,
    createdAt: new Date().toISOString()
  };
  
  currentProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id - update produk
router.put('/:id', (req, res) => {
  const index = currentProducts.findIndex(p => p.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  
  const { nama, kategori, harga, stok } = req.body;
  currentProducts[index] = {
    ...currentProducts[index],
    nama: nama || currentProducts[index].nama,
    kategori: kategori || currentProducts[index].kategori,
    harga: harga || currentProducts[index].harga,
    stok: stok !== undefined ? stok : currentProducts[index].stok
  };
  
  res.json(currentProducts[index]);
});

// PATCH /products/:id - update sebagian
router.patch('/:id', (req, res) => {
  const index = currentProducts.findIndex(p => p.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  
  currentProducts[index] = { ...currentProducts[index], ...req.body };
  res.json(currentProducts[index]);
});

// DELETE /products/:id - hapus produk
router.delete('/:id', (req, res) => {
  const beforeLength = currentProducts.length;
  currentProducts = currentProducts.filter(p => p.id != req.params.id);
  
  if (currentProducts.length === beforeLength) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  
  res.status(204).send();
});

module.exports = router;