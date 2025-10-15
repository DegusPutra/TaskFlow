const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// GET PROFILE http://localhost:5050/api/users/me (GET)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE http://localhost:5050/api/users/me (PUT)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Cek email duplikat (kalau user mengganti email)
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah digunakan oleh akun lain' });
      }
      user.email = req.body.email;
    }

    user.name = req.body.name || user.name;

    // Jika user mengganti password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: jwt.sign({ id: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
