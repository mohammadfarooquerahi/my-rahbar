const express = require("express");
const router = express.Router();
const { getPastPapers, uploadPastPaper, deletePastPaper } = require("../controllers/pastPaperController");
const { protect, adminOnly } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/pastpapers/",
  filename: (req, file, cb) => {
    cb(null, `paper-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get("/", getPastPapers);

// Admin routes
router.post("/upload", protect, adminOnly, upload.single("file"), uploadPastPaper);
router.delete("/:id", protect, adminOnly, deletePastPaper);

module.exports = router;
