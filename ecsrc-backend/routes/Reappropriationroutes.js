const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  getAgencies,
  getProjects,
  getInstallments,
  getBudgetHeads,
  submitReappropriation,
  saveReport,
  getList,
  getDetail,
  getPreviousInstallments,
  getDirector,
  getInstallmentTotal,
} = require("../controllers/reappropriationController");

// Ensure upload directory exists
const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "reappropriationReports",
);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Project data cascade
router.get("/agencies", getAgencies);
router.get("/projects", getProjects);
router.get("/installments/:project_id", getInstallments);
router.get("/heads/:project_id/:installment_id", getBudgetHeads);

// CRUD
router.post("/submit", submitReappropriation);
router.post("/save-report/:id", upload.single("report_pdf"), saveReport);
router.get("/list", getList);
router.get("/detail/:id", getDetail);
router.get(
  "/previous-installments/:project_id/:current_installment_id",
  getPreviousInstallments,
);
router.get("/director", getDirector);
router.get(
  "/installment-total/:project_id/:installment_id",
  getInstallmentTotal,
);
module.exports = router;
