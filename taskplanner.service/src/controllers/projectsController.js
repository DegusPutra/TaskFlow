import Project from "../models/project.js";

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

// POST buat project baru
export const createProject = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("👤 User:", req.user);

    const { name, description, deadline } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    const project = new Project({
      name,
      description,
      createdBy: req.user.id,
      deadline,
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
    const { name, description, deadline } = req.body; // ✅ tambahkan deadline

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, deadline, updatedAt: Date.now() }, // ✅ ikut disimpan
      { new: true }
    );

    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project); // ✅ kirim data project langsung (tidak perlu bungkus message)
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
