import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { registerFaculty } from "../services/authservices";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staff_id: "",
    full_name: "",
    email: "",
    mobile_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      );

      return;
    }
    try {
      const res = await registerFaculty(formData);

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Faculty Registration</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="staff_id"
            placeholder="Staff ID"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="mobile_number"
            placeholder="Mobile Number"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Register
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

    padding: "20px",

    boxSizing: "border-box",

    background: "linear-gradient(135deg, #f4f7fb 0%, #e9eef5 50%, #f7f9fc 100%)",
  },

  card: {
    width: "420px",

    backgroundColor: "rgba(255,255,255,0.85)",

    border: "1px solid rgba(15,31,56,0.08)",

    backdropFilter: "blur(16px)",

    padding: "40px",

    borderRadius: "28px",

    boxShadow: "0 12px 40px rgba(15,31,56,0.12)",

    boxSizing: "border-box",
  },

  heading: {
    textAlign: "center",

    marginBottom: "8px",

    fontSize: "30px",

    fontWeight: 700,

    color: "#0f1f38",
  },

  subheading: {
    textAlign: "center",

    marginBottom: "34px",

    fontSize: "14px",

    color: "rgba(15,31,56,0.62)",
  },

  label: {
    display: "block",

    marginBottom: "8px",

    fontSize: "14px",

    fontWeight: 500,

    color: "rgba(15,31,56,0.75)",
  },

  input: {
    width: "100%",

    padding: "14px 16px",

    marginBottom: "22px",

    border: "1px solid rgba(15,31,56,0.14)",

    borderRadius: "14px",

    backgroundColor: "rgba(15,31,56,0.03)",

    color: "#0f1f38",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",
  },

  button: {
    width: "100%",

    padding: "14px",

    marginTop: "10px",

    background: "linear-gradient(135deg, #00a8cc, #3a7bd5)",

    color: "white",

    border: "none",

    borderRadius: "16px",

    fontSize: "15px",

    fontWeight: 600,

    cursor: "pointer",
  },
};


export default RegisterPage;
