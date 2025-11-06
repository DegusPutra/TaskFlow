import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "../api/axios"; // ✅ ubah di sini

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiAuth.post("/auth/login", formData); // ✅ tetap sama
      alert(`Selamat datang, ${res.data.name}!`);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Email atau password salah!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Welcome to
        </h2>
        <h1 className="text-4xl font-extrabold text-center mb-6">
          <span className="text-red-600">Task</span>
          <span className="text-green-600">Flow</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Daftar di sini
          </button>
        </div>
      </div>
    </div>
  );
}
