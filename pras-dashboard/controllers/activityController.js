import Activity from "../models/activity.js";

// === POST: Tambah Activity ===
export const createActivity = async (req, res) => {
  try {
    // START LOG VERIFIKASI PENERIMAAN
    console.log("📝 PRAS RECEIVE: Activity request received:", req.body); // <-- LOG VERIFIKASI
    // END LOG VERIFIKASI PENERIMAAN
    
    // Ambil data user dari JWT payload
    const user =
      req.user?.name ||       // gunakan "name" dari token
      req.user?.email ||     // fallback ke email
      req.user?.id ||        // atau id jika name tidak ada
      req.user?._id ||
      "guest";

    const { action, projectId } = req.body;

    // Simpan activity baru
    const activity = new Activity({
      user,          
      projectId,
      action,
    });

    await activity.save();
    res.status(201).json({ message: "✅ Activity logged successfully", activity });
  } catch (err) {
    console.error("❌ Error createActivity:", err);
    res.status(500).json({ error: err.message });
  }
};


// === GET: Ambil Activity milik user login ===
export const getRecentActivities = async (req, res) => {
  try {
    // Ambil user yang sedang login dari token JWT
    const currentUser =
      req.user?.name ||       // gunakan "name"
      req.user?.email ||     // fallback ke email
      req.user?.id ||        // atau id
      req.user?._id ||
      "guest";

    // Buat query untuk user saat ini
    const query =
      currentUser && currentUser !== "guest"
        ? { user: currentUser }
        : {};

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(activities);
  } catch (err) {
    console.error("❌ Error getRecentActivities:", err);
    res.status(500).json({ error: err.message });
  }
};