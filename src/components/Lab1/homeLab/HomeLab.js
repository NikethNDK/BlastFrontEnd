import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap"; // Using ButtonGroup for a cleaner look
import { CDBContainer } from "cdbreact";
import "./HomeLab.css"; // Link to the new CSS file
import { FaBell, FaTimes, FaEllipsisV } from "react-icons/fa";
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import MasterListTable from "./inventory";
import LabNavigation1 from "./LabNavigation1"; // Assuming this is the main navigation/sidebar

const HomeLab = ({ userDetails = { name: '', lab: '', designation: '' } }) => {
  const [selectedMasterType, setSelectedMasterType] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  // const [masterTypes, setMasterTypes] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);

  // Constants for the Inventory Types
  const inventoryTypes = ["Labware", "Chemical", "Equipment"];

  // useEffect(() => {
  //   const fetchMasterTypes = async () => {
  //     try {
  //       const data = await getMastertyApi();
  //       setMasterTypes(data);
  //     } catch (error) {
  //       console.error("Error fetching Master Types:", error);
  //     }
  //   };
  //   fetchMasterTypes();
  // }, []);

  useEffect(() => {
    // Fetch Stock Level
    getStockLevelApi()
      .then((response) => response.json())
      .then((data) => {
        setStockLevel(data.stock_level);
      })
      .catch((error) => {
        console.error("Error fetching stock level:", error);
        setStockLevel("Stock Level Unknown");
      });

    // Set a default selected type if masterTypes is not empty
    if (inventoryTypes.length > 0) {
      setSelectedMasterType(inventoryTypes[0]);
    }
  }, []);
  console.log('stock level', stockLevel)

  const handleMasterTypeSelection = (type) => {
    setSelectedMasterType(type);
  };

  // Determine the indicator class based on stock level for styling
  const getStockLevelClass = () => {
    if (stockLevel.includes("Sufficient")) {
      return "stock-sufficient";
    } else if (stockLevel.includes("Reorder")) {
      return "stock-reorder";
    }
    return "stock-unknown";
  };

  return (
    <div className="homelab-page-container">
      {/* NOTE: Assuming the ModernSidebar (or LabNavigation1) is positioned fixed/sticky, 
        and the content of HomeLab starts to its right. 
        We use the padding/margin in the CSS to account for the sidebar.
      */}

      {/* --- Main Content Header --- */}
      <div className="content-header">
        <h1 className="page-title">INVENTORY MANAGEMENT</h1>
        
        {/* Stock Level Indicator Card */}
        <div className={`stock-indicator-card ${getStockLevelClass()}`}>
          <label className="stock-label">
            {stockLevel}
          </label>
        </div>
      </div>

      {/* --- Inventory Type Selector --- */}
      <div className="inventory-selector-bar">
        <ButtonGroup className="inventory-type-group">
          {inventoryTypes.map((type) => (
            <Button
              key={type}
              variant="light" // Base button is light
              className={`inventory-type-button ${
                selectedMasterType === type ? "active" : ""
              }`}
              onClick={() => handleMasterTypeSelection(type)}
            >
              {type} Inventory
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* --- Main Data Table Container --- */}
      <div className="data-table-container">
        <CDBContainer>
          {/* Render the MasterListTable component, which will filter data based on the selected type.
            It defaults to showing nothing or all if selectedMasterType is empty.
          */}
          <MasterListTable masterType={selectedMasterType} />
        </CDBContainer>
      </div>
    </div>
  );
};

export default HomeLab;