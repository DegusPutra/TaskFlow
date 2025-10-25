import axios from "axios";

// 🔹 Untuk Auth (register / login)
export const apiAuth = axios.create({
  baseURL: "http://localhost:5050/api",
});

// 🔹 Untuk TaskPlanner utama (project, team, dsb)
export const apiTask = axios.create({
  baseURL: "http://localhost:5005/api",
});

// 🔹 Untuk ToDoList & Notifikasi (port 5010)
export const apiTodo = axios.create({
  baseURL: "http://localhost:5010/api",
});

// 🛡️ Tambahkan token jika ada (khusus untuk taskplanner)
apiTask.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
