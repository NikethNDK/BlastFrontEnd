import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getTempIssueApi,
  updateTempIssueApi,
  deleteTempIssueApi,
  getManufacturersApi,
  getSuppliersApi,
  getProjectApi,
  getMasterApi,
  getResEmployeeApi,
} from "../../../services/AppinfoService";
import "./TempIssueTable.css"; // Import the new CSS file

const TempIssueTable = () => {
  const [issued, setIssued] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectCodes, setProjectCodes] = useState([]);
  const [itemsCodes, setItemsCodes] = useState([]);
  const [itemsNames, setItemsNames] = useState([]);
  const [resNames, setResNames] = useState([]);
  const [issuedToList, setIssuedToList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
    
    // Expose refresh function globally
    window.refreshTempIssueTable = fetchData;
    
    // Cleanup on unmount
    return () => {
      delete window.refreshTempIssueTable;
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTempIssueApi();
      setIssued(data);
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
      const [manData, supData, projData, masterData, resData] = await Promise.all([
        getManufacturersApi(),
        getSuppliersApi(),
        getProjectApi(),
        getMasterApi(),
        getResEmployeeApi(),
      ]);

      setManufacturers(manData.map((item) => ({ label: item.manufacturer })));
      setSuppliers(supData.map((item) => ({ label: item.supplier })));
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
      setIssuedToList(
        masterData.map((item) => ({ value: item.issued_to, label: item.issued_to }))
      );

      const formattedResNames = resData.map((item) => ({
        value: item,
        label: item,
      }));
      setResNames(formattedResNames);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedIssue) return;
    try {
      await updateTempIssueApi(selectedIssue.entry_no, selectedIssue);
      toast.success("Updated Successfully!");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Update Failed!");
    }
  };

  const handleDelete = async (entryNo) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteTempIssueApi(entryNo);
      setIssued(issued.filter((item) => item.entry_no !== entryNo));
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Delete Failed!");
    }
  };

  const handleChange = (e) => {
    setSelectedIssue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

  if (loading) {
    return <div className="temp-issue-loading">Loading data...</div>;
  }

  if (error) {
    return <div className="temp-issue-error">{error}</div>;
  }

  return (
    <div className="temp-issue-container">
      <div className="temp-issue-table-wrapper">
        <table className="temp-issue-table">
          <thead>
            <tr>
              <th className="table-header">Issued ID</th>
              <th className="table-header">Item Code</th>
              <th className="table-header">Item Name</th>
              <th className="table-header">Quantity Issued</th>
              <th className="table-header">Project Code</th>
              <th className="table-header">Project Name</th>
              <th className="table-header">Issued To</th>
              <th className="table-header">Instruction and Specification</th>
              <th className="table-header">Remarks</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {issued.length > 0 ? (
              issued.map((item) => (
                <tr key={item.entry_no}>
                  <td className="table-cell">{item.entry_no || "-"}</td>
                  <td className="table-cell">{item.item_code || "-"}</td>
                  <td className="table-cell">{item.item_name || "-"}</td>
                  <td className="table-cell">{item.quantity_issued || "-"}</td>
                  <td className="table-cell">{item.project_code || "-"}</td>
                  <td className="table-cell">{item.project_name || "-"}</td>
                  <td className="table-cell">{item.issued_to || "-"}</td>
                  <td className="table-cell">{item.instruction_specification || "-"}</td>
                  <td className="table-cell">{item.remarks || "-"}</td>
                  <td className="table-cell">
                    <button
                      className="temp-issue-action-btn"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <FaEdit color="#2563eb" size={16} />
                    </button>
                    <button
                      className="temp-issue-action-btn"
                      onClick={() => handleDelete(item.entry_no)}
                      title="Delete"
                    >
                      <FaTrash color="#ef4444" size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="temp-issue-no-data">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="temp-issue-modal-overlay" onClick={handleModalClose}>
          <div className="temp-issue-modal" onClick={(e) => e.stopPropagation()}>
            <div className="temp-issue-modal-header">
              <h5 className="temp-issue-modal-title">Edit Issue</h5>
              <button
                className="temp-issue-modal-close-btn"
                onClick={handleModalClose}
              >
                ×
              </button>
            </div>
            <div className="temp-issue-modal-body">
              {selectedIssue && (
                <form>
                  {/* Project Name */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Project Name</label>
                    <select
                      name="project_name"
                      value={selectedIssue.project_name || ""}
                      onChange={handleChange}
                      className="temp-issue-form-select"
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
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Project Code</label>
                    <select
                      name="project_code"
                      value={selectedIssue.project_code || ""}
                      onChange={handleChange}
                      className="temp-issue-form-select"
                    >
                      <option value="">Select Project Code</option>
                      {projectCodes.map((proj) => (
                        <option key={proj.value} value={proj.value}>
                          {proj.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Item Name</label>
                    <select
                      name="item_name"
                      value={selectedIssue.item_name || ""}
                      onChange={handleChange}
                      className="temp-issue-form-select"
                    >
                      <option value="">Select Item Name</option>
                      {itemsNames.map((item) => (
                        <option key={item.value} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Code */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Item Code</label>
                    <select
                      name="item_code"
                      value={selectedIssue.item_code || ""}
                      onChange={handleChange}
                      className="temp-issue-form-select"
                    >
                      <option value="">Select Item Code</option>
                      {itemsCodes.map((item) => (
                        <option key={item.value} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Researcher Name */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Researcher Name</label>
                    <select
                      name="researcher_name"
                      value={selectedIssue.researcher_name || ""}
                      onChange={handleChange}
                      className="temp-issue-form-select"
                    >
                      <option value="">Select Researcher</option>
                      {resNames.map((res) => (
                        <option key={res.value} value={res.value}>
                          {res.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Issued To */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Issued To</label>
                    <select
                      name="issued_to"
                      value={selectedIssue.issued_to || ""}
                      onChange={handleChange}
                      className="temp-issue-form-select"
                    >
                      <option value="">Select Issued To</option>
                      {issuedToList.map((item, index) => (
                        <option key={index} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instruction and Specification */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Instruction and Specification</label>
                    <textarea
                      name="instruction_specification"
                      value={selectedIssue.instruction_specification || ""}
                      onChange={handleChange}
                      className="temp-issue-form-control temp-issue-form-textarea"
                      rows="3"
                      placeholder="Enter instructions and specifications..."
                    />
                  </div>

                  {/* Quantity Issued */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Quantity Issued</label>
                    <input
                      type="number"
                      name="quantity_issued"
                      value={selectedIssue.quantity_issued || ""}
                      onChange={handleChange}
                      className="temp-issue-form-control"
                    />
                  </div>

                  {/* Remarks */}
                  <div className="temp-issue-form-group">
                    <label className="temp-issue-form-label">Remarks</label>
                    <textarea
                      name="remarks"
                      value={selectedIssue.remarks || ""}
                      onChange={handleChange}
                      className="temp-issue-form-control temp-issue-form-textarea"
                      rows="2"
                      placeholder="Enter remarks..."
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="temp-issue-modal-footer">
              <button
                className="temp-issue-btn temp-issue-btn-secondary"
                onClick={handleModalClose}
              >
                Close
              </button>
              <button
                className="temp-issue-btn temp-issue-btn-primary"
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

export default TempIssueTable;