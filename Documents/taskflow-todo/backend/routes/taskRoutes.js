const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const protect = require("../middlewares/auth");

// ✅ GET semua task milik user login
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Tambah task baru
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const newTask = new Task({
      title,
      description,
      deadline,
      userId: req.user.id,
    });

    const savedTask = await newTask.save();

    await Notification.create({
      userId: req.user.id,
      message: `Task "${title}" berhasil dibuat.`,
      type: "new-task",
      metadata: { taskId: savedTask._id, deadline },
    });

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
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

// ✅ Hapus task
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedTask)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    await Notification.deleteMany({
      userId: req.user.id,
      "metadata.taskId": req.params.id,
    });

    res.json({ message: "Task dan notifikasi terkait dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
