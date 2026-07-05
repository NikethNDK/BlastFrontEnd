import React, { useState, useEffect, useCallback } from "react";
import {
  fetchMasterListByType,
  createEquipmentDetails,
  getEquipmentDetailsByEntryNo,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import { FaBell, FaBoxes } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Pagination from "../../common/Pagination";
import "./inventory.css";

const DEFAULT_ITEMS_PER_PAGE = 10;

const TABLE_HEADINGS = [
  { label: "Master Type", key: "master_type", colClass: "inv-col--master-type" },
  { label: "Item Code", key: "item_code", colClass: "inv-col--code" },
  { label: "Item Name", key: "item_name", colClass: "inv-col--name" },
  { label: "Stock", key: "quantity_received", colClass: "inv-col--stock" },
  { label: "Unit", key: "unit_measure", colClass: "inv-col--unit" },
  { label: "Location", key: "location", colClass: "inv-col--location" },
  { label: "Project Code", key: "project_code", colClass: "inv-col--project-code" },
  { label: "Minimum Stock", key: "min_req_stock", colClass: "inv-col--min-stock" },
  { label: "Expiry Date", key: "expiry_date", colClass: "inv-col--expiry" },
];

const MasterListTable = ({
  masterType,
  initialNotifications,
  userDetails = { name: "", lab: "", designation: "" },
  selectedLab = "All", // Lab filter prop
}) => {
  // Get user from Redux as fallback/primary source
  const reduxUser = useSelector((state) => state.user.user);
  
  // Merge userDetails prop with Redux user data (Redux takes priority)
  const effectiveUserDetails = reduxUser ? {
    name: reduxUser.user_name || userDetails.name || "",
    user_name: reduxUser.user_name || userDetails.user_name || userDetails.name || "",
    lab: reduxUser.lab || userDetails.lab || "N/A",
    designation: reduxUser.designation || userDetails.designation || "Not Assigned",
    role: reduxUser.role || userDetails.role || ""
  } : userDetails;
  
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [filters, setFilters] = useState({});

  // Modal/Equipment States
  const [calibrationDates, setCalibrationDates] = useState([]);
  const [lastServiceDate, setLastServiceDate] = useState("");
  const [latestCalibrationDate, setLatestCalibrationDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingEquipmentData, setLoadingEquipmentData] = useState(false);

  const navigate = useNavigate();

  // --- Pagination Calculations ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleFilterChange = useCallback((e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

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

    // Handle calibration dates - add new date to existing array or create new array
    if (latestCalibrationDate) {
      const updatedCalibrationDates = [...calibrationDates];
      // Check if this date already exists
      if (!updatedCalibrationDates.includes(latestCalibrationDate)) {
        updatedCalibrationDates.push(latestCalibrationDate);
      }
      // Sort dates and keep only unique dates
      const uniqueDates = [...new Set(updatedCalibrationDates)].sort((a, b) => {
        return new Date(b) - new Date(a);
      });
      equipmentData.calibration_dates = uniqueDates;
    } else if (calibrationDates && calibrationDates.length > 0) {
      // If no new date but existing dates exist, keep them
      equipmentData.calibration_dates = calibrationDates;
    }

    if (lastServiceDate) {
      equipmentData.last_service_date = lastServiceDate;
    }

    try {
      await createEquipmentDetails(equipmentData);
      toast.success("Equipment details updated successfully!");
      setShowModal(false);
      setSelectedItem(null);
      setLatestCalibrationDate("");
      setLastServiceDate("");
      setCalibrationDates([]);
    } catch (error) {
      toast.error("Failed to update equipment details.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      toast.error("No data to download!");
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
    setSelectedItem(null);
  };

  const handleRadioChange = async (item) => {
    // If same item is clicked, unselect it
    if (selectedItem?.entry_no === item.entry_no) {
      setSelectedItem(null);
      setShowModal(false);
      return;
    }
    
    setSelectedItem(item);
    setShowModal(true);
    setLoadingEquipmentData(true);
    
    // Reset form fields
    setLatestCalibrationDate("");
    setLastServiceDate("");
    setCalibrationDates([]);
    
    try {
      // Fetch existing equipment details
      const response = await getEquipmentDetailsByEntryNo(item.entry_no);
      
      if (response && response.data) {
        const equipmentData = response.data;
        
        // Set last service date if it exists
        if (equipmentData.last_service_date) {
          // Format date for input (YYYY-MM-DD)
          const serviceDate = new Date(equipmentData.last_service_date);
          const formattedServiceDate = serviceDate.toISOString().split('T')[0];
          setLastServiceDate(formattedServiceDate);
        }
        
        // Handle calibration dates (array)
        if (equipmentData.calibration_dates && Array.isArray(equipmentData.calibration_dates) && equipmentData.calibration_dates.length > 0) {
          // Get the latest calibration date (most recent)
          const sortedDates = [...equipmentData.calibration_dates].sort((a, b) => {
            return new Date(b) - new Date(a);
          });
          const latestDate = sortedDates[0];
          const formattedLatestDate = new Date(latestDate).toISOString().split('T')[0];
          setLatestCalibrationDate(formattedLatestDate);
          // Keep all calibration dates for updating
          setCalibrationDates(equipmentData.calibration_dates);
        }
      }
    } catch (error) {
      console.error("Error fetching equipment details:", error);
      // Don't show error toast - it's okay if equipment doesn't exist yet
    } finally {
      setLoadingEquipmentData(false);
    }
  };

  // --- Pagination Handlers ---
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- Effects ---

  // 1. Data Fetching
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        
        // Pass lab parameter if a specific lab is selected (not "All")
        // When "All" is selected, pass null so backend can show all user labs
        let labName = null;
        if (selectedLab && selectedLab !== "All") {
          labName = selectedLab;
        }
        // If "All" is selected, labName remains null - backend will handle showing all labs
        
        // Get username from effectiveUserDetails (prioritize user_name, then name)
        const username = effectiveUserDetails.user_name || effectiveUserDetails.name || null;

        const response = await fetchMasterListByType(
          masterType || "",
          labName,  // Lab filter (from dropdown or user details)
          username  // Username for auto-filtering (Lab Assistants)
        );

        const combinedData = [...(response.master_data || [])];

        setData(combinedData);
        setFilteredData(combinedData);
        setCurrentPage(1); // Reset to first page when new data loads
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [masterType, effectiveUserDetails.lab, reduxUser, selectedLab]);

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
      .slice(0, 10);

    setNotifications(expiryNotifications);
  }, [data]);

  // 3. Filtering Logic
  useEffect(() => {
    const filteredMasters = data.filter((master) =>
      TABLE_HEADINGS.every(({ key }) => {
        const value = filters[key];
        if (!value) return true;
        const field = master[key];
        if (field == null || field === "") return false;
        return String(field).toLowerCase().includes(value.toLowerCase());
      })
    );

    setFilteredData(filteredMasters);
    setCurrentPage(1);
  }, [data, filters]);

  const closeEquipmentModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setLatestCalibrationDate("");
    setLastServiceDate("");
    setCalibrationDates([]);
  };

  if (loading) {
    return (
      <div className="inventory-page">
        <div className="project-loading">Loading inventory data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-page">
        <div className="project-empty">
          <p>Error loading data: {error}. Please try again.</p>
        </div>
      </div>
    );
  }

  const showSelectColumn = masterType === "Equipment";

  return (
    <div className="inventory-page">
      <div className="inventory-page-toolbar">
        <div className="inventory-notification-wrap">
          <button
            type="button"
            onClick={toggleDropdown}
            className={`lims-header-btn inventory-toolbar-btn inventory-toolbar-btn--notify${
              notifications.length > 0 ? " inventory-toolbar-btn--notify-active" : ""
            }`}
            title="Expiry notifications"
            aria-expanded={showDropdown}
          >
            <FaBell aria-hidden />
            Expiring soon
            {notifications.length > 0 && (
              <span className="inventory-notification-badge">
                {notifications.length}
              </span>
            )}
          </button>

          {showDropdown && notifications.length > 0 && (
            <div className="inventory-notification-dropdown" role="menu">
              <h4 className="inventory-notification-dropdown-title">
                Expiring within 30 days
              </h4>
              <ul className="inventory-notification-list">
                {notifications.map((item, index) => (
                  <li key={index} className="inventory-notification-item">
                    <strong>{item.item_name}</strong>
                    <span>{item.expiry_date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          className="lims-header-btn inventory-toolbar-btn inventory-toolbar-btn--download"
          onClick={handleDownload}
          title="Download Excel"
        >
          <AiOutlineDownload aria-hidden />
          Download
        </button>
      </div>

      <section className="project-panel" aria-label="Inventory list">
        <div className="project-table-section">
          <div className="project-table-shell">
            <table className="project-table">
              <thead>
                <tr className="project-thead-labels">
                  {showSelectColumn && (
                    <th
                      scope="col"
                      className="project-th-label-cell inv-col inv-col--select"
                    >
                      Select
                    </th>
                  )}
                  {TABLE_HEADINGS.map(({ label, key, colClass }) => (
                    <th
                      key={key}
                      scope="col"
                      className={`project-th-label-cell inv-col ${colClass}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
                <tr className="project-thead-filters">
                  {showSelectColumn && (
                    <th
                      scope="col"
                      className="project-th-filter-cell inv-col inv-col--select"
                      aria-hidden
                    />
                  )}
                  {TABLE_HEADINGS.map(({ label, key, colClass }) => (
                    <th
                      key={key}
                      scope="col"
                      className={`project-th-filter-cell inv-col ${colClass}`}
                    >
                      <input
                        type="text"
                        placeholder="Filter"
                        className="inv-col-filter"
                        value={filters[key] || ""}
                        onChange={(e) => handleFilterChange(e, key)}
                        aria-label={`Filter by ${label}`}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    const isLowStock =
                      item.min_req_stock != null &&
                      item.quantity_received < item.min_req_stock;

                    return (
                      <tr
                        key={`${item.entry_no}-${index}`}
                        className={`project-table-row${
                          isLowStock ? " inv-table-row--low-stock" : ""
                        }`}
                      >
                        {showSelectColumn && (
                          <td className="inv-col inv-col--select" data-label="Select">
                            <input
                              type="radio"
                              name="selectItem"
                              checked={selectedItem?.entry_no === item.entry_no}
                              onChange={() => handleRadioChange(item)}
                              aria-label={`Select ${item.item_name || "item"}`}
                            />
                          </td>
                        )}
                        <td className="inv-col inv-col--master-type" data-label="Master Type">
                          {item.master_type || "—"}
                        </td>
                        <td className="inv-col inv-col--code" data-label="Item Code">
                          {item.item_code || "—"}
                        </td>
                        <td className="inv-col inv-col--name" data-label="Item Name">
                          {item.item_name || "—"}
                        </td>
                        <td className="inv-col inv-col--stock" data-label="Stock">
                          <span className="inv-stock-qty">
                            {Math.max(0, item.quantity_received) || "0"}
                          </span>
                        </td>
                        <td className="inv-col inv-col--unit" data-label="Unit">
                          {item.unit_measure || "—"}
                        </td>
                        <td className="inv-col inv-col--location" data-label="Location">
                          {item.location || "—"}
                        </td>
                        <td className="inv-col inv-col--project-code" data-label="Project Code">
                          {item.project_code || "—"}
                        </td>
                        <td className="inv-col inv-col--min-stock" data-label="Minimum Stock">
                          {item.min_req_stock ?? "—"}
                        </td>
                        <td className="inv-col inv-col--expiry" data-label="Expiry Date">
                          <time className="inv-expiry-date" dateTime={item.expiry_date}>
                            {item.expiry_date || "—"}
                          </time>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="project-table-row project-table-row--empty">
                    <td colSpan={showSelectColumn ? 10 : 9}>
                      <div className="project-empty">
                        <div className="project-empty-icon-wrap">
                          <FaBoxes aria-hidden />
                        </div>
                        <h3>No records found</h3>
                        <p>
                          {hasActiveFilters
                            ? "Try adjusting your column filters."
                            : "No inventory data is available for this category."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            showSummary
            showItemsPerPage
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(n) => {
              setItemsPerPage(n);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            position="bottom"
          />
        </div>
      </section>

      <Modal
        show={showModal && !!selectedItem}
        onHide={closeEquipmentModal}
        size="sm"
        scrollable
        centered
        backdrop="static"
        dialogClassName="project-modal project-modal--form inv-equipment-modal"
        contentClassName="project-modal-content"
        aria-labelledby="inv-equipment-modal-title"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={closeEquipmentModal}
            aria-label="Close"
          >
            ×
          </button>
          <h2 id="inv-equipment-modal-title" className="project-modal-title">
            Update calibration
          </h2>
          <p className="project-modal-description">
            {selectedItem?.item_name
              ? `Calibration details for ${selectedItem.item_name}`
              : "Update equipment calibration details."}
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          {loadingEquipmentData ? (
            <div className="project-loading">Loading equipment data…</div>
          ) : (
            <Form onSubmit={handleSubmit} className="project-modal-form">
              <Form.Group controlId="latestCalibrationDate" className="project-field">
                <Form.Label>Latest calibration date</Form.Label>
                <Form.Control
                  type="date"
                  value={latestCalibrationDate}
                  onChange={(e) => setLatestCalibrationDate(e.target.value)}
                  className="project-field-input"
                />
              </Form.Group>

              <Form.Group controlId="lastServiceDate" className="project-field">
                <Form.Label>Last service date</Form.Label>
                <Form.Control
                  type="date"
                  value={lastServiceDate}
                  onChange={(e) => setLastServiceDate(e.target.value)}
                  className="project-field-input"
                />
              </Form.Group>

              <button type="submit" className="project-modal-submit">
                Update details
              </button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MasterListTable;