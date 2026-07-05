import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash, FaTimes, FaBoxOpen } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  getTempIssueApi,
  deleteTempIssueApi,
} from "../../../services/AppinfoService";
import "./TempIssueTable.css";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "LAB-OPEN":
      return "issue-status-badge issue-status-badge--lab-open";
    case "RSR-CONFIRM":
      return "issue-status-badge issue-status-badge--rsr-confirm";
    case "LAB-ACT":
      return "issue-status-badge issue-status-badge--lab-act";
    default:
      return "issue-status-badge issue-status-badge--default";
  }
};

const TempIssueTable = ({ onEdit, username = null, onItemCountChange }) => {
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTempIssueApi(username);
      setIssued(data);
      setError(null);
      if (onItemCountChange && typeof onItemCountChange === "function") {
        onItemCountChange(data.length);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      if (onItemCountChange && typeof onItemCountChange === "function") {
        onItemCountChange(0);
      }
    } finally {
      setLoading(false);
    }
  }, [username, onItemCountChange]);

  useEffect(() => {
    fetchData();
    window.refreshTempIssueTable = fetchData;
    return () => {
      delete window.refreshTempIssueTable;
    };
  }, [fetchData]);

  const handleEdit = (issue) => {
    if (onEdit) {
      onEdit(issue);
    } else {
      console.warn("onEdit prop not provided to TempIssueTable");
      toast.error("Edit functionality not available");
    }
  };

  const handleDelete = (entryNo) => {
    setItemToDelete(entryNo);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (!itemToDelete) return;

    try {
      await deleteTempIssueApi(itemToDelete);
      const updatedIssued = issued.filter((item) => item.entry_no !== itemToDelete);
      setIssued(updatedIssued);
      if (onItemCountChange && typeof onItemCountChange === "function") {
        onItemCountChange(updatedIssued.length);
      }
      toast.success("Record deleted successfully");
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete record. Please try again.");
    } finally {
      setItemToDelete(null);
    }
  };

  const deleteTarget = issued.find((item) => item.entry_no === itemToDelete);

  if (loading) {
    return (
      <div className="issue-table-state issue-table-state--loading" role="status">
        Loading data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="issue-table-state issue-table-state--error" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="project-table-section">
        <div className="project-table-shell">
          <table className="project-table">
            <thead>
              <tr>
                <th scope="col" className="pt-col pt-col--entry">Issued ID</th>
                <th scope="col" className="pt-col pt-col--code">Item Code</th>
                <th scope="col" className="pt-col pt-col--name">Item Name</th>
                <th scope="col" className="pt-col pt-col--qty">Quantity Issued</th>
                <th scope="col" className="pt-col pt-col--project-code">Project Code</th>
                <th scope="col" className="pt-col pt-col--project">Project Name</th>
                <th scope="col" className="pt-col pt-col--issued-to">Issued To</th>
                <th scope="col" className="pt-col pt-col--status">Status</th>
                <th scope="col" className="pt-col pt-col--instruction">Instruction and Specification</th>
                <th scope="col" className="pt-col pt-col--remarks">Remarks</th>
                <th scope="col" className="pt-col pt-col--actions project-th-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {issued.length > 0 ? (
                issued.map((item) => (
                  <tr key={item.entry_no} className="project-table-row">
                    <td className="pt-col pt-col--entry" data-label="Issued ID">
                      <span className="issue-entry-id">{item.entry_no || "—"}</span>
                    </td>
                    <td className="pt-col pt-col--code" data-label="Item Code">{item.item_code || "—"}</td>
                    <td className="pt-col pt-col--name" data-label="Item Name">
                      <span className="issue-item-name">{item.item_name || "—"}</span>
                    </td>
                    <td className="pt-col pt-col--qty" data-label="Quantity Issued">{item.quantity_issued ?? "—"}</td>
                    <td className="pt-col pt-col--project-code" data-label="Project Code">{item.project_code || "—"}</td>
                    <td className="pt-col pt-col--project" data-label="Project Name">{item.project_name || "—"}</td>
                    <td className="pt-col pt-col--issued-to" data-label="Issued To">{item.issued_to || "—"}</td>
                    <td className="pt-col pt-col--status" data-label="Status">
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status || "—"}
                      </span>
                    </td>
                    <td className="pt-col pt-col--instruction issue-cell-wrap" data-label="Instruction and Specification">
                      {item.instruction_specification || "—"}
                    </td>
                    <td className="pt-col pt-col--remarks issue-cell-wrap" data-label="Remarks">
                      {item.remarks || "—"}
                    </td>
                    <td className="pt-col pt-col--actions project-td-actions" data-label="Actions">
                      <div className="project-row-actions">
                        <button
                          type="button"
                          className="project-icon-btn project-icon-btn--edit"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          aria-label={`Edit issue ${item.entry_no}`}
                        >
                          <FaEdit aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="project-icon-btn project-icon-btn--danger"
                          onClick={() => handleDelete(item.entry_no)}
                          title="Delete"
                          aria-label={`Delete issue ${item.entry_no}`}
                        >
                          <FaTrash aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="project-table-row project-table-row--empty">
                  <td colSpan="11">
                    <div className="project-empty">
                      <div className="project-empty-icon-wrap">
                        <FaBoxOpen aria-hidden />
                      </div>
                      <h3>No issue items yet</h3>
                      <p>Add an item using the Add button above to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        size="sm"
        centered
        backdrop="static"
        dialogClassName="project-modal project-modal--confirm"
        contentClassName="project-modal-content"
      >
        <div className="project-modal-header">
          <button
            type="button"
            className="project-modal-close"
            onClick={handleCloseDeleteModal}
            aria-label="Close"
          >
            <FaTimes aria-hidden />
          </button>
          <h2 className="project-modal-title">Delete issue item?</h2>
          <p className="project-modal-description">
            This action cannot be undone. The staged issue record will be removed.
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          {deleteTarget ? (
            <div className="project-modal-highlight">
              <div className="project-modal-highlight-row">
                <span className="project-modal-highlight-label">ID</span>
                <span>{deleteTarget.entry_no}</span>
              </div>
              <div className="project-modal-highlight-row">
                <span className="project-modal-highlight-label">Item</span>
                <span>
                  {deleteTarget.item_code || "—"}
                  {deleteTarget.item_name ? ` — ${deleteTarget.item_name}` : ""}
                </span>
              </div>
              {deleteTarget.issued_to ? (
                <div className="project-modal-highlight-row">
                  <span className="project-modal-highlight-label">Issued to</span>
                  <span>{deleteTarget.issued_to}</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="project-modal-footer">
          <button
            type="button"
            className="project-btn project-btn-outline"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="project-btn project-btn-danger-solid"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TempIssueTable;
