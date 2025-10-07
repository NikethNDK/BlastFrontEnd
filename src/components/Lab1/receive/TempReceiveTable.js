import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getTempReceiveApi,
  updateTempReceiveApi,
  deleteTempReceiveApi,
  getManufacturersApi,
  getProjectApi,
  getUnitsApi,
  getSuppliersApi,
  getLocationsApi,
  getMasterApi,
} from "../../../services/AppinfoService";
import "./TempReceiveTable.css"; // Import the new CSS file

const TempReceiveTable = () => {
  const [receive, setReceive] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectCodes, setProjectCodes] = useState([]);
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
    
    // Expose refresh function globally
    window.refreshTempReceiveTable = fetchData;
    
    // Cleanup on unmount
    return () => {
      delete window.refreshTempReceiveTable;
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTempReceiveApi();
      setReceive(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [manData, projData, unitData, supData, locData, masterData] =
        await Promise.all([
          getManufacturersApi(),
          getProjectApi(),
          getUnitsApi(),
          getSuppliersApi(),
          getLocationsApi(),
          getMasterApi(),
        ]);

      setManufacturers(manData.map((item) => ({ label: item.manufacturer })));
      setSuppliers(supData.map((item) => ({ label: item.supplier })));
      setUnits(
        unitData.map((item) => ({ value: item.id, label: item.unit_measure }))
      );
      setLocations(
        locData.map((item) => ({ value: item.id, label: item.location }))
      );

      setProjectNames(
        projData.map((item) => ({
          value: item.project_name,
          label: item.project_name,
        }))
      );
      setProjectCodes(
        projData.map((item) => ({
          value: item.project_code,
          label: item.project_code,
        }))
      );

      setItemsCodes(
        masterData.map((item) => ({ value: item.c_id, label: item.item_code }))
      );
      setItemsNames(
        masterData.map((item) => ({ value: item.c_id, label: item.item_name }))
      );
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    try {
      await updateTempReceiveApi(selectedItem.bill_no, selectedItem);
      toast.success("Updated Successfully!");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Update Failed!");
    }
  };

  const handleDelete = async (billNo) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteTempReceiveApi(billNo);
      setReceive(receive.filter((item) => item.bill_no !== billNo));
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Delete Failed!");
    }
  };

  const handleChange = (e) => {
    setSelectedItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <div className="temp-receive-loading">Loading data...</div>;
  }

  if (error) {
    return <div className="temp-receive-error">{error}</div>;
  }

  return (
    <div className="temp-receive-container">
      <div className="temp-receive-table-wrapper">
        <table className="temp-receive-table">
          <thead>
            <tr>
              <th className="table-header">Catalogue No</th>
              <th className="table-header">PO Number</th>
              <th className="table-header">Item Code</th>
              <th className="table-header">Item Name</th>
              <th className="table-header">Project Name</th>
              <th className="table-header">Project Code</th>
              <th className="table-header">Quantity Received</th>
              <th className="table-header">Price</th>
              <th className="table-header">Expiry Date</th>
              <th className="table-header">Manufacturer</th>
              <th className="table-header">Supplier</th>
              <th className="table-header">Invoice No</th>
              <th className="table-header">Location</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {receive.length > 0 ? (
              receive.map((item) => (
                <tr key={item.bill_no}>
                  <td className="table-cell">{item.bill_no || "-"}</td>
                  <td className="table-cell">{item.po_number || "-"}</td>
                  <td className="table-cell">{item.item_code || "-"}</td>
                  <td className="table-cell">{item.item_name || "-"}</td>
                  <td className="table-cell">{item.project_name || "-"}</td>
                  <td className="table-cell">{item.project_code || "-"}</td>
                  <td className="table-cell">{item.quantity_received || "-"}</td>
                  <td className="table-cell">{item.price_unit || "-"}</td>
                  <td className="table-cell">{item.expiry_date || "-"}</td>
                  <td className="table-cell">{item.manufacturer || "-"}</td>
                  <td className="table-cell">{item.supplier || "-"}</td>
                  <td className="table-cell">{item.invoice_number || "-"}</td>
                  <td className="table-cell">{item.location || "-"}</td>
                  <td className="table-cell">
                    <button
                      className="temp-receive-action-btn"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <FaEdit color="#2563eb" size={16} />
                    </button>
                    <button
                      className="temp-receive-action-btn"
                      onClick={() => handleDelete(item.bill_no)}
                      title="Delete"
                    >
                      <FaTrash color="#ef4444" size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="temp-receive-no-data">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="temp-receive-modal-overlay" onClick={handleModalClose}>
          <div className="temp-receive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="temp-receive-modal-header">
              <h5 className="temp-receive-modal-title">Edit Item</h5>
              <button
                className="temp-receive-modal-close-btn"
                onClick={handleModalClose}
              >
                ×
              </button>
            </div>
            <div className="temp-receive-modal-body">
              {selectedItem && (
                <form>
                  {/* PO Number */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">PO Number</label>
                    <input
                      type="text"
                      name="po_number"
                      value={selectedItem.po_number || ""}
                      onChange={handleChange}
                      className="temp-receive-form-control"
                    />
                  </div>

                  {/* Item Code */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Item Code</label>
                    <select
                      name="item_code"
                      value={selectedItem.item_code || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Item Code</option>
                      {itemsCodes.map((item) => (
                        <option key={item.value} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Item Name</label>
                    <select
                      name="item_name"
                      value={selectedItem.item_name || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Item Name</option>
                      {itemsNames.map((item) => (
                        <option key={item.value} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Received */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Quantity Received</label>
                    <input
                      type="number"
                      name="quantity_received"
                      value={selectedItem.quantity_received || ""}
                      onChange={handleChange}
                      className="temp-receive-form-control"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Price</label>
                    <input
                      type="text"
                      name="price_unit"
                      value={selectedItem.price_unit || ""}
                      onChange={handleChange}
                      className="temp-receive-form-control"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Expiry Date</label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={selectedItem.expiry_date || ""}
                      onChange={handleChange}
                      className="temp-receive-form-control"
                    />
                  </div>

                  {/* Invoice No */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Invoice No</label>
                    <input
                      type="text"
                      name="invoice_number"
                      value={selectedItem.invoice_number || ""}
                      onChange={handleChange}
                      className="temp-receive-form-control"
                    />
                  </div>

                  {/* Location */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Location</label>
                    <select
                      name="location"
                      value={selectedItem.location || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc.value} value={loc.label}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Name */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Project Name</label>
                    <select
                      name="project_name"
                      value={selectedItem.project_name || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Project Name</option>
                      {projectNames.map((proj) => (
                        <option key={proj.value} value={proj.value}>
                          {proj.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Code */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Project Code</label>
                    <select
                      name="project_code"
                      value={selectedItem.project_code || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Project Code</option>
                      {projectCodes.map((proj) => (
                        <option key={proj.value} value={proj.value}>
                          {proj.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manufacturer */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Manufacturer</label>
                    <select
                      name="manufacturer"
                      value={selectedItem.manufacturer || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Manufacturer</option>
                      {manufacturers.map((man, index) => (
                        <option key={index} value={man.label}>
                          {man.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Supplier */}
                  <div className="temp-receive-form-group">
                    <label className="temp-receive-form-label">Supplier</label>
                    <select
                      name="supplier"
                      value={selectedItem.supplier || ""}
                      onChange={handleChange}
                      className="temp-receive-form-select"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((sup, index) => (
                        <option key={index} value={sup.label}>
                          {sup.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              )}
            </div>
            <div className="temp-receive-modal-footer">
              <button
                className="temp-receive-btn temp-receive-btn-secondary"
                onClick={handleModalClose}
              >
                Close
              </button>
              <button
                className="temp-receive-btn temp-receive-btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempReceiveTable;