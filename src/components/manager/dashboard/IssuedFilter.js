import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { getItemIssueApi } from "../../../services/AppinfoService";
import "./ManagerDashboard.shared.css";
import "./IssuedFilter.css";

const TABLE_HEADINGS = [
  { label: "Entry No", key: "entry_no", colClass: "md-iss-col--entry" },
  { label: "Item Code", key: "item_code", colClass: "md-iss-col--code" },
  { label: "Item Name", key: "item_name", colClass: "md-iss-col--name" },
  { label: "Issue Date", key: "issue_date", colClass: "md-iss-col--issue-date" },
  { label: "Quantity Issued", key: "quantity_issued", colClass: "md-iss-col--qty" },
  { label: "Project Code", key: "project_code", colClass: "md-iss-col--project-code" },
  { label: "Project Name", key: "project_name", colClass: "md-iss-col--project-name" },
  { label: "Issued To", key: "researcher_name", colClass: "md-iss-col--issued-to" },
  { label: "Remarks", key: "remarks", colClass: "md-iss-col--remarks" },
];

const IssuedFilter = () => {
  const reduxUser = useSelector((state) => state.user.user);
  const username = reduxUser?.user_name || reduxUser?.name || null;

  const userLabs = reduxUser?.lab || [];
  const managerLabs = Array.isArray(userLabs) ? userLabs : (userLabs ? [userLabs] : []);

  const [issued, setIssued] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLab, setSelectedLab] = useState("All");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    let mounted = true;

    if (!username) {
      console.error("Username not available. Please ensure user is logged in.");
      return;
    }

    const labParam = selectedLab !== "All" ? selectedLab : null;
    getItemIssueApi(username, labParam)
      .then((data) => {
        if (mounted) {
          setIssued(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      mounted = false;
    };
  }, [username, selectedLab]);

  useEffect(() => {
    const filteredItems = issued.filter((item) =>
      TABLE_HEADINGS.every(({ key }) => {
        const value = filters[key];
        if (!value) return true;
        const field = item[key];
        if (field == null || field === "") return false;
        return String(field).toLowerCase().includes(value.toLowerCase());
      })
    );

    setFilteredData(filteredItems);
    setCurrentPage(1);
  }, [issued, filters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = useCallback((e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

  return (
    <div className="manager-dash-panel md-iss-page">
      <div className="manager-dash-lab-filter">
        <label htmlFor="md-iss-lab-filter">Lab Name:</label>
        <select
          id="md-iss-lab-filter"
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

      <section className="project-panel" aria-label="Issued items">
        <div className="project-table-section">
          <div className="project-table-shell">
            <table className="project-table">
              <thead>
                <tr className="project-thead-labels">
                  {TABLE_HEADINGS.map(({ label, colClass }) => (
                    <th
                      key={colClass}
                      scope="col"
                      className={`project-th-label-cell md-iss-col ${colClass}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
                <tr className="project-thead-filters">
                  {TABLE_HEADINGS.map(({ label, key, colClass }) => (
                    <th
                      key={key}
                      scope="col"
                      className={`project-th-filter-cell md-iss-col ${colClass}`}
                    >
                      <input
                        type="text"
                        placeholder="Filter"
                        className="md-col-filter"
                        value={filters[key] || ""}
                        onChange={(e) => handleFilterChange(e, key)}
                        aria-label={`Filter by ${label}`}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.c_id ? `${item.c_id}-${index}` : index}
                      className="project-table-row"
                    >
                      <td className="md-iss-col md-iss-col--entry">{item.entry_no ?? "—"}</td>
                      <td className="md-iss-col md-iss-col--code">{item.item_code || "—"}</td>
                      <td className="md-iss-col md-iss-col--name">{item.item_name || "—"}</td>
                      <td className="md-iss-col md-iss-col--issue-date">{item.issue_date || "—"}</td>
                      <td className="md-iss-col md-iss-col--qty">{item.quantity_issued ?? "—"}</td>
                      <td className="md-iss-col md-iss-col--project-code">{item.project_code || "—"}</td>
                      <td className="md-iss-col md-iss-col--project-name">{item.project_name || "—"}</td>
                      <td className="md-iss-col md-iss-col--issued-to">{item.researcher_name || "—"}</td>
                      <td className="md-iss-col md-iss-col--remarks">{item.remarks || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="project-table-row project-table-row--empty">
                    <td colSpan="9">
                      <div className="project-empty">
                        No items matching your filter criteria.
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

export default IssuedFilter;
