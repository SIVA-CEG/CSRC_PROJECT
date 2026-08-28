const express = require("express");

const router = express.Router();

const {
  createApproval,
  getApprovals,
  getApprovedProjects,
  getProjectDetails,
} = require("../controllers/approvalController");

router.post("/create", createApproval);
router.get("/all", getApprovals);
router.get("/approved", getApprovedProjects);
router.get("/project-details/:projectId", getProjectDetails);
module.exports = router;
