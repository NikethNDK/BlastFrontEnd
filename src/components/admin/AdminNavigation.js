import React, { useState } from "react";
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
// import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import { FcHome, FcRedo, FcNews } from "react-icons/fc";
import { GrTableAdd } from "react-icons/gr";
import { FcBarChart } from "react-icons/fc";
import { FcServices } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { FcContacts } from "react-icons/fc";
import { FcAddDatabase } from "react-icons/fc";
import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import AIWC_LIMS from "../../assets/AIWC_LIMS.png";
import AWIC_INTRANET from "../../assets/AIWC_INTRANET.png";
import "../styles/styles.css";

const AdminNavigation = () => {
  return (
    <div >
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
      <header className="header" style={{ background:"#e1dede"}} >
        <div className="header-logo">
        <img src={TN_Transparent_Logo} alt="left Logo"  />
          <img src={AIWC_Transparent_Logo} alt="Left Logo" />
          <div >
          <img   src={AWIC_INTRANET} style={{ margintop: "48px",}}alt="Left Logo" />
          </div>
          
        </div >
        <div className="header-title" style={{ background:"#e1dede" }}>
          <h1 style={{ color: "rgb(25, 25, 25)", fontFamily: "Poppins, sans-serif" }}>
            Advanced Institute for Wildlife Conservation
          </h1>
          <div style={{ textAlign: "center", lineHeight: "1.5" }}>
  <h6 style={{ color: "rgb(16, 16, 16)", margin: "5px 0", fontSize: "15px" }}>
    (RESEARCH, TRAINING AND EDUCATION)
  </h6>
  <h4 style={{ color: "rgb(16, 16, 16)", margin: "5px 0" , fontSize: "20px"}}>
    Tamil Nadu Forest Department
  </h4>
  <h5 style={{ color: "rgb(16, 16, 16)", margin: "5px 0", fontSize: "20px" }}>
    Vandalur, Chennai - 600048.
  </h5>
</div>

          <h6 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold", fontSize: "25px" , color: "rgb(16, 16, 16)",}}>LABORATORY INFORMATION MANAGEMENT SYSTEM</h6>
        </div>
        <div className="header-logo" style={{marginTop:"-40px",height:"130px",}}>
        <img src={AIWC_LIMS} alt="Right Logo" />
          <img src={AIWC_DNA_sequencing} alt="Right Logo" />
        </div>
      </header>

      <div className="sidebar" style={{ height: "570px" }}>
        <CDBSidebar
          className="narrow-sidebar"
          textColor="black"
          backgroundColor="gray"
        >
          <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
            Admin
          </CDBSidebarHeader>
          <CDBSidebarContent>
            <CDBSidebarMenu>
              <NavLink
                exact
                to="/admin/project_manage"
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
                    <FcBarChart
                      style={{ marginRight: "10px", fontSize: "24px" }}
                    />
                    Project Master
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/register" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <FcBusinessman
                      style={{ marginRight: "10px", fontSize: "24px" }}
                    />
                    Employee Registration
                  </CDBSidebarMenuItem>
                )}
              </NavLink>

              <NavLink
                exact
                to="/password_reset"
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
                    <FcRedo style={{ marginRight: "10px", fontSize: "24px" }} />
                    Password Reset
                  </CDBSidebarMenuItem>
                )}
              </NavLink>

              <NavLink
                exact
                to="/employee_manage"
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
                    <FcContacts
                      style={{ marginRight: "10px", fontSize: "24px" }}
                    />
                    Employee Master
                  </CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink exact to="/master_table" activeClassName="activeClicked">
                {({ isActive }) => (
                  <CDBSidebarMenuItem
                    style={{
                      backgroundColor: isActive ? "green" : "transparent",
                      color: isActive ? "white" : "black",
                      borderRadius: "5px",
                    }}
                  >
                    <GrTableAdd
                      style={{
                        marginRight: "10px",
                        fontSize: "24px",
                        color: "#00BCD4",
                      }}
                    />
                    Master Table
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

export default AdminNavigation;
