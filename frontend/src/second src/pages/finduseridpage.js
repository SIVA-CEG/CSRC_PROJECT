import React, { useState } from "react";

import { findUserId } from "../services/authservices";

const FindUserIdPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await findUserId({ email });

      alert("Staff ID sent to your email");
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
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Find User ID
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

export default FindUserIdPage;
