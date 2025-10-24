import axios from "axios";

// Untuk Auth (register/login)
export const apiAuth = axios.create({
  baseURL: "http://localhost:5050/api",
});

// Untuk TaskPlanner (project, todo, dsb)
export const apiTask = axios.create({
  baseURL: "http://localhost:5005/api",
});

// Tambahkan token ke setiap request taskplanner
apiTask.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jangan export default (supaya named import tetap konsisten)
