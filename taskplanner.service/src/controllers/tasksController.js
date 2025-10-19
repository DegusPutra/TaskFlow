import Task from "../models/task.js";

/**
 * GET semua task
 */
export async function getTasks(req, res) {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET satu task berdasarkan ID
 */
export async function getTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST buat task baru
 */
export async function createTask(req, res) {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT update task
 */
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE task
 */
export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET semua task berdasarkan projectId
 */
export async function listTasks(req, res) {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
