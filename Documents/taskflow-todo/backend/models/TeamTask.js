const mongoose = require("mongoose");

const teamTaskSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
  description: String,
  assignedTo: {
    type: String,
    default: "Unassigned",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TeamTask", teamTaskSchema);
