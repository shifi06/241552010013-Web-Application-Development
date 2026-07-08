const express = require("express")
const prisma = require("../db")
const authGuard = require("../middleware/authGuard")

const router = express.Router()
router.use(authGuard)

const isAdmin = (req) => req.user.role === "admin"
const canAccess = (req, transaksi) => isAdmin(req) || transaksi.userId === req.user.id

// POST /api/transaksi
router.post("/", async (req, res, next) => {
  try {
    const { judul, jumlah, jenis, kategori, tanggal } = req.body

    if (!judul || jumlah === undefined || !jenis || !kategori) {
      return res.status(400).json({ message: "Judul, jumlah, jenis, dan kategori wajib diisi" })
    }

    if (!["pemasukan", "pengeluaran"].includes(jenis)) {
      return res.status(400).json({ message: "Jenis harus pemasukan atau pengeluaran" })
    }

    if (isNaN(jumlah) || Number(jumlah) <= 0) {
      return res.status(400).json({ message: "Jumlah harus berupa angka positif" })
    }

    const transaksi = await prisma.transaksi.create({
      data: {
        judul,
        jumlah: Number(jumlah),
        jenis,
        kategori,
        tanggal: tanggal ? new Date(tanggal) : new Date(),
        userId: req.user.id
      }
    })

    res.status(201).json({ message: "Transaksi berhasil ditambahkan", transaksi })
  } catch (err) {
    next(err)
  }
})

// GET /api/transaksi/ringkasan — HARUS di atas /:id
router.get("/ringkasan", async (req, res, next) => {
  try {
    const transaksi = await prisma.transaksi.findMany({
      where: isAdmin(req) ? {} : { userId: req.user.id }
    })

    const totalPemasukan = transaksi
      .filter(t => t.jenis === "pemasukan")
      .reduce((sum, t) => sum + t.jumlah, 0)

    const totalPengeluaran = transaksi
      .filter(t => t.jenis === "pengeluaran")
      .reduce((sum, t) => sum + t.jumlah, 0)

    res.json({
      totalPemasukan,
      totalPengeluaran,
      saldo: totalPemasukan - totalPengeluaran
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/transaksi
router.get("/", async (req, res, next) => {
  try {
    const transaksi = await prisma.transaksi.findMany({
      where: isAdmin(req) ? {} : { userId: req.user.id },
      include: { user: { select: { id: true, nama: true, email: true } } },
      orderBy: { tanggal: "desc" }
    })

    res.json(transaksi)
  } catch (err) {
    next(err)
  }
})

// GET /api/transaksi/:id
router.get("/:id", async (req, res, next) => {
  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: { select: { id: true, nama: true, email: true } } }
    })

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" })
    }

    if (!canAccess(req, transaksi)) {
      return res.status(403).json({ message: "Akses ditolak" })
    }

    res.json(transaksi)
  } catch (err) {
    next(err)
  }
})

// PUT /api/transaksi/:id
router.put("/:id", async (req, res, next) => {
  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: Number(req.params.id) }
    })

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" })
    }

    if (!canAccess(req, transaksi)) {
      return res.status(403).json({ message: "Akses ditolak" })
    }

    const { judul, jumlah, jenis, kategori, tanggal } = req.body
    const data = {}

    if (judul !== undefined) data.judul = judul
    if (kategori !== undefined) data.kategori = kategori
    if (tanggal !== undefined) data.tanggal = new Date(tanggal)

    if (jenis !== undefined) {
      if (!["pemasukan", "pengeluaran"].includes(jenis)) {
        return res.status(400).json({ message: "Jenis harus pemasukan atau pengeluaran" })
      }
      data.jenis = jenis
    }

    if (jumlah !== undefined) {
      if (isNaN(jumlah) || Number(jumlah) <= 0) {
        return res.status(400).json({ message: "Jumlah harus berupa angka positif" })
      }
      data.jumlah = Number(jumlah)
    }

    const updated = await prisma.transaksi.update({
      where: { id: transaksi.id },
      data
    })

    res.json({ message: "Transaksi berhasil diupdate", transaksi: updated })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/transaksi/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: Number(req.params.id) }
    })

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" })
    }

    if (!canAccess(req, transaksi)) {
      return res.status(403).json({ message: "Akses ditolak" })
    }

    await prisma.transaksi.delete({ where: { id: transaksi.id } })

    res.json({ message: "Transaksi berhasil dihapus" })
  } catch (err) {
    next(err)
  }
})

module.exports = router