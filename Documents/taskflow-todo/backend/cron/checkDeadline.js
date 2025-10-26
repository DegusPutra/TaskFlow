const axios = require("axios");
const Notification = require("../models/Notification");

module.exports = async function checkDeadline() {
  console.log("⏰ Mengecek semua task di semua project (My Projects & OpenProject)...");

  try {
    // Ambil semua project dari TaskPlanner
    const { data: projects } = await axios.get("http://localhost:5005/api/projects");

    const now = new Date();

    for (const project of projects) {
      // Ambil semua task di dalam project ini
      const { data: tasks } = await axios.get(`http://localhost:5005/api/projects/${project._id}/tasks`);

      for (const task of tasks) {
        if (!task.deadline) continue;
        const deadline = new Date(task.deadline);

        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        // Kondisi deadline
        let message = null;

        if (diffDays < 0) {
          message = `⚠️ Task "${task.title}" dari project "${project.name}" sudah melewati deadline!`;
        } else if ([3, 2, 1].includes(diffDays)) {
          message = `⏰ Task "${task.title}" dari project "${project.name}" tinggal ${diffDays} hari lagi sebelum deadline.`;
        } else if (diffDays === 0) {
          message = `🚨 Task "${task.title}" dari project "${project.name}" deadline-nya hari ini!`;
        }

        if (message) {
          const existingNotif = await Notification.findOne({
            "metadata.taskId": task._id,
            "metadata.projectId": project._id,
            type: "deadline",
          });

          if (!existingNotif) {
            await Notification.create({
              message,
              type: "deadline",
              metadata: {
                taskId: task._id,
                projectId: project._id,
                deadline,
              },
            });
            console.log(`✅ Notifikasi dibuat: ${message}`);
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ Gagal mengambil data dari TaskPlanner:", err.message);
  }
};
