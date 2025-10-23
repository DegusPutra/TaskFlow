const ActivityLog = require('../models/activityLogModel');

// ➕ Tambah log baru
const createActivityLog = async (req, res) => {
  try {
    console.log("📥 POST /api/v1/activity-log body =", req.body);
    const log = await ActivityLog.create(req.body);
    res.status(201).json({
      success: true,
      message: '✅ Activity log berhasil ditambahkan',
      data: log
    });
  } catch (error) {
    console.error("❌ Error createActivityLog:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Ambil semua log
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find();
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("❌ Error getActivityLogs:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createActivityLog, getActivityLogs };
