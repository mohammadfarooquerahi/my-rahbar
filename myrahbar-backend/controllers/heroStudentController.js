const HeroStudent = require("../models/HeroStudent");

const DEFAULT_HERO_STUDENTS = [
  {
    name: "Sudheer Mantharani",
    tag: "FAST",
    subtitle: "BS Computer Science",
    imageUrl: "/hero/sudheer-mantharani.png",
    color: "emerald",
    order: 1,
    isActive: true,
  },
  {
    name: "Muzammil Ahmed",
    tag: "UET Taxila",
    subtitle: "BS Mechanical Engineering",
    imageUrl: "/hero/muzammil-ahmed.jpg",
    color: "rose",
    order: 2,
    isActive: true,
  },
  {
    name: "Muhammad Abdullah",
    tag: "LUMS",
    subtitle: "BSc Accounting & Finance",
    imageUrl: "/hero/muhammad-abdullah.jpg",
    color: "amber",
    order: 3,
    isActive: true,
  },
  {
    name: "Aleena Zia",
    tag: "NUST",
    subtitle: "BS Computer Engineering",
    imageUrl: "/hero/aleena-zia.png",
    color: "purple",
    order: 4,
    isActive: true,
  },
  {
    name: "Faizan Ahmed",
    tag: "NED",
    subtitle: "BE Civil Engineering",
    imageUrl: "/hero/faizan-ahmed.png",
    color: "blue",
    order: 5,
    isActive: true,
  },
  {
    name: "Abdullah Aamir",
    tag: "NUST",
    subtitle: "BS Artificial Intelligence",
    imageUrl: "/hero/abdullah-aamir.jpg",
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

    if (req.file) {
      if (!imageUrl || !imageUrl.startsWith("data:image/")) {
        imageUrl = `/uploads/hero/${req.file.filename}`;
      }
    }

    if (!name || !tag || !subtitle) {
      return res.status(400).json({ success: false, error: "Name, tag, and subtitle are required." });
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: "Image URL or photo is required." });
    }

    const newStudent = await HeroStudent.create({
      name: name.trim(),
      tag: tag.trim(),
      subtitle: subtitle.trim(),
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
      if (!imageUrl || !imageUrl.startsWith("data:image/")) {
        imageUrl = `/uploads/hero/${req.file.filename}`;
      }
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
