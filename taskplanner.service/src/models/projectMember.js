import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const ProjectMember = mongoose.models.projectMember || mongoose.model("ProjectMember", projectMemberSchema);
export default ProjectMember;