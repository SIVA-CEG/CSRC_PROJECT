const pool = require("../db/db");

const createOverhead = async (req, res) => {
  try {
    const {
      project_id,
      installment_id,

      total_overhead,

      registrar_ac,
      dean_ac,
      csrc_revenue_ac,
      pi_pdf_ac,
    } = req.body;

    await pool.query(
      `
        INSERT INTO overheads (

          project_id,
          installment_id,

          total_overhead,

          registrar_ac,
          dean_ac,
          csrc_revenue_ac,
          pi_pdf_ac

        )

        VALUES (
          $1,$2,$3,$4,$5,$6,$7
        )
        `,
      [
        project_id,
        installment_id,

        total_overhead,

        registrar_ac,
        dean_ac,
        csrc_revenue_ac,
        pi_pdf_ac,
      ],
    );

    res.status(201).json({
      message: "Overhead saved",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createOverhead,
};
