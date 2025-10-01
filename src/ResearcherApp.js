import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ResearcherNavigation from "./components/researcher/ResearcherNavigation";
import ReNotification from "./components/researcher/ReNotification";
import AddProductListReq from "./components/researcher/AddProductListReq";
import IssueNotify from "./components/researcher/IssueNotify";
import HomeLab from "../src/components/Lab1/homeLab/HomeLab";
import ChangePassword from "./components/researcher/ChangePassword";
import JoinResearcher from "./researcher_jump";
import AddDNA from "./repository/dna/addDna/AddDna";
import Comparision from "../src/blast/comparision";
import DnaManage from "./repository/dna/DnaManage";

function Layout({ userDetails }) {
  const location = useLocation();
  const hiddenPaths = ["/", "/add_blast", "/dna", "/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);

  if (hideNavigation) {
    return (
      <Routes>
        <Route path="/" element={<JoinResearcher userDetails={userDetails} />} />
        <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
        <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
        <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
      </Routes>
    );
  }

  return (
    <ResearcherNavigation userDetails={userDetails}>
      <Routes>
        <Route path="/home" element={<Home userDetails={userDetails} />} />
        <Route path="/re_notify" element={<IssueNotify userDetails={userDetails} />} />
        <Route path="/masters" element={<HomeLab userDetails={userDetails} />} />
        <Route path="/addProductReq" element={<AddProductListReq userDetails={userDetails} />} />
        <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
      </Routes>
    </ResearcherNavigation>
  );
}


function ResearcherApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} />
    </BrowserRouter>
  );
}

export default ResearcherApp;
