// ✅ src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { notifications } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // 🔹 Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login");
  };

  const handleViewNotifications = () => {
    navigate("/notifications");
    setSidebarOpen(false);
  };

  return (
    <>
      {/* 🔹 Navbar utama */}
      <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold text-white"
          >
          TaskFlow
          </button>

          <button
            className="text-white text-2xl md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <Link to="/taskplanner" className="hover:text-gray-300">
              TaskPlanner
            </Link>
            <Link to="/todolist" className="hover:text-gray-300">
              To-Do List
            </Link>

            {/* 🔔 Notifikasi */}
            <button
              onClick={handleViewNotifications}
              className="relative text-2xl hover:text-gray-300"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profil & Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <FaUserCircle size={26} className="hover:text-gray-300" />
                  {/* Nama hanya muncul di layar kecil */}
                  <span className="font-medium hidden lg:inline">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 bg-white text-gray-700 shadow-lg rounded-md w-40 animate-fadeIn">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
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

      {/* 🔹 Sidebar (Mobile View) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-col p-5 space-y-5">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-gray-300"
          >
            Profil
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-gray-300"
          >
            Dashboard
          </Link>
          <Link
            to="/taskplanner"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-gray-300"
          >
            TaskPlanner
          </Link>
          <Link
            to="/todolist"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-gray-300"
          >
            To-Do List
          </Link>

          <button
            onClick={handleViewNotifications}
            className="hover:text-gray-300 flex items-center gap-2"
          >
            🔔 Notifikasi
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 mt-3 border-t border-gray-700 pt-3 text-left"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
