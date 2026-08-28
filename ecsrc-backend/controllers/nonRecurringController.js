const pool = require("../db/db");

const createNonRecurringHeads = async (req, res) => {
  try {
    const { project_id, installment_id, equipment, amount } = req.body;

    const result = await pool.query(
      `
          INSERT INTO non_recurring_heads (

            project_id,
            installment_id,
            equipment,
            amount

          )

          VALUES ($1,$2,$3,$4)

          RETURNING *
          `,
      [project_id, installment_id, equipment, amount],
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
  createNonRecurringHeads,
};
