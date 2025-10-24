// src/pages/ProjectView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";

const API_URL = "http://localhost:5005/api/projects"; 

export default function ProjectView() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // ✅ Ambil semua project dari backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => showNotification("Gagal memuat data!", "error"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Tambah atau Edit project
  const handleAddProject = async () => {
    if (!newProject.name || !newProject.description || !newProject.deadline) {
      return showNotification("Isi semua kolom!", "error");
    }

    try {
      if (isEditing) {
        const res = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        });
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p._id === editId ? updated : p)));
        showNotification("Project diperbarui ✅");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        });
        const added = await res.json();
        setProjects((prev) => [added, ...prev]);
        showNotification("Project berhasil ditambahkan 🎉");
      }

      setNewProject({ name: "", description: "", deadline: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (err) {
      showNotification("Gagal menyimpan project!", "error");
    }
  };

  // ✅ Hapus project
  const confirmDelete = async () => {
    try {
      await fetch(`${API_URL}/${deleteId}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p._id !== deleteId));
      showNotification("Project dihapus 🗑️", "error");
    } catch {
      showNotification("Gagal menghapus!", "error");
    }
    setDeleteId(null);
  };

  const handleEdit = (proj, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditId(proj._id);
    setNewProject({
      name: proj.name,
      description: proj.description,
      deadline: proj.deadline,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-4xl font-bold text-blue-700 hover:text-blue-900 transition"
          >
            &lt;
          </button>
          <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        </div>
      </div>

      {/* Daftar Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            Belum ada project. Klik tombol{" "}
            <strong className="text-blue-700">+ Add Project</strong> di kanan bawah.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() =>
                navigate(`/open-project/${proj._id}`, { state: { project: proj } })
              }
              className="relative cursor-pointer bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => handleEdit(proj, e)}
                  className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(proj._id);
                  }}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <h2 className="text-xl font-semibold text-blue-700">{proj.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
              <div className="text-xs text-gray-500 mt-3">
                📅 Deadline: {proj.deadline}
              </div>
              <div className="text-xs text-gray-500">
                🕓 Created: {proj.createdAt?.split("T")[0]}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tombol Tambah */}
      <button
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setNewProject({ name: "", description: "", deadline: "" });
        }}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold px-6 py-4 rounded-full shadow-lg transition-all"
      >
        +
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {isEditing ? "Edit Project" : "Create New Project"}
            </h2>

            <label className="text-sm font-medium">Project Name</label>
            <input
              name="name"
              type="text"
              value={newProject.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="text-sm font-medium">Deadline</label>
            <input
              name="deadline"
              type="date"
              value={newProject.deadline}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl text-center">
            <h3 className="text-lg font-semibold mb-3">
              Yakin ingin menghapus project ini?
            </h3>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-white text-sm flex items-center gap-2 ${
            notification.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          <FiCheckCircle size={18} />
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
