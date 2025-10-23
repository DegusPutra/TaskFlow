const express = require('express');
const router = express.Router();
const { createHistory } = require('../controllers/historyController');

// POST /api/v1/history
router.post('/', createHistory);

module.exports = router;
