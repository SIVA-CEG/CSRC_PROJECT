import React, { useState } from "react";

import { findUserId } from "../services/authservices";

const FindUserIdPage = () => {
  const [method, setMethod] = useState("email");

  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await findUserId({
        method,

        value,
      });

      alert(res.data.message);
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
        <h2>Find My User ID</h2>

        <form onSubmit={handleSubmit}>
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
              Mobile Number
            </label>
          </div>

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

          <button type="submit" style={styles.button}>
            Continue
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
  },
};

export default FindUserIdPage;
