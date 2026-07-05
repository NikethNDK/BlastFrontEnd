import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { getProjectApi } from "../../../services/AppinfoService";
import "./ManagerDashboard.shared.css";
import "./ProjectFilter.css";

const TABLE_HEADINGS = [
  { label: "Project Code", colClass: "md-proj-col--code" },
  { label: "Project Name", colClass: "md-proj-col--name" },
  { label: "Status", colClass: "md-proj-col--status" },
];

const ProjectManage = () => {
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;

  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLab, setSelectedLab] = useState("All");

  useEffect(() => {
    if (!username) {
      console.error("Username not available. Please ensure user is logged in.");
      return;
    }

    const fetchData = () => {
      const labParam = selectedLab !== "All" ? selectedLab : null;
      getProjectApi(username, labParam)
        .then((data) => {
          setProjects(Array.isArray(data) ? data : []);
          setCurrentPage(1);
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    fetchData();
  }, [username, selectedLab]);

  const totalItems = projects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="manager-dash-panel md-proj-page">
      {managerLabs.length > 0 && (
        <div className="manager-dash-lab-filter">
          <label htmlFor="md-proj-lab-filter">Filter by Lab:</label>
          <select
            id="md-proj-lab-filter"
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
      )}

      <section className="project-panel" aria-label="Projects">
        <div className="project-table-section">
          <div className="project-table-shell">
            <table className="project-table">
              <thead>
                <tr className="project-thead-labels">
                  {TABLE_HEADINGS.map(({ label, colClass }) => (
                    <th
                      key={colClass}
                      scope="col"
                      className={`project-th-label-cell md-proj-col ${colClass}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentProjects.length > 0 ? (
                  currentProjects.map((proj) => (
                    <tr key={proj.project_code} className="project-table-row">
                      <td className="md-proj-col md-proj-col--code">{proj.project_code || "—"}</td>
                      <td className="md-proj-col md-proj-col--name">{proj.project_name || "—"}</td>
                      <td className="md-proj-col md-proj-col--status">
                        <span
                          className={`md-status-badge ${
                            proj.deleted === 0
                              ? "md-status-badge--active"
                              : "md-status-badge--inactive"
                          }`}
                        >
                          <span className="md-status-dot" aria-hidden />
                          {proj.deleted === 0 ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="project-table-row project-table-row--empty">
                    <td colSpan="3">
                      <div className="project-empty">No projects found.</div>
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

export default ProjectManage;
