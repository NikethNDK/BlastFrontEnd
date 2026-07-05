import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../services/AppinfoService";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";

const ChangePassword = ({ userDetails= { name: '', lab: '', designation: '' } }) => {
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
        `${BASE_URL}/change-password/`,
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
    <PageLayout>
      <PageHeader title="Change password" />
      <PageBody>
      <div className="lims-auth-form-center">
        <ContentCard className="lims-auth-form-panel">
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
        </ContentCard>
      </div>
      </PageBody>
    </PageLayout>
  );
};

export default ChangePassword;
