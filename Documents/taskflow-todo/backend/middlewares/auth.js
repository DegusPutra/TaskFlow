const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded._id,
      ...decoded,
    };

    console.log("🪪 Token:", token.slice(0, 40) + "...");
    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "ADA" : "KOSONG");
    console.log("✅ Token valid, decoded user:", req.user);

    next();
  } catch (err) {
    console.error("❌ JWT error:", err.message);
    return res
      .status(401)
      .json({ message: `Token tidak valid: ${err.message}` });
  }
}

module.exports = protect;
