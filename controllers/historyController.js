import History from "../models/history.js";
import { getProjectHistoryService } from "../services/historyService.js";

// === POST: Tambah data history baru ===
export const createHistory = async (req, res) => {
  try {
    // START LOG VERIFIKASI PENERIMAAN
    console.log("📜 PRAS RECEIVE: History request received:", req.body); 
    // END LOG VERIFIKASI PENERIMAAN

    const { projectId, name, description, deadline, createdBy } = req.body;

    if (!projectId || !name || !createdBy) {
      return res.status(400).json({ error: "projectId, name, dan createdBy wajib diisi" });
    }

    const history = new History({
      projectId,
      name,
      description,
      deadline: deadline ? new Date(deadline) : null,
      createdBy,
    });

    const saved = await history.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error createHistory:", err);
    res.status(500).json({ error: err.message });
  }
};

// === GET: Ambil semua history dari collection ===
export const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id; // ambil id dari JWT

    const filter = userId ? { createdBy: userId } : {};
    const histories = await History.find(filter).sort({ createdAt: -1 });

    res.json(histories);
  } catch (err) {
    console.error("❌ Error getHistory:", err);
    res.status(500).json({ error: err.message });
  }
};

// === GET: Ambil project history berdasarkan userId (via service) ===
export const getProjectHistory = async (req, res) => {
  try {
    const userId = req.user?.id; // sudah otomatis dari token JWT
    const projects = await getProjectHistoryService(userId);
    res.json(projects);
  } catch (err) {
    console.error("❌ Error getProjectHistory:", err);
    res.status(500).json({ error: err.message });
  }
};

// === PUT: Update data history berdasarkan projectId ===
export const updateHistory = async (req, res) => {
  try {
    const { id } = req.params; // id di sini adalah projectId
    const { name, description, deadline } = req.body;

    const updated = await History.findOneAndUpdate(
      { projectId: id }, // cari berdasarkan projectId, bukan _id history
      {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "History not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updateHistory:", err);
    res.status(500).json({ error: err.message });
  }
};

// === DELETE: Hapus history berdasarkan projectId ===
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await History.findOneAndDelete({ projectId: id });

    if (!deleted) {
      return res.status(404).json({ error: "History not found" });
    }

    res.json({ message: "History deleted" });
  } catch (err) {
    console.error("❌ Error deleteHistory:", err);
    res.status(500).json({ error: err.message });
  }
};
