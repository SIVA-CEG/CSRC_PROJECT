const pool = require("../db/db");

// GET ENDORSEMENTS
// BY FACULTY + FUNDING AGENCY

const getFacultyEndorsements = async (req, res) => {
  try {
    const { fundingAgency, userId } = req.query;
    console.log("USER ID:", userId);
    console.log("FUNDING AGENCY:", fundingAgency);
    const result = await pool.query(
      `
          SELECT
  e.id,
  p.id AS project_id,
  e.full_project_title,
  e.funding_agency,
  e.reference_number,
  e.applied_on,
e.total_amount,
e.status,
  fu.full_name,

  fp.department,
  fp.campus,
  fp.dob,
  fp.dos,
  fp.superannuation_date

FROM endorsements e

LEFT JOIN faculty_users fu
ON e.user_id = fu.id

LEFT JOIN faculty_profile fp
ON fu.id = fp.user_id

LEFT JOIN projects p
ON p.endorsement_id = e.id

WHERE
  e.user_id = $1
  AND e.funding_agency = $2
  AND LOWER(e.status) = 'approved'

ORDER BY e.id DESC
          `,
      [userId, fundingAgency],
    );
    console.log("ROWS FOUND:", result.rows.length);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// CREATE PROJECT

const createProject = async (req, res) => {
  try {
    const {
      endorsement_id,
      project_title,
      funding_agency,

      project_start_date,
      project_end_date,
      sanction_letter_path,
    } = req.body;

    const existing = await pool.query(
      `
        SELECT *

        FROM projects

        WHERE endorsement_id = $1
        `,
      [endorsement_id],
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({
        project: existing.rows[0],
      });
    }

    const result = await pool.query(
      `
        INSERT INTO projects (
  endorsement_id,
  project_title,
  funding_agency,

  project_start_date,
  project_end_date,
  sanction_letter_path
)
VALUES ($1,$2,$3,$4,$5,$6)

        RETURNING *
        `,
      [
        endorsement_id,
        project_title,
        funding_agency,

        project_start_date,
        project_end_date,
        sanction_letter_path,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("CREATE PROJECT ERROR:");
    console.log(err);

    res.status(500).json({
      message: err.message,
      detail: err.detail,
    });
  }
};
const updateSanctionCost = async (req, res) => {
  try {
    const { id } = req.params;

    const { total_sanctioned_cost } = req.body;

    await pool.query(
      `
        UPDATE projects

        SET total_sanctioned_cost = $1

        WHERE id = $2
        `,
      [total_sanctioned_cost, id],
    );

    res.json({
      message: "Sanction cost updated",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getNextInstallment = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("PROJECT ID RECEIVED:", projectId);
    const result = await pool.query(
      `
SELECT
    i.installment,
    a.approval_status
FROM approvals a
INNER JOIN installments i
ON a.installment_id = i.id
WHERE a.project_id = $1
ORDER BY a.id DESC
LIMIT 1
`,
      [projectId],
    );
console.log("NEXT INSTALLMENT QUERY RESULT", result.rows);
console.log(result.rows);
    let nextInstallment = "I";

    if (result.rows.length > 0) {
      const last = result.rows[0];

      if (last.approval_status === "Pending") {
        return res.status(200).json({
          nextInstallment: last.installment,
          pendingExists: true,
        });
      } else if (last.approval_status === "Approved") {
        if (last.installment === "I") {
          nextInstallment = "II";
        } else if (last.installment === "II") {
          nextInstallment = "III";
        } else {
          nextInstallment = "Completed";
        }
      }
    }

    res.status(200).json({
      nextInstallment,
      pendingExists: false,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProjectByEndorsement = async (req, res) => {
  try {
    const { endorsementId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM projects
      WHERE endorsement_id = $1
      `,
      [endorsementId],
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const getZBAProjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        project_title AS title,
        principal_investigator AS pi,
        department,
        sanctioned_amount
      FROM projects
      WHERE account_type = 'ZBA'
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch ZBA projects",
    });
  }
};

const getProjectsEligibleForStaff = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        p.id,
        p.project_title
      FROM projects p

      INNER JOIN approvals a
        ON a.project_id = p.id

      INNER JOIN installments i
        ON i.id = a.installment_id

      WHERE
        i.installment = 'I'
        AND a.approval_status = 'Approved'

      ORDER BY p.project_title
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getEligibleReappropriationProjects = async (req, res) => {
  try {
    const result = await pool.query(`
SELECT
    p.id,
    p.project_title,
    p.funding_agency,

    i.id AS installment_id,

    i.installment,

    fu.full_name AS pi_name,

    fp.department

FROM projects p

LEFT JOIN endorsements e
ON p.endorsement_id = e.id

LEFT JOIN faculty_users fu
ON e.user_id = fu.id

LEFT JOIN faculty_profile fp
ON fu.id = fp.user_id

LEFT JOIN approvals a
ON a.project_id = p.id

LEFT JOIN installments i
ON a.installment_id = i.id

WHERE a.approval_status = 'Approved'
`);

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getInstallmentDistribution = async (req, res) => {
  try {
    const { projectId, installment } = req.params;

    // find installment id
    const installmentResult = await pool.query(
      `
      SELECT id
      FROM installments
      WHERE project_id = $1
      AND installment = $2
      `,
      [projectId, installment],
    );

    if (installmentResult.rows.length === 0) {
      return res.json({
        nonRecurring: [],
        recurring: [],
        overhead: [],
        ssr: 0,
      });
    }

    const installmentId = installmentResult.rows[0].id;

    const nonRecurring = await pool.query(
      `
      SELECT equipment, amount
      FROM non_recurring_heads
      WHERE project_id = $1
      AND installment_id = $2
      `,
      [projectId, installmentId],
    );

    const manpower = await pool.query(
      `
      SELECT manpower_type, amount
      FROM manpower
      WHERE project_id = $1
      AND installment_id = $2
      `,
      [projectId, installmentId],
    );

    const recurring = await pool.query(
      `
      SELECT
        consumables,
        travel,
        contingency,
        ssr_budget
      FROM recurring_heads
      WHERE project_id = $1
      AND installment_id = $2
      `,
      [projectId, installmentId],
    );

    const overhead = await pool.query(
      `
      SELECT
        total_overhead,
        registrar_ac,
        dean_ac,
        csrc_revenue_ac,
        pi_pdf_ac
      FROM overheads
      WHERE project_id = $1
      AND installment_id = $2
      `,
      [projectId, installmentId],
    );

    res.json({
      nonRecurring: nonRecurring.rows,
      manpower: manpower.rows,
      recurring: recurring.rows[0] || {},
      overhead: overhead.rows[0] || {},
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  getFacultyEndorsements,
  createProject,
  updateSanctionCost,
  getNextInstallment,
  getProjectByEndorsement,
  getZBAProjects,
  getProjectsEligibleForStaff,
  getEligibleReappropriationProjects,
  getInstallmentDistribution,
};
