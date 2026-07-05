import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { getProjectApi } from "../../../services/AppinfoService";
import "../../../components/Lab1/homeLab/inventory.css";
import { ContentCard } from "../../layout/content";

const ProjectManage = () => {
  // Get user from Redux store to get username and labs
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;
  
  // Get manager's assigned labs from Redux
  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);
  
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLab, setSelectedLab] = useState("All"); // Lab filter state

  useEffect(() => {
    // Guard: Ensure username is available
    if (!username) {
      console.error("Username not available. Please ensure user is logged in.");
      return;
    }

    // NOTE: Polling removed - data now fetched once on mount
    // For notification updates, see centralized polling in ManagerNavigation
    const fetchData = () => {
      // Pass lab parameter if a specific lab is selected (not "All")
      const labParam = selectedLab !== "All" ? selectedLab : null;
      getProjectApi(username, labParam)
        .then((data) => {
          setProjects(Array.isArray(data) ? data : []);
          setCurrentPage(1); // Reset to first page when filter changes
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    // Fetch data when username or selectedLab changes
    fetchData();
  }, [username, selectedLab]);

  // Pagination calculations
  const totalItems = projects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <ContentCard flush>
    <div className="master-list-container lims-data-fill">
      {/* --- Lab Filter --- */}
      {managerLabs.length > 0 && (
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ fontWeight: "500", fontSize: "14px" }}>
            Filter by Lab:
          </label>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
              minWidth: "150px",
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
      )}

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

export default ProjectManage;