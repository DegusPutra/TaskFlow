import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // === Simulasi data dummy (bisa diganti backend nanti) ===
    const dummyProjects = [
      {
        id: 1,
        title: "Capstone",
        members: 40,
        date: "30 Januari 2025",
        progress: 100, // 0 = belum mulai, 50 = in progress, 100 = done
      },
      {
        id: 2,
        title: "Microservice",
        members: 35,
        date: "25 Maret 2025",
        progress: 45,
      },
      {
        id: 3,
        title: "Frontend Design",
        members: 20,
        date: "10 April 2025",
        progress: 0,
      },
    ];

    const dummyActivities = [
      { id: 1, user: "Sintya", action: "menambahkan task baru pada proyek Capstone" },
      { id: 2, user: "Dina", action: "memperbarui status proyek Microservice menjadi In Progress" },
      { id: 3, user: "Rizky", action: "menghapus task 'UI Revision' dari proyek Frontend Design" },
    ];

    // Simpan ke state
    setProjects(dummyProjects);
    setActivities(dummyActivities);
  }, []);

  // === Fungsi untuk menentukan warna progress bar ===
  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* === Bagian History Project === */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">History Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} title={p.title} members={p.members} date={p.date} />
          ))}
        </div>
      </section>

      {/* === Bagian Progress Project === */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Progres Project</h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">{p.title}</span>
                <span className="text-sm text-gray-500">{p.progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(p.progress)} transition-all duration-500`}
                  style={{ width: `${p.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Bagian Aktivitas Terbaru === */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Aktivitas Terbaru</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">Belum ada aktivitas terbaru.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li
                key={a.id}
                className="bg-white shadow rounded-lg p-4 text-gray-700 border-l-4 border-blue-500"
              >
                <span className="font-semibold">{a.user}</span> {a.action}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
