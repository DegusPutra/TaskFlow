import express from "express";
import { createActivity, getRecentActivities } from "../controllers/activityController.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getRecentActivities);

export default router;
