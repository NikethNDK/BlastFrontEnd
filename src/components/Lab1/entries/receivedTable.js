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
  // const [filters, setFilters] = useState({});
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
    { label: "Entry No", key: "entry_no" },
    { label: "Item Code", key: "item_code" },
    { label: "Item Name", key: "item_name" },
    { label: "Unit", key: "unit_measure" },
    { label: "Price", key: "price_unit" },
    { label: "Quantity Received", key: "quantity_received" },
    { label: "Batch Number", key: "batch_number" },
    { label: "Remarks", key: "remarks" },
    { label: "Receipt Date", key: "receipt_date" },
    { label: "Expiry Date", key: "expiry_date" },
    { label: "Manufacturer", key: "manufacturer" },
    { label: "Supplier", key: "supplier" },
    { label: "Project Name", key: "project_name" },
    { label: "Invoice No/Date", key: "invoice_no" },
    { label: "Catalogue No", key: "bill_no" },
    { label: "Po Number/Date", key: "po_number" },
    { label: "Location", key: "location" },
  ];

  return (
    <div>
      <div className="table-container">
        <h2>Received Data</h2>
        <div className="total-summary">
          <p>
            <strong>Total Unit Price:</strong> {totalUnitPrice.toFixed(2)}
          </p>
          <p>
            <strong>Total Quantity Received:</strong> {totalQuantityReceived}
          </p>
        </div>
   
        <div
          style={{
            marginTop: "-50px",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              marginLeft: "95%",
              width: "3%",
              height: "20%",
              border: "none",
              backgroundColor: "#198754",
              color: "White",
              borderRadius: "5px",
              marginTop: "-1px",
            }}
            variant="success"
            onClick={handleDownload}
          >
            <AiOutlineDownload size={20} />
          </button>
        </div>
        <p></p>

        <div
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            borderRadius: "1px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          className="table-wrapper"
        >
          <table
            style={{
              width: "100%",
              borderRadius: "2px",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
            className="styled-table"
          >
            <thead>
              <tr>
                {tableHeadings.map(({ label, key }, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid black",
                      backgroundColor: "rgb(197, 234, 49)",
                      color: "black",
                    }}
                  >
                    {label}
                    {key === "expiry_date" ? (
                      <>
                        <br />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <label
                              style={{ fontWeight: "bold", width: "40px" }}
                            >
                              From:
                            </label>
                            <input
                              type="date"
                              value={fromDate}
                              onChange={(e) => handleDateChange(e, "from")}
                              style={{
                                flex: 1,
                                padding: "2px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <label
                              style={{ fontWeight: "bold", width: "40px" }}
                            >
                              To:
                            </label>
                            <input
                              type="date"
                              value={toDate}
                              onChange={(e) => handleDateChange(e, "to")}
                              style={{
                                flex: 1,
                                padding: "2px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : key === "receipt_date" ? (
                      <>
                        <br />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <label
                              style={{ fontWeight: "bold", width: "40px" }}
                            >
                              From:
                            </label>
                            <input
                              type="date"
                              value={fromToDate}
                              onChange={(e) =>
                                handleReceiptDateChange(e, "from")
                              }
                              style={{
                                flex: 1,
                                padding: "2px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <label
                              style={{ fontWeight: "bold", width: "40px" }}
                            >
                              To:
                            </label>
                            <input
                              type="date"
                              value={toFromDate}
                              onChange={(e) => handleReceiptDateChange(e, "to")}
                              style={{
                                flex: 1,
                                padding: "2px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                              }}
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
              {filteredData.map((item) => (
                <tr key={item.entry_no}>
                  {tableHeadings.map(({ key }, idx) => (
                    <td
                      key={idx}
                      style={{ padding: "10px", border: "1px solid black" }}
                    >
                      {item[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceivedDataTable;
