import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import AdminApprovalModal from "./AdminApproval";
import { BASE_URL } from "../../services/AppinfoService";
import { setManagerPendingIssues } from "../../store/slices/notificationSlice";
import { PageLayout, PageHeader, PageBody } from "../layout/content";
import "./Notification.css";

const TABLE_HEADINGS = [
  { label: "Master Type", colClass: "mn-iss-col--master-type" },
  { label: "Item Code", colClass: "mn-iss-col--code" },
  { label: "Item Name", colClass: "mn-iss-col--name" },
  { label: "Quantity", colClass: "mn-iss-col--qty" },
  { label: "Project Code", colClass: "mn-iss-col--project-code" },
  { label: "Project Name", colClass: "mn-iss-col--project-name" },
  { label: "Request Date", colClass: "mn-iss-col--date" },
  { label: "Requested By", colClass: "mn-iss-col--requested-by" },
  { label: "Send To", colClass: "mn-iss-col--send-to" },
  { label: "Action", colClass: "mn-iss-col--actions", colSpan: 2 },
];

const Notification = ({
  no,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);

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
        username: username,
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
        username: username,
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
        <div className="issue-notification-page">
          <section className="project-panel" aria-label="Pending issue requests">
            <div className="project-table-section">
              <div className="project-table-shell">
                <table className="project-table">
                  <thead>
                    <tr>
                      {TABLE_HEADINGS.map(({ label, colClass, colSpan }) => (
                        <th
                          key={colClass}
                          scope="col"
                          colSpan={colSpan}
                          className={`mn-iss-col ${colClass}${
                            colClass === "mn-iss-col--actions"
                              ? " project-th-actions"
                              : ""
                          }`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {note.length === 0 ? (
                      <tr className="project-table-row project-table-row--empty">
                        <td colSpan={10}>
                          <div className="project-empty">
                            <p>
                              No pending issue requests. Data is automatically updated via centralized polling.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      note.map((no) => (
                        <tr key={no.id} className="project-table-row">
                          <td className="mn-iss-col mn-iss-col--master-type">
                            {no.master_type || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--code">
                            {no.item_code || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--name">
                            {no.item_name || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--qty">
                            {no.quantity_issued || "-"}
                          </td>
                          <td className="mn-iss-col mn-iss-col--project-code">
                            {no.project_code || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--project-name">
                            {no.project_name || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--date">
                            {no.issue_date || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--requested-by">
                            {no.issued_to || "Researcher"}
                          </td>
                          <td className="mn-iss-col mn-iss-col--send-to">
                            {no.lab_assistant_name || ""}
                          </td>
                          <td className="mn-iss-col mn-iss-col--actions project-td-actions">
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
            </div>
          </section>
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Notification;
