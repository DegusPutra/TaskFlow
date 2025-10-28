import express from "express";
import { createHistory, getHistory, getProjectHistory,updateHistory,deleteHistory } from "../controllers/historyController.js";

const router = express.Router();

// GET semua data history
router.get("/", getHistory);

// GET daftar project milik user (history project)
router.get("/projects", getProjectHistory);

// POST tambah data history baru
router.post("/", createHistory);

router.put("/:id", updateHistory);

router.delete("/:id", deleteHistory);

export default router;
