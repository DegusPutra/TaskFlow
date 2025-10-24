// src/pages/OpenProject.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";

const TASK_API = "http://localhost:5005/api/tasks";

export default function OpenProject() {
  const { state } = useLocation();
  const project = state?.project;
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
  });
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // ✅ Ambil task dari MongoDB
  useEffect(() => {
    if (project?._id) {
      fetch(`${TASK_API}/${project._id}`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch(() => showNotification("Gagal memuat task!", "error"));
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Simpan atau edit task
  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      return showNotification("Lengkapi semua kolom!", "error");
    }

    try {
      if (editId) {
        const res = await fetch(`${TASK_API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t._id === editId ? updated : t)));
        showNotification("Task diperbarui ✅");
      } else {
        const res = await fetch(TASK_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newTask, projectId: project._id }),
        });
        const added = await res.json();
        setTasks((prev) => [added, ...prev]);
        showNotification("Task ditambahkan 🎉");
      }

      setShowForm(false);
      setNewTask({ title: "", description: "", priority: "Low", dueDate: "" });
      setEditId(null);
    } catch {
      showNotification("Gagal menyimpan task!", "error");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${TASK_API}/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showNotification("Task dihapus 🗑️", "error");
    } catch {
      showNotification("Gagal menghapus task!", "error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        {project?.name || "No Project Selected"}
      </h1>

      {/* Daftar Task */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded-xl shadow border relative">
            <h3 className="font-semibold text-blue-700">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="text-xs mt-2 text-gray-500">
              🗓️ {task.dueDate} | ⚙️ {task.priority}
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  setEditId(task._id);
                  setNewTask(task);
                  setShowForm(true);
                }}
                className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Tambah Task */}
      <button
        onClick={() => {
          setShowForm(true);
          setEditId(null);
          setNewTask({ title: "", description: "", priority: "Low", dueDate: "" });
        }}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold px-6 py-4 rounded-full shadow-lg transition-all"
      >
        +
      </button>

      {/* Form Tambah/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              {editId ? "Edit Task" : "Add Task"}
            </h2>

            <input
              name="title"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-white ${
            notification.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          <FiCheckCircle className="inline mr-2" />
          {notification.msg}
        </div>
      )}
    </div>
  );
}
