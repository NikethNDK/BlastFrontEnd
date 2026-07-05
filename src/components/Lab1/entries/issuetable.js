import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./IssueDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";
import { FaBox } from "react-icons/fa";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/AppinfoService";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { PageLayout, PageHeader } from "../../layout/content";

const IssueDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux as fallback/primary source
  const reduxUser = useSelector((state) => state.user.user);

  // Merge userDetails prop with Redux user data (Redux takes priority) - memoized to prevent infinite loops
  const effectiveUserDetails = useMemo(() => {
    return reduxUser
      ? {
          name: reduxUser.user_name || userDetails.name || "",
          user_name:
            reduxUser.user_name ||
            userDetails.user_name ||
            userDetails.name ||
            "",
          lab: reduxUser.lab || userDetails.lab || "N/A",
          designation:
            reduxUser.designation || userDetails.designation || "Not Assigned",
          role: reduxUser.role || userDetails.role || "",
        }
      : userDetails;
  }, [reduxUser, userDetails]);

  // Extract username and lab for dependency tracking
  const username = useMemo(
    () => effectiveUserDetails.user_name || effectiveUserDetails.name || null,
    [effectiveUserDetails.user_name, effectiveUserDetails.name]
  );
  const labName = useMemo(
    () =>
      effectiveUserDetails.lab && effectiveUserDetails.lab !== "N/A"
        ? effectiveUserDetails.lab
        : null,
    [effectiveUserDetails.lab]
  );

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, labName]);

  const fetchData = async () => {
    try {
      // Build query parameters
      const params = {};
      if (username) {
        params.username = username;
      }
      if (labName) {
        params.lab = labName;
      }

      console.log("🌐 [API] get_issued_data called with:", {
        username,
        lab: labName,
        params,
      });

      const response = await axios.get(`${BASE_URL}/api/issue_data/`, {
        params: params,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDateChange = (e, type) => {
    if (type === "from") setFromDate(e.target.value);
    else setToDate(e.target.value);
  };

  const filteredData = data.filter((item) => {
    return (
      Object.keys(filters).every((key) => {
        const cellValue = String(item[key] || "").toLowerCase();
        const filterValue = String(filters[key] || "").toLowerCase();
        return filterValue ? cellValue.includes(filterValue) : true;
      }) &&
      (!fromDate || new Date(item.issue_date) >= new Date(fromDate)) &&
      (!toDate || new Date(item.issue_date) <= new Date(toDate))
    );
  });

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      toast.error("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Entry No": item.entry_no,
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Quantity Issued": item.quantity_issued,
        "Issued To": item.researcher_name,
        "Issued Date": item.issue_date,
        "Master Type": item.master_type,
        "Project Name": item.project_name,
        "Project Code": item.project_code,
        Remarks: item.remarks,
      }))
    );

    // Protecting the sheet from edits
    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issue Data");
    XLSX.writeFile(workbook, "IssueData.xlsx");
  };

  // Calculate totals
  const totalQuantityIssued = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_issued) || 0),
    0
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, fromDate, toDate]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", colClass: "idt-col--entry" },
    { label: "Item Name", key: "item_name", colClass: "idt-col--name" },
    { label: "Item Code", key: "item_code", colClass: "idt-col--code" },
    { label: "Quantity Issued", key: "quantity_issued", colClass: "idt-col--qty" },
    { label: "Issued To", key: "researcher_name", colClass: "idt-col--issued-to" },
    { label: "Issued Date", key: "issue_date", colClass: "idt-col--date" },
    { label: "Master Type", key: "master_type", colClass: "idt-col--master-type" },
    { label: "Project Name", key: "project_name", colClass: "idt-col--project" },
    { label: "Project Code", key: "project_code", colClass: "idt-col--project-code" },
    { label: "Remarks", key: "remarks", colClass: "idt-col--remarks" },
  ];

  const hasActiveFilters =
    Object.values(filters).some((v) => v) || fromDate || toDate;

  return (
    <PageLayout>
      <PageHeader
        title="Issued data"
        actions={
          <button
            type="button"
            className="lims-header-btn"
            onClick={handleDownload}
            title="Download Excel"
          >
            <AiOutlineDownload aria-hidden />
            Download
          </button>
        }
      />

      <div className="issue-data-page">
        <div className="project-stats" role="list">
          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--total">
              <FaBox aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{totalQuantityIssued}</span>
              <span className="project-stat-label">Total Quantity Issued</span>
            </div>
          </div>
        </div>

        <section className="project-panel" aria-label="Issued data list">
          <div className="project-table-section">
            <div className="project-table-shell">
              <table className="project-table">
                <thead>
                  <tr className="project-thead-labels">
                    {tableHeadings.map(({ label, key, colClass }) => (
                      <th
                        key={key}
                        scope="col"
                        className={`project-th-label-cell idt-col ${colClass}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                  <tr className="project-thead-filters">
                    {tableHeadings.map(({ label, key, colClass }) => (
                      <th
                        key={key}
                        scope="col"
                        className={`project-th-filter-cell idt-col ${colClass}`}
                      >
                        {key === "issue_date" ? (
                          <div className="project-date-filters">
                            <div className="project-date-filter-row">
                              <span className="project-date-filter-label">
                                From:
                              </span>
                              <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => handleDateChange(e, "from")}
                                className="project-date-filter"
                                aria-label="Filter issued date from"
                              />
                            </div>
                            <div className="project-date-filter-row">
                              <span className="project-date-filter-label">
                                To:
                              </span>
                              <input
                                type="date"
                                value={toDate}
                                onChange={(e) => handleDateChange(e, "to")}
                                className="project-date-filter"
                                aria-label="Filter issued date to"
                              />
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Filter"
                            className="project-col-filter"
                            value={filters[key] || ""}
                            onChange={(e) => handleFilterChange(e, key)}
                            aria-label={`Filter by ${label}`}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr className="project-table-row project-table-row--empty">
                      <td colSpan="10">
                        <div className="project-empty">
                          <div className="project-empty-icon-wrap">
                            <FaBox aria-hidden />
                          </div>
                          <h3>
                            {hasActiveFilters
                              ? "No records found"
                              : "No issued data available"}
                          </h3>
                          <p>
                            {hasActiveFilters
                              ? "Try adjusting your column filters."
                              : "Issued items will appear here once recorded."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item) => (
                      <tr key={item.entry_no || item.id} className="project-table-row">
                        <td className="idt-col idt-col--entry" data-label="Entry No">
                          <span className="issue-entry-no">
                            {item.entry_no || "—"}
                          </span>
                        </td>
                        <td className="idt-col idt-col--name" data-label="Item Name">
                          <span className="issue-item-name">
                            {item.item_name || "—"}
                          </span>
                        </td>
                        <td className="idt-col idt-col--code" data-label="Item Code">
                          {item.item_code ? (
                            <span>{item.item_code}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                        <td className="idt-col idt-col--qty" data-label="Quantity Issued">
                          {item.quantity_issued ?? "—"}
                        </td>
                        <td className="idt-col idt-col--issued-to" data-label="Issued To">
                          {item.researcher_name ? (
                            <span>{item.researcher_name}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                        <td className="idt-col idt-col--date" data-label="Issued Date">
                          {item.issue_date ? (
                            <span>{item.issue_date}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                        <td className="idt-col idt-col--master-type" data-label="Master Type">
                          {item.master_type ? (
                            <span>{item.master_type}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                        <td className="idt-col idt-col--project" data-label="Project Name">
                          {item.project_name ? (
                            <span>{item.project_name}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                        <td className="idt-col idt-col--project-code" data-label="Project Code">
                          {item.project_code ? (
                            <span>{item.project_code}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                        <td className="idt-col idt-col--remarks" data-label="Remarks">
                          {item.remarks ? (
                            <span>{item.remarks}</span>
                          ) : (
                            <span className="issue-cell-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              showSummary
              totalItems={filteredData.length}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              position="bottom"
            />
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default IssueDataTable;
