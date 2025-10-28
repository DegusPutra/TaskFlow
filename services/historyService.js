import History from "../models/history.js";

export const getProjectHistoryService = async (userId) => {
  if (!userId) throw new Error("User ID tidak ditemukan");

  const histories = await History.find({ createdBy: userId })
    .sort({ createdAt: -1 });

  // Mapping supaya mirip project response
  const mapped = histories.map(h => ({
    id: h._id,
    title: h.name,
    description: h.description,
    deadline: h.deadline,
    date: h.deadline ? new Date(h.deadline).toLocaleDateString("id-ID") : "-",
    members: 0,       // opsional, bisa ditambah kalau ada
    progress: 0,      // opsional
    projectId: h.projectId,
    type: h.type || "project", // untuk membedakan project/task
    createdAt: h.createdAt,
  }));

  return mapped;
};
