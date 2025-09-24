import React, { useEffect, useState } from "react";
import { Table, Button, ButtonToolbar } from "react-bootstrap";
import { CDBContainer } from "cdbreact";
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../services/AppinfoService";
import MasterListTable from "./tableResearcher";
import ResearcherNavigation from "./ResearcherNavigation";
const HomeLab = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [selectedMasterType, setSelectedMasterType] = useState(""); // Stores selected type
  const [stockLevel, setStockLevel] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);

  useEffect(() => {
    const fetchMasterTypes = async () => {
      try {
        const data = await getMastertyApi();
        setMasterTypes(data);
      } catch (error) {
        console.error("Error fetching Master Types:", error);
      }
    };
    fetchMasterTypes();
  }, []);

  useEffect(() => {
    getStockLevelApi()
      .then((response) => response.json())
      .then((data) => {
        setStockLevel(data.stock_level);
      })
      .catch((error) => {
        console.error("Error fetching stock level:", error);
        setStockLevel("Error fetching stock level");
      });
  }, []);

  const handleMasterTypeSelection = (type) => {
    setSelectedMasterType((prevType) => (prevType === type ? null : type));
  };

  const backgroundColor =
    stockLevel === "Stock is Sufficient"
      ? "#3cb371"
      : stockLevel === "Stock has to be Reorder"
      ? "red"
      : "";

  return (
    <div>
      {/* <div style={{ background: "#C5EA31", height: "70px" }} className="header"> */}
      <div
        style={{
          background: "#C5EA31",
          height: "70px",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
        className="header"
      >
        <h2
          style={{
            textAlign: "center",
            paddingTop: "15px",
            marginLeft: "285px",
          }}
        >
          INVENTORY
          {/* <label
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              background: backgroundColor,
              marginLeft: "290px",
            }}
          >
            {stockLevel}
          </label> */}
        </h2>
      </div>
     

      {/* <div
        style={{
          position: "absolute",
          left: "1350px",
          top: "100px",
          height: "100px",
        }}
      >
        <p style={{ margin: 0, marginright: "100px" }}>
          User: {userDetails.name}
        </p>
        <p style={{ margin: 0, marginright: "100px" }}>
          Lab: {userDetails.lab}
        </p>
        <p style={{ margin: 0, marginright: "100px" }}>
          designation: {userDetails.designation}
        </p>
      </div> */}
      {/* Buttons for Labware, Chemical, Equipment */}
      <div className="header-menubar" style={{ textAlign: "center" }}>
        <ButtonToolbar style={{ textAlign: "center", paddingLeft: "250px" }}>
          {["Labware", "Chemical", "Equipment"].map((type) => (
            <Button
              key={type}
              variant="primary"
              onClick={() => handleMasterTypeSelection(type)}
              style={{
                backgroundColor:
                  selectedMasterType === type ? "#C5EA31" : "white",
                width: "180px",
                margin: "10px",
                borderRadius: "20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {type} Inventory
            </Button>
          ))}
        </ButtonToolbar>
      </div>

      {/* Dropdown for other master types */}
      <div className="mb-3" style={{ textAlign: "center", marginTop: "10px" }}>
        {/* <label className="form-label">Master Type</label>
        <select
          value={selectedMasterType}
          className="form-control"
          onChange={(e) => handleMasterTypeSelection(e.target.value)}
          style={{ width: "300px", margin: "auto" }}
        >
          <option value="">Select Master Type</option>
          {masterTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select> */}
      </div>

      {/* Display MasterListTable when a selection is made */}
      {selectedMasterType && (
        <div
          className="main-container"
          style={{ marginTop: "1px", marginLeft: "150px" }}
        >
          <CDBContainer>
            <MasterListTable masterType={selectedMasterType} />
          </CDBContainer>
        </div>
      )}
    </div>
  );
};

export default HomeLab;
