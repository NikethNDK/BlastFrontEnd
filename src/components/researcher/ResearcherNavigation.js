import React from "react";
import { FcHome, FcDown, FcRedo, FcExternal } from "react-icons/fc";
import { useState, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { Redo, Dna, Folder } from "lucide-react";
import { FaBell, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { FcAddDatabase } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
import { FcHighPriority } from "react-icons/fc";
import {
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Header from "../Lab1/homeLab/Header";

const ResearcherNavigation = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // const [note, setNote] = useState([]);
  const [notifications, setNotifications] = useState([]); // Store declined notifications
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate()

  const fetchDeclinedItems = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/get-issue-items/?status=MGR-DCL"
      );
      const data = await response.json();
      if (data) {
        setNotifications(data);
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
    console.log("Sending request with entry_no:", entry_no); // Debugging line

    try {
      const payload = {
        id: entry_no, // Dynamically set the id
        status: "RCH-CLSD",
      };

      const response = await fetch(
        `http://localhost:8000/update-issue-items/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Remove the accepted item from the UI
        // setNote((prevNotes) =>
        //   prevNotes.filter((n) => n.entry_no !== entry_no)
        // );
        alert("Item has been closed.");
      } else {
        console.error("Failed to close item:", result.error);
      }
    } catch (error) {
      console.error("Error close item:", error);
    }
    fetchDeclinedItems();
  };
    const handleLogout = () => {
    // Add logout logic here
    window.location.href = '/';
  };

  return (
    <div style={{backgroundColor: "#f2f5e6"}}>
      <header className="headerr">
        <Header/>
      </header>

      <div className="sidebar" style={{height: "500px",backgroundColor: "#f5f5f5"}} >
        <CDBSidebar
          className="narrow-sidebar"
          textColor="black"
          backgroundColor="white"
          style={{height: "calc(100vh-150px)",marginLeft: "10px",border: "1px solid #ccc",borderRadius: "10px"}}
        >
          <CDBSidebarHeader
            style={{ gap: "x",fontSize:"2rem" }}
            prefix={<i className="fa fa-bars" />}
          >
              <button 
              onClick={() => navigate('/')} 
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                fontSize: "20px",
                marginRight: "8px"
              }}
            ><i className="fa fa-arrow-left" /></button>
            Researcher
      
          </CDBSidebarHeader>
          <CDBSidebarContent>
                        <div className="modern-sidebar-top-meta">
                <div className="modern-sidebar-user">
                  <div className="modern-sidebar-user-avatar">
                    <FaUserAlt />
                  </div>
                  <div className="modern-sidebar-user-info">
                    <div className="modern-sidebar-user-name">
                      {userDetails.name}
                    </div>
                    <div className="modern-sidebar-user-role">
                      {userDetails.designation}
                    </div>
                    <div className="modern-sidebar-user-lab">
                      {userDetails.lab}
                    </div>
                  </div>
                </div>
              </div>
            <CDBSidebarMenu>
              <Dropdown
                style={{ marginLeft: "40%" }}
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                className="d-inline ml-3"
              >
                <DropdownToggle tag="span" className="position-relative">
                  <FaBell
                    size={22}
                    style={{ cursor: "pointer", color: "yellowgreen" }}
                  />
                    <i className="fa fa-caret-down" />
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

                <DropdownMenu
                  style={{
                    width: "250px",
                    height: "200px",
                    overflowY: "auto",
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

                            padding: "1px 5px",
                            fontSize: "20px",
                            display: "inline-flex",
                            alignItems: "left",
                            width: "50px",
                          }}
                        >
                          <span style={{ marginLeft: "5px", marginTop: "8%" }}>
                            ❌{" "}
                          </span>
                        </button>
                      </DropdownItem>
                    ))
                  )}
                </DropdownMenu>
              </Dropdown>
              <NavLink exact to="/re_notify" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "#c1e62d" : "transparent",
                      color: isActive ? "#20442a" : "#20442a",
                      borderRadius: "5px",
                      fontSize: "1rem"
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
                      backgroundColor: isActive ? "#c1e62d" : "transparent",
                      color: isActive ? "#20442a" : "#20442a",
                      borderRadius: "5px",
                      fontSize: "1rem"
                    }} 
                  >
                    <Redo
                      style={{
                        marginRight: "10px",
                        fontSize: "24px",
                        color: "lightblue",
                      }}
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
                      backgroundColor: isActive ? "#c1e62d" : "transparent",
                      color: isActive ? "#20442a" : "#20442a",
                      borderRadius: "5px",
                      fontSize: "1rem"
                    }} 
                  >
                    <FcRedo
                      style={{
                        marginRight: "10px",
                        fontSize: "24px",
                        color: "blue",
                      }}
                    />
                    Change Password
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/masters" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "#c1e62d" : "transparent",
                      color: isActive ? "#20442a" : "#20442a",
                      borderRadius: "5px",
                      fontSize: "1rem"
                    }} 
                  >
                    <FcHome style={{ marginRight: "8px", fontSize: "24px" }} />
                    Inventory View
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
            
            </CDBSidebarMenu>
          <CDBSidebarFooter className="modern-sidebar-footer">
            <button
              className="modern-sidebar-logout"
              onClick={handleLogout}
              title="Logout"
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                background: "transparent",
                color: "#20442a",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "10px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </CDBSidebarFooter>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </div>
  );
};



export default ResearcherNavigation;
