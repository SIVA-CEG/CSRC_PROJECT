const express = require("express");

const router = express.Router();
const endorsementUpload = require("../middleware/endorsementUpload");

const { saveGeneratedReport } = require("../controllers/reportPdfController");
const {
  getEndorsements,

  createEndorsement,
} = require("../controllers/endorsementcontroller");

router.get(
  "/:userId",

  getEndorsements,
);

router.post(
  "/create",

  endorsementUpload.fields([
    {
      name: "proposal_copy",
      maxCount: 1,
    },
    {
      name: "signed_writeup",
      maxCount: 1,
    },
    {
      name: "signed_budget",
      maxCount: 1,
    },
    {
      name: "endorsement_format_file",
      maxCount: 1,
    },
    {
      name: "overhead_exemption_file",
      maxCount: 1,
    },
    {
      name: "report_pdf",
      maxCount: 1,
    },
  ]),

  createEndorsement,
);
router.post(
  "/save-report",

  endorsementUpload.fields([
    {
      name: "report_pdf",
      maxCount: 1,
    },
  ]),

  saveGeneratedReport,
);
module.exports = router;
