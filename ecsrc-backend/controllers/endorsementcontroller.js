const db = require("../db/db");
const pool = require("../db/db");
const fs = require("fs");

const path = require("path");

const { PDFDocument } = require("pdf-lib");
const getEndorsements = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `
      SELECT

id,

endorsement_id,

applied_on,

scheme,

total_amount,

status,

pdf_file

FROM endorsements

WHERE user_id = $1

ORDER BY id DESC
      `,

      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const mergePDFs = async (files, outputPath) => {
  console.log("FILES RECEIVED:");
  console.log(files);

  const mergedPdf = await PDFDocument.create();

  let totalPages = 0;

  for (const filePath of files) {
    console.log("CHECKING:");
    console.log(filePath);

    if (!filePath || !fs.existsSync(filePath)) {
      console.log("FILE NOT FOUND:", filePath);

      continue;
    }

    if (path.extname(filePath).toLowerCase() !== ".pdf") {
      console.log("NOT PDF:", filePath);

      continue;
    }

    try {
      const pdfBytes = fs.readFileSync(filePath);

      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });

      totalPages += copiedPages.length;

      console.log("PAGES ADDED:", copiedPages.length);
    } catch (err) {
      console.log("PDF LOAD FAILED:", filePath);

      console.log(err);
    }
  }

  console.log("TOTAL PAGES:", totalPages);

  if (totalPages === 0) {
    console.log("NO VALID PDF PAGES FOUND");

    return;
  }

  const mergedBytes = await mergedPdf.save();

  fs.writeFileSync(outputPath, mergedBytes);

  console.log("MERGED PDF SAVED:", outputPath);
};

const createEndorsement = async (req, res) => {
  try {
    const {
      user_id,
      funding_agency,
      funding_agency_type,
      project_type,
      scheme,
      full_project_title,
      reference_number,
      non_recurring,
      recurring,
      overhead_percent,
      gst_added,
      total_amount,
      submission_due_date,
      is_pi_regular_faculty,
      endorsement_required,
      endorsement_format,
    } = req.body;

    const coPrincipalInvestigators = JSON.parse(
      req.body.coPrincipalInvestigators || "[]",
    );

    const externalInvestigators = JSON.parse(
      req.body.externalInvestigators || "[]",
    );

    const endorsementCode = `END-${Date.now()}`;

    const appliedDate = new Date();

    // ================= SAVE ENDORSEMENT =================

    const endorsementResult = await pool.query(
      `
      INSERT INTO endorsements
      (
        user_id,
        endorsement_id,
        applied_on,
        funding_agency,
        funding_agency_type,
        project_type,
        scheme,
        full_project_title,
        reference_number,
        non_recurring,
        recurring,
        overhead_percent,
        gst_added,
        total_amount,
        submission_due_date,
        is_pi_regular_faculty,
        endorsement_required,
        endorsement_format
      )

      VALUES
      (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,
        $16,$17,$18
      )

      RETURNING id
      `,
      [
        user_id,
        endorsementCode,
        appliedDate,
        funding_agency,
        funding_agency_type,
        project_type,
        scheme,
        full_project_title,
        reference_number,
        non_recurring || null,
        recurring || null,
        overhead_percent || null,
        gst_added,
        total_amount || null,
        submission_due_date,
        is_pi_regular_faculty,
        endorsement_required,
        endorsement_format || null,
      ],
    );

    const endorsementId = endorsementResult.rows[0].id;

    const files = req.files;

    // ================= DOCUMENT PATHS =================

    const proposalCopy = files?.proposal_copy?.[0]
      ? `/uploads/endorsements/${files.proposal_copy[0].filename}`
      : null;

    const signedWriteup = files?.signed_writeup?.[0]
      ? `/uploads/endorsements/${files.signed_writeup[0].filename}`
      : null;

    const signedBudget = files?.signed_budget?.[0]
      ? `/uploads/endorsements/${files.signed_budget[0].filename}`
      : null;

    const endorsementFormatFile = files?.endorsement_format_file?.[0]
      ? `/uploads/endorsements/${files.endorsement_format_file[0].filename}`
      : null;

    const overheadExemptionFile = files?.overhead_exemption_file?.[0]
      ? `/uploads/endorsements/${files.overhead_exemption_file[0].filename}`
      : null;

    // ================= SAVE GENERATED REPORT =================

    

    // ================= SAVE DOCUMENT RECORDS =================

    await pool.query(
      `
      INSERT INTO endorsement_documents
      (
        endorsement_id,
        proposal_copy,
        signed_writeup,
        signed_budget,
        endorsement_format_file,
        overhead_exemption_file
      )

      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        endorsementId,
        proposalCopy,
        signedWriteup,
        signedBudget,
        endorsementFormatFile,
        overheadExemptionFile,
      ],
    );

    // ================= MERGE PDFs =================

    // ================= MERGED SUPPORTING DOCS =================

    const mergeInputFiles = [];

    const uploadFiles = [
      proposalCopy,
      signedWriteup,
      signedBudget,
      endorsementFormatFile,
      overheadExemptionFile,
    ];

    for (const file of uploadFiles) {
      if (file && file.toLowerCase().endsWith(".pdf")) {
mergeInputFiles.push(path.join(__dirname, "..", file.replace(/^\/+/, "")));      }
    }
    const mergedPdfName = `${endorsementCode}.pdf`;

    const mergedPdfPath = path.join(
      __dirname,
      "..",
      "uploads",
      "final-pdfs",
      mergedPdfName,
    );
    if (mergeInputFiles.length > 0) {
      await mergePDFs(mergeInputFiles, mergedPdfPath);
    }

    const mergedPdfDbPath = `/uploads/final-pdfs/${mergedPdfName}`;

    await pool.query(
      `
      UPDATE endorsements

      SET pdf_file = $1

      WHERE id = $2
      `,
      [mergedPdfDbPath, endorsementId],
    );

    // ================= INSERT CO-PI =================

    if (coPrincipalInvestigators && coPrincipalInvestigators.length > 0) {
      for (const copi of coPrincipalInvestigators) {
        if (!copi.copi_user_id) continue;

        await pool.query(
          `
          INSERT INTO endorsement_copi
          (
            endorsement_id,
            copi_user_id,
            role
          )

          VALUES ($1,$2,$3)
          `,
          [endorsementId, Number(copi.copi_user_id), copi.role || null],
        );
      }
    }

    // ================= INSERT EXTERNAL INVESTIGATORS =================

    if (externalInvestigators && externalInvestigators.length > 0) {
      for (const ext of externalInvestigators) {
        if (!ext.full_name || ext.full_name.trim() === "") {
          continue;
        }

        await pool.query(
          `
          INSERT INTO endorsement_external_investigators
          (
            endorsement_id,
            full_name,
            designation,
            institute
          )

          VALUES ($1,$2,$3,$4)
          `,
          [
            endorsementId,
            ext.full_name,
            ext.designation || null,
            ext.institute || null,
          ],
        );
      }
    }

    res.status(201).json({
      message: "Endorsement created successfully",
      endorsementId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  getEndorsements,

  createEndorsement,
};
