import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { notifications } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 🔄 Hitung jumlah notifikasi belum dibaca
  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login");
  };

  const handleViewNotifications = () => {
    navigate("/notifications");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold text-white"
        >
          TaskFlow
        </button>

        {/* Tombol menu mobile */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Menu utama */}
        <div
          className={`flex-col md:flex-row md:flex items-center gap-5 absolute md:static left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-5 md:p-0 z-40 transition-all duration-300 ${
            menuOpen ? "top-14 opacity-100" : "-top-96 opacity-0 md:opacity-100"
          }`}
        >
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">
            Dashboard
          </Link>

          <Link to="/taskplanner" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">
            TaskPlanner
          </Link>

          <Link to="/todolist" onClick={() => setMenuOpen(false)} className="hover:text-gray-300">
            To-Do List
          </Link>

          {/* 🔔 Notifikasi dengan angka */}
          <div className="relative">
            <button
              onClick={handleViewNotifications}
              className="hover:text-gray-300 text-2xl relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Profil & Logout */}
          {user ? (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <FaUserCircle size={24} />
                <span className="font-medium">{user.name}</span>
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 bg-white text-gray-700 shadow-lg rounded-md w-36 hidden group-hover:block">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
