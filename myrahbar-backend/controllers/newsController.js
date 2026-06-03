const News = require("../models/News");

// GET /api/news
const getActiveNews = async (req, res) => {
  const { type } = req.query;
  const query = { isActive: true };
  
  if (type) query.type = type;

  // Filter out expired news
  query.$or = [
    { expiresAt: { $exists: false } },
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } }
  ];

  const newsItems = await News.find(query).sort({ createdAt: -1 });
  res.json(newsItems);
};

// POST /api/news (Admin only)
const createNews = async (req, res) => {
  const { title, content, type, priority, isActive, expiresAt } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const news = await News.create({
    title,
    content,
    type,
    priority,
    isActive: isActive !== undefined ? isActive : true,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  });

  res.status(201).json(news);
};

// PUT /api/news/:id (Admin only)
const updateNews = async (req, res) => {
  const updates = req.body;
  if (updates.expiresAt) {
    updates.expiresAt = new Date(updates.expiresAt);
  }

  const news = await News.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!news) {
    return res.status(404).json({ message: "News not found." });
  }

  res.json(news);
};

// DELETE /api/news/:id (Admin only)
const deleteNews = async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id);
  if (!news) {
    return res.status(404).json({ message: "News not found." });
  }
  res.json({ message: "News deleted successfully." });
};

module.exports = { getActiveNews, createNews, updateNews, deleteNews };
