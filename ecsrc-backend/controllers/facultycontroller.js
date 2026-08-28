const pool = require("../db/db");

const getCampuses = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT

      campus

      FROM faculty_profile

      ORDER BY campus
      `,
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const { campus } = req.params;

    const result = await pool.query(
      `
      SELECT DISTINCT

      department

      FROM faculty_profile

      WHERE campus = $1

      ORDER BY department
      `,

      [campus],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getFaculties = async (req, res) => {
  try {
    const {
      campus,

      department,
    } = req.params;

    const result = await pool.query(
      `
      SELECT

        id,

        staff_name,

        designation,

        dob,

        dos,

        superannuation_date

      FROM faculty_profile

      WHERE campus = $1

      AND department = $2

      ORDER BY staff_name
      `,

      [campus, department],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getCampuses,

  getDepartments,

  getFaculties,
};
