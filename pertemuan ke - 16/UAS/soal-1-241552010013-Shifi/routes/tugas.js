const express = require("express");
const prisma = require("../db");

const router = express.Router();

const PRIORITAS_VALID = ["rendah", "sedang", "tinggi"];
const STATUS_VALID = ["todo", "in-progress", "selesai"];

    function bolehAkses(tugas, user) {
       return user.role === "admin" || tugas.userId === user.userId;
}

    router.post("/", async (req, res) => {
       try {
        const { judul, deskripsi, prioritas, status, deadline } = req.body;

    if (!judul || !prioritas || !status) {
      return res.status(400).json({ message: "Judul, prioritas, dan status wajib diisi" });
    }

    if (!PRIORITAS_VALID.includes(prioritas)) {
      return res.status(400).json({ message: "Prioritas tidak valid" });
    }

    if (!STATUS_VALID.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const tugasBaru = await prisma.tugas.create({
      data: {
        judul,
        deskripsi: deskripsi || null,
        prioritas,
        status,
        deadline: deadline ? new Date(deadline) : null,
        userId: req.user.userId,
      },
    });

    return res.status(201).json({
      message: "Tugas berhasil ditambahkan",
      tugas: tugasBaru,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/statistik", async (req, res) => {
  try {
    const where = req.user.role === "admin" ? {} : { userId: req.user.userId };

    const [todo, inProgress, selesai] = await Promise.all([
      prisma.tugas.count({ where: { ...where, status: "todo" } }),
      prisma.tugas.count({ where: { ...where, status: "in-progress" } }),
      prisma.tugas.count({ where: { ...where, status: "selesai" } }),
    ]);

    return res.status(200).json({
      todo,
      "in-progress": inProgress,
      selesai,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/", async (req, res) => {
  try {
    const where = req.user.role === "admin" ? {} : { userId: req.user.userId };

    const semuaTugas = await prisma.tugas.findMany({
      where,
      include: {
        user: {
          select: { id: true, nama: true, email: true },
        },
      },
    });

    semuaTugas.sort((a, b) => {
      if (a.deadline === null && b.deadline === null) return 0;
      if (a.deadline === null) return 1;
      if (b.deadline === null) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });

    return res.status(200).json(semuaTugas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const tugas = await prisma.tugas.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, nama: true, email: true },
        },
      },
    });

    if (!tugas) {
      return res.status(404).json({ message: "Tugas tidak ditemukan" });
    }

    if (!bolehAkses(tugas, req.user)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke tugas ini" });
    }

    return res.status(200).json(tugas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { judul, deskripsi, prioritas, status, deadline } = req.body;

    const tugas = await prisma.tugas.findUnique({ where: { id } });

    if (!tugas) {
      return res.status(404).json({ message: "Tugas tidak ditemukan" });
    }

    if (!bolehAkses(tugas, req.user)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke tugas ini" });
    }

    if (prioritas !== undefined && !PRIORITAS_VALID.includes(prioritas)) {
      return res.status(400).json({ message: "Prioritas tidak valid" });
    }

    if (status !== undefined && !STATUS_VALID.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const dataUpdate = {};
    if (judul !== undefined) dataUpdate.judul = judul;
    if (deskripsi !== undefined) dataUpdate.deskripsi = deskripsi;
    if (prioritas !== undefined) dataUpdate.prioritas = prioritas;
    if (status !== undefined) dataUpdate.status = status;
    if (deadline !== undefined) dataUpdate.deadline = deadline ? new Date(deadline) : null;

    const tugasTerupdate = await prisma.tugas.update({
      where: { id },
      data: dataUpdate,
    });

    return res.status(200).json({
      message: "Tugas berhasil diupdate",
      tugas: tugasTerupdate,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const tugas = await prisma.tugas.findUnique({ where: { id } });

    if (!tugas) {
      return res.status(404).json({ message: "Tugas tidak ditemukan" });
    }

    if (!bolehAkses(tugas, req.user)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke tugas ini" });
    }

    await prisma.tugas.delete({ where: { id } });

    return res.status(200).json({ message: "Tugas berhasil dihapus" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;