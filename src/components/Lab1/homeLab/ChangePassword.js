import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/AppinfoService";
import "./ChangePassword.css";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../../layout/content";

const ChangePassword = ({ userDetails = { name: '', lab: '', designation: '' } }) => {
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
      <ContentCard>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="password-form-container">
            <form onSubmit={handleSubmit}>
                <div className="password-form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="password-form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="password-submit-button"
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>

              {message && (
                <div className="password-alert password-alert-success">
                  {message}
                </div>
              )}
              
              {error && (
                <div className="password-alert password-alert-error">
                  {error}
                </div>
              )}
          </div>
        </div>
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default ChangePassword;