const HeroStudent = require("../models/HeroStudent");

const DEFAULT_HERO_STUDENTS = [
  {
    name: "Ammar K.",
    tag: "NUST",
    subtitle: "BS CS • NUST",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    color: "blue",
    order: 1,
    isActive: true,
  },
  {
    name: "Zainab F.",
    tag: "DOW",
    subtitle: "MBBS • DUHS",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    color: "emerald",
    order: 2,
    isActive: true,
  },
  {
    name: "Bilal T.",
    tag: "FAST",
    subtitle: "Software Engg",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    color: "purple",
    order: 3,
    isActive: true,
  },
  {
    name: "Hamza S.",
    tag: "NED",
    subtitle: "Mechanical Engg",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    color: "rose",
    order: 4,
    isActive: true,
  },
  {
    name: "Hania M.",
    tag: "IBA",
    subtitle: "BBA • IBA Karachi",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    color: "amber",
    order: 5,
    isActive: true,
  },
  {
    name: "Sara R.",
    tag: "UoK",
    subtitle: "Pharm-D • Karachi Uni",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    color: "sky",
    order: 6,
    isActive: true,
  },
];

// GET /api/hero-students (Public)
const getPublicHeroStudents = async (req, res) => {
  try {
    let students = await HeroStudent.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    
    // Seed automatically if empty
    if (!students || students.length === 0) {
      await HeroStudent.insertMany(DEFAULT_HERO_STUDENTS);
      students = await HeroStudent.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    }

    res.json({ success: true, count: students.length, students });
  } catch (err) {
    console.error("[getPublicHeroStudents] Error:", err.message);
    // Graceful fallback to static array if DB is connecting
    res.json({ success: true, count: DEFAULT_HERO_STUDENTS.length, students: DEFAULT_HERO_STUDENTS });
  }
};

// GET /api/admin/hero-students (Admin)
const getAdminHeroStudents = async (req, res) => {
  try {
    let students = await HeroStudent.find().sort({ order: 1, createdAt: 1 });
    if (!students || students.length === 0) {
      await HeroStudent.insertMany(DEFAULT_HERO_STUDENTS);
      students = await HeroStudent.find().sort({ order: 1, createdAt: 1 });
    }
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/hero-students (Admin)
const createHeroStudent = async (req, res) => {
  try {
    const { name, tag, subtitle, color, order, isActive } = req.body;
    let imageUrl = (req.body.imageUrl || "").trim();

    // If file was uploaded via multer
    if (req.file) {
      imageUrl = `/uploads/hero/${req.file.filename}`;
    }

    if (!name || !tag || !subtitle) {
      return res.status(400).json({ success: false, error: "Name, tag, and subtitle are required." });
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: "Image URL or image upload is required." });
    }

    const newStudent = await HeroStudent.create({
      name,
      tag,
      subtitle,
      imageUrl,
      color: color || "blue",
      order: Number(order) || 0,
      isActive: isActive !== false && isActive !== "false",
    });

    res.status(201).json({ success: true, student: newStudent });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/admin/hero-students/:id (Admin)
const updateHeroStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag, subtitle, color, order, isActive } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/hero/${req.file.filename}`;
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (tag) updateData.tag = tag.trim();
    if (subtitle) updateData.subtitle = subtitle.trim();
    if (imageUrl) updateData.imageUrl = imageUrl.trim();
    if (color) updateData.color = color;
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = isActive === true || isActive === "true";

    const updated = await HeroStudent.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: "Hero student not found" });
    }

    res.json({ success: true, student: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/admin/hero-students/:id (Admin)
const deleteHeroStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await HeroStudent.findByIdAndDelete(id);
    res.json({ success: true, message: "Hero student deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/hero-students/reset (Admin)
const resetDefaultHeroStudents = async (req, res) => {
  try {
    await HeroStudent.deleteMany({});
    const students = await HeroStudent.insertMany(DEFAULT_HERO_STUDENTS);
    res.json({ success: true, message: "Reset to default students.", students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  DEFAULT_HERO_STUDENTS,
  getPublicHeroStudents,
  getAdminHeroStudents,
  createHeroStudent,
  updateHeroStudent,
  deleteHeroStudent,
  resetDefaultHeroStudents,
};
