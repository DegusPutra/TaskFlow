const Notification = require("../models/Notification");

// 🔹 Ambil semua notifikasi
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
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

// 🔹 Hapus notifikasi
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notifikasi dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus notifikasi", error });
  }
};

module.exports = { getNotifications, createNotification, deleteNotification };
