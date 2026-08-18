import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/AppinfoService";
import "./ChangePassword.css";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../../layout/content";

const ChangePassword = ({ userDetails = { name: '', lab: '', designation: '' } }) => {
  const [userName, setUserName] = useState(userDetails?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetails?.name) {
      setUserName(userDetails.name);
    }
  }, [userDetails?.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUser = userName.trim();
    const trimmedPassword = newPassword.trim();

    if (!trimmedPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/change-password/`, {
        user_name: trimmedUser,
        new_password: trimmedPassword,
      });

      toast.success("Password changed successfully!");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
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
                    readOnly
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
          </div>
        </div>
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default ChangePassword;