import express from "express";
import auth from "../middlewares/auth.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  listTasks
} from "../controllers/tasksController.js";

const router = express.Router();

router.use(auth);

// Rute spesifik harus di atas
router.get("/project/:projectId", listTasks);

// CRUD Task
router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
