import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil Akun</h2>
        <p className="text-lg text-gray-700 mb-2">
          <strong>Nama:</strong> {user.name}
        </p>
        <p className="text-lg text-gray-700 mb-6">
          <strong>Email:</strong> {user.email}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
