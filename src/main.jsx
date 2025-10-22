import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

// Komponen halaman
import Dashboard from "./pages/Dashboard.jsx";
import OpenProject from "./pages/OpenProject.jsx";
import TaskPlanner from "./pages/TaskPlanner.jsx";
import ToDoList from "./pages/ToDoList.jsx";
import Notifications from "./pages/Notifications.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrasiPage from "./pages/RegistrasiPage.jsx";
import ProfilPage from "./pages/ProfilPage.jsx";

// Navbar global
import Navbar from "./components/Navbar.jsx";

function AppRouter() {
  const location = useLocation();

  // Navbar hanya tampil kalau bukan login/register
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* 🔐 Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrasiPage />} />

        {/* 👤 Profil */}
        <Route path="/profile" element={<ProfilPage />} />

        {/* 📊 App Routes */}
        <Route path="/" element={<LoginPage />} /> {/* 👈 Default ke login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/taskplanner" element={<TaskPlanner />} />
        <Route path="/open-project/:id" element={<OpenProject />} />
        <Route path="/todolist" element={<ToDoList />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>
);
