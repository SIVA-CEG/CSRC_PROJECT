const multer = require("multer");
const path = require("path");
const fs = require("fs");

const destDir = "uploads/consultancyFirmLetters";
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destDir);
  },

  filename: (req, file, cb) => {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
});

module.exports = upload;