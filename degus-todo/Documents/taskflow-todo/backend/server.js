const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// const checkDeadline = require("./cron/checkDeadline");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// 🔒 Tambahkan ini (WAJIB)
const protect = require("./middlewares/auth");

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/tasks", protect, taskRoutes);
app.use("/api/notifications", protect, notificationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));


const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`🚀 Service berjalan di port ${PORT}`));
