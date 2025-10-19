import express from "express";
import projects from "./projects.js";
import invites from "./invites.js";
import tasks from "./tasks.js";
import columns from "./columns.js";

const router = express.Router();

router.use("/projects", projects);
router.use("/invites", invites);
router.use("/tasks", tasks);
router.use("/columns", columns);
router.use("/users", columns);

export default router;
