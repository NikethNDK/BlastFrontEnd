import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import LabNavigation1 from "./LabNavigation1";
import "../entries/TransferredDataTable.css";
import { AiOutlineDownload } from "react-icons/ai";

const EquipmentList = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    id: "",
    item_name: "",
    item_code: "",
    last_service_date: "",
    calibration_dates: "",
    expiry_date: "",
    min_req_stock: "",
    price_unit: "",
    project_code: "",
    location: "",
    quantity_received: "",
  });

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/equipment/get/"
        );
        if (response.data && response.data.data) {
          setEquipmentData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, []);

  useEffect(() => {
    const filtered = equipmentData.filter((item) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return String(item[key])
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      });
    });
    setFilteredData(filtered);
  }, [filters, equipmentData]);

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "ID": item.id,
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Last Service Date": item.last_service_date,
        "Calibration Dates": item.calibration_dates,
        "Expiry Date": item.expiry_date,
        "Min Stock": item.min_req_stock,
        "Price/Unit": item.price_unit,
        "Project Code": item.project_code,
        "Location": item.location,
        "Quantity Received": item.quantity_received,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment Data");
    XLSX.writeFile(workbook, "EquipmentData.xlsx");
  };

  // Calculate totals
  const totalQuantityReceived = filteredData.reduce(
    (sum, item) => sum + (parseInt(item.quantity_received) || 0),
    0
  );

  const totalEquipmentItems = filteredData.length;

  const tableHeadings = [
    { label: "ID", key: "id", className: "entry-no-column" },
    { label: "Item Name", key: "item_name", className: "item-name-column" },
    { label: "Item Code", key: "item_code", className: "item-code-column" },
    { label: "Last Service Date", key: "last_service_date", className: "date-column" },
    { label: "Calibration Dates", key: "calibration_dates", className: "date-column" },
    { label: "Expiry Date", key: "expiry_date", className: "date-column" },
    { label: "Min Stock", key: "min_req_stock", className: "quantity-column" },
    { label: "Price/Unit", key: "price_unit", className: "price-column" },
    { label: "Project Code", key: "project_code", className: "project-column" },
    { label: "Location", key: "location", className: "location-column" },
    { label: "Quantity Received", key: "quantity_received", className: "quantity-column" },
  ];

  if (loading) {
    return (
      <div className="loading-state">
        Loading equipment data...
      </div>
    );
  }

  return (
    <div>
      <div className="table-container">
        <h2>Equipment Details</h2>
        
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
            <strong>Total Equipment Items:</strong> {totalEquipmentItems}
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
                    <br />
                    <input
                      type="text"
                      placeholder="Filter"
                      className="filter-input"
                      value={filters[key] || ""}
                      onChange={(e) => handleFilterChange(e, key)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="table-cell entry-no-column">{item.id}</td>
                    <td className="table-cell item-name-column">{item.item_name}</td>
                    <td className="table-cell item-code-column">{item.item_code}</td>
                    <td className="table-cell date-column">{item.last_service_date}</td>
                    <td className="table-cell date-column">{item.calibration_dates}</td>
                    <td className="table-cell date-column">{item.expiry_date}</td>
                    <td className="table-cell quantity-column">{item.min_req_stock}</td>
                    <td className="table-cell price-column">{item.price_unit}</td>
                    <td className="table-cell project-column">{item.project_code}</td>
                    <td className="table-cell location-column">{item.location}</td>
                    <td className="table-cell quantity-column">{item.quantity_received}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-data-state">
                    No matching records found
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

export default EquipmentList;