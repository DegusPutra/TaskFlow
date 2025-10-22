import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const projects = [
    { title: "Capstone", members: 40, date: "30 Januari 2025" },
    { title: "Microservice", members: 35, date: "25 Maret 2025" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={i} title={p.title} members={p.members} date={p.date} />
        ))}
      </div>
    </div>
  );
}
