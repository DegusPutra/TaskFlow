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
    name: "",
    description: "",
    deadline: "",
  });
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    if (!newProject.name.trim()) {
      showNotification("Nama project wajib diisi!", "error");
      return;
    }

    try {
      if (isEditing) {
        const res = await apiTask.put(`/projects/${editId}`, newProject);
        setProjects((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
        showNotification("Project berhasil diperbarui ✅");
      } else {
        const res = await apiTask.post("/projects", newProject);
        setProjects([res.data, ...projects]);
        showNotification("Project berhasil ditambahkan 🎉");
      }

      setIsEditing(false);
      setShowForm(false);
      setNewProject({ name: "", description: "", deadline: "" });
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
      name: proj.name,
      description: proj.description,
      deadline: proj.deadline ? proj.deadline.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id, e) => {
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
      showNotification("Gagal menghapus project ❌", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj._id}
            onClick={() =>
              navigate(`/open-project/${proj._id}`, { state: { project: proj } })
            }
            className="bg-white p-5 rounded-lg shadow cursor-pointer relative"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={(e) => handleEdit(proj, e)}
                className="text-yellow-500"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={(e) => handleDelete(proj._id, e)}
                className="text-red-500"
              >
                <FiTrash2 />
              </button>
            </div>
            <h2 className="font-semibold text-blue-600">{proj.name}</h2>
            <p>{proj.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Deadline:{" "}
              {proj.deadline
                ? new Date(proj.deadline).toLocaleDateString("id-ID")
                : "Tidak ada"}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setNewProject({ name: "", description: "", deadline: "" });
        }}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full text-2xl shadow-lg"
      >
        +
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-3">
              {isEditing ? "Edit Project" : "New Project"}
            </h2>
            <input
              name="name"
              value={newProject.name}
              onChange={handleChange}
              placeholder="Project name"
              className="w-full border p-2 rounded mb-3"
            />
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              name="deadline"
              type="date"
              value={newProject.deadline}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h3>Yakin ingin menghapus project ini?</h3>
            <div className="mt-4 flex justify-center gap-3">
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
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl text-white ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <FiCheckCircle className="inline mr-2" />
          {notification.message}
        </div>
      )}
    </div>
  );
}
