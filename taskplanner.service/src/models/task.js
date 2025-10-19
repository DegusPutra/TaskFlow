import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "pending" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;

