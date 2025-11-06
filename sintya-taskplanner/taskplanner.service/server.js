import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import routes from "./src/routes/index.js";
import taskRoutes from "./src/routes/tasks.js";
import cors from "cors" 

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());
app.use("/api", routes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
connectDB();
