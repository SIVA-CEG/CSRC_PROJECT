const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir("uploads/appointmentMinutes");
ensureDir("uploads/appraisals");
ensureDir("uploads/extensionDocs");
ensureDir("uploads/extensionRequestLetters");

const makeStorage = (dest) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });

const uploadMinutes = multer({
  storage: makeStorage("uploads/appointmentMinutes"),
});
const uploadAppraisal = multer({ storage: makeStorage("uploads/appraisals") });
const uploadExtDocs = multer({ storage: makeStorage("uploads/extensionDocs") });
const uploadApptDocs = multer({
  storage: makeStorage("uploads/appointmentMinutes"),
});
const uploadExtensionFiles = multer({
  storage: makeStorage("uploads/extensionRequestLetters"),
});

const {
  createProjectStaff,
  updateProjectStaff,
  deleteProjectStaff,
  getProjectStaff,
  saveAppointment,
  getPendingAppointments,
  getAppointmentReportData,
  uploadAppointmentDocs,
  createExtension,
  getPendingExtensions,
  uploadExtensionDocs,
  getExtensionReportData,
  getEligibleExtensionProjects,
  createProjectExtension,
  getProjectExtensionHistory,
} = require("../controllers/projectStaffController");

// ── Staff CRUD ────────────────────────────────────────────
router.post("/create", createProjectStaff);
router.put("/:id", updateProjectStaff); // ← NEW
router.delete("/:id", deleteProjectStaff); // ← NEW
router.get("/project/:projectId", getProjectStaff);

// ── Appointments ──────────────────────────────────────────
router.post(
  "/appointment",
  uploadMinutes.single("minutesFile"),
  saveAppointment,
);
router.get("/pending-appointments", getPendingAppointments);
router.get("/appointment-report/:staffId", getAppointmentReportData);
router.post(
  "/upload-docs",
  uploadApptDocs.fields([
    { name: "appointment_letter", maxCount: 1 },
    { name: "joining_letter", maxCount: 1 },
  ]),
  uploadAppointmentDocs,
);

// ── Staff Extensions ──────────────────────────────────────
router.post(
  "/extension/create",
  uploadAppraisal.single("appraisalFile"),
  createExtension,
);
router.get("/pending-extensions", getPendingExtensions);
router.post(
  "/extension/upload-docs",
  uploadExtDocs.fields([
    { name: "extension_letter", maxCount: 1 },
    { name: "rejoining_letter", maxCount: 1 },
  ]),
  uploadExtensionDocs,
);
router.get("/extension-report/:extensionId", getExtensionReportData);

// ── Project Extensions ────────────────────────────────────
router.get("/eligible-extension-projects", getEligibleExtensionProjects);
router.post(
  "/project-extension/create",
  uploadExtensionFiles.fields([
    { name: "requestLetter", maxCount: 1 },
    { name: "generatedReport", maxCount: 1 },
  ]),
  createProjectExtension,
);
router.get("/project-extension/history", getProjectExtensionHistory);

module.exports = router;
