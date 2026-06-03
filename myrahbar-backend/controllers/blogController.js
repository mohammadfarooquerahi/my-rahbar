const Blog = require("../models/Blog");
const slugify = require("slugify");

// GET /api/blogs
const getBlogs = async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  const query = { status: "published" };

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const blogs = await Blog.find(query)
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Blog.countDocuments(query);

  res.json({
    blogs,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
};

// GET /api/blogs/:slug
const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: "published" }).populate("author", "name");
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  // Increment view count
  blog.views += 1;
  await blog.save({ validateBeforeSave: false });

  res.json(blog);
};

// POST /api/blogs (Admin only)
const createBlog = async (req, res) => {
  const { title, content, excerpt, category, tags, status } = req.body;
  const featuredImage = req.file ? `/uploads/blogs/${req.file.filename}` : undefined;

  if (!title || !content || !category) {
    return res.status(400).json({ message: "Title, content and category are required." });
  }

  const slug = slugify(title, { lower: true, strict: true });
  
  // Check for duplicate slug
  const existing = await Blog.findOne({ slug });
  if (existing) {
    return res.status(400).json({ message: "A blog with a similar title already exists." });
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    excerpt: excerpt || content.substring(0, 150) + "...",
    category,
    tags: tags ? tags.split(",").map(t => t.trim()) : [],
    status,
    author: req.user._id,
    featuredImage,
  });

  res.status(201).json(blog);
};

// PUT /api/blogs/:id (Admin only)
const updateBlog = async (req, res) => {
  const { title, content, excerpt, category, tags, status } = req.body;
  
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (title) {
    blog.title = title;
    blog.slug = slugify(title, { lower: true, strict: true });
  }
  if (content) blog.content = content;
  if (excerpt) blog.excerpt = excerpt;
  if (category) blog.category = category;
  if (tags) blog.tags = typeof tags === 'string' ? tags.split(",").map(t => t.trim()) : tags;
  if (status) blog.status = status;
  if (req.file) blog.featuredImage = `/uploads/blogs/${req.file.filename}`;

  await blog.save();
  res.json(blog);
};

// DELETE /api/blogs/:id (Admin only)
const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.json({ message: "Blog deleted successfully" });
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
