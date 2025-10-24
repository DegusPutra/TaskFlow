import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "editor", "viewer"],
    default: "viewer",
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: 0, // 0 = unlimited
  },
  used: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Invite =
  mongoose.models.Invite || mongoose.model("Invite", inviteSchema);
export default Invite;
