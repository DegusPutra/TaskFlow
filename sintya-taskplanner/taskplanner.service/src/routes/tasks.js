import express from "express";
import {
  getAllTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Semua route di bawah wajib login
router.use(auth);

router.get("/tasks", getAllTasks); 
router.get("/tasks/:projectId", getTasksByProject); 
router.post("/projects/:projectId/tasks", createTask); 
router.put("/tasks/:id", updateTask); 
router.delete("/tasks/:id", deleteTask); 

export default router;
