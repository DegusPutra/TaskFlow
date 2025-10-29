import Task from "../models/task.js";
import axios from "axios";

// GET semua task berdasarkan project
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

// Create task baru
export const createTask = async (req, res) => {
  try {
    const { title, deadline, project, members, status } = req.body;
    const userId = req.user?.id || "guest";

    if (!title || !project) {
      return res.status(400).json({ message: "Title dan project wajib diisi" });
    }

    // Simpan task ke database utama
    const newTask = new Task({
      title,
      project,
      deadline: deadline ? new Date(deadline) : null,
      members: Array.isArray(members) ? members : [],
      status: status || "todo",
      createdBy: userId,
    });

    const savedTask = await newTask.save();

    // Kirim ke History Service
    try {
      await axios.post(
        "http://localhost:3001/history",
        {
          projectId: savedTask.project,
          name: savedTask.title,
          description: `Task: ${savedTask.title}`,
          deadline: savedTask.deadline,
          createdBy: userId,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("✅ Task History created successfully");
    } catch (err) {
      console.error("❌ Failed to create task history:", err.response?.data || err.message);
    }

    // Kirim ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          user: userId,
          action: `menambahkan task baru "${savedTask.title}"`,
          projectId: savedTask.project,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("📝 Task Activity log created");
    } catch (err) {
      console.error("❌ Failed to create task activity:", err.response?.data || err.message);
    }

    res.status(201).json(savedTask);
  } catch (err) {
    console.error("❌ Error in createTask:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { title, deadline, status, members } = req.body;
    const userId = req.user?.id || "guest";

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

    // Sync ke History Service
    try {
      await axios.put(
        `http://localhost:3001/history/${updatedTask.project}`,
        {
          name: updatedTask.title,
          description: `Task diperbarui: ${updatedTask.title}`,
          deadline: updatedTask.deadline,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("✅ Task History updated");
    } catch (err) {
      console.error("❌ Failed to update task history:", err.response?.data || err.message);
    }

    // Tambahkan log ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          user: userId,
          action: `mengupdate task "${updatedTask.title}"`,
          projectId: updatedTask.project,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("📝 Task Activity updated");
    } catch (err) {
      console.error("❌ Failed to update task activity:", err.response?.data || err.message);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Error in updateTask:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "guest";

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    // 🔁 Hapus dari History Service
    try {
      await axios.delete(`http://localhost:3001/history/${deleted.project}`, {
        headers: { Authorization: req.headers.authorization },
      });
      console.log("🗑️ Task History deleted");
    } catch (err) {
      console.error("❌ Failed to delete task history:", err.response?.data || err.message);
    }

    // Log ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          user: userId,
          action: `menghapus task "${deleted.title}"`,
          projectId: deleted.project,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("📝 Task Activity deleted");
    } catch (err) {
      console.error("❌ Failed to log task delete:", err.response?.data || err.message);
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteTask:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET semua task 
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error("❌ Error in getAllTasks:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
