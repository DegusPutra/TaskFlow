import Invite from "../models/invite.js";
import Project from "../models/project.js";
import ProjectMember from "../models/projectMember.js";
import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Membuat link undangan untuk project
 */
export async function createInvite(req, res) {
  try {
    const projectId = req.params.id;
    const { role = "viewer", expiresInHours } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID wajib disertakan" });
    }

    const membership = await ProjectMember.findOne({
      projectId,
      userId: req.user.id,
    });

    if (!membership || !["admin", "editor"].includes(membership.role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const token = uuidv4().replace(/-/g, "");
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 3600 * 1000)
      : null;

    const invite = new Invite({
      projectId,
      token,
      role,
      expiresAt,
      createdBy: req.user.id,
      used: false,
    });
    await invite.save();

    const baseUrl = req.headers.origin || `http://localhost:${process.env.PORT || 5005}`;
    const inviteLink = `${baseUrl}/invite/${invite.token}`;

    res.status(201).json({
      message: "Undangan berhasil dibuat",
      inviteLink,
      token: invite.token,
      expiresAt,
    });
  } catch (err) {
    console.error("❌ Error createInvite:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * Menerima undangan project
 */
export async function acceptInvite(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token undangan wajib disertakan" });
    }

    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ error: "Undangan tidak ditemukan" });
    if (invite.used) return res.status(400).json({ error: "Undangan sudah digunakan" });
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      return res.status(400).json({ error: "Undangan sudah kedaluwarsa" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    let membership = await ProjectMember.findOne({
      projectId: invite.projectId,
      userId: user._id,
    });

    if (!membership) {
      membership = new ProjectMember({
        projectId: invite.projectId,
        userId: user._id,
        role: invite.role,
        addedBy: req.user.id,
      });
      await membership.save();
    } else if (membership.role !== invite.role) {
      membership.role = invite.role;
      await membership.save();
    }

    invite.used = true;
    await invite.save();

    res.json({
      success: true,
      message: "Undangan berhasil diterima",
      projectId: invite.projectId,
      role: invite.role,
    });
  } catch (err) {
    console.error("❌ Error acceptInvite:", err);
    res.status(500).json({ error: err.message });
  }
}
