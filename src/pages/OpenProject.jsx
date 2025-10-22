// src/pages/OpenProject.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function OpenProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const projectFromState = location.state?.project || null;

  const [project, setProject] = useState(projectFromState || { id, name: "Project", description: "" });
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });

  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    members: "",
  });

  useEffect(() => {
    if (projectFromState) setProject(projectFromState);
  }, [projectFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    if (!newTask.title || !newTask.deadline || !newTask.members) {
      return alert("Isi semua kolom sebelum menyimpan!");
    }

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      deadline: newTask.deadline,
      members: newTask.members,
    };

    setTasks((prev) => ({ ...prev, todo: [...prev.todo, task] }));
    setNewTask({ title: "", deadline: "", members: "" });
    setShowForm(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const item = tasks[sourceCol][source.index];

    const newSource = Array.from(tasks[sourceCol]);
    newSource.splice(source.index, 1);

    const newDest = Array.from(tasks[destCol]);
    newDest.splice(destination.index, 0, item);

    setTasks((prev) => ({ ...prev, [sourceCol]: newSource, [destCol]: newDest }));
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-red-100" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white relative">
      {/* Header */}
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              const link = `${window.location.origin}/share/${project.id}?role=viewer`;
              navigator.clipboard.writeText(link);
              alert(`Link Viewer disalin:\n${link}`);
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Share Viewer
          </button>
          <button
            onClick={() => {
              const link = `${window.location.origin}/share/${project.id}?role=editor`;
              navigator.clipboard.writeText(link);
              alert(`Link Editor disalin:\n${link}`);
            }}
            className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
          >
            Share Editor
          </button>
        </div>
      </div>

      {/* Drag and Drop Columns */}
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
                  <h3 className="font-semibold mb-3 text-lg text-gray-800">{col.title}</h3>
                  {tasks[col.id].map((t, idx) => (
                    <Draggable draggableId={t.id} index={idx} key={t.id}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="bg-white p-3 rounded-lg mb-3 shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                          <div className="font-medium text-gray-800">{t.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Deadline: {t.deadline}
                          </div>
                          <div className="text-xs text-gray-500">
                            👥 Members: {t.members}
                          </div>
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

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold px-6 py-4 rounded-full shadow-lg transition-all"
      >
        +
      </button>

      {/* Modal Add Task */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Add New Task
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

            <label className="text-sm font-medium text-gray-700">Jumlah Anggota</label>
            <input
              name="members"
              type="number"
              value={newTask.members}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Misal: 3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
