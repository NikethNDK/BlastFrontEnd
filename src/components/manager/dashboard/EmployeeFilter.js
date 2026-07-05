import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { getEmployeeApi } from "../../../services/AppinfoService";
import "../../../components/Lab1/homeLab/inventory.css";
import { ContentCard } from "../../layout/content";

const EmployeeFilter = () => {
  // Get user from Redux store to get username and labs
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;
  
  // Get manager's assigned labs from Redux
  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);

  const [employee, setEmployee] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLab, setSelectedLab] = useState("All"); // Lab filter state

  // Filter States
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [empNameFilter, setEmpNameFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [projectCodeFilter, setProjectCodeFilter] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Guard: Ensure username is available
      if (!username) {
        console.error("Username not available. Please ensure user is logged in.");
        return;
      }

      try {
        // Pass lab parameter if a specific lab is selected (not "All")
        const labParam = selectedLab !== "All" ? selectedLab : null;
        const data = await getEmployeeApi(username, labParam);
        setEmployee(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmployee([]);
      }
    };

    // Fetch data when username or selectedLab changes
    if (username) {
      fetchData();
    }
  }, [username, selectedLab]);

  // Filtering Logic
  useEffect(() => {
    const filteredEmployees = employee.filter(
      (emp) => {
        // Employee ID filter
        const matchesEmpId = empIdFilter === "" ||
          (emp.emp_id &&
            String(emp.emp_id)
              .toLowerCase()
              .includes(empIdFilter.toLowerCase()));
        
        // Employee Name filter
        const matchesEmpName = empNameFilter === "" ||
          (emp.emp_name &&
            emp.emp_name
              .toLowerCase()
              .includes(empNameFilter.toLowerCase()));
        
        // Designation filter
        const matchesDesignation = designationFilter === "" ||
          (emp.designation &&
            emp.designation
              .toLowerCase()
              .includes(designationFilter.toLowerCase()));
        
        // Project Code filter (handle array)
        const projectCodes = Array.isArray(emp.project_code) ? emp.project_code : [emp.project_code];
        const matchesProjectCode = projectCodeFilter === "" ||
          projectCodes.some(code =>
            code && String(code).toLowerCase().includes(projectCodeFilter.toLowerCase())
          );
        
        // Project Name filter (handle array)
        const projectNames = Array.isArray(emp.project_name) ? emp.project_name : [emp.project_name];
        const matchesProjectName = projectNameFilter === "" ||
          projectNames.some(name =>
            name && String(name).toLowerCase().includes(projectNameFilter.toLowerCase())
          );
        
        return matchesEmpId && matchesEmpName && matchesDesignation && matchesProjectCode && matchesProjectName;
      }
    );

    setFilteredData(filteredEmployees);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    employee,
    empIdFilter,
    empNameFilter,
    designationFilter,
    projectCodeFilter,
    projectNameFilter,
  ]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <ContentCard flush>
    <div className="master-list-container lims-data-fill">
      {/* --- Lab Filter Dropdown --- */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <label style={{ fontWeight: "500", fontSize: "14px" }}>Lab Name:</label>
        <select
          value={selectedLab}
          onChange={(e) => setSelectedLab(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "200px",
            cursor: "pointer"
          }}
        >
          <option value="All">All</option>
          {managerLabs.map((lab, index) => (
            <option key={index} value={lab}>
              {lab}
            </option>
          ))}
        </select>
      </div>

      {/* --- Pagination Controls (Top) --- */}
      <Pagination
        position="top"
        showPageNumbers={false}
        showItemsPerPage
        showSummary
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(n) => {
          setItemsPerPage(n);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* --- Main Data Table --- */}
      <div className="table-wrapper">
        <table className="inventory-table lims-table">
          <thead>
            <tr>
              {/* Header Cells with Filters */}
              {[
                { label: "Employee Id", filter: empIdFilter, setFilter: setEmpIdFilter },
                { label: "Employee Name", filter: empNameFilter, setFilter: setEmpNameFilter },
                { label: "Designation", filter: designationFilter, setFilter: setDesignationFilter },
                { label: "Lab", filter: "", setFilter: null },
                { label: "Project Code", filter: projectCodeFilter, setFilter: setProjectCodeFilter },
                { label: "Project Name", filter: projectNameFilter, setFilter: setProjectNameFilter },
              ].map(({ label, filter, setFilter }) => (
                <th key={label} className="table-header">
                  {label}
                  {setFilter && (
                    <input
                      type="text"
                      placeholder={`Filter by ${label}`}
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="filter-input"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp, index) => (
                <tr
                  key={emp.emp_id || index}
                  className="data-row"
                >
                  <td className="table-cell">{emp.emp_id || "-"}</td>
                  <td className="table-cell">{emp.emp_name || "-"}</td>
                  <td className="table-cell">{emp.designation || "-"}</td>
                  <td className="table-cell">{emp.lab || "-"}</td>
                  <td className="table-cell">
                    {Array.isArray(emp.project_code) 
                      ? emp.project_code.join(", ") 
                      : (emp.project_code || "-")}
                  </td>
                  <td className="table-cell">
                    {Array.isArray(emp.project_name) 
                      ? emp.project_name.join(", ") 
                      : (emp.project_name || "-")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data-cell">
                  No employees matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Controls (Bottom) --- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        position="bottom"
      />
    </div>
    </ContentCard>
  );
};

export default EmployeeFilter;