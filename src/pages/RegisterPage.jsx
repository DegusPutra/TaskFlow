import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "../api/axios"; // ✅ ubah di sini

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiAuth.post("/auth/register", formData); // ✅ pakai apiAuth
      alert("Registrasi berhasil!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data));

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Gagal registrasi");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Daftar Akun
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input nama, email, password, konfirmasi password */}
          {/* ... (semua bagian bawah tetap sama) */}
        </form>
      </div>
    </div>
  );
}
