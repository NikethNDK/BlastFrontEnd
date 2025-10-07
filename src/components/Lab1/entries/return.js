import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import "./TransferredDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";
import LabNavigation1 from "../homeLab/LabNavigation1";

const ReturnDataTable = ({ 
  userDetails = { name: '', lab: '', designation: '' } 
}) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/item_return/");
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
        "Manufacturer": item.manufacturer,
        "Supplier": item.supplier,
        "Project Name": item.project_name,
        "Invoice No": item.invoice_no,
        "Return Date": item.return_date,
        "Remarks": item.remarks,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Return Data");
    XLSX.writeFile(workbook, "ReturnData.xlsx");
  };

  // Calculate totals
  const totalQuantityReturned = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_returned) || 0),
    0
  );

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", className: "entry-no-column" },
    { label: "Item Name", key: "item_name", className: "item-name-column" },
    { label: "Item Code", key: "item_code", className: "item-code-column" },
    { label: "Quantity Returned", key: "quantity_returned", className: "quantity-column" },
    { label: "Batch Number", key: "batch_number", className: "batch-column" },
    { label: "Receipt Date", key: "receipt_date", className: "date-column" },
    { label: "Expiry Date", key: "expiry_date", className: "date-column" },
    { label: "Manufacturer", key: "manufacturer", className: "manufacturer-column" },
    { label: "Supplier", key: "supplier", className: "supplier-column" },
    { label: "Project Name", key: "project_name", className: "project-column" },
    { label: "Invoice No", key: "invoice_no", className: "invoice-column" },
    { label: "Return Date", key: "return_date", className: "date-column" },
    { label: "Remarks", key: "remarks", className: "remarks-column" },
  ];

  return (
    <div>
      <div className="table-container">
        <h2>Return Data</h2>
        
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
            <strong>Total Quantity Returned:</strong> {totalQuantityReturned}
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
                    {key === "return_date" ? (
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
                    <td className="table-cell quantity-column">{item.quantity_returned}</td>
                    <td className="table-cell batch-column">{item.batch_number}</td>
                    <td className="table-cell date-column">{item.receipt_date}</td>
                    <td className="table-cell date-column">{item.expiry_date}</td>
                    <td className="table-cell manufacturer-column">{item.manufacturer}</td>
                    <td className="table-cell supplier-column">{item.supplier}</td>
                    <td className="table-cell project-column">{item.project_name}</td>
                    <td className="table-cell invoice-column">{item.invoice_no}</td>
                    <td className="table-cell date-column">{item.return_date}</td>
                    <td className="table-cell remarks-column">{item.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="no-data-state">
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

export default ReturnDataTable;