const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { staff_id, full_name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM faculty_users WHERE email=$1 OR staff_id=$2",
      [email, staff_id],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO faculty_users
      (staff_id, full_name, email, password_hash)
      VALUES ($1, $2, $3, $4)`,

      [staff_id, full_name, email, hashedPassword],
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
    const { email } = req.body;

    // FIND USER

    const user = await pool.query(
      `SELECT staff_id
       FROM faculty_users
       WHERE email=$1`,

      [email],
    );

    // EMAIL NOT FOUND

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    // CREATE MAIL TRANSPORTER

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },
    });

    // SEND EMAIL

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

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

    // FRONTEND RESPONSE

    res.json({
      message: "Staff ID sent to your email",
    });
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
        staff_id: faculty.staff_id,
        full_name: faculty.full_name,
        role: faculty.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
