import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const {
    notifications,
    clearNotifications,
    markAsRead,
    deleteNotification, 
  } = useNotifications();

  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    for (const id of selected) {
      await deleteNotification(id);
    }
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifikasi</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">Tidak ada notifikasi.</p>
      ) : (
        <>
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-4 rounded shadow cursor-pointer flex items-center gap-3 ${
                  n.isRead
                    ? "bg-gray-100 text-gray-500"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(n._id)}
                  onChange={() => toggleSelect(n._id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <p>{n.message}</p>
                  <small className="text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              disabled={selected.length === 0}
            >
              Hapus yang Dipilih
            </button>
            <button
              onClick={clearNotifications}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Hapus Semua
            </button>
          </div>
        </>
      )}
    </div>
  );
}
