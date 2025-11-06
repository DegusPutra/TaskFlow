import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import dayjs from "dayjs";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  //Ambil data user login dari localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData?.name || userData?.username || "guest";
  const token = localStorage.getItem("token");

  //Helper fetch dengan token otomatis
  const apiFetch = async (url, options = {}) => {
    if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal fetch ${url}: ${res.status} ${errText}`);
    }

    return await res.json();
  };

  //Fetch project dari History Service
  const fetchProjects = async () => {
    try {
      const data = await apiFetch("http://localhost:3001/history");

      const mappedProjects = data.map((h) => {
        const rawDate = h.deadline || h.endDate || h.dueDate || null;
        const formattedDate =
          rawDate && dayjs(rawDate).isValid()
            ? dayjs(rawDate).format("DD MMMM YYYY")
            : "-";

        return {
          id: h._id,
          title: h.name || "Unnamed Project",
          date: formattedDate,
        };
      });

      setProjects(mappedProjects);
    } catch (err) {
      console.error("❌ Error fetch projects:", err.message);
    }
  };

  //Fetch aktivitas terbaru dari Activity Service
  const fetchActivities = async () => {
    try {
      const data = await apiFetch("http://localhost:3001/activity");
      setActivities(data);
    } catch (err) {
      console.error("❌ Error fetch activities:", err.message);
    }
  };

  //Jalankan fetch saat halaman dibuka
  useEffect(() => {
    fetchProjects();
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-8 py-6">
      {/* === SAPAAN PENGGUNA === */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat datang, {username}!
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola proyek dan pantau aktivitasmu di TaskFlow.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          History Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="text-gray-500">Belum ada project.</p>
          ) : (
            projects.map((p) => (
              <ProjectCard key={p.id} title={p.title} date={p.date} />
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Aktivitas Terbaru
        </h2>

        {activities.length === 0 ? (
          <p className="text-gray-500">
            Belum ada aktivitas terbaru untuk akun ini.
          </p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li
                key={a._id || a.id}
                className="bg-white shadow rounded-lg p-4 text-gray-700 border-l-4 border-blue-500 hover:shadow-md transition-all"
              >
                <span className="font-semibold text-blue-700">
                  {a.user || username}
                </span>{" "}
                {a.action}
                <div className="text-sm text-gray-500 mt-1">
                  {dayjs(a.createdAt).format("DD MMMM YYYY, HH:mm")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-20 text-center pt-8 pb-6 text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 shadow-inner">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Tentang TaskFlow
        </h2>
        <p className="text-sm max-w-xl mx-auto mb-4">
          TaskFlow adalah aplikasi manajemen tugas dan proyek sederhana yang membantu kamu
          memantau progres, aktivitas, dan deadline dengan lebih efisien.
        </p>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} TaskFlow. Semua hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}
