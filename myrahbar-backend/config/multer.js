const multer = require("multer");
const path = require("path");

// Define storage for excel files
const excelStorage = multer.diskStorage({
  destination: "uploads/excel/",
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const uploadExcel = multer({ 
  storage: excelStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Only Excel files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = { uploadExcel };
