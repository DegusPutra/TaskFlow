const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  deleteNotification,
  clearNotifications,
} = require("../controllers/notificationController");
const Notification = require("../models/Notification");

// ✅ ROUTES
router.get("/", getNotifications);
router.post("/", createNotification);
router.delete("/:id", deleteNotification);
router.delete("/", clearNotifications);

// ✅ Tandai notifikasi sudah dibaca
router.put("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notif)
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    res.json(notif);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui notifikasi", error });
  }
});

module.exports = router;
