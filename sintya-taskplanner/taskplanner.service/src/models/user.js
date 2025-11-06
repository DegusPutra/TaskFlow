import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  authUid: { type: String, required: true, unique: true },
  email: { type: String },
  name: { type: String },
});

const User = mongoose.models.user || mongoose.model("User", userSchema);
export default User;