import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { registerFaculty } from "../services/authservices";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staff_id: "",
    full_name: "",
    email: "",
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

    backgroundColor: "#f4f4f4",
  },

  card: {
    width: "400px",

    backgroundColor: "white",

    padding: "35px",

    borderRadius: "10px",

    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  heading: {
    textAlign: "center",

    marginBottom: "25px",
  },

  input: {
    width: "100%",

    padding: "12px",

    marginBottom: "15px",

    border: "1px solid #ccc",

    borderRadius: "5px",

    fontSize: "16px",

    boxSizing: "border-box",
  },

  button: {
    width: "100%",

    padding: "12px",

    backgroundColor: "#1976d2",

    color: "white",

    border: "none",

    borderRadius: "5px",

    fontSize: "16px",

    cursor: "pointer",
  },
};

export default RegisterPage;
