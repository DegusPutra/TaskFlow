import dotenv from "dotenv";
dotenv.config();

export default {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/taskplanner",
  port: process.env.PORT || 5005,
  jwtSecret: process.env.JWT_SECRET || "your_secret_key",
};
