import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🪪 Token diterima:", token.slice(0, 40) + "...");
    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token valid, decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT error:", err.message);
    return res
      .status(401)
      .json({ message: `Token tidak valid: ${err.message}` });
  }
}
