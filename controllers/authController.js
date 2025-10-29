const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fungsi untuk generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER http://localhost:5050/api/auth/register (POST)
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Konfirmasi password tidak cocok' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN http://localhost:5050/api/auth/login (POST)
exports.login = async (req, res) => {
  try {
    console.log('LOGIN body:', req.body);      // <--- tambahkan
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('USER from DB:', user);        // <--- tambahkan

    if (!user) return res.status(400).json({ message: 'Email tidak ditemukan' });

    const isMatch = await user.matchPassword(password);
    console.log('isMatch:', isMatch);          // <--- tambahkan
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
