import React from "react";
import { useNavigate } from "react-router-dom";
// import "./main.css"; // For styling
import rightLogo from "../src/assets/logo.jpg";
const Join = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <h1>Welcome</h1>
      <img className="img-right" src={rightLogo} alt="Right Logo" />
      <div className="button-container">
        <button
          className="custom-button"
          onClick={() => navigate("/add_blast")}
        >
          DNA Blast
        </button>
        <button className="custom-button" onClick={() => navigate("/dna")}>
          DNA Repository
        </button>
        <button className="custom-button" onClick={() => navigate("/dashboard")}>
         Inventory
        </button>
      </div>
    </div>
  );
};

export default Join;
