import express from "express";
import { createInvite, getInvites } from "../controllers/invitesController.js";

const router = express.Router();

router.post("/", createInvite);
router.get("/:projectId/invite", getInvites);

export default router;
