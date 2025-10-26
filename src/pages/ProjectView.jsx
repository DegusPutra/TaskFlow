import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { apiTask } from "../api/axios";

export default function ProjectView() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiTask.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Gagal memuat project:", err);
        showNotification("Gagal memuat project ❌", "error");
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Cek deadline project
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      projects.forEach((proj) => {
        if (!proj.deadline) return;
        const deadline = new Date(proj.deadline.replace(" ", "T"));
        const diff = deadline - now;
        const days = diff / (1000 * 60 * 60 * 24);

        if (days <= 0 && days > -1)
          showNotification(`❌ Project "${proj.title}" telah melewati deadline!`, "error");
        else if (days <= 1 && days > 0)
          showNotification(`⏰ Deadline project "${proj.title}" hari ini!`, "error");
        else if (days <= 2 && days > 1)
          showNotification(`⚠️ Project "${proj.title}" akan segera mencapai deadline (2 hari lagi).`, "warning");
      });
    };
    if (projects.length > 0) checkDeadlines();
  }, [projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim() || !newProject.deadline) {
      showNotification("Isi semua kolom terlebih dahulu!", "error");
      return;
    }

    try {
      if (isEditing) {
        const res = await apiTask.put(`/projects/${editId}`, newProject);
        setProjects((prev) =>
          prev.map((proj) => (proj._id === editId ? res.data : proj))
        );
        showNotification("Project berhasil diperbarui ✅");
        setIsEditing(false);
        setEditId(null);
      } else {
        const res = await apiTask.post("/projects", newProject);
        setProjects([res.data, ...projects]);
        showNotification("Project berhasil ditambahkan 🎉");
      }

      setNewProject({ title: "", description: "", deadline: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      showNotification("Gagal menyimpan project ❌", "error");
    }
  };

  const handleEdit = (proj, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditId(proj._id);
    setNewProject({
      title: proj.title,
      description: proj.description,
      deadline: proj.deadline,
    });
    setShowForm(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await apiTask.delete(`/projects/${deleteId}`);
      setProjects((prev) => prev.filter((p) => p._id !== deleteId));
      showNotification("Project dihapus 🗑️", "error");
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      showNotification("Gagal menghapus project ❌", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-4xl font-bold text-blue-700 hover:text-blue-900 transition"
          >
            &lt;
          </button>
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">My Projects</h1>
        </div>
      </div>

      {/* 🔹 Daftar Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            Belum ada project.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() =>
                navigate(`/open-project/${proj._id}`, { state: { project: proj } })
              }
              className="relative cursor-pointer bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => handleEdit(proj, e)}
                  className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(proj._id, e)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-blue-700">{proj.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <div>📅 Deadline: <span className="font-medium">{proj.deadline}</span></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal & Notifikasi tetap */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {isEditing ? "Edit Project" : "Create New Project"}
            </h2>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input name="title" type="text" value={newProject.title} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-3" />
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={newProject.description} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-3" rows={3} />
            <label className="text-sm font-medium text-gray-700">Deadline</label>
            <input name="deadline" type="datetime-local" value={newProject.deadline} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleAddProject} className="px-4 py-2 bg-blue-600 text-white rounded">
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Yakin ingin menghapus project ini?</h3>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${
          notification.type === "error"
            ? "bg-red-500"
            : notification.type === "warning"
            ? "bg-yellow-500"
            : "bg-green-600"
        }`}>
          <FiCheckCircle size={18} />
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
