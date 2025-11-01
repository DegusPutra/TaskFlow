const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  clearNotifications,
  deleteNotification,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/", getNotifications);
router.post("/", createNotification);
router.delete("/", clearNotifications);
router.delete("/:id", deleteNotification);
router.put("/:id/read", markAsRead);

module.exports = router;
