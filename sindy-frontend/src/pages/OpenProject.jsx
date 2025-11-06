// ✅ src/pages/OpenProject.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiTask } from "../api/axios";
import { UserContext } from "../UserContext";

export default function OpenProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const projectFromState = location.state?.project || null;

  const [project, setProject] = useState(
    projectFromState || { id, name: "Project", description: "" }
  );
  const [tasks, setTasks] = useState({ todo: [], in_progress: [], done: [] });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    members: 1,
    status: "todo",
  });
  const [role, setRole] = useState(user?.role || "editor");

  useEffect(() => {
    if (user?.role) setRole(user.role);
  }, [user]);

  // ✅ Ambil task dari backend berdasarkan ID project
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiTask.get(`/projects/${id}/tasks`);
        const grouped = { todo: [], in_progress: [], done: [] };

        res.data.forEach((t) => {
          const status = ["todo", "in_progress", "done"].includes(t.status)
            ? t.status
            : "todo";
          grouped[status].push(t);
        });

        setTasks(grouped);
      } catch (err) {
        console.error("❌ Gagal memuat tasks:", err);
      }
    };

    fetchTasks();
  }, [id]);

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Simpan task baru atau update task lama
  const saveTask = async () => {
    if (!newTask.title || !newTask.deadline)
      return alert("Isi semua kolom sebelum menyimpan!");

    const membersArray = Array.from(
      { length: Number(newTask.members) },
      (_, i) => `Member ${i + 1}`
    );

    const taskData = {
      title: newTask.title,
      deadline: newTask.deadline,
      members: membersArray,
      status: newTask.status || "todo",
      project: id,
    };

    try {
      if (editingTask) {
        const res = await apiTask.put(`/tasks/${editingTask._id}`, taskData);
        setTasks((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((col) => {
            updated[col] = updated[col].map((t) =>
              t._id === editingTask._id ? res.data : t
            );
          });
          return updated;
        });
      } else {
        const res = await apiTask.post(`/projects/${id}/tasks`, taskData);
        setTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, res.data],
        }));
      }

      setShowForm(false);
      setEditingTask(null);
      setNewTask({ title: "", deadline: "", members: 1, status: "todo" });
    } catch (err) {
      console.error("❌ Gagal menyimpan task:", err);
      alert("Gagal menyimpan task!");
    }
  };

  // 🔹 Edit task
  const handleEdit = (task) => {
    if (role === "viewer") return;
    setEditingTask(task);
    setNewTask({
      title: task.title,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "",
      members: task.members?.length || 1,
      status: task.status,
    });
    setShowForm(true);
  };

  // 🔹 Hapus task
  const handleDelete = async (taskId) => {
    if (role === "viewer") return;
    if (!window.confirm("Yakin ingin menghapus task ini?")) return;

    try {
      await apiTask.delete(`/tasks/${taskId}`);
      setTasks((prev) => {
        const updated = {};
        for (const col in prev) {
          updated[col] = prev[col].filter((t) => t._id !== taskId);
        }
        return updated;
      });
    } catch (err) {
      console.error("❌ Gagal menghapus task:", err);
      alert("Gagal menghapus task!");
    }
  };

  // ✅ Drag & Drop fix total (sinkron dengan backend enum)
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (role === "viewer") return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    if (sourceCol === destCol && source.index === destination.index) return;

    const movedTask = tasks[sourceCol][source.index];

    // Update lokal dulu
    const newSource = Array.from(tasks[sourceCol]);
    newSource.splice(source.index, 1);
    const newDest = Array.from(tasks[destCol]);
    newDest.splice(destination.index, 0, { ...movedTask, status: destCol });

    setTasks((prev) => ({
      ...prev,
      [sourceCol]: newSource,
      [destCol]: newDest,
    }));

    try {
      const payload = {
        title: movedTask.title,
        deadline: movedTask.deadline,
        members: movedTask.members,
        project: movedTask.project,
        status: destCol,
      };
      await apiTask.put(`/tasks/${movedTask._id}`, payload);
    } catch (err) {
      console.error("❌ Gagal update status:", err);
    }
  };

  // 🔹 Share project
  const handleShare = async () => {
    const link = `${window.location.origin}/open-project/${id}`;
    await navigator.clipboard.writeText(link);
    alert("🔗 Link project berhasil disalin!");
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-red-100" },
    { id: "in_progress", title: "In Progress", color: "bg-yellow-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/taskplanner")}
            className="text-3xl font-bold text-blue-700 hover:text-blue-900 transition"
          >
            &lt;
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="editor">👩‍💻 Editor</option>
            <option value="viewer">👀 Viewer</option>
          </select>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔗 Share
          </button>
        </div>
      </div>

      {/* TASK BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${col.color} p-4 rounded-xl shadow min-h-[350px] transition`}
                >
                  <h3 className="font-semibold mb-3 text-lg text-gray-800">
                    {col.title}
                  </h3>

                  {(tasks[col.id] || []).map((t, idx) => (
                    <Draggable draggableId={t._id} index={idx} key={t._id}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="bg-white p-3 rounded-lg mb-3 shadow-sm border border-gray-200 hover:shadow-md transition relative"
                        >
                          <div className="font-medium text-gray-800">
                            {t.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            🗓️{" "}
                            {t.deadline
                              ? new Date(t.deadline).toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            👥 Members: {t.members?.length || 0}
                          </div>

                          {role === "editor" && (
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={() => handleEdit(t)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(t._id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* ADD BUTTON */}
      {role === "editor" && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTask(null);
            setNewTask({
              title: "",
              deadline: "",
              members: 1,
              status: "todo",
            });
          }}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold px-6 py-4 rounded-full shadow-lg transition-all"
        >
          +
        </button>
      )}

      {/* FORM INPUT TASK */}
      {showForm && role === "editor" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>

            <label className="text-sm font-medium text-gray-700">Task Title</label>
            <input
              name="title"
              type="text"
              value={newTask.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter task name"
            />

            <label className="text-sm font-medium text-gray-700">Deadline</label>
            <input
              name="deadline"
              type="date"
              value={newTask.deadline}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <label className="text-sm font-medium text-gray-700">Members</label>
            <input
              name="members"
              type="number"
              min="1"
              value={newTask.members}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Jumlah anggota"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {editingTask ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
