const express = require('express');
const router = express.Router();
const { createActivityLog, getActivityLogs } = require('../controllers/activityLogController');

router.post('/', createActivityLog);
router.get('/', getActivityLogs);

module.exports = router;
