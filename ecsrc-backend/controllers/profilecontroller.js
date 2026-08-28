const pool = require("../db/db");

// A cleared <input type="date"> sends "" (or the field may be missing
// entirely), and Postgres rejects "" for a `date` column just like it
// rejected a stray "4" — normalize both to NULL instead of crashing.
const toDateOrNull = (val) => {
  if (!val || typeof val !== "string" || val.trim() === "") return null;
  return val;
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await pool.query(
      `SELECT *
       FROM faculty_profile
       WHERE user_id = $1`,
      [userId],
    );

    // NO PROFILE ROW YET (new faculty_users signup that hasn't filled in
    // their profile) — return an empty object instead of a 404 so the
    // frontend just renders a blank, editable form. The first "Save
    // Profile" click will create the row via the upsert in updateProfile
    // below.
    if (profile.rows.length === 0) {
      return res.json({ user_id: Number(userId) });
    }

    // SUCCESS
    res.json(profile.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      salutation,
      initial,
      staff_name,
      designation,
      department,
      campus,
      intercom,
      mobile,
      dob,
      dos,
      superannuation_date,
      aadhaar_number,
      pan_number,
      bank_name,
      branch,
      account_number,
      ifsc_code,
      account_type,
    } = req.body;

    // Does a faculty_profile row already exist for this user?
    const existing = await pool.query(
      `SELECT id FROM faculty_profile WHERE user_id = $1`,
      [userId],
    );

    if (existing.rows.length === 0) {
      // First-time save for this user — INSERT a brand new row instead of
      // running an UPDATE that would silently match zero rows and lose
      // the data the user just typed in.
      await pool.query(
        `INSERT INTO faculty_profile (
           user_id, salutation, initial, staff_name, designation,
           department, campus, intercom, mobile, dob, dos,
           superannuation_date, aadhaar_number, pan_number, bank_name,
           branch, account_number, ifsc_code, account_type
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
         )`,
        [
          userId,
          salutation,
          initial,
          staff_name,
          designation,
          department,
          campus,
          intercom,
          mobile,
          toDateOrNull(dob),
          toDateOrNull(dos),
          toDateOrNull(superannuation_date),
          aadhaar_number,
          pan_number,
          bank_name,
          branch,
          account_number,
          ifsc_code,
          account_type,
        ],
      );
    } else {
      // Row already exists — same UPDATE as before.
      await pool.query(
        `UPDATE faculty_profile
         SET
           salutation=$1,
           initial=$2,
           staff_name=$3,
           designation=$4,
           department=$5,
           campus=$6,
           intercom=$7,
           mobile=$8,
           dob=$9,
           dos=$10,
           superannuation_date=$11,
           aadhaar_number=$12,
           pan_number=$13,
           bank_name=$14,
           branch=$15,
           account_number=$16,
           ifsc_code=$17,
           account_type=$18
         WHERE user_id=$19`,
        [
          salutation,
          initial,
          staff_name,
          designation,
          department,
          campus,
          intercom,
          mobile,
          toDateOrNull(dob),
          toDateOrNull(dos),
          toDateOrNull(superannuation_date),
          aadhaar_number,
          pan_number,
          bank_name,
          branch,
          account_number,
          ifsc_code,
          account_type,
          userId,
        ],
      );
    }

    res.json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { userId, documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const filePath = `/uploads/${req.file.filename}`;

    let columnName = "";

    // MAP DOCUMENT TYPE
    if (documentType === "aadhaar") {
      columnName = "aadhaar_file";
    } else if (documentType === "pan") {
      columnName = "pan_file";
    } else if (documentType === "passbookOrCheque") {
      columnName = "passbook_file";
    }

    // Does a faculty_profile row exist yet? A user could upload a document
    // before ever saving the rest of their profile, so this needs the same
    // upsert treatment as updateProfile above.
    const existing = await pool.query(
      `SELECT id FROM faculty_profile WHERE user_id = $1`,
      [userId],
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO faculty_profile (user_id, ${columnName}) VALUES ($1, $2)`,
        [userId, filePath],
      );
    } else {
      await pool.query(
        `UPDATE faculty_profile
         SET ${columnName} = $1
         WHERE user_id = $2`,
        [filePath, userId],
      );
    }

    res.json({
      message: "Document uploaded",
      filePath,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};
