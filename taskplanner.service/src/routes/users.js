import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

// GET semua user
router.get("/", getUsers);

// POST buat user baru
router.post("/", createUser);

export default router;
