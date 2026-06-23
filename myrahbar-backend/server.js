require("dotenv/config");
const Groq = require("groq-sdk");
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");

// Config aur Utils Imports
const connectDB = require("./config/db.js");
const startAlertCron = require("./utils/alertCron.js");

// Route files Imports
const authRoutes = require("./routes/auth.js");
const universityRoutes = require("./routes/universities.js");
const meritRoutes = require("./routes/merit.js");
const watchlistRoutes = require("./routes/watchlist.js");
const consultRoutes = require("./routes/consult.js");
const alertRoutes = require("./routes/alerts.js");
const adminRoutes = require("./routes/admin.js");
const aiRoutes = require("./routes/ai.js");
const blogRoutes = require("./routes/blogs.js");
const pastPaperRoutes = require("./routes/pastpapers.js");
const newsRoutes = require("./routes/news.js");
const aiCollectRoutes = require("./routes/aiCollect"); // 🌟 imported properly
const sitemapRoutes = require("./routes/sitemap.js");

// Middleware Imports
const errorTracker = require("./middleware/errorTracker.js");
const cookieTracker = require("./middleware/cookieTracker.js");

const app = express();

// Connect to MongoDB
connectDB();
startAlertCron();

// Security headers
app.use(helmet());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Response Compression
app.use(compression());

// CORS — allow frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rahbars.com",
      "https://www.rahbars.com",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

// Body parser
app.use(express.json());
app.use(cookieParser());
app.use(cookieTracker);

// Static file serving for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Serve uploaded files as static (Cleaned duplicate require)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting — 100 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Please slow down." },
});
app.use("/api", limiter);

// -------------------------
// ROUTES CONFIGURATION
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/merit", meritRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/consult", consultRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/pastpapers", pastPaperRoutes);
app.use("/api/news", newsRoutes);

// 🌟 FIXED: Changed base path from "/api/ai" to "/api/ai-collect" to avoid conflict
app.use("/api/ai-collect", aiCollectRoutes);

app.use("/api/sitemap.xml", sitemapRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MyRahbar API is running" });
});

// Global error handler
app.use(errorTracker);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("MyRahbar backend running on port " + PORT);
});
