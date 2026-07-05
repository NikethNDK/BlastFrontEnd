import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./forDashboard.css";
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import MasterListTable from "./inventory";
import { PageToolbar, ContentCard } from "../../layout/content";

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

  const toolbarItems = inventoryTypes.map((type) => ({
    id: type,
    label: `${type} Inventory`,
  }));

  return (
    <div className="lims-embedded-panel">
      <div className="lims-filter-row">
        <label htmlFor="dash-lab-filter">Lab name</label>
        <select
          id="dash-lab-filter"
          value={selectedLab}
          onChange={(e) => setSelectedLab(e.target.value)}
        >
          <option value="All">All</option>
          {managerLabs.map((lab, index) => (
            <option key={index} value={lab}>
              {lab}
            </option>
          ))}
        </select>
      </div>

      <div className="dash-inventory-selector-bar">
        <PageToolbar
          items={toolbarItems}
          activeId={selectedMasterType}
          onChange={handleMasterTypeSelection}
        />
        <div className={`stock-indicator-card ${getStockLevelClass()}`}>
          <label className="stock-label">
            {stockLevel}
          </label>
        </div>
      </div>

      <ContentCard flush className="lims-fill-card">
        <MasterListTable
          masterType={selectedMasterType}
          userDetails={userDetails}
          selectedLab={selectedLab}
        />
      </ContentCard>
    </div>
  );
};

export default HomeLab1;
