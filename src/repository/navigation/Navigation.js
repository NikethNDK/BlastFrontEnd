import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import "../../App.css";
import { FcBiotech, FcBiohazard } from "react-icons/fc";

const Navigation = () => {
  return (
    <div>
      {/*  <Navbar bg="dark" variant="dark" id="my-nav" className="custom-navbar">
        <Navbar.Brand className="app-logo">
          <img
            src={DNA}
            width="40"
            height="50"
            className="d-inline-block align-center"
            alt="React Bootstrap logo"
          />{' '}
            AIWC DNA REPOSITORY BACKBONE
        </Navbar.Brand>
  </Navbar>  */}
      <div className="sidebar" style={{ height: "100vh" }}>
        <CDBSidebar textColor="black" backgroundColor="gray" maxWidth="200px">
          {/* <CDBSidebarHeader>
            Dashboard
          </CDBSidebarHeader> */}
          <CDBSidebarContent style={{ marginLeft: "-7px" }}>
            <CDBSidebarMenu>
              <NavLink exact to="/dna" activeClassName="activeClicked">
                <CDBSidebarMenuItem
                  className="black-text"
                  style={{ fontWeight: "bold" }}
                >
                  <FcBiotech style={{ marginRight: "8px", fontSize: "24px" }} />
                  Home
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/add_dna" activeClassName="activeClicked">
                <CDBSidebarMenuItem
                  className="black-text"
                  style={{ fontWeight: "bold" }}
                >
                  <FcBiohazard
                    style={{
                      marginRight: "8px",
                      fontSize: "24px",
                      color: "rgb(24, 81, 12)",
                    }}
                  />
                  New Submission
                </CDBSidebarMenuItem>
              </NavLink>
              {/* <NavLink exact to="/common_name" activeClassName="activeClicked">
                <CDBSidebarMenuItem className="black-text" style={{ fontWeight: "bold" }}>
                  <FcBiohazard  style={{ marginRight: '8px', fontSize: '24px' }} />
                    Common Name 
                  </CDBSidebarMenuItem>
              </NavLink>
            {/*    <NavLink exact to="/scientific_name" activeClassName="activeClicked">
                <CDBSidebarMenuItem className="black-text" style={{ fontWeight: "bold" }}>
                  <FcEngineering  style={{ marginRight: '8px', fontSize: '24px' }} />
                    Scientific Name 
                  </CDBSidebarMenuItem>
            </NavLink>  */}
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </div>
  );
};

export default Navigation;
