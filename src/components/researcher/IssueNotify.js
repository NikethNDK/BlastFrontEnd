import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import {
  getItemIssueApi,
  updateItemStatus,
  revertStock,
} from "../../services/AppinfoService";
import ResearcherNavigation from "./ResearcherNavigation";

const IssueNotify = ({
  masterType,
  onDeclineNotification,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [issued, setIssued] = useState([]);
  const [processedItems, setProcessedItems] = useState(new Set());

  useEffect(() => {
    fetchPendingIssues();
  }, []);

  const fetchPendingIssues = () => {
    getItemIssueApi()
      .then((data) => {
        const pendingIssues = data.filter((item) => item.status === "Pending");
        setIssued(pendingIssues);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleActionClick = (entry_no, status) => {
    updateItemStatus(entry_no, status)
      .then(() => {
        setIssued((prevIssued) =>
          prevIssued.filter((item) => item.entry_no !== entry_no)
        );
        alert(`Item with Entry No: ${entry_no} has been ${status}!`);
      })
      .catch((error) => {
        console.error(`Error updating item ${entry_no}:`, error);
        alert(`Failed to update item ${entry_no}. Please try again.`);
      });
  };

  const handleRevert = async (entry_no, item_code, quantity_issued) => {
    try {
      setIssued((prevIssued) =>
        prevIssued.filter((item) => item.entry_no !== entry_no)
      );
      const response = await axios.post(
        "http://127.0.0.1:8000/decline-issued-item/",
        {
          entry_no,
          item_code,
          quantity_issued,
        }
      );

      alert(response.data.message);
      if (onDeclineNotification) {
        onDeclineNotification(`Item ${item_code} has been Accepted.`);
      }
    } catch (error) {
      alert(
        "Error Accepting issue: " +
          (error.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <FaBell style={styles.bellIcon} />
          <h1 style={styles.title}>Issue Notifications</h1>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentWrapper}>
        <div style={styles.tableContainer}>
          {issued.length === 0 ? (
            <div style={styles.emptyState}>
              <FaBell style={styles.emptyIcon} />
              <p style={styles.emptyText}>No pending notifications</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <Table striped bordered hover style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Entry No</th>
                    <th style={styles.tableHeader}>Item Code</th>
                    <th style={styles.tableHeader}>Item Name</th>
                    <th style={styles.tableHeader}>Issue Date</th>
                    <th style={styles.tableHeader}>Quantity</th>
                    <th style={styles.tableHeader}>Project Code</th>
                    <th style={styles.tableHeader}>Project Name</th>
                    <th style={styles.tableHeader}>Issued To</th>
                    <th style={styles.tableHeader}>Remarks</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issued.map((inven) => (
                    <tr key={inven.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{inven.entry_no}</td>
                      <td style={styles.tableCell}>{inven.item_code}</td>
                      <td style={styles.tableCell}>{inven.item_name}</td>
                      <td style={styles.tableCell}>{inven.issue_date}</td>
                      <td style={styles.tableCell}>{inven.quantity_issued}</td>
                      <td style={styles.tableCell}>{inven.project_code}</td>
                      <td style={styles.tableCell}>{inven.project_name}</td>
                      <td style={styles.tableCell}>{inven.researcher_name}</td>
                      <td style={styles.tableCell}>{inven.remarks}</td>
                      <td style={styles.actionCell}>
                        <button
                          onClick={() =>
                            handleActionClick(inven.entry_no, "Accepted")
                          }
                          style={styles.acceptButton}
                          title="Accept"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() =>
                            handleRevert(
                              inven.entry_no,
                              inven.item_code,
                              inven.quantity_issued
                            )
                          }
                          style={styles.declineButton}
                          title="Decline"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f3fbd6",
    overflow: "hidden",
    display: "flex",
    height: "69vh",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    flexShrink: 0,
  },
  headerContent: {
    display: "flex",
    alignItems: "start",
    gap: "20px",
    padding: "10px"
  },
  bellIcon: {
    fontSize: "1.5rem",
    color: "#000",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#000",
    margin: 0,
    letterSpacing: "1px",
  },
  contentWrapper: {
    flex: 1,
    padding: "30px",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
  },
  tableContainer: {
    width: "100%",
    maxWidth: "1400px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    padding: "24px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    margin: 0,
    fontSize: "14px",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  tableHeader: {
    backgroundColor: "#3d6b1f",
    color: "#ffffff",
    fontWeight: "600",
    padding: "14px 12px",
    textAlign: "center",
    border: "1px solid #2d5016",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  tableRow: {
    transition: "background-color 0.2s ease",
  },
  tableCell: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #e0e0e0",
    color: "#333333",
    verticalAlign: "middle",
  },
  actionCell: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #e0e0e0",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    marginRight: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)",
  },
  declineButton: {
    backgroundColor: "#dc3545",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(220, 53, 69, 0.2)",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#999999",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    opacity: 0.3,
  },
  emptyText: {
    fontSize: "18px",
    margin: 0,
  },
};

export default IssueNotify;