import Activity from "../models/activity.js";

export const createActivity = async (req, res) => {
  try {
    const { user, action, projectId } = req.body;

    const activity = new Activity({ user, action, projectId });
    await activity.save();

    res.status(201).json({ message: "Activity logged" });
  } catch (err) {
    console.error("❌ Error createActivity:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    res.json(activities);
  } catch (err) {
    console.error("❌ Error getRecentActivities:", err);
    res.status(500).json({ error: err.message });
  }
};
