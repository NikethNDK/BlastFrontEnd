import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransferredDataTable.css";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { AiOutlineDownload } from "react-icons/ai";
import LabNavigation1 from "../homeLab/LabNavigation1";

const ReceivedDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromToDate, setFromToDate] = useState("");
  const [toFromDate, setToFromDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/transfer_data/"
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
      alert("No data to download!");
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

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", className: "entry-no-column" },
    { label: "Item Code", key: "item_code", className: "item-code-column" },
    { label: "Item Name", key: "item_name", className: "item-name-column" },
    { label: "Unit", key: "unit_measure", className: "quantity-column" },
    { label: "Price", key: "price_unit", className: "price-column" },
    { label: "Quantity Received", key: "quantity_received", className: "quantity-column" },
    { label: "Batch Number", key: "batch_number", className: "batch-column" },
    { label: "Remarks", key: "remarks", className: "remarks-column" },
    { label: "Receipt Date", key: "receipt_date", className: "date-column" },
    { label: "Expiry Date", key: "expiry_date", className: "date-column" },
    { label: "Manufacturer", key: "manufacturer", className: "manufacturer-column" },
    { label: "Supplier", key: "supplier", className: "supplier-column" },
    { label: "Project Name", key: "project_name", className: "project-column" },
    { label: "Invoice No/Date", key: "invoice_no", className: "invoice-column" },
    { label: "Catalogue No", key: "bill_no", className: "catalogue-column" },
    { label: "Po Number/Date", key: "po_number", className: "po-column" },
    { label: "Location", key: "location", className: "location-column" },
  ];

  return (
    <div>
      <div className="table-container">
        <h2>Received Data</h2>
        
        {/* Total Summary */}
        <div className="total-summary" style={{ 
          marginBottom: "1rem", 
          padding: "1rem", 
          backgroundColor: "#f7f9fc", 
          borderRadius: "6px", 
          display: "flex", 
          justifyContent: "space-around",
          fontWeight: "600"
        }}>
          <p>
            <strong>Total Unit Price:</strong> {totalUnitPrice.toFixed(2)}
          </p>
          <p>
            <strong>Total Quantity Received:</strong> {totalQuantityReceived}
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
                    {key === "expiry_date" ? (
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
                    ) : key === "receipt_date" ? (
                      <>
                        <br />
                        <div className="date-filter-container">
                          <div className="date-filter-row">
                            <label className="date-filter-label">From:</label>
                            <input
                              type="date"
                              value={fromToDate}
                              onChange={(e) =>
                                handleReceiptDateChange(e, "from")
                              }
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
                  <tr key={item.entry_no}>
                    <td className="table-cell entry-no-column">{item.entry_no}</td>
                    <td className="table-cell item-code-column">{item.item_code}</td>
                    <td className="table-cell item-name-column">{item.item_name}</td>
                    <td className="table-cell quantity-column">{item.unit_measure}</td>
                    <td className="table-cell price-column">{item.price_unit}</td>
                    <td className="table-cell quantity-column">{item.quantity_received}</td>
                    <td className="table-cell batch-column">{item.batch_number}</td>
                    <td className="table-cell remarks-column">{item.remarks}</td>
                    <td className="table-cell date-column">{item.receipt_date}</td>
                    <td className="table-cell date-column">{item.expiry_date}</td>
                    <td className="table-cell manufacturer-column">{item.manufacturer}</td>
                    <td className="table-cell supplier-column">{item.supplier}</td>
                    <td className="table-cell project-column">{item.project_name}</td>
                    <td className="table-cell invoice-column">{item.invoice_no}</td>
                    <td className="table-cell catalogue-column">{item.bill_no}</td>
                    <td className="table-cell po-column">{item.po_number}</td>
                    <td className="table-cell location-column">{item.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="no-data-state">
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

export default ReceivedDataTable;