import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BASE_URL } from "../../services/AppinfoService";
import { setManagerPendingReturns } from "../../store/slices/notificationSlice";
import { PageLayout, PageHeader, PageBody } from "../layout/content";
import "./ReturnNotification.css";

const columns = [
  { key: "item_code", label: "Item Code", colClass: "mn-rtn-col--code" },
  { key: "item_name", label: "Item Name", colClass: "mn-rtn-col--name" },
  { key: "quantity_returned", label: "Quantity Returned", colClass: "mn-rtn-col--qty" },
  { key: "project_name", label: "Project Name", colClass: "mn-rtn-col--project" },
  { key: "location", label: "Location", colClass: "mn-rtn-col--location" },
  { key: "receipt_date", label: "Receipt Date", colClass: "mn-rtn-col--receipt-date" },
  { key: "return_date", label: "Return Date", colClass: "mn-rtn-col--return-date" },
  { key: "remarks", label: "Remarks", colClass: "mn-rtn-col--remarks" },
];

const ReturnDataTableNotification = ({
  managerId,
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.notifications.manager.pendingReturns || []);

  const reduxUser = useSelector((state) => state.user.user);

  const [filters, setFilters] = useState({});

  const handleStatusUpdate = async (entryNo, status) => {
    try {
      if (!reduxUser || !reduxUser.user_name) {
        toast.error("User information not available. Please refresh the page.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/item_return/approve/${entryNo}/`,
        {
          status,
          username: reduxUser.user_name,
        }
      );

      console.log(response.data);
      toast.success(`Item return ${status} successfully!`);

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

  return (
    <PageLayout>
      <PageHeader title="Return notification" />
      <PageBody>
        <div className="return-notification-page">
          <section className="project-panel" aria-label="Pending return requests">
            <div className="project-table-section">
              <div className="project-table-shell">
                <table className="project-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className={`mn-rtn-col ${column.colClass}`}
                        >
                          {column.label}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="mn-rtn-col mn-rtn-col--actions project-th-actions"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr className="project-table-row project-table-row--empty">
                        <td colSpan={columns.length + 1}>
                          <div className="project-empty">
                            <p>
                              No pending return requests. Data is automatically updated via centralized polling.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.map((inven) => (
                        <tr
                          key={inven.entry_no || inven.id}
                          className="project-table-row"
                        >
                          <td className="mn-rtn-col mn-rtn-col--code">{inven.item_code}</td>
                          <td className="mn-rtn-col mn-rtn-col--name">{inven.item_name}</td>
                          <td className="mn-rtn-col mn-rtn-col--qty">{inven.quantity_returned}</td>
                          <td className="mn-rtn-col mn-rtn-col--project">{inven.project_name}</td>
                          <td className="mn-rtn-col mn-rtn-col--location">{inven.location}</td>
                          <td className="mn-rtn-col mn-rtn-col--receipt-date">{inven.receipt_date}</td>
                          <td className="mn-rtn-col mn-rtn-col--return-date">{inven.return_date}</td>
                          <td className="mn-rtn-col mn-rtn-col--remarks">{inven.remarks}</td>
                          <td className="mn-rtn-col mn-rtn-col--actions project-td-actions">
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
            </div>
          </section>
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default ReturnDataTableNotification;
