const pool = require("../db/db");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const fmtDate = (d) => {
  if (!d) return null;
  if (typeof d === "string") return d.slice(0, 10); // already 'YYYY-MM-DD' or ISO string
  return d.toISOString().slice(0, 10); // JS Date object from pg
};

// e.g. today is in FY 2025-26 (Apr 2025 - Mar 2026) -> "2526"
const academicYearPrefix = () => {
  const now = new Date();
  const y = now.getFullYear();
  const startYear = now.getMonth() + 1 >= 4 ? y : y - 1; // FY starts April
  const yy1 = String(startYear).slice(-2);
  const yy2 = String(startYear + 1).slice(-2);
  return `${yy1}${yy2}`;
};

const generateFormCode = async () => {
  const seq = await pool.query("SELECT nextval('consultancy_form_seq') AS n");
  const n = seq.rows[0].n;
  return `${academicYearPrefix()}C${n}`;
};

const computeCharges = ({ tds, amountReceived, taxPercent, csrcRemunEnabled }) => {
  const tdsN = num(tds);
  const receivedN = num(amountReceived);
  const taxN = num(taxPercent) || 18;
  const total = tdsN + receivedN;
  const gst = (total * taxN) / 100;
  const overhead = total * 0.3;
  const remun = Math.max(total - gst - overhead, 0);
  const csrcRemun = csrcRemunEnabled ? remun * 0.01 : 0;
  return {
    tds: tdsN,
    amount_received: receivedN,
    tax_percent: taxN,
    total_consultancy_charges: total,
    gst_amount: gst,
    overhead_amount: overhead,
    csrc_remun_enabled: !!csrcRemunEnabled,
    consultant_remun_amount: remun,
    csrc_remun_amount: csrcRemun,
  };
};

const insertSplitRows = async (client, rows, { chargesId, paymentId }) => {
  if (!Array.isArray(rows) || rows.length === 0) return;
  for (const row of rows) {
    await client.query(
      `INSERT INTO consultancy_split_rows
        (charges_id, payment_id, bank_name, ref_no, payment_type, ref_date, amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        chargesId || null,
        paymentId || null,
        row.bankName || null,
        row.refNo || null,
        row.paymentType || null,
        row.refDate || null,
        num(row.amount),
      ],
    );
  }
};

// Row from consultancy_forms -> list-shape used by AcceptanceFormStatus / InstallmentList tables
const toListRow = (r, idx) => ({
  id: r.form_code,
  dbId: r.id,
  firmName: r.firm_name || "",
  consultantTitle: r.work_title || "",
  installment: r.installment_type === "with" ? "Multiple" : "Single",
  type: r.work_type === "proforma" ? "Proforma Invoice"
      : r.work_type === "permission" ? "Permission" : "—",
  amount: Number(r.approx_total_charges) || 0,
  duration: r.start_date && r.end_date ? `${fmtDate(r.start_date)} to ${fmtDate(r.end_date)}` : "—",
  status: r.status,
  remarks: r.remarks,
  firmLetterFile: r.firm_letter_path,
  sNo: idx + 1,
});

/* ------------------------------------------------------------------ */
/*  Acceptance Form: create / list / detail / status                  */
/* ------------------------------------------------------------------ */

const createAcceptanceForm = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      campus, installmentType,
      coConsult = { has: "no", list: [] },
      firm = {}, work = {},
      approx = {},
      expenditure = {},
      installmentDetails, // present when installmentType === 'with'
      charges,            // present when work.workType === 'permission'
      splitRows,          // charges split rows, only relevant if charges present
    } = req.body;

    const facultyId = req.user?.id || null;

    if (!campus || !["department", "center"].includes(campus)) {
      return res.status(400).json({ message: "campus must be 'department' or 'center'" });
    }

    await client.query("BEGIN");

    const formCode = await generateFormCode();

    let principal = req.body.principal || {};
    // If facultyId supplied but no explicit principal block, snapshot from faculty tables
    if (facultyId && Object.keys(principal).length === 0) {
      const fRes = await client.query(
        `SELECT fu.full_name, fu.email, fp.department, fp.campus, fp.designation, fp.mobile
         FROM faculty_users fu
         LEFT JOIN faculty_profile fp ON fp.user_id = fu.id
         WHERE fu.id = $1`,
        [facultyId],
      );
      if (fRes.rows.length) {
        const f = fRes.rows[0];
        principal = {
          name: f.full_name,
          designation: f.designation,
          department: f.department,
          campus: f.campus,
          contactNo: f.mobile,
          email: f.email,
        };
      }
    }

    const formResult = await client.query(
      `INSERT INTO consultancy_forms (
        form_code, campus, faculty_id, installment_type,
        principal_name, principal_designation, principal_department, principal_campus,
        principal_contact_no, principal_email,
        firm_consultant_type, firm_name, firm_sector, firm_type, firm_district, firm_state,
        firm_pin_code, firm_address, firm_letter_ref, firm_gst, firm_email, firm_tan,
        firm_contact_name, firm_contact_designation, firm_contact_mobile, firm_pan,
        work_title, work_abstract, start_date, end_date, total_hours,
        has_equipment, equipment_name, work_type,
        approx_total_charges, approx_tax_percent
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,
        $27,$28,$29,$30,$31,
        $32,$33,$34,
        $35,$36
      ) RETURNING *`,
      [
        formCode, campus, facultyId || null, installmentType === "with" ? "with" : "without",
        principal.name || null, principal.designation || null, principal.department || null, principal.campus || null,
        principal.contactNo || null, principal.email || null,
        firm.consultantType || null, firm.firmName || null, firm.sector || null, firm.type || "National",
        firm.district || null, firm.state || null,
        firm.pinCode || null, firm.firmAddress || null, firm.letterRef || null, firm.gst || null,
        firm.email || null, firm.tan || null,
        firm.contactName || null, firm.contactDesignation || null, firm.contactMobile || null, firm.pan || null,
        work.title || null, work.abstract || null, work.startDate || null, work.endDate || null, num(work.totalHours),
        work.hasEquipment || "no", work.equipmentName || null, work.workType || null,
        num(approx.totalCharges), num(approx.taxPercent) || 18,
      ],
    );

    const form = formResult.rows[0];

    // Co-consultants
    if (coConsult.has === "yes" && Array.isArray(coConsult.list)) {
      for (const c of coConsult.list) {
        await client.query(
          `INSERT INTO consultancy_co_consultants (form_id, name, designation, campus, department, mobile)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [form.id, c.name || null, c.designation || null, c.campus || null, c.department || null, c.mobile || null],
        );
      }
    }

    // Expenditure (always create the row, defaults to zero)
    await client.query(
      `INSERT INTO consultancy_expenditure (
        form_id, manpower, travel, equipment, contingency, consumables,
        consultant_remuneration, dept_staff_remuneration, external_consultant,
        subcontracting, hiring_services, other_cost_details, other_cost
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        form.id, num(expenditure.manpower), num(expenditure.travel), num(expenditure.equipment),
        num(expenditure.contingency), num(expenditure.consumables), num(expenditure.consultantRemuneration),
        num(expenditure.deptStaffRemuneration), num(expenditure.externalConsultant),
        num(expenditure.subcontracting), num(expenditure.hiringServices),
        expenditure.otherCostDetails || null, num(expenditure.otherCost),
      ],
    );

    // Initial installment particulars, if "with installment" was chosen at wizard time
    let installmentRow = null;
    if (installmentType === "with" && installmentDetails) {
      const iRes = await client.query(
        `INSERT INTO consultancy_installments (
          form_id, frequency, month, installment_no, proceedings_no, proceedings_date,
          total_amount, released_amount, permission_type
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          form.id, installmentDetails.frequency || "Monthly", installmentDetails.month || null,
          installmentDetails.installmentNo ? parseInt(installmentDetails.installmentNo, 10) : null,
          installmentDetails.proceedingsNo || null, installmentDetails.proceedingsDate || null,
          num(installmentDetails.totalAmount), num(installmentDetails.releasedAmount),
          work.workType || null,
        ],
      );
      installmentRow = iRes.rows[0];
    }

    // Charges, only meaningful for permission-type work
    if (work.workType === "permission" && charges) {
      const c = computeCharges(charges);
      const cRes = await client.query(
        `INSERT INTO consultancy_charges (
          form_id, installment_id, source, tds, amount_received, tax_percent,
          total_consultancy_charges, gst_amount, overhead_amount,
          csrc_remun_enabled, consultant_remun_amount, csrc_remun_amount
        ) VALUES ($1,$2,'wizard',$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
        [
          form.id, installmentRow ? installmentRow.id : null,
          c.tds, c.amount_received, c.tax_percent, c.total_consultancy_charges,
          c.gst_amount, c.overhead_amount, c.csrc_remun_enabled,
          c.consultant_remun_amount, c.csrc_remun_amount,
        ],
      );
      await insertSplitRows(client, splitRows, { chargesId: cRes.rows[0].id });
    }

    // Proforma work type auto-creates an invoice record (Submitted, no invoice no. yet)
    if (work.workType === "proforma") {
      await client.query(
        `INSERT INTO consultancy_invoices (form_id, status) VALUES ($1, 'submitted')`,
        [form.id],
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ id: form.id, formCode: form.form_code, ...form });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

const listAcceptanceForms = async (req, res) => {
  try {
    const { campus, status } = req.query;
    const conditions = [];
    const params = [];

    if (campus) {
      params.push(campus);
      conditions.push(`campus = $${params.length}`);
    }
    if (status && status !== "all") {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT * FROM consultancy_forms ${where} ORDER BY id DESC`,
      params,
    );

    res.status(200).json(result.rows.map(toListRow));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Full nested detail — shape mirrors AcceptanceFormPrintView's `record.details`
const getAcceptanceFormDetail = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const isNumeric = /^\d+$/.test(idOrCode);

    const formRes = await pool.query(
      `SELECT * FROM consultancy_forms WHERE ${isNumeric ? "id" : "form_code"} = $1`,
      [idOrCode],
    );
    if (formRes.rows.length === 0) {
      return res.status(404).json({ message: "Acceptance form not found" });
    }
    const f = formRes.rows[0];

    const [coConsultRes, expRes, installmentsRes, chargesRes, invoiceRes, paymentRes] = await Promise.all([
      pool.query(`SELECT name, designation, campus, department, mobile FROM consultancy_co_consultants WHERE form_id = $1`, [f.id]),
      pool.query(`SELECT * FROM consultancy_expenditure WHERE form_id = $1`, [f.id]),
      pool.query(`SELECT * FROM consultancy_installments WHERE form_id = $1 ORDER BY id ASC`, [f.id]),
      pool.query(`SELECT * FROM consultancy_charges WHERE form_id = $1 ORDER BY id DESC`, [f.id]),
      pool.query(`SELECT * FROM consultancy_invoices WHERE form_id = $1`, [f.id]),
      pool.query(`SELECT * FROM consultancy_payments WHERE form_id = $1`, [f.id]),
    ]);

    const expenditure = expRes.rows[0] || {};

    res.status(200).json({
      id: f.form_code,
      dbId: f.id,
      campus: f.campus,
      status: f.status,
      remarks: f.remarks,
      submittedOn: f.submitted_on,
      firmName: f.firm_name,
      consultantTitle: f.work_title,
      amount: Number(f.approx_total_charges) || 0,
      firmLetterFile: f.firm_letter_path,
      details: {
        coConsultants: coConsultRes.rows,
        principal: {
          name: f.principal_name, designation: f.principal_designation, department: f.principal_department,
          campus: f.principal_campus, contactNo: f.principal_contact_no, email: f.principal_email,
        },
        firm: {
          name: f.firm_name, pan: f.firm_pan, gst: f.firm_gst, letterRef: f.firm_letter_ref,
          contactName: f.firm_contact_name, contactNo: f.firm_contact_mobile, address: f.firm_address,
        },
        work: {
          title: f.work_title, abstract: f.work_abstract, startDate: fmtDate(f.start_date), endDate: fmtDate(f.end_date),
          totalHours: f.total_hours, hasEquipment: f.has_equipment, equipmentName: f.equipment_name,
          workType: f.work_type, installmentType: f.installment_type,
          installmentCount: installmentsRes.rows.length || undefined,
        },
        expenditure: {
          manpower: expenditure.manpower, travel: expenditure.travel, equipment: expenditure.equipment,
          contingency: expenditure.contingency, consumables: expenditure.consumables,
          consultantRemuneration: expenditure.consultant_remuneration,
          deptStaffRemuneration: expenditure.dept_staff_remuneration,
          externalConsultant: expenditure.external_consultant, subcontracting: expenditure.subcontracting,
          hiringServices: expenditure.hiring_services, otherCostDetails: expenditure.other_cost_details,
          otherCost: expenditure.other_cost,
        },
        approx: { totalCharges: f.approx_total_charges, taxPercent: f.approx_tax_percent },
        installments: installmentsRes.rows,
        charges: chargesRes.rows,
      },
      invoice: invoiceRes.rows[0]
        ? { status: invoiceRes.rows[0].status, invoiceNo: invoiceRes.rows[0].invoice_no, raisedOn: invoiceRes.rows[0].raised_on }
        : undefined,
      payment: paymentRes.rows[0]
        ? { status: paymentRes.rows[0].status, particulars: paymentRes.rows[0] }
        : undefined,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Office review action — accept / reject with remarks
const updateAcceptanceFormStatus = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const { status, remarks } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'accepted' or 'rejected'" });
    }

    const isNumeric = /^\d+$/.test(idOrCode);
    const result = await pool.query(
      `UPDATE consultancy_forms SET status = $1, remarks = $2
       WHERE ${isNumeric ? "id" : "form_code"} = $3 RETURNING *`,
      [status, remarks || null, idOrCode],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Acceptance form not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const uploadFirmLetter = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const isNumeric = /^\d+$/.test(idOrCode);
    const filePath = `/uploads/consultancyFirmLetters/${req.file.filename}`;

    const result = await pool.query(
      `UPDATE consultancy_forms SET firm_letter_path = $1
       WHERE ${isNumeric ? "id" : "form_code"} = $2 RETURNING id, form_code, firm_letter_path`,
      [filePath, idOrCode],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Acceptance form not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ------------------------------------------------------------------ */
/*  Installments                                                       */
/* ------------------------------------------------------------------ */

// Forms submitted with installment_type = 'with'
const listInstallmentForms = async (req, res) => {
  try {
    const { campus } = req.query;
    const params = [];
    let where = `WHERE cf.installment_type = 'with'`;
    if (campus) {
      params.push(campus);
      where += ` AND cf.campus = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT cf.*,
              COUNT(ci.id) AS installment_count,
              COALESCE(SUM(ci.released_amount), 0) AS total_released
       FROM consultancy_forms cf
       LEFT JOIN consultancy_installments ci ON ci.form_id = cf.id
       ${where}
       GROUP BY cf.id
       ORDER BY cf.id DESC`,
      params,
    );

    res.status(200).json(result.rows.map((r, idx) => ({
      ...toListRow(r, idx),
      installmentCount: Number(r.installment_count) || 0,
      totalReleased: Number(r.total_released) || 0,
    })));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST body mirrors AddInstallmentForm's payload
const addInstallment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { idOrCode } = req.params;
    const {
      firmLetterRef,
      installment = {},
      permissionType, // '' | 'proforma' | 'permission'
      splitRows,
      charges,        // present when permissionType === 'permission'
      approx,          // present when permissionType === 'proforma'
      expenditure,
    } = req.body;

    const isNumeric = /^\d+$/.test(idOrCode);

    await client.query("BEGIN");

    const formRes = await client.query(
      `SELECT * FROM consultancy_forms WHERE ${isNumeric ? "id" : "form_code"} = $1`,
      [idOrCode],
    );
    if (formRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Acceptance form not found" });
    }
    const form = formRes.rows[0];

    if (firmLetterRef !== undefined) {
      await client.query(`UPDATE consultancy_forms SET firm_letter_ref = $1 WHERE id = $2`, [firmLetterRef, form.id]);
    }

    const instRes = await client.query(
      `INSERT INTO consultancy_installments (
        form_id, frequency, month, installment_no, proceedings_no, proceedings_date,
        total_amount, released_amount, permission_type
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        form.id, installment.frequency || "Monthly", installment.month || null,
        installment.installmentNo ? parseInt(installment.installmentNo, 10) : null,
        installment.proceedingsNo || null, installment.proceedingsDate || null,
        num(installment.totalAmount), num(installment.releasedAmount),
        permissionType || null,
      ],
    );
    const installmentRow = instRes.rows[0];

    if (permissionType === "permission" && charges) {
      const c = computeCharges(charges);
      const cRes = await client.query(
        `INSERT INTO consultancy_charges (
          form_id, installment_id, source, tds, amount_received, tax_percent,
          total_consultancy_charges, gst_amount, overhead_amount,
          csrc_remun_enabled, consultant_remun_amount, csrc_remun_amount
        ) VALUES ($1,$2,'installment',$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
        [
          form.id, installmentRow.id,
          c.tds, c.amount_received, c.tax_percent, c.total_consultancy_charges,
          c.gst_amount, c.overhead_amount, c.csrc_remun_enabled,
          c.consultant_remun_amount, c.csrc_remun_amount,
        ],
      );
      await insertSplitRows(client, splitRows, { chargesId: cRes.rows[0].id });
    }

    if (permissionType === "proforma" && approx) {
      await client.query(
        `UPDATE consultancy_forms SET approx_total_charges = $1, approx_tax_percent = $2, work_type = 'proforma'
         WHERE id = $3`,
        [num(approx.totalCharges), num(approx.taxPercent) || 18, form.id],
      );
      // Ensure an invoice record exists for this now-proforma consultancy
      const invExists = await client.query(`SELECT id FROM consultancy_invoices WHERE form_id = $1`, [form.id]);
      if (invExists.rows.length === 0) {
        await client.query(`INSERT INTO consultancy_invoices (form_id, status) VALUES ($1, 'submitted')`, [form.id]);
      }
    }

    if (expenditure) {
      await client.query(
        `UPDATE consultancy_expenditure SET
          manpower = $1, travel = $2, equipment = $3, contingency = $4, consumables = $5,
          consultant_remuneration = $6, dept_staff_remuneration = $7, external_consultant = $8,
          subcontracting = $9, hiring_services = $10, other_cost_details = $11, other_cost = $12
         WHERE form_id = $13`,
        [
          num(expenditure.manpower), num(expenditure.travel), num(expenditure.equipment),
          num(expenditure.contingency), num(expenditure.consumables), num(expenditure.consultantRemuneration),
          num(expenditure.deptStaffRemuneration), num(expenditure.externalConsultant),
          num(expenditure.subcontracting), num(expenditure.hiringServices),
          expenditure.otherCostDetails || null, num(expenditure.otherCost),
          form.id,
        ],
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ formId: form.id, formCode: form.form_code, installment: installmentRow });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

/* ------------------------------------------------------------------ */
/*  Invoices (proforma work_type only)                                 */
/* ------------------------------------------------------------------ */

const listInvoices = async (req, res) => {
  try {
    const { campus, status } = req.query;
    const params = [];
    let where = `WHERE cf.work_type = 'proforma'`;
    if (campus) {
      params.push(campus);
      where += ` AND cf.campus = $${params.length}`;
    }
    if (status && status !== "all") {
      params.push(status);
      where += ` AND ci.status = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT cf.*, ci.status AS invoice_status, ci.invoice_no, ci.raised_on
       FROM consultancy_forms cf
       JOIN consultancy_invoices ci ON ci.form_id = cf.id
       ${where}
       ORDER BY cf.id DESC`,
      params,
    );

    res.status(200).json(result.rows.map((r, idx) => ({
      ...toListRow(r, idx),
      invoice: { status: r.invoice_status, invoiceNo: r.invoice_no, raisedOn: r.raised_on },
    })));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const markInvoiceCompleted = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const { invoiceNo } = req.body;

    if (!invoiceNo || !invoiceNo.trim()) {
      return res.status(400).json({ message: "invoiceNo is required" });
    }

    const isNumeric = /^\d+$/.test(idOrCode);
    const formRes = await pool.query(
      `SELECT id FROM consultancy_forms WHERE ${isNumeric ? "id" : "form_code"} = $1`,
      [idOrCode],
    );
    if (formRes.rows.length === 0) {
      return res.status(404).json({ message: "Acceptance form not found" });
    }

    const result = await pool.query(
      `UPDATE consultancy_invoices SET status = 'completed', invoice_no = $1
       WHERE form_id = $2 RETURNING *`,
      [invoiceNo.trim(), formRes.rows[0].id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invoice record not found for this form" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ------------------------------------------------------------------ */
/*  Payments (only forms whose invoice.status = 'completed')          */
/* ------------------------------------------------------------------ */

const listPayments = async (req, res) => {
  try {
    const { campus, status } = req.query;
    const params = [];
    let where = `WHERE ci.status = 'completed'`;
    if (campus) {
      params.push(campus);
      where += ` AND cf.campus = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT cf.*, ci.invoice_no, ci.status AS invoice_status,
              cp.status AS payment_status, cp.id AS payment_id
       FROM consultancy_forms cf
       JOIN consultancy_invoices ci ON ci.form_id = cf.id
       LEFT JOIN consultancy_payments cp ON cp.form_id = cf.id
       ${where}
       ORDER BY cf.id DESC`,
      params,
    );

    let rows = result.rows.map((r, idx) => ({
      ...toListRow(r, idx),
      invoiceNo: r.invoice_no,
      payment: { status: r.payment_status || "submitted" },
    }));

    if (status && status !== "all") {
      rows = rows.filter((r) => r.payment.status === status);
    }

    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST body mirrors PaymentEntryForm's payload
const savePayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { idOrCode } = req.params;
    const { splitRows, ...chargesInput } = req.body;
    const isNumeric = /^\d+$/.test(idOrCode);

    await client.query("BEGIN");

    const formRes = await client.query(
      `SELECT cf.id, ci.status AS invoice_status
       FROM consultancy_forms cf
       JOIN consultancy_invoices ci ON ci.form_id = cf.id
       WHERE ${isNumeric ? "cf.id" : "cf.form_code"} = $1`,
      [idOrCode],
    );
    if (formRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Acceptance form / invoice not found" });
    }
    const form = formRes.rows[0];
    if (form.invoice_status !== "completed") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Invoice must be completed before payment can be recorded" });
    }

    const c = computeCharges(chargesInput);

    const payRes = await client.query(
      `INSERT INTO consultancy_payments (
        form_id, status, tds, amount_received, tax_percent, total_consultancy_charges,
        gst_amount, overhead_amount, csrc_remun_enabled, consultant_remun_amount,
        csrc_remun_amount, approved_on
      ) VALUES ($1,'completed',$2,$3,$4,$5,$6,$7,$8,$9,$10, CURRENT_DATE)
      ON CONFLICT (form_id) DO UPDATE SET
        status = 'completed', tds = EXCLUDED.tds, amount_received = EXCLUDED.amount_received,
        tax_percent = EXCLUDED.tax_percent, total_consultancy_charges = EXCLUDED.total_consultancy_charges,
        gst_amount = EXCLUDED.gst_amount, overhead_amount = EXCLUDED.overhead_amount,
        csrc_remun_enabled = EXCLUDED.csrc_remun_enabled,
        consultant_remun_amount = EXCLUDED.consultant_remun_amount,
        csrc_remun_amount = EXCLUDED.csrc_remun_amount, approved_on = CURRENT_DATE
      RETURNING *`,
      [
        form.id, c.tds, c.amount_received, c.tax_percent, c.total_consultancy_charges,
        c.gst_amount, c.overhead_amount, c.csrc_remun_enabled, c.consultant_remun_amount,
        c.csrc_remun_amount,
      ],
    );
    const payment = payRes.rows[0];

    // Clear old split rows on resave, then insert fresh
    await client.query(`DELETE FROM consultancy_split_rows WHERE payment_id = $1`, [payment.id]);
    await insertSplitRows(client, splitRows, { paymentId: payment.id });

    await client.query("COMMIT");
    res.status(201).json(payment);
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

module.exports = {
  createAcceptanceForm,
  listAcceptanceForms,
  getAcceptanceFormDetail,
  updateAcceptanceFormStatus,
  uploadFirmLetter,
  listInstallmentForms,
  addInstallment,
  listInvoices,
  markInvoiceCompleted,
  listPayments,
  savePayment,
};