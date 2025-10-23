const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  last_page: { type: String, required: true },
  last_accessed_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
