import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Button } from "react-bootstrap";
import { AiOutlineDownload } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BASE_URL } from "../../services/AppinfoService";
import { setManagerPendingReturns } from "../../store/slices/notificationSlice";

const ReturnDataTableNotification = ({
  managerId,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const dispatch = useDispatch();
  
  // NOTE: Data is now provided by centralized polling via Redux
  // The useNotificationPolling hook in ManagerNavigation fetches and dispatches data
  const data = useSelector((state) => state.notifications.manager.pendingReturns || []);
  
  // Get user from Redux store to send username in request
  const reduxUser = useSelector((state) => state.user.user);

  const [filters, setFilters] = useState({});

  const handleStatusUpdate = async (entryNo, status) => {
    try {
      // Guard: Ensure username is available from Redux
      if (!reduxUser || !reduxUser.user_name) {
        toast.error("User information not available. Please refresh the page.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/item_return/approve/${entryNo}/`,
        { 
          status,
          username: reduxUser.user_name  // Send username from Redux
        }
      );

      console.log(response.data);
      toast.success(`Item return ${status} successfully!`);

      // Remove the item from Redux state after successful update
      // The next polling cycle will refresh the data automatically
      const updatedData = data.filter((item) => item.entry_no !== entryNo);
      dispatch(setManagerPendingReturns(updatedData));
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update item return status.");
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const filteredData = data
    .filter((item) =>
      Object.keys(filters).every((key) => {
        const cellValue = String(item[key] || "").toLowerCase();
        const filterValue = String(filters[key] || "").toLowerCase();
        return filterValue ? cellValue.includes(filterValue) : true;
      })
    )
    .sort((a, b) => a.entry_no - b.entry_no);

  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Item Name": item.item_name,
        "Item Code": item.item_code,
        "Quantity Received": item.quantity_issued,
        "Issued To": item.researcher_name,
        "Issued Date": item.issue_date,
        "Expiry Date": item.expiry_date,
        "Master Type": item.master_type,
        Manufacturer: item.manufacturer,
        Supplier: item.supplier,
        "Project Name": item.project_name,
        "Project Code": item.project_code,
        Remarks: item.remarks,
      }))
    );

    worksheet["!protect"] = {
      password: "readonly",
      edit: false,
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issue Data");
    XLSX.writeFile(workbook, "IssueData.xlsx");
  };

  const columns = [
    { key: "item_code", label: "Item Code" },
    { key: "item_name", label: "Item Name" },
    { key: "quantity_returned", label: "Quantity Returned" },
    { key: "project_name", label: "Project Name" },
    { key: "location", label: "Location" },
    { key: "receipt_date", label: "Receipt Date" },
    { key: "return_date", label: "Return Date" },
    { key: "remarks", label: "Remarks" },
  ];

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
          RETURN NOTIFICATION
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
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "12px",
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
                      {column.label}
                    </th>
                  ))}
                  <th
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "12px",
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
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      No pending return requests. Data is automatically updated via centralized polling.
                    </td>
                  </tr>
                ) : (
                  data.map((inven, index) => (
                  <tr
                    key={inven.entry_no || inven.id || index}
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
                      {inven.item_code}
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
                      {inven.item_name}
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
                      {inven.quantity_returned}
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
                      {inven.project_name}
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
                      {inven.location}
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
                      {inven.receipt_date}
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
                      {inven.return_date}
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
                      {inven.remarks}
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
                          onClick={() =>
                            handleStatusUpdate(inven.entry_no, "Accepted")
                          }
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
                          onClick={() =>
                            handleStatusUpdate(inven.entry_no, "Declined")
                          }
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

export default ReturnDataTableNotification;