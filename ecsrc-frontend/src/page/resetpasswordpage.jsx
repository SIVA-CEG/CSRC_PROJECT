import React, { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { resetPassword } from "../services/authservices";

const ResetPasswordPage = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      );

      return;
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await resetPassword(
        token,

        { password },
      );

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Reset Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#f4f4f4",
  },

  card: {
    width: "400px",

    backgroundColor: "white",

    padding: "35px",

    borderRadius: "10px",

    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",

    padding: "12px",

    marginBottom: "15px",

    border: "1px solid #ccc",

    borderRadius: "5px",
  },

  button: {
    width: "100%",

    padding: "12px",

    backgroundColor: "#1976d2",

    color: "white",

    border: "none",

    borderRadius: "5px",

    cursor: "pointer",
  },
};

export default ResetPasswordPage;
