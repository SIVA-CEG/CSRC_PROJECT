const pool = require("../db/db");

const createApproval = async (req, res) => {
  try {
    const { project_id, installment_id, faculty_id, approval_status } =
      req.body;
    const existing = await pool.query(
      `
  SELECT *
  FROM approvals
  WHERE project_id = $1
    AND installment_id = $2
    AND approval_status = 'Pending'
  `,
      [project_id, installment_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "This installment already has a pending approval request",
      });
    }
    const result = await pool.query(
      `
          INSERT INTO approvals (

            project_id,
            installment_id,
            faculty_id,
            approval_status

          )

          VALUES ($1,$2,$3,$4)

          RETURNING *
          `,
      [project_id, installment_id, faculty_id, approval_status],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getApprovals = async (req, res) => {
  try {
    const result = await pool.query(`
SELECT

  a.id,

  CASE
    WHEN i.status = 'COMPLETED'
      THEN 'Approved'

    WHEN i.status = 'ASSIGNED TO DIRECTOR'
      THEN 'Pending Director Approval'

    WHEN i.status = 'ASSIGNED TO SUPERVISOR'
      THEN 'Pending Superintendent Approval'

    WHEN i.status = 'ASSIGNED'
      THEN 'Pending Assistant Approval'

    ELSE COALESCE(i.status, a.approval_status)
  END AS approval_status,

  p.id AS project_id,
  p.project_title,
  p.funding_agency,

  e.total_amount,

  i.installment,

  fu.full_name,

  a.created_at

FROM approvals a

LEFT JOIN projects p
ON a.project_id = p.id

LEFT JOIN endorsements e
ON p.endorsement_id = e.id

LEFT JOIN installments i
ON a.installment_id = i.id

LEFT JOIN faculty_users fu
ON a.faculty_id = fu.id

ORDER BY a.id DESC
`);
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getApprovedProjects = async (req, res) => {
  try {
    const result = await pool.query(`
SELECT

  i.id,
  i.installment,
  i.status,

  p.id AS project_id,
  p.project_title,
  p.funding_agency,

  e.total_amount,

  fu.full_name,

  i.created_at

FROM installments i

LEFT JOIN projects p
ON i.project_id = p.id

LEFT JOIN endorsements e
ON p.endorsement_id = e.id

LEFT JOIN faculty_users fu
ON e.user_id = fu.id

WHERE i.status = 'COMPLETED'

ORDER BY i.id DESC
`);

    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `
      SELECT

        p.*,

        e.total_amount,
        e.pdf_file,
        fu.full_name,

    fp.department,

    fp.campus,

        i.id AS installment_id,
        i.installment,
        i.report_path,
        i.created_at AS installment_date,
        a.approval_status,

       nr.equipments,

mp.manpowers,

        rh.consumables,
        rh.travel,
        rh.contingency,

        oh.total_overhead,
        oh.registrar_ac,
        oh.dean_ac,
        oh.csrc_revenue_ac,
        oh.pi_pdf_ac

      FROM projects p

      LEFT JOIN installments i
      ON p.id = i.project_id
    LEFT JOIN endorsements e
    ON p.endorsement_id = e.id

    LEFT JOIN faculty_users fu
    ON e.user_id = fu.id

    LEFT JOIN faculty_profile fp
    ON fu.id = fp.user_id

     LEFT JOIN LATERAL (
    SELECT
      CASE
        WHEN h.action = 'FINAL_APPROVE'
          THEN 'Approved'

        WHEN h.action = 'APPROVE_AND_ASSIGN_DIRECTOR'
          THEN 'Pending Director Approval'

        WHEN h.action = 'APPROVE_AND_ASSIGN'
          THEN 'Pending Superintendent Approval'

        WHEN h.action = 'TRANSFER'
          THEN 'Transferred'

        ELSE i.status
      END AS approval_status
    FROM installment_assign_history h
    WHERE h.installment_id = i.id
    ORDER BY h.created_at DESC
    LIMIT 1
) a ON TRUE
LEFT JOIN LATERAL (
    SELECT
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'equipment', equipment,
                'amount', amount
            )
        ) AS equipments
    FROM non_recurring_heads
    WHERE installment_id = i.id
) nr ON TRUE

LEFT JOIN LATERAL (
    SELECT
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'manpower_type', manpower_type,
                'amount', amount
            )
        ) AS manpowers
    FROM manpower
    WHERE installment_id = i.id
) mp ON TRUE

LEFT JOIN LATERAL (
    SELECT
        SUM(consumables) AS consumables,
        SUM(travel) AS travel,
        SUM(contingency) AS contingency
    FROM recurring_heads
    WHERE installment_id = i.id
) rh ON TRUE

LEFT JOIN LATERAL (
    SELECT
        SUM(total_overhead) AS total_overhead,
        SUM(registrar_ac) AS registrar_ac,
        SUM(dean_ac) AS dean_ac,
        SUM(csrc_revenue_ac) AS csrc_revenue_ac,
        SUM(pi_pdf_ac) AS pi_pdf_ac
    FROM overheads
    WHERE installment_id = i.id
) oh ON TRUE

      WHERE p.id = $1
      `,
      [projectId],
    );
    console.log("DETAILS LENGTH =", result.rows.length);

    result.rows.forEach((row, index) => {
      console.log(index, {
        installment: row.installment,
        equipment: row.equipment,
        manpower: row.manpower_type,
      });
    });
    const historyResult = await pool.query(
      `
SELECT
    installment_id,
    assigned_from,
    assigned_to,
    action,
    remarks,
    created_at
FROM installment_assign_history
WHERE installment_id IN (
    SELECT id
    FROM installments
    WHERE project_id = $1
)
ORDER BY created_at ASC
`,
      [projectId],
    );
    console.log(
      "PROJECT DETAILS STATUS",
      result.rows.map((r) => ({
        installment: r.installment,
        status: r.status,
        approval_status: r.approval_status,
      })),
    );
    res.json({
      projectDetails: result.rows,
      history: historyResult.rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getEquipmentByInstallment = async (req, res) => {
  const { installmentId } = req.params;

  const result = await pool.query(
    `
    SELECT
      equipment,
      amount
    FROM non_recurring_heads
    WHERE installment_id = $1
    `,
    [installmentId],
  );

  res.json(result.rows);
};
const getManpowerByInstallment = async (req, res) => {
  const { installmentId } = req.params;

  const result = await pool.query(
    `
    SELECT
      manpower_type,
      amount
    FROM manpower
    WHERE installment_id = $1
    `,
    [installmentId],
  );

  res.json(result.rows);
};


module.exports = {
  createApproval,
  getApprovals,
  getApprovedProjects,
  getProjectDetails,
};
