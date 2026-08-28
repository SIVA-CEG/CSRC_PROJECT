const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getMyProjects,
  getFacultyList,
  createTransfer,
  uploadLetter,
  finishLater,
  getSentTransfers,
  getReceivedTransfers,
  facultyAccept,
  facultyReject,
  getTransferDetail,
} = require("../controllers/projectTransferController");

// ── Upload directory ──────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "..", "uploads", "transferLetters");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ── Routes ────────────────────────────────────────────────────────────────────
router.get("/my-projects",   getMyProjects);
router.get("/faculty-list",  getFacultyList);
router.get("/sent",          getSentTransfers);
router.get("/received",      getReceivedTransfers);

router.post("/create",       createTransfer);

router.put("/:id/upload-letter", upload.single("letter"), uploadLetter);
router.put("/:id/finish-later",  finishLater);
router.put("/:id/faculty-accept", facultyAccept);
router.put("/:id/faculty-reject", facultyReject);

// ── /:id MUST be last ─────────────────────────────────────────────────────────
router.get("/:id",           getTransferDetail);

module.exports = router;
