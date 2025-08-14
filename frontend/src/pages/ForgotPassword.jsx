import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FFF9C4",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "400px",
        width: "100%",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#FFB300", textAlign: "center" }}>Forgot Password</h2>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px", textAlign: "center" }}>
          Enter your email to receive a password reset link
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "14px"
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#FFB300",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Send Reset Link
          </button>
        </form>
        {message && <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
