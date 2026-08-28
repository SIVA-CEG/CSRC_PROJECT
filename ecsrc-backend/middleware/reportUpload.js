const multer = require("multer");

const path = require("path");

const fs = require("fs");

const uploadPath = "uploads/endorsements/find-pdfs";

// CREATE FOLDER

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(
    uploadPath,

    {
      recursive: true,
    },
  );
}

const storage = multer.diskStorage({
  // THIS STORES FILE

  destination: (
    req,

    file,

    cb,
  ) => {
    cb(
      null,

      uploadPath,
    );
  },

  // THIS CREATES FILE NAME

  filename: (
    req,

    file,

    cb,
  ) => {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const reportUpload = multer({
  storage,
});

module.exports = reportUpload;
