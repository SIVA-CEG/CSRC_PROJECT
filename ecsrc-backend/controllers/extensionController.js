const pool = require("../db/db");

/* --------------------------------------------------
   GET FUNDING AGENCIES
-------------------------------------------------- */
const getAgencies = async (req, res) => {
  try {
    const { user_id } = req.query;

    const result = await pool.query(
      `SELECT DISTINCT p.funding_agency
       FROM projects p
       LEFT JOIN endorsements e
         ON p.endorsement_id = e.id
       WHERE e.user_id = $1
         AND p.funding_agency IS NOT NULL
       ORDER BY p.funding_agency`,
      [user_id],
    );

    res.json(result.rows.map((r) => r.funding_agency));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch agencies",
    });
  }
};

/* --------------------------------------------------
   GET PROJECTS BY AGENCY
-------------------------------------------------- */
const getProjects = async (req, res) => {
  try {
    const { user_id, agency } = req.query;

    const result = await pool.query(
      `SELECT
          p.id,
          p.project_title,
          p.scheme,
          p.funding_agency,

          p.project_start_date,
          p.project_end_date,

          p.sanction_reference_no,
          p.sanction_reference_date,

          fp.staff_name  AS pi_name,
          fp.designation AS pi_designation,
          fp.department  AS pi_department,
          fp.campus      AS pi_campus,

          COALESCE(nr.nr_total,0)
          + COALESCE(mp.mp_total,0)
          + COALESCE(rh.rh_total,0)
          + COALESCE(oh.oh_total,0)
          AS total_cost

       FROM projects p

       LEFT JOIN endorsements e
         ON p.endorsement_id = e.id

       LEFT JOIN faculty_profile fp
         ON fp.user_id = e.user_id

       LEFT JOIN (
         SELECT project_id,
                SUM(amount) AS nr_total
         FROM non_recurring_heads
         GROUP BY project_id
       ) nr
       ON nr.project_id = p.id

       LEFT JOIN (
         SELECT project_id,
                SUM(amount) AS mp_total
         FROM manpower
         GROUP BY project_id
       ) mp
       ON mp.project_id = p.id

       LEFT JOIN (
         SELECT project_id,
                SUM(
                  COALESCE(consumables,0)
                  + COALESCE(travel,0)
                  + COALESCE(contingency,0)
                  + COALESCE(ssr_budget,0)
                ) AS rh_total
         FROM recurring_heads
         GROUP BY project_id
       ) rh
       ON rh.project_id = p.id

       LEFT JOIN (
         SELECT project_id,
                SUM(total_overhead) AS oh_total
         FROM overheads
         GROUP BY project_id
       ) oh
       ON oh.project_id = p.id

       WHERE e.user_id = $1
         AND p.funding_agency = $2

       ORDER BY p.id DESC`,
      [user_id, agency],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
};
const submitExtension = async (req, res) => {
  try {
    const {
      project_id,
      original_end_date,
      revised_end_date,
      extension_period,
      reason,
      references,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO project_extensions
      (
        project_id,
        original_end_date,
        revised_end_date,
        extension_period,
        reason,
        references_json,
        status
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,'PENDING'
      )
      RETURNING *
      `,
      [
        project_id,
        original_end_date,
        revised_end_date,
        extension_period,
        reason,
        JSON.stringify(references || []),
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to submit extension request",
    });
  }
};
const getPreviousExtensions = async (req, res) => {
  try {
    const { project_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        revised_end_date,
        extension_period,
        assign_remarks,
        created_at
      FROM project_extensions
      WHERE project_id = $1
        AND status = 'COMPLETED'
      ORDER BY revised_end_date ASC
      `,
      [project_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch previous extensions",
    });
  }
};
const getDirector = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name FROM admin_users WHERE role = 'director' LIMIT 1
    `);

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch director",
    });
  }
};
const getExtensionHistory = async (req, res) => {
  try {
    const { user_id } = req.query;

    const result = await pool.query(
      `
      SELECT
          pe.*,

          p.project_title,
          p.funding_agency,
          p.scheme,

          fp.staff_name,
          fp.designation,
          fp.department,
          fp.campus

      FROM project_extensions pe

      JOIN projects p
        ON p.id = pe.project_id

      JOIN endorsements e
        ON e.id = p.endorsement_id

      LEFT JOIN faculty_profile fp
        ON fp.user_id = e.user_id

      WHERE e.user_id = $1

      ORDER BY pe.created_at DESC
      `,
      [user_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch extension history",
    });
  }
};
module.exports = {
  getAgencies,
  getProjects,
  submitExtension,
  getPreviousExtensions,
    getDirector,
    getExtensionHistory,
};
