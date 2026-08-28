const pool = require("../db/db");
const path = require("path");
const fs = require("fs");

// ── GET /api/project-transfer/my-projects?user_id=X ─────────────────────────
// Returns all sanctioned projects belonging to this PI
const getMyProjects = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id required" });

    console.log(
      `[getMyProjects] incoming user_id = ${JSON.stringify(user_id)} (type: ${typeof user_id})`,
    );

    const result = await pool.query(
      `SELECT
         p.id,
         p.project_title AS title,
         p.funding_agency,
         p.sanction_reference_no AS file_no,
         p.pi_user_id AS debug_pi_user_id,
         e.user_id AS debug_endorsement_user_id,
         COALESCE((
           SELECT SUM(amount) FROM non_recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(consumables + travel + contingency + ssr_budget)
           FROM recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(total_overhead) FROM overheads WHERE project_id = p.id
         ), 0) AS cost,
         p.project_start_date,
         p.project_end_date
       FROM projects p
       LEFT JOIN endorsements e ON e.id = p.endorsement_id
       WHERE COALESCE(p.pi_user_id, e.user_id) = $1::integer
       ORDER BY p.id DESC`,
      [user_id],
    );

    // Debug: compare against the TOTAL unfiltered project count so we can
    // see in the logs whether the WHERE clause is actually restricting
    // anything at all, or whether every project is genuinely owned by the
    // same user_id in this dataset.
    const totalCount = await pool.query(`SELECT COUNT(*) FROM projects`);
    console.log(
      `[getMyProjects] matched ${result.rows.length} of ${totalCount.rows[0].count} total projects for user_id=${user_id}`,
    );
    console.log(
      "[getMyProjects] matched rows (id / pi_user_id / endorsement.user_id):",
      result.rows.map((r) => ({
        id: r.id,
        pi_user_id: r.debug_pi_user_id,
        endorsement_user_id: r.debug_endorsement_user_id,
      })),
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/project-transfer/faculty-list ───────────────────────────────────
// Returns all faculty from faculty_profile for the Transfer To dropdown
const getFacultyList = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         fp.user_id,
         fp.staff_name AS name,
         fp.designation,
         fp.department,
         fp.campus
       FROM faculty_profile fp
       ORDER BY fp.staff_name ASC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/project-transfer/create ───────────────────────────────────────
// Creates a new transfer record when letter is generated
const createTransfer = async (req, res) => {
  try {
    const {
      project_id,
      from_user_id,
      to_user_id,
      sub,
      ref,
      reason,
      status, // 'draft' or 'finish_later'
    } = req.body;

    // Check if an active transfer already exists for this project
    const existing = await pool.query(
      `SELECT id FROM project_transfers
       WHERE project_id = $1
       AND status NOT IN ('rejected_by_faculty', 'rejected_by_csrc', 'approved_by_csrc')`,
      [project_id],
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "An active transfer already exists for this project" });
    }

    const result = await pool.query(
      `INSERT INTO project_transfers
         (project_id, from_user_id, to_user_id, sub, ref, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        project_id,
        from_user_id,
        to_user_id,
        sub,
        ref,
        reason,
        status || "draft",
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/project-transfer/:id/upload-letter ──────────────────────────────
// Uploads the signed letter and updates status to awaiting_faculty_approval
const uploadLetter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const rawPath = req.file.path.replace(/\\/g, "/");
    const uploadsIndex = rawPath.indexOf("uploads/");
    const letterPath =
      uploadsIndex !== -1 ? rawPath.slice(uploadsIndex) : rawPath;
    const uploadDate = new Date().toISOString();

    await pool.query(
      `UPDATE project_transfers
       SET letter_path = $1,
           letter_upload_date = $2,
           status = 'pending_faculty'
       WHERE id = $3`,
      [letterPath, uploadDate, id],
    );

    res.json({ message: "Letter uploaded", letter_path: letterPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/project-transfer/:id/finish-later ──────────────────────────────
// Updates status to finish_later
const finishLater = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE project_transfers SET status = 'finish_later' WHERE id = $1`,
      [id],
    );

    res.json({ message: "Saved as finish later" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/project-transfer/sent?user_id=X ────────────────────────────────
// Returns all transfers initiated BY this user
const getSentTransfers = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id required" });

    const result = await pool.query(
      `SELECT
         pt.*,
         p.project_title AS title,
         p.funding_agency,
         p.sanction_reference_no AS file_no,
         COALESCE((
           SELECT SUM(amount) FROM non_recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(consumables + travel + contingency + ssr_budget)
           FROM recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(total_overhead) FROM overheads WHERE project_id = p.id
         ), 0) AS cost,
         p.project_start_date,
         p.project_end_date,
         fp_from.staff_name AS from_name,
         fp_from.designation AS from_designation,
         fp_from.department AS from_dept,
         fp_to.staff_name AS to_name,
         fp_to.designation AS to_designation,
         fp_to.department AS to_dept
       FROM project_transfers pt
       JOIN projects p ON p.id = pt.project_id
       LEFT JOIN faculty_profile fp_from ON fp_from.user_id = pt.from_user_id
       LEFT JOIN faculty_profile fp_to   ON fp_to.user_id   = pt.to_user_id
       WHERE pt.from_user_id = $1
       ORDER BY pt.created_at DESC`,
      [user_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/project-transfer/received?user_id=X ────────────────────────────
// Returns all transfers addressed TO this user (excluding drafts/finish_later)
const getReceivedTransfers = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id required" });

    console.log(`[getReceivedTransfers] incoming user_id = ${user_id}`);

    const result = await pool.query(
      `SELECT
         pt.*,
         p.project_title AS title,
         p.funding_agency,
         p.sanction_reference_no AS file_no,
         COALESCE((
           SELECT SUM(amount) FROM non_recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(consumables + travel + contingency + ssr_budget)
           FROM recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(total_overhead) FROM overheads WHERE project_id = p.id
         ), 0) AS cost,
         p.project_start_date,
         p.project_end_date,
         fp_from.staff_name AS from_name,
         fp_from.designation AS from_designation,
         fp_from.department AS from_dept,
         fp_to.staff_name AS to_name,
         fp_to.designation AS to_designation,
         fp_to.department AS to_dept
       FROM project_transfers pt
       JOIN projects p ON p.id = pt.project_id
       LEFT JOIN faculty_profile fp_from ON fp_from.user_id = pt.from_user_id
       LEFT JOIN faculty_profile fp_to   ON fp_to.user_id   = pt.to_user_id
       WHERE pt.to_user_id = $1
       AND pt.status NOT IN ('draft', 'finish_later')
       ORDER BY pt.created_at DESC`,
      [user_id],
    );

    // Debug: raw count of matching project_transfers rows with no joins at
    // all, so we can tell whether a LEFT JOIN is still silently losing rows
    // somewhere, or whether the base row set itself is smaller than expected.
    const rawCount = await pool.query(
      `SELECT id, status, from_user_id FROM project_transfers
       WHERE to_user_id = $1 AND status NOT IN ('draft', 'finish_later')`,
      [user_id],
    );
    console.log(
      `[getReceivedTransfers] raw project_transfers rows (no joins): ${rawCount.rows.length}`,
      rawCount.rows,
    );
    console.log(
      `[getReceivedTransfers] rows after joins: ${result.rows.length}`,
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/project-transfer/:id/faculty-accept ────────────────────────────
// Recipient faculty accepts the transfer
const facultyAccept = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE project_transfers
       SET status = 'accepted_by_faculty',
           faculty_response_date = NOW()
       WHERE id = $1`,
      [id],
    );

    res.json({ message: "Transfer accepted by faculty" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/project-transfer/:id/faculty-reject ────────────────────────────
// Recipient faculty rejects the transfer
const facultyReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    await pool.query(
      `UPDATE project_transfers
       SET status = 'rejected_by_faculty',
           faculty_response_date = NOW(),
           reject_remarks = $1
       WHERE id = $2`,
      [remarks || null, id],
    );

    res.json({ message: "Transfer rejected by faculty" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/project-transfer/:id ───────────────────────────────────────────
// Returns full details of a single transfer
const getTransferDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         pt.*,
         p.project_title AS title,
         p.funding_agency,
         p.sanction_reference_no AS file_no,
         COALESCE((
           SELECT SUM(amount) FROM non_recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(consumables + travel + contingency + ssr_budget)
           FROM recurring_heads WHERE project_id = p.id
         ), 0)
         + COALESCE((
           SELECT SUM(total_overhead) FROM overheads WHERE project_id = p.id
         ), 0) AS cost,
         p.project_start_date,
         p.project_end_date,
         fp_from.staff_name AS from_name,
         fp_from.designation AS from_designation,
         fp_from.department AS from_dept,
         fp_from.campus AS from_campus,
         fp_to.staff_name AS to_name,
         fp_to.designation AS to_designation,
         fp_to.department AS to_dept,
         fp_to.campus AS to_campus
       FROM project_transfers pt
       JOIN projects p ON p.id = pt.project_id
       LEFT JOIN faculty_profile fp_from ON fp_from.user_id = pt.from_user_id
       LEFT JOIN faculty_profile fp_to   ON fp_to.user_id   = pt.to_user_id
       WHERE pt.id = $1`,
      [id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Transfer not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMyProjects,
  getFacultyList,
  createTransfer,
  uploadLetter,
  finishLater,
  getSentTransfers,
  getReceivedTransfers,
  facultyAccept,
  facultyReject,
  getTransferDetail,
};
