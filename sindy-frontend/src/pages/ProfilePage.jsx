import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "../api/axios";
import { FaUserEdit, FaSignOutAlt, FaEnvelope, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await apiAuth.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setEditData({ name: res.data.name, email: res.data.email, password: "" });
      } catch (error) {
        console.error("Gagal ambil profil:", error);
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiAuth.put("/users/me", editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profil berhasil diperbarui!");
      setUser(res.data);
      setIsEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  if (!user) return <p className="text-center mt-20 text-gray-500">Memuat profil...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-md bg-white/70 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-center border border-blue-100"
      >
        {/* Foto profil */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="avatar"
            className="w-full h-full rounded-full border-4 border-blue-200 shadow-md"
          />
        </div>

        <h2 className="text-3xl font-bold text-blue-800 mb-1">{user.name}</h2>
        <p className="text-gray-600 mb-6">@{user.email.split("@")[0]}</p>

        {!isEditing ? (
          <>
            <div className="space-y-2 text-left bg-blue-50 rounded-xl p-4 shadow-inner mb-6">
              <p className="flex items-center gap-3 text-gray-700">
                <FaUser className="text-blue-600" /> <span>{user.name}</span>
              </p>
              <p className="flex items-center gap-3 text-gray-700">
                <FaEnvelope className="text-blue-600" /> <span>{user.email}</span>
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition"
              >
                <FaUserEdit /> Edit
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru (opsional)
              </label>
              <input
                type="password"
                name="password"
                value={editData.password}
                onChange={handleEditChange}
                placeholder="Isi jika ingin mengganti password"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition"
              >
                Simpan
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-full hover:bg-gray-500 transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
