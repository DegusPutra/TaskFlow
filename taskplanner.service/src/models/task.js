import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  members: [{ type: String }],
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  deadline: { type: Date }, 
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
