import express from "express";
import { createActivity, getRecentActivities } from "../controllers/activityController.js";

const router = express.Router();

router.post("/activity", createActivity);
router.get("/activity", getRecentActivities);

export default router;
