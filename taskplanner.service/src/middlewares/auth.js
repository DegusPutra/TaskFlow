import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import User from "../models/user.js"; // gunakan model mongoose

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
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1] || null;

    if (!token) {
      if (config.auth.devIgnoreAuth) {
        const dev = req.headers["x-dev-user"] || "{}";
        let obj = {};
        try {
          obj = JSON.parse(dev);
        } catch {
          obj = { authUid: "dev-1", email: "dev@example.com", name: "dev" };
        }
        const user = await ensureUserRecord(obj.authUid, obj.email, obj.name);
        req.user = { id: user._id, authUid: user.authUid, email: user.email, name: user.name };
        return next();
      }
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verifikasi JWT
    try {
      const payload = jwt.verify(token, config.auth.jwtPublicKey || process.env.JWT_SECRET);
      const authUid = payload.sub || payload.user_id || payload.uid;
      const email = payload.email || null;
      const name = payload.name || null;
      const user = await ensureUserRecord(authUid, email, name);
      req.user = { id: user._id, authUid, email, name };
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    return res.status(500).json({ error: "Auth middleware error" });
  }
}
