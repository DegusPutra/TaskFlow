import Project from "../models/project.js";
import axios from "axios";

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ createdBy: userId });

    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(now.getDate() + 2);

    for (const p of projects) {
      if (p.deadline) {
        const deadline = new Date(p.deadline);
        if (deadline >= now && deadline <= twoDaysLater) {
          try {
            await axios.post(
              "http://localhost:5010/api/notifications",
              {
                message: `⏰ Deadline proyek "${p.name}" sudah dekat!`,
                type: "deadline",
                userId: userId,
                metadata: { projectId: p._id },
              },
              {
                headers: {
                  Authorization: req.headers.authorization,
                },
              }
            );
          } catch (notifErr) {
            console.error("❌ Gagal kirim notifikasi deadline:", notifErr.message);
          }
        }
      }
    }

    res.json(projects);
  } catch (err) {
    console.error("❌ Error getProjects:", err);
    res.status(500).json({ error: err.message });
  }
};


export const createProject = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("👤 User:", req.user);

    const { title, name, description, deadline } = req.body;
    const projectName = title || name;
    const userId = req.user?.id;

    if (!projectName || !description) {
      return res.status(400).json({
        error: "Name/title dan description wajib diisi",
      });
    }

    // Simpan project baru
    const project = new Project({
      name: projectName,
      description,
      createdBy: userId,
      deadline: deadline ? new Date(deadline) : null,
    });

    const savedProject = await project.save();

    //Kirim notifikasi ke Notification Service
    try {
await axios.post(
  "http://localhost:5010/api/notifications",
  {
    message: `📢 Proyek baru "${savedProject.name}" berhasil dibuat.`,
    type: "new-task",
    userId: savedProject.createdBy,
    metadata: { projectId: savedProject._id },
  },
  { headers: { Authorization: req.headers.authorization } }
);

      console.log("✅ Notifikasi proyek baru dikirim");
    } catch (err) {
      console.error("❌ Gagal kirim notifikasi proyek baru:", err.message);
    }

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
        { headers: { Authorization: req.headers.authorization } }
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
        { headers: { Authorization: req.headers.authorization } }
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

export const updateProject = async (req, res) => {
  try {
    console.log("✏️ Update Project Request:", req.body);
    console.log("👤 User:", req.user);

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

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    try {
      await axios.post(
  "http://localhost:5010/api/notifications",
  {
    userId: req.user.id,
    message: `🗑️ Proyek "${project.name}" telah dihapus.`,
    type: "custom",
    metadata: { projectId: project._id },
  },
  { headers: { Authorization: req.headers.authorization } }
);

      console.log("✅ Notifikasi update proyek dikirim");
    } catch (err) {
      console.error("❌ Gagal kirim notifikasi update:", err.message);
    }

    // Update History Service
    try {
      await axios.put(
        `http://localhost:3001/history/${project._id}`,
        {
          name: project.name,
          description: project.description,
          deadline: project.deadline,
        },
        { headers: { Authorization: req.headers.authorization } }
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
        { headers: { Authorization: req.headers.authorization } }
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

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Kirim notifikasi delete 
    try {
     await axios.post(
  "http://localhost:5010/api/notifications",
  {
    userId: req.user.id, // ✅ TAMBAH INI
    message: `🗑️ Proyek "${project.name}" telah dihapus.`,
    type: "custom",
    metadata: { projectId: project._id },
  },
  { headers: { Authorization: req.headers.authorization } }
);

      console.log("✅ Notifikasi penghapusan proyek dikirim");
    } catch (err) {
      console.error("❌ Gagal kirim notifikasi hapus:", err.message);
    }
    
    // Hapus dari History Service
    try {
      await axios.delete(`http://localhost:3001/history/${project._id}`);
      console.log("🗑️ History deleted");
    } catch (err) {
      console.error("❌ Gagal hapus history:", err.message);
    }

    // Kirim ke Activity Service
    try {
      await axios.post(
        "http://localhost:3001/activity",
        {
          action: `menghapus proyek "${project.name}"`,
          projectId: project._id,
        },
        { headers: { Authorization: req.headers.authorization } }
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
