import React, { useState, useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { CDBContainer } from "cdbreact";
import ProjectFilter from "./dashboard/ProjectFilter";
import MasterFilter from "./dashboard/MasterFilter";
import EmployeeFilter from "./dashboard/EmployeeFilter";
import ReceivedFilter from "./dashboard/ReceivedFilter";
import IssuedFilter from "./dashboard/IssuedFilter";
import Inven from "../Lab1/homeLab/forDashboard";
import ReturnDataTable from "../manager/returnData";
import ManagerNavigation from "../manager/ManagerNavigation";
import { FaBell } from "react-icons/fa";
import "./Dashboard.css"; // New CSS file

const Dashboard = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [receivedCount, setReceivedCount] = useState(0);
  const [selectedButton, setSelectedButton] = useState("");
  const [initialReceivedCount, setInitialReceivedCount] = useState(0);
  const [highlightNew, setHighlightNew] = useState(false);

  // Dashboard sections
  const dashboardSections = [
    { key: "ProjectFilter", label: "Project" },
    { key: "Inven", label: "Inventory" },
    { key: "EmployeeFilter", label: "Employee" },
    { key: "ReceivedFilter", label: "Received Item" },
    { key: "IssuedFilter", label: "Issued Item" },
    { key: "ReturnFilter", label: "Returned Item" }
  ];

  useEffect(() => {
    const fetchInitialCount = async () => {
      const currentCount = 5; // Replace with API result
      handleReceivedCount(currentCount);
    };

    fetchInitialCount();

    // Set default selected section
    if (dashboardSections.length > 0) {
      setSelectedButton(dashboardSections[0].key);
    }
  }, []);

  const handleReceivedCount = (currentCount) => {
    if (initialReceivedCount === 0) {
      setInitialReceivedCount(currentCount);
      setReceivedCount(0);
    } else {
      const newItems = currentCount - initialReceivedCount;
      if (newItems > 0) {
        setReceivedCount(newItems);
        setHighlightNew(true);
        setTimeout(() => {
          setHighlightNew(false);
        }, 3000);
      } else {
        setReceivedCount(0);
      }
    }
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  // Get notification status for styling
  const getNotificationClass = () => {
    if (receivedCount > 0) {
      return highlightNew ? "notification-new" : "notification-active";
    }
    return "notification-none";
  };

  return (
    <div className="dashboard-page-container">
      {/* Content Header */}
      <div className="content-header">
        <h1 className="page-title">DASHBOARD</h1>
        
        {/* Notification Indicator Card */}
        {receivedCount > 0 && (
          <div className={`notification-indicator-card ${getNotificationClass()}`}>
            <FaBell
              style={{
                fontSize: "1.2rem",
                marginRight: "0.5rem",
              }}
            />
            <label className="notification-label">
              {receivedCount} New Item{receivedCount > 1 ? 's' : ''} Received
            </label>
          </div>
        )}
      </div>
      {/* Dashboard Section Selector */}
      <div className="dashboard-selector-bar">
        <ButtonGroup className="dashboard-section-group">
          {dashboardSections.map((section) => (
            <Button
              key={section.key}
              variant="light"
              className={`dashboard-section-button ${
                selectedButton === section.key ? "active" : ""
              }`}
              onClick={() => handleButtonClick(section.key)}
            >
              {section.key === "ReceivedFilter" && receivedCount > 0 && (
                <span
                  className={`notification-badge ${
                    highlightNew ? "badge-new" : "badge-active"
                  }`}
                >
                  {receivedCount}
                </span>
              )}
              {section.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Main Data Container */}
      <div className="data-table-container">
        <CDBContainer>
          {selectedButton === "ProjectFilter" && <ProjectFilter />}
          {selectedButton === "Inven" && <Inven />}
          {selectedButton === "EmployeeFilter" && <EmployeeFilter />}
          {selectedButton === "ReceivedFilter" && (
            <ReceivedFilter setReceivedCount={handleReceivedCount} />
          )}
          {selectedButton === "IssuedFilter" && <IssuedFilter />}
          {selectedButton === "ReturnFilter" && <ReturnDataTable />}
        </CDBContainer>
      </div>
    </div>
  );
};

export default Dashboard;