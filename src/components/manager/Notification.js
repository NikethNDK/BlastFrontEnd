import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import AdminApprovalModal from "./AdminApproval";
import { BASE_URL } from "../../services/AppinfoService";
import { setManagerPendingIssues } from "../../store/slices/notificationSlice";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";

const Notification = ({
  no,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);
  
  // NOTE: Data is now provided by centralized polling via Redux
  // The useNotificationPolling hook in ManagerNavigation fetches and dispatches data
  const note = useSelector((state) => state.notifications.manager.pendingIssues || []);

  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editNotes, setEditNotes] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditNotes(item);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setAddModalShow(true);
  };

  let AddModelClose = () => setAddModalShow(false);
  let EditModelClose = () => setEditModalShow(false);

  const handleAccept = async (item) => {
    console.log("Sending request with entry_no:", item.entry_no);

    try {
      const username = reduxUser?.user_name || userDetails.name;
      const payload = {
        id: item.entry_no,
        status: "LAB-OPEN",
        username: username, // Add username for notification creation
      };

      const response = await fetch(
        `${BASE_URL}/update-issue-items/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Remove the item from Redux state after successful update
        // The next polling cycle will refresh the data automatically
        const updatedData = note.filter((n) => n.entry_no !== item.entry_no);
        dispatch(setManagerPendingIssues(updatedData));
        toast.success("Item has been accepted.");
      } else {
        console.error("Failed to accept item:", result.error);
        toast.error("Failed to accept item.");
      }
    } catch (error) {
      console.error("Error accepting item:", error);
    }
  };

  const handleDecline = async (item) => {
    console.log("Sending request with entry_no:", item.entry_no);

    try {
      const username = reduxUser?.user_name || userDetails.name;
      const payload = {
        id: item.entry_no,
        status: "MGR-DCL",
        username: username, // Add username for notification creation
      };

      const response = await fetch(
        `${BASE_URL}/update-issue-items/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Remove the item from Redux state after successful update
        // The next polling cycle will refresh the data automatically
        const updatedData = note.filter((n) => n.entry_no !== item.entry_no);
        dispatch(setManagerPendingIssues(updatedData));
        toast.success("Item has been Declined.");
      } else {
        console.error("Failed to decline item:", result.error);
        toast.error("Failed to decline item.");
      }
    } catch (error) {
      console.error("Error accepting item:", error);
    }
  };

  return (
    <PageLayout>
      <PageHeader title="Request notification" />
      <PageBody>
      <ContentCard flush>
        <div className="lims-notification-scroll">
          <table className="lims-notification-table lims-table">
            <thead>
              <tr>
                <th style={{ minWidth: "120px" }}>Master Type</th>
                <th style={{ minWidth: "120px" }}>Item Code</th>
                <th style={{ minWidth: "150px" }}>Item Name</th>
                <th style={{ minWidth: "100px" }}>Quantity</th>
                <th style={{ minWidth: "120px" }}>Project Code</th>
                <th style={{ minWidth: "150px" }}>Project Name</th>
                <th style={{ minWidth: "120px" }}>Request Date</th>
                <th style={{ minWidth: "130px" }}>Requested By</th>
                <th style={{ minWidth: "130px" }}>Send To</th>
                <th colSpan="2" style={{ minWidth: "150px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {note.length === 0 ? (
                <tr>
                  <td colSpan={10} className="lims-notification-empty">
                    No pending issue requests. Data is automatically updated via centralized polling.
                  </td>
                </tr>
              ) : (
                note.map((no) => (
                  <tr key={no.id}>
                    <td>{no.master_type || ""}</td>
                    <td>{no.item_code || ""}</td>
                    <td>{no.item_name || ""}</td>
                    <td>{no.quantity_issued || "-"}</td>
                    <td>{no.project_code || ""}</td>
                    <td>{no.project_name || ""}</td>
                    <td>{no.issue_date || ""}</td>
                    <td>{no.issued_to || "Researcher"}</td>
                    <td>{no.lab_assistant_name || ""}</td>
                    <td>
                      <div className="lims-notification-actions">
                        <button
                          type="button"
                          onClick={() => handleAccept(no)}
                          className="lims-btn-accept"
                        >
                          <FaCheck size={14} /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecline(no)}
                          className="lims-btn-decline"
                        >
                          <FaTimes size={14} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default Notification;