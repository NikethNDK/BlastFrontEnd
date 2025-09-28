import React, { useState, useEffect } from "react";
import {
  fetchMasterListByType,
  createEquipmentDetails,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import { FaBell, FaTimes } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./inventory.css"; // 👈 Link to the new CSS file

const MasterListTable = ({
  masterType,
  initialNotifications,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [dateFilter, setDateFilter] = useState("");
  const [entryNoFilter, setEntryNoFilter] = useState("");
  const [billNoFilter, setBillNoFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [masterTypeFilter, setMasterTypeFilter] = useState("");
  const [projectCodeFilter, setProjectCodeFilter] = useState("");
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [quantityReceivedFilter, setQuantityReceivedFilter] = useState("");
  const [remarksFilter, setRemarksFilter] = useState("");
  const [IssueDateFilter, setIssueDateFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [QuantityIssuedFilter, setQuantityIssuedFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Modal/Equipment States
  const [calibrationDates, setCalibrationDates] = useState([]);
  const [lastServiceDate, setLastServiceDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // --- Handlers ---

  const handleSubmit = async (event) => {
    event.preventDefault();

    const equipmentData = {
      item_id: selectedItem.entry_no,
      item_code: selectedItem.item_code,
      item_name: selectedItem.item_name,
      quantity_received: selectedItem.quantity_received,
      price_unit: selectedItem.price_unit,
      project_code: selectedItem.project_code,
      min_req_stock: selectedItem.min_req_stock,
      location: selectedItem.location,
      expiry_date: selectedItem.expiry_date,
    };

    if (calibrationDates && calibrationDates.length > 0) {
      equipmentData.calibration_dates = calibrationDates;
    }

    if (lastServiceDate) {
      equipmentData.last_service_date = lastServiceDate;
    }

    try {
      await createEquipmentDetails(equipmentData);
      alert("Equipment details saved successfully!");
      setShowModal(false);
      setIsUpdateMode(false);
    } catch (error) {
      alert("Failed to save equipment details.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        Stock: item.quantity_received,
        "Unit Measure": item.unit_measure,
        Location: item.location,
        "Master Type": item.master_type,
        "Minimum Stock": item.min_req_stock,
        "Project Code": item.project_code,
        "Expiry Date": item.expiry_date,
      }))
    );

    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Data");
    XLSX.writeFile(workbook, "InventoryData.xlsx");
  };

  const handleViewClick = () => {
    navigate("/equipment");
  };

  const handleUpdateClick = () => {
    setIsUpdateMode(true);
    setSelectedItem(null); // Clear previous selection when entering update mode
  };

  const handleRadioChange = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setIsUpdateMode(false);
  };

  // --- Effects ---

  // 1. Data Fetching
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        // Fetch data based on the selected masterType (from HomeLab)
        const response = await fetchMasterListByType(
          masterType || "",
          userDetails.lab
        );

        const combinedData = [...(response.master_data || [])];

        setData(combinedData);
        setFilteredData(combinedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [masterType, userDetails.lab]); // Re-run when the filter button in HomeLab changes masterType

  // 2. Local Expiry Notifications
  useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const expiryNotifications = data
      .filter((item) => {
        if (item.expiry_date) {
          const expiryDate = new Date(item.expiry_date);
          return expiryDate >= today && expiryDate <= thirtyDaysLater;
        }
        return false;
      })
      .slice(0, 10); // Limit to top 10 notifications

    setNotifications(expiryNotifications);
  }, [data]);

  // 3. Filtering Logic
  useEffect(() => {
    const filteredMasters = data.filter(
      (master) =>
        (entryNoFilter === "" ||
          (master.entry_no &&
            String(master.entry_no)
              .toLowerCase()
              .includes(entryNoFilter.toLowerCase()))) &&
        (masterTypeFilter === "" ||
          (master.master_type &&
            master.master_type
              .toLowerCase()
              .includes(masterTypeFilter.toLowerCase()))) &&
        (unitFilter === "" ||
          (master.unit_measure &&
            master.unit_measure
              .toLowerCase()
              .includes(unitFilter.toLowerCase()))) &&
        (billNoFilter === "" ||
          (master.bill_no &&
            master.bill_no
              .toLowerCase()
              .includes(billNoFilter.toLowerCase()))) &&
        (projectCodeFilter === "" ||
          (master.project_code &&
            master.project_code
              .toLowerCase()
              .includes(projectCodeFilter.toLowerCase()))) &&
        (itemCodeFilter === "" ||
          (master.item_code &&
            master.item_code
              .toLowerCase()
              .includes(itemCodeFilter.toLowerCase()))) &&
        (itemNameFilter === "" ||
          (master.item_name &&
            master.item_name
              .toLowerCase()
              .includes(itemNameFilter.toLowerCase()))) &&
        (supplierFilter === "" ||
          (master.supplier &&
            master.supplier
              .toLowerCase()
              .includes(supplierFilter.toLowerCase()))) &&
        (quantityReceivedFilter === "" ||
          (master.quantity_received &&
            master.quantity_received
              .toString()
              .includes(quantityReceivedFilter))) &&
        (dateFilter === "" ||
          (master.expiry_date &&
            master.expiry_date
              .toLowerCase()
              .includes(dateFilter.toLowerCase()))) &&
        (QuantityIssuedFilter === "" ||
          (master.quantity_issued &&
            master.quantity_issued
              .toString()
              .includes(QuantityIssuedFilter))) &&
        (locationFilter === "" ||
          (master.location &&
            master.location
              .toLowerCase()
              .includes(locationFilter.toLowerCase())))
    );

    setFilteredData(filteredMasters);
  }, [
    data,
    entryNoFilter,
    billNoFilter,
    projectCodeFilter,
    itemCodeFilter,
    itemNameFilter,
    supplierFilter,
    quantityReceivedFilter,
    dateFilter,
    QuantityIssuedFilter,
    locationFilter,
    masterTypeFilter,
    unitFilter,
  ]);

  if (loading) return <p className="loading-state">Loading inventory data...</p>;
  if (error)
    return (
      <p className="error-state">
        Error loading data: {error}. Please try again.
      </p>
    );

  return (
    <div className="master-list-container">
      {/* --- Action Bar (Notifications and Download) --- */}
      <div className="action-bar">
        <div className="notification-wrapper">
          <button
            onClick={toggleDropdown}
            className="notification-toggle-btn"
            title="Expiry Notifications"
          >
            <FaBell
              size={24}
              color={notifications.length > 0 ? "var(--color-danger)" : "var(--color-text-secondary)"}
            />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showDropdown && notifications.length > 0 && (
            <div className="notification-dropdown">
              <h4 className="dropdown-title">Expiring Soon</h4>
              <ul className="dropdown-list">
                {notifications.map((item, index) => (
                  <li key={index} className="dropdown-item">
                    <strong>Item:</strong> {item.item_name} <br />
                    <strong>Expiry Date:</strong> {item.expiry_date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          className="download-btn"
          onClick={handleDownload}
        >
          <AiOutlineDownload size={20} />
          <span>Download CSV</span>
        </button>
      </div>
      
      {/* --- Equipment Action Buttons --- */}
      {masterType === "Equipment" && (
        <div className="equipment-actions">
          <button
            className={`action-btn ${isUpdateMode ? 'active-update' : ''}`}
            onClick={handleUpdateClick}
          >
            {isUpdateMode ? 'Select Equipment...' : 'Update Calibration'}
          </button>
          <button
            className="action-btn view-btn"
            onClick={handleViewClick}
          >
            View Details
          </button>
        </div>
      )}

      {/* --- Main Data Table --- */}
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              {masterType === "Equipment" && (
                <th className="table-header select-header">Select</th>
              )}
              {/* Header Cells with Filters */}
              {[
                { label: "Master Type", filter: masterTypeFilter, setFilter: setMasterTypeFilter },
                { label: "Item Code", filter: itemCodeFilter, setFilter: setItemCodeFilter },
                { label: "Item Name", filter: itemNameFilter, setFilter: setItemNameFilter },
                { label: "Stock", filter: quantityReceivedFilter, setFilter: setQuantityReceivedFilter },
                { label: "Unit", filter: unitFilter, setFilter: setUnitFilter },
                { label: "Location", filter: locationFilter, setFilter: setLocationFilter },
                { label: "Project Code", filter: projectCodeFilter, setFilter: setProjectCodeFilter },
                { label: "Minimum Stock", filter: projectNameFilter, setFilter: setProjectNameFilter },
                { label: "Expiry Date", filter: dateFilter, setFilter: setDateFilter },
              ].map(({ label, filter, setFilter }) => (
                <th key={label} className="table-header">
                  {label}
                  <input
                    type="text"
                    placeholder={`Filter by ${label}`}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-input"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const isLowStock = item.quantity_received < item.min_req_stock;

                return (
                  <tr
                    key={`${item.entry_no}-${index}`}
                    className={isLowStock ? "low-stock-row" : "data-row"}
                  >
                    {masterType === "Equipment" && (
                      <td className="table-cell select-cell">
                        <input
                          type="radio"
                          name="selectItem"
                          disabled={!isUpdateMode}
                          onChange={() => handleRadioChange(item)}
                        />
                      </td>
                    )}
                    <td className="table-cell">{item.master_type || "-"}</td>
                    <td className="table-cell">{item.item_code || "-"}</td>
                    <td className="table-cell item-name-cell">{item.item_name || "-"}</td>
                    <td className="table-cell">{Math.max(0, item.quantity_received) || "0"}</td>
                    <td className="table-cell">{item.unit_measure || "-"}</td>
                    <td className="table-cell">{item.location || "-"}</td>
                    <td className="table-cell">{item.project_code || "-"}</td>
                    <td className="table-cell">{item.min_req_stock || "-"}</td>
                    <td className="table-cell">{item.expiry_date || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={masterType === "Equipment" ? 10 : 9} className="no-data-cell">
                  No inventory data matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Equipment Update Modal --- */}
      {showModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h6 className="modal-title">
              Update Calibration Details for **{selectedItem.item_name}**
            </h6>
            <form onSubmit={handleSubmit}>
              <label className="modal-label">Latest Calibration Date:</label>
              <input
                type="date"
                onChange={(e) => setCalibrationDates([e.target.value])}
                className="modal-input"
              />

              <label className="modal-label">Last Service Date:</label>
              <input
                type="date"
                onChange={(e) => setLastServiceDate(e.target.value)}
                className="modal-input"
              />

              <button type="submit" className="modal-submit-btn">
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterListTable;