import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
} from "../controllers/tasksController.js";
import * as taskCtrl from "../controllers/tasksController.js";

const router = express.Router();

router.get("/projects/:projectId/tasks", getTasksByProject);
router.post("/projects/:projectId/tasks", createTask);
router.put("/:id", taskCtrl.updateTask);     // ✅ update status atau data task
router.delete("/:id", taskCtrl.deleteTask);

export default router;
