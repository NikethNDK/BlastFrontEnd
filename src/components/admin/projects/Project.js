import React, { useEffect, useState } from "react";
import { getProjectApi } from "../../../services/AppinfoService";
import Pagination from "../../common/Pagination";
import "../../Lab1/homeLab/inventory.css";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../../layout/content";

const Project = () => {
  const [project, setProject] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    let mounted = true;
    getProjectApi()
      .then((data) => {
        if (mounted) {
          setProject(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => (mounted = false);
  }, []);

  // Pagination calculations
  const totalItems = project.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = project.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <PageLayout>
      <PageHeader title="Projects" />
      <PageBody>
      <ContentCard flush>
    <div className="master-list-container" style={{ width: "100%", padding: "24px" }}>
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
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="table-header">Project Code</th>
              <th className="table-header">Project Name</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((pro) => (
                <tr key={pro.id} className="data-row">
                  <td className="table-cell">{pro.project_code || "-"}</td>
                  <td className="table-cell">{pro.project_name || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="no-data-cell">
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
      </PageBody>
    </PageLayout>
  );
};

export default Project;
