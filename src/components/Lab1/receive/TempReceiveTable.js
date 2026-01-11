import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  getTempReceiveApi,
  deleteTempReceiveApi,
} from "../../../services/AppinfoService";
import "./TempReceiveTable.css"; // Import the new CSS file

const TempReceiveTable = ({ onEdit, onItemCountChange }) => {
  const [receive, setReceive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTempReceiveApi();
      setReceive(data);
      setError(null);
      // Notify parent of item count change
      if (onItemCountChange && typeof onItemCountChange === 'function') {
        onItemCountChange(data.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
      // Notify parent of item count change (0 on error)
      if (onItemCountChange && typeof onItemCountChange === 'function') {
        onItemCountChange(0);
      }
    } finally {
      setLoading(false);
    }
  }, [onItemCountChange]);

  useEffect(() => {
    fetchData();
    
    // Expose refresh function globally
    window.refreshTempReceiveTable = fetchData;
    
    // Cleanup on unmount
    return () => {
      delete window.refreshTempReceiveTable;
    };
  }, [fetchData]);

  const handleEdit = (item) => {
    if (typeof onEdit === "function") {
      onEdit(item);
      return;
    }

    toast.error("Edit handler is not configured.");
  };

  const handleDelete = (billNo) => {
    setItemToDelete(billNo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (!itemToDelete) return;

    try {
      await deleteTempReceiveApi(itemToDelete);
      const updatedReceive = receive.filter((item) => item.bill_no !== itemToDelete);
      setReceive(updatedReceive);
      // Notify parent of item count change after deletion
      if (onItemCountChange && typeof onItemCountChange === 'function') {
        onItemCountChange(updatedReceive.length);
      }
      toast.success("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete record. Please try again.");
    } finally {
      setItemToDelete(null);
    }
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TempReceiveTable;