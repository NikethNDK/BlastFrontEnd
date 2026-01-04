import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getEmployeeApi } from "../../../services/AppinfoService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../../components/Lab1/homeLab/inventory.css";

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="master-list-container" style={{ width: "100%", padding: "24px" }}>
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
      <div className="pagination-controls top">
        <div className="pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} employees
        </div>
        <div className="pagination-options">
          <label className="items-per-page-label">
            Items per page:
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="items-per-page-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {/* --- Main Data Table --- */}
      <div className="table-wrapper">
        <table className="inventory-table">
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
      {totalPages > 1 && (
        <div className="pagination-controls bottom">
          <div className="pagination-navigation">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn prev-btn"
            >
              <FaChevronLeft size={14} />
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-btn page-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn next-btn"
            >
              Next
              <FaChevronRight size={14} />
            </button>
          </div>
          
          <div className="pagination-summary">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilter;