import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./ReceivedDataTable.css";
import * as XLSX from "xlsx";
import { FaDownload, FaMoneyBillWave, FaBoxes } from "react-icons/fa";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../services/AppinfoService";
import { useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import { PageLayout, PageHeader } from "../../layout/content";

const ReceivedDataTable = ({
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromToDate, setFromToDate] = useState("");
  const [toFromDate, setToFromDate] = useState("");
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

      console.log("🌐 [API] get_transferred_data called with:", { username, lab: labName, params });

      const response = await axios.get(
        `${BASE_URL}/api/transfer_data/`,
        { params: params }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelect = (id, item) => {
    setSelectedItem(item);
    setUpdatedQuantity(item.quantity_received); // Set initial quantity
  };

  const openPopup = () => {
    if (selectedItem) {
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null); // Deselect the selected item
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      toast.error("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Catalogue No": item.bill_no,
        "Po Number/Date": item.po_number,
        "Item Code": item.item_code,
        "Item Name": item.item_name,
        Price: item.price_unit,
        "Quantity Received": item.quantity_received,
        "Batch Number": item.batch_number,
        Remarks: item.remarks,
        "Receipt Date": item.receipt_date,
        "Expiry Date": item.expiry_date,
        Manufacturer: item.manufacturer,
        Supplier: item.supplier,
        "Project Name": item.project_name,
        "Invoice No/Date": item.invoice_no,
        Location: item.location,
      }))
    );

    // Protecting the sheet from edits
    worksheet["!protect"] = {
      password: "readonly",
      edit: false, // Disable editing
      selectLockedCells: true, // Allow selection of locked cells
      selectUnlockedCells: false, // Prevent editing
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Received Data");

    // Save the file
    XLSX.writeFile(workbook, "ReceivedData.xlsx");
  };

  const handleDateChange = (e, type) => {
    if (type === "from") setFromDate(e.target.value);
    else setToDate(e.target.value);
  };

  const handleReceiptDateChange = (e, type) => {
    if (type === "from") setFromToDate(e.target.value);
    else setToFromDate(e.target.value);
  };

  const filteredData = data.filter((item) => {
    return (
      Object.keys(filters).every((key) => {
        const cellValue = String(item[key] || "").toLowerCase();
        const filterValue = String(filters[key] || "").toLowerCase();
        return filterValue ? cellValue.includes(filterValue) : true;
      }) &&
      (!fromDate || new Date(item.expiry_date) >= new Date(fromDate)) &&
      (!toDate || new Date(item.expiry_date) <= new Date(toDate)) &&
      (!fromToDate || new Date(item.receipt_date) >= new Date(fromToDate)) &&
      (!toFromDate || new Date(item.receipt_date) <= new Date(toFromDate))
    );
  });

  // Function to handle input change
  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const totalUnitPrice = filteredData.reduce(
    (sum, item) => sum + (parseFloat(item.price_unit) || 0),
    0
  );
  const totalQuantityReceived = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_received) || 0),
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
  }, [filters, fromDate, toDate, fromToDate, toFromDate]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", colClass: "rdt-col--entry" },
    { label: "Item Code", key: "item_code", colClass: "rdt-col--code" },
    { label: "Item Name", key: "item_name", colClass: "rdt-col--name" },
    { label: "Unit", key: "unit_measure", colClass: "rdt-col--unit" },
    { label: "Price", key: "price_unit", colClass: "rdt-col--price" },
    { label: "Quantity Received", key: "quantity_received", colClass: "rdt-col--qty-wide" },
    { label: "Batch Number", key: "batch_number", colClass: "rdt-col--batch" },
    { label: "Remarks", key: "remarks", colClass: "rdt-col--remarks" },
    { label: "Receipt Date", key: "receipt_date", colClass: "rdt-col--date" },
    { label: "Expiry Date", key: "expiry_date", colClass: "rdt-col--expiry" },
    { label: "Manufacturer", key: "manufacturer", colClass: "rdt-col--manufacturer" },
    { label: "Supplier", key: "supplier", colClass: "rdt-col--supplier" },
    { label: "Project Name", key: "project_name", colClass: "rdt-col--project" },
    { label: "Invoice No/Date", key: "invoice_no", colClass: "rdt-col--invoice" },
    { label: "Catalogue No", key: "bill_no", colClass: "rdt-col--catalogue" },
    { label: "Po Number/Date", key: "po_number", colClass: "rdt-col--po" },
    { label: "Location", key: "location", colClass: "rdt-col--location" },
  ];

  const renderColumnFilter = (key) => {
    if (key === "expiry_date") {
      return (
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
      );
    }

    if (key === "receipt_date") {
      return (
        <div className="date-filter-container">
          <div className="date-filter-row">
            <label className="date-filter-label">From:</label>
            <input
              type="date"
              value={fromToDate}
              onChange={(e) => handleReceiptDateChange(e, "from")}
              className="date-filter-input"
            />
          </div>
          <div className="date-filter-row">
            <label className="date-filter-label">To:</label>
            <input
              type="date"
              value={toFromDate}
              onChange={(e) => handleReceiptDateChange(e, "to")}
              className="date-filter-input"
            />
          </div>
        </div>
      );
    }

    return (
      <input
        type="text"
        placeholder="Filter"
        className="filter-input"
        value={filters[key] || ""}
        onChange={(e) => handleFilterChange(e, key)}
      />
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Received data"
        actions={
          <button
            type="button"
            className="lims-header-btn"
            onClick={handleDownload}
            title="Download Excel"
          >
            <FaDownload aria-hidden />
            Download
          </button>
        }
      />

      <div className="received-data-page">
        <div className="project-stats" role="list">
          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--price">
              <FaMoneyBillWave aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">
                {totalUnitPrice.toFixed(2)}
              </span>
              <span className="project-stat-label">Total unit price</span>
            </div>
          </div>

          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--quantity">
              <FaBoxes aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{totalQuantityReceived}</span>
              <span className="project-stat-label">Total quantity received</span>
            </div>
          </div>
        </div>

        <section className="project-panel" aria-label="Received data">
          <div className="project-table-section">
            <div className="project-table-shell">
              <table className="project-table">
                <thead>
                  <tr className="project-thead-labels">
                    {tableHeadings.map(({ label, key, colClass }) => (
                      <th
                        key={key}
                        scope="col"
                        className={`project-th-label-cell rdt-col ${colClass}`}
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
                        className={`project-th-filter-cell rdt-col ${colClass}`}
                      >
                        {renderColumnFilter(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={item.entry_no} className="project-table-row">
                        {tableHeadings.map(({ key, colClass }) => (
                          <td key={key} className={`rdt-col ${colClass}`}>
                            {item[key]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="project-table-row project-table-row--empty">
                      <td colSpan="17">
                        <div className="project-empty">
                          <div className="project-empty-icon-wrap">
                            <FaBoxes aria-hidden />
                          </div>
                          <h3>No records found</h3>
                          <p>Try adjusting your column filters.</p>
                        </div>
                      </td>
                    </tr>
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

export default ReceivedDataTable;
