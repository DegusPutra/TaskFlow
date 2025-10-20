const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  deleteNotification,
} = require("../controllers/notificationController");

// ✅ ROUTES
router.get("/", getNotifications);
router.post("/", createNotification);
router.delete("/:id", deleteNotification);

module.exports = router;
