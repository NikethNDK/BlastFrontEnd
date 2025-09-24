import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransferredDataTable.css";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { AiOutlineDownload } from "react-icons/ai";
import { getmanagerEmployeeApi } from "../../../services/AppinfoService";
import LabNavigation1 from "../homeLab/LabNavigation1";
const TransferredDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [receiptDateFilter, setReceiptDateFilter] = useState("");
  const [managerNames, setManagerNames] = useState([]); // Stores manager dropdown options
  const [selectedManager, setSelectedManager] = useState(""); // Stores selected manager

  const filteredReceiptData = data.filter((item) =>
    item.receipt_date.includes(receiptDateFilter)
  );
  useEffect(() => {
    // Fetch managers based on the lab
    if (userDetails.lab) {
      getmanagerEmployeeApi(userDetails.lab)
        .then((data) => {
          console.log("Received manager data:", data);
          setManagerNames(data.map((item) => ({ value: item, label: item })));
        })
        .catch((error) => console.error("Error fetching Manager Names:", error));
    }
  }, [userDetails.lab]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/inventoryReceive/"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelect = (id, item) => {
    setSelectedItem(item);
    setUpdatedQuantity(item.quantity_received); // Show full quantity initially
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
  const handleQuantityChange = (e) => {
    let returnQuantity = parseInt(e.target.value, 10);

    if (isNaN(returnQuantity)) {
      setUpdatedQuantity(""); // Allow smooth typing
      return;
    }

    // Ensure input is within valid range
    if (
      returnQuantity >= 0 &&
      returnQuantity <= selectedItem.quantity_received
    ) {
      setUpdatedQuantity(returnQuantity); // Store return quantity
    } else {
      alert(`Enter a value between 0 and ${selectedItem.quantity_received}.`);
    }
  };

  const handleUpdate = async () => {
    try {
      const returnQuantity = updatedQuantity; // User-entered return quantity
      const remainingQuantity = selectedItem.quantity_received - returnQuantity; // Remaining quantity

      if (!selectedManager) {
        alert("Please select a manager.");
        return;
      }

      await axios.put(
        `http://localhost:8000/update_transfer/${selectedItem.entry_no}/`,
        {
          quantity_returned: returnQuantity,
          manager_username: selectedManager, // Send selected manager
        }
      );

      alert("Quantity updated and return recorded!");
      fetchData(); // Refresh table after update
      setSelectedItem(null);
      closePopup();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  // Inline Styles
  const returnButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    marginBottom: "12px",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    // borderRadius: "5px",
    transition: "background-color 0.3s ease",
  };

  const returnButtonDisabledStyle = {
    backgroundColor: "#d3d3d3",
    cursor: "not-allowed",
  };

  const returnButtonHoverStyle = {
    backgroundColor: "#45a049",
  };

  const popupStyle = {
    position: "absolute",
    top: "20px", // Adjust as needed to position below the table
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: "1000",
  };

  const popupContentStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "300px",
    textAlign: "center",
  };

  const popupButtonStyle = {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "5px",
    transition: "background-color 0.3s ease",
  };

  const popupButtonHoverStyle = {
    backgroundColor: "#45a049",
  };

  const cancelButtonStyle = {
    backgroundColor: "#f44336",
  };

  const cancelButtonHoverStyle = {
    backgroundColor: "#d32f2f",
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
        "Quantity to be returned": item.quantity_received,
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
  const filteredData = data.filter((item) =>
    Object.keys(filters).every((key) => {
      const cellValue = String(item[key] || "").toLowerCase();
      const filterValue = String(filters[key] || "").toLowerCase();
      return filterValue ? cellValue.includes(filterValue) : true;
    })
  );
  const tableHeadings = [
    { label: "Entry No", key: "entry_no" },
    { label: "Item Code", key: "item_code" },
    { label: "Item Name", key: "item_name" },
    { label: "Price", key: "price_unit" },
    { label: "Received Quantity", key: "quantity_received" },
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
        <h2>Add Return</h2>

        <button
          style={{
            marginLeft: "95%",
            width: "3%",
            height: "20%",
            border: "none",
            backgroundColor: "#198754",
            color: "White",
            // borderRadius: "5px",
            marginTop: "-1px",
          }}
          variant="success"
          onClick={handleDownload}
        >
          <AiOutlineDownload size={20} />
        </button>
        {/* Return Button */}
        <button
          style={{
            ...returnButtonStyle,
            ...(selectedItem
              ? returnButtonHoverStyle
              : returnButtonDisabledStyle),
            marginTop: "-10px",
          }}
          disabled={!selectedItem}
          onClick={openPopup}
        >
          Return
        </button>

     

        <div
          style={{
            width: "100%",
            padding: "20px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "100%",
              overflowX: "auto",
              height: "390px",

              borderRadius: "1px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderRadius: "2px",
                border: "1px solid black",
                borderCollapse: "collapse",
                backgroundColor: "white",
              }}
            >
              <thead style={{ padding: "10px", border: "1px solid black" }}>
                <tr
                  style={{
                    backgroundColor: "rgb(197, 234, 49)",
                    color: "black",
                    border: "1px solid black",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      position: "sticky",

                      border: "1px solid black",
                      top: "0",
                      backgroundColor: "rgb(197, 234, 49)",
                    }}
                  >
                    Select
                  </th>
                  {tableHeadings.map(({ label, key }, index) => (
                    <th
                      key={index}
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        border: "1px solid black",
                        position: "sticky",
                        top: "0",
                        backgroundColor: "rgb(197, 234, 49)",
                      }}
                    >
                      {label}
                      <br />
                      <input
                        type="text"
                        placeholder="Filter"
                        style={{
                          width: "100%",
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid black",
                          fontSize: "12px",
                        }}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.entry_no}
                    style={{
                      borderBottom: "1px solid black",
                      transition: "background 0.3s ease",
                    }}
                  >
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      <input
                        type="radio"
                        name="selectedRow"
                        value={item.entry_no}
                        checked={selectedItem?.entry_no === item.entry_no}
                        onChange={() => handleSelect(item.entry_no, item)}
                        style={{ transform: "scale(1.2)" }}
                      />
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.entry_no}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.item_code}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.item_name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.price_unit}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.quantity_received}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.batch_number}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.remarks}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.receipt_date}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.expiry_date}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.manufacturer}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.supplier}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.project_name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.invoice_no}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.bill_no}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.po_number}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid black" }}>
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popup Window */}
        {isPopupOpen && (
          <div style={popupStyle}>
            <div style={popupContentStyle}>
              <h3>Return Item</h3>
              <p>
                <strong>Item Name:</strong> {selectedItem.item_name}
              </p>
              <p>
                <strong>Item Code:</strong> {selectedItem.item_code}
              </p>
              <p>
                <p>
                  <strong>Select Manager:</strong>
                </p>
                <select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  <option value="">Select Manager</option>
                  {managerNames.map((manager) => (
                    <option key={manager.value} value={manager.value}>
                      {manager.label}
                    </option>
                  ))}
                </select>
                <p></p>
                <strong>Quantity To Be Returned:</strong>
              </p>
              <input
                type="number"
                value={updatedQuantity} // Shows return quantity
                min="0"
                max={selectedItem.quantity_received}
                onChange={handleQuantityChange}
              />

              <p>
                <strong>Remaining Quantity:</strong>{" "}
                {selectedItem.quantity_received - updatedQuantity}
              </p>

              <br />
              <button
                style={popupButtonStyle}
                onClick={handleUpdate}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor =
                    popupButtonHoverStyle.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    popupButtonStyle.backgroundColor)
                }
              >
                Update Quantity
              </button>
              <button
                style={{ ...popupButtonStyle, ...cancelButtonStyle }}
                onClick={closePopup}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor =
                    cancelButtonHoverStyle.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    cancelButtonStyle.backgroundColor)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferredDataTable;
