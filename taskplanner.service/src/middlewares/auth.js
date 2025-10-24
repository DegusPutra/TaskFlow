import jwt from "jsonwebtoken";
import User from "../models/user.js";

async function ensureUserRecord(authUid, email, name) {
  let user = await User.findOne({ authUid });
  if (!user) {
    user = new User({ authUid, email, name });
    await user.save();
  }
  return user;
}

export default async function auth(req, res, next) {
  try {
    const isDev =
      process.env.NODE_ENV === "development" ||
      process.env.DEV_IGNORE_AUTH === "true";

    if (isDev) {
      req.user = { id: '6719fddf1b9f2b6c13e45678', email: 'dev@example.com', name: 'Developer' };
      return next();
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1] || null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const authUid = payload.sub || payload.user_id || payload.uid;
    const email = payload.email || null;
    const name = payload.name || null;

    const user = await ensureUserRecord(authUid, email, name);
    req.user = { id: user._id, authUid, email, name };
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    res.status(500).json({ error: "Auth middleware error" });
  }
}
