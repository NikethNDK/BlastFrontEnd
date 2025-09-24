import React from "react";
import { useNavigate } from "react-router-dom";
// import "./main.css"; // For styling
import rightLogo from "../src/assets/logo.jpg";
const JoinLab = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <h1>Welcome</h1>
      <img className="img-right" src={rightLogo} alt="Right Logo" />
      <div style={{ marginLeft: "12%" }} className="button-container">
        <button className="custom-button" onClick={() => navigate("/master")}>
          Inventory
        </button>
      </div>
    </div>
  );
};

export default JoinLab;
