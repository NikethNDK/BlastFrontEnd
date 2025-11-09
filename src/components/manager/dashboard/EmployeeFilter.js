import React, { useEffect, useState } from "react";
import { getEmployeeApi } from "../../../services/AppinfoService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../../components/Lab1/homeLab/inventory.css";

const EmployeeFilter = () => {
  const [employee, setEmployee] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter States
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [empNameFilter, setEmpNameFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [projectCodeFilter, setProjectCodeFilter] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    getEmployeeApi()
      .then((data) => {
        if (mounted) {
          setEmployee(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  // Filtering Logic
  useEffect(() => {
    const filteredEmployees = employee.filter(
      (emp) =>
        (empIdFilter === "" ||
          (emp.emp_id &&
            String(emp.emp_id)
              .toLowerCase()
              .includes(empIdFilter.toLowerCase()))) &&
        (empNameFilter === "" ||
          (emp.emp_name &&
            emp.emp_name
              .toLowerCase()
              .includes(empNameFilter.toLowerCase()))) &&
        (designationFilter === "" ||
          (emp.designation &&
            emp.designation
              .toLowerCase()
              .includes(designationFilter.toLowerCase()))) &&
        (projectCodeFilter === "" ||
          (emp.project_code &&
            emp.project_code
              .toLowerCase()
              .includes(projectCodeFilter.toLowerCase()))) &&
        (projectNameFilter === "" ||
          (emp.project_name &&
            emp.project_name
              .toLowerCase()
              .includes(projectNameFilter.toLowerCase())))
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
                { label: "Project Code", filter: projectCodeFilter, setFilter: setProjectCodeFilter },
                { label: "Project Name", filter: projectNameFilter, setFilter: setProjectNameFilter },
              ].map(({ label, filter, setFilter }) => (
                <th key={label} className="table-header">
                  {label}
                  <input
                    type="text"
                    placeholder={`Filter by ${label}`}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-input"
                  />
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
                  <td className="table-cell">{emp.project_code || "-"}</td>
                  <td className="table-cell">{emp.project_name || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data-cell">
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