import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BASE_URL } from "../../services/AppinfoService";
import { setManagerPendingReturns } from "../../store/slices/notificationSlice";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";

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
      toast.error("No data to download!");
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
    <PageLayout>
      <PageHeader title="Return notification" />
      <PageBody>
      <ContentCard flush>
        <div className="lims-notification-scroll">
          <table className="lims-notification-table lims-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={{ minWidth: "120px" }}>
                    {column.label}
                  </th>
                ))}
                <th style={{ minWidth: "150px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="lims-notification-empty">
                    No pending return requests. Data is automatically updated via centralized polling.
                  </td>
                </tr>
              ) : (
                data.map((inven) => (
                  <tr key={inven.entry_no || inven.id}>
                    <td>{inven.item_code}</td>
                    <td>{inven.item_name}</td>
                    <td>{inven.quantity_returned}</td>
                    <td>{inven.project_name}</td>
                    <td>{inven.location}</td>
                    <td>{inven.receipt_date}</td>
                    <td>{inven.return_date}</td>
                    <td>{inven.remarks}</td>
                    <td>
                      <div className="lims-notification-actions">
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(inven.entry_no, "Accepted")}
                          className="lims-btn-accept"
                        >
                          <FaCheck size={14} /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(inven.entry_no, "Declined")}
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

export default ReturnDataTableNotification;
