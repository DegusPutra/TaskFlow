import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
  title: String,
  position: Number,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

const Column = mongoose.models.Column || mongoose.model("Column", columnSchema);
export default Column;