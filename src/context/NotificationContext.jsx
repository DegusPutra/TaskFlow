import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // 🔹 Ambil semua notifikasi dari backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5010/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil notifikasi:", err);
    }
  };

  // 🔹 Tandai sudah dibaca
  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5010/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("❌ Gagal tandai notifikasi:", err);
    }
  };

  // 🔹 Hapus satu notifikasi
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5010/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Gagal hapus notifikasi:", err);
    }
  };

  // 🔹 Hapus semua notifikasi
  const clearNotifications = async () => {
    try {
      await axios.delete("http://localhost:5010/api/notifications");
      setNotifications([]);
    } catch (err) {
      console.error("❌ Gagal hapus semua notifikasi:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        markAsRead,
        deleteNotification, // ✅ jangan lupa ini!
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
