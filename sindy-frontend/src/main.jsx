import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { UserProvider } from "./UserContext";
import { NotificationProvider } from "./context/NotificationContext";

// 🧩 Komponen halaman
import Dashboard from "./pages/Dashboard.jsx";
import OpenProject from "./pages/OpenProject.jsx";
import TaskPlanner from "./pages/TaskPlanner.jsx";
import ToDoList from "./pages/ToDoList.jsx";
import Notifications from "./pages/Notifications.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// 🧭 Navbar global
import Navbar from "./components/Navbar.jsx";

/* -------------------- 🔒 Proteksi Halaman (Private Route) -------------------- */
function PrivateRoute({ children }) {
  const user = localStorage.getItem("userData");
  return user ? children : <Navigate to="/login" replace />;
}

/* -------------------- 🌐 Router Utama Aplikasi -------------------- */
function AppRouter() {
  const location = useLocation();

  // Navbar hanya tampil di luar halaman login & register
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* 🔐 Halaman Autentikasi */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 👤 Profil */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* 📊 Halaman Aplikasi */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/taskplanner"
          element={
            <PrivateRoute>
              <TaskPlanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/open-project/:id"
          element={
            <PrivateRoute>
              <OpenProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/todolist"
          element={
            <PrivateRoute>
              <ToDoList />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

        {/* 🧭 Fallback jika route tidak ditemukan */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

/* -------------------- 🧠 Render Root -------------------- */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* 🔽 Context Global (tidak ubah tampilan, hanya logika) */}
      <UserProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
