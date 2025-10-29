import Project from "../models/project.js";
import axios from "axios";
// GET semua project milik user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user?.id || null });
    res.json(projects);
  } catch (err) {
    console.error("❌ Error getProjects:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST buat project baru
export const createProject = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("👤 User:", req.user);

    const { title, name, description, deadline } = req.body;
    const projectName = title || name;
    const userId = req.user?.id || "guest";

    if (!projectName || !description) {
      return res.status(400).json({ error: "Name/title dan description wajib diisi" });
    }

    const project = new Project({
      name: projectName,
      description,
      createdBy: userId,
      deadline: deadline ? new Date(deadline) : null,
    });

    const savedProject = await project.save();

    // 🔹 Kirim data ke History Service
    try {
      await axios.post("http://localhost:3001/history", {
        projectId: savedProject._id,
        name: savedProject.name,
        description: savedProject.description,
        deadline: savedProject.deadline,
        createdBy: savedProject.createdBy,
      });
      console.log("✅ History created successfully");
    } catch (err) {
      console.error("❌ Failed to create history:", err.message);
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

// PUT update project
export const updateProject = async (req, res) => {
  try {
    const { title, name, description, deadline } = req.body;

    const projectName = title || name;

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

    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("❌ Error updateProject:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleteProject:", err);
    res.status(500).json({ error: err.message });
  }
};