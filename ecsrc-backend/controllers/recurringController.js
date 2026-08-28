const pool = require("../db/db");

const createRecurringHeads = async (req, res) => {
  try {
    const {
      project_id,
      installment_id,
      consumables,
      travel,
      contingency,
      ssr_budget,
    } = req.body;

    await pool.query(
      `
        INSERT INTO recurring_heads (

          project_id,
          installment_id,
          consumables,
          travel,
          contingency,
          ssr_budget

        )

        VALUES ($1,$2,$3,$4,$5,$6)
        `,
      [
        project_id,
        installment_id,
        consumables,
        travel,
        contingency,
        ssr_budget,
      ],
    );

    res.status(201).json({
      message: "Recurring heads saved",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createRecurringHeads,
};
