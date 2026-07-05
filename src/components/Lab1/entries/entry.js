import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./TransferredEntry.css";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { AiOutlineDownload } from "react-icons/ai";
import { FaExchangeAlt, FaBoxes, FaClipboardCheck, FaTimes } from "react-icons/fa";
import { getmanagerEmployeeApi } from "../../../services/AppinfoService";
import { BASE_URL } from "../../../services/AppinfoService";
import { useSelector } from "react-redux";
import { Modal, Form } from "react-bootstrap";
import { PageLayout, PageHeader } from "../../layout/content";

const TransferredDataTable = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const reduxUser = useSelector((state) => state.user.user);

  const effectiveUserDetails = useMemo(() => {
    return reduxUser
      ? {
          name: reduxUser.user_name || userDetails.name || "",
          user_name:
            reduxUser.user_name ||
            userDetails.user_name ||
            userDetails.name ||
            "",
          lab: reduxUser.lab || userDetails.lab || "N/A",
          designation:
            reduxUser.designation || userDetails.designation || "Not Assigned",
          role: reduxUser.role || userDetails.role || "",
        }
      : userDetails;
  }, [reduxUser, userDetails]);

  const username = useMemo(
    () => effectiveUserDetails.user_name || effectiveUserDetails.name || null,
    [effectiveUserDetails.user_name, effectiveUserDetails.name]
  );
  const labName = useMemo(
    () =>
      effectiveUserDetails.lab && effectiveUserDetails.lab !== "N/A"
        ? Array.isArray(effectiveUserDetails.lab)
          ? effectiveUserDetails.lab[0]
          : effectiveUserDetails.lab
        : null,
    [effectiveUserDetails.lab]
  );

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [managerNames, setManagerNames] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");

  useEffect(() => {
    const lab = labName || effectiveUserDetails.lab;
    if (lab && lab !== "N/A") {
      let labsToSend = null;
      if (Array.isArray(lab)) {
        labsToSend = lab.filter((l) => l && l !== "N/A");
      } else if (typeof lab === "string") {
        labsToSend = [lab];
      }

      if (labsToSend && labsToSend.length > 0) {
        getmanagerEmployeeApi(labsToSend)
          .then((data) => {
            setManagerNames(data.map((item) => ({ value: item, label: item })));
          })
          .catch((error) => console.error("Error fetching Manager Names:", error));
      }
    }
  }, [labName, effectiveUserDetails.lab]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, labName]);

  const fetchData = async () => {
    try {
      const params = {};
      if (username) {
        params.username = username;
      }
      if (labName) {
        params.lab = labName;
      }

      const response = await axios.get(`${BASE_URL}/api/inventoryReceive/`, {
        params,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch inventory data. Please try again.");
    }
  };

  const handleSelect = (id, item) => {
    setSelectedItem(item);
    setUpdatedQuantity(0);
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

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setUpdatedQuantity("");
      return;
    }

    const returnQuantity = parseInt(value, 10);

    if (!isNaN(returnQuantity)) {
      setUpdatedQuantity(returnQuantity);
    } else {
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
      toast.error(
        `Return quantity cannot exceed available stock (${selectedItem.quantity_received}).`
      );
      setUpdatedQuantity(selectedItem.quantity_received);
    }
  };

  const handleUpdate = async () => {
    try {
      const returnQuantity = updatedQuantity;

      if (!reduxUser || !reduxUser.user_name) {
        toast.error("User information not available. Please refresh the page.");
        return;
      }

      if (!selectedManager) {
        toast.error("Please select a manager.");
        return;
      }

      if (returnQuantity <= 0) {
        toast.error("Return quantity must be greater than 0.");
        return;
      }

      if (returnQuantity > selectedItem.quantity_received) {
        toast.error(
          `Return quantity cannot exceed available stock (${selectedItem.quantity_received}).`
        );
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/update_transfer/${selectedItem.entry_no}/`,
        {
          quantity_returned: returnQuantity,
          manager_username: selectedManager,
          username: reduxUser.user_name,
        }
      );

      const responseStatus = response.data?.status;
      if (responseStatus === "Pending") {
        toast.success(
          "Return request sent for approval. Awaiting manager approval."
        );
      } else if (responseStatus === "Accepted") {
        toast.success(
          `Return approved and inventory updated. Removed ${returnQuantity} items from inventory.`
        );
      } else {
        toast.success(
          response.data?.message || "Return processed successfully!"
        );
      }

      fetchData();
      setSelectedItem(null);
      closePopup();
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response?.data?.error) {
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

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const stockAfterReturn = selectedItem
    ? selectedItem.quantity_received - (parseInt(updatedQuantity, 10) || 0)
    : 0;

  const tableHeadings = [
    { label: "Entry No", key: "entry_no", colClass: "te-col--entry" },
    { label: "Item Code", key: "item_code", colClass: "te-col--code" },
    { label: "Item Name", key: "item_name", colClass: "te-col--name" },
    { label: "Price", key: "price_unit", colClass: "te-col--price" },
    { label: "Remaining Stock", key: "quantity_received", colClass: "te-col--stock" },
    { label: "Batch Number", key: "batch_number", colClass: "te-col--batch" },
    { label: "Remarks", key: "remarks", colClass: "te-col--remarks" },
    { label: "Receipt Date", key: "receipt_date", colClass: "te-col--date" },
    { label: "Expiry Date", key: "expiry_date", colClass: "te-col--expiry" },
    { label: "Manufacturer", key: "manufacturer", colClass: "te-col--manufacturer" },
    { label: "Supplier", key: "supplier", colClass: "te-col--supplier" },
    { label: "Project Name", key: "project_name", colClass: "te-col--project" },
    { label: "Invoice No/Date", key: "invoice_no", colClass: "te-col--invoice" },
    { label: "Catalogue No", key: "bill_no", colClass: "te-col--catalogue" },
    { label: "Po Number/Date", key: "po_number", colClass: "te-col--po" },
    { label: "Location", key: "location", colClass: "te-col--location" },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Transferred items"
        actions={
          <>
            <button
              type="button"
              className="lims-header-btn"
              onClick={handleDownload}
              title="Download Excel"
            >
              <AiOutlineDownload aria-hidden />
              Download
            </button>
            <button
              type="button"
              className="lims-header-btn"
              onClick={openPopup}
              disabled={!selectedItem}
              title="Return selected item"
            >
              Return
            </button>
          </>
        }
      />

      <div className="transferred-entry-page">
        <div className="project-stats" role="list">
          <div className="project-stat-card" role="listitem">
            <div className="project-stat-icon project-stat-icon--total">
              <FaBoxes aria-hidden />
            </div>
            <div className="project-stat-content">
              <span className="project-stat-value">{filteredData.length}</span>
              <span className="project-stat-label">
                {hasActiveFilters ? "Filtered items" : "Total items"}
              </span>
            </div>
          </div>

          {selectedItem ? (
            <div className="project-stat-card" role="listitem">
              <div className="project-stat-icon project-stat-icon--selected">
                <FaClipboardCheck aria-hidden />
              </div>
              <div className="project-stat-content">
                <span className="project-stat-value">
                  {selectedItem.quantity_received}
                </span>
                <span className="project-stat-label">
                  Selected remaining stock
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <section className="project-panel" aria-label="Transferred items list">
          <div className="project-table-section">
            <div className="project-table-shell">
              <table className="project-table">
                <thead>
                  <tr className="project-thead-labels">
                    <th scope="col" className="te-th-select project-th-label-cell te-col te-col--select">
                      Select
                    </th>
                    {tableHeadings.map(({ label, key, colClass }) => (
                      <th
                        key={key}
                        scope="col"
                        className={`project-th-label-cell te-col ${colClass}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                  <tr className="project-thead-filters">
                    <th
                      scope="col"
                      className="te-th-select project-th-filter-cell te-col te-col--select"
                      aria-hidden="true"
                    />
                    {tableHeadings.map(({ label, key, colClass }) => (
                      <th
                        key={key}
                        scope="col"
                        className={`project-th-filter-cell te-col ${colClass}`}
                      >
                        <input
                          type="text"
                          placeholder="Filter"
                          className="te-col-filter"
                          value={filters[key] || ""}
                          onChange={(e) => handleFilterChange(e, key)}
                          aria-label={`Filter by ${label}`}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr
                        key={item.entry_no}
                        className={`project-table-row${
                          selectedItem?.entry_no === item.entry_no
                            ? " te-row--selected"
                            : ""
                        }`}
                      >
                        <td className="te-td-select te-col te-col--select" data-label="Select">
                          <input
                            type="radio"
                            name="selectedRow"
                            className="te-row-radio"
                            value={item.entry_no}
                            checked={selectedItem?.entry_no === item.entry_no}
                            onChange={() => handleSelect(item.entry_no, item)}
                            aria-label={`Select entry ${item.entry_no}`}
                          />
                        </td>
                        <td className="te-col te-col--entry" data-label="Entry No">
                          <span className="te-entry-no">{item.entry_no}</span>
                        </td>
                        <td className="te-col te-col--code" data-label="Item Code">{item.item_code}</td>
                        <td className="te-col te-col--name" data-label="Item Name">{item.item_name}</td>
                        <td className="te-col te-col--price" data-label="Price">{item.price_unit}</td>
                        <td className="te-col te-col--stock" data-label="Remaining Stock">
                          <span className="te-qty">{item.quantity_received}</span>
                        </td>
                        <td className="te-col te-col--batch" data-label="Batch Number">{item.batch_number}</td>
                        <td className="te-col te-col--remarks" data-label="Remarks">
                          <span className="te-remarks">{item.remarks}</span>
                        </td>
                        <td className="te-col te-col--date" data-label="Receipt Date">
                          <time className="te-date" dateTime={item.receipt_date}>
                            {item.receipt_date}
                          </time>
                        </td>
                        <td className="te-col te-col--expiry" data-label="Expiry Date">
                          <time className="te-date" dateTime={item.expiry_date}>
                            {item.expiry_date}
                          </time>
                        </td>
                        <td className="te-col te-col--manufacturer" data-label="Manufacturer">{item.manufacturer}</td>
                        <td className="te-col te-col--supplier" data-label="Supplier">{item.supplier}</td>
                        <td className="te-col te-col--project" data-label="Project Name">{item.project_name}</td>
                        <td className="te-col te-col--invoice" data-label="Invoice No/Date">{item.invoice_no}</td>
                        <td className="te-col te-col--catalogue" data-label="Catalogue No">{item.bill_no}</td>
                        <td className="te-col te-col--po" data-label="Po Number/Date">{item.po_number}</td>
                        <td className="te-col te-col--location" data-label="Location">{item.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="project-table-row project-table-row--empty">
                      <td colSpan="17">
                        <div className="project-empty">
                          <div className="project-empty-icon-wrap">
                            <FaExchangeAlt aria-hidden />
                          </div>
                          <h3>No records found</h3>
                          <p>
                            {hasActiveFilters
                              ? "Try adjusting your column filters."
                              : "No transferred items are available yet."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <Modal
          show={isPopupOpen}
          onHide={closePopup}
          size="sm"
          scrollable
          centered
          backdrop="static"
          dialogClassName="project-modal project-modal--form te-return-modal"
          contentClassName="project-modal-content"
          aria-labelledby="return-item-modal-title"
        >
          <div className="project-modal-header">
            <button
              type="button"
              className="project-modal-close"
              onClick={closePopup}
              aria-label="Close"
            >
              <FaTimes aria-hidden />
            </button>
            <h2 id="return-item-modal-title" className="project-modal-title">
              Return item
            </h2>
            <p className="project-modal-description">
              Submit a return request for the selected transferred item.
            </p>
          </div>
          <Modal.Body className="project-modal-body">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="project-modal-form"
            >
              <Form.Group controlId="returnItemName" className="project-field">
                <Form.Label>Item name</Form.Label>
                <Form.Control
                  readOnly
                  value={selectedItem?.item_name || ""}
                  className="project-field-input project-field-input--readonly"
                />
              </Form.Group>

              <Form.Group controlId="returnItemCode" className="project-field">
                <Form.Label>Item code</Form.Label>
                <Form.Control
                  readOnly
                  value={selectedItem?.item_code || ""}
                  className="project-field-input project-field-input--readonly"
                />
              </Form.Group>

              <Form.Group controlId="returnAvailableStock" className="project-field">
                <Form.Label>Available stock (can return)</Form.Label>
                <Form.Control
                  readOnly
                  value={selectedItem?.quantity_received || 0}
                  className="project-field-input project-field-input--readonly"
                />
              </Form.Group>

              <Form.Group controlId="returnManager" className="project-field">
                <Form.Label>Select manager</Form.Label>
                <Form.Select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="project-field-input"
                >
                  <option value="">Select manager</option>
                  {managerNames.map((manager) => (
                    <option key={manager.value} value={manager.value}>
                      {manager.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="returnQuantity" className="project-field">
                <Form.Label>Quantity to be returned</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedQuantity}
                  min="0"
                  max={selectedItem?.quantity_received || 0}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  className="project-field-input"
                />
              </Form.Group>

              <Form.Group controlId="returnStockAfter" className="project-field">
                <Form.Label>Stock after return</Form.Label>
                <Form.Control
                  readOnly
                  value={stockAfterReturn}
                  className="project-field-input project-field-input--readonly project-field-input--success"
                />
              </Form.Group>

              <div className="project-modal-form-actions">
                <button
                  type="button"
                  className="project-btn project-btn-outline"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button type="submit" className="project-btn project-btn-primary">
                  Update quantity
                </button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default TransferredDataTable;
