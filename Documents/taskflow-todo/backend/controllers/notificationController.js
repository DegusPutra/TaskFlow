const Notification = require("../models/Notification");

// GET semua notifikasi user login
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil notifikasi", error });
  }
};

const createNotification = async (req, res) => {
  try {
    const notif = new Notification({
      message: req.body.message,
      type: req.body.type,
      metadata: req.body.metadata,
      userId: req.body.userId || req.user.id,
    });
    const saved = await notif.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat notifikasi", error });
  }
};

// Hapus semua notifikasi user
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });
    res.json({ message: "Semua notifikasi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus notifikasi", error });
  }
};

// Hapus notifikasi by id
const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    res.json({ message: "Notifikasi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus notifikasi", error });
  }
};

// Tandai sebagai dibaca
const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Gagal update notifikasi", error });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  clearNotifications,
  deleteNotification,
  markAsRead,
};
