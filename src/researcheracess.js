import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import AppSidebar from "./components/layout/AppSidebar";
import { researcherMenuConfig } from "./config/sidebar/researcherMenu";
import AddProductListReq from "./components/researcher/AddProductListReq";
import IssueNotify from "./components/researcher/IssueNotify";
import HomeLab from "../src/components/Lab1/homeLab/HomeLab";
import ChangePassword from "./components/researcher/ChangePassword";
import JoinResearcher from "./researcher_join";
import ConfirmIssue from "./components/researcher/ConfirmIssue";

function Layout({ userDetails }) {
  const location = useLocation();
  const hiddenPaths = ["/"];
  const hideNavigation = hiddenPaths.includes(location.pathname);

  if (hideNavigation) {
    return (
      <Routes>
        <Route path="/" element={<JoinResearcher userDetails={userDetails} />} />
      </Routes>
    );
  }

  return (
    <AppShell
      sidebar={
        <AppSidebar config={researcherMenuConfig} userDetails={userDetails} />
      }
    >
      <Routes>
        <Route path="/home" element={<Home userDetails={userDetails} />} />
        <Route path="/re_notify" element={<IssueNotify userDetails={userDetails} />} />
        <Route path="/masters" element={<HomeLab userDetails={userDetails} />} />
        <Route path="/addProductReq" element={<AddProductListReq userDetails={userDetails} />} />
        <Route path="/confirm-issue" element={<ConfirmIssue userDetails={userDetails} />} />
        <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
      </Routes>
    </AppShell>
  );
}

function ResearcherAccessApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default ResearcherAccessApp;
