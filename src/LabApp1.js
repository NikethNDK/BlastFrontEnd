import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LabNavigation from './components/lab/LabNavigation';
import Home from "./components/Home";
import Appinfo from "./components/appinfo/Appinfo";
import Manage from "./components/appinfo/Manage";
import Chemical from "./components/chemical/Chemical"
import ChemicalManage from "./components/chemical/ChemicalManage"
import Inventory from './components/inventory/Inventory'
import InventoryManage from './components/inventory/InventoryManage';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import ApprovalChemicalModal from './components/chemical/ApprovalChemicalModal';
import ApprovalInventoryModal from './components/inventory/ApprovalInventoryModal';
import TaskManage from './components/lab/TaskManage';
import AddResearcherIssueTask from './components/lab/AddResearcherIssueTask';
import InventoryTrans from './components/inventory/InventoryTrans';
import ReceivedItems from './components/inventory/ReceivedItems';
import IssuedItems from './components/inventory/IssuedItems';
import NoteStatus from './components/chemical/NoteStatus';
import RequestResearcher from './components/lab/RequestResearcher';


function LabApp1() {
  return (
    <BrowserRouter>
      <LabNavigation />
        <Routes>
          <Route path="/" element={<InventoryTrans/>} />
          <Route exact path="/home" element={<InventoryTrans/>} />
          <Route path="/lab_assistant/appinfo" element={<Appinfo/>} />
          <Route path="/lab_assistant/appinfo_manage" element={<Manage/>} />
    
          <Route path="/lab_assistant/chemical" element={<Chemical/>} />
          <Route path="/lab_assistant/master_manage" element={<ChemicalManage/>} />
          <Route path="/lab_assistant/chemical_approval" element={<ApprovalChemicalModal/>} />
          <Route path="/lab_assistant/approval_status" element={<NoteStatus/>} />
    
          <Route path="/lab_assistant/inventory" element={<Inventory/>} />
          <Route path="/lab_assistant/inventory_manage" element={<InventoryManage/>} />
          <Route path='/lab_assistant/inventory_approval' element={<ApprovalInventoryModal/>} />

          <Route path="/lab_assistant/task_manage" element={<TaskManage/>} />
          <Route path="/lab_assistant/add_task_modal" element={<AddResearcherIssueTask/>} />

          <Route path="/lab_assistant/inventory_trans" element={<InventoryTrans/>} />
          <Route path="/lab_assistant/received_items" element={<ReceivedItems/>} />
          <Route path="/lab_assistant/issued_items" element={<IssuedItems/>} />

          <Route path="/lab_assistant/new_product" element={<RequestResearcher/>} />

        </Routes>
    </BrowserRouter>
  );
};

export default LabApp1;