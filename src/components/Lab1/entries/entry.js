import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./TransferredDataTable.css"; // Use the new CSS file
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import { AiOutlineDownload } from "react-icons/ai";
import { getmanagerEmployeeApi } from "../../../services/AppinfoService";
import LabNavigation1 from "../homeLab/LabNavigation1";
import { BASE_URL } from "../../../services/AppinfoService";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

const TransferredDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  // Get user from Redux store
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
      ? (Array.isArray(effectiveUserDetails.lab) ? effectiveUserDetails.lab[0] : effectiveUserDetails.lab)
      : null,
    [effectiveUserDetails.lab]
  );

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
    const lab = labName || effectiveUserDetails.lab;
    if (lab && lab !== 'N/A') {
      const labToUse = Array.isArray(lab) ? lab[0] : lab;
      getmanagerEmployeeApi(labToUse)
        .then((data) => {
          console.log("Received manager data:", data);
          setManagerNames(data.map((item) => ({ value: item, label: item })));
        })
        .catch((error) => console.error("Error fetching Manager Names:", error));
    }
  }, [labName, effectiveUserDetails.lab]);

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

      console.log("🔍 [FRONTEND] get_inventory_data called with:", { username, lab: labName, params });

      const response = await axios.get(
        `${BASE_URL}/api/inventoryReceive/`,
        { params }
      );
      console.log("🔍 [FRONTEND] Fetched data:", response.data);
      console.log("🔍 [FRONTEND] Sample item (entry 20):", response.data.find(item => item.entry_no === 20));
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch inventory data. Please try again.");
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

      // Guard: Ensure username is available from Redux
      if (!reduxUser || !reduxUser.user_name) {
        toast.error("User information not available. Please refresh the page.");
        return;
      }

      console.log("🔍 [FRONTEND] Return attempt:", {
        returnQuantity,
        selectedItem: selectedItem,
        selectedManager,
        remainingQuantity,
        username: reduxUser.user_name
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

      const response = await axios.put(
        `${BASE_URL}/update_transfer/${selectedItem.entry_no}/`,
        {
          quantity_returned: returnQuantity,
          manager_username: selectedManager,
          username: reduxUser.user_name,  // Send username from Redux
        }
      );

      // Update toast message based on response status
      const responseStatus = response.data?.status;
      if (responseStatus === "Pending") {
        toast.success(`Return request sent for approval. Awaiting manager approval.`);
      } else if (responseStatus === "Accepted") {
        toast.success(`Return approved and inventory updated. Removed ${returnQuantity} items from inventory.`);
      } else {
        toast.success(response.data?.message || `Return processed successfully!`);
      }

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
    <div style={{ marginTop: "1px", width: "100%" }}>
      <div>
        <h1 style={{
          fontSize: "var(--lab-text-3xl, 1.8rem)",
          fontWeight: 700,
          color: "var(--lab-neutral-800, #1e293b)",
          margin: 0,
          textAlign: "left",
        }}>
          TRANSFERRED ITEMS
          <Button
            variant="primary"
            onClick={openPopup}
            disabled={!selectedItem}
            style={{
              width: "100px",
              float: "right",
              marginLeft: "8px",
            }}
          >
            Return
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            style={{ float: "right" }}
            title="Download Excel"
          >
            <AiOutlineDownload size={18} style={{ marginRight: "4px" }} />
            Download
          </Button>
        </h1>
      </div>
      <p></p>

      <div style={{ paddingTop: "10px" }}>
        <div className="transferred-table-container">

          {/* Table Wrapper */}
          <div className="transferred-table-wrapper">
            <table className="transferred-data-table">
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
        </div>

        {/* React Bootstrap Modal for Return */}
        <Modal show={isPopupOpen} onHide={closePopup} centered>
          <Modal.Header closeButton>
            <Modal.Title>Return Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><strong>Item Name:</strong></Form.Label>
                <Form.Control plaintext readOnly value={selectedItem?.item_name || ""} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Item Code:</strong></Form.Label>
                <Form.Control plaintext readOnly value={selectedItem?.item_code || ""} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Available Stock (Can Return):</strong></Form.Label>
                <Form.Control plaintext readOnly value={selectedItem?.quantity_received || 0} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Manager:</Form.Label>
                <Form.Select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  <option value="">Select Manager</option>
                  {managerNames.map((manager) => (
                    <option key={manager.value} value={manager.value}>
                      {manager.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity To Be Returned:</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedQuantity}
                  min="0"
                  max={selectedItem?.quantity_received || 0}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Stock After Return:</strong></Form.Label>
                <Form.Control 
                  plaintext 
                  readOnly 
                  value={selectedItem ? (selectedItem.quantity_received - (parseInt(updatedQuantity) || 0)) : 0} 
                  className="text-success"
                  style={{ fontWeight: 600 }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closePopup}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Update Quantity
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TransferredDataTable;