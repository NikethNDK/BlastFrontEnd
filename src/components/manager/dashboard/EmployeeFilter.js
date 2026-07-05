import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { getEmployeeApi } from "../../../services/AppinfoService";
import "./ManagerDashboard.shared.css";
import "./EmployeeFilter.css";

const TABLE_HEADINGS = [
  { label: "Employee Id", key: "emp_id", colClass: "md-emp-col--id", filterable: true },
  { label: "Employee Name", key: "emp_name", colClass: "md-emp-col--name", filterable: true },
  { label: "Designation", key: "designation", colClass: "md-emp-col--designation", filterable: true },
  { label: "Lab", key: "lab", colClass: "md-emp-col--lab", filterable: false },
  { label: "Project Code", key: "project_code", colClass: "md-emp-col--project-code", filterable: true },
  { label: "Project Name", key: "project_name", colClass: "md-emp-col--project-name", filterable: true },
];

const EmployeeFilter = () => {
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;

  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);

  const [employee, setEmployee] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLab, setSelectedLab] = useState("All");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        console.error("Username not available. Please ensure user is logged in.");
        return;
      }

      try {
        const labParam = selectedLab !== "All" ? selectedLab : null;
        const data = await getEmployeeApi(username, labParam);
        setEmployee(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmployee([]);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, selectedLab]);

  useEffect(() => {
    const filteredEmployees = employee.filter((emp) => {
      const matchesEmpId =
        !filters.emp_id ||
        (emp.emp_id &&
          String(emp.emp_id).toLowerCase().includes(filters.emp_id.toLowerCase()));

      const matchesEmpName =
        !filters.emp_name ||
        (emp.emp_name &&
          emp.emp_name.toLowerCase().includes(filters.emp_name.toLowerCase()));

      const matchesDesignation =
        !filters.designation ||
        (emp.designation &&
          emp.designation.toLowerCase().includes(filters.designation.toLowerCase()));

      const projectCodes = Array.isArray(emp.project_code)
        ? emp.project_code
        : [emp.project_code];
      const matchesProjectCode =
        !filters.project_code ||
        projectCodes.some(
          (code) =>
            code &&
            String(code).toLowerCase().includes(filters.project_code.toLowerCase())
        );

      const projectNames = Array.isArray(emp.project_name)
        ? emp.project_name
        : [emp.project_name];
      const matchesProjectName =
        !filters.project_name ||
        projectNames.some(
          (name) =>
            name &&
            String(name).toLowerCase().includes(filters.project_name.toLowerCase())
        );

      return (
        matchesEmpId &&
        matchesEmpName &&
        matchesDesignation &&
        matchesProjectCode &&
        matchesProjectName
      );
    });

    setFilteredData(filteredEmployees);
    setCurrentPage(1);
  }, [employee, filters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = useCallback((e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

  return (
    <div className="manager-dash-panel md-emp-page">
      <div className="manager-dash-lab-filter">
        <label htmlFor="md-emp-lab-filter">Lab Name:</label>
        <select
          id="md-emp-lab-filter"
          className="manager-dash-lab-select"
          value={selectedLab}
          onChange={(e) => setSelectedLab(e.target.value)}
        >
          <option value="All">All</option>
          {managerLabs.map((lab, index) => (
            <option key={index} value={lab}>
              {lab}
            </option>
          ))}
        </select>
      </div>

      <section className="project-panel" aria-label="Employees">
        <div className="project-table-section">
          <div className="project-table-shell">
            <table className="project-table">
              <thead>
                <tr className="project-thead-labels">
                  {TABLE_HEADINGS.map(({ label, colClass }) => (
                    <th
                      key={colClass}
                      scope="col"
                      className={`project-th-label-cell md-emp-col ${colClass}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
                <tr className="project-thead-filters">
                  {TABLE_HEADINGS.map(({ label, key, colClass, filterable }) => (
                    <th
                      key={key}
                      scope="col"
                      className={`project-th-filter-cell md-emp-col ${colClass}`}
                    >
                      {filterable ? (
                        <input
                          type="text"
                          placeholder="Filter"
                          className="md-col-filter"
                          value={filters[key] || ""}
                          onChange={(e) => handleFilterChange(e, key)}
                          aria-label={`Filter by ${label}`}
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((emp, index) => (
                    <tr key={emp.emp_id || index} className="project-table-row">
                      <td className="md-emp-col md-emp-col--id">{emp.emp_id || "—"}</td>
                      <td className="md-emp-col md-emp-col--name">{emp.emp_name || "—"}</td>
                      <td className="md-emp-col md-emp-col--designation">{emp.designation || "—"}</td>
                      <td className="md-emp-col md-emp-col--lab">{emp.lab || "—"}</td>
                      <td className="md-emp-col md-emp-col--project-code">
                        {Array.isArray(emp.project_code)
                          ? emp.project_code.join(", ")
                          : emp.project_code || "—"}
                      </td>
                      <td className="md-emp-col md-emp-col--project-name">
                        {Array.isArray(emp.project_name)
                          ? emp.project_name.join(", ")
                          : emp.project_name || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="project-table-row project-table-row--empty">
                    <td colSpan="6">
                      <div className="project-empty">
                        No employees matching your filter criteria.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            showSummary
            showItemsPerPage
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
            position="bottom"
          />
        </div>
      </section>
    </div>
  );
};

export default EmployeeFilter;
