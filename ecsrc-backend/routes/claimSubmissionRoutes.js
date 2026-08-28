const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// ── Helper: resolve project's user_id + endorsement_id + latest installment ──
async function resolveClaimContext(projectId) {
  const projRes = await pool.query(
    `SELECT p.endorsement_id, e.user_id
     FROM projects p JOIN endorsements e ON e.id = p.endorsement_id
     WHERE p.id = $1`,
    [projectId],
  );
  if (projRes.rows.length === 0) return null;
  const { endorsement_id, user_id } = projRes.rows[0];

  const instRes = await pool.query(
    `SELECT id FROM installments WHERE project_id = $1 ORDER BY id DESC LIMIT 1`,
    [projectId],
  );
  if (instRes.rows.length === 0) return null;

  return {
    userId: user_id,
    endorsementId: endorsement_id,
    installmentId: instRes.rows[0].id,
  };
}

// ═══════════════════ NON-RECURRING (Equipment) ═══════════════════════════
router.post("/non-recurring", async (req, res) => {
  try {
    const {
      project_id,
      non_recurring_head_id,
      equipment_name,
      proceeding_no,
      hod_name,
      division_label,
      vendor_name,
      sanctioning_authority,
      mh_no,
      financial_year,
      sanction_page_no,
      sanction_sl_no,
      amount,
      report_html,
    } = req.body;

    const ctx = await resolveClaimContext(project_id);
    if (!ctx)
      return res.status(404).json({ error: "Project/installment not found" });

    const result = await pool.query(
      `INSERT INTO claim_non_recurring
       (user_id, project_id, installment_id, endorsement_id, non_recurring_head_id,
        equipment_name, proceeding_no, hod_name, division_label, vendor_name,
        sanctioning_authority, mh_no, financial_year, sanction_page_no, sanction_sl_no,
        amount, status, report_html)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'pending',$17)
       RETURNING *`,
      [
        ctx.userId,
        project_id,
        ctx.installmentId,
        ctx.endorsementId,
        non_recurring_head_id || null,
        equipment_name,
        proceeding_no,
        hod_name,
        division_label,
        vendor_name,
        sanctioning_authority,
        mh_no,
        financial_year,
        sanction_page_no,
        sanction_sl_no,
        amount,
        report_html || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/non-recurring/list/:projectId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM claim_non_recurring WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/non-recurring/:id/approve", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE claim_non_recurring SET status='approved' WHERE id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════ CONSUMABLES ═══════════════════════════════════════════
router.post("/consumables", async (req, res) => {
  try {
    const {
      project_id,
      proceeding_no,
      division_label,
      item_description,
      vendor_name,
      vendor_address,
      vendor_city,
      sanctioning_authority,
      mh_no,
      financial_year,
      sanction_page_no,
      sanction_sl_no,
      amount,
      report_html,
    } = req.body;

    const ctx = await resolveClaimContext(project_id);
    if (!ctx)
      return res.status(404).json({ error: "Project/installment not found" });

    const result = await pool.query(
      `INSERT INTO claim_consumables
       (user_id, project_id, installment_id, endorsement_id, proceeding_no, division_label,
        item_description, vendor_name, vendor_address, vendor_city, sanctioning_authority,
        mh_no, financial_year, sanction_page_no, sanction_sl_no, amount, status, report_html)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'pending',$17)
       RETURNING *`,
      [
        ctx.userId,
        project_id,
        ctx.installmentId,
        ctx.endorsementId,
        proceeding_no,
        division_label,
        item_description,
        vendor_name,
        vendor_address,
        vendor_city,
        sanctioning_authority,
        mh_no,
        financial_year,
        sanction_page_no,
        sanction_sl_no,
        amount,
        report_html || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/consumables/list/:projectId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM claim_consumables WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/consumables/:id/approve", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE claim_consumables SET status='approved' WHERE id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════ TRAVEL ═════════════════════════════════════════════
router.post("/travel", async (req, res) => {
  try {
    const {
      project_id,
      proceeding_no,
      division_label,
      payee_name,
      mode_of_travel,
      vehicle_no,
      travel_date,
      duration,
      from_place,
      to_place,
      purpose,
      start_km,
      end_km,
      head_of_account,
      financial_year,
      sanction_page_no,
      sanction_sl_no,
      amount,
      report_html,
    } = req.body;

    const ctx = await resolveClaimContext(project_id);
    if (!ctx)
      return res.status(404).json({ error: "Project/installment not found" });

    const result = await pool.query(
      `INSERT INTO claim_travel
       (user_id, project_id, installment_id, endorsement_id, proceeding_no, division_label,
        payee_name, mode_of_travel, vehicle_no, travel_date, duration, from_place, to_place,
        purpose, start_km, end_km, head_of_account, financial_year, sanction_page_no,
        sanction_sl_no, amount, status, report_html)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,'pending',$22)
       RETURNING *`,
      [
        ctx.userId,
        project_id,
        ctx.installmentId,
        ctx.endorsementId,
        proceeding_no,
        division_label,
        payee_name,
        mode_of_travel,
        vehicle_no,
        travel_date,
        duration,
        from_place,
        to_place,
        purpose,
        start_km || null,
        end_km || null,
        head_of_account,
        financial_year,
        sanction_page_no,
        sanction_sl_no,
        amount,
        report_html || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/travel/list/:projectId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM claim_travel WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/travel/:id/approve", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE claim_travel SET status='approved' WHERE id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════ CONTINGENCY ═══════════════════════════════════════════
router.post("/contingency", async (req, res) => {
  try {
    const {
      project_id,
      proceeding_no,
      division_label,
      item_description,
      sanctioning_authority,
      mh_no,
      financial_year,
      sanction_page_no,
      sanction_sl_no,
      amount,
      report_html,
    } = req.body;

    const ctx = await resolveClaimContext(project_id);
    if (!ctx)
      return res.status(404).json({ error: "Project/installment not found" });

    const result = await pool.query(
      `INSERT INTO claim_contingency
       (user_id, project_id, installment_id, endorsement_id, proceeding_no, division_label,
        item_description, sanctioning_authority, mh_no, financial_year, sanction_page_no,
        sanction_sl_no, amount, status, report_html)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending',$14)
       RETURNING *`,
      [
        ctx.userId,
        project_id,
        ctx.installmentId,
        ctx.endorsementId,
        proceeding_no,
        division_label,
        item_description,
        sanctioning_authority,
        mh_no,
        financial_year,
        sanction_page_no,
        sanction_sl_no,
        amount,
        report_html || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/contingency/list/:projectId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM claim_contingency WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/contingency/:id/approve", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE claim_contingency SET status='approved' WHERE id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════ OVERHEAD ═══════════════════════════════════════════
// Submits ONE row per selected overhead head (frontend sends an array).
router.post("/overhead", async (req, res) => {
  try {
    const { project_id, items } = req.body; // items: [{ key, label, percent, amount }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No overhead heads selected" });
    }

    const ctx = await resolveClaimContext(project_id);
    if (!ctx)
      return res.status(404).json({ error: "Project/installment not found" });

    const inserted = [];
    for (const item of items) {
      const result = await pool.query(
        `INSERT INTO claim_overhead
         (user_id, project_id, installment_id, endorsement_id, overhead_head_key,
          overhead_label, percent, amount, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
         RETURNING *`,
        [
          ctx.userId,
          project_id,
          ctx.installmentId,
          ctx.endorsementId,
          item.key,
          item.label,
          item.percent,
          item.amount,
        ],
      );
      inserted.push(result.rows[0]);
    }
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/overhead/list/:projectId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM claim_overhead WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/overhead/:id/approve", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE claim_overhead SET status='approved' WHERE id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════ OTHER EXPENSES ═════════════════════════════════════
router.post("/other-expenses", async (req, res) => {
  try {
    const {
      project_id,
      proceeding_no,
      division_label,
      purchase_of,
      vendor_name,
      vendor_city,
      sanctioning_authority,
      mh_no,
      financial_year,
      sanction_page_no,
      sanction_sl_no,
      amount,
      report_html,
    } = req.body;

    const ctx = await resolveClaimContext(project_id);
    if (!ctx)
      return res.status(404).json({ error: "Project/installment not found" });

    const result = await pool.query(
      `INSERT INTO claim_other_expenses
       (user_id, project_id, installment_id, endorsement_id, proceeding_no, division_label,
        purchase_of, vendor_name, vendor_city, sanctioning_authority, mh_no, financial_year,
        sanction_page_no, sanction_sl_no, amount, status, report_html)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pending',$16)
       RETURNING *`,
      [
        ctx.userId,
        project_id,
        ctx.installmentId,
        ctx.endorsementId,
        proceeding_no,
        division_label,
        purchase_of,
        vendor_name,
        vendor_city,
        sanctioning_authority,
        mh_no,
        financial_year,
        sanction_page_no,
        sanction_sl_no,
        amount,
        report_html || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/other-expenses/list/:projectId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM claim_other_expenses WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/other-expenses/:id/approve", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE claim_other_expenses SET status='approved' WHERE id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
