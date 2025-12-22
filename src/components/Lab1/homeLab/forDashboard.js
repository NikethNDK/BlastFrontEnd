import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonGroup } from "react-bootstrap";
import { CDBContainer } from "cdbreact";
import "./forDashboard.css"; // New CSS file
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import MasterListTable from "./inventory";

const HomeLab1 = ({userDetails}) => {
  // Get user from Redux store to get labs
  const reduxUser = useSelector((state) => state.user.user);
  
  // Get manager's assigned labs from Redux
  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);
  
  const [selectedMasterType, setSelectedMasterType] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);
  const [selectedLab, setSelectedLab] = useState("All"); // Lab filter state

  // Constants for the Inventory Types
  const inventoryTypes = ["Labware", "Chemical", "Equipment"];

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
        setStockLevel("Stock Level Unknown");
      });

    // Set a default selected type
    if (inventoryTypes.length > 0) {
      setSelectedMasterType(inventoryTypes[0]);
    }
  }, []);

  const handleMasterTypeSelection = (type) => {
    setSelectedMasterType(type);
  };

  // Determine the indicator class based on stock level for styling
  const getStockLevelClass = () => {
    if (stockLevel === "Stock is Sufficient" || stockLevel.includes("Sufficient")) {
      return "stock-sufficient";
    } else if (stockLevel === "Stock has to be Reorder" || stockLevel.includes("Reorder")) {
      return "stock-reorder";
    }
    return "stock-unknown";
  };

  return (
    <div className="fordashboard-page-container">
      {/* --- Lab Filter Dropdown --- */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <label style={{ fontWeight: "500", fontSize: "14px" }}>Lab Name:</label>
        <select
          value={selectedLab}
          onChange={(e) => setSelectedLab(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "200px",
            cursor: "pointer"
          }}
        >
          <option value="All">All</option>
          {managerLabs.map((lab, index) => (
            <option key={index} value={lab}>
              {lab}
            </option>
          ))}
        </select>
      </div>

      {/* --- Stock Indicator and Inventory Selector (Same Line) --- */}
      <div className="dash-inventory-selector-bar">
        <ButtonGroup className="inventory-type-group">
          {inventoryTypes.map((type) => (
            <Button
              key={type}
              variant="light"
              className={`inventory-type-button ${
                selectedMasterType === type ? "active" : ""
              }`}
              onClick={() => handleMasterTypeSelection(type)}
            >
              {type} Inventory
            </Button>
          ))}
        </ButtonGroup>
        <div className={`stock-indicator-card ${getStockLevelClass()}`}>
          <label className="stock-label">
            {stockLevel}
          </label>
        </div>
      </div>

      {/* --- Main Data Table Container --- */}
      <div className="data-table-container">
        <CDBContainer>
          {selectedMasterType && (
            <MasterListTable 
              masterType={selectedMasterType} 
              userDetails={userDetails}
              selectedLab={selectedLab}
            />
          )}
        </CDBContainer>
      </div>
    </div>
  );
};

export default HomeLab1;