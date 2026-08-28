const fs = require("fs");

const path = require("path");

const pool = require("../db/db");

const saveGeneratedReport = async (req, res) => {
  try {
    const endorsementId = req.body.endorsementId;
    console.log("ENDORSEMENT ID:");
    console.log(endorsementId);
    const reportFile = req.files?.report_pdf?.[0];
    console.log("========== REPORT DEBUG ==========");

    console.log("REQ BODY:");
    console.log(req.body);

    console.log("REQ FILES:");
    console.log(req.files);

    console.log("REPORT FILE:");
    console.log(reportFile);

    console.log("==================================");
    if (!reportFile) {
      return res.status(400).json({
        message: "No report PDF uploaded",
      });
    }

    const reportFileName = `ENDORSEMENT-${endorsementId}-REPORT.pdf`;

    const finalPath = path.join(
      __dirname,
      "..",
      "uploads",
      "final-pdfs",
      reportFileName,
    );

    fs.copyFileSync(reportFile.path, finalPath);
    const dbPath =
  `/uploads/final-pdfs/${reportFileName}`;

console.log("REPORT SAVED SUCCESSFULLY");

console.log("FINAL PATH:");
console.log(finalPath);

console.log("DB PATH:");
console.log(dbPath);

    await pool.query(
      `
        UPDATE endorsements

        SET report_pdf = $1

        WHERE id = $2
        `,
      [dbPath, endorsementId],
    );

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  saveGeneratedReport,
};
