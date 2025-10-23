// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflowdb', {
 useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =============================
// 📦 Import Routes
// =============================
const historyRoutes = require('./routes/historyRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes'); // ✅ taruh di sini
const projectStatusRoutes = require('./routes/projectStatusRoutes');

// =============================
// 🚀 Gunakan Routes
// =============================
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/activity-log', activityLogRoutes); // ✅ dan baris ini tepat di bawah import
app.use('/api/v1/project-status', projectStatusRoutes);

// =============================
// ⚙️ Jalankan Server
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
