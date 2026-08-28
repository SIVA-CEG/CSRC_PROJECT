const pool = require("../db/db");

const createInstallment = async (req, res) => {
  try {
    const { project_id, installment, report_path } = req.body;

    const existing = await pool.query(
      `
          SELECT *

          FROM installments

          WHERE
            project_id = $1

          AND installment = $2
          `,
      [project_id, installment],
    );

    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await pool.query(
      `
          INSERT INTO installments (
  project_id,
  installment,
  report_path
)

          VALUES ($1,$2,$3)

          RETURNING *
          `,
      [project_id, installment, report_path],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createInstallment,
};
