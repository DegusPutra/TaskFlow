import Column from "../models/column.js";

// CREATE column
export const createColumn = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, position } = req.body;

    const column = new Column({
      title,
      position,
      projectId,
    });

    await column.save();
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat kolom", error: error.message });
  }
};

// UPDATE column
export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Column.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Kolom tidak ditemukan" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui kolom", error: error.message });
  }
};

// DELETE column
export const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Column.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Kolom tidak ditemukan" });
    res.json({ message: "Kolom berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kolom", error: error.message });
  }
};
