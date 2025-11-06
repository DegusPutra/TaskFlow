import Task from "../models/task.js";
import axios from "axios";

const NOTIFICATION_HOST = "http://degus-service:5010"; 
const ACTIVITY_HOST = "http://pras-service:3001"; 

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || projectId.length !== 24) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });

    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(now.getDate() + 2);

    for (const t of tasks) {
      if (t.deadline) {
        const deadline = new Date(t.deadline);
        if (deadline >= now && deadline <= twoDaysLater) {
          try {
            await axios.post(
              `${NOTIFICATION_HOST}/api/notifications`, 
              {
                message: `⏰ Deadline task "${t.title}" sudah dekat!`,
                type: "task-deadline",
                userId: req.user.id,
                metadata: { taskId: t._id, projectId: t.project },
              },
              { headers: { Authorization: req.headers.authorization } }
            );
            console.log(`🔔 Notifikasi deadline task "${t.title}" dikirim`);
          } catch (notifErr) {
            console.error("❌ Gagal kirim notifikasi deadline task:", notifErr.message);
          }
        }
      }
    }

    res.json(tasks);
  } catch (err) {
    console.error("❌ Error in getTasksByProject:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, deadline, project, members, status } = req.body;
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: user ID missing" });
    }
    const userId = req.user.id;

    if (!title || !project) {
      return res.status(400).json({ message: "Title dan project wajib diisi" });
    }

    const newTask = new Task({
      title,
      project,
      deadline: deadline ? new Date(deadline) : null,
      members: Array.isArray(members) ? members : [],
      status: status || "todo",
      createdBy: userId,
    });

    const savedTask = await newTask.save();

    if (savedTask.deadline) {
      const now = new Date();
      const taskDeadline = new Date(savedTask.deadline);
      const twoDaysLater = new Date();
      twoDaysLater.setDate(now.getDate() + 2);

      if (taskDeadline >= now && taskDeadline <= twoDaysLater) {
        try {
          await axios.post(
            `${NOTIFICATION_HOST}/api/notifications`, 
            {
              message: `⏰ Deadline task "${savedTask.title}" sudah dekat!`,
              type: "task-deadline",
              userId: userId,
              metadata: { taskId: savedTask._id, projectId: savedTask.project },
            },
            { headers: { Authorization: req.headers.authorization } }
          );
          console.log("✅ Notifikasi deadline task dikirim");
        } catch (err) {
          console.error("❌ Gagal kirim notifikasi deadline:", err.message);
        }
      }
    }

    try {
      await axios.post(
        `${ACTIVITY_HOST}/activity`, 
        {
          user: userId,
          action: `menambahkan task baru "${savedTask.title}"`,
          projectId: savedTask.project,
        },
        { headers: { Authorization: req.headers.authorization } }
      );
      console.log("📝 Task Activity log created");
    } catch (err) {
      console.error("❌ Failed to create task activity:", err.message);
    }

    res.status(201).json(savedTask);
  } catch (err) {
    console.error("❌ Error in createTask:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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

    if (updatedTask.deadline) {
      const now = new Date();
      const taskDeadline = new Date(updatedTask.deadline);
      const twoDaysLater = new Date();
      twoDaysLater.setDate(now.getDate() + 2);

      if (taskDeadline >= now && taskDeadline <= twoDaysLater) {
        try {
          await axios.post(
            `${NOTIFICATION_HOST}/api/notifications`, 
            {
              message: `⏰ Deadline task "${updatedTask.title}" sudah dekat!`,
              type: "task-deadline",
              userId: userId,
              metadata: { taskId: updatedTask._id, projectId: updatedTask.project },
            },
            { headers: { Authorization: req.headers.authorization } }
          );
          console.log("🔔 Notifikasi update deadline task dikirim");
        } catch (err) {
          console.error("❌ Gagal kirim notifikasi update deadline:", err.message);
        }
      }
    }
    
    try {
      await axios.post(
        `${ACTIVITY_HOST}/activity`, 
        {
          user: userId,
          action: `mengupdate task "${updatedTask.title}"`,
          projectId: updatedTask.project,
        },
        { headers: { Authorization: req.headers.authorization } }
      );
      console.log("📝 Task Activity updated");
    } catch (err) {
      console.error("❌ Failed to log task update:", err.message);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Error in updateTask:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "guest";

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    try {
      await axios.post(
        `${NOTIFICATION_HOST}/api/notifications`, 
        {
          message: `🗑️ Task "${deleted.title}" telah dihapus.`,
          type: "task-delete",
          userId: userId,
          metadata: { taskId: deleted._id, projectId: deleted.project },
        },
        { headers: { Authorization: req.headers.authorization } }
      );
      console.log("✅ Notifikasi task dihapus dikirim");
    } catch (err) {
      console.error("❌ Gagal kirim notifikasi delete task:", err.message);
    }

    try {
      await axios.post(
        `${ACTIVITY_HOST}/activity`, 
        {
          user: userId,
          action: `menghapus task "${deleted.title}"`,
          projectId: deleted.project,
        },
        { headers: { Authorization: req.headers.authorization } }
      );
      console.log("📝 Task Activity delete logged");
    } catch (err) {
      console.error("❌ Failed to log delete task:", err.message);
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteTask:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error("❌ Error in getAllTasks:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};