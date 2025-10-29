import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import dayjs from "dayjs";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  // === Ambil data user login dari localStorage ===
  const username = localStorage.getItem("username") || "guest";
  const token = localStorage.getItem("token");

  // === Helper fetch dengan token otomatis ===
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

  // === Fetch project dari History Service ===
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

  // === Fetch aktivitas terbaru dari Activity Service ===
  const fetchActivities = async () => {
    try {
      const data = await apiFetch("http://localhost:3001/activity");

      console.log("📦 Data activities dari backend:", data);
      console.log("👤 Username login:", username);

      // ⚠️ Jika tidak yakin nama user di DB sama dengan username localStorage,
      // tampilkan semua data dulu biar kelihatan hasilnya
      setActivities(data);

      // 🔹 Kalau nanti sudah yakin user di DB == username di localStorage, aktifkan filter ini:
      /*
      const filteredActivities = data.filter(
        (a) => a.user && a.user.toLowerCase() === username.toLowerCase()
      );
      setActivities(filteredActivities);
      */
    } catch (err) {
      console.error("❌ Error fetch activities:", err.message);
    }
  };

  // === Jalankan fetch saat halaman dibuka ===
  useEffect(() => {
    fetchProjects();
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* === HISTORY PROJECT === */}
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

      {/* === AKTIVITAS TERBARU === */}
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
                className="bg-white shadow rounded-lg p-4 text-gray-700 border-l-4 border-blue-500"
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
    </div>
  );
}
