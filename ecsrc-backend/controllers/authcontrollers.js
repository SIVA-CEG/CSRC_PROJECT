const axios = require("axios");
const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { staff_id, full_name, email, mobile_number, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM faculty_users WHERE email=$1 OR staff_id=$2",
      [email, staff_id],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {

  return res.status(400).json({

    message:

    "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"

  });

}
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO faculty_users

(

  staff_id,
  full_name,
  email,
  mobile_number,
  password_hash

)

VALUES ($1,$2,$3,$4,$5)`,

      [staff_id, full_name, email, mobile_number, hashedPassword],
    );

    res.status(201).json({
      message: "Faculty registered successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.findUserId = async (req, res) => {
  try {
    const {
      method,

      value,
    } = req.body;

    let user;

    // EMAIL SEARCH

    if (method === "email") {
      user = await pool.query(
        `SELECT
          staff_id,
          email,
          mobile_number

         FROM faculty_users

         WHERE email=$1`,

        [value],
      );
    }

    // MOBILE SEARCH
    else {
      user = await pool.query(
        `SELECT
          staff_id,
          email,
          mobile_number

         FROM faculty_users

         WHERE mobile_number=$1`,

        [value],
      );
    }

    // USER NOT FOUND

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // EMAIL METHOD

    if (method === "email") {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",

        port: 465,

        secure: true,

        auth: {
          user: process.env.EMAIL_USER,

          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: user.rows[0].email,

        subject: "Your e-CSRC Staff ID",

        html: `

          <div style="font-family: Arial">

            <h2>
              e-CSRC Portal
            </h2>

            <p>
              Your Staff ID is:
            </p>

            <h3 style="color:#1976d2;">

              ${user.rows[0].staff_id}

            </h3>

          </div>

        `,
      });

      return res.json({
        message: "Staff ID sent to your email",
      });
    }

    // MOBILE SMS METHOD
    else {
      await axios({
        method: "POST",

        url: "https://www.fast2sms.com/dev/bulkV2",

        headers: {
          authorization: process.env.FAST2SMS_API_KEY,

          "Content-Type": "application/json",
        },

        data: {
          route: "q",

          message: `Your Staff ID is:
     ${user.rows[0].staff_id}`,

          language: "english",

          numbers: user.rows[0].mobile_number,
        },
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.sendOtp = async (req, res) => {
  try {
    const {
      mobile_number,

      purpose,
    } = req.body;

    // CHECK USER EXISTS

    const user = await pool.query(
      `SELECT *
       FROM faculty_users
       WHERE mobile_number=$1`,

      [mobile_number],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "Mobile number not found",
      });
    }

    // GENERATE OTP

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // EXPIRY TIME

    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // SAVE OTP

    await pool.query(
      `INSERT INTO otp_codes

  (

    mobile_number,

    otp,

    expiry,

    purpose

  )

  VALUES ($1,$2,$3,$4)`,

      [mobile_number, otp, expiry, purpose],
    );

    // TEMPORARY CONSOLE

    console.log("OTP:", otp);
await axios({
  method: "POST",

  url: "https://www.fast2sms.com/dev/bulkV2",

  headers: {
    authorization: process.env.FAST2SMS_API_KEY,

    "Content-Type": "application/json",
  },

  data: {
    route: "q",

    message: `Your OTP for password reset is ${otp}`,

    language: "english",

    numbers: mobile_number,
  },
});
    // LATER:
    // MSG91 SMS API HERE

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const {
      mobile_number,

      otp,

      purpose,
    } = req.body;

    const result = await pool.query(
      `SELECT *

       FROM otp_codes

       WHERE mobile_number=$1

        AND otp=$2

        AND purpose=$3

       AND verified=FALSE

       ORDER BY created_at DESC

       LIMIT 1`,

      [mobile_number, otp, purpose],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const otpData = result.rows[0];

    // CHECK EXPIRY

    if (new Date(otpData.expiry) < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // MARK VERIFIED

    await pool.query(
      `UPDATE otp_codes

       SET verified=TRUE

       WHERE id=$1`,

      [otpData.id],
    );

    // GET STAFF ID

    const user = await pool.query(
      `SELECT staff_id

       FROM faculty_users

       WHERE mobile_number=$1`,

      [mobile_number],
    );

    if (purpose === "find_userid") {
      return res.json({
        message: "OTP verified",

        staff_id: user.rows[0].staff_id,
      });
    } else if (purpose === "reset_password") {
      return res.json({
        message: "OTP verified",

        resetAllowed: true,
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      "SELECT * FROM faculty_users WHERE email=$1",

      [email],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(Date.now() + 3600000);

    await pool.query(
      `UPDATE faculty_users
      SET reset_token=$1,
      reset_token_expiry=$2
      WHERE email=$3`,

      [resetToken, expiry, email],
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "Reset Your Password",

      html: `

        <h2>Password Reset</h2>

        <p>
          Click below link to reset password:
        </p>

        <a href="${resetLink}">
          Reset Password
        </a>

      `,
    });

    res.json({
      message: "Reset link sent to email",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const user = await pool.query(
      `SELECT * FROM faculty_users
       WHERE reset_token=$1`,

      [token],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "Invalid token",
      });
    }

    const faculty = user.rows[0];

    if (new Date(faculty.reset_token_expiry) < new Date()) {
      return res.status(400).json({
        message: "Token expired",
      });
    }
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
  });
}
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE faculty_users

       SET password_hash=$1,

       reset_token=NULL,

       reset_token_expiry=NULL

       WHERE id=$2`,

      [hashedPassword, faculty.id],
    );

    res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { staff_id, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM faculty_users WHERE staff_id=$1",
      [staff_id],
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid Staff ID",
      });
    }

    const faculty = user.rows[0];

    const isMatch = await bcrypt.compare(password, faculty.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: faculty.id,
        role: faculty.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      token,

      user: {
        id: user.rows[0].id,

        staff_id: user.rows[0].staff_id,

        email: user.rows[0].email,

        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
