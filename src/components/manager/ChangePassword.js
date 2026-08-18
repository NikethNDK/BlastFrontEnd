import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../services/AppinfoService";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";

const ChangePassword = ({  userDetails= { name: '', lab: '', designation: '' } }) => {
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
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
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
                  readOnly
                  required
                  style={{
                    width: "300px",
                    border: "1px solid lightgray",
                    backgroundColor: "#f3f4f6",
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
          </div>
        </div>
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default ChangePassword;
