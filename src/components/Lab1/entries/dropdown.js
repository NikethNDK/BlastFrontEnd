import React, { useState } from "react";
import IssuedProduct from "../issue/IssuedProduct";
import ReceivedProduct from "../receive/ReceivedProduct";
import "./ChemicalIssuePage.css";  // Import CSS for styling

const ChemicalIssuePage = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="center-container">
      <h2 className="page-heading">Select an Option</h2>
      <select
        className="dropdown"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="">Select a product</option>
        <option value="chemical">Received</option>
        <option value="issue">Issue</option>
      </select>

      <div className="content">
        {selectedOption === "chemical" ? <ReceivedProduct /> : <IssuedProduct />}
      </div>
    </div>
  );
};

export default ChemicalIssuePage;
