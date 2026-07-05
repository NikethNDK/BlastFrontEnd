import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import {
  getItemIssueApi,
  updateItemStatus,
  revertStock,
  BASE_URL,
} from "../../services/AppinfoService";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";

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
        `${BASE_URL}/decline-issued-item/`,
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
    <PageLayout>
      <PageHeader
        title="Issue notifications"
        meta={<FaBell className="lims-meta-badge-icon" />}
      />
      <PageBody>
      <ContentCard flush>
        {issued.length === 0 ? (
          <div className="lims-issue-notify-empty">
            <FaBell className="lims-issue-notify-empty-icon" />
            <p>No pending notifications</p>
          </div>
        ) : (
          <div className="lims-notification-scroll">
            <Table striped bordered hover className="lims-notification-table lims-table">
              <thead>
                <tr>
                  <th>Entry No</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Issue Date</th>
                  <th>Quantity</th>
                  <th>Project Code</th>
                  <th>Project Name</th>
                  <th>Issued To</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issued.map((inven) => (
                  <tr key={inven.id}>
                    <td>{inven.entry_no}</td>
                    <td>{inven.item_code}</td>
                    <td>{inven.item_name}</td>
                    <td>{inven.issue_date}</td>
                    <td>{inven.quantity_issued}</td>
                    <td>{inven.project_code}</td>
                    <td>{inven.project_name}</td>
                    <td>{inven.researcher_name}</td>
                    <td>{inven.remarks}</td>
                    <td>
                      <div className="lims-notification-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleActionClick(inven.entry_no, "Accepted")
                          }
                          className="lims-btn-accept"
                          title="Accept"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRevert(
                              inven.entry_no,
                              inven.item_code,
                              inven.quantity_issued
                            )
                          }
                          className="lims-btn-decline"
                          title="Decline"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default IssueNotify;
