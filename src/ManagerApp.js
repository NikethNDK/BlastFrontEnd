import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import AppShell from "./components/layout/AppShell";
import AppSidebar from "./components/layout/AppSidebar";
import { managerMenuConfig } from "./config/sidebar/managerMenu";
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
  const hiddenPaths = ["/", "/add_blast", "/dna", "/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);

  if (hideNavigation) {
    return (
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
        <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
        <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
      </Routes>
    );
  }

  return (
    <AppShell
      workspace="admin"
      sidebar={
        <AppSidebar
          config={managerMenuConfig}
          userId={userId}
          userDetails={userDetails}
        />
      }
    >
      <Routes>
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
        <Route
          path="/returnNoti"
          element={<ReturnDataTableNotification managerId={userId} userDetails={userDetails} />}
        />
      </Routes>
    </AppShell>
  );
}

function ManagerApp({ userId, userDetails = {} }) {
  return (
    <BrowserRouter>
      <Layout userId={userId} userDetails={userDetails} />
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

export default ManagerApp;
