import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransferredDataTable.css"; // Use the new CSS file
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import { AiOutlineDownload } from "react-icons/ai";
import { getmanagerEmployeeApi } from "../../../services/AppinfoService";
import LabNavigation1 from "../homeLab/LabNavigation1";
import { BASE_URL } from "../../../services/AppinfoService";

const TransferredDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [receiptDateFilter, setReceiptDateFilter] = useState("");
  const [managerNames, setManagerNames] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");

  const filteredReceiptData = data.filter((item) =>
    item.receipt_date.includes(receiptDateFilter)
  );

  useEffect(() => {
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
        `${BASE_URL}/api/inventoryReceive/`
      );
      console.log("🔍 [FRONTEND] Fetched data:", response.data);
      console.log("🔍 [FRONTEND] Sample item (entry 20):", response.data.find(item => item.entry_no === 20));
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelect = (id, item) => {
    console.log("🔍 [FRONTEND] Selected item:", item);
    console.log("🔍 [FRONTEND] Item stock:", item.stock);
    console.log("🔍 [FRONTEND] Item quantity_received:", item.quantity_received);
    setSelectedItem(item);
    setUpdatedQuantity(0); // Start with 0, let user input the return quantity
  };

  const openPopup = () => {
    if (selectedItem) {
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for user to clear and retype
    if (value === "") {
      setUpdatedQuantity("");
      return;
    }
    
    const returnQuantity = parseInt(value, 10);
    
    // Only update if it's a valid number
    if (!isNaN(returnQuantity)) {
      setUpdatedQuantity(returnQuantity);
    } else {
      // If it's not a valid number, keep the current value
      setUpdatedQuantity(updatedQuantity);
    }
  };

  const handleQuantityBlur = (e) => {
    const returnQuantity = parseInt(e.target.value, 10);
    
    if (isNaN(returnQuantity) || returnQuantity < 0) {
      setUpdatedQuantity(0);
      return;
    }
    
    if (returnQuantity > selectedItem.quantity_received) {
      toast.error(`Return quantity cannot exceed available stock (${selectedItem.quantity_received}).`);
      setUpdatedQuantity(selectedItem.quantity_received);
    }
  };

  const handleUpdate = async () => {
    try {
      const returnQuantity = updatedQuantity;
      const remainingQuantity = selectedItem.stock - returnQuantity;

      console.log("🔍 [FRONTEND] Return attempt:", {
        returnQuantity,
        selectedItem: selectedItem,
        selectedManager,
        remainingQuantity
      });

      if (!selectedManager) {
        toast.error("Please select a manager.");
        return;
      }

      if (returnQuantity <= 0) {
        toast.error("Return quantity must be greater than 0.");
        return;
      }

      if (returnQuantity > selectedItem.quantity_received) {
        toast.error(`Return quantity cannot exceed available stock (${selectedItem.quantity_received}).`);
        return;
      }

      await axios.put(
        `${BASE_URL}/update_transfer/${selectedItem.entry_no}/`,
        {
          quantity_returned: returnQuantity,
          manager_username: selectedManager,
        }
      );

      toast.success(`Return processed successfully! Removed ${returnQuantity} items from inventory.`);
      fetchData();
      setSelectedItem(null);
      closePopup();
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to process return.");
      }
    }
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
        "Available Stock": item.stock,
        "Remaining Stock": item.quantity_received,
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

    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Received Data");
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
    { label: "Entry No", key: "entry_no", className: "entry-no-column" },
    { label: "Item Code", key: "item_code", className: "item-code-column" },
    { label: "Item Name", key: "item_name", className: "item-name-column" },
    { label: "Price", key: "price_unit", className: "price-column" },
    { label: "Remaining Stock", key: "quantity_received", className: "quantity-column"},
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
  console.log(data)
  return (
    <div>
      <div className="table-container">
        <h2>Add Return</h2>

        {/* Header Controls */}
        <div className="table-header-controls">
          <button
            className={`return-button ${!selectedItem ? 'disabled' : ''}`}
            disabled={!selectedItem}
            onClick={openPopup}
          >
            Return
          </button>
          
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
                <th className="table-header select-column">
                  Select
                </th>
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
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.entry_no}>
                    <td className="table-cell select-column">
                      <input
                        type="radio"
                        name="selectedRow"
                        value={item.entry_no}
                        checked={selectedItem?.entry_no === item.entry_no}
                        onChange={() => handleSelect(item.entry_no, item)}
                      />
                    </td>
                    <td className="table-cell entry-no-column">{item.entry_no}</td>
                    <td className="table-cell item-code-column">{item.item_code}</td>
                    <td className="table-cell item-name-column">{item.item_name}</td>
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

        {/* Popup Window */}
        {isPopupOpen && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h3>Return Item</h3>
              
              <p>
                <strong>Item Name:</strong> {selectedItem.item_name}
              </p>
              
              <p>
                <strong>Item Code:</strong> {selectedItem.item_code}
              </p>

              <p>
                <strong>Available Stock (Can Return):</strong> {selectedItem.quantity_received}
              </p>

              {/* <p>
                <strong>Total Received:</strong> {selectedItem.quantity_received}
              </p> */}

              <div className="popup-form-group">
                <label className="popup-form-label">Select Manager:</label>
                <select
                  className="popup-form-select"
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  <option value="">Select Manager</option>
                  {managerNames.map((manager) => (
                    <option key={manager.value} value={manager.value[0]}>
                      {manager.label[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="popup-form-group">
                <label className="popup-form-label">Quantity To Be Returned:</label>
                <input
                  type="number"
                  className="popup-form-control"
                  value={updatedQuantity}
                  min="0"
                  max={selectedItem.quantity_received}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                />
              </div>

              <div className="quantity-display">
                <strong>Stock After Return:</strong>{" "}
                {selectedItem.quantity_received - updatedQuantity}
              </div>

              <div className="mt-2">
                <button
                  className="popup-button popup-button-primary"
                  onClick={handleUpdate}
                >
                  Update Quantity
                </button>
                
                <button
                  className="popup-button popup-button-secondary"
                  onClick={closePopup}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferredDataTable;