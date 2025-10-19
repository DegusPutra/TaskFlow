import express from "express";
import * as projectCtrl from "../controllers/projectsController.js";
import * as inviteCtrl from "../controllers/invitesController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Semua route di bawah ini wajib login
router.use(auth);

// CRUD Project
router.get("/", projectCtrl.getProjects);
router.post("/", projectCtrl.createProject);
router.get("/:id", projectCtrl.getProject);
router.put("/:id", projectCtrl.updateProject);
router.delete("/:id", projectCtrl.deleteProject);

// Invite anggota ke project
router.post("/:id/invite", inviteCtrl.createInvite);

export default router;
