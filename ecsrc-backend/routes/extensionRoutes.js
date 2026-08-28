const express = require("express");
const router = express.Router();

const {
  getAgencies,
  getProjects,
  submitExtension,
    getPreviousExtensions,
    getDirector,
    getExtensionHistory
} = require("../controllers/extensionController");

router.get("/agencies", getAgencies);

router.get("/projects", getProjects);
router.post("/submit", submitExtension);
router.get("/previous/:project_id", getPreviousExtensions);
router.get("/director", getDirector);
router.get("/history", getExtensionHistory);
module.exports = router;
