const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware proteksi route
 * Memverifikasi token dan menambahkan data user (id, name, email) ke req.user
 */
const protect = async (req, res, next) => {
  let token;

  // Pastikan header Authorization ada dan formatnya "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari DB tanpa password
      req.user = await User.findById(decoded.id).select('-password');

      // Jika user tidak ditemukan (misalnya sudah dihapus)
      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      // Tambahkan informasi ekstra dari token ke req.user
      req.user.name = decoded.name || req.user.name;
      req.user.email = decoded.email || req.user.email;

      next(); // lanjut ke route handler berikutnya
    } catch (error) {
      console.error('❌ Error di middleware auth:', error);
      return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
    }
  }

  // Jika tidak ada token sama sekali
  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
  }
};

module.exports = protect;
