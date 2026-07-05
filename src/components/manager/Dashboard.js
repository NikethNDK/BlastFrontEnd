import React, { useState, useEffect } from "react";
import ProjectFilter from "./dashboard/ProjectFilter";
import MasterFilter from "./dashboard/MasterFilter";
import EmployeeFilter from "./dashboard/EmployeeFilter";
import ReceivedFilter from "./dashboard/ReceivedFilter";
import IssuedFilter from "./dashboard/IssuedFilter";
import Inven from "../Lab1/homeLab/forDashboard";
import ReturnDataTable from "../manager/returnData";
import { FaBell } from "react-icons/fa";
import "./Dashboard.css";
import { PageLayout, PageHeader, PageToolbar, PageBody, ContentCard } from "../layout/content";

const Dashboard = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [receivedCount, setReceivedCount] = useState(0);
  const [selectedButton, setSelectedButton] = useState("");
  const [initialReceivedCount, setInitialReceivedCount] = useState(0);
  const [highlightNew, setHighlightNew] = useState(false);

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
      const currentCount = 5;
      handleReceivedCount(currentCount);
    };

    fetchInitialCount();

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

  const getNotificationBadgeClass = () => {
    if (receivedCount > 0) {
      return highlightNew ? "lims-meta-badge--warning lims-meta-badge--pulse" : "lims-meta-badge--warning";
    }
    return "lims-meta-badge--neutral";
  };

  const toolbarItems = dashboardSections.map((section) => ({
    id: section.key,
    label: section.label,
    badge: section.key === "ReceivedFilter" ? receivedCount : undefined,
    badgeHighlight: section.key === "ReceivedFilter" && highlightNew,
  }));

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        meta={
          receivedCount > 0 ? (
            <div className={`lims-meta-badge ${getNotificationBadgeClass()}`}>
              <FaBell className="lims-meta-badge-icon" />
              {receivedCount} New Item{receivedCount > 1 ? "s" : ""} Received
            </div>
          ) : null
        }
      />
      <PageToolbar
        items={toolbarItems}
        activeId={selectedButton}
        onChange={handleButtonClick}
      />
      <PageBody>
        <ContentCard flush>
          <div className="lims-data-fill">
            {selectedButton === "ProjectFilter" && <ProjectFilter />}
            {selectedButton === "Inven" && <Inven userDetails={userDetails} />}
            {selectedButton === "EmployeeFilter" && <EmployeeFilter />}
            {selectedButton === "ReceivedFilter" && (
              <ReceivedFilter setReceivedCount={handleReceivedCount} />
            )}
            {selectedButton === "IssuedFilter" && <IssuedFilter />}
            {selectedButton === "ReturnFilter" && <ReturnDataTable />}
          </div>
        </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default Dashboard;