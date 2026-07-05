import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/lab-design-system.css";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logoutUser } from './store/slices/userSlice';
import { Toaster } from "react-hot-toast";
import AppShell from "./components/layout/AppShell";
import AppSidebar from "./components/layout/AppSidebar";
import { labMenuConfig } from "./config/sidebar/labMenu";
import HomeLab from "../src/components/Lab1/homeLab/HomeLab";
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

function Layout({ userDetails, userId }) {
  const location = useLocation();
  const hiddenPaths = ["/", "/add_blast", "/dna", "/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Logout failed:', err);
        navigate('/');
      });
  };

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
    <AppShell
      sidebar={
        <AppSidebar
          config={labMenuConfig}
          userDetails={userDetails}
          userId={userId}
          onLogout={handleLogout}
        />
      }
    >
      <Routes>
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
        <Route path="/common_name" element={<CommonNameDna userDetails={userDetails} />} />
        <Route path="/scientific_name" element={<ScientificNameDna userDetails={userDetails} />} />
        <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
        <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
        <Route path="/retrun" element={<ReturnDataTable userDetails={userDetails} />} />
        <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
        <Route path="/equipment" element={<EquipmentList userDetails={userDetails} />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppShell>
  );
}

function CareApp({ userDetails = { name: '', lab: '', designation: '' }, userId }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} userId={userId} />
    </BrowserRouter>
  );
}

export default CareApp;
