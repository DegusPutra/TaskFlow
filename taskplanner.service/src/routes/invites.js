import express from "express";
import auth from "../middlewares/auth.js";
import * as ctrl from "../controllers/invitesController.js";

const router = express.Router();

router.post("/:id", auth, ctrl.createInvite);
router.post("/accept", auth, ctrl.acceptInvite);

export default router;
