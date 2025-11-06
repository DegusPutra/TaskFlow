// src/controllers/invitesController.js
import Project from "../models/project.js";

export const createInvite = async (req, res) => {
  try {
    const { projectId, role } = req.body;

    if (!projectId || !role) {
      return res.status(400).json({ message: "Project ID dan role harus diisi" });
    }

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ✅ generate link acak
    const randomCode = Math.random().toString(36).substring(2, 10);
    const inviteLink = `https://taskflow-${randomCode}.vercel.app/open-project/${projectId}?role=${role}`;

    res.status(201).json({ inviteLink });
  } catch (err) {
    console.error("❌ Error in createInvite:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Ambil semua link undangan untuk project tertentu
export const getInvites = async (req, res) => {
  try {
    const { projectId } = req.params;

    // generate base domain acak
    const randomCode = Math.random().toString(36).substring(2, 10);
    const base = `https://taskflow-${randomCode}.vercel.app/open-project`;

    res.json({
      editor: `${base}/${projectId}?role=editor`,
      viewer: `${base}/${projectId}?role=viewer`,
    });
  } catch (err) {
    console.error("❌ Error in getInvites:", err);
    res.status(500).json({ message: "Server error" });
  }
};
