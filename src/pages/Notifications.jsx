import React from "react";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifikasi</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">Tidak ada notifikasi.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded shadow ${
                n.type === "success" ? "bg-green-100 text-green-800" :
                n.type === "error" ? "bg-red-100 text-red-800" :
                "bg-blue-100 text-blue-800"
              }`}
            >
              <p>{n.message}</p>
              <small className="text-gray-500">{n.time}</small>
            </div>
          ))}

          <button
            onClick={clearNotifications}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
