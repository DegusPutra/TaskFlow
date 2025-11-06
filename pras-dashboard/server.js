// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import historyRoutes from "./routes/historyRoutes.js"; // pastikan ada .js
import activityRoutes from "./routes/activityRoutes.js";
import auth from "./middlewares/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/history", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use(auth);
app.use("/history", historyRoutes);
app.use("/activity", activityRoutes);
// Jalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
