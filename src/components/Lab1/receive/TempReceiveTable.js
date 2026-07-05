import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash, FaTimes, FaTimesCircle, FaInbox } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  getTempReceiveApi,
  deleteTempReceiveApi,
} from "../../../services/AppinfoService";
import "./TempReceiveTable.css";

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
      if (onItemCountChange && typeof onItemCountChange === "function") {
        onItemCountChange(data.length);
      }
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
      setError("Failed to load data. Please try again.");
      if (onItemCountChange && typeof onItemCountChange === "function") {
        onItemCountChange(0);
      }
    } finally {
      setLoading(false);
    }
  }, [onItemCountChange]);

  useEffect(() => {
    fetchData();
    window.refreshTempReceiveTable = fetchData;
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

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (!itemToDelete) return;

    try {
      await deleteTempReceiveApi(itemToDelete);
      const updatedReceive = receive.filter((item) => item.bill_no !== itemToDelete);
      setReceive(updatedReceive);
      if (onItemCountChange && typeof onItemCountChange === "function") {
        onItemCountChange(updatedReceive.length);
      }
      toast.success("Record deleted successfully");
    } catch (deleteError) {
      console.error("Error deleting item:", deleteError);
      toast.error("Failed to delete record. Please try again.");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="project-loading" role="status" aria-live="polite">
        <div className="project-spinner" />
        <span>Loading received items…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-alert project-alert-danger" role="alert">
        <FaTimesCircle aria-hidden />
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="project-table-section">
        <div className="project-table-shell">
          <table className="project-table temp-receive-table">
            <thead>
              <tr>
                <th scope="col" className="pt-col pt-col--catalogue">
                  Catalogue No
                </th>
                <th scope="col" className="pt-col pt-col--po">
                  PO Number
                </th>
                <th scope="col" className="pt-col pt-col--code">
                  Item Code
                </th>
                <th scope="col" className="pt-col pt-col--name">
                  Item Name
                </th>
                <th scope="col" className="pt-col pt-col--project">
                  Project Name
                </th>
                <th scope="col" className="pt-col pt-col--project-code">
                  Project Code
                </th>
                <th scope="col" className="pt-col pt-col--qty-wide">
                  Quantity Received
                </th>
                <th scope="col" className="pt-col pt-col--price">
                  Price
                </th>
                <th scope="col" className="pt-col pt-col--expiry">
                  Expiry Date
                </th>
                <th scope="col" className="pt-col pt-col--manufacturer">
                  Manufacturer
                </th>
                <th scope="col" className="pt-col pt-col--supplier">
                  Supplier
                </th>
                <th scope="col" className="pt-col pt-col--invoice">
                  Invoice No
                </th>
                <th scope="col" className="pt-col pt-col--location">
                  Location
                </th>
                <th scope="col" className="pt-col pt-col--actions project-th-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {receive.length > 0 ? (
                receive.map((item) => (
                  <tr key={item.bill_no} className="project-table-row">
                    <td className="pt-col pt-col--catalogue" data-label="Catalogue No">
                      {item.bill_no || "—"}
                    </td>
                    <td className="pt-col pt-col--po" data-label="PO Number">
                      {item.po_number || "—"}
                    </td>
                    <td className="pt-col pt-col--code" data-label="Item Code">
                      {item.item_code || "—"}
                    </td>
                    <td className="pt-col pt-col--name" data-label="Item Name">
                      {item.item_name || "—"}
                    </td>
                    <td className="pt-col pt-col--project" data-label="Project Name">
                      {item.project_name || "—"}
                    </td>
                    <td className="pt-col pt-col--project-code" data-label="Project Code">
                      {item.project_code || "—"}
                    </td>
                    <td className="pt-col pt-col--qty-wide" data-label="Quantity Received">
                      {item.quantity_received || "—"}
                    </td>
                    <td className="pt-col pt-col--price" data-label="Price">
                      {item.price_unit || "—"}
                    </td>
                    <td className="pt-col pt-col--expiry" data-label="Expiry Date">
                      {item.expiry_date || "—"}
                    </td>
                    <td className="pt-col pt-col--manufacturer" data-label="Manufacturer">
                      {item.manufacturer || "—"}
                    </td>
                    <td className="pt-col pt-col--supplier" data-label="Supplier">
                      {item.supplier || "—"}
                    </td>
                    <td className="pt-col pt-col--invoice" data-label="Invoice No">
                      {item.invoice_number || "—"}
                    </td>
                    <td className="pt-col pt-col--location" data-label="Location">
                      {item.location || "—"}
                    </td>
                    <td
                      className="pt-col pt-col--actions project-td-actions"
                      data-label="Actions"
                    >
                      <div className="project-row-actions">
                        <button
                          type="button"
                          className="project-icon-btn project-icon-btn--edit"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          aria-label={`Edit ${item.item_name || item.bill_no}`}
                        >
                          <FaEdit aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="project-icon-btn project-icon-btn--danger"
                          onClick={() => handleDelete(item.bill_no)}
                          title="Delete"
                          aria-label={`Delete ${item.bill_no}`}
                        >
                          <FaTrash aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="project-table-row project-table-row--empty">
                  <td colSpan="14">
                    <div className="project-empty">
                      <div className="project-empty-icon-wrap">
                        <FaInbox aria-hidden />
                      </div>
                      <h3>No records found</h3>
                      <p>Add items to the receive list, then submit to transfer.</p>
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
          <h2 className="project-modal-title">Delete record?</h2>
          <p className="project-modal-description">
            This action cannot be undone. The item will be removed from the receive list.
          </p>
        </div>
        <Modal.Body className="project-modal-body">
          {itemToDelete && (
            <div className="project-modal-highlight">
              <div className="project-modal-highlight-row">
                <span className="project-modal-highlight-label">Catalogue No</span>
                <span>{itemToDelete}</span>
              </div>
            </div>
          )}
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

export default TempReceiveTable;
