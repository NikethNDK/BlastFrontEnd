import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getTempIssueApi,
  deleteTempIssueApi,
} from "../../../services/AppinfoService";
import "./TempIssueTable.css"; // Import the new CSS file

const TempIssueTable = ({ onEdit }) => {
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    
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

  const handleEdit = (issue) => {
    if (onEdit) {
      onEdit(issue);
    } else {
      console.warn("onEdit prop not provided to TempIssueTable");
      toast.error("Edit functionality not available");
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
              <th className="table-header">Status</th>
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
                  <td className="table-cell">{item.quantity_issued ?? "—"}</td>
                  <td className="table-cell">{item.project_code || "-"}</td>
                  <td className="table-cell">{item.project_name || "-"}</td>
                  <td className="table-cell">{item.issued_to || "-"}</td>
                  <td className="table-cell">
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        backgroundColor:
                          item.status === "LAB-OPEN"
                            ? "#fff3cd"
                            : item.status === "RSR-CONFIRM"
                            ? "#d1ecf1"
                            : item.status === "LAB-ACT"
                            ? "#d4edda"
                            : "#f8d7da",
                        color:
                          item.status === "LAB-OPEN"
                            ? "#856404"
                            : item.status === "RSR-CONFIRM"
                            ? "#0c5460"
                            : item.status === "LAB-ACT"
                            ? "#155724"
                            : "#721c24",
                      }}
                    >
                      {item.status || "-"}
                    </span>
                  </td>
                  <td className="table-cell">{item.instruction_specification || "-"}</td>
                  <td className="table-cell">{item.remarks || "-"}</td>
                  <td className="table-cell">
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="temp-issue-no-data">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TempIssueTable;