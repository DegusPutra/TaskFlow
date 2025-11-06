import express from "express";
import auth from "../middlewares/auth.js";
import * as ctrl from "../controllers/columnsController.js";

const router = express.Router();

// Tambah kolom baru ke project tertentu
router.post("/:projectId", auth, ctrl.createColumn);

// Update kolom berdasarkan ID kolom
router.put("/:id", auth, ctrl.updateColumn);

// Hapus kolom berdasarkan ID kolom
router.delete("/:id", auth, ctrl.deleteColumn);

export default router;
