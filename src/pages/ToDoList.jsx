import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { IoAddCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiTodo } from "../api/axios";

export default function ToDoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [showForm, setShowForm] = useState(false);

  // ✅ Ambil semua task dari backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiTodo.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Gagal ambil data task:", err);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Tambah tugas baru
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const newItem = {
        title: newTask,
        description: newDescription,
        deadline: newDeadline || null,
        done: false,
      };
      const res = await apiTodo.post("/tasks", newItem);
      setTasks([...tasks, res.data]);
      setNewTask("");
      setNewDescription("");
      setNewDeadline("");
      setShowForm(false);
    } catch (err) {
      console.error("Gagal menambah task:", err);
    }
  };

  // ✅ Hapus tugas
  const deleteTask = async (id) => {
    try {
      await apiTodo.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Gagal hapus task:", err);
    }
  };

  // ✅ Mulai edit
  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditText(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(task.deadline ? task.deadline.slice(0, 16) : "");
  };

  // ✅ Simpan hasil edit
  const saveEdit = async () => {
    try {
      const updatedTask = {
        title: editText,
        description: editDescription,
        deadline: editDeadline || null,
      };
      const res = await apiTodo.put(`/tasks/${editTaskId}`, updatedTask);
      setTasks(tasks.map((t) => (t._id === editTaskId ? res.data : t)));
      setEditTaskId(null);
      setEditText("");
      setEditDescription("");
      setEditDeadline("");
    } catch (err) {
      console.error("Gagal update task:", err);
    }
  };

  // ✅ Ubah status selesai (done)
  const toggleDone = async (task) => {
    try {
      const res = await apiTodo.put(`/tasks/${task._id}`, {
        ...task,
        done: !task.done,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Gagal update status done:", err);
    }
  };

  // ✅ Format tanggal deadline agar mudah dibaca
  const formatDeadline = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 relative">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Tombol kembali */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
          >
            <FiArrowLeft size={20} />
            <span className="font-medium">Kembali</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Catatan To-Do List
        </h1>

        {/* Daftar tugas */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm transition bg-gray-50 ${
                task.done ? "opacity-70" : ""
              }`}
            >
              {editTaskId === task._id ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="datetime-local"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditTaskId(null)}
                      className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleDone(task)}
                      className="mt-1 w-5 h-5 accent-green-600"
                    />
                    <div>
                      <h2
                        className={`text-lg font-semibold ${
                          task.done
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h2>
                      {task.description && (
                        <p
                          className={`text-sm mt-1 ${
                            task.done ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      {task.deadline && (
                        <p className="text-xs text-red-500 mt-2">
                          Deadline: {formatDeadline(task.deadline)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-gray-500 text-center">Belum ada catatan.</p>
          )}
        </div>
      </div>

      {/* Tombol tambah catatan melayang */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition p-3"
      >
        <IoAddCircle size={40} />
      </button>

      {/* Popup tambah catatan */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Tambah Catatan Baru
            </h2>

            <input
              type="text"
              placeholder="Judul tugas..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Deskripsi tugas..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="datetime-local"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Batal
              </button>
              <button
                onClick={addTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
