import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { CDBContainer } from "cdbreact";
import "./forDashboard.css"; // New CSS file
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import MasterListTable from "./inventory";

const HomeLab1 = ({userDetails}) => {
  const [selectedMasterType, setSelectedMasterType] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);

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
            <MasterListTable masterType={selectedMasterType} userDetails={userDetails} />
          )}
        </CDBContainer>
      </div>
    </div>
  );
};

export default HomeLab1;