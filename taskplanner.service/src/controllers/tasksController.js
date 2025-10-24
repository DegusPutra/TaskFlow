import Task from "../models/task.js";

// Ambil semua task untuk project tertentu
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error getTasksByProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// Buat task baru untuk project
export const createTask = async (req, res) => {
  try {
    const { title, deadline, members = 0, status = "todo" } = req.body;
    const { projectId } = req.params;

    if (!title) return res.status(400).json({ message: "Title wajib diisi" });

    const task = new Task({
      title,
      deadline: deadline || null,
      members: Number(members) || 0,
      status: ["todo", "inprogress", "done"].includes(status)
        ? status
        : "todo",
      project: projectId,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Error createTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update task (ubah status dari drag & drop)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (err) {
    console.error("❌ Error updateTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// Hapus task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
