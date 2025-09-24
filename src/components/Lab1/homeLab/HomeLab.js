import React, { useEffect, useState } from "react";
import { Table, Button, ButtonToolbar, Modal } from "react-bootstrap";
import { CDBContainer } from "cdbreact";
import "../../../App.css";
import { FaBell, FaTimes, FaEllipsisV } from "react-icons/fa";
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import MasterListTable from "./inventory";
import LabNavigation1 from "./LabNavigation1";

const HomeLab = ({ userDetails = { name: '', lab: '', designation: '' } }) => {
  const [selectedMasterType, setSelectedMasterType] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);

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
    setSelectedMasterType((prevType) => (prevType === type ? "" : type));
  };

  const backgroundColor =
    stockLevel === "Stock is Sufficient"
      ? "#3cb371"
      : stockLevel === "Stock has to be Reorder"
      ? "red"
      : "";

  return (
    <div>
      {/* <LabNavigation1 userDetails={userDetails} /> */}
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{
            textAlign: "center",
            paddingTop: "18px",
            marginLeft: "288px",
          }}
        >
          INVENTORY
          <label
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              background: backgroundColor,
              marginLeft: "290px",
            }}
          >
            {stockLevel}
          </label>
        </h2>
        
        {/* Three-dot menu button */}
      
      </div>


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

      <div
        className="main-container"
        style={{ marginTop: "1px", marginLeft: "150px" }}
      >
        <CDBContainer>
          <MasterListTable masterType={selectedMasterType || ""} />
        </CDBContainer>
      </div>
    </div>
  );
};

export default HomeLab;