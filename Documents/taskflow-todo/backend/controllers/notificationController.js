// controllers/notificationController.js
const Notification = require("../models/Notification");

// 🔹 Ambil semua notifikasi
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil notifikasi", error });
  }
};

// 🔹 Tambah notifikasi baru
const createNotification = async (req, res) => {
  try {
    const newNotif = new Notification(req.body);
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan notifikasi", error });
  }
};

// 🔹 Hapus notifikasi tunggal
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }
    res.json({ message: "Notifikasi berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error menghapus notifikasi:", error.message);
    res.status(500).json({ message: "Gagal menghapus notifikasi" });
  }
};

// 🔹 Hapus semua notifikasi
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: "Semua notifikasi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus semua notifikasi" });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
  clearNotifications,
};
