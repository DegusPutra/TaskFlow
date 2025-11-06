const express = require("express");
const router = express.Router();
const TeamTask = require("../models/TeamTask");

// GET all team tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await TeamTask.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new team task
router.post("/", async (req, res) => {
  try {
    const newTask = new TeamTask(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
