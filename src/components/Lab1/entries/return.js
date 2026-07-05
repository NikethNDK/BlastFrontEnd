import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import "./ReturnDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";
import { FaUndo } from "react-icons/fa";
import { BASE_URL } from "../../../services/AppinfoService";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { PageLayout, PageHeader } from "../../layout/content";

const ReturnDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const reduxUser = useSelector((state) => state.user.user);

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
      const params = {};
      if (username) {
        params.username = username;
      }
      if (labName) {
        params.lab = labName;
      }

      console.log("🌐 [API] get_returned_items called with:", {
        username,
        lab: labName,
        params,
      });

      const response = await axios.get(`${BASE_URL}/item_return/`, {
        params: params,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleDateChange = (e, type) => {
    if (type === "from") setFromDate(e.target.value);
    else setToDate(e.target.value);
  };

  const filteredData = data
    .filter((item) => {
      return (
        Object.keys(filters).every((key) => {
          const cellValue = String(item[key] || "").toLowerCase();
          const filterValue = String(filters[key] || "").toLowerCase();
          return filterValue ? cellValue.includes(filterValue) : true;
        }) &&
        (!fromDate || new Date(item.return_date) >= new Date(fromDate)) &&
        (!toDate || new Date(item.return_date) <= new Date(toDate))
      );
    })
    .sort((a, b) => a.entry_no - b.entry_no);

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
        "Quantity Returned": item.quantity_returned,
        "Batch Number": item.batch_number,
        "Receipt Date": item.receipt_date,
        "Expiry Date": item.expiry_date,
        Manufacturer: item.manufacturer,
        Supplier: item.supplier,
        "Project Name": item.project_name,
        "Invoice No": item.invoice_no,
        "Return Date": item.return_date,
        Remarks: item.remarks,
      }))
    );

    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Return Data");
    XLSX.writeFile(workbook, "ReturnData.xlsx");
  };

  const totalQuantityReturned = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_returned, 10) || 0),
    0
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, fromDate, toDate]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", colClass: "rtn-col--entry" },
    { label: "Item Name", key: "item_name", colClass: "rtn-col--name" },
    { label: "Item Code", key: "item_code", colClass: "rtn-col--code" },
    { label: "Quantity Returned", key: "quantity_returned", colClass: "rtn-col--qty" },
    { label: "Batch Number", key: "batch_number", colClass: "rtn-col--batch" },
    { label: "Receipt Date", key: "receipt_date", colClass: "rtn-col--receipt-date" },
    { label: "Expiry Date", key: "expiry_date", colClass: "rtn-col--expiry" },
    { label: "Manufacturer", key: "manufacturer", colClass: "rtn-col--manufacturer" },
    { label: "Supplier", key: "supplier", colClass: "rtn-col--supplier" },
    { label: "Project Name", key: "project_name", colClass: "rtn-col--project" },
    { label: "Invoice No", key: "invoice_no", colClass: "rtn-col--invoice" },
    { label: "Return Date", key: "return_date", colClass: "rtn-col--return-date" },
    { label: "Remarks", key: "remarks", colClass: "rtn-col--remarks" },
  ];

  const hasActiveFilters =
    Object.values(filters).some(Boolean) || fromDate || toDate;

  return (
    <PageLayout>
      <PageHeader
        title="Return data"
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

      <div className="return-data-page">
        <div className="project-stats" role="list">
          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--total">
              <FaUndo aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{totalQuantityReturned}</span>
              <span className="project-stat-label">Total Quantity Returned</span>
            </div>
          </div>
        </div>

        <section className="project-panel" aria-label="Return data list">
          <div className="project-table-section">
            <div className="project-table-shell">
              <table className="project-table">
                <thead>
                  <tr className="project-thead-labels">
                    {tableHeadings.map(({ label, key, colClass }) => (
                      <th
                        key={key}
                        scope="col"
                        className={`project-th-label-cell rtn-col ${colClass}`}
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
                        className={`project-th-filter-cell rtn-col ${colClass}`}
                      >
                        {key === "return_date" ? (
                          <div className="return-date-filter">
                            <div className="return-date-filter-row">
                              <label
                                htmlFor="return-from-date"
                                className="return-date-filter-label"
                              >
                                From
                              </label>
                              <input
                                id="return-from-date"
                                type="date"
                                value={fromDate}
                                onChange={(e) => handleDateChange(e, "from")}
                                className="return-date-filter-input"
                              />
                            </div>
                            <div className="return-date-filter-row">
                              <label
                                htmlFor="return-to-date"
                                className="return-date-filter-label"
                              >
                                To
                              </label>
                              <input
                                id="return-to-date"
                                type="date"
                                value={toDate}
                                onChange={(e) => handleDateChange(e, "to")}
                                className="return-date-filter-input"
                              />
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Filter"
                            className="return-col-filter"
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
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr
                        key={item.entry_no || item.id}
                        className="project-table-row"
                      >
                        <td className="rtn-col rtn-col--entry" data-label="Entry No">
                          <span className="return-entry-no">{item.entry_no}</span>
                        </td>
                        <td className="rtn-col rtn-col--name" data-label="Item Name">{item.item_name}</td>
                        <td className="rtn-col rtn-col--code" data-label="Item Code">{item.item_code}</td>
                        <td className="rtn-col rtn-col--qty" data-label="Quantity Returned">
                          <span className="return-qty">
                            {item.quantity_returned}
                          </span>
                        </td>
                        <td className="rtn-col rtn-col--batch" data-label="Batch Number">{item.batch_number}</td>
                        <td className="rtn-col rtn-col--receipt-date" data-label="Receipt Date">
                          <time className="return-date" dateTime={item.receipt_date}>
                            {item.receipt_date}
                          </time>
                        </td>
                        <td className="rtn-col rtn-col--expiry" data-label="Expiry Date">
                          <time className="return-date" dateTime={item.expiry_date}>
                            {item.expiry_date}
                          </time>
                        </td>
                        <td className="rtn-col rtn-col--manufacturer" data-label="Manufacturer">{item.manufacturer}</td>
                        <td className="rtn-col rtn-col--supplier" data-label="Supplier">{item.supplier}</td>
                        <td className="rtn-col rtn-col--project" data-label="Project Name">{item.project_name}</td>
                        <td className="rtn-col rtn-col--invoice" data-label="Invoice No">{item.invoice_no}</td>
                        <td className="rtn-col rtn-col--return-date" data-label="Return Date">
                          <time className="return-date" dateTime={item.return_date}>
                            {item.return_date}
                          </time>
                        </td>
                        <td className="rtn-col rtn-col--remarks" data-label="Remarks">
                          <span className="return-remarks">{item.remarks}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="project-table-row project-table-row--empty">
                      <td colSpan="13">
                        <div className="project-empty">
                          <div className="project-empty-icon-wrap">
                            <FaUndo aria-hidden />
                          </div>
                          <h3>No records found</h3>
                          <p>
                            {hasActiveFilters
                              ? "Try adjusting your column filters or date range."
                              : "No return data is available yet."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredData.length}
                startIndex={startIndex}
                endIndex={endIndex}
                position="bottom"
              />
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ReturnDataTable;
