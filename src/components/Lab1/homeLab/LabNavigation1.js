import React, { useEffect, useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import {
  PlusCircle,
  Upload,
  Folder,
  Undo2,
  Database,
  Download,
  RefreshCw,
  FilePlus,
  Send,
  Dna,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
import TN_Transparent_Logo from "../../../assets/TN_Transparent_Logo.png";
import "../../../App.css";
import "../../Navigation.css";
import { FcAddDatabase } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
import { FcList } from "react-icons/fc";
import { FcBarChart } from "react-icons/fc";
import { FcHome, FcDown, FcRedo, FcExternal } from "react-icons/fc";
// import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../../assets/AIWC_DNA_sequencing.png";
import "../../styles/styles.css";
import { FaBell, FaTimes } from "react-icons/fa";
import AIWC_LIMS from "../../../assets/AIWC_LIMS.png";

import AIWC_INTRANET from "../../../assets/AIWC_INTRANET.png";
import {
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { BASE_URL } from "../../../services/AppinfoService";


const LabNavigation1 = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // NOTE: Polling removed - notifications now come from centralized polling via Redux
  // const [notifications, setNotifications] = useState([]); // Store declined notifications
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  // const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  // NOTE: Notification handling removed - now handled by centralized polling in ModernSidebar
  // const cancelNotification = async (entry_no) => { ... }
  // const removeNotification = (id) => { ... }

  return (
    // <div>
    //   {/* <Navbar
    //     bg="dark"
    //     variant="dark"
    //     id="my-nav"
    //     className="custom-navbar"
    //     style={{ width: "100%" }}
    //   >
    //     <Navbar.Brand className="app-logo" href="/home">
    //       <img
    //         src={TN_Transparent_Logo}
    //         width="50"
    //         height="50"
    //         className="d-inline-block align-center"
    //         alt="React Bootstrap logo"
    //       />{" "}
    //       INVENTORY MANAGEMENT SYSTEM
    //     </Navbar.Brand>
    //     <Button href="./Login" >
    //       Logout
    //     </Button>
    //   </Navbar> */}

    //   <header className="header">
    //     <div className="header-logo">
    //       <img src={AIWC_Transparent_Logo} alt="Left Logo" />
    //       {/* <img
    //         style={{ width: "130px", height: "130px", marginTop: "10px" }}
    //         src={AIWC_DNA_sequencing}
    //         alt="Left Logo"
    //       /> */}
    //     </div>
    //     <div className="header-title">
    //       <h1 style={{ color: "rgb(24, 81, 12)" }}>
    //         Advanced Institute for Wildlife Conservation
    //       </h1>
    //       <h6 style={{ color: "rgb(24, 81, 12)" }}>
    //         (RESEARCH, TRAINING AND EDUCATION)
    //       </h6>
    //       <h3>A Govt. of Tamil Nadu Institute</h3>
    //       <h6>INVENTORY</h6>
    //     </div>
    //     <div className="header-logo">
    //       <img src={TN_Transparent_Logo} alt="Right Logo" />
    //     </div>
    //   </header>

    <div>
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
        <Button href="./Logout">Logout</Button>
      </Navbar> */}
      <header className="header" style={{ background: "#e1dede" }}>
        <div className="header-logo">
          <img src={TN_Transparent_Logo} alt="left Logo" />
          <img src={AIWC_Transparent_Logo} alt="Left Logo" />
          <div>
            <img
              style={{ background: "#e1dede", margintop: "48px" }}
              src={AIWC_INTRANET}
              alt="Left Logo"
            />
          </div>

          {/* <img
            style={{ width: "130px", height: "130px", marginTop: "10px" }}
            src={AIWC_DNA_sequencing}
            alt="Left Logo"
          /> */}
        </div>
        <div className="header-title" style={{ background: "#e1dede" }}>
          <h1
            style={{
              color: "rgb(25, 25, 25)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Advanced Institute for Wildlife Conservation
          </h1>
          <div style={{ textAlign: "center", lineHeight: "1.5" }}>
            <h6
              style={{
                color: "rgb(16, 16, 16)",
                margin: "5px 0",
                fontSize: "15px",
              }}
            >
              (RESEARCH, TRAINING AND EDUCATION)
            </h6>
            <h4
              style={{
                color: "rgb(16, 16, 16)",
                margin: "5px 0",
                fontSize: "20px",
              }}
            >
              Tamil Nadu Forest Department
            </h4>
            <h5
              style={{
                color: "rgb(16, 16, 16)",
                margin: "5px 0",
                fontSize: "20px",
              }}
            >
              Vandalur, Chennai - 600048.
            </h5>
          </div>

          <h6
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              fontSize: "25px",
              color: "rgb(16, 16, 16)",
            }}
          >
            LABORATORY INFORMATION MANAGEMENT SYSTEM
          </h6>
        </div>
        <div
          className="header-logo"
          style={{ marginTop: "-40px", height: "130px" }}
        >
          <img src={AIWC_LIMS} alt="Right Logo" />
          <img src={AIWC_DNA_sequencing} alt="Right Logo" />
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

      <div className="sidebar">
        <CDBSidebar
          className="narrow-sidebar"
          textColor="black"
          backgroundColor="gray"
        >
          <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
            Lab Assistant
          </CDBSidebarHeader>
          {/* NOTE: Notification UI removed - notifications now handled by centralized polling in ModernSidebar */}
          {/* <Dropdown ... /> */}
          <CDBSidebarContent>
            <CDBSidebarMenu>
              <NavLink exact to="/master" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcHome style={{ marginRight: "8px", fontSize: "24px" }} />
                    Inventory View
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink
                exact
                to="/received_product"
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
                    <PlusCircle
                      FcDown
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "blue",
                      }}
                    />
                    Add Received Item
                  </CDBSidebarMenuItem>
                )}
              </NavLink>

              <NavLink
                exact
                to="/issued_product"
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
                    <FcExternal
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
                    Add Issued Item
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/transferred">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <Undo2
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "orange",
                      }}
                    />
                    Add Returned Item
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/returntable" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <Database
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "brown",
                      }}
                    />
                    Received Data
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/issuetable" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <Send
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "darkblue",
                      }}
                    />
                    Issued Data
                  </CDBSidebarMenuItem>
                )}
              </NavLink>

              <NavLink exact to="/retrun" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <RefreshCw
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "teal",
                      }}
                    />
                    Return Data
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/add_product" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FilePlus
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "darkgreen",
                      }}
                    />
                    Add New Data
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
                    <FcRedo style={{ marginRight: "8px", fontSize: "24px" }} />
                    Change Password
                  </CDBSidebarMenuItem>
                )}
              </NavLink>

              {/* <NavLink exact to="/add_blast" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <Dna
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "green",
                      }}
                    />
                    DNA Blast
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/dna" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <Folder
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
                        color: "blue",
                      }}
                    />
                    DNA Repository
                  </CDBSidebarMenuItem>
                )}
              </NavLink> */}
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </div>
  );
};

export default LabNavigation1;
