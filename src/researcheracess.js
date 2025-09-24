import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ResearcherAccessNavigation from "./components/researcher/accessnavigation";
import ReNotification from "./components/researcher/ReNotification";
import AddProductListReq from "./components/researcher/AddProductListReq";
import IssueNotify from "./components/researcher/IssueNotify";
import HomeLab from "./components/researcher/inventoryView";
import ChangePassword from "./components/researcher/ChangePassword";
import JoinResearcher from "./researcher_join";

function Layout({ userDetails }) {
  const location = useLocation();
  const hiddenPaths = ["/", "/add_blast","/dna","/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname); 
   return (
    <>
      {!hideNavigation && <ResearcherAccessNavigation userDetails={userDetails}/>}
      <Routes>
        <Route path="/" element={<JoinResearcher userDetails={userDetails} />} />
        <Route path="/home" element={<Home userDetails={userDetails} />} />
        <Route path="/re_notify" element={<IssueNotify userDetails={userDetails} />} />
        <Route path="/masters" element={<HomeLab userDetails={userDetails} />} />
        <Route path="/addProductReq" element={<AddProductListReq userDetails={userDetails} />} />
        <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
      </Routes>
    </>
  );
}

function ResearcherAccessApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} />
    </BrowserRouter>
  );
}

export default ResearcherAccessApp;
