import React, { useState, useEffect } from "react";
import { updateLoginApi, getLoginApi } from "../../services/AppinfoService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function PasswordReset ({ userDetails= { name: '', lab: '', designation: '' } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [resetStatus, setResetStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prevState) => !prevState);
  // };
  useEffect(() => {
    // Fetch user details when the component mounts
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

  return (
    <div>
      <div
        className="header"
        style={{
          backgroundColor: "#C5EA31",
          height: "70px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            paddingTop: "15px",
            marginLeft: "35%",
            color: "black",
          }}
        >
          Password Reset
        </h1>
      </div>
      

      <p></p>
      <div className="container" style={{ marginLeft: "45%", marginTop: "5%" }}>
        <label htmlFor="username" style={{ fontWeight: "bold" }}>
          Username
        </label>
        <br />
        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: 350,
            border: "1px solid lightgray",
            backgroundColor: "lightyellow",
            padding: "8px",
          }}
        >
          <option value="">Select Username</option>
          {userOptions.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
        <p></p>
        <label htmlFor="password" style={{ fontWeight: "bold" }}>
          New Password
        </label>
        <br />
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            style={{
              width: 350,
              border: "1px solid lightgray",
              backgroundColor: "lightyellow",
              padding: "8px",
              paddingRight: "40px", // Add space for the icon
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <p></p>
        <button
          onClick={handleResetPassword}
          style={{
            marginLeft: "100px",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            width: "10%",
            height: "50px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default PasswordReset;
