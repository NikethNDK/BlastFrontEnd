import React, { useState, useEffect } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
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

const Dasboard = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [receivedCount, setReceivedCount] = useState(0);
  const [selectedButton, setSelectedButton] = useState(null);
  const [initialReceivedCount, setInitialReceivedCount] = useState(0);
  const [highlightNew, setHighlightNew] = useState(false); // NEW state for red color

  const getButtonStyle = (buttonName) => ({
    backgroundColor: selectedButton === buttonName ? "#4CAF50" : "#C5EA31",
    width: "140px",
    margin: "10px",
    borderRadius: "20px",
    color: "black",
    fontWeight: "bold",
  });

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    // Mock count from backend
    const fetchInitialCount = async () => {
      const currentCount = 5; // Replace with API result
      handleReceivedCount(currentCount);
    };

    fetchInitialCount();
  }, []);

  // New function to handle newly added received items
  const handleReceivedCount = (currentCount) => {
    if (initialReceivedCount === 0) {
      setInitialReceivedCount(currentCount);
      setReceivedCount(0);
    } else {
      const newItems = currentCount - initialReceivedCount;
      if (newItems > 0) {
        setReceivedCount(newItems);
        setHighlightNew(true); // show red
        // After 3 seconds remove red highlight
        setTimeout(() => {
          setHighlightNew(false);
        }, 3000);
      } else {
        setReceivedCount(0);
      }
    }
  };

  return (
    <div>
      <div style={{ background: "#C5EA31", height: "70px" }} className="header">
        <h2
          style={{
            textAlign: "center",
            paddingTop: "15px",
            marginLeft: "400px",
          }}
        >
          DASHBOARD
        </h2>
      </div>

      <div
        className="header-menubar"
        style={{ textAlign: "center", marginLeft: "35%" }}
      >
        <p id="manage"></p>
        <ButtonToolbar style={{ marginLeft: "-10%" }}>
          <Button
            variant="primary"
            onClick={() => handleButtonClick("ProjectFilter")}
            style={getButtonStyle("ProjectFilter")}
          >
            Project
          </Button>

          <Button
            variant="primary"
            onClick={() => handleButtonClick("Inven")}
            style={getButtonStyle("Inven")}
          >
            Inventory
          </Button>

          <Button
            variant="primary"
            onClick={() => handleButtonClick("EmployeeFilter")}
            style={getButtonStyle("EmployeeFilter")}
          >
            Employee
          </Button>

          {/* <Button
            variant="primary"
            onClick={() => handleButtonClick("ReceivedFilter")}
            style={getButtonStyle("ReceivedFilter")}
            className="position-relative"
          >
            Received Item
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: highlightNew ? "red" : "#198754", // RED if new, else GREEN
                transition: "background-color 0.5s ease", // Smooth transition
              }}
            >
              {receivedCount}
              <span className="visually-hidden">received items</span>
            </span>
          </Button> */}
          <Button
            variant="primary"
            onClick={() => handleButtonClick("ReceivedFilter")}
            style={getButtonStyle("ReceivedFilter")}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* <FaBell
                style={{
                  fontSize: "1.5em",
                  color:
                    receivedCount > 0
                      ? highlightNew
                        ? "red"
                        : "#198754"
                      : "gray",
                  marginRight: "8px",
                }}
              /> */}
              {receivedCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-45px",
                    height: "-171px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: highlightNew ? "red" : "#198754",
                    color: "white",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {receivedCount}
                </span>
              )}
            </div>
            &nbsp;Received Item
          </Button>
          <FaBell
            style={{
              fontSize: "1.5em",
              color:
                receivedCount > 0 ? (highlightNew ? "red" : "#198754") : "gray",
              marginRight: "8px",
              marginLeft: "-14px",
            }}
          />
          <Button
            variant="primary"
            onClick={() => handleButtonClick("IssuedFilter")}
            style={getButtonStyle("IssuedFilter")}
          >
            Issued Item
          </Button>

          <Button
            variant="primary"
            onClick={() => handleButtonClick("ReturnFilter")}
            style={getButtonStyle("ReturnFilter")}
          >
            Returned Item
          </Button>
        </ButtonToolbar>
      </div>

      <div
        className="main-container"
        style={{ marginTop: "50px", marginLeft: "150px" }}
      >
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

export default Dasboard;
