import React from "react";
import { FcHome, FcDown, FcRedo, FcExternal } from "react-icons/fc";
import {
  Redo,
  Dna,
  Folder,
  PlusCircle,
  Upload,
  Undo2,
  Database,
  Download,
  RefreshCw,
  FilePlus,
  Send,
} from "lucide-react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";

import AIWC_LIMS from "../../assets/AIWC_LIMS.png";
import { Button, Navbar } from "react-bootstrap";
import "../../App.css";
import "../Navigation.css";
import { FcAddDatabase } from "react-icons/fc";
import { FcList } from "react-icons/fc";
import { FcBarChart } from "react-icons/fc";
import { FcNews, FcDataSheet } from "react-icons/fc";
import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import "../styles/styles.css";

import AIWC_INTRANET from "../../assets/AIWC_INTRANET.png";

const ManagerNavigation = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
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
    //     <Button href="./Login">Logout</Button>
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
              style={{ margintop: "-17px" }}
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

      <div className="sidebar" style={{ height: "530px" }}>
        <CDBSidebar
          className="narrow-sidebar"
          textColor="black"
          backgroundColor="gray"
        >
          <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
            Manager Site
          </CDBSidebarHeader>
          <CDBSidebarContent>
            <CDBSidebarMenu>
              {/*  <NavLink exact to="/" activeClassName="activeClicked">
                <CDBSidebarMenuItem className="black-text">
                  <FcHome style={{ marginRight: '8px', fontSize: '24px' }} />
                  Dashboard
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/manager/appinfo" activeClassName="activeClicked">
                <CDBSidebarMenuItem className="black-text">
                  <FcAddDatabase style={{ marginRight: '8px', fontSize: '24px' }} />
                  Appinfo
                </CDBSidebarMenuItem>
              </NavLink> */}
              <NavLink exact to="/dashboard" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcBarChart
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
                    Dashboard
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
                        color: "yellowgreen",
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
              <NavLink exact to="/notification" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcNews style={{ marginRight: "10px", fontSize: "24px" }} />
                    Request Notification
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
              <NavLink exact to="/returnNoti" activeClassName="activeClicked">
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
                    Return Notification
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              {/* <NavLink exact to="/return_data" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcNews style={{ marginRight: "10px", fontSize: "24px" }} />
                    Return Data
                  </CDBSidebarMenuItem>
                )}
              </NavLink> */}

              {/*<NavLink exact to="/view_entry" activeClassName="activeClicked">
                <CDBSidebarMenuItem className="black-text">
                  <FcDataSheet style={{ marginRight: '10px', fontSize: '24px' }} />
                  View Entry 
                </CDBSidebarMenuItem>
            </NavLink> */}
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </div>
  );
};

export default ManagerNavigation;
