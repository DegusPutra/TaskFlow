const express = require('express');
const router = express.Router();
const taskHistoryController = require('../controllers/TaskHistoryController');

router.get('/tasks/:taskId/history', taskHistoryController.getTaskHistory);
router.get('/projects/:projectId/history', taskHistoryController.getProjectHistory);
router.get('/history', taskHistoryController.getAllHistory);


module.exports = router;
