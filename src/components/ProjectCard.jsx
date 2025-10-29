export default function ProjectCard({ project, title, members, date, onClick }) {
  // Fungsi bantu format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "Tidak ada deadline";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  // ✅ Jika project dikirim dari TaskPlanner
  if (project) {
    return (
      <div
        onClick={onClick}
        className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
      >
        <h2 className="text-xl font-semibold text-blue-700">{project.title}</h2>
        <p className="text-gray-600 text-sm mt-1">{project.description}</p>

        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          📅 Deadline:{" "}
          <span className="font-medium">
            {proj.deadline
              ? new Date(proj.deadline).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Belum ditentukan"}
          </span>
          <span>🕒 Created: {formatDate(project.createdAt)}</span>
        </div>
      </div>
    );
  }

  // ✅ Jika project tidak dikirim (dipanggil dari Dashboard)
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
    >
      <h2 className="text-xl font-semibold text-blue-700">{title}</h2>
      {/* <p className="text-gray-600 text-sm mt-1">👥 {members} Members</p> */}
      <p className="text-gray-500 text-xs mt-2">📅 {formatDate(date)}</p>
    </div>
  );
}
