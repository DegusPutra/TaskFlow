import Task from "../models/Task.js";
import Project from "../models/project.js";

// 🔹 Ambil semua task dari project tertentu
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project tidak ditemukan" });

    const tasks = await Task.find({ project: projectId });
    return res.json(tasks);
  } catch (err) {
    console.error("Error getTasksByProject:", err);
    res.status(500).json({ message: "Gagal mengambil task" });
  }
};

// 🔹 Tambah task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project tidak ditemukan" });

    const task = new Task({ ...req.body, project: projectId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error createTask:", err);
    res.status(500).json({ message: "Gagal membuat task" });
  }
};

// 🔹 Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });
    res.json(task);
  } catch (err) {
    console.error("Error updateTask:", err);
    res.status(500).json({ message: "Gagal mengupdate task" });
  }
};

// 🔹 Hapus task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });
    res.json({ message: "Task berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteTask:", err);
    res.status(500).json({ message: "Gagal menghapus task" });
  }
};

// 🔹 Ambil semua task (global)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("project", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil semua task" });
  }
};
