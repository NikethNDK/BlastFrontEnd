import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomeLab from "../src/components/Lab1/homeLab/HomeLab";
import LabNavigatio from "./components/Lab1/homeLab/nav";
import AddProduct from "./components/Lab1/addProduct/AddProduct";
import ReceivedProduct from "./components/Lab1/receive/ReceivedProduct";
import IssuedProduct from "./components/Lab1/issue/IssuedProduct";
import ChemicalList from "./components/Lab1/homeLab/ChemicalList";
import ReturnProduct from "./components/Lab1/return/return";
import TransferredDataTable from "./components/Lab1/entries/entry";
import ChemicalIssuePage from "./components/Lab1/entries/dropdown";
import IssueDataTable from "./components/Lab1/entries/issuetable";
import ReceivedDataTable from "./components/Lab1/entries/receivedTable";
import DnaManage from "./repository/dna/DnaManage";
import CommonNameDna from "./repository/dna/CommonNameDna";
import ScientificNameDna from "./repository/dna/ScientificNameDna";
import AddDNA from "./repository/dna/addDna/AddDna";
import Comparision from "../src/blast/comparision";
import ReturnDataTable from "./components/Lab1/entries/return";
import ChangePassword from "./components/Lab1/homeLab/ChangePassword";
import JoinLab from "./lab_join";
import EquipmentList from "./components/Lab1/homeLab/equipmentList";
import "./styles/lab-design-system.css";
import Header from "./components/Lab1/homeLab/Header";
import ModernSidebar from "./components/common/ModernSidebar";
import { BASE_URL } from "./services/AppinfoService";

function Layout({ userDetails }) {
  const [notifications, setNotifications] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    // Add logout logic here
    window.location.href = '/';
  };

  const handleNotificationClick = async (notification) => {
    try {
      const payload = {
        id: notification.entry_no,
        status: "LAB-OPEN",
      };

      const response = await fetch(`${BASE_URL}/update-issue-items/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Item has been closed.");
        // Remove notification from state
        setNotifications(prev => prev.filter(n => n.entry_no !== notification.entry_no));
      } else {
        console.error("Failed to close item");
      }
    } catch (error) {
      console.error("Error closing item:", error);
    }
  };  

  // Hide navigation only on JoinLab ("/") route
  const hiddenPaths = ["/", "/add_blast","/dna","/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);

  if (hideNavigation) {
    return (
      <Routes>
        <Route path="/" element={<JoinLab />} />
        <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
        <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
        <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
      </Routes>
    );
  }

  return (
    <>
      <div className="lab-app">
        < Header />
        <div className="lab-body-container"> 
          <ModernSidebar
            userDetails={userDetails}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onLogout={handleLogout}
          />
          <div className={`lab-main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <Routes>
              <Route path="/" element={<JoinLab />} />
              <Route path="/master" element={<HomeLab userDetails={userDetails} />} />
              <Route path="/add_product" element={<AddProduct userDetails={userDetails} />} />
              <Route path="/received_product" element={<ReceivedProduct userDetails={userDetails} />} />
              <Route path="/issued_product" element={<IssuedProduct userDetails={userDetails} />} />
              <Route path="/issuetable" element={<IssueDataTable userDetails={userDetails} />} />
              <Route path="/return_product" element={<ReturnProduct userDetails={userDetails} />} />
              <Route path="/chemical_list" element={<ChemicalList userDetails={userDetails} />} />
              <Route path="/transferred" element={<TransferredDataTable userDetails={userDetails} />} />
              <Route path="/received_issue" element={<ChemicalIssuePage userDetails={userDetails} />} />
              <Route path="/returntable" element={<ReceivedDataTable userDetails={userDetails} />} />
              <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
              <Route path="/common_name" element={<CommonNameDna userDetails={userDetails}/>} />
              <Route path="/scientific_name" element={<ScientificNameDna userDetails={userDetails} />} />
              <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
              <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
              <Route path="/retrun" element={<ReturnDataTable userDetails={userDetails} />} />
              <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
              <Route path="/equipment" element={<EquipmentList userDetails={userDetails} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

function CareApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} />
    </BrowserRouter>
  );
}

export default CareApp;
