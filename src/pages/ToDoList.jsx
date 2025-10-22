import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { IoAddCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ToDoList() {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const [showForm, setShowForm] = useState(false);

  // tambah tugas baru
  const addTask = () => {
    if (!newTask.trim() || !newDeadline.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newTask,
      description: newDescription,
      deadline: newDeadline,
      done: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
    setNewDescription("");
    setNewDeadline("");
    setShowForm(false);
  };

  // hapus tugas
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // mulai edit
  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.text);
    setEditDescription(task.description);
    setEditDeadline(task.deadline);
  };

  // simpan hasil edit
  const saveEdit = () => {
    setTasks(
      tasks.map((t) =>
        t.id === editTaskId
          ? {
              ...t,
              text: editText,
              description: editDescription,
              deadline: editDeadline,
            }
          : t
      )
    );
    setEditTaskId(null);
    setEditText("");
    setEditDescription("");
    setEditDeadline("");
  };

  // tandai selesai
  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
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
              key={task.id}
              className={`flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm transition ${
                task.done ? "bg-green-100" : "bg-gray-50"
              }`}
            >
              {editTaskId === task.id ? (
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
                    type="date"
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
                      onChange={() => toggleDone(task.id)}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {task.text}
                      </h2>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Deadline:{" "}
                        <span className="font-medium">{task.deadline}</span>
                      </p>
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
                      onClick={() => deleteTask(task.id)}
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
              type="date"
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
