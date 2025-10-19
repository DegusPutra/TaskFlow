import Project from "../models/project.js";

// GET semua project milik user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error("❌ Error getProjects:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST buat project baru
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      ownerId: req.user.id,
    });

    await project.save();
    res.status(201).json(project);
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
    const { name, description } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated successfully", project });
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
