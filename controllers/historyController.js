const History = require('../models/historyModel'); // pastikan nanti modelnya dibuat

// Fungsi untuk menambahkan history baru
const createHistory = async (req, res) => {
  try {
    const history = await History.create(req.body);
    res.status(201).json({
      message: 'History created successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating history',
      error: error.message,
    });
  }
};

module.exports = { createHistory };
