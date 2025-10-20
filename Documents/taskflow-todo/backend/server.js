const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES UNTUK TO-DO LIST
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// ✅ ROUTES UNTUK NOTIFIKASI
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// ✅ KONEKSI KE DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ JALANKAN SERVER DI PORT 5010
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
