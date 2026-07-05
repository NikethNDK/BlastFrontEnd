import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/layout/admin-workspace.css";
import AppShell from "./components/layout/AppShell";
import AppSidebar from "./components/layout/AppSidebar";
import { adminMenuConfig } from "./config/sidebar/adminMenu";
import AdminHome from "./components/admin/AdminHome";
import Appinfo from "./components/appinfo/Appinfo";
import Project from "./components/admin/projects/Project";
import ProjectManage from "./components/admin/projects/ProjectManage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import PasswordReset from "./components/auth/PasswordReset";
import Employee from "./components/admin/employee/Employee";
import EmployeeManage from "./components/admin/employee/EmployeeManage";
import LabDesignationForm from "./components/admin/masterTable";
import { Toaster } from "react-hot-toast";

function AdminApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <AppShell sidebar={<AppSidebar config={adminMenuConfig} />} workspace="admin">
        <Routes>
          <Route path="/" element={<ProjectManage userDetails={userDetails} />} />
          <Route exact path="/home" element={<AdminHome userDetails={userDetails} />} />
          <Route path="/admin/appinfo" element={<Appinfo userDetails={userDetails} />} />
          <Route path="/admin/project" element={<Project userDetails={userDetails} />} />
          <Route path="/admin/project_manage" element={<ProjectManage userDetails={userDetails} />} />
          <Route path="/register" element={<Register userDetails={userDetails} />} />
          <Route path="/password_reset" element={<PasswordReset userDetails={userDetails} />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee_manage" element={<EmployeeManage userDetails={userDetails} />} />
          <Route path="/master_table" element={<LabDesignationForm userDetails={userDetails} />} />
        </Routes>
      </AppShell>
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
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default AdminApp;
