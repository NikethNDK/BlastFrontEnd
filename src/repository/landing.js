import React from "react";
import { useNavigate } from "react-router-dom";
import "./main.css"; // For styling
import rightLogo from "../assets/logo.jpg";
const MainPage = () => {
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
      </div>
    </div>
  );
};

export default MainPage;
