import React, { useEffect, useState } from "react";
import { getProjectApi } from "../../../services/AppinfoService";

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    getProjectApi()
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          style={{
            padding: "8px 14px",
            margin: "0 4px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: page === currentPage ? "#4f46e5" : "#f3f4f6",
            color: page === currentPage ? "#ffffff" : "#374151",
            fontWeight: page === currentPage ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "14px",
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              e.target.style.backgroundColor = "#e5e7eb";
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              e.target.style.backgroundColor = "#f3f4f6";
            }
          }}
        >
          {page}
        </button>
      );
    }

    return items;
  };

  return (
    <div style={{ width: "100%", padding: "24px" }}>

      {/* Card Container */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Table Container */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Project Code
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Project Name
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      padding: "80px 24px",
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "15px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div style={{ fontWeight: "600", color: "#6b7280", marginBottom: "4px" }}>
                          No projects found
                        </div>
                        <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                          There are currently no projects to display
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentProjects.map((proj, index) => (
                  <tr
                    key={proj.project_code}
                    style={{
                      borderBottom: index < currentProjects.length - 1 ? "1px solid #f3f4f6" : "none",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#111827",
                        fontWeight: "500",
                      }}
                    >
                      {proj.project_code}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                    >
                      {proj.project_name || "-"}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
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
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {projects.length > itemsPerPage && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              backgroundColor: "#f9fafb",
              borderTop: "1px solid #e5e7eb",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Showing <span style={{ fontWeight: "600", color: "#374151" }}>{indexOfFirstItem + 1}</span> to{" "}
              <span style={{ fontWeight: "600", color: "#374151" }}>
                {Math.min(indexOfLastItem, projects.length)}
              </span>{" "}
              of <span style={{ fontWeight: "600", color: "#374151" }}>{projects.length}</span> projects
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: currentPage === 1 ? "#f3f4f6" : "#ffffff",
                  color: currentPage === 1 ? "#9ca3af" : "#374151",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  border: "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.backgroundColor = "#ffffff";
                  }
                }}
              >
                Previous
              </button>

              {renderPaginationItems()}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#ffffff",
                  color: currentPage === totalPages ? "#9ca3af" : "#374151",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  border: "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.backgroundColor = "#ffffff";
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManage;