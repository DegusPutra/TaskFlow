import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  projectId: { type: String }, // Optional
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;
