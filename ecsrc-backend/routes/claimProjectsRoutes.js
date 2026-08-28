const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// ── List all projects belonging to a faculty user (for the ZBA project list) ──
router.get("/my-projects/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === "null" || isNaN(Number(userId))) {
      return res.status(400).json({ error: "Invalid or missing userId" });
    }
    const result = await pool.query(
      `SELECT p.id, p.project_title AS title, p.funding_agency, p.scheme,
              p.sanction_reference_no AS project_no,
              p.sanction_reference_no AS csrc_proc_no,
              p.sanction_reference_date AS csrc_proc_date,
              p.project_start_date, p.project_end_date,
              p.endorsement_id,
              f.staff_name AS pi_name, f.designation AS pi_designation,
              f.department, f.campus,
              e.total_amount AS sanctioned_amount
       FROM projects p
       JOIN endorsements e ON e.id = p.endorsement_id
       JOIN faculty_profile f ON f.user_id = e.user_id
       WHERE e.user_id = $1
       ORDER BY p.id DESC`,
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── Resolve the latest (most recent) installment for a project ────────────
async function getLatestInstallment(projectId) {
  const r = await pool.query(
    `SELECT id, installment FROM installments WHERE project_id = $1 ORDER BY id DESC LIMIT 1`,
    [projectId],
  );
  return r.rows[0] || null;
}

// ── Sum already-claimed amounts (pending+approved) for a project on a table ──
async function claimedSoFar(table, projectId) {
  const r = await pool.query(
    `SELECT COALESCE(SUM(amount),0) AS total FROM ${table}
     WHERE project_id = $1 AND status IN ('pending','approved')`,
    [projectId],
  );
  return Number(r.rows[0].total);
}

// ── NON-RECURRING (Equipment) detail bundle ────────────────────────────────
router.get("/non-recurring/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const projRes = await pool.query(
      `SELECT p.id, p.project_title AS title, p.funding_agency, p.scheme,
              p.sanction_reference_no AS csrc_proc_no, p.sanction_reference_date AS csrc_proc_date,
              p.endorsement_id, e.user_id,
              f.staff_name AS pi_name, f.designation AS pi_designation,
              f.department, f.campus, e.total_amount AS sanctioned_amount
       FROM projects p
       JOIN endorsements e ON e.id = p.endorsement_id
       JOIN faculty_profile f ON f.user_id = e.user_id
       WHERE p.id = $1`,
      [projectId],
    );
    if (projRes.rows.length === 0)
      return res.status(404).json({ error: "Project not found" });
    const project = projRes.rows[0];

    const installment = await getLatestInstallment(projectId);
    if (!installment)
      return res
        .status(404)
        .json({ error: "No installment found for project" });

    const equipRes = await pool.query(
      `SELECT id, equipment, amount FROM non_recurring_heads WHERE installment_id = $1 ORDER BY id`,
      [installment.id],
    );
    const budget = equipRes.rows.reduce((s, r) => s + Number(r.amount || 0), 0);
    const claimed = await claimedSoFar("claim_non_recurring", projectId);

    res.json({
      project,
      installment,
      equipmentOptions: equipRes.rows,
      budget,
      claimedSoFar: claimed,
      balance: budget - claimed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── Generic RECURRING-HEADS detail bundle (consumables/travel/contingency/other) ──
// key: 'consumables' | 'travel' | 'contingency' | 'other'
const RECURRING_COLUMN = {
  consumables: "consumables",
  travel: "travel",
  contingency: "contingency",
  other: "ssr_budget", // "Other Expenses" draws from the SSR/other bucket
};
const RECURRING_CLAIM_TABLE = {
  consumables: "claim_consumables",
  travel: "claim_travel",
  contingency: "claim_contingency",
  other: "claim_other_expenses",
};

router.get("/recurring/:head/:projectId", async (req, res) => {
  try {
    const { head, projectId } = req.params;
    const column = RECURRING_COLUMN[head];
    const claimTable = RECURRING_CLAIM_TABLE[head];
    if (!column)
      return res.status(400).json({ error: "Unknown recurring head" });

    const projRes = await pool.query(
      `SELECT p.id, p.project_title AS title, p.funding_agency, p.scheme,
              p.sanction_reference_no AS csrc_proc_no, p.sanction_reference_date AS csrc_proc_date,
              p.endorsement_id, e.user_id,
              f.staff_name AS pi_name, f.designation AS pi_designation,
              f.department, f.campus, e.total_amount AS sanctioned_amount
       FROM projects p
       JOIN endorsements e ON e.id = p.endorsement_id
       JOIN faculty_profile f ON f.user_id = e.user_id
       WHERE p.id = $1`,
      [projectId],
    );
    if (projRes.rows.length === 0)
      return res.status(404).json({ error: "Project not found" });
    const project = projRes.rows[0];

    const installment = await getLatestInstallment(projectId);
    if (!installment)
      return res
        .status(404)
        .json({ error: "No installment found for project" });

    const budgetRes = await pool.query(
      `SELECT COALESCE(${column}, 0) AS budget FROM recurring_heads WHERE installment_id = $1`,
      [installment.id],
    );
    const budget = Number(budgetRes.rows[0]?.budget || 0);
    const claimed = await claimedSoFar(claimTable, projectId);

    res.json({
      project,
      installment,
      budget,
      claimedSoFar: claimed,
      balance: budget - claimed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── OVERHEAD detail bundle ──────────────────────────────────────────────────
router.get("/overhead/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const projRes = await pool.query(
      `SELECT p.id, p.project_title AS title, p.funding_agency, p.scheme,
              p.sanction_reference_no AS csrc_proc_no, p.sanction_reference_date AS csrc_proc_date,
              p.endorsement_id, e.user_id,
              f.staff_name AS pi_name, f.designation AS pi_designation,
              f.department, f.campus, e.total_amount AS sanctioned_amount
       FROM projects p
       JOIN endorsements e ON e.id = p.endorsement_id
       JOIN faculty_profile f ON f.user_id = e.user_id
       WHERE p.id = $1`,
      [projectId],
    );
    if (projRes.rows.length === 0)
      return res.status(404).json({ error: "Project not found" });
    const project = projRes.rows[0];

    const installment = await getLatestInstallment(projectId);
    if (!installment)
      return res
        .status(404)
        .json({ error: "No installment found for project" });

    const ohRes = await pool.query(
      `SELECT total_overhead, registrar_ac, dean_ac, csrc_revenue_ac, pi_pdf_ac
       FROM overheads WHERE installment_id = $1`,
      [installment.id],
    );
    const oh = ohRes.rows[0] || {};
    const HEADS = [
      {
        key: "registrar",
        label: "The Registrar A/C, Chennai",
        percent: 5,
        budget: Number(oh.registrar_ac || 0),
      },
      {
        key: "csrcRevenue",
        label: "CSRC Revenue, Chennai",
        percent: 4,
        budget: Number(oh.csrc_revenue_ac || 0),
      },
      {
        key: "dean",
        label: "The Dean, Campus A/C",
        percent: 4,
        budget: Number(oh.dean_ac || 0),
      },
      {
        key: "pi",
        label: "The Principal Investigator PDF",
        percent: 2,
        budget: Number(oh.pi_pdf_ac || 0),
      },
    ];

    const claimedRes = await pool.query(
      `SELECT overhead_head_key, COALESCE(SUM(amount),0) AS total
       FROM claim_overhead
       WHERE project_id = $1 AND status IN ('pending','approved')
       GROUP BY overhead_head_key`,
      [projectId],
    );
    const claimedMap = {};
    claimedRes.rows.forEach((r) => {
      claimedMap[r.overhead_head_key] = Number(r.total);
    });

    const items = HEADS.map((h) => ({
      ...h,
      claimedSoFar: claimedMap[h.key] || 0,
      balance: h.budget - (claimedMap[h.key] || 0),
    }));

    res.json({ project, installment, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
