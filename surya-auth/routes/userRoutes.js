const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// GET profile user login
router.get('/me', protect, getProfile);

// UPDATE profile user login
router.put('/me', protect, updateProfile);

module.exports = router;
