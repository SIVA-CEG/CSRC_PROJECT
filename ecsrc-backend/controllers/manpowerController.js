const pool = require("../db/db");

const createManpower = async (req, res) => {
  try {
    const { project_id, installment_id, manpower_type, amount } = req.body;

    const result = await pool.query(
      `
          INSERT INTO manpower (

            project_id,
            installment_id,
            manpower_type,
            amount

          )

          VALUES ($1,$2,$3,$4)

          RETURNING *
          `,
      [project_id, installment_id, manpower_type, amount],
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
  createManpower,
};
