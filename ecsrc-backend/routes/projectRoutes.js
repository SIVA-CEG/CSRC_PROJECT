const express = require("express");

const router = express.Router();

const {
  getFacultyEndorsements,
  createProject,
  updateSanctionCost,
  getNextInstallment,
  getProjectByEndorsement,
  getZBAProjects,
  getProjectsEligibleForStaff,
  getEligibleReappropriationProjects,
  getInstallmentDistribution,
} = require("../controllers/projectController");

// GET ENDORSEMENTS
router.get("/endorsements", getFacultyEndorsements);

// CREATE PROJECT
router.post("/create", createProject);
router.put("/:id/sanction-cost", updateSanctionCost);
router.get("/next-installment/:projectId", getNextInstallment);
router.get(
  "/by-endorsement/:endorsementId",
  getProjectByEndorsement,
);
router.get("/zba-projects", getZBAProjects);
router.get("/eligible-staff-projects", getProjectsEligibleForStaff);
router.get(
  "/eligible-reappropriation-projects",
  getEligibleReappropriationProjects,
);
router.get(
  "/installment-distribution/:projectId/:installment",
  getInstallmentDistribution,
);
module.exports = router;
