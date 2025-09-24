import React from "react";
import { useState, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { FaBell } from "react-icons/fa";
import { FcAddDatabase } from "react-icons/fc";
import { NavLink } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
// import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import "../../App.css";
import "../Navigation.css";
import { FcHome } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import "../styles/styles.css";
import {
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const ResearcherAccessNavigation = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [notifications, setNotifications] = useState([]); // Store declined notifications
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const fetchDeclinedItems = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/get_all_declined_items/"
      );
      const data = await response.json();
      if (data.declined_items) {
        setNotifications(data.declined_items);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching declined items:", error);
      setNotifications([]);
    }
  };
  useEffect(() => {
    fetchDeclinedItems();
  }, []);

  const cancelNotification = async (entry_no) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/req-issue-item/cancel/${entry_no}/`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Refetch the notifications after cancellation
        fetchDeclinedItems();
      } else {
        alert(data.message || "Error cancelling the item");
      }
    } catch (error) {
      console.error("Error cancelling the notification:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-logo">
          <img src={AIWC_Transparent_Logo} alt="Left Logo" />
          {/* <img
            style={{ width: "130px", height: "130px", marginTop: "10px" }}
            src={AIWC_DNA_sequencing}
            alt="Left Logo"
          /> */}
        </div>
        <div className="header-title">
          <h1 style={{ color: "rgb(24, 81, 12)" }}>
            Advanced Institute for Wildlife Conservation
          </h1>
          <h6 style={{ color: "rgb(24, 81, 12)" }}>
            (RESEARCH, TRAINING AND EDUCATION)
          </h6>
          <h3>A Govt. of Tamil Nadu Institute</h3>
          <h6>INVENTORY</h6>
        </div>
        <div className="header-logo">
          <img src={TN_Transparent_Logo} alt="Right Logo" />
        </div>
        <div
          style={{
            left: "1350px",
            top: "100px",
            height: "0px",
          }}
        >
          <p style={{ margin: 0, marginright: "100px" }}>
            User: {userDetails.name}
          </p>
          <p style={{ margin: 0, marginright: "100px" }}>
            Lab: {userDetails.lab}
          </p>
          <p style={{ margin: 0, marginright: "100px" }}>
            Designation: {userDetails.designation}
          </p>
        </div>
      </header>
      {/* <Navbar
        bg="dark"
        variant="dark"
        id="my-nav"
        className="custom-navbar"
        style={{ width: "100%" }}
      >
        <Navbar.Brand className="app-logo" href="/home">
          <img
            src={TN_Transparent_Logo}
            width="50"
            height="50"
            className="d-inline-block align-center"
            alt="React Bootstrap logo"
          />{" "}
          INVENTORY MANAGEMENT SYSTEM
        </Navbar.Brand>
        <Button href="./Login">Logout</Button>
      </Navbar> */}
      <div className="sidebar" style={{ height: "530px" }}>
        <CDBSidebar
          className="narrow-sidebar"
          textColor="black"
          backgroundColor="gray"
        >
          <CDBSidebarHeader
            style={{ gap: "10x" }}
            prefix={<i className="fa fa-bars" />}
          >
            Researcher
            <Dropdown
              isOpen={dropdownOpen}
              toggle={toggleDropdown}
              className="d-inline ml-3"
            >
              <DropdownToggle tag="span" className="position-relative">
                <FaBell
                  size={22}
                  style={{ cursor: "pointer", color: "yellowgreen" }}
                />
                {notifications.length > 0 && (
                  <Badge
                    color="danger"
                    pill
                    className="position-absolute"
                    style={{ top: "px", right: "-5px" }}
                  >
                    {notifications.length}
                  </Badge>
                )}
              </DropdownToggle>

              {/* Updated DropdownMenu */}
              <DropdownMenu
                style={{
                  // Increased height
                  width: "250px",
                  height: "200px", // Increased height (adjust this as needed)
                  overflowY: "auto",

                  // Fixed typo (changed "overflowx" to "overflowX")
                }}
              >
                {notifications.length === 0 ? (
                  <DropdownItem
                    style={{
                      fontSize: "20px",
                      marginTop: "-11px",
                      color: "black",
                    }}
                    disabled
                  >
                    No new notifications
                  </DropdownItem>
                ) : (
                  notifications.map((notif, index) => (
                    <DropdownItem
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "1px 1px",
                        width: "290px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <strong>{notif.item_name}</strong>
                        <small style={{ display: "block", color: "black" }}>
                          {/* {notif.status} */}
                        </small>
                      </div>
                      <button
                        onClick={() => cancelNotification(notif.entry_no)}
                        style={{
                          border: "none",
                          cursor: "pointer",

                          padding: "4px 10px",
                          fontSize: "7px",
                          display: "inline-flex", // Align icon and text
                          alignItems: "left",
                          // Space between ❌ and Cancel
                          width: "100px",
                        }}
                      >
                        <span style={{ marginLeft: "9px" }}>❌ </span>
                      </button>
                    </DropdownItem>
                  ))
                )}
              </DropdownMenu>
            </Dropdown>
          </CDBSidebarHeader>
          <CDBSidebarContent>
            <CDBSidebarMenu>
              <NavLink exact to="/re_notify" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcHighPriority
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
                    Notification
                  </CDBSidebarMenuItem>
                )}
              </NavLink>

              <NavLink
                exact
                to="/addProductReq"
                activeClassName="activeClicked"
              >
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcHighPriority
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
                    Request
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink
                exact
                to="/change_password"
                activeClassName="activeClicked"
              >
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcHighPriority
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
                    Change Password
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/masters" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcHighPriority
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
                    Inventory View
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </div>
  );
};

export default ResearcherAccessNavigation;
