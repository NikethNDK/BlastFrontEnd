import React from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Appinfo from "./components/appinfo/Appinfo";
import Manage from "./components/appinfo/Manage";
import Chemical from "./components/chemical/Chemical";
import ChemicalManage from "./components/chemical/ChemicalManage";
import Project from "./components/admin/projects/Project";
import ProjectManage from "./components/admin/projects/ProjectManage";
import Inventory from "./components/inventory/Inventory";
import InventoryManage from "./components/inventory/InventoryManage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Register from "./repository/auth/Register";
import DnaManage from "./repository/dna/DnaManage";
import CommonNameDna from "./repository/dna/CommonNameDna";
import ScientificNameDna from "./repository/dna/ScientificNameDna";
import AddDNA from "./repository/dna/addDna/AddDna";
import MainPage from "./repository/landing";
import Comparision from "../src/blast/comparision";
function App() {
  useEffect(() => {
    setInterval(() => {
      const before = new Date().getTime();
      debugger; // This triggers DevTools
      const after = new Date().getTime();
      if (after - before > 100) {
        alert("DevTools detected! Please close it.");
        window.location.reload(); // Optional: Refresh the page
      }
    }, 1000);
  }, []);
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route path="/appinfo" element={<Appinfo />} />
        <Route path="/appinfo_manage" element={<Manage />} />

        <Route path="/chemical" element={<Chemical />} />
        <Route path="/chemical_manage" element={<ChemicalManage />} />

        <Route path="/project" element={<Project />} />
        <Route path="/project_manage" element={<ProjectManage />} />

        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory_manage" element={<InventoryManage />} />

        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<MainPage />} />
        <Route path="/dna" element={<DnaManage />} />
        <Route path="/common_name" element={<CommonNameDna />} />
        <Route path="/scientific_name" element={<ScientificNameDna />} />
        <Route path="/add_dna" element={<AddDNA />} />
        <Route path="/add_blast" element={<Comparision />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
