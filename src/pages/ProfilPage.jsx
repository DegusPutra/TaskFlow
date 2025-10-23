import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    const updatedUser = { ...user, ...editData };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Akun</h2>

        {/* Menampilkan data user */}
        {!isEditing ? (
          <>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Nama:</strong> {user.name}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              <strong>Email:</strong> {user.email}
            </p>

            <div className="flex justify-center gap-4">
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
          /* Form edit profil */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
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
              <label className="block text-sm font-medium text-gray-700 text-left">
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

            <div className="flex justify-center gap-4 mt-6">
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
