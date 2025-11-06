import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const History = mongoose.models.History || mongoose.model("History", historySchema);
export default History;
