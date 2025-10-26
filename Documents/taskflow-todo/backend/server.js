const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

// 🔹 Import Cron Job
const checkDeadline = require("./cron/checkDeadline");

// 🔹 Import Routes
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const teamTaskRoutes = require("./routes/teamTasks");

// 🔹 Load ENV
dotenv.config();

const app = express();

// 🔹 Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔹 Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/team-tasks", teamTaskRoutes);

// 🔹 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// 🔹 Jalankan Cron hanya sekali (hindari duplikasi di nodemon)
if (process.env.NODE_ENV !== "development" || !process.env.CRON_DISABLED) {
  cron.schedule("*/10 * * * *", async () => {
    console.log("🕒 Menjalankan cron checkDeadline...");
    await checkDeadline();
  });
}

// 🔹 Start Server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`🚀 Service berjalan di port ${PORT}`);
});
