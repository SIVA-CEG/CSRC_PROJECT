const multer = require("multer");

const path = require("path");

const fs = require("fs");

// ABSOLUTE UPLOAD PATH
const uploadPath = path.join(__dirname, "..", "uploads", "endorsements");

// CREATE FOLDER IF NOT EXISTS
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const endorsementUpload = multer({
  storage,
});

module.exports = endorsementUpload;
