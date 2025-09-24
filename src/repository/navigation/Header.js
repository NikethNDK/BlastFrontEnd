import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom"; // Import NavLink instead of Link
import DNA from "../../assets/DNA.jpg";
import DNA1 from "../../assets/DNA1.jpeg";
import LogoPNG from "../../assets/LogoPNG.png";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import leftLogo from "../../assets/elephant.png";
import rightLogo from "../../assets/logo.jpg";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import AIWC_LIMS from "../../assets/AIWC_LIMS.png";

import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";


import AWIC_INTRANET from "../../assets/AIWC_INTRANET.png";

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Navigate to the "/dna" page
  };

  return (
    <header className="header" style={{ background:"#e1dede"}}>
      <div className="header-logo">
      
              <img src={TN_Transparent_Logo} alt="left Logo" />
        <img src={leftLogo} alt="Left Logo" />
        <div>
        
        <img style={{ margintop: "-17px"}}  src={AWIC_INTRANET} alt="Left Logo" />
        </div>           
      </div>
      <div className="header-title" style={{ background:"#e1dede"}}>
          <h1 style={{ color: "rgb(25, 25, 25)", fontFamily: "Poppins, sans-serif" ,marginTop:"2px"}}>
            Advanced Institute for Wildlife Conservation
          </h1>
          <div style={{ textAlign: "center", lineHeight: "1.5" }}>
  <h6 style={{ color: "rgb(16, 16, 16)", margin: "5px 0", fontSize: "15px" }}>
    (RESEARCH, TRAINING AND EDUCATION)
  </h6>
  <h4 style={{ color: "rgb(16, 16, 16)", margin: "5px 0" , fontSize: "20px"}}>
    Tamil Nadu Forest Department
  </h4>
  <h5 style={{ color: "rgb(16, 16, 16)", margin: "5px 0", fontSize: "20px" }}>
    Vandalur, Chennai - 600048.
  </h5>
        <h5 style={{ fontFamily: "Poppins, sans-serif" , fontWeight: "bold",display: "flex", marginLeft: "30%", gap: "17px",color: "rgb(16, 16, 16)" }}>
         
        LABORATORY INFORMATION MANAGEMENT SYSTEM          <button
            onClick={() => navigate("/")}
            className="btn btn-primary"
            style={{ marginRight: "16px" }}
          >
            Back
          </button>
          <button
            onClick={() => navigate("/add_blast")}
            className="btn btn-primary"
            style={{ marginRight: "16px", }}
          >
            Blast
          </button>
        </h5>
      </div>
      </div>
      <div className="header-logo"  style={{marginTop:"-40px",height:"130px",}}>
        
        <img src={AIWC_LIMS } alt="Right Logo" />
        <img src={AIWC_DNA_sequencing} alt="Right Logo" />
      </div>
    </header>
  );
};

export default Header;
