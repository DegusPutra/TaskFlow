const activityLogService = require('../services/activityLog.service');
const Task = require('../models/Task');

exports.getTaskHistory = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task tidak ditemukan.' });

        const history = await activityLogService.getRecentActivities({ taskId }, 100, 1);

        res.status(200).json({
            taskId: task._id,
            title: task.title,
            history
        });
    } catch (error) {
        console.error('Error getTaskHistory:', error.message);
        res.status(500).json({ message: 'Gagal mengambil history task.' });
    }
};

exports.getProjectHistory = async (req, res) => {
    try {
        const { projectId } = req.params;
        const history = await activityLogService.getRecentActivities({ projectId }, 100, 1);

        res.status(200).json({
            projectId,
            history
        });
    } catch (error) {
        console.error('Error getProjectHistory:', error.message);
        res.status(500).json({ message: 'Gagal mengambil history project.' });
    }
};

exports.getAllHistory = async (req, res) => {
  try {
    const logs = await require('../models/ActivityLog').find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil semua history.' });
  }
};

