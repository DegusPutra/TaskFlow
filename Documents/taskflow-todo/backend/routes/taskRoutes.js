const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// ✅ Ambil semua task
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Tambah task baru + buat notifikasi otomatis
router.post("/", async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    // Simpan task baru
    const newTask = new Task({ title, description, deadline });
    const savedTask = await newTask.save();

    // 🔔 Buat notifikasi otomatis
    const notif = new Notification({
      // Hapus userId dulu biar gak error kalau belum login
      message: `Task "${title}" berhasil dibuat.`,
      type: "new-task",
      metadata: { taskId: savedTask._id, deadline },
    });
    await notif.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update task berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Hapus task + hapus notifikasi terkait
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    await Notification.deleteMany({ "metadata.taskId": req.params.id });

    res.json({ message: "Task dan notifikasi terkait dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
