require("dotenv").config();
const express = require("express");
const authGuard = require("./middleware/authGuard");

const authRoutes = require("./routes/auth");
const tugasRoutes = require("./routes/tugas");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tugas", authGuard, tugasRoutes);


    app.get("/", (req, res) => {
    res.json({ message: "API Manajemen Tugas berjalan dengan baik" });
    
});

    app.use((req, res) => {
    res.status(404).json({ message: "Endpoint tidak ditemukan" });

});


    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);

});