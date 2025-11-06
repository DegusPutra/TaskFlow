import User from "../models/user.js"; // pastikan huruf besar kecil sesuai nama file

// GET semua user
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // findAll() diganti find()
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE user baru
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validasi sederhana
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nama, email, dan password wajib diisi" });
    }

    // cek apakah email sudah dipakai
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // buat user baru
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
