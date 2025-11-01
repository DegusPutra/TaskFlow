import React, { createContext, useContext, useEffect, useState } from "react";
import { apiNotification } from "../api/axios";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token")); // ✅

  // Cek perubahan token dari localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken); // trigger useEffect
      }
    }, 1000); // cek tiap 1 detik

    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
    try {
      if (!token) return;
      const res = await apiNotification.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil notifikasi:", err.response?.data || err.message);
    }
  };

  const clearNotifications = async () => {
    try {
      await apiNotification.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      console.error("❌ Gagal hapus semua notifikasi:", err.response?.data || err.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiNotification.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Gagal hapus notifikasi:", err.response?.data || err.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiNotification.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("❌ Gagal tandai notifikasi dibaca:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]); // ✅ ini yang penting

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        clearNotifications,
        deleteNotification,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
