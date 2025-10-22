export default function ProjectCard({ project, title, members, date, onClick }) {
  // Jika project dikirim dari TaskPlanner
  if (project) {
    return (
      <div
        onClick={onClick}
        className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
      >
        <h2 className="text-xl font-semibold text-blue-700">{project.title}</h2>
        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          <span>📅 Deadline: {project.deadline}</span>
          <span>🕒 Created: {project.createdAt}</span>
        </div>
      </div>
    );
  }

  // Jika project tidak dikirim (dipanggil dari Dashboard)
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
    >
      <h2 className="text-xl font-semibold text-blue-700">{title}</h2>
      <p className="text-gray-600 text-sm mt-1">👥 {members} Members</p>
      <p className="text-gray-500 text-xs mt-2">📅 {date}</p>
    </div>
  );
}
