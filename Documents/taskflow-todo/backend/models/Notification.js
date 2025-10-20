const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "info" }, // contoh: new-task, task-done, reminder
  isRead: { type: Boolean, default: false },
  metadata: { type: Object, default: {} }, // optional: { taskId, url, extra }
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
