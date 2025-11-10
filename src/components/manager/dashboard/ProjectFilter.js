import React, { useEffect, useState } from "react";
import { getProjectApi } from "../../../services/AppinfoService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../../components/Lab1/homeLab/inventory.css";

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = () => {
      getProjectApi()
        .then((data) => setProjects(data))
        .catch((error) => console.error("Error fetching data:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Pagination calculations
  const totalItems = projects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

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
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} projects
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
              <th className="table-header">Project Code</th>
              <th className="table-header">Project Name</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((proj) => (
                <tr
                  key={proj.project_code}
                  className="data-row"
                >
                  <td className="table-cell">{proj.project_code || "-"}</td>
                  <td className="table-cell">{proj.project_name || "-"}</td>
                  <td className="table-cell">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "9999px",
                        fontSize: "13px",
                        fontWeight: "600",
                        backgroundColor: proj.deleted === 0 ? "#d1fae5" : "#fee2e2",
                        color: proj.deleted === 0 ? "#065f46" : "#991b1b",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: proj.deleted === 0 ? "#10b981" : "#ef4444",
                        }}
                      />
                      {proj.deleted === 0 ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data-cell">
                  No projects found.
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

export default ProjectManage;