const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📦 Endpoint tersedia:`);
  console.log(`   GET    /products`);
  console.log(`   GET    /products/:id`);
  console.log(`   POST   /products`);
  console.log(`   PUT    /products/:id`);
  console.log(`   PATCH  /products/:id`);
  console.log(`   DELETE /products/:id`);
});