import React, { useState } from "react";
import { loginFaculty } from "../../src/services/authservices";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./loginpage.css";
const LoginPage = () => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginFaculty({
        staff_id: staffId,
        password: password,
      });

      sessionStorage.setItem("token", res.data.token);

      sessionStorage.setItem(
        "user",

        JSON.stringify(res.data.user),
      );

      navigate("/faculty-dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="portal-logo">eC</div>

        <h1 className="login-title">e-CSRC Management</h1>

        <p className="login-subtitle">Sign in to start your session</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Staff ID</label>

            <input
              type="text"
              placeholder="Staff ID (e.g. 4321x)"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="buttonRow">
            <button type="submit" className="login-button">
              Sign In
            </button>
          </div>
        </form>

        <div className="register-section">
          New User?
          <Link to="/register" className="register-link">
            Register
          </Link>
        </div>

        <div className="login-links">
          <a href="/forgot-password" className="register-link">
            Reset Password
          </a>

          <a href="/find-userid" className="register-link">
            Find my User ID
          </a>
        </div>
        <br></br>
        <p className="login-subtitle">
          For first time login, please use your Staff ID as password.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
