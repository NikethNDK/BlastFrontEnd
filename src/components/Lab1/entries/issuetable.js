import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./TransferredDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";
import LabNavigation1 from "../homeLab/LabNavigation1";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/AppinfoService";
import { useSelector } from "react-redux";

const IssueDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux as fallback/primary source
  const reduxUser = useSelector((state) => state.user.user);
  
  // Merge userDetails prop with Redux user data (Redux takes priority) - memoized to prevent infinite loops
  const effectiveUserDetails = useMemo(() => {
    return reduxUser ? {
      name: reduxUser.user_name || userDetails.name || "",
      user_name: reduxUser.user_name || userDetails.user_name || userDetails.name || "",
      lab: reduxUser.lab || userDetails.lab || "N/A",
      designation: reduxUser.designation || userDetails.designation || "Not Assigned",
      role: reduxUser.role || userDetails.role || ""
    } : userDetails;
  }, [reduxUser, userDetails]);

  // Extract username and lab for dependency tracking
  const username = useMemo(() => 
    effectiveUserDetails.user_name || effectiveUserDetails.name || null,
    [effectiveUserDetails.user_name, effectiveUserDetails.name]
  );
  const labName = useMemo(() => 
    effectiveUserDetails.lab && effectiveUserDetails.lab !== 'N/A' 
      ? effectiveUserDetails.lab 
      : null,
    [effectiveUserDetails.lab]
  );

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

      console.log("🌐 [API] get_issued_data called with:", { username, lab: labName, params });

      const response = await axios.get(
        `${BASE_URL}/api/issue_data/`,
        { params: params }
      );
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

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", className: "entry-no-column" },
    { label: "Item Name", key: "item_name", className: "item-name-column" },
    { label: "Item Code", key: "item_code", className: "item-code-column" },
    { label: "Quantity Issued", key: "quantity_issued", className: "quantity-column" },
    { label: "Issued To", key: "researcher_name", className: "supplier-column" },
    { label: "Issued Date", key: "issue_date", className: "date-column" },
    { label: "Master Type", key: "master_type", className: "batch-column" },
    { label: "Project Name", key: "project_name", className: "project-column" },
    { label: "Project Code", key: "project_code", className: "catalogue-column" },
    { label: "Remarks", key: "remarks", className: "remarks-column" },
  ];

  return (
    <div>
      <div className="table-container">
        <h2>Issued Data</h2>
        
        {/* Total Summary */}
        <div className="total-summary" style={{ 
          marginBottom: "1rem", 
          padding: "1rem", 
          backgroundColor: "#f7f9fc", 
          borderRadius: "6px", 
          display: "flex", 
          justifyContent: "center",
          fontWeight: "600"
        }}>
          <p>
            <strong>Total Quantity Issued:</strong> {totalQuantityIssued}
          </p>
        </div>

        {/* Header Controls */}
        <div className="table-header-controls">
          <div></div> {/* Empty div for spacing */}
          
          <button
            className="download-button"
            onClick={handleDownload}
            title="Download Excel"
          >
            <AiOutlineDownload size={20} />
          </button>
        </div>

        {/* Table Wrapper */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {tableHeadings.map(({ label, key, className }, index) => (
                  <th
                    key={index}
                    className={`table-header ${className}`}
                  >
                    {label}
                    {key === "issue_date" ? (
                      <>
                        <br />
                        <div className="date-filter-container">
                          <div className="date-filter-row">
                            <label className="date-filter-label">From:</label>
                            <input
                              type="date"
                              value={fromDate}
                              onChange={(e) => handleDateChange(e, "from")}
                              className="date-filter-input"
                            />
                          </div>
                          <div className="date-filter-row">
                            <label className="date-filter-label">To:</label>
                            <input
                              type="date"
                              value={toDate}
                              onChange={(e) => handleDateChange(e, "to")}
                              className="date-filter-input"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <br />
                        <input
                          type="text"
                          placeholder="Filter"
                          className="filter-input"
                          value={filters[key] || ""}
                          onChange={(e) => handleFilterChange(e, key)}
                        />
                      </>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.entry_no || item.id}>
                    <td className="table-cell entry-no-column">{item.entry_no}</td>
                    <td className="table-cell item-name-column">{item.item_name}</td>
                    <td className="table-cell item-code-column">{item.item_code}</td>
                    <td className="table-cell quantity-column">{item.quantity_issued}</td>
                    <td className="table-cell supplier-column">{item.researcher_name}</td>
                    <td className="table-cell date-column">{item.issue_date}</td>
                    <td className="table-cell batch-column">{item.master_type}</td>
                    <td className="table-cell project-column">{item.project_name}</td>
                    <td className="table-cell catalogue-column">{item.project_code}</td>
                    <td className="table-cell remarks-column">{item.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data-state">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssueDataTable;