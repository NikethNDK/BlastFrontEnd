import React, { useState, useEffect } from "react";
import {
  fetchMasterListByType,
  createEquipmentDetails,
} from "../../../services/AppinfoService";
import * as XLSX from "xlsx";
import { FaBell, FaTimes } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const MasterListTable = ({ masterType, initialNotifications }) => {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [entryNoFilter, setEntryNoFilter] = useState("");
  const [billNoFilter, setBillNoFilter] = useState("");
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

  const [calibrationDates, setCalibrationDates] = useState([]);
  const [lastServiceDate, setLastServiceDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const equipmentData = {
      item_id: selectedItem.entry_no,
      calibration_dates: calibrationDates,
      last_service_date: lastServiceDate,
      item_code: selectedItem.item_code, // Include additional fields
      item_name: selectedItem.item_name,
      quantity_received:selectedItem.quantity_received,
      price_unit:selectedItem.price_unit,
      project_code:selectedItem.project_code,
      min_req_stock:selectedItem.min_req_stock,
      location:selectedItem.location,
      expiry_date:selectedItem.expiry_date
    };

    try {
      const response = await createEquipmentDetails(equipmentData);
      alert("Equipment details saved successfully!");
      console.log(response);
      setShowModal(false);
    } catch (error) {
      alert("Failed to save equipment details.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const expiryNotifications = data.filter((item) => {
      if (item.expiry_date) {
        const expiryDate = new Date(item.expiry_date);
        return expiryDate >= today && expiryDate <= thirtyDaysLater;
      }
      return false;
    });

    setNotifications(expiryNotifications);
  }, [data]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchMasterListByType(masterType);
        console.log("API Response:", response);

        const combinedData = [
          ...(response.master_data || []),
          ...(response.second_model_data || []),
        ];

        setData(combinedData);
        setFilteredData(combinedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (masterType) {
      getData();
    }
  }, [masterType]);
  const handleViewClick = () => {
    navigate("/equipment"); // Replace '/equipment' with the correct route to your Equipment page
  };

  //   useEffect(() => {
  //     const dismissedItems =
  //       JSON.parse(localStorage.getItem("dismissedItems")) || [];
  //     const filteredNotifications = initialNotifications.filteredData(
  //       (item) => !dismissedItems.includes(item.item_name)
  //     );
  //     setNotifications(filteredNotifications);
  //   }, [initialNotifications]);

  useEffect(() => {
    const filteredMasters = data.filter(
      (master) =>
        (entryNoFilter === "" ||
          (master.entry_no &&
            String(master.entry_no)
              .toLowerCase()
              .includes(entryNoFilter.toLowerCase()))) &&
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
        (projectNameFilter === "" ||
          (master.project_name &&
            master.project_name
              .toLowerCase()
              .includes(projectNameFilter.toLowerCase()))) &&
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
        (remarksFilter === "" ||
          (master.remarks &&
            master.remarks
              .toLowerCase()
              .includes(remarksFilter.toLowerCase()))) &&
        (IssueDateFilter === "" ||
          (master.IssueDate &&
            master.IssueDate.toLowerCase().includes(
              IssueDateFilter.toLowerCase()
            ))) &&
        (dateFilter === "" ||
          (master.expiryDate &&
            master.expiryDate
              .toLowerCase()
              .includes(dateFilter.toLowerCase()))) &&
        (dateFilter === "" ||
          (master.expiryDate &&
            master.expiryDate
              .toLowerCase()
              .includes(dateFilter.toLowerCase()))) &&
        (quantityReceivedFilter === "" ||
          (master.quantity_received &&
            master.quantity_received
              .toString()
              .includes(quantityReceivedFilter)))
    );
    setFilteredData(filteredMasters);
  }, [
    entryNoFilter,
    billNoFilter,
    projectCodeFilter,
    projectNameFilter,
    itemCodeFilter,
    itemNameFilter,
    supplierFilter,
    quantityReceivedFilter,
    remarksFilter,
    IssueDateFilter,
    QuantityIssuedFilter,
    locationFilter,
    data,
    dateFilter,
  ]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
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
        Location: item.location,
        "Master Type": item.master_type,
        "Minimum Stock": item.min_req_stock,
        "Project Code": item.project_code,
        "Expiry Date": item.expiry_date,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issue Data");
    XLSX.writeFile(workbook, "InventoryData.xlsx");
  };

  const handleCancel = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
  };

  const handleUpdateClick = () => {
    setIsUpdateMode(true);
  };

  const handleRadioChange = (item) => {
    const itemId = item.entry_no; // Extract the id
    console.log("Selected item ID:", itemId);
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ position: "relative", textAlign: "center" }}>
        <button
          onClick={toggleDropdown}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            position: "relative",
          }}
          title="Expiry Notifications"
        >
          <FaBell size={30} color={notifications.length > 0 ? "red" : "gray"} />
        </button>

        {showDropdown && notifications.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-136px",
              right: "0",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
              width: "300px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            <h4 style={{ textAlign: "center", margin: "5px 0", color: "red" }}>
              Expiring Soon
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {notifications.map((item, index) => (
                <li
                  key={index}
                  style={{ borderBottom: "1px solid #ccc", padding: "5px" }}
                >
                  <strong>Item:</strong> {item.item_name} <br />
                  <strong>Expiry Date:</strong> {item.expiry_date} <br />
                  <strong>Stock:</strong> {item.quantity_received} <br />
                  <strong>Location:</strong> {item.location}
                  <button
                    onClick={() => handleCancel(index)}
                    style={{
                      background: "white",
                      color: "red",
                      border: "none",
                      marginLeft: "3px",
                      padding: "0px 5px",
                      cursor: "pointer",
                      borderRadius: "3px",
                    }}
                  >
                    <FaTimes size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* {masterType === "Equipment" && (
        <form className="calibration" onSubmit={handleSubmit}>
          <label>Calibration Dates:</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD, YYYY-MM-DD"
            onChange={(e) =>
              setCalibrationDates(
                e.target.value.split(",").map((date) => date.trim())
              )
            }
          />
          <p></p>
          <label>Last Service Date:</label>
          <input
            type="date"
            onChange={(e) => setLastServiceDate(e.target.value)}
          />

          <button type="submit">Save</button>
        </form>
      )} */}
      {masterType === "Equipment" && (
      <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              border: "none",
              borderRadius: "3px",
              backgroundColor: "green",
              color: "white",
              height: "30px",
              width: "70px",
              marginLeft: "10px",
            }}
            onClick={handleUpdateClick}
          >
            Update
          </button>
          <button
            style={{
              border: "none",
              borderRadius: "3px",
              backgroundColor: "blue",
              color: "white",
              height: "30px",
              width: "70px",
              marginLeft: "10px",
            }}
            onClick={handleViewClick}
          >
            View
          </button>
        </div>
        
      )}
      <div
        style={{
          overflowY: "auto",
          maxHeight: "355px",
          justifyContent: "center",
        }}
      >
        {/* <h2 style={{ textAlign: "center", fontSize: "20px",justifyContent: "center",position: "fixed", }}>Master List - {masterType}</h2> */}
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
        <p></p>
        <table
          border="1"
          className="react-bootstrap-table"
          style={{ margin: "auto", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              {masterType === "Equipment" && (
                <th style={headerStyle}>Select Item</th>
              )}
              <th style={headerStyle}>
                Master Type
                <br />
                <input
                  type="text"
                  placeholder="Filter by Entry No"
                  value={entryNoFilter}
                  onChange={(e) => setEntryNoFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>

              <th style={headerStyle}>
                Item Code
                <br />
                <input
                  type="text"
                  placeholder="Filter by Item Code"
                  value={itemCodeFilter}
                  onChange={(e) => setItemCodeFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>
              <th style={headerStyle}>
                Item Name
                <br />
                <input
                  type="text"
                  placeholder="Filter by Item Name"
                  value={itemNameFilter}
                  onChange={(e) => setItemNameFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>
              <th style={headerStyle}>
                Stock
                <br />
                <input
                  type="text"
                  placeholder="Filter by Stock"
                  value={quantityReceivedFilter}
                  onChange={(e) => setQuantityReceivedFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>

              <th style={headerStyle}>
                Unit
                <br />
                <input
                  type="text"
                  placeholder="Filter by Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>

              <th style={headerStyle}>
                Location
                <br />
                <input
                  type="text"
                  placeholder="Filter by Quantity Issued"
                  value={QuantityIssuedFilter}
                  onChange={(e) => setQuantityIssuedFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>
              <th style={headerStyle}>
                Project Code
                <br />
                <input
                  type="text"
                  placeholder="Filter"
                  value={projectCodeFilter}
                  onChange={(e) => setProjectCodeFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>
              <th style={headerStyle}>
                Minimum Required Stock
                <br />
                <input
                  type="text"
                  placeholder="Filter"
                  value={projectNameFilter}
                  onChange={(e) => setProjectNameFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>
              <th style={headerStyle}>
                Expiry date
                <br />
                <input
                  type="text"
                  placeholder="Filter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={filterStyle}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={`${item.entry_no}-${index}`}>
                  {masterType === "Equipment" && (
                    <td>
                      <input
                        type="radio"
                        name="selectItem"
                        disabled={!isUpdateMode}
                        onChange={() => handleRadioChange(item)}
                      />
                    </td>
                  )}
                  <td style={cellStyle}>{item.master_type || "-"}</td>
                  <td style={cellStyle}>{item.item_code || "-"}</td>
                  <td style={cellStyle}>{item.item_name || "-"}</td>
                  <td style={cellStyle}>{item.quantity_received || "-"}</td>
                  <td style={cellStyle}>{item.price_unit || "-"}</td>

                  <td style={cellStyle}>{item.location || "-"}</td>
                  <td style={cellStyle}>{item.project_code || "-"}</td>
                  <td style={cellStyle}>{item.min_req_stock || "-"}</td>
                  <td style={cellStyle}>{item.expiry_date || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        {showModal && selectedItem && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 999,
              }}
              onClick={() => setShowModal(false)}
            ></div>
            <div
              style={{
                position: "fixed",
                top: "42%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "white",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
                borderRadius: "8px",
                width: "400px",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h6 style={{ marginTop: "-10px" }}>
                Update Calibration Details for {selectedItem.item_name}
              </h6>
              <form onSubmit={handleSubmit}>
                <label>Calibration Dates:</label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD, YYYY-MM-DD"
                  onChange={(e) =>
                    setCalibrationDates(
                      e.target.value.split(",").map((date) => date.trim())
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
                <label>Last Service Date:</label>
                <input
                  type="date"
                  onChange={(e) => setLastServiceDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#007BFF",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  Save
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const headerStyle = {
  backgroundColor: "#C5EA31",
  justifyContent: "center",
  color: "black",
  textAlign: "center",
  border: "1px solid black",
};

const cellStyle = {
  textAlign: "center",
  verticalAlign: "middle",
  padding: "10px",
  border: "1px solid black",
};
const filterStyle = { width: "90%", marginTop: "5px" };

export default MasterListTable;
