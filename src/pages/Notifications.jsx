import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage (planner dan todo)
    const tasks = JSON.parse(localStorage.getItem("plannerTasks") || "[]");
    const todos = JSON.parse(localStorage.getItem("todoList") || "[]");

    // Buat list notifikasi sederhana
    const combined = [
      ...tasks.map(t => ({
        type: "Project",
        message: `${t.title} (Deadline: ${t.deadline})`,
      })),
      ...todos.map(t => ({
        type: "To-Do",
        message: t.text || t.title,
      })),
    ];

    setNotifications(combined);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 text-2xl font-bold hover:text-gray-800"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
            >
              <span className="text-gray-800">{n.message}</span>
              <span className="text-sm text-gray-500">{n.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
