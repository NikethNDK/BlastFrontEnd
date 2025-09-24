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
import TN_Transparent_Logo from "../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../assets/AIWC_DNA_sequencing.png";
import "../components/styles/styles.css";
import "../App.css";
import "./Navigation.css";
const Navigation = () => {
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
      </header>
      {/* <Navbar bg="dark" variant="dark" id="my-nav" className="custom-navbar">
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
        <Button href="./Login" >
          Logout
        </Button>
      </Navbar> */}
      <div className="sidebar">
        <CDBSidebar
          className="narrow-sidebar"
          textColor="black"
          backgroundColor="gray"
        >
          <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
            Dashboard
          </CDBSidebarHeader>
          <CDBSidebarContent>
            <CDBSidebarMenu>
              <NavLink exact to="/" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="home" className="black-text">
                  Home
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/appinfo" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list" className="black-text">
                  Appinfo{" "}
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/chemical" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list" className="black-text">
                  Chemical Master
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/project" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list" className="black-text">
                  Project Master
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/inventory" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list" className="black-text">
                  Dashboard
                </CDBSidebarMenuItem>
              </NavLink>

              <NavLink exact to="/settings" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list" className="black-text">
                  Settings
                </CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </div>
  );
};

export default Navigation;
