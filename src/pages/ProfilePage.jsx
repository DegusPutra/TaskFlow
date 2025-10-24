import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "../api/axios"; // ✅ pakai apiAuth, bukan default import

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Ambil profil user dari backend (auth service)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Sesi login habis, silakan login ulang.");
          return navigate("/login");
        }

        const res = await apiAuth.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setEditData({ name: res.data.name, email: res.data.email, password: "" });
      } catch (error) {
        console.error("Gagal ambil profil:", error);
        alert("Sesi login habis, silakan login ulang.");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  // ✅ Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // ✅ Update input edit profil
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Simpan profil yang diedit
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
      console.error(error);
      alert(error.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  if (!user) return <p className="text-center mt-20">Memuat profil...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Profil Akun
        </h2>

        {!isEditing ? (
          <>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Nama:</strong> {user.name}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              <strong>Email:</strong> {user.email}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Edit Profil
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
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
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Simpan
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500 transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
