import Task from "../models/task.js";

// mengambil semua task berdasarkan project
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId || projectId.length !== 24) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error in getTasksByProject:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Tambah task baru
export const createTask = async (req, res) => {
  try {
    const { title, deadline, project, members, status } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title dan project wajib diisi" });
    }

    const newTask = new Task({
      title,
      project,
      deadline: deadline ? new Date(deadline) : null,
      members: Array.isArray(members) ? members : [],
      status: status || "todo",
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("❌ Error in createTask:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Update task
export const updateTask = async (req, res) => {
  try {
    const { title, deadline, status, members } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (deadline) updateData.deadline = new Date(deadline);
    if (status) updateData.status = status;
    if (members) updateData.members = Array.isArray(members) ? members : [];

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Error in updateTask:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Hapus task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteTask:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// [Tambahan baru] Ambil semua task (untuk Todo Service)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error("❌ Error in getAllTasks:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
