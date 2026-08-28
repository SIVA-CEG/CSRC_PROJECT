const pool = require("../db/db");

const createProjectStaff = async (req, res) => {
  try {
    const {
      project_id,
      salutation,
      initial,
      staff_name,
      designation,
      degree,
      subject,
      mobile,
      email,
      aadhaar,
      phd_registration_no,
      account_number,
      bank_name,
      ifsc_code,
      pan_number,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO project_faculty_details
      (
        project_id,
        salutation,
        initial,
        staff_name,
        designation,
        degree,
        subject,
        mobile,
        email,
        aadhaar,
        phd_registration_no,
        account_number,
        bank_name,
        ifsc_code,
        pan_number
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15
      )
      RETURNING *
      `,
      [
        project_id,
        salutation,
        initial,
        staff_name,
        designation,
        degree,
        subject,
        mobile,
        email,
        aadhaar,
        phd_registration_no,
        account_number,
        bank_name,
        ifsc_code,
        pan_number,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ── NEW: Update project staff ─────────────────────────────
const updateProjectStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      salutation,
      initial,
      staff_name,
      designation,
      degree,
      subject,
      mobile,
      email,
      aadhaar,
      phd_registration_no,
      account_number,
      bank_name,
      ifsc_code,
      pan_number,
    } = req.body;

    await pool.query(
      `UPDATE project_faculty_details SET
        salutation         = $1,
        initial            = $2,
        staff_name         = $3,
        designation        = $4,
        degree             = $5,
        subject            = $6,
        mobile             = $7,
        email              = $8,
        aadhaar            = $9,
        phd_registration_no = $10,
        account_number     = $11,
        bank_name          = $12,
        ifsc_code          = $13,
        pan_number         = $14
       WHERE id = $15`,
      [
        salutation,
        initial,
        staff_name,
        designation,
        degree,
        subject,
        mobile,
        email,
        aadhaar,
        phd_registration_no,
        account_number,
        bank_name,
        ifsc_code,
        pan_number,
        id,
      ],
    );

    res.json({ message: "Staff updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ── NEW: Delete project staff ─────────────────────────────
const deleteProjectStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM project_faculty_details WHERE id = $1`, [id]);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getApprovedProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.project_title,
        p.funding_agency
      FROM projects p
      JOIN installments i
        ON i.project_id = p.id
      WHERE i.installment = 'I'
      AND i.status = 'Approved'
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getProjectStaff = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM project_faculty_details
      WHERE project_id = $1
      ORDER BY id DESC
      `,
      [projectId],
    );

    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const saveAppointment = async (req, res) => {
  try {
    const {
      staffId,
      appointment_order_no,
      appointment_order_date,
      contract_period_from,
      contract_period_upto,
      joining_due_date,
      fixed_salary,
      hra,
    } = req.body;

    const joiningDate =
      !joining_due_date || joining_due_date === "" ? null : joining_due_date;
    const minutesPath = req.file?.path?.replace(/\\/g, "/") || null;

    console.log("REQ BODY =", req.body);

    await pool.query(
      `
      UPDATE project_faculty_details
      SET
        appointment_order_no    = $1,
        appointment_order_date  = $2,
        contract_period_from    = $3,
        contract_period_upto    = $4,
        joining_due_date        = $5,
        fixed_salary            = $6,
        hra                     = $7,
        minutes_of_meeting_path = $8,
        status                  = 'pending'
      WHERE id = $9
      `,
      [
        appointment_order_no,
        appointment_order_date,
        contract_period_from,
        contract_period_upto,
        joiningDate,
        Number(fixed_salary) || 0,
        Number(hra) || 0,
        minutesPath,
        staffId,
      ],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ── FIXED: lowercase 'pending' to match saveAppointment ──
const getPendingAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM project_faculty_details
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAppointmentReportData = async (req, res) => {
  try {
    const { staffId } = req.params;

    const numericStaffId = parseInt(staffId, 10);

    if (isNaN(numericStaffId)) {
      return res.status(400).json({
        message: `Invalid ID format received: "${staffId}". Expected a numeric database ID.`,
      });
    }

    const result = await pool.query(
      `
      SELECT
        pf.id,
        pf.staff_name,
        pf.designation,
        pf.fixed_salary,
        pf.hra,
        pf.appointment_order_no,
        pf.appointment_order_date,
        pf.contract_period_from,
        pf.contract_period_upto,
        pf.joining_due_date,

        p.project_title,
        p.funding_agency,

        fp.staff_name  AS pi_name,
        fp.department,
        fp.campus,
        fp.designation AS pi_designation

      FROM project_faculty_details pf

      JOIN projects p
        ON p.id = pf.project_id

      LEFT JOIN endorsements e
        ON e.id = p.endorsement_id

      LEFT JOIN faculty_profile fp
        ON fp.user_id = e.user_id

      WHERE pf.id = $1
      `,
      [numericStaffId],
    );

    console.log("REPORT RESULT =", result.rows);
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const uploadAppointmentDocs = async (req, res) => {
  try {
    const { staffId } = req.body;

    const appointmentLetterPath = req.files?.appointment_letter?.[0]
      ? req.files.appointment_letter[0].path.replace(/\\/g, "/")
      : null;

    const joiningLetterPath = req.files?.joining_letter?.[0]
      ? req.files.joining_letter[0].path.replace(/\\/g, "/")
      : null;

    if (appointmentLetterPath) {
      await pool.query(
        `UPDATE project_faculty_details SET appointment_letter_path = $1 WHERE id = $2`,
        [appointmentLetterPath, staffId],
      );
    }

    if (joiningLetterPath) {
      await pool.query(
        `UPDATE project_faculty_details SET joining_letter_path = $1 WHERE id = $2`,
        [joiningLetterPath, staffId],
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const createExtension = async (req, res) => {
  try {
    const {
      project_faculty_id,
      project_id,
      extension_order_no,
      extension_order_date,
      extension_from,
      extension_upto,
      rejoin_due_date,
      fixed_salary,
      hra,
    } = req.body;

    const appraisalPath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const result = await pool.query(
      `INSERT INTO project_faculty_extensions
        (project_faculty_id, project_id, extension_order_no, extension_order_date,
         extension_from, extension_upto, rejoin_due_date, fixed_salary, hra,
         appraisal_path, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
       RETURNING *`,
      [
        project_faculty_id,
        project_id,
        extension_order_no,
        extension_order_date,
        extension_from,
        extension_upto,
        rejoin_due_date || null,
        Number(fixed_salary) || 0,
        Number(hra) || 0,
        appraisalPath,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPendingExtensions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, p.staff_name, p.designation
       FROM project_faculty_extensions e
       JOIN project_faculty_details p ON p.id = e.project_faculty_id
       WHERE e.status = 'pending'
       ORDER BY e.created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const uploadExtensionDocs = async (req, res) => {
  try {
    const { extensionId } = req.body;

    const extensionLetterPath = req.files?.extension_letter?.[0]
      ? req.files.extension_letter[0].path.replace(/\\/g, "/")
      : null;

    const rejoiningLetterPath = req.files?.rejoining_letter?.[0]
      ? req.files.rejoining_letter[0].path.replace(/\\/g, "/")
      : null;

    if (extensionLetterPath) {
      await pool.query(
        `UPDATE project_faculty_extensions SET extension_letter_path = $1 WHERE id = $2`,
        [extensionLetterPath, extensionId],
      );
    }

    if (rejoiningLetterPath) {
      await pool.query(
        `UPDATE project_faculty_extensions SET rejoining_letter_path = $1 WHERE id = $2`,
        [rejoiningLetterPath, extensionId],
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getExtensionReportData = async (req, res) => {
  try {
    const { extensionId } = req.params;
    const numericId = parseInt(extensionId, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: `Invalid ID: "${extensionId}"` });
    }

    const result = await pool.query(
      `SELECT
        e.id,
        e.extension_order_no,
        e.extension_order_date,
        e.extension_from,
        e.extension_upto,
        e.rejoin_due_date,
        e.fixed_salary,
        e.hra,
        e.appraisal_path,

        pf.staff_name,
        pf.designation,

        p.project_title,
        p.funding_agency,

        fp.staff_name  AS pi_name,
        fp.department,
        fp.campus,
        fp.designation AS pi_designation

       FROM project_faculty_extensions e
       JOIN project_faculty_details pf ON pf.id = e.project_faculty_id
       JOIN projects p                  ON p.id  = e.project_id
       LEFT JOIN endorsements en        ON en.id = p.endorsement_id
       LEFT JOIN faculty_profile fp     ON fp.user_id = en.user_id
       WHERE e.id = $1`,
      [numericId],
    );

    console.log("EXTENSION REPORT RESULT =", result.rows);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getEligibleExtensionProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        p.id,
        p.project_title,
        p.funding_agency,
        p.sanction_reference_no   AS proc_no,
        p.sanction_reference_date AS sanction_date,
        p.project_start_date,
        p.project_end_date        AS original_end_date,

        fp.staff_name AS pi_name,
        fp.department,
        fp.campus

      FROM projects p

      JOIN installments i
        ON i.project_id = p.id
        AND i.installment = 'I'

      JOIN approvals a
        ON a.installment_id = i.id
        AND a.approval_status = 'Approved'

      LEFT JOIN endorsements e
        ON e.id = p.endorsement_id

      LEFT JOIN faculty_profile fp
        ON fp.user_id = e.user_id

      ORDER BY p.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const createProjectExtension = async (req, res) => {
  try {
    const {
      project_id,
      original_end_date,
      revised_end_date,
      extension_period,
      reason,
    } = req.body;

    const requestLetterPath = req.files?.requestLetter?.[0]
      ? req.files.requestLetter[0].path.replace(/\\/g, "/")
      : null;

    const generatedReportPath = req.files?.generatedReport?.[0]
      ? req.files.generatedReport[0].path.replace(/\\/g, "/")
      : null;

    const result = await pool.query(
      `INSERT INTO project_extensions
        (project_id, original_end_date, revised_end_date, extension_period, reason,
         request_letter_path, generated_report_path, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Under Review')
       RETURNING *`,
      [
        project_id,
        original_end_date || null,
        revised_end_date,
        extension_period || null,
        reason || null,
        requestLetterPath,
        generatedReportPath,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getProjectExtensionHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pe.id,
        pe.project_id,
        pe.original_end_date,
        pe.revised_end_date,
        pe.extension_period,
        pe.reason,
        pe.status,
        pe.created_at,
        pe.request_letter_path,
        pe.generated_report_path,
        p.project_title,
        p.funding_agency
      FROM project_extensions pe
      JOIN projects p ON p.id = pe.project_id
      WHERE pe.status = 'Under Review'
      ORDER BY pe.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProjectStaff,
  updateProjectStaff, // ← NEW
  deleteProjectStaff, // ← NEW
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
};
