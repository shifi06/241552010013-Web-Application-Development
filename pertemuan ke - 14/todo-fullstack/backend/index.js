require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - izinkan semua domain (untuk development)
app.use(cors());

// Bisa baca JSON dari request
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'todo-api' });
});

// Route Todo API
app.use('/api/todos', require('./routes/todos'));

// ⭐ PAKAI PORT DARI .ENV
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});