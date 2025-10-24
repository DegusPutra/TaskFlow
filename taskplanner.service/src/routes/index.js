import express from "express";
import projects from "./projects.js";
import invites from "./invites.js";
import tasks from "./tasks.js";
import columns from "./columns.js";
import users from "./users.js";

const router = express.Router();

//semua router dijalankan disini
router.use("/projects", projects);
router.use("/invites", invites);
router.use("/tasks", tasks);
router.use("/columns", columns);
router.use("/users", users);

export default router;
