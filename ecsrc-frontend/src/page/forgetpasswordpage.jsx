import React, { useState } from "react";

import { forgotPassword, sendOtp, verifyOtp } from "../services/authservices";

import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [method, setMethod] = useState("email");

  const [value, setValue] = useState("");

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  // SEND OTP / EMAIL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      // EMAIL FLOW

      if (method === "email") {
        res = await forgotPassword({
          email: value,
        });

        alert(res.data.message);
      }

      // MOBILE OTP FLOW
      else {
        const res = await sendOtp({
          mobile_number: value,

          purpose: "reset_password",
        });

        console.log(res.data);

        setOtpSent(true);

        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // VERIFY OTP

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({
        mobile_number: value,

        otp,

        purpose: "reset_password",
      });

      alert(res.data.message);

      // NAVIGATE TO RESET PAGE

      navigate(
        "/reset-password-mobile",

        {
          state: {
            mobile_number: value,
          },
        },
      );
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          {/* RECOVERY METHOD */}

          <div style={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="email"
                checked={method === "email"}
                onChange={(e) => setMethod(e.target.value)}
              />
              Email
            </label>

            <label>
              <input
                type="radio"
                value="mobile"
                checked={method === "mobile"}
                onChange={(e) => setMethod(e.target.value)}
              />
              Mobile OTP
            </label>
          </div>

          {/* EMAIL / MOBILE INPUT */}

          <input
            type="text"
            placeholder={
              method === "email" ? "Enter Email" : "Enter Mobile Number"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={styles.input}
            required
          />

          {/* SEND BUTTON */}

          <button type="submit" style={styles.button}>
            {method === "email" ? "Send Reset Link" : "Send OTP"}
          </button>
        </form>

        {/* OTP SECTION */}

        {method === "mobile" && otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              style={styles.button}
            >
              Verify OTP
            </button>
          </>
        )}
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

    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  radioGroup: {
    display: "flex",

    justifyContent: "space-around",

    marginBottom: "20px",
  },

  input: {
    width: "100%",

    padding: "12px",

    marginBottom: "15px",

    boxSizing: "border-box",
  },

  button: {
    width: "100%",

    padding: "12px",

    background: "#1976d2",

    color: "white",

    border: "none",

    cursor: "pointer",

    marginBottom: "10px",
  },
};

export default ForgotPasswordPage;
