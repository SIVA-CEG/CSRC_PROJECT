import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { resetPasswordMobile } from "../services/authservices";

const ResetPasswordMobilePage = () => {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const { mobile_number } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      );

      return;
    }

    try {
      const res = await resetPasswordMobile({
        mobile_number,

        password,
      });

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Reset failed");
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
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
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

    background: "#f4f4f4",
  },

  card: {
    width: "400px",

    background: "white",

    padding: "30px",

    borderRadius: "10px",
  },

  input: {
    width: "100%",

    padding: "12px",

    marginBottom: "15px",
  },

  button: {
    width: "100%",

    padding: "12px",

    background: "#1976d2",

    color: "white",

    border: "none",
  },
};

export default ResetPasswordMobilePage;
