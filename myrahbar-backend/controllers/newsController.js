const News = require("../models/News");

/* ─────────────────────────────────────────────
   GET /api/news
   Public: returns active, non-expired items.
   Admin (if you extend with ?admin=true + protect): returns ALL items.
───────────────────────────────────────────── */
const getActiveNews = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (type && ["news", "notification", "announcement"].includes(type)) {
      query.type = type;
    }

    // Filter out expired items
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      News.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      News.countDocuments(query),
    ]);

    res.json(items);
  } catch (err) {
    console.error("[getActiveNews]", err);
    res.status(500).json({ message: "Failed to fetch news." });
  }
};

/* ─────────────────────────────────────────────
   GET /api/news/admin
   Admin: returns ALL items (active + inactive, expired or not).
   Add this route in newsRoutes.js:
     router.get("/admin", protect, adminOnly, getAllNewsAdmin);
───────────────────────────────────────────── */
const getAllNewsAdmin = async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};

    if (type && ["news", "notification", "announcement"].includes(type)) {
      query.type = type;
    }

    if (status === "active") query.isActive = true;
    else if (status === "inactive") query.isActive = false;

    const items = await News.find(query).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error("[getAllNewsAdmin]", err);
    res.status(500).json({ message: "Failed to fetch news." });
  }
};

/* ─────────────────────────────────────────────
   POST /api/news
   Admin only — create new item.
───────────────────────────────────────────── */
const createNews = async (req, res) => {
  try {
    const { title, content, type, priority, isActive, expiresAt, referenceLink } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const news = await News.create({
      title: title.trim(),
      content: content.trim(),
      type: type || "news",
      priority: priority || "medium",
      isActive: isActive !== undefined ? isActive : true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      referenceLink: referenceLink ? referenceLink.trim() : "",
    });

    res.status(201).json(news);
  } catch (err) {
    console.error("[createNews]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to create news item." });
  }
};

/* ─────────────────────────────────────────────
   PUT /api/news/:id
   Admin only — update existing item.
───────────────────────────────────────────── */
const updateNews = async (req, res) => {
  try {
    const { title, content, type, priority, isActive, expiresAt, referenceLink } = req.body;

    // Sanitise: only allow known fields to prevent mass-assignment
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (type !== undefined) updates.type = type;
    if (priority !== undefined) updates.priority = priority;
    if (isActive !== undefined) updates.isActive = isActive;
    if (expiresAt !== undefined)
      updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (referenceLink !== undefined) updates.referenceLink = referenceLink.trim();

    if (updates.title === "" || updates.content === "") {
      return res
        .status(400)
        .json({ message: "Title and content cannot be empty." });
    }

    const news = await News.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return res.status(404).json({ message: "News item not found." });
    }

    res.json(news);
  } catch (err) {
    console.error("[updateNews]", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid news ID." });
    }
    res.status(500).json({ message: "Failed to update news item." });
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/news/:id
   Admin only — permanently remove item.
───────────────────────────────────────────── */
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News item not found." });
    }
    res.json({ message: "News item deleted successfully.", id: req.params.id });
  } catch (err) {
    console.error("[deleteNews]", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid news ID." });
    }
    res.status(500).json({ message: "Failed to delete news item." });
  }
};

module.exports = {
  getActiveNews,
  getAllNewsAdmin,
  createNews,
  updateNews,
  deleteNews,
};
