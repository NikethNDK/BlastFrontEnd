import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
import "../../App.css";
import "../Navigation.css";
import { FcAddDatabase } from "react-icons/fc";
import { FcList } from "react-icons/fc";
import { FcBarChart } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcNews, FcDataSheet } from "react-icons/fc";
import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import "../styles/styles.css";

const ManagerAccessNavigation = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  return (
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
        <Button href="./Login">Logout</Button>
      </Navbar> */}

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
                    <FcAddDatabase
                      style={{ marginRight: "8px", fontSize: "24px" }}
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
                    <FcAddDatabase
                      style={{
                        marginRight: "8px",
                        fontSize: "24px",
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
                    <FcAddDatabase
                      style={{ marginRight: "8px", fontSize: "24px" }}
                    />
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
                    <FcAddDatabase
                      style={{ marginRight: "8px", fontSize: "24px" }}
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

export default ManagerAccessNavigation;
