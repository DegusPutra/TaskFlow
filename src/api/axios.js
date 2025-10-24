import axios from "axios";

const apiAuth = axios.create({
  baseURL: "http://localhost:5050/api",
});

const apiTask = axios.create({
  baseURL: "http://localhost:5005/api",
});

apiTask.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiAuth;

export { apiAuth, apiTask };
