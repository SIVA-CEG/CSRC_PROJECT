const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "generated_reports/sanction_reports");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("report"), (req, res) => {
  res.json({
    path: req.file.path,
  });
});

module.exports = router;
