import React, { useState, useEffect } from "react";
import { updateLoginApi, getLoginApi } from "../../services/AppinfoService";
import { FaEye, FaEyeSlash, FaKey, FaUser, FaLock } from "react-icons/fa";

function PasswordReset({ userDetails = { name: "", lab: "", designation: "" } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [resetStatus, setResetStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUserOptions();
  }, []);

  const fetchUserOptions = async () => {
    try {
      const users = await getLoginApi();
      setUserOptions(users.map((user) => user.user_name));
    } catch (error) {
      console.error("Error fetching user options:", error);
    }
  };

  const handleResetPassword = async () => {
    if (!username && !password) {
      alert("Please select a username and enter a new password.");
      return;
    }

    if (!username) {
      alert("Please select a username.");
      return;
    }

    if (!password) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const userExists = userOptions.includes(username);

      if (userExists) {
        await updateLoginApi(username, { user_name: username, password });
        setResetStatus("Password reset successfully!");
        setUsername("");
        setPassword("");
        alert("Password reset successfully!");
      } else {
        setResetStatus("Username not found. Password reset failed.");
        alert("Username not found. Please check and try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetStatus("An error occurred while resetting the password.");
      alert("An error occurred. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const styles = {
    container: {
      backgroundColor: "#f2f5e6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem 1rem",
    },
    wrapper: {
      width: "100%",
      maxWidth: "600px",
    },
    card: {
      backgroundColor: "white",
      border: "1px solid #dee2e6",
      borderRadius: "0.5rem",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
      padding: "1rem",
      textAlign: "center",
    },
    iconWrapper: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "64px",
      height: "64px",
      backgroundColor: "#c5ea31",
      borderRadius: "50%",
      marginBottom: "1rem",
    },
    icon: {
      fontSize: "2rem",
      color: "white",
    },
    title: {
      color: "#495057",
      fontSize: "1.75rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      margin: "0 0 0.5rem 0",
    },
    subtitle: {
      color: "#6c757d",
      margin: "0",
      fontSize: "0.95rem",
    },
    form: {
      padding: "2rem",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#495057",
      fontWeight: "600",
      fontSize: "0.875rem",
      marginBottom: "0.5rem",
    },
    labelIcon: {
      color: "#c5ea31",
      fontSize: "0.875rem",
    },
    input: {
      width: "100%",
      padding: "0.625rem 0.75rem",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "0.25rem",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "0.625rem 0.75rem",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "0.25rem",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.75rem center",
      backgroundSize: "16px 12px",
      paddingRight: "2.5rem",
      boxSizing: "border-box",
    },
    passwordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    passwordInput: {
      width: "100%",
      padding: "0.625rem 0.75rem",
      paddingRight: "2.5rem",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      color: "#495057",
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "0.25rem",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      boxSizing: "border-box",
    },
    toggleBtn: {
      position: "absolute",
      right: "0.75rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#6c757d",
      padding: "0.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.15s ease-in-out",
    },
    button: {
      width: "100%",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#000",
      backgroundColor: "#c5ea31",
      border: "1px solid #c5ea31",
      borderRadius: "0.25rem",
      cursor: "pointer",
      transition: "all 0.15s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Password Reset</h1>
            <p style={styles.subtitle}>Reset password for an existing user</p>
          </div>

          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaUser style={styles.labelIcon} />
                Username
              </label>
              <select
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.outline = "0";
                  e.target.style.borderColor = "#80bdff";
                  e.target.style.boxShadow = "0 0 0 0.2rem rgba(0, 123, 255, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select Username</option>
                {userOptions.map((user, index) => (
                  <option key={index} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaLock style={styles.labelIcon} />
                New Password
              </label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  style={styles.passwordInput}
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.outline = "0";
                    e.target.style.borderColor = "#80bdff";
                    e.target.style.boxShadow = "0 0 0 0.2rem rgba(0, 123, 255, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dee2e6";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={styles.toggleBtn}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#007bff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
                e.currentTarget.style.borderColor = "#004085";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 0.25rem 0.5rem rgba(0, 123, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
                e.currentTarget.style.borderColor = "#007bff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = "0";
                e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(0, 123, 255, 0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <FaKey />
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;