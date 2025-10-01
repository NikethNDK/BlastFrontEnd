import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import ManagerNavigation from "./components/manager/ManagerNavigation";
import AppinfoManager from "./components/manager/AppinfoManager";
import ChemicalManager from "./components/manager/ChemicalManager";
import InventoryManager from "./components/manager/InventoryManager";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Notification from "./components/manager/Notification";
import ViewEntry from "./components/manager/viewEntry";
import Dasboard from "./components/manager/Dashboard";
import Project from "./components/admin/projects/Project";
import MasterFilter from "./components/manager/dashboard/MasterFilter";
import DnaManage from "./repository/dna/DnaManage";
import CommonNameDna from "./repository/dna/CommonNameDna";
import ScientificNameDna from "./repository/dna/ScientificNameDna";
import AddDNA from "./repository/dna/addDna/AddDna";
import Comparision from "../src/blast/comparision";
import ReturnDataTable from "../src/components/manager/returnData";
import ChangePassword from "../src/components/manager/ChangePassword";
import ReturnDataTableNotification from "../src/components/manager/retrunnotification";
import Join from "./jump";

function Layout({ userId, userDetails }) {
  const location = useLocation();
  const hiddenPaths = ["/", "/add_blast","/dna","/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);
  return (
    <>
    <ManagerNavigation userDetails={userDetails}>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/dashboard" element={<Dasboard userId={userId} userDetails={userDetails} />} />
        <Route path="/project" element={<Project />} />
        <Route path="/manager/appinfo" element={<AppinfoManager />} />
        <Route path="/manager/master" element={<ChemicalManager />} />
        <Route path="/manager/master_filter" element={<MasterFilter />} />
        <Route path="/manager/inventory" element={<InventoryManager />} />
        <Route path="/notification" element={<Notification userDetails={userDetails} />} />
        <Route path="/view_entry" element={<ViewEntry />} />
        <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
        <Route path="/common_name" element={<CommonNameDna />} />
        <Route path="/scientific_name" element={<ScientificNameDna />} />
        <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
        <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
        <Route path="/return_data" element={<ReturnDataTable />} />
        <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
        <Route path="/returnNoti" element={
          <ReturnDataTableNotification managerId={userId} userDetails={userDetails} />
        } />
      </Routes>
    </ManagerNavigation>
    </>
  );
}

function ManagerApp({ userId, userDetails = { userDetails } }) {
  return (
    <BrowserRouter>
      <Layout userId={userId} userDetails={userDetails} />
    </BrowserRouter>
  );
}

export default ManagerApp;
