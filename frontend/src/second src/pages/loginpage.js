import React, { useState } from "react";
import { loginFaculty } from "../services/authservices";
import { Link } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginFaculty({
        staff_id: staffId,
        password: password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerText}>Array ( )</div>

      <h1 style={styles.title}>e-CSRC Management</h1>

      <div style={styles.loginCard}>
        <p style={styles.subtitle}>Sign in to start your session</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Staff ID (e.g. 4321x)"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              style={styles.input}
            />

            <span style={styles.icon}>✉</span>
          </div>

          
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.passwordInput}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

          

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.signInBtn}>
              Sign In
            </button>

            <Link
              to="/register"
              style={{
                textDecoration: "none",
                
                flex: 1,
              }}
            >
              <button type="button" style={styles.newUserBtn}>
                New User?
              </button>
            </Link>
          </div>
        </form>

        <div style={styles.linksRow}>
          <a href="/forgot-password" style={styles.link}>
            Reset Password
          </a>

          <a href="/find-userid" style={styles.link}>
            Find myUser ID
          </a>
        </div>

        <p style={styles.footerText}>
          For first time login, please use your Staff ID as password.
        </p>
      </div>
    </div>
  );
};

const styles = {
  passwordContainer: {
    position: "relative",

    width: "100%",

    marginBottom: "15px",
  },

  passwordInput: {
    width: "100%",

    padding: "12px",

    border: "1px solid #ccc",

    borderRadius: "5px",

    boxSizing: "border-box",
  },

  eyeIcon: {
    position: "absolute",

    right: "15px",

    top: "50%",

    transform: "translateY(-50%)",

    cursor: "pointer",

    color: "#555",
  },
  container: {
    height: "100vh",
    backgroundColor: "#f3f3f3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },

  headerText: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#444",
  },

  title: {
    fontSize: "52px",
    fontWeight: "300",
    marginBottom: "35px",
    color: "#222",
  },

  loginCard: {
    width: "420px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "4px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "22px",
    color: "#555",
  },

  inputWrapper: {
    position: "relative",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "14px 45px 14px 14px",
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box",
  },

  icon: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#666",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    gap: "15px",
  },

  signInBtn: {
    width: "48%",
    padding: "13px",
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    fontSize: "18px",
    borderRadius: "4px",
    cursor: "pointer",
  },

  newUserBtn: {
    flex: 1,

    width: "100%",

    height: "65px",

    backgroundColor: "#f44336",

    color: "white",

    border: "none",

    borderRadius: "5px",

    fontSize: "18px",

    fontWeight: "bold",

    cursor: "pointer",

    whiteSpace: "nowrap",
  },

  linksRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
  },

  link: {
    textDecoration: "none",
    color: "#1976d2",
    fontSize: "18px",
  },

  footerText: {
    marginTop: "45px",
    textAlign: "center",
    fontSize: "16px",
    color: "#444",
    fontWeight: "600",
    lineHeight: "1.7",
  },
};

export default LoginPage;
