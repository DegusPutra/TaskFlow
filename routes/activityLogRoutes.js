// routes/activityLogRoutes.js
const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

// CREATE
router.post('/', async (req, res) => {
    
    console.log('POST /api/v1/activity-log body =', req.body);
    
  try {
    const newLog = new ActivityLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan log aktivitas', error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data log aktivitas', error: err.message });
  }
});

module.exports = router;
