import React, { useState } from "react";
import axios from "axios";
import ManagerNavigation from "./ManagerNavigation";
const ChangePassword = ({  userDetails= { name: '', lab: '', designation: '' } }) => {
  const [userName, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/change-password/",
        {
          user_name: userName,
          new_password: newPassword,
        }
      );

      setMessage(response.data.message);
      setUserName("");
      setNewPassword("");
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "#C5EA31",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "black", margin: 0 }}>Change Password</h1>
      </div>
     
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh", backgroundColor: "#f8f9fa" }}
      >
        <div
          className="p-5 border rounded shadow-lg bg-white"
          style={{ width: "40%", maxHeight: "90vh", overflowY: "auto" }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "5%", textAlign: "left" }}
          >
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="username"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                style={{
                  width: "300px",
                  border: "1px solid lightgray",
                  backgroundColor: "lightyellow",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="password"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: "300px",
                  border: "1px solid lightgray",
                  backgroundColor: "lightyellow",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          {message && (
            <p style={{ color: "green", marginTop: "20px" }}>{message}</p>
          )}
          {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
