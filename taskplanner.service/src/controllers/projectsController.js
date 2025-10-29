import Project from "../models/project.js";
import axios from "axios";

// GET semua project milik user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error("❌ Error getProjects:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create project baru
export const createProject = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("👤 User:", req.user);

    const { title, name, description, deadline } = req.body;
    const projectName = title || name;
    const userId = req.user?.id || "guest";

    if (!projectName || !description) {
      return res.status(400).json({
        error: "Name/title dan description wajib diisi",
      });
    }

    const project = new Project({
      name: projectName,
      description,
      createdBy: userId,
      deadline: deadline ? new Date(deadline) : null,
    });

    const savedProject = await project.save();

    // Kirim ke History Service
    try {
      await axios.post(
        "http://localhost:3001/history",
        {
          projectId: savedProject._id,
          name: savedProject.name,
          description: savedProject.description,
          deadline: savedProject.deadline,
          createdBy: savedProject.createdBy,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("✅ History created successfully");
    } catch (err) {
      console.error("❌ Failed to create history:", err.message);
    }

    // Kirim ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          action: `membuat proyek baru "${savedProject.name}"`,
          projectId: savedProject._id,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("📝 Activity log created");
    } catch (err) {
      console.error("❌ Failed to create activity:", err.message);
    }

    res.status(201).json(savedProject);
  } catch (err) {
    console.error("❌ Error createProject:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET satu project berdasarkan ID
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("❌ Error getProject:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    console.log("✏️ Update Project Request:", req.body);
    console.log("👤 User:", req.user);

    const { title, name, description, deadline } = req.body;
    const projectName = title || name;

    // Update data project di MongoDB utama
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: projectName,
        description,
        deadline: deadline ? new Date(deadline) : null,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Sync ke History Service
    try {
      await axios.put(
        `http://localhost:3001/history/${project._id}`,
        {
          name: project.name,
          description: project.description,
          deadline: project.deadline,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("✅ History updated successfully");
    } catch (err) {
      console.error("❌ Gagal update history:", err.response?.data || err.message);
    }

    // Kirim ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          action: `mengupdate proyek "${project.name}"`,
          projectId: project._id,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("📝 Activity log updated");
    } catch (err) {
      console.error("❌ Gagal kirim activity:", err.response?.data || err.message);
    }

    res.json(project);
  } catch (err) {
    console.error("❌ Error updateProject:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Hapus dari History Service
    try {
      await axios.delete(`http://localhost:3001/history/${project._id}`);
      console.log("🗑️ History deleted");
    } catch (err) {
      console.error("❌ Gagal hapus history:", err.message);
    }

    // Log ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          action: `menghapus proyek "${project.name}"`,
          projectId: project._id,
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      console.log("📝 Activity log deleted project");
    } catch (err) {
      console.error("❌ Gagal kirim activity delete:", err.message);
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleteProject:", err);
    res.status(500).json({ error: err.message });
  }
};
