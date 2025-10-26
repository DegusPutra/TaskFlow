import express from "express";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
} from "../controllers/tasksController.js";

const router = express.Router();

router.get("/tasks", getAllTasks);

router.get("/projects/:projectId/tasks", getTasksByProject);
router.post("/projects/:projectId/tasks", createTask);
router.put("/tasks/:id", updateTask); // <== ini yang dibutuhkan frontend
router.delete("/tasks/:id", deleteTask);

export default router;
