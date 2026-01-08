import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import AdminApprovalModal from "./AdminApproval";
import ManagerNavigation from "../manager/ManagerNavigation";
import { BASE_URL } from "../../services/AppinfoService";
import { setManagerPendingIssues } from "../../store/slices/notificationSlice";

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
    <div style={{ width: "100%" }}>
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "20px",
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#1e293b",
          }}
        >
          REQUEST NOTIFICATION
        </h2>
      </div>

      <div style={{ padding: "20px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              overflowX: "auto",
              maxHeight: "480px",
              overflowY: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: "1200px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "120px",
                    }}
                  >
                    Master Type
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "120px",
                    }}
                  >
                    Item Code
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "150px",
                    }}
                  >
                    Item Name
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "120px",
                    }}
                  >
                    Project Code
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "150px",
                    }}
                  >
                    Project Name
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "120px",
                    }}
                  >
                    Request Date
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "130px",
                    }}
                  >
                    Requested By
                  </th>
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "130px",
                    }}
                  >
                    Send To
                  </th>
                  <th
                    colSpan="2"
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 12px",
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      minWidth: "150px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {note.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      No pending issue requests. Data is automatically updated via centralized polling.
                    </td>
                  </tr>
                ) : (
                  note.map((no, index) => (
                  <tr
                    key={no.id}
                    style={{
                      transition: "background-color 0.15s",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#ffffff" : "#f8fafc";
                    }}
                  >
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.master_type || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.item_code || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.item_name || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.project_code || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.project_name || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.issue_date || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.issued_to || "Researcher"}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        fontSize: "0.875rem",
                        color: "#475569",
                      }}
                    >
                      {no.lab_assistant_name || ""}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => handleAccept(no)}
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#059669";
                            e.target.style.boxShadow =
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#10b981";
                            e.target.style.boxShadow =
                              "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                          }}
                        >
                          <FaCheck size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(no)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#dc2626";
                            e.target.style.boxShadow =
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#ef4444";
                            e.target.style.boxShadow =
                              "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                          }}
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
        </div>
      </div>
    </div>
  );
};

export default Notification;