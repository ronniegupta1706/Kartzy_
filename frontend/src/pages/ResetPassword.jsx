import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/"); // redirect to login
      }, 2000);
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
        <h2 style={{ marginBottom: "20px", color: "#FFB300", textAlign: "center" }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset Password
          </button>
        </form>
        {message && <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
