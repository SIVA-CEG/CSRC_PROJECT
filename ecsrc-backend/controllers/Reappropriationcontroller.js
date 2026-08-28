/**
 * reappropriationController.js
 *
 * Run these ALTER TABLE statements ONCE in your DB before using this:
 *
 *   ALTER TABLE reappropriation_requests
 *     ADD COLUMN IF NOT EXISTS reap_type       VARCHAR(20),
 *     ADD COLUMN IF NOT EXISTS proceeding_no   TEXT,
 *     ADD COLUMN IF NOT EXISTS proceeding_date TEXT,
 *     ADD COLUMN IF NOT EXISTS mh_no           TEXT,
 *     ADD COLUMN IF NOT EXISTS sanction_reg_vol TEXT,
 *     ADD COLUMN IF NOT EXISTS sanction_reg_sl  TEXT,
 *     ADD COLUMN IF NOT EXISTS sanction_reg_page TEXT,
 *     ADD COLUMN IF NOT EXISTS director_name   TEXT,
 *     ADD COLUMN IF NOT EXISTS references_json TEXT,
 *     ADD COLUMN IF NOT EXISTS extra_json      TEXT;
 */

const pool = require("../db/db");
const path = require("path");

// ── GET /agencies?user_id=X ───────────────────────────────────────────────────
// Returns distinct funding agencies from this PI's projects.
const getAgencies = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await pool.query(
      `SELECT DISTINCT p.funding_agency
       FROM projects p
       LEFT JOIN endorsements e ON p.endorsement_id = e.id
       WHERE e.user_id = $1 AND p.funding_agency IS NOT NULL
       ORDER BY p.funding_agency`,
      [user_id],
    );
    res.json(result.rows.map((r) => r.funding_agency));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch agencies" });
  }
};

// ── GET /projects?user_id=X&agency=Y ─────────────────────────────────────────
// Returns projects for this PI filtered by funding agency.
const getProjects = async (req, res) => {
  try {
    const { user_id, agency } = req.query;
    const result = await pool.query(
      `SELECT p.id,
              p.project_title,
              p.sanction_reference_no,
              p.scheme,
              p.project_start_date,
              p.project_end_date,
              p.funding_agency,
              fp.staff_name  AS pi_name,
              fp.designation AS pi_desig,
              fp.department  AS pi_dept,
              fp.campus      AS pi_campus,
              fp.dob         AS pi_dob,
              fp.dos         AS pi_dos,
              fp.superannuation_date AS pi_superannuation,
              COALESCE(nr.nr_total, 0) + COALESCE(mp.mp_total, 0) +
              COALESCE(rh.rh_total, 0) + COALESCE(oh.oh_total, 0) AS total_cost
       FROM projects p
       LEFT JOIN endorsements e ON p.endorsement_id = e.id
       LEFT JOIN faculty_profile fp ON fp.user_id = e.user_id
       LEFT JOIN (
         SELECT project_id, SUM(amount) AS nr_total
         FROM non_recurring_heads GROUP BY project_id
       ) nr ON nr.project_id = p.id
       LEFT JOIN (
         SELECT project_id, SUM(amount) AS mp_total
         FROM manpower GROUP BY project_id
       ) mp ON mp.project_id = p.id
       LEFT JOIN (
         SELECT project_id,
                SUM(COALESCE(consumables,0) + COALESCE(travel,0) +
                    COALESCE(contingency,0) + COALESCE(ssr_budget,0)) AS rh_total
         FROM recurring_heads GROUP BY project_id
       ) rh ON rh.project_id = p.id
       LEFT JOIN (
         SELECT project_id, SUM(total_overhead) AS oh_total
         FROM overheads GROUP BY project_id
       ) oh ON oh.project_id = p.id
       WHERE e.user_id = $1 AND p.funding_agency = $2
       ORDER BY p.id DESC`,
      [user_id, agency],
    );
    console.log("PROJECT ROW:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// ── GET /installments/:project_id ─────────────────────────────────────────────
// Returns all installments for a project.
const getInstallments = async (req, res) => {
  try {
    const { project_id } = req.params;
    const result = await pool.query(
      `SELECT id, installment, status, created_at
       FROM installments
       WHERE project_id = $1
       ORDER BY id ASC`,
      [project_id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch installments" });
  }
};

// ── GET /heads/:project_id/:installment_id ────────────────────────────────────
// Returns all budget heads (equipment, manpower, recurring, overhead) with
// their allocated amounts.  These are returned as "unspent" since the DB
// doesn't track actual expenditures — use the allocated amount as available.
const getBudgetHeads = async (req, res) => {
  try {
    const { project_id, installment_id } = req.params;

    const [nrRes, mpRes, recRes, ohRes] = await Promise.all([
      pool.query(
        `SELECT equipment AS label, amount
         FROM non_recurring_heads
         WHERE project_id = $1 AND installment_id = $2`,
        [project_id, installment_id],
      ),
      pool.query(
        `SELECT manpower_type AS label, amount
         FROM manpower
         WHERE project_id = $1 AND installment_id = $2`,
        [project_id, installment_id],
      ),
      pool.query(
        `SELECT consumables, travel, contingency, ssr_budget
         FROM recurring_heads
         WHERE project_id = $1 AND installment_id = $2
         LIMIT 1`,
        [project_id, installment_id],
      ),
      pool.query(
        `SELECT total_overhead
         FROM overheads
         WHERE project_id = $1 AND installment_id = $2
         LIMIT 1`,
        [project_id, installment_id],
      ),
    ]);

    const heads = [];

    nrRes.rows.forEach((r) =>
      heads.push({
        type: "non_recurring",
        label: r.label,
        amount: parseFloat(r.amount) || 0,
      }),
    );

    mpRes.rows.forEach((r) =>
      heads.push({
        type: "manpower",
        label: r.label,
        amount: parseFloat(r.amount) || 0,
      }),
    );

    const rec = recRes.rows[0] || {};
    const recurringMap = {
      consumables: "Consumables",
      travel: "Travel",
      contingency: "Contingency",
      ssr_budget: "SSR Budget",
    };
    Object.entries(recurringMap).forEach(([col, label]) => {
      const amt = parseFloat(rec[col]) || 0;
      if (amt > 0) heads.push({ type: "recurring", label, amount: amt });
    });

    const ohAmt = parseFloat(ohRes.rows[0]?.total_overhead) || 0;
    if (ohAmt > 0)
      heads.push({ type: "overhead", label: "Overhead", amount: ohAmt });

    res.json(heads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budget heads" });
  }
};

// ── POST /submit ──────────────────────────────────────────────────────────────
// Creates one reappropriation_requests row and N reappropriation_details rows.
const submitReappropriation = async (req, res) => {
  try {
    const {
      project_id,
      installment_id,
      reap_type, // "with" | "without"
      proceeding_no,
      proceeding_date,
      mh_no,
      sanction_reg_vol,
      sanction_reg_sl,
      sanction_reg_page,
      director_name,
      references, // JSON array
      reap_pairs, // JSON array [{fromHead, toHead, amount, amountWords, refCited}]
      // ── "with" specific ──
      current_installment_no,
      current_installment_amount,
      bank_name,
      pfms_ref_no,
      pfms_ref_cited,
      tsa,
      tsa_ref_cited,
      to_desig,
    } = req.body;

    // Store "with"-specific fields and any overflow in extra_json
    const extra = {
      current_installment_no,
      current_installment_amount,
      bank_name,
      pfms_ref_no,
      pfms_ref_cited,
      tsa,
      tsa_ref_cited,
      to_desig,
    };

    // letter_path is repurposed here as a submission identifier
    const letter_path = `REAP-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO reappropriation_requests
         (project_id, installment_id, letter_path, status,
          reap_type, proceeding_no, proceeding_date, mh_no,
          sanction_reg_vol, sanction_reg_sl, sanction_reg_page,
          director_name, references_json, extra_json)
       VALUES ($1,$2,$3,'PENDING',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING reappropriation_id`,
      [
        project_id,
        installment_id || null,
        letter_path,
        reap_type || "without",
        proceeding_no || null,
        proceeding_date || null,
        mh_no || null,
        sanction_reg_vol || null,
        sanction_reg_sl || null,
        sanction_reg_page || null,
        director_name || "DIRECTOR, CSRC",
        references ? JSON.stringify(references) : null,
        JSON.stringify(extra),
      ],
    );

    const reappropriationId = result.rows[0].reappropriation_id;

    // Insert each from→to pair
    const pairs = Array.isArray(reap_pairs)
      ? reap_pairs
      : JSON.parse(reap_pairs || "[]");
    for (const pair of pairs) {
      if (!pair.fromHead || !pair.toHead) continue;
      await pool.query(
        `INSERT INTO reappropriation_details (reappropriation_id, from_head, to_head, amount)
         VALUES ($1, $2, $3, $4)`,
        [
          reappropriationId,
          pair.fromHead,
          pair.toHead,
          parseFloat(pair.amount) || 0,
        ],
      );
    }

    res
      .status(201)
      .json({ message: "Submitted successfully", reappropriationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit reappropriation" });
  }
};

// ── POST /save-report/:id ─────────────────────────────────────────────────────
// Saves the generated PDF path after upload.
const saveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = file.path.replace(/\\/g, "/");
    await pool.query(
      `UPDATE reappropriation_requests SET report_path = $1 WHERE reappropriation_id = $2`,
      [filePath, id],
    );
    res.json({ message: "Report saved", path: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save report" });
  }
};

// ── GET /list?user_id=X ───────────────────────────────────────────────────────
// Returns all reappropriation requests for this PI with project info.
const getList = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await pool.query(
      `SELECT rr.*,
              p.project_title,
              p.funding_agency,
              p.scheme,
              p.project_start_date,
              p.project_end_date,
              i.installment AS installment_label,
              fp.staff_name  AS pi_name,
              fp.designation AS pi_desig,
              fp.department  AS pi_dept,
              fp.campus      AS pi_campus
       FROM reappropriation_requests rr
       JOIN projects p ON rr.project_id = p.id
       LEFT JOIN endorsements e ON p.endorsement_id = e.id
       LEFT JOIN faculty_profile fp ON fp.user_id = e.user_id
       LEFT JOIN installments i ON rr.installment_id = i.id
       WHERE e.user_id = $1
       ORDER BY rr.created_at DESC`,
      [user_id],
    );

    const rows = result.rows.map((r) => ({
      ...r,
      references: r.references_json ? JSON.parse(r.references_json) : [],
      extra: r.extra_json ? JSON.parse(r.extra_json) : {},
    }));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch list" });
  }
};

// ── GET /detail/:id ───────────────────────────────────────────────────────────

// ── GET /detail/:id ───────────────────────────────────────────────────────────
// Returns full detail of one reappropriation request including details rows.
const getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [reqRes, detailRes] = await Promise.all([
      pool.query(
        `SELECT rr.*,
                p.project_title, p.funding_agency, p.scheme,
                p.project_start_date, p.project_end_date,
                i.installment AS installment_label,
                fp.staff_name AS pi_name, fp.designation AS pi_desig,
                fp.department AS pi_dept, fp.campus AS pi_campus
         FROM reappropriation_requests rr
         JOIN projects p ON rr.project_id = p.id
         LEFT JOIN installments i ON rr.installment_id = i.id
         LEFT JOIN endorsements e ON p.endorsement_id = e.id
        LEFT JOIN faculty_profile fp ON fp.user_id = e.user_id
         WHERE rr.reappropriation_id = $1`,
        [id],
      ),
      pool.query(
        `SELECT * FROM reappropriation_details WHERE reappropriation_id = $1`,
        [id],
      ),
    ]);

    if (reqRes.rows.length === 0)
      return res.status(404).json({ error: "Not found" });

    const row = reqRes.rows[0];
    res.json({
      ...row,
      references: row.references_json ? JSON.parse(row.references_json) : [],
      extra: row.extra_json ? JSON.parse(row.extra_json) : {},
      reap_pairs: detailRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch detail" });
  }
};
// ── GET /previous-installments/:project_id/:current_installment_id ──────────
// Returns proceedings details for all installments BEFORE the current one
// ── GET /previous-installments/:project_id/:current_installment_id ──────────
// Returns full proceedings details for all installments BEFORE the current one
const getPreviousInstallments = async (req, res) => {
  try {
    const { project_id, current_installment_id } = req.params;

    const currentRes = await pool.query(
      `SELECT id FROM installments WHERE id = $1`,
      [current_installment_id],
    );
    if (currentRes.rows.length === 0) {
      return res.json([]);
    }
    const currentInstallmentId = currentRes.rows[0].id;

    const prevRes = await pool.query(
      `SELECT
         i.id,
         i.installment,
         a.approval_status,
         a.created_at AS approved_on,
         COALESCE(nr.nr_total, 0) + COALESCE(mp.mp_total, 0) +
         COALESCE(rh.rh_total, 0) + COALESCE(oh.oh_total, 0) AS amount,
         p.sanction_reference_no,
         p.sanction_reference_date
       FROM installments i
       LEFT JOIN approvals a ON a.installment_id = i.id
       LEFT JOIN projects p ON p.id = i.project_id
       LEFT JOIN (
         SELECT installment_id, SUM(amount) AS nr_total
         FROM non_recurring_heads GROUP BY installment_id
       ) nr ON nr.installment_id = i.id
       LEFT JOIN (
         SELECT installment_id, SUM(amount) AS mp_total
         FROM manpower GROUP BY installment_id
       ) mp ON mp.installment_id = i.id
       LEFT JOIN (
         SELECT installment_id,
                SUM(COALESCE(consumables,0) + COALESCE(travel,0) +
                    COALESCE(contingency,0) + COALESCE(ssr_budget,0)) AS rh_total
         FROM recurring_heads GROUP BY installment_id
       ) rh ON rh.installment_id = i.id
       LEFT JOIN (
         SELECT installment_id, SUM(total_overhead) AS oh_total
         FROM overheads GROUP BY installment_id
       ) oh ON oh.installment_id = i.id
       WHERE i.project_id = $1 AND i.id < $2
       ORDER BY i.id ASC`,
      [project_id, currentInstallmentId],
    );

    res.json(
      prevRes.rows.map((r) => ({
        no: r.installment,
        amount: parseFloat(r.amount) || 0,
        releasedDate: r.approved_on
          ? new Date(r.approved_on).toLocaleDateString("en-GB")
          : "—",
        procNo: r.sanction_reference_no
          ? `${r.sanction_reference_no}${
              r.sanction_reference_date
                ? ` dt. ${new Date(r.sanction_reference_date).toLocaleDateString("en-GB")}`
                : ""
            }`
          : "—",
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch previous installments" });
  }
};
// ── GET /director ─────────────────────────────────────────────────────────
// Returns the current director's name from admin_users
const getDirector = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT name FROM admin_users WHERE role = 'director' LIMIT 1`,
    );
    res.json({ name: result.rows[0]?.name || "DIRECTOR, CSRC" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch director" });
  }
};
// ── GET /installment-total/:project_id/:installment_id ──────────────────────
// Returns the total amount for ONE installment (manpower + equipment + recurring + overhead)
const getInstallmentTotal = async (req, res) => {
  try {
    const { project_id, installment_id } = req.params;

    const [nrRes, mpRes, recRes, ohRes] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(amount), 0) AS total
         FROM non_recurring_heads
         WHERE project_id = $1 AND installment_id = $2`,
        [project_id, installment_id],
      ),
      pool.query(
        `SELECT COALESCE(SUM(amount), 0) AS total
         FROM manpower
         WHERE project_id = $1 AND installment_id = $2`,
        [project_id, installment_id],
      ),
      pool.query(
        `SELECT COALESCE(SUM(
           COALESCE(consumables,0) + COALESCE(travel,0) +
           COALESCE(contingency,0) + COALESCE(ssr_budget,0)
         ), 0) AS total
         FROM recurring_heads
         WHERE project_id = $1 AND installment_id = $2`,
        [project_id, installment_id],
      ),
      pool.query(
        `SELECT COALESCE(SUM(total_overhead), 0) AS total
         FROM overheads
         WHERE project_id = $1 AND installment_id = $2`,
        [project_id, installment_id],
      ),
    ]);

    const nrTotal = parseFloat(nrRes.rows[0].total) || 0;
    const mpTotal = parseFloat(mpRes.rows[0].total) || 0;
    const recTotal = parseFloat(recRes.rows[0].total) || 0;
    const ohTotal = parseFloat(ohRes.rows[0].total) || 0;

    const total = nrTotal + mpTotal + recTotal + ohTotal;

    res.json({
      total,
      breakdown: {
        equipment: nrTotal,
        manpower: mpTotal,
        recurring: recTotal,
        overhead: ohTotal,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch installment total" });
  }
};

module.exports = {
  getAgencies,
  getProjects,
  getInstallments,
  getBudgetHeads,
  submitReappropriation,
  getPreviousInstallments,
  saveReport,
  getList,
  getDetail,
  getDirector,
  getInstallmentTotal,
};
