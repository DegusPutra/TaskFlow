// routes/projectStatusRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// === GET STATUS PROYEK ===
// Menampilkan jumlah task selesai, total task, dan progress tiap user
router.get('/', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const doneTasks = await Task.countDocuments({ status: 'Done' });
    const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

    // Hitung per user
    const userStats = await Task.aggregate([
      {
        $group: {
          _id: '$assigneeId',
          totalTasks: { $sum: 1 },
          doneTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      totalTasks,
      doneTasks,
      progress: progress.toFixed(2),
      userStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Gagal mengambil status proyek',
      error: err.message
    });
  }
});

module.exports = router;
