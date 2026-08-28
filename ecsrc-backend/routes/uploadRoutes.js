const express = require("express");
const router = express.Router();

const upload = require("../middleware/sanctionLetterUpload");

router.post("/sanction-letter", upload.single("file"), (req, res) => {
  res.json({
    filePath: req.file.path,
  });
});

module.exports = router;
